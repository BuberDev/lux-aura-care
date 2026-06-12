import type { Metadata } from "next";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { getCategoryById, getFavoritesCollections, siteMeta } from "@/lib/site-data";
import { T } from "@/components/translated-text";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Shop the Feed | Pinterest Favorites & Seasonal Picks");
  const description = translateText(
    locale,
    "Explore the viral Lux Aura Care favorites. Direct Amazon links to the 8 essentials currently trending on our Pinterest feed. High-glow skincare and sleep rituals."
  );

  return {
    title,
    description,
    alternates: getLocalizedAlternates("/favorites", locale),
    openGraph: {
      title,
      description,
      url: localizePathname("/favorites", locale),
      type: "website",
      siteName: "Lux Aura Care",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
    keywords:
      locale === "pl"
        ? ["ulubieńcy z Pinterest", "produkty Amazon", "rytuały pielęgnacyjne", ...siteMeta.plKeywords]
        : ["pinterest favorites", "amazon beauty finds", "ritual essentials", ...siteMeta.keywords],
  };
}

export default async function FavoritesPage() {
  const locale = await getRequestLocale();
  const collections = localizeContent(locale, getFavoritesCollections());

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Favorites"), item: localizePathname("/favorites", locale) },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: translateText(locale, "Shop the Pinterest Feed"),
    description: translateText(locale, "Curated collections of high-glow essentials."),
    url: toAbsoluteUrl(localizePathname("/favorites", locale)),
    inLanguage: locale,
    hasPart: collections.flatMap((col) =>
      col.products.map((p) => ({
        "@type": "Product",
        name: p.name,
        url: toAbsoluteUrl(localizePathname(`/favorites/${p.id}`, locale)),
        image: toAbsoluteUrl(p.image),
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }}
      />
      <Section className="border-b border-border-subtle pb-12 pt-16 md:pt-20">
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
                {category ? <Badge><T text={category.name} /></Badge> : null}
                <h2 className="font-heading text-3xl leading-tight md:text-4xl"><T text={collection.title} /></h2>
                <p className="leading-relaxed text-text-secondary"><T text={collection.description} /></p>
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
