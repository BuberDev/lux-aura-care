import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getShopifyCheckoutRoute,
  getShopProductById,
  shopProducts,
} from "@/lib/shop-data";
import { ShopProductSales } from "@/components/shop/shop-product-sales";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { getShopUgcVideosFromDb } from "@/lib/db/media";
import {
  generateFaqJsonLd,
  generateShopProductJsonLd,
  toJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ productId: string }> };

export async function generateStaticParams() {
  return shopProducts.map((p) => ({ productId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const locale = await getRequestLocale();
  const sourceProduct = getShopProductById(productId);
  if (!sourceProduct) return { title: translateText(locale, "Product Not Found") };
  const product = localizeContent(locale, sourceProduct);

  return {
    title: {
      absolute: `${product.name} | ${translateText(locale, "Lux Aura Care Shop")}`,
    },
    description: product.description,
    alternates: getLocalizedAlternates(`/shop/${product.id}`, locale),
    openGraph: {
      title: product.name,
      description: product.description,
      url: localizePathname(`/shop/${product.id}`, locale),
      images: [{ url: product.image, alt: product.imageAlt }],
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { productId } = await params;
  const locale = await getRequestLocale();
  const sourceProduct = getShopProductById(productId);
  if (!sourceProduct) notFound();

  const dbVideos = await getShopUgcVideosFromDb(sourceProduct.id);

  const product = {
    ...localizeContent(locale, sourceProduct),
    shopifyUrl: getShopifyCheckoutRoute(sourceProduct.id),
    ugcVideos: dbVideos.length > 0 ? dbVideos : sourceProduct.ugcVideos,
  };
  const related = localizeContent(
    locale,
    shopProducts.filter((p) => p.id !== sourceProduct.id).slice(0, 2)
  );

  const productJsonLd = generateShopProductJsonLd({
    id: product.id,
    name: product.name,
    description: product.description,
    images:
      product.gallery && product.gallery.length > 0
        ? product.gallery.map((item) => item.url).slice(0, 6)
        : [product.image],
    price: product.price,
    currency: product.currency,
  });
  const faqJsonLd = generateFaqJsonLd(
    product.faq.map(({ q, a }) => ({ question: q, answer: a }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
      />
      <ShopProductSales product={product} related={related} />
    </>
  );
}
