import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { TopPicksSection } from "@/components/sections/top-picks-section";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { articles, categories, getCategoryById, isCategoryId } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Lux Aura Journal | Lux Aura Care",
    description:
      "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: toAbsoluteUrl("/Cliganic_Organic_Aromatherapy.png"),
        width: 1200,
        height: 630,
      },
    ],
  },
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
        </Container>
      </Section>

      <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
        <Container>
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
