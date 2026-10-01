"use client";

import { Truck, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { T } from "@/components/translated-text";

type FreeShippingBadgeProps = {
  readonly variant?: "banner" | "compact" | "pill";
  readonly className?: string;
};

export function FreeShippingBadge({
  variant = "banner",
  className = "",
}: FreeShippingBadgeProps) {
  const { text } = useI18n();

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md ${className}`}
      >
        <Truck className="size-3.5 text-emerald-400" aria-hidden="true" />
        <span><T text="Free Shipping" /></span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-subtle p-2.5 text-xs ${className}`}
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-accent-gold/30 bg-accent-gold/10 text-accent-gold">
          <Truck className="size-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-text-primary">
            <T text="Free Shipping" />
          </p>
          <p className="text-[10px] text-text-secondary">
            <T text="Dispatched in 24-48 hours" />
          </p>
        </div>
      </div>
    );
  }

  // Default "banner" variant — Compact luxury high-trust card
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-accent-gold/30 bg-gradient-to-r from-accent-gold/15 via-accent-gold/[0.04] to-transparent px-3 py-2 shadow-xs backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex size-7 shrink-0 items-center justify-center rounded-lg border border-accent-gold/40 bg-accent-gold/15 text-accent-gold shadow-xs">
            <Truck className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-xs font-extrabold tracking-wide uppercase text-text-primary leading-none">
                <T text="Free Shipping" />
              </p>
              <span className="rounded-md bg-accent-gold/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-accent-gold border border-accent-gold/30 leading-none">
                <T text="Fast dispatch" />
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-text-secondary leading-tight truncate">
              <T text="For all orders · Dispatched within 24-48h" />
            </p>
          </div>
        </div>

        <div className="hidden sm:flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-lg border border-accent-gold/25">
          <CheckCircle2 className="size-3" aria-hidden="true" />
          <span>0 zł</span>
        </div>
      </div>
    </div>
  );
}
