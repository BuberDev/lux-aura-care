import { Currency } from "lucide-react";

export type CategoryId = "self-care" | "skincare" | "body-glow" | "spa-relax";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  heroLine: string;
};

export type ProductCurrency = "USD" | "PLN";

export type VerifiedMarketplacePrice<C extends ProductCurrency = ProductCurrency> = {
  status: "verified";
  amount: number;
  currency: C;
  /** ISO date when the marketplace price was last checked. */
  checkedAt: string;
};

export type IndicativeMarketplacePrice<C extends ProductCurrency = ProductCurrency> = {
  status: "indicative";
  amount: number;
  currency: C;
};

export type UnknownMarketplacePrice<C extends ProductCurrency = ProductCurrency> = {
  status: "unknown";
  amount: null;
  currency: C;
};

export type MarketplacePrice<C extends ProductCurrency = ProductCurrency> =
  | VerifiedMarketplacePrice<C>
  | IndicativeMarketplacePrice<C>
  | UnknownMarketplacePrice<C>;

export type ProductGalleryImage = {
  image: string;
  imageAlt: string;
  title: string;
};

type ProductMarketOverrides = {
  name?: string;
  benefit?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  trustSignal?: "Editorial pick" | "Routine essential" | "Editor favorite";
  gallery?: ProductGalleryImage[];
  video?: string | null;
  slug?: string;
};

type PolishMarketplacePrice =
  | VerifiedMarketplacePrice<"PLN">
  | IndicativeMarketplacePrice<"PLN">
  | UnknownMarketplacePrice<"PLN">;

export type UsProductMarketVariant = ProductMarketOverrides & {
  affiliateUrl: string;
  isAlternative?: false;
  marketProductId?: string;
  price: MarketplacePrice<"USD">;
};

export type PolishProductMarketVariant =
  | (ProductMarketOverrides & {
    affiliateUrl: string;
    isAlternative?: false;
    marketProductId?: string;
    price: PolishMarketplacePrice;
  })
  | {
    affiliateUrl: string;
    isAlternative: true;
    marketProductId: string;
    name: string;
    benefit: string;
    description: string;
    image: string;
    imageAlt: string;
    trustSignal?: "Editorial pick" | "Routine essential" | "Editor favorite";
    gallery?: ProductGalleryImage[];
    video?: string | null;
    slug?: string;
    price: PolishMarketplacePrice;
  };

export type ProductBase = {
  id: string;
  name: string;
  categoryId: CategoryId;
  benefit: string;
  description: string;
  trustSignal: "Editorial pick" | "Routine essential" | "Editor favorite";
  image: string;
  imageAlt: string;
  gallery?: ProductGalleryImage[];
  video?: string | null;
  slug?: string;
};

export type ProductDefinition = ProductBase & {
  marketVariants: {
    us: UsProductMarketVariant;
    pl?: PolishProductMarketVariant;
  };
};

export type Product = ProductBase & {
  marketVariants: ProductDefinition["marketVariants"];
  activeMarket: "us" | "pl";
  isMarketAlternative: boolean;
  affiliateUrl: string;
  marketProductId?: string;
  price: MarketplacePrice;
  slug: string;
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
  urgencySignal?: {
    label: string;
    intensity: "low" | "medium" | "high";
  };
};

export type TopPickBadge = "Editorial Pick" | "Routine Essential" | "Worth Considering";

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
  contactEmail: "info@luxauracare.com",
  keywords: [
    "self-care rituals",
    "skincare guides",
    "body glow routines",
    "sleep reset rituals",
    "pinterest aesthetic skincare",
    "viral amazon beauty favorites",
    "luxury wellness editorial",
    "glass skin routine",
    "at-home spa experience",
    "evening wind-down habits",
    "beauty ritual guides",
    "holistic self-care",
    "minimalist skincare",
    "clean beauty essentials",
    "wellness lifestyle",
  ],
  plKeywords: [
    "rytuały self-care",
    "przewodnik po pielęgnacji",
    "metody na body glow",
    "higiena snu",
    "estetyka pinterest",
    "ulubieńcy z amazon",
    "luksusowa pielęgnacja",
    "efekt glass skin",
    "domowe spa",
    "wieczorne rytuały",
    "nawyki przed snem",
    "pielęgnacja ciała i twarzy",
    "wellness polska",
  ],
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

export const products: ProductDefinition[] = [
  {
    id: "silk-sleep-mask",
    name: "Mulberry Silk Sleep Mask",
    categoryId: "self-care",
    benefit: "Deeper sleep with less friction on delicate skin.",
    description:
      "A breathable silk mask that blocks ambient light and helps your bedtime routine feel intentional from the first minute.",
    trustSignal: "Editorial pick",
    image:
      "/silk-sleep-mask/Mulberry_Silk_Sleep_Mask_img.png",
    imageAlt: "Champagne silk sleep mask on linen bedding",
    gallery: [
      {
        image: "/silk-sleep-mask/Mulberry_Silk_Sleep_Mask_img.png",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Main View",
      },
      {
        image: "/silk-sleep-mask/details_1_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_2_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_3_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_4_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_5_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_6_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_7_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      },
      {
        image: "/silk-sleep-mask/details_8_Mulberry_Silk_Sleep_Mask_img.jpg",
        imageAlt: "Champagne silk sleep mask on linen bedding",
        title: "Product Details",
      }
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4cqWOsQ",
        price: { status: "indicative", amount: 17.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4g2nwKr",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "aroma-diffuser",
    name: "Ceramic Ultrasonic Diffuser",
    categoryId: "spa-relax",
    benefit: "Instant atmosphere shift with a soft ambient glow.",
    description:
      "Quiet mist diffusion paired with warm light to transform your bedroom or bath into a calm ritual space.",
    trustSignal: "Routine essential",
    image:
      "/aroma-diffuser/URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.png",
    imageAlt: "Minimal ceramic diffuser on a wooden side table",
    gallery: [
      {
        image: "/aroma-diffuser/URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic ultrasonic essential oil diffuser",
        title: "Main View",
      },
      {
        image: "/aroma-diffuser/details_1_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_2_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_3_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_4_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_5_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_6_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
      {
        image: "/aroma-diffuser/details_7_URPOWER_120ML_Ceramic_Essential_Oil_Diffuser.jpg",
        imageAlt: "Ceramic diffuser product detail",
        title: "Product Details",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4ci1wsS",
        price: { status: "indicative", amount: 29.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4uQYaTy",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
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
      "/gua-sha-set/BAIMEI_IcyMe_Jade_Roller_GuaSha.png",
    imageAlt: "Rose quartz gua sha and roller next to facial oil",
    gallery: [
      {
        image: "/gua-sha-set/BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha facial massage set",
        title: "Main View",
      },
      {
        image: "/gua-sha-set/details_1_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_2_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_3_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_4_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_5_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_6_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_7_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
      {
        image: "/gua-sha-set/details_8_BAIMEI_IcyMe_Jade_Roller_GuaSha.jpg",
        imageAlt: "Jade roller and gua sha set product detail",
        title: "Product Details",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/3OOjASh",
        price: { status: "indicative", amount: 14.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/44oMrRf",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "body-oil",
    name: "Firming Body Massage Oil for Cellulite – Collagen Infused Skin Tightening Oil",
    categoryId: "body-glow",
    benefit: "Soft, luminous skin that does not feel greasy.",
    description:
      "Fast-absorbing botanical oil that seals in hydration and leaves a healthy satin finish.",
    trustSignal: "Editorial pick",
    image:
      "/body-oil/Firming_Body_Massage_Oil_with_Collagen_Stem_Cell.png",
    imageAlt: "Elegant body oil bottle with golden reflection",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4vKVOY6",
        price: { status: "indicative", amount: 24.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/3QEgiC6",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "bath-salts",
    name: "Magnesium Bath Flakes Zechstein – Relaxing Soak for Muscle Recovery & Stress Relief",
    categoryId: "spa-relax",
    benefit: "Relaxes tense muscles and improves sleep quality.",
    description:
      "Mineral-rich bath salts that help release body tension and support calm, heavy-limb rest.",
    trustSignal: "Routine essential",
    image:
      "/bath-salts/Ancient_Minerals_Magnesium_Bath_Flakes_of_Pure_Genuine_Zechstein_Chloride.png",
    imageAlt: "Bath salts in a glass jar near a towel",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4sTbNAP",
        price: { status: "indicative", amount: 34.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4w3Ocz4",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "retinol-serum",
    name: "RoC Retinol Night Serum Capsules – Anti-Aging, Wrinkle Repair & Smooth Skin Treatment",
    categoryId: "skincare",
    benefit: "Smoother skin texture with consistent nighttime use.",
    description:
      "A beginner-friendly retinol blend buffered with squalane to reduce irritation while improving radiance.",
    trustSignal: "Editorial pick",
    image:
      "/retinol-serum/RoC_Retinol_Correxion_Anti-Aging_Wrinkle_Night_Serum.png",
    imageAlt: "Dropper serum bottle on marble tray",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4cE9qvj",
        price: { status: "indicative", amount: 26.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/43NinyH",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "dry-brush",
    name: "Natural Bristle Dry Brush",
    categoryId: "body-glow",
    benefit: "Dry Body Brush for Glowing Skin – Exfoliate, Boost Circulation & Smooth Texture",
    description:
      "Dry brushing before your shower supports exfoliation and leaves skin looking more refined.",
    trustSignal: "Editor favorite",
    image:
      "/dry-brush/EcoTools_Dry_Body_Brush_Cruelty_Free_Bristles_Exfoliate.png",
    imageAlt: "Natural dry brush and folded towels",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4e39ozA",
        price: { status: "indicative", amount: 12.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4eYp8Ut",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "led-mask",
    name: "INIA Glow 2 LED Face Mask – Red Light Therapy 850nm NIR, 4 Modes, Rechargeable",
    categoryId: "skincare",
    benefit: "Low-effort treatment that supports clearer, brighter skin.",
    description:
      "Hands-free LED sessions that layer into your routine while you journal, read, or unwind.",
    trustSignal: "Routine essential",
    image:
      "/led-mask/INIA_Red_Light_Therapy_Mask_for_Face.png",
    imageAlt: "Modern LED skincare mask on vanity",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4u6HGqw",
        price: { status: "indicative", amount: 59.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4uRSZTu",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "weighted-blanket",
    name: "Weighted Blanket for Adults – Cooling, Stress Relief & Better Sleep Comfort",
    categoryId: "self-care",
    benefit: "Nervous-system support for calmer nights.",
    description:
      "Balanced pressure and breathable texture help reduce bedtime restlessness without overheating.",
    trustSignal: "Editorial pick",
    image:
      "/weighted-blanket/Weighted_Blanket_for_Adults–Cooling_Stress_Relief_Better_Sleep_Comfort.png",
    imageAlt: "Soft weighted blanket folded on a bed",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4tXLN88",
        price: { status: "indicative", amount: 59.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4w8WZ32",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "scalp-massager",
    name: "Scalp Massager Shampoo Brush – Silicone Scrubber for Hair Growth & Dandruff Removal",
    categoryId: "self-care",
    benefit: "Turns hair wash into a stress-release ritual.",
    description:
      "Flexible silicone bristles provide gentle stimulation for a cleaner scalp and a more relaxing shower.",
    trustSignal: "Routine essential",
    image:
      "/scalp-massager/Scalp_Massager_Shampoo_Brush–Silicone_Scrubber.png",
    imageAlt: "Handheld scalp massager on bathroom shelf",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4dXdAAW",
        price: { status: "indicative", amount: 10.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4ae3h8V",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "sheet-mask-set",
    name: "Biodance Bio-Collagen Face Mask – Hydrating Overnight Korean Skincare for Glowing Skin",
    categoryId: "skincare",
    benefit: "Quick pre-event glow with instant hydration.",
    description:
      "Cooling hydrogel masks that visibly plump and prep skin before makeup or evening plans.",
    trustSignal: "Editor favorite",
    image:
      "/sheet-mask-set/Biodance_Bio_Collagen_Face_Mask.png",
    imageAlt: "Hydrogel sheet masks and a jade bowl",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4sRB3ax",
        price: { status: "indicative", amount: 24.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4xKXhOU",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "candle-set",
    name: "WoodWick Warm Woods Trilogy Candle – Crackling Wick Scented Gift, Cozy Home Fragrance",
    categoryId: "spa-relax",
    benefit: "Creates a calm mood in under five minutes.",
    description:
      "Layered woody fragrance with a clean burn profile for evening rituals and bath sessions.",
    trustSignal: "Editorial pick",
    image:
      "/candle-set/Sandalwood_Candle.png",
    imageAlt: "Three elegant candles with warm glow",
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/3OVuO7x",
        price: { status: "indicative", amount: 34.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/3SnW4Nw",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "niacinamide-toner",
    name: "Naturium Niacinamide Face Serum 12% Plus Zinc 2%",
    categoryId: "skincare",
    benefit: "Visible brightening and tone-balancing hydration for a clearer-looking glow.",
    description:
      "A high-performance serum with 12% Niacinamide and 2% Zinc designed to target dullness and support a brighter, more even complexion.",
    trustSignal: "Editorial pick",
    image: "/niacinamide-toner/Naturium_Niacinamide_Face_Serum_12.png",
    imageAlt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
    gallery: [
      {
        image: "/niacinamide-toner/Naturium_Niacinamide_Face_Serum_12.png",
        imageAlt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
        title: "Main View",
      },
      {
        image: "/niacinamide-toner/details_1_Naturium_Niacinamide_Face_Serum.jpg",
        imageAlt: "Naturium Niacinamide Face Serum details and formulation",
        title: "Product Details",
      },
      {
        image: "/niacinamide-toner/details_2_Naturium_Niacinamide_Face_Serum.jpg",
        imageAlt: "Naturium Niacinamide Face Serum ingredients and benefits",
        title: "Key Ingredients",
      },
      {
        image: "/niacinamide-toner/details_3_Naturium_Niacinamide_Face_Serum.jpg",
        imageAlt: "Naturium Niacinamide Face Serum application guide",
        title: "How to Use",
      },
      {
        image: "/niacinamide-toner/details_4_Naturium_Niacinamide_Face_Serum.jpg",
        imageAlt: "Naturium Niacinamide Face Serum texture and finish",
        title: "Texture",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/480WDBY",
        price: { status: "indicative", amount: 18.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4eqObzv",
        price: { status: "unknown", amount: null, currency: "PLN" },
      },
    },
  },
  {
    id: "coslus-cleansing-brush",
    name: "COSLUS 7-in-1 Facial Cleansing Brush",
    categoryId: "skincare",
    benefit: "Deeper cleanse and easier makeup removal without over-scrubbing.",
    description:
      "A multi-head facial brush set designed to remove buildup, improve cleansing consistency, and prep skin for actives.",
    trustSignal: "Routine essential",
    image: "/coslus-cleansing-brush/Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.png",
    imageAlt: "COSLUS 7-in-1 facial cleansing brush set with accessories",
    gallery: [
      {
        image: "/coslus-cleansing-brush/Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.png",
        imageAlt: "COSLUS waterproof 7-in-1 facial cleansing brush set with interchangeable heads",
        title: "7-in-1 Cleansing Set",
      },
      {
        image: "/coslus-cleansing-brush/model_2_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpeg",
        imageAlt: "Woman holding the COSLUS facial cleansing brush during her bathroom skincare routine",
        title: "At-Home Cleansing",
      },
      {
        image: "/coslus-cleansing-brush/details_2_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
        imageAlt: "COSLUS facial cleansing brush benefits for oil, blackheads, pores and makeup removal",
        title: "Deep-Cleansing Benefits",
      },
      {
        image: "/coslus-cleansing-brush/details_1_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
        imageAlt: "COSLUS interchangeable cleansing, exfoliating and massage brush heads",
        title: "Seven Brush Heads",
      },
      {
        image: "/coslus-cleansing-brush/details_3_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
        imageAlt: "Close-up of the soft COSLUS silicone brush head for sensitive skin",
        title: "Sensitive-Skin Head",
      },
      {
        image: "/coslus-cleansing-brush/details_4_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
        imageAlt: "COSLUS waterproof spin brush feature comparison",
        title: "Why COSLUS",
      },
      {
        image: "/coslus-cleansing-brush/model_1_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpeg",
        imageAlt: "Woman rinsing her face beside the COSLUS cleansing brush and product box",
        title: "Rinse and Refresh",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/41WZCaT",
        price: { status: "indicative", amount: 19.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4aZXvrL",
        price: { status: "indicative", amount: 176.13, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B00NDNDN5A",
        slug: "beurer-fc-95-szczoteczka-do-twarzy",
        name: "Beurer FC 95 szczoteczka do oczyszczania twarzy",
        benefit: "Dokladniejsze oczyszczanie twarzy i wygodne usuwanie makijazu bez mocnego pocierania skory.",
        description:
          "Elektryczna szczoteczka do oczyszczania twarzy z wymiennymi koncowkami, ktora pomaga utrzymac regularny rytual oczyszczania i przygotowuje skore na kolejne kroki pielegnacji.",
        image: "/coslus-cleansing-brush/Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.png",
        imageAlt: "Beurer FC 95 szczoteczka do oczyszczania twarzy jako polski odpowiednik zestawu COSLUS",
        trustSignal: "Routine essential",
        gallery: [
          {
            image: "/coslus-cleansing-brush/pl_beurer-fc95-elektryczna-szczoteczka-do-twarzy-amazon-pl-lux-aura-care.png",
            imageAlt: "Szczoteczka do oczyszczania twarzy z wymiennymi koncowkami",
            title: "Main View",
          },
          {
            image: "/coslus-cleansing-brush/details_1_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
            imageAlt: "Wymienne koncowki szczoteczki do oczyszczania twarzy",
            title: "Brush Heads",
          },
          {
            image: "/coslus-cleansing-brush/details_2_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
            imageAlt: "Miekka koncowka szczoteczki do twarzy",
            title: "Sensitive-Skin Head",
          },
          {
            image: "/coslus-cleansing-brush/details_3_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
            imageAlt: "Miekka koncowka szczoteczki do twarzy",
            title: "Sensitive-Skin Head",
          },
          {
            image: "/coslus-cleansing-brush/details_4_Cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpg",
            imageAlt: "Miekka koncowka szczoteczki do twarzy",
            title: "Sensitive-Skin Head",
          },
        ],
      },
    },
  },
  {
    id: "mixsoon-bean-essence",
    name: "mixsoon Bean Essence Exfoliating Treatment",
    categoryId: "skincare",
    benefit: "Softer texture and glow with low-friction exfoliation support.",
    description:
      "A gentle essence that helps smooth rough patches and improves product layering for a polished glass-skin finish.",
    trustSignal: "Editor favorite",
    image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating.png",
    imageAlt: "mixsoon Bean Essence exfoliating skincare product image",
    gallery: [
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating.png",
        imageAlt: "mixsoon Bean Essence glass-skin treatment and key skincare benefits",
        title: "Glass Skin Results",
      },
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating_details_1.jpg",
        imageAlt: "mixsoon Bean Essence guide for exfoliating and hydrating use",
        title: "Two Ways to Use",
      },
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating_details_2.jpg",
        imageAlt: "Four fermented ingredients in mixsoon Bean Essence",
        title: "Fermented Ingredients",
      },
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating_details_3.jpg",
        imageAlt: "How fermentation supports ingredient absorption in mixsoon Bean Essence",
        title: "Why Fermentation",
      },
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating_details_4.jpg",
        imageAlt: "mixsoon essence layering routine ordered from low to high viscosity",
        title: "Essence Layering",
      },
      {
        image: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating_details_5.jpg",
        imageAlt: "Three-step mixsoon Bean Care routine with toner pad, essence and serum",
        title: "Bean Care Routine",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4vogHrF",
        price: { status: "indicative", amount: 28.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4oKRZPD",
        price: { status: "indicative", amount: 50.99, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B07Z97H5HS",
        name: "COSRX Advanced Snail 96 Mucin Power Essence",
        slug: "cosrx-advanced-snail-96",
        benefit: "Głębokie nawilżenie i regeneracja bariery ochronnej skóry.",
        description: "Lekka, łagodząca esencja z 96% filtratem ze śluzu ślimaka. Podobnie jak esencja z fasoli (Mixsoon), zapewnia efekt 'glass skin', intensywnie nawilża i wygładza fakturę skóry, będąc najpopularniejszym odpowiednikiem na polskim rynku.",
        video: null,
        image: "/cosrx-snail-mucin/main_product_photo.png",
        imageAlt: "COSRX Snail Mucin Essence",
        gallery: [
          {
            image: "/cosrx-snail-mucin/1_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/2_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/3_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/4_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/5_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/6_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/7_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          }, {
            image: "/cosrx-snail-mucin/8_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },
          {
            image: "/cosrx-snail-mucin/9_product_photo.jpg",
            imageAlt: "COSRX Snail Mucin Essence",
            title: "Main View",
          },

        ]
      },
    },
  },
  {
    id: "cliganic-essential-oils",
    name: "Cliganic Organic Aromatherapy Essential Oils Set",
    categoryId: "spa-relax",
    benefit: "Instant mood shift and calmer evenings through scent layering.",
    description:
      "A curated essential oil set for diffuser rituals, bath ambiance, and repeatable stress-reset routines at home.",
    trustSignal: "Editorial pick",
    image: "/cliganic-essential-oils/Cliganic_Organic_Aromatherapy.png",
    imageAlt: "Cliganic organic aromatherapy essential oils set product image",
    gallery: [
      {
        image: "/cliganic-essential-oils/Cliganic_Organic_Aromatherapy.png",
        imageAlt: "Cliganic organic aromatherapy essential oils set product image",
        title: "Main View",
      },
      {
        image: "/cliganic-essential-oils/details_1_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils overview",
        title: "Product Overview",
      },
      {
        image: "/cliganic-essential-oils/details_2_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils scents",
        title: "Scent Collection",
      },
      {
        image: "/cliganic-essential-oils/details_3_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils benefits",
        title: "Aromatherapy Benefits",
      },
      {
        image: "/cliganic-essential-oils/details_4_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils usage",
        title: "How to Use",
      },
      {
        image: "/cliganic-essential-oils/details_5_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils purity",
        title: "Quality & Purity",
      },
      {
        image: "/cliganic-essential-oils/details_6_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils packaging",
        title: "Packaging",
      },
      {
        image: "/cliganic-essential-oils/details_7_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils sourcing",
        title: "Sourcing",
      },
      {
        image: "/cliganic-essential-oils/details_8_Cliganic_Organic_Aromatherapy_Essential_Oils.jpg",
        imageAlt: "Cliganic Essential Oils additional details",
        title: "Additional Details",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4sFqWpd",
        price: { status: "indicative", amount: 22.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4vCzAqN",
        price: { status: "indicative", amount: 33.99, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B0C7ZR2XQ4",
        slug: "aeshory-zestaw-olejkow-eterycznych",
        name: "AESHORY 100% Naturalny Zestaw Olejków Eterycznych (6 x 10ml)",
        benefit: "Natychmiastowa zmiana nastroju i spokojniejsze wieczory dzięki certyfikowanym aromatom.",
        description: "Kompletny zestaw czystych olejków eterycznych do dyfuzora i aromaterapii. Zawiera najchętniej wybierane zapachy (Lawenda, Mięta, Drzewo Herbaciane, Słodka Pomarańcza, Eukaliptus), które idealnie sprawdzają się do relaksu i domowego spa. Najpopularniejszy odpowiednik na polskim Amazonie.",
        video: "/cliganic-essential-oils/PL_UGC_aeshory-zestaw-olejkow-eterycznych.mp4",
        image: "/cliganic-essential-oils/PL_aeshory-zestaw-olejkow-eterycznych-amazon-pl-lux-aura-care.png",
        imageAlt: "AESHORY Zestaw Olejków Eterycznych",
        gallery: [
          {
            image: "/cliganic-essential-oils/details_1_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "AESHORY Olejki Eteryczne zestaw",
            title: "Zestaw 6 zapachów",
          },
          {
            image: "/cliganic-essential-oils/details_2_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
          {
            image: "/cliganic-essential-oils/details_3_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
          {
            image: "/cliganic-essential-oils/details_4_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
          {
            image: "/cliganic-essential-oils/details_5_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
          {
            image: "/cliganic-essential-oils/details_6_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
          {
            image: "/cliganic-essential-oils/details_7_aeshory_zestaw_olejkow_eterycznych.jpg",
            imageAlt: "Zastosowanie olejków eterycznych AESHORY",
            title: "Aromaterapia i dyfuzory",
          },
        ]
      },
    },
  },
  {
    id: "copper-water-bottle",
    name: "34oz Pure Copper Water Bottle Set",
    categoryId: "self-care",
    benefit: "Hydration ritual that feels premium and easier to repeat daily.",
    description:
      "A large uncoated copper bottle with cup designed for habit consistency, elevated desk aesthetics, and daily hydration momentum.",
    trustSignal: "Routine essential",
    image: "/copper-water-bottle/Copper_Water_Bottle.png",
    imageAlt: "Pure copper water bottle with matching cup",
    gallery: [
      {
        image: "/copper-water-bottle/Copper_Water_Bottle.png",
        imageAlt: "Pure copper water bottle with matching cup",
        title: "Main View",
      },
      {
        image: "/copper-water-bottle/details_1_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle details",
        title: "Product Details",
      },
      {
        image: "/copper-water-bottle/details_2_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle design",
        title: "Design",
      },
      {
        image: "/copper-water-bottle/details_3_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle material",
        title: "Material",
      },
      {
        image: "/copper-water-bottle/details_4_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle features",
        title: "Features",
      },
      {
        image: "/copper-water-bottle/details_5_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle benefits",
        title: "Benefits",
      },
      {
        image: "/copper-water-bottle/details_6_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle usage",
        title: "How to Use",
      },
      {
        image: "/copper-water-bottle/details_7_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle care",
        title: "Care Instructions",
      },
      {
        image: "/copper-water-bottle/details_8_Copper_Water_Bottle.jpg",
        imageAlt: "Copper Water Bottle lifestyle",
        title: "Lifestyle",
      },
      {
        image: "/copper-water-bottle/Copper_Water_Bottle_2_model.jpeg",
        imageAlt: "Woman using a pure copper water bottle set",
        title: "In Daily Routine",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4c0ZSdu",
        price: { status: "indicative", amount: 24.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4eXDL9E",
        price: { status: "indicative", amount: 149.06, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B077K7F3WD",
        slug: "jmd-international-mlotkowana-butelka-z-czystej-miedzi-900-ml",
        name: "JMD INTERNATIONAL młotkowana butelka z czystej miedzi 900 ml",
        benefit: "Codzienny rytual nawodnienia w estetycznej, wielorazowej butelce z czystej miedzi.",
        description:
          "Mlotkowana butelka podrozna z czystej miedzi o pojemnosci 900 ml, wybrana jako polski odpowiednik premium butelki miedzianej dzieki mocniejszemu social proof, cenie Prime i dostawie przez Amazon.",
        image: "/copper-water-bottle/PL_miedziana-butelka-na-wode-900ml-amazon-pl-lux-aura-care.png",
        imageAlt: "JMD INTERNATIONAL młotkowana butelka z czystej miedzi jako polski odpowiednik Copper Water Bottle",
        trustSignal: "Routine essential",
        gallery: [

          {
            image: "/copper-water-bottle/PL_Copper_Water_Bottle.jpg",
            imageAlt: "Mlotkowana butelka z czystej miedzi",
            title: "Main View",
          },
          {
            image: "/copper-water-bottle/PL_details_1_Copper_Water_Bottle.jpg",
            imageAlt: "Detal wykonania butelki z czystej miedzi",
            title: "Product Details",
          },
          {
            image: "/copper-water-bottle/PL_details_2_Copper_Water_Bottle.jpg",
            imageAlt: "Instrukcje pielegnacji butelki miedzianej",
            title: "Care Instructions",
          },
          {
            image: "/copper-water-bottle/PL_details_3_Copper_Water_Bottle.jpg",
            imageAlt: "Detal wykonania butelki z czystej miedzi",
            title: "Product Details",
          },
          {
            image: "/copper-water-bottle/PL_details_4_Copper_Water_Bottle.jpg",
            imageAlt: "Instrukcje pielegnacji butelki miedzianej",
            title: "Care Instructions",
          },
          {
            image: "/copper-water-bottle/PL_details_5_Copper_Water_Bottle.jpg",
            imageAlt: "Instrukcje pielegnacji butelki miedzianej",
            title: "Care Instructions",
          },
        ],
      },
    },
  },
  {
    id: "magnesium-supplement",
    name: "Pure Encapsulations Magnesium (Glycinate)",
    categoryId: "self-care",
    benefit: "Calms the nervous system and supports deeper, more restorative sleep.",
    description:
      "A highly absorbable form of magnesium designed to help muscles relax and support a peaceful transition into sleep.",
    trustSignal: "Editor favorite",
    image: "/magnesium-supplement/Pure_Encapsulations_Magnesium_Glycinate.png",
    imageAlt: "Pure Encapsulations Magnesium Glycinate supplement bottle",
    gallery: [
      {
        image: "/magnesium-supplement/Pure_Encapsulations_Magnesium_Glycinate.png",
        imageAlt: "Pure Encapsulations Magnesium Glycinate supplement bottle",
        title: "Main View",
      },
      {
        image: "/magnesium-supplement/details_1_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate details",
        title: "Product Details",
      },
      {
        image: "/magnesium-supplement/details_2_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate ingredients",
        title: "Ingredients",
      },
      {
        image: "/magnesium-supplement/details_3_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate benefits",
        title: "Key Benefits",
      },
      {
        image: "/magnesium-supplement/details_4_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate usage",
        title: "How to Use",
      },
      {
        image: "/magnesium-supplement/details_5_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate formulation",
        title: "Formulation",
      },
      {
        image: "/magnesium-supplement/details_6_Pure_Encapsulations_Magnesium_Glycinate.jpg",
        imageAlt: "Pure Encapsulations Magnesium Glycinate quality",
        title: "Quality",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4bY0MZC",
        price: { status: "indicative", amount: 34.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4xIruhD",
        price: { status: "indicative", amount: 73.99, currency: "PLN" },
        isAlternative: true,
        marketProductId: "ASIN_PRODUKTU_Z_URL",
        slug: "cytrynian-magnezu-1480-mg-240-kapsulek-weganskich",
        name: "Cytrynian magnezu 1480 mg – 240 kapsułek wegańskich",
        benefit: "Wygodne wsparcie regeneracji i dobrego snu w formie łatwych do połknięcia kapsułek, idealne do wieczornego rytuału relaksacyjnego.",
        description: "Bathing for the sake of cleanliness is a daily task; bathing for recovery is a mineral ritual. Magnesium bath flakes are notably more absorbable than traditional salts, allowing for deeper muscle relaxation and improved skin barrier support. The heat of the water paired with the mineral infusion helps drop your internal temperature afterward, which is a key signal for sleep readiness.",
        image: "/magnesium-supplement/main_photo_cytrynian-magnezu.png",
        imageAlt: "Polish version of product",
        trustSignal: "Routine essential",
        gallery: [
          {
            image: "/magnesium-supplement/2_pl_main_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
          {
            image: "/magnesium-supplement/3_pl_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
          {
            image: "/magnesium-supplement/4_pl_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
          {
            image: "/magnesium-supplement/5_pl_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
          {
            image: "/magnesium-supplement/6_pl_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
          {
            image: "/magnesium-supplement/7_pl_photo_cytrynian-magnezu.jpg",
            imageAlt: "Polish version of product",
            title: "Main View",
          },
        ],
      },
    },
  },
  {
    id: "pavilia-plush-robe",
    name: "PAVILIA Premium Women's Plush Soft Robe",
    categoryId: "spa-relax",
    benefit: "Warm post-shower comfort that anchors evening wind-down habits.",
    description:
      "A soft plush robe that turns ordinary evenings into a repeatable at-home spa cue and supports ritual consistency.",
    trustSignal: "Routine essential",
    image: "/pavilia-plush-robe/PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.png",
    imageAlt: "PAVILIA premium women's plush soft robe product image",
    gallery: [
      {
        image: "/pavilia-plush-robe/PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.png",
        imageAlt: "PAVILIA premium women's plush soft robe product image",
        title: "Main View",
      },
      {
        image: "/pavilia-plush-robe/details_1_PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.jpg",
        imageAlt: "PAVILIA plush robe details",
        title: "Product Details",
      },
      {
        image: "/pavilia-plush-robe/details_2_PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.jpg",
        imageAlt: "PAVILIA plush robe texture",
        title: "Texture",
      },
      {
        image: "/pavilia-plush-robe/details_3_PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.jpg",
        imageAlt: "PAVILIA plush robe fit",
        title: "Fit & Style",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4cnPAnV",
        price: { status: "indicative", amount: 49.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4uZcJ7u",
        marketProductId: "B084PCS575",
        video: "/pavilia-plush-robe/PL_pavilia_premium_womans_plush_soft_rober_ugc.mp4",
        name: "PAVILIA Damski pluszowy miękki szlafrok premium",
        benefit: "Ciepły, miękki komfort po kąpieli, który domyka wieczorny rytuał relaksu.",
        description:
          "Pluszowy szlafrok typu sherpa z miękkiego polaru, zaprojektowany jako przyjemna warstwa ciepła po prysznicu, kąpieli lub domowym spa.",
        image: "/pavilia-plush-robe/pl_main_photo_product.png",
        imageAlt: "PAVILIA damski pluszowy szlafrok premium w kolorze jasnoróżowym",
        gallery: [
          {
            image: "/pavilia-plush-robe/pl_2_back_side_pavila_photo.jpg",
            imageAlt: "Tył jasnoróżowego pluszowego szlafroka PAVILIA",
            title: "Back View",
          },
          {
            image: "/pavilia-plush-robe/pl_3_front_side_pavila_photo.jpg",
            imageAlt: "Przód jasnoróżowego pluszowego szlafroka PAVILIA",
            title: "Front View",
          },
          {
            image: "/pavilia-plush-robe/pl_4_details_side_pavila_photo.jpg",
            imageAlt: "Detal miękkiego polarowego materiału szlafroka PAVILIA",
            title: "Product Details",
          },
          {
            image: "/pavilia-plush-robe/pl_5_details_side_pavila_photo.jpg",
            imageAlt: "Detal kaptura i pluszowej faktury szlafroka PAVILIA",
            title: "Texture",
          },
          {
            image: "/pavilia-plush-robe/pl_6_details_side_pavila_photo.jpg",
            imageAlt: "Detal pasa i kieszeni pluszowego szlafroka PAVILIA",
            title: "Fit & Style",
          },
        ],
        price: { status: "indicative", amount: 245.99, currency: "PLN" },
      },
    },
  },
  {
    id: "derma-roller",
    name: "Koi Beauty Professional Derma Roller",
    categoryId: "skincare",
    benefit: "At-home microneedling for smoother texture and better serum absorption.",
    description:
      "A titanium microneedle roller with 200 individual pins, designed for beginners. Helps refine texture on face, body, and scalp and primes skin for deeper serum penetration.",
    trustSignal: "Editor favorite",
    image: "/derma-roller/Koi_Beauty_Derma_Roller.png",
    imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
    gallery: [
      {
        image: "/derma-roller/Koi_Beauty_Derma_Roller.png",
        imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
        title: "Main View",
      },
      {
        image: "/derma-roller/details_1_Koi_Beauty_Derma_Roller.jpg",
        imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
        title: "Product Details",
      },
      {
        image: "/derma-roller/details_2_Koi_Beauty_Derma_Roller.jpg",
        imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
        title: "Texture",
      },
      {
        image: "/derma-roller/details_3_Koi_Beauty_Derma_Roller.jpg",
        imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
        title: "Fit & Style",
      },
      {
        image: "/derma-roller/details_4_Koi_Beauty_Derma_Roller.jpg",
        imageAlt: "Koi Beauty titanium microneedle derma roller with storage case",
        title: "Fit & Style",
      }
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4oKipRl",
        price: { status: "indicative", amount: 22.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4eA71El",
        price: { status: "indicative", amount: 75.00, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B08CXWMWFM",
        slug: "angel-kiss-derma-roller-tytanowe-mikroigly",
        name: "Angel Kiss Derma Roller z tytanowymi mikroiglami",
        benefit: "Domowe wsparcie gladkiej tekstury skory i lepszego wchlaniania serum.",
        description:
          "Derma roller z tytanowymi mikroiglami, wybrany jako polski odpowiednik narzedzia do delikatnej pielęgnacji tekstury skory. Przed uzyciem sprawdz instrukcje producenta i nie stosuj na podrazniona skore.",
        image: "/derma-roller/PL_angel-kiss-derma-roller-03mm-amazon-pl-lux-aura-care.png",
        imageAlt: "Angel Kiss Derma Roller jako polski odpowiednik Koi Beauty Professional Derma Roller",
        trustSignal: "Editor favorite",
        gallery: [
          {
            image: "/derma-roller/PL_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Derma roller z tytanowymi mikroiglami",
            title: "Main View",
          },
          {
            image: "/derma-roller/PL_details_1_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Detal derma rollera i etui",
            title: "Product Details",
          },
          {
            image: "/derma-roller/PL_details_2_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Glowica derma rollera z mikroiglami",
            title: "Microneedle Head",
          },
          {
            image: "/derma-roller/PL_details_3_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Detal derma rollera i etui",
            title: "Product Details",
          },
          {
            image: "/derma-roller/PLdetails_4_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Glowica derma rollera z mikroiglami",
            title: "Microneedle Head",
          },
          {
            image: "/derma-roller/PL_details_5_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Detal derma rollera i etui",
            title: "Product Details",
          },
          {
            image: "/derma-roller/PL_details_6_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Glowica derma rollera z mikroiglami",
            title: "Microneedle Head",
          },
          {
            image: "/derma-roller/PL_details_7_Koi_Beauty_Derma_Roller.jpg",
            imageAlt: "Glowica derma rollera z mikroiglami",
            title: "Microneedle Head",
          },
        ],
      },
    },
  },
  {
    id: "aveeno-oil-mist",
    name: "Aveeno Daily Moisturizing Body Oil Mist",
    categoryId: "body-glow",
    benefit: "Instantly softer, smoother skin with a non-greasy, healthy satin finish.",
    description:
      "A lightweight body oil spray formulated with oat and jojoba oil to lock in moisture and leave skin looking polished.",
    trustSignal: "Routine essential",
    image: "/aveeno-oil-mist/cover_aveeno_oil.png",
    imageAlt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
    gallery: [
      {
        image: "/aveeno-oil-mist/cover_aveeno_oil.png",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
        title: "Main View",
      },
      {
        image: "/aveeno-oil-mist/details_1_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist details",
        title: "Product Details",
      },
      {
        image: "/aveeno-oil-mist/details_2_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist ingredients",
        title: "Key Ingredients",
      },
      {
        image: "/aveeno-oil-mist/details_3_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist benefits",
        title: "Benefits",
      },
      {
        image: "/aveeno-oil-mist/details_4_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist application",
        title: "How to Use",
      },
      {
        image: "/aveeno-oil-mist/details_5_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist finish",
        title: "Finish",
      },
      {
        image: "/aveeno-oil-mist/details_6_aveeno-oil-mist.jpg",
        imageAlt: "Aveeno Daily Moisturizing Body Oil Mist quality",
        title: "Quality",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/3ObFRt3",
        price: { status: "indicative", amount: 12.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/3QAYLLa",
        price: { status: "indicative", amount: 49.00, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B002MDAOSQ",
        slug: "avon-skin-so-soft-suchy-olejek",
        name: "Avon Skin So Soft Suchy olejek do ciała z olejkiem jojoba (2 x 150ml)",
        benefit: "Lekka mgiełka olejkowa szybko się wchłania, intensywnie nawilżając i regenerując skórę po kąpieli.",
        description: "Kultowy suchy olejek od Avon wzbogacony olejkiem jojoba. Doskonała alternatywa dla mgiełek olejkowych – błyskawicznie nawilża, pozostawiając skórę jedwabiście gładką bez uczucia lepkości. Idealny element domowego rytuału SPA.",
        image: "/aveeno-oil-mist/pl_aveeno-oil-mist.png",
        imageAlt: "Avon Skin So Soft Original Dry Oil Spray",
        video: null,
        gallery: [
          {
            image: "/aveeno-oil-mist/2_pl_photo_avon.jpg",
            imageAlt: "Avon Skin So Soft Original Dry Oil Spray",
            title: "Zestaw 2 sztuk",
          }
        ]
      },
    },
  },
  {
    id: "medicube-age-r-booster-pro",
    name: "Medicube AGE-R Booster Pro – 6-in-1 Korean Skin Care Device",
    categoryId: "skincare",
    benefit: "Enhances product absorption, firmness, elasticity, and overall texture.",
    description:
      "The Medicube AGE-R Booster Pro is a multi-mode Korean skincare device featuring Booster, MC, Derma Shot, Air Shot, and LED modes. Review the manufacturer instructions, contraindications, and recommended usage before adding the device to your routine.",
    trustSignal: "Editorial pick",
    image: "/medicube-age-r-booster-pro/Medicube_AGE_R_Booster_Pro.png",
    imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
    gallery: [
      {
        image: "/medicube-age-r-booster-pro/Medicube_AGE_R_Booster_Pro.png",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Main View",
      },
      {
        image: "/medicube-age-r-booster-pro/details_1_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Product Details",
      },
      {
        image: "/medicube-age-r-booster-pro/details_2_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Texture",
      },
      {
        image: "/medicube-age-r-booster-pro/details_3_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Fit & Style",
      },
      {
        image: "/medicube-age-r-booster-pro/details_4_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Fit & Style",
      },
      {
        image: "/medicube-age-r-booster-pro/details_5_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Fit & Style",
      },
      {
        image: "/medicube-age-r-booster-pro/details_6_Medicube_AGE_R_Booster_Pro.jpg",
        imageAlt: "Medicube AGE-R Booster Pro 6-in-1 Korean Skin Care Device",
        title: "Fit & Style",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4gA0A5m",
        price: { status: "indicative", amount: 299.00, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/3QGlXaR",
        price: { status: "indicative", amount: 373.86, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B0DQ4HSPMC",
        slug: "medicube-booster-pro-mini-white",
        name: "Medicube Booster Pro Mini White",
        benefit: "Kompaktowe wsparcie domowej pielęgnacji i lepszego nakładania kosmetyków aktywnych.",
        description:
          "Kompaktowe urzadzenie Medicube do domowej pielęgnacji, wybrane jako przystepniejszy polski odpowiednik AGE-R Booster Pro. Przed uzyciem sprawdz instrukcje, przeciwwskazania i zalecana czestotliwosc zabiegow.",
        image: "/medicube-age-r-booster-pro/PL_medicube-booster-pro-mini-white-glow-booster-amazon-pl-lux-aura-care.png",
        imageAlt: "Medicube Booster Pro Mini White jako polski odpowiednik Medicube AGE-R Booster Pro",
        trustSignal: "Editorial pick",
        gallery: [
          {
            image: "/medicube-age-r-booster-pro/PL_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Urzadzenie Medicube do domowej pielęgnacji twarzy",
            title: "Main View",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_1_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Funkcje urzadzenia Medicube do pielęgnacji twarzy",
            title: "Product Details",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_2_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Urzadzenie Medicube podczas rutyny skincare",
            title: "Routine Use",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_3_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Funkcje urzadzenia Medicube do pielęgnacji twarzy",
            title: "Product Details",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_4_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Urzadzenie Medicube podczas rutyny skincare",
            title: "Routine Use",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_5_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Funkcje urzadzenia Medicube do pielęgnacji twarzy",
            title: "Product Details",
          },
          {
            image: "/medicube-age-r-booster-pro/PL_details_6_Medicube_AGE_R_Booster_Pro.jpg",
            imageAlt: "Urzadzenie Medicube podczas rutyny skincare",
            title: "Routine Use",
          },
        ],
      },
    },
  },
  {
    id: "rosemary-hair-oil",
    name: "Botanic Hearth Rosemary Hair Oil for Growth",
    categoryId: "self-care",
    benefit: "Supports thicker, fuller-looking hair and nourishes the scalp.",
    description:
      "Botanic Hearth Rosemary Hair Oil is a scalp and hair treatment formulated with rosemary oil, biotin, castor oil, and jojoba oil. Review the full ingredient list and patch-test before use, especially if your scalp is sensitive.",
    trustSignal: "Routine essential",
    image: "/rosemary-hair-oil/botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.png",
    imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
    gallery: [
      {
        image: "/rosemary-hair-oil/botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.png",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Main View",
      },
      {
        image: "/rosemary-hair-oil/details_1_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Product Details",
      },
      {
        image: "/rosemary-hair-oil/details_2_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Texture",
      },
      {
        image: "/rosemary-hair-oil/details_3_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_4_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_5_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_6_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_7_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_8_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
      {
        image: "/rosemary-hair-oil/details_9_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
        imageAlt: "Botanic Hearth Rosemary Hair Oil for Growth",
        title: "Fit & Style",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/3QAuUCk",
        price: { status: "indicative", amount: 14.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4oUaxwN",
        price: { status: "indicative", amount: 54.99, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B0F2TR72BP",
        slug: "bionoble-organiczny-olejek-rozmarynowy-do-wlosow-50ml",
        name: "BIONOBLE Organiczny Olejek Rozmarynowy do Włosów 50 ml",
        benefit: "Rozmarynowy olejek do skory glowy, ktory wspiera rytual masazu skalpu i pielegnacje wlosow oslabionych.",
        description:
          "Organiczny olejek rozmarynowy do włosów z olejem rycynowym, arganowym i jojoba, wybrany jako polski odpowiednik kuracji Botanic Hearth dzięki widocznej cenie, dostępności oraz bardzo mocnemu social proof.",
        image: "/rosemary-hair-oil/PL_bionoble-organiczny-olejek-rozmarynowy-do-wlosow-amazon-pl-lux-aura-care.png",
        imageAlt: "BIONOBLE Organiczny Olejek Rozmarynowy jako polski odpowiednik rozmarynowego olejku do wlosow",
        trustSignal: "Routine essential",
        gallery: [
          {
            image: "/rosemary-hair-oil/botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Rozmarynowy olejek do skory glowy i wlosow",
            title: "Main View",
          },
          {
            image: "/rosemary-hair-oil/PL_details_1_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Informacje o rozmarynowym olejku do wlosow",
            title: "Product Details",
          },
          {
            image: "/rosemary-hair-oil/PL_details_2_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Informacje o rozmarynowym olejku do wlosow",
            title: "Product Details",
          },
          {
            image: "/rosemary-hair-oil/PL_details_3_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Aplikacja olejku na skore glowy",
            title: "Scalp Ritual",
          },
          {
            image: "/rosemary-hair-oil/PL_details_4_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Informacje o rozmarynowym olejku do wlosow",
            title: "Product Details",
          },
          {
            image: "/rosemary-hair-oil/PL_details_5_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Informacje o rozmarynowym olejku do wlosow",
            title: "Product Details",
          },
          {
            image: "/rosemary-hair-oil/PL_details_6_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Aplikacja olejku na skore glowy",
            title: "Scalp Ritual",
          },
          {
            image: "/rosemary-hair-oil/PL_details_7_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Informacje o rozmarynowym olejku do wlosow",
            title: "Product Details",
          },
          {
            image: "/rosemary-hair-oil/PL_details_8_botanic-hearth-rosemary-hair-oil-biotin-castor-jojoba-scalp-treatment.jpg",
            imageAlt: "Aplikacja olejku na skore glowy",
            title: "Scalp Ritual",
          },
        ],
      },
    },
  },
  {
    id: "orgain-collagen-peptides",
    name: "Orgain Collagen Peptides Powder",
    categoryId: "self-care",
    benefit: "Grass-fed collagen for hair, skin, nails & joints.",
    description:
      "Orgain Collagen Peptides Powder is an unflavoured bovine collagen supplement with 20g of collagen peptides per labelled serving. Check the current label, ingredients, serving guidance, and suitability for your dietary needs before use.",
    trustSignal: "Routine essential",
    image: "/orgain-collagen-peptides/orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.png",
    imageAlt: "Orgain Collagen Peptides Powder",
    gallery: [
      {
        image: "/orgain-collagen-peptides/orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.png",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Main View",
      },
      {
        image: "/orgain-collagen-peptides/details_1_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Product Details",
      },
      {
        image: "/orgain-collagen-peptides/details_2_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Texture",
      },
      {
        image: "/orgain-collagen-peptides/details_3_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Fit & Style",
      },
      {
        image: "/orgain-collagen-peptides/details_4_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Fit & Style",
      },
      {
        image: "/orgain-collagen-peptides/details_5_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Fit & Style",
      },
      {
        image: "/orgain-collagen-peptides/details_6_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
        imageAlt: "Orgain Collagen Peptides Powder",
        title: "Fit & Style",
      },
    ],
    marketVariants: {
      us: {
        affiliateUrl: "https://amzn.to/4eDMZr8",
        price: { status: "indicative", amount: 24.99, currency: "USD" },
      },
      pl: {
        affiliateUrl: "https://amzn.to/4gdqYC1",
        price: { status: "indicative", amount: 127.54, currency: "PLN" },
        isAlternative: true,
        marketProductId: "B08LK4XV7Q",
        slug: "pure-essential-hydrolizowane-peptydy-kolagenowe",
        name: "Pure & Essential Hydrolizowane peptydy kolagenowe grass-fed",
        benefit: "Neutralny kolagen w proszku do codziennego wsparcia wlosow, skory, paznokci i stawow.",
        description:
          "Hydrolizowane peptydy kolagenowe z bydla karmionego trawa, wybrane jako polski odpowiednik Orgain Collagen Peptides. Produkt pasuje do porannej kawy, smoothie albo prostego rytualu wellness.",
        image: "/orgain-collagen-peptides/PL_pure-essential-hydrolizowane-peptydy-kolagenowe-amazon-pl-lux-aura-care.png",
        imageAlt: "Pure & Essential peptydy kolagenowe jako polski odpowiednik Orgain Collagen Peptides",
        trustSignal: "Routine essential",
        gallery: [
          {
            image: "/orgain-collagen-peptides/PL_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Hydrolizowane peptydy kolagenowe w proszku",
            title: "Main View",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_1_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_2_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_3_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_4_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_5_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          {
            image: "/orgain-collagen-peptides/PL_details_6_orgain-collagen-peptides-powder-grass-fed-hair-skin-nails-joints-support.jpg",
            imageAlt: "Informacje o peptydach kolagenowych",
            title: "Product Details",
          },
          
        ],
      },
    },
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
    urgencySignal: {
      label: "Best-seller",
      intensity: "high",
    },
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
  "derma-roller": {
    rating: 4.6,
    reviews: "2,000+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Refines texture on face, body and scalp at home",
      "Beginner-friendly with a durable titanium build",
      "Boosts how well serums absorb afterward",
    ],
  },
  "medicube-age-r-booster-pro": {
    rating: 4.4,
    reviews: "11,000+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Features 6 advanced modes for total skin transformation",
      "Boosts serum absorption for a deeper, more visible glow",
      "Improves elasticity, refines pores, and smooths uneven texture",
    ],
  },
  "orgain-collagen-peptides": {
    rating: 4.5,
    reviews: "10,000+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Delivers 20g of grass-fed collagen peptides per serving",
      "Unflavored and dissolves quickly in hot or cold liquids",
      "Supports healthy hair, glowing skin, strong nails, and joints",
    ],
  },
  "rosemary-hair-oil": {
    rating: 4.5,
    reviews: "6,000+ reviews",
    socialProof: "Trending on social media",
    highlights: [
      "Supports a healthier scalp environment for stronger growth",
      "Lightweight oil that absorbs without greasy residue",
      "Blends rosemary, biotin, castor and jojoba in one step",
    ],
  },
};

export const topPicks = [
  { productId: "mixsoon-bean-essence", badge: "Editorial Pick" as const },
  { productId: "niacinamide-toner", badge: "Routine Essential" as const },
  { productId: "magnesium-supplement", badge: "Worth Considering" as const },
  { productId: "aveeno-oil-mist", badge: "Editorial Pick" as const },
  { productId: "pavilia-plush-robe", badge: "Worth Considering" as const },
  { productId: "cliganic-essential-oils", badge: "Routine Essential" as const },
  { productId: "copper-water-bottle", badge: "Worth Considering" as const },
  { productId: "coslus-cleansing-brush", badge: "Editorial Pick" as const },
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
      "Glass skin isn't about being perfect; it's about hydration and gentle resurfacing. This guide breaks down two products that can simplify a consistent routine.",
    heroImage: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating.png",
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
    heroImage: "/magnesium-supplement/Pure_Encapsulations_Magnesium_Glycinate.png",
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
    heroImage: "/aveeno-oil-mist/Aveeno_Daily_Moisturizing_Body_Oil_Mist.png",
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
      "Great skin is usually about consistency, not complexity. This routine removes the guesswork so your products layer comfortably and are easier to use regularly.",
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
    heroImage: "/niacinamide-toner/Good_Molecules_Niacinamide_Brightening_Toner.png",
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
    heroImage: "/cliganic-essential-oils/Cliganic_Organic_Aromatherapy.png",
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
  {
    slug: "ultimate-body-glow-protocol",
    title: "The Ultimate Body Glow Protocol: A Science-Backed Guide to Luminous Skin",
    excerpt:
      "Stop skipping body care. This exhaustive guide breaks down the multi-step protocol for achieving a resilient, healthy satin glow that catches the light beautifully.",
    intro:
      "While face-first skincare dominated the last decade, the 'body-glow' movement is about treating the skin on your body with the same active-led precision. Luminous body skin isn't just about shine; it's about texture refinement, lymphatic support, and a disciplined moisture-locking window.",
    heroImage: "/aveeno-oil-mist/cover_aveeno_oil.png",
    heroAlt: "Polished body skin catching the golden hour light next to ritual tools",
    categoryId: "body-glow",
    readTime: "9 min read",
    publishedAt: "2026-04-16",
    pinHook: "From surface dullness to a deep, healthy satin glow.",
    sections: [
      {
        id: "lymphatic-awakening",
        title: "Step 1: The Lymphatic Awakening with Dry Brushing",
        copy: "Before any product touches your skin, you must address the physical surface. Dry brushing with natural bristles serves two critical functions: mechanical exfoliation and lymphatic stimulation. By brushing in light, rhythmic strokes toward the heart, you assist the body's natural detoxification process and remove the layer of dead cells that prevents oils from absorbing properly. This step is the difference between a surface shine and a deep, healthy glow.",
        productId: "dry-brush",
      },
      {
        id: "three-minute-window",
        title: "Step 2: The Three-Minute Moisture Window",
        copy: "The most common mistake in body care is waiting until your skin is bone-dry to apply products. Science shows that the most effective time to seal in hydration is within the first three minutes of exiting the shower. While your skin is damp and your pores are receptive, a lightweight mist can penetrate more deeply. This 'flash-hydration' creates a moisture-trap that keeps skin looking plump and reflective throughout the day, without the heavy, sticky feel of traditional lotions.",
        productId: "aveeno-oil-mist",
      },
      {
        id: "satin-seal",
        title: "Step 3: The Satin Seal and Botanical Barrier",
        copy: "Once you've established hydration, you need a lipid layer to prevent water loss. Botanical oils rich in antioxidants and fatty acids mimic the skin's natural sebum, providing a polished, satin-like finish that doesn't feel greasy on your clothes. Focusing on areas where light naturally hits—the collarbones, shins, and shoulders—creates that expensive-looking glow seen in viral Pinterest saves. This is the seal that maintains your skin's luminosity until your next ritual.",
        productId: "body-oil",
      },
      {
        id: "scalp-ritual",
        title: "Step 4: Don't Forget the Scalp Connection",
        copy: "True body care extends from head to toe. Tension often manifests in the scalp, restricting blood flow to the forehead and face. Using a silicone massager during your hair routine isn't just a sensory luxury; it's a way to release physical tension that contributes to a 'locked' expression. A relaxed scalp supports better circulation and makes your entire evening reset feel exponentially more restorative.",
        productId: "scalp-massager",
      },
    ],
  },
  {
    slug: "biological-sleep-reset",
    title: "The Biological Sleep Reset: Why Lighting and Minerals are Your Bedtime Non-Negotiables",
    excerpt:
      "Struggling to switch off? This deep-dive guide explores the biological triggers for deep rest, focusing on nervous system regulation and visual cues.",
    intro:
      "Modern environments are 'noisy'—not just auditorily, but visually and biologically. If your heart rate is still elevated or your brain is detecting light leaks, you won't transition into restorative REM cycles. This reset protocol uses internal mineral support and external environmental anchors to tell your nervous system that the day is officially done.",
    heroImage: "/magnesium-supplement/Pure_Encapsulations_Magnesium_Glycinate.png",
    heroAlt: "A calm, dark bedroom setup featuring a silk mask and weighted blanket",
    categoryId: "self-care",
    readTime: "10 min read",
    publishedAt: "2026-04-16",
    pinHook: "Biological rest is a skill. This protocol helps you master it.",
    sections: [
      {
        id: "nervous-system-support",
        title: "Step 1: Internal Nervous System Regulation",
        copy: "Sleep readiness starts internally. Magnesium Glycinate is widely recognized as the gold standard for relaxation because it binds to GABA receptors, calming the central nervous system. By supporting the body's natural mineral baseline, you reduce the physical 'jitter' that often leads to middle-of-the-night wakefulness. This is the foundation upon which all other environmental cues are built.",
        productId: "magnesium-supplement",
      },
      {
        id: "scent-brain-connection",
        title: "Step 2: Leveraging the Scent-Brain Connection",
        copy: "Scent is the only sense with a direct pathway to the limbic system—the part of the brain that manages emotions and memories. By using a consistent evening essential oil blend, you create a Pavlovian response. Over time, the mere smell of lavender or sandalwood signals to your brain that it's time to slow down. It’s a low-effort habit that yields high-impact results for routine consistency.",
        productId: "cliganic-essential-oils",
      },
      {
        id: "complete-visual-silence",
        title: "Step 3: Protocol for Complete Visual Silence",
        copy: "Even the smallest LED from a charger can disrupt the production of melatonin. Total darkness is required for the pineal gland to function optimally. A high-quality silk mask provides this 'visual silence' without the friction that can cause fine lines or hair breakage. It's a non-negotiable for anyone living in an urban environment where ambient light is constant.",
        productId: "silk-sleep-mask",
      },
      {
        id: "neutral-weighted-pressure",
        title: "Step 4: The Power of Neutral Weighted Pressure",
        copy: "Deep Pressure Stimulation (DPS) is a technique used to lower cortisol levels and increase serotonin. A weighted blanket mimics the physical sensation of being held, which naturally lowers the heart rate and anchors the body. For those who experience bedtime anxiety or physical restlessness, this added weight provides the security needed for the brain to finally 'let go' and fall into deep rest.",
        productId: "weighted-blanket",
      },
    ],
  },
  {
    slug: "at-home-spa-sanctuary",
    title: "From Pinterest to Reality: How to Design a Professional At-Home Spa Sanctuary",
    excerpt:
      "Learn the art of atmospheric calibration. This guide shows you how to turn your basic bathroom into a high-performance sanctuary for stress recovery.",
    intro:
      "The 'Spa Sunday' trend is popular because it offers a clear bridge between a high-output week and a fresh start. But a true sanctuary isn't about aesthetics alone—it's about sensory layering. Scent, warmth, and texture must work together to create a repeatable environment for emotional and physical recovery.",
    heroImage: "/cliganic-essential-oils/Cliganic_Organic_Aromatherapy.png",
    heroAlt: "Luxury spa setup with candles, diffuser, and soft robes",
    categoryId: "spa-relax",
    readTime: "8 min read",
    publishedAt: "2026-04-16",
    pinHook: "A spa day shouldn't be a luxury; it should be a strategy.",
    sections: [
      {
        id: "atmospheric-calibration",
        title: "Step 1: Calibrate Your Atmospheric Baseline",
        copy: "A sanctuary starts with what you don't see. Using a ceramic ultrasonic diffuser allows for a clean, consistent mist that layers the air with scent without the heavy feel of cheaper models. By choosing grounding scents like cedarwood or eucalyptus, you immediately shift your room's baseline from 'functional' to 'restorative.' This atmospheric cue is what makes your routine feel intentional.",
        productId: "aroma-diffuser",
      },
      {
        id: "mineral-immersion",
        title: "Step 2: The Art of Mineral Immersion",
        copy: "Bathing for the sake of cleanliness is a daily task; bathing for recovery is a mineral ritual. Magnesium bath flakes are notably more absorbable than traditional salts, allowing for deeper muscle relaxation and improved skin barrier support. The heat of the water paired with the mineral infusion helps drop your internal temperature afterward, which is a key signal for sleep readiness.",
        productId: "bath-salts",
      },
      {
        id: "warmth-layering",
        title: "Step 3: Scent and Warmth Layering",
        copy: "Lighting candles is the final touch of atmospheric layering. Sandalwood, with its milky and woody profile, is particularly effective for evening rituals. The dancing flame provides a primal focal point for 'soft gaze' meditation, helping to quiet the chatter of a busy mind. This combination of scent and warmth is the ultimate cue for transition.",
        productId: "candle-set",
      },
      {
        id: "sensory-anchor",
        title: "Step 4: Anchor Your Body in Texture",
        copy: "The most overlooked part of many spa routines is the 'exit.' Moving from a warm, mineral-rich environment into a cold room can shock the system. A premium plush robe acts as a sensory anchor, maintaining your heat and extending the 'calm' state. It's the final texture in your sensory layer that signals to your skin that the active day is officially over.",
        productId: "pavilia-plush-robe",
      },
    ],
  },
  {
    slug: "morning-momentum-protocol",
    title: "The Morning Momentum Protocol: Daily Habits for High-Performance Hydration",
    excerpt:
      "Success is a habit, but so is energy. This exhaustive protocol focuses on internal hydration and physical awakening to keep you steady all day.",
    intro:
      "Afternoon burnout isn't inevitable; it's often the result of poor morning calibration. Starting your day with a focused protocol ensures your baseline is set for high output without the crash. This guide uses pure hydration, internal mineral support, and tactile awakening to give you a visible head start on your goals.",
    heroImage: "/copper-water-bottle/Copper_Water_Bottle.png",
    heroAlt: "Copper water bottle and morning essentials on an aesthetic workspace",
    categoryId: "self-care",
    readTime: "7 min read",
    publishedAt: "2026-04-16",
    pinHook: "Win your morning, protect your energy, own your afternoon.",
    sections: [
      {
        id: "elevated-hydration",
        title: "Step 1: Elevated Internal Hydration",
        copy: "Your first act of the day should be pure hydration. A copper water bottle is more than an aesthetic choice; it’s a ritual anchor. The tactile feel of the metal and the ritual of keeping it at your workspace ensures you don't start the day in a state of depletion. It’s about building momentum from the very first minute.",
        productId: "copper-water-bottle",
      },
      {
        id: "metabolic-support",
        title: "Step 2: Internal Baseline and Metabolic Support",
        copy: "While many focus on caffeine, true energy comes from mineral balance. Magnesium supports over 300 biochemical reactions in the body, including the production of ATP (energy). By ensuring your internal baseline is solid before you start your active hours, you avoid the artificial energy spikes and subsequent crashes that derail your productivity.",
        productId: "magnesium-supplement",
      },
      {
        id: "tactile-awakening",
        title: "Step 3: Tactile Awakening and Skin Clarity",
        copy: "Physical awakening helps transition your brain from 'rest' to 'active.' Using a facial cleansing brush in the morning increases circulation and removes any overnight buildup, allowing your daily actives like Niacinamide to absorb more effectively. This three-minute step makes you feel more 'present' and provides a clear physical signal to your brain that the day has begun.",
        productId: "coslus-cleansing-brush",
      },
      {
        id: "glow-foundation",
        title: "Step 4: The Glow Foundation Layer",
        copy: "Finish your morning ritual with a brightening layer. Niacinamide (Vitamin B3) is a versatile powerhouse that calms the look of redness and supports a clearer-looking complexion throughout the day. It provides the 'insurance' your skin needs against environmental stressors and keeps you looking polished from your first meeting to your last.",
        productId: "niacinamide-toner",
      },
    ],
  },
  {
    slug: "advanced-skincare-layering-glass-skin",
    title: "Advanced Skincare Layering: How to Master the Viral 'Glass Skin' Finish",
    excerpt:
      "Move beyond basics. Learn the exact layering protocol using Pinterest's high-performance actives for that reflective, luminous skin finish.",
    intro:
      "Glass skin is a result of consistent, low-friction texture refinement and high-saturation hydration. It requires understanding how to layer actives like Retinol and Niacinamide without overwhelming the skin barrier. This guide breaks down the viral Pinterest workflow into repeatable, science-backed steps.",
    heroImage: "/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating.png",
    heroAlt: "Polished skincare products on a vanity reflection",
    categoryId: "skincare",
    readTime: "11 min read",
    publishedAt: "2026-04-16",
    pinHook: "Reflective, luminous skin—simplified but sophisticated.",
    sections: [
      {
        id: "low-friction-exfoliation",
        title: "Step 1: The Secret to Smooth Texture",
        copy: "Cheaper scrubs cause micro-tears and inflammation. The 'glass skin' aesthetic relies on gentle, low-friction exfoliation. The viral Bean Essence handles rough texture by using fermented ingredients to smooth the surface without irritation. This allows for that reflective finish that catches the light so beautifully in photos.",
        productId: "mixsoon-bean-essence",
      },
      {
        id: "brightness-saturation",
        title: "Step 2: Saturation and Tone Balance",
        copy: "Hydration is the 'filler' that makes skin look plump and glassy. Layering a high-percentage Niacinamide serum while skin is still damp from your essence ensures that your tone remains balanced and your pores appear refined. This is the 'clarity layer' that defines the modern skincare aesthetic.",
        productId: "niacinamide-toner",
      },
      {
        id: "overnight-resurfacing",
        title: "Step 3: Controlled Overnight Resurfacing",
        copy: "While daytime is for protection, nighttime is for renewal. A stabilized Retinol serum buffered with squalane allows for steady cell turnover without the typical 'retinol burn.' By using one smart active, you improve skin texture over time, ensuring your glass-skin results are sustainable and not just temporary hydration.",
        productId: "retinol-serum",
      },
      {
        id: "lymphatic-finish",
        title: "Step 4: Mechanical De-Puffing and Drain",
        copy: "The final touch to any advanced skincare routine is a facial massage. Using a rose quartz Gua Sha set helps with lymphatic drainage, especially around the jawline and eyes. This 'sculpts' the face and ensures that your products are pressed into the skin rather than sitting on the surface. It’s the ritual finish that makes you look rested and polished.",
        productId: "gua-sha-set",
      },
    ],
  },
  {
    slug: "stress-reset-handbook",
    title: "The Stress-Reset Handbook: Small Rituals That Stop Daily Burnout",
    excerpt:
      "Burnout isn't a moment; it's a slow accumulation. These tactile and sensory reset rituals help you lower cortisol and protect your peace.",
    intro:
      "When we feel overwhelmed, our sensory system is usually 'flooded.' A stress-reset isn't about doing more—it's about clearing the baseline. By using tactile grounding and atmospheric shifts, you can lower your body's alert level in minutes, preventing daily stress from turning into chronic burnout.",
    heroImage: "/pavilia-plush-robe/PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.png",
    heroAlt: "A comfortable, grounded setting for an evening reset ritual",
    categoryId: "self-care",
    readTime: "6 min read",
    publishedAt: "2026-04-16",
    pinHook: "Your peace is a project. These tools help you build it.",
    sections: [
      {
        id: "tactile-grounding",
        title: "Step 1: Sensory Weight and Grounding",
        copy: "When your mind is racing, your body needs weight to feel safe. A weighted blanket provides 'grounding' that encourages the nervous system to shift from sympathetic (alert) to parasympathetic (rest). It’s one of the most effective non-chemical ways to lower acute stress and recalibrate your focus.",
        productId: "weighted-blanket",
      },
      {
        id: "cranial-release",
        title: "Step 2: Physical Release and Cranial Ritual",
        copy: "Stress often manifests as physical rigidity around the head and neck. A silicone scalp massager is an easy way to release this tension during a shower or while journaling. By physically 'breaking' the pattern of tension, you signal to your brain that the high-alert phase of the day is over. It’s a small step with massive emotional payoff.",
        productId: "scalp-massager",
      },
      {
        id: "atmospheric-shift",
        title: "Step 3: The Scent and Atmosphere Pivot",
        copy: "Your environment is a reflection of your state. By shifting the atmosphere with an ultrasonic diffuser, you create a clear boundary between your 'work self' and 'ritual self.' Calming scents like lavender or bergamot lower your baseline and invite slower, deeper breathing—the most direct way to control your physiology.",
        productId: "aroma-diffuser",
      },
      {
        id: "mineral-anchor",
        title: "Step 4: The Internal Peace Anchor",
        copy: "Finish your reset by addressing internal stressors. Magnesium is the body's 'anti-stress' mineral, yet most of us are depleted. Taking a high-quality supplement at the end of your reset ritual ensures your body has the raw materials it needs to recover physically and mentally, protecting you against tomorrow's challenges.",
        productId: "magnesium-supplement",
      },
    ],
  },
];

export const featuredArticleSlugs = [
  "ultimate-body-glow-protocol",
  "advanced-skincare-layering-glass-skin",
  "biological-sleep-reset",
  "at-home-spa-sanctuary",
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
  "medicube-age-r-booster-pro",
  "orgain-collagen-peptides",
];

export type ProductBundle = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  productIds: string[];
};

export const productBundles: ProductBundle[] = [
  {
    id: "glass-skin-starter",
    title: "Glass Skin Starter Kit",
    tagline: "The 3-step essential routine for reflective, luminous skin",
    description: "Everything you need to achieve that viral glass skin finish—from gentle cleansing to niacinamide brightness to smooth texture.",
    productIds: [
      "coslus-cleansing-brush",
      "niacinamide-toner",
      "mixsoon-bean-essence",
    ],
  },
  {
    id: "sleep-reset-bundle",
    title: "Sleep Reset Bundle",
    tagline: "From racing thoughts to deep biological rest",
    description: "Internal and external support for deeper sleep—mineral support, sensory anchors, and complete visual silence.",
    productIds: [
      "magnesium-supplement",
      "cliganic-essential-oils",
      "pavilia-plush-robe",
      "silk-sleep-mask",
    ],
  },
  {
    id: "body-glow-pro",
    title: "Body Glow Protocol",
    tagline: "From dull to luminous in 3 easy steps",
    description: "The science-backed sequence for softer, glowing body skin—dry brush, hydration lock, and satin seal.",
    productIds: [
      "dry-brush",
      "aveeno-oil-mist",
      "body-oil",
    ],
  },
  {
    id: "spa-sunday-sanctuary",
    title: "At-Home Spa Sanctuary Bundle",
    tagline: "Turn your bathroom into a professional healing space",
    description: "Atmosphere calibration for stress recovery—scent anchoring, mineral immersion, and sensory layering.",
    productIds: [
      "aroma-diffuser",
      "bath-salts",
      "candle-set",
      "pavilia-plush-robe",
    ],
  },
  {
    id: "morning-momentum",
    title: "Morning Momentum Kit",
    tagline: "Win your morning, protect your energy",
    description: "Internal hydration, mineral support, and tactile awakening for high-performance energy all day.",
    productIds: [
      "copper-water-bottle",
      "magnesium-supplement",
      "coslus-cleansing-brush",
      "niacinamide-toner",
    ],
  },
];

export const favoriteCollections = [
  {
    id: "pinterest-viral-finds",
    title: "The Pinterest Lux Aura Collection",
    description: "Eight editorially selected essentials featured in our Pinterest content.",
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
    productIds: ["retinol-serum", "gua-sha-set", "led-mask", "sheet-mask-set", "derma-roller", "medicube-age-r-booster-pro"],
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

export function getProductById(id: string): ProductDefinition | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string, locale: "us" | "pl" | "en" = "en"): ProductDefinition | undefined {
  const normalizedLocale = locale === "pl" ? "pl" : "us";

  return products.find((product) => {
    const marketVariant = product.marketVariants[normalizedLocale];
    const variantSlug = marketVariant && 'slug' in marketVariant ? marketVariant.slug : undefined;
    const resolvedSlug = variantSlug ?? product.slug ?? product.id;
    return resolvedSlug === slug || product.id === slug;
  });
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
      rating: 4.5,
      reviews: "1,000+ reviews",
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
    .filter((item): item is { product: ProductDefinition; badge: TopPickBadge } => Boolean(item));
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
      (step): step is RoutineStep & { product: ProductDefinition } =>
        Boolean(step)
    );
}
export function getProductsByCategoryId(categoryId: CategoryId) {
  return products.filter((product) => product.id && product.categoryId === categoryId);
}

export function getTopPicksByCategory(categoryId: CategoryId, limit = 4) {
  const categoryProducts = getProductsByCategoryId(categoryId);

  // Group by badge priority or just take the first few
  const topPickIds = topPicks.map((tp) => tp.productId);

  return categoryProducts
    .sort((a, b) => {
      const aIsTop = topPickIds.includes(a.id);
      const bIsTop = topPickIds.includes(b.id);
      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((product) => {
      const topPick = topPicks.find((tp) => tp.productId === product.id);
      return {
        product,
        badge: topPick?.badge,
      };
    });
}

export function getBundleById(id: string) {
  return productBundles.find((bundle) => bundle.id === id);
}

export function getBundleProducts(bundleId: string) {
  const bundle = getBundleById(bundleId);
  if (!bundle) return [];
  return getProductsByIds(bundle.productIds);
}

export function getFeaturedBundles(limit = 4) {
  return productBundles.slice(0, limit);
}
