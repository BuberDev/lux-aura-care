import type { Locale } from "@/lib/i18n/config";
import type { Product, ProductDefinition } from "@/lib/site-data";

export type ProductMarket = "us" | "pl";

export function getPreferredProductMarket(
  product: ProductDefinition,
  locale: Locale
): ProductMarket {
  return locale === "pl" && product.marketVariants.pl ? "pl" : "us";
}

export function getProductMarketVariant(product: ProductDefinition, locale: Locale) {
  const market = getPreferredProductMarket(product, locale);
  const variant = market === "pl" ? product.marketVariants.pl! : product.marketVariants.us;
  return { market, variant };
}

export function resolveProductMarket(
  product: ProductDefinition,
  locale: Locale
): Product {
  const { market, variant } = getProductMarketVariant(product, locale);

  return {
    id: product.id,
    categoryId: product.categoryId,
    trustSignal: variant.trustSignal ?? product.trustSignal,
    marketVariants: product.marketVariants,
    name: variant.name ?? product.name,
    benefit: variant.benefit ?? product.benefit,
    description: variant.description ?? product.description,
    image: variant.image ?? product.image,
    imageAlt: variant.imageAlt ?? product.imageAlt,
    gallery: variant.gallery ?? product.gallery,
    video: variant.video !== undefined ? variant.video : product.video,
    slug: variant.slug ?? product.slug ?? product.id,
    activeMarket: market,
    isMarketAlternative: Boolean(variant.isAlternative),
    affiliateUrl: variant.affiliateUrl,
    marketProductId: variant.marketProductId,
    price: variant.price,
  };
}
