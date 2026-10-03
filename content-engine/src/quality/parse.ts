// Lekkie, oparte na wyrażeniach regularnych wydobywanie struktury z Markdownu artykułu.
// To NIE jest granica bezpieczeństwa (tę rolę pełni checkAndRenderArticle w M1,
// src/lib/weekly-article/content.ts) — tu tylko sprawdzamy jakość redakcyjną własnej
// treści silnika, więc pełna zgodność z CommonMark nie jest wymagana.

export interface Heading {
    level: number;
    text: string;
    slug: string;
}

export interface ExtractedLink {
    text: string;
    url: string;
}

/** Slug identyczny z generateSlug w M1 (src/lib/blog-utils.ts) — transliteruje „ł” przed NFD. */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ł/g, 'l')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function forEachContentLine(markdown: string, visit: (line: string) => void): void {
    let inCodeFence = false;
    for (const line of markdown.split('\n')) {
        if (/^```/.test(line.trim())) {
            inCodeFence = !inCodeFence;
            continue;
        }
        if (inCodeFence) continue;
        visit(line);
    }
}

/** Nagłówki Markdown (`#`..`######`), pomijając te wewnątrz bloków kodu. */
export function extractHeadings(markdown: string): Heading[] {
    const headings: Heading[] = [];
    forEachContentLine(markdown, (line) => {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) headings.push({ level: match[1].length, text: match[2].trim(), slug: slugify(match[2].trim()) });
    });
    return headings;
}

/** Linki `[tekst](url)` (nie obrazy `![...]()`), pomijając te wewnątrz bloków kodu. */
export function extractLinks(markdown: string): ExtractedLink[] {
    const links: ExtractedLink[] = [];
    const linkPattern = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
    forEachContentLine(markdown, (line) => {
        for (const match of line.matchAll(linkPattern)) {
            links.push({ text: match[1], url: match[2] });
        }
    });
    return links;
}

/** Liczba słów po usunięciu składni Markdown (nagłówki, linki, obrazy, bloki kodu, pogrubienia). */
export function countWords(markdown: string): number {
    const plain = markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
        .replace(/(?<!!)\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`>#]/g, ' ');
    return plain.split(/\s+/).filter(Boolean).length;
}
