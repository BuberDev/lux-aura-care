import type { Metadata } from "next";
import Link from "next/link";

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

export const metadata: Metadata = {
  title: "Lux Aura Journal | Luxury Self-Care & Ritual Guides",
  description:
    "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery. Curated guides for your Pinterest lifestyle.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Lux Aura Journal | Luxury Self-Care & Ritual Guides",
    description:
      "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery.",
    url: "/blog",
    type: "website",
    siteName: "Lux Aura Care",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Aura Journal | Luxury Self-Care & Ritual Guides",
    description:
      "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery.",
  },
  keywords: ["ritual guides", "self-care journal", "skincare routines", ...siteMeta.keywords],
};

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
  const filters = await searchParams;
  const selectedCategoryId = getSelectedCategory(filters.category);
  const selectedCategory =
    selectedCategoryId && isCategoryId(selectedCategoryId)
      ? getCategoryById(selectedCategoryId)
      : undefined;

  const visibleArticles = selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory.id)
    : articles;

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: "Home", item: "/" },
    { name: "Journal", item: "/blog" },
    ...(selectedCategory
      ? [{ name: selectedCategory.name, item: `/blog?category=${selectedCategory.id}` }]
      : []),
  ]);

  const categoryPicks = selectedCategory ? getTopPicksByCategory(selectedCategory.id) : [];
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: selectedCategory ? `${selectedCategory.name} Articles` : "Lux Aura Journal",
    url: toAbsoluteUrl(
      selectedCategory ? `/blog?category=${selectedCategory.id}` : "/blog"
    ),
    hasPart: visibleArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: toAbsoluteUrl(`/blog/${article.slug}`),
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
      url: toAbsoluteUrl("/"),
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(blogJsonLd) }}
      />
      <Section className="border-b border-white/10 pb-14 pt-16 md:pt-20">
        <Container>
          <Heading
            eyebrow="Lux Aura Journal"
            title="Conversion-ready ritual guides crafted for Pinterest readers"
            description="Fast-scannable articles with clear transformation hooks, trust signals, and soft product CTAs."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors",
                !selectedCategory
                  ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                  : "border-white/20 text-text-secondary hover:text-text-primary"
              )}
            >
              All Articles
            </Link>

            {categories.map((category) => {
              const isActive = selectedCategory?.id === category.id;

              return (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.id}`}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors",
                    isActive
                      ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                      : "border-white/20 text-text-secondary hover:text-text-primary"
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>

          {selectedCategory ? (
            <div className="mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <Badge>{selectedCategory.name}</Badge>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{selectedCategory.description}</p>
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
                <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-heading text-3xl text-text-primary">
                      Essential {selectedCategory.name} Favorites
                    </h2>
                    <p className="mt-2 text-text-secondary">
                      Direct Amazon links to the highest-rated picks for this ritual.
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
              {selectedCategory ? `${selectedCategory.name} Ritual Guides` : "Latest Ritual Guides"}
            </h2>
            <p className="mt-2 text-text-secondary">
              Step-by-step transformation instructions for your Pinterest lifestyle.
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
