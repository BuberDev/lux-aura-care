import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { getTopPickProducts } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type TopPicksSectionProps = {
  className?: string;
};

export function TopPicksSection({ className }: TopPicksSectionProps) {
  const picks = getTopPickProducts();

  return (
    <Section id="top-picks" className={cn("[content-visibility:auto] [contain-intrinsic-size:1px_900px]", className)}>
      <Container>
        <Heading
          eyebrow="Top Picks"
          title="Most-clicked products this week"
          description="A focused shortlist for Pinterest readers: high-trust favorites with strong ratings, social proof, and clear routine benefits."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {picks.map((item) => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              compact
              featuredBadge={item.badge}
              ctaLabel="View on Amazon"
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
