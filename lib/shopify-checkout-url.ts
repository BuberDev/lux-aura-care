const LUX_CHECKOUT_HOSTS = new Set([
  "luxauracare.com",
  "www.luxauracare.com",
  "luxauracare.pl",
  "www.luxauracare.pl",
]);
const CHECKOUT_HOSTS = new Set(["shop.app", "checkout.shopify.com"]);

export function normalizeStorefrontCheckoutUrl(value: string, storeOrigin: string) {
  try {
    const target = new URL(value);
    const store = new URL(storeOrigin);
    if (target.protocol !== "https:" || store.protocol !== "https:") return null;
    if (target.username || target.password || target.port) return null;

    if (LUX_CHECKOUT_HOSTS.has(target.hostname)) {
      target.protocol = store.protocol;
      target.host = store.host;
      target.searchParams.set("_fd", "0");
      return target.toString();
    }

    if (target.hostname !== store.hostname && !CHECKOUT_HOSTS.has(target.hostname)) return null;
    return target.toString();
  } catch {
    return null;
  }
}

export function hasExactRequestedCartLine(
  lines: unknown,
  merchandiseId: string,
  quantity: number
) {
  if (!Array.isArray(lines) || lines.length !== 1) return false;
  const line = lines[0] as { merchandise?: { id?: unknown }; quantity?: unknown } | null;
  return line?.merchandise?.id === merchandiseId && line.quantity === quantity;
}
