import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { getShopifyVariantFromUrl, type ShopProduct } from "@/lib/shop-data";
import { applyLivePrices, type LivePrice } from "@/lib/shop-price-mapping";

const STOREFRONT_API_VERSION = "2026-07";
const PRICE_REQUEST_TIMEOUT_MS = 5000;
const VARIANT_PRICING_QUERY = `
  query ShopVariantPricing($ids: [ID!]!, $country: CountryCode) @inContext(country: $country) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`;

type Money = { amount: string; currencyCode: string };
type PricingNode = { id: string; price: Money; compareAtPrice: Money | null };

function variantFor(url?: string) {
  return url ? getShopifyVariantFromUrl(url) : null;
}

export async function resolveShopProductForLocale<T extends ShopProduct>(
  product: T,
  locale: Locale,
  countryCode: string | null = null
): Promise<T> {
  const [resolved] = await resolveShopProductsForLocale([product], locale, countryCode);
  return resolved;
}

export async function resolveShopProductsForLocale<T extends ShopProduct>(
  products: readonly T[],
  _locale: Locale,
  countryCode: string | null = null
): Promise<T[]> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!token) return [...products];

  // Include every selection, including sizes nested under a color.
  const variants = products.flatMap((product) => [
    variantFor(product.shopifyUrl),
    ...(product.sizes ?? []).map((size) => variantFor(size.shopifyUrl)),
    ...(product.variants ?? []).flatMap((variant) => [
      variantFor(variant.shopifyUrl),
      ...(variant.sizes ?? []).map((size) => variantFor(size.shopifyUrl)),
    ]),
  ]).filter((variant) => variant !== null);
  if (!variants.length) return [...products];

  const idsByOrigin = new Map<string, Set<string>>();
  for (const variant of variants) {
    const ids = idsByOrigin.get(variant.storeOrigin) ?? new Set<string>();
    ids.add(`gid://shopify/ProductVariant/${variant.variantId}`);
    idsByOrigin.set(variant.storeOrigin, ids);
  }
  const prices = new Map<string, LivePrice>();
  await Promise.all([...idsByOrigin].map(async ([origin, uniqueIds]) => {
    const ids = [...uniqueIds];
    for (let index = 0; index < ids.length; index += 250) {
      try {
        const response = await fetch(`${origin}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
          body: JSON.stringify({ query: VARIANT_PRICING_QUERY, variables: {
            ids: ids.slice(index, index + 250), country: countryCode,
          } }),
          next: { revalidate: 300, tags: ["shopify-prices"] },
          signal: AbortSignal.timeout(PRICE_REQUEST_TIMEOUT_MS),
        });
        if (!response.ok) continue;
        const payload = await response.json() as {
          data?: { nodes?: (PricingNode | null)[] };
          errors?: unknown[];
        };
        if (payload.errors?.length) continue;
        for (const node of payload.data?.nodes ?? []) {
          if (!node?.price) continue;
          const price = Number(node.price.amount);
          if (!Number.isFinite(price) || price < 0 || !node.price.currencyCode) continue;
          const comparison = node.compareAtPrice?.currencyCode === node.price.currencyCode
            ? Number(node.compareAtPrice.amount) : price;
          prices.set(node.id, {
            price,
            compareAtPrice: Number.isFinite(comparison) && comparison > price ? comparison : price,
            currency: node.price.currencyCode,
          });
        }
      } catch {
        // Retain the verified catalog snapshot, never convert an old USD placeholder.
      }
    }
  }));

  return products.map((product) => applyLivePrices(product, prices));
}
