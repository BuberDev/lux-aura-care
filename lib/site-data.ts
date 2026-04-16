export type CategoryId = "self-care" | "skincare" | "body-glow" | "spa-relax";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  heroLine: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: CategoryId;
  benefit: string;
  description: string;
  trustSignal: "Top rated" | "Popular" | "Editor favorite";
  image: string;
  imageAlt: string;
  amazonUrl: string;
};

export type ProductProof = {
  rating: number;
  reviews: string;
  socialProof:
    | "Popular right now"
    | "Limited-time favorite"
    | "Trending on social media"
    | "Most saved on Pinterest this week"
    | "Most loved by routine creators";
  highlights: string[];
};

export type TopPickBadge = "Best Seller" | "Trending" | "Most Loved";

export type RoutineStep = {
  step: number;
  title: string;
  timing: string;
  description: string;
  productId: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  copy: string;
  productId: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  categoryId: CategoryId;
  readTime: string;
  publishedAt: string;
  pinHook: string;
  sections: ArticleSection[];
};

export const siteMeta = {
  name: "Lux Aura Care",
  tagline: "Professional routine guides for the Pinterest listener.",
  description:
    "We curate the viral essentials for skincare, sleep, and body glow, providing direct Amazon links for a seamless transition from inspiration to reality.",
};

export const categories: Category[] = [
  {
    id: "self-care",
    name: "Self Care",
    description: "Evening rituals that lower stress and elevate mood in under 20 minutes.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    heroLine: "From rushed evenings to intentional wind-downs.",
  },
  {
    id: "skincare",
    name: "Skincare",
    description: "Glow-first routines with fewer steps and better consistency.",
    image:
      "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=1200&q=80",
    heroLine: "Skin that looks rested, hydrated, and quietly radiant.",
  },
  {
    id: "body-glow",
    name: "Body & Glow",
    description: "Softer skin, subtle shine, and spa-level body care at home.",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
    heroLine: "Body care that feels indulgent and looks polished.",
  },
  {
    id: "spa-relax",
    name: "Spa & Relax",
    description: "At-home calming experiences built around scent, warmth, and comfort.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    heroLine: "A calm atmosphere that resets your entire evening.",
  },
];

export const products: Product[] = [
  {
    id: "silk-sleep-mask",
    name: "Mulberry Silk Sleep Mask",
    categoryId: "self-care",
    benefit: "Deeper sleep with less friction on delicate skin.",
    description:
      "A breathable silk mask that blocks ambient light and helps your bedtime routine feel intentional from the first minute.",
    trustSignal: "Top rated",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Champagne silk sleep mask on linen bedding",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "aroma-diffuser",
    name: "Ceramic Ultrasonic Diffuser",
    categoryId: "spa-relax",
    benefit: "Instant atmosphere shift with a soft ambient glow.",
    description:
      "Quiet mist diffusion paired with warm light to transform your bedroom or bath into a calm ritual space.",
    trustSignal: "Popular",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Minimal ceramic diffuser on a wooden side table",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "gua-sha-set",
    name: "Rose Quartz Gua Sha Set",
    categoryId: "skincare",
    benefit: "Visible de-puffing and improved product absorption.",
    description:
      "A facial massage duo designed to support lymphatic flow and make serum application more effective.",
    trustSignal: "Editor favorite",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Rose quartz gua sha and roller next to facial oil",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "body-oil",
    name: "Neroli Firming Body Oil",
    categoryId: "body-glow",
    benefit: "Soft, luminous skin that does not feel greasy.",
    description:
      "Fast-absorbing botanical oil that seals in hydration and leaves a healthy satin finish.",
    trustSignal: "Top rated",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Elegant body oil bottle with golden reflection",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "bath-salts",
    name: "Magnesium Bath Flakes",
    categoryId: "spa-relax",
    benefit: "Relaxes tense muscles and improves sleep quality.",
    description:
      "Mineral-rich bath salts that help release body tension and support calm, heavy-limb rest.",
    trustSignal: "Popular",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Bath salts in a glass jar near a towel",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "retinol-serum",
    name: "Night Renewal Retinol Serum",
    categoryId: "skincare",
    benefit: "Smoother skin texture with consistent nighttime use.",
    description:
      "A beginner-friendly retinol blend buffered with squalane to reduce irritation while improving radiance.",
    trustSignal: "Top rated",
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Dropper serum bottle on marble tray",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "dry-brush",
    name: "Natural Bristle Dry Brush",
    categoryId: "body-glow",
    benefit: "Smoother texture and more energized morning routines.",
    description:
      "Dry brushing before your shower supports exfoliation and leaves skin looking more refined.",
    trustSignal: "Editor favorite",
    image:
      "https://images.unsplash.com/photo-1629198729791-f52c0f748c0f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Natural dry brush and folded towels",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "led-mask",
    name: "Red-Light Facial Mask",
    categoryId: "skincare",
    benefit: "Low-effort treatment that supports clearer, brighter skin.",
    description:
      "Hands-free LED sessions that layer into your routine while you journal, read, or unwind.",
    trustSignal: "Popular",
    image:
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Modern LED skincare mask on vanity",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "weighted-blanket",
    name: "Cooling Weighted Blanket",
    categoryId: "self-care",
    benefit: "Nervous-system support for calmer nights.",
    description:
      "Balanced pressure and breathable texture help reduce bedtime restlessness without overheating.",
    trustSignal: "Top rated",
    image:
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Soft weighted blanket folded on a bed",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "scalp-massager",
    name: "Silicone Scalp Massager",
    categoryId: "self-care",
    benefit: "Turns hair wash into a stress-release ritual.",
    description:
      "Flexible silicone bristles provide gentle stimulation for a cleaner scalp and a more relaxing shower.",
    trustSignal: "Popular",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Handheld scalp massager on bathroom shelf",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "sheet-mask-set",
    name: "Hydrogel Sheet Mask Set",
    categoryId: "skincare",
    benefit: "Quick pre-event glow with instant hydration.",
    description:
      "Cooling hydrogel masks that visibly plump and prep skin before makeup or evening plans.",
    trustSignal: "Editor favorite",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Hydrogel sheet masks and a jade bowl",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "candle-set",
    name: "Sandalwood Candle Trio",
    categoryId: "spa-relax",
    benefit: "Creates a calm mood in under five minutes.",
    description:
      "Layered woody fragrance with a clean burn profile for evening rituals and bath sessions.",
    trustSignal: "Top rated",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Three elegant candles with warm glow",
    amazonUrl: "https://www.amazon.com/",
  },
  {
    id: "niacinamide-toner",
    name: "Naturium Niacinamide Face Serum 12% Plus Zinc 2%",
    categoryId: "skincare",
    benefit: "Visible brightening and tone-balancing hydration for a clearer-looking glow.",
    description:
      "A high-performance serum with 12% Niacinamide and 2% Zinc designed to target dullness and support a brighter, more even complexion.",
    trustSignal: "Top rated",
    image: "/Naturium_Niacinamide_Face_Serum_12.png",
    imageAlt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
    amazonUrl: "https://amzn.to/480WDBY",
  },
  {
    id: "coslus-cleansing-brush",
    name: "COSLUS 7-in-1 Facial Cleansing Brush",
    categoryId: "skincare",
    benefit: "Deeper cleanse and easier makeup removal without over-scrubbing.",
    description:
      "A multi-head facial brush set designed to remove buildup, improve cleansing consistency, and prep skin for actives.",
    trustSignal: "Popular",
    image: "/Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.png",
    imageAlt: "COSLUS 7-in-1 facial cleansing brush set with accessories",
    amazonUrl: "https://amzn.to/41WZCaT",
  },
  {
    id: "mixsoon-bean-essence",
    name: "mixsoon Bean Essence Exfoliating Treatment",
    categoryId: "skincare",
    benefit: "Softer texture and glow with low-friction exfoliation support.",
    description:
      "A gentle essence that helps smooth rough patches and improves product layering for a polished glass-skin finish.",
    trustSignal: "Editor favorite",
    image: "/mixsoon_Bean_Essence_Exfoliating.png",
    imageAlt: "mixsoon Bean Essence exfoliating skincare product image",
    amazonUrl: "https://amzn.to/4vogHrF",
  },
  {
    id: "cliganic-essential-oils",
    name: "Cliganic Organic Aromatherapy Essential Oils Set",
    categoryId: "spa-relax",
    benefit: "Instant mood shift and calmer evenings through scent layering.",
    description:
      "A curated essential oil set for diffuser rituals, bath ambiance, and repeatable stress-reset routines at home.",
    trustSignal: "Top rated",
    image: "/Cliganic_Organic_Aromatherapy.png",
    imageAlt: "Cliganic organic aromatherapy essential oils set product image",
    amazonUrl: "https://amzn.to/4sFqWpd",
  },
  {
    id: "copper-water-bottle",
    name: "34oz Pure Copper Water Bottle Set",
    categoryId: "self-care",
    benefit: "Hydration ritual that feels premium and easier to repeat daily.",
    description:
      "A large uncoated copper bottle with cup designed for habit consistency, elevated desk aesthetics, and daily hydration momentum.",
    trustSignal: "Popular",
    image: "/Copper_Water_Bottle.png",
    imageAlt: "Pure copper water bottle with matching cup",
    amazonUrl: "https://amzn.to/4c0ZSdu",
  },
  {
    id: "magnesium-supplement",
    name: "Pure Encapsulations Magnesium (Glycinate)",
    categoryId: "self-care",
    benefit: "Calms the nervous system and supports deeper, more restorative sleep.",
    description:
      "A highly absorbable form of magnesium designed to help muscles relax and support a peaceful transition into sleep.",
    trustSignal: "Editor favorite",
    image: "/Pure_Encapsulations_Magnesium_Glycinate.png",
    imageAlt: "Pure Encapsulations Magnesium Glycinate supplement bottle",
    amazonUrl: "https://amzn.to/4bY0MZC",
  },
  {
    id: "pavilia-plush-robe",
    name: "PAVILIA Premium Women's Plush Soft Robe",
    categoryId: "spa-relax",
    benefit: "Warm post-shower comfort that anchors evening wind-down habits.",
    description:
      "A soft plush robe that turns ordinary evenings into a repeatable at-home spa cue and supports ritual consistency.",
    trustSignal: "Popular",
    image: "/PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.png",
    imageAlt: "PAVILIA premium women's plush soft robe product image",
    amazonUrl: "https://amzn.to/4cnPAnV",
  },
  {
    id: "aveeno-oil-mist",
    name: "Aveeno Daily Moisturizing Body Oil Mist",
    categoryId: "body-glow",
    benefit: "Instantly softer, smoother skin with a non-greasy, healthy satin finish.",
    description:
      "A lightweight body oil spray formulated with oat and jojoba oil to lock in moisture and leave skin looking polished.",
    trustSignal: "Popular",
    image: "/cover_aveeno_oil.png",
    imageAlt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
    amazonUrl: "https://amzn.to/3ObFRt3",
  },
];

export const productProofById: Record<string, ProductProof> = {
  "silk-sleep-mask": {
    rating: 4.8,
    reviews: "12,900+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Falls asleep faster by reducing light distractions",
      "Feels soft on skin and avoids overnight creasing",
      "Makes bedtime routines feel calm and intentional",
    ],
  },
  "aroma-diffuser": {
    rating: 4.7,
    reviews: "8,400+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Switches your room into relaxation mode in minutes",
      "Creates a ritual cue that makes routines stick",
      "Adds warm ambiance without visual clutter",
    ],
  },
  "gua-sha-set": {
    rating: 4.8,
    reviews: "10,200+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Helps reduce morning puffiness before makeup",
      "Improves how serums spread and absorb",
      "Adds a calming touchpoint to evening skincare",
    ],
  },
  "body-oil": {
    rating: 4.9,
    reviews: "7,300+ reviews",
    socialProof: "Most saved on Pinterest this week",
    highlights: [
      "Gives skin a polished satin glow without stickiness",
      "Keeps hydration sealed in after showering",
      "Makes body care feel premium with minimal effort",
    ],
  },
  "bath-salts": {
    rating: 4.8,
    reviews: "9,100+ reviews",
    socialProof: "Limited-time favorite",
    highlights: [
      "Releases body tension after long workdays",
      "Improves sleep readiness before bed",
      "Turns a basic bath into a restorative reset",
    ],
  },
  "retinol-serum": {
    rating: 4.8,
    reviews: "16,500+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Smooths texture with steady night use",
      "Supports brighter, more even-looking skin",
      "Designed for consistency without routine overload",
    ],
  },
  "dry-brush": {
    rating: 4.7,
    reviews: "5,600+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Improves skin texture before moisturizing",
      "Boosts circulation for a more energized feel",
      "Makes shower routines feel more intentional",
    ],
  },
  "led-mask": {
    rating: 4.7,
    reviews: "6,700+ reviews",
    socialProof: "Limited-time favorite",
    highlights: [
      "Hands-free treatment that fits into real evenings",
      "Builds consistency without extra effort",
      "Pairs well with reading or wind-down habits",
    ],
  },
  "weighted-blanket": {
    rating: 4.8,
    reviews: "14,200+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Supports deeper calm before sleep",
      "Reduces bedtime restlessness naturally",
      "Feels cozy without trapping excess heat",
    ],
  },
  "scalp-massager": {
    rating: 4.7,
    reviews: "11,800+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Makes wash day feel restorative, not rushed",
      "Helps shampoos cleanse more effectively",
      "Adds a stress-release step to your routine",
    ],
  },
  "sheet-mask-set": {
    rating: 4.8,
    reviews: "13,100+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Delivers instant hydration before events",
      "Leaves skin looking plumper and smoother fast",
      "Ideal quick glow step for low-energy nights",
    ],
  },
  "candle-set": {
    rating: 4.9,
    reviews: "4,900+ reviews",
    socialProof: "Most loved by routine creators",
    highlights: [
      "Creates a calm atmosphere in under five minutes",
      "Signals your brain it is time to slow down",
      "Elevates bath and skincare rituals effortlessly",
    ],
  },
  "niacinamide-toner": {
    rating: 4.6,
    reviews: "10,000+ reviews",
    socialProof: "Most saved on Pinterest this week",
    highlights: [
      "Supports a brighter and more even-looking complexion",
      "Helps calm look of redness with consistent daily use",
      "Easy first step in both morning and evening routines",
    ],
  },
  "coslus-cleansing-brush": {
    rating: 4.3,
    reviews: "8,000+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Removes sunscreen and makeup more effectively",
      "Makes cleansing routines easier to keep daily",
      "Multiple heads support different skin needs",
    ],
  },
  "mixsoon-bean-essence": {
    rating: 4.5,
    reviews: "5,000+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Smooths rough texture without harsh scrub feel",
      "Improves glow when paired with hydrating toner",
      "Supports a clean, minimal glass-skin workflow",
    ],
  },
  "cliganic-essential-oils": {
    rating: 4.7,
    reviews: "11,000+ reviews",
    socialProof: "Most loved by routine creators",
    highlights: [
      "Creates a spa-like atmosphere in minutes",
      "Pairs naturally with diffuser and bath rituals",
      "Makes evening reset routines more repeatable",
    ],
  },
  "copper-water-bottle": {
    rating: 4.5,
    reviews: "100+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Turns hydration into a visible daily ritual cue",
      "Large capacity reduces refill friction",
      "Looks premium on vanity and desk setups",
    ],
  },
  "magnesium-supplement": {
    rating: 4.8,
    reviews: "5,000+ reviews",
    socialProof: "Popular right now",
    highlights: [
      "Helps your body transition into deep rest mode",
      "Reduces physical tension before bed",
      "Supports better sleep quality without grogginess",
    ],
  },
  "pavilia-plush-robe": {
    rating: 4.6,
    reviews: "17,000+ reviews",
    socialProof: "Limited-time favorite",
    highlights: [
      "Creates immediate post-shower comfort",
      "Adds a premium sensory cue to spa nights",
      "Encourages slower, calmer evening pacing",
    ],
  },
  "aveeno-oil-mist": {
    rating: 4.7,
    reviews: "25,000+ reviews",
    socialProof: "Most saved on Pinterest this week",
    highlights: [
      "Delivers 24-hour hydration with a satin finish",
      "Absorbs in seconds for a mess-free routine",
      "Leaves skin looking polished and healthy",
    ],
  },
};

export const topPicks = [
  { productId: "mixsoon-bean-essence", badge: "Best Seller" as const },
  { productId: "niacinamide-toner", badge: "Trending" as const },
  { productId: "magnesium-supplement", badge: "Most Loved" as const },
  { productId: "aveeno-oil-mist", badge: "Best Seller" as const },
  { productId: "pavilia-plush-robe", badge: "Most Loved" as const },
  { productId: "cliganic-essential-oils", badge: "Trending" as const },
  { productId: "copper-water-bottle", badge: "Most Loved" as const },
  { productId: "coslus-cleansing-brush", badge: "Best Seller" as const },
];

export const glowRoutineSteps: RoutineStep[] = [
  {
    step: 1,
    title: "Set the Atmosphere",
    timing: "2 min",
    description: "Use scent and warm lighting to help your body transition from work mode into ritual mode.",
    productId: "cliganic-essential-oils",
  },
  {
    step: 2,
    title: "Prep and Smooth",
    timing: "5 min",
    description: "Use gentle cleansing and essence layering to prep skin texture before actives and hydration.",
    productId: "coslus-cleansing-brush",
  },
  {
    step: 3,
    title: "Tone for Brightness",
    timing: "4 min",
    description: "Apply niacinamide toner to support a calmer, brighter complexion and cleaner next-step absorption.",
    productId: "niacinamide-toner",
  },
  {
    step: 4,
    title: "Close with Sleep Support",
    timing: "1 min",
    description: "Darken visual noise and anchor calm so your nervous system can shift into deep rest.",
    productId: "silk-sleep-mask",
  },
];

export const articles: Article[] = [
  {
    slug: "the-viral-glass-skin-guide",
    title: "The Viral Pinterest 'Glass Skin' Duo: Mixsoon Bean Essence & TIA'M Vita B3",
    excerpt:
      "A focused routine guide to achieving that luminous, reflective skin finish using Pinterest's high-performing skincare stars.",
    intro:
      "Glass skin isn't about being perfect; it's about deep hydration and gentle resurfacing. This guide breaks down the two viral products that simplify the process and deliver visible results.",
    heroImage: "/mixsoon_Bean_Essence_Exfoliating.png",
    heroAlt: "Mixsoon Bean Essence and TIA'M toner on a marble vanity",
    categoryId: "skincare",
    readTime: "6 min read",
    publishedAt: "2026-04-16",
    pinHook: "Reflective skin, simplified steps, viral results.",
    sections: [
      {
        id: "prep-texture",
        title: "Step 1: Prep the Texture with Low-Friction Cleansing",
        copy: "Before applying actives, you need a clean canvas. A gentle sonic brush ensures surface debris is gone without damaging your barrier.",
        productId: "coslus-cleansing-brush",
      },
      {
        id: "layer-toner",
        title: "Step 2: Tone for Brightness and Clarity",
        copy: "Niacinamide and Arbutin are the powerhouse duo for evening out skin tone. Applying this while skin is slightly damp from cleansing maximizes absorption.",
        productId: "niacinamide-toner",
      },
      {
        id: "exfoliate-glow",
        title: "Step 3: Exfoliate Gently for the 'Glass' Finish",
        copy: "The Bean Essence is the secret to that polished look. It's gentle enough for nightly use and helps smooth rough patches instantly.",
        productId: "mixsoon-bean-essence",
      },
    ],
  },
  {
    slug: "biological-sleep-reset",
    title: "The Biological Sleep Reset: Why Magnesium and Plush Comfort are the Ultimate Pairing",
    excerpt:
      "Lower your nervous system's alert level with this simple bedtime ritual designed for deep, restorative rest.",
    intro:
      "If you struggle to switch off, your environment is likely too 'noisy.' This reset focuses on physical cues that tell your brain it's safe to settle into deep rest mode.",
    heroImage: "/Pure_Encapsulations_Magnesium_Glycinate.png",
    heroAlt: "Magnesium supplement bottle and a soft plush robe",
    categoryId: "self-care",
    readTime: "5 min read",
    publishedAt: "2026-04-15",
    pinHook: "From overstimulated evenings to calm, biological rest.",
    sections: [
      {
        id: "mineral-support",
        title: "Start with Internal Calm",
        copy: "Magnesium Glycinate is the most recommended form for relaxation. It helps muscles release tension and supports better sleep cycles naturally.",
        productId: "magnesium-supplement",
      },
      {
        id: "sensory-anchor",
        title: "Anchor Your Body in Softness",
        copy: "The weight and texture of a premium plush robe act as a sensory anchor, signalling through your skin that the active day is officially over.",
        productId: "pavilia-plush-robe",
      },
      {
        id: "atmosphere-cue",
        title: "Finish with Atmosphere Calibration",
        copy: "Scent is the fastest way to the brain. Using a curated blend of essential oils creates a repeatable habit cue your brain associates with sleep.",
        productId: "cliganic-essential-oils",
      },
    ],
  },
  {
    slug: "body-glow-habit-guide",
    title: "From Shower to Bed: The Low-Effort Routine for Luminous Body Skin",
    excerpt:
      "Stop skipping body care. This 3-minute post-shower habit creates a polished, spa-level glow with zero residue.",
    intro:
      "Glossy, healthy body skin shouldn't be a separate project. These two tools turn your daily hydration into a premium ritual that looks and feels expensive.",
    heroImage: "/Aveeno_Daily_Moisturizing_Body_Oil_Mist.png",
    heroAlt: "Aveeno Body Oil Mist bottle in a golden hour light",
    categoryId: "body-glow",
    readTime: "4 min read",
    publishedAt: "2026-04-14",
    pinHook: "Healthy satin glow that catches the light beautifully.",
    sections: [
      {
        id: "hydration-momentum",
        title: "Build Hydration Momentum Early",
        copy: "Good skin starts with internal hydration. Keeping a copper bottle at your bedside ensures you start and end your ritual with a clean hydration cue.",
        productId: "copper-water-bottle",
      },
      {
        id: "lock-moisture",
        title: "Lock in Moisture While Skin is Warm",
        copy: "Spray the Aveeno Oil Mist immediately after showering. It seals in moisture and leaves a satin finish that doesn't feel sticky on your sheets.",
        productId: "aveeno-oil-mist",
      },
    ],
  },
  {
    slug: "evening-reset-ritual",
    title: "The 20-Minute Evening Reset That Makes Mornings Feel Lighter",
    excerpt:
      "A simple self-care sequence that helps you transition from high-output days to genuinely restorative sleep.",
    intro:
      "When evenings feel rushed, sleep quality usually follows. This reset ritual creates a clear bridge between work mode and rest mode using products that reduce friction, not add effort.",
    heroImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Woman applying evening skincare in a softly lit bathroom",
    categoryId: "self-care",
    readTime: "7 min read",
    publishedAt: "2026-03-21",
    pinHook: "From overstimulated evenings to calm, intentional nights.",
    sections: [
      {
        id: "set-lighting",
        title: "Start with Lighting That Signals Rest",
        copy: "Bright overhead light keeps your nervous system alert. Warm, low lighting tells your body that the day is ending and invites slower breathing.",
        productId: "cliganic-essential-oils",
      },
      {
        id: "release-body-tension",
        title: "Release Physical Tension Before Bed",
        copy: "Magnesium-supported rituals are one of the fastest ways to lower body tension. Even ten minutes can improve how quickly you settle after getting into bed.",
        productId: "magnesium-supplement",
      },
      {
        id: "close-visual-noise",
        title: "Anchor Your Body in Softness",
        copy: "The weight and texture of a premium plush robe act as a sensory anchor, signalling through your skin that the active day is officially over.",
        productId: "pavilia-plush-robe",
      },
    ],
  },
  {
    slug: "glass-skin-without-12-steps",
    title: "How to Build a Glass-Skin Routine Without 12 Steps",
    excerpt:
      "A focused nighttime routine that prioritizes hydration, texture, and glow with fewer but better products.",
    intro:
      "Great skin is usually about consistency, not complexity. This routine removes the guesswork so your products layer well and deliver visible results in a few weeks.",
    heroImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Luxury skincare products arranged near a mirror",
    categoryId: "skincare",
    readTime: "8 min read",
    publishedAt: "2026-03-15",
    pinHook: "Luminous skin, fewer steps, zero routine fatigue.",
    sections: [
      {
        id: "de-puff-before-serum",
        title: "De-Puff First to Improve Product Absorption",
        copy: "A short facial massage with cool stone tools improves circulation and helps serums sink in more evenly instead of sitting on the surface.",
        productId: "gua-sha-set",
      },
      {
        id: "overnight-renewal",
        title: "Use One Smart Active for Overnight Renewal",
        copy: "Retinol remains one of the most researched ingredients for smoother texture. Start low, go slow, and pair with hydration for comfort.",
        productId: "retinol-serum",
      },
      {
        id: "weekly-boost",
        title: "Add a Weekly Hydration Boost",
        copy: "Hydrogel masks are an easy way to rehydrate skin quickly, especially after travel, weather changes, or high-stress weeks.",
        productId: "sheet-mask-set",
      },
      {
        id: "hands-free-consistency",
        title: "Make Consistency Frictionless",
        copy: "Hands-free LED sessions help you stay consistent because they pair well with habits you already do: reading, journaling, or watching a short show.",
        productId: "led-mask",
      },
    ],
  },
  {
    slug: "body-care-that-looks-expensive",
    title: "Body Care That Looks Expensive Without a Luxury Spa Bill",
    excerpt:
      "Simple upgrades that make skin look smoother, brighter, and more polished from shoulder to ankle.",
    intro:
      "Body care gets overlooked until summer. This routine keeps your skin camera-ready year-round with low-effort rituals that layer into your shower and evening flow.",
    heroImage:
      "https://images.unsplash.com/photo-1616627981455-289e5aa2ea5c?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Body oil and towels arranged on a stone countertop",
    categoryId: "body-glow",
    readTime: "6 min read",
    publishedAt: "2026-03-10",
    pinHook: "Softer texture and glow that catches light beautifully.",
    sections: [
      {
        id: "pre-shower-exfoliation",
        title: "Dry Brush Before You Shower",
        copy: "Gentle pre-shower brushing removes surface dullness and helps moisturizers absorb more evenly afterward.",
        productId: "dry-brush",
      },
      {
        id: "seal-moisture",
        title: "Lock Moisture While Skin Is Still Damp",
        copy: "Body oils work best when applied right after showering. This step traps hydration and delivers a smooth satin finish.",
        productId: "body-oil",
      },
      {
        id: "scalp-ritual",
        title: "Do Not Skip the Scalp Ritual",
        copy: "A relaxed scalp often means better-looking hair at the root. This small step makes wash days feel restorative instead of rushed.",
        productId: "scalp-massager",
      },
      {
        id: "ambient-finish",
        title: "Finish with an Atmosphere Cue",
        copy: "When your bathroom smells and feels calm, routines become easier to repeat. Sensory cues are what turn one-off routines into habits.",
        productId: "aroma-diffuser",
      },
    ],
  },
  {
    slug: "at-home-spa-sunday-guide",
    title: "Your At-Home Spa Sunday Guide for a Better Week",
    excerpt:
      "A repeatable Sunday ritual that resets your body, skin, and stress levels before Monday starts.",
    intro:
      "A strong week starts the night before. This Sunday guide is designed to lower stress hormones, improve sleep quality, and help you feel prepared instead of rushed.",
    heroImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Luxury spa setting with candles and bath essentials",
    categoryId: "spa-relax",
    readTime: "9 min read",
    publishedAt: "2026-03-03",
    pinHook: "The Sunday ritual that makes Monday feel manageable.",
    sections: [
      {
        id: "scent-scene",
        title: "Set the Scent Scene First",
        copy: "Choose one scent profile and keep it consistent through candles and diffusion. Consistency creates faster emotional association with calm.",
        productId: "candle-set",
      },
      {
        id: "warm-mineral-bath",
        title: "Take a Warm Mineral Bath to Drop Stress",
        copy: "Warmth plus magnesium can reduce physical tension and help your body shift from alert mode to recovery mode.",
        productId: "bath-salts",
      },
      {
        id: "skin-treatment",
        title: "Layer One Treatment While You Unwind",
        copy: "A comfortable sheet mask or LED pass keeps your spa routine productive without feeling complicated.",
        productId: "sheet-mask-set",
      },
      {
        id: "final-sleep-step",
        title: "Finish with a Sleep-First Environment",
        copy: "Close your ritual by darkening the room and reducing sensory noise. Better sleep quality gives you a visible glow the next day.",
        productId: "silk-sleep-mask",
      },
    ],
  },
  {
    slug: "pin-worthy-vanity-upgrades",
    title: "Pin-Worthy Vanity Upgrades That Improve Your Routine",
    excerpt:
      "Beautiful vanity additions that are practical, calming, and worth clicking through to buy.",
    intro:
      "Pinterest readers love beautiful spaces, but practical details are what convert a beautiful idea into a routine that actually sticks. These picks do both.",
    heroImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Elegant vanity setup with mirrors and skincare items",
    categoryId: "self-care",
    readTime: "5 min read",
    publishedAt: "2026-02-26",
    pinHook: "A vanity that looks curated and feels functional every day.",
    sections: [
      {
        id: "soft-light",
        title: "Layer Soft Lighting to Elevate Mood",
        copy: "Soft side lighting is more flattering and less fatiguing than overhead bulbs. It also makes your evening routine feel instantly elevated.",
        productId: "aroma-diffuser",
      },
      {
        id: "keep-tools-visible",
        title: "Keep the Right Tools Visible",
        copy: "When your skincare tools are visible and accessible, you are far more likely to use them consistently.",
        productId: "gua-sha-set",
      },
      {
        id: "end-with-calm",
        title: "End Every Routine with One Calm Cue",
        copy: "A repeatable final cue like candlelight or a sleep mask helps your brain recognize that the day is complete.",
        productId: "candle-set",
      },
    ],
  },
  {
    slug: "niacinamide-routine-for-dull-skin",
    title: "Niacinamide Routine for Dull Skin: The Pinterest Workflow That Converts",
    excerpt:
      "A practical toner-first skincare flow that pairs gentle cleansing, smoothing essence, and hydration support for a clearer glow.",
    intro:
      "Most Pinterest skincare saves fail because routines are too complex. This one keeps four repeatable steps and product pairings that are easy to maintain even on low-energy evenings.",
    heroImage: "/Good_Molecules_Niacinamide_Brightening_Toner.png",
    heroAlt: "Niacinamide toner product visual used in a skincare routine guide",
    categoryId: "skincare",
    readTime: "7 min read",
    publishedAt: "2026-04-14",
    pinHook: "A realistic glow routine you can actually sustain all week.",
    sections: [
      {
        id: "cleanse-with-structure",
        title: "Start With a Structured Cleanse",
        copy: "Use a cleansing tool that lowers friction and removes buildup consistently so active products are not wasted on surface residue.",
        productId: "coslus-cleansing-brush",
      },
      {
        id: "tone-with-niacinamide",
        title: "Tone for Brightness and Balance",
        copy: "Niacinamide toners work best when used daily in small amounts. This gives a calmer, more even look over time without routine fatigue.",
        productId: "niacinamide-toner",
      },
      {
        id: "smooth-texture-gently",
        title: "Smooth Texture Without Over-Exfoliating",
        copy: "A mild essence step can improve skin texture and glow while keeping barrier comfort intact for long-term consistency.",
        productId: "mixsoon-bean-essence",
      },
      {
        id: "seal-results-weekly",
        title: "Seal Results With a Weekly Hydration Layer",
        copy: "Add one weekly hydration boost so actives stay comfortable and your skin looks plump instead of overworked.",
        productId: "sheet-mask-set",
      },
    ],
  },
  {
    slug: "pinterest-spa-products-that-actually-get-clicks",
    title: "Pinterest Spa Products That Actually Get Clicks and Repeat Use",
    excerpt:
      "A conversion-focused spa-at-home setup using comfort and atmosphere cues that readers genuinely keep.",
    intro:
      "The best-performing spa content combines emotional payoff and simple execution. This guide structures that with a scent anchor, comfort layer, and one wellness cue for habit continuity.",
    heroImage: "/Cliganic_Organic_Aromatherapy.png",
    heroAlt: "Organic essential oils set used as the hero for spa ritual content",
    categoryId: "spa-relax",
    readTime: "8 min read",
    publishedAt: "2026-04-12",
    pinHook: "The at-home spa stack your audience saves and buys in one session.",
    sections: [
      {
        id: "build-scent-anchor",
        title: "Build a Scent Anchor First",
        copy: "Essential oils are strongest when they become a repeatable cue. Use the same scent profile each time so your body associates it with wind-down mode.",
        productId: "cliganic-essential-oils",
      },
      {
        id: "add-comfort-layer",
        title: "Add a Comfort Layer You Can Feel Instantly",
        copy: "A plush robe increases perceived luxury and makes evening routines emotionally rewarding, which improves consistency.",
        productId: "pavilia-plush-robe",
      },
      {
        id: "keep-hydration-visible",
        title: "Keep Hydration Visible in the Ritual Space",
        copy: "A dedicated water setup improves hydration follow-through and supports the wellness framing around your self-care content.",
        productId: "copper-water-bottle",
      },
      {
        id: "close-with-daily-support",
        title: "Close With a Low-Friction Daily Support Step",
        copy: "Simple supplement cues can help readers maintain continuity between spa day and the rest of the week.",
        productId: "magnesium-supplement",
      },
    ],
  },
];

export const featuredArticleSlugs = [
  "the-viral-glass-skin-guide",
  "biological-sleep-reset",
  "body-glow-habit-guide",
  "evening-reset-ritual",
];

export const amazonFavoriteProductIds = [
  "mixsoon-bean-essence",
  "niacinamide-toner",
  "coslus-cleansing-brush",
  "magnesium-supplement",
  "aveeno-oil-mist",
  "cliganic-essential-oils",
  "pavilia-plush-robe",
  "copper-water-bottle",
  "silk-sleep-mask",
  "retinol-serum",
  "aroma-diffuser",
  "candle-set",
];

export const favoriteCollections = [
  {
    id: "pinterest-viral-finds",
    title: "The Pinterest Lux Aura Collection",
    description: "The 8 high-performing essentials currently trending on our Pinterest feed.",
    categoryId: "self-care" as const,
    productIds: [
      "mixsoon-bean-essence",
      "niacinamide-toner",
      "coslus-cleansing-brush",
      "magnesium-supplement",
      "aveeno-oil-mist",
      "cliganic-essential-oils",
      "pavilia-plush-robe",
      "copper-water-bottle",
    ],
  },
  {
    id: "night-reset",
    title: "Night Reset Essentials",
    description: "Calming products that support better sleep and a softer evening transition.",
    categoryId: "self-care" as const,
    productIds: ["silk-sleep-mask", "weighted-blanket", "aroma-diffuser"],
  },
  {
    id: "glow-core",
    title: "Glow Core Skincare",
    description: "High-impact skincare picks designed for texture, clarity, and hydration.",
    categoryId: "skincare" as const,
    productIds: ["retinol-serum", "gua-sha-set", "led-mask", "sheet-mask-set"],
  },
  {
    id: "spa-bath",
    title: "Spa Bath Ritual",
    description: "Warm, aromatic bath upgrades that turn Sunday into a full reset.",
    categoryId: "spa-relax" as const,
    productIds: ["bath-salts", "candle-set", "aroma-diffuser"],
  },
  {
    id: "body-finish",
    title: "Body Finish Collection",
    description: "Body-care staples for smoother texture and healthy-looking glow.",
    categoryId: "body-glow" as const,
    productIds: ["dry-brush", "body-oil", "scalp-massager"],
  },
];

export function getCategoryById(id: CategoryId) {
  return categories.find((category) => category.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByIds(ids: string[]) {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
}

export function getFeaturedArticles() {
  return getArticlesBySlugs(featuredArticleSlugs);
}

export function getArticlesBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => Boolean(article));
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, categoryId: CategoryId) {
  return articles
    .filter((article) => article.slug !== slug && article.categoryId === categoryId)
    .slice(0, 3);
}

export function getAmazonFavorites() {
  return getProductsByIds(amazonFavoriteProductIds);
}

export function getFavoritesCollections() {
  return favoriteCollections.map((collection) => ({
    ...collection,
    products: getProductsByIds(collection.productIds),
  }));
}

export function getProductProof(productId: string): ProductProof {
  return (
    productProofById[productId] ?? {
      rating: 4.7,
      reviews: "4,000+ reviews",
      socialProof: "Popular right now",
      highlights: [
        "Built to simplify your daily routine",
        "Creates visible comfort and confidence",
        "Easy to maintain as a long-term habit",
      ],
    }
  );
}

export function getTopPickProducts() {
  return topPicks
    .map((pick) => {
      const product = getProductById(pick.productId);
      if (!product) {
        return null;
      }

      return {
        product,
        badge: pick.badge,
      };
    })
    .filter((item): item is { product: Product; badge: TopPickBadge } => Boolean(item));
}

export function getGlowRoutineSteps() {
  return glowRoutineSteps
    .map((step) => {
      const product = getProductById(step.productId);
      if (!product) {
        return null;
      }

      return {
        ...step,
        product,
      };
    })
    .filter(
      (step): step is RoutineStep & { product: Product } =>
        Boolean(step)
    );
}
