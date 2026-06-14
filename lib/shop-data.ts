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
  flashSaleEndsAt?: string; // ISO date — real countdown, not looping
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53918490689869:1",
    category: "skincare",
    isBestSeller: true,
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53954300772685:1",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53918490820941:1",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53944188174669:1",
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
  {
    id: "bian-stone-gua-sha",
    name: "Black Bian Stone Gua Sha Stick",
    tagline: "Sculpt your jawline. Release tension. Reveal younger-looking skin.",
    description:
      "Carved from authentic volcanic Bian Stone — one of the rarest healing stones in the world — this gua sha stick emits far-infrared rays and natural negative ions that boost circulation and collagen from within. Designed for women 40+ who want visible facial sculpting results without needles or clinic visits.",
    price: 34.99,
    compareAtPrice: 59.99,
    currency: "EUR",
    image: "/Black_Bian_Stone_Gua_Sha_Stick.png",
    imageAlt: "Black Bian Stone Gua Sha facial massage stick on dark marble surface",
    badge: "🖤 Rarest Stone",
    rating: 4.9,
    reviews: "1 089",
    benefits: [
      "Emits far-infrared rays — boosts circulation 3× more than regular jade tools",
      "Natural negative ions reduce inflammation and accelerate skin renewal",
      "Sculpts jawline, cheekbones & brow bone in one 5-minute ritual",
      "Depuffs instantly — cool in fridge for maximum morning de-puff",
      "Boosts serum absorption up to 300% deeper",
      "Ultra-smooth volcanic stone — glides without pulling or dragging",
    ],
    howToUse: [
      "Apply your favourite facial oil or serum to clean skin",
      "Hold the stick flat against skin at a 15° angle",
      "Glide in firm upward strokes along jawline, cheeks and forehead",
      "Use the pointed end for brow bone and under-eye area",
      "5–10 minutes daily — results visible from week 2",
    ],
    faq: [
      {
        q: "What makes Bian Stone different from jade or rose quartz?",
        a: "Bian Stone is a volcanic mineral that emits far-infrared rays and natural negative ions — properties not found in jade or quartz. This means it actively stimulates circulation and collagen, rather than just massaging the surface.",
      },
      {
        q: "How often should I use it?",
        a: "Daily use is safe and recommended. 5 minutes in the morning (after storing overnight in the fridge) gives the best de-puffing results. 3–4 evenings per week for sculpting.",
      },
      {
        q: "Is it suitable for sensitive skin?",
        a: "Yes. The smooth polished stone surface is gentle and non-abrasive. Always use with a facial oil — never drag dry skin.",
      },
    ],
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/53955987276109:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/Black_Bian_Stone_Gua_Sha_Stick.png",
        label: "Volcanic Stone",
        badge: "Bian Stone",
        desc: "Authentic black volcanic Bian Stone gua sha stick — hand-polished to a flawless finish",
      },
      {
        url: "/Black_Bian_Stone_Gua_Sha_Stick_close.png",
        label: "Stone Texture",
        badge: "Far-Infrared",
        desc: "Natural mineral matrix emitting far-infrared rays and negative ions for deep skin renewal",
      },
      {
        url: "/Black_Bian_Stone_Gua_Sha_Stick_lifestyle.png",
        label: "Morning Ritual",
        badge: "5-Min Ritual",
        desc: "Sculpting and depuffing facial massage ritual designed for women 40+",
      },
    ],
  },

  // ── AliExpress sourced, high-margin products ──────────────────────────────

  {
    id: "vibro-glow-face-massager",
    name: "Vibro-Glow Face Massager",
    tagline: "Salon-grade micro-vibration therapy — at home, in 5 minutes.",
    description:
      "A pocket-sized T-bar vibrating massager that delivers 6,000 micro-vibrations per minute directly into facial muscles. Promotes lymphatic drainage, reduces puffiness, and boosts serum absorption up to 3× — the secret behind glass skin without a salon appointment.",
    price: 59.99,
    compareAtPrice: 99.99,
    currency: "EUR",
    image: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-main-product-photo.png",
    imageAlt: "Mini vibrating T-bar face massager for lymphatic drainage and glow",
    badge: "⚡ Viral Beauty Tool",
    rating: 4.9,
    reviews: "5 200",
    benefits: [
      "6,000 micro-vibrations/min for deep lymphatic stimulation",
      "Reduces morning puffiness in under 3 minutes",
      "Boosts serum and moisturiser absorption by 3×",
      "Promotes circulation for an instant healthy glow",
      "Lightweight T-bar shape — fits every contour of the face",
      "USB rechargeable — works without lotion or serum",
    ],
    howToUse: [
      "Charge fully before first use",
      "Apply your favourite facial oil or serum to clean skin",
      "Glide the T-bar in upward strokes from neck to forehead",
      "Vibrate gently over brow bone and under-eye for de-puffing",
      "5 minutes daily gives visible results within 2 weeks",
    ],
    faq: [
      {
        q: "Is it safe for sensitive skin?",
        a: "Yes. The smooth metal head is dermatologist-safe. Always use with a serum or oil — never on completely dry skin.",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092710314317:1",
    category: "skincare",
    isBestSeller: true,
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
    gallery: [
      {
        url: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-main-product-photo.png",
        label: "Product Photo",
        badge: "⚡ Viral Tool",
        desc: "Pocket-sized T-bar vibrating massager delivering 6,000 micro-vibrations per minute",
      },
      {
        url: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-luxury-skincare-flat-lay.png",
        label: "Flat Lay",
        badge: "Premium",
        desc: "Luxury skincare flat lay — the perfect addition to your glow ritual",
      },
      {
        url: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-premium-pedestal-angle-view.png",
        label: "Angle View",
        badge: "Design",
        desc: "Premium pedestal angle view showcasing the elegant T-bar form factor",
      },
      {
        url: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-lifestyle-cheek-use.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Gliding along the cheekbone for instant lymphatic drainage and sculpting",
      },
      {
        url: "/Vibro-Glow_Face_Massager-images/vibro-glow-face-massager-under-eye-close-up.png",
        label: "Under-Eye",
        badge: "De-Puff",
        desc: "Targeting the under-eye area to reduce morning puffiness in under 3 minutes",
      },
    ],
  },

  {
    id: "centella-collagen-sleep-masks",
    name: "Centella Collagen Sleep Masks (30pcs)",
    tagline: "Wake up to visibly firmer, plumper skin — every single morning.",
    description:
      "30 ultra-thin overnight sleeping masks infused with Centella Asiatica extract, marine collagen, and hyaluronic acid. Apply as the last step in your evening routine — no rinsing needed. While you sleep, the bio-cellulose sheet locks moisture in for 8 hours, visibly reducing fine lines by morning.",
    price: 24.99,
    compareAtPrice: 42.99,
    currency: "EUR",
    image: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-main-product-photo.png",
    imageAlt: "Centella Collagen Sleeping Face Masks in luxury packaging",
    badge: "🌿 Overnight Repair",
    rating: 4.9,
    reviews: "5 100",
    benefits: [
      "30 overnight treatments — full month of skin renewal",
      "Centella Asiatica reduces redness and repairs skin barrier",
      "Marine collagen visibly firms and plumps fine lines overnight",
      "Hyaluronic acid locks in 8 hours of deep hydration",
      "No-rinse formula — apply and sleep",
      "Fragrance-free, paraben-free, dermatologist-tested",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092716933453:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-main-product-photo.png",
        label: "Product Photo",
        badge: "🌿 Overnight Repair",
        desc: "30 ultra-thin overnight sleeping masks infused with Centella Asiatica and marine collagen",
      },
      {
        url: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-luxury-skincare-flat-lay.png",
        label: "Flat Lay",
        badge: "Luxury",
        desc: "Elegant luxury skincare flat lay — 30 nights of visible skin renewal",
      },
      {
        url: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-night-routine-lifestyle.png",
        label: "Night Routine",
        badge: "Lifestyle",
        desc: "The perfect final step in your evening skincare routine — apply and sleep",
      },
      {
        url: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-open-sachet-gel-texture.png",
        label: "Gel Texture",
        badge: "Formula",
        desc: "Rich, silky gel texture packed with Centella Asiatica and hyaluronic acid",
      },
      {
        url: "/centella-collagen-sleep-masks-product-images/centella-collagen-sleep-masks-single-sachet-close-up.png",
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
    price: 27.99,
    compareAtPrice: 49.99,
    currency: "EUR",
    image: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-main-product-photo.png",
    imageAlt: "Vitamin C brightening serum and retinol night serum skincare duo",
    badge: "☀️ AM + PM System",
    rating: 4.8,
    reviews: "512",
    benefits: [
      "Vitamin C serum fades dark spots and brightens complexion",
      "Retinol night serum renews skin cells and boosts collagen",
      "Complete AM + PM anti-aging ritual in one duo",
      "Lightweight, fast-absorbing formula — no greasy residue",
      "Fragrance-free — suitable for reactive and sensitive skin",
      "Visible brightening results in 4 weeks of daily use",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092721455437:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-main-product-photo.png",
        label: "Product Photo",
        badge: "☀️ AM + PM",
        desc: "Complete two-serum system — Vitamin C by day, Retinol by night",
      },
      {
        url: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-am-pm-flat-lay.png",
        label: "AM + PM",
        badge: "Full Ritual",
        desc: "Day and night flat lay — the complete anti-aging skincare ritual in one duo",
      },
      {
        url: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-bathroom-vanity-lifestyle.png",
        label: "Vanity",
        badge: "Lifestyle",
        desc: "A premium bathroom vanity essential — brightening by day, renewing by night",
      },
      {
        url: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-dropper-texture-close-up.png",
        label: "Formula",
        badge: "Lightweight",
        desc: "Lightweight, fast-absorbing dropper formula — no greasy residue, pure actives",
      },
      {
        url: "/vitamin-c-retinol-serum-duo-product-images/vitamin-c-retinol-serum-duo-luxury-spa-pedestal.png",
        label: "Luxury",
        badge: "Premium",
        desc: "Elegant pedestal presentation of the premium Vitamin C and Retinol duo",
      },
    ],
  },

  {
    id: "resin-body-gua-sha-tool",
    name: "Resin Body Gua Sha Lymph Tool",
    tagline: "Sculpt your body. Drain lymph. Beat cellulite. At home.",
    description:
      "A large-format resin gua sha board designed specifically for the body — inner thighs, arms, stomach, and calves. The curved ergonomic shape reaches every contour to stimulate lymphatic drainage, break up fascial adhesions, and visibly reduce the appearance of cellulite with consistent use.",
    price: 22.99,
    compareAtPrice: 39.99,
    currency: "EUR",
    image: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-main-product-photo.png",
    imageAlt: "Large resin body gua sha scraping tool for lymphatic drainage and cellulite",
    badge: "💪 Body Sculpt",
    rating: 4.9,
    reviews: "3 000",
    benefits: [
      "Large surface area covers thighs, arms and abdomen in one stroke",
      "Stimulates lymphatic drainage to reduce water retention",
      "Breaks up fascial adhesions that contribute to cellulite",
      "Increases blood circulation for smoother, firmer skin texture",
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
        q: "How long until cellulite improves?",
        a: "With consistent use 3–4 times per week, most users notice softer, smoother skin texture within 3–4 weeks.",
      },
      {
        q: "Can I use it on my face?",
        a: "This tool is designed for the body. For facial gua sha, use our Rose Quartz Gua Sha Set or Black Bian Stone Gua Sha Stick.",
      },
    ],
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092726501709:1",
    category: "body-glow",
    isNew: true,
    gallery: [
      {
        url: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-main-product-photo.png",
        label: "Product Photo",
        badge: "💪 Body Sculpt",
        desc: "Large-format resin gua sha board designed for body lymphatic drainage",
      },
      {
        url: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-body-care-flat-lay.png",
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Complete body care flat lay — the ultimate cellulite and sculpting routine",
      },
      {
        url: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-body-massage-lifestyle.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Firm upward strokes along the thigh — targeting cellulite and lymphatic flow",
      },
      {
        url: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-ergonomic-hand-grip.png",
        label: "Grip",
        badge: "Ergonomic",
        desc: "Ergonomic hand grip — secure hold even with body oil on hands",
      },
      {
        url: "/body-gua-sha-lymph-tool-product-images/resin-body-gua-sha-lymph-tool-luxury-spa-pedestal.png",
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
    price: 19.99,
    compareAtPrice: 34.99,
    currency: "EUR",
    image: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-main-product-photo.png",
    imageAlt: "Natural bristle body spa brush with detachable long wooden handle",
    badge: "🌿 Dry Brush Favourite",
    rating: 4.9,
    reviews: "1 050",
    benefits: [
      "Natural stiff bristles for effective dry or wet exfoliation",
      "Detachable long handle reaches the entire back effortlessly",
      "Stimulates lymphatic drainage when used dry before showering",
      "Unclogs pores and removes dead skin cells in one session",
      "Leaves skin ready to absorb body lotion 3× more effectively",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092769034573:1",
    category: "body-glow",
    isNew: true,
    gallery: [
      {
        url: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-main-product-photo.png",
        label: "Product Photo",
        badge: "🌿 Dry Brush",
        desc: "Professional-grade natural bristle back and body brush with detachable wooden handle",
      },
      {
        url: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-body-care-flat-lay.png",
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Complete dry brushing ritual flat lay — the foundation of every body-glow routine",
      },
      {
        url: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-back-massage-lifestyle.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Long handle reaches the entire back effortlessly for a full spa treatment at home",
      },
      {
        url: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-bristle-close-up.png",
        label: "Bristles",
        badge: "Natural",
        desc: "Natural stiff plant-fibre bristles — effective dry or wet exfoliation without scratching",
      },
      {
        url: "/natural-bristle-spa-body-brush-product-images/natural-bristle-spa-body-brush-luxury-spa-pedestal.png",
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
    price: 16.99,
    compareAtPrice: 29.99,
    currency: "EUR",
    image: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-main-product-photo.png",
    imageAlt: "Soft natural bristle exfoliating spa body brush for shower use",
    badge: "🚿 Daily Glow",
    rating: 4.9,
    reviews: "10 000",
    benefits: [
      "Soft-medium natural bristles — gentle enough for daily use",
      "Deeply cleanses pores and removes dead skin cells",
      "Stimulates circulation for a flushed, glowing complexion",
      "Wrist strap for secure grip during shower use",
      "Works with or without body wash or soap",
      "10,000+ sold — the most loved body brush in the collection",
    ],
    howToUse: [
      "Wet brush and skin thoroughly in the shower",
      "Apply body wash or use the brush alone",
      "Use circular motions on stomach and thighs for cellulite areas",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092780699981:1",
    category: "body-glow",
    isBestSeller: true,
    flashSaleEndsAt: "2026-06-30T23:59:59Z",
    gallery: [
      {
        url: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-main-product-photo.png",
        label: "Product Photo",
        badge: "🚿 Daily Glow",
        desc: "Soft natural bristle exfoliating spa body brush — gentle enough for daily use",
      },
      {
        url: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-body-care-flat-lay.png",
        label: "Flat Lay",
        badge: "Body Care",
        desc: "Daily body care flat lay — the secret to glowing skin after every shower",
      },
      {
        url: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-body-exfoliation-lifestyle.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Circular motions in the shower — visibly transforming skin texture in 2 weeks",
      },
      {
        url: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-hand-strap-close-up.png",
        label: "Wrist Strap",
        badge: "Secure Grip",
        desc: "Built-in wrist strap for a secure, comfortable grip during wet shower use",
      },
      {
        url: "/exfoliating-spa-body-brush-product-images/exfoliating-spa-body-brush-luxury-spa-pedestal.png",
        label: "Pedestal",
        badge: "10K+ Sold",
        desc: "The most loved body brush in the collection — over 10,000 sold",
      },
    ],
  },

  {
    id: "ice-face-roller-gua-sha-set",
    name: "Ice Face Roller & Gua Sha Steel Set",
    tagline: "Chill. Sculpt. Glow. The 60-second morning de-puff ritual.",
    description:
      "A premium 2-piece set combining a stainless steel ice face roller and a matching gua sha board. Chill in the freezer overnight and use in the morning to instantly de-puff eyes, reduce redness, tighten pores, and sculpt facial contours — all in under 60 seconds.",
    price: 18.99,
    compareAtPrice: 32.99,
    currency: "EUR",
    image: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-main-product-photo.png",
    imageAlt: "Stainless steel ice face roller and gua sha board set for de-puffing",
    badge: "❄️ Cool & Sculpt",
    rating: 4.6,
    reviews: "4 000",
    benefits: [
      "Stainless steel stays cold 3× longer than stone or plastic tools",
      "Instant de-puffing — visible results after the first use",
      "Tightens pores by constricting surface capillaries with cold",
      "Reduces redness and inflammation in minutes",
      "Gua sha board sculpts jawline and cheekbones",
      "4,000+ sold — cult morning skincare tool",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092785549645:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-main-product-photo.png",
        label: "Product Photo",
        badge: "❄️ Cool & Sculpt",
        desc: "Premium stainless steel ice roller and gua sha board — the 60-second morning ritual",
      },
      {
        url: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-flat-lay.png",
        label: "Flat Lay",
        badge: "Steel Set",
        desc: "Matching stainless steel duo — chill overnight for maximum de-puffing power",
      },
      {
        url: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-lifestyle-usage.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Rolling from neck to forehead — instant de-puffing and pore tightening in seconds",
      },
      {
        url: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-luxury-spa-pedestal.png",
        label: "Pedestal",
        badge: "Premium",
        desc: "Luxury spa pedestal display — premium stainless steel craftsmanship",
      },
      {
        url: "/ice-face-roller-gua-sha-steel-set-product-images/ice-face-roller-gua-sha-steel-set-stainless-steel-close-up.png",
        label: "Steel Detail",
        badge: "Stays Cold 3×",
        desc: "Stainless steel stays cold 3× longer than stone or plastic — superior cooling performance",
      },
    ],
  },

  {
    id: "seaweed-collagen-crystal-mask",
    name: "Seaweed Collagen Crystal Hydration Mask",
    tagline: "5 luxury treatments. Instant glass skin. No clinic needed.",
    description:
      "5 premium crystal hydrogel masks infused with seaweed extract and marine collagen — the same ingredient used in high-end clinical facials. Each mask delivers 30ml of intensive serum directly into the skin for 20–30 minutes. Instantly plumps, brightens, and firms. TikTok viral formula.",
    price: 29.99,
    compareAtPrice: 52.99,
    currency: "EUR",
    image: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-main-product-photo.png",
    imageAlt: "Premium seaweed collagen crystal hydrogel face mask filling treatment",
    badge: "🌊 Glass Skin",
    rating: 4.8,
    reviews: "1 100",
    benefits: [
      "5 crystal hydrogel masks — 5 complete clinical-style treatments",
      "30ml serum per mask — 10× more than standard sheet masks",
      "Seaweed extract repairs skin barrier and adds luminosity",
      "Marine collagen visibly fills fine lines after a single use",
      "Glass skin effect within 20 minutes — ideal before events",
      "TikTok viral formula — 1,000+ sold this month",
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
        a: "Crystal hydrogel masks contain 10× more serum per mask and adhere much more closely to facial contours, allowing deeper ingredient penetration.",
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
    shopifyUrl: "https://k50k7g-j7.myshopify.com/cart/54092790595917:1",
    category: "skincare",
    isNew: true,
    gallery: [
      {
        url: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-main-product-photo.png",
        label: "Product Photo",
        badge: "🌊 Glass Skin",
        desc: "5 premium crystal hydrogel masks infused with seaweed extract and marine collagen",
      },
      {
        url: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-flat-lay.png",
        label: "Flat Lay",
        badge: "5 Treatments",
        desc: "5 clinical-style treatments in one pack — glass skin effect in 20 minutes",
      },
      {
        url: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-lifestyle-application.png",
        label: "In Use",
        badge: "Lifestyle",
        desc: "Applying the crystal mask for an at-home clinical facial experience",
      },
      {
        url: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-hydrogel-texture-close-up.png",
        label: "Texture",
        badge: "30ml Serum",
        desc: "Crystal hydrogel texture — 30ml of intensive serum per mask, 10× a standard sheet mask",
      },
      {
        url: "/seaweed-collagen-crystal-hydration-mask-product-images/seaweed-collagen-crystal-hydration-mask-luxury-spa-pedestal.png",
        label: "Pedestal",
        badge: "TikTok Viral",
        desc: "TikTok viral formula — luxury spa pedestal display for the glass skin ritual",
      },
    ],
  },
];

export function getShopProductById(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id);
}

export function getShopifyCheckoutRoute(productId: string) {
  return `/api/shopify-checkout/${encodeURIComponent(productId)}`;
}

export function getShopifyVariant(product: ShopProduct) {
  const url = new URL(product.shopifyUrl);
  const match = url.pathname.match(/^\/cart\/(\d+):\d+$/);

  if (url.hostname !== "k50k7g-j7.myshopify.com" || !match) {
    return null;
  }

  return {
    storeOrigin: url.origin,
    variantId: match[1],
  };
}
