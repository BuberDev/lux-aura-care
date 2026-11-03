import type { ShopProduct } from "./shop-data";

const MAX_CHECKOUT_QUANTITY = 10;
const regionNames = new Intl.DisplayNames(["en"], { type: "region", fallback: "none" });

function singleParam(params: URLSearchParams, name: string): string | null | undefined {
  const values = params.getAll(name);
  return values.length > 1 ? undefined : values[0] ?? null;
}

export function selectCheckoutItem(product: ShopProduct, params: URLSearchParams) {
  const variantId = singleParam(params, "variantId");
  const sizeId = singleParam(params, "sizeId");
  const quantityParam = singleParam(params, "quantity");
  const countryParam = singleParam(params, "country");
  if (
    variantId === undefined || sizeId === undefined ||
    quantityParam === undefined || countryParam === undefined
  ) return null;

  const variants = product.variants ?? [];
  if (variants.length > 0 && !variantId) return null;
  if (variants.length === 0 && variantId !== null) return null;
  const variant = variantId ? variants.find((item) => item.id === variantId) : undefined;
  if (variantId && !variant) return null;

  const sizes = variant?.sizes ?? product.sizes ?? [];
  if (sizes.length > 0 && !sizeId) return null;
  if (sizes.length === 0 && sizeId !== null) return null;
  const size = sizeId ? sizes.find((item) => item.id === sizeId) : undefined;
  if (sizeId && (!size || size.available === false)) return null;

  const quantity = quantityParam === null ? 1 : Number(quantityParam);
  if (quantityParam !== null && !/^[1-9]\d*$/.test(quantityParam)) return null;
  if (!Number.isSafeInteger(quantity) || quantity > MAX_CHECKOUT_QUANTITY) return null;

  const countryCode = countryParam?.toUpperCase() ?? null;
  if (
    countryCode &&
    (!/^[A-Z]{2}$/.test(countryCode) ||
      ["EU", "UN", "ZZ"].includes(countryCode) ||
      !regionNames.of(countryCode))
  ) return null;
  if (countryParam === "") return null;

  return {
    shopifyUrl: size?.shopifyUrl ?? variant?.shopifyUrl ?? product.shopifyUrl,
    quantity,
    countryCode,
  };
}
