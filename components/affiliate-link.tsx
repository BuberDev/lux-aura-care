"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { useI18n } from "@/components/i18n-provider";

type AffiliateLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  fallbackLabel?: string | false;
};

export function AffiliateLink({
  href,
  children,
  fallbackLabel = "Check on Amazon.com",
  ...props
}: AffiliateLinkProps) {
  const { locale, text } = useI18n();
  const url = new URL(href, "https://luxauracare.local");
  const usesInternationalFallback =
    locale === "pl" && url.searchParams.get("fallbackMarket") === "us";

  url.searchParams.set("locale", locale);

  const localizedHref = `${url.pathname}${url.search}`;
  const accessibleMarketLabel = usesInternationalFallback
    ? text("international store")
    : undefined;

  return (
    <a
      href={localizedHref}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={
        accessibleMarketLabel && fallbackLabel
          ? `${text(fallbackLabel)} — ${accessibleMarketLabel}`
          : undefined
      }
      {...props}
    >
      {usesInternationalFallback && fallbackLabel ? text(fallbackLabel) : children}
    </a>
  );
}
