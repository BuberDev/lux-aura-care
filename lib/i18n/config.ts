export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "lux-aura-locale";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}
