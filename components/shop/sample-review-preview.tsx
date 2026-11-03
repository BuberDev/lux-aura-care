"use client";

import { Star, ThumbsUp } from "lucide-react";
import { Container } from "@/components/container";
import { useI18n } from "@/components/i18n-provider";
import { sampleReviewCopy } from "@/lib/shop-review-preview";

const topics = {
  pl: ["Aplikacja", "Komfort", "Forma produktu", "Codzienna pielęgnacja"],
  en: ["Application", "Comfort", "Product design", "Daily routine"],
} as const;

export function SampleReviewPreview({ productId }: { productId: string }) {
  const { locale } = useI18n();
  const examples = sampleReviewCopy[productId]?.[locale === "pl" ? "pl" : "en"];
  if (!examples) return null;

  const pl = locale === "pl";
  return (
    <section id="customer-reviews" data-product-section="reviews" data-review-status="sample" className="scroll-mt-24 border-b border-border-subtle py-12 sm:py-16">
      <Container className="px-2 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-2xl border border-border-subtle bg-surface-subtle p-6 lg:sticky lg:top-24">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent-gold">
                {pl ? "PODGLĄD OPINII" : "REVIEW PREVIEW"}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-serif text-5xl font-semibold leading-none text-text-primary" aria-hidden="true">—</span>
                <span className="pb-1 text-sm font-semibold text-text-secondary">/ 5</span>
              </div>
              <div className="mt-3 flex items-center gap-1" aria-label={pl ? "Brak rzeczywistych ocen" : "No real ratings yet"}>
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-5 fill-transparent text-border-strong" aria-hidden="true" />)}
              </div>
              <p className="mt-3 text-sm font-semibold text-text-primary">
                {pl ? "Oceny pojawią się po dodaniu prawdziwych opinii" : "Ratings will appear when real reviews are added"}
              </p>
              <p className="mt-4 border-t border-border-subtle pt-4 text-xs leading-relaxed text-text-secondary">
                {pl ? "Ta sekcja pokazuje docelowy wygląd kart. Teksty są przykładami redakcyjnymi, nie opiniami klientek ani ocenami dostawcy." : "This section previews the final card layout. The copy is editorial sample text, not customer feedback or supplier ratings."}
              </p>
            </aside>

            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold text-text-primary md:text-4xl">
                  {pl ? "Przykładowe opinie o produkcie" : "Sample product reviews"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {pl ? "Cztery przykładowe teksty w układzie sekcji opinii. Każdy zostanie zastąpiony autentyczną recenzją." : "Four sample texts in the review layout. Each will be replaced with an authentic review."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {examples.map((example, index) => (
                  <article key={`${productId}-${index}`} className="flex h-full flex-col rounded-2xl border border-border-subtle bg-surface-subtle p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10 text-sm font-extrabold text-accent-gold" aria-hidden="true">
                          {pl ? "P" : "S"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-text-primary">{pl ? "Przykładowa opinia" : "Sample review"}</p>
                          <p className="text-[11px] text-text-secondary">{pl ? "Tekst roboczy" : "Editorial draft"}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5" aria-label={pl ? "Miejsce na rzeczywistą ocenę" : "Space for a real rating"}>
                        {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-4 fill-transparent text-border-strong" aria-hidden="true" />)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-border-subtle bg-background-primary px-3 py-1 text-[11px] font-semibold text-text-secondary">
                        {pl ? "Temat" : "Topic"}: {topics[pl ? "pl" : "en"][index]}
                      </span>
                      <span className="rounded-full border border-border-subtle bg-background-primary px-3 py-1 text-[11px] font-semibold text-text-secondary">
                        {pl ? "Treść przykładowa" : "Sample copy"}
                      </span>
                    </div>

                    <blockquote className="mt-4 flex-1 text-sm leading-7 text-text-primary">“{example}”</blockquote>

                    <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4 text-[11px] text-text-secondary">
                      <span>{pl ? "Do zastąpienia prawdziwą opinią" : "To be replaced with a real review"}</span>
                      <span className="inline-flex items-center gap-1.5"><ThumbsUp className="size-3.5" aria-hidden="true" />{pl ? "Przydatne (—)" : "Helpful (—)"}</span>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
