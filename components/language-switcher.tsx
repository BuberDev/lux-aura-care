"use client";

import { Check, Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n-provider";
import {
  localeCookieName,
  localeLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { switchPathnameLocale } from "@/lib/i18n/path";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

function persistLocale(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function navigateToLocale(pathname: string) {
  window.location.assign(pathname);
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { locale, t } = useI18n();
  const pathname = usePathname();

  const changeLocale = (nextLocale: Locale) => {
    const nextPathname = switchPathnameLocale(pathname, nextLocale);
    const query = window.location.search;

    persistLocale(nextLocale);
    navigateToLocale(`${nextPathname}${query}`);
  };

  if (compact) {
    const nextLocale = locale === "en" ? "pl" : "en";

    return (
      <button
        type="button"
        onClick={() => changeLocale(nextLocale)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border border-border-subtle bg-surface-glass px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary shadow-sm transition-all hover:border-accent-gold/50 hover:bg-surface-raised hover:text-text-primary",
          className
        )}
        aria-label={t("language.switch")}
        title={t("language.switch")}
      >
        <Languages className="size-4" aria-hidden="true" />
        {nextLocale.toUpperCase()}
      </button>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border-subtle bg-surface-raised p-2", className)}>
      <p className="flex items-center gap-2 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
        <Languages className="size-3.5" aria-hidden="true" />
        {t("language.name")}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {locales.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => changeLocale(option)}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-colors",
              option === locale
                ? "bg-accent-gold text-text-on-accent"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
            aria-pressed={option === locale}
          >
            {option === locale ? <Check className="size-3.5" aria-hidden="true" /> : null}
            {localeLabels[option]}
          </button>
        ))}
      </div>
    </div>
  );
}
