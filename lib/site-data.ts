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
  tagline: "Rituals that make every evening feel like a private spa.",
  description:
    "A luxury-inspired self-care magazine helping Pinterest readers discover calming routines, refined beauty rituals, and Amazon favorites worth the shelf space.",
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
];

export const articles: Article[] = [
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
        productId: "candle-set",
      },
      {
        id: "release-body-tension",
        title: "Release Physical Tension Before Bed",
        copy: "Magnesium-supported baths are one of the fastest ways to lower body tension. Even ten minutes can improve how quickly you settle after getting into bed.",
        productId: "bath-salts",
      },
      {
        id: "close-visual-noise",
        title: "Close Out Visual Noise for Better Sleep",
        copy: "Light leaks and phone glow keep your brain in light sleep cycles. A high-quality sleep mask helps you stay in deeper sleep states longer.",
        productId: "silk-sleep-mask",
      },
      {
        id: "nervous-system-support",
        title: "Anchor the Nervous System with Gentle Pressure",
        copy: "If your mind races at night, light weighted pressure creates a cocoon effect that can reduce restlessness and support more continuous sleep.",
        productId: "weighted-blanket",
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
];

export const featuredArticleSlugs = [
  "evening-reset-ritual",
  "glass-skin-without-12-steps",
  "body-care-that-looks-expensive",
];

export const amazonFavoriteProductIds = [
  "silk-sleep-mask",
  "retinol-serum",
  "body-oil",
  "bath-salts",
  "aroma-diffuser",
  "candle-set",
];

export const favoriteCollections = [
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
