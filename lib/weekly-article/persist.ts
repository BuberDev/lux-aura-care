import { createHash } from "node:crypto";
import { del, put } from "@vercel/blob";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/site";
import {
  checkAndRenderArticleWithFigures,
  validateCover,
  validateInlineImage,
} from "@/lib/weekly-article/content";
import type {
  FailurePayload,
  PublishPayload,
} from "@/lib/weekly-article/schema";

const HISTORY_LIMIT = 80;
const USED_SOURCES_WEEKS = 26;
const SUCCESS_STATUSES = ["published", "drafted"];

export interface StaticPostRef {
  title: string;
  slug: string;
  date: string;
}

export interface WeeklyContext {
  weekKey: string;
  done: {
    status: "published" | "drafted";
    articleId: string | null;
    url: string | null;
  } | null;
  recent: {
    title: string;
    slug: string;
    source: "db" | "static";
    date: string;
  }[];
  usedSourceUrls: string[];
}

export type PublishOutcome =
  | {
      status: "published" | "drafted";
      articleId: string;
      slug: string;
      url: string;
    }
  | { status: "already_done"; articleId: string | null; url: string | null }
  | {
      status: "dry_run_ok";
      wouldBe: "published" | "drafted";
      slug: string;
      wordCount: number;
    }
  | { status: "rejected"; reasons: string[] };

const articleUrl = (slug: string) => new URL(`/blog/${slug}`, SITE_URL).toString();

function jsonStringArray(value: Prisma.JsonValue): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function generateSlug(title: string, maxLength = 80) {
  const slug = title
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug.length <= maxLength) return slug;
  const cut = slug.slice(0, maxLength);
  return cut.slice(0, cut.lastIndexOf("-") > 0 ? cut.lastIndexOf("-") : maxLength);
}

function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
}

function articleCategory(topic: string, tags: string[]) {
  const text = `${topic} ${tags.join(" ")}`.toLowerCase();
  if (/body|brush|exfoliat|shower|dry brushing/.test(text)) return "body-glow";
  if (/spa|sleep|stress|wellbeing|self-care|relax/.test(text)) return "spa-relax";
  if (/habit|routine|wellness/.test(text)) return "self-care";
  return "skincare";
}

async function uniqueSlug(title: string, staticSlugs: ReadonlySet<string>) {
  const base = generateSlug(title);
  if (!base) throw new Error("Title produced an empty slug");
  let candidate = base;
  let suffix = 1;
  while (
    staticSlugs.has(candidate) ||
    (await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } }))
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

export async function getWeeklyContext(
  weekKey: string,
  staticPosts: StaticPostRef[],
): Promise<WeeklyContext> {
  const [doneRow, generatedArticles, recentRuns] = await Promise.all([
    prisma.contentRun.findFirst({
      where: { weekKey, status: { in: SUCCESS_STATUSES } },
      include: { article: { select: { slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.article.findMany({
      where: { status: { in: ["published", "draft"] } },
      select: { title: true, slug: true, publishedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    }),
    prisma.contentRun.findMany({
      where: {
        status: { in: SUCCESS_STATUSES },
        createdAt: {
          gt: new Date(Date.now() - USED_SOURCES_WEEKS * 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { sourceUrls: true },
    }),
  ]);

  const recent = [
    ...generatedArticles.map((article) => ({
      title: article.title,
      slug: article.slug,
      source: "db" as const,
      date: (article.publishedAt ?? article.createdAt).toISOString().slice(0, 10),
    })),
    ...staticPosts.map((article) => ({
      title: article.title,
      slug: article.slug,
      source: "static" as const,
      date: article.date.slice(0, 10),
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, HISTORY_LIMIT);

  return {
    weekKey,
    done: doneRow
      ? {
          status: doneRow.status === "published" ? "published" : "drafted",
          articleId: doneRow.articleId,
          url: doneRow.article ? articleUrl(doneRow.article.slug) : null,
        }
      : null,
    recent,
    usedSourceUrls: [
      ...new Set(recentRuns.flatMap((run) => jsonStringArray(run.sourceUrls))),
    ],
  };
}

export async function publishWeeklyArticle(
  payload: PublishPayload,
  options: { dryRun: boolean; staticSlugs: ReadonlySet<string> },
): Promise<PublishOutcome> {
  const isPublish = payload.mode === "publish";
  if (isPublish && !payload.cover)
    return { status: "rejected", reasons: ["missing_generated_cover"] };
  if (isPublish && payload.inlineImages.length < 2)
    return { status: "rejected", reasons: ["missing_inline_images"] };
  if (isPublish && !payload.article.visualPlan)
    return { status: "rejected", reasons: ["missing_visual_plan"] };

  const polish = payload.article.localizations.pl;

  const existing = await prisma.contentRun.findFirst({
    where: { weekKey: payload.weekKey, status: { in: SUCCESS_STATUSES } },
    include: { article: { select: { slug: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (existing && !payload.force) {
    return {
      status: "already_done",
      articleId: existing.articleId,
      url: existing.article ? articleUrl(existing.article.slug) : null,
    };
  }

  const coverBuffer = payload.cover
    ? Buffer.from(payload.cover.base64, "base64")
    : null;
  const coverProblem = coverBuffer ? validateCover(coverBuffer) : null;
  if (coverProblem) return { status: "rejected", reasons: [coverProblem] };

  const plannedInline =
    payload.article.visualPlan?.assets.filter((asset) => asset.role === "inline") ?? [];
  const plannedCovers =
    payload.article.visualPlan?.assets.filter((asset) => asset.role === "cover") ?? [];
  if (isPublish && plannedCovers.length !== 1)
    return { status: "rejected", reasons: ["invalid_visual_plan_cover_count"] };
  if (isPublish && plannedInline.length !== payload.inlineImages.length)
    return { status: "rejected", reasons: ["generated_visual_set_incomplete"] };

  const imageProblems: string[] = [];
  const hashes = new Set<string>();
  if (coverBuffer) hashes.add(createHash("sha256").update(coverBuffer).digest("hex"));
  for (const image of payload.inlineImages) {
    const buffer = Buffer.from(image.base64, "base64");
    const problem = validateInlineImage(buffer);
    if (problem) imageProblems.push(`${problem}:${image.id}`);
    const hash = createHash("sha256").update(buffer).digest("hex");
    if (hash !== image.sha256) imageProblems.push(`inline_image_hash_invalid:${image.id}`);
    if (hashes.has(hash)) imageProblems.push(`inline_image_duplicate:${image.id}`);
    hashes.add(hash);
    const planned = plannedInline.find((asset) => asset.id === image.id);
    if (!planned) imageProblems.push(`inline_image_not_in_visual_plan:${image.id}`);
    else if (planned.placementAfterHeading !== image.placementAfterHeading)
      imageProblems.push(`inline_image_placement_mismatch:${image.id}`);
  }
  if (imageProblems.length > 0)
    return { status: "rejected", reasons: imageProblems };

  const slug =
    existing?.article?.status === "draft" && existing.article.slug
      ? existing.article.slug
      : await uniqueSlug(payload.article.title, options.staticSlugs);
  const placeholderFigures = payload.inlineImages.map((image) => ({
    id: image.id,
    placementAfterHeading: image.placementAfterHeading,
    url: `/article-media/${slug}-${image.id}.jpg`,
    altText: image.altText,
    caption: image.caption,
    width: image.width,
    height: image.height,
  }));
  const checked = checkAndRenderArticleWithFigures(
    payload.article.contentMarkdown,
    placeholderFigures,
  );
  if (!checked.ok) return { status: "rejected", reasons: checked.reasons };
  const placeholderPolishFigures = payload.inlineImages.map((image) => {
    const localized = polish.visualAssets.find((asset) => asset.id === image.id);
    return {
      id: image.id,
      placementAfterHeading: localized?.placementAfterHeading ?? "",
      url: `/article-media/${slug}-${image.id}.jpg`,
      altText: localized?.altText ?? "",
      caption: localized?.caption ?? "",
      width: image.width,
      height: image.height,
    };
  });
  if (placeholderPolishFigures.some((figure) => !figure.placementAfterHeading)) {
    return { status: "rejected", reasons: ["polish_visual_placement_missing"] };
  }
  const checkedPolish = checkAndRenderArticleWithFigures(
    polish.contentMarkdown,
    placeholderPolishFigures,
  );
  if (!checkedPolish.ok) {
    return {
      status: "rejected",
      reasons: checkedPolish.reasons.map((reason) => `pl:${reason}`),
    };
  }

  const status = isPublish ? ("published" as const) : ("drafted" as const);
  if (options.dryRun) {
    return { status: "dry_run_ok", wouldBe: status, slug, wordCount: checked.wordCount };
  }

  const uploadedUrls: string[] = [];
  const articleBlobToken = process.env.ARTICLE_BLOB_READ_WRITE_TOKEN?.trim();
  if (!articleBlobToken) {
    throw new Error("ARTICLE_BLOB_READ_WRITE_TOKEN is not configured");
  }
  try {
    const coverUrl = coverBuffer
      ? (
          await put(`journal/${slug}/cover.jpg`, coverBuffer, {
            access: "public",
            contentType: "image/jpeg",
            addRandomSuffix: true,
            token: articleBlobToken,
          })
        ).url
      : "/brand/lux_aura_care_logo.png";
    if (coverBuffer) uploadedUrls.push(coverUrl);

    const figures = [];
    const polishFigures = [];
    for (const image of payload.inlineImages) {
      const blob = await put(
        `journal/${slug}/${image.id}.jpg`,
        Buffer.from(image.base64, "base64"),
        {
          access: "public",
          contentType: "image/jpeg",
          addRandomSuffix: true,
          token: articleBlobToken,
        },
      );
      uploadedUrls.push(blob.url);
      figures.push({
        id: image.id,
        placementAfterHeading: image.placementAfterHeading,
        url: blob.url,
        altText: image.altText,
        caption: image.caption,
        width: image.width,
        height: image.height,
      });
      const localized = polish.visualAssets.find((asset) => asset.id === image.id);
      if (!localized?.placementAfterHeading) {
        await del(uploadedUrls, { token: articleBlobToken });
        return { status: "rejected", reasons: [`polish_visual_missing:${image.id}`] };
      }
      polishFigures.push({
        id: image.id,
        placementAfterHeading: localized.placementAfterHeading,
        url: blob.url,
        altText: localized.altText,
        caption: localized.caption,
        width: image.width,
        height: image.height,
      });
    }

    const rendered = checkAndRenderArticleWithFigures(
      payload.article.contentMarkdown,
      figures,
    );
    if (!rendered.ok) {
      await del(uploadedUrls, { token: articleBlobToken });
      return { status: "rejected", reasons: rendered.reasons };
    }
    const renderedPolish = checkAndRenderArticleWithFigures(
      polish.contentMarkdown,
      polishFigures,
    );
    if (!renderedPolish.ok) {
      await del(uploadedUrls, { token: articleBlobToken });
      return {
        status: "rejected",
        reasons: renderedPolish.reasons.map((reason) => `pl:${reason}`),
      };
    }

    const article = await prisma.$transaction(
      async (tx) => {
        if (existing) {
          await tx.contentRun.update({
            where: { id: existing.id },
            data: { status: "superseded", successKey: null },
          });
        }

        const data = {
          title: payload.article.title,
          titlePl: polish.title,
          slug,
          excerpt: payload.article.excerpt,
          excerptPl: polish.excerpt,
          content: rendered.html,
          contentPl: renderedPolish.html,
          featuredImage: coverUrl,
          imageAlt: payload.article.imageAlt,
          imageAltPl: polish.imageAlt,
          status: isPublish ? "published" : "draft",
          category: articleCategory(payload.article.topic, payload.article.tags),
          tags: payload.article.tags,
          tagsPl: polish.tags,
          seoTitle: payload.article.seoTitle,
          seoTitlePl: polish.seoTitle,
          seoDescription: payload.article.seoDescription,
          seoDescriptionPl: polish.seoDescription,
          seoKeywords: payload.article.keywords,
          seoKeywordsPl: polish.keywords,
          readingTime: readingTime(rendered.html),
          readingTimePl: readingTime(renderedPolish.html),
          visualPlan: payload.article.visualPlan as Prisma.InputJsonValue,
          publishedAt: isPublish ? new Date() : null,
        };

        const saved =
          existing?.article?.status === "draft" && existing.articleId
            ? await tx.article.update({ where: { id: existing.articleId }, data })
            : await tx.article.create({ data });

        await tx.contentRun.create({
          data: {
            weekKey: payload.weekKey,
            successKey: payload.weekKey,
            status,
            mode: payload.mode,
            topic: payload.article.topic,
            format: payload.article.format,
            sourceUrls: payload.run.sourceUrls,
            articleId: saved.id,
            metrics: payload.run.metrics as Prisma.InputJsonValue,
            runUrl: payload.run.runUrl ?? null,
          },
        });
        return saved;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return { status, articleId: article.id, slug: article.slug, url: articleUrl(article.slug) };
  } catch (error) {
    if (uploadedUrls.length > 0)
      await del(uploadedUrls, { token: articleBlobToken }).catch(() => undefined);
    throw error;
  }
}

export async function recordFailure(payload: FailurePayload, dryRun: boolean) {
  if (dryRun) return;
  await prisma.contentRun.create({
    data: {
      weekKey: payload.weekKey,
      status: "failed",
      mode: payload.mode,
      errorStage: payload.stage,
      errorMessage: payload.message,
      runUrl: payload.runUrl ?? null,
      metrics: payload.metrics as Prisma.InputJsonValue,
    },
  });
}
