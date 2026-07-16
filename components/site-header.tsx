"use client";

import { useEffect, useRef, useState } from "react";
import { LocalizedLink } from "@/components/localized-link";
import Image from "next/image";
import { Search } from "lucide-react";

import Logo from "../public/brand/lux_aura_care_logo.png";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { HeaderProductSearch } from "@/components/header-product-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { siteMeta } from "@/lib/site-data";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";

type HeaderSearchProduct = {
  id: string;
  name: string;
  href: string;
};

type SiteHeaderProps = {
  searchProducts: HeaderSearchProduct[];
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/favorites", label: "Favorites" },
  { href: "/shop", label: "Shop" },
];

export function SiteHeader({ searchProducts }: SiteHeaderProps) {
  const { text } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [isSearchOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 p-2 md:px-5 md:pt-3">
        <Container className="rounded-2xl border border-border-subtle bg-surface-glass px-3 shadow-theme-lg backdrop-blur-2xl sm:px-4 md:px-6">
          <div className="flex h-14 items-center justify-between gap-3 md:h-20 md:gap-6">
            <LocalizedLink href="/" className="inline-flex shrink-0 items-center gap-2 md:gap-3">
              <Image src={Logo} className="w-8 rounded-full opacity-80 md:w-10" alt="logo" />
              <span className="font-heading text-sm tracking-[0.06em] text-text-primary sm:text-lg md:text-2xl">
                {siteMeta.name}
              </span>
            </LocalizedLink>

            <HeaderProductSearch
              products={searchProducts}
              className="hidden w-full max-w-md md:block lg:max-w-xl"
              placeholder={text("Search products...")}
            />

            <nav aria-label={text("Primary")} className="hidden items-center gap-6 lg:flex lg:gap-8">
              {nav.map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold sm:text-xs"
                >
                  <T text={item.label} />
                </LocalizedLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <CTAButton href="/blog" label="Start Reading" variant="secondary" className="hidden xl:inline-flex" />
              <LanguageSwitcher compact className="hidden md:inline-flex" />
              <ThemeToggle className="hidden md:inline-flex" />

              <button
                className="rounded-full p-2 text-text-secondary transition-colors hover:text-accent-gold focus:outline-none md:hidden"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setIsMenuOpen(false);
                }}
                aria-label={text("Toggle product search")}
                aria-expanded={isSearchOpen}
                aria-controls="mobile-product-search"
                type="button"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>

              <button
                className="p-1 text-text-secondary transition-colors hover:text-accent-gold focus:outline-none md:hidden"
                onClick={() => {
                  setIsMenuOpen(true);
                  setIsSearchOpen(false);
                }}
                aria-label={text("Open menu")}
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div
            id="mobile-product-search"
            className={`transition-all duration-300 md:hidden ${
              isSearchOpen ? "max-h-20 overflow-visible pb-3 opacity-100" : "max-h-0 overflow-hidden pb-0 opacity-0"
            }`}
          >
            <HeaderProductSearch
              products={searchProducts}
              placeholder={text("Search products...")}
              inputClassName="h-10 text-[13px]"
              inputRef={mobileSearchInputRef}
            />
          </div>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed right-0 top-0 z-[60] flex h-full w-[280px] transform flex-col border-l border-border-subtle bg-surface-base shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "visible translate-x-0" : "hidden translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            className="rounded-full bg-surface-raised p-2 text-text-secondary transition-colors hover:text-accent-gold focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label={text("Close menu")}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6 overflow-y-auto px-6 pb-6">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-6">
            <Image src={Logo} className="w-8 rounded-full opacity-80" alt="logo" />
            <span className="font-heading text-lg tracking-[0.06em] text-text-primary">{siteMeta.name}</span>
          </div>

          <ul className="mt-2 flex flex-col gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <LocalizedLink
                  href={item.href}
                  className="block text-sm uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <T text={item.label} />
                </LocalizedLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-4 border-t border-border-subtle pt-6">
            <LanguageSwitcher />
            <ThemeToggle showLabel className="w-full" />
            <CTAButton href="/blog" label="Start Reading" variant="secondary" className="w-full justify-center" />
          </div>
        </nav>
      </div>
    </>
  );
}
