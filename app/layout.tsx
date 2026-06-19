import type { Metadata, Viewport } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { getLocalizedAlternates } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent, translateText } from "@/lib/i18n/messages";
import { generateOrganizationJsonLd, toJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { products, siteMeta } from "@/lib/site-data";

import "./globals.css";

const themeInitializationScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("lux-aura-theme");
      const theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const root = document.documentElement;
      root.dataset.theme = theme;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        theme === "dark" ? "#090807" : "#f8f5ef"
      );
    } catch {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
    }
  })();
`;

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#090807",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const description = translateText(locale, siteMeta.description);
  const title = translateText(locale, "Lux Aura Care | Luxury Self-Care & Ritual Guides");
  const socialTitle = translateText(locale, "Lux Aura Care | Professional High-Glow Rituals");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Lux Aura Care",
    },
    description,
    keywords: locale === "pl" ? siteMeta.plKeywords : siteMeta.keywords,
    authors: [{ name: "Lux Aura Editorial Team" }],
    creator: "Lux Aura Care",
    publisher: "Lux Aura Care",
    alternates: getLocalizedAlternates("/", locale),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: getLocalizedAlternates("/", locale).canonical,
      siteName: "Lux Aura Care",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: "@luxauracare",
      images: ["/brand/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();
  const locale = await getRequestLocale();
  const searchProducts = localizeContent(locale, products).map((product) => ({
    id: product.id,
    name: product.name,
  }));

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="pinterest" content="nohover" />
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background-primary text-text-primary antialiased">
        <I18nProvider locale={locale}>
          <ThemeProvider>
            <SiteHeader searchProducts={searchProducts} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
