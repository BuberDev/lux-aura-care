import { describe, expect, it, vi } from 'vitest';
import { fetchFeed, parseFeed } from './feeds';

const RSS_SAMPLE = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <title>OpenAI News</title>
  <item>
    <title>Nowy model OpenAI</title>
    <link>https://openai.com/news/nowy-model</link>
    <pubDate>Mon, 21 Sep 2026 10:00:00 GMT</pubDate>
  </item>
  <item>
    <title>Aktualizacja API</title>
    <link>https://openai.com/news/aktualizacja-api</link>
    <pubDate>Sun, 20 Sep 2026 08:00:00 GMT</pubDate>
  </item>
</channel></rss>`;

const ATOM_SAMPLE = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Google AI Blog</title>
  <entry>
    <title>Gemini update</title>
    <link rel="self" href="https://blog.google/feed"/>
    <link rel="alternate" href="https://blog.google/technology/ai/gemini-update"/>
    <published>2026-09-19T12:00:00Z</published>
  </entry>
</feed>`;

const ATOM_SINGLE_LINK_NO_RELS = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Jeden wpis</title>
    <link href="https://example.com/a"/>
    <updated>2026-09-18T00:00:00Z</updated>
  </entry>
</feed>`;

describe('parseFeed — RSS 2.0', () => {
    it('parsuje wiele <item> z tytułem, linkiem i datą jako ISO', () => {
        const candidates = parseFeed(RSS_SAMPLE, 'OpenAI');
        expect(candidates).toHaveLength(2);
        expect(candidates[0]).toEqual({
            title: 'Nowy model OpenAI',
            url: 'https://openai.com/news/nowy-model',
            source: 'OpenAI',
            publishedAt: new Date('Mon, 21 Sep 2026 10:00:00 GMT').toISOString(),
            corroboration: 1,
        });
    });

    it('pomija <item> bez tytułu lub linku zamiast rzucać', () => {
        const xml = `<rss><channel><item><title></title><link>https://x.pl</link></item><item><title>OK</title><link>https://y.pl</link></item></channel></rss>`;
        expect(parseFeed(xml, 'X')).toEqual([{ title: 'OK', url: 'https://y.pl', source: 'X', publishedAt: undefined, corroboration: 1 }]);
    });

    it('pojedynczy <item> (nie tablica) też się parsuje', () => {
        const xml = `<rss><channel><item><title>Jedyny</title><link>https://z.pl</link></item></channel></rss>`;
        expect(parseFeed(xml, 'Z')).toHaveLength(1);
    });
});

describe('parseFeed — Atom', () => {
    it('wybiera link rel="alternate" spośród kilku <link>', () => {
        const candidates = parseFeed(ATOM_SAMPLE, 'Google AI');
        expect(candidates).toEqual([
            { title: 'Gemini update', url: 'https://blog.google/technology/ai/gemini-update', source: 'Google AI', publishedAt: '2026-09-19T12:00:00.000Z', corroboration: 1 },
        ]);
    });

    it('bierze jedyny <link href> gdy nie ma atrybutu rel', () => {
        const candidates = parseFeed(ATOM_SINGLE_LINK_NO_RELS, 'Solo');
        expect(candidates[0].url).toBe('https://example.com/a');
    });

    it('używa <updated>, gdy brak <published>', () => {
        const candidates = parseFeed(ATOM_SINGLE_LINK_NO_RELS, 'Solo');
        expect(candidates[0].publishedAt).toBe('2026-09-18T00:00:00.000Z');
    });
});

describe('parseFeed — odporność', () => {
    it('zwraca [] dla niepoprawnego XML zamiast rzucać', () => {
        expect(parseFeed('to nie jest xml <<<', 'X')).toEqual([]);
    });

    it('zwraca [] dla poprawnego XML, który nie jest RSS ani Atom', () => {
        expect(parseFeed('<root><cokolwiek/></root>', 'X')).toEqual([]);
    });

    it('data w nierozpoznawalnym formacie -> publishedAt undefined, nie rzuca', () => {
        const xml = `<rss><channel><item><title>T</title><link>https://x.pl</link><pubDate>nie-data</pubDate></item></channel></rss>`;
        expect(parseFeed(xml, 'X')[0].publishedAt).toBeUndefined();
    });
});

describe('fetchFeed', () => {
    it('parsuje odpowiedź 200 i ustawia User-Agent', async () => {
        const fetchFn = vi.fn(async (_url: string, init?: RequestInit) => {
            expect((init?.headers as Record<string, string>)['User-Agent']).toContain('LuxAuraCareContentBot');
            expect((init?.headers as Record<string, string>).Accept).toContain('application/rss+xml');
            return new Response(RSS_SAMPLE, { status: 200 });
        });
        const candidates = await fetchFeed('https://example.com/feed', 'X', fetchFn as unknown as typeof fetch);
        expect(candidates).toHaveLength(2);
    });

    it('zwraca [] (nie rzuca) przy statusie != 200 — jeden zepsuty feed nie blokuje reszty', async () => {
        const fetchFn = vi.fn(async () => new Response('not found', { status: 404 }));
        expect(await fetchFeed('https://example.com/feed', 'X', fetchFn as unknown as typeof fetch)).toEqual([]);
    });

    it('zwraca [] (nie rzuca) przy błędzie sieci', async () => {
        const fetchFn = vi.fn(async () => {
            throw new Error('network down');
        });
        expect(await fetchFeed('https://example.com/feed', 'X', fetchFn as unknown as typeof fetch)).toEqual([]);
    });
});
