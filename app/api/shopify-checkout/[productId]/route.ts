import { NextResponse, type NextRequest } from "next/server";

import { getShopifyVariantFromUrl, getShopProductById } from "@/lib/shop-data";
import { selectCheckoutItem } from "@/lib/shop-checkout-selection";

const CHECKOUT_HOSTS = new Set(["shop.app", "checkout.shopify.com"]);
const STOREFRONT_API_VERSION = "2026-07";
const CHECKOUT_REQUEST_TIMEOUT_MS = 5000;

const CART_CREATE_MUTATION = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
      warnings {
        message
      }
    }
  }
`;

type CheckoutRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(request: NextRequest, context: CheckoutRouteContext) {
  const { productId } = await context.params;
  const product = getShopProductById(productId);
  if (!product) {
    return redirectToProduct(request, productId);
  }

  const selection = selectCheckoutItem(product, request.nextUrl.searchParams);
  const shopifyVariant = selection?.shopifyUrl ? parseShopifyVariant(selection.shopifyUrl) : null;
  if (!selection || !shopifyVariant || product.purchaseStatus === "coming-soon") {
    return redirectToProduct(request, productId);
  }

  const storefrontCheckoutUrl = await createStorefrontCheckoutUrl({
    storeOrigin: shopifyVariant.storeOrigin,
    shopifyVariantId: shopifyVariant.variantId,
    quantity: selection.quantity,
    buyerCountryCode: selection.countryCode,
  });

  if (storefrontCheckoutUrl) {
    return noIndexRedirect(storefrontCheckoutUrl);
  }

  // Ajax cart checkout cannot preserve an explicit market selection.
  if (selection.countryCode) return redirectToProduct(request, productId);

  try {
    const acceptLanguage = getCheckoutAcceptLanguage(request);
    const requestHeaders = {
      "Accept-Language": acceptLanguage,
      "Content-Type": "application/json",
    };

    const cartResponse = await fetch(`${shopifyVariant.storeOrigin}/cart/add.js?_fd=0`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        items: [{ id: Number(shopifyVariant.variantId), quantity: selection.quantity }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(CHECKOUT_REQUEST_TIMEOUT_MS),
    });

    if (!cartResponse.ok) {
      return redirectToProduct(request, productId);
    }

    const cookies = cartResponse.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";", 1)[0])
      .join("; ");

    if (!cookies) {
      return redirectToProduct(request, productId);
    }

    const checkoutResponse = await fetch(`${shopifyVariant.storeOrigin}/checkout?_fd=0`, {
      headers: {
        "Accept-Language": requestHeaders["Accept-Language"],
        Cookie: cookies,
      },
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(CHECKOUT_REQUEST_TIMEOUT_MS),
    });
    const checkoutUrl = checkoutResponse.headers.get("location");

    if (!checkoutUrl || !isAllowedCheckoutUrl(checkoutUrl)) {
      return redirectToProduct(request, productId);
    }

    return noIndexRedirect(checkoutUrl);
  } catch {
    return redirectToProduct(request, productId);
  }
}

function isAllowedCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (CHECKOUT_HOSTS.has(url.hostname) || url.hostname.endsWith(".myshopify.com"))
    );
  } catch {
    return false;
  }
}

function redirectToProduct(request: NextRequest, productId: string) {
  const locale = request.nextUrl.searchParams.get("locale") === "pl" ? "pl" : "en";
  const fallbackUrl = new URL(`/${locale}/shop/${encodeURIComponent(productId)}`, request.url);
  fallbackUrl.searchParams.set("checkoutError", "1");
  return noIndexRedirect(fallbackUrl);
}

function getCheckoutAcceptLanguage(request: NextRequest) {
  if (request.nextUrl.searchParams.get("locale") === "pl") {
    return "pl-PL,pl;q=0.9";
  }

  return request.headers.get("accept-language") ?? "en";
}

async function createStorefrontCheckoutUrl({
  storeOrigin,
  shopifyVariantId,
  quantity,
  buyerCountryCode,
}: {
  storeOrigin: string;
  shopifyVariantId: string;
  quantity: number;
  buyerCountryCode: string | null;
}) {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${storeOrigin}/api/${STOREFRONT_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({
          query: CART_CREATE_MUTATION,
          variables: {
            input: {
              ...(buyerCountryCode ? { buyerIdentity: { countryCode: buyerCountryCode } } : {}),
              lines: [
                {
                  merchandiseId: `gid://shopify/ProductVariant/${shopifyVariantId}`,
                  quantity,
                },
              ],
            },
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(CHECKOUT_REQUEST_TIMEOUT_MS),
      }
    );

    if (!response.ok) return null;

    const payload = await response.json();
    const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
    const userErrors = payload?.data?.cartCreate?.userErrors;

    if (Array.isArray(userErrors) && userErrors.length > 0) {
      return null;
    }

    return typeof checkoutUrl === "string" && isAllowedCheckoutUrl(checkoutUrl)
      ? checkoutUrl
      : null;
  } catch {
    return null;
  }
}

function parseShopifyVariant(value: string) {
  try {
    return getShopifyVariantFromUrl(value);
  } catch {
    return null;
  }
}

function noIndexRedirect(destination: string | URL) {
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
