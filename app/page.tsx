import type { Metadata } from "next";
import Image from "next/image";

import { ArticleCard } from "@/components/article-card";
import { CategoryCard } from "@/components/category-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { FadeIn } from "@/components/motion/fade-in";
import { NewsletterBlock } from "@/components/newsletter-block";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import {
  categories,
  getAmazonFavorites,
  getFeaturedArticles,
  siteMeta,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Luxury Self-Care Rituals",
  description:
    "Discover elevated self-care routines and curated Amazon favorites designed for a calm, polished lifestyle.",
};

export default function HomePage() {
  const featuredArticles = getFeaturedArticles();
  const favorites = getAmazonFavorites();

  return (
    <>
      <section className="relative isolate min-h-[85vh] overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=2200&q=80"
          alt="Luxury self-care setup with candles, skincare, and soft linen textures"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <Container className="relative flex min-h-[85vh] items-end pb-20 pt-28 md:pb-24">
          <FadeIn className="max-w-3xl space-y-7">
            <Badge>Designed for Pinterest Ritual Seekers</Badge>
            <h1 className="font-heading text-5xl leading-[1.05] text-text-primary sm:text-6xl md:text-7xl">
              Transform your evenings into rituals that feel private, luxurious, and deeply restorative.
            </h1>
            <p className="max-w-2xl text-lg text-white/85 md:text-xl">{siteMeta.tagline}</p>
            <div className="flex flex-wrap gap-4">
              <CTAButton href="/blog" label="Explore Ritual Guides" />
              <CTAButton href="/favorites" label="Shop Amazon Favorites" variant="secondary" />
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section id="categories">
        <Container>
          <FadeIn>
            <Heading
              eyebrow="Featured Categories"
              title="Choose the ritual category that matches your mood"
              description="Each category is curated for fast scanning and clear next actions so it is easy to move from inspiration to results."
            />
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <FadeIn key={category.id} delay={index * 0.06}>
                <CategoryCard category={category} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="featured-articles" className="atmosphere-surface">
        <Container>
          <FadeIn>
            <Heading
              eyebrow="Featured Articles"
              title="High-performing routines your audience will actually save and use"
              description="Benefit-led editorial pieces structured for clarity, trust, and action."
            />
          </FadeIn>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <FadeIn key={article.slug} delay={index * 0.06}>
                <ArticleCard article={article} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="amazon-favorites">
        <Container>
          <FadeIn>
            <Heading
              eyebrow="Amazon Favorites"
              title="Curated product picks with strong trust signals"
              description="Elegant, practical upgrades chosen for repeat use and lifestyle fit."
            />
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.05}>
                <ProductCard product={product} compact />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <NewsletterBlock />
    </>
  );
}
