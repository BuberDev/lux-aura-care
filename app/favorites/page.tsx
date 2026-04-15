import type { Metadata } from "next";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getCategoryById, getFavoritesCollections } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Amazon Favorites",
  description:
    "Shop curated affiliate-ready beauty and self-care collections organized for fast, confident decision making.",
};

export default function FavoritesPage() {
  const collections = getFavoritesCollections();

  return (
    <>
      <Section className="border-b border-white/10 pb-12 pt-16 md:pt-20">
        <Container>
          <FadeIn>
            <Heading
              eyebrow="Curated Favorites"
              title="Amazon collections organized for clean, confident product discovery"
              description="Every list is edited for lifestyle fit, trust signals, and routine performance so readers can decide quickly."
            />
          </FadeIn>

          <FadeIn className="mt-8 flex flex-wrap gap-4" delay={0.06}>
            <CTAButton href="/blog" label="Read Product Guides" variant="secondary" />
            <CTAButton href="/" label="Back to Landing" variant="ghost" />
          </FadeIn>
        </Container>
      </Section>

      {collections.map((collection, collectionIndex) => {
        const category = getCategoryById(collection.categoryId);

        return (
          <Section key={collection.id} className={collectionIndex % 2 === 0 ? "atmosphere-surface" : undefined}>
            <Container>
              <FadeIn>
                <div className="mb-8 max-w-3xl space-y-4">
                  {category ? <Badge>{category.name}</Badge> : null}
                  <h2 className="font-heading text-3xl leading-tight md:text-4xl">{collection.title}</h2>
                  <p className="text-text-secondary">{collection.description}</p>
                </div>
              </FadeIn>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {collection.products.map((product, index) => (
                  <FadeIn key={product.id} delay={index * 0.05}>
                    <ProductCard product={product} compact />
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
