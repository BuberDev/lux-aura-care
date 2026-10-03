import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createFallbackVisualPlan } from '../editorial/visual-plan';
import {
    buildGenerationPrompt,
    externalVisualInputFilename,
    validateGeneratedVisual,
    validateGeneratedVisualSet,
    type GeneratedArticleVisual,
} from './generate-article-visuals';

const markdown = `## Co się wydarzyło\n\nOpis mechanizmu.\n\n## Co zrobić w firmie\n\nPlan wdrożenia.`;

describe('article visual generation policy', () => {
    it('turns every asset plan into a strict, text-free and logo-free production prompt', () => {
        const plan = createFallbackVisualPlan('Bezpieczny agent AI w firmie', markdown);
        const prompt = buildGenerationPrompt(plan, plan.assets[0]);

        expect(prompt).toContain('premium beauty and wellness editorial art');
        expect(prompt).toContain('#C9A96E');
        expect(prompt).toContain('render absolutely no words, letters, numbers');
        expect(prompt).toContain('completely logo-free');
        expect(prompt).not.toContain('logo and all typography are added deterministically');
        expect(prompt).toContain('trustworthy health, beauty and self-care guide');
        expect(prompt).toContain(plan.assets[0].negativePrompt);
        expect(plan.assets[1].caption).not.toMatch(/original Lux Aura Care|based on (?:the )?(?:article|cited sources)/i);
    });

    it('fails closed on tiny generated files', () => {
        const plan = createFallbackVisualPlan('Bezpieczny agent AI w firmie', markdown);
        const buffer = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
        const visual = (assetIndex: number): GeneratedArticleVisual => ({
            id: plan.assets[assetIndex].id,
            role: plan.assets[assetIndex].role,
            placementAfterHeading: plan.assets[assetIndex].placementAfterHeading,
            caption: plan.assets[assetIndex].caption,
            altText: plan.assets[assetIndex].altText,
            mimeType: 'image/jpeg',
            base64: buffer.toString('base64'),
            width: 1536,
            height: 864,
            sha256: createHash('sha256').update(buffer).digest('hex'),
        });

        expect(validateGeneratedVisual(visual(0))).toBe('image_too_small');
        expect(() => validateGeneratedVisualSet(plan, plan.assets.map((_, index) => visual(index)))).toThrow(/kontroli/);
    });

    it('uses deterministic project-local filenames for Codex Imagegen inputs', () => {
        const plan = createFallbackVisualPlan('Bezpieczny agent AI w firmie', markdown);
        expect(externalVisualInputFilename(plan.assets[0])).toMatch(/^raw-cover-[a-z0-9-]+\.png$/);
        expect(externalVisualInputFilename(plan.assets[1])).toMatch(/^raw-inline-[a-z0-9-]+\.png$/);
    });
});
