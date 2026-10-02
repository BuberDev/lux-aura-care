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
  Minus,
  Plus,
  Play,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  Share2,
  ThumbsUp
} from "lucide-react";
import { Container } from "@/components/container";
import { LocalizedLink } from "@/components/localized-link";
import { useI18n } from "@/components/i18n-provider";
import type { ShopProduct } from "@/lib/shop-data";
import { localizeContent } from "@/lib/i18n/messages";
import { T } from "@/components/translated-text";
import { Badge } from "@/components/ui/badge";
import { NewsletterBlock } from "@/components/newsletter-block";
import { LocalizedDate } from "@/components/localized-date";
import { CustomerRatingSummary } from "@/components/shop/customer-rating-summary";
import { PaymentMethods } from "@/components/shop/payment-methods";
import { FreeShippingBadge } from "@/components/shop/free-shipping-badge";
import { BeforeAfterComparison } from "@/components/shop/before-after-comparison";
import {
  trackShopAddToCart,
  trackShopBeginCheckout,
  trackShopViewItem,
  type ShopCheckoutEvent,
} from "@/lib/shop-analytics";

type ShopProductSalesProps = {
  readonly product: ShopProduct;
  readonly related: ShopProduct[];
};

type ProductUgcGalleryProps = {
  readonly productName: string;
  readonly poster: string;
  readonly videos: string[];
};

type HeroUgcVideoCardProps = {
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly videoUrl: string;
  readonly poster: string;
};

type StockStatus = "available" | "sold-out" | "store-unavailable" | "unknown";

const VISIBLE_SHOP_GALLERY_IMAGES = 5;
const MAX_CHECKOUT_QUANTITY = 10;
const PRODUCT_PAGE_CONTAINER_CLASS = "px-2 sm:px-5 md:px-10 lg:px-16";

function formatShopPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function HeroUgcVideoCard({
  title,
  description,
  duration,
  videoUrl,
  poster,
}: HeroUgcVideoCardProps) {
  const { text } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    video.controls = true;
    void video.play().catch(() => {
      setHasStarted(false);
    });
  };

  return (
    <article className="group relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle shadow-xl transition-all duration-300 hover:border-accent-gold/40 hover:shadow-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          controls={hasStarted}
          playsInline
          preload="metadata"
          onPlay={() => setHasStarted(true)}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
          <T text={"Your browser does not support the video tag."} />
        </video>

        {!hasStarted && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`${text("Watch video")}: ${text(title)}`}
            className="absolute inset-0 flex items-center justify-center bg-black/25 text-white transition duration-300 hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-gold"
          >
            <span className="flex size-14 items-center justify-center rounded-full border border-accent-gold/40 bg-black/60 text-accent-gold shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}

        <span className="absolute right-3.5 top-3.5 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          <T text={duration} />
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-base font-bold leading-snug text-text-primary">
          <T text={title} />
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
          <T text={description} />
        </p>
      </div>
    </article>
  );
}

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
          <T text={"CUSTOMER VIDEOS"} />
        </p>
        <h3 className="mt-1 text-xl font-semibold text-text-primary font-serif">
          <T text={"See it in real use"} />
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
                  preload="none"
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

function buildCheckoutUrl({
  configuredUrl,
  variantUrl,
  selectedVariantId,
  selectedSizeId,
  quantity,
  locale,
}: {
  configuredUrl: string;
  variantUrl?: string;
  selectedVariantId?: string;
  selectedSizeId?: string;
  quantity: number;
  locale: string;
}) {
  const safeQuantity = Math.max(1, Math.min(MAX_CHECKOUT_QUANTITY, Math.trunc(quantity)));

  if (configuredUrl.startsWith("/api/shopify-checkout/")) {
    const params = new URLSearchParams();
    if (selectedVariantId) {
      params.set("variantId", selectedVariantId);
    }
    if (selectedSizeId) {
      params.set("sizeId", selectedSizeId);
    }
    params.set("locale", locale);
    params.set("quantity", String(safeQuantity));
    return `${configuredUrl}?${params.toString()}`;
  }

  const directUrl = variantUrl || configuredUrl;

  try {
    const url = new URL(directUrl);
    const match = url.pathname.match(/^\/cart\/(\d+):\d+$/);

    if (match) {
      url.pathname = `/cart/${match[1]}:${safeQuantity}`;
      return url.toString();
    }
  } catch {
    return directUrl;
  }

  return directUrl;
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
      desc: "The absolute best value. Together, these two steps build a smooth, clear, and high-glow complexion, with a better bundle price than buying separately.",
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
  ],
  "lux-aura-face-roller-gua-sha-set": [
    {
      title: "Roller + Gua Sha Duo",
      desc: "Use the roller first for a cooling prep step, then follow with gua sha strokes along the jawline, cheekbones, and brow area.",
      badge: "2-Step Massage"
    },
    {
      title: "Polished Glide Finish",
      desc: "Black stone and rose quartz finishes are designed to glide over facial oil or serum without pulling at delicate skin.",
      badge: "Smooth Glide"
    },
    {
      title: "Looks Good on the Vanity",
      desc: "Gold Lux Aura Care details on the tools and packaging make the set feel polished, practical, and gift-ready.",
      badge: "Signature Look"
    }
  ],
  "bian-stone-gua-sha": [
    {
      title: "Volcanic Bian Stone",
      desc: "Hand-polished black Bian stone offers an ultra-smooth mineral surface that glides over facial oil without pulling or dragging delicate skin.",
      badge: "Stone Craft"
    },
    {
      title: "Contour-Mapped Shape",
      desc: "The stick profile follows the jawline, cheeks, and brow bone, while the pointed end reaches the under-eye and brow area with precision.",
      badge: "Face Fit"
    },
    {
      title: "Chill-Ready Ritual",
      desc: "Cool the stone in the fridge before use for a refreshing morning massage — 5–10 minutes with light pressure is all it takes.",
      badge: "Cool Touch"
    }
  ],
  "gold-eye-patches": [
    {
      title: "24K Gold Hydrogel",
      desc: "Gold-toned hydrogel patches hug the under-eye curve and stay cool against the skin, turning a 20-minute treatment into a genuinely relaxing ritual.",
      badge: "Gold Formula"
    },
    {
      title: "Collagen + Hyaluronic Serum",
      desc: "Each patch is soaked in marine collagen and hyaluronic acid serum that delivers deep hydration exactly where fine lines and dryness show first.",
      badge: "Deep Hydration"
    },
    {
      title: "30 Full Treatments",
      desc: "60 patches per pack means a full month of under-eye care — use before events for a quick de-puff or overnight as part of your evening ritual.",
      badge: "Month Supply"
    }
  ],
  "vibro-glow-face-massager": [
    {
      title: "6,000 Micro-Vibrations",
      desc: "Gentle high-frequency vibration stimulates the skin's surface and helps serum spread evenly, adding a salon-style step to a 5-minute home routine.",
      badge: "Vibro Tech"
    },
    {
      title: "T-Bar Ergonomics",
      desc: "The lightweight T-bar shape follows the cheekbone, jawline, and brow bone, so every contour of the face gets consistent, comfortable contact.",
      badge: "Full Contour"
    },
    {
      title: "USB Rechargeable",
      desc: "One full charge lasts roughly 18 five-minute sessions. No batteries, no cables during use — just pick it up and glide.",
      badge: "Cordless"
    }
  ],
  "centella-collagen-sleep-masks": [
    {
      title: "Centella Soothing Base",
      desc: "Centella asiatica extract is included in the soothing, fragrance-free formula, making the mask a calm final step after serums and actives.",
      badge: "Calm Formula"
    },
    {
      title: "8-Hour Moisture Lock",
      desc: "The no-rinse overnight layer seals your evening skincare in place while you sleep, so you wake up to visibly plumper, hydrated skin.",
      badge: "Overnight Seal"
    },
    {
      title: "30-Night Supply",
      desc: "Thirty single-use sachets cover a full month of use — hygienic, travel-friendly, and easy to keep consistent.",
      badge: "Month Ritual"
    }
  ],
  "vitamin-c-retinol-serum-duo": [
    {
      title: "Vitamin C by Day",
      desc: "The morning serum targets dullness and dark spots. Follow with SPF — the duo is designed as a complete, ordered routine, not a single product.",
      badge: "AM Brighten"
    },
    {
      title: "Retinol by Night",
      desc: "The evening serum supports skin renewal while you sleep. Start 2–3 nights per week and build up gradually as your skin adjusts.",
      badge: "PM Renew"
    },
    {
      title: "Lightweight & Fragrance-Free",
      desc: "Both serums absorb fast with no greasy residue and no added fragrance — formulated with mature and reactive skin in mind.",
      badge: "Clean Feel"
    }
  ],
  "resin-body-gua-sha-tool": [
    {
      title: "Large-Format Coverage",
      desc: "The wide resin board covers thighs, arms, and abdomen in single long strokes, so a full-body session takes minutes instead of half an hour.",
      badge: "Body Scale"
    },
    {
      title: "Ergonomic Oil-Proof Grip",
      desc: "Lightweight resin keeps a secure grip even with body oil on your hands — firm, controlled strokes without slipping.",
      badge: "Sure Grip"
    },
    {
      title: "Circulation Ritual",
      desc: "Used with body oil in upward strokes, the board turns post-shower moisturising into a firm massage ritual that leaves skin feeling smoother.",
      badge: "Massage Flow"
    }
  ],
  "natural-bristle-spa-brush": [
    {
      title: "Natural Firm Bristles",
      desc: "Plant-fibre bristles deliver effective dry or wet exfoliation, sweeping away dead skin cells so body lotion spreads more evenly.",
      badge: "Deep Exfoliation"
    },
    {
      title: "Detachable Long Handle",
      desc: "The wooden handle detaches for close-up work and extends to reach the entire back — a full spa brush-down without help.",
      badge: "Full Reach"
    },
    {
      title: "Dry-Brush Ritual",
      desc: "Five minutes of dry brushing before the shower, working upward from the feet, is the classic foundation of an at-home body-glow routine.",
      badge: "Pre-Shower Step"
    }
  ],
  "exfoliating-spa-body-brush": [
    {
      title: "Soft Bristles",
      desc: "Soft plant-fibre bristles help lift dead skin during a gentle shower massage without requiring strong pressure.",
      badge: "Gentle Daily Care"
    },
    {
      title: "Secure Wrist Strap",
      desc: "The built-in strap helps keep the wet brush steady and comfortable in your hand throughout the shower.",
      badge: "Shower Grip"
    },
    {
      title: "Consistent Exfoliation",
      desc: "Regular use with gentle circular motions can leave body skin feeling smoother and ready for lotion.",
      badge: "Smoother Feel"
    }
  ],
  "ice-face-roller-gua-sha-set": [
    {
      title: "Cold-Holding Steel",
      desc: "Stainless steel keeps its chill for 20–30 minutes out of the freezer — far longer than stone — for a genuinely cooling morning massage.",
      badge: "Cryo Steel"
    },
    {
      title: "60-Second De-Puff",
      desc: "Cold contact can temporarily improve the appearance of puffiness and refresh tired skin — roll from neck to forehead before makeup.",
      badge: "Morning Reset"
    },
    {
      title: "Roller + Board Duo",
      desc: "The roller covers large areas fast while the matching gua sha board sculpts along the jawline and cheekbones — two tools, one ritual.",
      badge: "2-Piece Set"
    }
  ],
  "seaweed-collagen-crystal-mask": [
    {
      title: "Crystal Hydrogel Fit",
      desc: "The hydrogel sheet conforms closely to facial contours and holds serum against the skin for the full 20–30 minute wear time.",
      badge: "Second Skin"
    },
    {
      title: "Seaweed + Marine Collagen",
      desc: "Each mask carries 30 ml of serum with seaweed extract and marine collagen for an intensive hydration-focused treatment.",
      badge: "30ml Serum"
    },
    {
      title: "Event-Ready Glow",
      desc: "A single 20-minute session leaves skin looking dewy and luminous — the go-to step before occasions when you want a glass-skin finish.",
      badge: "Instant Lumen"
    }
  ]
};

export function ShopProductSales({ product, related }: ShopProductSalesProps) {
  const { locale, text } = useI18n();
  const ugcVideos = product.ugcVideos ?? [];
  const hasUgcVideos = ugcVideos.length > 0;
  const hasDiscount = product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const productVariants = product.variants ?? [];
  const productSizes = product.sizes ?? [];
  const hasColorVariants = productVariants.length > 0;
  const hasProductSizes = productSizes.length > 0;
  const isFashion = product.category === "fashion";
  const isBodyCare = product.category === "body-glow";
  const isSerumDuo = product.id === "vitamin-c-retinol-serum-duo";
  const isPurchasable = Boolean(
    product.shopifyUrl
      || productSizes.some((size) => size.shopifyUrl)
      || productVariants.some(
        (variant) => variant.shopifyUrl || variant.sizes?.some((size) => size.shopifyUrl)
      )
  );

  const scienceBenefits = localizeContent(
    locale,
    detailedScienceBenefits[product.id] ?? []
  );
  const salesStory = product.salesStory;

  // Interactive States
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(productVariants[0]?.id ?? "");
  const [selectedSizeId, setSelectedSizeId] = useState(
    productSizes.find((size) => size.available !== false)?.id
      ?? productSizes[0]?.id
      ?? productVariants[0]?.sizes?.[0]?.id
      ?? ""
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showStickyDrawer, setShowStickyDrawer] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Surface a friendly message when the checkout API bounced the visitor back
  const [checkoutFailed, setCheckoutFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkoutError") !== "1") return;

    setCheckoutFailed(true);
    params.delete("checkoutError");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`
    );
  }, []);

  // --- Stock: fetch from Shopify Storefront API via our proxy ---
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [stockAvailable, setStockAvailable] = useState<boolean | null>(null);
  const [stockStatus, setStockStatus] = useState<StockStatus>("unknown");
  const [stockLoading, setStockLoading] = useState(isPurchasable);

  useEffect(() => {
    if (!isPurchasable) return;

    let cancelled = false;
    const params = new URLSearchParams();
    if (selectedVariantId) {
      params.set("variantId", selectedVariantId);
    }
    if (selectedSizeId) {
      params.set("sizeId", selectedSizeId);
    }
    const stockUrl = `/api/shopify-stock/${encodeURIComponent(product.id)}${params.size ? `?${params.toString()}` : ""}`;

    setStockLoading(true);
    setStockAvailable(null);
    setStockStatus("unknown");
    fetch(stockUrl)
      .then(r => r.json())
      .then((d: { quantity: number | null; available: boolean; status?: StockStatus }) => {
        if (!cancelled) {
          setStockQuantity(d.quantity);
          setStockAvailable(d.available);
          setStockStatus(d.status ?? "unknown");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStockQuantity(null);
          setStockAvailable(null);
          setStockStatus("unknown");
        }
      })
      .finally(() => { if (!cancelled) setStockLoading(false); });
    return () => { cancelled = true; };
  }, [isPurchasable, product.id, selectedSizeId, selectedVariantId]);

  // --- Flash sale countdown: real end date from product data ---
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const saleActive = Boolean(product.flashSaleEndsAt) && hasDiscount;

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

  // Funnel analytics: product view + checkout intent (GA4 / Meta / TikTok)
  useEffect(() => {
    trackShopViewItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      currency: product.currency,
      category: product.category,
    });
  }, [product.id, product.name, product.price, product.currency, product.category]);

  const handleCheckoutClick = (placement: ShopCheckoutEvent["placement"]) => {
    if (!canCheckout) return;

    const checkoutEvent: ShopCheckoutEvent = {
      productId: product.id,
      productName: product.name,
      price: selectedUnitPrice,
      quantity: selectedQuantity * unitsPerSelection,
      currency: product.currency,
      variantId: selectedSize
        ? `${selectedVariant?.id}/${selectedSize.id}`
        : selectedVariant?.id,
      placement,
    };
    // The "buy" click both adds to Shopify's cart and starts checkout in one
    // request (see /api/shopify-checkout/[productId]), so fire both events here.
    trackShopAddToCart(checkoutEvent);
    trackShopBeginCheckout(checkoutEvent);
  };

  type HeroMediaItem = {
    type: "image" | "video";
    url: string;
    label: string;
    badge: string;
    desc: string;
    filter?: string;
    poster?: string;
  };

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
  const getUgcPoster = (index: number) =>
    index === 0
      ? "/lux-aura-face-roller-gua-sha-set/lux-aura-face-roller-gua-sha-podcast-ugc-pl-poster.webp"
      : "/lux-aura-face-roller-gua-sha-set/ugc_pl_set_pink_roller_pink_guasha-poster.webp";

  // Product images plus real UGC videos near the front, so social visitors
  // can evaluate the exact item without leaving the purchase flow.
  const heroMedia: HeroMediaItem[] = galleryImages.map((img) => ({
    type: "image" as const,
    ...img,
  }));
  ugcVideos.forEach((videoUrl, index) => {
    heroMedia.splice(Math.min(1 + index, heroMedia.length), 0, {
      type: "video",
      url: videoUrl,
      label: index === 0 ? "Set walkthrough video" : "Roller in use video",
      badge: "Watch video",
      desc: "Product video embedded near the image gallery",
      poster: getUgcPoster(index),
    });
  });

  const selectedVariant = productVariants.find((variant) => variant.id === selectedVariantId) ?? productVariants[0];
  const sizeVariants = selectedVariant?.sizes ?? productSizes;
  const selectedSize = sizeVariants.find((size) => size.id === selectedSizeId) ?? sizeVariants[0];
  const hasSizeVariants = sizeVariants.length > 0;
  const checkoutPending = isPurchasable && stockLoading;
  const stockUnavailable = isPurchasable && !stockLoading && stockAvailable === false;
  const canCheckout = isPurchasable && !stockLoading && stockAvailable !== false;
  const maxSelectableQuantity = Math.max(
    1,
    Math.min(MAX_CHECKOUT_QUANTITY, stockQuantity ?? MAX_CHECKOUT_QUANTITY)
  );
  const unitsPerSelection = selectedSize?.checkoutQuantity ?? 1;
  const checkoutUrl = buildCheckoutUrl({
    configuredUrl: product.shopifyUrl ?? "",
    variantUrl: selectedSize?.shopifyUrl ?? selectedVariant?.shopifyUrl,
    selectedVariantId: selectedVariant?.id,
    selectedSizeId: selectedSize?.id,
    quantity: selectedQuantity * unitsPerSelection,
    locale,
  });
  const checkoutLabel = hasSizeVariants ? "Order selected size" : hasColorVariants ? "Order selected color" : "Order now";
  const showLowStock = !stockLoading && stockQuantity !== null && stockQuantity > 0 && stockQuantity <= 15;
  const showSaleCountdown = Boolean(saleActive && timeLeft);
  const trustBadgeLabel = (() => {
    if (!isPurchasable) return null;
    if (checkoutPending) return "Checking availability";
    if (stockUnavailable) return stockStatus === "sold-out" ? "Out of stock" : "Unavailable";
    return null;
  })();
  const productCategoryLabel = isSerumDuo
    ? "Face serum duo"
    : isFashion
    ? "Style edit"
    : product.category === "bundle"
      ? "Bundle"
      : product.category === "body-glow"
        ? "Body care"
        : "Skincare tool";
  const usageEyebrow = isSerumDuo
    ? "DAY & NIGHT SKINCARE"
    : isFashion
    ? "FIT & STYLING"
    : isBodyCare
      ? "BODY CARE STEP BY STEP"
      : "FACIAL MASSAGE STEP BY STEP";
  const usageTitle = isSerumDuo
    ? "How to Use Both Serums"
    : isFashion
    ? "Choose and Style It With Confidence"
    : isBodyCare
      ? "How to Use the Body Brush"
      : "How to Use It Without Guesswork";
  const usageDescription = isSerumDuo
    ? "Introduce retinol gradually and finish every morning routine with SPF 30 or higher."
    : isFashion
    ? "Compare the colorways, select your size and use a few considered styling details to make the silhouette your own."
    : isBodyCare
      ? "Use the brush on wet skin with gentle pressure, then rinse it well and leave it to dry completely."
      : "Follow this simple, professional step-by-step guideline to completely refresh your facial epidermis in minutes.";
  const customerReviews = product.reviews ?? [];
  const finalEyebrow = isFashion
    ? "YOUR NEXT POLISHED LOOK"
    : isBodyCare
      ? "YOUR BODY-CARE ROUTINE"
      : "YOUR RADIANT COMPLEXION AWAITS";
  const finalTitle = isFashion
    ? "Found the color that feels like you?"
    : isBodyCare
      ? "Ready to add it to your shower routine?"
      : "Ready to add it to your skincare routine?";
  const relatedHeading = isFashion
    ? "Continue exploring Lux Aura Care"
    : isBodyCare
      ? "Pair it with body care"
      : "Pair it with your skincare";
  const scienceEyebrow = isSerumDuo ? "DAY + NIGHT FORMULAS" : "CONSIDERED DESIGN";
  const scienceTitle = isSerumDuo
    ? "Two Complementary Steps, One Clear Routine"
    : "What Makes This Product Practical";
  const scienceDescription = isSerumDuo
    ? "See what each serum contributes and how to introduce the duo comfortably into morning and evening skincare."
    : "Review the materials, shape and practical details before deciding whether this product fits your routine.";
  const selectedUnitPrice = product.price * unitsPerSelection;
  const selectedCompareAtUnitPrice = product.compareAtPrice * unitsPerSelection;
  const selectedSubtotal = selectedUnitPrice * selectedQuantity;
  const productPrice = formatShopPrice(selectedUnitPrice, product.currency, locale);
  const productCompareAtPrice = formatShopPrice(selectedCompareAtUnitPrice, product.currency, locale);
  const selectedSubtotalPrice = formatShopPrice(selectedSubtotal, product.currency, locale);
  const selectedCompareAtSubtotalPrice = formatShopPrice(
    selectedCompareAtUnitPrice * selectedQuantity,
    product.currency,
    locale
  );
  const savingsPrice = formatShopPrice(
    selectedCompareAtUnitPrice - selectedUnitPrice,
    product.currency,
    locale
  );
  const stickyImage = selectedVariant?.image ?? product.image;
  const visibleGalleryImages = heroMedia.slice(0, VISIBLE_SHOP_GALLERY_IMAGES);
  const hiddenGalleryCount = Math.max(heroMedia.length - VISIBLE_SHOP_GALLERY_IMAGES, 0);
  const activeHeroItem = heroMedia[activeGalleryIndex] ?? heroMedia[0];
  const lightboxItem = heroMedia[lightboxIndex] ?? heroMedia[0];
  const heroThumbSrc = (item: HeroMediaItem) =>
    item.type === "video" ? item.poster ?? product.image : item.url;
  const heroMediaAlt = (item: HeroMediaItem) => {
    if (item.type === "video") return `${product.name}: ${text("customer demonstration")}`;

    return productVariants.find((variant) => variant.image === item.url)?.imageAlt
      ?? `${product.name}: ${text(item.label)}`;
  };
  const previewUgcVideos = ugcVideos.slice(0, 2).map((videoUrl, index) => ({
    videoUrl,
    poster: getUgcPoster(index),
    title: index === 0 ? "Set walkthrough" : "Rose quartz roller in use",
    description:
      index === 0
        ? "A short creator video that shows the set and explains how it fits into skincare."
        : "A close real-use clip showing the roller, pace, and light pressure on the face.",
    duration: index === 0 ? "41 sec" : "24 sec",
  }));

  useEffect(() => {
    setSelectedQuantity((current) => Math.min(current, maxSelectableQuantity));
  }, [maxSelectableQuantity]);

  const handleVariantSelect = (variantId: string) => {
    const nextVariant = productVariants.find((variant) => variant.id === variantId);
    if (!nextVariant) return;

    setSelectedVariantId(nextVariant.id);
    setSelectedSizeId((currentSizeId) =>
      nextVariant.sizes?.some((size) => size.id === currentSizeId)
        ? currentSizeId
        : nextVariant.sizes?.[0]?.id ?? ""
    );

    const nextGalleryIndex = heroMedia.findIndex(
      (item) => item.type === "image" && item.url === nextVariant.image
    );
    if (nextGalleryIndex >= 0) {
      setActiveGalleryIndex(nextGalleryIndex);
    }
  };

  const decreaseQuantity = () => {
    setSelectedQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setSelectedQuantity((current) => Math.min(maxSelectableQuantity, current + 1));
  };

  const openGalleryAt = (index: number) => {
    setActiveGalleryIndex(index);
    setIsLightboxOpen(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareCopied(false);
    }
  };

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
        setLightboxIndex(prev => (prev + 1) % heroMedia.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex(prev => (prev - 1 + heroMedia.length) % heroMedia.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, heroMedia.length]);


  return (
    <div className="min-h-screen overflow-x-clip bg-background-primary font-sans selection:bg-accent-gold/20 selection:text-text-primary">
      
      {/* Store transparency banner */}
      <div className="bg-accent-gold py-2 px-4 text-center select-none text-[11px] md:text-xs font-bold text-black uppercase tracking-[0.2em] relative overflow-hidden z-30">
          <div className="flex items-center justify-center gap-3 md:gap-6">
            <span className="sm:hidden"><T text={"Details before payment"} /></span>
            <span className="hidden sm:inline"><T text={"Product details and total shown before checkout"} /></span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline"><T text={"🔒 SECURE CHECKOUT"} /></span>
          </div>
      </div>

      {/* Checkout failure notice — shown when the checkout API bounced back */}
      {checkoutFailed && (
        <div
          className="border-b border-red-900/40 bg-red-950/60 px-4 py-3 text-center text-xs font-semibold text-red-200"
          role="alert"
        >
          <T text={"We couldn't open the checkout just now. Please try again — your selection is still saved on this page."} />
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border-subtle py-3 relative z-10 bg-surface-glass backdrop-blur-md">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
          <nav className="flex gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <LocalizedLink href="/" className="hover:text-text-primary transition-colors"><T text={"Home"} /></LocalizedLink>
            <span>/</span>
            <LocalizedLink href="/shop" className="hover:text-text-primary transition-colors"><T text={"Shop"} /></LocalizedLink>
            <span>/</span>
            <span className="text-text-primary">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* 2. HIGH-CONVERTING HERO & BUY BOX SECTION */}
      <section ref={heroSectionRef} className="relative py-6 md:py-16">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start relative z-10">
            
            {/* LEFT: Premium Image Gallery */}
            <div className="lg:col-span-7 lg:flex lg:flex-col lg:sticky lg:top-24 lg:self-start">
              <div className="w-full">
                <div className="grid items-start gap-2 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:gap-3">
                  <div className="sm:col-start-2">
                    <div
                      id="shop-product-gallery-image"
                      className="theme-on-image relative aspect-square overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle"
                    >
                      {activeHeroItem.type === "video" ? (
                        <video
                          key={activeHeroItem.url}
                          src={activeHeroItem.url}
                          poster={activeHeroItem.poster ?? product.image}
                          controls
                          loop
                          muted
                          autoPlay
                          playsInline
                          preload="metadata"
                          aria-label={`${product.name}: ${text("customer demonstration")}`}
                          className="absolute inset-0 z-0 size-full bg-black object-contain"
                        >
                          <T text={"Your browser does not support the video tag."} />
                        </video>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openGalleryAt(activeGalleryIndex)}
                          className="absolute inset-0 z-0 cursor-zoom-in"
                          aria-label={text("Click to see full view")}
                        >
                          <Image
                            src={activeHeroItem.url}
                            alt={heroMediaAlt(activeHeroItem)}
                            fill
                            loading="eager"
                            fetchPriority="high"
                            sizes="(max-width: 640px) calc(100vw - 1rem), (max-width: 1024px) 560px, 48vw"
                            className={`object-contain transition-all duration-500 ease-out ${activeHeroItem.filter || ""}`}
                          />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleShare}
                        className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-full border border-border-subtle bg-surface-glass text-text-primary shadow-lg backdrop-blur-md transition hover:border-border-strong hover:text-accent-gold"
                        aria-label={text("Share product")}
                        title={text("Share product")}
                      >
                        <Share2 className="size-5" aria-hidden="true" />
                      </button>

                      {shareCopied && (
                        <span className="absolute right-3 top-14 z-20 rounded-lg bg-black/85 px-3 py-1.5 text-xs text-white shadow-lg" role="status">
                          {text("Link copied")}
                        </span>
                      )}
                    </div>

                    {activeHeroItem.type === "image" && (
                      <button
                        type="button"
                        onClick={() => openGalleryAt(activeGalleryIndex)}
                        className="mt-2 w-full text-center text-xs font-medium text-accent-gold transition hover:text-text-primary"
                      >
                        {text("Click to see full view")}
                      </button>
                    )}
                  </div>

                  {/* Amazon-style thumbnail rail */}
                  <div
                    className="row-start-2 flex gap-1.5 overflow-x-auto pb-1 sm:col-start-1 sm:row-start-1 sm:flex-col sm:overflow-visible sm:pb-0 sm:gap-2"
                    aria-label={`${product.name}: ${text("Product gallery")}`}
                  >
                    {visibleGalleryImages.map((img, i) => (
                      <button
                        key={`${img.url}-${i}`}
                        type="button"
                        onClick={() => setActiveGalleryIndex(i)}
                        onMouseEnter={() => setActiveGalleryIndex(i)}
                        aria-label={text(img.label)}
                        aria-pressed={activeGalleryIndex === i}
                        aria-controls="shop-product-gallery-image"
                        title={text(img.label)}
                        className={`theme-on-image relative size-10 shrink-0 overflow-hidden rounded-md border-2 bg-surface-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold sm:size-14 sm:rounded-lg ${
                          activeGalleryIndex === i
                            ? "border-accent-gold shadow-[0_0_0_1px_rgba(201,169,110,0.2)]"
                            : "border-border-subtle opacity-80 hover:border-border-strong hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={heroThumbSrc(img)}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 40px, 56px"
                          className={`object-contain ${img.filter || ""}`}
                        />
                        {img.type === "video" && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="size-4 fill-white text-white sm:size-5" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    ))}

                    {hiddenGalleryCount > 0 && (
                      <button
                        type="button"
                        onClick={() => openGalleryAt(VISIBLE_SHOP_GALLERY_IMAGES)}
                        className={`theme-on-image relative size-10 shrink-0 overflow-hidden rounded-md border-2 bg-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold sm:size-14 sm:rounded-lg ${
                          activeGalleryIndex >= VISIBLE_SHOP_GALLERY_IMAGES ? "border-accent-gold" : "border-border-subtle"
                        }`}
                        aria-label={`${hiddenGalleryCount} ${text("Additional images")}`}
                        aria-controls="shop-product-gallery-image"
                      >
                        <Image
                          src={heroThumbSrc(heroMedia[VISIBLE_SHOP_GALLERY_IMAGES])}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 40px, 56px"
                          className="object-cover opacity-35"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white">
                          +{hiddenGalleryCount}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Conversion Buy Box */}
            <div className="space-y-3.5 rounded-2xl border border-border-subtle bg-surface-subtle p-3.5 shadow-xl backdrop-blur-md sm:space-y-4 sm:rounded-2xl sm:p-5 md:p-6 lg:col-span-5">
              <div>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="min-w-0 text-xs uppercase tracking-[0.2em] font-bold" style={{ color: "var(--accent-gold)" }}>
                    <T text={productCategoryLabel} />
                  </p>
                  {trustBadgeLabel && (
                    <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle bg-background-primary/45 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
                      <ShieldCheck className="size-3.5 text-accent-gold" aria-hidden="true" />
                      <span><T text={trustBadgeLabel} /></span>
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <CustomerRatingSummary
                    rating={product.rating}
                    reviews={customerReviews}
                    avatars={product.reviewAvatars}
                  />
                </div>
                <h1
                  className="break-words text-xl font-semibold text-text-primary mb-2 sm:text-2xl md:text-3xl"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  {product.description}
                </p>
              </div>

              {/* Price Block & Save Indicator */}
              <div className="flex items-center justify-between gap-4 border-y border-border-subtle py-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                    <T text={hasDiscount ? "Special Offer Price" : "Price"} />
                  </p>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">{productPrice}</span>
                    {hasDiscount && (
                      <span className="text-xs sm:text-sm line-through text-text-secondary">{productCompareAtPrice}</span>
                    )}
                  </div>
                </div>
                {hasDiscount && (
                  <div className="text-right">
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm"
                      style={{ background: "rgb(201 169 110 / 0.18)", color: "var(--accent-gold)", border: "1px solid rgb(201 169 110 / 0.3)" }}
                    >
                      <T text={"You save"} /> {discount}%
                    </span>
                    <p className="mt-1 text-[10px] font-bold text-accent-gold/80">{savingsPrice} <T text={"kept in your pocket"} /></p>
                  </div>
                )}
              </div>

              {/* Free Shipping Badge */}
              <FreeShippingBadge variant="banner" />

              {/* Real availability panel */}
              {(showLowStock || showSaleCountdown) && (
              <div className="bg-surface-subtle border border-border-subtle rounded-xl p-3 space-y-2.5 text-xs">

                {/* Stock bar — real Shopify data, shown only when genuinely low so urgency stays credible */}
                {showLowStock && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-text-secondary font-medium">
                      <span><T text={"Stock status"} /></span>
                      <span className="text-red-400 font-bold">
                        <T text={"Only"} /> {stockQuantity} <T text={"items left in stock"} />
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-red-500 to-accent-gold transition-all duration-1000 shadow-[0_0_8px_rgba(201,169,110,0.5)]"
                        style={{ width: `${Math.min(100, (stockQuantity / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Flash sale countdown — real end date, disappears when expired */}
                {showSaleCountdown && timeLeft && (
                  <div className="flex items-center justify-between text-text-secondary border-t border-border-subtle pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-accent-gold" />
                      <span><T text={"Flash Sale Ending Soon:"} /></span>
                    </div>
                    <div className="flex gap-1 text-[11px] font-extrabold">
                      {timeLeft.days > 0 && (
                        <span className="bg-accent-gold text-black px-1.5 py-0.5 rounded">{timeLeft.days}<T text={"d"} /></span>
                      )}
                      <span className="bg-accent-gold text-black px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, "0")}<T text={"h"} /></span>
                      <span className="text-accent-gold self-center">:</span>
                      <span className="bg-accent-gold text-black px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, "0")}<T text={"m"} /></span>
                      <span className="text-accent-gold self-center">:</span>
                      <span className="bg-accent-gold text-black px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, "0")}<T text={"s"} /></span>
                    </div>
                  </div>
                )}
              </div>
              )}

              {hasColorVariants && selectedVariant && (
                <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-subtle p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                      <T text={"Choose color"} />
                    </p>
                    <p className="min-w-0 text-right text-[10px] font-semibold text-text-secondary">
                      <T text={"Selected color"} />:{" "}
                      <span className="text-text-primary"><T text={selectedVariant.label} /></span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={text("Choose color")}>
                    {productVariants.map((variant) => {
                      const isSelected = selectedVariant.id === variant.id;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleVariantSelect(variant.id)}
                          className={`flex min-h-9 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs font-bold transition-all duration-200 ${
                            isSelected
                              ? "border-accent-gold bg-accent-gold/10 text-text-primary shadow-[0_0_10px_rgba(201,169,110,0.1)]"
                              : "border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary"
                          }`}
                        >
                          <span
                            className="size-4 shrink-0 rounded-full border shadow-inner"
                            style={{
                              background: variant.swatchHex,
                              borderColor: variant.swatchBorderHex ?? "var(--border-subtle)",
                            }}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 leading-tight text-[11px]"><T text={variant.label} /></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasSizeVariants && selectedSize && (
                <div className="space-y-1.5 rounded-xl border border-border-subtle bg-background-primary/35 p-2.5">
                  <div className="flex items-center justify-between gap-3 px-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                      <T text={hasProductSizes ? "Choose volume" : "Choose size"} />
                    </p>
                    <span className="text-[10px] font-bold text-accent-gold">{selectedSize.label}</span>
                  </div>

                  <div
                    className={hasProductSizes ? "grid grid-cols-2 gap-2" : "grid grid-cols-3 gap-1.5 sm:grid-cols-6"}
                    role="radiogroup"
                    aria-label={text(hasProductSizes ? "Choose volume" : "Choose size")}
                  >
                    {sizeVariants.map((size) => {
                      const isSelected = selectedSize.id === size.id;
                      const isAvailable = size.available !== false;
                      const sizePrice = formatShopPrice(
                        product.price * (size.checkoutQuantity ?? 1),
                        product.currency,
                        locale
                      );

                      return (
                        <button
                          key={size.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-disabled={!isAvailable}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSizeId(size.id)}
                          className={`relative flex min-h-10 items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs font-extrabold transition-all duration-200 ${
                            isSelected
                              ? "border-accent-gold bg-accent-gold/10 text-text-primary shadow-[0_0_10px_rgba(201,169,110,0.1)]"
                              : isAvailable
                                ? "border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary"
                                : "cursor-not-allowed border-border-subtle bg-background-primary/35 text-text-secondary opacity-60"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-1.5">
                            {isSelected && <Check className="size-3.5 shrink-0 text-accent-gold" aria-hidden="true" />}
                            <span className="text-sm font-extrabold">{size.label}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-text-secondary">{sizePrice}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {canCheckout && (
              <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-subtle p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                      <T text={"Quantity"} />
                    </p>
                  </div>
                  <p className="shrink-0 rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2 py-0.5 text-[10px] font-extrabold text-accent-gold">
                    {selectedQuantity} <T text={selectedQuantity === 1 ? "piece" : "pieces"} />
                  </p>
                </div>

                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center overflow-hidden rounded-lg border border-border-subtle bg-background-primary">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={selectedQuantity <= 1}
                    aria-label={text("Decrease quantity")}
                    className="flex h-9.5 items-center justify-center text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Minus className="size-3.5" aria-hidden="true" />
                  </button>
                  <div className="flex h-9.5 items-center justify-center border-x border-border-subtle text-center">
                    <span className="text-base font-extrabold text-text-primary tabular-nums">{selectedQuantity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={selectedQuantity >= maxSelectableQuantity}
                    aria-label={text("Increase quantity")}
                    className="flex h-9.5 items-center justify-center text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-text-secondary">
                  <span>
                    <T text={"Checkout quantity"} />:{" "}
                    <span className="text-text-primary">{selectedQuantity}</span>
                  </span>
                  <span>
                    <T text={"Subtotal"} />:{" "}
                    <span className="text-accent-gold">{selectedSubtotalPrice}</span>
                  </span>
                </div>
              </div>
              )}

              {/* High-Converting CTA Area */}
              {canCheckout ? (
              <div className="space-y-3">
                <a
                  href={checkoutUrl}
                  onClick={() => handleCheckoutClick("buy-box")}
                  className="relative flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-extrabold leading-tight text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(201,169,110,0.2)] hover:shadow-[0_0_30px_rgba(201,169,110,0.35)] group overflow-hidden dark:text-black"
                  style={{ background: "var(--accent-gold)" }}
                >
                  <span className="relative z-10 flex min-w-0 flex-wrap items-center justify-center gap-2">
                    <span className="min-w-0"><T text={checkoutLabel} /></span>
                    <ChevronRight className="size-4.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Glowing hover light */}
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </a>

              </div>
              ) : checkoutPending ? (
                <div
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-4 py-2.5 text-center text-sm font-bold text-text-secondary"
                  role="status"
                >
                  <span className="size-4 animate-spin rounded-full border-2 border-border-strong border-t-accent-gold" aria-hidden="true" />
                  <T text={"Checking availability"} />
                </div>
              ) : (
                <div id="availability" className="rounded-xl border border-accent-gold/30 bg-accent-gold/10 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-text-primary text-xs sm:text-sm">
                        <T text={stockUnavailable ? (stockStatus === "sold-out" ? "Out of stock" : "Ordering temporarily unavailable") : "Color preview is ready"} />
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                        <T
                          text={
                            stockUnavailable
                              ? stockStatus === "sold-out"
                                ? "This item is currently out of stock. Choose another product or contact us about availability."
                                : "Checkout is temporarily unavailable. Please contact us before ordering or try again later."
                              : "Select a color above to see its full-length image. We will enable ordering after price, sizes and checkout variants are verified."
                          }
                        />
                      </p>
                      <LocalizedLink href="/contact" className="mt-2 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-accent-gold transition hover:text-text-primary">
                        <T text={stockUnavailable ? "Contact support before ordering" : "Ask about availability"} />
                      </LocalizedLink>
                    </div>
                  </div>
                </div>
              )}

              {isPurchasable && <PaymentMethods />}

              {/* Benefit Bullet points list */}
              <ul className="space-y-2 pt-1 text-xs">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5" style={{ color: "var(--text-secondary)" }}>
                    <Check className="size-4 mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                    <span><T text={benefit} /></span>
                  </li>
                ))}
              </ul>

              {/* Checkout information */}
              {canCheckout && (
              <div className="grid grid-cols-3 gap-1.5 border-t border-border-subtle pt-3 sm:gap-2">
                {[
                  { icon: Truck, text: "Delivery options", sub: "Shown at checkout" },
                  { icon: ShieldCheck, text: "Secure checkout", sub: "Processed by Shopify" },
                  { icon: RotateCcw, text: "14-day returns", sub: "EU right of withdrawal" },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex flex-col items-center gap-1 rounded-lg border border-border-subtle bg-surface-subtle p-2 text-center sm:p-2.5">
                    <Icon className="size-3.5" style={{ color: "var(--accent-gold)" }} />
                    <span className="text-[10px] font-bold text-text-primary leading-tight"><T text={text} /></span>
                    <span className="text-[9px]" style={{ color: "var(--text-secondary)" }}><T text={sub} /></span>
                  </div>
                ))}
              </div>
              )}

            </div>

          </div>
        </Container>
      </section>

      {/* Product information strip */}
      <section className="border-t border-b border-border-subtle py-8 bg-surface-subtle">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
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

      {/* DEDICATED RITUAL STORY, DEMONSTRATION & CONTENTS SECTION */}
      {salesStory && (
        <section className="border-b border-border-subtle py-14 sm:py-20 bg-surface-subtle/30">
          <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
            {/* Header */}
            <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
              <span
                className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent-gold"
              >
                <T text={salesStory.eyebrow} />
              </span>
              <h2
                className="mt-3 text-2xl font-semibold leading-tight text-text-primary sm:text-4xl md:text-5xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <T text={salesStory.title} />
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base max-w-2xl mx-auto">
                <T text={salesStory.description} />
              </p>
            </div>

            {/* 3 Highlights Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {salesStory.highlights.map((highlight, idx) => (
                <div
                  key={highlight.title}
                  className="group relative rounded-2xl border border-border-subtle bg-surface-subtle p-6 transition-all duration-300 hover:border-accent-gold/40 hover:shadow-lg sm:p-7"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold"
                    >
                      <Check className="size-5" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-serif font-bold text-text-primary/15">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                    <T text={highlight.title} />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    <T text={highlight.desc} />
                  </p>
                </div>
              ))}
            </div>

            {/* What you get + Best used with Dual Box */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
              {[
                {
                  title: "What you get",
                  badge: "Included in box",
                  items: [
                    "Double-ended face roller",
                    "Matching gua sha tool",
                    "Branded gift-ready packaging",
                  ],
                },
                {
                  title: "Best used with",
                  badge: "Expert recommendation",
                  items: [
                    "Facial oil or serum for slip",
                    "Light pressure, never dragging",
                    "A short 5-minute massage",
                  ],
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-border-subtle bg-surface-subtle p-6 sm:p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent-gold">
                      <T text={group.title} />
                    </p>
                    <span className="rounded-full border border-border-subtle bg-background-primary/60 px-2.5 py-0.5 text-[10px] font-medium text-text-secondary">
                      <T text={group.badge} />
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                        <span><T text={item} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Video Demonstration Cards */}
            {previewUgcVideos.length > 0 && (
              <div className="mt-14 max-w-5xl mx-auto border-t border-border-subtle pt-12">
                <div className="rounded-3xl border border-border-subtle bg-surface-subtle/80 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-md">
                  <div className="text-center mb-8 sm:mb-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent-gold">
                      <T text={"Product videos"} />
                    </span>
                    <h3
                      className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      <T text={"Watch the set before you choose"} />
                    </h3>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                    {previewUgcVideos.map((video) => (
                      <HeroUgcVideoCard
                        key={video.videoUrl}
                        title={video.title}
                        description={video.description}
                        duration={video.duration}
                        videoUrl={video.videoUrl}
                        poster={video.poster}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {isSerumDuo && <BeforeAfterComparison />}

      {/* 6. DETAILED BENEFIT CARDS (DEEP DIVE SCIENCE) */}
      {scienceBenefits.length > 0 && (
      <section className="border-b border-border-subtle py-12 sm:py-16">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={scienceEyebrow} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={scienceTitle} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={scienceDescription} />
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {scienceBenefits.map((science, idx) => (
              <div 
                key={science.title} 
                className="space-y-4 rounded-2xl border border-border-subtle bg-surface-subtle p-5 transition-all duration-500 hover:border-accent-gold/30 hover:bg-surface-subtle hover:shadow-[0_10px_30px_rgba(201,169,110,0.05)] sm:p-6 md:p-8"
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
      )}

      {/* 7. Step-by-step usage guide */}
      <section className="border-b border-border-subtle bg-surface-subtle py-12 sm:py-16">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={usageEyebrow} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={usageTitle} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={usageDescription} />
            </p>
          </div>

          <div className={hasUgcVideos ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start max-w-6xl mx-auto" : "max-w-4xl mx-auto"}>
            <ol className={`grid gap-6 ${hasUgcVideos ? "sm:grid-cols-2" : "md:grid-cols-3"}`}>
              {product.howToUse.map((step, i) => (
                <li
                  key={step}
                  className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-subtle p-5 transition-all duration-300 hover:border-border-default sm:p-6 md:p-8"
                >
                  <div 
                    className="size-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 text-black shadow-lg"
                    style={{ background: "var(--accent-gold)" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1.5">
                      <T text={isFashion ? "Tip" : "Step"} /> {String(i + 1).padStart(2, "0")}
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

      {/* Supplier review excerpts supplied with this product listing */}
      {customerReviews.length > 0 && product.rating && (
        <section id="customer-reviews" className="scroll-mt-24 border-b border-border-subtle py-12 sm:py-16">
          <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
                <aside className="rounded-2xl border border-border-subtle bg-surface-subtle p-6 lg:sticky lg:top-24">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent-gold">
                    <T text={"SUPPLIER CUSTOMER REVIEWS"} />
                  </p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="font-serif text-5xl font-semibold leading-none text-text-primary">
                      {product.rating.value.toFixed(1)}
                    </span>
                    <span className="pb-1 text-sm font-semibold text-text-secondary">/ 5</span>
                  </div>
                  <div
                    className="mt-3 flex items-center gap-1"
                    aria-label={`${product.rating.value.toFixed(1)} ${text("out of 5 stars")}`}
                  >
                    {[1, 2, 3, 4, 5].map((starPosition) => (
                      <Star
                        key={starPosition}
                        className={`size-5 ${
                          starPosition <= Math.round(product.rating!.value)
                            ? "fill-accent-gold text-accent-gold"
                            : "fill-transparent text-border-strong"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-text-primary">
                    <T text={"Based on"} /> {product.rating.count} <T text={"reviews on the supplier listing"} />
                  </p>
                  <p className="mt-4 border-t border-border-subtle pt-4 text-xs leading-relaxed text-text-secondary">
                    <T text={"Selected reviews from the supplier's product listing. The wording is translated for readability, and color names reflect the original order variants. These are not purchases verified by Lux Aura Care."} />
                  </p>
                </aside>

                <div>
                  <div className="mb-6 max-w-2xl">
                    <h2
                      className="text-3xl font-semibold text-text-primary md:text-4xl"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      <T text={"What customers say about the dress"} />
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      <T text={"Five selected comments from customers who ordered this style through the supplier listing."} />
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {customerReviews.map((review, index) => (
                      <article
                        key={review.id}
                        className={`flex h-full flex-col rounded-2xl border border-border-subtle bg-surface-subtle p-5 sm:p-6 ${
                          customerReviews.length % 2 === 1 && index === customerReviews.length - 1
                            ? "md:col-span-2"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10 text-sm font-extrabold text-accent-gold"
                              aria-hidden="true"
                            >
                              {review.author.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-text-primary">{review.author}</p>
                              <p className="text-[11px] text-text-secondary"><T text={review.source} /></p>
                            </div>
                          </div>
                          <div
                            className="flex shrink-0 items-center gap-0.5"
                            aria-label={`${review.rating} ${text("out of 5 stars")}`}
                          >
                            {[1, 2, 3, 4, 5].map((starPosition) => (
                              <Star
                                key={starPosition}
                                className={`size-4 ${
                                  starPosition <= review.rating
                                    ? "fill-accent-gold text-accent-gold"
                                    : "fill-transparent text-border-strong"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-border-subtle bg-background-primary px-3 py-1 text-[11px] font-semibold text-text-secondary">
                            <T text={"Color"} />: {review.color}
                          </span>
                          <span className="rounded-full border border-border-subtle bg-background-primary px-3 py-1 text-[11px] font-semibold text-text-secondary">
                            <T text={"Size"} />: {review.size}
                          </span>
                        </div>

                        <blockquote className="mt-4 flex-1 text-sm leading-7 text-text-primary">
                          “{review.body}”
                        </blockquote>

                        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4 text-[11px] text-text-secondary">
                          <time dateTime={review.date}><LocalizedDate value={review.date} /></time>
                          <span className="inline-flex items-center gap-1.5">
                            <ThumbsUp className="size-3.5" aria-hidden="true" />
                            <T text={"Helpful"} /> ({review.helpfulCount})
                          </span>
                        </footer>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="border-b border-border-subtle py-12 sm:py-16">
        <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}><T text={"CONFIDENCE IN MIND"} /></span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mt-2 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Frequently Asked Questions"} />
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              <T text={"Clear answers before you order."} />
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
      <section className="relative overflow-hidden border-t border-border-subtle py-16 text-center sm:py-20">
        <Container className={`${PRODUCT_PAGE_CONTAINER_CLASS} relative z-10 space-y-6`}>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent-gold)" }}><T text={finalEyebrow} /></span>
          <h2
            className="text-3xl md:text-5xl font-semibold text-text-primary max-w-xl mx-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <T text={finalTitle} />
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            <T
              text={
                canCheckout
                  ? "Review the product details and confirm the final order total before checkout."
                  : checkoutPending
                    ? "Checking availability"
                  : stockUnavailable
                    ? "Checkout is temporarily unavailable. Please contact us before ordering or try again later."
                    : "Compare every color now; final price, sizes and ordering will appear here after verification."
              }
            />
          </p>
          
          {canCheckout ? (
          <div className="pt-4 max-w-sm mx-auto">
            <a
              href={checkoutUrl}
              onClick={() => handleCheckoutClick("final-cta")}
              className="flex min-h-14 w-full flex-wrap items-center justify-center gap-1 rounded-xl px-4 py-3 text-center text-sm font-extrabold leading-tight text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] shadow-[0_0_20px_rgba(201,169,110,0.2)] sm:text-base"
              style={{ background: "var(--accent-gold)" }}
            >
              <span><T text={checkoutLabel} /></span>
              <span>{selectedSubtotalPrice}</span>
            </a>
            <p className="text-[10px] text-text-secondary mt-3">
              <T text={"Secure checkout · Delivery and return terms shown before purchase"} />
            </p>
          </div>
          ) : checkoutPending ? (
            <div className="mx-auto flex min-h-14 max-w-sm items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-4 py-3 text-sm font-bold text-text-secondary" role="status">
              <span className="size-4 animate-spin rounded-full border-2 border-border-strong border-t-accent-gold" aria-hidden="true" />
              <T text={"Checking availability"} />
            </div>
          ) : (
            <div className="mx-auto max-w-sm pt-4">
              <LocalizedLink
                href="/contact"
                className="flex min-h-14 w-full items-center justify-center rounded-xl border border-accent-gold bg-accent-gold/10 px-4 py-3 text-center text-sm font-extrabold text-accent-gold transition hover:bg-accent-gold hover:text-black"
              >
                <T text={stockUnavailable ? "Contact support before ordering" : "Ask about availability"} />
              </LocalizedLink>
              <p className="mt-3 text-[10px] text-text-secondary">
                <T
                  text={
                    stockUnavailable
                      ? "Ordering will reopen as soon as checkout is available again."
                      : "Ordering remains closed until every size and color is mapped to the correct checkout variant."
                  }
                />
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle py-12 sm:py-16">
          <Container className={PRODUCT_PAGE_CONTAINER_CLASS}>
            <h2
              className="text-2xl md:text-3xl font-semibold text-text-primary text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={relatedHeading} />
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((rel) => {
                const relDiscount = rel.compareAtPrice > rel.price
                  ? Math.round((1 - rel.price / rel.compareAtPrice) * 100)
                  : 0;
                return (
                  <LocalizedLink
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
                          <span className="text-sm font-extrabold text-accent-gold">
                            {formatShopPrice(rel.price, rel.currency, locale)}
                          </span>
                          {rel.compareAtPrice > rel.price && (
                            <span className="text-[10px] line-through text-text-secondary">
                              {formatShopPrice(rel.compareAtPrice, rel.currency, locale)}
                            </span>
                          )}
                        </div>
                        {relDiscount > 0 && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                            -{relDiscount}<T text={"% Off"} />
                          </span>
                        )}
                      </div>
                    </div>
                  </LocalizedLink>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Not ready to buy yet? Capture the email — free channel, no ad spend required */}
      <NewsletterBlock />

      {/* 12. RESPONSIVE FLOATING BOTTOM STICKY CHECKOUT DRAWER */}
      {canCheckout && (
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border-default bg-surface-glass px-2 py-3.5 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] backdrop-blur-lg transition-transform duration-500 ease-out sm:px-4 ${
          showStickyDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Container className="w-full flex items-center justify-between gap-4 max-w-4xl px-0">
          <div className="flex items-center gap-3">
            <div className="relative size-11 rounded-lg overflow-hidden shrink-0 border border-border-subtle hidden sm:block">
              <Image src={stickyImage} alt={selectedVariant?.imageAlt ?? product.name} fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-bold text-text-primary truncate max-w-[150px] md:max-w-xs">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-extrabold text-accent-gold">{selectedSubtotalPrice}</span>
                {hasDiscount && (
                  <span className="text-[10px] line-through text-text-secondary">{selectedCompareAtSubtotalPrice}</span>
                )}
                <span className="text-[10px] font-bold text-text-secondary">x{selectedQuantity}</span>
                {selectedSize && (
                  <span className="hidden text-[10px] font-semibold text-text-secondary sm:inline">· {selectedSize.label}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {trustBadgeLabel && (
              <div className="hidden md:flex items-center gap-1 bg-surface-subtle border border-border-subtle px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider text-accent-gold">
                <ShieldCheck className="size-3" />
                <span><T text={trustBadgeLabel} /></span>
              </div>
            )}

            <a
              href={checkoutUrl}
              onClick={() => handleCheckoutClick("sticky-drawer")}
              className="flex min-h-10 max-w-[168px] items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-center text-xs font-extrabold leading-tight text-black transition-all hover:opacity-90 active:scale-[0.98] shadow-lg md:max-w-none md:text-sm"
              style={{ background: "var(--accent-gold)" }}
            >
              <span className="min-w-0"><T text={checkoutLabel} /></span>
              <ChevronRight className="size-4" />
            </a>
          </div>
        </Container>
      </div>
      )}

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
                <T text={"Image"} /> {lightboxIndex + 1} <T text={"of"} /> {heroMedia.length}
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
              {heroMedia.map((img, idx) => (
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
                    src={heroThumbSrc(img)}
                    alt={img.label}
                    fill
                    sizes="10vw"
                    className={`object-cover ${img.filter || ""}`}
                  />
                  {img.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="size-5 fill-white text-white" aria-hidden="true" />
                    </span>
                  )}
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
                onClick={() => setLightboxIndex(prev => (prev - 1 + heroMedia.length) % heroMedia.length)}
                className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-surface-glass hover:bg-black/80 text-text-primary border border-border-subtle hover:border-border-strong hover:scale-105 transition-all shadow-xl"
                title={text("Previous image (Left Arrow)")}
              >
                <ChevronLeft className="size-5 md:size-6" />
              </button>

              {/* Main Rendered Image Container */}
              <div className="relative w-full h-full max-w-xl aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle">
                {lightboxItem.type === "video" ? (
                  <video
                    key={lightboxItem.url}
                    src={lightboxItem.url}
                    poster={lightboxItem.poster ?? product.image}
                    controls
                    loop
                    muted
                    autoPlay
                    playsInline
                    preload="metadata"
                    aria-label={`${product.name}: ${text("customer demonstration")}`}
                    className="absolute inset-0 size-full bg-black object-contain"
                  >
                    <T text={"Your browser does not support the video tag."} />
                  </video>
                ) : (
                  <Image
                    src={lightboxItem.url}
                    alt={heroMediaAlt(lightboxItem)}
                    fill
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    priority
                    className={`object-contain transition-all duration-500 p-2 md:p-6 ${lightboxItem.filter || ""}`}
                  />
                )}

                {/* Badge Overlay */}
                <Badge
                  variant="product"
                  className="absolute top-4 left-4 px-4 py-1.5 text-xs font-bold"
                >
                  {lightboxItem.badge}
                </Badge>
              </div>

              {/* Right Navigation Arrow */}
              <button
                onClick={() => setLightboxIndex(prev => (prev + 1) % heroMedia.length)}
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
                {lightboxItem.label}
              </h4>
              <p className="text-xs text-text-primary/80 leading-relaxed">
                {lightboxItem.desc}
              </p>
              {canCheckout && <div className="border-t border-border-subtle pt-4 mt-2 hidden lg:block">
                <a
                  href={checkoutUrl}
                  onClick={() => handleCheckoutClick("lightbox")}
                  className="flex min-h-10 w-full flex-wrap items-center justify-center gap-1 rounded-lg px-3 py-2 text-center text-xs font-extrabold leading-tight text-black bg-accent-gold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <span><T text={checkoutLabel} /></span>
                  <span>{selectedSubtotalPrice}</span>
                </a>
              </div>}
            </div>

          </div>

          {/* Bottom Bar: Mobile indicators */}
          <div className="flex lg:hidden items-center justify-center gap-2 pb-2">
            {heroMedia.map((_, idx) => (
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
