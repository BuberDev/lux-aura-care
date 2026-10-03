import { describe, expect, it, vi } from 'vitest';
import { collectCandidates } from './collect';
import type { FeedSource } from '../../config/feeds';

const NOW = new Date('2026-09-22T00:00:00.000Z');

function rss(items: { title: string; link: string; pubDate: string }[]): string {
    const body = items.map((i) => `<item><title>${i.title}</title><link>${i.link}</link><pubDate>${i.pubDate}</pubDate></item>`).join('');
    return `<rss><channel>${body}</channel></rss>`;
}

const FEEDS: FeedSource[] = [
    { name: 'Feed A', url: 'https://a.example/feed' },
    { name: 'Feed B', url: 'https://b.example/feed' },
];

function makeFetch(handlers: Record<string, () => Response>): typeof fetch {
    return vi.fn(async (url: string | URL) => {
        const key = url.toString();
        for (const [prefix, handler] of Object.entries(handlers)) {
            if (key.startsWith(prefix)) return handler();
        }
        return new Response('not found', { status: 404 });
    }) as unknown as typeof fetch;
}

describe('collectCandidates', () => {
    it('łączy kandydatów z feedów i HN, deduplikuje, i liczy działające feedy', async () => {
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(rss([{ title: 'Świeży news', link: 'https://a.example/1', pubDate: 'Mon, 21 Sep 2026 10:00:00 GMT' }]), { status: 200 }),
            'https://b.example/feed': () => new Response('padnięty feed', { status: 500 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });

        const result = await collectCandidates({ usedSourceUrls: [], recentTitles: [], now: NOW, fetchFn, feeds: FEEDS });

        expect(result.candidates).toHaveLength(1);
        expect(result.candidates[0].title).toBe('Świeży news');
        expect(result.workingFeedsCount).toBe(1); // Feed B padł, Feed A zadziałał
        expect(result.totalFeedsCount).toBe(2);
    });

    it('odrzuca kandydatów starszych niż 14 dni', async () => {
        const oldDate = new Date(NOW.getTime() - 20 * 24 * 60 * 60 * 1000).toUTCString();
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(rss([{ title: 'Stary news', link: 'https://a.example/old', pubDate: oldDate }]), { status: 200 }),
            'https://b.example/feed': () => new Response(rss([]), { status: 200 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });
        const result = await collectCandidates({ usedSourceUrls: [], recentTitles: [], now: NOW, fetchFn, feeds: FEEDS });
        expect(result.candidates).toEqual([]);
    });

    it('zachowuje kandydata bez znanej daty publikacji (nie odrzuca z powodu wieku)', async () => {
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(`<rss><channel><item><title>Bez daty</title><link>https://a.example/x</link></item></channel></rss>`, { status: 200 }),
            'https://b.example/feed': () => new Response(rss([]), { status: 200 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });
        const result = await collectCandidates({ usedSourceUrls: [], recentTitles: [], now: NOW, fetchFn, feeds: FEEDS });
        expect(result.candidates.map((c) => c.title)).toEqual(['Bez daty']);
    });

    it('odrzuca kandydata, którego URL jest już użyty (historia poprzednich artykułów)', async () => {
        const fresh = new Date(NOW.getTime() - 1 * 24 * 60 * 60 * 1000).toUTCString();
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(rss([{ title: 'Już użyty', link: 'https://www.a.example/used?utm_source=x', pubDate: fresh }]), { status: 200 }),
            'https://b.example/feed': () => new Response(rss([]), { status: 200 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });
        const result = await collectCandidates({ usedSourceUrls: ['https://a.example/used'], recentTitles: [], now: NOW, fetchFn, feeds: FEEDS });
        expect(result.candidates).toEqual([]);
    });

    it('odrzuca kandydata, którego tytuł jest zbyt podobny do historii (Jaccard > 0,5)', async () => {
        const fresh = new Date(NOW.getTime() - 1 * 24 * 60 * 60 * 1000).toUTCString();
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(rss([{ title: 'Nowy model OpenAI dla programistów', link: 'https://a.example/x', pubDate: fresh }]), { status: 200 }),
            'https://b.example/feed': () => new Response(rss([]), { status: 200 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });
        const result = await collectCandidates({
            usedSourceUrls: [],
            recentTitles: ['Nowy model OpenAI dla programistów'], // identyczny tytuł -> Jaccard 1,0
            now: NOW,
            fetchFn,
            feeds: FEEDS,
        });
        expect(result.candidates).toEqual([]);
    });

    it('nie odrzuca kandydata o tytule wyraźnie różnym od historii', async () => {
        const fresh = new Date(NOW.getTime() - 1 * 24 * 60 * 60 * 1000).toUTCString();
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response(rss([{ title: 'Zupełnie inny temat o robotyce', link: 'https://a.example/x', pubDate: fresh }]), { status: 200 }),
            'https://b.example/feed': () => new Response(rss([]), { status: 200 }),
            'https://hn.algolia.com': () => new Response(JSON.stringify({ hits: [] }), { status: 200 }),
        });
        const result = await collectCandidates({ usedSourceUrls: [], recentTitles: ['Nowy model OpenAI dla programistów'], now: NOW, fetchFn, feeds: FEEDS });
        expect(result.candidates).toHaveLength(1);
    });

    it('zwraca pustą listę i workingFeedsCount 0, gdy wszystkie źródła padają, zamiast rzucać', async () => {
        const fetchFn = makeFetch({
            'https://a.example/feed': () => new Response('boom', { status: 500 }),
            'https://b.example/feed': () => new Response('boom', { status: 500 }),
            'https://hn.algolia.com': () => new Response('boom', { status: 500 }),
        });
        const result = await collectCandidates({ usedSourceUrls: [], recentTitles: [], now: NOW, fetchFn, feeds: FEEDS });
        expect(result).toEqual({ candidates: [], workingFeedsCount: 0, totalFeedsCount: 2 });
    });
});
