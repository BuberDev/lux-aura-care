import type { CategoryId, Product, ProductProof } from "@/lib/site-data";

type DetailedBenefit = {
  title: string;
  description: string;
};

type RitualStep = {
  title: string;
  description: string;
};

type CategoryNarrative = {
  emotionalHook: string;
  heroBenefits: string[];
  quickBenefits: string[];
  problemHeadline: string;
  problemParagraph: string;
  solutionParagraph: string;
  detailedBenefits: DetailedBenefit[];
  ritualTitle: string;
  ritualSteps: RitualStep[];
  socialProofLine: string;
};

export type ProductPageContent = CategoryNarrative & {
  socialHeadline: string;
  socialRatingLabel: string;
};

const categoryNarratives: Record<CategoryId, CategoryNarrative> = {
  "self-care": {
    emotionalHook: "A simple nightly anchor that helps your entire evening feel softer.",
    heroBenefits: [
      "Eases the transition from busy evenings into calm rest",
      "Reduces friction so your routine is easier to repeat",
      "Creates a comforting wind-down cue you can rely on",
    ],
    quickBenefits: ["Deeper rest", "Calmer evenings", "Relaxing ritual", "Nervous system support"],
    problemHeadline: "Struggling to switch off at night?",
    problemParagraph:
      "When your day ends on high alert, your evening routine can feel rushed and disconnected. That usually leads to lighter sleep and low-energy mornings.",
    solutionParagraph:
      "giving your body a clear signal to slow down, so your routine feels restorative instead of one more task.",
    detailedBenefits: [
      {
        title: "Faster wind-down",
        description: "Helps your evening shift from productivity mode into recovery mode with less effort.",
      },
      {
        title: "Comfort-first support",
        description: "Designed to feel gentle and easy, even when you are tired and want low-friction steps.",
      },
      {
        title: "Consistent routine momentum",
        description: "Turns one small action into a repeatable nightly ritual that actually sticks.",
      },
    ],
    ritualTitle: "Your Evening Reset",
    ritualSteps: [
      {
        title: "Step 1: Dim the room",
        description: "Lower lighting and reduce visual noise to help your brain exit daytime mode.",
      },
      {
        title: "Step 2: Use your product cue",
        description: "Apply this product as your ritual signal that your evening now shifts into recovery.",
      },
      {
        title: "Step 3: Slow your pace",
        description: "End with two quiet minutes so your nervous system can settle before bed.",
      },
    ],
    socialProofLine: "Loved by routine-focused readers for making nights feel calmer in minutes.",
  },
  skincare: {
    emotionalHook: "A simple upgrade that transforms your nightly skincare ritual.",
    heroBenefits: [
      "Helps skin look fresher and more rested by morning",
      "Feels lightweight and comfortable for consistent use",
      "Builds glow without adding routine overload",
    ],
    quickBenefits: ["Deep hydration", "Improves glow", "Relaxing ritual", "Skin barrier support"],
    problemHeadline: "Struggling with dull, tired skin?",
    problemParagraph:
      "Stress, dry indoor air, and inconsistent routines can leave skin looking flat and depleted. Even good products underperform when routines feel complicated.",
    solutionParagraph:
      "supporting hydration, comfort, and visible radiance in a format that is easy to keep up nightly.",
    detailedBenefits: [
      {
        title: "Visible glow",
        description: "Supports a smoother, brighter look so skin appears refreshed without heavy makeup.",
      },
      {
        title: "Lightweight hydration",
        description: "Delivers comfort without residue, making it easy to layer in your evening routine.",
      },
      {
        title: "Daily comfort",
        description: "Designed for repeat use so your skin gets steady support, not occasional fixes.",
      },
    ],
    ritualTitle: "Your Night Routine",
    ritualSteps: [
      {
        title: "Step 1: Cleanse",
        description: "Start with clean, lightly damp skin to improve product absorption.",
      },
      {
        title: "Step 2: Apply and press in",
        description: "Use a thin layer and press gently into skin for a calm, intentional finish.",
      },
      {
        title: "Step 3: Relax",
        description: "Give your skin a quiet minute before bed so your ritual closes with ease.",
      },
    ],
    socialProofLine: "Loved by thousands for its instant glow effect and effortless nightly feel.",
  },
  "body-glow": {
    emotionalHook: "An effortless body-care upgrade that leaves skin polished and luminous.",
    heroBenefits: [
      "Softens rough texture so skin feels smoother to the touch",
      "Adds healthy-looking glow without heavy or sticky finish",
      "Turns body care into a calm, elevated ritual",
    ],
    quickBenefits: ["Smoother texture", "Healthy glow", "Relaxing ritual", "Barrier support"],
    problemHeadline: "Struggling with dry, dull body skin?",
    problemParagraph:
      "Body care often gets skipped when evenings are busy, which can leave skin tight, uneven, and less radiant over time.",
    solutionParagraph:
      "pairing visible softness with a quick, sensory ritual that is easy to keep consistent.",
    detailedBenefits: [
      {
        title: "Refined finish",
        description: "Leaves skin looking smoother and more polished from shoulder to ankle.",
      },
      {
        title: "Everyday hydration",
        description: "Helps lock in moisture so skin stays comfortable beyond the first hour.",
      },
      {
        title: "Low-effort luxury",
        description: "Adds a premium feel to routine body care without adding extra complexity.",
      },
    ],
    ritualTitle: "Your Post-Shower Ritual",
    ritualSteps: [
      {
        title: "Step 1: Pat skin damp",
        description: "Keep a little moisture on skin to help hydration steps absorb more effectively.",
      },
      {
        title: "Step 2: Apply in slow strokes",
        description: "Use smooth, upward motions to create a calming, spa-like finish.",
      },
      {
        title: "Step 3: Pause and breathe",
        description: "Take one minute to let the routine settle before changing or heading to bed.",
      },
    ],
    socialProofLine: "A favorite among glow-focused creators who want elegant results without effort.",
  },
  "spa-relax": {
    emotionalHook: "A calm atmosphere shift that makes your whole routine feel intentional.",
    heroBenefits: [
      "Moves your space from overstimulating to restorative quickly",
      "Supports stress release through sensory comfort",
      "Makes evening rituals easier to repeat with consistency",
    ],
    quickBenefits: ["Deep relaxation", "Mood reset", "Relaxing ritual", "Evening recovery"],
    problemHeadline: "Feeling overstimulated by the end of the day?",
    problemParagraph:
      "When your environment feels noisy or rushed, it is harder for your body to unwind. That makes self-care feel like another chore instead of relief.",
    solutionParagraph:
      "creating an immediate atmosphere cue that tells your body it is safe to slow down and recharge.",
    detailedBenefits: [
      {
        title: "Instant mood shift",
        description: "Creates a calm sensory backdrop in minutes, even on high-stress evenings.",
      },
      {
        title: "Ritual consistency",
        description: "A repeatable cue that helps your self-care habit feel automatic instead of forced.",
      },
      {
        title: "Deeper recovery",
        description: "Supports better evenings by lowering overstimulation before bedtime.",
      },
    ],
    ritualTitle: "Your Calm-Down Ritual",
    ritualSteps: [
      {
        title: "Step 1: Set the scene",
        description: "Prepare your room with warm lighting and remove distraction-heavy clutter.",
      },
      {
        title: "Step 2: Start your calming cue",
        description: "Use this product as the transition marker from active mode to rest mode.",
      },
      {
        title: "Step 3: Hold still for one minute",
        description: "Close with quiet breathing to let your evening settle fully.",
      },
    ],
    socialProofLine: "Widely saved by readers who want a spa-like evening without a complicated routine.",
  },
};

export function getProductPageContent(product: Product, proof: ProductProof): ProductPageContent {
  const narrative = categoryNarratives[product.categoryId];

  return {
    ...narrative,
    socialHeadline: `Top rated ritual pick for ${product.name.toLowerCase()}`,
    socialRatingLabel: `${proof.rating.toFixed(1)} average rating`,
  };
}
