import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ArticleVisualPlan } from '../editorial/types';
import { generateArticleVisuals, generatedVisualFilename } from './generate-article-visuals';

const model = process.env.ARTICLE_IMAGE_MODEL ?? 'recraft/recraft-v4.1';
if (!process.env.AI_GATEWAY_API_KEY) throw new Error('Brak AI_GATEWAY_API_KEY');

const plan: ArticleVisualPlan = {
    version: 1,
    artDirection:
        'A coherent three-image editorial series about measuring business ROI from AI agents: premium dimensional still-life, precise spatial storytelling, sober executive tone, one visual metaphor per frame.',
    brandRules: [
        'Deep navy is dominant; Lux Aura Care electric blue marks only value creation and verified progress.',
        'Use warm sand and controlled white highlights for depth and legibility.',
        'No generated typography, logos, wordmarks or brand badges; images remain logo-free after post-production.',
    ],
    assets: [
        {
            id: 'smoke-roi-cover',
            role: 'cover',
            assetType: 'editorial-cover',
            title: 'Zwrot z inwestycji w agentów AI',
            placementAfterHeading: null,
            purpose: 'A premium opening visual that communicates measurable business value rather than AI spectacle.',
            aspectRatio: '16:9',
            prompt:
                'An executive-grade editorial still-life: a dark architectural measurement instrument transforms a fragmented operational workflow into one precise orange value signal, with subtle material cues for time saved, risk reduced and revenue gained. Dramatic but restrained lighting, asymmetrical composition, generous negative space.',
            negativePrompt:
                'No charts with labels, no currency symbols, no robots, no brains, no dashboards, no neon cyberpunk, no random network nodes, no stock-office photography.',
            caption: 'Pomiar wartości wdrożenia zaczyna się od procesu, kosztu bazowego i wyniku biznesowego.',
            altText: 'Abstrakcyjny instrument mierzący wartość biznesową wdrożenia agentów AI.',
            requiredFacts: ['ROI must connect operational baseline, implementation cost and measurable business outcome.'],
        },
        {
            id: 'smoke-baseline',
            role: 'inline',
            assetType: 'technical-diagram',
            title: 'Linia bazowa i wynik po wdrożeniu',
            placementAfterHeading: 'Od czego zacząć pomiar ROI',
            purpose: 'Explain visually why a credible baseline is required before attributing gains to AI agents.',
            aspectRatio: '16:9',
            prompt:
                'A refined physical process model viewed at an oblique angle: two parallel operational paths built from dark modular elements, the baseline path contains visible friction and rework loops, the improved path is shorter and converges on a single orange verified outcome. No labels, no numbers.',
            negativePrompt:
                'No generic arrows floating in space, no UI screenshots, no text, no robot imagery, no decorative circuitry.',
            caption: 'Bez linii bazowej nie da się wiarygodnie przypisać poprawy automatyzacji.',
            altText: 'Porównanie procesu bazowego z krótszym procesem po wdrożeniu agenta AI.',
            requiredFacts: ['A pre-implementation baseline is necessary for attribution.'],
        },
        {
            id: 'smoke-decision',
            role: 'inline',
            assetType: 'editorial-illustration',
            title: 'Decyzja o skalowaniu wdrożenia',
            placementAfterHeading: 'Kiedy skalować, a kiedy zatrzymać pilotaż',
            purpose: 'Help a decision-maker see a governed scale-up decision based on value, reliability and risk.',
            aspectRatio: '16:9',
            prompt:
                'A premium editorial scene showing a controlled branching mechanism: one narrow experimental channel passes through three tangible gates representing value, reliability and risk, then expands into a stable orange-accented production pathway; rejected branches terminate cleanly. Sophisticated product-design aesthetic, no labels.',
            negativePrompt:
                'No people pointing at screens, no traffic-light cliché, no text, no robot, no glowing brain, no generic business handshake.',
            caption: 'Skalowanie ma sens dopiero po potwierdzeniu wartości, niezawodności i akceptowalnego ryzyka.',
            altText: 'Kontrolowana ścieżka decyzji prowadząca od pilotażu do skalowania agenta AI.',
            requiredFacts: ['Scale only after value, reliability and risk thresholds are met.'],
        },
    ],
};

const outputDir = join(process.cwd(), 'out');
await mkdir(outputDir, { recursive: true });

const visuals = await generateArticleVisuals(plan, { model });
for (const visual of visuals) {
    await writeFile(join(outputDir, generatedVisualFilename(visual)), Buffer.from(visual.base64, 'base64'));
}
await writeFile(
    join(outputDir, 'visual-smoke-result.json'),
    JSON.stringify(
        {
            model,
            count: visuals.length,
            visuals: visuals.map(({ id, role, width, height, sha256 }) => ({ id, role, width, height, sha256 })),
        },
        null,
        2,
    ),
    'utf8',
);

console.log(`[visual-smoke-test] SUKCES — ${visuals.length} unikalne grafiki, model=${model}`);
