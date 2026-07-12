import { NextResponse } from "next/server";

// Ta mockowana baza danych (API) symuluje zachowanie zaciągania linków 
// do plików (wideo UGC i zdjęć) z profesjonalnego Object Storage/CDN (np. Cloudinary/AWS S3).
// Docelowo te stringi będą zastąpione faktycznymi zewnętrznymi adresami URL pobranymi np. z bazy PostgreSQL.

export async function GET() {
  const mediaDb = {
    heroImages: [
      {
        src: "/niacinamide-toner/Naturium_Niacinamide_Face_Serum_12.png",
        alt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
        name: "Naturium Niacinamide Face Serum 12% Plus Zinc 2%",
      },
      {
        src: "/gua-sha-set/BAIMEI_IcyMe_Jade_Roller_GuaSha.png",
        alt: "Rose quartz gua sha and roller set product image",
        name: "Rose Quartz Gua Sha Set",
      },
      {
        src: "/aveeno-oil-mist/cover_aveeno_oil.png",
        alt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
        name: "Aveeno Daily Moisturizing Body Oil Mist",
      },
      {
        src: "/mixsoon-bean-essence/mixsoon_bean_essence_0.png",
        alt: "Mixsoon Bean Essence",
        name: "Mixsoon Bean Essence",
      },
      {
        src: "/copper-water-bottle/cover_Copper_Water_Bottle.png",
        alt: "Copper Water Bottle",
        name: "Copper Water Bottle",
      },
      {
        src: "/gold-eye-patches/cover_Gold_Collagen_Eye_Patches.png",
        alt: "Gold Eye Patches",
        name: "Gold Collagen Eye Patches",
      }
    ]
  };

  return NextResponse.json(mediaDb);
}
