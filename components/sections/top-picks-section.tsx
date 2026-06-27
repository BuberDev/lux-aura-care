import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { getTopPickProducts } from "@/lib/site-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import { localizeProduct } from "@/lib/product-localization";

type TopPicksSectionProps = {
  className?: string;
};

export async function TopPicksSection({ className }: TopPicksSectionProps) {
  const locale = await getRequestLocale();
  const picks = getTopPickProducts().map((item) => ({
    ...localizeContent(locale, item),
    product: localizeProduct(locale, item.product),
  }));

  return (
    <Section id="top-picks" className={cn("[content-visibility:auto] [contain-intrinsic-size:1px_900px]", className)}>
      <Container>
        <Heading
          eyebrow="Top Picks"
          title="Most-clicked products this week"
          description="A focused editorial shortlist with clear routine benefits and marketplace-aware product links."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {picks.map((item) => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              compact
              featuredBadge={item.badge}
              ctaLabel="View on Amazon"
              detailsHref={`/favorites/${item.product.id}`}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <CTAButton href="/favorites" label="Browse All Amazon Favorites" variant="secondary" />
        </div>
      </Container>
    </Section>
  );
}
