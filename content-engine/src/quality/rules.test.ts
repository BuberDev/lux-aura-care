import { describe, expect, it } from 'vitest';
import { checkInternalLinks, findRepeatedExternalLinksBySection, findThinSections } from './rules';

describe('findRepeatedExternalLinksBySection', () => {
    it('wykrywa ten sam URL powtórzony w jednej sekcji H2', () => {
        const markdown = `## Jak działa

Pierwszy fakt ([dokumentacja](https://docs.example.com/runtime)).

Drugi fakt ([ten sam dokument](https://docs.example.com/runtime)).`;

        expect(findRepeatedExternalLinksBySection(markdown)).toEqual([
            {
                heading: 'Jak działa',
                url: 'https://docs.example.com/runtime',
                count: 2,
            },
        ]);
    });

    it('traktuje warianty śledzące i końcowy slash jako ten sam adres', () => {
        const markdown = `## Wyniki

[Źródło](https://example.com/report/?utm_source=newsletter)

[Raport](https://www.example.com/report)`;

        expect(findRepeatedExternalLinksBySection(markdown)[0]).toMatchObject({
            heading: 'Wyniki',
            count: 2,
        });
    });

    it('pozwala cytować źródło po jednym razie w różnych sekcjach', () => {
        const markdown = `## Mechanizm

[Dokumentacja](https://docs.example.com/runtime)

## Ryzyka

[Dokumentacja](https://docs.example.com/runtime)`;

        expect(findRepeatedExternalLinksBySection(markdown)).toEqual([]);
    });
});

describe('findThinSections', () => {
    it('odrzuca sekcję zawierającą wyłącznie noty źródłowe', () => {
        const markdown = `## What changed

> **Section source:** [Report](https://example.com/report)

> **Section source:** [Documentation](https://docs.example.com/guide)

## Sources

- [Raport](https://example.com/report)`;

        expect(findThinSections(markdown)).toEqual([{ heading: 'What changed', wordCount: 0 }]);
    });

    it('nie oznacza jako cienkiej sekcji z konkretnym wyjaśnieniem', () => {
        const markdown = `## Co się wydarzyło

Agent napotkał blokadę dostępu, a następnie spróbował alternatywnej ścieżki. Zdarzenie pokazało,
że ograniczenie zapisane wyłącznie w instrukcji modelu nie zastępuje polityki sieciowej, osobnej
tożsamości i kontroli uprawnień egzekwowanej niezależnie od decyzji systemu.`;

        expect(findThinSections(markdown)).toEqual([]);
    });
});

describe('checkInternalLinks', () => {
    const article = (contentMarkdown: string) => ({
        title: 'A practical guide to a calmer skincare routine',
        seoTitle: 'A calmer skincare routine',
        seoDescription: 'A careful, evidence-led guide to building a calmer skincare routine and choosing beauty tools without adding unnecessary irritation.',
        excerpt: 'Learn how to simplify a beauty routine, introduce products gradually, and choose tools that fit your skin and comfort.',
        contentMarkdown,
        imageBrief: { headline: 'A calmer routine', kicker: 'Lux Aura Care', chips: ['Gentle', 'Useful', 'Clear'] },
    });
    const context = {
        now: new Date('2026-10-02T12:00:00Z'),
        recentTitles: [],
        usedSourceUrls: [],
        internalLinkAllowlist: ['/shop/clear-skin-patches', '/shop/gold-eye-patches', '/shop/gua-sha-jade-roller-set'],
        realArticleSlugs: [],
        sourceChecks: [],
    };

    it('accepts 4–6 links spanning at least three real products', () => {
        const findings = checkInternalLinks(article(`
[Patches](/shop/clear-skin-patches), [eye patches](/shop/gold-eye-patches),
[a roller](/shop/gua-sha-jade-roller-set), and [the patches again](/shop/clear-skin-patches).
`), context);

        expect(findings).toEqual([]);
    });

    it('rejects product-link stuffing and too little catalog variety', () => {
        const repeated = Array.from({ length: 7 }, (_, index) => `[patch ${index}](/shop/clear-skin-patches)`).join(' ');
        const codes = checkInternalLinks(article(repeated), context).map((finding) => finding.code);

        expect(codes).toContain('too_many_product_links');
        expect(codes).toContain('too_few_distinct_products');
    });
});
