import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Flame, Layers3, Star } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getAffiliateRoute } from "@/lib/affiliate";
import { toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import {
  articles,
  getArticleBySlug,
  getCategoryById,
  getProductById,
  getProductProof,
  getProductsByIds,
  getRelatedArticles,
} from "@/lib/site-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      images: [article.heroImage],
      type: "article",
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
    <div className="my-10 rounded-3xl border border-accent-gold/30 bg-white/[0.02] p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
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
            <Badge>{product.trustSignal}</Badge>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
              <Star className="size-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
              {proof.rating.toFixed(1)} · {proof.reviews}
            </span>
          </div>

          <h3 className="font-heading text-2xl leading-tight">{product.name}</h3>
          <p className="text-sm leading-relaxed text-text-secondary">{product.benefit}</p>

          <ul className="space-y-2">
            {proof.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="text-sm text-text-secondary">
                • {highlight}
              </li>
            ))}
          </ul>

          <p className="text-xs uppercase tracking-[0.16em] text-accent-gold">{proof.socialProof}</p>
          <CTAButton href={getAffiliateRoute(product.id, "article-product-block")} label="Check on Amazon" />
        </div>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryById(article.categoryId);
  const relatedArticles = getRelatedArticles(article.slug, article.categoryId);
  const stickyProducts = getProductsByIds([
    "silk-sleep-mask",
    "retinol-serum",
    "body-oil",
    "bath-salts",
  ]);

  const hookPoints = article.sections.slice(0, 3).map((section) => section.title);
  const firstProduct = getProductById(article.sections[0]?.productId ?? "");
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Lux Aura Care",
    },
    image: [toAbsoluteUrl(article.heroImage)],
    mainEntityOfPage: toAbsoluteUrl(`/blog/${article.slug}`),
    articleSection: category?.name ?? article.categoryId,
    about: article.sections.map((section) => section.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(articleJsonLd) }}
      />
      <section className="relative isolate overflow-hidden border-b border-white/10">
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
          <div className="max-w-4xl rounded-[2.5rem] border border-white/12 bg-black/70 p-8 backdrop-blur-sm md:p-10">
            {category ? <Badge>{category.name}</Badge> : null}
            <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">{article.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">{article.intro}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
              <span>{article.readTime}</span>
              <span>{article.publishedAt}</span>
              <span>{article.pinHook}</span>
            </div>

            <div className="mt-7 rounded-2xl border border-white/15 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-accent-gold">What you will get from this guide</p>
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
                <div key={section.id} className="mb-8 scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8" id={section.id}>
                  <p className="text-xs uppercase tracking-[0.16em] text-accent-gold">Step {index + 1}</p>
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
              <div className="space-y-5 rounded-3xl border border-white/12 bg-white/[0.02] p-6">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-gold">
                  <Layers3 className="size-4" aria-hidden="true" />
                  Quick Jump
                </p>

                <nav aria-label="Article sections" className="space-y-2">
                  {article.sections.map((section) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm text-text-secondary transition-colors hover:border-white/10 hover:text-text-primary"
                    >
                      {section.title}
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  ))}
                </nav>

                <div className="rounded-2xl border border-white/12 bg-black/35 p-4">
                  <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
                    <Flame className="size-4" aria-hidden="true" />
                    Popular This Week
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
                            className="group block rounded-lg border border-transparent px-2 py-2 text-sm text-text-secondary transition-colors hover:border-white/10 hover:text-text-primary"
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
                <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Read Next</p>
                <h2 className="mt-3 font-heading text-3xl md:text-4xl">Related ritual guides</h2>
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
