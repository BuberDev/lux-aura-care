import { describe, expect, it, vi } from 'vitest';
import { fetchHackerNews } from './hn';

function hitsResponse(hits: object[]): Response {
    return new Response(JSON.stringify({ hits }), { status: 200 });
}

describe('fetchHackerNews', () => {
    it('mapuje trafienia na kandydatów, oznaczając źródło zapytaniem', async () => {
        const fetchFn = vi.fn(async () => hitsResponse([{ title: 'Nowy model', url: 'https://a.pl', points: 120, created_at: '2026-09-20T10:00:00.000Z', objectID: '1' }]));
        const candidates = await fetchHackerNews({ queries: ['LLM'] }, fetchFn as unknown as typeof fetch);
        expect(candidates).toEqual([{ title: 'Nowy model', url: 'https://a.pl', source: 'Hacker News (LLM)', publishedAt: '2026-09-20T10:00:00.000Z', corroboration: 1 }]);
    });

    it('pomija trafienia bez zewnętrznego URL-a (Ask HN, posty tekstowe)', async () => {
        const fetchFn = vi.fn(async () => hitsResponse([{ title: 'Ask HN: co sądzicie o...', url: null, points: 200, created_at: '2026-09-20T10:00:00.000Z', objectID: '2' }]));
        expect(await fetchHackerNews({ queries: ['LLM'] }, fetchFn as unknown as typeof fetch)).toEqual([]);
    });

    it('odpytuje każde zapytanie z listy i łączy wyniki', async () => {
        const fetchFn = vi
            .fn()
            .mockImplementationOnce(async () => hitsResponse([{ title: 'A', url: 'https://a.pl', points: 100, created_at: null, objectID: '1' }]))
            .mockImplementationOnce(async () => hitsResponse([{ title: 'B', url: 'https://b.pl', points: 90, created_at: null, objectID: '2' }]));
        const candidates = await fetchHackerNews({ queries: ['LLM', 'Gemini'] }, fetchFn as unknown as typeof fetch);
        expect(fetchFn).toHaveBeenCalledTimes(2);
        expect(candidates.map((c) => c.title)).toEqual(['A', 'B']);
    });

    it('buduje numericFilters z progiem punktów i oknem czasowym względem `now`', async () => {
        const fetchFn = vi.fn(async (url: string) => {
            void url;
            return hitsResponse([]);
        });
        const now = new Date('2026-09-22T00:00:00.000Z');
        await fetchHackerNews({ queries: ['LLM'], minPoints: 80, sinceDays: 7, now }, fetchFn as unknown as typeof fetch);
        const calledUrl = new URL(fetchFn.mock.calls[0][0] as string);
        const filters = calledUrl.searchParams.get('numericFilters');
        const expectedSince = Math.floor(now.getTime() / 1000) - 7 * 24 * 60 * 60;
        expect(filters).toBe(`created_at_i>${expectedSince},points>80`);
    });

    it('zwraca [] dla zapytania, które zwróci błąd, nie blokując pozostałych', async () => {
        const fetchFn = vi
            .fn()
            .mockImplementationOnce(async () => new Response('boom', { status: 500 }))
            .mockImplementationOnce(async () => hitsResponse([{ title: 'B', url: 'https://b.pl', points: 90, created_at: null, objectID: '2' }]));
        const candidates = await fetchHackerNews({ queries: ['LLM', 'Gemini'] }, fetchFn as unknown as typeof fetch);
        expect(candidates.map((c) => c.title)).toEqual(['B']);
    });

    it('zwraca [] przy wyjątku sieciowym zamiast rzucać', async () => {
        const fetchFn = vi.fn(async () => {
            throw new Error('network down');
        });
        expect(await fetchHackerNews({ queries: ['LLM'] }, fetchFn as unknown as typeof fetch)).toEqual([]);
    });

    it('używa domyślnych zapytań, progu i okna, gdy nie podano opcji', async () => {
        const fetchFn = vi.fn(async () => hitsResponse([]));
        await fetchHackerNews({}, fetchFn as unknown as typeof fetch);
        expect(fetchFn).toHaveBeenCalledTimes(6); // 6 domyślnych zapytań ze specu
    });
});
