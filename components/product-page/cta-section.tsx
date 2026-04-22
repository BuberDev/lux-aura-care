import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

type CTASectionProps = {
  readonly ctaHref: string;
  readonly productId?: string;
  readonly productName?: string;
};

export function CTASection({ ctaHref, productId, productName }: CTASectionProps) {
  return (
    <Section className="border-t border-white/10 py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl leading-tight sm:text-5xl">Upgrade your self-care routine</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
            Explore this ritual pick on Amazon and choose what fits your evening flow best.
          </p>
          <div className="mt-7 flex justify-center">
            <CTAButton
              href={ctaHref}
              label="View on Amazon"
              productId={productId}
              productName={productName}
              placement="product-final-cta"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
