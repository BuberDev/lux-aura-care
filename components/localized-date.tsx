"use client";

import { useI18n } from "@/components/i18n-provider";

type LocalizedDateProps = {
  value: string;
};

export function LocalizedDate({ value }: LocalizedDateProps) {
  const { locale } = useI18n();
  const date = new Date(`${value}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
