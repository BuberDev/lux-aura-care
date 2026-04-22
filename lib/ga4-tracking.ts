export type AffiliateClickEvent = {
  productId: string;
  productName: string;
  placement:
    | "product-card"
    | "bundle"
    | "article"
    | "inline-cta"
    | "hero"
    | "product-hero"
    | "product-problem-solution"
    | "product-routine"
    | "product-social-proof"
    | "product-final-cta";
  bundleId?: string;
  category?: string;
};

export function trackAffiliateClick(event: AffiliateClickEvent) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn("GA4 not initialized");
    return;
  }

  gtag("event", "affiliate_click", {
    product_id: event.productId,
    product_name: event.productName,
    placement: event.placement,
    bundle_id: event.bundleId,
    category: event.category,
    timestamp: new Date().toISOString(),
  });
}

export function trackAffiliateConversion(
  event: Omit<AffiliateClickEvent, "placement"> & {
    revenue: number;
    orderId: string;
  }
) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn("GA4 not initialized");
    return;
  }

  gtag("event", "purchase", {
    value: event.revenue,
    currency: "USD",
    items: [
      {
        item_id: event.productId,
        item_name: event.productName,
        item_category: event.category,
        price: event.revenue,
      },
    ],
    transaction_id: event.orderId,
  });
}
