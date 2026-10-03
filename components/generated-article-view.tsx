import Image from "next/image";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { LocalizedDate } from "@/components/localized-date";
import { LocalizedLink } from "@/components/localized-link";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import type { GeneratedArticle } from "@/lib/generated-articles";
import type { Locale } from "@/lib/i18n/config";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { localizePathname } from "@/lib/i18n/path";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { shopProducts } from "@/lib/shop-data";

type GeneratedArticleViewProps = {
  article: GeneratedArticle;
  locale: Locale;
};

export function GeneratedArticleView({ article, locale }: GeneratedArticleViewProps) {
  const linkedProducts = shopProducts
    .filter((product) => article.content.includes(`/shop/${product.id}`))
    .map((product) => localizeContent(locale, product));
  const localizedContent = article.content.replace(
    /href="(\/(?!\/)[^"]*)"/g,
    (_match, href: string) => `href="${localizePathname(href, locale)}"`,
  );
  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Journal"), item: localizePathname("/blog", locale) },
    { name: article.title, item: localizePathname(`/blog/${article.slug}`, locale) },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: [toAbsoluteUrl(article.heroImage)],
    mainEntityOfPage: toAbsoluteUrl(localizePathname(`/blog/${article.slug}`, locale)),
    articleSection: article.categoryId,
    inLanguage: locale,
    author: { "@type": "Organization", name: "Lux Aura Editorial" },
    publisher: {
      "@type": "Organization",
      name: "Lux Aura Care",
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/brand/lux_aura_care_logo.png"),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(articleJsonLd) }}
      />

      <section className="relative isolate overflow-hidden border-b border-border-subtle">
        <div className="relative h-[58vh] min-h-[440px]">
          <Image
            src={article.heroImage}
            alt={article.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative -mt-40 pb-14">
          <div className="theme-on-image max-w-4xl rounded-[2.5rem] border border-border-subtle bg-black/70 p-8 backdrop-blur-sm md:p-10">
            <Badge>{translateText(locale, "Evidence-led editorial")}</Badge>
            <h1 className="mt-4 font-heading text-4xl leading-tight text-text-primary sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
              <span>{article.readTime}</span>
              <span><LocalizedDate value={article.publishedAt} /></span>
              <span>{translateText(locale, "Sources checked before publication")}</span>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article
              className="journal-prose min-w-0 max-w-4xl"
              dangerouslySetInnerHTML={{ __html: localizedContent }}
            />

            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-border-subtle bg-surface-subtle p-6">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-gold">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {translateText(locale, "Editorial standard")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {translateText(locale, "Claims are checked against the public sources listed in the guide. Health content is educational and does not replace personalized medical advice.")}
                </p>
              </div>

              {linkedProducts.length > 0 ? (
                <div className="rounded-3xl border border-accent-gold/30 bg-accent-gold/5 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">
                    {translateText(locale, "Products mentioned")}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {linkedProducts.slice(0, 5).map((product) => (
                      <li key={product.id}>
                        <LocalizedLink
                          href={`/shop/${product.id}`}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-subtle px-4 py-3 text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                          <span>{product.name}</span>
                          <ExternalLink className="size-4 shrink-0 text-accent-gold" aria-hidden="true" />
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <CTAButton href="/shop" label="Browse the Lux Aura Shop" className="w-full" />
              <CTAButton href="/blog" label="All Journal Articles" variant="secondary" className="w-full" />
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
