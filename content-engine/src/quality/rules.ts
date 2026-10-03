// Reguły bramki jakości (spec 4.2, Etap 7) — każda czysta funkcja (artykuł, kontekst) -> findings.
import { canonicalizeUrl, titleSimilarity } from '../harvest/normalize';
import { analyzeLanguage } from './language';
import { countWords, extractHeadings, extractLinks } from './parse';

export interface DraftArticle {
    title: string;
    seoTitle: string;
    seoDescription: string;
    excerpt: string;
    contentMarkdown: string;
    imageBrief: { headline: string; kicker: string; chips: string[] };
}

export interface SourceCheck {
    url: string;
    /** Status HTTP z ostatniej weryfikacji (Etap 4, verify-sources); `null` = nie sprawdzono. */
    httpStatus: number | null;
}

export interface QualityContext {
    now: Date;
    recentTitles: string[];
    usedSourceUrls: string[];
    internalLinkAllowlist: string[];
    realArticleSlugs: string[];
    sourceChecks: SourceCheck[];
}

export interface RuleFinding {
    severity: 'error' | 'warn';
    code: string;
    message: string;
}

type Rule = (article: DraftArticle, context: QualityContext) => RuleFinding[];

function hostnameOf(url: string): string | null {
    try {
        return new URL(url).hostname.replace(/^www\./i, '');
    } catch {
        return null;
    }
}

const SITE_HOSTNAMES = new Set(['luxauracare.com']);

function isExternalHttpsLink(url: string): boolean {
    if (!url.startsWith('https://')) return false;
    const host = hostnameOf(url);
    return host !== null && !SITE_HOSTNAMES.has(host);
}

export interface RepeatedSectionSource {
    heading: string;
    url: string;
    count: number;
}

export interface ThinSection {
    heading: string;
    wordCount: number;
}

const DANGLING_TITLE_END = /\b(?:and|or|of|to|for|from|with|by|in|on|at|as|the|a|an|but|without)$/iu;

/**
 * Wykrywa nagłówki, pod którymi nie ma realnej treści. Cytat lub sama lista źródeł
 * nie zastępują wyjaśnienia redakcyjnego, dlatego wiersze blockquote są pomijane.
 */
export function findThinSections(markdown: string, minimumWords = 25): ThinSection[] {
    return markdown
        .split(/(?=^##\s+)/gm)
        .map((section) => {
            const heading = section.match(/^##\s+(.+)$/m)?.[1]?.trim();
            if (!heading || /^Sources$/iu.test(heading)) return null;

            const body = section
                .replace(/^##\s+.+$/m, '')
                .split(/\r?\n/u)
                .filter((line) => !/^\s*>/u.test(line))
                .join('\n');
            return { heading, wordCount: countWords(body) };
        })
        .filter((section): section is ThinSection => section !== null && section.wordCount < minimumWords);
}

/**
 * Wykrywa ten sam zewnętrzny URL cytowany kilka razy w jednej sekcji H2.
 * Powtórzenie URL-u w innej sekcji jest dopuszczalne, bo może podpierać odległy
 * fragment tekstu. W obrębie jednego bloku redakcyjnego wystarcza jedna nota źródłowa.
 */
export function findRepeatedExternalLinksBySection(markdown: string): RepeatedSectionSource[] {
    const sections = markdown.split(/(?=^##\s+)/gm);
    const repeated: RepeatedSectionSource[] = [];

    for (const section of sections) {
        const heading = section.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? '(wprowadzenie)';
        const counts = new Map<string, { url: string; count: number }>();

        for (const link of extractLinks(section).filter((item) => isExternalHttpsLink(item.url))) {
            const canonical = canonicalizeUrl(link.url);
            const current = counts.get(canonical);
            counts.set(canonical, { url: current?.url ?? link.url, count: (current?.count ?? 0) + 1 });
        }

        for (const item of counts.values()) {
            if (item.count > 1) repeated.push({ heading, url: item.url, count: item.count });
        }
    }

    return repeated;
}

const checkWordCount: Rule = (article) => {
    const n = countWords(article.contentMarkdown);
    if (n < 1100) return [{ severity: 'error', code: 'word_count_too_low', message: `Liczba słów: ${n} (wymagane 1100–2000)` }];
    if (n > 2000) return [{ severity: 'error', code: 'word_count_too_high', message: `Liczba słów: ${n} (wymagane 1100–2000)` }];
    return [];
};

const checkHeadings: Rule = (article) => {
    const findings: RuleFinding[] = [];
    const headings = extractHeadings(article.contentMarkdown);
    const h1Count = headings.filter((h) => h.level === 1).length;
    const h2Count = headings.filter((h) => h.level === 2).length;

    if (h1Count > 0) findings.push({ severity: 'error', code: 'contains_h1', message: `Znaleziono ${h1Count} nagłówków H1 — tytuł renderuje strona` });
    if (h2Count < 4 || h2Count > 8) findings.push({ severity: 'error', code: 'h2_count_out_of_range', message: `Liczba H2: ${h2Count} (wymagane 4–8)` });

    const slugs = headings.map((h) => h.slug);
    const duplicates = [...new Set(slugs.filter((slug, i) => slugs.indexOf(slug) !== i))];
    if (duplicates.length > 0) findings.push({ severity: 'error', code: 'duplicate_heading_slugs', message: `Zduplikowane slugi nagłówków: ${duplicates.join(', ')}` });

    for (const section of findThinSections(article.contentMarkdown)) {
        findings.push({
            severity: 'error',
            code: 'section_too_thin',
            message: `Sekcja „${section.heading}” ma tylko ${section.wordCount} słów realnej treści (wymagane ≥25)`,
        });
    }

    const summary = article.contentMarkdown
        .split(/(?=^##\s+)/gm)
        .find((section) => /^##\s+In brief\s*$/imu.test(section));
    const summaryPoints = summary?.match(/^\s*[-*]\s+\S/gmu)?.length ?? 0;
    if (summaryPoints !== 3) {
        findings.push({ severity: 'error', code: 'summary_points_count', message: `The “In brief” section has ${summaryPoints} bullets (exactly 3 required)` });
    }

    if (/\bSecondly\b/iu.test(article.contentMarkdown) && !/\bFirstly\b/iu.test(article.contentMarkdown)) {
        findings.push({ severity: 'error', code: 'orphaned_sequence', message: 'The article uses “Secondly” without “Firstly”' });
    }

    return findings;
};

const checkSources: Rule = (article, context) => {
    const findings: RuleFinding[] = [];
    const links = extractLinks(article.contentMarkdown);
    const nonHttpsExternal = links.filter((l) => !l.url.startsWith('/') && !l.url.startsWith('https://'));
    if (nonHttpsExternal.length > 0) findings.push({ severity: 'error', code: 'non_https_link', message: `Link inny niż https: ${nonHttpsExternal[0].url}` });

    const sourceLinks = links.filter((l) => isExternalHttpsLink(l.url));
    const uniqueSourceUrls = new Set(sourceLinks.map((link) => canonicalizeUrl(link.url)));
    if (uniqueSourceUrls.size < 2) {
        findings.push({ severity: 'error', code: 'too_few_sources', message: `Unikalnych linków źródłowych: ${uniqueSourceUrls.size} (wymagane ≥2)` });
    }

    for (const repeated of findRepeatedExternalLinksBySection(article.contentMarkdown)) {
        findings.push({
            severity: 'error',
            code: 'repeated_source_link_in_section',
            message: `Źródło ${repeated.url} występuje ${repeated.count} razy w sekcji „${repeated.heading}” — zgrupuj cytowania w jedną notę źródłową`,
        });
    }

    const domains = new Set(sourceLinks.map((l) => hostnameOf(l.url)).filter((h): h is string => h !== null));
    if (domains.size < 2) findings.push({ severity: 'error', code: 'too_few_source_domains', message: `Domen źródłowych: ${domains.size} (wymagane ≥2)` });

    const checksByCanonicalUrl = new Map(context.sourceChecks.map((check) => [canonicalizeUrl(check.url), check]));
    for (const link of sourceLinks) {
        const check = checksByCanonicalUrl.get(canonicalizeUrl(link.url));
        if (!check || check.httpStatus !== 200) {
            findings.push({ severity: 'error', code: 'source_not_verified_200', message: `Źródło ${link.url} nie zwróciło 200 przy ostatnim sprawdzeniu` });
        }
    }

    return findings;
};

export const checkInternalLinks: Rule = (article, context) => {
    const findings: RuleFinding[] = [];
    const links = extractLinks(article.contentMarkdown);
    const internalLinks = links.filter((l) => l.url.startsWith('/'));
    const productLinks = internalLinks.filter((link) => {
        const path = link.url.split('?')[0].split('#')[0];
        return context.internalLinkAllowlist.includes(path);
    });
    const distinctProductPaths = new Set(productLinks.map((link) => link.url.split('?')[0].split('#')[0]));

    if (productLinks.length < 4) {
        findings.push({ severity: 'error', code: 'too_few_product_links', message: `Linków do produktów: ${productLinks.length} (wymagane 4–6)` });
    }
    if (productLinks.length > 6) {
        findings.push({ severity: 'error', code: 'too_many_product_links', message: `Linków do produktów: ${productLinks.length} (maksymalnie 6)` });
    }
    if (distinctProductPaths.size < 3) {
        findings.push({ severity: 'error', code: 'too_few_distinct_products', message: `Różnych kart produktów: ${distinctProductPaths.size} (wymagane ≥3)` });
    }

    for (const link of internalLinks) {
        const path = link.url.split('?')[0].split('#')[0];
        const isAllowedService = context.internalLinkAllowlist.includes(path);
        const isRealArticle = context.realArticleSlugs.some((slug) => path === `/blog/${slug}`);
        if (!isAllowedService && !isRealArticle) {
            findings.push({ severity: 'error', code: 'invalid_internal_link', message: `Link wewnętrzny ${link.url} spoza allowlisty i spoza realnych artykułów` });
        }
    }

    return findings;
};

const checkTitleLengths: Rule = (article) => {
    const findings: RuleFinding[] = [];
    if (article.title.length < 30 || article.title.length > 70) {
        findings.push({ severity: 'error', code: 'title_length', message: `Tytuł: ${article.title.length} znaków (wymagane 30–70)` });
    }
    if (DANGLING_TITLE_END.test(article.title.trim())) {
        findings.push({ severity: 'error', code: 'title_dangling_connector', message: 'Tytuł kończy się urwanym spójnikiem lub przyimkiem' });
    }
    if (article.seoTitle.length > 60) {
        findings.push({ severity: 'error', code: 'seo_title_too_long', message: `seoTitle: ${article.seoTitle.length} znaków (max 60)` });
    }
    return findings;
};

const checkDescriptionLengths: Rule = (article) => {
    const findings: RuleFinding[] = [];
    if (article.seoDescription.length < 120 || article.seoDescription.length > 160) {
        findings.push({ severity: 'error', code: 'seo_description_length', message: `seoDescription: ${article.seoDescription.length} znaków (wymagane 120–160)` });
    }
    if (article.excerpt.length < 100 || article.excerpt.length > 200) {
        findings.push({ severity: 'error', code: 'excerpt_length', message: `excerpt: ${article.excerpt.length} znaków (wymagane 100–200)` });
    }
    return findings;
};

const checkLanguage: Rule = (article) => {
    const result = analyzeLanguage(article.contentMarkdown);
    if (!result.isEnglish) {
        return [{ severity: 'error', code: 'not_english', message: `Language heuristic: article does not look English (function words: ${(result.englishFunctionRatio * 100).toFixed(1)}%)` }];
    }
    return [];
};

const BANNED_PHRASES: RegExp[] = [/in today'?s rapidly (?:changing|evolving) world/i, /as an ai language model/i, /this changes everything/i];
const PLACEHOLDER_PATTERNS: RegExp[] = [/\bTODO\b/, /\{\{/, /\[…\]/, /\[\.\.\.\]/, /^here is (?:the|an) article/im];

const checkBannedPhrasesAndPlaceholders: Rule = (article) => {
    const findings: RuleFinding[] = [];
    for (const pattern of BANNED_PHRASES) {
        if (pattern.test(article.contentMarkdown)) findings.push({ severity: 'error', code: 'banned_phrase', message: `Zakazana fraza: ${pattern}` });
    }
    for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(article.contentMarkdown)) findings.push({ severity: 'error', code: 'placeholder_found', message: `Placeholder: ${pattern}` });
    }
    return findings;
};

const checkUniqueness: Rule = (article, context) => {
    const findings: RuleFinding[] = [];
    const tooSimilar = context.recentTitles.find((title) => titleSimilarity(article.title, title) > 0.5);
    if (tooSimilar) findings.push({ severity: 'error', code: 'title_too_similar_to_history', message: `Tytuł zbyt podobny do: „${tooSimilar}”` });

    const usedUrls = new Set(context.usedSourceUrls.map(canonicalizeUrl));
    const links = extractLinks(article.contentMarkdown).filter((l) => l.url.startsWith('https://'));
    for (const link of links) {
        if (usedUrls.has(canonicalizeUrl(link.url))) findings.push({ severity: 'error', code: 'source_already_used', message: `Źródło już użyte wcześniej: ${link.url}` });
    }

    return findings;
};

function parseFlexibleDate(raw: string): Date | null {
    let match = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) return new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12));
    match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
    return null;
}

const checkConsistency: Rule = (article, context) => {
    const findings: RuleFinding[] = [];

    const stanNaMatch = article.contentMarkdown.match(/Current as of[:\s]+(\d{4}-\d{2}-\d{2})/i);
    if (!stanNaMatch) {
        findings.push({ severity: 'error', code: 'missing_current_as_of', message: 'Missing “Current as of <YYYY-MM-DD>” marker' });
    } else {
        const parsed = parseFlexibleDate(stanNaMatch[1]);
        if (!parsed) {
            findings.push({ severity: 'error', code: 'invalid_current_as_of_date', message: `Cannot parse “Current as of ${stanNaMatch[1]}”` });
        } else {
            const diffDays = Math.abs(context.now.getTime() - parsed.getTime()) / (24 * 60 * 60 * 1000);
            if (diffDays > 1) findings.push({ severity: 'error', code: 'current_as_of_too_old', message: `“Current as of” differs from the scheduled date by ${diffDays.toFixed(1)} days` });
        }
    }

    // Surowy URL w treści (nie opakowany w składnię linku Markdown [tekst](url)).
    const bareUrlPattern = /(?<!\]\()https?:\/\/[^\s)]+/g;
    const bareUrls = article.contentMarkdown.match(bareUrlPattern) ?? [];
    if (bareUrls.length > 0) findings.push({ severity: 'error', code: 'raw_url_in_content', message: `Surowy URL w treści: ${bareUrls[0]}` });

    return findings;
};

const checkImageBrief: Rule = (article) => {
    const findings: RuleFinding[] = [];
    const headlineWords = article.imageBrief.headline.trim().split(/\s+/).filter(Boolean).length;
    if (headlineWords > 8) findings.push({ severity: 'error', code: 'image_headline_too_long', message: `Nagłówek grafiki: ${headlineWords} słów (max 8)` });

    if (article.imageBrief.chips.length !== 3) {
        findings.push({ severity: 'error', code: 'image_chips_count', message: `Liczba chipów: ${article.imageBrief.chips.length} (wymagane 3)` });
    }
    article.imageBrief.chips.forEach((chip, index) => {
        if (chip.length > 22) findings.push({ severity: 'error', code: 'image_chip_too_long', message: `Chip #${index + 1}: ${chip.length} znaków (max 22)` });
    });

    return findings;
};

export const QUALITY_RULES: Rule[] = [
    checkWordCount,
    checkHeadings,
    checkSources,
    checkInternalLinks,
    checkTitleLengths,
    checkDescriptionLengths,
    checkLanguage,
    checkBannedPhrasesAndPlaceholders,
    checkUniqueness,
    checkConsistency,
    checkImageBrief,
];
