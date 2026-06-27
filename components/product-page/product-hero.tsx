import Image from "next/image";
import { Check } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { getAffiliateRoute } from "@/lib/affiliate";
import type { Product } from "@/lib/site-data";
import { T } from "@/components/translated-text";

type ProductHeroProps = {
  readonly product: Product;
  readonly emotionalHook: string;
  readonly keyBenefits: string[];
};

export function ProductHero({ product, emotionalHook, keyBenefits }: ProductHeroProps) {
  return (
    <section className="border-b border-border-subtle pb-14 pt-14 md:pb-20 md:pt-20">
      <Container>
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border-subtle bg-surface-subtle">
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
            <Badge><T text={"Luxury Affiliate Pick"} /></Badge>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl"><T text={product.name} /></h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-primary/85 md:text-lg"><T text={emotionalHook} /></p>

            <ul className="space-y-3">
              {keyBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary md:text-base">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                  <span><T text={benefit} /></span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              <Badge><T text={"Top rated"} /></Badge>
              <Badge variant="subtle" className="border-border-strong bg-surface-raised text-text-primary">
                <T text={"Popular choice"} />
              </Badge>
            </div>

            <CTAButton
              href={getAffiliateRoute(product.id, "product-hero")}
              label="Check on Amazon"
              className="w-full sm:w-auto"
              productId={product.id}
              productName={product.name}
              placement="hero"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
