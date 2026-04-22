import { Star } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

type SocialProofProps = {
  readonly headline: string;
  readonly socialLine: string;
  readonly ratingLabel: string;
  readonly reviews: string;
  readonly ctaHref: string;
  readonly productId?: string;
  readonly productName?: string;
};

export function SocialProof({
  headline,
  socialLine,
  ratingLabel,
  reviews,
  ctaHref,
  productId,
  productName,
}: SocialProofProps) {
  return (
    <Section className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_520px]">
      <Container>
        <div className="rounded-[2rem] border border-black/12 bg-black/[0.04] p-7 text-background-primary md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Social Proof</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl leading-tight sm:text-4xl">{headline}</h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-black/15 px-3 py-1 text-xs uppercase tracking-[0.14em] text-black/70">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
              ))}
            </span>
            <span className="text-xs uppercase tracking-[0.14em] text-black/70">{ratingLabel}</span>
            <span className="text-xs uppercase tracking-[0.14em] text-black/70">{reviews}</span>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-black/70">&ldquo;{socialLine}&rdquo;</p>

          <div className="mt-7">
            <CTAButton
              href={ctaHref}
              label="Check on Amazon"
              productId={productId}
              productName={productName}
              placement="product-social-proof"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
