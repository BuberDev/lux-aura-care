import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { getUsdPlnRate } from "@/lib/currency";
import {
  getShopifyVariant,
  type ShopProduct,
} from "@/lib/shop-data";

const SHOPIFY_STORE_HOST = "k50k7g-j7.myshopify.com";
const STOREFRONT_API_VERSION = "2024-10";
const SHOPIFY_PRICE_REVALIDATE_SECONDS = 300;

const SHOP_VARIANT_PL_PRICING_QUERY = `
  query ShopVariantPlPricing($ids: [ID!]!) @inContext(country: PL) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

type ShopifyMoney = {
  amount?: string | null;
  currencyCode?: string | null;
};

type ShopifyVariantPricingNode = {
  id?: string | null;
  price?: ShopifyMoney | null;
  compareAtPrice?: ShopifyMoney | null;
} | null;

type ShopifyVariantPricingResponse = {
  data?: {
    nodes?: ShopifyVariantPricingNode[] | null;
  };
};

type ResolvedShopPrice = {
  price: number;
  compareAtPrice: number;
  currency: string;
};

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100;
}

function parseShopifyMoney(money: ShopifyMoney | null | undefined) {
  const amount = Number(money?.amount);

  if (!Number.isFinite(amount) || amount < 0 || !money?.currencyCode) {
    return null;
  }

  return {
    amount: roundMoney(amount),
    currency: money.currencyCode,
  };
}

function getPrimaryVariantGlobalId(product: ShopProduct) {
  const variant = getShopifyVariant(product);
  return variant ? `gid://shopify/ProductVariant/${variant.variantId}` : null;
}

function normalizeCompareAtPrice(price: number, compareAtPrice: number | null) {
  return compareAtPrice !== null && compareAtPrice > price ? compareAtPrice : price;
}

async function getShopifyPlVariantPrices(products: readonly ShopProduct[]) {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!token) return new Map<string, ResolvedShopPrice>();

  const variantEntries = products.flatMap((product) => {
    const variantId = getPrimaryVariantGlobalId(product);
    return variantId ? [{ productId: product.id, variantId }] : [];
  });
  if (variantEntries.length === 0) return new Map<string, ResolvedShopPrice>();

  const productIdByVariantId = new Map(
    variantEntries.map(({ productId, variantId }) => [variantId, productId])
  );

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_HOST}/api/${STOREFRONT_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({
          query: SHOP_VARIANT_PL_PRICING_QUERY,
          variables: { ids: variantEntries.map(({ variantId }) => variantId) },
        }),
        next: {
          revalidate: SHOPIFY_PRICE_REVALIDATE_SECONDS,
          tags: ["shopify-pl-prices"],
        },
      }
    );

    if (!response.ok) return new Map<string, ResolvedShopPrice>();

    const payload = (await response.json()) as ShopifyVariantPricingResponse;
    const pricesByProductId = new Map<string, ResolvedShopPrice>();

    for (const node of payload.data?.nodes ?? []) {
      if (!node?.id) continue;

      const productId = productIdByVariantId.get(node.id);
      const price = parseShopifyMoney(node.price);
      if (!productId || !price || price.currency !== "PLN") continue;

      const compareAtPrice = parseShopifyMoney(node.compareAtPrice);
      pricesByProductId.set(productId, {
        price: price.amount,
        compareAtPrice: normalizeCompareAtPrice(
          price.amount,
          compareAtPrice?.currency === "PLN" ? compareAtPrice.amount : null
        ),
        currency: "PLN",
      });
    }

    return pricesByProductId;
  } catch {
    return new Map<string, ResolvedShopPrice>();
  }
}

async function getFallbackPlPrices(products: readonly ShopProduct[]) {
  const quote = await getUsdPlnRate();
  if (!quote) return new Map<string, ResolvedShopPrice>();

  return new Map(
    products
      .filter((product) => product.currency === "USD")
      .map((product) => [
        product.id,
        {
          price: roundMoney(product.price * quote.rate),
          compareAtPrice: roundMoney(product.compareAtPrice * quote.rate),
          currency: "PLN",
        },
      ])
  );
}

export async function resolveShopProductsForLocale<T extends ShopProduct>(
  products: readonly T[],
  locale: Locale
): Promise<T[]> {
  if (locale !== "pl") return [...products];

  const shopifyPrices = await getShopifyPlVariantPrices(products);
  const fallbackPrices =
    shopifyPrices.size === products.length
      ? new Map<string, ResolvedShopPrice>()
      : await getFallbackPlPrices(products);

  return products.map((product) => {
    const price = shopifyPrices.get(product.id) ?? fallbackPrices.get(product.id);
    return price ? ({ ...product, ...price } as T) : product;
  });
}

export async function resolveShopProductForLocale<T extends ShopProduct>(
  product: T,
  locale: Locale
): Promise<T> {
  const [resolvedProduct] = await resolveShopProductsForLocale([product], locale);
  return resolvedProduct ?? product;
}
