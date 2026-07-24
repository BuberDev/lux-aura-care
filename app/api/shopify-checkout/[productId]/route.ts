import { NextResponse, type NextRequest } from "next/server";

import { getShopifyVariantFromUrl, getShopProductById } from "@/lib/shop-data";

const CHECKOUT_HOSTS = new Set(["shop.app", "checkout.shopify.com"]);
const SHOPIFY_STORE_HOST = "k50k7g-j7.myshopify.com";
const STOREFRONT_API_VERSION = "2024-10";
const MAX_CHECKOUT_QUANTITY = 10;

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
  const selectedVariantId = request.nextUrl.searchParams.get("variantId");
  const selectedVariant = product?.variants?.find((variant) => variant.id === selectedVariantId);
  const selectedShopifyUrl = selectedVariant?.shopifyUrl ?? product?.shopifyUrl;
  const shopifyVariant = selectedShopifyUrl ? parseShopifyVariant(selectedShopifyUrl) : null;
  const checkoutQuantity = parseCheckoutQuantity(request.nextUrl.searchParams.get("quantity"));
  const buyerCountryCode = getBuyerCountryCode(request);

  if (!product) {
    return redirectToProduct(request, productId);
  }

  if (!shopifyVariant) {
    return redirectToConfiguredShopifyUrl(request, product, productId);
  }

  const storefrontCheckoutUrl = await createStorefrontCheckoutUrl({
    shopifyVariantId: shopifyVariant.variantId,
    quantity: checkoutQuantity,
    buyerCountryCode,
  });

  if (storefrontCheckoutUrl) {
    return noIndexRedirect(storefrontCheckoutUrl);
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

function getBuyerCountryCode(request: NextRequest) {
  const explicitCountry = request.nextUrl.searchParams.get("country")?.toUpperCase();
  if (explicitCountry === "PL") {
    return "PL";
  }

  return request.nextUrl.searchParams.get("locale") === "pl" ? "PL" : null;
}

async function createStorefrontCheckoutUrl({
  shopifyVariantId,
  quantity,
  buyerCountryCode,
}: {
  shopifyVariantId: string;
  quantity: number;
  buyerCountryCode: "PL" | null;
}) {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token || !buyerCountryCode) {
    return null;
  }

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
          query: CART_CREATE_MUTATION,
          variables: {
            input: {
              buyerIdentity: { countryCode: buyerCountryCode },
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
