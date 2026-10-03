import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { articles as staticArticles } from "@/lib/site-data";
import { isAuthorizedCron } from "@/lib/weekly-article/auth";
import {
  getWeeklyContext,
  publishWeeklyArticle,
  recordFailure,
  type StaticPostRef,
} from "@/lib/weekly-article/persist";
import {
  MAX_BODY_CHARS,
  WEEK_KEY_PATTERN,
  describeIssues,
  payloadSchema,
} from "@/lib/weekly-article/schema";

export const dynamic = "force-dynamic";

const staticRefs: StaticPostRef[] = staticArticles.map((article) => ({
  title: article.title,
  slug: article.slug,
  date: article.publishedAt,
}));

const json = (body: unknown, status: number) => NextResponse.json(body, { status });

export async function GET(request: Request) {
  if (!isAuthorizedCron(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return json({ error: "unauthorized" }, 401);
  }
  const weekKey = new URL(request.url).searchParams.get("weekKey") ?? "";
  if (!WEEK_KEY_PATTERN.test(weekKey)) {
    return json(
      {
        error: "validation",
        issues: [{ path: "weekKey", message: "weekKey must look like 2026-W39-WED" }],
      },
      400,
    );
  }
  try {
    return json(await getWeeklyContext(weekKey, staticRefs), 200);
  } catch (error) {
    console.error("weekly-article context failed:", error);
    return json({ error: "internal" }, 500);
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedCron(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return json({ error: "unauthorized" }, 401);
  }
  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(
      { error: "validation", issues: [{ path: "", message: "body is not valid JSON" }] },
      400,
    );
  }
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "validation", issues: describeIssues(parsed.error) }, 400);
  }

  try {
    if (parsed.data.kind === "failure") {
      await recordFailure(parsed.data, dryRun);
      return json({ status: "recorded", dryRun }, 200);
    }

    const outcome = await publishWeeklyArticle(parsed.data, {
      dryRun,
      staticSlugs: new Set(staticRefs.map((article) => article.slug)),
    });
    if (outcome.status === "rejected") {
      return json({ error: "content_rejected", reasons: outcome.reasons }, 422);
    }
    if (outcome.status === "published") {
      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");
      revalidatePath(`/blog/${outcome.slug}`);
    }
    return json(outcome, outcome.status === "published" || outcome.status === "drafted" ? 201 : 200);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return json({ error: "conflict" }, 409);
    }
    console.error("weekly-article publish failed:", error);
    return json({ error: "internal" }, 500);
  }
}
