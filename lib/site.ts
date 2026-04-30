const FALLBACK_SITE_URL = "https://luxauracare.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL;

export function toSiteUrl(path: string = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}
