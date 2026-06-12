import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FavoritesProductSales } from "@/components/favorites/favorites-product-sales";
import { buildAmazonAffiliateUrl } from "@/lib/affiliate";
import { getProductPageContent } from "@/lib/product-page-content";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { getProductById, getProductProof, products, siteMeta, type Product } from "@/lib/site-data";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const locale = await getRequestLocale();
  const sourceProduct = getProductById(productId);

  if (!sourceProduct) {
    return {
      title: translateText(locale, "Product Not Found"),
    };
  }
  const product = localizeContent(locale, sourceProduct);
  const title = `${product.name} | ${translateText(locale, "Luxury Favorites")}`;

  return {
    title,
    description: product.benefit,
    alternates: getLocalizedAlternates(`/favorites/${product.id}`, locale),
    keywords: [
      product.categoryId,
      product.name,
      translateText(locale, "ritual favorite"),
      ...(locale === "pl" ? siteMeta.plKeywords : siteMeta.keywords),
    ],
    openGraph: {
      title,
      description: product.benefit,
      url: localizePathname(`/favorites/${product.id}`, locale),
      images: [{ url: product.image, width: 1200, height: 630, alt: product.imageAlt }],
      type: "article",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
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
  const locale = await getRequestLocale();
  const sourceProduct = getProductById(productId);

  if (!sourceProduct) {
    notFound();
  }

  const sourceProof = getProductProof(sourceProduct.id);
  const product = localizeContent(locale, sourceProduct);
  const proof = localizeContent(locale, sourceProof);
  const content = localizeContent(locale, getProductPageContent(sourceProduct, sourceProof));
  const relatedProducts = localizeContent(locale, getRelatedProducts(sourceProduct));

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Favorites"), item: localizePathname("/favorites", locale) },
    { name: product.name, item: localizePathname(`/favorites/${product.id}`, locale) },
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": toAbsoluteUrl(`${localizePathname(`/favorites/${product.id}`, locale)}#product`),
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
          url: toAbsoluteUrl(localizePathname(`/favorites/${related.id}`, locale)),
        })),
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          url:
            buildAmazonAffiliateUrl(product.id, {
              source: "website",
              campaign: "product-page",
            })?.toString() ?? toAbsoluteUrl(localizePathname(`/favorites/${product.id}`, locale)),
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
