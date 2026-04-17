"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../public/lux_aura_care_logo.png"
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { siteMeta } from "@/lib/site-data";
import Image from "next/image";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/favorites", label: "Favorites" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 p-2 md:px-5 md:pt-3">
        <Container className="px-3 sm:px-4 md:px-6 rounded-2xl border border-white/15 bg-black/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-black/30">
          <div className="flex h-14 md:h-20 items-center justify-between gap-4 md:gap-6">
            <Link href="/" className="inline-flex items-center gap-2 md:gap-3">
              <Image src={Logo} className="w-8 md:w-10 opacity-80 rounded-full" alt="logo"/>
              <span className="font-heading text-sm sm:text-lg tracking-[0.06em] text-text-primary md:text-2xl">
                {siteMeta.name}
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden md:flex items-center gap-6 lg:gap-8">
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

            <div className="flex items-center gap-4">
              <CTAButton href="/blog" label="Start Reading" variant="secondary" className="hidden lg:inline-flex" />
              
              <button
                className="md:hidden text-text-secondary hover:text-accent-gold transition-colors focus:outline-none p-1"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[60] h-full w-[280px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button 
            className="p-2 text-text-secondary hover:text-accent-gold transition-colors focus:outline-none rounded-full bg-white/5"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col px-6 pb-6 gap-6 overflow-y-auto">
          <div className="flex items-center gap-3 pb-6 border-b border-white/5">
            <Image src={Logo} className="w-8 opacity-80 rounded-full" alt="logo"/>
            <span className="font-heading text-lg tracking-[0.06em] text-text-primary">
              {siteMeta.name}
            </span>
          </div>

          <ul className="flex flex-col gap-6 mt-2">
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
          
          <div className="mt-6 pt-6 border-t border-white/5">
            <CTAButton 
              href="/blog" 
              label="Start Reading"
              variant="secondary" 
              className="w-full justify-center"
            />
          </div>
        </nav>
      </div>
    </>
  );
}
