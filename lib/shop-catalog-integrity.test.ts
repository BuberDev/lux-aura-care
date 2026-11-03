import assert from "node:assert/strict";
import test from "node:test";
import { shopProducts, getShopifyVariantFromUrl } from "./shop-data";
import { selectCheckoutItem } from "./shop-checkout-selection";
import { shopifyPriceSnapshot } from "./shopify-price-snapshot";
import { getShopPageProfile, getShopProductFaq } from "./shop-page-engine";
import { OWNER_FULFILLED_PRODUCT_HANDLE } from "./shop-pricing-policy";
import { translateText } from "./i18n/messages";

const active = shopProducts.filter((product) => product.shopifyUrl);

test("every checkout choice has a unique Shopify variant and a valid fallback price", () => {
  const seen = new Set<string>();
  for (const product of active) {
    for (const variant of product.variants?.length ? product.variants : [undefined]) {
      const sizes = variant?.sizes ?? product.sizes;
      for (const size of sizes?.length ? sizes : [undefined]) {
        const params = new URLSearchParams({ quantity: "1", locale: "pl" });
        if (variant) params.set("variantId", variant.id);
        if (size) params.set("sizeId", size.id);
        const choice = `${product.id}/${variant?.id ?? "base"}/${size?.id ?? "base"}`;
        const selection = selectCheckoutItem(product, params);
        assert.ok(selection?.shopifyUrl, choice);
        const shopify = getShopifyVariantFromUrl(selection.shopifyUrl);
        assert.ok(shopify, choice);
        assert.equal(seen.has(shopify.variantId), false, `Duplicate checkout: ${choice}`);
        seen.add(shopify.variantId);
        const fallbackPrice = size?.price ?? variant?.price ?? product.price;
        assert.ok(Number.isFinite(fallbackPrice) && fallbackPrice > 0, `Invalid price: ${choice}`);
        const snapshot = shopifyPriceSnapshot[shopify.variantId];
        if (snapshot) {
          assert.equal(snapshot.currency, "PLN", choice);
          assert.equal(fallbackPrice, snapshot.price, choice);
        }
        assert.equal(selection.quantity, 1, choice);
        assert.equal(selection.countryCode, null, "Interface language must not select a shipping country");
      }
    }
  }
  assert.equal(active.length, 23);
  assert.equal(seen.size, 161);
  assert.ok(
    Object.keys(shopifyPriceSnapshot).every((variantId) => seen.has(variantId)),
    "Every audited Shopify price must still belong to an active checkout choice"
  );
});

test("dress offers seven patterns, both sleeve lengths and all eight sizes", () => {
  const dress = active.find((product) => product.id === "floral-grace-maxi-dress")!;
  assert.equal(dress.variants?.length, 14);
  const families = new Set(dress.variants?.map((variant) => variant.styleFamily));
  assert.equal(families.size, 7);
  for (const family of families) {
    assert.deepEqual(dress.variants!.filter((variant) => variant.styleFamily === family).map((variant) => variant.sleeveLength).sort(), ["long", "short"]);
  }
  for (const variant of dress.variants!) {
    assert.deepEqual(variant.sizes?.map((size) => size.label), ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]);
  }
});

test("all 112 dress selections preserve the repaired Shopify selling price in PLN", () => {
  const dress = active.find((product) => product.id === "floral-grace-maxi-dress")!;
  assert.equal(dress.currency, "PLN");
  assert.equal(dress.price, 229.99);
  let checked = 0;
  for (const variant of dress.variants!) {
    assert.equal(variant.price, 229.99, variant.id);
    for (const size of variant.sizes!) {
      assert.equal(size.price, 229.99, `${variant.id}/${size.id}`);
      const id = getShopifyVariantFromUrl(size.shopifyUrl!)!.variantId;
      assert.equal(shopifyPriceSnapshot[id].price, 229.99, id);
      assert.equal(shopifyPriceSnapshot[id].compareAtPrice, 229.99, "No invented discount");
      checked++;
    }
  }
  assert.equal(checked, 112);
});

test("serum volumes each buy one distinct Shopify duo, not two base items", () => {
  const serum = active.find((product) => product.id === "vitamin-c-retinol-serum-duo")!;
  assert.deepEqual(serum.sizes?.map((size) => size.label), ["30 ml", "60 ml"]);
  assert.notEqual(serum.sizes![0].shopifyUrl, serum.sizes![1].shopifyUrl);
  for (const size of serum.sizes!) assert.equal(size.checkoutQuantity ?? 1, 1);
});

test("owner fulfillment stays exclusive to the branded set", () => {
  assert.deepEqual(active.filter((product) => product.fulfillment === "owner").map((product) => product.id), [OWNER_FULFILLED_PRODUCT_HANDLE]);
});

test("all active product pages have individual PL and EN content and FAQ", () => {
  for (const product of active) {
    const pl = getShopPageProfile(product.id, "pl");
    const en = getShopPageProfile(product.id, "en");
    if (pl && en) {
      assert.notEqual(pl.description, en.description, product.id);
    } else {
      assert.ok(product.description.trim(), `${product.id} description`);
      assert.ok(product.benefits.length >= 3, `${product.id} benefits`);
      assert.ok(product.howToUse.length >= 3, `${product.id} usage steps`);
    }
    for (const locale of ["pl", "en"] as const) {
      const faq = getShopProductFaq(product.id, locale, product.faq);
      assert.ok(faq.length >= 3, product.id);
      assert.ok(faq.every(({ q, a }) => q.trim() && a.trim()), product.id);
    }
  }
  assert.equal(translateText("pl", "Black Stone"), "Czarny kamień");
  assert.equal(translateText("pl", "Luxe Patches"), "Płatki pod oczy");
});
