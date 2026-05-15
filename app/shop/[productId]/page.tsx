import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Star, Truck, ShieldCheck, RotateCcw, ChevronDown } from "lucide-react";
import { Container } from "@/components/container";
import { getShopProductById, shopProducts } from "@/lib/shop-data";

type Props = { params: Promise<{ productId: string }> };

export async function generateStaticParams() {
  return shopProducts.map((p) => ({ productId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = getShopProductById(productId);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Lux Aura Care Shop`,
    description: product.description,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/shop/${product.id}`,
      images: [{ url: product.image, alt: product.imageAlt }],
      type: "website",
    },
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { productId } = await params;
  const product = getShopProductById(productId);
  if (!product) notFound();

  const discount = Math.round((1 - product.price / product.compareAtPrice) * 100);
  const related = shopProducts.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>

      {/* Breadcrumb */}
      <div className="border-b border-white/10 py-3 px-4">
        <Container>
          <nav className="text-xs flex gap-2" style={{ color: "#a8a8a8" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span
                className="absolute top-4 left-4 text-sm font-bold px-4 py-1.5 rounded-full"
                style={{ background: "#c9a96e", color: "#000" }}
              >
                {product.badge}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "#c9a96e" }}>
                  {product.category === "bundle" ? "Best Value Bundle" : "Skin Ritual Essential"}
                </p>
                <h1
                  className="text-3xl md:text-4xl font-semibold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-base leading-relaxed" style={{ color: "#a8a8a8" }}>
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4"
                      style={{
                        fill: i < Math.floor(product.rating) ? "#c9a96e" : "transparent",
                        color: "#c9a96e",
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating}</span>
                <span className="text-sm" style={{ color: "#a8a8a8" }}>({product.reviews} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 py-2">
                <span className="text-4xl font-bold text-white">€{product.price.toFixed(2)}</span>
                <span className="text-lg line-through" style={{ color: "#a8a8a8" }}>€{product.compareAtPrice.toFixed(2)}</span>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgb(201 169 110 / 0.2)", color: "#c9a96e" }}
                >
                  Save {discount}%
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-3">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm" style={{ color: "#a8a8a8" }}>
                    <Check className="size-4 mt-0.5 shrink-0" style={{ color: "#c9a96e" }} />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="space-y-3 pt-2">
                <a
                  href={product.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#c9a96e" }}
                >
                  Buy Now — €{product.price.toFixed(2)}
                </a>
                <p className="text-center text-xs" style={{ color: "#a8a8a8" }}>
                  🔒 Secure checkout · Free EU shipping · 30-day money back
                </p>
              </div>

              {/* Delivery badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, text: "Free EU Delivery" },
                  { icon: ShieldCheck, text: "30-Day Guarantee" },
                  { icon: RotateCcw, text: "Easy Returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 text-center rounded-xl border border-white/10 p-3">
                    <Icon className="size-4" style={{ color: "#c9a96e" }} />
                    <span className="text-[11px]" style={{ color: "#a8a8a8" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How to use */}
      <section className="border-t border-white/10 py-14 px-4">
        <Container>
          <h2
            className="text-2xl font-semibold text-white text-center mb-10"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            How to use
          </h2>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {product.howToUse.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 p-5 rounded-xl border border-white/10"
                style={{ background: "rgb(255 255 255 / 0.02)" }}
              >
                <span
                  className="size-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-black"
                  style={{ background: "#c9a96e" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#a8a8a8" }}>{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 py-14 px-4">
        <Container>
          <h2
            className="text-2xl font-semibold text-white text-center mb-10"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {product.faq.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-white/10 overflow-hidden"
                style={{ background: "rgb(255 255 255 / 0.02)" }}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-medium text-sm list-none">
                  {q}
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180 shrink-0 ml-3" style={{ color: "#c9a96e" }} />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#a8a8a8" }}>{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/10 py-16 px-4 text-center">
        <Container>
          <h2
            className="text-3xl font-semibold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to start your glow ritual?
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "#a8a8a8" }}>
            Join 12,000+ women who upgraded their skincare routine.
          </p>
          <a
            href={product.shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90"
            style={{ background: "#c9a96e" }}
          >
            Buy Now — €{product.price.toFixed(2)}
          </a>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-white/10 py-14 px-4">
          <Container>
            <h2
              className="text-2xl font-semibold text-white text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Complete your ritual
            </h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/${rel.id}`}
                  className="group flex gap-4 p-4 rounded-xl border border-white/10 hover:border-white/25 transition-all"
                  style={{ background: "rgb(255 255 255 / 0.02)" }}
                >
                  <div className="relative size-20 rounded-lg overflow-hidden shrink-0">
                    <Image src={rel.image} alt={rel.imageAlt} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{rel.name}</p>
                    <p className="text-xs mt-1" style={{ color: "#a8a8a8" }}>{rel.tagline}</p>
                    <p className="text-sm font-bold mt-2" style={{ color: "#c9a96e" }}>€{rel.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
