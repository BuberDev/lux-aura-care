import assert from "node:assert/strict";
import test from "node:test";

import {
  hasExactRequestedCartLine,
  normalizeStorefrontCheckoutUrl,
} from "./shopify-checkout-url";

const storeOrigin = "https://imp082-pj.myshopify.com";

test("rebases known Lux checkout domains to the source Shopify store", () => {
  assert.equal(
    normalizeStorefrontCheckoutUrl(
      "https://www.luxauracare.com/checkouts/cn/abc?key=secret",
      storeOrigin
    ),
    "https://imp082-pj.myshopify.com/checkouts/cn/abc?key=secret&_fd=0"
  );
  assert.equal(
    normalizeStorefrontCheckoutUrl("https://luxauracare.pl/cart/c/abc", storeOrigin),
    "https://imp082-pj.myshopify.com/cart/c/abc?_fd=0"
  );
});

test("allows only HTTPS URLs on the source store or Shopify checkout hosts", () => {
  assert.equal(
    normalizeStorefrontCheckoutUrl("https://shop.app/checkout/abc", storeOrigin),
    "https://shop.app/checkout/abc"
  );
  assert.equal(
    normalizeStorefrontCheckoutUrl("https://another-shop.myshopify.com/checkout", storeOrigin),
    null
  );
  assert.equal(normalizeStorefrontCheckoutUrl("http://luxauracare.com/cart", storeOrigin), null);
  assert.equal(
    normalizeStorefrontCheckoutUrl("https://user@luxauracare.com/cart", storeOrigin),
    null
  );
});

test("accepts only the exact requested line in a newly created cart", () => {
  const line = { merchandise: { id: "gid://shopify/ProductVariant/123" }, quantity: 2 };
  assert.equal(hasExactRequestedCartLine([line], line.merchandise.id, 2), true);
  assert.equal(hasExactRequestedCartLine([], line.merchandise.id, 2), false);
  assert.equal(hasExactRequestedCartLine([{ ...line, quantity: 1 }], line.merchandise.id, 2), false);
  assert.equal(hasExactRequestedCartLine([{ ...line, merchandise: { id: "gid://wrong" } }], line.merchandise.id, 2), false);
  assert.equal(hasExactRequestedCartLine([line, line], line.merchandise.id, 2), false);
});
