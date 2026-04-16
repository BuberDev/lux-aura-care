import { NextResponse, type NextRequest } from "next/server";

import { getPinterestPinById, resolvePinTargetHref } from "@/lib/pinterest-pins";
import { TRACKING_COOKIES, TRACKING_COOKIE_MAX_AGE, withQuery } from "@/lib/tracking";

type PinRouteContext = {
  params: Promise<{ pinId: string }>;
};

const trackingCookieOptions = {
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: TRACKING_COOKIE_MAX_AGE,
  path: "/",
};

export async function GET(request: NextRequest, context: PinRouteContext) {
  const { pinId } = await context.params;
  const pin = getPinterestPinById(pinId);
  const destinationPath = pin ? resolvePinTargetHref(pin.target) : "/";

  const destinationWithTracking = withQuery(destinationPath, {
    utm_source: "pinterest",
    utm_medium: "social",
    utm_campaign: pin?.campaign ?? "pin-traffic",
    pin_id: pinId,
  });

  const response = NextResponse.redirect(new URL(destinationWithTracking, request.url), 307);
  response.cookies.set(TRACKING_COOKIES.source, "pinterest", trackingCookieOptions);
  response.cookies.set(
    TRACKING_COOKIES.campaign,
    pin?.campaign ?? "pin-traffic",
    trackingCookieOptions
  );
  response.cookies.set(TRACKING_COOKIES.pinId, pinId, trackingCookieOptions);

  return response;
}
