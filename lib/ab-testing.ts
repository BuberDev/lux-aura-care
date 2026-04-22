import crypto from "crypto";

export type Variant = "control" | "test";

type TestConfig = {
  id: string;
  variants: { control: unknown; test: unknown };
  salt: string;
  trafficAllocation: number; // 0-100, % of traffic to include in test
};

const activeTests: Record<string, TestConfig> = {
  // Example: CTA button text test
  ctaButtonText: {
    id: "cta-button-text-v1",
    variants: {
      control: "Check on Amazon",
      test: "See Today's Deal",
    },
    salt: "cta-button-text",
    trafficAllocation: 50, // Run with 50% of visitors
  },
  // Example: Product card layout
  productCardLayout: {
    id: "product-card-v1",
    variants: {
      control: "standard",
      test: "compact-with-rating",
    },
    salt: "product-card-layout",
    trafficAllocation: 30,
  },
};

function hashVisitorVariant(visitorId: string, testId: string, salt: string): string {
  const combined = `${visitorId}-${testId}-${salt}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  const hashValue = parseInt(hash.substring(0, 8), 16);
  return hashValue % 2 === 0 ? "control" : "test";
}

export function selectVariant(visitorId: string, testId: string): Variant {
  const test = activeTests[testId];
  if (!test) {
    return "control";
  }

  // Check if visitor should be in test based on traffic allocation
  const trafficHash = crypto.createHash("sha256").update(`${visitorId}-traffic`).digest("hex");
  const trafficValue = parseInt(trafficHash.substring(0, 8), 16);

  if (trafficValue % 100 > test.trafficAllocation) {
    return "control";
  }

  return hashVisitorVariant(visitorId, testId, test.salt) as Variant;
}

export function getVariantValue<T>(testId: string, variant: Variant): T | undefined {
  const test = activeTests[testId];
  if (!test) return undefined;
  return (variant === "control" ? test.variants.control : test.variants.test) as T;
}

export function trackTestExposure(
  visitorId: string,
  testId: string,
  variant: Variant,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag("event", "ab_test_exposure", {
    test_id: testId,
    variant,
    visitor_id: visitorId.substring(0, 8), // Only send first 8 chars for privacy
    ...metadata,
  });
}

export function trackTestConversion(
  visitorId: string,
  testId: string,
  variant: Variant,
  conversionType: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag("event", "ab_test_conversion", {
    test_id: testId,
    variant,
    conversion_type: conversionType,
    visitor_id: visitorId.substring(0, 8),
    ...metadata,
  });
}

export function updateActiveTest(testId: string, config: Partial<TestConfig>) {
  const test = activeTests[testId];
  if (test) {
    Object.assign(test, config);
  }
}

export function getActiveTests() {
  return Object.values(activeTests).map((test) => ({
    id: test.id,
    variants: Object.keys(test.variants),
    trafficAllocation: test.trafficAllocation,
  }));
}
