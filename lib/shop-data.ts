export type ShopProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  image: string;
  imageAlt: string;
  badge: string;
  rating: number;
  reviews: string;
  benefits: string[];
  howToUse: string[];
  faq: { q: string; a: string }[];
  shopifyUrl: string; // Replace with your Shopify product URL
  category: "skincare" | "body-glow" | "bundle";
  isNew?: boolean;
  isBestSeller?: boolean;
  gallery?: {
    url: string;
    label: string;
    badge: string;
    desc: string;
    filter?: string;
  }[];
};

export const shopProducts: ShopProduct[] = [
  {
    id: "dermaplaning-razor-kit",
    name: "Glow Ritual Face Razor Kit",
    tagline: "Clinic-smooth skin at home. No appointment needed.",
    description:
      "A 6-piece dermaplaning razor set that removes peach fuzz and dead skin cells, leaving your complexion instantly brighter, smoother, and ready to absorb serums up to 3x better. Recommended by estheticians for women 40+.",
    price: 12.99,
    compareAtPrice: 24.99,
    currency: "EUR",
    image: "/Glow_Ritual_Face_Razor_Kit.png",
    imageAlt: "Skincare beauty tools and face razor kit on display",
    badge: "Best Seller",
    rating: 4.8,
    reviews: "2 847",
    benefits: [
      "Removes peach fuzz & dead skin in 2 minutes",
      "Makeup glides on seamlessly after use",
      "Serums absorb up to 3× deeper post-dermaplaning",
      "Painless — no redness, no downtime",
      "6 precision blades — one per week for 6 weeks",
      "Dermatologist-tested for sensitive skin",
    ],
    howToUse: [
      "Cleanse your face and pat dry",
      "Hold razor at a 45° angle against skin",
      "Use short, gentle downward strokes",
      "Apply your favourite serum or moisturiser",
      "Repeat once every 1–2 weeks for best results",
    ],
    faq: [
      {
        q: "Will my hair grow back thicker?",
        a: "No — this is a myth. Dermaplaning removes vellus (fine) hair and it grows back exactly the same.",
      },
      {
        q: "How often should I use it?",
        a: "Once every 1–2 weeks. Your skin needs time to renew between sessions.",
      },
      {
        q: "Is it suitable for sensitive skin?",
        a: "Yes. The blades are designed for gentle precision. Always patch-test first.",
      },
    ],
    shopifyUrl: "https://luxauracare.myshopify.com/cart/53918490689869:1",
    category: "skincare",
    isBestSeller: true,
  },
  {
    id: "clear-skin-patches",
    name: "Clear Skin Hydrocolloid Patches",
    tagline: "Overnight blemish control. Peel, reveal, glow.",
    description:
      "24 ultra-thin hydrocolloid patches that draw out impurities while you sleep. Invisible on skin, no irritation, no picking. The secret weapon in every 40+ skincare routine.",
    price: 8.99,
    compareAtPrice: 16.99,
    currency: "EUR",
    image: "/Clear_Skin_Hydrocolloid_Patches.png",
    imageAlt: "Close-up of woman receiving a professional facial skincare treatment",
    badge: "⭐ New Favourite",
    rating: 4.7,
    reviews: "1 624",
    benefits: [
      "24 patches — 2–3 weeks of clear skin",
      "Visibly reduces blemishes overnight",
      "Zero irritation on mature or sensitive skin",
      "Ultra-thin — invisible under makeup",
      "Stops the urge to pick (skin stays intact)",
      "Dermatologist-tested, vegan formula",
    ],
    howToUse: [
      "Cleanse face and pat skin completely dry",
      "Peel patch from liner and apply directly on blemish",
      "Leave on for 6–8 hours (overnight is best)",
      "Peel off gently to reveal absorbed impurities",
      "Follow with your normal skincare routine",
    ],
    faq: [
      {
        q: "Do they work on cystic acne?",
        a: "They work best on surface-level whiteheads and early-stage blemishes. Deep cysts require medical treatment.",
      },
      {
        q: "Can I wear makeup over them?",
        a: "Yes — the ultra-thin design sits flat under foundation and concealer.",
      },
      {
        q: "How long should I leave them on?",
        a: "Minimum 6 hours for best absorption. Overnight use gives the most visible results.",
      },
    ],
    shopifyUrl: "https://luxauracare.myshopify.com/cart/53918490722637:1",
    category: "skincare",
    isNew: true,
  },
  {
    id: "gold-eye-patches",
    name: "24K Gold Collagen Eye Patches",
    tagline: "Wake up to brighter, firmer eyes — starting tonight.",
    description:
      "60 ultra-thin 24K gold collagen eye patches that target dark circles, puffiness and fine lines while you sleep. Marine collagen + hyaluronic acid + real gold particles — 30 full treatments per pack. The overnight eye ritual for women 40+.",
    price: 16.99,
    compareAtPrice: 29.99,
    currency: "EUR",
    image: "/24K_Gold_Collagen_Eye_Patches.png",
    imageAlt: "24K Gold Collagen Eye Patches skincare treatment",
    badge: "✨ Gold Formula",
    rating: 4.7,
    reviews: "1 203",
    benefits: [
      "Reduces dark circles and under-eye bags overnight",
      "Firms fine lines around the eye area",
      "24K gold boosts ingredient absorption",
      "Deep hydration with hyaluronic acid + marine collagen",
      "Depuffs in 20 minutes — perfect before events",
      "60 patches — 30 full treatments per pack",
    ],
    howToUse: [
      "Cleanse and dry the eye area completely",
      "Apply one patch under each eye, gold side up",
      "Leave on for 20–30 minutes or overnight",
      "Remove and gently pat in remaining serum — do not rinse",
      "Use 3–4 times per week for best results",
    ],
    faq: [
      {
        q: "Can I use them every night?",
        a: "Yes, they are gentle enough for nightly use. For best results, use 3–4 times per week to allow skin to breathe.",
      },
      {
        q: "Are they suitable for sensitive skin?",
        a: "Yes. Dermatologist-tested, free from parabens and alcohol. Always patch-test first.",
      },
      {
        q: "How many treatments are in one pack?",
        a: "60 patches = 30 full treatments (one patch per eye per session).",
      },
    ],
    shopifyUrl: "https://luxauracare.myshopify.com/cart/53954300772685:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/24K_Gold_Collagen_Eye_Patches.png",
        label: "Luxe Patches",
        badge: "24K Gold",
        desc: "Luxurious 24K gold hydrogel eye patches with marine collagen",
      },
      {
        url: "/24K_Gold_Collagen_Eye_Patches_close.png",
        label: "Formula Close-up",
        badge: "Active Gold",
        desc: "Hydrogel texture glistening with premium marine collagen and hyaluronic acid serum",
      },
      {
        url: "/24K_Gold_Collagen_Eye_Patches_lifestyle.png",
        label: "Evening Ritual",
        badge: "Spa Care",
        desc: "Premium self-care wellness routine for bright, depuffed under-eyes",
      },
    ],
  },
  {
    id: "skin-ritual-bundle",
    name: "Skin Ritual Starter Kit",
    tagline: "The complete glow ritual — smooth, clear, radiant.",
    description:
      "Everything you need for a 2-step weekly glow ritual: dermaplane on Sundays, patch on blemishes overnight. Designed for women 40+ who want visible results without a clinic visit. Save €14 vs. buying separately.",
    price: 18.99,
    compareAtPrice: 32.99,
    currency: "EUR",
    image: "/Skin_Ritual_Starter_Kit.png",
    imageAlt: "Flat lay of premium skincare products on white background",
    badge: "Best Value",
    rating: 4.9,
    reviews: "836",
    benefits: [
      "Glow Ritual Face Razor Kit (6 blades)",
      "Clear Skin Hydrocolloid Patches (24 patches)",
      "Save €14 vs. buying separately",
      "6-week complete ritual in one package",
      "Gift-ready packaging",
      "Free delivery within EU",
    ],
    howToUse: [
      "Sunday: Dermaplane with the Glow Ritual Razor",
      "Apply serum immediately after for 3× absorption",
      "When a blemish appears: place a hydrocolloid patch overnight",
      "Repeat weekly — skin visibly transforms in 4–6 weeks",
    ],
    faq: [
      {
        q: "Is this suitable as a gift?",
        a: "Yes — the kit ships in elegant packaging and is the perfect self-care gift for any woman.",
      },
      {
        q: "How long does the kit last?",
        a: "The 6 razors last 6 weeks. The 24 patches last 2–3 weeks depending on use.",
      },
      {
        q: "Is EU delivery free?",
        a: "Yes — all orders ship free within the EU with 7–14 day delivery.",
      },
    ],
    shopifyUrl: "https://luxauracare.myshopify.com/cart/53918490820941:1",
    category: "bundle",
    isBestSeller: true,
  },
  {
    id: "gua-sha-jade-roller-set",
    name: "Rose Quartz Gua Sha & Jade Roller Set",
    tagline: "Sculpt, de-puff, and glow. The ancient beauty ritual for youthful skin.",
    description:
      "A premium 2-piece facial massage set handcrafted from 100% natural, authentic Rose Quartz. Designed to stimulate lymphatic drainage, reduce morning puffiness, promote blood circulation, and enhance the absorption of your favorite serums up to 3x.",
    price: 15.99,
    compareAtPrice: 29.99,
    currency: "EUR",
    image: "/Rose_Quartz_Gua_Sha_Jade_Roller_Set.png",
    imageAlt: "Handcrafted natural Rose Quartz Gua Sha and Jade Roller set on a soft pastel background",
    badge: "✨ Self-Care Favorite",
    rating: 4.8,
    reviews: "2 147",
    benefits: [
      "Handcrafted from 100% natural, authentic certified Rose Quartz",
      "Reduces morning puffiness and boosts blood circulation instantly",
      "Promotes lymphatic drainage for a sculpted, lifted jawline",
      "Improves skin elasticity and smooths fine lines over time",
      "Enhances facial oil and serum absorption up to 300% deeper",
      "Double-sided roller with noiseless, squeak-free silicone inserts",
    ],
    howToUse: [
      "Cleanse face and apply your favorite facial oil or serum",
      "Roll the Jade Roller in gentle upward strokes from neck to forehead",
      "Use the Gua Sha tool flat against skin, scraping outward along jawline",
      "Cool tools in the fridge for 10 minutes before use for maximum de-puffing",
      "Cleanse tools with a damp cloth and warm soapy water after each use",
    ],
    faq: [
      {
        q: "Is it made of 100% real Rose Quartz?",
        a: "Yes. Our massage tools are handcrafted from certified, natural rose quartz stone. Each piece has its own unique rose shading and mineral patterns.",
      },
      {
        q: "Does the roller make squeaking noises during use?",
        a: "No. We integrate special soft silicone inserts between the metal frames and roller stones to guarantee a completely noiseless, smooth roll.",
      },
      {
        q: "How often should I perform this massage?",
        a: "We recommend using the Jade Roller daily for 5-10 minutes (ideally in the morning to de-puff) and the Gua Sha tool 2-3 times a week to sculpt.",
      },
    ],
    shopifyUrl: "https://luxauracare.myshopify.com/cart/53944188174669:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/Rose_Quartz_Gua_Sha_Jade_Roller_Set.png",
        label: "Luxe Set",
        badge: "Organic Quartz",
        desc: "Handcrafted natural Rose Quartz Gua Sha and double-sided Jade Roller",
      },
      {
        url: "/Rose_Quartz_Gua_Sha_close.png",
        label: "Stone Texture",
        badge: "Premium Polish",
        desc: "Seamless rose gold frame details and ultra-smooth polished stone edges",
      },
      {
        url: "/Rose_Quartz_Gua_Sha_lifestyle.png",
        label: "Daily Ritual",
        badge: "Spa Routine",
        desc: "Relaxing lymphatic drainage massage for a sculpted, radiant complexion",
      },
    ],
  },
];

export function getShopProductById(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id);
}
