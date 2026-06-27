import { getProductById } from "@/lib/site-data";
import type { Locale } from "@/lib/i18n/config";
import { getProductMarketVariant } from "@/lib/product-market";
import { sanitizeTrackingValue, type TrafficContext } from "@/lib/tracking";

const AMAZON_HOST_PATTERN = /(^|\.)amazon\./i;

function isAmazonUrl(url: URL) {
  return AMAZON_HOST_PATTERN.test(url.hostname);
}

export function getAffiliateRoute(productId: string, placement?: string) {
  const searchParams = new URLSearchParams({ source: "website" });
  const product = getProductById(productId);
  if (placement) {
    searchParams.set("campaign", placement);
  }
  if (product && !product.marketVariants.pl) {
    searchParams.set("fallbackMarket", "us");
  }

  return `/go/${encodeURIComponent(productId)}?${searchParams.toString()}`;
}

export function hasPolishAmazonOffer(productId: string) {
  return Boolean(getProductById(productId)?.marketVariants.pl);
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
  context: TrafficContext,
  locale: Locale = "en"
) {
  const product = getProductById(productId);
  if (!product) {
    return undefined;
  }

  let destination: URL;
  try {
    const { variant } = getProductMarketVariant(product, locale);
    destination = new URL(variant.affiliateUrl);
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
  context: TrafficContext & { bundleId?: string },
  locale: Locale = "en"
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

  return buildAmazonAffiliateUrl(bundleProductIds[0], bundleTrackingContext, locale);
}
