"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useI18n } from "@/components/i18n-provider";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { href: localizeHref } = useI18n();

  return <Link href={localizeHref(href)} {...props} />;
}
