import { describe, expect, it } from 'vitest';
import { dedupeCandidates } from './dedupe';
import type { Candidate } from './types';

function candidate(overrides: Partial<Candidate>): Candidate {
    return { title: 'Tytuł', url: 'https://example.com/a', source: 'X', corroboration: 1, ...overrides };
}

describe('dedupeCandidates — dokładny URL', () => {
    it('scala kandydatów o identycznym kanonicznym URL-u w jeden wpis, BEZ zwiększania corroboration', () => {
        const result = dedupeCandidates([
            candidate({ url: 'https://www.example.com/a?utm_source=x', title: 'A', publishedAt: '2026-09-21T10:00:00Z' }),
            candidate({ url: 'https://example.com/a', title: 'A', publishedAt: '2026-09-20T08:00:00Z' }),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].corroboration).toBe(1);
    });

    it('przy scaleniu po URL zachowuje wcześniejszą datę publikacji', () => {
        const result = dedupeCandidates([
            candidate({ url: 'https://example.com/a', publishedAt: '2026-09-21T10:00:00Z' }),
            candidate({ url: 'https://example.com/a/', publishedAt: '2026-09-20T08:00:00Z' }),
        ]);
        expect(result[0].publishedAt).toBe('2026-09-20T08:00:00Z');
    });
});

describe('dedupeCandidates — podobieństwo tytułów między różnymi domenami', () => {
    it('scala podobne tytuły z RÓŻNYCH domen i zwiększa corroboration', () => {
        // Jaccard: {openai,wypuszcza,nowy,model,gpt,firm} vs {openai,wypuszcza,nowy,model,gpt,programistow}
        // ("dla" to stopword) -> intersect 5 / union 7 = 0,714 >= 0,7
        const result = dedupeCandidates([
            candidate({ url: 'https://openai.com/news/nowy-model', title: 'OpenAI wypuszcza nowy model GPT dla firm' }),
            candidate({ url: 'https://techcrunch.com/2026/09/21/openai-nowy-model', title: 'OpenAI wypuszcza nowy model GPT dla programistów' }),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].corroboration).toBe(2);
    });

    it('NIE scala podobnych tytułów z TEJ SAMEJ domeny (to inny artykuł tego źródła, nie korroboracja)', () => {
        const result = dedupeCandidates([
            candidate({ url: 'https://openai.com/news/a', title: 'Nowy model OpenAI dostępny dla wszystkich' }),
            candidate({ url: 'https://openai.com/news/b', title: 'Nowy model OpenAI dostępny w API' }),
        ]);
        expect(result).toHaveLength(2);
        expect(result.every((c) => c.corroboration === 1)).toBe(true);
    });

    it('nie scala tytułów poniżej progu podobieństwa', () => {
        const result = dedupeCandidates([
            candidate({ url: 'https://a.pl/1', title: 'OpenAI wypuszcza nowy model' }),
            candidate({ url: 'https://b.pl/2', title: 'Google inwestuje w energetykę jądrową' }),
        ]);
        expect(result).toHaveLength(2);
    });

    it('próg podobieństwa jest konfigurowalny', () => {
        const items = [
            candidate({ url: 'https://a.pl/1', title: 'Agenci AI w biznesie' }),
            candidate({ url: 'https://b.pl/2', title: 'Agenci AI dla startupów' }),
        ];
        expect(dedupeCandidates(items, { titleSimilarityThreshold: 0.99 })).toHaveLength(2);
        expect(dedupeCandidates(items, { titleSimilarityThreshold: 0.3 })).toHaveLength(1);
    });

    it('scala grupę trzech niezależnych źródeł w jeden wpis z corroboration 3', () => {
        // Każda para różni się tylko czasownikiem (5 z 6 tokenów wspólnych, "w" to stopword):
        // intersect 5 / union 7 = 0,714 >= 0,7 dla każdej pary.
        const result = dedupeCandidates([
            candidate({ url: 'https://a.pl/1', title: 'Anthropic wprowadza nowy tryb bezpieczeństwa w Claude' }),
            candidate({ url: 'https://b.pl/2', title: 'Anthropic ogłasza nowy tryb bezpieczeństwa w Claude' }),
            candidate({ url: 'https://c.pl/3', title: 'Anthropic prezentuje nowy tryb bezpieczeństwa w Claude' }),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].corroboration).toBe(3);
    });

    it('kandydat bez pary zostaje z corroboration 1', () => {
        const result = dedupeCandidates([candidate({ url: 'https://a.pl/1', title: 'Unikalna wiadomość' })]);
        expect(result).toEqual([candidate({ url: 'https://a.pl/1', title: 'Unikalna wiadomość', corroboration: 1 })]);
    });

    it('działa poprawnie na pustej liście', () => {
        expect(dedupeCandidates([])).toEqual([]);
    });
});
