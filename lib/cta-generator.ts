import { type Product, productProofById } from "@/lib/site-data";

export type CTAStrategy = "high-urgency" | "trust-signal" | "benefit-led" | "scarcity" | "social-proof";

export function generateCTALabel(
  product: Product,
  strategy: CTAStrategy = "benefit-led",
  isCompact: boolean = false
): string {
  // Always return the base label so it can be translated correctly via the catalog (e.g. "Sprawdź na Amazon").
  // Dynamic, untranslated strings like "Trending Now" were breaking the UI layout and UX.
  return "Check on Amazon";
}

export function selectCTAStrategy(product: Product): CTAStrategy {
  const proof = productProofById[product.id];

  if (!proof) {
    return "benefit-led";
  }

  const rating = proof.rating ?? 0;
  const reviewCount = parseInt(proof.reviews?.replace(/[^0-9]/g, "") ?? "0", 10);

  // High rating + high reviews = trust signal
  if (rating >= 4.8 && reviewCount > 10000) {
    return "trust-signal";
  }

  // Trending content = social proof
  if (proof.socialProof?.includes("Trending") || proof.socialProof?.includes("Popular")) {
    return "social-proof";
  }

  // Limited time = urgency
  if (proof.socialProof?.includes("Limited-time")) {
    return "high-urgency";
  }

  // Default = benefit-led
  return "benefit-led";
}

export function shouldShowUrgencyBadge(product: Product): boolean {
  const proof = productProofById[product.id];
  if (!proof) return false;

  return (
    proof.urgencySignal?.intensity === "high" ||
    proof.socialProof?.includes("Limited-time") ||
    proof.socialProof?.includes("Trending")
  );
}
