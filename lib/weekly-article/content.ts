import { marked, type Token, type Tokens } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const MIN_WORDS = 800;
export const MIN_COVER_BYTES = 100;
export const MAX_COVER_BYTES = 2 * 1024 * 1024;
export const MIN_INLINE_IMAGE_BYTES = 20 * 1024;
export const MAX_INLINE_IMAGE_BYTES = 800 * 1024;

// Treść trafia do dangerouslySetInnerHTML na publicznej stronie, a pochodzi z modelu, który czytał internet —
// dlatego allowlista tagów/atrybutów, a nie czarna lista.
const ALLOWED_TAGS = [
    'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote',
    'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br',
];

/**
 * UWAGA: samo `markdownToSafeHtml` NIE gwarantuje polityki linków "https albo względny" —
 * link bez schematu (np. z przypisu) albo surowy `<a href="https:\\evil.example">` może
 * przejść bez `target`/`rel`. Tę gwarancję daje wyłącznie `checkAndRenderArticle(...).ok`
 * (przez powody `insecure_link:`/`raw_html`); wywołujący, którym zależy na tej gwarancji,
 * muszą użyć `checkAndRenderArticle` i sprawdzić `.ok`.
 */
export function markdownToSafeHtml(markdown: string): string {
    const rawHtml = marked.parse(markdown, { async: false, gfm: true }) as string;

    return sanitizeHtml(rawHtml, {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: { a: ['href', 'target', 'rel'] },
        allowedSchemes: ['https'],
        allowProtocolRelative: false,
        transformTags: {
            a: (_tagName, attribs) => {
                const href = attribs.href ?? '';
                const external = /^https:\/\//i.test(href);
                // Jawny typ: bez niego TS wnioskuje unię z `target?: undefined`, niezgodną z Attributes.
                const safeAttribs: Record<string, string> = external
                    ? { href, target: '_blank', rel: 'noopener noreferrer' }
                    : { href };
                return { tagName: 'a', attribs: safeAttribs };
            },
        },
    });
}

interface TokenContainer {
    tokens?: Token[];
    items?: Token[];
    header?: { tokens: Token[] }[];
    rows?: { tokens: Token[] }[][];
}

function walk(tokens: Token[], visit: (token: Token) => void): void {
    for (const token of tokens) {
        visit(token);
        const container = token as unknown as TokenContainer;
        if (container.tokens) walk(container.tokens, visit);
        if (container.items) walk(container.items, visit);
        if (container.header) container.header.forEach((cell) => walk(cell.tokens, visit));
        if (container.rows) container.rows.forEach((row) => row.forEach((cell) => walk(cell.tokens, visit)));
    }
}

function isAllowedHref(href: string): boolean {
    // Porównanie wielkości liter tylko na potrzeby testu — `href` w powodach/HTML-u zostaje oryginalny.
    const lower = href.toLowerCase();
    return lower.startsWith('https://') || href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'));
}

function countWords(html: string): number {
    return html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
}

export interface ArticleCheck {
    ok: boolean;
    reasons: string[];
    wordCount: number;
    /** Bezpieczne do renderowania TYLKO gdy `ok === true` — przy `ok === false` pole jest wciąż wypełnione
     *  (np. sanitized, ale wciąż zawierające niedozwolony względny link), więc nie renderuj go bez `.ok`. */
    html: string;
}

/**
 * Obrona w głąb po stronie serwera — silnik ma własną bramkę jakości, ale endpoint jej nie ufa.
 * Odrzuca H1, surowy HTML, linki inne niż https/względne oraz zbyt krótką treść.
 */
export function checkAndRenderArticle(markdown: string): ArticleCheck {
    const reasons: string[] = [];
    let h1Count = 0;
    let rawHtmlCount = 0;
    const badLinks = new Set<string>();

    // Jawne opcje — inaczej ten lekser czyta z procesowo-globalnego marked.defaults, który
    // może zdesynchronizować się z opcjami renderera w markdownToSafeHtml (marked.parse niżej).
    walk(marked.lexer(markdown, { gfm: true }), (token) => {
        if (token.type === 'heading' && (token as Tokens.Heading).depth === 1) h1Count += 1;
        if (token.type === 'html') rawHtmlCount += 1;
        if (token.type === 'link') {
            const href = (token as Tokens.Link).href;
            if (!isAllowedHref(href)) badLinks.add(href);
        }
    });

    if (h1Count > 0) reasons.push('contains_h1');
    if (rawHtmlCount > 0) reasons.push('raw_html');
    for (const href of badLinks) reasons.push(`insecure_link:${href}`);

    const html = markdownToSafeHtml(markdown);
    const wordCount = countWords(html);
    if (html.trim() === '') reasons.push('empty_after_sanitize');
    else if (wordCount < MIN_WORDS) reasons.push(`too_short:${wordCount}`);

    return { ok: reasons.length === 0, reasons, wordCount, html };
}

/** Zwraca powód odrzucenia okładki albo `null`, gdy jest poprawna (JPEG, 100 B – 2 MB). */
export function validateCover(buffer: Buffer): string | null {
    if (buffer.length < MIN_COVER_BYTES) return 'cover_too_small';
    if (buffer.length > MAX_COVER_BYTES) return 'cover_too_large';
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) return 'cover_not_jpeg';
    return null;
}

/** Walidacja obrazu śródtekstowego przed zapisaniem go w bazie. */
export function validateInlineImage(buffer: Buffer): string | null {
    if (buffer.length < MIN_INLINE_IMAGE_BYTES) return 'inline_image_too_small';
    if (buffer.length > MAX_INLINE_IMAGE_BYTES) return 'inline_image_too_large';
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) return 'inline_image_not_jpeg';
    return null;
}

export interface TrustedArticleFigure {
    id: string;
    placementAfterHeading: string;
    url: string;
    altText: string;
    caption: string;
    width: number;
    height: number;
}

function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Osadza wyłącznie zaufane obrazy zapisane przez serwer. Markery są zwykłym tekstem
 * podczas walidacji Markdownu, a dopiero po sanityzacji zamieniają się w figure/img.
 */
export function checkAndRenderArticleWithFigures(markdown: string, figures: TrustedArticleFigure[]): ArticleCheck {
    let markedMarkdown = markdown;
    const markers: Array<{ marker: string; figure: TrustedArticleFigure }> = [];
    const missing: string[] = [];

    for (const [index, figure] of figures.entries()) {
        const lines = markedMarkdown.split('\n');
        const headingIndex = lines.findIndex((line) => {
            const match = line.match(/^#{2,3}\s+(.+?)\s*#*\s*$/);
            return match?.[1]?.trim() === figure.placementAfterHeading.trim();
        });
        if (headingIndex < 0) {
            missing.push(`figure_heading_not_found:${figure.id}`);
            continue;
        }

        const marker = `LUXAURA_VISUAL_${index}_${figure.id.replace(/[^a-z0-9_-]/gi, '_')}`;
        lines.splice(headingIndex + 1, 0, '', marker, '');
        markedMarkdown = lines.join('\n');
        markers.push({ marker, figure });
    }

    const checked = checkAndRenderArticle(markedMarkdown);
    let html = checked.html;
    for (const { marker, figure } of markers) {
        const safeUrl = escapeAttribute(figure.url);
        const safeAlt = escapeAttribute(figure.altText);
        const safeCaption = escapeText(figure.caption);
        const rendered = `<figure class="article-visual"><img src="${safeUrl}" alt="${safeAlt}" width="${figure.width}" height="${figure.height}" loading="lazy" decoding="async"><figcaption>${safeCaption}</figcaption></figure>`;
        html = html.replace(`<p>${marker}</p>`, rendered);
    }

    const reasons = [...checked.reasons, ...missing];
    return { ...checked, ok: reasons.length === 0, reasons, html, wordCount: countWords(html) };
}
