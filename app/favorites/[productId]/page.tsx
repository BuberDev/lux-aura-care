import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { FavoritesProductSales } from "@/components/favorites/favorites-product-sales";
import { getProductPageContent } from "@/lib/product-page-content";
import { generateBreadcrumbsJsonLd, toAbsoluteUrl, toJsonLd } from "@/lib/seo";
import { getProductBySlug, getProductProof, products, siteMeta, type ProductDefinition } from "@/lib/site-data";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { resolveProductDisplayPrice } from "@/lib/currency";
import { localizeProduct, localizeProducts } from "@/lib/product-localization";
import { getUgcVideoUrlFromDb } from "@/lib/db/media";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateStaticParams() {
  const slugs = new Set<string>();
  products.forEach((product) => {
    slugs.add(product.slug ?? product.id);
    if (product.marketVariants) {
      Object.values(product.marketVariants).forEach((variant) => {
        if (variant && 'slug' in variant && variant.slug) {
          slugs.add(variant.slug);
        }
      });
    }
  });
  return Array.from(slugs).map((slug) => ({ productId: slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId: slug } = await params;
  const locale = await getRequestLocale();
  const sourceProduct = getProductBySlug(slug, locale);

  if (!sourceProduct) {
    return {
      title: translateText(locale, "Product Not Found"),
    };
  }
  const product = localizeProduct(locale, sourceProduct);
  const title = `${product.name} | ${translateText(locale, "Luxury Favorites")}`;

  return {
    title,
    description: product.benefit,
    alternates: getLocalizedAlternates(`/favorites/${product.slug}`, locale),
    keywords: [
      product.categoryId,
      product.name,
      translateText(locale, "ritual favorite"),
      ...(locale === "pl" ? siteMeta.plKeywords : siteMeta.keywords),
    ],
    openGraph: {
      title,
      description: product.benefit,
      url: localizePathname(`/favorites/${product.slug}`, locale),
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

function getRelatedProducts(currentProduct: ProductDefinition) {
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
  const { productId: slug } = await params;
  const locale = await getRequestLocale();
  const sourceProduct = getProductBySlug(slug, locale);

  if (!sourceProduct) {
    notFound();
  }

  const sourceProof = getProductProof(sourceProduct.id);
  const product = localizeProduct(locale, sourceProduct);

  // Redirect to the canonical slug for this locale if the URL slug is different.
  // E.g. /pl/favorites/mixsoon-bean-essence → /pl/favorites/cosrx-advanced-snail-96
  if (slug !== product.slug) {
    redirect(localizePathname(`/favorites/${product.slug}`, locale));
  }

  const proof = localizeContent(locale, sourceProof);
  const content = localizeContent(locale, getProductPageContent(sourceProduct));
  const relatedProducts = localizeProducts(locale, getRelatedProducts(sourceProduct));
  const displayPrice = await resolveProductDisplayPrice(product, locale);
  const ugcVideoUrl = await getUgcVideoUrlFromDb(sourceProduct.id);

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: translateText(locale, "Home"), item: localizePathname("/", locale) },
    { name: translateText(locale, "Favorites"), item: localizePathname("/favorites", locale) },
    { name: product.name, item: localizePathname(`/favorites/${product.slug}`, locale) },
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": toAbsoluteUrl(`${localizePathname(`/favorites/${product.slug}`, locale)}#product`),
        name: product.name,
        description: product.description,
        image: (product.gallery ?? [{ image: product.image }]).map((item) =>
          toAbsoluteUrl(item.image)
        ),
        isRelatedTo: relatedProducts.map((related) => ({
          "@type": "Product",
          name: related.name,
          url: toAbsoluteUrl(localizePathname(`/favorites/${related.slug}`, locale)),
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
      />
      <FavoritesProductSales
        product={product}
        proof={proof}
        content={content}
        related={relatedProducts}
        displayPrice={displayPrice}
        ugcVideoUrl={ugcVideoUrl}
      />
    </>
  );
}
