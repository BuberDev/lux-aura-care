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
import { siteMeta } from "@/lib/site-data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://luxaura.care"),
  title: {
    default: "Lux Aura Care | Luxury Self-Care Editorial",
    template: "%s | Lux Aura Care",
  },
  description: siteMeta.description,
  openGraph: {
    title: "Lux Aura Care",
    description: siteMeta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Aura Care",
    description: siteMeta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-primary text-text-primary antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
