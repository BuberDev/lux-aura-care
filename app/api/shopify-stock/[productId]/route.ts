import { NextResponse, type NextRequest } from "next/server";
import { getShopProductById, getShopifyVariant, getShopifyVariantFromUrl } from "@/lib/shop-data";

const STORE_DOMAIN = "k50k7g-j7.myshopify.com";
const STOREFRONT_API_VERSION = "2024-10";

const STOCK_QUERY = `
  query GetVariantAvailability($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        availableForSale
        quantityAvailable
      }
    }
  }
`;

type StockResponse = {
  quantity: number | null;
  available: boolean;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
): Promise<NextResponse<StockResponse>> {
  const { productId } = await context.params;
  const product = getShopProductById(productId);
  const selectedVariantId = request.nextUrl.searchParams.get("variantId");
  const selectedVariant = product?.variants?.find((variant) => variant.id === selectedVariantId);
  const variant = selectedVariant?.shopifyUrl
    ? getShopifyVariantFromUrl(selectedVariant.shopifyUrl)
    : product
      ? getShopifyVariant(product)
      : null;

  if (!variant) {
    return NextResponse.json({ quantity: null, available: true }, { status: 404 });
  }

  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { quantity: null, available: true },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  try {
    const globalId = `gid://shopify/ProductVariant/${variant.variantId}`;
    const res = await fetch(
      `https://${STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: STOCK_QUERY, variables: { id: globalId } }),
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ quantity: null, available: true });
    }

    const json = await res.json();
    const node = json?.data?.node;

    return NextResponse.json(
      {
        quantity: node?.quantityAvailable ?? null,
        available: node?.availableForSale ?? true,
      },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ quantity: null, available: true });
  }
}
