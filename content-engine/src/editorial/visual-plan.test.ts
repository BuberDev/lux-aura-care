import { describe, expect, it } from 'vitest';
import { createFallbackVisualPlan } from './visual-plan';

describe('createFallbackVisualPlan', () => {
    it('tworzy kompletny plan z okładką i dwiema grafikami przy istniejących nagłówkach', () => {
        const markdown = `## In brief

Current as of 2026-09-25.

## How the mechanism works

Oznaczone wiersze tworzą kontekst, z którego nowy rekord otrzymuje predykcję bez aktualizacji wag modelu.

## Implementation risks

Firma nadal waliduje predykcje na odłożonych danych i porównuje je z obecnym rozwiązaniem przed wdrożeniem.

## Conclusion

Wnioski.`;

        const plan = createFallbackVisualPlan('Testowy artykuł o agentach AI', markdown);

        expect(plan.version).toBe(1);
        expect(plan.brandRules).toHaveLength(6);
        expect(plan.assets).toHaveLength(3);
        expect(plan.assets.filter((asset) => asset.role === 'cover')).toHaveLength(1);
        expect(plan.assets.filter((asset) => asset.role === 'inline').map((asset) => asset.placementAfterHeading)).toEqual([
            'How the mechanism works',
            'Implementation risks',
        ]);
        expect(plan.assets.every((asset) => asset.prompt.length >= 500)).toBe(true);
        expect(plan.assets.every((asset) => asset.negativePrompt.length >= 80)).toBe(true);
        expect(plan.assets[1].requiredFacts[0]).toContain('Oznaczone wiersze');
        expect(plan.assets[1].prompt).toContain('Article-grounded facts');
        expect(plan.assets[2].requiredFacts[0]).toContain('Firma nadal waliduje');
    });
});
