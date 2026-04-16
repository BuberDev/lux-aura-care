import { NextResponse, type NextRequest } from "next/server";

import {
  TRACKING_COOKIES,
  TRACKING_COOKIE_MAX_AGE,
  sanitizeTrackingValue,
} from "@/lib/tracking";

const trackingCookieOptions = {
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: TRACKING_COOKIE_MAX_AGE,
  path: "/",
};

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
