import type { Metadata } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { generateOrganizationJsonLd, toJsonLd } from "@/lib/seo";
import { siteMeta } from "@/lib/site-data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://luxaura.care"),
  title: {
    default: "Lux Aura Care | Luxury Self-Care & Ritual Guides",
    template: "%s | Lux Aura Care",
  },
  description: siteMeta.description,
  keywords: [...siteMeta.keywords, ...siteMeta.plKeywords],
  authors: [{ name: "Lux Aura Editorial Team" }],
  creator: "Lux Aura Care",
  publisher: "Lux Aura Care",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Lux Aura Care | Professional High-Glow Rituals",
    description: siteMeta.description,
    url: "https://luxaura.care",
    siteName: "Lux Aura Care",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Aura Care | Professional High-Glow Rituals",
    description: siteMeta.description,
    creator: "@luxauracare",
    images: ["/og-image.jpg"],
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
  alternates: {
    canonical: "https://luxaura.care",
    languages: {
      "en-US": "https://luxaura.care",
      "pl-PL": "https://luxaura.care",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="en">
      <head>
        <meta name="pinterest" content="nohover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background-primary text-text-primary antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
