import assert from "node:assert/strict";
import test from "node:test";

import type { ShopProduct } from "./shop-data";
import { selectCheckoutItem } from "./shop-checkout-selection";

const baseUrl = "https://imp082-pj.myshopify.com/cart/111:1";
const roseUrl = "https://imp082-pj.myshopify.com/cart/222:1";
const largeUrl = "https://imp082-pj.myshopify.com/cart/333:1";
const product = {
  shopifyUrl: baseUrl,
  variants: [
    { id: "black", shopifyUrl: baseUrl, sizes: [{ id: "small", shopifyUrl: baseUrl }] },
    { id: "rose", shopifyUrl: roseUrl, sizes: [{ id: "small", shopifyUrl: roseUrl }, { id: "large", shopifyUrl: largeUrl }] },
  ],
} as ShopProduct;

test("maps an exact color and size to its Shopify variant", () => {
  const selected = selectCheckoutItem(product, new URLSearchParams("variantId=rose&sizeId=large&quantity=3&country=de&locale=pl"));
  assert.deepEqual(selected, { shopifyUrl: largeUrl, quantity: 3, countryCode: "DE" });
});

test("rejects missing, mismatched, duplicated, and unavailable choices", () => {
  const cases = [
    "sizeId=small",
    "variantId=unknown&sizeId=small",
    "variantId=black&sizeId=large",
    "variantId=rose&sizeId=unknown",
    "variantId=rose&sizeId=small&sizeId=large",
    "variantId=rose&variantId=black&sizeId=small",
  ];
  for (const query of cases) assert.equal(selectCheckoutItem(product, new URLSearchParams(query)), null, query);

  const unavailable = {
    shopifyUrl: baseUrl,
    sizes: [{ id: "small", shopifyUrl: baseUrl, available: false }],
  } as ShopProduct;
  assert.equal(selectCheckoutItem(unavailable, new URLSearchParams("sizeId=small")), null);
});

test("validates quantity and country without using page locale as destination", () => {
  const valid = selectCheckoutItem(product, new URLSearchParams("variantId=black&sizeId=small&locale=pl"));
  assert.equal(valid?.countryCode, null);
  assert.equal(valid?.quantity, 1);
  for (const quantity of ["0", "-1", "1.5", "11", "NaN", "2x", ""]) {
    assert.equal(selectCheckoutItem(product, new URLSearchParams(`variantId=black&sizeId=small&quantity=${quantity}`)), null);
  }
  for (const country of ["ZZ", "EU", "PLN", "", "US&country=PL"]) {
    assert.equal(selectCheckoutItem(product, new URLSearchParams(`variantId=black&sizeId=small&country=${country}`)), null);
  }
  assert.equal(selectCheckoutItem(product, new URLSearchParams("variantId=black&sizeId=small&country=US&locale=pl"))?.countryCode, "US");
});
