import { cache } from "react";
import { headers } from "next/headers";

import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export const getRequestLocale = cache(async (): Promise<Locale> => {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-lux-aura-locale");

  return isLocale(locale) ? locale : defaultLocale;
});
