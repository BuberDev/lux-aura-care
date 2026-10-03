import { describe, expect, it } from 'vitest';
import { rankCoverageGaps } from './editorial';

describe('rankCoverageGaps', () => {
    it('stawia nieporuszane filary przed tematami obecnymi w historii', () => {
        const gaps = rankCoverageGaps([
            'How to use a face roller without irritating skin',
            'What dermatologists say about the skin barrier',
            'A practical retinol routine for mature skin',
        ]);

        expect(gaps.slice(0, 2).map((gap) => gap.id)).toEqual(
            expect.arrayContaining(['body-care', 'wellbeing']),
        );
        expect(gaps.at(-1)?.recentMentions).toBeGreaterThan(0);
    });

    it('dopasowuje polskie znaki niezależnie od zapisu', () => {
        const gaps = rankCoverageGaps(['Delikatne złuszczanie i pielęgnacja ciała']);
        expect(gaps.find((gap) => gap.id === 'body-care')?.recentMentions).toBe(1);
    });
});
