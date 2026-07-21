/**
 * Public base URL for heavy product media (images + UGC videos) served from
 * the "lux-aura-media" Vercel Blob store. Files are uploaded with
 * scripts/upload-media-to-blob.mjs and keep their old /public relative paths,
 * e.g. "/gua-sha-set/clip.mp4" → "<MEDIA_BASE_URL>/gua-sha-set/clip.mp4".
 *
 * Override with NEXT_PUBLIC_MEDIA_BASE_URL (set it to "" to serve from
 * /public again, e.g. for local work on new assets).
 */
const FALLBACK_MEDIA_BASE_URL =
  "https://0zj5m4eriyydro8n.public.blob.vercel-storage.com";

export const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? FALLBACK_MEDIA_BASE_URL;

export function mediaUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
