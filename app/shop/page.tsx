import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link";
import Image from "next/image";
import { Star, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Container } from "@/components/container";
import { shopProducts } from "@/lib/shop-data";
import { T } from "@/components/translated-text";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Shop Skin Rituals | Lux Aura Care");
  const description = translateText(
    locale,
    "Dermaplaning razors and hydrocolloid patches for women 40+. Clinic-quality skincare rituals at home. Free EU delivery."
  );

  return {
    title: { absolute: title },
    description,
    alternates: getLocalizedAlternates("/shop", locale),
    openGraph: {
      title,
      description,
      url: localizePathname("/shop", locale),
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
  };
}

const guarantees = [
  { icon: Truck, label: "Free EU Delivery", sub: "7–14 business days" },
  { icon: ShieldCheck, label: "30-Day Guarantee", sub: "Full refund, no questions" },
  { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free process" },
];

export default async function ShopPage() {
  const locale = await getRequestLocale();
  const localizedGuarantees = localizeContent(locale, guarantees);
  const localizedProducts = localizeContent(locale, shopProducts);
  const trustStats = localizeContent(locale, [
    { stat: "94%", label: "noticed smoother skin after first use" },
    { stat: "4 weeks", label: "average time to visible glow results" },
    { stat: "12K+", label: "happy customers across Europe" },
  ]);

  return (
    <div className="min-h-screen bg-background-primary">

      {/* Hero */}
      <section className="border-b border-border-subtle py-20 text-center px-4">
        <Container>
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent-gold)" }}>
            <T text={"Glow Rituals · Women 40+"} />
          </p>
          <h1
            className="text-4xl md:text-6xl font-semibold text-text-primary mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <T text={"Your Weekly Skin Ritual"} />
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            <T text={"Two products. One ritual. Visible results in 4 weeks — without a clinic visit."} />
          </p>
        </Container>
      </section>

      {/* Guarantees */}
      <section className="border-b border-border-subtle py-6">
        <Container>
          <ul className="grid grid-cols-3 gap-4">
            {localizedGuarantees.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="size-5 mb-1" style={{ color: "var(--accent-gold)" }} />
                <span className="text-xs font-semibold text-text-primary">{label}</span>
                <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{sub}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {localizedProducts.map((product) => (
              <LocalizedLink
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle transition-all duration-300 hover:border-border-strong"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "var(--accent-gold)", color: "#000" }}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {product.name}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{product.tagline}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3.5"
                          style={{
                            fill: i < Math.floor(product.rating) ? "var(--accent-gold)" : "transparent",
                            color: "var(--accent-gold)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {product.rating} ({product.reviews} <T text={"reviews)"} />
                    </span>
                  </div>

                  {/* Benefits preview */}
                  <ul className="space-y-1.5">
                    {product.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <Check className="size-3.5 mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl font-bold text-text-primary">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm line-through" style={{ color: "var(--text-secondary)" }}>
                      €{product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "rgb(201 169 110 / 0.15)", color: "var(--accent-gold)" }}>
                      -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                    </span>
                  </div>

                  <div
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-black transition-opacity group-hover:opacity-90"
                    style={{ background: "var(--accent-gold)" }}
                  >
                    <T text={"View Product →"} />
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust bar */}
      <section className="border-t border-border-subtle py-12 px-4">
        <Container>
          <p
            className="text-center text-lg font-medium mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}
          >
            <T text={"Why women 40+ love our rituals"} />
          </p>
          <div className="grid gap-6 md:grid-cols-3 text-center">
            {trustStats.map(({ stat, label }) => (
              <div key={stat} className="space-y-1">
                <p className="text-3xl font-bold" style={{ color: "var(--accent-gold)" }}>{stat}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
