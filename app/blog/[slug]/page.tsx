import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Flame, Layers3 } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { FadeIn } from "@/components/motion/fade-in";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import {
  articles,
  getArticleBySlug,
  getCategoryById,
  getProductById,
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
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
      type: "article",
    },
  };
}

function ConversionCtaBlock() {
  return (
    <div className="my-10 rounded-3xl border border-accent-gold/45 bg-accent-gold/10 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Curated Pick</p>
      <h3 className="mt-3 font-heading text-3xl text-text-primary">Want this ritual to feel effortless?</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Save your favorite product now and build your cart while the routine is still fresh.
      </p>
      <CTAButton href="/favorites" label="See Amazon Favorites" className="mt-5" />
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

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="relative h-[55vh] min-h-[420px]">
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
          <FadeIn className="max-w-4xl rounded-[2.5rem] border border-white/12 bg-black/70 p-8 backdrop-blur-sm md:p-10">
            {category ? <Badge>{category.name}</Badge> : null}
            <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">{article.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">{article.intro}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
              <span>{article.readTime}</span>
              <span>{article.publishedAt}</span>
              <span>{article.pinHook}</span>
            </div>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article className="max-w-4xl">
              {article.sections.map((section, index) => {
                const product = getProductById(section.productId);
                if (!product) {
                  return null;
                }

                return (
                  <FadeIn key={section.id} className="mb-10 scroll-mt-28" delay={index * 0.04}>
                    <section id={section.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                      <h2 className="font-heading text-3xl leading-tight">{section.title}</h2>
                      <p className="mt-4 text-base leading-relaxed text-text-secondary">{section.copy}</p>

                      <div className="mt-8 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
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
                          <Badge>{product.trustSignal}</Badge>
                          <h3 className="font-heading text-2xl">{product.name}</h3>
                          <p className="text-sm leading-relaxed text-text-secondary">{product.benefit}</p>
                          <CTAButton href={product.amazonUrl} label="Check on Amazon" />
                        </div>
                      </div>
                    </section>

                    {(index + 1) % 2 === 0 ? <ConversionCtaBlock /> : null}
                  </FadeIn>
                );
              })}
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
                    {stickyProducts.slice(0, 3).map((product) => (
                      <li key={product.id}>
                        <a
                          href={product.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="group flex items-center justify-between text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                          {product.name}
                          <ExternalLink className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <CTAButton href="/favorites" label="Browse All Favorites" className="w-full" />
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {relatedArticles.length > 0 ? (
        <Section className="atmosphere-surface">
          <Container>
            <FadeIn className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Read Next</p>
                <h2 className="mt-3 font-heading text-3xl md:text-4xl">Related ritual guides</h2>
              </div>
              <CTAButton href="/blog" label="View All Articles" variant="secondary" />
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((related, index) => (
                <FadeIn key={related.slug} delay={index * 0.06}>
                  <ArticleCard article={related} />
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
