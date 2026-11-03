import type { MetadataRoute } from "next";

import { articles } from "@/lib/site-data";
import { shopProducts } from "@/lib/shop-data";
import { SITE_URL } from "@/lib/site";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { localizePathname } from "@/lib/i18n/path";
import { getPublishedGeneratedArticles } from "@/lib/generated-articles";

// Generated articles are written after deployment, so the sitemap must query
// the database at request time instead of freezing the build-time article set.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedArticles = await getPublishedGeneratedArticles("en");
  const routeDefinitions: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
    lastModified?: Date;
  }> = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/shop", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/returns", changeFrequency: "monthly" as const, priority: 0.3 },
    ...articles.map((article) => ({
      path: `/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      lastModified: new Date(article.publishedAt),
    })),
    ...generatedArticles.map((article) => ({
      path: `/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: new Date(article.publishedAt),
    })),
    ...shopProducts.map((product) => ({
      path: `/shop/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const routeEntries: MetadataRoute.Sitemap = routeDefinitions.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteLocalizedUrl(route.path, locale),
      lastModified: route.lastModified ?? new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((alternateLocale) => [
            alternateLocale,
            absoluteLocalizedUrl(route.path, alternateLocale),
          ]),
          ["x-default", absoluteLocalizedUrl(route.path, defaultLocale)],
        ]),
      },
    }))
  );

  return routeEntries;
}

function absoluteLocalizedUrl(pathname: string, locale: Locale) {
  return new URL(localizePathname(pathname, locale), SITE_URL).toString();
}
