import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { UGC_VIDEOS, SHOP_UGC_VIDEOS } from "../lib/media-data";

const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with media assets...");

  // 1. Favorites UGC Videos
  for (const [productId, url] of Object.entries(UGC_VIDEOS)) {
    await prisma.mediaAsset.upsert({
      where: {
        productId_url: {
          productId,
          url,
        },
      },
      update: {
        type: "favorites_ugc",
        index: 0,
      },
      create: {
        productId,
        type: "favorites_ugc",
        url,
        index: 0,
      },
    });
  }

  // 2. Shop UGC Videos (arrays)
  for (const [productId, urls] of Object.entries(SHOP_UGC_VIDEOS)) {
    for (const [index, url] of urls.entries()) {
      await prisma.mediaAsset.upsert({
        where: {
          productId_url: {
            productId,
            url,
          },
        },
        update: {
          type: "shop_ugc_array",
          index,
        },
        create: {
          productId,
          type: "shop_ugc_array",
          url,
          index,
        },
      });
    }
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
