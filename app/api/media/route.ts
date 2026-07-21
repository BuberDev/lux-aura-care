import { NextResponse } from "next/server";
import { mediaUrl } from "@/lib/media-url";

// Ta mockowana baza danych (API) symuluje zachowanie zaciągania linków 
// do plików (wideo UGC i zdjęć) z profesjonalnego Object Storage/CDN (np. Cloudinary/AWS S3).
// Docelowo te stringi będą zastąpione faktycznymi zewnętrznymi adresami URL pobranymi np. z bazy PostgreSQL.

export async function GET() {
  const mediaDb = {
    heroImages: [
      {
        src: mediaUrl("/niacinamide-toner/Naturium_Niacinamide_Face_Serum_12.png"),
        alt: "Naturium Niacinamide Face Serum 12% Plus Zinc 2% product image",
        name: "Naturium Niacinamide Face Serum 12% Plus Zinc 2%",
      },
      {
        src: mediaUrl("/gua-sha-set/BAIMEI_IcyMe_Jade_Roller_GuaSha.png"),
        alt: "Rose quartz gua sha and roller set product image",
        name: "Rose Quartz Gua Sha Set",
      },
      {
        src: mediaUrl("/aveeno-oil-mist/cover_aveeno_oil.png"),
        alt: "Aveeno Daily Moisturizing Body Oil Mist spray bottle",
        name: "Aveeno Daily Moisturizing Body Oil Mist",
      },
      {
        src: mediaUrl("/mixsoon-bean-essence/mixsoon_Bean_Essence_Exfoliating.png"),
        alt: "Mixsoon Bean Essence",
        name: "Mixsoon Bean Essence",
      },
      {
        src: mediaUrl("/copper-water-bottle/Copper_Water_Bottle.png"),
        alt: "Copper Water Bottle",
        name: "Copper Water Bottle",
      },
      {
        src: mediaUrl("/gold-eye-patches/24K_Gold_Collagen_Eye_Patches.png"),
        alt: "Gold Eye Patches",
        name: "Gold Collagen Eye Patches",
      }
    ]
  };

  return NextResponse.json(mediaDb);
}
