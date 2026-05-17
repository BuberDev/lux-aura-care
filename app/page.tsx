import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, TrendingUp, Check } from "lucide-react";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";

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

export const metadata: Metadata = {
  title: "Luxury Self-Care Rituals | High-Glow Habits",
  description:
    "Discover elevated self-care routines and curated Amazon favorites designed for a calm, polished lifestyle. Rituals for sleep, skin, and body glow.",
  keywords: [...siteMeta.keywords, ...siteMeta.plKeywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Luxury Self-Care Rituals | High-Glow Habits",
    description:
      "Discover elevated self-care routines and curated Amazon favorites designed for a calm, polished lifestyle.",
    url: "/",
    type: "website",
    siteName: "Lux Aura Care",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Self-Care Rituals | High-Glow Habits",
    description:
      "Discover elevated self-care routines and curated Amazon favorites designed for a calm, polished lifestyle.",
  },
};

const trustSignals = [
  {
    label: "Monthly Readers",
    value: "50K+",
    icon: Sparkles,
  },
  {
    label: "Average Product Rating",
    value: "4.8/5",
    icon: ShieldCheck,
  },
  {
    label: "Amazon Clickouts",
    value: "12K+",
    icon: TrendingUp,
  },
];

export default function HomePage() {
  const featuredArticles = getFeaturedArticles();
  const favorites = getAmazonFavorites();
  const heroProducts = products.map((product) => ({
    src: product.image,
    alt: product.imageAlt,
    name: product.name,
  }));

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: "Home", item: "/" },
  ]);

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": toAbsoluteUrl("/#organization"),
        name: siteMeta.name,
        url: toAbsoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteUrl("/lux_aura_care_logo.png"),
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
        url: toAbsoluteUrl("/"),
        description: siteMeta.description,
        publisher: { "@id": toAbsoluteUrl("/#organization") },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        name: "Featured Articles",
        description: "Latest ritual guides for a polished lifestyle.",
        itemListElement: featuredArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(`/blog/${article.slug}`),
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
      <section className="relative isolate h-[min(720px,calc(100svh-7rem))] min-h-[500px] border-b border-white/10">
        <ScrollMorphHero products={heroProducts} />
      </section>

      <Section className="border-b border-white/10 py-8 md:py-10">
        <Container>
          <ul className="grid gap-3 md:grid-cols-3" aria-label="Trust signals">
            {trustSignals.map((item) => (
              <li key={item.label} className="rounded-2xl border border-white/12 bg-white/[0.02] px-4 py-4">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-accent-gold">
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{item.value}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== SHOP SECTION ===== */}
      <Section className="border-b border-white/10 py-16">
        <Container>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "#c9a96e" }}>
              New · Skin Rituals
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
              Shop our ritual essentials
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#a8a8a8" }}>
              Clinic-quality results at home. Designed for women 40+.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {shopProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block rounded-2xl border border-white/10 overflow-hidden hover:border-white/25 transition-all duration-300"
                style={{ background: "rgb(255 255 255 / 0.02)" }}
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
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "#c9a96e", color: "#000" }}
                  >
                    {product.badge}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-lg text-white">{product.name}</h3>
                  <ul className="space-y-1">
                    {product.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs" style={{ color: "#a8a8a8" }}>
                        <Check className="size-3.5 mt-0.5 shrink-0" style={{ color: "#c9a96e" }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
                    <span className="text-sm line-through" style={{ color: "#a8a8a8" }}>€{product.compareAtPrice.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <CTAButton href="/shop" label="View All Products" />
          </div>
        </Container>
      </Section>
      {/* ===== END SHOP SECTION ===== */}

      <TopPicksSection />

      <BundlesSection />

      <Section id="categories" className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
        <Container>
          <Heading
            eyebrow="Featured Categories"
            title="Choose the ritual category that matches your mood"
            description="Each category is curated for fast scanning and clear next actions so it is easy to move from inspiration to results."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <InlineCtaPanel
            className="mt-12"
            eyebrow="Need a quick start?"
            title="Start with one routine, then add products as confidence grows"
            description="Readers convert better when they choose one clear ritual first. Browse high-performing guides and open products only when needed."
            primaryHref="/blog"
            primaryLabel="See Beginner-Friendly Guides"
            secondaryHref="/favorites"
            secondaryLabel="View Curated Favorites"
          />
        </Container>
      </Section>

      <Section id="featured-articles" className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
        <Container>
          <Heading
            eyebrow="Featured Articles"
            title="High-performing routines your audience will actually save and use"
            description="Benefit-led editorial pieces structured for clarity, trust, and action."
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
            eyebrow="Amazon Favorites"
            title="Curated product picks with strong trust signals"
            description="Elegant, practical upgrades chosen for repeat use and lifestyle fit."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                urgencyOverride={index < 2 ? "Limited-time favorite" : undefined}
                detailsHref={`/favorites/${product.id}`}
              />
            ))}
          </div>

          <InlineCtaPanel
            className="mt-12"
            eyebrow="Ready to shop"
            title="Keep your routine momentum while products are fresh in mind"
            description="Open your favorites now, compare in one tab, and build a focused cart around one routine goal."
            primaryHref="/favorites"
            primaryLabel="Browse All Product Collections"
            secondaryHref="/blog"
            secondaryLabel="Read More Guides"
          />
        </Container>
      </Section>

      <NewsletterBlock />
    </>
  );
}
