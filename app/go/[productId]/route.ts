import { NextResponse, type NextRequest } from "next/server";

import {
  buildAmazonAffiliateUrl,
  getTrafficContextFromSearchParams,
  hasPolishAmazonOffer,
} from "@/lib/affiliate";
import { TRACKING_COOKIES, sanitizeTrackingValue } from "@/lib/tracking";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localizePathname } from "@/lib/i18n/path";
import { getProductById } from "@/lib/site-data";

type GoRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(request: NextRequest, context: GoRouteContext) {
  const { productId } = await context.params;
  const searchContext = getTrafficContextFromSearchParams(request.nextUrl.searchParams);
  const queryLocale = request.nextUrl.searchParams.get("locale");
  const requestLocale = request.headers.get("x-lux-aura-locale");
  const locale = isLocale(queryLocale)
    ? queryLocale
    : isLocale(requestLocale)
      ? requestLocale
      : defaultLocale;
  const product = getProductById(productId);

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

  const internationalFallbackConfirmed =
    request.nextUrl.searchParams.get("market") === "us" &&
    request.nextUrl.searchParams.get("confirmed") === "1";

  if (locale === "pl" && product && !hasPolishAmazonOffer(productId) && !internationalFallbackConfirmed) {
    const noticeUrl = new URL(
      localizePathname(`/amazon-com/${encodeURIComponent(productId)}`, locale),
      request.url
    );

    if (source) noticeUrl.searchParams.set("source", source);
    if (campaign) noticeUrl.searchParams.set("campaign", campaign);
    if (pinId) noticeUrl.searchParams.set("pin", pinId);

    const noticeResponse = NextResponse.redirect(noticeUrl, 307);
    noticeResponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return noticeResponse;
  }

  const destination = buildAmazonAffiliateUrl(productId, { source, campaign, pinId }, locale);

  if (!destination) {
    const fallback = NextResponse.redirect(
      new URL(localizePathname("/favorites", locale), request.url),
      307
    );
    fallback.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return fallback;
  }

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
