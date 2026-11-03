import assert from "node:assert/strict";
import test from "node:test";

import type { ShopProduct } from "./shop-data";
import { applyLivePrices, type LivePrice } from "./shop-price-mapping";

const first = "https://imp082-pj.myshopify.com/cart/111:1";
const second = "https://imp082-pj.myshopify.com/cart/222:1";
const product = {
  currency: "PLN",
  price: 120,
  compareAtPrice: 140,
  shopifyUrl: first,
  sizes: [
    { id: "one", shopifyUrl: first, price: 120, compareAtPrice: 140 },
    { id: "two", shopifyUrl: second, price: 180, compareAtPrice: 200 },
  ],
} as ShopProduct;

function quote(id: string, price: number, currency: string): [string, LivePrice] {
  return [`gid://shopify/ProductVariant/${id}`, { price, compareAtPrice: price + 20, currency }];
}

test("updates all mapped prices together when the Storefront response is complete", () => {
  const prices = new Map([quote("111", 125, "PLN"), quote("222", 185, "PLN")]);
  const result = applyLivePrices(product, prices);
  assert.equal(result.price, 125);
  assert.equal(result.sizes?.[0].price, 125);
  assert.equal(result.sizes?.[1].price, 185);
  assert.equal(result.currency, "PLN");
});

test("retains the entire snapshot when a choice is missing or currencies conflict", () => {
  assert.equal(applyLivePrices(product, new Map([quote("111", 125, "PLN")])), product);
  assert.equal(applyLivePrices(product, new Map([quote("111", 125, "PLN"), quote("222", 45, "EUR")])), product);
});

test("accepts a complete explicit-market quote in one currency", () => {
  const prices = new Map([quote("111", 30, "EUR"), quote("222", 45, "EUR")]);
  const result = applyLivePrices(product, prices);
  assert.equal(result.currency, "EUR");
  assert.equal(result.sizes?.[1].price, 45);
});
