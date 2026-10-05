import { describe, expect, it } from 'vitest';
import { repairHeadingStructure } from './heading-structure';

const paragraph = 'This section contains enough concrete material to stand alone while preserving the sourced meaning of the article and without introducing any new factual claim.';

describe('repairHeadingStructure', () => {
    it('promotes required sections changed to H3', () => {
        const markdown = `### In brief\n\n${paragraph}\n\n## Analysis\n\n${paragraph}\n\n### Conclusion\n\n${paragraph}\n\n### Sources\n\n- [Source](https://example.com)`;
        const result = repairHeadingStructure(markdown);
        expect(result.afterH2Count).toBe(4);
        expect(result.contentMarkdown).toContain('## In brief');
        expect(result.contentMarkdown).toContain('## Conclusion');
        expect(result.contentMarkdown).toContain('## Sources');
    });

    it('demotes excess non-required H2 sections without deleting prose', () => {
        const markdown = ['In brief', 'One', 'Two', 'Three', 'Four', 'Five', 'Conclusion', 'FAQ', 'Sources']
            .map((title) => `## ${title}\n\n${paragraph}`)
            .join('\n\n');
        const result = repairHeadingStructure(markdown);
        expect(result.afterH2Count).toBe(8);
        expect(result.contentMarkdown).toContain(paragraph);
        expect(result.contentMarkdown).toContain('## Sources');
    });
});
