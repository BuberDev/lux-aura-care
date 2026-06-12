import type { MetadataRoute } from "next";

import { articles, products } from "@/lib/site-data";
import { shopProducts } from "@/lib/shop-data";
import { SITE_URL } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n/config";
import { localizePathname } from "@/lib/i18n/path";

export default function sitemap(): MetadataRoute.Sitemap {
  const routeDefinitions: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
    lastModified?: Date;
  }> = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/favorites", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/shop", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    ...articles.map((article) => ({
      path: `/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      lastModified: new Date(article.publishedAt),
    })),
    ...products.map((product) => ({
      path: `/favorites/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.72,
    })),
    ...shopProducts.map((product) => ({
      path: `/shop/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return routeDefinitions.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteLocalizedUrl(route.path, locale),
      lastModified: route.lastModified ?? new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [
            alternateLocale,
            absoluteLocalizedUrl(route.path, alternateLocale),
          ])
        ),
      },
    }))
  );
}

function absoluteLocalizedUrl(pathname: string, locale: Locale) {
  return new URL(localizePathname(pathname, locale), SITE_URL).toString();
}
