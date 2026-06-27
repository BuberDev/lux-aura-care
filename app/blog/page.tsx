import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { TopPicksSection } from "@/components/sections/top-picks-section";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import {
  articles,
  categories,
  getCategoryById,
  getTopPicksByCategory,
  isCategoryId,
  siteMeta,
} from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { T } from "@/components/translated-text";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { localizeProduct } from "@/lib/product-localization";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Lux Aura Journal | Luxury Self-Care & Ritual Guides");
  const description = translateText(
    locale,
    "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery. Curated guides for your Pinterest lifestyle."
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
        ? ["poradniki rytuałów", "self-care", "pielęgnacja", ...siteMeta.plKeywords]
        : ["ritual guides", "self-care journal", "skincare routines", ...siteMeta.keywords],
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
  const filters = await searchParams;
  const selectedCategoryId = getSelectedCategory(filters.category);
  const selectedCategorySource =
    selectedCategoryId && isCategoryId(selectedCategoryId)
      ? getCategoryById(selectedCategoryId)
      : undefined;
  const selectedCategory = selectedCategorySource
    ? localizeContent(locale, selectedCategorySource)
    : undefined;

  const visibleArticles = localizeContent(
    locale,
    selectedCategorySource
      ? articles.filter((article) => article.categoryId === selectedCategorySource.id)
      : articles
  );
  const localizedCategories = localizeContent(locale, categories);

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Journal"), item: localizePathname("/blog", locale) },
    ...(selectedCategory
      ? [{ name: selectedCategory.name, item: localizePathname(`/blog?category=${selectedCategory.id}`, locale) }]
      : []),
  ]);

  const categoryPicks = selectedCategory
    ? getTopPicksByCategory(selectedCategory.id).map((item) => ({
        ...localizeContent(locale, item),
        product: localizeProduct(locale, item.product),
      }))
    : [];
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
        url: toAbsoluteUrl("/logo.png"), // Assuming logo existence or fallback
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
            eyebrow="Lux Aura Journal"
            title="Practical ritual guides for thoughtful product choices"
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

            {!selectedCategory ? (
              <InlineCtaPanel
                className="mt-10"
                eyebrow="Need quick product wins?"
                title="Open a guide, then compare the top picks in one flow"
                description="Readers convert more confidently when they read one focused guide first and shop with context."
                primaryHref="/favorites"
                primaryLabel="View Amazon Favorites"
                secondaryHref="/"
                secondaryLabel="Back to Landing"
              />
            ) : null}

            {selectedCategory && categoryPicks.length > 0 ? (
              <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8 flex items-end justify-between border-b border-border-subtle pb-4">
                  <div>
                    <h2 className="font-heading text-3xl text-text-primary">
                      <T text={"Essential"} /> {selectedCategory.name} <T text={"Favorites"} />
                    </h2>
                    <p className="mt-2 text-text-secondary">
                      <T text={"Direct Amazon links to the highest-rated picks for this ritual."} />
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {categoryPicks.map((item) => (
                    <ProductCard
                      key={item.product.id}
                      product={item.product}
                      compact
                      featuredBadge={item.badge}
                      ctaLabel="View on Amazon"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-10">
            <h2 className="font-heading text-3xl text-text-primary">
              {selectedCategory ? (
                <><T text={selectedCategory.name} /> <T text={"Ritual Guides"} /></>
              ) : (
                <T text={"Latest Ritual Guides"} />
              )}
            </h2>
            <p className="mt-2 text-text-secondary">
              <T text={"Step-by-step transformation instructions for your Pinterest lifestyle."} />
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </Section>

      <TopPicksSection className="pt-0" />
    </>
  );
}
