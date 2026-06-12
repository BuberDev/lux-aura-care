import type { Metadata } from "next";
import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Flame, Layers3, Star } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getAffiliateRoute } from "@/lib/affiliate";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import {
  articles,
  getArticleBySlug,
  getCategoryById,
  getProductById,
  getProductProof,
  getProductsByIds,
  getRelatedArticles,
  siteMeta,
} from "@/lib/site-data";
import { T } from "@/components/translated-text";
import { LocalizedDate } from "@/components/localized-date";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const sourceArticle = getArticleBySlug(slug);

  if (!sourceArticle) {
    return {
      title: translateText(locale, "Article Not Found"),
    };
  }
  const article = localizeContent(locale, sourceArticle);

  return {
    title: `${article.title} | ${translateText(locale, "Ritual Guide")}`,
    description: article.excerpt,
    alternates: getLocalizedAlternates(`/blog/${article.slug}`, locale),
    keywords: [
      article.categoryId,
      translateText(locale, "routine guide"),
      translateText(locale, "lifestyle reset"),
      ...(locale === "pl" ? siteMeta.plKeywords : siteMeta.keywords),
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: localizePathname(`/blog/${article.slug}`, locale),
      images: [{ url: article.heroImage, width: 1200, height: 630, alt: article.heroAlt }],
      type: "article",
      publishedTime: article.publishedAt,
      authors: ["Lux Aura Editorial"],
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
    },
  };
}

function ArticleProductBlock({ productId }: { productId: string }) {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  const proof = getProductProof(product.id);

  return (
    <div className="my-10 rounded-3xl border border-accent-gold/30 bg-surface-subtle p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border-subtle">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 220px"
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge><T text={product.trustSignal} /></Badge>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
              <Star className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
              {proof.rating.toFixed(1)} · <T text={proof.reviews} />
            </span>
          </div>

          <h3 className="font-heading text-2xl leading-tight"><T text={product.name} /></h3>
          <p className="text-sm leading-relaxed text-text-secondary"><T text={product.benefit} /></p>

          <ul className="space-y-2">
            {proof.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="text-sm text-text-secondary">
                • <T text={highlight} />
              </li>
            ))}
          </ul>

          <p className="text-xs uppercase tracking-[0.16em] text-accent-gold"><T text={proof.socialProof} /></p>
          <CTAButton href={getAffiliateRoute(product.id, "article-product-block")} label="Check on Amazon" />
        </div>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const sourceArticle = getArticleBySlug(slug);

  if (!sourceArticle) {
    notFound();
  }
  const article = localizeContent(locale, sourceArticle);

  const categorySource = getCategoryById(article.categoryId);
  const category = categorySource ? localizeContent(locale, categorySource) : undefined;
  const relatedArticles = localizeContent(
    locale,
    getRelatedArticles(article.slug, article.categoryId)
  );
  const stickyProducts = localizeContent(locale, getProductsByIds([
    "silk-sleep-mask",
    "retinol-serum",
    "body-oil",
    "bath-salts",
  ]));

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Journal"), item: localizePathname("/blog", locale) },
    ...(category ? [{ name: category.name, item: localizePathname(`/blog?category=${category.id}`, locale) }] : []),
    { name: article.title, item: localizePathname(`/blog/${article.slug}`, locale) },
  ]);

  const faqs = article.sections.map((section) => ({
    question: section.title,
    answer: section.copy,
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const hookPoints = article.sections.slice(0, 3).map((section) => section.title);
  const firstProduct = getProductById(article.sections[0]?.productId ?? "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": toAbsoluteUrl(`${localizePathname(`/blog/${article.slug}`, locale)}#article`),
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        author: {
          "@type": "Organization",
          "@id": toAbsoluteUrl("/#organization"),
          name: "Lux Aura Editorial",
          url: toAbsoluteUrl(localizePathname("/", locale)),
        },
        image: [toAbsoluteUrl(article.heroImage)],
        mainEntityOfPage: toAbsoluteUrl(localizePathname(`/blog/${article.slug}`, locale)),
        articleSection: category?.name ?? article.categoryId,
        inLanguage: locale,
        publisher: {
          "@type": "Organization",
          "@id": toAbsoluteUrl("/#organization"),
          name: "Lux Aura Care",
          logo: {
            "@type": "ImageObject",
            url: toAbsoluteUrl("/lux_aura_care_logo.png"),
          },
        },
        isPartOf: {
          "@type": "WebSite",
          "@id": toAbsoluteUrl("/#website"),
        },
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
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
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <Container className="relative -mt-40 pb-14">
          <div className="theme-on-image max-w-4xl rounded-[2.5rem] border border-border-subtle bg-black/70 p-8 text-text-primary backdrop-blur-sm md:p-10">
            {category ? <Badge>{category.name}</Badge> : null}
            <h1 className="mt-4 font-heading text-4xl leading-tight text-text-primary sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">{article.intro}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
              <span>{article.readTime}</span>
              <span><LocalizedDate value={article.publishedAt} /></span>
              <span>{article.pinHook}</span>
            </div>

            <div className="mt-7 rounded-2xl border border-border-default bg-surface-raised p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-accent-gold"><T text={"What you will get from this guide"} /></p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary md:text-base">
                {hookPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href="/favorites" label="View Amazon Favorites" />
              {firstProduct ? (
                <CTAButton
                  href={getAffiliateRoute(firstProduct.id, "article-hero")}
                  label="Check First Product"
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article className="max-w-4xl">
              {article.sections.map((section, index) => (
                <div key={section.id} className="mb-8 scroll-mt-28 rounded-3xl border border-border-subtle bg-surface-subtle p-6 md:p-8" id={section.id}>
                  <p className="text-xs uppercase tracking-[0.16em] text-accent-gold"><T text={"Step"} /> {index + 1}</p>
                  <h2 className="mt-2 font-heading text-3xl leading-tight">{section.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-text-secondary">{section.copy}</p>

                  {(index + 1) % 2 === 0 ? (
                    <>
                      <ArticleProductBlock productId={section.productId} />
                      <InlineCtaPanel
                        eyebrow="Keep momentum"
                        title="Save this pick while your routine context is fresh"
                        description="Readers who click during the guide are more likely to complete their routine setup the same day."
                        primaryHref="/favorites"
                        primaryLabel="See More Favorites"
                        secondaryHref="/blog"
                        secondaryLabel="Continue Reading"
                      />
                    </>
                  ) : null}
                </div>
              ))}

              {article.sections.length % 2 !== 0 ? (
                <ArticleProductBlock productId={article.sections[article.sections.length - 1].productId} />
              ) : null}
            </article>

            <aside className="hidden lg:block lg:sticky lg:top-28">
              <div className="space-y-5 rounded-3xl border border-border-subtle bg-surface-subtle p-6">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-gold">
                  <Layers3 className="size-4" aria-hidden="true" />
                  <T text={"Quick Jump"} />
                </p>

                <nav aria-label={translateText(locale, "Article sections")} className="space-y-2">
                  {article.sections.map((section) => (
                    <LocalizedLink
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-subtle hover:text-text-primary"
                    >
                      {section.title}
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </LocalizedLink>
                  ))}
                </nav>

                <div className="rounded-2xl border border-border-subtle bg-surface-raised p-4">
                  <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
                    <Flame className="size-4" aria-hidden="true" />
                    <T text={"Popular This Week"} />
                  </p>
                  <ul className="space-y-3">
                    {stickyProducts.slice(0, 3).map((product) => {
                      const proof = getProductProof(product.id);

                      return (
                        <li key={product.id}>
                          <a
                            href={getAffiliateRoute(product.id, "article-sidebar")}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="group block rounded-lg border border-transparent px-2 py-2 text-sm text-text-secondary transition-colors hover:border-border-subtle hover:text-text-primary"
                          >
                            <span className="flex items-center justify-between gap-2">
                              {product.name}
                              <ExternalLink className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
                            </span>
                            <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-accent-gold">{proof.reviews}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <CTAButton href="/favorites" label="Browse All Favorites" className="w-full" />
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {relatedArticles.length > 0 ? (
        <Section className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_1100px]">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-gold"><T text={"Read Next"} /></p>
                <h2 className="mt-3 font-heading text-3xl md:text-4xl"><T text={"Related ritual guides"} /></h2>
              </div>
              <CTAButton href="/blog" label="View All Articles" variant="secondary" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
