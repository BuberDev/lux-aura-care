import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

const nonLocalizedPrefixes = ["/api", "/go", "/pin"];

export function getLocaleFromPathname(pathname: string): Locale | null {
  const firstSegment = pathname.split("/")[1];
  return isLocale(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return pathname || "/";
  }

  const stripped = pathname.slice(locale.length + 1);
  return stripped || "/";
}

export function localizePathname(pathname: string, locale: Locale = defaultLocale) {
  if (
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    nonLocalizedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ) {
    return pathname;
  }

  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  return pathWithoutLocale === "/" ? `/${locale}` : `/${locale}${pathWithoutLocale}`;
}

export function switchPathnameLocale(pathname: string, locale: Locale) {
  return localizePathname(stripLocaleFromPathname(pathname), locale);
}

export function getLocalizedAlternates(pathname: string, locale: Locale) {
  return {
    canonical: localizePathname(pathname, locale),
    languages: {
      en: localizePathname(pathname, "en"),
      pl: localizePathname(pathname, "pl"),
      "x-default": localizePathname(pathname, defaultLocale),
    },
  };
}
