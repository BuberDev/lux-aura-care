import { describe, expect, it } from 'vitest';
import { analyzeLanguage } from './language';

const POLISH_PARAGRAPH = `
Agenci AI zmieniają sposób, w jaki firmy podchodzą do automatyzacji procesów. Zamiast
budować sztywne integracje, coraz więcej zespołów decyduje się na modele, które same
planują kolejne kroki i reagują na zmiany w danych. To podejście jest szczególnie
przydatne tam, gdzie proces zmienia się częściej niż raz na kwartał, a ręczne
utrzymanie reguł biznesowych zaczyna kosztować więcej niż sam problem, który miało
rozwiązać.`.repeat(3);

const ENGLISH_PARAGRAPH = `
AI agents are changing the way companies approach process automation. Instead of
building rigid integrations, more and more teams are choosing models that plan their
own next steps and react to changes in data. This approach is especially useful where
the process changes more often than once a quarter, and manual maintenance of business
rules starts to cost more than the problem it was meant to solve.`.repeat(3);

describe('analyzeLanguage', () => {
    it('recognises a longer English text', () => {
        const result = analyzeLanguage(ENGLISH_PARAGRAPH);
        expect(result.isEnglish).toBe(true);
        expect(result.englishFunctionRatio).toBeGreaterThanOrEqual(0.08);
    });

    it('rejects Polish prose when Polish function words dominate', () => {
        const result = analyzeLanguage(POLISH_PARAGRAPH);
        expect(result.isEnglish).toBe(false);
        expect(result.polishDominates).toBe(true);
    });

    it('odrzuca pusty tekst', () => {
        expect(analyzeLanguage('').isEnglish).toBe(false);
    });

    it('rejects a fragment with too few English function words', () => {
        const result = analyzeLanguage('blockchain tokenization settlement custody protocol');
        expect(result.englishFunctionRatio).toBe(0);
        expect(result.isEnglish).toBe(false);
    });

    it('odrzuca tekst mieszany, w którym angielskie słowa funkcyjne przeważają liczebnie', () => {
        const mixed = 'To jest świetny model. The model is great and the results are impressive for the team and the company.';
        const result = analyzeLanguage(mixed);
        expect(result.polishDominates).toBe(false);
        expect(result.isEnglish).toBe(true);
    });
});
