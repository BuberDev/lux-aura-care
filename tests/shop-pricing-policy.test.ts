import assert from "node:assert/strict";
import test from "node:test";
import { decideSupplierPrice, OWNER_FULFILLED_PRODUCT_HANDLE, type PricingPolicyInput } from "../lib/shop-pricing-policy";

const now = "2026-10-03T12:00:00.000Z";
const base: PricingPolicyInput = {
  productHandle: "sample-serum-tool",
  sku: "SKU-RED-2PK",
  destination: "PL",
  packQuantity: 2,
  currentPriceGrosze: 15_000,
  now,
  quote: {
    verified: true,
    sku: "SKU-RED-2PK",
    destination: "PL",
    currency: "PLN",
    landedCostMinor: 5_000,
    packQuantity: 2,
    quotedAt: "2026-10-03T10:00:00.000Z",
    validUntil: "2026-10-04T10:00:00.000Z",
    includesSupplierShipping: true,
  },
};

test("applies the absolute PLN 80 floor and preserves a higher current price", () => {
  const result = decideSupplierPrice(base);
  assert.equal(result.status, "priced");
  assert.equal(result.landedCostGrosze, 5_000);
  assert.equal(result.applicableFloorGrosze, 8_000);
  assert.equal(result.requiredContributionGrosze, 8_000);
  assert.equal(result.targetPriceGrosze, 15_000);
  assert.equal(result.currentContributionGrosze, 10_000);
  assert.equal(result.targetContributionGrosze, 10_000);
  assert.equal(result.upliftGrosze, 0);
});

test("raises price to cost plus the floor without applying a percentage", () => {
  const result = decideSupplierPrice({ ...base, currentPriceGrosze: 5_001 });
  assert.equal(result.targetPriceGrosze, 13_000);
});

test("preserves a historical approved minimum above the live price", () => {
  const result = decideSupplierPrice({ ...base, currentPriceGrosze: 13_000, minPreviouslyApprovedPriceGrosze: 20_000 });
  assert.equal(result.targetPriceGrosze, 20_000);
  assert.equal(result.targetContributionGrosze, 15_000);
  assert.equal(result.upliftGrosze, 7_000);
  assert.equal(decideSupplierPrice({ ...base, minPreviouslyApprovedPriceGrosze: 1.5 }).status, "unverified");
});

test("uses manually flagged PLN 160 floor without a shipping threshold", () => {
  const result = decideSupplierPrice({ ...base, currentPriceGrosze: 5_000, expensiveShippingManuallyFlagged: true });
  assert.equal(result.applicableFloorGrosze, 16_000);
  assert.equal(result.targetPriceGrosze, 21_000);
});

test("excludes the owner-fulfilled product", () => {
  const result = decideSupplierPrice({ ...base, productHandle: OWNER_FULFILLED_PRODUCT_HANDLE });
  assert.equal(result.status, "excluded");
  assert.equal(result.targetPriceGrosze, null);
});

test("refuses unverified, stale, mismatched, incomplete, or malformed quote evidence", () => {
  const variations: PricingPolicyInput[] = [
    { ...base, quote: { ...base.quote, verified: false } },
    { ...base, quote: { ...base.quote, sku: "OTHER" } },
    { ...base, destination: "DE" },
    { ...base, packQuantity: 1 },
    { ...base, quote: { ...base.quote, validUntil: "2026-10-03T11:59:59.000Z" } },
    { ...base, quote: { ...base.quote, includesSupplierShipping: false } },
  ];
  for (const input of variations) {
    const result = decideSupplierPrice(input);
    assert.equal(result.status, "unverified");
    assert.equal(result.targetPriceGrosze, null);
  }
});

test("requires fresh matching FX for foreign currency and rounds converted cost upward", () => {
  const quote = {
    ...base.quote,
    currency: "USD",
    landedCostMinor: 1_001,
    fx: {
      sourceCurrency: "USD",
      plnGroszeNumerator: 4_001,
      plnGroszeDenominator: 100,
      verifiedAt: "2026-10-03T10:00:00.000Z",
      validUntil: "2026-10-04T10:00:00.000Z",
    },
  };
  const result = decideSupplierPrice({ ...base, quote, currentPriceGrosze: 0 });
  assert.equal(result.landedCostGrosze, 40_051);
  assert.equal(result.targetPriceGrosze, 48_051);
  assert.equal(decideSupplierPrice({ ...base, quote: { ...quote, fx: { ...quote.fx, sourceCurrency: "EUR" } } }).status, "unverified");
  assert.equal(decideSupplierPrice({ ...base, quote: { ...quote, fx: { ...quote.fx, validUntil: "2026-10-03T11:00:00.000Z" } } }).status, "unverified");
});

test("uses exact rational ceiling for divisible, fractional, and boundary FX values", () => {
  const foreign = (landedCostMinor: number, numerator: number, denominator: number) => ({
    ...base.quote,
    currency: "USD",
    landedCostMinor,
    fx: {
      sourceCurrency: "USD",
      plnGroszeNumerator: numerator,
      plnGroszeDenominator: denominator,
      verifiedAt: "2026-10-03T10:00:00.000Z",
      validUntil: "2026-10-04T10:00:00.000Z",
    },
  });
  const divisible = decideSupplierPrice({ ...base, quote: foreign(100, 2, 4), currentPriceGrosze: 0 });
  assert.equal(divisible.landedCostGrosze, 50);
  const fractional = decideSupplierPrice({ ...base, quote: foreign(101, 2, 4), currentPriceGrosze: 0 });
  assert.equal(fractional.landedCostGrosze, 51);
  const max = Number.MAX_SAFE_INTEGER;
  const boundary = decideSupplierPrice({ ...base, quote: foreign(max, max, max), currentPriceGrosze: max, minPreviouslyApprovedPriceGrosze: max });
  assert.equal(boundary.status, "unverified"); // Cost is safe; adding the required floor is not.
  const overflowCost = decideSupplierPrice({ ...base, quote: foreign(max, 2, 1), currentPriceGrosze: 0 });
  assert.equal(overflowCost.status, "unverified");
});

test("accepts the Unix epoch as a valid quote timestamp", () => {
  const result = decideSupplierPrice({
    ...base,
    now: "1970-01-01T00:00:00.000Z",
    quote: { ...base.quote, quotedAt: "1970-01-01T00:00:00.000Z", validUntil: "1970-01-01T00:00:01.000Z" },
  });
  assert.equal(result.status, "priced");
});

test("rejects an FX rate on PLN quotes and an invalid current price", () => {
  assert.equal(decideSupplierPrice({ ...base, quote: { ...base.quote, fx: { sourceCurrency: "PLN", plnGroszeNumerator: 1, plnGroszeDenominator: 1, verifiedAt: now, validUntil: "2026-10-04T10:00:00Z" } } }).status, "unverified");
  assert.equal(decideSupplierPrice({ ...base, currentPriceGrosze: -1 }).status, "unverified");
});
