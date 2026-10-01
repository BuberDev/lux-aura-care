import { NextResponse, type NextRequest } from "next/server";
import { getShopProductById, getShopifyVariant, getShopifyVariantFromUrl } from "@/lib/shop-data";

type StockResponse = {
  quantity: number | null;
  available: boolean;
  status: "available" | "sold-out" | "store-unavailable" | "unknown";
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
): Promise<NextResponse<StockResponse>> {
  const { productId } = await context.params;
  const product = getShopProductById(productId);
  const selectedVariantId = request.nextUrl.searchParams.get("variantId");
  const selectedVariant = product?.variants?.find((variant) => variant.id === selectedVariantId);
  const selectedSizeId = request.nextUrl.searchParams.get("sizeId");
  const selectedSize = selectedVariant?.sizes?.find((size) => size.id === selectedSizeId);
  const selectedShopifyUrl = selectedSize?.shopifyUrl ?? selectedVariant?.shopifyUrl;
  const variant = selectedShopifyUrl
    ? getShopifyVariantFromUrl(selectedShopifyUrl)
    : product
      ? getShopifyVariant(product)
      : null;

  if (!variant) {
    return NextResponse.json(
      { quantity: null, available: false, status: "unknown" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  // DSers fulfills every mapped product on demand. Shopify inventory counts
  // are intentionally not consulted and must never hide the checkout action.
  return NextResponse.json(
    { quantity: null, available: true, status: "available" },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } }
  );
}
