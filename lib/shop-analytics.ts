export type ShopCheckoutEvent = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  currency: string;
  variantId?: string;
  placement: "buy-box" | "final-cta" | "sticky-drawer" | "lightbox";
};

export type ShopViewItemEvent = {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  category?: string;
};

type PixelWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
};

function getPixels() {
  if (typeof window === "undefined") return null;
  return window as PixelWindow;
}

export function trackShopViewItem(event: ShopViewItemEvent) {
  const w = getPixels();
  if (!w) return;

  w.gtag?.("event", "view_item", {
    currency: event.currency,
    value: event.price,
    items: [
      {
        item_id: event.productId,
        item_name: event.productName,
        item_category: event.category,
        price: event.price,
      },
    ],
  });

  w.fbq?.("track", "ViewContent", {
    content_ids: [event.productId],
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value: event.price,
  });

  w.ttq?.track("ViewContent", {
    content_id: event.productId,
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value: event.price,
  });
}

export function trackShopAddToCart(event: ShopCheckoutEvent) {
  const w = getPixels();
  if (!w) return;

  const value = event.price * event.quantity;

  w.gtag?.("event", "add_to_cart", {
    currency: event.currency,
    value,
    items: [
      {
        item_id: event.productId,
        item_name: event.productName,
        item_variant: event.variantId,
        price: event.price,
        quantity: event.quantity,
      },
    ],
  });

  w.fbq?.("track", "AddToCart", {
    content_ids: [event.productId],
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value,
    num_items: event.quantity,
  });

  w.ttq?.track("AddToCart", {
    content_id: event.productId,
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value,
    quantity: event.quantity,
  });
}

export function trackShopBeginCheckout(event: ShopCheckoutEvent) {
  const w = getPixels();
  if (!w) return;

  const value = event.price * event.quantity;

  w.gtag?.("event", "begin_checkout", {
    currency: event.currency,
    value,
    placement: event.placement,
    items: [
      {
        item_id: event.productId,
        item_name: event.productName,
        item_variant: event.variantId,
        price: event.price,
        quantity: event.quantity,
      },
    ],
  });

  w.fbq?.("track", "InitiateCheckout", {
    content_ids: [event.productId],
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value,
    num_items: event.quantity,
  });

  w.ttq?.track("InitiateCheckout", {
    content_id: event.productId,
    content_name: event.productName,
    content_type: "product",
    currency: event.currency,
    value,
    quantity: event.quantity,
  });
}
