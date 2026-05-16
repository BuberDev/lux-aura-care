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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53918490689869:1",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53918490722637:1",
    category: "skincare",
    isNew: true,
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53918490820941:1",
    category: "bundle",
    isBestSeller: true,
  },
];

export function getShopProductById(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id);
}
