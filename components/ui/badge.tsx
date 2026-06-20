import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  BicepsFlexed,
  Heart,
  Leaf,
  ShowerHead,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase",
  {
    variants: {
      variant: {
        default: "border-accent-gold/40 bg-accent-gold/10 text-accent-gold",
        subtle: "border-border-default bg-surface-raised text-text-secondary",
        product: "gap-1.5 border-black/10 bg-accent-gold text-black normal-case tracking-normal shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const productBadgeIcons: ReadonlyArray<readonly [marker: string, icon: LucideIcon]> = [
  ["⭐", Star],
  ["✨", Sparkles],
  ["🖤", Heart],
  ["⚡", Zap],
  ["🌿", Leaf],
  ["☀️", Sun],
  ["💪", BicepsFlexed],
  ["🚿", ShowerHead],
  ["❄️", Snowflake],
  ["🌊", Waves],
];

function getChromaticBadgeContent(children: React.ReactNode) {
  if (typeof children !== "string") return children;

  const match = productBadgeIcons.find(([marker]) => children.startsWith(marker));
  if (!match) return children;

  const [marker, Icon] = match;

  return (
    <>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {children.slice(marker.length).trimStart()}
    </>
  );
}

function Badge({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {getChromaticBadgeContent(children)}
    </span>
  );
}

export { Badge, badgeVariants };
