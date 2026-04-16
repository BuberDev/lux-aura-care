import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { getAffiliateRoute } from "@/lib/affiliate";
import type { Product } from "@/lib/site-data";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_920px]">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">You May Also Like</p>
          <h2 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">Keep building your ritual shelf</h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Curated alternatives designed to increase routine consistency and help you find your perfect fit.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Related products">
          {products.map((product) => (
            <li key={product.id} className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.02]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 p-5">
                <h3 className="font-heading text-2xl leading-tight">{product.name}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{product.benefit}</p>

                <div className="space-y-2">
                  <Button asChild size="sm" variant="secondary" className="w-full">
                    <Link href={`/favorites/${product.id}`}>View details</Link>
                  </Button>
                  <a
                    href={getAffiliateRoute(product.id, "related-products")}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex text-xs uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold"
                  >
                    Check on Amazon
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
