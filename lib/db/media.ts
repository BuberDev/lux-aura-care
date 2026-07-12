import { prisma } from "./prisma";

/**
 * Zwraca URL filmu UGC (Favorites) dla danego produktu.
 * @param productId ID produktu (np. 'gua-sha-set')
 */
export async function getUgcVideoUrlFromDb(productId: string): Promise<string | null> {
  try {
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        productId,
        type: "favorites_ugc",
      },
    });
    return asset?.url ?? null;
  } catch (error) {
    console.error("Error fetching favorites UGC video from DB:", error);
    return null;
  }
}

/**
 * Zwraca tablicę URLi filmów UGC (Shop) dla danego produktu.
 * Ułożone po kolumnie `index`.
 * @param productId ID produktu
 */
export async function getShopUgcVideosFromDb(productId: string): Promise<string[]> {
  try {
    const assets = await prisma.mediaAsset.findMany({
      where: {
        productId,
        type: "shop_ugc_array",
      },
      orderBy: {
        index: "asc",
      },
    });
    return assets.map((a) => a.url);
  } catch (error) {
    console.error("Error fetching shop UGC videos from DB:", error);
    return [];
  }
}
