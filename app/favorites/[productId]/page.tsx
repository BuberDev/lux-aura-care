import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FavoritesProductSales } from "@/components/favorites/favorites-product-sales";
import { buildAmazonAffiliateUrl } from "@/lib/affiliate";
import { getProductPageContent } from "@/lib/product-page-content";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { getProductById, getProductProof, products, siteMeta, type Product } from "@/lib/site-data";

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
    title: `${product.name} | Luxury Favorites`,
    description: product.benefit,
    alternates: {
      canonical: `/favorites/${product.id}`,
    },
    keywords: [product.categoryId, product.name, "ritual favorite", ...siteMeta.keywords],
    openGraph: {
      title: `${product.name} | Luxury Favorites`,
      description: product.benefit,
      url: `/favorites/${product.id}`,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.imageAlt }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Luxury Favorites`,
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

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: "Home", item: "/" },
    { name: "Favorites", item: "/favorites" },
    { name: product.name, item: `/favorites/${product.id}` },
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": toAbsoluteUrl(`/favorites/${product.id}#product`),
        name: product.name,
        description: product.description,
        image: [toAbsoluteUrl(product.image)],
        brand: {
          "@type": "Brand",
          "@id": toAbsoluteUrl("/#organization"),
          name: "Lux Aura Care",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: proof.rating,
          reviewCount: Number.parseInt(proof.reviews.replace(/[^\d]/g, ""), 10) || 1000,
        },
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: proof.rating,
          },
          author: {
            "@type": "Person",
            name: "Lux Aura Editorial",
          },
        },
        isRelatedTo: relatedProducts.map((related) => ({
          "@type": "Product",
          name: related.name,
          url: toAbsoluteUrl(`/favorites/${related.id}`),
        })),
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          url:
            buildAmazonAffiliateUrl(product.id, {
              source: "website",
              campaign: "product-page",
            })?.toString() ?? toAbsoluteUrl(`/favorites/${product.id}`),
          seller: {
            "@id": toAbsoluteUrl("/#organization"),
          },
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
      />
      <FavoritesProductSales
        product={product}
        proof={proof}
        content={content}
        related={relatedProducts}
      />
    </>
  );
}
