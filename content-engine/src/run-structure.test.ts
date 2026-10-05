import { describe, expect, it } from 'vitest';
import { dedupeExternalLinksBySection, limitProductLinks, normalizeInBrief } from './run';

describe('article structure hardening', () => {
    it('rebuilds In brief as exactly three existing points with an ISO date', () => {
        const input = `## In brief

Current as of 30.09.2026.

Settlement reduces reconciliation work. Compliance remains in the existing workflow. End users do not need to handle wallets.

## What changed

Banks can keep the customer experience while changing the settlement layer.`;

        const output = normalizeInBrief(input, '2026-09-30');
        expect(output.match(/^[-*]\s+/gmu)).toHaveLength(3);
        expect(output.match(/Current as of 2026-09-30/gmu)).toHaveLength(1);
        expect(output).not.toContain('Current as of 30.09.2026');
    });

    it('creates In brief when a date marker exists elsewhere in the article', () => {
        const input = `Current as of 2026-10-05.

## What changed

Barrier care starts with a gentle cleanser. Introduce one active at a time. Daily sunscreen remains important.`;

        const output = normalizeInBrief(input, '2026-10-05');

        expect(output).toMatch(/^## In brief$/mu);
        expect(output.match(/^[-*]\s+/gmu)).toHaveLength(3);
    });

    it('keeps one occurrence of a source URL per H2 section', () => {
        const source = 'https://example.com/report';
        const input = `## One\n\n> **Section source:** [Report](${source})\n\n> **Section source:** [Report](${source})\n\n## Two\n\n[third](${source}) and [fourth](${source}).`;
        const output = dedupeExternalLinksBySection(input);

        expect(output.match(/https:\/\/example\.com\/report/gmu)).toHaveLength(2);
        expect(output.match(/Section source:/gmu)).toHaveLength(1);
        expect(output).toContain('and fourth.');
    });

    it('caps product links at six and preserves distinct products', () => {
        const input = [
            '[patch 1](/shop/clear-skin-patches)',
            '[patch 2](/shop/clear-skin-patches)',
            '[patch 3](/shop/clear-skin-patches)',
            '[patch 4](/shop/clear-skin-patches)',
            '[patch 5](/shop/clear-skin-patches)',
            '[patch 6](/shop/clear-skin-patches)',
            '[mask](/shop/centella-collagen-sleep-masks)',
            '[roller](/shop/ice-face-roller-gua-sha-set)',
        ].join('\n\n');

        const output = limitProductLinks(input);
        expect(output.match(/\]\(\/shop\//gmu)).toHaveLength(6);
        expect(output).toContain('](/shop/centella-collagen-sleep-masks)');
        expect(output).toContain('](/shop/ice-face-roller-gua-sha-set)');
    });
});
