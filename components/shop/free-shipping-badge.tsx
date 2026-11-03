"use client";

import { ChevronRight, Truck } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type FreeShippingBadgeProps = {
  readonly variant?: "banner" | "compact" | "pill";
  readonly className?: string;
};

export function FreeShippingBadge({
  variant = "banner",
  className = "",
}: FreeShippingBadgeProps) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  const title = pl ? "Darmowa dostawa standardowa" : "Free standard delivery";
  const detail = pl
    ? "Do Polski · bez minimalnej kwoty zamówienia"
    : "To Poland · no minimum order";

  if (variant === "pill") {
    return (
      <a
        href="#product-shipping"
        className={`inline-flex min-h-9 items-center gap-2 rounded-full border border-accent-gold/25 bg-accent-gold/10 px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:border-accent-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-gold ${className}`}
      >
        <Truck className="size-3.5 text-accent-gold" aria-hidden="true" />
        <span>
          {pl ? "Dostawa standardowa do Polski gratis" : "Free standard delivery to Poland"}
        </span>
      </a>
    );
  }

  // Customer-facing rate, not the merchant's supplier shipping cost.
  return (
    <a
      href="#product-shipping"
      data-free-shipping="PL"
      className={`group flex items-center gap-3 rounded-xl border border-accent-gold/30 bg-accent-gold/[0.06] px-3.5 ${variant === "compact" ? "py-2.5" : "py-3"} transition hover:border-accent-gold/60 hover:bg-accent-gold/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-gold ${className}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent-gold/25 text-accent-gold">
        <Truck className="size-4" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold leading-5 text-text-primary sm:text-[13px]">
          {title}
        </span>
        <span className="mt-0.5 block text-[10px] leading-4 text-text-secondary sm:text-[11px]">
          {detail}
        </span>
      </span>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-accent-gold">
        {pl ? "0 zł" : "0 PLN"}
      </span>
      <ChevronRight
        className="size-3.5 shrink-0 text-accent-gold transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
