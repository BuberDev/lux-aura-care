#!/usr/bin/env node
/**
 * Uploads a directory tree of media files to the project's public Vercel Blob store.
 *
 * Blob pathnames mirror the paths relative to the source directory, so a file
 * staged as "<sourceDir>/gua-sha-set/clip.mp4" becomes
 * "<MEDIA_BASE_URL>/gua-sha-set/clip.mp4" — the same relative path the app
 * builds with mediaUrl() (see lib/media-url.ts).
 *
 * Usage:
 *   node scripts/upload-media-to-blob.mjs <sourceDir>
 *
 * Reads BLOB_READ_WRITE_TOKEN from the environment, .env.local, or .env.
 */
import { put } from "@vercel/blob";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const CONCURRENCY = 8;
const MAX_RETRIES = 3;
const ONE_YEAR_SECONDS = 31536000;
const SKIP_FILES = new Set([".DS_Store"]);

function loadToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const file of [".env.local", ".env"]) {
    try {
      const match = readFileSync(file, "utf8").match(/^BLOB_READ_WRITE_TOKEN="?([^"\n]+)"?$/m);
      if (match) return match[1];
    } catch {
      // file missing — try the next one
    }
  }
  throw new Error("BLOB_READ_WRITE_TOKEN not found in env, .env.local or .env");
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return SKIP_FILES.has(entry.name) ? [] : [full];
  });
}

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/upload-media-to-blob.mjs <sourceDir>");
  process.exit(1);
}

const token = loadToken();
const files = walk(sourceDir);
const totalBytes = files.reduce((sum, f) => sum + statSync(f).size, 0);
console.log(`Uploading ${files.length} files (${(totalBytes / 1024 / 1024).toFixed(0)} MB) from ${sourceDir}`);

let uploaded = 0;
const failures = [];

async function uploadOne(file) {
  const pathname = relative(sourceDir, file);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await put(pathname, readFileSync(file), {
        access: "public",
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: ONE_YEAR_SECONDS,
      });
      uploaded++;
      console.log(`[${uploaded}/${files.length}] ${pathname}`);
      return;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        failures.push(pathname);
        console.error(`FAILED ${pathname}: ${error.message}`);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

const queue = [...files];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) await uploadOne(queue.shift());
  })
);

if (failures.length > 0) {
  console.error(`\n${failures.length} uploads failed:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`\nDone: ${uploaded}/${files.length} files uploaded.`);
