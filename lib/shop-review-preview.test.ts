import assert from "node:assert/strict";
import test from "node:test";
import { shopProducts } from "./shop-data";
import { sampleReviewCopy } from "./shop-review-preview";

test("editorial review previews stay complete and attached only to active products", () => {
  const active = shopProducts.filter((product) => product.shopifyUrl);
  assert.equal(active.length, 23);
  for (const product of active) {
    const samples = sampleReviewCopy[product.id];
    if (product.reviews?.length) {
      assert.equal(samples, undefined, `${product.id} already has reviews`);
      continue;
    }
    if (!samples) continue;
    assert.equal(samples?.pl.length, 4, `${product.id} Polish examples`);
    assert.equal(samples?.en.length, 4, `${product.id} English examples`);
    assert.ok(samples.pl.every((text) => text.length >= 50), product.id);
    assert.ok(samples.en.every((text) => text.length >= 50), product.id);
  }
  assert.ok(
    Object.keys(sampleReviewCopy).every((productId) => active.some((product) => product.id === productId)),
    "Every editorial review preview must belong to an active product"
  );
});
