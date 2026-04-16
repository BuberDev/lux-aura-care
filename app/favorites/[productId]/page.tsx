import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BenefitList } from "@/components/product-page/benefit-list";
import { BenefitStrip } from "@/components/product-page/benefit-strip";
import { CTASection } from "@/components/product-page/cta-section";
import { ProblemSolution } from "@/components/product-page/problem-solution";
import { ProductHero } from "@/components/product-page/product-hero";
import { RelatedProducts } from "@/components/product-page/related-products";
import { RoutineSection } from "@/components/product-page/routine-section";
import { SocialProof } from "@/components/product-page/social-proof";
import { getAffiliateRoute } from "@/lib/affiliate";
import { getProductPageContent } from "@/lib/product-page-content";
import { toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { getProductById, getProductProof, products, type Product } from "@/lib/site-data";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Lux Aura Care`,
    description: product.benefit,
    alternates: {
      canonical: `/favorites/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Lux Aura Care`,
      description: product.benefit,
      url: `/favorites/${product.id}`,
      images: [product.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Lux Aura Care`,
      description: product.benefit,
      images: [product.image],
    },
  };
}

function getRelatedProducts(currentProduct: Product) {
  const sameCategory = products.filter(
    (product) => product.id !== currentProduct.id && product.categoryId === currentProduct.categoryId
  );

  if (sameCategory.length >= 4) {
    return sameCategory.slice(0, 4);
  }

  const fallbackProducts = products.filter(
    (product) => product.id !== currentProduct.id && product.categoryId !== currentProduct.categoryId
  );

  return [...sameCategory, ...fallbackProducts].slice(0, 4);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const proof = getProductProof(product.id);
  const content = getProductPageContent(product, proof);
  const relatedProducts = getRelatedProducts(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [toAbsoluteUrl(product.image)],
    brand: {
      "@type": "Brand",
      name: "Lux Aura Care",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: proof.rating,
      reviewCount: Number.parseInt(proof.reviews.replace(/[^\d]/g, ""), 10) || 1000,
    },
    isRelatedTo: relatedProducts.map((related) => ({
      "@type": "Product",
      name: related.name,
      url: toAbsoluteUrl(`/favorites/${related.id}`),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
      />
      <ProductHero
        product={product}
        proof={proof}
        emotionalHook={content.emotionalHook}
        keyBenefits={content.heroBenefits}
      />
      <BenefitStrip items={content.quickBenefits} />
      <ProblemSolution
        headline={content.problemHeadline}
        problemParagraph={content.problemParagraph}
        solutionParagraph={content.solutionParagraph}
        ctaHref={getAffiliateRoute(product.id, "product-problem-solution")}
      />
      <BenefitList items={content.detailedBenefits} />
      <RoutineSection
        title={content.ritualTitle}
        steps={content.ritualSteps}
        ctaHref={getAffiliateRoute(product.id, "product-routine")}
      />
      <SocialProof
        headline={content.socialHeadline}
        socialLine={content.socialProofLine}
        ratingLabel={content.socialRatingLabel}
        reviews={proof.reviews}
        ctaHref={getAffiliateRoute(product.id, "product-social-proof")}
      />
      <RelatedProducts products={relatedProducts} />
      <CTASection ctaHref={getAffiliateRoute(product.id, "product-final-cta")} />
    </>
  );
}
