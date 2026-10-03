// Etap 5 (spec 4.2): pisanie artykułu. Wyjście: czysty Markdown, pierwsza linia `# Tytuł`
// (silnik ją wycina jako `title`; w treści dalej nie ma H1).
import { runStep, type ProviderConfig } from '../llm/provider';
import type { ArticleBrief, FactsPackage, TitleVariant, VerifiedSource } from './types';

export interface WriteInput {
    brief: ArticleBrief;
    factsPackage: FactsPackage;
    verifiedSources: VerifiedSource[];
    currentDate: string;
    titleVariants: TitleVariant[];
    internalLinkAllowlist: string[];
    seeAlsoCandidates: { title: string; slug: string }[];
    styleGuide: string;
}

export interface WriteResult {
    title: string;
    contentMarkdown: string;
}

export function buildFactsText(factsPackage: FactsPackage): string {
    return factsPackage.facts
        .map((f) => `- [${f.id}] ${f.statement} (źródło: [${f.sourceTitle || f.sourceUrl}](${f.sourceUrl})${f.publishedAt ? `, ${f.publishedAt}` : ''})`)
        .join('\n');
}

export function buildSourcesGroundTruth(verifiedSources: VerifiedSource[]): string {
    return verifiedSources
        .filter((s) => s.excerpt)
        .map((s) => `### ${s.title ?? s.url}\nURL: ${s.url}\n${s.excerpt}`)
        .join('\n\n');
}

/** Wyciąga `title` z pierwszej linii `# Tytuł` i resztę jako `contentMarkdown` (bez H1). */
export function splitTitleAndBody(rawMarkdown: string): WriteResult {
    let markdown = rawMarkdown.trim();
    const fenced = /^```(?:markdown|md)?[ \t]*\r?\n/i.test(markdown);
    if (fenced) {
        markdown = markdown
            .replace(/^```(?:markdown|md)?[ \t]*\r?\n/i, '')
            .replace(/\r?\n```[ \t]*$/, '')
            .trim();
    }

    // Modele czasem poprzedzają żądany Markdown pojedynczym zdaniem mimo jawnego zakazu.
    // Pierwszy H1 pozostaje jednoznaczną granicą artykułu, więc bezpiecznie odrzucamy preambułę.
    const match = markdown.match(/(?:^|\r?\n)#\s+([^\r\n]+)\r?\n([\s\S]*)$/);
    if (!match) throw new Error('write: odpowiedź nie zawiera nagłówka "# Tytuł" rozpoczynającego artykuł');
    return { title: match[1].trim(), contentMarkdown: match[2].trim() };
}

export async function writeArticle(input: WriteInput, providerConfig: ProviderConfig): Promise<WriteResult> {
    const prompt = `${input.styleGuide}

LANGUAGE REQUIREMENT: write the complete title and article in polished, idiomatic English. Do not produce Polish prose.

## Brief
Temat: ${input.brief.topic}
Kąt: ${input.brief.angle}
Format: ${input.brief.format}
Poziom: ${input.brief.level}
Scheduled date: ${input.currentDate}. In the “In brief” section write EXACTLY
“Current as of ${input.currentDate}.” Do not substitute a source publication date.

## Warianty tytułu do wyboru/dopracowania (wybierz najlepszy albo dopracuj jeden z nich)
${input.titleVariants.map((v) => `- ${v.title}`).join('\n')}

## Pakiet faktów (JEDYNE dozwolone źródło wiedzy)
${buildFactsText(input.factsPackage)}

KRYTYCZNA ZASADA CYTOWANIA: każda liczba, statystyka, procent i konkretne twierdzenie
w artykule MUSI być powiązane z linkiem markdown do źródła. Grupuj jednak sąsiadujące
twierdzenia oparte na tym samym źródle i cytuj je RAZ, zamiast wstawiać identyczny
odnośnik po każdym akapicie. Ten sam dokładny URL może wystąpić najwyżej raz w obrębie
jednej sekcji H2. Gdy całe 2–4 akapity opierają się na jednym dokumencie, zakończ blok
jedną notą w formacie:

> **Section source:** [precise document name](https://...).

Nie wystarczy wymienić źródło dopiero w sekcji "Sources" na końcu — czytelnik musi
jednoznacznie wiedzieć, który blok tekstu ono potwierdza. Każdy URL umieść w sekcji
"Sources" tylko raz. Jeśli dwa źródła podają różne liczby na ten sam temat, przywołaj
obie i zaznacz rozbieżność, zamiast wybierać jedną bez komentarza.

ZAKAZ KONFABULACJI: link obok twierdzenia nie wystarczy, jeśli źródło pod tym linkiem
faktycznie NIE mówi tego, co mu przypisujesz — to fałszywa atrybucja, gorsza niż brak
cytatu. Nie wolno: (1) dopisywać konkretnych nazw własnych (firm analitycznych, nazw
protokołów/funkcji, osób) do twierdzenia, jeśli ta nazwa nie pada wprost we fragmencie
źródła obok tego twierdzenia; (2) formułować twierdzeń o braku czegoś („bez zapowiedzi",
„zaskoczenie rynku", „po raz pierwszy") na podstawie tego, że źródła tego nie wspominają —
brak wzmianki to nie dowód; (3) wypełniać luki w faktach prawdopodobnie brzmiącymi
szczegółami (np. że stare produkty „zachowują dotychczasowe ceny", że coś jest
kompatybilne wstecznie), jeśli to nie jest wprost w pakiecie faktów lub fragmentach
źródeł. Gdy fakt jest niepełny — napisz ogólniej albo pomiń zdanie. Lepszy krótszy,
w pełni poparty akapit niż efektowny, częściowo zmyślony.

Możesz dodawać własną analizę skutków biznesowych i praktyczne rekomendacje, ale oznaczaj
je językowo jako analizę lub możliwość (np. „to może oznaczać”, „w praktyce warto”).
Analiza nie może wprowadzać nowych liczb, dat, nazw własnych ani twierdzeń o rynku,
których nie ma w pakiecie faktów.

Używaj wyłącznie DOKŁADNYCH zewnętrznych URL-i podanych w pakiecie faktów. Nie dopisuj
innych źródeł i nie zmieniaj tych adresów (także przez dodawanie/usuwanie parametrów).

Tło: ${input.factsPackage.background}

## Fragmenty źródeł (grunt prawdy — sprawdzaj się z tym, nie tylko z powyższym streszczeniem)
${buildSourcesGroundTruth(input.verifiedSources)}

## Live Lux Aura Care product paths
Use 4–6 contextual product links and at least 3 distinct paths. Derive a readable
product name from the path, but do not invent specifications, ingredients, price,
availability or results. Link only where the product genuinely supports the step.
${input.internalLinkAllowlist.join('\n')}

## Wcześniejsze artykuły (maks. 2 linki „Zobacz też”, tylko jeśli naprawdę pasują)
${input.seeAlsoCandidates.map((a) => `- [${a.title}](/blog/${a.slug})`).join('\n') || '(brak)'}

Napisz artykuł zgodnie ze strukturą i zasadami powyżej. Tytuł musi mieć 30–70 znaków.
W treści MUSZĄ znaleźć się 4–6 naturalnych linków do produktów, obejmujących minimum
3 różne dozwolone ścieżki produktowe. Linki „Related reading” są dodatkiem i nie liczą
się do tego minimum. Zwróć WYŁĄCZNIE Markdown,
zaczynając od "# <finalny tytuł>", bez żadnego komentarza przed czy po.`;

    const outcome = await runStep(
        {
            kind: 'markdown',
            step: 'write',
            systemPrompt: 'You are a senior health and beauty editor for Lux Aura Care. Write evidence-led, medically cautious, practical English content that connects readers only to genuinely relevant products.',
            prompt,
            deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.3, maxTokens: 8000 },
        },
        providerConfig,
    );

    return splitTitleAndBody(outcome.text);
}
