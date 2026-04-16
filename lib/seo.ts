const SITE_URL = "https://luxaura.care";

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
