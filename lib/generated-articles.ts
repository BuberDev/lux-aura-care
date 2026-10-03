import { cache } from "react";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/i18n/config";
import type { Article, CategoryId } from "@/lib/site-data";

export type GeneratedArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string;
  heroAlt: string;
  categoryId: CategoryId;
  readTime: string;
  publishedAt: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};

const categoryIds = new Set<CategoryId>([
  "self-care",
  "skincare",
  "body-glow",
  "spa-relax",
]);

function normalizeCategory(value: string): CategoryId {
  return categoryIds.has(value as CategoryId) ? (value as CategoryId) : "skincare";
}

function fromRow(row: {
  id: string;
  slug: string;
  title: string;
  titlePl: string | null;
  excerpt: string;
  excerptPl: string | null;
  content: string;
  contentPl: string | null;
  featuredImage: string;
  imageAlt: string;
  imageAltPl: string | null;
  category: string;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  tags: string[];
  tagsPl: string[];
  seoTitle: string;
  seoTitlePl: string | null;
  seoDescription: string;
  seoDescriptionPl: string | null;
  seoKeywords: string[];
  seoKeywordsPl: string[];
  readingTimePl: number | null;
}, locale: Locale): GeneratedArticle {
  const isPolish = locale === "pl";
  return {
    id: row.id,
    slug: row.slug,
    title: isPolish ? row.titlePl! : row.title,
    excerpt: isPolish ? row.excerptPl! : row.excerpt,
    content: isPolish ? row.contentPl! : row.content,
    heroImage: row.featuredImage,
    heroAlt: isPolish ? row.imageAltPl! : row.imageAlt,
    categoryId: normalizeCategory(row.category),
    readTime: isPolish
      ? `${row.readingTimePl ?? row.readingTime} min czytania`
      : `${row.readingTime} min read`,
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    tags: isPolish ? row.tagsPl : row.tags,
    seoTitle: isPolish ? row.seoTitlePl! : row.seoTitle,
    seoDescription: isPolish ? row.seoDescriptionPl! : row.seoDescription,
    seoKeywords: isPolish ? row.seoKeywordsPl : row.seoKeywords,
  };
}

const completePolishTranslation = {
  titlePl: { not: null },
  excerptPl: { not: null },
  contentPl: { not: null },
  imageAltPl: { not: null },
  seoTitlePl: { not: null },
  seoDescriptionPl: { not: null },
};

export const getPublishedGeneratedArticles = cache(async (locale: Locale) => {
  const rows = await prisma.article.findMany({
    where: {
      status: "published",
      ...(locale === "pl" ? completePolishTranslation : {}),
    },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((row) => fromRow(row, locale));
});

export const getGeneratedArticleBySlug = cache(async (slug: string, locale: Locale) => {
  const row = await prisma.article.findFirst({
    where: {
      slug,
      status: "published",
      ...(locale === "pl" ? completePolishTranslation : {}),
    },
  });
  return row ? fromRow(row, locale) : null;
});

export function generatedArticleCard(article: GeneratedArticle): Article {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    intro: article.excerpt,
    heroImage: article.heroImage,
    heroAlt: article.heroAlt,
    categoryId: article.categoryId,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    pinHook: "Evidence-led skincare, beauty and self-care guidance.",
    sections: [],
  };
}
