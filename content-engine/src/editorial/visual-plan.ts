import { z } from 'zod';
import { runStep, type ProviderConfig } from '../llm/provider';
import { extractHeadings } from '../quality/parse';
import type { ArticleVisualAsset, ArticleVisualPlan } from './types';

const FALLBACK_BRAND_RULES = [
    'Lux Aura Care palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9, champagne gold #C9A96E and pale gold #DFC083.',
    'Premium health, beauty and wellness editorial art: tactile, calm, refined, contemporary and information-rich without visual noise.',
    'No generic stock spa scenes, medical before-and-after imagery, needles, surgery, exaggerated skin texture, fake packaging or pseudo-scientific molecule clouds.',
    'No logos, wordmarks, brand badges, third-party trademarks or imitation product packaging inside article images.',
    'Never invent numbers, labels, anatomy, ingredients or clinical results. Visualise only article-grounded routines, comparisons and verified facts.',
    'Clear hierarchy, generous safe margins, strong contrast and immediate legibility on a phone.',
];

const assetType = z.enum([
    'editorial-cover',
    'technical-diagram',
    'data-visualization',
    'editorial-illustration',
    'editorial-photo',
]);

const visualAssetSchema = z.object({
    id: z.string().min(3).max(80).regex(/^[a-z0-9][a-z0-9-]+$/, 'id musi być bezpiecznym slugiem ASCII'),
    role: z.enum(['cover', 'inline']),
    assetType,
    title: z.string().min(5).max(120),
    placementAfterHeading: z.string().min(3).max(160).nullable(),
    purpose: z.string().min(40).max(500),
    aspectRatio: z.string().min(3).max(80),
    prompt: z.string().min(500).max(5000),
    negativePrompt: z.string().min(80).max(1500),
    caption: z.string().min(20).max(350),
    altText: z.string().min(20).max(300),
    requiredFacts: z.array(z.string().min(5).max(500)).max(12),
});

const visualPlanSchema = z.object({
    version: z.literal(1),
    artDirection: z.string().min(80).max(1200),
    brandRules: z.array(z.string().min(20).max(500)).min(5).max(12),
    assets: z.array(visualAssetSchema).min(3).max(4),
});

function validatePlan(plan: ArticleVisualPlan, contentMarkdown: string): ArticleVisualPlan {
    const covers = plan.assets.filter((asset) => asset.role === 'cover');
    if (covers.length !== 1) throw new Error(`Plan wizualny musi zawierać dokładnie jedną okładkę, ma: ${covers.length}`);
    if (covers[0].placementAfterHeading !== null) throw new Error('Okładka nie może mieć placementAfterHeading');

    const inline = plan.assets.filter((asset) => asset.role === 'inline');
    if (inline.length < 2 || inline.length > 3) throw new Error(`Plan musi zawierać 2–3 grafiki śródtekstowe, ma: ${inline.length}`);
    for (const asset of inline) {
        if (!asset.placementAfterHeading || !contentMarkdown.includes(asset.placementAfterHeading)) {
            throw new Error(`Nie istnieje nagłówek wskazany dla grafiki „${asset.title}”: ${asset.placementAfterHeading ?? '(brak)'}`);
        }
    }
    return plan;
}

function stableId(value: string, index: number): string {
    const slug = value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48);
    return `${slug || 'visual'}-${index + 1}`;
}

function sectionFacts(contentMarkdown: string, headingText: string, limit = 5): string[] {
    const lines = contentMarkdown.split(/\r?\n/);
    const headingIndex = lines.findIndex((line) => {
        const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
        return match?.[2].trim() === headingText;
    });
    if (headingIndex < 0) return [];

    const headingLevel = lines[headingIndex].match(/^(#+)/)?.[1].length ?? 2;
    const sectionLines: string[] = [];
    for (const line of lines.slice(headingIndex + 1)) {
        const nextHeading = line.match(/^(#+)\s+/);
        if (nextHeading && nextHeading[1].length <= headingLevel) break;
        if (/^\s*>?\s*\*\*(?:Section source|Sources?)/i.test(line)) continue;
        sectionLines.push(line);
    }

    const cleaned = sectionLines
        .join(' ')
        .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
        .replace(/[`*_>#]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return cleaned
        .split(/(?<=[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ0-9])/)
        .map((sentence) => sentence.replace(/^[-–•]\s*/, '').trim())
        .filter((sentence) => sentence.length >= 30)
        .map((sentence) => sentence.slice(0, 480))
        .slice(0, limit);
}

function groundedFactsBlock(facts: string[]): string {
    if (facts.length === 0) return '- Use only the article title and section title; invent no technical details.';
    return facts.map((fact) => `- ${fact}`).join('\n');
}

export function createFallbackVisualPlan(title: string, contentMarkdown: string): ArticleVisualPlan {
    const allHeadings = extractHeadings(contentMarkdown).filter((heading) => heading.level === 2 || heading.level === 3);
    const preferred = allHeadings.filter((heading) => !/^(in brief|conclusion|faq|sources)$/i.test(heading.text));
    const technical = preferred.find((heading) => /how|mechanism|architecture|technical|what changed|risk|security/i.test(heading.text));
    const commercial = preferred.find((heading) => /business|company|implementation|what to do|practice|decision|perspective|cost|value/i.test(heading.text));
    const headings = [technical, commercial, ...preferred, ...allHeadings]
        .filter((heading): heading is (typeof allHeadings)[number] => Boolean(heading))
        .filter((heading, index, list) => list.findIndex((candidate) => candidate.text === heading.text) === index)
        .slice(0, 2);
    if (headings.length < 2) throw new Error('Nie można zbudować zapasowego planu wizualnego: artykuł ma mniej niż dwa nagłówki');

    const coverFacts = sectionFacts(contentMarkdown, 'In brief', 4);

    const cover: ArticleVisualAsset = {
        id: stableId(title, 0),
        role: 'cover',
        assetType: 'editorial-cover',
        title: 'Main article cover',
        placementAfterHeading: null,
        purpose: 'Stop the scroll and communicate the article topic immediately in Lux Aura Care’s recognisable premium beauty editorial system.',
        aspectRatio: '1200:630 (render docelowy 2400×1260)',
        prompt: `Use case: editorial-cover
Asset type: premium health and beauty article cover for Lux Aura Care
Primary request: Create an original, publication-grade visual concept for the article titled "${title}". Express one concrete skincare, body-care, beauty-tool or wellbeing idea implied by the title. Do not use a generic spa still life.
Article-grounded facts available for the concept:
${groundedFactsBlock(coverFacts)}
Visual concept selection: choose the single most informative routine, comparison or transformation supported by these facts. Every visible object and connection must map to it; omit anything merely decorative.
Scene/backdrop: controlled warm-black, ivory or softly lit editorial environment with tactile depth, never a generic candle-and-towel spa scene.
Subject: one dominant, physically plausible visual idea with a clear silhouette and one restrained champagne-gold accent.
Style/medium: premium beauty editorial photography or refined 3D/illustration hybrid; realistic materials; precise composition; sophisticated depth; original art direction; no stock-photo appearance.
Composition/framing: 1.904:1 landscape; focal subject on the right half; protected negative space on the left for separately typeset headline; safe margins of at least 7%; readable at thumbnail size.
Lighting/mood: controlled studio light, calm confidence, analytical rather than cinematic spectacle.
Color palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9, champagne gold #C9A96E and pale-gold highlights, with natural skin or botanical tones only when relevant.
Text: no generated headline, labels, numbers or pseudo-code. Reserve clean space for deterministic typography added later.
Accuracy constraints: do not invent ingredients, product packaging, anatomy, medical outcomes, metrics or clinical relationships absent from the title and article.
Brand treatment: communicate Lux Aura Care only through the palette and editorial art direction. Do not draw, reserve space for or composite any logo, wordmark or brand badge.
Quality bar: premium technology-publication cover, impeccable spacing, clean edges, coherent materials and a distinctive visual idea.
Constraints: original composition, no third-party trademarks, no watermark, no decorative filler.`,
        negativePrompt: 'Generic stock spa, stacked towels with random candles, medical before-and-after, needles, surgery, wounds, exaggerated pores, fake branded packaging, pseudo-scientific molecule cloud, random flowers, floating droplets, third-party logo, gibberish text, watermark, clutter, plastic skin, excessive glow, low-detail edges.',
        caption: `The central mechanism examined in “${title}”.`,
        altText: `Lux Aura Care editorial visual explaining the central idea of “${title}”.`,
        requiredFacts: coverFacts,
    };

    const inline = headings.map((heading, index): ArticleVisualAsset => {
        const facts = sectionFacts(contentMarkdown, heading.text, 5);
        return {
            id: stableId(heading.text, index + 1),
            role: 'inline',
            assetType: 'technical-diagram',
            title: `Diagram for section: ${heading.text}`,
            placementAfterHeading: heading.text,
            purpose: 'Explain one routine, comparison, technique or evidence boundary faster than another block of text and improve retention.',
            aspectRatio: '16:9 (2400×1350)',
            prompt: `Use case: infographic-diagram
Asset type: premium inline health and beauty editorial diagram for a Lux Aura Care guide
Article title: "${title}"
Section title: "${heading.text}"
Primary request: Explain one concrete mechanism, comparison or decision flow described in this section. Use a clear left-to-right reading path or a restrained layered architecture. The diagram must clarify the section rather than decorate it.
Article-grounded facts that may appear in the diagram:
${groundedFactsBlock(facts)}
Visual mapping rule: choose the strongest causal sequence or business comparison supported by these facts. Map every panel, state and arrow to a stated fact; remove decorative elements that do not carry meaning.
Style/medium: clean vector-like technical information design with subtle depth, meticulous grid, consistent line weights, restrained shadows and publication-grade polish.
Composition/framing: 16:9 landscape; 3–6 meaningful elements maximum; one dominant reading path; generous whitespace; large forms that remain understandable at mobile article width.
Color palette: warm black #090807, espresso #211B16, ivory #F8F5EF, porcelain #FFFDF9 and champagne gold #C9A96E for one key state or transition.
Typography: use only the supplied section title if text is necessary. Do not invent labels. Prefer numbered callout areas that can receive deterministic typography later.
Accuracy constraints: every arrow must express a relationship stated in the article. Do not invent ingredients, efficacy, anatomy, metrics, treatment claims or product features.
Brand treatment: no logos, wordmarks, brand badges, external trademarks or imitation product interfaces. Do not reserve a credit or logo area.
Quality bar: premium data-journalism and technical-publication quality, immediately understandable, balanced and artifact-free.
Constraints: original diagram, no stock assets, no watermark, no visual filler, no pseudo-code and no illegible microtext.`,
            negativePrompt: 'Generic stock spa, medical before-and-after, needle, surgery, exaggerated skin texture, fake packaging, stock icon pack, clip art, arbitrary metrics, tiny labels, overly complex flowchart, meaningless arrows, molecule cloud, third-party logos, watermark, low contrast, busy background.',
            caption: `Visual explanation of the mechanism and decision points discussed in “${heading.text}”.`,
            altText: `Lux Aura Care diagram explaining “${heading.text}” in the article “${title}”.`,
            requiredFacts: facts,
        };
    });

    return validatePlan(
        {
            version: 1,
            artDirection: 'The Lux Aura Care visual system: premium health and beauty editorial art, calm precision, one clear idea per image and a consistent warm-black, ivory and champagne-gold palette.',
            brandRules: FALLBACK_BRAND_RULES,
            assets: [cover, ...inline],
        },
        contentMarkdown,
    );
}

export async function generateVisualPlan(
    title: string,
    contentMarkdown: string,
    sourceUrls: string[],
    providerConfig: ProviderConfig,
): Promise<ArticleVisualPlan> {
    const prompt = `Design a complete premium visual plan for the finished Lux Aura Care article. Return all titles, captions and alt text in natural English.

TYTUŁ:
${title}

FINALNA TREŚĆ (to jedyne źródło faktów dla grafik):
${contentMarkdown}

ZWERYFIKOWANE URL-E ŹRÓDEŁ:
${sourceUrls.map((url) => `- ${url}`).join('\n')}

WYMAGANIA BEZWZGLĘDNE:
1. Zwróć dokładnie 1 prompt okładki oraz 2–3 prompty grafik śródtekstowych.
2. For inline visuals, placementAfterHeading must exactly equal an existing H2/H3. Choose sections where a visual genuinely clarifies a mechanism, comparison, process, architecture or data. Do not choose “In brief”, “Conclusion”, “FAQ” or “Sources”.
3. Okładka ma mieć assetType editorial-cover, role cover, placementAfterHeading null i format 1200:630 (docelowo 2400×1260). Ma opierać się na konkretnej metaforze technicznej tematu, nie na przypadkowej sieci kropek.
4. Grafiki wewnętrzne: preferuj technical-diagram lub data-visualization. Editorial-photo wybierz tylko wtedy, gdy prawdziwa, niestockowa scena wnosi informację; nigdy nie używaj zdjęcia jako wypełniacza.
5. Każdy prompt ma być samodzielnym, obszernym production briefem po angielsku. Grafika nie może zawierać tekstu generowanego przez model; podpis i opis alternatywny są dodawane osobno. Użyj struktury: Use case, Asset type, Primary request, Scene/backdrop, Subject, Style/medium, Composition/framing, Lighting/mood, Color palette, Materials/textures, Text handling, Accuracy constraints, Brand treatment, Quality bar, Constraints.
6. Każdy prompt musi opisywać jedną czytelną ideę, format, hierarchię, marginesy bezpieczeństwa i zachowanie na małym ekranie.
7. Lux Aura Care palette: #090807, #211B16, #F8F5EF, #FFFDF9, #C9A96E and #DFC083. Premium health and beauty editorial, never stock-looking.
8. Nie wolno wymyślać liczb, benchmarków, nazw komponentów, cytatów ani zależności. requiredFacts ma zawierać wyłącznie dosłowne fakty z artykułu potrzebne do wykonania danej grafiki.
9. W promptach zabroń: generycznego stockowego spa, medycznych zdjęć before/after, igieł, zabiegów, ran, wyolbrzymionej tekstury skóry, fałszywych opakowań, pseudo-naukowych molekuł, cudzych logo, watermarków, bełkotliwego tekstu i ozdobników bez znaczenia.
10. Grafika ma pozostać całkowicie bez logo. Model nie może generować ani przerysowywać logo Lux Aura Care, wordmarku lub badge'a, a pipeline nie nakłada żadnego logo po wygenerowaniu obrazu. Spójność marki budują wyłącznie paleta, jakość i kierunek artystyczny.
11. Write captions and alt text in natural English. Every caption must explain the concrete insight visible in the image and add value beyond the section heading. Never use provenance boilerplate such as “Original Lux Aura Care diagram”, “original editorial work”, “based on the article” or “based on cited sources”. Source attribution belongs in the article text, not in every image caption.
12. id: krótki stabilny slug ASCII. Negative prompt ma być równie konkretny jak prompt główny.

Zwróć wyłącznie JSON zgodny ze schematem.`;

    try {
        const outcome = await runStep(
            {
                kind: 'json',
                step: 'visual-plan',
                systemPrompt: 'You are an art director and information designer for a premium health, beauty and wellbeing publication. You combine factual rigour, tasteful visual communication and the Lux Aura Care brand system.',
                prompt,
                jsonSchema: z.toJSONSchema(visualPlanSchema) as Record<string, unknown>,
                deepseek: { model: 'deepseek-flash', thinking: false, temperature: 0.25, maxTokens: 6500 },
            },
            providerConfig,
        );

        return validatePlan(visualPlanSchema.parse(outcome.json), contentMarkdown);
    } catch (error) {
        console.warn(`[visual-plan] model nie zwrócił poprawnego planu; używam bezpiecznego planu zapasowego: ${error instanceof Error ? error.message : String(error)}`);
        return createFallbackVisualPlan(title, contentMarkdown);
    }
}
