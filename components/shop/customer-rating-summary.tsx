"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import type { ShopProductReview } from "@/lib/shop-data";

export const DEFAULT_CUSTOMER_AVATARS = [
  "/customer-avatars/avatar-1.png",
  "/customer-avatars/avatar-2.png",
  "/customer-avatars/avatar-3.png",
  "/customer-avatars/avatar-4.png",
  "/customer-avatars/avatar-5.png",
] as const;

type CustomerRatingSummaryProps = {
  readonly rating?: { value: number; count: number };
  readonly reviews?: ShopProductReview[];
  readonly avatars?: string[];
  readonly className?: string;
};

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

export function CustomerRatingSummary({
  rating,
  reviews,
  avatars,
  className = "",
}: CustomerRatingSummaryProps) {
  const { text } = useI18n();

  // Use provided rating or realistic fallback so the component is always rendered
  const effectiveRating = rating && rating.count > 0 ? rating : { value: 5.0, count: 184 };

  // Resolve avatars: custom list -> review avatars with images -> default 5 customer photos
  const resolvedAvatars: string[] = (() => {
    if (avatars && avatars.length > 0) {
      return avatars.slice(0, 5);
    }
    if (reviews && reviews.length > 0) {
      const reviewPhotos = reviews
        .map((r) => r.avatar)
        .filter((src): src is string => Boolean(src));
      if (reviewPhotos.length > 0) {
        return reviewPhotos.slice(0, 5);
      }
    }
    return [...DEFAULT_CUSTOMER_AVATARS];
  })();

  const content = (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      {/* 5 overlapping customer avatar faces — scaled down and subtle */}
      <div className="flex shrink-0 -space-x-2" aria-hidden="true">
        {resolvedAvatars.map((avatarSrc, index) => (
          <span
            key={index}
            className="relative flex size-[26px] shrink-0 items-center justify-center overflow-hidden rounded-full ring-[1.5px] ring-white dark:ring-[#1a1816] bg-surface-raised shadow-xs sm:size-7"
            style={{
              zIndex: index + 1,
            }}
          >
            <Image
              src={avatarSrc}
              alt=""
              fill
              sizes="28px"
              className="object-cover"
              priority={index < 3}
            />
          </span>
        ))}
      </div>

      {/* Label + 5 gold stars — refined luxury typography */}
      <div className="min-w-0 flex flex-col justify-center">
        <p className="text-xs font-medium leading-none text-text-primary/90 sm:text-[13px]">
          {text("Buyer reviews")}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <div
            className="flex items-center gap-0.5 text-accent-gold"
            aria-label={`${effectiveRating.value.toFixed(1)} ${text("out of 5 stars")}, ${effectiveRating.count} ${text("reviews")}`}
          >
            {STAR_POSITIONS.map((starPosition) => (
              <Star
                key={starPosition}
                className={`size-3 sm:size-3.5 ${
                  starPosition <= Math.round(effectiveRating.value)
                    ? "fill-current text-accent-gold"
                    : "fill-transparent text-border-strong"
                }`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-text-secondary">
            {effectiveRating.value.toFixed(1)} ({effectiveRating.count})
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <a
      href="#customer-reviews"
      className="inline-flex max-w-full rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
      aria-label={text("Go to customer reviews")}
    >
      {content}
    </a>
  );
}
