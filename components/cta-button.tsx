"use client";

import { LocalizedLink } from "@/components/localized-link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";
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
  const { locale, text } = useI18n();
  const isOutbound = href.startsWith("http");
  const isAffiliateRedirect = href.startsWith("/go/");
  const affiliateUrl = isAffiliateRedirect ? new URL(href, "https://luxauracare.local") : null;
  const usesInternationalFallback =
    locale === "pl" && affiliateUrl?.searchParams.get("fallbackMarket") === "us";

  if (affiliateUrl) {
    affiliateUrl.searchParams.set("locale", locale);
  }

  const affiliateHref = affiliateUrl
    ? `${affiliateUrl.pathname}${affiliateUrl.search}`
    : href;
  const affiliateLabel = usesInternationalFallback ? text("Check on Amazon.com") : text(label);

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
          <T text={label} />
          <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
        </a>
      </Button>
    );
  }

  if (isAffiliateRedirect) {
    return (
      <Button asChild size="lg" variant={variant} className={className} onClick={handleClick}>
        <LocalizedLink
          href={affiliateHref}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={
            usesInternationalFallback
              ? `${affiliateLabel} — ${text("international store")}`
              : affiliateLabel
          }
        >
          {affiliateLabel}
          <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
        </LocalizedLink>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant} className={className} onClick={handleClick}>
      <LocalizedLink href={href}>
        <T text={label} />
        <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
      </LocalizedLink>
    </Button>
  );
}
