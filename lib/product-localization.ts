import type { Locale } from "@/lib/i18n/config";
import { localizeContent } from "@/lib/i18n/messages";
import { resolveProductMarket } from "@/lib/product-market";
import type { Product, ProductDefinition } from "@/lib/site-data";

export function localizeProduct(locale: Locale, product: ProductDefinition): Product {
  return localizeContent(locale, resolveProductMarket(product, locale));
}

export function localizeProducts(locale: Locale, products: ProductDefinition[]): Product[] {
  return products.map((product) => localizeProduct(locale, product));
}
