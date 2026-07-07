import { NextResponse, type NextRequest } from "next/server";

import { getShopifyVariantFromUrl, getShopProductById } from "@/lib/shop-data";

const CHECKOUT_HOSTS = new Set(["shop.app", "checkout.shopify.com"]);
const SHOPIFY_STORE_HOST = "k50k7g-j7.myshopify.com";
const MAX_CHECKOUT_QUANTITY = 10;

type CheckoutRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(request: NextRequest, context: CheckoutRouteContext) {
  const { productId } = await context.params;
  const product = getShopProductById(productId);
  const selectedVariantId = request.nextUrl.searchParams.get("variantId");
  const selectedVariant = product?.variants?.find((variant) => variant.id === selectedVariantId);
  const selectedShopifyUrl = selectedVariant?.shopifyUrl ?? product?.shopifyUrl;
  const shopifyVariant = selectedShopifyUrl ? parseShopifyVariant(selectedShopifyUrl) : null;
  const checkoutQuantity = parseCheckoutQuantity(request.nextUrl.searchParams.get("quantity"));

  if (!product) {
    return redirectToProduct(request, productId);
  }

  if (!shopifyVariant) {
    return redirectToConfiguredShopifyUrl(request, product, productId);
  }

  try {
    const requestHeaders = {
      "Accept-Language": request.headers.get("accept-language") ?? "en",
      "Content-Type": "application/json",
    };
    const cartResponse = await fetch(`${shopifyVariant.storeOrigin}/cart/add.js`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        items: [{ id: Number(shopifyVariant.variantId), quantity: checkoutQuantity }],
      }),
      cache: "no-store",
    });

    if (!cartResponse.ok) {
      return redirectToConfiguredShopifyUrl(request, product, productId);
    }

    const cookies = cartResponse.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";", 1)[0])
      .join("; ");

    if (!cookies) {
      return redirectToConfiguredShopifyUrl(request, product, productId);
    }

    const checkoutResponse = await fetch(`${shopifyVariant.storeOrigin}/checkout`, {
      headers: {
        "Accept-Language": requestHeaders["Accept-Language"],
        Cookie: cookies,
      },
      redirect: "manual",
      cache: "no-store",
    });
    const checkoutUrl = checkoutResponse.headers.get("location");

    if (!checkoutUrl || !isAllowedCheckoutUrl(checkoutUrl)) {
      return redirectToConfiguredShopifyUrl(request, product, productId);
    }

    return noIndexRedirect(checkoutUrl);
  } catch {
    return redirectToConfiguredShopifyUrl(request, product, productId);
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
  const fallbackUrl = new URL(`/shop/${encodeURIComponent(productId)}`, request.url);
  fallbackUrl.searchParams.set("checkoutError", "1");
  return noIndexRedirect(fallbackUrl);
}

function redirectToConfiguredShopifyUrl(
  request: NextRequest,
  product: NonNullable<ReturnType<typeof getShopProductById>>,
  productId: string
) {
  const selectedVariantId = request.nextUrl.searchParams.get("variantId");
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
  const checkoutQuantity = parseCheckoutQuantity(request.nextUrl.searchParams.get("quantity"));
  const configuredUrl = getAllowedConfiguredShopifyUrl(
    selectedVariant?.shopifyUrl ?? product.shopifyUrl,
    checkoutQuantity
  );

  if (configuredUrl) {
    return noIndexRedirect(configuredUrl);
  }

  return redirectToProduct(request, productId);
}

function getAllowedConfiguredShopifyUrl(value: string, quantity: number) {
  try {
    const url = new URL(value);

    if (url.protocol === "https:" && url.hostname === SHOPIFY_STORE_HOST) {
      const cartMatch = url.pathname.match(/^\/cart\/(\d+):\d+$/);
      if (cartMatch) {
        url.pathname = `/cart/${cartMatch[1]}:${quantity}`;
      }
      return url;
    }
  } catch {
    return null;
  }

  return null;
}

function parseCheckoutQuantity(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(MAX_CHECKOUT_QUANTITY, Math.trunc(parsed)));
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
