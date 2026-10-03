export const VISUAL_PLAN_VERSION = 1 as const;

export type VisualAssetRole = 'cover' | 'inline';
export type VisualAssetType =
    | 'editorial-cover'
    | 'technical-diagram'
    | 'data-visualization'
    | 'editorial-illustration'
    | 'editorial-photo';

export interface ArticleVisualAsset {
    id: string;
    role: VisualAssetRole;
    assetType: VisualAssetType;
    title: string;
    placementAfterHeading: string | null;
    purpose: string;
    aspectRatio: string;
    prompt: string;
    negativePrompt: string;
    caption: string;
    altText: string;
    requiredFacts: string[];
}

export interface ArticleVisualPlan {
    version: typeof VISUAL_PLAN_VERSION;
    artDirection: string;
    brandRules: string[];
    assets: ArticleVisualAsset[];
}

const BRAND_RULES = [
    'Lux Aura Care palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9 and champagne gold #C9A96E.',
    'Premium health and beauty editorial art: calm, tactile, refined and free of visual noise.',
    'No generic stock spa, medical before-and-after imagery, needles, wounds, fake packaging or pseudo-scientific molecule clouds.',
    'No logos, wordmarks, brand badges, third-party trademarks or imitation product packaging inside article images.',
    'Never invent numbers, anatomy, ingredients or clinical results. Use only facts supplied in the prompt.',
    'Clear hierarchy, controlled lighting, generous safe margins and expert-publication quality.',
];

function plainText(value: string): string {
    return value
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractHeadings(content: string): string[] {
    const headings = [...content.matchAll(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi)]
        .map((match) => plainText(match[1]))
        .filter(Boolean);

    if (headings.length > 0) return headings;
    return content
        .split('\n')
        .map((line) => line.match(/^#{2,3}\s+(.+)$/)?.[1]?.trim())
        .filter((heading): heading is string => Boolean(heading));
}

function idFrom(value: string, index: number): string {
    const slug = value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 42);
    return `${slug || 'visual'}-${index + 1}`;
}

function relevantHeadings(content: string): string[] {
    const excluded = /^(in brief|conclusion|faq|sources)$/i;
    return extractHeadings(content).filter((heading) => !excluded.test(heading)).slice(0, 3);
}

export function createFallbackVisualPlan(title: string, content: string, excerpt = ''): ArticleVisualPlan {
    const summary = plainText(excerpt || content).slice(0, 480);
    const headings = relevantHeadings(content);
    const inlineHeadings = headings.length > 0 ? headings.slice(0, 2) : ['Key mechanism', 'Business implications'];
    const coverId = idFrom(title || 'article cover', 0);

    const assets: ArticleVisualAsset[] = [
        {
            id: coverId,
            role: 'cover',
            assetType: 'editorial-cover',
            title: 'Main article cover',
            placementAfterHeading: null,
            purpose: 'Zatrzymać uwagę, natychmiast zakomunikować temat i utrzymać rozpoznawalny system wizualny Lux Aura Care.',
            aspectRatio: '1200:630 (render docelowy 2400×1260)',
            prompt: `Use case: editorial-cover
Asset type: premium technology article cover for Lux Aura Care
Primary request: Create an original, publication-grade visual concept for the article titled "${title || 'ARTYKUŁ LUXAURA'}".
Editorial context: ${summary || 'Evidence-led skincare, beauty, body-care and wellbeing guidance.'}
Subject: one concrete visual idea derived only from the article topic; show a clear routine, comparison or transformation rather than a generic spa scene.
Style/medium: premium health and beauty editorial photography or refined illustration; tactile materials; sophisticated depth; original art direction; no stock-photo appearance.
Composition/framing: 1.904:1 landscape; strong focal subject on the right half; protected negative space on the left for a separately typeset headline; safe margins of at least 7%; readable at social-media thumbnail size.
Lighting/mood: controlled cinematic studio light, confident and analytical, not science fiction.
Color palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9, champagne gold #C9A96E and pale-gold highlights.
Brand treatment: communicate Lux Aura Care only through the palette and editorial art direction. Do not draw, reserve space for or composite any logo, wordmark or brand badge.
Text handling: generate the artwork without headline text; reserve clean space for deterministic typography added later. Do not add random labels, numbers or pseudo-code.
Quality bar: editorial cover quality comparable to a premium technology publication; coherent materials, impeccable spacing, clean edges, no filler decoration.
Constraints: original composition; technically plausible; no third-party trademarks; no watermark; no invented facts.`,
            negativePrompt: 'Generic stock spa, stacked towels and random candles, medical before-and-after, needles, surgery, wounds, exaggerated pores, fake packaging, molecule cloud, lens flare, clutter, gibberish text, third-party logos, watermark, plastic skin, excessive glow.',
            caption: `The central mechanism examined in “${title || 'this Lux Aura Care analysis'}”.`,
            altText: `Lux Aura Care editorial visual explaining “${title || 'a health and beauty guide'}”.`,
            requiredFacts: summary ? [summary] : [],
        },
        ...inlineHeadings.map((heading, index): ArticleVisualAsset => ({
            id: idFrom(heading, index + 1),
            role: 'inline',
            assetType: 'technical-diagram',
            title: `Illustration for section: ${heading}`,
            placementAfterHeading: heading,
            purpose: 'Wyjaśnić jeden mechanizm lub zależność szybciej niż kolejny blok tekstu i zwiększyć zapamiętywalność analizy.',
            aspectRatio: '16:9 (1600×900 lub 2400×1350)',
            prompt: `Use case: infographic-diagram
Asset type: premium inline editorial diagram for a Lux Aura Care expert article
Section title: "${heading}"
Article title: "${title || 'Artykuł Lux Aura Care'}"
Grounded context: ${summary || 'Brak dodatkowych danych — nie dodawaj liczb ani nazw niewymienionych w tytule sekcji.'}
Primary request: Explain the section through one clear left-to-right mechanism, comparison or layered architecture. Choose the diagram structure that best fits the supplied context; do not create decorative concept art.
Style/medium: clean vector-like technical infographic with subtle depth, meticulous grid, consistent line weights, restrained shadows and premium editorial polish.
Composition/framing: 16:9 landscape; one dominant reading path; 3–6 meaningful visual elements maximum; generous whitespace; legible at article-column width.
Color palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9 and champagne gold #C9A96E for the single key state or transition.
Typography: if labels are essential, use only short labels directly supported by the supplied context. Render them once, verbatim, in a clean sans-serif. If exact labels are uncertain, omit text and use numbered callouts that can be typeset later.
Accuracy: every arrow must express a real relationship. Do not invent metrics, benchmarks, product modules, security claims or architecture components.
Brand treatment: no logos, wordmarks, brand badges, external trademarks or reserved credit areas.
Constraints: original diagram; no stock assets; no watermark; no visual filler; no pseudo-code; no illegible microtext.`,
            negativePrompt: 'Generic AI robot, glowing brain, decorative node cloud, stock icons, clip art, random dashboard, fake code, arbitrary metrics, 3D text, tiny labels, overly complex flowchart, cyberpunk neon, third-party logos, watermark, low contrast, busy background, meaningless arrows.',
            caption: `Visual explanation of the mechanism and decision points discussed in “${heading}”.`,
            altText: `Lux Aura Care diagram explaining “${heading}” in “${title || 'Lux Aura Care'}”.`,
            requiredFacts: summary ? [summary] : [],
        })),
    ];

    return {
        version: VISUAL_PLAN_VERSION,
        artDirection: 'The Lux Aura Care visual system: premium health and beauty editorial art, calm precision, one clear idea per image and a consistent warm-black, ivory and champagne-gold palette.',
        brandRules: BRAND_RULES,
        assets,
    };
}

export function isArticleVisualPlan(value: unknown): value is ArticleVisualPlan {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<ArticleVisualPlan>;
    return candidate.version === VISUAL_PLAN_VERSION && Array.isArray(candidate.assets) && candidate.assets.length > 0;
}

export function formatVisualPrompt(plan: ArticleVisualPlan, asset: ArticleVisualAsset): string {
    return [
        plan.artDirection,
        '',
        asset.prompt,
        '',
        `AVOID / NEGATIVE PROMPT:\n${asset.negativePrompt}`,
        '',
        `OUTPUT SPECIFICATION:\n- Aspect ratio: ${asset.aspectRatio}\n- Intended placement: ${asset.placementAfterHeading ? `after section "${asset.placementAfterHeading}"` : 'main article cover'}\n- Caption: ${asset.caption}\n- Alt text: ${asset.altText}`,
        '',
        `NON-NEGOTIABLE BRAND RULES:\n${plan.brandRules.map((rule) => `- ${rule}`).join('\n')}`,
        ...(asset.requiredFacts.length > 0
            ? ['', `FACTS THAT MAY APPEAR IN THE VISUAL:\n${asset.requiredFacts.map((fact) => `- ${fact}`).join('\n')}`]
            : []),
    ].join('\n');
}
