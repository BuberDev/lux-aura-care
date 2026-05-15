import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Container } from "@/components/container";
import { shopProducts } from "@/lib/shop-data";

export const metadata: Metadata = {
  title: "Shop Skin Rituals | Lux Aura Care",
  description:
    "Dermaplaning razors and hydrocolloid patches for women 40+. Clinic-quality skincare rituals at home. Free EU delivery.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Skin Rituals | Lux Aura Care",
    description: "Clinic-quality skincare rituals at home. Free EU delivery.",
    url: "/shop",
    type: "website",
  },
};

const guarantees = [
  { icon: Truck, label: "Free EU Delivery", sub: "7–14 business days" },
  { icon: ShieldCheck, label: "30-Day Guarantee", sub: "Full refund, no questions" },
  { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free process" },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>

      {/* Hero */}
      <section className="border-b border-white/10 py-20 text-center px-4">
        <Container>
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "#c9a96e" }}>
            Glow Rituals · Women 40+
          </p>
          <h1
            className="text-4xl md:text-6xl font-semibold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Weekly Skin Ritual
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#a8a8a8" }}>
            Two products. One ritual. Visible results in 4 weeks — without a clinic visit.
          </p>
        </Container>
      </section>

      {/* Guarantees */}
      <section className="border-b border-white/10 py-6">
        <Container>
          <ul className="grid grid-cols-3 gap-4">
            {guarantees.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="size-5 mb-1" style={{ color: "#c9a96e" }} />
                <span className="text-xs font-semibold text-white">{label}</span>
                <span className="text-[11px]" style={{ color: "#a8a8a8" }}>{sub}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {shopProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block rounded-2xl border border-white/10 overflow-hidden hover:border-white/25 transition-all duration-300"
                style={{ background: "rgb(255 255 255 / 0.02)" }}
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
                    style={{ background: "#c9a96e", color: "#000" }}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {product.name}
                    </h2>
                    <p className="text-sm" style={{ color: "#a8a8a8" }}>{product.tagline}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3.5"
                          style={{
                            fill: i < Math.floor(product.rating) ? "#c9a96e" : "transparent",
                            color: "#c9a96e",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: "#a8a8a8" }}>
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Benefits preview */}
                  <ul className="space-y-1.5">
                    {product.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs" style={{ color: "#a8a8a8" }}>
                        <Check className="size-3.5 mt-0.5 shrink-0" style={{ color: "#c9a96e" }} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl font-bold text-white">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm line-through" style={{ color: "#a8a8a8" }}>
                      €{product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "rgb(201 169 110 / 0.15)", color: "#c9a96e" }}>
                      -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                    </span>
                  </div>

                  <div
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-black transition-opacity group-hover:opacity-90"
                    style={{ background: "#c9a96e" }}
                  >
                    View Product →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust bar */}
      <section className="border-t border-white/10 py-12 px-4">
        <Container>
          <p
            className="text-center text-lg font-medium mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff" }}
          >
            Why women 40+ love our rituals
          </p>
          <div className="grid gap-6 md:grid-cols-3 text-center">
            {[
              { stat: "94%", label: "noticed smoother skin after first use" },
              { stat: "4 weeks", label: "average time to visible glow results" },
              { stat: "12K+", label: "happy customers across Europe" },
            ].map(({ stat, label }) => (
              <div key={stat} className="space-y-1">
                <p className="text-3xl font-bold" style={{ color: "#c9a96e" }}>{stat}</p>
                <p className="text-sm" style={{ color: "#a8a8a8" }}>{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
