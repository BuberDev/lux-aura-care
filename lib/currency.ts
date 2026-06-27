import "server-only";

import type { Locale } from "@/lib/i18n/config";
import type { MarketplacePrice, Product, ProductCurrency } from "@/lib/site-data";

const LIVE_RATE_REVALIDATE_SECONDS = 900;
const NBP_RATE_REVALIDATE_SECONDS = 21600;

type ExchangeRateQuote = {
  rate: number;
  source: "CurrencyAPI" | "NBP";
  updatedAt: string;
};

export type ProductDisplayPrice = {
  amount: number;
  currency: ProductCurrency;
  formatted: string;
  status: MarketplacePrice["status"];
  checkedAt?: string;
  approximateLocalPrice?: {
    amount: number;
    currency: "PLN";
    formatted: string;
    source: ExchangeRateQuote["source"];
    updatedAt: string;
  };
};

type CurrencyApiResponse = {
  meta?: { last_updated_at?: string };
  data?: { PLN?: { value?: number } };
};

type NbpResponse = {
  rates?: Array<{ effectiveDate?: string; mid?: number }>;
};

function isPositiveRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

async function getLiveUsdPlnRate(): Promise<ExchangeRateQuote | null> {
  const apiKey = process.env.CURRENCY_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch(
      "https://api.currencyapi.com/v3/latest?currencies=PLN&base_currency=USD",
      {
        headers: { apikey: apiKey },
        next: {
          revalidate: LIVE_RATE_REVALIDATE_SECONDS,
          tags: ["exchange-rate-usd-pln-live"],
        },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as CurrencyApiResponse;
    const rate = payload.data?.PLN?.value;
    if (!isPositiveRate(rate)) return null;

    return {
      rate,
      source: "CurrencyAPI",
      updatedAt: payload.meta?.last_updated_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function getNbpUsdPlnRate(): Promise<ExchangeRateQuote | null> {
  try {
    const response = await fetch(
      "https://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json",
      {
        next: {
          revalidate: NBP_RATE_REVALIDATE_SECONDS,
          tags: ["exchange-rate-usd-pln-nbp"],
        },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as NbpResponse;
    const latestRate = payload.rates?.[0];
    if (!isPositiveRate(latestRate?.mid)) return null;

    return {
      rate: latestRate.mid,
      source: "NBP",
      updatedAt: latestRate.effectiveDate ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getUsdPlnRate() {
  return (await getLiveUsdPlnRate()) ?? getNbpUsdPlnRate();
}

function formatCurrency(amount: number, currency: ProductCurrency, locale: Locale) {
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function resolveProductDisplayPrice(
  product: Pick<Product, "price" | "activeMarket">,
  locale: Locale
): Promise<ProductDisplayPrice | null> {
  if (product.price.amount === null) return null;

  const displayPrice: ProductDisplayPrice = {
    amount: product.price.amount,
    currency: product.price.currency,
    formatted: formatCurrency(product.price.amount, product.price.currency, locale),
    status: product.price.status,
    checkedAt: product.price.status === "verified" ? product.price.checkedAt : undefined,
  };

  const shouldShowApproximatePln =
    locale === "pl" && product.activeMarket === "us" && product.price.currency === "USD";

  if (!shouldShowApproximatePln) return displayPrice;

  const quote = await getUsdPlnRate();
  if (!quote) return displayPrice;

  const convertedAmount = Math.round(product.price.amount * quote.rate * 100) / 100;
  return {
    ...displayPrice,
    approximateLocalPrice: {
      amount: convertedAmount,
      currency: "PLN",
      formatted: formatCurrency(convertedAmount, "PLN", locale),
      source: quote.source,
      updatedAt: quote.updatedAt,
    },
  };
}
