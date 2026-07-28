import { NextResponse, type NextRequest } from "next/server";

import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  getShopifyCheckoutRoute,
  getShopifyVariantFromUrl,
  shopProducts,
} from "@/lib/shop-data";

const MAX_CHECKOUT_QUANTITY = 10;

type CartLineRouteContext = {
  params: Promise<{ cartLine: string }>;
};

export async function GET(request: NextRequest, context: CartLineRouteContext) {
  const { cartLine } = await context.params;
  const cartMatch = cartLine.match(/^(\d+):(\d+)$/);

  if (!cartMatch) {
    return redirectToShop(request);
  }

  const [, shopifyVariantId, rawQuantity] = cartMatch;
  const productMatch = findProductByShopifyVariantId(shopifyVariantId);

  if (!productMatch) {
    return redirectToShop(request);
  }

  const locale = getLocale(request);
  const checkoutUrl = new URL(getShopifyCheckoutRoute(productMatch.product.id), request.url);
  checkoutUrl.searchParams.set("quantity", String(parseCartQuantity(rawQuantity)));
  checkoutUrl.searchParams.set("locale", locale);

  if (locale === "pl") {
    checkoutUrl.searchParams.set("country", "PL");
  }

  if (productMatch.variantId) {
    checkoutUrl.searchParams.set("variantId", productMatch.variantId);
  }

  return noIndexRedirect(checkoutUrl);
}

function findProductByShopifyVariantId(shopifyVariantId: string) {
  for (const product of shopProducts) {
    const productVariant = getShopifyVariantFromUrl(product.shopifyUrl);
    if (productVariant?.variantId === shopifyVariantId) {
      return { product, variantId: null };
    }

    for (const variant of product.variants ?? []) {
      const variantMatch = getShopifyVariantFromUrl(variant.shopifyUrl);
      if (variantMatch?.variantId === shopifyVariantId) {
        return { product, variantId: variant.id };
      }
    }
  }

  return null;
}

function parseCartQuantity(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(MAX_CHECKOUT_QUANTITY, Math.trunc(parsed)));
}

function getLocale(request: NextRequest): Locale {
  const headerLocale = request.headers.get("x-lux-aura-locale");
  if (isLocale(headerLocale)) {
    return headerLocale;
  }

  const searchLocale = request.nextUrl.searchParams.get("locale");
  return isLocale(searchLocale) ? searchLocale : "en";
}

function redirectToShop(request: NextRequest) {
  const locale = getLocale(request);
  const fallbackUrl = new URL(`/${locale}/shop`, request.url);
  fallbackUrl.searchParams.set("checkoutError", "1");
  return noIndexRedirect(fallbackUrl);
}

function noIndexRedirect(destination: string | URL) {
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
