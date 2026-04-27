"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackAffiliateClick } from "@/lib/ga4-tracking";

type CTAButtonProps = {
  href: string;
  label: string;
  variant?: "default" | "secondary" | "ghost";
  className?: string;
  productId?: string;
  productName?: string;
  placement?:
    | "product-card"
    | "bundle"
    | "article"
    | "inline-cta"
    | "hero"
    | "product-hero"
    | "product-problem-solution"
    | "product-routine"
    | "product-social-proof"
    | "product-final-cta";
};

export function CTAButton({
  href,
  label,
  variant = "default",
  className,
  productId,
  productName,
  placement = "inline-cta",
}: CTAButtonProps) {
  const isOutbound = href.startsWith("http");

  const handleClick = () => {
    if (productId && productName) {
      trackAffiliateClick({
        productId,
        productName,
        placement,
      });
    }
  };

  if (isOutbound) {
    return (
      <Button asChild size="lg" variant={variant} className={className} onClick={handleClick}>
        <a href={href} target="_blank" rel="noopener noreferrer sponsored">
          {label}
          <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant} className={className} onClick={handleClick}>
      <Link href={href}>
        {label}
        <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
