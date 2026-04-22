import { type Product, productProofById } from "@/lib/site-data";

export type CTAStrategy = "high-urgency" | "trust-signal" | "benefit-led" | "scarcity" | "social-proof";

export function generateCTALabel(
  product: Product,
  strategy: CTAStrategy = "benefit-led",
  isCompact: boolean = false
): string {
  const proof = productProofById[product.id];

  switch (strategy) {
    case "high-urgency":
      return isCompact ? "Limited Stock" : "See Today's Limited Deal";

    case "scarcity":
      return isCompact ? "Last Available" : `Only 3 Left - Buy Now`;

    case "social-proof":
      if (proof?.socialProof.includes("Trending")) {
        return isCompact ? "Trending Now" : "Trending on Pinterest - Buy Now";
      }
      if (proof?.socialProof.includes("Popular")) {
        return isCompact ? "Most Popular" : `Join 1000+ Owners`;
      }
      return isCompact ? "Top Pick" : "See Why 10K+ Saved This";

    case "trust-signal":
      return isCompact
        ? `⭐ ${proof?.rating.toFixed(1)}/5`
        : `Highly Rated (${proof?.rating.toFixed(1)}/5) - Add to Cart`;

    case "benefit-led":
    default:
      return isCompact ? "View on Amazon" : `Check on Amazon - ${product.benefit}`;
  }
}

export function selectCTAStrategy(product: Product): CTAStrategy {
  const proof = productProofById[product.id];

  if (!proof) {
    return "benefit-led";
  }

  const rating = proof.rating;
  const reviewCount = parseInt(proof.reviews.replace(/[^0-9]/g, ""), 10);

  // High rating + high reviews = trust signal
  if (rating >= 4.8 && reviewCount > 10000) {
    return "trust-signal";
  }

  // Trending content = social proof
  if (proof.socialProof.includes("Trending") || proof.socialProof.includes("Popular")) {
    return "social-proof";
  }

  // Limited time = urgency
  if (proof.socialProof.includes("Limited-time")) {
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
    proof.socialProof.includes("Limited-time") ||
    proof.socialProof.includes("Trending")
  );
}
