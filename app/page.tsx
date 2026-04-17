import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { CategoryCard } from "@/components/category-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { FadeIn } from "@/components/motion/fade-in";
import { NewsletterBlock } from "@/components/newsletter-block";
import { ProductCard } from "@/components/product-card";
import { RoutineSection } from "@/components/sections/routine-section";
import { TopPicksSection } from "@/components/sections/top-picks-section";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { categories, getAmazonFavorites, getFeaturedArticles, siteMeta } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Luxury Self-Care Rituals | High-Glow Habits",
  description:
    "Discover elevated self-care routines and curated Amazon favorites designed for a calm, polished lifestyle. Rituals for sleep, skin, and body glow.",
  keywords: [...siteMeta.keywords, ...siteMeta.plKeywords],
  alternates: {
    canonical: "/",
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
      <section className="relative isolate min-h-[85vh] overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=2200&q=80"
          alt="Luxury self-care setup with candles, skincare, and soft linen textures"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <Container className="relative flex min-h-[85vh] items-end pb-20 pt-28 md:pb-24">
          <FadeIn className="max-w-3xl space-y-8">
            <Badge>Designed for Pinterest Ritual Seekers</Badge>
            <h1 className="font-heading text-5xl leading-[1.05] text-text-primary sm:text-6xl md:text-7xl">
              Transform your evenings into rituals that feel private, luxurious, and deeply restorative.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{siteMeta.tagline}</p>
            <div className="flex flex-wrap gap-4">
              <CTAButton href="/blog" label="Explore Ritual Guides" />
              <CTAButton href="/favorites" label="Shop Amazon Favorites" variant="secondary" />
            </div>
          </FadeIn>
        </Container>
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

      <TopPicksSection />

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
