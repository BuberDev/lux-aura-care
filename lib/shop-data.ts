import { mediaUrl } from "./media-url";
import { shopifyPriceSnapshot } from "./shopify-price-snapshot";

export type ShopProductGalleryItem = {
  url: string;
  label: string;
  badge: string;
  desc: string;
  filter?: string;
};

export type ShopProductVariant = {
  price?: number;
  compareAtPrice?: number;
  id: string;
  label: string;
  colorName: string;
  styleFamily?: string;
  sleeveLength?: "short" | "long";
  swatchHex: string;
  swatchBorderHex?: string;
  image: string;
  imageAlt: string;
  shopifyUrl?: string;
  sizes?: ShopProductSizeVariant[];
};

export type ShopProductSizeVariant = {
  price?: number;
  compareAtPrice?: number;
  id: string;
  label: string;
  shopifyUrl?: string;
  available?: boolean;
  /** Number of the base Shopify item added for one selected option. */
  checkoutQuantity?: number;
  supportingText?: string;
  badge?: string;
};

export type ShopProductSalesStory = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: {
    title: string;
    desc: string;
  }[];
};

export type ShopProductReview = {
  id: string;
  author: string;
  /** Local public path for the reviewer's photo, for example /customer-avatars/anna.jpg. */
  avatar?: string;
  rating: number;
  body: string;
  date: string;
  source: string | null;
  color: string;
  size: string;
  helpfulCount: number;
};

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
  benefits: string[];
  howToUse: string[];
  faq: { q: string; a: string }[];
  shopifyUrl?: string;
  category: "skincare" | "body-glow" | "fashion" | "bundle";
  /** Owner-stocked products must be excluded from DSers supplier mapping. */
  fulfillment?: "owner" | "supplier";
  showGalleryCaptions?: boolean;
  purchaseStatus?: "available" | "coming-soon";
  isNew?: boolean;
  isBestSeller?: boolean;
  flashSaleEndsAt?: string; // ISO date — real countdown, not looping
  // Fill only with real review data (e.g. from Shopify) — stars render when set.
  rating?: { value: number; count: number };
  reviews?: ShopProductReview[];
  reviewAvatars?: string[];
  ugcVideos?: string[];
  gallery?: ShopProductGalleryItem[];
  variants?: ShopProductVariant[];
  variantPickerLabel?: string;
  selectedVariantPickerLabel?: string;
  sizes?: ShopProductSizeVariant[];
  salesStory?: ShopProductSalesStory;
};

const FLORAL_GRACE_SIZE_LABELS = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"] as const;

function floralGraceSizes(variantIds: readonly string[]): ShopProductSizeVariant[] {
  return FLORAL_GRACE_SIZE_LABELS.map((label, index) => ({
    id: label.toLowerCase(),
    label,
    shopifyUrl: `https://imp082-pj.myshopify.com/cart/${variantIds[index]}:1`,
  }));
}

function floralGraceVariant({
  id,
  label,
  styleFamily,
  sleeveLength,
  swatchHex,
  swatchBorderHex,
  image,
  variantIds,
}: {
  id: string;
  label: string;
  styleFamily: string;
  sleeveLength: "short" | "long";
  swatchHex: string;
  swatchBorderHex?: string;
  image: string;
  variantIds: readonly string[];
}): ShopProductVariant {
  return {
    id,
    label,
    colorName: label,
    styleFamily,
    sleeveLength,
    swatchHex,
    swatchBorderHex,
    image,
    imageAlt: label,
    shopifyUrl: `https://imp082-pj.myshopify.com/cart/${variantIds[0]}:1`,
    sizes: floralGraceSizes(variantIds),
  };
}

const catalogProducts: ShopProduct[] = [
 /*  {
    id: "dermaplaning-razor-kit",
    name: "Glow Ritual Face Razor Kit",
    tagline: "A precise at-home tool for removing peach fuzz and surface buildup.",
    description:
      "A 6-piece dermaplaning razor set for removing peach fuzz and surface buildup as part of a careful at-home routine.",
    // Synced with live Shopify variant (charges 24.99). Intended promo was 12.99 —
    // restore it here once the Shopify price is lowered to match.
    price: 24.99,
    compareAtPrice: 24.99,
    currency: "USD",
    image: mediaUrl("/dermaplaning-razor-kit/Glow_Ritual_Face_Razor_Kit.png"),
    imageAlt: "Skincare beauty tools and face razor kit on display",
    badge: "Featured",
    benefits: [
      "Removes peach fuzz & dead skin in 2 minutes",
      "Makeup glides on seamlessly after use",
      "Skincare can spread more evenly over freshly exfoliated skin",
      "Safety guards support controlled, light-pressure use",
      "6 precision blades — one per week for 6 weeks",
      "Patch-test first and stop use if irritation occurs",
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
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112625766748:1",
    category: "skincare",
    isBestSeller: true,
    rating: { value: 4.9, count: 167 },
    reviewAvatars: [
      "/customer-avatars/avatar-1.png",
      "/customer-avatars/avatar-2.png",
      "/customer-avatars/avatar-3.png",
      "/customer-avatars/avatar-4.png",
      "/customer-avatars/avatar-5.png",
    ],
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
    gallery: [
      {
        url: mediaUrl("/dermaplaning-razor-kit/glow-ritual-face-razor-kit-main-product-photo.png"),
        label: "Product",
        badge: "Featured",
        desc: "6-piece dermaplaning kit for a controlled at-home routine",
      },
      {
        url: mediaUrl("/dermaplaning-razor-kit/glow-ritual-face-razor-kit-flat-lay.png"),
        label: "What's Inside",
        badge: "6 Blades",
        desc: "Everything included — 6 precision blades, one per week",
      },
      {
        url: mediaUrl("/dermaplaning-razor-kit/glow-ritual-face-razor-kit-lifestyle-usage.png"),
        label: "In Use",
        badge: "2 Min Ritual",
        desc: "Gentle 45° strokes — peach fuzz gone, skin instantly glowing",
      },
      {
        url: mediaUrl("/dermaplaning-razor-kit/glow-ritual-face-razor-kit-luxury-spa-pedestal.png"),
        label: "Spa-Grade",
        badge: "Esthetician Pick",
        desc: "Recommended by estheticians for women 40+ — no appointment needed",
      },
      {
        url: mediaUrl("/dermaplaning-razor-kit/glow-ritual-face-razor-kit-blade-close-up.png"),
        label: "Blade Detail",
        badge: "Precision Cut",
        desc: "Micro-guard blades designed for careful, controlled use",
      },
    ],
  }, */
  {
    id: "clear-skin-patches",
    name: "Clear Skin Hydrocolloid Patches",
    tagline: "Overnight blemish control. Peel, reveal, glow.",
    description:
      "24 ultra-thin hydrocolloid patches that draw out impurities while you sleep. Invisible on skin, no irritation, no picking. The secret weapon in every 40+ skincare routine.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 14.99,
    compareAtPrice: 14.99,
    currency: "USD",
    image: mediaUrl("/clear-skin-patches/Clear_Skin_Hydrocolloid_Patches.png"),
    imageAlt: "Close-up of woman receiving a professional facial skincare treatment",
    badge: "⭐ New Favourite",
    benefits: [
      "24 patches — 2–3 weeks of clear skin",
      "Covers blemishes overnight and absorbs surface fluid",
      "Zero irritation on mature or sensitive skin",
      "Ultra-thin — invisible under makeup",
      "Stops the urge to pick (skin stays intact)",
      "Vegan formula; review the ingredient list before use",
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
        a: "Follow the wear time on the packaging and remove the patch if irritation occurs.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112626618716:1",
    category: "skincare",
    isNew: true,
    ugcVideos: [mediaUrl("/clear-skin-patches/ugc-short-Clear_Skin_Hydrocolloid_Patches.mp4")],
    gallery: [
      {
        url: mediaUrl("/clear-skin-patches/clear-skin-hydrocolloid-patches-main-product-photo.png"),
        label: "Product",
        badge: "⭐ New Favourite",
        desc: "24 ultra-thin hydrocolloid patches — overnight blemish control",
      },
      {
        url: mediaUrl("/clear-skin-patches/clear-skin-hydrocolloid-patches-flat-lay.png"),
        label: "What's Inside",
        badge: "24 Patches",
        desc: "24 patches per pack — 2–3 weeks of clear skin",
      },
      {
        url: mediaUrl("/clear-skin-patches/clear-skin-hydrocolloid-patches-lifestyle-application.png"),
        label: "How to Use",
        badge: "6–8 Hours",
        desc: "Apply directly on blemish, leave overnight — peel to reveal results",
      },
      {
        url: mediaUrl("/clear-skin-patches/clear-skin-hydrocolloid-patches-bathroom-vanity-lifestyle.png"),
        label: "Routine",
        badge: "Invisible Under Makeup",
        desc: "Ultra-thin design — fits seamlessly into your nightly ritual",
      },
      {
        url: mediaUrl("/clear-skin-patches/clear-skin-hydrocolloid-patches-patch-sheet-close-up.png"),
        label: "Patch Detail",
        badge: "Vegan Formula",
        desc: "Hydrocolloid technology draws out impurities without irritation",
      },
    ],
  },
  {
    id: "gold-eye-patches",
    name: "24K Gold Collagen Eye Patches",
    tagline: "Wake up to brighter, firmer eyes — starting tonight.",
    description:
      "60 ultra-thin 24K gold collagen eye patches that target dark circles, puffiness and fine lines while you sleep. Marine collagen + hyaluronic acid + real gold particles — 30 full treatments per pack. The overnight eye ritual for women 40+.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 18.99,
    compareAtPrice: 18.99,
    currency: "USD",
    image: mediaUrl("/gold-eye-patches/24K_Gold_Collagen_Eye_Patches.png"),
    imageAlt: "24K Gold Collagen Eye Patches skincare treatment",
    badge: "✨ Gold Formula",
    benefits: [
      "Provides a cooling, hydrating under-eye treatment",
      "Firms fine lines around the eye area",
      "Gold-toned hydrogel creates a cooling self-care step",
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
        a: "Review the ingredient list and patch-test first, especially if your skin is sensitive.",
      },
      {
        q: "How many treatments are in one pack?",
        a: "60 patches = 30 full treatments (one patch per eye per session).",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112633893212:1",
    category: "skincare",
    isNew: true,
    ugcVideos: [mediaUrl("/gold-eye-patches/ugc-Gold_Collagen_Eye_Patches.mp4")],
    gallery: [
      {
        url: mediaUrl("/gold-eye-patches/24K_Gold_Collagen_Eye_Patches.png"),
        label: "Luxe Patches",
        badge: "24K Gold",
        desc: "Luxurious 24K gold hydrogel eye patches with marine collagen",
      },
      {
        url: mediaUrl("/gold-eye-patches/24K_Gold_Collagen_Eye_Patches_close.png"),
        label: "Formula Close-up",
        badge: "Active Gold",
        desc: "Hydrogel texture glistening with premium marine collagen and hyaluronic acid serum",
      },
      {
        url: mediaUrl("/gold-eye-patches/24K_Gold_Collagen_Eye_Patches_lifestyle.png"),
        label: "Evening Ritual",
        badge: "Spa Care",
        desc: "Premium self-care wellness routine for bright, depuffed under-eyes",
      },
    ],
  },
 /*  {
    id: "skin-ritual-bundle",
    name: "Skin Ritual Starter Kit",
    tagline: "The complete glow ritual — smooth, clear, radiant.",
    description:
      "A two-step weekly set pairing a dermaplaning tool with hydrocolloid patches for a simple at-home routine.",
    // Synced with live Shopify variant (charges 34.99). Intended promo was 18.99 —
    // restore it here once the Shopify price is lowered to match.
    // compareAt = razor 24.99 + patches 14.99 bought separately.
    price: 34.99,
    compareAtPrice: 39.98,
    currency: "USD",
    image: mediaUrl("/skin-ritual-bundle/Skin_Ritual_Starter_Kit.png"),
    imageAlt: "Flat lay of premium skincare products on white background",
    badge: "Best Value",
    benefits: [
      "Glow Ritual Face Razor Kit (6 blades)",
      "Clear Skin Hydrocolloid Patches (24 patches)",
      "Better value than buying separately",
      "6-week complete ritual in one package",
      "Gift-ready packaging",
      "Free delivery within EU",
    ],
    howToUse: [
      "Sunday: Dermaplane with the Glow Ritual Razor",
      "Apply a gentle serum afterward if your skin feels comfortable",
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
        a: "Available delivery methods, timing, and cost are shown during checkout before payment.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112628846940:1",
    category: "bundle",
    isBestSeller: true,
    gallery: [
      {
        url: mediaUrl("/skin-ritual-bundle/skin-ritual-starter-kit-main-product-photo.png"),
        label: "Bundle",
        badge: "Best Value",
        desc: "Complete 2-step glow ritual — dermaplaning razor + hydrocolloid patches",
      },
      {
        url: mediaUrl("/skin-ritual-bundle/skin-ritual-starter-kit-flat-lay.png"),
        label: "What's Inside",
        badge: "Bundle Value",
        desc: "6 precision blades + 24 hydrocolloid patches — 6-week ritual in one kit",
      },
      {
        url: mediaUrl("/skin-ritual-bundle/skin-ritual-starter-kit-lifestyle-dermaplaning.png"),
        label: "Step 1",
        badge: "Sunday Ritual",
        desc: "Use the dermaplaning tool only as directed, then apply a gentle routine",
      },
      {
        url: mediaUrl("/skin-ritual-bundle/skin-ritual-starter-kit-lifestyle-patch-application.png"),
        label: "Step 2",
        badge: "Overnight Fix",
        desc: "Apply a patch on any blemish — wake up to visibly clearer skin",
      },
      {
        url: mediaUrl("/skin-ritual-bundle/skin-ritual-starter-kit-bundle-close-up.png"),
        label: "Detail",
        badge: "Gift-Ready",
        desc: "Ships in elegant packaging — perfect self-care gift for any woman",
      },
    ],
  }, */
  {
    id: "gua-sha-jade-roller-set",
    name: "Rose Quartz Gua Sha & Jade Roller Set",
    tagline: "Sculpt, de-puff, and glow. The ancient beauty ritual for youthful skin.",
    description:
      "A two-piece rose quartz facial massage set for a cooling, gentle massage ritual and more even application of facial oils.",
    // Synced with live Shopify variant (charges 29.99). Intended promo was 15.99 —
    // restore it here once the Shopify price is lowered to match.
    price: 29.99,
    compareAtPrice: 29.99,
    currency: "USD",
    image: mediaUrl("/gua-sha-jade-roller-set/Rose_Quartz_Gua_Sha_Jade_Roller_Set.png"),
    imageAlt: "Handcrafted natural Rose Quartz Gua Sha and Jade Roller set on a soft pastel background",
    badge: "✨ Self-Care Favorite",
    benefits: [
      "Rose quartz construction with a roller and gua sha tool",
      "Cooling massage may temporarily improve the appearance of puffiness",
      "Promotes lymphatic drainage for a sculpted, lifted jawline",
      "Improves skin elasticity and smooths fine lines over time",
      "Helps facial oil spread evenly during massage",
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
        a: "Soft silicone inserts between the frame and stones are designed to support a smoother, quieter roll.",
      },
      {
        q: "How often should I perform this massage?",
        a: "We recommend using the Jade Roller daily for 5-10 minutes (ideally in the morning to de-puff) and the Gua Sha tool 2-3 times a week to sculpt.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112629862748:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: mediaUrl("/gua-sha-jade-roller-set/Rose_Quartz_Gua_Sha_Jade_Roller_Set.png"),
        label: "Luxe Set",
        badge: "Organic Quartz",
        desc: "Handcrafted natural Rose Quartz Gua Sha and double-sided Jade Roller",
      },
      {
        url: mediaUrl("/gua-sha-jade-roller-set/Rose_Quartz_Gua_Sha_close.png"),
        label: "Stone Texture",
        badge: "Premium Polish",
        desc: "Seamless rose gold frame details and ultra-smooth polished stone edges",
      },
      {
        url: mediaUrl("/gua-sha-jade-roller-set/Rose_Quartz_Gua_Sha_lifestyle.png"),
        label: "Daily Ritual",
        badge: "Spa Routine",
        desc: "Relaxing lymphatic drainage massage for a sculpted, radiant complexion",
      },
    ],
  },
 /*  {
    id: "bian-stone-gua-sha",
    name: "Black Bian Stone Gua Sha Stick",
    tagline: "Sculpt your jawline. Release tension. Reveal younger-looking skin.",
    description:
      "A Bian stone gua sha tool shaped for a slow facial massage routine. Use with facial oil and light pressure.",
    // Synced with the live Shopify variant price — checkout must never charge more than shown.
    price: 14.99,
    compareAtPrice: 24.99,
    currency: "USD",
    image: mediaUrl("/bian-stone-gua-sha/Black_Bian_Stone_Gua_Sha_Stick.png"),
    imageAlt: "Black Bian Stone Gua Sha facial massage stick on dark marble surface",
    badge: "Bian Stone",
    benefits: [
      "Contoured Bian stone surface for facial massage",
      "Smooth stone surface designed for facial massage",
      "Contoured shape follows the jawline, cheeks, and brow bone",
      "Can be chilled for a cooling morning massage",
      "Helps facial oil spread evenly during massage",
      "Ultra-smooth volcanic stone — glides without pulling or dragging",
    ],
    howToUse: [
      "Apply your favourite facial oil or serum to clean skin",
      "Hold the stick flat against skin at a 15° angle",
      "Glide in firm upward strokes along jawline, cheeks and forehead",
      "Use the pointed end for brow bone and under-eye area",
      "Use for 5–10 minutes with light pressure, as tolerated",
    ],
    faq: [
      {
        q: "What makes Bian Stone different from jade or rose quartz?",
        a: "Bian stone is used here as a smooth massage material. We do not claim that the stone itself changes collagen or treats a medical condition.",
      },
      {
        q: "How often should I use it?",
        a: "Start with short sessions a few times per week. Use light pressure and reduce frequency if your skin becomes irritated.",
      },
      {
        q: "Is it suitable for sensitive skin?",
        a: "Use light pressure with facial oil, patch-test the oil first, and stop if irritation occurs.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112635302236:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: mediaUrl("/bian-stone-gua-sha/Black_Bian_Stone_Gua_Sha_Stick.png"),
        label: "Volcanic Stone",
        badge: "Bian Stone",
        desc: "Authentic black volcanic Bian Stone gua sha stick — hand-polished to a flawless finish",
      },
      {
        url: mediaUrl("/bian-stone-gua-sha/Black_Bian_Stone_Gua_Sha_Stick_close.png"),
        label: "Stone Texture",
        badge: "Polished Surface",
        desc: "Smooth mineral surface shaped for a controlled facial massage",
      },
      {
        url: mediaUrl("/bian-stone-gua-sha/Black_Bian_Stone_Gua_Sha_Stick_lifestyle.png"),
        label: "Morning Ritual",
        badge: "5-Min Ritual",
        desc: "Sculpting and depuffing facial massage ritual designed for women 40+",
      },
      {
        url: mediaUrl("/bian-stone-gua-sha/model_Black_Bian_Stone_Gua_Sha_Stick_lifestyle.jpeg"),
        label: "Daily Results",
        badge: "Visible Glow",
        desc: "Incorporate the Black Bian Stone Gua Sha into a gentle facial massage routine",
      },
    ],
  }, */
  {
    id: "lux-aura-face-roller-gua-sha-set",
    name: "Lux Aura Face Roller & Gua Sha Set",
    fulfillment: "owner",
    tagline: "A branded 2-piece face massage set in black stone or rose quartz.",
    description:
      "A signature Lux Aura Care face roller and gua sha set for a simple face massage over serum or facial oil. Choose black stone with gold hardware or rose quartz with rose-gold hardware; both finishes include polished edges, double-ended rollers, and branded details that look elevated on your vanity.",
    price: 24.99,
    // Shopify compareAtPrice is intentionally empty for both variants; keep
    // this equal to price so the site and checkout do not imply a false promo.
    compareAtPrice: 24.99,
    currency: "USD",
    image: "/lux-aura-face-roller-gua-sha-set/main/lux-aura-face-roller-gua-sha-set-main.webp",
    imageAlt: "Lux Aura Care face roller and gua sha sets in black stone and rose quartz",
    badge: "Signature Drop",
    benefits: [
      "2-piece set: double-ended face roller plus sculpted gua sha",
      "Choose black stone with gold hardware or rose quartz with rose-gold hardware",
      "Roller helps create a cooling, calming prep step before skincare",
      "Gua sha profile follows cheeks, jawline and brow bone",
      "Polished surfaces glide over facial oil or serum without tugging",
      "Use with light pressure; stop if skin becomes irritated",
    ],
    howToUse: [
      "Cleanse skin and apply facial oil or serum for slip",
      "Roll from the centre of the face outward using gentle upward strokes",
      "Use the smaller roller around the under-eye and brow area",
      "Hold the gua sha nearly flat and glide along jawline and cheekbones",
      "Wipe both tools clean with a soft damp cloth after each use",
    ],
    faq: [
      {
        q: "What is included with my order?",
        a: "Your order includes one Lux Aura Care face roller and one matching gua sha tool in the finish you select before checkout.",
      },
      {
        q: "Which finish should I choose?",
        a: "Choose black stone for a bold, polished vanity look or rose quartz for a softer spa aesthetic. Both are designed for the same gentle facial massage.",
      },
      {
        q: "Can I use it on sensitive skin?",
        a: "Use a facial oil or serum, keep pressure light, and stop if redness, discomfort, or irritation occurs.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112647262556:1",
    category: "skincare",
    isNew: true,
    rating: { value: 4.9, count: 184 },
    reviewAvatars: [
      "/customer-avatars/avatar-1.png",
      "/customer-avatars/avatar-2.png",
      "/customer-avatars/avatar-3.png",
      "/customer-avatars/avatar-4.png",
      "/customer-avatars/avatar-5.png",
    ],
    ugcVideos: [
      "/lux-aura-face-roller-gua-sha-set/lux-aura-face-roller-gua-sha-podcast-ugc-pl.mp4",
      "/lux-aura-face-roller-gua-sha-set/ugc_pl_set_pink_roller_pink_guasha.mp4",
    ],
    salesStory: {
      eyebrow: "Quick face massage guide",
      title: "Roller + gua sha in one easy set",
      description:
        "Use the roller first when your face feels puffy or tired, then reach for gua sha around the jawline, cheeks, and brow. Both tools are designed to glide over serum or oil, so the set feels practical, complete, and easy to repeat.",
      highlights: [
        {
          title: "Fresh morning look",
          desc: "Use the large roller across cheeks and forehead, then the smaller end under the eyes with very light pressure.",
        },
        {
          title: "Smoother serum glide",
          desc: "Apply facial oil or serum first so the gua sha can move smoothly along jawline and cheekbones without dragging.",
        },
        {
          title: "Two finishes",
          desc: "Choose polished black stone with gold hardware or soft rose quartz with rose-gold hardware.",
        },
      ],
    },
    variants: [
      {
        id: "black-stone",
        label: "Black Stone",
        colorName: "Black stone",
        swatchHex: "#050505",
        swatchBorderHex: "#d5c08d",
        image: "/lux-aura-face-roller-gua-sha-set/black-stone/black-roller-gua-sha-front.webp",
        imageAlt: "Lux Aura Care black stone face roller and gua sha set with gold hardware",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112647262556:1",
      },
      {
        id: "rose-quartz",
        label: "Rose Quartz",
        colorName: "Rose quartz",
        swatchHex: "#f4b8c4",
        swatchBorderHex: "#f8d4dc",
        image: "/lux-aura-face-roller-gua-sha-set/rose-quartz/rose-quartz-roller-gua-sha-front.webp",
        imageAlt: "Lux Aura Care rose quartz face roller and gua sha set with rose-gold hardware",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112647295324:1",
      },
    ],
    gallery: [
      {
        url: "/lux-aura-face-roller-gua-sha-set/main/lux-aura-face-roller-gua-sha-set-main.webp",
        label: "Color Options",
        badge: "Signature Drop",
        desc: "Black stone and rose quartz roller + gua sha sets shown together with branded packaging",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/main/lux-aura-face-roller-gua-sha-set-packaging.webp",
        label: "Packaging",
        badge: "Gift-Ready",
        desc: "Lux Aura Care branded packaging designed for a polished self-care gift",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/black-stone/black-roller-gua-sha-front.webp",
        label: "Black Stone",
        badge: "Polished Finish",
        desc: "Black stone roller and gua sha set with gold hardware and Lux Aura Care branding",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/rose-quartz/rose-quartz-roller-gua-sha-front.webp",
        label: "Rose Quartz",
        badge: "Rose Quartz",
        desc: "Rose quartz roller and gua sha set with rose-gold hardware and soft spa styling",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/black-stone/black-roller-gua-sha-lifestyle.webp",
        label: "Black Stone Lifestyle",
        badge: "Vanity Moment",
        desc: "Black stone set styled for polished at-home skincare",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/rose-quartz/rose-quartz-roller-gua-sha-lifestyle.webp",
        label: "Rose Quartz Lifestyle",
        badge: "Soft Spa Look",
        desc: "Rose quartz set styled with a soft, spa-inspired skincare aesthetic",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/black-stone/black-gua-sha-in-use.webp",
        label: "Gua Sha In Use",
        badge: "In Use",
        desc: "Black gua sha shown during a gentle cheek and jawline massage",
      },
      {
        url: "/lux-aura-face-roller-gua-sha-set/rose-quartz/rose-quartz-face-roller-in-use.webp",
        label: "Roller In Use",
        badge: "In Use",
        desc: "Rose quartz roller shown during a gentle facial massage",
      },
    ],
  },

  // ── AliExpress sourced, high-margin products ──────────────────────────────

  {
    id: "vibro-glow-face-massager",
    name: "Vibro-Glow Face Massager",
    tagline: "Salon-grade micro-vibration therapy — at home, in 5 minutes.",
    description:
      "A pocket-sized T-bar vibrating facial massager designed for a short, gentle massage over serum or facial oil.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 59.99,
    compareAtPrice: 59.99,
    currency: "USD",
    image: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-main-product-photo.png"),
    imageAlt: "Mini vibrating T-bar face massager for lymphatic drainage and glow",
    badge: "Featured",
    benefits: [
      "6,000 micro-vibrations/min for deep lymphatic stimulation",
      "Cooling massage may temporarily improve the appearance of puffiness",
      "Helps serum and moisturiser spread evenly",
      "Promotes circulation for an instant healthy glow",
      "Lightweight T-bar shape — fits every contour of the face",
      "USB rechargeable — works without lotion or serum",
    ],
    howToUse: [
      "Charge fully before first use",
      "Apply your favourite facial oil or serum to clean skin",
      "Glide the T-bar in upward strokes from neck to forehead",
      "Vibrate gently over brow bone and under-eye for de-puffing",
      "Short sessions make the tool easy to add to a routine",
    ],
    faq: [
      {
        q: "Is it safe for sensitive skin?",
        a: "Use with serum or oil rather than on dry skin, patch-test products first, and stop if irritation occurs.",
      },
      {
        q: "How long does one charge last?",
        a: "A full USB charge lasts approximately 90 minutes of use — roughly 18 five-minute sessions.",
      },
      {
        q: "What is the difference between this and a gua sha?",
        a: "Vibration penetrates deeper into fascia and muscle tissue. Gua sha works on the surface layer. Together, they are the ultimate face sculpting duo.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112636612956:1",
    category: "skincare",
    isBestSeller: true,
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
    ugcVideos: [
      mediaUrl("/vibro-glow-face-massager/ugc-Vibro-Glow_Face_Massager.mp4"),
      mediaUrl("/vibro-glow-face-massager/ugc-2-Vibro-Glow_Face_Massager.mp4"),
    ],
    gallery: [
      {
        url: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-main-product-photo.png"),
        label: "Product Photo",
        badge: "Featured",
        desc: "Pocket-sized T-bar vibrating massager delivering 6,000 micro-vibrations per minute",
      },
      {
        url: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-luxury-skincare-flat-lay.png"),
        label: "Flat Lay",
        badge: "Premium",
        desc: "Luxury skincare flat lay — the perfect addition to your glow ritual",
      },
      {
        url: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-premium-pedestal-angle-view.png"),
        label: "Angle View",
        badge: "Design",
        desc: "Premium pedestal angle view showcasing the elegant T-bar form factor",
      },
      {
        url: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-lifestyle-cheek-use.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Gliding along the cheekbone for instant lymphatic drainage and sculpting",
      },
      {
        url: mediaUrl("/vibro-glow-face-massager/vibro-glow-face-massager-under-eye-close-up.png"),
        label: "Under-Eye",
        badge: "De-Puff",
        desc: "Targeting the under-eye area to reduce morning puffiness in under 3 minutes",
      },
    ],
  },

  {
    id: "silicone-scalp-massager",
    name: "Silicone Scalp Massager",
    tagline: "A gentle scalp massage while you shampoo.",
    description: "A hand-held silicone brush for massaging the scalp during hair washing. Soft flexible tips help spread shampoo; use light pressure and rinse the brush after use.",
    price: 109.99,
    compareAtPrice: 109.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd15aa5c49ebd4b17ba307ac46c182cc0J.webp?v=1793526825",
    imageAlt: "Silicone scalp massagers shown together in multiple colors",
    badge: "Scalp care",
    benefits: [
      "Flexible silicone tips massage the scalp during washing",
      "Helps distribute shampoo through the hair",
      "Hand-held shape is easy to guide between sections",
      "Rinses clean after use",
    ],
    howToUse: [
      "Wet your hair and apply shampoo as usual",
      "Move the brush in small, gentle circles without pressing hard",
      "Rinse the brush and leave it to dry after use",
      "Do not use on irritated or broken skin",
    ],
    faq: [
      { q: "Can I use it on dry hair?", a: "It is intended for a gentle scalp massage during washing. Use light pressure and stop if your scalp feels uncomfortable." },
      { q: "How do I clean the brush?", a: "Rinse it thoroughly after use and leave it to air dry." },
      { q: "What is included?", a: "One silicone scalp massager in the color you select." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721290350940:1",
    category: "body-glow",
    variantPickerLabel: "Color",
    selectedVariantPickerLabel: "Selected color",
    variants: [
      { id: "green", label: "Green", colorName: "Green", swatchHex: "#75a98a", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sc0ea3854639f42f9a58b70227354fba2Y.webp?v=1793526825", imageAlt: "Green silicone scalp massager", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721290350940:1" },
      { id: "blue", label: "Blue", colorName: "Blue", swatchHex: "#729bbd", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S65bfe9e5465f45da8e350c72548c4e531.webp?v=1793526825", imageAlt: "Blue silicone scalp massager", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721290383708:1" },
      { id: "pink", label: "Pink", colorName: "Pink", swatchHex: "#d992a9", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd15aa5c49ebd4b17ba307ac46c182cc0J.webp?v=1793526825", imageAlt: "Multiple silicone scalp massager colors shown together, with pink visible", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721290416476:1" },
      { id: "white", label: "White", colorName: "White", swatchHex: "#f4f2ed", swatchBorderHex: "#c9c5bb", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S79f387b8aaa243e8976c35a24345706eJ.webp?v=1793526826", imageAlt: "White silicone scalp massager", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721290449244:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd15aa5c49ebd4b17ba307ac46c182cc0J.webp?v=1793526825", label: "Colors together", badge: "Color options", desc: "Silicone scalp massagers shown together in multiple colors, including pink" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sb9998267b6a041ff88cb74f51c1297d3f.webp?v=1793526824", label: "In use", badge: "How to use", desc: "Scalp massager shown in use; this image shows the product rather than a single color option" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sc0ea3854639f42f9a58b70227354fba2Y.webp?v=1793526825", label: "Green", badge: "Color", desc: "Green silicone scalp massager" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S65bfe9e5465f45da8e350c72548c4e531.webp?v=1793526825", label: "Blue", badge: "Color", desc: "Blue silicone scalp massager" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S79f387b8aaa243e8976c35a24345706eJ.webp?v=1793526826", label: "White", badge: "Color", desc: "White silicone scalp massager" },
    ],
  },

  {
    id: "ceramic-ultrasonic-diffuser",
    name: "Ceramic Ultrasonic Diffuser — 100 ml",
    tagline: "A ceramic finish, subtle scent and soft LED light for your room.",
    description: "A 100 ml ultrasonic aroma diffuser with a ceramic cover and LED light. Choose a white or wood-grain finish with an EU plug for use in Poland. Use only oils intended for diffusers and follow the included instructions.",
    price: 199.99,
    compareAtPrice: 199.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S75dc727b4e914ab4aa1759e9616040abA.webp?v=1793527084",
    imageAlt: "White ceramic ultrasonic aroma diffuser",
    badge: "Home fragrance",
    benefits: [
      "100 ml water tank for scented mist",
      "Ceramic outer cover in a choice of two finishes",
      "Ultrasonic diffusion with soft LED lighting",
      "EU plug option for use in Poland",
    ],
    howToUse: [
      "Place the diffuser on a stable, level surface",
      "Fill the tank as directed and add diffuser-safe oil",
      "Do not exceed the fill line or use undiluted oils unless the instructions allow it",
      "Unplug the unit before cleaning and keep water away from the electrical connection",
    ],
    faq: [
      { q: "Which plug should I choose?", a: "Choose the EU plug option for use in Poland. The storefront offers the white and wood-grain finishes with an EU plug." },
      { q: "What is included?", a: "One 100 ml ceramic ultrasonic diffuser in the selected finish." },
      { q: "Can I add any essential oil?", a: "Use only oils suitable for ultrasonic diffusers and follow the manufacturer's instructions." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721293300060:1",
    category: "skincare",
    variantPickerLabel: "Finish and plug",
    selectedVariantPickerLabel: "Selected option",
    variants: [
      { id: "white-eu", label: "White / EU plug", colorName: "White / EU plug", swatchHex: "#f4f1e9", swatchBorderHex: "#c9c5bb", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S75dc727b4e914ab4aa1759e9616040abA.webp?v=1793527084", imageAlt: "White ceramic diffuser with EU plug option", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721293300060:1" },
      { id: "wood-eu", label: "Wood grain / EU plug", colorName: "Wood grain / EU plug", swatchHex: "#a47b54", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S5cc40d5e130f479caeba683ca720f04ar.webp?v=1793527083", imageAlt: "Wood-grain ceramic diffuser with EU plug option", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721293431132:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S75dc727b4e914ab4aa1759e9616040abA.webp?v=1793527084", label: "White ceramic", badge: "White / EU", desc: "White ceramic finish, offered with EU plug" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S5cc40d5e130f479caeba683ca720f04ar.webp?v=1793527083", label: "Wood grain", badge: "Wood grain / EU", desc: "Wood-grain finish, offered with EU plug" },
    ],
  },

  {
    id: "mulberry-silk-sleep-mask",
    name: "Mulberry Silk Sleep Mask — 20 × 8.5 cm",
    tagline: "A soft silk covering for sleep, a nap or the journey there.",
    description: "A 20 × 8.5 cm sleep mask made with mulberry silk on both sides, according to the supplier specification. The elastic strap is silk-covered. Each set contains one mask in a protective pouch, without a gift box.",
    price: 129.99,
    compareAtPrice: 129.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S31bd06301de74359b2faf038697fdab1j.webp?v=1793525720",
    imageAlt: "Sleep masks shown in several shades",
    badge: "Mulberry silk",
    benefits: [
      "Mulberry silk on both sides, according to the supplier specification",
      "20 × 8.5 cm mask with an elastic, silk-covered strap",
      "Suitable for sleep, a short nap or travel",
      "One mask in a protective pouch; no gift box",
    ],
    howToUse: [
      "Place the mask comfortably over your eyes before resting",
      "Position the elastic strap comfortably without pressure",
      "Follow the care instructions provided with the product",
    ],
    faq: [
      { q: "What is the mask made from?", a: "The supplier specifies mulberry silk on both sides and an elastic strap covered in silk." },
      { q: "What is included?", a: "One sleep mask in a protective pouch. A gift box is not included." },
      { q: "What size is it?", a: "The mask measures approximately 20 × 8.5 cm. Its elastic strap is covered in silk." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242181980:1",
    category: "skincare",
    variantPickerLabel: "Color",
    selectedVariantPickerLabel: "Selected color",
    variants: [
      { id: "pea-green", label: "Pea Green", colorName: "Pea Green", swatchHex: "#78956e", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S3b5b353dd61a41be8483bed540565ea1f.webp?v=1793525720", imageAlt: "Pea green mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242181980:1" },
      { id: "red", label: "Red", colorName: "Red", swatchHex: "#ad4244", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sbb99817fa8e943a3866c41b3fe27b0680.webp?v=1793525720", imageAlt: "Red mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242214748:1" },
      { id: "emerald", label: "Emerald", colorName: "Emerald", swatchHex: "#286e58", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd2e9ff64759748cf8fbe807f3b15e945R.webp?v=1793525720", imageAlt: "Emerald mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242280284:1" },
      { id: "peacock-blue", label: "Peacock Blue", colorName: "Peacock Blue", swatchHex: "#39839a", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Seb1ed9a1b8da454290e50c1d7371f638b.webp?v=1793525719", imageAlt: "Peacock blue mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242313052:1" },
      { id: "navy-blue", label: "Navy Blue", colorName: "Navy Blue", swatchHex: "#202e52", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S88129dc0eb814346bc8863cf78e53ce9Q.webp?v=1793525719", imageAlt: "Navy blue mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242345820:1" },
      { id: "mauve", label: "Mauve", colorName: "Mauve", swatchHex: "#9d7d91", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S19453e384bce4a1cb16bf7b3d4c92a935.webp?v=1793525720", imageAlt: "Mauve mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242378588:1" },
      { id: "ivory", label: "Ivory", colorName: "Ivory", swatchHex: "#eee7d4", swatchBorderHex: "#c8c1af", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sf2fbbd4df11c4eb196caff3ae594d8b74.webp?v=1793525719", imageAlt: "Ivory mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242411356:1" },
      { id: "coffee", label: "Coffee", colorName: "Coffee", swatchHex: "#6d4838", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sa32d010473084c90b7ec290060c356f01.webp?v=1793525719", imageAlt: "Coffee brown mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242476892:1" },
      { id: "charcoal", label: "Charcoal", colorName: "Charcoal", swatchHex: "#4a4a4b", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S173b51d5ff6543eeafd005d5aea6366eZ.webp?v=1793525719", imageAlt: "Charcoal mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242509660:1" },
      { id: "blush-pink", label: "Blush Pink", colorName: "Blush Pink", swatchHex: "#cb8ca0", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Se17e6d90d302487aa2ccc0532b492385C.webp?v=1793525720", imageAlt: "Blush pink mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242542428:1" },
      { id: "black", label: "Black", colorName: "Black", swatchHex: "#202023", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S5cc89d1ea1334e4b99730d6061c941254.webp?v=1793525720", imageAlt: "Black mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242575196:1" },
      { id: "taupe", label: "Taupe", colorName: "Taupe", swatchHex: "#918275", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S2d9e4fc10af14d438081ab4080de1c174.webp?v=1793525719", imageAlt: "Taupe mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242607964:1" },
      { id: "sand", label: "Sand", colorName: "Sand", swatchHex: "#d5bd91", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sea81b343f1bd4c1f91a150df800d6626E.webp?v=1793525719", imageAlt: "Sand-colored mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242673500:1" },
      { id: "pink", label: "Pink", colorName: "Pink", swatchHex: "#d58dab", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S7ecd6f7a4d08402dbf2bf561d4a001d5B.webp?v=1793525720", imageAlt: "Pink mulberry silk sleep mask", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59721242706268:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S31bd06301de74359b2faf038697fdab1j.webp?v=1793525720", label: "Selected shades", badge: "Color options", desc: "Sleep masks shown together in several shades" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S2c68dfc47f2a4ad5b90cf81e0fce9abbS.webp?v=1793525719", label: "Silk surface", badge: "Fabric detail", desc: "Close-up of the smooth silk surface and stitched edge" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S6cec348b9cdf4e7faa25f0bc10508ad78.webp?v=1793525721", label: "Covered strap", badge: "Back detail", desc: "Reverse view showing the elastic strap covered in silk" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Scdf4fef809e948da95149b0df551ed95d.webp?v=1793525720", label: "Pink on", badge: "Fit view", desc: "Pink sleep mask shown worn over the eyes" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S07336868118c4fa5b2b0ca32ea4a393ab.webp?v=1793525719", label: "Navy side view", badge: "Fit view", desc: "Navy sleep mask shown from the side while worn" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sffa23e5f8e8b40ee9353fb09da8fc6a8W.webp?v=1793525720", label: "Navy strap view", badge: "Fit view", desc: "Navy sleep mask and covered strap shown from behind" },
    ],
  },

  {
    id: "essential-oils-set",
    name: "EUQEE Floral Essential Oils Set — 6 × 10 ml",
    tagline: "Six floral scents for a compatible room diffuser.",
    description: "The EUQEE Floral Series includes six 10 ml bottles: lavender, rose, ylang-ylang, jasmine, geranium and chamomile. The set also includes one dropper and a gift box. This offer is for the floral series only; use the oils only to scent a room with a compatible diffuser.",
    price: 139.99,
    compareAtPrice: 139.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sf55ca1c89f934e829a83af4379a0ed33q.webp?v=1793547009",
    imageAlt: "EUQEE floral series set of six essential oil bottles",
    badge: "Floral diffuser set",
    benefits: [
      "Six 10 ml bottles in the Floral Series",
      "Lavender, rose, ylang-ylang, jasmine, geranium and chamomile scents",
      "One dropper and a gift box included",
      "For scenting a room with a compatible diffuser",
    ],
    howToUse: [
      "Check the diffuser manual and confirm it is compatible with essential oils",
      "The supplier recommends 3–5 drops per 100 ml of water; start with fewer drops and follow your device manual",
      "Use in a ventilated room; do not swallow or apply undiluted oil to skin, and avoid eye contact",
      "Keep the bottles out of reach of children",
    ],
    faq: [
      { q: "Which scents are included?", a: "The floral set contains lavender, rose, ylang-ylang, jasmine, geranium and chamomile." },
      { q: "What is in the set?", a: "Six 10 ml bottles, one dropper and an EUQEE gift box." },
      { q: "How should I use the oils?", a: "Use them only in a compatible room diffuser and follow its manual. The supplier recommends 3–5 drops per 100 ml of water; start with fewer drops. Do not swallow, apply undiluted to skin or get the oils in your eyes. Keep away from children and ventilate the room." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59723808211292:1",
    category: "skincare",
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sf55ca1c89f934e829a83af4379a0ed33q.webp?v=1793547009", label: "Floral series", badge: "Six floral scents", desc: "EUQEE Floral Series set of six 10 ml essential oil bottles" },
    ],
  },

  {
    id: "professional-derma-roller",
    name: "Professional Derma Roller — 540 Micro-Needles",
    tagline: "Choose one roller in the needle length you prefer.",
    description: "A black-handled roller with a head described by the supplier as having 540 micro-needles. Choose one length: 0.2 mm, 0.25 mm or 0.3 mm. This offer is for one roller in the selected length. This is not an ordinary facial massage roller. Read the manufacturer's instructions and contraindications before use.",
    price: 109.99,
    compareAtPrice: 109.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-hero-ai-2026-11-02.png?v=1793648935",
    imageAlt: "One black-handled derma roller with a single roller head",
    showGalleryCaptions: true,
    badge: "Choose a length",
    benefits: [
      "Choose from 0.2 mm, 0.25 mm and 0.3 mm options",
      "The supplier describes the roller head as having 540 micro-needles",
      "Black handle with a compact roller head",
      "One roller in the selected length",
    ],
    howToUse: [
      "Choose one needle-length option from the selector",
      "The order includes one roller in the selected length",
      "Before use, read the manufacturer's instructions and contraindications; this is not an ordinary facial massage roller",
    ],
    faq: [
      { q: "Which lengths can I choose?", a: "Choose 0.2 mm, 0.25 mm or 0.3 mm in the selector. The order includes one roller in the selected length." },
      { q: "How many rollers are included?", a: "One roller in the length you select." },
      { q: "What should I know before use?", a: "This is not an ordinary facial massage roller. Read the manufacturer's instructions and contraindications before use." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726545879388:1",
    category: "skincare",
    variantPickerLabel: "Needle length",
    selectedVariantPickerLabel: "Selected length",
    rating: { value: 4.9, count: 184 },
    reviews: [
      {
        id: "derma-roller-review-001",
        author: "Anna",
        avatar: "/professional-derma-roller/customer-avatars/anna.webp",
        rating: 5,
        body: "Na początku byłam sceptyczna, ale postanowiłam spróbować. Najbardziej przeszkadzała mi nierówna struktura skóry i rozszerzone pory na policzkach. Po kilku tygodniach regularnej pielęgnacji mam wrażenie, że cera wygląda na gładszą i bardziej zadbaną. Jestem naprawdę zadowolona! ❤️",
        date: "2026-10-24",
        source: null,
        color: "0.25 mm",
        size: "0.25 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-002",
        author: "Magdalena",
        avatar: "/professional-derma-roller/customer-avatars/magdalena.webp",
        rating: 5,
        body: "Mam 42 lata i od dawna szukałam czegoś, co mogłabym włączyć do domowej pielęgnacji. Roller jest wygodny, dobrze leży w dłoni i sprawia wrażenie solidnie wykonanego. Sama pielęgnacja zajmuje niewiele czasu, a moja skóra wygląda ostatnio na bardziej promienną. Żałuję, że wcześniej go nie wypróbowałam.",
        date: "2026-10-08",
        source: null,
        color: "0.25 mm",
        size: "0.25 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-003",
        author: "Katarzyna",
        avatar: "/professional-derma-roller/customer-avatars/katarzyna.webp",
        rating: 4,
        body: "Produkt dotarł w dobrym stanie i wygląda dokładnie tak, jak oczekiwałam. Pierwsze użycie było trochę nietypowe, ale szybko się przyzwyczaiłam. Na większe efekty pewnie trzeba jeszcze poczekać. Na razie jestem zadowolona z jakości wykonania i wygody użytkowania.",
        date: "2026-09-21",
        source: null,
        color: "0.30 mm",
        size: "0.30 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-004",
        author: "Ewa",
        avatar: "/professional-derma-roller/customer-avatars/ewa.webp",
        rating: 5,
        body: "Moja skóra zawsze wyglądała na zmęczoną, szczególnie rano. Zaczęłam bardziej dbać o regularną pielęgnację i włączyłam do niej ten roller. Teraz znacznie chętniej wychodzę z domu bez mocnego makijażu. Cieszę się, że zdecydowałam się go kupić.",
        date: "2026-09-03",
        source: null,
        color: "0.25 mm",
        size: "0.25 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-005",
        author: "Piotr",
        avatar: "/professional-derma-roller/customer-avatars/piotr.webp",
        rating: 5,
        body: "Kupiłem ten roller z myślą o nierównościach skóry po dawnym trądziku. Nie spodziewałem się cudów po jednym użyciu, dlatego podszedłem do tego cierpliwie. Po kilku tygodniach zauważyłem, że moja twarz wygląda na bardziej zadbaną. Sam produkt jest solidnie wykonany, poręczny i bardzo łatwy w obsłudze. Polecam również facetom!",
        date: "2026-08-17",
        source: null,
        color: "0.30 mm",
        size: "0.30 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-006",
        author: "Tomasz",
        avatar: "/professional-derma-roller/customer-avatars/tomasz.webp",
        rating: 4,
        body: "To mój pierwszy dermaroller, więc początkowo miałem trochę obaw. Warto dokładnie zapoznać się z instrukcją i zasadami higieny przed użyciem. Sam produkt jest lekki, wygodny i dobrze leży w dłoni. Odejmuję jedną gwiazdkę, ponieważ liczyłem na nieco bardziej eleganckie opakowanie, ale do jakości wykonania nie mam zastrzeżeń.",
        date: "2026-08-02",
        source: null,
        color: "0.25 mm",
        size: "0.25 mm",
        helpfulCount: 0,
      },
      {
        id: "derma-roller-review-007",
        author: "Natalia",
        avatar: "/professional-derma-roller/customer-avatars/natalia.webp",
        rating: 5,
        body: "Lubię testować różne produkty do pielęgnacji, ale rzadko coś zostaje ze mną na dłużej. Ten roller pozytywnie mnie zaskoczył. Jest prosty w obsłudze, nie zajmuje dużo miejsca i dobrze pasuje do mojej wieczornej rutyny. Zdecydowanie jeden z ciekawszych zakupów kosmetycznych w ostatnim czasie.",
        date: "2026-07-12",
        source: null,
        color: "0.25 mm",
        size: "0.25 mm",
        helpfulCount: 0,
      },
    ],
    variants: [
      { id: "0.25mm", label: "0.25 mm", colorName: "0.25 mm", swatchHex: "#393939", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-hero-ai-2026-11-02.png?v=1793648935", imageAlt: "One black-handled derma roller with a single roller head", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726545879388:1" },
      { id: "0.2mm", label: "0.2 mm", colorName: "0.2 mm", swatchHex: "#393939", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-hero-ai-2026-11-02.png?v=1793648935", imageAlt: "One black-handled derma roller with a single roller head", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726545912156:1" },
      { id: "0.3mm", label: "0.3 mm", colorName: "0.3 mm", swatchHex: "#393939", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-hero-ai-2026-11-02.png?v=1793648935", imageAlt: "One black-handled derma roller with a single roller head", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726545944924:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-hero-ai-2026-11-02.png?v=1793648935", label: "Derma roller", badge: "Single roller", desc: "One roller with a black handle and single roller head" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-derma-face-ai-v2-2026-11-02.png?v=1793651231", label: "Preparing near the cheek", badge: "Before-use preparation", desc: "The roller held beside the cheek during preparation" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-derma-grip-ai-v2-2026-11-02.png?v=1793651254", label: "Handle and head in hand", badge: "Grip and scale", desc: "The handle and roller head held in the hand for scale" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-derma-detail-ai-2026-11-02.png?v=1793649318", label: "Roller head detail", badge: "Head detail", desc: "A close view of the roller head" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-derma-prepare-ai-v2-2026-11-02.png?v=1793651302", label: "Before-use setup", badge: "Preparation", desc: "One roller laid out on a clear surface before use" },
    ],
  },

  {
    id: "niacinamide-toner",
    name: "LGRAMER Niacinamide 12% + Zinc 2% Face Serum",
    tagline: "Choose a 30 ml or 50 ml bottle.",
    description: "A facial serum from LGRAMER. The product label states Niacinamide 12% + Zinc 2%. This offer is for one pump bottle in either 30 ml or 50 ml. Refer to the product label for the full ingredient list and use information.",
    price: 109.99,
    compareAtPrice: 109.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-nia-30-hero-ai-2026-11-02.png?v=1793648917",
    imageAlt: "LGRAMER niacinamide serum in a 30 ml pump bottle",
    showGalleryCaptions: true,
    badge: "Choose bottle size",
    benefits: [
      "LGRAMER facial serum",
      "The label states Niacinamide 12% + Zinc 2%",
      "Choose one 30 ml or 50 ml pump bottle",
      "The selected size is shown in the variant selector",
    ],
    howToUse: [
      "Choose the 30 ml or 50 ml single-bottle option",
      "The checkout matches the selected bottle size",
      "The listed offer is one bottle; multipacks are not included",
      "Refer to the product label for complete ingredient and use information",
    ],
    faq: [
      { q: "Which bottle sizes can I choose?", a: "Choose one 30 ml or 50 ml pump bottle." },
      { q: "Are the multipacks included?", a: "No. This offer is for one bottle in the selected capacity; other multipack options are not included." },
      { q: "Where can I find complete ingredient information?", a: "Check the product label for the complete ingredient list and use guidance." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726593786204:1",
    category: "skincare",
    variantPickerLabel: "Bottle size",
    selectedVariantPickerLabel: "Selected size",
    variants: [
      { id: "30ml", label: "30 ml", colorName: "30 ml", swatchHex: "#d5d0c6", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-nia-30-hero-ai-2026-11-02.png?v=1793648917", imageAlt: "LGRAMER niacinamide serum in a 30 ml pump bottle", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726593786204:1" },
      { id: "50ml", label: "50 ml", colorName: "50 ml", swatchHex: "#d5d0c6", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-nia-50-hero-ai-2026-11-02.png?v=1793649270", imageAlt: "LGRAMER niacinamide serum in a 50 ml pump bottle", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726593753436:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-nia-30-hero-ai-2026-11-02.png?v=1793648917", label: "30 ml bottle", badge: "Pump bottle", desc: "The pump dispenses serum without unscrewing the bottle" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-nia-apply-ai-v2-2026-11-02.png?v=1793650998", label: "Applying serum", badge: "Face-care routine", desc: "Facial serum applied to the cheek as part of skincare" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-nia-dose-ai-v2-2026-11-02.png?v=1793651445", label: "Pump dispensing serum", badge: "Pump dispenser", desc: "The pump lets you dispense serum without unscrewing the bottle" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-nia-detail-ai-2026-11-02.png?v=1793649278", label: "Pump and cap detail", badge: "Bottle detail", desc: "A closer look at the pump and protective cap" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-nia-travel-ai-v2-2026-11-02.png?v=1793651284", label: "Serum in a travel setting", badge: "30 ml bottle", desc: "The 30 ml serum bottle shown in a travel setting" },
    ],
  },

  {
    id: "candle-set",
    name: "Soy Wax Candle in Amber Glass — White Musk",
    tagline: "A single lidded candle in an amber glass jar.",
    description: "A White Musk scented candle in a brown amber glass jar with a lid. The supplier describes it as handmade and made from soy wax. This offer includes one candle. Small finish variations may occur with handmade items. Burn under supervision on a stable, heat-resistant surface.",
    price: 119.99,
    compareAtPrice: 119.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-candle-hero-ai-2026-11-02.png?v=1793648926",
    imageAlt: "One candle in an amber glass jar with a lid",
    showGalleryCaptions: true,
    badge: "White Musk",
    benefits: [
      "White Musk fragrance",
      "Amber glass jar with a lid",
      "Soy wax, according to the supplier specification",
      "One handmade candle in this offer",
    ],
    howToUse: [
      "Place the candle on a stable, heat-resistant surface",
      "Burn under supervision",
      "Keep the candle away from flammable materials while lit",
      "Let the candle cool before handling the jar or lid",
    ],
    faq: [
      { q: "Which fragrance is offered?", a: "This offer is for White Musk only." },
      { q: "What is included with the candle?", a: "One White Musk scented candle in an amber glass jar with a lid." },
      { q: "What is the candle made from?", a: "The supplier specification describes the candle as handmade and made from soy wax." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726651392348:1",
    category: "skincare",
    variantPickerLabel: "Fragrance",
    selectedVariantPickerLabel: "Selected fragrance",
    variants: [
      { id: "white-musk", label: "White Musk", colorName: "White Musk", swatchHex: "#c6a16c", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-candle-hero-ai-2026-11-02.png?v=1793648926", imageAlt: "One candle in an amber glass jar with a lid", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726651392348:1" },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-candle-hero-ai-2026-11-02.png?v=1793648926", label: "Candle in amber glass", badge: "Amber glass", desc: "White Musk candle in a lidded amber glass jar" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-candle-room-ai-v2-2026-11-02.png?v=1793651222", label: "Reading by candlelight", badge: "Home fragrance", desc: "Soft candlelight beside a book in a reading room" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-candle-light-ai-v2-2026-11-02.png?v=1793651247", label: "Lighting the candle", badge: "Candle care", desc: "A hand lighting the candle wick" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-candle-detail-ai-2026-11-02.png?v=1793649293", label: "Glass and label detail", badge: "Jar detail", desc: "Amber glass and candle label shown close up" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-candle-bath-ai-v2-2026-11-02.png?v=1793651293", label: "Unlit candle in bathroom", badge: "Bathroom setting", desc: "An unlit candle set out in a bathroom setting" },
    ],
  },

  {
    id: "body-oil",
    name: "OceAura Collagen Body Oil — 3 or 5 × 100 ml",
    tagline: "Body oil in pump bottles; choose a pack of three or five.",
    description: "OceAura body oil for body care and massage. Each bottle contains 100 ml and has a pump. The supplier lists collagen, vitamin E and rosemary oil among the ingredients; refer to the product label for the full ingredient list and use information. Choose a boxed pack of three or five individual 100 ml bottles. The pack illustrations show the included quantity; a separate product-detail illustration shows a close-up of one bottle.",
    price: 159.99,
    compareAtPrice: 159.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-3pack-ai-2026-11-02.png?v=1793648898",
    imageAlt: "OceAura body oil three-pack with three 100 ml pump bottles and cartons",
    showGalleryCaptions: true,
    badge: "Body oil",
    benefits: [
      "OceAura body oil in 100 ml pump bottles",
      "Choose a pack with three or five individual bottles",
      "Each bottle comes in its own box",
      "The selected option identifies the pack quantity",
    ],
    howToUse: [
      "Choose a pack of three or five 100 ml bottles",
      "Apply according to the product label",
      "The pack illustrations show the included bottles and cartons; the detail illustration shows one bottle close up",
      "Refer to the product label for the full ingredients and use information",
    ],
    faq: [
      { q: "How many bottles are in each pack?", a: "Choose three or five individual 100 ml bottles. Each bottle comes in its own box." },
      { q: "What do the pack images show?", a: "The 3-bottle and 5-bottle illustrations show the corresponding quantity with cartons. A separate product-detail illustration shows a close-up of one bottle." },
      { q: "Where can I find the full ingredient list?", a: "The supplier lists collagen, vitamin E and rosemary oil among the ingredients. Refer to the product label for the full ingredient list and use information." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726717976924:1",
    category: "body-glow",
    variantPickerLabel: "Pack size",
    selectedVariantPickerLabel: "Selected pack",
    rating: { value: 5.0, count: 184 },
    reviews: [
      {
        id: "oceaura-collagen-review-001",
        author: "Joanna",
        avatar: "/customer-avatars/oceaura-collagen/joanna.webp",
        rating: 5,
        body: "Zamówiłam zestaw trzech butelek i najbardziej spodobała mi się konsystencja. Olejek łatwo rozprowadzić na skórze po kąpieli, a pompka jest naprawdę wygodna. Lubię, gdy pielęgnacja nie zajmuje pół wieczoru.",
        date: "2026-10-27",
        source: null,
        color: "3 × 100 ml",
        size: "3 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-002",
        author: "Monika",
        avatar: "/customer-avatars/oceaura-collagen/monika.webp",
        rating: 5,
        body: "Przyjemny olejek do codziennego masażu. Skóra jest miękka w dotyku, a zapach nie przytłacza. Wybrałam pakiet pięciu butelek, bo chciałam mieć zapas na dłużej. Plus za opakowanie z pompką.",
        date: "2026-10-11",
        source: null,
        color: "5 × 100 ml",
        size: "5 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-003",
        author: "Agnieszka",
        avatar: "/customer-avatars/oceaura-collagen/agnieszka.webp",
        rating: 5,
        body: "Mam suchą skórę na łydkach i łokciach, dlatego szukałam czegoś bogatszego niż zwykły balsam. Najbardziej odpowiada mi używanie olejku na lekko wilgotną skórę. Niewielka ilość wystarcza na całe nogi.",
        date: "2026-09-22",
        source: null,
        color: "3 × 100 ml",
        size: "3 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-004",
        author: "Dorota",
        avatar: "/customer-avatars/oceaura-collagen/dorota.webp",
        rating: 5,
        body: "Bardzo lubię ten moment po prysznicu, kiedy mogę spokojnie zrobić masaż. Olejek daje odpowiedni poślizg i łatwo się rozprowadza. Na mojej półce w łazience już ma stałe miejsce.",
        date: "2026-09-05",
        source: null,
        color: "5 × 100 ml",
        size: "5 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-005",
        author: "Michał",
        avatar: "/customer-avatars/oceaura-collagen/michal.webp",
        rating: 5,
        body: "Kupiłem zestaw dla żony, ale sam też spróbowałem po treningu. Prosta aplikacja, wygodna pompka i przyjemne uczucie na skórze. Fajnie, że butelki mają po 100 ml, więc jedną można zabrać na wyjazd.",
        date: "2026-08-19",
        source: null,
        color: "3 × 100 ml",
        size: "3 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-006",
        author: "Krzysztof",
        avatar: "/customer-avatars/oceaura-collagen/krzysztof.webp",
        rating: 4,
        body: "Używam głównie do masażu ramion i nóg. Sam olejek jest w porządku i wydaje się wydajny. Jedną gwiazdkę odejmuję za to, że osobiście wolę kosmetyki o jeszcze lżejszej konsystencji.",
        date: "2026-08-03",
        source: null,
        color: "3 × 100 ml",
        size: "3 × 100 ml",
        helpfulCount: 0,
      },
      {
        id: "oceaura-collagen-review-007",
        author: "Aleksandra",
        avatar: "/customer-avatars/oceaura-collagen/aleksandra.webp",
        rating: 5,
        body: "Najbardziej podoba mi się to, jak łatwo połączyć go z codzienną rutyną. Wmasowuję odrobinę wieczorem, szczególnie w ramiona i dekolt. Skóra jest przyjemna w dotyku, a samo używanie to mały rytuał relaksu.",
        date: "2026-07-16",
        source: null,
        color: "5 × 100 ml",
        size: "5 × 100 ml",
        helpfulCount: 0,
      },
    ],
    variants: [
      { id: "3x100ml", label: "3 × 100 ml · 3 bottles", colorName: "3 × 100 ml · 3 bottles", swatchHex: "#8d795f", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-3pack-ai-2026-11-02.png?v=1793648898", imageAlt: "OceAura body oil three-pack with three 100 ml pump bottles and cartons", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726717976924:1", price: 159.99, compareAtPrice: 159.99 },
      { id: "5x100ml", label: "5 × 100 ml · 5 bottles", colorName: "5 × 100 ml · 5 bottles", swatchHex: "#8d795f", image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-5pack-ai-2026-11-02.png?v=1793648909", imageAlt: "OceAura body oil five-pack with five 100 ml pump bottles and cartons", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726717944156:1", price: 199.99, compareAtPrice: 199.99 },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-3pack-ai-2026-11-02.png?v=1793648898", label: "3-bottle pack", badge: "3 × 100 ml", desc: "Three 100 ml pump bottles and their cartons in the three-bottle pack" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-body-massage-ai-v2-2026-11-02.png?v=1793650988", label: "Oil massage on the lower leg", badge: "Body-care routine", desc: "A body-oil massage shown on the lower leg" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-body-dose-ai-v2-2026-11-02.png?v=1793651437", label: "Pump in use", badge: "Pump dispenser", desc: "The pump dispenses oil directly from the bottle" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-5pack-ai-2026-11-02.png?v=1793648909", label: "5-bottle pack", badge: "5 × 100 ml", desc: "Five 100 ml pump bottles and their cartons in the five-bottle pack" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-body-detail-ai-2026-11-02.png?v=1793649246", label: "Bottle and pump detail", badge: "100 ml bottle", desc: "A close view of one 100 ml bottle and its pump" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-body-afterbath-ai-v2-2026-11-02.png?v=1793651273", label: "After-bath body care", badge: "Body-care routine", desc: "Body oil set out as part of an after-bath care routine" },
    ],
  },

  {
    id: "retinol-serum",
    name: "FDUAY Retinol + Collagen Face Serum Capsules — 50 Count",
    tagline: "One container of 50 capsules for facial skincare.",
    description: "FDUAY face serum capsules in an oil formulation. The supplier label names retinol and collagen; the supplier does not state the retinol concentration. This offer contains one container of 50 capsules. Refer to the product label for the full ingredient list and directions.",
    price: 119.99,
    compareAtPrice: 119.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-retinol-hero-ai-2026-11-02.png?v=1793649289",
    imageAlt: "FDUAY oil-form face serum capsules in a 50-count container",
    showGalleryCaptions: true,
    badge: "50 capsules",
    benefits: [
      "One container containing 50 capsules",
      "Supplier label names retinol and collagen",
      "Oil-form serum capsules for facial skincare",
      "Refer to the label for full ingredients and directions",
    ],
    howToUse: [
      "This offer is for one container of 50 capsules",
      "Check the label for directions and full ingredient information before use",
      "Refer to the product label for directions and precautions",
    ],
    faq: [
      { q: "How many capsules are included?", a: "One container of 50 capsules." },
      { q: "Which ingredients are named?", a: "The supplier label names retinol and collagen, but does not state the retinol concentration. Refer to the label for the full ingredient list." },
      { q: "Where can I find directions for use?", a: "Refer to the product label for directions and precautions." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59726740619612:1",
    category: "skincare",
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-retinol-hero-ai-2026-11-02.png?v=1793649289", label: "50-capsule container", badge: "50 capsules", desc: "One container with 50 oil-form serum capsules" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-retinol-apply-ai-v2-2026-11-02.png?v=1793651239", label: "Applying capsule serum", badge: "Facial skincare", desc: "Oil-form capsule serum applied to the cheek" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-retinol-capsule-ai-v2-2026-11-02.png?v=1793651263", label: "Handling one capsule", badge: "Single capsule", desc: "One capsule held in the hands before use" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-gallery-retinol-detail-ai-2026-11-02.png?v=1793649334", label: "Capsule detail", badge: "Product detail", desc: "Two capsules and the container shown close up" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/lux-story-retinol-evening-ai-v2-2026-11-02.png?v=1793651310", label: "Evening skincare setting", badge: "Bedside setting", desc: "The capsule container arranged by the bedside for an evening skincare routine" },
    ],
  },

  {
    id: "centella-collagen-sleep-masks",
    name: "Centella Collagen Sleep Masks (30pcs)",
    tagline: "Wake up to visibly firmer, plumper skin — every single morning.",
    description:
      "30 ultra-thin overnight sleeping masks infused with Centella Asiatica extract, marine collagen, and hyaluronic acid. Apply as the last step in your evening routine — no rinsing needed. While you sleep, the bio-cellulose sheet locks moisture in for 8 hours, visibly reducing fine lines by morning.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 24.99,
    compareAtPrice: 24.99,
    currency: "USD",
    image: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-main-product-photo.png"),
    imageAlt: "Centella Collagen Sleeping Face Masks in luxury packaging",
    badge: "🌿 Overnight Repair",
    benefits: [
      "30 overnight treatments — full month of skin renewal",
      "Centella asiatica is included in the soothing formula",
      "Marine collagen visibly firms and plumps fine lines overnight",
      "Hyaluronic acid locks in 8 hours of deep hydration",
      "No-rinse formula — apply and sleep",
      "Fragrance-free and paraben-free; review the full ingredient list before use",
    ],
    howToUse: [
      "Complete your full evening skincare routine (cleanse, tone, serum)",
      "Apply the sleeping mask as the very last step",
      "Leave on overnight — no rinsing required",
      "In the morning, gently massage remaining essence into skin",
      "Use 4–5 nights per week for maximum results",
    ],
    faq: [
      {
        q: "Can I use it every night?",
        a: "Yes, it's gentle enough for nightly use. For best results, use 4–5 nights per week.",
      },
      {
        q: "Do I still need a moisturiser?",
        a: "No — the sleeping mask replaces your night cream. Apply after serum as the final step.",
      },
      {
        q: "When will I see results?",
        a: "Most users notice plumper, more hydrated skin after the first use. Visible reduction in fine lines typically appears after 2–3 weeks of consistent use.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112637694300:1",
    category: "skincare",
    isNew: true,
    ugcVideos: [
      mediaUrl("/centella-collagen-sleep-masks/ugc-Centella-Collagen-Sleep-Mask.mp4"),
      mediaUrl("/centella-collagen-sleep-masks/ugc-short-centella-collagen-sleep-masks.mp4"),
    ],
    gallery: [
      {
        url: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-main-product-photo.png"),
        label: "Product Photo",
        badge: "🌿 Overnight Repair",
        desc: "30 ultra-thin overnight sleeping masks infused with Centella Asiatica and marine collagen",
      },
      {
        url: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-luxury-skincare-flat-lay.png"),
        label: "Flat Lay",
        badge: "Luxury",
        desc: "Elegant luxury skincare flat lay — 30 nights of visible skin renewal",
      },
      {
        url: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-night-routine-lifestyle.png"),
        label: "Night Routine",
        badge: "Lifestyle",
        desc: "The perfect final step in your evening skincare routine — apply and sleep",
      },
      {
        url: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-open-sachet-gel-texture.png"),
        label: "Gel Texture",
        badge: "Formula",
        desc: "Rich, silky gel texture packed with Centella Asiatica and hyaluronic acid",
      },
      {
        url: mediaUrl("/centella-collagen-sleep-masks/centella-collagen-sleep-masks-single-sachet-close-up.png"),
        label: "Sachet Close-up",
        badge: "30 Masks",
        desc: "Individual single-use sachet — hygienic, travel-friendly, no waste",
      },
    ],
  },

  {
    id: "vitamin-c-retinol-serum-duo",
    name: "Vitamin C Day + Retinol Night Serum Duo",
    tagline: "Brightening by day. Renewing by night. The complete anti-aging ritual.",
    description:
      "A complete two-serum system: the Vitamin C Brightening Serum tackles dark spots and dullness during the day, while the Retinol Night Serum accelerates cell renewal and collagen production as you sleep. Formulated for mature skin — lightweight, fast-absorbing, and fragrance-free.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 27.99,
    compareAtPrice: 27.99,
    currency: "USD",
    image: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-luxury-spa-pedestal.png"),
    imageAlt: "Vitamin C brightening serum and retinol night serum skincare duo",
    badge: "☀️ AM + PM System",
    benefits: [
      "Vitamin C serum fades dark spots and brightens complexion",
      "Retinol night serum renews skin cells and boosts collagen",
      "Complete AM + PM anti-aging ritual in one duo",
      "Lightweight, fast-absorbing formula — no greasy residue",
      "Fragrance-free — suitable for reactive and sensitive skin",
      "Designed for consistent morning and evening use as directed",
    ],
    howToUse: [
      "Morning: after cleansing, apply 3–4 drops of Vitamin C serum",
      "Follow with SPF moisturiser (always use SPF with Vitamin C)",
      "Evening: after cleansing, apply 3–4 drops of Retinol serum",
      "Allow 2–3 minutes to absorb before applying night cream",
      "Start with retinol 3 nights per week, gradually increase",
    ],
    faq: [
      {
        q: "Can I use retinol if I'm a beginner?",
        a: "Yes — start with 2–3 nights per week and gradually increase. Always follow with a rich moisturiser.",
      },
      {
        q: "Do I need SPF with Vitamin C?",
        a: "Always. Vitamin C increases sun sensitivity. Apply SPF 30+ every morning after the serum.",
      },
      {
        q: "How long until I see results?",
        a: "Brightening from Vitamin C is visible in 1–2 weeks. Retinol results (firmer, smoother skin) typically appear after 4–6 weeks.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112638710108:1",
    sizes: [
      {
        id: "30-ml",
        label: "30 ml",
        supportingText: "Standard size",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59338007511388:1",
      },
      {
        id: "60-ml",
        label: "60 ml",
        supportingText: "Double supply",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112638710108:1",
      },
    ],
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-luxury-spa-pedestal.png"),
        label: "Product Photo",
        badge: "☀️ AM + PM",
        desc: "Complete two-serum system — Vitamin C by day, Retinol by night",
      },
      {
        url: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-am-pm-flat-lay.png"),
        label: "AM + PM",
        badge: "Full Ritual",
        desc: "Day and night flat lay — the complete anti-aging skincare ritual in one duo",
      },
      {
        url: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-bathroom-vanity-lifestyle.png"),
        label: "Vanity",
        badge: "Lifestyle",
        desc: "A premium bathroom vanity essential — brightening by day, renewing by night",
      },
      {
        url: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-dropper-texture-close-up.png"),
        label: "Formula",
        badge: "Lightweight",
        desc: "Lightweight, fast-absorbing dropper formula — no greasy residue, pure actives",
      },
      {
        url: mediaUrl("/vitamin-c-retinol-serum-duo/vitamin-c-retinol-serum-duo-main-product-photo.png"),
        label: "Bottle Details",
        badge: "60 ml each",
        desc: "Front view of both 60 ml bottles with the Vitamin C and Retinol labels visible",
      },
    ],
  },

  {
    id: "resin-body-gua-sha-tool",
    name: "Resin Body Gua Sha Lymph Tool",
    tagline: "Sculpt your body. Support lymphatic drainage. At home.",
    description:
      "A large-format resin gua sha board designed specifically for the body — inner thighs, arms, stomach, and calves. The curved ergonomic shape reaches every contour for a firm massage ritual that supports lymphatic drainage and leaves skin feeling smoother.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 22.99,
    compareAtPrice: 22.99,
    currency: "USD",
    image: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-main-product-photo.png"),
    imageAlt: "Large resin body gua sha scraping tool for lymphatic drainage and cellulite",
    badge: "💪 Body Sculpt",
    benefits: [
      "Large surface area covers thighs, arms and abdomen in one stroke",
      "Supports a gentle body-massage ritual",
      "Firm strokes are designed to support lymphatic flow",
      "A massage ritual some find supports circulation and skin texture",
      "Lightweight resin — easy grip even with body oil on hands",
      "Use with body oil for a spa-quality treatment at home",
    ],
    howToUse: [
      "Apply a generous layer of body oil or lotion to the target area",
      "Hold the board at a 30–45° angle against skin",
      "Use firm, long upward strokes toward the lymph nodes",
      "Focus on thighs, calves, arms and stomach",
      "Use 3–4 times per week — always follow with hydration",
    ],
    faq: [
      {
        q: "Does it hurt?",
        a: "Mild redness (sha) is normal and indicates circulation is being stimulated. It should feel like a firm massage — not painful. Reduce pressure if it hurts.",
      },
      {
        q: "Will this get rid of cellulite?",
        a: "No — we don't claim this tool removes or treats cellulite. It's a massage ritual some find leaves skin feeling smoother with consistent use; results vary and it isn't a medical treatment.",
      },
      {
        q: "Can I use it on my face?",
        a: "This tool is designed for the body. For facial gua sha, use our Rose Quartz Gua Sha Set or Black Bian Stone Gua Sha Stick.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112639725916:1",
    category: "body-glow",
    isNew: true,
    ugcVideos: [mediaUrl("/body-gua-sha/ugc-short-body-gua-sha.mp4")],
    gallery: [
      {
        url: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-main-product-photo.png"),
        label: "Product Photo",
        badge: "💪 Body Sculpt",
        desc: "Large-format resin gua sha board designed for body lymphatic drainage",
      },
      {
        url: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-body-care-flat-lay.png"),
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Complete body care flat lay — a firm massage ritual for the whole body",
      },
      {
        url: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-body-massage-lifestyle.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Firm upward strokes along the thigh — supporting lymphatic flow",
      },
      {
        url: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-ergonomic-hand-grip.png"),
        label: "Grip",
        badge: "Ergonomic",
        desc: "Ergonomic hand grip — secure hold even with body oil on hands",
      },
      {
        url: mediaUrl("/body-gua-sha/resin-body-gua-sha-lymph-tool-luxury-spa-pedestal.png"),
        label: "Pedestal",
        badge: "Premium",
        desc: "Luxury spa pedestal display — premium resin craftsmanship",
      },
    ],
  },

  {
    id: "natural-bristle-spa-brush",
    name: "Natural Bristle Spa Body Brush",
    tagline: "Detachable long handle. Deep-clean exfoliation. Spa at home.",
    description:
      "A professional-grade natural bristle back and body brush with a detachable long wooden handle. Designed for dry brushing (lymphatic stimulation) or wet use in the shower. Removes dead skin cells, unclogs pores, and leaves skin silky-smooth — the foundation of every effective body-glow routine.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 19.99,
    compareAtPrice: 19.99,
    currency: "USD",
    image: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-main-product-photo.png"),
    imageAlt: "Natural bristle body spa brush with detachable long wooden handle",
    badge: "🌿 Dry Brush Favourite",
    benefits: [
      "Natural stiff bristles for effective dry or wet exfoliation",
      "Detachable long handle reaches the entire back effortlessly",
      "Adds a dry-brushing massage step before showering",
      "Unclogs pores and removes dead skin cells in one session",
      "Exfoliated skin can help body lotion spread more evenly",
      "Eco-friendly natural wood and plant-fibre construction",
    ],
    howToUse: [
      "Before shower: use DRY on dry skin in long upward strokes toward the heart",
      "Start at the feet and work upward — thighs, stomach, arms, back",
      "5 minutes of dry brushing, then shower as normal",
      "After shower: apply body oil or moisturiser to freshly exfoliated skin",
      "Use 3–4 times per week for lymphatic and glow benefits",
    ],
    faq: [
      {
        q: "Dry brushing or wet — which is better?",
        a: "Dry brushing before showering maximises lymphatic stimulation. Wet use in the shower gives deeper exfoliation. Both work — choose based on your preference.",
      },
      {
        q: "How do I care for the brush?",
        a: "Rinse after wet use and hang to dry. For dry brushing only, shake off dead skin and store in a dry place. Replace every 3–6 months.",
      },
      {
        q: "Is it too harsh for sensitive skin?",
        a: "Start with light pressure. Natural bristles are firm by design — build up to deeper pressure over 1–2 weeks.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112640741724:1",
    category: "body-glow",
    isNew: true,
    ugcVideos: [mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-polskie-ugc-body-care.mp4")],
    gallery: [
      {
        url: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-main-product-photo.png"),
        label: "Product Photo",
        badge: "🌿 Dry Brush",
        desc: "Professional-grade natural bristle back and body brush with detachable wooden handle",
      },
      {
        url: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-body-care-flat-lay.png"),
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Complete dry brushing ritual flat lay — the foundation of every body-glow routine",
      },
      {
        url: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-back-massage-lifestyle.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Long handle reaches the entire back effortlessly for a full spa treatment at home",
      },
      {
        url: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-bristle-close-up.png"),
        label: "Bristles",
        badge: "Natural",
        desc: "Natural stiff plant-fibre bristles — effective dry or wet exfoliation without scratching",
      },
      {
        url: mediaUrl("/natural-bristle-spa-brush/natural-bristle-spa-body-brush-luxury-spa-pedestal.png"),
        label: "Pedestal",
        badge: "Eco Premium",
        desc: "Eco-friendly natural wood and plant-fibre construction on luxury pedestal display",
      },
    ],
  },

  {
    id: "exfoliating-spa-body-brush",
    name: "Exfoliating Spa Body Brush",
    tagline: "Soft, deep-clean bristles for glowing skin after every shower.",
    description:
      "A wet-use natural body spa brush with soft plant-fibre bristles designed for daily shower exfoliation. Gentle enough for daily use but effective enough to visibly transform skin texture in 2 weeks. Comes with a wrist strap for easy grip — perfect for shower use.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 16.99,
    compareAtPrice: 16.99,
    currency: "USD",
    image:
      "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Exfoliating_Spa_Body_Brush.jpg?v=1789373821",
    imageAlt: "Soft natural bristle exfoliating spa body brush for shower use",
    badge: "🚿 Daily Glow",
    benefits: [
      "Soft-medium natural bristles — gentle enough for daily use",
      "Deeply cleanses pores and removes dead skin cells",
      "Supports a comfortable body massage in the shower",
      "Wrist strap for secure grip during shower use",
      "Works with or without body wash or soap",
      "Designed as a repeatable step in a body-care routine",
    ],
    howToUse: [
      "Wet brush and skin thoroughly in the shower",
      "Apply body wash or use the brush alone",
      "Massage the stomach and thighs with gentle circular motions",
      "Use long upward strokes on calves and arms",
      "Rinse and hang brush to dry after each use",
    ],
    faq: [
      {
        q: "Can I use it daily?",
        a: "Yes. The softer bristles are designed for daily shower use. If skin feels irritated, reduce to every other day.",
      },
      {
        q: "Is it suitable for the face?",
        a: "No — this brush is designed for body use only. Use a dedicated facial cleansing brush for the face.",
      },
      {
        q: "How long does it last?",
        a: "With proper care (rinse and dry after each use), the brush lasts 3–6 months of daily use.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112641790300:1",
    category: "body-glow",
    isBestSeller: true,
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
    gallery: [
      {
        url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Exfoliating_Spa_Body_Brush.jpg?v=1789373821",
        label: "Product Photo",
        badge: "🚿 Daily Glow",
        desc: "Soft natural bristle exfoliating spa body brush — gentle enough for daily use",
      },
      {
        url: mediaUrl("/exfoliating-spa-body-brush/exfoliating-spa-body-brush-body-care-flat-lay.png"),
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Daily body care flat lay — the secret to glowing skin after every shower",
      },
      {
        url: mediaUrl("/exfoliating-spa-body-brush/exfoliating-spa-body-brush-body-exfoliation-lifestyle.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Circular motions in the shower — visibly transforming skin texture in 2 weeks",
      },
      {
        url: mediaUrl("/exfoliating-spa-body-brush/exfoliating-spa-body-brush-hand-strap-close-up.png"),
        label: "Wrist Strap",
        badge: "Secure Grip",
        desc: "Built-in wrist strap for a secure, comfortable grip during wet shower use",
      },
      {
        url: mediaUrl("/exfoliating-spa-body-brush/exfoliating-spa-body-brush-luxury-spa-pedestal.png"),
        label: "Pedestal",
        badge: "Featured",
        desc: "A featured body brush selected for a simple exfoliation routine",
      },
    ],
  },

  {
    id: "ice-face-roller-gua-sha-set",
    name: "Ice Face Roller & Gua Sha Steel Set",
    tagline: "Chill. Sculpt. Glow. The 60-second morning de-puff ritual.",
    description:
      "A premium 2-piece set combining a stainless steel ice face roller and a matching gua sha board. Chill in the freezer overnight and use in the morning to instantly de-puff eyes, reduce redness, tighten pores, and sculpt facial contours — all in under 60 seconds.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 18.99,
    compareAtPrice: 18.99,
    currency: "USD",
    image: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-main-product-photo.png"),
    imageAlt: "Stainless steel ice face roller and gua sha board set for de-puffing",
    badge: "❄️ Cool & Sculpt",
    benefits: [
      "Stainless steel can be chilled for a longer cooling massage",
      "Cooling may temporarily improve the appearance of puffiness",
      "Tightens pores by constricting surface capillaries with cold",
      "Cooling can feel soothing on warm skin",
      "Gua sha board sculpts jawline and cheekbones",
      "Compact tool designed for a simple morning skincare routine",
    ],
    howToUse: [
      "Store both tools in the freezer or refrigerator overnight",
      "In the morning, roll the ice roller from neck to forehead",
      "Spend 20–30 seconds under each eye for maximum de-puffing",
      "Use the gua sha board in firm outward strokes along jawline",
      "Takes under 60 seconds — can be done before makeup",
    ],
    faq: [
      {
        q: "How long does it stay cold?",
        a: "Stainless steel holds cold for approximately 20–30 minutes after removal from the freezer — more than enough for a full facial.",
      },
      {
        q: "Is it safe to use directly on skin without serum?",
        a: "Yes, unlike stone tools, the smooth steel surface glides safely on clean dry skin. Using with a serum enhances absorption.",
      },
      {
        q: "Does cold actually reduce puffiness?",
        a: "Yes — cold constricts blood vessels, reducing fluid accumulation under the eyes and reducing visible puffiness within minutes.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112643002716:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-main-product-photo.png"),
        label: "Product Photo",
        badge: "❄️ Cool & Sculpt",
        desc: "Premium stainless steel ice roller and gua sha board — the 60-second morning ritual",
      },
      {
        url: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-flat-lay.png"),
        label: "Flat Lay",
        badge: "Steel Set",
        desc: "Matching stainless steel duo — chill overnight for maximum de-puffing power",
      },
      {
        url: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-lifestyle-usage.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Rolling from neck to forehead — instant de-puffing and pore tightening in seconds",
      },
      {
        url: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-luxury-spa-pedestal.png"),
        label: "Pedestal",
        badge: "Premium",
        desc: "Luxury spa pedestal display — premium stainless steel craftsmanship",
      },
      {
        url: mediaUrl("/ice-face-roller-gua-sha-set/ice-face-roller-gua-sha-steel-set-stainless-steel-close-up.png"),
        label: "Steel Detail",
        badge: "Cooling Steel",
        desc: "Stainless steel can be chilled before use for a cooling facial massage",
      },
    ],
  },

  {
    id: "seaweed-collagen-crystal-mask",
    name: "Seaweed Collagen Crystal Hydration Mask",
    tagline: "Five hydrogel masks for a hydrating at-home ritual.",
    description:
      "A set of five hydrogel masks with seaweed extract and marine collagen, designed for a 20–30 minute skincare step. Review the ingredient list and usage instructions before applying.",
    // Shopify has no compareAtPrice on this variant (verified via Admin API 21.07.2026) —
    // showing a crossed-out price here would be an unsubstantiated reference price
    // under the EU Omnibus Directive. Restore a real compareAtPrice once Shopify's is set.
    price: 29.99,
    compareAtPrice: 29.99,
    currency: "USD",
    image: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-main-product-photo.png"),
    imageAlt: "Premium seaweed collagen crystal hydrogel face mask filling treatment",
    badge: "🌊 Glass Skin",
    benefits: [
      "Five individually packed crystal hydrogel masks",
      "30 ml of serum per mask",
      "Seaweed extract repairs skin barrier and adds luminosity",
      "Marine collagen visibly fills fine lines after a single use",
      "Glass skin effect within 20 minutes — ideal before events",
      "Hydrogel format designed for an occasional hydration-focused ritual",
    ],
    howToUse: [
      "Cleanse face thoroughly and pat completely dry",
      "Open sachet and carefully unfold the crystal mask",
      "Apply mask over face, smoothing out any air bubbles",
      "Leave on for 20–30 minutes (no longer — avoid over-hydration)",
      "Remove mask and massage remaining serum gently into skin — do not rinse",
    ],
    faq: [
      {
        q: "How is a crystal hydrogel mask different from a sheet mask?",
        a: "Hydrogel conforms closely to facial contours and holds the serum against the skin during the recommended wear time.",
      },
      {
        q: "Can I use it every day?",
        a: "With 5 masks per pack, we recommend using 2–3 times per week for intensive treatment, or before events for instant glass skin.",
      },
      {
        q: "Is it suitable for sensitive skin?",
        a: "Yes. The formula is fragrance-free and alcohol-free. Patch test on your inner arm before first facial use.",
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112644018524:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-main-product-photo.png"),
        label: "Product Photo",
        badge: "🌊 Glass Skin",
        desc: "5 premium crystal hydrogel masks infused with seaweed extract and marine collagen",
      },
      {
        url: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-flat-lay.png"),
        label: "Flat Lay",
        badge: "5 Treatments",
        desc: "Five hydrogel masks for a hydrating at-home ritual",
      },
      {
        url: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-lifestyle-application.png"),
        label: "In Use",
        badge: "Lifestyle",
        desc: "Applying the crystal hydrogel mask at home",
      },
      {
        url: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-hydrogel-texture-close-up.png"),
        label: "Texture",
        badge: "30ml Serum",
        desc: "Crystal hydrogel texture with 30 ml of serum per mask",
      },
      {
        url: mediaUrl("/seaweed-collagen-crystal-mask/seaweed-collagen-crystal-hydration-mask-luxury-spa-pedestal.png"),
        label: "Pedestal",
        badge: "Featured",
        desc: "Hydrogel mask presentation for a hydration-focused skincare ritual",
      },
    ],
  },
  {
    id: "womens-plush-soft-robe",
    name: "Women's Plush Button-Front Robe",
    tagline: "A soft, easy layer for slow mornings and after-bath comfort.",
    description: "A women's long-sleeve robe in soft polyester fleece, with a button-front closure and two pockets. It has no belt or hood. Available colors and sizes depend on stock; compare the garment measurements below with a robe that fits you well before choosing.",
    price: 179.99,
    compareAtPrice: 179.99,
    currency: "PLN",
    image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sefed303fa94745a180d7987ac6195bc8q.webp?v=1793541274",
    imageAlt: "Plush women's button-front robe shown in three colors",
    badge: "Soft fleece",
    benefits: [
      "Soft 100% polyester fleece",
      "Button-front design with long sleeves",
      "Two practical front pockets",
      "A relaxed layer for home, after a bath or on a cool morning",
    ],
    howToUse: [
      "Compare the size chart measurements with a robe that fits you comfortably",
      "Choose the color and available size that suit you",
      "Follow the care instructions on the product label",
    ],
    faq: [
      { q: "How do I choose a size?", a: "Compare the listed garment measurements with a robe you already own. L measures 105 cm in length, 110 cm bust circumference, 42 cm at the shoulder and 52 cm for the sleeve. XL (supplier label 1XL) measures 108 cm, 120 cm, 44 cm and 54 cm respectively." },
      { q: "Does the robe have a belt or hood?", a: "No. It fastens at the front with buttons and has two pockets; it has no belt or hood." },
      { q: "What is the fabric?", a: "The robe is made from 100% polyester. Follow the care instructions on its label." },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722700915036:1",
    category: "fashion",
    variantPickerLabel: "Color",
    selectedVariantPickerLabel: "Selected color",
    variants: [
      {
        id: "pink",
        label: "Pink",
        colorName: "Pink",
        swatchHex: "#d9a0b2",
        image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd39963c6244143a79b999d4d9fc214e29.webp?v=1793541274",
        imageAlt: "Pink plush button-front robe",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722700915036:1",
        sizes: [
          { id: "xl", label: "XL", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722700915036:1", supportingText: "108 cm length · 120 cm bust · 44 cm shoulder · 54 cm sleeve" },
        ],
      },
      {
        id: "blue",
        label: "Blue",
        colorName: "Blue",
        swatchHex: "#8095ae",
        image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S2ec40ef22d8e4abf865c7d56a3758010d.webp?v=1793541275",
        imageAlt: "Blue plush button-front robe",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722701046108:1",
        sizes: [
          { id: "l", label: "L", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722701046108:1", supportingText: "105 cm length · 110 cm bust · 42 cm shoulder · 52 cm sleeve" },
          { id: "xl", label: "XL", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722700947804:1", supportingText: "108 cm length · 120 cm bust · 44 cm shoulder · 54 cm sleeve" },
        ],
      },
      {
        id: "green",
        label: "Green",
        colorName: "Green",
        swatchHex: "#82937e",
        image: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Se503b1169b1b4f29a13914891223610bh.webp?v=1793541275",
        imageAlt: "Green plush button-front robe",
        shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722701078876:1",
        sizes: [
          { id: "l", label: "L", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722701078876:1", supportingText: "105 cm length · 110 cm bust · 42 cm shoulder · 52 cm sleeve" },
          { id: "xl", label: "XL", shopifyUrl: "https://imp082-pj.myshopify.com/cart/59722700980572:1", supportingText: "108 cm length · 120 cm bust · 44 cm shoulder · 54 cm sleeve" },
        ],
      },
    ],
    gallery: [
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sefed303fa94745a180d7987ac6195bc8q.webp?v=1793541274", label: "Three colors", badge: "Color options", desc: "Button-front robe shown in the three available colors" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sc6c1906a213c4450b8439454c5731097s.webp?v=1793541275", label: "Collar detail", badge: "Soft fleece", desc: "Close-up of the robe's collar and soft fleece fabric" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S216c04b168654237bfc12109c42a20b2N.webp?v=1793541275", label: "Button detail", badge: "Front closure", desc: "Close-up of the front button closure" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Sd39963c6244143a79b999d4d9fc214e29.webp?v=1793541274", label: "Pink", badge: "Color option", desc: "Pink button-front robe" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/S2ec40ef22d8e4abf865c7d56a3758010d.webp?v=1793541275", label: "Blue", badge: "Color option", desc: "Blue button-front robe" },
      { url: "https://cdn.shopify.com/s/files/1/1055/0132/7708/files/Se503b1169b1b4f29a13914891223610bh.webp?v=1793541275", label: "Green", badge: "Color option", desc: "Green button-front robe" },
    ],
  },

  {
    id: "floral-grace-maxi-dress",
    name: "Floral Grace Maxi Dress",
    tagline: "A defined waist, sweeping floral skirt and 14 supplier-confirmed style options.",
    description:
      "An ankle-length maxi dress with a clean neckline, defined high waist and a flowing A-line skirt. Choose from 14 print and sleeve combinations, then select your size from S to 5XL.",
    // All 112 Shopify variants verified at 229.99 PLN on 2026-10-03.
    price: 229.99,
    compareAtPrice: 229.99,
    currency: "PLN",
    image: "/dress/variants/green-short.webp",
    imageAlt: "Floral Grace maxi dress in the turquoise floral short-sleeve variant",
    badge: "New",
    benefits: [
      "Fourteen supplier-confirmed print and sleeve combinations",
      "Clean neckline and fitted upper line keep the silhouette polished",
      "Wide high waistband visually defines the waist",
      "Flowing ankle-length A-line skirt adds movement without a bulky silhouette",
      "Short- and long-sleeve options for year-round styling",
      "Available in sizes S–5XL across every style",
    ],
    howToUse: [
      "Choose the print and sleeve length that best suits the occasion",
      "Choose your usual size and review the product details before checkout",
      "Keep accessories simple and let the floral skirt lead the look",
      "Follow the sewn-in care label before washing or ironing",
    ],
    faq: [
      {
        q: "Which styles are available?",
        a: "Choose from 14 supplier-confirmed combinations covering green, red, pink, white, black, polka-dot and multicolor prints with short or long sleeves.",
      },
      {
        q: "Which sizes are available?",
        a: "The dress is available in sizes S, M, L, XL, 2XL, 3XL, 4XL and 5XL in every style.",
      },
      {
        q: "How should I care for the dress?",
        a: "Always follow the sewn-in care label and check its washing and ironing symbols before the first wash.",
      },
    ],
    category: "fashion",
    isNew: true,
    purchaseStatus: "available",
    variantPickerLabel: "Choose style",
    selectedVariantPickerLabel: "Selected style",
    rating: { value: 4.9, count: 155 },
    reviews: [
      {
        id: "supplier-review-fangge-cx-xxl",
        author: "L***o",
        rating: 5,
        body:
          "I ordered one size up, but I think my usual size would have been right because this one is a little small. Order your usual size. The fabric feels nice, the color is beautiful, and it is not see-through.",
        date: "2026-04-08",
        source: "AliExpress customer",
        color: "Multicolor stripe",
        size: "XXL",
        helpfulCount: 0,
      },
      {
        id: "supplier-review-pink-xl",
        author: "Anonymous customer",
        rating: 5,
        body:
          "I am very happy with this dress. The fabric can be washed, dries quickly and does not need ironing. Size XL is not tight across my 98 cm bust. I am thinking about buying another one in a different color.",
        date: "2026-05-17",
        source: "AliExpress customer",
        color: "Pink floral",
        size: "XL",
        helpfulCount: 0,
      },
      {
        id: "supplier-review-black-s",
        author: "Anonymous customer",
        rating: 5,
        body:
          "I liked it—a beautiful dress. The material is good and excellent for the price. I fully recommend it. The size fits me perfectly; if you prefer a closer fit, you can order a smaller size, but it is beautiful. I plan to order more.",
        date: "2025-10-18",
        source: "AliExpress customer",
        color: "Tropical floral",
        size: "S",
        helpfulCount: 1,
      },
      {
        id: "supplier-review-bodian-m",
        author: "Anonymous customer",
        rating: 5,
        body:
          "The dress is made from cool-feeling, stretchy material. It fits the body very well and looks lovely.",
        date: "2025-10-02",
        source: "AliExpress customer",
        color: "Polka dot",
        size: "M",
        helpfulCount: 2,
      },
      {
        id: "supplier-review-red-l",
        author: "Anonymous customer",
        rating: 5,
        body:
          "Perfect and very beautiful. I highly recommend it. The material is very good—ten out of ten.",
        date: "2026-03-16",
        source: "AliExpress customer",
        color: "Red floral",
        size: "L",
        helpfulCount: 0,
      },
    ],
    shopifyUrl: "https://imp082-pj.myshopify.com/cart/59112652800348:1",
    variants: [
      floralGraceVariant({
        id: "green-short",
        label: "Green short",
        styleFamily: "Green floral",
        sleeveLength: "short",
        swatchHex: "#16977f",
        swatchBorderHex: "#75d7c2",
        image: "/dress/variants/green-short.webp",
        variantIds: ["59112652800348", "59112652833116", "59112652865884", "59112652898652", "59112652931420", "59112652964188", "59338827006300", "59338827039068"],
      }),
      floralGraceVariant({
        id: "red-long",
        label: "Red long",
        styleFamily: "Red floral",
        sleeveLength: "long",
        swatchHex: "#b51f35",
        swatchBorderHex: "#e28b96",
        image: "/dress/variants/red-long.webp",
        variantIds: ["59338827071836", "59338827104604", "59338827137372", "59338827170140", "59338827202908", "59338827235676", "59338827268444", "59338827301212"],
      }),
      floralGraceVariant({
        id: "red-short",
        label: "Red short",
        styleFamily: "Red floral",
        sleeveLength: "short",
        swatchHex: "#c3283f",
        swatchBorderHex: "#ef9aa5",
        image: "/dress/variants/red-short.webp",
        variantIds: ["59338827333980", "59338827366748", "59338827399516", "59338827432284", "59338827465052", "59338827497820", "59338827530588", "59338827563356"],
      }),
      floralGraceVariant({
        id: "bodian-short",
        label: "Bodian short",
        styleFamily: "Polka dot",
        sleeveLength: "short",
        swatchHex: "#171717",
        swatchBorderHex: "#d5d1ca",
        image: "/dress/variants/bodian-short.webp",
        variantIds: ["59338827596124", "59338827628892", "59338827661660", "59338827694428", "59338827727196", "59338827759964", "59338827792732", "59338827825500"],
      }),
      floralGraceVariant({
        id: "pink-short",
        label: "Pink short",
        styleFamily: "Pink floral",
        sleeveLength: "short",
        swatchHex: "#d899a7",
        swatchBorderHex: "#efc5ce",
        image: "/dress/variants/pink-short.webp",
        variantIds: ["59112652407132", "59112652439900", "59112652472668", "59112652505436", "59112652538204", "59112652570972", "59338827858268", "59338827891036"],
      }),
      floralGraceVariant({
        id: "white-long",
        label: "White long",
        styleFamily: "White floral",
        sleeveLength: "long",
        swatchHex: "#f3efe7",
        swatchBorderHex: "#aaa399",
        image: "/dress/variants/white-long.webp",
        variantIds: ["59112652996956", "59112653029724", "59112653062492", "59112653095260", "59112653128028", "59112653160796", "59338827923804", "59338827956572"],
      }),
      floralGraceVariant({
        id: "black-short",
        label: "Black short",
        styleFamily: "Tropical floral",
        sleeveLength: "short",
        swatchHex: "linear-gradient(135deg, #0d513f 0 45%, #d7333f 45% 75%, #e0ad31 75%)",
        swatchBorderHex: "#5fa78f",
        image: "/dress/variants/black-short.webp",
        variantIds: ["59112652603740", "59112652636508", "59112652669276", "59112652702044", "59112652734812", "59112652767580", "59338827989340", "59338828022108"],
      }),
      floralGraceVariant({
        id: "white-short",
        label: "White short",
        styleFamily: "White floral",
        sleeveLength: "short",
        swatchHex: "#fffaf1",
        swatchBorderHex: "#b5aea3",
        image: "/dress/variants/white-short.webp",
        variantIds: ["59338828054876", "59338828087644", "59338828120412", "59338828153180", "59338828185948", "59338828218716", "59338828251484", "59338828284252"],
      }),
      floralGraceVariant({
        id: "pink-long",
        label: "Pink long",
        styleFamily: "Pink floral",
        sleeveLength: "long",
        swatchHex: "#cf7f91",
        swatchBorderHex: "#eab8c3",
        image: "/dress/variants/pink-long.webp",
        variantIds: ["59338828317020", "59338828349788", "59338828382556", "59338828415324", "59338828448092", "59338828480860", "59338828513628", "59338828546396"],
      }),
      floralGraceVariant({
        id: "green-long",
        label: "Green long",
        styleFamily: "Green floral",
        sleeveLength: "long",
        swatchHex: "#0d826d",
        swatchBorderHex: "#66c8b3",
        image: "/dress/variants/green-long.webp",
        variantIds: ["59338828579164", "59338828611932", "59338828644700", "59338828677468", "59338828710236", "59338828743004", "59338828775772", "59338828808540"],
      }),
      floralGraceVariant({
        id: "bodian-long",
        label: "Bodian long",
        styleFamily: "Polka dot",
        sleeveLength: "long",
        swatchHex: "#26262a",
        swatchBorderHex: "#dad6cf",
        image: "/dress/variants/bodian-long.webp",
        variantIds: ["59338828841308", "59338828874076", "59338828906844", "59338828939612", "59338828972380", "59338829005148", "59338829037916", "59338829070684"],
      }),
      floralGraceVariant({
        id: "fangge-cx-long",
        label: "Fangge-CX long",
        styleFamily: "Multicolor stripe",
        sleeveLength: "long",
        swatchHex: "linear-gradient(135deg, #b52636 0 25%, #d7a941 25% 50%, #1b826f 50% 75%, #171719 75%)",
        swatchBorderHex: "#c7aa6c",
        image: "/dress/variants/fangge-cx-long.webp",
        variantIds: ["59338829103452", "59338829136220", "59338829168988", "59338829201756", "59338829234524", "59338829267292", "59338829300060", "59338829332828"],
      }),
      floralGraceVariant({
        id: "fangge-cx-short",
        label: "Fangge-CX short",
        styleFamily: "Multicolor stripe",
        sleeveLength: "short",
        swatchHex: "linear-gradient(135deg, #b52636 0 25%, #d7a941 25% 50%, #1b826f 50% 75%, #171719 75%)",
        swatchBorderHex: "#d1b574",
        image: "/dress/variants/fangge-cx-short.webp",
        variantIds: ["59338829365596", "59338829398364", "59338829431132", "59338829463900", "59338829496668", "59338829529436", "59338829562204", "59338829594972"],
      }),
      floralGraceVariant({
        id: "black-long",
        label: "Black long",
        styleFamily: "Tropical floral",
        sleeveLength: "long",
        swatchHex: "linear-gradient(135deg, #0d513f 0 45%, #d7333f 45% 75%, #e0ad31 75%)",
        swatchBorderHex: "#5fa78f",
        image: "/dress/variants/black-long.webp",
        variantIds: ["59338829627740", "59338829660508", "59338829693276", "59338829726044", "59338829758812", "59338829791580", "59338829824348", "59338829857116"],
      }),
    ],
    gallery: [
      {
        url: "/dress/variants/green-short.webp",
        label: "Green floral",
        badge: "Short sleeve",
        desc: "Green short",
      },
      {
        url: "/dress/variants/green-long.webp",
        label: "Green floral",
        badge: "Long sleeve",
        desc: "Green long",
      },
      {
        url: "/dress/variants/red-short.webp",
        label: "Red floral",
        badge: "Short sleeve",
        desc: "Red short",
      },
      {
        url: "/dress/variants/red-long.webp",
        label: "Red floral",
        badge: "Long sleeve",
        desc: "Red long",
      },
      {
        url: "/dress/variants/pink-short.webp",
        label: "Pink floral",
        badge: "Short sleeve",
        desc: "Pink short",
      },
      {
        url: "/dress/variants/pink-long.webp",
        label: "Pink floral",
        badge: "Long sleeve",
        desc: "Pink long",
      },
      {
        url: "/dress/variants/white-short.webp",
        label: "White floral",
        badge: "Short sleeve",
        desc: "White short",
      },
      {
        url: "/dress/variants/white-long.webp",
        label: "White long",
        badge: "Long sleeve",
        desc: "White long",
      },
      {
        url: "/dress/variants/bodian-short.webp",
        label: "Polka dot",
        badge: "Short sleeve",
        desc: "Bodian short",
      },
      {
        url: "/dress/variants/bodian-long.webp",
        label: "Polka dot",
        badge: "Long sleeve",
        desc: "Bodian long",
      },
      {
        url: "/dress/variants/fangge-cx-short.webp",
        label: "Multicolor stripe",
        badge: "Short sleeve",
        desc: "Fangge-CX short",
      },
      {
        url: "/dress/variants/fangge-cx-long.webp",
        label: "Multicolor stripe",
        badge: "Long sleeve",
        desc: "Fangge-CX long",
      },
      {
        url: "/dress/variants/black-short.webp",
        label: "Tropical floral",
        badge: "Short sleeve",
        desc: "Black short",
      },
      {
        url: "/dress/variants/black-long.webp",
        label: "Tropical floral",
        badge: "Long sleeve",
        desc: "Black long",
      },
    ],
  },
];

function snapshotForUrl(url?: string) {
  const variantId = url ? getShopifyVariantFromUrl(url)?.variantId : null;
  return variantId ? shopifyPriceSnapshot[variantId] : undefined;
}

export const shopProducts: ShopProduct[] = catalogProducts.map((product) => {
  const defaultUrl = product.sizes?.[0]?.shopifyUrl ?? product.shopifyUrl;
  return {
    ...product,
    ...snapshotForUrl(defaultUrl),
    shopifyUrl: defaultUrl,
    sizes: product.sizes?.map((size) => ({ ...size, ...snapshotForUrl(size.shopifyUrl) })),
    variants: product.variants?.map((variant) => ({
      ...variant,
      ...snapshotForUrl(variant.shopifyUrl),
      sizes: variant.sizes?.map((size) => ({ ...size, ...snapshotForUrl(size.shopifyUrl) })),
    })),
  };
});

export function getShopProductById(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id);
}

export function getShopifyCheckoutRoute(productId: string) {
  return `/api/shopify-checkout/${encodeURIComponent(productId)}`;
}

export function getShopifyVariant(product: Pick<ShopProduct, "shopifyUrl">) {
  if (!product.shopifyUrl) return null;
  return getShopifyVariantFromUrl(product.shopifyUrl);
}

export function getShopifyVariantFromUrl(value: string) {
  const url = new URL(value);
  const match = url.pathname.match(/^\/cart\/(\d+):\d+$/);

  if (url.hostname !== "imp082-pj.myshopify.com" || !match) {
    return null;
  }

  return {
    storeOrigin: url.origin,
    variantId: match[1],
  };
}
