"use client";

import Image from "next/image";
import { Container } from "@/components/container";
import { useI18n } from "@/components/i18n-provider";

const routineSteps = [
  {
    image: "/vitamin-c-retinol-serum-duo/before-care-landscape.webp",
    label: { pl: "Przed użyciem", en: "Before use" },
    detail: {
      pl: "Przykładowa modelka przed rozpoczęciem pielęgnacji serum.",
      en: "An illustrative model before starting the serum routine.",
    },
    alt: { pl: "Przykładowa modelka z naturalną strukturą skóry przed pielęgnacją", en: "Illustrative model with natural skin texture before the routine" },
  },
  {
    image: "/product-demonstrations/vitamin-c-retinol-serum-duo-in-use.webp",
    label: { pl: "W pielęgnacji", en: "In the routine" },
    detail: {
      pl: "Przykładowa aplikacja serum na twarz — bez obietnicy konkretnego efektu.",
      en: "An example of facial serum application, without promising a specific result.",
    },
    alt: { pl: "Przykładowa modelka nakładająca serum na policzek", en: "Illustrative model applying serum to her cheek" },
  },
] as const;

export function ProductRoutineSection() {
  const { locale } = useI18n();
  const pl = locale === "pl";

  return (
    <section id="product-routine" data-product-section="product-routine" aria-labelledby="product-routine-title" className="border-b border-border-subtle bg-surface-subtle/35 py-12 sm:py-16">
      <Container className="px-4 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold sm:text-xs">
            {pl ? "Przed użyciem / w praktyce" : "Before use / in practice"}
          </p>
          <h2 id="product-routine-title" className="mt-3 font-serif text-2xl font-semibold leading-tight text-text-primary sm:text-3xl lg:text-4xl">
            {pl ? "Zobacz, jak włączyć serum do pielęgnacji" : "See how serum fits into your routine"}
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {routineSteps.map((step) => (
              <figure key={step.label.en} className="overflow-hidden rounded-2xl border border-border-subtle bg-background-primary">
                <div className="relative aspect-[4/3] bg-[#eee7dc]">
                  <Image src={step.image} alt={pl ? step.alt.pl : step.alt.en} fill sizes="(max-width: 639px) 94vw, (max-width: 1023px) 46vw, 480px" className="object-contain p-2 sm:p-4" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-900 shadow-sm">
                    {pl ? step.label.pl : step.label.en}
                  </span>
                </div>
                <figcaption className="min-h-24 px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-sm font-semibold leading-6 text-text-primary">{pl ? step.detail.pl : step.detail.en}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-5 grid gap-3 text-xs leading-6 text-text-secondary sm:grid-cols-2">
            <p><strong className="text-text-primary">{pl ? "Rano: " : "Morning: "}</strong>{pl ? "witamina C, a następnie ochrona SPF." : "Vitamin C, followed by SPF protection."}</p>
            <p><strong className="text-text-primary">{pl ? "Wieczorem: " : "Evening: "}</strong>{pl ? "retinol wprowadzany stopniowo, zgodnie z instrukcją produktu." : "Introduce retinol gradually, following the product directions."}</p>
          </div>
          <p className="mt-4 text-xs leading-6 text-text-secondary">
            {pl ? "Przykładowe ujęcia: skóra przed pielęgnacją i aplikacja serum. Rezultaty mogą się różnić." : "Illustrative scenes: skin before the routine and serum application. Individual results may vary."}
          </p>
        </div>
      </Container>
    </section>
  );
}
