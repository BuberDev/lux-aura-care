export interface ProductLinkOption {
    path: string;
    name: string;
    useWhen: string;
}

// Only live, first-party Lux Aura Care product routes may be used. Keeping this
// catalog explicit prevents the writer from linking to removed products or
// inventing product pages. Update it when the storefront assortment changes.
export const PRODUCT_LINK_OPTIONS: ProductLinkOption[] = [
    { path: '/shop/clear-skin-patches', name: 'Clear Skin Hydrocolloid Patches', useWhen: 'blemish care, skin picking or simple overnight routines' },
    { path: '/shop/gold-eye-patches', name: '24K Gold Collagen Eye Patches', useWhen: 'under-eye hydration, temporary de-puffing or spa-style care' },
    { path: '/shop/gua-sha-jade-roller-set', name: 'Rose Quartz Gua Sha & Jade Roller Set', useWhen: 'facial massage, cooling or product application' },
    { path: '/shop/lux-aura-face-roller-gua-sha-set', name: 'Lux Aura Face Roller & Gua Sha Set', useWhen: 'beginner facial-tool routines and massage technique' },
    { path: '/shop/vibro-glow-face-massager', name: 'Vibro-Glow Face Massager', useWhen: 'facial massage tools and low-friction beauty routines' },
    { path: '/shop/centella-collagen-sleep-masks', name: 'Centella Collagen Sleep Masks', useWhen: 'overnight hydration, centella or evening skincare' },
    { path: '/shop/vitamin-c-retinol-serum-duo', name: 'Vitamin C Day + Retinol Night Serum Duo', useWhen: 'active ingredients, brightening, retinoids or day/night routines' },
    { path: '/shop/resin-body-gua-sha-tool', name: 'Resin Body Gua Sha Lymph Tool', useWhen: 'body massage, body-care routines or massage technique' },
    { path: '/shop/natural-bristle-spa-brush', name: 'Natural Bristle Spa Body Brush', useWhen: 'dry brushing, exfoliation or pre-shower body care' },
    { path: '/shop/exfoliating-spa-body-brush', name: 'Exfoliating Spa Body Brush', useWhen: 'shower exfoliation and hard-to-reach body care' },
    { path: '/shop/ice-face-roller-gua-sha-set', name: 'Ice Face Roller & Gua Sha Steel Set', useWhen: 'cooling facial massage and the appearance of morning puffiness' },
    { path: '/shop/seaweed-collagen-crystal-mask', name: 'Seaweed Collagen Crystal Hydration Mask', useWhen: 'hydration masks, hydrogel texture or at-home spa care' },
];

export const PRODUCT_PATHS = PRODUCT_LINK_OPTIONS.map((product) => product.path);

// Compatibility alias used by the shared pipeline.
export const SERVICE_PATHS = PRODUCT_PATHS;
