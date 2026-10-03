export interface EditorialPillar {
    id: string;
    name: string;
    description: string;
    productPaths: string[];
    keywords: string[];
}

export interface CoverageGap extends EditorialPillar {
    recentMentions: number;
}

export const EDITORIAL_PILLARS: EditorialPillar[] = [
    {
        id: 'skin-health',
        name: 'Skin health and evidence-led skincare',
        description: 'Barrier care, hydration, blemishes, sensitive skin, ingredient literacy and realistic routines grounded in credible health sources.',
        productPaths: ['/shop/clear-skin-patches', '/shop/seaweed-collagen-crystal-mask', '/shop/centella-collagen-sleep-masks'],
        keywords: ['skin barrier', 'skincare', 'hydration', 'blemish', 'sensitive skin', 'dermatology', 'collagen mask'],
    },
    {
        id: 'facial-tools',
        name: 'Facial massage and beauty tools',
        description: 'Safe, practical use of rollers, gua sha and facial massagers, with careful separation of temporary cosmetic effects from medical claims.',
        productPaths: ['/shop/gua-sha-jade-roller-set', '/shop/lux-aura-face-roller-gua-sha-set', '/shop/vibro-glow-face-massager', '/shop/ice-face-roller-gua-sha-set'],
        keywords: ['gua sha', 'face roller', 'facial massage', 'puffiness', 'beauty tool', 'lymphatic massage'],
    },
    {
        id: 'body-care',
        name: 'Body care and at-home spa',
        description: 'Exfoliation, body massage, bathing, dry brushing and approachable spa routines that prioritize comfort and safe technique.',
        productPaths: ['/shop/resin-body-gua-sha-tool', '/shop/natural-bristle-spa-brush', '/shop/exfoliating-spa-body-brush'],
        keywords: ['body care', 'dry brushing', 'exfoliation', 'body massage', 'home spa', 'body glow', 'pielęgnacja ciała'],
    },
    {
        id: 'healthy-aging',
        name: 'Healthy-looking skin and active ingredients',
        description: 'Vitamin C, retinoids, under-eye care, sun-aware routines and evidence-based expectations for mature or changing skin.',
        productPaths: ['/shop/vitamin-c-retinol-serum-duo', '/shop/gold-eye-patches'],
        keywords: ['retinol', 'vitamin c', 'healthy aging', 'mature skin', 'under eye', 'fine lines', 'photoprotection'],
    },
    {
        id: 'wellbeing',
        name: 'Wellbeing, self-care and beauty habits',
        description: 'Stress-aware routines, sleep-supportive habits, sensory comfort and sustainable beauty practices without medical overpromising.',
        productPaths: ['/shop/centella-collagen-sleep-masks', '/shop/gua-sha-jade-roller-set', '/shop/natural-bristle-spa-brush'],
        keywords: ['self-care', 'wellbeing', 'sleep', 'stress', 'routine', 'relaxation', 'spa'],
    },
];

function normalize(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function rankCoverageGaps(recentTitles: string[]): CoverageGap[] {
    const normalizedTitles = recentTitles.map(normalize);
    return EDITORIAL_PILLARS
        .map((pillar) => ({
            ...pillar,
            recentMentions: normalizedTitles.filter((title) => pillar.keywords.some((keyword) => title.includes(normalize(keyword)))).length,
        }))
        .sort((a, b) => a.recentMentions - b.recentMentions || a.name.localeCompare(b.name, 'en'));
}
