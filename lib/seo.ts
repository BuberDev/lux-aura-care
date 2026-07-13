import { toSiteUrl } from "@/lib/site";

export function toAbsoluteUrl(path: string) {
  return toSiteUrl(path);
}

export function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function generateBreadcrumbsJsonLd(
  items: { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.item),
    })),
  };
}

export function generateFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
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
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": toAbsoluteUrl("/#organization"),
    name: "Lux Aura Care",
    url: toAbsoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/brand/lux_aura_care_logo.png"),
      width: 600,
      height: 600,
    },
    sameAs: [
      "https://pinterest.com/luxauracare",
      "https://instagram.com/luxauracare",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@luxaura.care",
      availableLanguage: ["en", "pl"],
    },
  };
}

export function generateShopProductJsonLd(product: {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": toAbsoluteUrl(`/shop/${product.id}#product`),
    name: product.name,
    description: product.description,
    image: product.images.map((image) => toAbsoluteUrl(image)),
    brand: {
      "@type": "Brand",
      name: "Lux Aura Care",
    },
    offers: {
      "@type": "Offer",
      url: toAbsoluteUrl(`/shop/${product.id}`),
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function generateReviewJsonLd(product: {
  name: string;
  ratingValue: number;
  reviewCount: number;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: product.ratingValue,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: product.author || "Routine Enthusiast",
    },
  };
}
