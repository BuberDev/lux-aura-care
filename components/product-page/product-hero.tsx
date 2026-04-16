import Image from "next/image";
import { Check, Star } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { getAffiliateRoute } from "@/lib/affiliate";
import type { Product, ProductProof } from "@/lib/site-data";

type ProductHeroProps = {
  product: Product;
  proof: ProductProof;
  emotionalHook: string;
  keyBenefits: string[];
};

export function ProductHero({ product, proof, emotionalHook, keyBenefits }: ProductHeroProps) {
  return (
    <section className="border-b border-white/10 pb-14 pt-14 md:pb-20 md:pt-20">
      <Container>
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.02]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="space-y-6">
            <Badge>Luxury Affiliate Pick</Badge>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">{product.name}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{emotionalHook}</p>

            <ul className="space-y-3" aria-label="Key benefits">
              {keyBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary md:text-base">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              <Badge>Top rated</Badge>
              <Badge variant="subtle" className="border-white/25 bg-white/[0.03] text-text-primary">
                Popular choice
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
                <Star className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
                {proof.rating.toFixed(1)} • {proof.reviews}
              </span>
            </div>

            <CTAButton
              href={getAffiliateRoute(product.id, "product-hero")}
              label="Check on Amazon"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
