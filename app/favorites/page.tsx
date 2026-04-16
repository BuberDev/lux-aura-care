import type { Metadata } from "next";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/lib/seo";
import { getCategoryById, getFavoritesCollections } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Shop the Feed | Pinterest Collections",
  description:
    "Explore the viral Lux Aura Care favorites. Direct Amazon links to the 8 essentials currently trending on our Pinterest feed.",
  alternates: {
    canonical: "/favorites",
  },
  openGraph: {
    title: "Shop the Pinterest Feed | Lux Aura Care",
    description:
      "Direct Amazon links to the 8 essentials currently trending on our Pinterest feed. Minimalist quality for an elevated lifestyle.",
    url: "/favorites",
    type: "website",
    images: [
      {
        url: toAbsoluteUrl("/mixsoon_Bean_Essence_Exfoliating.png"),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function FavoritesPage() {
  const collections = getFavoritesCollections();

  return (
    <>
      <Section className="border-b border-white/10 pb-12 pt-16 md:pt-20">
        <Container>
          <Heading
            eyebrow="Shop the Feed"
            title="The Lux Aura Pinterest Collection"
            description="The 8 high-performing essentials currently driving our daily rituals. Directly linked for easy, confident discovery."
          />

          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/blog" label="Explore Routine Guides" variant="secondary" />
            <CTAButton href="/" label="Back to Home" variant="ghost" />
          </div>

          <InlineCtaPanel
            className="mt-10"
            eyebrow="Pinterest Favorites"
            title="Pick one routine, shop the essentials, and start your reset tonight"
            description="We focus on quality over quantity. Start with the collection that matches your immediate goal—whether it is 'Glass Skin' or 'Biological Sleep.'"
            primaryHref="/blog"
            primaryLabel="See Routine Manuals"
            secondaryHref="/"
            secondaryLabel="See Featured Categories"
          />
        </Container>
      </Section>

      {collections.map((collection, collectionIndex) => {
        const category = getCategoryById(collection.categoryId);

        return (
          <Section
            key={collection.id}
            className={collectionIndex % 2 === 0 ? "atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_1200px]" : "[content-visibility:auto] [contain-intrinsic-size:1px_1200px]"}
          >
            <Container>
              <div className="mb-8 max-w-3xl space-y-4">
                {category ? <Badge>{category.name}</Badge> : null}
                <h2 className="font-heading text-3xl leading-tight md:text-4xl">{collection.title}</h2>
                <p className="leading-relaxed text-text-secondary">{collection.description}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {collection.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    compact
                    ctaLabel="View on Amazon"
                    detailsHref={`/favorites/${product.id}`}
                  />
                ))}
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
