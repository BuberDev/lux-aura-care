import { NextResponse, type NextRequest } from "next/server";

import {
  TRACKING_COOKIES,
  TRACKING_COOKIE_MAX_AGE,
  sanitizeTrackingValue,
} from "@/lib/tracking";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "@/lib/i18n/config";
import { getLocaleFromPathname, stripLocaleFromPathname } from "@/lib/i18n/path";
import { getArticleBySlug, getProductBySlug } from "@/lib/site-data";

const trackingCookieOptions = {
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: TRACKING_COOKIE_MAX_AGE,
  path: "/",
};

// /favorites/[productId] and /blog/[slug] have a loading.tsx, which makes
// Next.js stream the response and commit a 200 status before notFound()
// can run inside the page. Reject unknown slugs here instead, before any
// rendering starts, so genuinely missing content gets a real 404.
function isMissingContentPath(pathname: string): boolean {
  const favoritesSlug = pathname.match(/^\/favorites\/([^/]+)$/)?.[1];
  if (favoritesSlug) {
    const slug = decodeURIComponent(favoritesSlug);
    return !getProductBySlug(slug, "en") && !getProductBySlug(slug, "pl");
  }

  const blogSlug = pathname.match(/^\/blog\/([^/]+)$/)?.[1];
  if (blogSlug) {
    return !getArticleBySlug(decodeURIComponent(blogSlug));
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocale = getLocaleFromPathname(pathname);
  const headerLocale = request.headers.get("x-lux-aura-locale");
  const internalLocale = isLocale(headerLocale) ? headerLocale : null;
  const isNonLocalizedRoute =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/go/") ||
    pathname.startsWith("/pin/");

  if (!pathnameLocale && !isNonLocalizedRoute && !internalLocale) {
    const cookieLocale = request.cookies.get(localeCookieName)?.value;
    const locale = isLocale(cookieLocale)
      ? cookieLocale
      : getPreferredLocale(request.headers.get("accept-language"));
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

    return NextResponse.redirect(redirectUrl);
  }

  const locale = pathnameLocale ?? internalLocale ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lux-aura-locale", locale);

  const rewriteUrl = request.nextUrl.clone();
  if (pathnameLocale) {
    rewriteUrl.pathname = stripLocaleFromPathname(pathname);
  }

  if (isMissingContentPath(rewriteUrl.pathname)) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/__not-found__";
    return NextResponse.rewrite(notFoundUrl, { request: { headers: requestHeaders } });
  }

  const response = pathnameLocale
    ? NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  const source = sanitizeTrackingValue(
    request.nextUrl.searchParams.get("utm_source") ?? request.nextUrl.searchParams.get("source"),
    40
  );
  const campaign = sanitizeTrackingValue(
    request.nextUrl.searchParams.get("utm_campaign") ??
      request.nextUrl.searchParams.get("campaign"),
    60
  );
  const pinId = sanitizeTrackingValue(
    request.nextUrl.searchParams.get("pin_id") ?? request.nextUrl.searchParams.get("pin"),
    80
  );

  if (source) {
    response.cookies.set(TRACKING_COOKIES.source, source, trackingCookieOptions);
  }

  if (campaign) {
    response.cookies.set(TRACKING_COOKIES.campaign, campaign, trackingCookieOptions);
  }

  if (pinId) {
    response.cookies.set(TRACKING_COOKIES.pinId, pinId, trackingCookieOptions);
  }

  return response;
}

function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const requestedLanguages = acceptLanguage
    .split(",")
    .map((entry) => {
      const [language, quality = "q=1"] = entry.trim().split(";");
      return {
        language: language.toLowerCase().split("-")[0],
        quality: Number.parseFloat(quality.replace("q=", "")) || 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  const match = requestedLanguages.find(({ language }) => isLocale(language));
  return match && isLocale(match.language) ? match.language : defaultLocale;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
