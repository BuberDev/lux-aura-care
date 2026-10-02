"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, MoveHorizontal, ShieldCheck, Sparkles, SunMedium } from "lucide-react";

import { Container } from "@/components/container";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";

const comparisonPoints = [
  {
    icon: SunMedium,
    title: "Before consistent care",
    description: "Skin may look dull, uneven and less rested when the routine changes from day to day.",
  },
  {
    icon: Sparkles,
    title: "After consistent care",
    description: "Regular care can support a brighter, smoother-looking and more hydrated complexion.",
  },
  {
    icon: ShieldCheck,
    title: "What supports the change",
    description: "Vitamin C in the morning, SPF every day and retinol introduced gradually at night.",
  },
] as const;

export function BeforeAfterComparison() {
  const { text } = useI18n();
  const [position, setPosition] = useState(52);

  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-surface-subtle/35 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(201,169,110,0.13),transparent_70%)]" />
      <Container className="relative px-2 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-accent-gold sm:text-xs">
            <T text={"CONSISTENCY YOU CAN SEE"} />
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
            <T text={"See what a steady routine can change"} />
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            <T text={"Compare the same mature complexion before and after consistent care. The change is intentionally subtle: more glow, smoother-looking texture and a rested finish, while real skin still looks like real skin."} />
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-stretch">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-[#ead8bf] shadow-[0_24px_70px_rgba(41,31,20,0.16)] sm:aspect-[4/3]">
            <Image
              src="/vitamin-c-retinol-serum-duo/before-care-landscape.webp"
              alt={text("Mature complexion before starting a consistent Vitamin C and retinol routine")}
              fill
              sizes="(max-width: 1023px) calc(100vw - 1rem), 68vw"
              className="object-cover object-top"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src="/vitamin-c-retinol-serum-duo/after-care-landscape-v2.webp"
                alt={text("Mature complexion after consistent Vitamin C and retinol care")}
                fill
                sizes="(max-width: 1023px) calc(100vw - 1rem), 68vw"
                className="object-cover object-top"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
              <span className="rounded-full border border-white/35 bg-black/55 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <T text={"Before regular use"} />
              </span>
              <span className="rounded-full border border-white/35 bg-white/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-900 backdrop-blur-md">
                <T text={"After regular use"} />
              </span>
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_0_18px_rgba(0,0,0,0.28)]"
              style={{ left: `${position}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#a17f45] text-white shadow-xl sm:size-11">
                <MoveHorizontal className="size-5" aria-hidden="true" />
              </span>
            </div>

            <input
              type="range"
              min="8"
              max="92"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label={text("Move the comparison slider")}
              className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0"
            />

            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex justify-center sm:bottom-4">
              <span className="rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <T text={"Drag to compare"} />
              </span>
            </div>
          </div>

          <aside className="flex flex-col justify-center rounded-2xl border border-border-subtle bg-background-primary/65 p-4 shadow-sm sm:p-5">
            <div className="divide-y divide-border-subtle">
              {comparisonPoints.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-3 py-4 first:pt-1 last:pb-1">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/10 text-accent-gold">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary"><T text={title} /></h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary"><T text={description} /></p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent-gold/20 bg-accent-gold/10 p-3 text-[11px] leading-relaxed text-text-secondary">
              <Check className="mt-0.5 size-3.5 shrink-0 text-accent-gold" aria-hidden="true" />
              <p><T text={"Illustrative comparison of a possible cosmetic effect. Individual results depend on skin condition, regular use and daily sun protection."} /></p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
