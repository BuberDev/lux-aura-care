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

  const product = {
    ...localizeContent(locale, sourceProduct),
    shopifyUrl: getShopifyCheckoutRoute(sourceProduct.id),
  };
  const related = localizeContent(
    locale,
    shopProducts.filter((p) => p.id !== sourceProduct.id).slice(0, 2)
  );

  return <ShopProductSales product={product} related={related} />;
}
