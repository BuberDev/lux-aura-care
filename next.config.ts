import type { NextConfig } from "next";
import path from "path";

const localizedFavoriteAliases = [
  ["coslus-cleansing-brush", "beurer-fc-95-szczoteczka-do-twarzy"],
  ["mixsoon-bean-essence", "cosrx-advanced-snail-96"],
  ["cliganic-essential-oils", "aeshory-zestaw-olejkow-eterycznych"],
  ["copper-water-bottle", "jmd-international-mlotkowana-butelka-z-czystej-miedzi-900-ml"],
  ["magnesium-supplement", "cytrynian-magnezu-1480-mg-240-kapsulek-weganskich"],
  ["derma-roller", "angel-kiss-derma-roller-tytanowe-mikroigly"],
  ["aveeno-oil-mist", "avon-skin-so-soft-suchy-olejek"],
  ["medicube-age-r-booster-pro", "medicube-booster-pro-mini-white"],
  ["rosemary-hair-oil", "bionoble-organiczny-olejek-rozmarynowy-do-wlosow-50ml"],
  ["orgain-collagen-peptides", "pure-essential-hydrolizowane-peptydy-kolagenowe"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return localizedFavoriteAliases.flatMap(([englishSlug, polishSlug]) => [
      {
        source: `/en/favorites/${polishSlug}`,
        destination: `/en/favorites/${englishSlug}`,
        permanent: true,
      },
      {
        source: `/pl/favorites/${englishSlug}`,
        destination: `/pl/favorites/${polishSlug}`,
        permanent: true,
      },
    ]);
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "0zj5m4eriyydro8n.public.blob.vercel-storage.com",
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
