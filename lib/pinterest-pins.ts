import {
  getArticleBySlug,
  getCategoryById,
  getProductById,
  type CategoryId,
} from "@/lib/site-data";

type PinTarget =
  | { type: "article"; slug: string }
  | { type: "product"; productId: string }
  | { type: "category"; categoryId: CategoryId }
  | { type: "favorites" };

export type PinterestPin = {
  id: string;
  title: string;
  campaign: string;
  target: PinTarget;
};

export const pinterestPins: PinterestPin[] = [
  {
    id: "niacinamide-brighter-skin",
    title: "Brighter skin starter toner",
    campaign: "spring-glow",
    target: { type: "product", productId: "niacinamide-toner" },
  },
  {
    id: "facial-cleansing-brush",
    title: "Deep clean facial brush",
    campaign: "spring-glow",
    target: { type: "product", productId: "coslus-cleansing-brush" },
  },
  {
    id: "pure-copper-bottle",
    title: "Pure copper wellness bottle",
    campaign: "daily-ritual",
    target: { type: "product", productId: "copper-water-bottle" },
  },
  {
    id: "magnesium-glycinate-support",
    title: "Magnesium evening support",
    campaign: "sleep-reset",
    target: { type: "product", productId: "vitamin-d3-k2" },
  },
  {
    id: "essential-oils-gift-set",
    title: "Aromatherapy gift set",
    campaign: "spa-sunday",
    target: { type: "product", productId: "cliganic-essential-oils" },
  },
  {
    id: "womens-plush-robe",
    title: "Soft plush robe",
    campaign: "spa-sunday",
    target: { type: "product", productId: "pavilia-plush-robe" },
  },
  {
    id: "aveeno-body-oil-mist",
    title: "Daily moisturizing body oil",
    campaign: "body-glow",
    target: { type: "article", slug: "body-care-that-looks-expensive" },
  },
  {
    id: "mixsoon-bean-essence",
    title: "Bean essence smoothing step",
    campaign: "spring-glow",
    target: { type: "product", productId: "mixsoon-bean-essence" },
  },
];

export function getPinterestPinById(pinId: string) {
  return pinterestPins.find((pin) => pin.id === pinId);
}

export function resolvePinTargetHref(target: PinTarget) {
  if (target.type === "favorites") {
    return "/favorites";
  }

  if (target.type === "article") {
    const article = getArticleBySlug(target.slug);
    return article ? `/blog/${article.slug}` : "/blog";
  }

  if (target.type === "category") {
    const category = getCategoryById(target.categoryId);
    return category ? `/blog?category=${category.id}` : "/blog";
  }

  const product = getProductById(target.productId);
  return product ? `/favorites/${product.id}` : "/favorites";
}
