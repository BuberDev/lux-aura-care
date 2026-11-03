import { getShopifyVariantFromUrl, type ShopProduct } from "./shop-data";

export type LivePrice = { price: number; compareAtPrice: number; currency: string };

function priceFor(url: string | undefined, prices: ReadonlyMap<string, LivePrice>) {
  const variant = url ? getShopifyVariantFromUrl(url) : null;
  return variant ? prices.get(`gid://shopify/ProductVariant/${variant.variantId}`) : undefined;
}

export function applyLivePrices<T extends ShopProduct>(
  product: T,
  prices: ReadonlyMap<string, LivePrice>
): T {
  const selections = [
    product.shopifyUrl,
    ...(product.sizes ?? []).map((size) => size.shopifyUrl),
    ...(product.variants ?? []).flatMap((variant) => [
      variant.shopifyUrl,
      ...(variant.sizes ?? []).map((size) => size.shopifyUrl),
    ]),
  ].filter((url): url is string => Boolean(url));
  const livePrices = selections.map((url) => priceFor(url, prices));
  // Keep the catalog snapshot unless every mapped choice has a matching live currency.
  if (
    livePrices.length === 0 ||
    livePrices.some((price) => !price) ||
    new Set(livePrices.map((price) => price?.currency)).size !== 1
  ) return product;

  const basePrice = priceFor(product.shopifyUrl, prices);
  if (!basePrice) return product;
  const currency = basePrice.currency;
  const hasUnmappedPrice = [
    ...(product.sizes ?? []),
    ...(product.variants ?? []).flatMap((variant) => [variant, ...(variant.sizes ?? [])]),
  ].some((choice) => !choice.shopifyUrl && choice.price !== undefined);
  if (currency !== product.currency && hasUnmappedPrice) return product;

  const selectionPrice = (url?: string) => priceFor(url, prices);
  return {
    ...product,
    ...basePrice,
    currency,
    sizes: product.sizes?.map((size) => ({ ...size, ...selectionPrice(size.shopifyUrl) })),
    variants: product.variants?.map((variant) => ({
      ...variant,
      ...selectionPrice(variant.shopifyUrl),
      sizes: variant.sizes?.map((size) => ({ ...size, ...selectionPrice(size.shopifyUrl) })),
    })),
  };
}
