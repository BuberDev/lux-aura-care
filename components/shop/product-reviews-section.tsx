"use client";

import { ArrowUpRight, Star, ThumbsUp } from "lucide-react";

import { Container } from "@/components/container";
import { useI18n } from "@/components/i18n-provider";
import { LocalizedDate } from "@/components/localized-date";
import { LocalizedLink } from "@/components/localized-link";
import type { ShopProduct, ShopProductReview } from "@/lib/shop-data";
import { sampleReviewCopy } from "@/lib/shop-review-preview";

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;
const SAMPLE_TOPICS = {
  pl: ["Aplikacja", "Komfort", "Forma produktu", "Codzienna pielęgnacja"],
  en: ["Application", "Comfort", "Product design", "Daily routine"],
} as const;

type ProductReviewsSectionProps = {
  readonly product: ShopProduct;
};

function RatingStars({
  value,
  label,
  size = "large",
}: {
  readonly value: number;
  readonly label: string;
  readonly size?: "small" | "large";
}) {
  return (
    <div className="flex items-center gap-1" aria-label={label}>
      {STAR_POSITIONS.map((position) => (
        <Star
          key={position}
          className={`${size === "large" ? "size-5" : "size-4"} ${
            position <= Math.round(value)
              ? "fill-accent-gold text-accent-gold"
              : "fill-transparent text-border-strong"
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewArticle({ review }: { readonly review: ShopProductReview }) {
  const { text } = useI18n();

  return (
    <article className="rounded-[1.75rem] bg-surface-subtle px-5 py-6 sm:px-7 sm:py-7 lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-10 lg:px-9">
      <div className="flex items-center gap-3 lg:items-start">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-raised text-base font-semibold text-accent-gold"
          aria-hidden="true"
        >
          {review.author.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="truncate text-base font-semibold text-text-primary">{review.author}</p>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            {text(review.source)}
          </p>
        </div>
      </div>

      <div className="mt-6 min-w-0 lg:mt-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <RatingStars
            value={review.rating}
            label={`${review.rating} ${text("out of 5 stars")}`}
            size="small"
          />
          <time className="text-sm text-text-secondary" dateTime={review.date}>
            <LocalizedDate value={review.date} />
          </time>
        </div>

        <blockquote className="mt-5 max-w-3xl text-base leading-7 text-text-primary sm:text-lg sm:leading-8">
          “{review.body}”
        </blockquote>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-secondary">
          <span>
            <span className="text-text-primary">{text("Pattern")}:</span>{" "}
            {text(review.color)}
          </span>
          <span>
            <span className="text-text-primary">{text("Size")}:</span> {review.size}
          </span>
          <span className="inline-flex items-center gap-2">
            <ThumbsUp className="size-4 text-accent-gold" aria-hidden="true" />
            {text("Helpful")}: {review.helpfulCount}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const { locale, text } = useI18n();
  const language = locale === "pl" ? "pl" : "en";
  const reviews = product.reviews ?? [];
  const samples = sampleReviewCopy[product.id]?.[language];
  const hasPublishedReviews = reviews.length > 0;
  const hasSamples = Boolean(samples?.length);
  const rating = product.rating;

  const introduction = hasPublishedReviews
    ? text("Read selected customer comments together with their source and order details.")
    : hasSamples
      ? text("This preview shows the intended review layout. The copy is editorial sample text, not customer feedback.")
      : text("No review excerpts have been published for this product yet.");

  return (
    <section
      id="customer-reviews"
      data-product-section="reviews"
      data-review-status={hasPublishedReviews ? "published" : hasSamples ? "sample" : "empty"}
      className="scroll-mt-24 py-20 sm:py-24 lg:py-28"
    >
      <Container className="px-4 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] text-text-primary sm:text-5xl">
                {text("Customer reviews")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
                {introduction}
              </p>
            </div>

            <aside
              className="rounded-[2rem] bg-surface-raised p-6 sm:p-7"
              aria-label={text("Product rating summary")}
            >
              {rating ? (
                <>
                  <div className="flex items-end justify-between gap-5">
                    <p className="font-serif text-6xl font-semibold leading-none tracking-[-0.04em] text-text-primary">
                      {rating.value.toFixed(1)}
                    </p>
                    <span className="pb-1 text-base text-text-secondary">/ 5</span>
                  </div>
                  <div className="mt-5">
                    <RatingStars
                      value={rating.value}
                      label={`${rating.value.toFixed(1)} ${text("out of 5 stars")}`}
                    />
                  </div>
                  <p className="mt-4 text-base leading-6 text-text-primary">
                    {text("Based on")} {rating.count} {text("reviews")}
                  </p>
                  {hasPublishedReviews ? (
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {text("Rating and comments come from the supplier product listing.")}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="font-serif text-3xl font-semibold text-text-primary">
                    {text("No ratings yet")}
                  </p>
                  <div className="mt-5">
                    <RatingStars
                      value={0}
                      label={text("No verified rating has been published for this product yet.")}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {text("We publish reviews only after verifying their source.")}
                  </p>
                </>
              )}
            </aside>
          </div>

          {hasPublishedReviews ? (
            <div className="mt-12 space-y-4 sm:mt-16">
              <p className="max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                {text("Selected reviews from the supplier's product listing. The wording is translated for readability, and color names reflect the original order variants. These are not purchases verified by Lux Aura Care.")}
              </p>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewArticle key={review.id} review={review} />
                ))}
              </div>
            </div>
          ) : hasSamples && samples ? (
            <div className="mt-12 rounded-[2rem] bg-surface-subtle p-5 sm:mt-16 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
                <div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">
                    {text("Review layout preview")}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-text-secondary sm:text-base">
                    {text("Each sample will be replaced when an authentic review is available.")}
                  </p>
                </div>
                <div className="space-y-3">
                  {samples.map((sample, index) => (
                    <blockquote
                      key={`${product.id}-${index}`}
                      className="rounded-[1.5rem] bg-surface-raised px-5 py-5 text-base leading-7 text-text-primary sm:px-7 sm:py-6 sm:text-lg sm:leading-8"
                    >
                      <p>“{sample}”</p>
                      <footer className="mt-4 text-sm text-text-secondary">
                        {text("Editorial example")} · {SAMPLE_TOPICS[language][index]}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 rounded-[2rem] bg-surface-subtle px-6 py-10 sm:mt-16 sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <h3 className="font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
                  {text("First customer reviews")}
                </h3>
                <p className="mt-4 text-base leading-7 text-text-secondary sm:text-lg">
                  {text("No verified reviews yet")} — {text("We publish reviews only after verifying their source.")}
                </p>
              </div>
              <LocalizedLink
                href="/contact"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-gold px-6 py-3 text-sm font-semibold text-text-on-accent transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-gold lg:mt-0"
              >
                {text("Ask about this product")}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </LocalizedLink>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
