import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link";
import Image from "next/image";
import { Check, ChevronRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Container } from "@/components/container";
import { NewsletterBlock } from "@/components/newsletter-block";
import { shopProducts, type ShopProduct } from "@/lib/shop-data";
import { T } from "@/components/translated-text";
import { Badge } from "@/components/ui/badge";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { resolveShopProductsForLocale } from "@/lib/shop-currency";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Shop Beauty, Self-Care & Style | Lux Aura Care");
  const description = translateText(
    locale,
    "Discover thoughtfully selected skincare tools, body-care essentials and polished style pieces from Lux Aura Care."
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

const purchaseDetails = [
  { icon: Truck, label: "Delivery Options", sub: "Calculated before checkout" },
  { icon: ShieldCheck, label: "Secure Checkout", sub: "Processed by Shopify" },
  { icon: RotateCcw, label: "14-Day Returns", sub: "EU right of withdrawal" },
];

function formatShopPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function ShopProductTile({
  product,
  locale,
  priority = false,
}: {
  product: ShopProduct;
  locale: string;
  priority?: boolean;
}) {
  const isComingSoon = product.purchaseStatus === "coming-soon";
  const isFashion = product.category === "fashion";

  return (
    <LocalizedLink
      href={`/shop/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle transition-all duration-300 hover:border-accent-gold/45 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
    >
      <div className={`relative overflow-hidden ${isFashion ? "aspect-[4/5] bg-[#f4f0e9]" : "aspect-[4/3]"}`}>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`${isFashion ? "object-contain object-top" : "object-cover"} transition-transform duration-500 group-hover:scale-[1.03]`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge variant="product" className="absolute left-3 top-3">
          <T
            text={
              isComingSoon
                ? "Coming soon"
                : product.isBestSeller
                  ? "Bestseller"
                  : product.isNew
                    ? "New arrival"
                    : product.badge
            }
          />
        </Badge>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5 md:p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold text-text-primary" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {product.name}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{product.tagline}</p>
        </div>

        <ul className="space-y-1.5">
          {product.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <Check className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-baseline gap-3 pt-1">
          {isComingSoon ? (
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-accent-gold">
              <T text={"Preview the colorways"} />
            </span>
          ) : (
            <>
              <span className="text-2xl font-bold text-text-primary">
                {formatShopPrice(product.price, product.currency, locale)}
              </span>
              {product.compareAtPrice > product.price && (
                <>
                  <span className="text-sm line-through" style={{ color: "var(--text-secondary)" }}>
                    {formatShopPrice(product.compareAtPrice, product.currency, locale)}
                  </span>
                  <span className="rounded px-2 py-0.5 text-xs font-semibold" style={{ background: "rgb(201 169 110 / 0.15)", color: "var(--accent-gold)" }}>
                    -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </>
          )}
        </div>

        <div
          className="flex min-h-12 w-full items-center justify-center gap-1 rounded-xl px-4 py-3 text-center text-sm font-semibold text-black transition-opacity group-hover:opacity-90"
          style={{ background: "var(--accent-gold)" }}
        >
          <T text={isComingSoon ? "View colors" : "View product"} />
          <ChevronRight className="size-4" aria-hidden="true" />
        </div>
      </div>
    </LocalizedLink>
  );
}

export default async function ShopPage() {
  const locale = await getRequestLocale();
  const localizedPurchaseDetails = localizeContent(locale, purchaseDetails);
  const marketProducts = await resolveShopProductsForLocale(shopProducts, locale);
  const localizedProducts = localizeContent(locale, marketProducts);
  const careProducts = localizedProducts.filter((product) => product.category !== "fashion");
  const styleProducts = localizedProducts.filter((product) => product.category === "fashion");
  const trustStats = localizeContent(locale, [
    { stat: String(shopProducts.length), label: "curated care and style products" },
    { stat: "Clear", label: "product-specific photos and descriptions" },
    { stat: "Direct", label: "checkout with final total shown before payment" },
  ]);

  return (
    <div className="min-h-screen bg-background-primary">

      {/* Hero */}
      <section className="border-b border-border-subtle py-16 md:py-20 px-4">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent-gold)" }}>
              <T text={"Beauty, self-care and style"} />
            </p>
            <h1
              className="text-4xl md:text-6xl font-semibold text-text-primary mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Thoughtful essentials for your routine and wardrobe"} />
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              <T text={"Explore skincare tools, body-care essentials and a polished style edit, with clear product details before checkout."} />
            </p>
          </div>
        </Container>
      </section>

      {/* Purchase details */}
      <section className="border-b border-border-subtle py-6">
        <Container>
          <ul className="grid grid-cols-3 gap-4">
            {localizedPurchaseDetails.map(({ icon: Icon, label, sub }) => (
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
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold"><T text={"Care collection"} /></p>
            <h2 className="mt-2 text-3xl font-semibold text-text-primary" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Skincare and body-care essentials"} />
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careProducts.map((product, index) => (
              <ShopProductTile key={product.id} product={product} locale={locale} priority={index === 0} />
            ))}
          </div>

          {styleProducts.length > 0 && (
            <div className="mt-16 border-t border-border-subtle pt-12">
              <div className="mb-8 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold"><T text={"The style edit"} /></p>
                <h2 className="mt-2 text-3xl font-semibold text-text-primary" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <T text={"Polished pieces, clearly presented"} />
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  <T text={"One product page per design, with every color shown as a true variant—not as a duplicate listing."} />
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {styleProducts.map((product) => (
                  <ShopProductTile key={product.id} product={product} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Trust bar */}
      <section className="border-t border-border-subtle py-12 px-4">
        <Container>
          <p
            className="text-center text-lg font-medium mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}
          >
            <T text={"How the Lux Aura shop works"} />
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

      <NewsletterBlock />
    </div>
  );
}
