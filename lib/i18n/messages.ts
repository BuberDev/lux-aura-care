import type { Locale } from "@/lib/i18n/config";
import { translationCatalog, type CatalogEntry } from "@/lib/i18n/catalog";

export type Messages = Record<string, string>;

const commonEnglish: Messages = {
  "language.name": "Language",
  "language.switch": "Change language",
  "language.en": "English",
  "language.pl": "Polish",
  "theme.label": "Theme",
  "theme.switch": "Switch between light and dark mode",
};

const commonPolish: Messages = {
  "language.name": "Język",
  "language.switch": "Zmień język",
  "language.en": "Angielski",
  "language.pl": "Polski",
  "theme.label": "Motyw",
  "theme.switch": "Przełącz jasny i ciemny motyw",
};

export const messages: Record<Locale, Messages> = {
  en: commonEnglish,
  pl: commonPolish,
};

export function translateMessage(locale: Locale, key: string) {
  return messages[locale][key] ?? messages.en[key] ?? key;
}

export function translateText(locale: Locale, source: string) {
  return (translationCatalog as Record<string, CatalogEntry>)[source]?.[locale] ?? source;
}

export function localizeContent<T>(locale: Locale, value: T): T {
  if (typeof value === "string") {
    return translateText(locale, value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeContent(locale, item)) as T;
  }

  if (value && typeof value === "object") {
    if ("$$typeof" in value) {
      return value;
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        isTechnicalContentKey(key) ? item : localizeContent(locale, item),
      ])
    ) as T;
  }

  return value;
}

function isTechnicalContentKey(key: string) {
  return (
    key === "id" ||
    key === "slug" ||
    key === "category" ||
    key === "categoryId" ||
    key === "publishedAt" ||
    key === "source" ||
    key === "campaign" ||
    key === "placement" ||
    key === "type" ||
    key === "intensity" ||
    key === "icon" ||
    key === "avatar" ||
    key === "filter" ||
    key === "src" ||
    key === "image" ||
    key === "heroImage" ||
    key === "ugcVideos" ||
    key === "productIds" ||
    key.endsWith("Id") ||
    key.endsWith("Url") ||
    key.endsWith("Href")
  );
}
