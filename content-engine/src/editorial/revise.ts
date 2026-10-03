// Etap 6, część 2 (spec 4.2): jedna rewizja z listą uwag krytyka, jeśli znalazł blocker
// lub ≥3 major. Zwraca artykuł od nowa (tytuł może się nieznacznie zmienić).
import { runStep, type ProviderConfig } from '../llm/provider';
import type { CritiqueIssue, FactsPackage, VerifiedSource } from './types';
import { buildFactsText, buildSourcesGroundTruth, splitTitleAndBody, type WriteResult } from './write';

export interface PrunedArticle {
    contentMarkdown: string;
    removedParagraphs: number;
}

function compactWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

/**
 * Usuwa całe akapity zawierające dokładny cytat blockera. To deterministyczna obrona
 * przed modelem rewizji, który w live runach potrafił zachować tę samą niepopartą tezę
 * mimo jawnego polecenia jej usunięcia.
 */
export function pruneBlockerParagraphs(contentMarkdown: string, issues: CritiqueIssue[]): PrunedArticle {
    const blockerQuotes = issues
        .filter((issue) => issue.severity === 'blocker')
        .map((issue) => compactWhitespace(issue.quote))
        .filter((quote) => quote.length > 0);
    if (blockerQuotes.length === 0) return { contentMarkdown, removedParagraphs: 0 };

    let removedParagraphs = 0;
    const paragraphs = contentMarkdown.split(/\r?\n\s*\r?\n/);
    const kept = paragraphs.filter((paragraph) => {
        const compact = compactWhitespace(paragraph);
        const containsBlocker = blockerQuotes.some((quote) => compact.includes(quote));
        if (containsBlocker) removedParagraphs += 1;
        return !containsBlocker;
    });

    return { contentMarkdown: kept.join('\n\n').trim(), removedParagraphs };
}

export async function reviseArticle(
    title: string,
    contentMarkdown: string,
    issues: CritiqueIssue[],
    factsPackage: FactsPackage,
    verifiedSources: VerifiedSource[],
    providerConfig: ProviderConfig,
): Promise<WriteResult> {
    const issuesText = issues.map((i) => `- [${i.severity}] „${i.quote}” — ${i.problem} → ${i.fix}`).join('\n');

    const prompt = `Popraw poniższy artykuł zgodnie z uwagami krytyka. Zachowaj strukturę
i styl tam, gdzie nie koliduje to z rzetelnością — nie pisz od zera, popraw konkretne
miejsca. Dokładność faktów ma pierwszeństwo przed zachowaniem długości. Zwróć CAŁY
poprawiony artykuł, zaczynając od "# <tytuł>" (możesz nieznacznie doprecyzować tytuł,
jeśli krytyk wskazał niezgodność z treścią).

WAŻNE: jeśli uwaga dotyczy twierdzenia, które nie ma pokrycia w faktach (zmyślona nazwa,
fałszywa atrybucja źródłu, domysł podany jako pewnik) — nie próbuj go "naprawić" innym
sformułowaniem, które wciąż zawiera tę samą niepopartą treść. W takim wypadku CAŁKOWICIE
USUŃ to zdanie/twierdzenie (albo zastąp czymś ogólnym, co faktycznie wynika ze źródeł) —
krótszy w pełni poparty artykuł jest lepszy niż taki, który wciąż zawiera zamaskowaną
konfabulację i dostanie tę samą uwagę ponownie.

Każdy blocker MUSI zniknąć w tej rewizji. Odszukaj dokładny cytat wskazany w uwadze i,
gdy dotyczy niepopartego faktu, usuń całe zdanie zawierające tę tezę. Nie dodawaj w
zamian nowych faktów ani URL-i. Używaj wyłącznie informacji i dokładnych adresów URL z
poniższego gruntu prawdy.

Kod usunął już z artykułu akapity zawierające dokładne cytaty blockerów, gdy udało się
je jednoznacznie odnaleźć. NIE przywracaj usuniętych tez ani ich parafraz. Możesz
połączyć sąsiednie akapity, żeby zachować płynność tekstu.

## Uwagi krytyka
${issuesText}

## Pakiet faktów (jedyne dozwolone fakty)
${buildFactsText(factsPackage)}

## Fragmenty źródeł (grunt prawdy)
${buildSourcesGroundTruth(verifiedSources)}

## Artykuł do poprawy
# ${title}

${contentMarkdown}`;

    const outcome = await runStep(
        {
            kind: 'markdown',
            step: 'revise',
            systemPrompt: 'Jesteś redaktorem poprawiającym artykuł zgodnie z uwagami krytyka, bez pisania go od nowa.',
            prompt,
            deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.5, maxTokens: 8000 },
        },
        providerConfig,
    );

    return splitTitleAndBody(outcome.text);
}
