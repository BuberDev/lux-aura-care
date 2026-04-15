import Image from "next/image";
import { Star } from "lucide-react";

import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/site-data";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-white/12 bg-white/[0.02]">
      <div className={compact ? "grid gap-4 p-4" : "grid gap-5 p-5"}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
            className="object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge>{product.trustSignal}</Badge>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
              <Star className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
              Trusted pick
            </span>
          </div>

          <h3 className={compact ? "font-heading text-xl" : "font-heading text-2xl"}>{product.name}</h3>
          <p className="text-sm text-text-secondary">{product.benefit}</p>
          {!compact ? <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p> : null}
        </div>

        <CTAButton href={product.amazonUrl} label="Check on Amazon" className="w-full" />
      </div>
    </Card>
  );
}
