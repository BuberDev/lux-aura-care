import { NextResponse, type NextRequest } from "next/server";

import {
  buildAmazonAffiliateUrl,
  getTrafficContextFromSearchParams,
} from "@/lib/affiliate";
import { TRACKING_COOKIES, sanitizeTrackingValue } from "@/lib/tracking";

type GoRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(request: NextRequest, context: GoRouteContext) {
  const { productId } = await context.params;
  const searchContext = getTrafficContextFromSearchParams(request.nextUrl.searchParams);

  const source =
    searchContext.source ??
    sanitizeTrackingValue(request.cookies.get(TRACKING_COOKIES.source)?.value, 40) ??
    "website";
  const campaign =
    searchContext.campaign ??
    sanitizeTrackingValue(request.cookies.get(TRACKING_COOKIES.campaign)?.value, 60);
  const pinId =
    searchContext.pinId ??
    sanitizeTrackingValue(request.cookies.get(TRACKING_COOKIES.pinId)?.value, 80);

  const destination = buildAmazonAffiliateUrl(productId, { source, campaign, pinId });

  if (!destination) {
    const fallback = NextResponse.redirect(new URL("/favorites", request.url), 307);
    fallback.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return fallback;
  }

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
