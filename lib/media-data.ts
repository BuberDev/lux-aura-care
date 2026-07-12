/**
 * SEED DATA ONLY
 * --------------------
 * These assets are now stored in the Neon PostgreSQL database (MediaAsset table).
 * This file remains solely to populate the database via `npx prisma db seed`.
 * 
 * MIGRATION PATH TO CDN
 * --------------
 * When you set up Cloudinary / Vercel Blob / AWS S3:
 *   1. Upload the files from `public/` to the CDN bucket.
 *   2. Run a script or manually update the rows in the PostgreSQL DB
 *      to point to the new CDN URLs.
 *   3. Delete the heavy files from `public/`.
 */

// ── Base URL ────────────────────────────────────────────────────────
// Change this single value when migrating to a CDN.
// Leave empty ("") while assets still live in /public.
const MEDIA_BASE_URL = "";

function mediaUrl(path: string): string {
  return `${MEDIA_BASE_URL}${path}`;
}

// ── Favorites UGC Videos (single clip per product) ──────────────────
export const UGC_VIDEOS: Record<string, string> = {
  "gua-sha-set": mediaUrl("/gua-sha-set/UGC-short-BAIMEI_IcyMe_Jade_Roller_GuaSha.mp4"),
  "aroma-diffuser": mediaUrl("/aroma-diffuser/ugc-short-ceramic-ultrasonic-diffuser.mp4"),
  "silk-sleep-mask": mediaUrl("/silk-sleep-mask/ugc-short-silk-mask.mp4"),
  "mixsoon-bean-essence": mediaUrl("/mixsoon-bean-essence/short-ugc-mixoon-Bean-Essence.mp4"),
  "gold-eye-patches": mediaUrl("/gold-eye-patches/ugc-Gold_Collagen_Eye_Patches.mp4"),
  "centella-collagen-sleep-masks": mediaUrl("/centella-collagen-sleep-masks/ugc-Centella-Collagen-Sleep-Mask.mp4"),
  "vibro-glow-face-massager": mediaUrl("/vibro-glow-face-massager/ugc-Vibro-Glow_Face_Massager.mp4"),
  "scalp-massager": mediaUrl("/scalp-massager/ugc-Scalp-Massager-Shampoo-Brush.mp4"),
  "niacinamide-toner": mediaUrl("/niacinamide-toner/ugc-short-Naturium_Niacinamide_Face_Serum.mp4"),
  "magnesium-supplement": mediaUrl("/magnesium-supplement/ugc-short-Pure_Encapsulations_Magnesium_Glycinate.mp4"),
  "aveeno-oil-mist": mediaUrl("/aveeno-oil-mist/ugc-short-aveeno-daily-body-oil.mp4"),
  "pavilia-plush-robe": mediaUrl("/pavilia-plush-robe/ugc-short-PAVILIA_Premium_Womens_Plush_Soft_Robe_Fluffy.mp4"),
  "cliganic-essential-oils": mediaUrl("/cliganic-essential-oils/ugc-short-cliganic-organic-aromath-oils-set.mp4"),
  "copper-water-bottle": mediaUrl("/copper-water-bottle/ugc-short-Copper_Water_Bottle_model.mp4"),
  "coslus-cleansing-brush": mediaUrl("/coslus-cleansing-brush/ugc-short-cover_COSLUS_Facial_Cleansing_Brush_Silicone_Face_Scrubber.jpeg.mp4"),
};

// ── Shop UGC Videos (products with multiple UGC clips) ──────────────
export const SHOP_UGC_VIDEOS: Record<string, string[]> = {
  "clear-skin-patches": [
    mediaUrl("/clear-skin-patches/ugc-short-Clear_Skin_Hydrocolloid_Patches.mp4"),
  ],
  "bian-stone-gua-sha": [
    mediaUrl("/bian-stone-gua-sha/UGC-short-Black_Bian_Stone_Gua_Sha_Stick.mp4"),
  ],
  "vibro-glow-face-massager": [
    mediaUrl("/vibro-glow-face-massager/ugc-Vibro-Glow_Face_Massager.mp4"),
    mediaUrl("/vibro-glow-face-massager/ugc-2-Vibro-Glow_Face_Massager.mp4"),
  ],
  "vitamin-c-retinol-serum-duo": [
    mediaUrl("/vitamin-c-retinol-serum-duo/ugc-short-vitamin-c-retinol-serum-duo.mp4"),
  ],
  "body-gua-sha": [
    mediaUrl("/body-gua-sha/ugc-short-body-gua-sha.mp4"),
  ],
};
