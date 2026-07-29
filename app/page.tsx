import type { Metadata } from "next";
import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import { ShieldCheck, Sparkles, Globe2, Check } from "lucide-react";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

import { ArticleCard } from "@/components/article-card";
import { CategoryCard } from "@/components/category-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { NewsletterBlock } from "@/components/newsletter-block";
import { ProductCard } from "@/components/product-card";
import { RoutineSection } from "@/components/sections/routine-section";
import { TopPicksSection } from "@/components/sections/top-picks-section";
import { BundlesSection } from "@/components/sections/bundles-section";
import { Section } from "@/components/section";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { categories, getAmazonFavorites, getFeaturedArticles, products, siteMeta } from "@/lib/site-data";
import { shopProducts } from "@/lib/shop-data";
import { T } from "@/components/translated-text";
import { Badge } from "@/components/ui/badge";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeProducts } from "@/lib/product-localization";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { resolveShopProductsForLocale } from "@/lib/shop-currency";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translateText(locale, "Lux Aura Care | Premium Skincare Tools & Product Guides");
  const description = translateText(
    locale,
    "Shop premium skincare tools, compare curated beauty picks, and read practical product guides before you buy."
  );

  return {
    title,
    description,
    keywords: locale === "pl" ? siteMeta.plKeywords : siteMeta.keywords,
    alternates: getLocalizedAlternates("/", locale),
    openGraph: {
      title,
      description,
      url: localizePathname("/", locale),
      type: "website",
      siteName: "Lux Aura Care",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const trustSignals = [
  {
    label: "Direct shop",
    value: "Own products",
    icon: Sparkles,
  },
  {
    label: "Clear checkout",
    value: "Total before pay",
    icon: ShieldCheck,
  },
  {
    label: "Curated guides",
    value: "Product-first",
    icon: Globe2,
  },
];

function formatShopPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const featuredArticles = localizeContent(locale, getFeaturedArticles());
  const favorites = localizeProducts(locale, getAmazonFavorites());
  const localizedProducts = localizeProducts(locale, products);
  const marketShopProducts = await resolveShopProductsForLocale(shopProducts, locale);
  const localizedShopProducts = localizeContent(locale, marketShopProducts);
  const localizedCategories = localizeContent(locale, categories);
  const localizedTrustSignals = localizeContent(locale, trustSignals);
  const heroProducts = localizedProducts.map((product) => ({
    src: product.image,
    alt: product.imageAlt,
    name: product.name,
  }));
  const mobileHeroProduct = localizedShopProducts[0];

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
  ]);

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": toAbsoluteUrl("/#organization"),
        name: siteMeta.name,
        url: toAbsoluteUrl(localizePathname("/", locale)),
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteUrl("/brand/lux_aura_care_logo.png"),
          width: 600,
          height: 600,
        },
        sameAs: [
          "https://pinterest.com/luxauracare",
          "https://instagram.com/luxauracare",
        ],
      },
      {
        "@type": "WebSite",
        "@id": toAbsoluteUrl("/#website"),
        name: siteMeta.name,
        url: toAbsoluteUrl(localizePathname("/", locale)),
        description: translateText(locale, siteMeta.description),
        publisher: { "@id": toAbsoluteUrl("/#organization") },
        inLanguage: locale,
      },
      {
        "@type": "ItemList",
        name: translateText(locale, "Featured Articles"),
        description: translateText(locale, "Latest product guides for confident beauty shopping."),
        itemListElement: featuredArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(localizePathname(`/blog/${article.slug}`, locale)),
          name: article.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(homeJsonLd) }}
      />
      <div className="absolute top-0 left-0 w-full h-[100svh] -z-20 pointer-events-none">
        <EtheralShadow
          color="var(--hero-aura)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <section className="relative isolate min-h-[640px] border-b border-border-subtle overflow-hidden md:h-[calc(100svh-6.25rem)] md:min-h-[650px]">
        <div className="absolute inset-0 z-0 hidden pointer-events-none md:block">
          <ScrollMorphHero products={heroProducts} />
        </div>

        <Container className="relative z-20 flex min-h-[640px] flex-col justify-center gap-6 py-10 md:hidden">
          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
              <T text={"Premium skincare tools"} />
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-text-primary">
              <T text={"Skincare tools that are easy to choose"} />
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              <T text={"Compare details, usage notes, and final checkout information before you buy."} />
            </p>
            <div className="mt-6">
              <CTAButton href="/shop" label="Shop now" />
            </div>
          </div>

          {mobileHeroProduct ? (
            <LocalizedLink
              href={`/shop/${mobileHeroProduct.id}`}
              className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background-primary">
                <Image
                  src={mobileHeroProduct.image}
                  alt={mobileHeroProduct.imageAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold">
                  <T text={"Featured shop product"} />
                </p>
                <h2 className="font-heading text-2xl leading-tight text-text-primary">
                  {mobileHeroProduct.name}
                </h2>
                <p className="text-sm text-text-secondary">{mobileHeroProduct.tagline}</p>
                <p className="text-lg font-bold text-accent-gold">
                  {formatShopPrice(mobileHeroProduct.price, mobileHeroProduct.currency, locale)}
                </p>
              </div>
            </LocalizedLink>
          ) : null}

          <ul className="grid gap-2" aria-label={translateText(locale, "Trust signals")}>
            {localizedTrustSignals.map((item) => (
              <li key={item.label} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-subtle px-4 py-3">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent-gold">
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-text-primary">{item.value}</span>
              </li>
            ))}
          </ul>
        </Container>

        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 hidden pointer-events-none md:block">
          <Container className="pointer-events-auto">
            <ul className="grid gap-3 md:grid-cols-3" aria-label={translateText(locale, "Trust signals")}>
              {localizedTrustSignals.map((item) => (
                <li key={item.label} className="theme-on-image rounded-2xl border border-border-subtle bg-black/30 backdrop-blur-md px-4 py-4 shadow-xl">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-accent-gold">
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{item.value}</p>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* ===== SHOP SECTION ===== */}
      <Section className="border-b border-border-subtle py-16">
        <Container>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent-gold)" }}>
              <T text={"Now in the shop"} />
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-text-primary mb-4">
              <T text={"Shop Lux Aura Care skincare tools"} />
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              <T text={"Face rollers, gua sha tools, dermaplaning razors, patches, and masks with clear product details before checkout."} />
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {localizedShopProducts.map((product) => (
              <LocalizedLink
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle transition-all duration-300 hover:border-border-strong"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge variant="product" className="absolute top-3 left-3 font-bold">
                    {product.badge}
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-lg text-text-primary">{product.name}</h3>
                  <ul className="space-y-1">
                    {product.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <Check className="size-3.5 mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold text-text-primary">
                      {formatShopPrice(product.price, product.currency, locale)}
                    </span>
                    {product.compareAtPrice > product.price && (
                      <span className="text-sm line-through" style={{ color: "var(--text-secondary)" }}>
                        {formatShopPrice(product.compareAtPrice, product.currency, locale)}
                      </span>
                    )}
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>

          <div className="text-center">
            <CTAButton href="/shop" label="Shop all products" />
          </div>
        </Container>
      </Section>
      {/* ===== END SHOP SECTION ===== */}

      <TopPicksSection />

      <BundlesSection />

      <Section id="categories" className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
        <Container>
          <Heading
            eyebrow="Shop by goal"
            title="Choose the skincare goal you want to solve first"
            description="Each category keeps the choice focused, with products and guides organized around one clear need."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {localizedCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <InlineCtaPanel
            className="mt-12"
            eyebrow="Need a quick start?"
            title="Start with one product goal, then compare the best match"
            description="Choose the result you want, read one focused guide, and move to the product page with enough context to decide calmly."
            primaryHref="/shop"
            primaryLabel="Shop skincare tools"
            secondaryHref="/blog"
            secondaryLabel="Read product guides"
          />
        </Container>
      </Section>

      <Section id="featured-articles" className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
        <Container>
          <Heading
            eyebrow="Product Guides"
            title="Helpful guides for choosing without second-guessing"
            description="Benefit-led editorial pages that explain what each product is for, when it makes sense, and how to use it safely."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </Section>

      <RoutineSection />

      <Section id="amazon-favorites" className="[content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
        <Container>
          <Heading
            eyebrow="Amazon Finds"
            title="Curated product picks with clear trust signals"
            description="Practical beauty and self-care products selected for repeat use, strong shopper signals, and easy comparison."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                detailsHref={`/favorites/${product.slug}`}
              />
            ))}
          </div>

          <InlineCtaPanel
            className="mt-12"
            eyebrow="Ready to compare"
            title="Open the strongest picks while the product details are fresh"
            description="Compare the curated favorites in one flow and keep your cart focused around the result you actually want."
            primaryHref="/favorites"
            primaryLabel="Compare curated favorites"
            secondaryHref="/blog"
            secondaryLabel="Read more guides"
          />
        </Container>
      </Section>

      <NewsletterBlock />
    </>
  );
}
