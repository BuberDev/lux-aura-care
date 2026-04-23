"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import Logo from "../public/lux_aura_care_logo.png";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { HeaderProductSearch } from "@/components/header-product-search";
import { siteMeta } from "@/lib/site-data";

type HeaderSearchProduct = {
  id: string;
  name: string;
};

type SiteHeaderProps = {
  searchProducts: HeaderSearchProduct[];
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/favorites", label: "Favorites" },
];

export function SiteHeader({ searchProducts }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 p-2 md:px-5 md:pt-3">
        <Container className="rounded-2xl border border-white/15 bg-black/40 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-black/30 sm:px-4 md:px-6">
          <div className="flex h-14 items-center justify-between gap-3 md:h-20 md:gap-6">
            <Link href="/" className="inline-flex shrink-0 items-center gap-2 md:gap-3">
              <Image src={Logo} className="w-8 rounded-full opacity-80 md:w-10" alt="logo" />
              <span className="font-heading text-sm tracking-[0.06em] text-text-primary sm:text-lg md:text-2xl">
                {siteMeta.name}
              </span>
            </Link>

            <HeaderProductSearch
              products={searchProducts}
              className="hidden w-full max-w-md md:block lg:max-w-xl"
              placeholder="Search products..."
            />

            <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex lg:gap-8">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold sm:text-xs"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <CTAButton href="/blog" label="Start Reading" variant="secondary" className="hidden xl:inline-flex" />

              <button
                className="rounded-full p-2 text-text-secondary transition-colors hover:text-accent-gold focus:outline-none md:hidden"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setIsMenuOpen(false);
                }}
                aria-label="Toggle product search"
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
                aria-label="Open menu"
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
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isSearchOpen ? "max-h-20 pb-3 opacity-100" : "max-h-0 pb-0 opacity-0"
            }`}
          >
            <HeaderProductSearch
              products={searchProducts}
              placeholder="Search products..."
              inputClassName="h-10 border-white/20 bg-black/50 text-[13px]"
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
        className={`fixed right-0 top-0 z-[60] flex h-full w-[280px] transform flex-col border-l border-white/10 bg-[#0a0a0a] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            className="rounded-full bg-white/5 p-2 text-text-secondary transition-colors hover:text-accent-gold focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
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
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <Image src={Logo} className="w-8 rounded-full opacity-80" alt="logo" />
            <span className="font-heading text-lg tracking-[0.06em] text-text-primary">{siteMeta.name}</span>
          </div>

          <ul className="mt-2 flex flex-col gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/5 pt-6">
            <CTAButton href="/blog" label="Start Reading" variant="secondary" className="w-full justify-center" />
          </div>
        </nav>
      </div>
    </>
  );
}
