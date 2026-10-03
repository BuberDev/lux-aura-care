import { describe, expect, it } from 'vitest';
import { canonicalizeUrl, hostnameOf, titleSimilarity } from './normalize';

describe('canonicalizeUrl', () => {
    it('usuwa parametry utm_*', () => {
        expect(canonicalizeUrl('https://example.com/a?utm_source=x&utm_medium=y&id=1')).toBe('https://example.com/a?id=1');
    });

    it('usuwa fragment', () => {
        expect(canonicalizeUrl('https://example.com/a#section')).toBe('https://example.com/a');
    });

    it('usuwa "www."', () => {
        expect(canonicalizeUrl('https://www.example.com/a')).toBe('https://example.com/a');
    });

    it('usuwa końcowy "/" poza samym rootem', () => {
        expect(canonicalizeUrl('https://example.com/a/')).toBe('https://example.com/a');
        expect(canonicalizeUrl('https://example.com/')).toBe('https://example.com/');
    });

    it('dwa różne zapisy tego samego artykułu dają identyczny kanoniczny URL', () => {
        const a = canonicalizeUrl('https://www.example.com/news/a/?utm_source=twitter#top');
        const b = canonicalizeUrl('https://example.com/news/a');
        expect(a).toBe(b);
    });

    it('nie rzuca dla niepoprawnego URL-a — zwraca go przyciętego', () => {
        expect(canonicalizeUrl('  nie-url  ')).toBe('nie-url');
    });
});

describe('hostnameOf', () => {
    it('zwraca domenę bez "www."', () => {
        expect(hostnameOf('https://www.openai.com/news/x')).toBe('openai.com');
    });

    it('nie rzuca dla niepoprawnego URL-a', () => {
        expect(hostnameOf('nie-url')).toBe('nie-url');
    });
});

describe('titleSimilarity', () => {
    it('zwraca 1 dla identycznych tytułów', () => {
        expect(titleSimilarity('Nowy model OpenAI', 'Nowy model OpenAI')).toBe(1);
    });

    it('zwraca wysoką wartość dla tego samego newsa opisanego innymi słowami', () => {
        const sim = titleSimilarity('OpenAI wypuszcza nowy model GPT', 'OpenAI ogłasza nowy model GPT');
        expect(sim).toBeGreaterThanOrEqual(0.5);
    });

    it('zwraca niską wartość dla zupełnie różnych tytułów', () => {
        expect(titleSimilarity('OpenAI wypuszcza nowy model', 'Google inwestuje w energetykę jądrową')).toBeLessThan(0.3);
    });

    it('jest niewrażliwe na wielkość liter i polskie diakrytyki', () => {
        expect(titleSimilarity('Łańcuch dostaw i AI', 'lancuch dostaw i ai')).toBeGreaterThan(0.9);
    });

    it('ignoruje różnicę tylko w stopwordach', () => {
        const sim = titleSimilarity('Agenci AI w firmie', 'Agenci AI dla firmie');
        expect(sim).toBeGreaterThan(0.5);
    });

    it('zwraca 0, gdy jeden tytuł jest pusty (po odfiltrowaniu stopwords) a drugi nie', () => {
        expect(titleSimilarity('i w na', 'Nowy model AI')).toBe(0);
    });
});
