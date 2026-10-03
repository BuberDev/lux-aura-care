import { describe, expect, it } from 'vitest';
import { countWords, extractHeadings, extractLinks } from './parse';

describe('extractHeadings', () => {
    it('wydobywa poziom i tekst nagłówków H2–H4', () => {
        const md = '## Co się wydarzyło\n\ntreść\n\n### Szczegóły\n\nwięcej\n\n#### Jeszcze głębiej';
        expect(extractHeadings(md)).toEqual([
            { level: 2, text: 'Co się wydarzyło', slug: 'co-sie-wydarzylo' },
            { level: 3, text: 'Szczegóły', slug: 'szczegoly' },
            { level: 4, text: 'Jeszcze głębiej', slug: 'jeszcze-glebiej' },
        ]);
    });

    it('slugifikuje transliterując „ł” zamiast go gubić', () => {
        expect(extractHeadings('## Łańcuch dostaw')[0].slug).toBe('lancuch-dostaw');
    });

    it('nie liczy linii zaczynających się od # wewnątrz bloku kodu', () => {
        const md = '## Prawdziwy nagłówek\n\n```\n# to komentarz w kodzie, nie nagłówek\n```\n\n## Drugi prawdziwy';
        expect(extractHeadings(md).map((h) => h.text)).toEqual(['Prawdziwy nagłówek', 'Drugi prawdziwy']);
    });

    it('nie wykrywa H1', () => {
        expect(extractHeadings('# Tytuł\n\ntreść').filter((h) => h.level === 1)).toHaveLength(1);
    });

    it('zwraca [] dla tekstu bez nagłówków', () => {
        expect(extractHeadings('zwykły akapit bez nagłówków')).toEqual([]);
    });
});

describe('extractLinks', () => {
    it('wydobywa linki [tekst](url)', () => {
        expect(extractLinks('Zobacz [źródło](https://openai.com/news) po więcej.')).toEqual([{ text: 'źródło', url: 'https://openai.com/news' }]);
    });

    it('pomija obrazy ![alt](url)', () => {
        expect(extractLinks('![okładka](https://example.com/cover.jpg)')).toEqual([]);
    });

    it('wydobywa wiele linków z listy źródeł', () => {
        const md = '## Źródła\n\n- [Blog OpenAI](https://openai.com/news/)\n- [Blog Hugging Face](https://huggingface.co/blog)';
        expect(extractLinks(md)).toEqual([
            { text: 'Blog OpenAI', url: 'https://openai.com/news/' },
            { text: 'Blog Hugging Face', url: 'https://huggingface.co/blog' },
        ]);
    });

    it('nie liczy linków wewnątrz bloku kodu', () => {
        const md = '```\n[fałszywy link](https://evil.example)\n```\n\n[prawdziwy](https://ok.example)';
        expect(extractLinks(md)).toEqual([{ text: 'prawdziwy', url: 'https://ok.example' }]);
    });
});

describe('countWords', () => {
    it('liczy słowa w zwykłym akapicie', () => {
        expect(countWords('To jest pięć słów w zdaniu.')).toBe(6);
    });

    it('nie liczy znaczników nagłówków jako słów', () => {
        expect(countWords('## Nagłówek dwa słowa')).toBe(3); // "Nagłówek", "dwa", "słowa" — bez "##"
    });

    it('zamienia link na sam tekst linku (liczy tekst, nie URL)', () => {
        expect(countWords('Zobacz [ten artykuł](https://example.com/dlugi/adres/url)')).toBe(3); // Zobacz, ten, artykuł
    });

    it('nie liczy treści obrazów ani ich adresów', () => {
        expect(countWords('![opis obrazu z wieloma słowami](https://example.com/x.jpg) reszta zdania')).toBe(2); // reszta, zdania
    });

    it('nie liczy zawartości bloków kodu', () => {
        expect(countWords('przed\n```\nconst x = 1; // dużo słów kodu tutaj\n```\npo')).toBe(2); // przed, po
    });

    it('zwraca 0 dla pustego tekstu', () => {
        expect(countWords('')).toBe(0);
    });
});
