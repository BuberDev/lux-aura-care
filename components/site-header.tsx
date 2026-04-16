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
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-5">
      <Container className="rounded-2xl border border-white/15 bg-black/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-black/30">
        <div className="flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src={Logo} className="w-10 opacity-80 rounded-full" alt="logo"/>
            <span className="font-heading text-lg tracking-[0.06em] text-text-primary sm:text-2xl">
              {siteMeta.name}
            </span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6 md:gap-8">
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

          <CTAButton href="/blog" label="Start Reading" variant="secondary" className="hidden lg:inline-flex" />
        </div>
      </Container>
    </header>
  );
}
