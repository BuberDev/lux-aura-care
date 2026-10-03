import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generateImage } from 'ai';
import { imageSize } from 'image-size';
import sharp from 'sharp';
import type { ArticleVisualAsset, ArticleVisualPlan } from '../editorial/types';

const OUTPUT_WIDTH = 1536;
const OUTPUT_HEIGHT = 864;
const MIN_IMAGE_BYTES = 30 * 1024;
const MAX_IMAGE_BYTES = 700 * 1024;
const MAX_GENERATION_ATTEMPTS = 2;
const GENERATION_TIMEOUT_MS = 4 * 60 * 1000;
const IMAGE_QUALITY_STEPS = [86, 80, 74, 68] as const;

export interface GeneratedArticleVisual {
    id: string;
    role: 'cover' | 'inline';
    placementAfterHeading: string | null;
    caption: string;
    altText: string;
    mimeType: 'image/jpeg';
    base64: string;
    width: number;
    height: number;
    sha256: string;
}

interface GenerationOptions {
    model: string;
}

function outputFilename(asset: ArticleVisualAsset): string {
    return `${asset.role === 'cover' ? 'cover' : 'inline'}-${asset.id}.jpg`;
}

export function buildGenerationPrompt(plan: ArticleVisualPlan, asset: ArticleVisualAsset, attempt = 1): string {
    return [
        'Use case: stylized-concept',
        `Asset type: ${asset.role === 'cover' ? 'premium editorial hero image' : 'premium inline editorial illustration'}`,
        `Primary request:\n${asset.prompt}`,
        `Art direction shared by the whole Lux Aura Care article series:\n${plan.artDirection}`,
        `Purpose of this exact image:\n${asset.purpose}`,
        `Grounded facts allowed in the image:\n${asset.requiredFacts.length > 0 ? asset.requiredFacts.map((fact) => `- ${fact}`).join('\n') : '- Use only the article topic and section described above; invent no metrics or product details.'}`,
        `Brand system:\n${plan.brandRules.map((rule) => `- ${rule}`).join('\n')}`,
        'Composition/framing: 16:9 landscape. One unmistakable focal idea, strong silhouette, generous safe margins, clean hierarchy, readable at article-column and social-thumbnail size. The visual must feel composed for this topic, never like a reusable template.',
        'Color palette: warm black #090807 and espresso #211B16 for depth, ivory #F8F5EF and porcelain #FFFDF9 for softness, with restrained champagne gold #C9A96E and #DFC083 accents. Natural skin and botanical tones are welcome when relevant.',
        'Style/medium: original premium beauty and wellness editorial art, combining tactile skincare materials, refined still-life or clear educational composition, natural texture and publication-grade lighting. It must look commissioned, not stock-generated.',
        'Text handling: render absolutely no words, letters, numbers, code, labels, interface copy or logos. Do not reserve a badge, logo panel or wordmark area. The published image must remain completely logo-free.',
        `Avoid:\n${asset.negativePrompt}`,
        'Non-negotiable constraints: no watermark; no third-party trademarks; no medical before-and-after comparison; no needles, surgery, wounds, exaggerated pores, fake packaging, pseudo-scientific molecules, random flowers, floating droplets or meaningless arrows. No border and no poster template.',
        'Output intent: a finished, high-end editorial visual that clarifies the article and strengthens Lux Aura Care as a trustworthy health, beauty and self-care guide.',
        ...(attempt > 1
            ? ['Revision instruction: the previous generation failed technical or uniqueness checks. Create a materially different composition while preserving all facts, palette and constraints.']
            : []),
    ].join('\n\n');
}

async function ensureModelSupportsImages(model: string): Promise<void> {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/models', {
        signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Katalog modeli AI Gateway zwrócił HTTP ${response.status}`);

    const payload = (await response.json()) as {
        data?: Array<{ id?: string; type?: string; modalities?: { output?: string[] } }>;
    };
    const entry = payload.data?.find((candidate) => candidate.id === model);
    if (!entry) throw new Error(`Model grafiki „${model}” nie występuje w aktualnym katalogu AI Gateway`);
    if (entry.type !== 'image' && !entry.modalities?.output?.includes('image')) {
        throw new Error(`Model „${model}” nie obsługuje generowania obrazów`);
    }
}

async function normalizeArticleImage(input: Uint8Array): Promise<Buffer> {
    for (const quality of IMAGE_QUALITY_STEPS) {
        const result = await sharp(input)
            .rotate()
            .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'attention' })
            .composite([
                {
                    input: Buffer.from(
                        `<svg width="${OUTPUT_WIDTH}" height="${OUTPUT_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="${OUTPUT_WIDTH - 4}" height="${OUTPUT_HEIGHT - 4}" rx="22" fill="none" stroke="#C9A96E" stroke-opacity="0.38" stroke-width="4"/><rect x="0" y="${OUTPUT_HEIGHT - 7}" width="${OUTPUT_WIDTH}" height="7" fill="#C9A96E"/></svg>`,
                    ),
                    left: 0,
                    top: 0,
                },
            ])
            .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
            .toBuffer();

        if (result.length <= MAX_IMAGE_BYTES) return result;
    }

    throw new Error(`Grafika po optymalizacji przekracza ${MAX_IMAGE_BYTES} B`);
}

export async function normalizeExternalArticleImage(
    input: Uint8Array,
): Promise<Buffer> {
    return normalizeArticleImage(input);
}

export function externalVisualInputFilename(asset: Pick<ArticleVisualAsset, 'role' | 'id'>): string {
    return `raw-${asset.role === 'cover' ? 'cover' : 'inline'}-${asset.id}.png`;
}

/**
 * Obrabia obrazy wygenerowane przez wbudowany Imagegen Codex. Generowanie oraz
 * ocena semantyczna odbywają się w lokalnym zadaniu Codex, a tutaj pozostaje
 * deterministyczne kadrowanie, branding, kompresja i kontrola techniczna.
 */
export async function prepareExternalArticleVisuals(
    plan: ArticleVisualPlan,
    inputDirectory: string,
): Promise<GeneratedArticleVisual[]> {
    const visuals: GeneratedArticleVisual[] = [];

    for (const asset of plan.assets) {
        const inputPath = join(inputDirectory, externalVisualInputFilename(asset));
        const input = await readFile(inputPath);
        if (input.length < MIN_IMAGE_BYTES) throw new Error(`Surowa grafika „${asset.id}” jest zbyt mała`);

        const normalized = await normalizeArticleImage(input);
        const sha256 = createHash('sha256').update(normalized).digest('hex');
        visuals.push({
            id: asset.id,
            role: asset.role,
            placementAfterHeading: asset.placementAfterHeading,
            caption: asset.caption,
            altText: asset.altText,
            mimeType: 'image/jpeg',
            base64: normalized.toString('base64'),
            width: OUTPUT_WIDTH,
            height: OUTPUT_HEIGHT,
            sha256,
        });
    }

    validateGeneratedVisualSet(plan, visuals);
    return visuals;
}

export function validateGeneratedVisual(visual: GeneratedArticleVisual): string | null {
    const buffer = Buffer.from(visual.base64, 'base64');
    if (buffer.length < MIN_IMAGE_BYTES) return 'image_too_small';
    if (buffer.length > MAX_IMAGE_BYTES) return 'image_too_large';
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) return 'image_not_jpeg';

    const dimensions = imageSize(buffer);
    if (dimensions.width !== OUTPUT_WIDTH || dimensions.height !== OUTPUT_HEIGHT) return 'image_dimensions_invalid';
    if (visual.mimeType !== 'image/jpeg') return 'image_mime_invalid';
    if (visual.width !== OUTPUT_WIDTH || visual.height !== OUTPUT_HEIGHT) return 'image_metadata_dimensions_invalid';
    if (createHash('sha256').update(buffer).digest('hex') !== visual.sha256) return 'image_hash_invalid';
    return null;
}

export function validateGeneratedVisualSet(plan: ArticleVisualPlan, visuals: GeneratedArticleVisual[]): void {
    const expected = plan.assets.filter((asset) => asset.role === 'cover' || asset.role === 'inline');
    if (expected.filter((asset) => asset.role === 'cover').length !== 1) throw new Error('Plan musi zawierać dokładnie jedną okładkę');
    if (expected.filter((asset) => asset.role === 'inline').length < 2) throw new Error('Plan musi zawierać co najmniej dwie grafiki śródtekstowe');
    if (visuals.length !== expected.length) throw new Error(`Wygenerowano ${visuals.length}/${expected.length} wymaganych grafik`);

    const hashes = new Set<string>();
    for (const asset of expected) {
        const visual = visuals.find((candidate) => candidate.id === asset.id && candidate.role === asset.role);
        if (!visual) throw new Error(`Brakuje wygenerowanej grafiki „${asset.id}”`);
        const problem = validateGeneratedVisual(visual);
        if (problem) throw new Error(`Grafika „${asset.id}” nie przeszła kontroli: ${problem}`);
        if (hashes.has(visual.sha256)) throw new Error(`Grafika „${asset.id}” jest duplikatem innej grafiki`);
        hashes.add(visual.sha256);
    }
}

async function generateOne(
    plan: ArticleVisualPlan,
    asset: ArticleVisualAsset,
    options: GenerationOptions,
    existingHashes: ReadonlySet<string>,
): Promise<GeneratedArticleVisual> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
        try {
            const result = await generateImage({
                model: options.model,
                prompt: buildGenerationPrompt(plan, asset, attempt),
                maxRetries: 2,
                abortSignal: AbortSignal.timeout(GENERATION_TIMEOUT_MS),
                providerOptions: options.model.startsWith('openai/')
                    ? {
                          openai: {
                              quality: 'high',
                              outputFormat: 'jpeg',
                              outputCompression: 90,
                          },
                      }
                    : undefined,
            });

            for (const warning of result.warnings) {
                console.warn(`[article-visuals] ${asset.id}: ${warning.type}${'message' in warning ? ` — ${warning.message}` : ''}`);
            }

            const normalized = await normalizeArticleImage(result.image.uint8Array);
            const sha256 = createHash('sha256').update(normalized).digest('hex');
            if (existingHashes.has(sha256)) throw new Error('model zwrócił duplikat istniejącej grafiki');

            const visual: GeneratedArticleVisual = {
                id: asset.id,
                role: asset.role,
                placementAfterHeading: asset.placementAfterHeading,
                caption: asset.caption,
                altText: asset.altText,
                mimeType: 'image/jpeg',
                base64: normalized.toString('base64'),
                width: OUTPUT_WIDTH,
                height: OUTPUT_HEIGHT,
                sha256,
            };
            const problem = validateGeneratedVisual(visual);
            if (problem) throw new Error(problem);
            return visual;
        } catch (error) {
            lastError = error;
            console.warn(`[article-visuals] ${asset.id}: próba ${attempt}/${MAX_GENERATION_ATTEMPTS} nieudana — ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    throw new Error(`Nie udało się wygenerować grafiki „${asset.title}”: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

export async function generateArticleVisuals(
    plan: ArticleVisualPlan,
    options: GenerationOptions,
): Promise<GeneratedArticleVisual[]> {
    await ensureModelSupportsImages(options.model);
    const visuals: GeneratedArticleVisual[] = [];
    const hashes = new Set<string>();

    for (const asset of plan.assets) {
        console.log(`[article-visuals] generuję ${asset.role}: ${asset.title}`);
        const visual = await generateOne(plan, asset, options, hashes);
        visuals.push(visual);
        hashes.add(visual.sha256);
        console.log(`[article-visuals] gotowe: ${outputFilename(asset)} (${Math.round(Buffer.from(visual.base64, 'base64').length / 1024)} KB)`);
    }

    validateGeneratedVisualSet(plan, visuals);
    return visuals;
}

export function generatedVisualFilename(visual: Pick<GeneratedArticleVisual, 'role' | 'id'>): string {
    return `${visual.role === 'cover' ? 'cover' : 'inline'}-${visual.id}.jpg`;
}
