/** Pure pricing guard for a verified supplier quote. All money uses integer minor units. */
export const OWNER_FULFILLED_PRODUCT_HANDLE = "lux-aura-face-roller-gua-sha-set";

export type VerifiedFx = {
  sourceCurrency: string;
  /** Exact rational PLN grosze per source-currency minor unit. */
  plnGroszeNumerator: number;
  plnGroszeDenominator: number;
  verifiedAt: string;
  validUntil: string;
};

export type SupplierQuote = {
  verified: boolean;
  sku: string;
  destination: string;
  currency: string;
  /** Supplier product plus supplier delivery, in the quote currency's minor units. */
  landedCostMinor: number;
  packQuantity: number;
  quotedAt: string;
  validUntil: string;
  /** True only when an actual supplier shipping quote was included. */
  includesSupplierShipping: boolean;
  /** Required for non-PLN quotes. */
  fx?: VerifiedFx;
};

export type PricingPolicyInput = {
  productHandle: string;
  sku: string;
  destination: string;
  packQuantity: number;
  quote: SupplierQuote;
  /** Observed approved selling price, in PLN grosze. Never reduced by this policy. */
  currentPriceGrosze: number;
  /** Optional higher historical approved minimum, in PLN grosze. */
  minPreviouslyApprovedPriceGrosze?: number;
  /** Explicit owner flag; no automatic expensive-shipping cutoff is applied. */
  expensiveShippingManuallyFlagged?: boolean;
  now?: string;
};

export type PricingDecision = {
  status: "priced" | "unverified" | "excluded";
  reason: string;
  targetPriceGrosze: number | null;
  landedCostGrosze: number | null;
  requiredContributionGrosze: number | null;
  applicableFloorGrosze: number | null;
  currentContributionGrosze: number | null;
  targetContributionGrosze: number | null;
  upliftGrosze: number | null;
};

const rejected = (reason: string, status: "unverified" | "excluded" = "unverified"): PricingDecision => ({
  status, reason, targetPriceGrosze: null, landedCostGrosze: null,
  requiredContributionGrosze: null, applicableFloorGrosze: null, currentContributionGrosze: null,
  targetContributionGrosze: null, upliftGrosze: null,
});

function pastOrCurrentDate(value: string, now: number): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed <= now ? parsed : null;
}

function futureDate(value: string, now: number): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed > now ? parsed : null;
}

export function decideSupplierPrice(input: PricingPolicyInput): PricingDecision {
  if (input.productHandle === OWNER_FULFILLED_PRODUCT_HANDLE) {
    return rejected("Owner-fulfilled product is excluded from supplier pricing automation.", "excluded");
  }
  const q = input.quote;
  const now = Date.parse(input.now ?? new Date().toISOString());
  if (!Number.isFinite(now)) return rejected("Evaluation time is invalid.");
  if (!q.verified) return rejected("Supplier quote is not verified.");
  if (!input.sku.trim() || q.sku !== input.sku) return rejected("Supplier quote SKU is missing or does not match the selected SKU.");
  if (!input.destination.trim() || q.destination !== input.destination) return rejected("Supplier quote destination is missing or does not match the requested destination.");
  if (!Number.isSafeInteger(input.packQuantity) || input.packQuantity <= 0 || q.packQuantity !== input.packQuantity) {
    return rejected("Supplier quote pack quantity is missing or does not match the selected pack.");
  }
  if (!q.includesSupplierShipping) return rejected("Supplier delivery cost is not included in the quote.");
  if (!Number.isSafeInteger(q.landedCostMinor) || q.landedCostMinor < 0) return rejected("Supplier landed cost is invalid.");
  if (pastOrCurrentDate(q.quotedAt, now) === null || futureDate(q.validUntil, now) === null) return rejected("Supplier quote is stale or has invalid validity dates.");
  if (!Number.isSafeInteger(input.currentPriceGrosze) || input.currentPriceGrosze < 0) return rejected("Observed current selling price is invalid.");
  if (input.minPreviouslyApprovedPriceGrosze !== undefined &&
      (!Number.isSafeInteger(input.minPreviouslyApprovedPriceGrosze) || input.minPreviouslyApprovedPriceGrosze < 0)) {
    return rejected("Previously approved minimum selling price is invalid.");
  }

  let landedCostGrosze: number;
  if (q.currency === "PLN") {
    if (q.fx) return rejected("A PLN quote must not use a currency conversion rate.");
    landedCostGrosze = q.landedCostMinor;
  } else {
    const fx = q.fx;
    if (!fx || fx.sourceCurrency !== q.currency) return rejected("A matching verified currency rate is required for this quote.");
    if (!Number.isSafeInteger(fx.plnGroszeNumerator) || fx.plnGroszeNumerator <= 0 ||
        !Number.isSafeInteger(fx.plnGroszeDenominator) || fx.plnGroszeDenominator <= 0) {
      return rejected("Verified currency rate is invalid.");
    }
    if (pastOrCurrentDate(fx.verifiedAt, now) === null || futureDate(fx.validUntil, now) === null) return rejected("Currency rate is stale or has invalid validity dates.");
    const numerator = BigInt(q.landedCostMinor) * BigInt(fx.plnGroszeNumerator);
    const denominator = BigInt(fx.plnGroszeDenominator);
    const convertedCeiling = (numerator + denominator - BigInt(1)) / denominator;
    if (convertedCeiling > BigInt(Number.MAX_SAFE_INTEGER)) return rejected("Converted landed cost exceeds safe integer range.");
    landedCostGrosze = Number(convertedCeiling); // Round costs up so the contribution floor cannot be understated.
  }

  const applicableFloorGrosze = input.expensiveShippingManuallyFlagged ? 16_000 : 8_000;
  const requiredContributionGrosze = applicableFloorGrosze;
  const minimumFloorPrice = landedCostGrosze + requiredContributionGrosze;
  if (!Number.isSafeInteger(minimumFloorPrice)) return rejected("Required floor price exceeds safe integer range.");
  const targetPriceGrosze = Math.max(
    input.currentPriceGrosze,
    input.minPreviouslyApprovedPriceGrosze ?? 0,
    minimumFloorPrice,
  );
  const targetContributionGrosze = targetPriceGrosze - landedCostGrosze;
  const upliftGrosze = targetPriceGrosze - input.currentPriceGrosze;
  if (!Number.isSafeInteger(targetContributionGrosze) || !Number.isSafeInteger(upliftGrosze)) {
    return rejected("Price outcome exceeds safe integer range.");
  }
  return {
    status: "priced",
    reason: input.expensiveShippingManuallyFlagged
      ? "Verified supplier landed cost with manually selected PLN 160 contribution floor; current price is preserved."
      : "Verified supplier landed cost with PLN 80 contribution floor; current price is preserved.",
    targetPriceGrosze,
    landedCostGrosze,
    requiredContributionGrosze,
    applicableFloorGrosze,
    currentContributionGrosze: input.currentPriceGrosze - landedCostGrosze,
    targetContributionGrosze,
    upliftGrosze,
  };
}
