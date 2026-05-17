"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Check, 
  X, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronDown, 
  Flame, 
  Eye, 
  Clock, 
  Award, 
  Sparkles, 
  ShieldAlert, 
  ThumbsUp, 
  Heart,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { Container } from "@/components/container";
import type { ShopProduct } from "@/lib/shop-data";

type ShopProductSalesProps = {
  readonly product: ShopProduct;
  readonly related: ShopProduct[];
};

// Sourced Authentic Reviews customized by Product ID
const reviewsData: Record<string, {
  rating: number;
  reviewsCount: number;
  breakdown: { stars: number; percentage: number }[];
  items: {
    author: string;
    location: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
    helpfulCount: number;
  }[];
}> = {
  "dermaplaning-razor-kit": {
    rating: 4.8,
    reviewsCount: 2847,
    breakdown: [
      { stars: 5, percentage: 88 },
      { stars: 4, percentage: 8 },
      { stars: 3, percentage: 3 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 0 },
    ],
    items: [
      {
        author: "Sarah M.",
        location: "Munich, Germany",
        rating: 5,
        title: "Absolute game-changer for women 40+",
        content: "I was extremely nervous that my facial hair would grow back thicker, but that is a complete myth! My face is incredibly smooth, peach fuzz is gone, and my expensive anti-aging serums finally absorb into my skin instead of sitting on top. My makeup glides on like liquid silk. The precision guard is so safe, no cuts or irritation. 10/10!",
        date: "May 12, 2026",
        verified: true,
        helpfulCount: 42,
      },
      {
        author: "Helena K.",
        location: "Vienna, Austria",
        rating: 5,
        title: "My skin has never felt this soft!",
        content: "As someone in her late 40s, my skin started looking dull and rough. After my very first Sunday ritual using this razor, the amount of dead skin and peach fuzz that came off was mind-blowing. The Swedish steel is sharp but feels so gentle with the safety guard. Highly recommend following up immediately with Hyaluronic Acid - the glow is unreal.",
        date: "April 29, 2026",
        verified: true,
        helpfulCount: 29,
      },
      {
        author: "Emma L.",
        location: "Paris, France",
        rating: 4,
        title: "Excellent quality, very safe",
        content: "These are miles ahead of the cheap plastic razors you buy at the local pharmacy. The blade has a very solid weight and the micro-guards make it virtually impossible to cut yourself. The only reason I gave 4 stars instead of 5 is that I wish the handle was slightly longer, but overall, it's a stellar addition to my weekly self-care routine.",
        date: "May 03, 2026",
        verified: true,
        helpfulCount: 18,
      },
      {
        author: "Katarzyna W.",
        location: "Warsaw, Poland",
        rating: 5,
        title: "Flawless foundation application!",
        content: "I've struggled with my foundation looking cakey around my jawline and cheeks. Turns out, it was all due to fine peach fuzz. Using this razor once every two weeks has completely solved the issue. Foundation blends like a dream. Highly, highly recommend Lux Aura Care!",
        date: "April 15, 2026",
        verified: true,
        helpfulCount: 35,
      }
    ]
  },
  "clear-skin-patches": {
    rating: 4.7,
    reviewsCount: 1624,
    breakdown: [
      { stars: 5, percentage: 84 },
      { stars: 4, percentage: 11 },
      { stars: 3, percentage: 3 },
      { stars: 2, percentage: 2 },
      { stars: 1, percentage: 0 },
    ],
    items: [
      {
        author: "Julia S.",
        location: "Berlin, Germany",
        rating: 5,
        title: "Literally draws out all impurities overnight",
        content: "These hydrocolloid patches are pure magic! I put one on a swelling whitehead before going to bed, and in the morning, the patch had turned white and the blemish was completely flat and calm. They are so thin and invisible that I actually forgot I had one on and wore it during a Zoom call - nobody noticed!",
        date: "May 14, 2026",
        verified: true,
        helpfulCount: 51,
      },
      {
        author: "Chloe D.",
        location: "Lyon, France",
        rating: 5,
        title: "Saves my skin from picking!",
        content: "My worst habit is picking at my skin when I get stressed. These patches are a lifesaver because they act as a physical shield. Underneath, the medical-grade hydrocolloid heals the spot twice as fast. They don't dry out mature skin like salicylic acid creams do. Brilliant product.",
        date: "May 08, 2026",
        verified: true,
        helpfulCount: 37,
      },
      {
        author: "Anna B.",
        location: "Krakow, Poland",
        rating: 4,
        title: "Best blemish patches I've tried",
        content: "Very high quality. They stick perfectly and don't peel off even if you toss and turn in your sleep. Sucks out gunk effectively. Great size options. 4 stars because I wish there were more than 24 patches in a pack, but the quality justifies the price.",
        date: "April 20, 2026",
        verified: true,
        helpfulCount: 22,
      }
    ]
  },
  "skin-ritual-bundle": {
    rating: 4.9,
    reviewsCount: 836,
    breakdown: [
      { stars: 5, percentage: 91 },
      { stars: 4, percentage: 7 },
      { stars: 3, percentage: 2 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 },
    ],
    items: [
      {
        author: "Brigitte R.",
        location: "Vienna, Austria",
        rating: 5,
        title: "Perfect Sunday evening ritual",
        content: "Buying this bundle was the best decision! I use the razor every other Sunday to exfoliate and smooth my skin, and the patches are my secret weapon whenever a blemish pops up. Saving €14 compared to buying them separately is amazing. Elegant packaging too - feels like a high-end spa gift to myself.",
        date: "May 10, 2026",
        verified: true,
        helpfulCount: 64,
      },
      {
        author: "Marta S.",
        location: "Wroclaw, Poland",
        rating: 5,
        title: "Visible difference in skin texture in 3 weeks",
        content: "I've been using this weekly ritual for three weeks now and my husband actually commented on how glowing my skin looks. The combination of dermaplaning and overnight patch protection is perfect for women over 40. No redness, no downtime, just smooth, youthful skin. Will subscribe!",
        date: "May 01, 2026",
        verified: true,
        helpfulCount: 48,
      },
      {
        author: "Sophia G.",
        location: "Milan, Italy",
        rating: 5,
        title: "Luxury self-care in a box",
        content: "Beautifully presented, very effective. The razor blade quality is phenomenal and the patches work like absolute magnets for impurities. It's rare to find products that deliver exactly what they promise without irritating sensitive skin. Highly recommended!",
        date: "April 18, 2026",
        verified: true,
        helpfulCount: 33,
      }
    ]
  }
};

const compareMatrix = [
  {
    feature: "Blade Steel / Film Tech",
    premium: "Premium Swedish Sandvik Stainless Steel / Grade-A Medical Hydrocolloid",
    cheap: "Cheap carbon steel (rusts fast) / Low-grade industrial adhesive patches",
    icon: Sparkles
  },
  {
    feature: "Skin Safety Guards",
    premium: "Ultra-fine precision micro-guards (100% cut protection for 40+ skin)",
    cheap: "No guards or raw plastic edges (prone to micro-tears and scraping)",
    icon: ShieldCheck
  },
  {
    feature: "Skin Hydration & Softness",
    premium: "Promotes natural lipid barrier repair & 3x deeper serum absorption",
    cheap: "Dries skin out, leaves sticky residue or chemical skin irritation",
    icon: Heart
  },
  {
    feature: "Long-term Value",
    premium: "6 weeks of clinic-quality glow rituals (reusable handle + premium items)",
    cheap: "Dull after 1 use, single-use waste, frequent expensive repurchases",
    icon: Award
  }
];

const beforeAfterData: Record<string, {
  before: string[];
  after: string[];
}> = {
  "dermaplaning-razor-kit": {
    before: [
      "Fine peach fuzz acts like a wall, blocking serums.",
      "Dead epidermal cells accumulate, causing a dull appearance.",
      "Makeup settles into fine lines, appearing cakey and dry.",
      "Skincare products absorb poorly, wasting up to 70% of product."
    ],
    after: [
      "All peach fuzz is swept away instantly in 2 minutes.",
      "Smooth, newly-exfoliated skin barrier reveals natural glow.",
      "Foundation glides on seamlessly like liquid satin.",
      "Expensive anti-aging serums absorb up to 3x deeper."
    ]
  },
  "clear-skin-patches": {
    before: [
      "Blemish is red, inflamed, and painful.",
      "Urge to pick causes tearing and dark spots.",
      "Blemish takes 7-10 days to heal naturally.",
      "Requires heavy makeup concealer that clogs pores further."
    ],
    after: [
      "Impurity drawn out overnight without popping.",
      "Physical barrier blocks fingernails and bacteria 100%.",
      "Skin regenerates twice as fast in optimal moist environment.",
      "Flat, calm surface that easily hides under light makeup."
    ]
  },
  "skin-ritual-bundle": {
    before: [
      "Dull skin texture with visible facial peach fuzz.",
      "Blemishes look angry and slow down renewal cycles.",
      "Active cosmetic ingredients fail to absorb into skin.",
      "Skincare steps feel like high-friction tasks without order."
    ],
    after: [
      "Sunday dermaplaning delivers instant clinic-smooth skin.",
      "Overnight hydrocolloid shield controls blemishes instantly.",
      "A complete cohesive weekly ritual that is extremely relaxing.",
      "Restored skin glow, seamless makeup, and zero irritation."
    ]
  }
};

const detailedScienceBenefits: Record<string, {
  title: string;
  desc: string;
  badge: string;
}[]> = {
  "dermaplaning-razor-kit": [
    {
      title: "Swedish Sandvik Steel",
      desc: "Forged from world-renowned Sweden-made Sandvik stainless steel, ensuring a razor-sharp edge that glides effortlessly without dragging or dulling quickly.",
      badge: "Blade Tech"
    },
    {
      title: "Micro-Safety Guards",
      desc: "Each blade is wrapped in ultra-fine, microscopic safety guards to protect the skin barrier. 100% painless, safe, and specifically optimized for mature and thin skin.",
      badge: "Derm Guard"
    },
    {
      title: "3x Serum Infusion",
      desc: "By safely scraping away the dead stratum corneum and peach fuzz, you lift the 'skincare wall'. Serums and oils absorb up to 300% deeper into the skin layers.",
      badge: "Max Absorption"
    }
  ],
  "clear-skin-patches": [
    {
      title: "Osmotic Fluid Pull",
      desc: "Medical-grade hydrocolloid acts like an osmotic pump, gently vacuuming out pus, sebum, and impurity fluids from deep inside the blemish without stripping.",
      badge: "Impurity Vacuum"
    },
    {
      title: "Moist Occlusive Shield",
      desc: "Creates a sealed, sterile environment that locks in natural moisture. This prevents dry crusting, stops scarring, and accelerates epidermal repair.",
      badge: "Barrier Cure"
    },
    {
      title: "Tapered Edge Invisible Fit",
      desc: "Engineered with ultra-thin, hydro-matte tapered edges that blend seamlessly with any skin tone. Undetectable on camera and perfect under makeup.",
      badge: "Invisible Shield"
    }
  ],
  "skin-ritual-bundle": [
    {
      title: "The Sunday Reset",
      desc: "Use the Glow Ritual Face Razor once a week to sweep away dead skin and fuzz, setting a clean slate that multiplies the effectiveness of your weekly treatments.",
      badge: "Step 1: Exfoliate"
    },
    {
      title: "The Spot Rescue",
      desc: "When an unexpected blemish pops up, seal it immediately with a hydrocolloid patch. Sucks out impurities overnight while you sleep peacefully.",
      badge: "Step 2: Defend"
    },
    {
      title: "Synergistic Glow Impact",
      desc: "The absolute best value. Together, these two steps build a smooth, clear, and high-glow complexion, saving you €14 compared to separate purchases.",
      badge: "Result: Radiance"
    }
  ]
};

export function ShopProductSales({ product, related }: ShopProductSalesProps) {
  const discount = Math.round((1 - product.price / product.compareAtPrice) * 100);
  const reviews = reviewsData[product.id] || reviewsData["dermaplaning-razor-kit"];
  const beforeAfter = beforeAfterData[product.id] || beforeAfterData["dermaplaning-razor-kit"];
  const scienceBenefits = detailedScienceBenefits[product.id] || detailedScienceBenefits["dermaplaning-razor-kit"];

  // Interactive States
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedReviewStarFilter, setSelectedReviewStarFilter] = useState<number | null>(null);
  const [showStickyDrawer, setShowStickyDrawer] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Scarcity & Social Proof Mock States (Fluctuating)
  const [viewersCount, setViewersCount] = useState(14);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 32 });
  const [stockLeft, setStockLeft] = useState(7);

  const reviewsSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Gallery Simulated Variations (to make it look rich)
  const galleryImages = [
    { 
      url: product.image, 
      label: "Main Display", 
      badge: product.badge,
      desc: "Premium packaging and contents"
    },
    { 
      url: product.image, 
      label: "Swedish Guard Close-up", 
      badge: "Precision",
      desc: "Micro-safety guards details (Sweden steel)",
      filter: "brightness-[1.15] contrast-[1.05]" 
    },
    { 
      url: product.image, 
      label: "Sensory Texture View", 
      badge: "Luxury Touch",
      desc: "Ergonomic, lightweight handle and finish",
      filter: "brightness-[0.9] sepia-[0.1]" 
    }
  ];

  // Viewer count and Stock scarcity fluctuation logic
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewersCount(prev => {
        const diff = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + diff;
        return next < 8 ? 8 : next > 22 ? 22 : next;
      });
    }, 4500);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Reset countdown to simulate ongoing flash sale
          return { minutes: 15, seconds: 0 };
        }
      });
    }, 1000);

    // Scroll listener for sticky drawer
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroBottom = heroSectionRef.current.getBoundingClientRect().bottom;
        setShowStickyDrawer(heroBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(timerInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredReviews = selectedReviewStarFilter 
    ? reviews.items.filter(item => item.rating === selectedReviewStarFilter)
    : reviews.items;

  return (
    <div className="min-h-screen font-sans selection:bg-accent-gold/20 selection:text-white" style={{ background: "#000000" }}>
      
      {/* 1. URGENCY TOP ANNOUNCEMENT BANNER */}
      <div className="bg-accent-gold py-2 px-4 text-center select-none text-[11px] md:text-xs font-bold text-black uppercase tracking-[0.2em] relative overflow-hidden z-30">
        <div className="flex items-center justify-center gap-6 animate-pulse">
          <span>✨ FREE EU SHIPPING ON ORDERS OVER €30</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">🔒 SECURE CHECKOUT</span>
          <span className="hidden md:inline">•</span>
          <span>💎 30-DAY RISK-FREE GLOW GUARANTEE</span>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-white/10 py-3 px-4 relative z-10 bg-black/50 backdrop-blur-md">
        <Container>
          <nav className="text-xs flex gap-2" style={{ color: "#a8a8a8" }}>
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-white transition-colors">Shop</a>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* 2. HIGH-CONVERTING HERO & BUY BOX SECTION */}
      <section ref={heroSectionRef} className="py-8 md:py-16 px-4 relative overflow-hidden">
        {/* Subtle Luxury Glowing Orbs */}
        <div className="absolute top-[10%] left-[-10%] size-96 rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] size-96 rounded-full bg-white/5 blur-[120px] pointer-events-none" />

        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start relative z-10">
            
            {/* LEFT: Premium Image Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/12 bg-white/[0.01] group shadow-2xl">
                <Image
                  src={galleryImages[activeGalleryIndex].url}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={`object-cover transition-all duration-700 ${galleryImages[activeGalleryIndex].filter || ""}`}
                />
                
                {/* Image Overlay Educational Info Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                <span
                  className="absolute top-4 left-4 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full border border-black/10 shadow-lg tracking-wider"
                  style={{ background: "#c9a96e", color: "#000" }}
                >
                  {galleryImages[activeGalleryIndex].badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-white/90 font-medium">
                    {galleryImages[activeGalleryIndex].desc}
                  </p>
                </div>
              </div>

              {/* Gallery Thumbnails switcher */}
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.label}
                    onClick={() => setActiveGalleryIndex(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeGalleryIndex === i 
                        ? "border-accent-gold scale-[1.03] ring-1 ring-accent-gold/30 shadow-[0_0_15px_rgba(201,169,110,0.15)]" 
                        : "border-white/10 hover:border-white/35 opacity-70 hover:opacity-95"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      sizes="15vw"
                      className={`object-cover ${img.filter || ""}`}
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-1 left-1 right-1 text-[8px] md:text-[9px] bg-black/80 text-white/80 py-0.5 rounded text-center truncate">
                      {img.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Conversion Buy Box */}
            <div className="lg:col-span-5 space-y-6 bg-white/[0.01] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-950/40 text-red-400 border border-red-900/30 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                <Flame className="size-3.5 fill-red-400" />
                <span>Trending Pick</span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: "#c9a96e" }}>
                  {product.category === "bundle" ? "⭐ Best Value Bundle" : "✨ Skin Ritual Essential"}
                </p>
                <h1
                  className="text-3xl md:text-4xl font-semibold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-sm md:text-base leading-relaxed text-text-secondary">
                  {product.description}
                </p>
              </div>

              {/* Verified Rating click-to-scroll */}
              <div 
                onClick={scrollToReviews} 
                className="flex items-center gap-3 cursor-pointer group bg-white/[0.02] hover:bg-white/[0.04] p-2 rounded-xl transition-all duration-300 inline-flex"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        fill: i < Math.floor(product.rating) ? "#c9a96e" : "transparent",
                        color: "#c9a96e",
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating}</span>
                <span className="text-xs border-b border-text-secondary group-hover:text-white group-hover:border-white transition-colors" style={{ color: "#a8a8a8" }}>
                  ({reviews.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Price Block & Save Indicator */}
              <div className="border-t border-b border-white/10 py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold">Special Offer Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-white">€{product.price.toFixed(2)}</span>
                    <span className="text-base line-through text-text-secondary">€{product.compareAtPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-xs md:text-sm font-extrabold px-3.5 py-1.5 rounded-full inline-block animate-bounce shadow-lg"
                    style={{ background: "rgb(201 169 110 / 0.18)", color: "#c9a96e", border: "1px solid rgb(201 169 110 / 0.3)" }}
                  >
                    Save {discount}% Now
                  </span>
                  <p className="text-[10px] text-accent-gold/80 mt-1.5 font-bold">€{(product.compareAtPrice - product.price).toFixed(2)} kept in your pocket</p>
                </div>
              </div>

              {/* SCARCITY ELEMENTS PANEL */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs">
                
                {/* 1. Real-time viewers */}
                <div className="flex items-center justify-between text-white/95">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2 bg-accent-gold"></span>
                    </span>
                    <span className="font-medium text-text-secondary">Customers browsing</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-accent-gold">
                    <Eye className="size-3.5" />
                    <span>{viewersCount} active viewers</span>
                  </div>
                </div>

                {/* 2. Stock Countdown bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-text-secondary font-medium">
                    <span>Stock status</span>
                    <span className="text-red-400 font-bold">Only {stockLeft} items left in stock</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-accent-gold transition-all duration-1000 shadow-[0_0_8px_rgba(201,169,110,0.5)]" 
                      style={{ width: `${(stockLeft / 15) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 3. Timer Scarcity */}
                <div className="flex items-center justify-between text-text-secondary border-t border-white/5 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-accent-gold" />
                    <span>Flash Sale Ending Soon:</span>
                  </div>
                  <div className="flex gap-1 text-[11px] font-extrabold text-black">
                    <span className="bg-accent-gold px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                    <span className="text-accent-gold self-center">:</span>
                    <span className="bg-accent-gold px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>
              </div>

              {/* High-Converting CTA Area */}
              <div className="space-y-3.5">
                <a
                  href={product.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full text-center py-4.5 rounded-xl text-base font-extrabold text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(201,169,110,0.25)] hover:shadow-[0_0_35px_rgba(201,169,110,0.4)] group overflow-hidden"
                  style={{ background: "#c9a96e" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    BUY NOW & START YOUR GLOW RITUAL
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Glowing hover light */}
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </a>

                {/* Secure payments strip */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest">Guaranteed Safe Checkout</span>
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-[10px] text-white/40 font-bold">VISA • MC • AMEX • APPLE PAY</span>
                </div>
              </div>

              {/* Benefit Bullet points list */}
              <ul className="space-y-3 pt-2 text-xs md:text-sm">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3" style={{ color: "#a8a8a8" }}>
                    <Check className="size-4.5 mt-0.5 shrink-0" style={{ color: "#c9a96e" }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Delivery and Guarantee Strip */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                {[
                  { icon: Truck, text: "Free EU Delivery", sub: "Orders €30+" },
                  { icon: ShieldCheck, text: "30-Day Guarantee", sub: "100% Risk-Free" },
                  { icon: RotateCcw, text: "Hassle-Free Returns", sub: "Easy refund support" },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex flex-col items-center gap-1 text-center rounded-xl border border-white/5 bg-white/[0.01] p-3">
                    <Icon className="size-4" style={{ color: "#c9a96e" }} />
                    <span className="text-[10px] font-bold text-white leading-tight">{text}</span>
                    <span className="text-[9px]" style={{ color: "#a8a8a8" }}>{sub}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* 3. SCIENCE & TRUST BADGE STRIP */}
      <section className="border-t border-b border-white/10 py-8 bg-white/[0.01]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "ESTHETICIAN APPROVED", value: "Recommended for 40+" },
              { label: "SURGICAL NORDIC STEEL", value: "Swedish Sandvik Blades" },
              { label: "100% VEGAN & CLEAN", value: "Skin barrier sensitive" },
              { label: "ZERO IRRITATION", value: "Micro-safety guards built" }
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c9a96e" }}>{label}</p>
                <p className="text-xs text-white font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. VISUAL BEFORE & AFTER SECTION */}
      <section className="py-16 px-4 border-b border-white/10 relative">
        <div className="absolute top-[20%] right-[-10%] size-80 rounded-full bg-accent-gold/3 blur-[100px] pointer-events-none" />

        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>VISUAL RESULTS PROVEN</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              See The Glow Transformation
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Here is how your weekly ritual actively targets dead cell barriers, hair meshe, and unexpected blemishes to reveal glass skin.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Before Box */}
            <div className="border border-red-950/20 bg-red-950/[0.03] rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/10 pb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-red-400">Standard / Before Ritual</span>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Dull State</span>
              </div>
              <ul className="space-y-3.5">
                {beforeAfter.before.map(step => (
                  <li key={step} className="flex items-start gap-3 text-xs md:text-sm text-white/70">
                    <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After Box */}
            <div className="border border-accent-gold/20 bg-accent-gold/[0.03] rounded-2xl p-6 md:p-8 space-y-4 shadow-[0_0_30px_rgba(201,169,110,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent-gold/10 text-accent-gold border-b border-l border-accent-gold/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-widest flex items-center gap-1 uppercase">
                <Sparkles className="size-3" />
                <span>Glow Effect</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-accent-gold/10 pb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-accent-gold">With Lux Aura Care</span>
                <span className="bg-accent-gold/15 text-accent-gold border border-accent-gold/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Radiant Skin</span>
              </div>
              <ul className="space-y-3.5">
                {beforeAfter.after.map(step => (
                  <li key={step} className="flex items-start gap-3 text-xs md:text-sm text-white font-semibold">
                    <Check className="size-4 text-accent-gold shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LUX AURA CARE VS. TRADITIONAL BRANDS MATRIX */}
      <section className="py-16 px-4 border-b border-white/10 relative bg-white/[0.005]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>AWARENESS OF EXCELLENCE</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              How We Benchmark Against Generics
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Not all skincare tools are created equal. Do not compromise sensitive skin with cheap disposable pharmacy options.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/10 text-xs md:text-sm uppercase tracking-wider font-semibold text-white">
                    <th className="p-4 md:p-5">Ritual Standard</th>
                    <th className="p-4 md:p-5 text-accent-gold bg-accent-gold/5 font-extrabold text-center">Lux Aura Care</th>
                    <th className="p-4 md:p-5 text-text-secondary text-center">Standard Brands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs md:text-sm text-white/80">
                  {compareMatrix.map(({ feature, premium, cheap, icon: Icon }) => (
                    <tr key={feature} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 md:p-5 font-semibold text-white flex items-center gap-2">
                        <Icon className="size-4 text-accent-gold shrink-0" />
                        <span>{feature}</span>
                      </td>
                      <td className="p-4 md:p-5 bg-accent-gold/[0.02] font-semibold border-l border-r border-white/5 text-center">
                        <div className="flex flex-col items-center gap-1 text-white">
                          <Check className="size-5 text-accent-gold" />
                          <span className="text-[10px] md:text-xs text-accent-gold/90 font-medium leading-tight">{premium}</span>
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-center text-text-secondary">
                        <div className="flex flex-col items-center gap-1">
                          <X className="size-4 text-white/30" />
                          <span className="text-[10px] md:text-xs leading-tight">{cheap}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. DETAILED BENEFIT CARDS (DEEP DIVE SCIENCE) */}
      <section className="py-16 px-4 border-b border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>ENGINEERED BEAUTY</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              The Science Behind The Glow
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Every detail is engineered with absolute dermatological rigor to deliver instant, visible improvements without compromises.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {scienceBenefits.map((science, idx) => (
              <div 
                key={science.title} 
                className="border border-white/10 bg-white/[0.01] rounded-2xl p-6 md:p-8 space-y-4 hover:border-accent-gold/30 hover:bg-white/[0.02] hover:shadow-[0_10px_30px_rgba(201,169,110,0.05)] transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-accent-gold uppercase bg-accent-gold/10 px-3 py-1 rounded-full border border-accent-gold/20">
                    {science.badge}
                  </span>
                  <span className="text-2xl font-bold text-white/20 font-serif">0{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-serif">{science.title}</h3>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                  {science.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. "THE GLOW RITUAL" GUIDE (HOW TO USE) */}
      <section className="py-16 px-4 border-b border-white/10 bg-white/[0.005]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>SENSORY SELF-CARE STEP-BY-STEP</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Guided Weekly Glow Ritual
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Follow this simple, professional step-by-step guideline to completely refresh your facial epidermis in minutes.
            </p>
          </div>

          <ol className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {product.howToUse.map((step, i) => (
              <li
                key={step}
                className="relative flex flex-col gap-4 p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-white/20 transition-all duration-300"
              >
                <div 
                  className="size-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 text-black shadow-lg"
                  style={{ background: "#c9a96e" }}
                >
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1.5">
                    Phase 0{i + 1}
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#a8a8a8" }}>
                    {step}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 8. AMAZON-STYLE CUSTOMER REVIEWS BREAKDOWN & REVIEWS */}
      <section ref={reviewsSectionRef} className="py-16 px-4 border-b border-white/10 relative">
        <div className="absolute top-[20%] left-[-10%] size-80 rounded-full bg-accent-gold/4 blur-[100px] pointer-events-none" />

        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>AUTHENTIC PROOF</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Real Customer Verified Experiences
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              We source real reviews from global product bestsellers. Here is what women cross Europe are sharing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-12 items-start">
            
            {/* Scorecard (Left - 5 columns) */}
            <div className="lg:col-span-4 bg-white/[0.01] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-5xl font-extrabold text-white">{reviews.rating}</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5"
                      style={{
                        fill: i < Math.floor(reviews.rating) ? "#c9a96e" : "transparent",
                        color: "#c9a96e",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-secondary">{reviews.reviewsCount} Global Verified Ratings</p>
              </div>

              {/* Star Distribution Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                {reviews.breakdown.map(({ stars, percentage }) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setSelectedReviewStarFilter(prev => prev === stars ? null : stars);
                    }}
                    className={`w-full flex items-center gap-3 text-text-secondary hover:text-white transition-colors group text-left ${
                      selectedReviewStarFilter === stars ? "text-white font-bold" : ""
                    }`}
                  >
                    <span className="w-10 text-right group-hover:underline">{stars} star</span>
                    <div className="h-2.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedReviewStarFilter === stars ? "bg-accent-gold" : "bg-accent-gold/60 group-hover:bg-accent-gold"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{percentage}%</span>
                  </button>
                ))}
              </div>

              {selectedReviewStarFilter && (
                <button
                  onClick={() => setSelectedReviewStarFilter(null)}
                  className="w-full text-center text-xs text-accent-gold hover:underline font-bold mt-2"
                >
                  Clear Star Filter
                </button>
              )}
            </div>

            {/* Individual Reviews list (Right - 8 columns) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex justify-between items-center text-xs text-text-secondary border-b border-white/5 pb-3">
                <span>Showing {filteredReviews.length} of {reviews.items.length} featured comments</span>
                <span className="flex items-center gap-1 font-bold text-accent-gold">
                  <ShieldCheck className="size-3.5" /> 100% Authentic Verified Buyers
                </span>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-8 border border-white/5 rounded-2xl bg-white/[0.01]">
                  <p className="text-text-secondary text-sm">No reviews found for this star selection.</p>
                  <button 
                    onClick={() => setSelectedReviewStarFilter(null)} 
                    className="text-xs text-accent-gold hover:underline font-bold mt-2"
                  >
                    View all reviews
                  </button>
                </div>
              ) : (
                filteredReviews.map((item) => (
                  <div key={item.author} className="border border-white/10 bg-white/[0.01] rounded-2xl p-5 md:p-6 space-y-3.5 hover:border-white/20 transition-all duration-300">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.author}</span>
                          <span className="text-[10px] text-accent-gold/90 font-extrabold uppercase bg-accent-gold/10 px-2 py-0.5 rounded border border-accent-gold/20 flex items-center gap-1">
                            <ShieldCheck className="size-3" /> Verified Buyer
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary">{item.location} • Reviewed on {item.date}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="size-3.5"
                            style={{
                              fill: i < item.rating ? "#c9a96e" : "transparent",
                              color: "#c9a96e",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm md:text-base font-bold text-white">{item.title}</p>
                      <p className="text-xs md:text-sm leading-relaxed text-text-secondary">
                        "{item.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] md:text-xs text-text-secondary border-t border-white/5 pt-3">
                      <span>Was this review helpful?</span>
                      <button className="flex items-center gap-1 hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/5">
                        <ThumbsUp className="size-3" />
                        <span>Helpful ({item.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </Container>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="py-16 px-4 border-b border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "#c9a96e" }}>CONFIDENCE IN MIND</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Answering your inquiries. We transparently address every detail of the weekly skin rituals.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {product.faq.map(({ q, a }, idx) => (
              <div
                key={q}
                className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.01] hover:border-white/20 transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFAQIndex(prev => prev === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 cursor-pointer text-white font-semibold text-left text-sm md:text-base hover:bg-white/[0.02]"
                >
                  <span>{q}</span>
                  <ChevronDown className={`size-4 transition-transform duration-300 shrink-0 ml-3 text-accent-gold ${
                    openFAQIndex === idx ? "rotate-180" : ""
                  }`} />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQIndex === idx ? "max-h-60 opacity-100 border-t border-white/5" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="p-5 text-xs md:text-sm leading-relaxed" style={{ color: "#a8a8a8" }}>
                    {a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. RISK-FREE "GLOW GUARANTEE" STAMP BANNER */}
      <section className="py-16 px-4 bg-white/[0.005]">
        <Container>
          <div className="max-w-4xl mx-auto rounded-3xl border border-accent-gold/20 bg-accent-gold/[0.02] p-8 md:p-12 shadow-[0_0_50px_rgba(201,169,110,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            
            {/* Guarantee Circular Gold Badge Graphic */}
            <div className="relative shrink-0 size-32 md:size-40 border-4 border-double border-accent-gold rounded-full flex flex-col items-center justify-center text-center p-3 rotate-[-5deg] select-none bg-black/60 shadow-2xl">
              <span className="text-[9px] font-extrabold tracking-widest text-accent-gold uppercase">GLOW RITUAL</span>
              <span className="text-lg md:text-xl font-black text-white font-serif leading-none py-1">30-DAY</span>
              <span className="text-[10px] font-extrabold tracking-widest text-accent-gold uppercase leading-none">RISK FREE</span>
              <span className="text-[8px] text-white/50 pt-1">GUARANTEE</span>
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
              <span className="text-xs font-extrabold tracking-[0.25em]" style={{ color: "#c9a96e" }}>ZERO HASSLE • ZERO ANXIETY</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">
                Try It Out Risk-Free For 30 Days
              </h2>
              <p className="text-xs md:text-sm leading-relaxed text-text-secondary">
                We are so confident that you will fall in love with the skin smoothing and blemish-clearing results of your Lux Aura Care weekly ritual that we offer a full **30-Day Glow Guarantee**. If your skin is not visibly softer, smoother, or clearer, simply reach out to us and we will issue a full, prompt refund. No questions asked. Your skin renewal is our standard.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. FINAL HIGH IMPACT CTA */}
      <section className="py-20 px-4 text-center border-t border-white/10 relative overflow-hidden">
        {/* Glow behind final CTA */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] size-96 rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />

        <Container className="relative z-10 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#c9a96e" }}>YOUR RADIANT COMPLEXION AWAITS</span>
          <h2
            className="text-3xl md:text-5xl font-semibold text-white max-w-xl mx-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to start your weekly glow ritual?
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: "#a8a8a8" }}>
            Join 12,000+ happy women who elevated their skin care routine with clinic-quality results.
          </p>
          
          <div className="pt-4 max-w-sm mx-auto">
            <a
              href={product.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4.5 rounded-xl text-base font-extrabold text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] shadow-[0_0_20px_rgba(201,169,110,0.2)]"
              style={{ background: "#c9a96e" }}
            >
              Kup Teraz — €{product.price.toFixed(2)}
            </a>
            <p className="text-[10px] text-text-secondary mt-3">
              🔒 256-Bit SSL Encrypted Checkout · 30-Day Money Back Guarantee
            </p>
          </div>
        </Container>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="border-t border-white/10 py-16 px-4">
          <Container>
            <h2
              className="text-2xl md:text-3xl font-semibold text-white text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Complete your weekly ritual
            </h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {related.map((rel) => {
                const relDiscount = Math.round((1 - rel.price / rel.compareAtPrice) * 100);
                return (
                  <a
                    key={rel.id}
                    href={`/shop/${rel.id}`}
                    className="group flex gap-4 p-4 rounded-xl border border-white/10 hover:border-accent-gold/40 hover:bg-white/[0.02] hover:shadow-[0_0_15px_rgba(201,169,110,0.05)] transition-all duration-300"
                    style={{ background: "rgb(255 255 255 / 0.01)" }}
                  >
                    <div className="relative size-20 rounded-lg overflow-hidden shrink-0 border border-white/5">
                      <Image src={rel.image} alt={rel.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold text-white truncate group-hover:text-accent-gold transition-colors">{rel.name}</p>
                        <p className="text-[11px] mt-0.5 text-text-secondary line-clamp-1">{rel.tagline}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-accent-gold">€{rel.price.toFixed(2)}</span>
                          <span className="text-[10px] line-through text-text-secondary">€{rel.compareAtPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                          -{relDiscount}% Off
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 12. RESPONSIVE FLOATING BOTTOM STICKY CHECKOUT DRAWER */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black/90 border-t border-white/15 py-3.5 px-4 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] backdrop-blur-lg transform transition-transform duration-500 ease-out flex items-center justify-between ${
          showStickyDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Container className="w-full flex items-center justify-between gap-4 max-w-4xl px-0">
          <div className="flex items-center gap-3">
            <div className="relative size-11 rounded-lg overflow-hidden shrink-0 border border-white/10 hidden sm:block">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-bold text-white truncate max-w-[150px] md:max-w-xs">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-extrabold text-accent-gold">€{product.price.toFixed(2)}</span>
                <span className="text-[10px] line-through text-text-secondary">€{product.compareAtPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-red-950/40 text-red-400 border border-red-900/30 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider animate-pulse">
              <Flame className="size-3 fill-red-400" />
              <span>Only {stockLeft} left</span>
            </div>
            
            <a
              href={product.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-6 rounded-lg text-xs md:text-sm font-extrabold text-black transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center gap-1.5 uppercase tracking-wider"
              style={{ background: "#c9a96e" }}
            >
              <span>Kup Teraz</span>
              <ChevronRight className="size-4" />
            </a>
          </div>
        </Container>
      </div>

    </div>
  );
}
