"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  product: HeroProduct;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

export type HeroProduct = {
  src: string;
  alt: string;
  name: string;
};

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ product, index, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={product.src}
            alt={product.alt}
            fill
            sizes="120px"
            className="object-cover"
            priority={index < 8}
          />
        </div>
        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-black/80 flex flex-col items-center justify-center p-4 border border-white/20"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a96e" }}>
              Product
            </p>
            <p
              className="text-[9px] font-medium leading-tight text-white"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
              }}
            >
              {product.name}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Product images ---
const HERO_IMAGE_COUNT = 20;
const MAX_SCROLL = 3000;

const FALLBACK_PRODUCTS: HeroProduct[] = [
  {
    src: "/Naturium_Niacinamide_Face_Serum_12.png",
    alt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
    name: "Naturium Niacinamide Face Serum 12% Plus Zinc 2%",
  },
  {
    src: "/BAIMEI_IcyMe_Jade_Roller_GuaSha.png",
    alt: "Rose quartz gua sha and roller set product image",
    name: "Rose Quartz Gua Sha Set",
  },
  {
    src: "/cover_aveeno_oil.png",
    alt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
    name: "Aveeno Daily Moisturizing Body Oil Mist",
  },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

type ScrollMorphHeroProps = {
  products: HeroProduct[];
};

export default function ScrollMorphHero({ products }: ScrollMorphHeroProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const heroProducts = useMemo(() => {
    const source = products.length > 0 ? products : FALLBACK_PRODUCTS;

    return Array.from({ length: HERO_IMAGE_COUNT }, (_, index) => source[index % source.length]);
  }, [products]);
  const totalImages = heroProducts.length;

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  // --- Scroll-linked animation ---
  const virtualScroll = useMotionValue(0);

  useEffect(() => {
    let frame = 0;

    const updateScroll = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const container = containerRef.current;
        if (!container) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const activeDistance = Math.max(rect.height * 0.72, viewportHeight * 0.5);
        const progress = clamp((viewportHeight * 0.12 - rect.top) / activeDistance);

        virtualScroll.set(progress * MAX_SCROLL);
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // --- Random Scatter ---
  const scatterPositions = useMemo(() => {
    return heroProducts.map((_, index) => ({
      x: (seededUnit(index, 1) - 0.5) * 1500,
      y: (seededUnit(index, 2) - 0.5) * 1000,
      rotation: (seededUnit(index, 3) - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, [heroProducts]);

  // --- Render State ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#030303", touchAction: "pan-y" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, rgba(201,169,110,0.10) 0%, transparent 31%), linear-gradient(220deg, rgba(255,255,255,0.055) 0%, transparent 30%), linear-gradient(180deg, #020202 0%, #080706 48%, #020202 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16] mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.62'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute inset-x-[-14%] top-[3%] h-[70%] -rotate-3 border-y border-white/10 opacity-80 shadow-[inset_0_1px_0_rgba(255,255,255,0.20),inset_0_-1px_0_rgba(255,255,255,0.06),0_48px_160px_rgba(201,169,110,0.08)] backdrop-blur-3xl"
          style={{
            background:
              "linear-gradient(112deg, transparent 0%, rgba(255,255,255,0.030) 16%, rgba(255,255,255,0.105) 37%, rgba(201,169,110,0.075) 55%, rgba(255,255,255,0.035) 72%, transparent 100%)",
            borderRadius: "52% 48% 50% 46% / 22% 30% 24% 34%",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 13%, black 87%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 13%, black 87%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-[-18%] bottom-[-30%] h-[62%] rotate-2 border-t border-white/10 opacity-65 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_-42px_150px_rgba(255,255,255,0.035)] backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(8deg, rgba(255,255,255,0.070) 0%, rgba(255,255,255,0.018) 39%, transparent 76%)",
            borderRadius: "48% 52% 0 0 / 38% 32% 0 0",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 28%, black 72%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 28%, black 72%, transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[36%] h-[32%] backdrop-blur-[1.5px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.70) 24%, rgba(0,0,0,0.76) 50%, rgba(0,0,0,0.70) 76%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, transparent 20%, transparent 74%, rgba(0,0,0,0.70) 100%), linear-gradient(90deg, rgba(0,0,0,0.62) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.62) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center perspective-1000">

        {/* Intro Text */}
        <div className="absolute z-30 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="max-w-[min(760px,90vw)] text-3xl font-medium tracking-tight text-white md:text-6xl"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: "0 2px 22px rgba(0,0,0,0.92), 0 0 48px rgba(201,169,110,0.18)",
            }}
          >
            Elevate your evening ritual.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-xs font-bold tracking-[0.2em]"
            style={{
              color: "#c9a96e",
              textShadow: "0 1px 18px rgba(0,0,0,0.9)",
            }}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </div>

        {/* Arc Content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[18%] z-30 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2
            className="mb-4 max-w-[min(780px,92vw)] text-3xl font-semibold tracking-tight text-white md:text-5xl"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 42px rgba(201,169,110,0.16)",
            }}
          >
            Your Luxury Self-Care Ritual
          </h2>
          <p
            className="max-w-lg text-sm leading-relaxed md:text-base"
            style={{
              color: "#d2d2d2",
              textShadow: "0 1px 20px rgba(0,0,0,0.95)",
            }}
          >
            Curated rituals for sleep, skin, and body glow.{" "}
            <br className="hidden md:block" />
            Discover products designed for a calm, polished lifestyle.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="relative z-20 flex h-full w-full items-center justify-center">
          {heroProducts.map((product, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 70;
              const lineTotalWidth = totalImages * lineSpacing;
              target = {
                x: i * lineSpacing - lineTotalWidth / 2,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
              };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 350);
              const circleAngle = (i / totalImages) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (totalImages - 1);
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                product={product}
                index={i}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
