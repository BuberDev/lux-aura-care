"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import {
  Check, Truck, ShieldCheck, RotateCcw,
  ChevronLeft, ChevronRight, Flame, Sparkles, ArrowRight,
  ShieldAlert, Award, Play, Share2, X
} from "lucide-react";
import { Container } from "@/components/container";
import { AffiliateLink } from "@/components/affiliate-link";
import { getAffiliateRoute } from "@/lib/affiliate";
import type { Product, ProductProof } from "@/lib/site-data";
import type { ProductPageContent } from "@/lib/product-page-content";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";
import { localizeContent } from "@/lib/i18n/messages";
import type { ProductDisplayPrice } from "@/lib/currency";

type FavoritesProductSalesProps = {
  product: Product;
  proof: ProductProof;
  content: ProductPageContent;
  related: Product[];
  displayPrice: ProductDisplayPrice | null;
};

const PRODUCT_VIDEOS: Record<string, string> = {
  "gua-sha-set": "/gua-sha-set/UGC-short-BAIMEI_IcyMe_Jade_Roller_GuaSha.mp4",
  "aroma-diffuser": "/aroma-diffuser/ugc-short-ceramic-ultrasonic-diffuser.mp4",
  "silk-sleep-mask": "/silk-sleep-mask/ugc-short-silk-mask.mp4",
  "mixsoon-bean-essence": "/mixsoon-bean-essence/short-ugc-mixoon-Bean-Essence.mp4",
  "gold-eye-patches": "/gold-eye-patches/ugc-Gold_Collagen_Eye_Patches.mp4",
  "centella-collagen-sleep-masks": "/centella-collagen-sleep-masks/ugc-Centella-Collagen-Sleep-Mask.mp4",
  "vibro-glow-face-massager": "/vibro-glow-face-massager/ugc-Vibro-Glow_Face_Massager.mp4",
  "scalp-massager": "/scalp-massager/ugc-Scalp-Massager-Shampoo-Brush.mp4",
  "niacinamide-toner": "/niacinamide-toner/ugc-short-Naturium_Niacinamide_Face_Serum.mp4",
  "magnesium-supplement": "/magnesium-supplement/ugc-short-Pure_Encapsulations_Magnesium_Glycinate.mp4",
  "aveeno-oil-mist": "/aveeno-oil-mist/ugc-short-aveeno-daily-body-oil.mp4",
  "pavilia-plush-robe": "/pavilia-plush-robe/ugc-short-PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.mp4",
  "cliganic-essential-oils": "/cliganic-essential-oils/ugc-short-cliganic-organic-aromath-oils-set.mp4",
  "copper-water-bottle": "/copper-water-bottle/ugc-short-Copper_Water_Bottle_model.mp4",
  "coslus-cleansing-brush": "/coslus-cleansing-brush/ugc-short-cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpeg.mp4",
};

const VISIBLE_GALLERY_IMAGES = 5;

export function FavoritesProductSales({ product, proof, content, related, displayPrice }: FavoritesProductSalesProps) {
  const { locale, text } = useI18n();
  const usesAmazonCom = locale === "pl" && product.activeMarket === "us";
  const videoUrl = product.video !== undefined ? product.video : PRODUCT_VIDEOS[product.id];
  const [activeTab, setActiveTab] = useState(0);
  const [galleryModalIndex, setGalleryModalIndex] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const isGalleryModalOpen = galleryModalIndex !== null;

  useEffect(() => {
    const isModalOpen = isGalleryModalOpen || isVideoModalOpen;
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGalleryModalIndex(null);
        setIsVideoModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryModalOpen, isVideoModalOpen]);

  // Show sticky CTA bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gallery tabs images — always start with the main product image,
  // then append any additional gallery shots. This guarantees galleryImages
  // is never empty even when the product defines gallery: [] or undefined.
  const mainGalleryEntry = { image: product.image, imageAlt: product.imageAlt, title: "Main View" };
  const extraGallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : localizeContent(locale, [
        {
          image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=800&q=80",
          imageAlt: product.imageAlt,
          title: "Strefa Pielęgnacji",
        },
        {
          image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
          imageAlt: product.imageAlt,
          title: "Sensoryczny Rytuał",
        },
      ]);
  const galleryImages = [mainGalleryEntry, ...extraGallery];
  const visibleGalleryImages = galleryImages.slice(0, VISIBLE_GALLERY_IMAGES);
  const hiddenGalleryCount = Math.max(galleryImages.length - VISIBLE_GALLERY_IMAGES, 0);

  const openGalleryAt = (index: number) => {
    setActiveTab(index);
    setGalleryModalIndex(index);
  };

  const shiftGalleryModal = (direction: -1 | 1) => {
    setGalleryModalIndex((current) => {
      if (current === null) return 0;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.benefit,
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

  return (
    <div className="min-h-screen text-text-primary font-sans bg-background-primary">
      {/* Transparent affiliate disclosure */}
      <div className="bg-accent-gold text-black text-xs font-bold py-2.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 relative z-10">
        <Sparkles className="size-4" />
        <span>
          {locale === "pl"
            ? "Rekomendacja redakcyjna Lux Aura · Link partnerski · Zakup finalizujesz w Amazon"
            : "Lux Aura editorial recommendation · Affiliate link · Checkout completed on Amazon"}
        </span>
        <Sparkles className="size-4" />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border-subtle py-3 px-4 bg-surface-base">
        <Container>
          <nav className="text-xs flex gap-2 text-text-secondary">
            <LocalizedLink href="/" className="hover:text-text-primary transition-colors"><T text={"Home"} /></LocalizedLink>
            <span>/</span>
            <LocalizedLink href="/favorites" className="hover:text-text-primary transition-colors"><T text={"Ulubione"} /></LocalizedLink>
            <span>/</span>
            <span className="text-text-primary truncate">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Main Luxury Product Section */}
      <section className="py-10 md:py-16 px-4 bg-surface-base">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

            {/* LEFT COLUMN: Premium Interactive Gallery Switcher */}
            <div
              className="mx-auto max-w-[520px]"
              style={{ width: "min(520px, calc(100vw - 3.5rem))" }}
            >
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:gap-3">
                <div className="col-start-2">
                  <div
                    id="product-gallery-image"
                    className="relative aspect-square overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle"
                  >
                    <button
                      type="button"
                      onClick={() => openGalleryAt(activeTab)}
                      className="absolute inset-0 z-0 cursor-zoom-in"
                      aria-label={text("Click to see full view")}
                    >
                      <Image
                        src={galleryImages[activeTab].image}
                        alt={galleryImages[activeTab].imageAlt}
                        fill
                        priority
                        sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 440px, 40vw"
                        className="object-contain transition-all duration-500 ease-out"
                      />
                    </button>

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

                  <button
                    type="button"
                    onClick={() => openGalleryAt(activeTab)}
                    className="mt-2 w-full text-center text-xs font-medium text-accent-gold transition hover:text-text-primary"
                  >
                    {text("Click to see full view")}
                  </button>
                </div>

                {/* Amazon-style thumbnail rail */}
                <div
                  className="col-start-1 row-start-1 flex flex-col gap-1.5 sm:gap-2"
                  aria-label={`${product.name}: ${text("Product gallery")}`}
                >
                  {visibleGalleryImages.map((img, i) => (
                    <button
                      key={img.image}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      onMouseEnter={() => setActiveTab(i)}
                      aria-label={img.title}
                      aria-pressed={activeTab === i}
                      aria-controls="product-gallery-image"
                      title={img.title}
                      className={`theme-on-image relative size-10 shrink-0 overflow-hidden rounded-md border-2 bg-surface-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold sm:size-14 sm:rounded-lg ${activeTab === i
                        ? "border-accent-gold shadow-[0_0_0_1px_rgba(201,169,110,0.2)]"
                        : "border-border-subtle opacity-80 hover:border-border-strong hover:opacity-100"
                        }`}
                    >
                      <Image src={img.image} alt="" fill sizes="(max-width: 639px) 40px, 56px" className="object-contain" />
                    </button>
                  ))}

                  {hiddenGalleryCount > 0 && (
                    <button
                      type="button"
                      onClick={() => openGalleryAt(VISIBLE_GALLERY_IMAGES)}
                      className={`theme-on-image relative size-10 shrink-0 overflow-hidden rounded-md border-2 bg-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold sm:size-14 sm:rounded-lg ${activeTab >= VISIBLE_GALLERY_IMAGES ? "border-accent-gold" : "border-border-subtle"
                        }`}
                      aria-label={`${hiddenGalleryCount} ${text("Additional images")}`}
                      aria-controls="product-gallery-image"
                    >
                      <Image
                        src={galleryImages[VISIBLE_GALLERY_IMAGES].image}
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

                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(true)}
                      className="theme-on-image relative size-10 shrink-0 overflow-hidden rounded-md border-2 border-border-subtle bg-black transition hover:border-accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold sm:size-14 sm:rounded-lg"
                      aria-label={text("Play product video")}
                    >
                      <Image src={product.image} alt="" fill sizes="(max-width: 639px) 40px, 56px" className="object-cover opacity-30" />
                      <Play className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 fill-white text-white sm:size-6" aria-hidden="true" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-center text-[7px] font-bold uppercase tracking-wide text-white">
                        {text("1 video")}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Luxury Conversion Panel */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2 text-accent-gold font-semibold">
                  <T text={"Ulubieńcy Pinteresta ·"} /> {product.trustSignal}
                </p>
                <h1
                  className="text-3xl md:text-5xl font-semibold text-text-primary tracking-tight leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-base text-text-secondary mt-3 leading-relaxed">
                  {content.emotionalHook}
                </p>
              </div>

              <div className="flex items-center gap-3 border-y border-border-subtle py-3 text-sm text-text-secondary">
                <ShieldCheck className="size-4 text-accent-gold" aria-hidden="true" />
                <span>
                  {locale === "pl"
                    ? "Dobór redakcyjny — szczegóły oferty potwierdzisz w Amazon"
                    : "Editorial pick — confirm listing details on Amazon"}
                </span>
              </div>

              {/* Market-aware price estimate */}
              <div className="rounded-2xl border border-accent-gold/20 p-5 bg-accent-gold/[0.02] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold tracking-widest uppercase">
                      {displayPrice?.status === "verified"
                        ? locale === "pl" ? "Ostatnio sprawdzona cena" : "Last checked price"
                        : product.activeMarket === "pl"
                          ? locale === "pl" ? "Cena na Amazon.pl" : "Amazon.pl price"
                          : locale === "pl" ? "Cena orientacyjna Amazon.com" : "Indicative Amazon.com price"}
                    </span>
                    <p className="text-3xl font-bold text-text-primary mt-2">
                      {displayPrice?.formatted ?? (locale === "pl" ? "Sprawdź cenę na Amazon.pl" : "Check price on Amazon")}
                    </p>
                    {displayPrice?.approximateLocalPrice ? (
                      <p className="mt-1 text-sm font-semibold text-accent-gold">
                        około {displayPrice.approximateLocalPrice.formatted}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-accent-gold/15 text-accent-gold">
                      {product.activeMarket === "pl" ? "Amazon.pl" : "Amazon.com"}
                    </span>
                    <p className="text-[10px] text-text-secondary mt-1">
                      {locale === "pl" ? "Cena końcowa w sklepie" : "Final price in store"}
                    </p>
                  </div>
                </div>
                <p className="rounded-xl border border-border-subtle bg-surface-subtle p-3 text-xs leading-relaxed text-text-secondary">
                  {product.activeMarket === "pl" && !displayPrice
                    ? locale === "pl"
                      ? "Nie przeliczamy ceny innego produktu z Amazon.com. Aktualną cenę tego produktu sprawdzisz bezpośrednio na Amazon.pl."
                      : "No marketplace price is stored. Check the current price directly on Amazon.pl."
                    : displayPrice?.approximateLocalPrice
                      ? `${locale === "pl" ? "Pomocnicze przeliczenie ceny Amazon.com" : "Approximate Amazon.com conversion"} · ${displayPrice.approximateLocalPrice.source} · ${displayPrice.approximateLocalPrice.updatedAt}. ${locale === "pl" ? "Nie jest to cena produktu na Amazon.pl." : "This is not an Amazon.pl product price."}`
                      : product.activeMarket === "pl" && displayPrice?.checkedAt
                        ? `${locale === "pl" ? "Cena Amazon.pl sprawdzona" : "Amazon.pl price checked"}: ${displayPrice.checkedAt}. ${locale === "pl" ? "Potwierdź aktualną kwotę przed zakupem." : "Confirm the current amount before purchase."}`
                        : locale === "pl"
                          ? "Cena ma charakter orientacyjny. Aktualną kwotę, dostępność i koszt dostawy potwierdzisz na Amazon."
                          : "Indicative price. Confirm the current total, availability, and delivery cost on Amazon."}
                </p>
              </div>

              {/* Highlights Bullet List */}
              <ul className="space-y-3 pt-2">
                {proof.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm text-text-primary/85" style={{ lineHeight: "1.5" }}>
                    <Check className="size-4 mt-0.5 shrink-0 text-accent-gold" />
                    <span><T text={highlight} /></span>
                  </li>
                ))}
              </ul>

              {/* Primary Direct Affiliate Amazon CTA */}
              <div className="space-y-3 pt-3">
                <AffiliateLink
                  href={getAffiliateRoute(product.id, "product-hero-premium")}
                  className="block w-full text-center py-4 rounded-xl text-base font-bold text-black transition-all bg-accent-gold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent-gold/10"
                >
                  <T text={"Sprawdź Cenę i Kup Teraz na Amazon"} />
                </AffiliateLink>
                <p className="text-center text-xs text-text-secondary flex items-center justify-center gap-1.5">
                  {usesAmazonCom
                    ? "🌍 Amazon.com · sklep zagraniczny · warunki zobaczysz przed przejściem"
                    : locale === "pl"
                      ? "Link partnerski · cenę, dostawę i warunki zwrotu potwierdzisz na Amazon.pl"
                      : "Affiliate link · confirm price, delivery, and returns on Amazon"}
                </p>
              </div>

              {/* Delivery trust signals strip */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle">
                {(usesAmazonCom
                  ? [
                      { icon: Truck, text: locale === "pl" ? "Możliwa wysyłka międzynarodowa" : "International delivery may be available" },
                      { icon: ShieldCheck, text: locale === "pl" ? "Warunki sprzedawcy" : "Seller terms apply" },
                      { icon: RotateCcw, text: locale === "pl" ? "Cena może być w USD" : "Price may be in USD" },
                    ]
                  : [
                      { icon: Truck, text: locale === "pl" ? "Dostawa według oferty" : "Delivery per listing" },
                      { icon: ShieldCheck, text: locale === "pl" ? "Zakup w Amazon.pl" : "Checkout on Amazon.pl" },
                      { icon: RotateCcw, text: locale === "pl" ? "Zwroty według oferty" : "Returns per listing" },
                    ]).map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 text-center rounded-xl border border-border-subtle p-3 bg-surface-subtle">
                    <Icon className="size-4 text-accent-gold" />
                    <span className="text-[10px] text-text-secondary font-medium leading-tight"><T text={text} /></span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* BENEFIT STRIP (Quick benefits) */}
      <section className="border-y border-border-subtle py-8 px-4 bg-background-primary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {content.quickBenefits.map((benefit, idx) => (
              <div key={benefit} className="flex items-center gap-3 justify-center text-center md:text-left">
                <span className="size-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-xs font-bold text-accent-gold">
                  0{idx + 1}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-text-primary/90"><T text={benefit} /></span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROBLEM & SOLUTION BEFORE/AFTER COMPARISON */}
      <section className="py-16 px-4 bg-surface-base border-b border-border-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Pielęgnacja Celowana"} /></p>
            <h2 className="text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Dlaczego ten rytuał ma znaczenie?"} />
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* The Problem */}
            <div className="rounded-2xl border border-red-950/20 p-6 bg-red-950/[0.02] space-y-4">
              <div className="flex items-center gap-2 text-red-500 text-sm font-semibold uppercase tracking-wider">
                <ShieldAlert className="size-5" />
                <span><T text={"Problem Pielęgnacyjny"} /></span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary"><T text={content.problemHeadline} /></h3>
              <p className="text-sm leading-relaxed text-text-secondary"><T text={content.problemParagraph} /></p>
            </div>

            {/* The Solution */}
            <div className="rounded-2xl border border-accent-gold/20 p-6 bg-accent-gold/[0.02] space-y-4">
              <div className="flex items-center gap-2 text-accent-gold text-sm font-semibold uppercase tracking-wider">
                <Award className="size-5" />
                <span><T text={"Rekomendacja Lux Aura"} /></span>
              </div>
              <h3 className="text-xl font-semibold text-accent-gold"><T text={"Natychmiastowy reset zmysłowy"} /></h3>
              <p className="text-sm leading-relaxed text-text-primary/85">
                <T text={"Zastąp stres świadomym rytuałem,"} /> <T text={content.solutionParagraph} />
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* DETAILED SCIENCE BENEFITS DEEP-DIVE */}
      <section className="py-16 px-4 bg-surface-base">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={content.deepDivePretitle} /></p>
              <h2 className="text-4xl font-semibold font-heading text-text-primary" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <T text={content.deepDiveTitle} />
              </h2>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative">
              {/* Left badges */}
              <div className="flex flex-col gap-8 w-full lg:w-1/3 order-2 lg:order-1 relative z-10">
                {content.detailedBenefits.slice(0, 2).map((benefit, idx) => (
                  <div key={benefit.title} className="bg-surface-glass border border-border-subtle p-5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                    <div className="flex flex-col items-center text-center">
                      <div className="size-12 rounded-full bg-accent-gold/15 flex items-center justify-center mb-3">
                        {idx === 0 ? <Sparkles className="size-5 text-accent-gold" /> : <ShieldCheck className="size-5 text-accent-gold" />}
                      </div>
                      <h4 className="font-bold text-text-primary mb-1"><T text={benefit.title} /></h4>
                      <p className="text-xs text-text-secondary leading-relaxed"><T text={benefit.description} /></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Center Image */}
              <div className="w-full max-w-[300px] lg:w-1/3 order-1 lg:order-2 flex justify-center relative">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-accent-gold/5 blur-3xl md:scale-150"></div>
                <div className="relative aspect-square w-full rounded-full overflow-hidden border-8 border-surface-subtle shadow-2xl bg-surface-base">
                  <Image src={product.image} alt={product.imageAlt} fill sizes="300px" className="object-cover" />
                </div>
              </div>

              {/* Right badges */}
              <div className="flex flex-col gap-8 w-full lg:w-1/3 order-3 relative z-10">
                {content.detailedBenefits.slice(2, 4).map((benefit, idx) => (
                  <div key={benefit.title} className="bg-surface-glass border border-border-subtle p-5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                    <div className="flex flex-col items-center text-center">
                      <div className="size-12 rounded-full bg-accent-gold/15 flex items-center justify-center mb-3">
                        {idx === 0 ? <Flame className="size-5 text-accent-gold" /> : <Award className="size-5 text-accent-gold" />}
                      </div>
                      <h4 className="font-bold text-text-primary mb-1"><T text={benefit.title} /></h4>
                      <p className="text-xs text-text-secondary leading-relaxed"><T text={benefit.description} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* THE 3-STEP SENSORY RITUAL */}
      <section className="border-t border-border-subtle py-16 px-4 bg-background-primary">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Sztuka Pielęgnacji"} /></p>
            <h2 className="text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={content.ritualTitle} />
            </h2>
            <p className="text-sm text-text-secondary mt-2"><T text={"Przeprowadź swój rytuał z pełną uwagą i wyciszeniem."} /></p>
          </div>

          {videoUrl ? (
            <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto items-center">
              <div className="space-y-6">
                {content.ritualSteps.map((step, idx) => (
                  <div key={step.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-subtle relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-accent-gold/5 to-transparent rounded-tr-2xl" />
                    <span className="size-8 rounded-full bg-accent-gold text-black font-bold flex items-center justify-center text-sm mb-4">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-text-primary mb-2"><T text={step.title} /></h3>
                    <p className="text-sm leading-relaxed text-text-secondary"><T text={step.description} /></p>
                  </div>
                ))}
              </div>
              <div className="relative aspect-[9/16] w-full max-w-[360px] mx-auto rounded-[2rem] overflow-hidden border-[8px] border-surface-subtle shadow-2xl bg-black">
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  controlsList="nodownload"
                  poster={product.image}
                  preload="metadata"
                  aria-label={`${product.name}: ${text("customer demonstration")}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {content.ritualSteps.map((step, idx) => (
                <div key={step.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-subtle relative overflow-hidden group">
                  <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-accent-gold/5 to-transparent rounded-tr-2xl" />
                  <span className="size-8 rounded-full bg-accent-gold text-black font-bold flex items-center justify-center text-sm mb-4">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-text-primary mb-2"><T text={step.title} /></h3>
                  <p className="text-sm leading-relaxed text-text-secondary"><T text={step.description} /></p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Final transparent CTA section */}
      <section className="border-t border-border-subtle py-16 px-4 text-center bg-surface-base">
        <Container>
          <div className="max-w-xl mx-auto space-y-6">
            {/* Editorial badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
              <Award className="size-4" />
              <span>
                {usesAmazonCom
                  ? "Amazon.com · sklep zagraniczny"
                  : locale === "pl" ? "Rekomendacja redakcyjna" : "Editorial recommendation"}
              </span>
            </div>

            <h2
              className="text-3xl font-semibold text-text-primary leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Rozpocznij swój wieczorny rytuał wyciszenia"} />
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {usesAmazonCom
                ? "Produkt jest dostępny na Amazon.com. Przed przejściem pokażemy informacje o walucie, dostawie do Polski i warunkach zwrotu."
                : locale === "pl"
                  ? "Sprawdź aktualną ofertę, dostępność, dostawę i zasady zwrotu bezpośrednio na Amazon.pl."
                  : "Check the current offer, availability, delivery, and return terms directly on Amazon."}
            </p>

            <div className="pt-2">
              <AffiliateLink
                href={getAffiliateRoute(product.id, "product-final-cta-premium")}
                className="inline-block px-10 py-4 rounded-xl text-base font-bold text-black transition-all bg-accent-gold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent-gold/10"
              >
                <T text={"Sprawdź Ofertę na Amazon"} />
              </AffiliateLink>
            </div>
          </div>
        </Container>
      </section>

      {/* RELATED FAVORITES */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle py-14 px-4 bg-surface-base">
          <Container>
            <h2
              className="text-2xl font-semibold text-text-primary text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Inne ulubione z tej kategorii"} />
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((rel) => (
                <LocalizedLink
                  key={rel.id}
                  href={`/favorites/${rel.slug}`}
                  className="group flex min-w-0 gap-4 rounded-xl border border-border-subtle bg-surface-base p-4 transition-all hover:border-border-default"
                >
                  <div className="relative size-20 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-surface-subtle">
                    <Image src={rel.image} alt={rel.imageAlt} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-gold transition-colors">
                      {rel.name}
                    </p>
                    <p className="text-xs mt-1 text-text-secondary line-clamp-1">{rel.benefit}</p>
                    <p className="text-xs font-semibold mt-2 text-accent-gold flex items-center gap-1">
                      <T text={"Sprawdź szczegóły"} /> <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </Container>
        </section>
      )}

      {galleryModalIndex !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name}: ${text("Product gallery")}`}
        >
          <button
            type="button"
            onClick={() => setGalleryModalIndex(null)}
            className="absolute inset-0 cursor-default"
            aria-label={text("Close gallery")}
          />

          <div className="relative z-10 w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setGalleryModalIndex(null)}
              className="absolute right-0 top-0 z-20 flex size-11 -translate-y-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:bg-black"
              aria-label={text("Close gallery")}
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="relative h-[min(78svh,800px)] overflow-hidden rounded-xl bg-white">
              <Image
                src={galleryImages[galleryModalIndex].image}
                alt={galleryImages[galleryModalIndex].imageAlt}
                fill
                sizes="95vw"
                className="object-contain"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => shiftGalleryModal(-1)}
                    className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    aria-label={text("Previous image")}
                  >
                    <ChevronLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftGalleryModal(1)}
                    className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    aria-label={text("Next image")}
                  >
                    <ChevronRight className="size-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <p className="mt-3 text-center text-sm text-white/80">
              {galleryImages[galleryModalIndex].title} · {galleryModalIndex + 1}/{galleryImages.length}
            </p>
          </div>
        </div>
      )}

      {isVideoModalOpen && videoUrl && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name}: ${text("Product video")}`}
        >
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute inset-0 cursor-default"
            aria-label={text("Close video")}
          />

          <div className="relative z-10 w-full max-w-[420px]">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute right-0 top-0 z-20 flex size-11 -translate-y-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:bg-black"
              aria-label={text("Close video")}
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <video
              src={videoUrl}
              autoPlay
              controls
              playsInline
              poster={product.image}
              className="aspect-[9/16] max-h-[82svh] w-full rounded-2xl bg-black object-contain shadow-2xl"
              aria-label={`${product.name}: ${text("customer demonstration")}`}
            />
          </div>
        </div>
      )}

      {/* FLOATING STICKY CHECKOUT DRAWER */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-surface-glass backdrop-blur-md border-t border-border-subtle py-3.5 px-4 z-50 transition-all duration-500 transform ${showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-surface-subtle hidden sm:block">
                <Image src={product.image} alt={product.imageAlt} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary truncate max-w-[240px] md:max-w-[400px]">
                  {product.name}
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                  {product.activeMarket === "pl" ? "Amazon.pl" : "Amazon.com"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <AffiliateLink
                href={getAffiliateRoute(product.id, "product-sticky-premium")}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-black bg-accent-gold hover:opacity-95 transition-all text-center"
              >
                <T text={"Sprawdź na Amazon"} />
              </AffiliateLink>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
