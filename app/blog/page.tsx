import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { articles, categories, getCategoryById, isCategoryId } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore self-care, skincare, body glow, and spa rituals designed for fast reading and thoughtful product discovery.",
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

  return (
    <>
      <Section className="border-b border-white/10 pb-12 pt-16 md:pt-20">
        <Container>
          <FadeIn>
            <Heading
              eyebrow="Lux Aura Journal"
              title="Conversion-ready articles crafted for Pinterest readers"
              description="Fast-scannable guides that pair lifestyle transformation hooks with trustworthy product recommendations."
            />
          </FadeIn>

          <FadeIn className="mt-8 flex flex-wrap gap-3" delay={0.08}>
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
          </FadeIn>

          {selectedCategory ? (
            <FadeIn className="mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] p-6" delay={0.12}>
              <Badge>{selectedCategory.name}</Badge>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {selectedCategory.description}
              </p>
            </FadeIn>
          ) : null}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article, index) => (
              <FadeIn key={article.slug} delay={index * 0.04}>
                <ArticleCard article={article} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
