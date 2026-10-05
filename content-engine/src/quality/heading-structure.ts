import { countWords, extractHeadings } from './parse';

const MIN_H2_COUNT = 4;
const MAX_H2_COUNT = 8;

const REQUIRED_SECTION_PATTERNS = [
    /^In brief$/iu,
    /^Conclusion$/iu,
    /^FAQ$/iu,
    /^Sources$/iu,
];

function isRequiredSection(title: string): boolean {
    return REQUIRED_SECTION_PATTERNS.some((pattern) => pattern.test(title.trim()));
}

function replaceHeadingLevel(line: string, level: 2 | 3): string {
    return line.replace(/^#{2,4}(\s+)/u, `${'#'.repeat(level)}$1`);
}

interface HeadingLine {
    index: number;
    level: number;
    title: string;
    parentH2: string | null;
    bodyWordCount: number;
}

function headingLines(lines: string[]): HeadingLine[] {
    const headings: Omit<HeadingLine, 'bodyWordCount'>[] = [];
    let inCodeFence = false;
    let parentH2: string | null = null;

    for (const [index, line] of lines.entries()) {
        if (/^```/u.test(line.trim())) {
            inCodeFence = !inCodeFence;
            continue;
        }
        if (inCodeFence) continue;

        const match = line.match(/^(#{2,4})\s+(.+)$/u);
        if (!match) continue;
        const level = match[1].length;
        const title = match[2].trim();
        if (level === 2) parentH2 = title;
        headings.push({ index, level, title, parentH2: level === 2 ? title : parentH2 });
    }

    return headings.map((heading, position) => {
        const nextIndex = headings[position + 1]?.index ?? lines.length;
        return {
            ...heading,
            bodyWordCount: countWords(lines.slice(heading.index + 1, nextIndex).join('\n')),
        };
    });
}

export interface HeadingStructureRepair {
    contentMarkdown: string;
    changed: boolean;
    beforeH2Count: number;
    afterH2Count: number;
}

/**
 * Repairs heading levels only. It never adds facts or removes prose.
 */
export function repairHeadingStructure(contentMarkdown: string): HeadingStructureRepair {
    const beforeH2Count = extractHeadings(contentMarkdown).filter((heading) => heading.level === 2).length;
    const lines = contentMarkdown.split('\n');

    for (const heading of headingLines(lines)) {
        if (heading.level !== 2 && isRequiredSection(heading.title)) {
            lines[heading.index] = replaceHeadingLevel(lines[heading.index], 2);
        }
    }

    let current = headingLines(lines);
    let h2Count = current.filter((heading) => heading.level === 2).length;
    if (h2Count > MAX_H2_COUNT) {
        const extras = current.filter((heading) => heading.level === 2 && !isRequiredSection(heading.title));
        for (const heading of extras.reverse()) {
            if (h2Count <= MAX_H2_COUNT) break;
            lines[heading.index] = replaceHeadingLevel(lines[heading.index], 3);
            h2Count -= 1;
        }
    }

    current = headingLines(lines);
    h2Count = current.filter((heading) => heading.level === 2).length;
    if (h2Count < MIN_H2_COUNT) {
        const candidates = current.filter((heading) => (
            heading.level === 3
            && heading.bodyWordCount >= 25
            && !isRequiredSection(heading.parentH2 ?? '')
        ));
        for (const heading of candidates) {
            if (h2Count >= MIN_H2_COUNT) break;
            lines[heading.index] = replaceHeadingLevel(lines[heading.index], 2);
            h2Count += 1;
        }
    }

    const repaired = lines.join('\n');
    const afterH2Count = extractHeadings(repaired).filter((heading) => heading.level === 2).length;
    return {
        contentMarkdown: repaired,
        changed: repaired !== contentMarkdown,
        beforeH2Count,
        afterH2Count,
    };
}
