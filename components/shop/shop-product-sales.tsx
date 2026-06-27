"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Check, 
  X, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronDown, 
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ZoomIn
} from "lucide-react";
import { Container } from "@/components/container";
import { LocalizedLink } from "@/components/localized-link";
import { useI18n } from "@/components/i18n-provider";
import type { ShopProduct } from "@/lib/shop-data";
import { localizeContent } from "@/lib/i18n/messages";
import { T } from "@/components/translated-text";
import { Badge } from "@/components/ui/badge";

type ShopProductSalesProps = {
  readonly product: ShopProduct;
  readonly related: ShopProduct[];
};

type ProductUgcGalleryProps = {
  readonly productName: string;
  readonly poster: string;
  readonly videos: string[];
};

function ProductUgcGallery({ productName, poster, videos }: ProductUgcGalleryProps) {
  const { text } = useI18n();
  const galleryRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 }
    );

    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (isInView && !prefersReducedMotion && index === activeIndex) {
        void video.play().catch(() => {
          // Autoplay can be disabled by the browser; native controls remain available.
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isInView]);

  const handleRailScroll = () => {
    const rail = railRef.current;
    if (!rail) return;

    const nextIndex = itemRefs.current.reduce((closestIndex, item, index) => {
      if (!item) return closestIndex;

      const currentItem = itemRefs.current[closestIndex];
      if (!currentItem) return index;

      const railLeft = rail.getBoundingClientRect().left;
      const currentDistance = Math.abs(currentItem.getBoundingClientRect().left - railLeft);
      const nextDistance = Math.abs(item.getBoundingClientRect().left - railLeft);
      return nextDistance < currentDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nextIndex);
  };

  const scrollToVideo = (index: number) => {
    const normalizedIndex = (index + videos.length) % videos.length;
    const rail = railRef.current;
    const item = itemRefs.current[normalizedIndex];
    if (!rail || !item) return;

    const targetLeft =
      item.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;

    rail.scrollTo({
      left: targetLeft,
      behavior: "auto",
    });
    setActiveIndex(normalizedIndex);
  };

  return (
    <div
      id="product-ugc-gallery"
      ref={galleryRef}
      className="min-w-0"
      role="region"
      aria-roledescription={text("carousel")}
      aria-label={`${text("Customer video gallery")}: ${productName}`}
    >
      <div className="mb-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent-gold">
          <T text={"REAL ROUTINES"} />
        </p>
        <h3 className="mt-1 text-xl font-semibold text-text-primary font-serif">
          <T text={"See the ritual in action"} />
        </h3>
      </div>

      <div className="relative mx-auto max-w-[400px]">
        <ul
          id="product-ugc-carousel"
          ref={railRef}
          onScroll={handleRailScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((videoUrl, index) => (
            <li
              key={videoUrl}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className="w-full shrink-0 snap-center"
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border-[6px] border-border-subtle bg-black shadow-2xl">
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={videoUrl}
                  poster={poster}
                  aria-label={`${productName}: ${text("customer demonstration")} ${index + 1} ${text("of")} ${videos.length}`}
                  controls
                  loop
                  muted
                  playsInline
                  preload={index === 0 ? "metadata" : "none"}
                  onPlay={() => setActiveIndex(index)}
                  className="size-full object-cover"
                >
                  <T text={"Your browser does not support the video tag."} />
                </video>
              </div>
            </li>
          ))}
        </ul>

        {videos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToVideo(activeIndex - 1)}
              aria-label={text("Previous video")}
              aria-controls="product-ugc-carousel"
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToVideo(activeIndex + 1)}
              aria-label={text("Next video")}
              aria-controls="product-ugc-carousel"
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {videos.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2" aria-label={text("Video navigation")}>
          {videos.map((videoUrl, index) => (
            <button
              key={videoUrl}
              type="button"
              onClick={() => scrollToVideo(index)}
              aria-label={`${text("Show video")} ${index + 1}`}
              aria-controls="product-ugc-carousel"
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-7 bg-accent-gold" : "w-2 bg-border-strong hover:bg-text-secondary"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
      desc: "Fine safety guards help make the blade easier to control. Follow the instructions, use light pressure, and stop if irritation occurs.",
      badge: "Derm Guard"
    },
    {
      title: "3x Serum Infusion",
      desc: "Removing surface buildup and peach fuzz can leave skin feeling smoother and help skincare spread more evenly.",
      badge: "Max Absorption"
    }
  ],
  "clear-skin-patches": [
    {
      title: "Osmotic Fluid Pull",
      desc: "Hydrocolloid material covers the blemish and absorbs surface fluid while helping discourage touching and picking.",
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
  ],
  "gua-sha-jade-roller-set": [
    {
      title: "Lymphatic Drainage",
      desc: "Gentle massage can provide a cooling, soothing ritual and may temporarily improve the appearance of puffiness.",
      badge: "De-Puff Tech"
    },
    {
      title: "Crystalline Cooling",
      desc: "Authentic Rose Quartz holds natural cold temperatures exceptionally well. This natural cooling constricts blood vessels, calming inflammation and tightening pores.",
      badge: "Cryo Calm"
    },
    {
      title: "Myofascial Release",
      desc: "Deep pressure massage along muscle fibers releases tightness and smooths the fascia. This helps melt away fine expression lines and tension in the brow and jaw.",
      badge: "Muscle Sculpt"
    }
  ]
};

export function ShopProductSales({ product, related }: ShopProductSalesProps) {
  const { locale, text } = useI18n();
  const ugcVideos = product.ugcVideos ?? [];
  const hasUgcVideos = ugcVideos.length > 0;
  const discount = Math.round((1 - product.price / product.compareAtPrice) * 100);

  const scienceBenefits = localizeContent(
    locale,
    detailedScienceBenefits[product.id] || detailedScienceBenefits["dermaplaning-razor-kit"]
  );

  // Interactive States
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [showStickyDrawer, setShowStickyDrawer] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // --- Stock: fetch from Shopify Storefront API via our proxy ---
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/shopify-stock/${encodeURIComponent(product.id)}`)
      .then(r => r.json())
      .then((d: { quantity: number | null; available: boolean }) => {
        if (!cancelled) setStockQuantity(d.quantity);
      })
      .catch(() => { /* silently fall back to no stock bar */ })
      .finally(() => { if (!cancelled) setStockLoading(false); });
    return () => { cancelled = true; };
  }, [product.id]);

  // --- Flash sale countdown: real end date from product data ---
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const saleActive = Boolean(product.flashSaleEndsAt);

  useEffect(() => {
    if (!product.flashSaleEndsAt) return;
    const end = new Date(product.flashSaleEndsAt).getTime();

    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [product.flashSaleEndsAt]);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
    transform: "scale(1)"
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)" // Elegant magnifier scale factor
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

  // Amazon-style Lightbox Overlay states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sync lightbox active index with gallery active index
  useEffect(() => {
    setLightboxIndex(activeGalleryIndex);
  }, [activeGalleryIndex]);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Gallery Variations (uses real multi-images if defined, otherwise falls back to simulated filters)
  const galleryImages = product.gallery || [
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

  // Scroll listener for sticky drawer
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroBottom = heroSectionRef.current.getBoundingClientRect().bottom;
        setShowStickyDrawer(heroBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation for Lightbox (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex(prev => (prev + 1) % galleryImages.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);


  return (
    <div className="min-h-screen overflow-x-clip bg-background-primary font-sans selection:bg-accent-gold/20 selection:text-text-primary">
      
      {/* Store transparency banner */}
      <div className="bg-accent-gold py-2 px-4 text-center select-none text-[11px] md:text-xs font-bold text-black uppercase tracking-[0.2em] relative overflow-hidden z-30">
        <div className="flex items-center justify-center gap-6">
          <span><T text={"Product details and total shown before checkout"} /></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline"><T text={"🔒 SECURE CHECKOUT"} /></span>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border-subtle py-3 px-4 relative z-10 bg-surface-glass backdrop-blur-md">
        <Container>
          <nav className="text-xs flex gap-2" style={{ color: "var(--text-secondary)" }}>
            <LocalizedLink href="/" className="hover:text-text-primary transition-colors"><T text={"Home"} /></LocalizedLink>
            <span>/</span>
            <LocalizedLink href="/shop" className="hover:text-text-primary transition-colors"><T text={"Shop"} /></LocalizedLink>
            <span>/</span>
            <span className="text-text-primary">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* 2. HIGH-CONVERTING HERO & BUY BOX SECTION */}
      <section ref={heroSectionRef} className="py-8 md:py-16 px-4 relative overflow-hidden">
        {/* Subtle Luxury Glowing Orbs */}
        <div className="absolute top-[10%] left-[-10%] size-96 rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] size-96 rounded-full bg-surface-raised blur-[120px] pointer-events-none" />

        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start relative z-10">
            
            {/* LEFT: Premium Image Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle group shadow-2xl cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsLightboxOpen(true)}
              >
                <div 
                  className="w-full h-full relative transition-transform duration-200 ease-out"
                  style={zoomStyle}
                >
                  <Image
                    src={galleryImages[activeGalleryIndex].url}
                    alt={product.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={`object-cover ${galleryImages[activeGalleryIndex].filter || ""}`}
                  />
                </div>
                
                {/* Image Overlay Educational Info Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                <Badge
                  variant="product"
                  className="absolute top-4 left-4 px-4 py-1.5 text-xs font-bold pointer-events-none md:text-sm"
                >
                  {galleryImages[activeGalleryIndex].badge}
                </Badge>

                {/* Amazon-style "Click to expand" floating indicator */}
                <div className="theme-on-image absolute top-4 right-4 bg-black/60 backdrop-blur-md text-text-primary/95 rounded-full p-2.5 border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <ZoomIn className="size-4 text-accent-gold" />
                </div>

                <div className="theme-on-image absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-border-subtle pointer-events-none">
                  <p className="text-xs text-text-primary/90 font-medium">
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
                    className={`theme-on-image relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeGalleryIndex === i 
                        ? "border-accent-gold scale-[1.03] ring-1 ring-accent-gold/30 shadow-[0_0_15px_rgba(201,169,110,0.15)]" 
                        : "border-border-subtle hover:border-border-strong opacity-70 hover:opacity-95"
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
                    <div className="absolute bottom-1 left-1 right-1 text-[8px] md:text-[9px] bg-black/80 text-text-primary/80 py-0.5 rounded text-center truncate">
                      {img.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Conversion Buy Box */}
            <div className="lg:col-span-5 space-y-6 bg-surface-subtle border border-border-subtle rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-950/40 text-red-400 border border-red-900/30 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                <Sparkles className="size-3.5" />
                <span><T text={"Featured product"} /></span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: "var(--accent-gold)" }}>
                  {product.category === "bundle" ? "Bundle" : "Skin ritual product"}
                </p>
                <h1
                  className="text-3xl md:text-4xl font-semibold text-text-primary mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-sm md:text-base leading-relaxed text-text-secondary">
                  {product.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-subtle p-3 text-xs text-text-secondary">
                <ShieldCheck className="size-4 text-accent-gold" aria-hidden="true" />
                <span><T text={"Product specifications are shown for this exact item"} /></span>
              </div>

              {/* Price Block & Save Indicator */}
              <div className="border-t border-b border-border-subtle py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold"><T text={"Special Offer Price"} /></p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-text-primary">€{product.price.toFixed(2)}</span>
                    <span className="text-base line-through text-text-secondary">€{product.compareAtPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-xs md:text-sm font-extrabold px-3.5 py-1.5 rounded-full inline-block animate-bounce shadow-lg"
                    style={{ background: "rgb(201 169 110 / 0.18)", color: "var(--accent-gold)", border: "1px solid rgb(201 169 110 / 0.3)" }}
                  >
                    <T text={"Save"} /> {discount}<T text={"% Now"} />
                  </span>
                  <p className="text-[10px] text-accent-gold/80 mt-1.5 font-bold">€{(product.compareAtPrice - product.price).toFixed(2)} <T text={"kept in your pocket"} /></p>
                </div>
              </div>

              {/* Real availability panel */}
              <div className="bg-surface-subtle border border-border-subtle rounded-2xl p-4 space-y-3.5 text-xs">

                {/* Stock bar — real Shopify data, hidden while loading or when unavailable */}
                {!stockLoading && stockQuantity !== null && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-text-secondary font-medium">
                      <span><T text={"Stock status"} /></span>
                      <span className="text-red-400 font-bold">
                        <T text={"Only"} /> {stockQuantity} <T text={"items left in stock"} />
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-red-500 to-accent-gold transition-all duration-1000 shadow-[0_0_8px_rgba(201,169,110,0.5)]"
                        style={{ width: `${Math.min(100, (stockQuantity / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Flash sale countdown — real end date, disappears when expired */}
                {saleActive && timeLeft && (
                  <div className="flex items-center justify-between text-text-secondary border-t border-border-subtle pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-accent-gold" />
                      <span><T text={"Flash Sale Ending Soon:"} /></span>
                    </div>
                    <div className="flex gap-1 text-[11px] font-extrabold">
                      {timeLeft.days > 0 && (
                        <span className="bg-accent-gold text-black px-2 py-0.5 rounded">{timeLeft.days}<T text={"d"} /></span>
                      )}
                      <span className="bg-accent-gold text-black px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, "0")}<T text={"h"} /></span>
                      <span className="text-accent-gold self-center">:</span>
                      <span className="bg-accent-gold text-black px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, "0")}<T text={"m"} /></span>
                      <span className="text-accent-gold self-center">:</span>
                      <span className="bg-accent-gold text-black px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, "0")}<T text={"s"} /></span>
                    </div>
                  </div>
                )}
              </div>

              {/* High-Converting CTA Area */}
              <div className="space-y-3.5">
                <a
                  href={product.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full text-center py-4.5 rounded-xl text-base font-extrabold text-white dark:text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(201,169,110,0.25)] hover:shadow-[0_0_35px_rgba(201,169,110,0.4)] group overflow-hidden"
                  style={{ background: "var(--accent-gold)" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <T text={"BUY NOW & START YOUR GLOW RITUAL"} />
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Glowing hover light */}
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </a>

                {/* Secure payments strip */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest"><T text={"Checkout processed securely"} /></span>
                  <div className="h-px bg-surface-hover flex-1" />
                  <span className="text-[10px] text-text-primary/40 font-bold"><T text={"VISA • MC • AMEX • APPLE PAY"} /></span>
                </div>
              </div>

              {/* Benefit Bullet points list */}
              <ul className="space-y-3 pt-2 text-xs md:text-sm">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3" style={{ color: "var(--text-secondary)" }}>
                    <Check className="size-4.5 mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                    <span><T text={benefit} /></span>
                  </li>
                ))}
              </ul>

              {/* Checkout information */}
              <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-4">
                {[
                  { icon: Truck, text: "Delivery options", sub: "Shown at checkout" },
                  { icon: ShieldCheck, text: "Secure checkout", sub: "Processed by Shopify" },
                  { icon: RotateCcw, text: "Return terms", sub: "Review before purchase" },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex flex-col items-center gap-1 text-center rounded-xl border border-border-subtle bg-surface-subtle p-3">
                    <Icon className="size-4" style={{ color: "var(--accent-gold)" }} />
                    <span className="text-[10px] font-bold text-text-primary leading-tight"><T text={text} /></span>
                    <span className="text-[9px]" style={{ color: "var(--text-secondary)" }}><T text={sub} /></span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* Product information strip */}
      <section className="border-t border-b border-border-subtle py-8 bg-surface-subtle">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Exact item", value: "Product-specific gallery" },
              { label: "Specifications", value: "Shown in the description" },
              { label: "Usage", value: "Step-by-step guidance" },
              { label: "Questions", value: "Contact support before ordering" }
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={label} /></p>
                <p className="text-xs text-text-primary font-medium"><T text={value} /></p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. DETAILED BENEFIT CARDS (DEEP DIVE SCIENCE) */}
      <section className="py-16 px-4 border-b border-border-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={"ENGINEERED BEAUTY"} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"The Science Behind The Glow"} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={"Every detail is engineered with absolute dermatological rigor to deliver instant, visible improvements without compromises."} />
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {scienceBenefits.map((science, idx) => (
              <div 
                key={science.title} 
                className="border border-border-subtle bg-surface-subtle rounded-2xl p-6 md:p-8 space-y-4 hover:border-accent-gold/30 hover:bg-surface-subtle hover:shadow-[0_10px_30px_rgba(201,169,110,0.05)] transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-accent-gold uppercase bg-accent-gold/10 px-3 py-1 rounded-full border border-accent-gold/20">
                    <T text={science.badge} />
                  </span>
                  <span className="text-2xl font-bold text-text-primary/20 font-serif">0{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary font-serif"><T text={science.title} /></h3>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                  <T text={science.desc} />
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. "THE GLOW RITUAL" GUIDE (HOW TO USE) */}
      <section className="py-16 px-4 border-b border-border-subtle bg-surface-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={"SENSORY SELF-CARE STEP-BY-STEP"} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Your Guided Weekly Glow Ritual"} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={"Follow this simple, professional step-by-step guideline to completely refresh your facial epidermis in minutes."} />
            </p>
          </div>

          <div className={hasUgcVideos ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start max-w-6xl mx-auto" : "max-w-4xl mx-auto"}>
            <ol className={`grid gap-6 ${hasUgcVideos ? "sm:grid-cols-2" : "md:grid-cols-3"}`}>
              {product.howToUse.map((step, i) => (
                <li
                  key={step}
                  className="relative flex flex-col gap-4 p-6 md:p-8 rounded-2xl border border-border-subtle bg-surface-subtle hover:border-border-default transition-all duration-300"
                >
                  <div 
                    className="size-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 text-black shadow-lg"
                    style={{ background: "var(--accent-gold)" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      <T text={"Phase 0"} />{i + 1}
                    </h4>
                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      <T text={step} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {hasUgcVideos && (
              <ProductUgcGallery
                productName={product.name}
                poster={product.image}
                videos={ugcVideos}
              />
            )}
          </div>
        </Container>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="py-16 px-4 border-b border-border-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={"CONFIDENCE IN MIND"} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Frequently Asked Questions"} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={"Answering your inquiries. We transparently address every detail of the weekly skin rituals."} />
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {product.faq.map(({ q, a }, idx) => (
              <div
                key={q}
                className="rounded-xl border border-border-subtle overflow-hidden bg-surface-subtle hover:border-border-default transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFAQIndex(prev => prev === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 cursor-pointer text-text-primary font-semibold text-left text-sm md:text-base hover:bg-surface-subtle"
                >
                  <span><T text={q} /></span>
                  <ChevronDown className={`size-4 transition-transform duration-300 shrink-0 ml-3 text-accent-gold ${
                    openFAQIndex === idx ? "rotate-180" : ""
                  }`} />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQIndex === idx ? "max-h-60 opacity-100 border-t border-border-subtle" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="p-5 text-xs md:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <T text={a} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. FINAL HIGH IMPACT CTA */}
      <section className="py-20 px-4 text-center border-t border-border-subtle relative overflow-hidden">
        {/* Glow behind final CTA */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] size-96 rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />

        <Container className="relative z-10 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent-gold)" }}><T text={"YOUR RADIANT COMPLEXION AWAITS"} /></span>
          <h2
            className="text-3xl md:text-5xl font-semibold text-text-primary max-w-xl mx-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <T text={"Ready to start your weekly glow ritual?"} />
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            <T text={"Review the product details and confirm the final order total before checkout."} />
          </p>
          
          <div className="pt-4 max-w-sm mx-auto">
            <a
              href={product.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4.5 rounded-xl text-base font-extrabold text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] shadow-[0_0_20px_rgba(201,169,110,0.2)]"
              style={{ background: "var(--accent-gold)" }}
            >
              <T text={"Kup Teraz — €"} />{product.price.toFixed(2)}
            </a>
            <p className="text-[10px] text-text-secondary mt-3">
              <T text={"Secure checkout · Delivery and return terms shown before purchase"} />
            </p>
          </div>
        </Container>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle py-16 px-4">
          <Container>
            <h2
              className="text-2xl md:text-3xl font-semibold text-text-primary text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Complete your weekly ritual"} />
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((rel) => {
                const relDiscount = Math.round((1 - rel.price / rel.compareAtPrice) * 100);
                return (
                  <a
                    key={rel.id}
                    href={`/shop/${rel.id}`}
                    className="group flex min-w-0 gap-4 rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-accent-gold/40 hover:bg-surface-subtle hover:shadow-[0_0_15px_rgba(201,169,110,0.05)]"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="relative size-20 rounded-lg overflow-hidden shrink-0 border border-border-subtle">
                      <Image src={rel.image} alt={rel.imageAlt} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold text-text-primary truncate group-hover:text-accent-gold transition-colors">{rel.name}</p>
                        <p className="text-[11px] mt-0.5 text-text-secondary line-clamp-1">{rel.tagline}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-accent-gold">€{rel.price.toFixed(2)}</span>
                          <span className="text-[10px] line-through text-text-secondary">€{rel.compareAtPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                          -{relDiscount}<T text={"% Off"} />
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
        className={`fixed bottom-0 left-0 right-0 z-40 bg-surface-glass border-t border-border-default py-3.5 px-4 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] backdrop-blur-lg transform transition-transform duration-500 ease-out flex items-center justify-between ${
          showStickyDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Container className="w-full flex items-center justify-between gap-4 max-w-4xl px-0">
          <div className="flex items-center gap-3">
            <div className="relative size-11 rounded-lg overflow-hidden shrink-0 border border-border-subtle hidden sm:block">
              <Image src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-bold text-text-primary truncate max-w-[150px] md:max-w-xs">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-extrabold text-accent-gold">€{product.price.toFixed(2)}</span>
                <span className="text-[10px] line-through text-text-secondary">€{product.compareAtPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-surface-subtle border border-border-subtle px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider text-accent-gold">
              <Sparkles className="size-3" />
              <span><T text={"Featured product"} /></span>
            </div>

            <a
              href={product.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-6 rounded-lg text-xs md:text-sm font-extrabold text-black transition-all hover:opacity-90 active:scale-[0.98] shadow-lg flex items-center gap-1.5 uppercase tracking-wider"
              style={{ background: "var(--accent-gold)" }}
            >
              <span><T text={"Kup Teraz"} /></span>
              <ChevronRight className="size-4" />
            </a>
          </div>
        </Container>
      </div>

      {/* AMAZON-STYLE HIGH-END PORTAL/LIGHTBOX OVERLAY */}
      {isLightboxOpen && (
        <div className="theme-on-image fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-in fade-in zoom-in duration-300">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm md:text-base font-bold text-text-primary tracking-wide">
                {product.name}
              </h3>
              <p className="text-[10px] md:text-xs text-accent-gold font-semibold tracking-wider uppercase mt-0.5">
                <T text={"Image"} /> {lightboxIndex + 1} <T text={"of"} /> {galleryImages.length}
              </p>
            </div>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-surface-raised hover:bg-surface-hover text-text-primary/80 hover:text-text-primary transition-all border border-border-subtle flex items-center justify-center shadow-lg"
              title={text("Close overlay (Esc)")}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Main Interactive Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center my-4 overflow-hidden">
            
            {/* Left Column (Desktop): Vertical Thumbnails List */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-3 justify-center max-h-[70vh] overflow-y-auto pr-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={`lightbox-thumb-${idx}`}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative aspect-square w-full rounded-xl overflow-hidden border transition-all duration-300 ${
                    lightboxIndex === idx
                      ? "border-accent-gold ring-2 ring-accent-gold/40 scale-[1.03]"
                      : "border-border-subtle hover:border-border-strong opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image 
                    src={img.url} 
                    alt={img.label} 
                    fill 
                    sizes="10vw"
                    className={`object-cover ${img.filter || ""}`} 
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent" />
                  <div className="absolute bottom-1 left-1 right-1 text-[9px] bg-black/85 text-text-primary/90 py-0.5 rounded text-center truncate">
                    {img.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Center Column: Large Interactive Image with Arrow Navigations */}
            <div className="col-span-1 lg:col-span-8 flex items-center justify-center relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full">
              
              {/* Left Navigation Arrow */}
              <button
                onClick={() => setLightboxIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-surface-glass hover:bg-black/80 text-text-primary border border-border-subtle hover:border-border-strong hover:scale-105 transition-all shadow-xl"
                title={text("Previous image (Left Arrow)")}
              >
                <ChevronLeft className="size-5 md:size-6" />
              </button>

              {/* Main Rendered Image Container */}
              <div className="relative w-full h-full max-w-xl aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle">
                <Image
                  src={galleryImages[lightboxIndex].url}
                  alt={galleryImages[lightboxIndex].label}
                  fill
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  priority
                  className={`object-contain transition-all duration-500 p-2 md:p-6 ${galleryImages[lightboxIndex].filter || ""}`}
                />
                
                {/* Badge Overlay */}
                <Badge
                  variant="product"
                  className="absolute top-4 left-4 px-4 py-1.5 text-xs font-bold"
                >
                  {galleryImages[lightboxIndex].badge}
                </Badge>
              </div>

              {/* Right Navigation Arrow */}
              <button
                onClick={() => setLightboxIndex(prev => (prev + 1) % galleryImages.length)}
                className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-surface-glass hover:bg-black/80 text-text-primary border border-border-subtle hover:border-border-strong hover:scale-105 transition-all shadow-xl"
                title={text("Next image (Right Arrow)")}
              >
                <ChevronRight className="size-5 md:size-6" />
              </button>
            </div>

            {/* Right Column: Educational Description */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 text-center lg:text-left justify-center lg:h-full lg:max-h-[70vh] bg-surface-subtle border border-border-subtle rounded-2xl p-4 lg:p-5">
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-accent-gold">
                <T text={"Highlight feature"} />
              </span>
              <h4 className="text-sm md:text-base font-bold text-text-primary leading-tight">
                {galleryImages[lightboxIndex].label}
              </h4>
              <p className="text-xs text-text-primary/80 leading-relaxed">
                {galleryImages[lightboxIndex].desc}
              </p>
              <div className="border-t border-border-subtle pt-4 mt-2 hidden lg:block">
                <a
                  href={product.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-lg text-xs font-extrabold text-black bg-accent-gold text-center hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <T text={"Kup Teraz — €"} />{product.price.toFixed(2)}
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Mobile indicators */}
          <div className="flex lg:hidden items-center justify-center gap-2 pb-2">
            {galleryImages.map((_, idx) => (
              <button
                key={`lightbox-dot-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className={`size-2.5 rounded-full transition-all duration-300 ${
                  lightboxIndex === idx ? "bg-accent-gold w-6" : "bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      )}

    </div>
  );
}
