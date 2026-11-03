import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import {
  articles,
  categories,
  getCategoryById,
  isCategoryId,
  siteMeta,
} from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { T } from "@/components/translated-text";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  generatedArticleCard,
  getPublishedGeneratedArticles,
} from "@/lib/generated-articles";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Lux Aura Journal | Skincare & Product Guides");
  const description = translateText(
    locale,
    "Explore skincare, body-care, and self-care product guides designed for fast reading, clear comparison, and confident shopping."
  );

  return {
    title,
    description,
    alternates: getLocalizedAlternates("/blog", locale),
    openGraph: {
      title,
      description,
      url: localizePathname("/blog", locale),
      type: "website",
      siteName: "Lux Aura Care",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
    keywords:
      locale === "pl"
        ? ["poradniki produktowe", "self-care", "pielęgnacja", ...siteMeta.plKeywords]
        : ["product guides", "self-care journal", "skincare tools", ...siteMeta.keywords],
  };
}

type BlogPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

function getSelectedCategory(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = await getRequestLocale();
  const generatedArticles = (await getPublishedGeneratedArticles(locale)).map(generatedArticleCard);
  const filters = await searchParams;
  const selectedCategoryId = getSelectedCategory(filters.category);
  const selectedCategorySource =
    selectedCategoryId && isCategoryId(selectedCategoryId)
      ? getCategoryById(selectedCategoryId)
      : undefined;
  const selectedCategory = selectedCategorySource
    ? localizeContent(locale, selectedCategorySource)
    : undefined;

  const allArticles = [...generatedArticles, ...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const visibleArticles = localizeContent(
    locale,
    selectedCategorySource
      ? allArticles.filter((article) => article.categoryId === selectedCategorySource.id)
      : allArticles
  );
  const localizedCategories = localizeContent(locale, categories);

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Journal"), item: localizePathname("/blog", locale) },
    ...(selectedCategory
      ? [{ name: selectedCategory.name, item: localizePathname(`/blog?category=${selectedCategory.id}`, locale) }]
      : []),
  ]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: selectedCategory
      ? `${selectedCategory.name} ${translateText(locale, "Articles")}`
      : "Lux Aura Journal",
    url: toAbsoluteUrl(localizePathname(
      selectedCategory ? `/blog?category=${selectedCategory.id}` : "/blog",
      locale
    )),
    hasPart: visibleArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: toAbsoluteUrl(localizePathname(`/blog/${article.slug}`, locale)),
      datePublished: article.publishedAt,
      articleSection: article.categoryId,
      image: toAbsoluteUrl(article.heroImage),
    })),
    publisher: {
      "@type": "Organization",
      name: "Lux Aura Care",
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/brand/lux_aura_care_logo.png"),
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Lux Aura Care",
      url: toAbsoluteUrl(localizePathname("/", locale)),
    },
    about: selectedCategory
      ? {
          "@type": "Thing",
          name: selectedCategory.name,
          description: selectedCategory.description,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(blogJsonLd) }}
      />
      <Section className="border-b border-border-subtle pb-14 pt-16 md:pt-20">
        <Container>
          <Heading
            level="h1"
            eyebrow="Lux Aura Journal"
            title="Practical product guides for thoughtful choices"
            description="Fast-scannable editorial articles with clear steps, useful context, and transparent product links."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedLink
              href="/blog"
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors",
                !selectedCategory
                  ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                  : "border-border-default text-text-secondary hover:text-text-primary"
              )}
            >
              <T text={"All Articles"} />
            </LocalizedLink>

            {localizedCategories.map((category) => {
              const isActive = selectedCategory?.id === category.id;

              return (
                <LocalizedLink
                  key={category.id}
                  href={`/blog?category=${category.id}`}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors",
                    isActive
                      ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                      : "border-border-default text-text-secondary hover:text-text-primary"
                  )}
                >
                  <T text={category.name} />
                </LocalizedLink>
              );
            })}
          </div>

          {selectedCategory ? (
            <div className="mt-8 max-w-3xl rounded-3xl border border-border-subtle bg-surface-subtle p-6">
              <Badge><T text={selectedCategory.name} /></Badge>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary"><T text={selectedCategory.description} /></p>
            </div>
          ) : null}

          </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-10">
            <h2 className="font-heading text-3xl text-text-primary">
              {selectedCategory ? (
                <><T text={selectedCategory.name} /> <T text={"Product Guides"} /></>
              ) : (
                <T text={"Latest Product Guides"} />
              )}
            </h2>
            <p className="mt-2 text-text-secondary">
              <T text={"Practical product guidance for choosing, comparing, and using each pick well."} />
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          <InlineCtaPanel
            className="mt-12"
            eyebrow="Need quick product wins?"
            title="Open a guide, then compare the top picks in one flow"
            description="Readers convert more confidently when they read one focused guide first and shop with context."
            primaryHref="/shop"
            primaryLabel="Shop skincare tools"
            secondaryHref="/"
            secondaryLabel="Back to Landing"
          />
        </Container>
      </Section>
    </>
  );
}
