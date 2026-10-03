// Etap 6, część 3 (spec 4.2): redakcja językowa z niezmiennikami. Wynik jest przyjmowany
// TYLKO, gdy niezmienniki się zgadzają (identyczne URL-e, multizbiór liczb/dat, liczba
// i kolejność nagłówków, długość ±10%) — inaczej używana jest wersja sprzed redakcji.
// Krok istnieje, bo polszczyzna DeepSeek bywa słabsza niż modeli klasy Claude.
import { runStep, type ProviderConfig } from '../llm/provider';
import { extractHeadings, extractLinks } from '../quality/parse';

const MAX_LENGTH_DELTA_RATIO = 0.1;

export interface PolishInvariantCheck {
    ok: boolean;
    reasons: string[];
}

function extractSortedUrls(markdown: string): string[] {
    return extractLinks(markdown)
        .map((l) => l.url)
        .sort();
}

function extractSortedNumbers(markdown: string): string[] {
    return (markdown.match(/\d+([.,]\d+)?/g) ?? []).sort();
}

/** Sprawdza, czy redakcja nie zmieniła faktów/struktury — tylko język. */
export function checkPolishInvariants(before: string, after: string): PolishInvariantCheck {
    const reasons: string[] = [];

    const urlsBefore = extractSortedUrls(before);
    const urlsAfter = extractSortedUrls(after);
    if (JSON.stringify(urlsBefore) !== JSON.stringify(urlsAfter)) reasons.push('zbiór URL-i się zmienił');

    const numbersBefore = extractSortedNumbers(before);
    const numbersAfter = extractSortedNumbers(after);
    if (JSON.stringify(numbersBefore) !== JSON.stringify(numbersAfter)) reasons.push('multizbiór liczb/dat się zmienił');

    const headingsBefore = extractHeadings(before);
    const headingsAfter = extractHeadings(after);
    const headingsMatch =
        headingsBefore.length === headingsAfter.length && headingsBefore.every((h, i) => h.level === headingsAfter[i]?.level);
    if (!headingsMatch) reasons.push('liczba lub kolejność nagłówków się zmieniła');

    if (before.length > 0) {
        const delta = Math.abs(after.length - before.length) / before.length;
        if (delta > MAX_LENGTH_DELTA_RATIO) reasons.push(`długość zmieniła się o ${(delta * 100).toFixed(0)}% (limit 10%)`);
    }

    return { ok: reasons.length === 0, reasons };
}

export interface PolishResult {
    contentMarkdown: string;
    applied: boolean;
    reasons: string[];
}

export async function polishArticle(contentMarkdown: string, providerConfig: ProviderConfig): Promise<PolishResult> {
    const prompt = `Copy-edit the English article below for grammar, syntax, punctuation, clarity and a confident expert tone. Do NOT change facts, numbers, dates, URLs, headings, structure or approximate length. Return the COMPLETE Markdown article with no commentary before or after it.

${contentMarkdown}`;

    const outcome = await runStep(
        {
            kind: 'markdown',
            step: 'polish',
            systemPrompt: 'You are a meticulous English-language copy editor. Improve language only, never facts or structure.',
            prompt,
            deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.3, maxTokens: 8000 },
        },
        providerConfig,
    );

    const polished = outcome.text.trim();
    const check = checkPolishInvariants(contentMarkdown, polished);
    if (!check.ok) return { contentMarkdown, applied: false, reasons: check.reasons };
    return { contentMarkdown: polished, applied: true, reasons: [] };
}
