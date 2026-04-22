import { getProductById } from "@/lib/site-data";
import { sanitizeTrackingValue, withQuery, type TrafficContext } from "@/lib/tracking";

const AMAZON_HOST_PATTERN = /(^|\.)amazon\./i;

function isAmazonUrl(url: URL) {
  return AMAZON_HOST_PATTERN.test(url.hostname);
}

export function getAffiliateRoute(productId: string, placement?: string) {
  return withQuery(`/go/${productId}`, { placement });
}

export function getTrafficContextFromSearchParams(searchParams: URLSearchParams): TrafficContext {
  return {
    source: sanitizeTrackingValue(
      searchParams.get("utm_source") ?? searchParams.get("source"),
      40
    ),
    campaign: sanitizeTrackingValue(
      searchParams.get("utm_campaign") ?? searchParams.get("campaign"),
      60
    ),
    pinId: sanitizeTrackingValue(searchParams.get("pin_id") ?? searchParams.get("pin"), 80),
  };
}

export function buildAmazonAffiliateUrl(
  productId: string,
  context: TrafficContext
) {
  const product = getProductById(productId);
  if (!product) {
    return undefined;
  }

  let destination: URL;
  try {
    destination = new URL(product.amazonUrl);
  } catch {
    return undefined;
  }

  if (isAmazonUrl(destination)) {
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG?.trim();
    if (associateTag && !destination.searchParams.has("tag")) {
      destination.searchParams.set("tag", associateTag);
    }

    const subtagParts = [
      context.source ? `src:${context.source}` : "",
      context.campaign ? `cmp:${context.campaign}` : "",
      context.pinId ? `pin:${context.pinId}` : "",
      `pid:${productId}`,
    ].filter(Boolean);

    if (subtagParts.length > 0) {
      destination.searchParams.set("ascsubtag", subtagParts.join("|").slice(0, 120));
    }
  }

  return destination;
}

export function buildBundleAffiliateUrl(
  bundleProductIds: string[],
  context: TrafficContext & { bundleId?: string }
) {
  if (bundleProductIds.length === 0) {
    return undefined;
  }

  const firstProduct = getProductById(bundleProductIds[0]);
  if (!firstProduct) {
    return undefined;
  }

  const bundleTrackingContext = {
    ...context,
    campaign: context.bundleId ? `bundle-${context.bundleId}` : context.campaign,
  };

  return buildAmazonAffiliateUrl(bundleProductIds[0], bundleTrackingContext);
}
