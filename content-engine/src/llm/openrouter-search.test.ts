import { describe, expect, it, vi } from 'vitest';
import { searchWeb } from './openrouter-search';
import type { FetchFn } from './deepseek';

function fetchOk(body: object): FetchFn {
    return vi.fn(async () => new Response(JSON.stringify(body), { status: 200 })) as unknown as FetchFn;
}

describe('searchWeb', () => {
    it('parsuje annotations w sources (url, title)', async () => {
        const fetchFn = fetchOk({
            choices: [
                {
                    message: {
                        content: 'streszczenie',
                        annotations: [
                            { type: 'url_citation', url_citation: { url: 'https://a.pl', title: 'A' } },
                            { type: 'url_citation', url_citation: { url: 'https://b.pl', title: 'B' } },
                        ],
                    },
                },
            ],
            usage: { cost: 0.007 },
        });
        const result = await searchWeb('agenci AI', { apiKey: 'key' }, fetchFn);
        expect(result.sources).toEqual([{ url: 'https://a.pl', title: 'A' }, { url: 'https://b.pl', title: 'B' }]);
        expect(result.summaryText).toBe('streszczenie');
        expect(result.costUsd).toBe(0.007);
    });

    it('usuwa duplikaty URL-i', async () => {
        const fetchFn = fetchOk({
            choices: [{ message: { annotations: [
                { url_citation: { url: 'https://a.pl', title: 'A' } },
                { url_citation: { url: 'https://a.pl', title: 'A ponownie' } },
            ] } }],
        });
        const result = await searchWeb('x', { apiKey: 'key' }, fetchFn);
        expect(result.sources).toHaveLength(1);
    });

    it('pomija adnotacje bez url_citation.url', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { annotations: [{ type: 'other' }, { url_citation: {} }] } }] });
        const result = await searchWeb('x', { apiKey: 'key' }, fetchFn);
        expect(result.sources).toEqual([]);
    });

    it('zwraca pustą listę (nie rzuca), gdy brak annotations — decyzję "brak wyników" podejmuje wołający', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: 'brak wyników' } }] });
        const result = await searchWeb('x', { apiKey: 'key' }, fetchFn);
        expect(result.sources).toEqual([]);
    });

    it('używa domyślnego kosztu Exa, gdy usage.cost nieobecne', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { annotations: [] } }] });
        const result = await searchWeb('x', { apiKey: 'key' }, fetchFn);
        expect(result.costUsd).toBe(0.007);
    });

    it('rzuca z treścią błędu przy statusie != 200', async () => {
        const fetchFn = vi.fn().mockResolvedValue(new Response('too many requests', { status: 429 })) as unknown as FetchFn;
        await expect(searchWeb('x', { apiKey: 'key' }, fetchFn)).rejects.toThrow(/429/);
    });

    it('rzuca, gdy odpowiedź zawiera pole error mimo statusu 200', async () => {
        const fetchFn = fetchOk({ error: { message: 'niepoprawny klucz API' } });
        await expect(searchWeb('x', { apiKey: 'key' }, fetchFn)).rejects.toThrow(/niepoprawny klucz API/);
    });

    it('wysyła max_results i zapytanie w treści promptu', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { annotations: [] } }] });
        await searchWeb('agenci AI w firmie', { apiKey: 'key', maxResults: 3 }, fetchFn);
        const body = JSON.parse((fetchFn as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
        expect(body.plugins[0]).toEqual({ id: 'web', engine: 'exa', max_results: 3 });
        expect(body.messages[0].content).toContain('agenci AI w firmie');
    });
});
