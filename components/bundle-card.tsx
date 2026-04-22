import Image from "next/image";
import { Sparkles } from "lucide-react";

import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAffiliateRoute } from "@/lib/affiliate";
import { getBundleProducts, getProductById, type ProductBundle } from "@/lib/site-data";

type BundleCardProps = {
  readonly bundle: ProductBundle;
};

export function BundleCard({ bundle }: BundleCardProps) {
  const products = getBundleProducts(bundle.id);
  const firstProduct = getProductById(bundle.productIds[0]);

  if (!firstProduct) return null;

  const bundleHref = getAffiliateRoute(firstProduct.id, "bundle").concat(`&bundle=${bundle.id}`);

  return (
    <Card className="overflow-hidden border-white/12 bg-gradient-to-br from-accent-gold/10 via-white/[0.02] to-white/[0.02] transition-all hover:border-accent-gold/45">
      <div className="grid gap-5 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent-gold" aria-hidden="true" />
              <Badge>{bundle.productIds.length} items</Badge>
            </div>
            <h3 className="font-heading text-2xl leading-tight">{bundle.title}</h3>
          </div>
          {bundle.discount && (
            <div className="shrink-0 rounded-lg bg-accent-gold/15 px-3 py-2 text-right">
              <p className="text-xs font-semibold text-accent-gold">{bundle.discount.label}</p>
              <p className="text-xs text-text-secondary">{bundle.discount.savings}</p>
            </div>
          )}
        </div>

        <p className="text-base font-semibold leading-relaxed text-text-primary">{bundle.tagline}</p>
        <p className="text-sm leading-relaxed text-text-secondary">{bundle.description}</p>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Includes:
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center gap-2 rounded-lg bg-white/[0.03] p-3 text-center"
              >
                <div className="relative h-16 w-12 overflow-hidden rounded">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-medium leading-tight text-text-secondary line-clamp-2">
                  {product.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <CTAButton
          href={bundleHref}
          label={`View Bundle - ${products.length} Items`}
          className="w-full"
          productId={firstProduct.id}
          productName={firstProduct.name}
          placement="bundle"
        />
      </div>
    </Card>
  );
}
