"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/components/i18n-provider";

type TranslatedTextProps = {
  children?: ReactNode;
  text?: string;
};

export function T({ children, text }: TranslatedTextProps) {
  const { text: translate } = useI18n();
  const source = text ?? (typeof children === "string" ? children : "");

  return <>{source ? translate(source) : children}</>;
}
