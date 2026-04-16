export const TRACKING_COOKIES = {
  source: "lac_source",
  campaign: "lac_campaign",
  pinId: "lac_pin_id",
} as const;

export const TRACKING_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type TrafficContext = {
  source?: string;
  campaign?: string;
  pinId?: string;
};

export function sanitizeTrackingValue(value: string | null | undefined, maxLength = 80) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.trim().replace(/[^a-zA-Z0-9-_.]/g, "");
  if (!cleaned) {
    return undefined;
  }

  return cleaned.slice(0, maxLength);
}

export function withQuery(basePath: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  if (!query) {
    return basePath;
  }

  return `${basePath}?${query}`;
}
