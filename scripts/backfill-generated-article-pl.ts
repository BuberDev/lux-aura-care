import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { prisma } from "@/lib/db/prisma";
import { checkAndRenderArticleWithFigures } from "@/lib/weekly-article/content";

type Localization = {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  tags: string[];
  contentMarkdown: string;
  imageAlt: string;
  visualAssets: Array<{
    id: string;
    placementAfterHeading: string | null;
    caption: string;
    altText: string;
  }>;
};

type VisualPlan = {
  assets: Array<{ id: string; role: "cover" | "inline" }>;
};

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`${name}="([^"]+)"`))?.[1];
}

function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
}

async function main() {
  const [slug, localizationPath] = process.argv.slice(2);
  if (!slug || !localizationPath) {
    throw new Error("Usage: tsx scripts/backfill-generated-article-pl.ts <slug> <localization.json>");
  }

  const localization = JSON.parse(
    await readFile(resolve(localizationPath), "utf8"),
  ) as Localization;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) throw new Error(`Article not found: ${slug}`);

  const plan = article.visualPlan as VisualPlan | null;
  if (!plan) throw new Error("Article has no visual plan");
  const imageTags = [...article.content.matchAll(/<figure[\s\S]*?<img\s+([^>]+)>[\s\S]*?<\/figure>/g)]
    .map((match) => match[1]);

  const figures = plan.assets
    .filter((asset) => asset.role === "inline")
    .map((asset) => {
      const localized = localization.visualAssets.find((item) => item.id === asset.id);
      const imageTag = imageTags.find((tag) => attribute(tag, "src")?.includes(asset.id));
      if (!localized?.placementAfterHeading || !imageTag) {
        throw new Error(`Missing Polish placement or published image for ${asset.id}`);
      }
      return {
        id: asset.id,
        placementAfterHeading: localized.placementAfterHeading,
        url: attribute(imageTag, "src")!,
        altText: localized.altText,
        caption: localized.caption,
        width: Number(attribute(imageTag, "width")),
        height: Number(attribute(imageTag, "height")),
      };
    });

  const rendered = checkAndRenderArticleWithFigures(localization.contentMarkdown, figures);
  if (!rendered.ok) throw new Error(`Polish article rejected: ${rendered.reasons.join(", ")}`);

  await prisma.article.update({
    where: { slug },
    data: {
      titlePl: localization.title,
      excerptPl: localization.excerpt,
      contentPl: rendered.html,
      imageAltPl: localization.imageAlt,
      tagsPl: localization.tags,
      seoTitlePl: localization.seoTitle,
      seoDescriptionPl: localization.seoDescription,
      seoKeywordsPl: localization.keywords,
      readingTimePl: readingTime(rendered.html),
    },
  });

  console.log(JSON.stringify({ slug, wordCount: rendered.wordCount, figures: figures.length }));
}

void main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
