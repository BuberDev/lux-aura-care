"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/config";
import { localizePathname } from "@/lib/i18n/path";
import { translateMessage, translateText } from "@/lib/i18n/messages";

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  text: (source: string) => string;
  href: (pathname: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key) => translateMessage(locale, key),
      text: (source) => translateText(locale, source),
      href: (pathname) => localizePathname(pathname, locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
