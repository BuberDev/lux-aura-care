import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { localizePathname } from "@/lib/i18n/path";
import { localizeContent } from "@/lib/i18n/messages";
import { resolveProductMarket } from "@/lib/product-market";
import type { Product, ProductDefinition } from "@/lib/site-data";

export function localizeProduct(locale: Locale, product: ProductDefinition): Product {
  return localizeContent(locale, resolveProductMarket(product, locale));
}

export function localizeProducts(locale: Locale, products: ProductDefinition[]): Product[] {
  return products.map((product) => localizeProduct(locale, product));
}

export function getLocalizedProductAlternates(
  product: ProductDefinition,
  currentLocale: Locale
) {
  const languages = Object.fromEntries(
    locales.map((locale) => {
      const localizedProduct = localizeProduct(locale, product);
      return [
        locale,
        localizePathname(`/favorites/${localizedProduct.slug}`, locale),
      ];
    })
  ) as Record<Locale, string>;

  return {
    canonical: languages[currentLocale],
    languages: {
      ...languages,
      "x-default": languages[defaultLocale],
    },
  };
}
