import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import { Check, Star, TrendingUp } from "lucide-react";

import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAffiliateRoute } from "@/lib/affiliate";
import { generateCTALabel, selectCTAStrategy } from "@/lib/cta-generator";
import { getProductProof, type Product, type TopPickBadge } from "@/lib/site-data";
import { T } from "@/components/translated-text";

type ProductCardProps = {
  readonly product: Product;
  readonly compact?: boolean;
  readonly featuredBadge?: TopPickBadge;
  readonly urgencyOverride?: string;
  readonly ctaLabel?: string;
  readonly detailsHref?: string;
  readonly detailsLabel?: string;
};

export function ProductCard({
  product,
  compact = false,
  featuredBadge,
  urgencyOverride,
  ctaLabel,
  detailsHref,
  detailsLabel,
}: ProductCardProps) {
  const proof = getProductProof(product.id);
  const highlights = proof.highlights.slice(0, compact ? 2 : 3);

  const strategy = selectCTAStrategy(product);
  const dynamicCTALabel = generateCTALabel(product, strategy, compact);

  return (
    <Card className="overflow-hidden border-border-subtle bg-surface-subtle transition-colors hover:border-accent-gold/45">
      <div className={compact ? "grid gap-4 p-4" : "grid gap-5 p-5 md:p-6"}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
            className="object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge><T text={featuredBadge ?? product.trustSignal} /></Badge>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-text-secondary">
              <Star className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
              {proof.rating.toFixed(1)}
            </span>
          </div>

          <h3 className={compact ? "font-heading text-xl leading-tight" : "font-heading text-2xl leading-tight"}>
            <T text={product.name} />
          </h3>

          <p className="text-sm text-text-secondary"><T text={product.benefit} /></p>

          <ul className="space-y-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                <span><T text={highlight} /></span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-3">
            <span className="text-xs uppercase tracking-[0.14em] text-text-secondary"><T text={proof.reviews} /></span>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-accent-gold">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              <T text={urgencyOverride ?? proof.socialProof} />
            </span>
          </div>

          {!compact ? <p className="text-sm leading-relaxed text-text-secondary"><T text={product.description} /></p> : null}
        </div>

        <CTAButton
          href={getAffiliateRoute(product.id, "product-card")}
          label={ctaLabel ?? dynamicCTALabel}
          className="w-full"
          productId={product.id}
          productName={product.name}
          placement="product-card"
        />
        {detailsHref ? (
          <LocalizedLink
            href={detailsHref}
            className="inline-flex justify-center text-xs uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold"
          >
            <T text={detailsLabel ?? "View details"} />
          </LocalizedLink>
        ) : null}
      </div>
    </Card>
  );
}
