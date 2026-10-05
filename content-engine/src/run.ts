// Orkiestrator silnika artykułów uruchamianego lokalnie trzy razy tygodniowo przez
// harmonogram Codex. GitHub Actions pozostaje wyłącznie ręcznym torem awaryjnym.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadEnv, type EngineEnv } from './env';
import { editorialRotationNumber, isoWeekKey, scheduledRunKey } from './week';
import { SiteClient, type PublishArticlePayload, type PublishPayload } from './site-client';
import { sendTelegramNotification, escapeHtml } from './notify';
import { collectCandidates } from './harvest/collect';
import type { Candidate } from './harvest/types';
import { selectTopic } from './editorial/select';
import { research } from './editorial/research';
import { verifySources } from './editorial/verify-sources';
import { writeArticle } from './editorial/write';
import { generateMeta } from './editorial/meta';
import { generateVisualPlan } from './editorial/visual-plan';
import { translateArticleToPolish } from './editorial/translate';
import { critiqueArticle } from './editorial/critique';
import { pruneBlockerParagraphs, reviseArticle } from './editorial/revise';
import { polishArticle } from './editorial/polish';
import { ensureValidTitle } from './editorial/title';
import { runQualityGate } from './quality/gate';
import { countWords } from './quality/parse';
import { repairHeadingStructure } from './quality/heading-structure';
import {
    buildGenerationPrompt,
    externalVisualInputFilename,
    generateArticleVisuals,
    generatedVisualFilename,
    type GeneratedArticleVisual,
} from './image/generate-article-visuals';
import type { PreparedArticleRun, VisualPromptManifest } from './prepared-run';
import { PRODUCT_LINK_OPTIONS, SERVICE_PATHS } from '../config/services';
import type { CostBudget, ProviderConfig } from './llm/provider';
import type { ArticleBrief, ArticleFormat, ArticleLevel, ArticleMeta, TopicOption, VerifiedSource, TitleVariant } from './editorial/types';
import { canonicalizeUrl } from './harvest/normalize';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HARD_COST_CAP_USD = 1.0;
const OUT_DIR = join(process.cwd(), 'out');

class StageError extends Error {
    constructor(readonly stage: string, message: string) {
        super(message);
        this.name = 'StageError';
    }
}

interface TopicAttemptResult {
    article: PublishArticlePayload;
    verifiedSources: VerifiedSource[];
    meta: ArticleMeta;
}

interface RunContext {
    recentTitles: string[];
    usedSourceUrls: string[];
    realArticleSlugs: string[];
    seeAlsoCandidates: { title: string; slug: string }[];
}

function ensureCurrentDateMarker(contentMarkdown: string, currentDate: string): string {
    const summaryHeading = /^##\s+In brief\s*$/im;
    if (summaryHeading.test(contentMarkdown)) {
        if (/Current as of[:\s]+\d{4}-\d{2}-\d{2}/i.test(contentMarkdown)) return contentMarkdown;
        return contentMarkdown.replace(summaryHeading, (heading) => `${heading}\n\nCurrent as of ${currentDate}.`);
    }

    return `## In brief\n\nCurrent as of ${currentDate}.\n\n${contentMarkdown}`;
}

function normalizeSummaryPoint(value: string): string {
    return value
        .replace(/^\s*[-*]\s+/u, '')
        .replace(/^Current as of[:\s]+\d{4}-\d{2}-\d{2}\.?\s*/iu, '')
        .trim();
}

/**
 * Model revisions sometimes turn the required three bullets into prose or remove
 * one bullet together with a rejected paragraph. Rebuild the summary only from
 * sentences already present in the article, so the repair is deterministic and
 * cannot introduce a new factual claim.
 */
export function normalizeInBrief(contentMarkdown: string, currentDate: string): string {
    const withMarker = ensureCurrentDateMarker(contentMarkdown, currentDate);
    const sectionPattern = /^##\s+In brief\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/imu;
    const match = withMarker.match(sectionPattern);
    if (!match) return withMarker;

    const summaryBody = match[1];
    const candidates: string[] = [];
    const addCandidate = (raw: string) => {
        const candidate = normalizeSummaryPoint(raw);
        if (candidate.split(/\s+/u).length < 3) return;
        const key = candidate.toLocaleLowerCase('en-US');
        if (!candidates.some((item) => item.toLocaleLowerCase('en-US') === key)) candidates.push(candidate);
    };

    for (const line of summaryBody.split(/\r?\n/u)) {
        if (/^\s*[-*]\s+\S/u.test(line)) addCandidate(line);
    }

    if (candidates.length < 3) {
        const summaryProse = summaryBody
            .split(/\r?\n/u)
            .filter((line) => !/^\s*(?:Current as of|>|[-*]\s)/iu.test(line))
            .join(' ');
        for (const sentence of summaryProse.split(/(?<=[.!?])\s+/u)) addCandidate(sentence);
    }

    if (candidates.length < 3) {
        const articleProse = withMarker
            .slice((match.index ?? 0) + match[0].length)
            .replace(/^#{2,3}\s+.+$/gmu, '')
            .split(/\r?\n/u)
            .filter((line) => !/^\s*(?:>|[-*]\s|\d+\.\s)/u.test(line))
            .join(' ');
        for (const sentence of articleProse.split(/(?<=[.!?])\s+/u)) {
            addCandidate(sentence);
            if (candidates.length >= 3) break;
        }
    }

    if (candidates.length < 3) return withMarker;
    const normalized = `## In brief\n\nCurrent as of ${currentDate}.\n\n${candidates
        .slice(0, 3)
        .map((point) => `- ${point}`)
        .join('\n')}`;
    return withMarker.replace(sectionPattern, `${normalized}\n\n`);
}

/** Keep one citation URL per H2 section while preserving the linked wording. */
export function dedupeExternalLinksBySection(contentMarkdown: string): string {
    return contentMarkdown
        .split(/(?=^##\s+)/gmu)
        .map((section) => {
            const seenSourceNotes = new Set<string>();
            const withoutDuplicateSourceNotes = section
                .split(/\r?\n\s*\r?\n/u)
                .filter((paragraph) => {
                    const sourceNote = paragraph.match(/^>\s*\*\*Section source:\*\*\s*\[[^\]]+\]\((https:\/\/[^)\s]+)\)\.?\s*$/iu);
                    if (!sourceNote) return true;
                    const canonical = canonicalizeUrl(sourceNote[1]);
                    if (seenSourceNotes.has(canonical)) return false;
                    seenSourceNotes.add(canonical);
                    return true;
                })
                .join('\n\n');

            const seenLinks = new Set<string>();
            return withoutDuplicateSourceNotes.replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/gu, (full, label: string, url: string) => {
                const canonical = canonicalizeUrl(url);
                if (!seenLinks.has(canonical)) {
                    seenLinks.add(canonical);
                    return full;
                }
                return label;
            });
        })
        .join('');
}

function finalizeArticleStructure(contentMarkdown: string, currentDate: string): string {
    const repairedBeforeSummary = repairHeadingStructure(contentMarkdown).contentMarkdown;
    const finalized = dedupeExternalLinksBySection(limitProductLinks(ensureProductLinks(normalizeInBrief(repairedBeforeSummary, currentDate))));
    return repairHeadingStructure(finalized).contentMarkdown;
}

/**
 * The writer occasionally repeats a contextual product link in several sections.
 * Keep at most six linked occurrences while prioritising the first occurrence of
 * each distinct product, so the required three-product spread survives the trim.
 */
export function limitProductLinks(contentMarkdown: string, maximum = 6): string {
    const allowedPaths = new Set(PRODUCT_LINK_OPTIONS.map((product) => product.path));
    const linkPattern = /\[([^\]]+)\]\((\/[^)\s]+)\)/gu;
    const occurrences: Array<{ index: number; path: string }> = [];

    for (const match of contentMarkdown.matchAll(linkPattern)) {
        const path = match[2].split(/[?#]/u)[0];
        if (allowedPaths.has(path)) occurrences.push({ index: occurrences.length, path });
    }
    if (occurrences.length <= maximum) return contentMarkdown;

    const keep = new Set<number>();
    const representedPaths = new Set<string>();
    for (const occurrence of occurrences) {
        if (keep.size >= maximum) break;
        if (representedPaths.has(occurrence.path)) continue;
        keep.add(occurrence.index);
        representedPaths.add(occurrence.path);
    }
    for (const occurrence of occurrences) {
        if (keep.size >= maximum) break;
        keep.add(occurrence.index);
    }

    let productLinkIndex = 0;
    return contentMarkdown.replace(linkPattern, (full, label: string, url: string) => {
        const path = url.split(/[?#]/u)[0];
        if (!allowedPaths.has(path)) return full;
        const currentIndex = productLinkIndex++;
        return keep.has(currentIndex) ? full : label;
    });
}

function ensureProductLinks(contentMarkdown: string): string {
    const linkedProducts = PRODUCT_LINK_OPTIONS.filter((product) =>
        new RegExp(`\\]\\(${product.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#][^)]*)?\\)`, 'i').test(contentMarkdown),
    );
    const totalProductLinks = PRODUCT_LINK_OPTIONS.reduce((total, product) => {
        const matches = contentMarkdown.match(new RegExp(`\\]\\(${product.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#][^)]*)?\\)`, 'gi'));
        return total + (matches?.length ?? 0);
    }, 0);
    if (totalProductLinks >= 4 && linkedProducts.length >= 3) return contentMarkdown;

    const searchable = contentMarkdown.toLowerCase();
    const ranked = PRODUCT_LINK_OPTIONS
        .filter((product) => !linkedProducts.some((linked) => linked.path === product.path))
        .map((product) => ({
            product,
            score: `${product.name} ${product.useWhen}`
                .toLowerCase()
                .split(/[^a-z0-9]+/u)
                .filter((word) => word.length >= 4 && searchable.includes(word)).length,
        }))
        .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'en'));

    const requiredCount = Math.max(4 - totalProductLinks, 3 - linkedProducts.length);
    const additions = ranked.slice(0, Math.min(requiredCount, 6 - totalProductLinks));
    if (additions.length === 0) return contentMarkdown;

    const productList = additions
        .map(({ product }) => `- Consider the [${product.name}](${product.path}) when the routine involves ${product.useWhen}. Check the product instructions and introduce one change at a time.`)
        .join('\n');
    const productSectionHeading = /^##\s+Lux Aura Care edit: products that fit this routine\s*$/im;
    if (productSectionHeading.test(contentMarkdown)) {
        return contentMarkdown.replace(
            /(^##\s+Lux Aura Care edit: products that fit this routine\s*$)([\s\S]*?)(?=^##\s+|(?![\s\S]))/imu,
            (_section, heading: string, body: string) => `${heading}${body.trimEnd()}\n${productList}\n\n`,
        );
    }

    const cta = `## Lux Aura Care edit: products that fit this routine\n\n${productList}`;
    const conclusionHeading = /^##\s+Conclusion\s*$/im;
    if (conclusionHeading.test(contentMarkdown)) return contentMarkdown.replace(conclusionHeading, `${cta}\n\n## Conclusion`);
    return `${contentMarkdown}\n\n${cta}`;
}

async function attemptTopic(
    topicOption: TopicOption,
    format: ArticleFormat,
    level: ArticleLevel,
    titleVariants: TitleVariant[],
    context: RunContext,
    providerConfig: ProviderConfig,
    styleGuide: string,
    now: Date,
): Promise<TopicAttemptResult> {
    const currentDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Warsaw',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(now);

    const researchedFactsPackage = await research(
        { topic: topicOption, angle: topicOption.angle },
        providerConfig,
        'Jesteś rzetelnym researcherem — cytujesz wyłącznie realne, znalezione źródła, nigdy nie zmyślasz URL-i.',
    );

    const sourceUrls = [...new Set(researchedFactsPackage.facts.map((f) => f.sourceUrl))];
    const verifiedSources = await verifySources(sourceUrls);
    const okSources = verifiedSources.filter((s) => s.httpStatus === 200);
    const domains = new Set(
        okSources.map((s) => {
            try {
                return new URL(s.url).hostname.replace(/^www\./i, '');
            } catch {
                return s.url;
            }
        }),
    );
    if (okSources.length < 2 || domains.size < 2) {
        throw new StageError('verify-sources', `Za mało zweryfikowanych źródeł: 200 OK=${okSources.length}, domen=${domains.size} (wymagane ≥2 unikalne URL-e i ≥2 domeny)`);
    }

    // Autor może cytować wyłącznie fakty, których URL rzeczywiście przeszedł GET 200.
    // Wcześniej do promptu trafiały też fakty z niedostępnych źródeł, a bramka słusznie
    // odrzucała później wygenerowane z nich linki jako source_not_verified_200.
    const okSourceUrls = new Set(okSources.map((source) => canonicalizeUrl(source.url)));
    const factsPackage = {
        ...researchedFactsPackage,
        facts: researchedFactsPackage.facts.filter((fact) => okSourceUrls.has(canonicalizeUrl(fact.sourceUrl))),
    };
    if (factsPackage.facts.length < 5) {
        throw new StageError('verify-sources', `Za mało faktów ze źródeł 200 OK: ${factsPackage.facts.length} (wymagane ≥5)`);
    }

    const brief: ArticleBrief = { topic: topicOption.topic, angle: topicOption.angle, format, level };
    let written = await writeArticle(
        {
            brief,
            factsPackage,
            verifiedSources: okSources,
            currentDate,
            titleVariants,
            internalLinkAllowlist: SERVICE_PATHS,
            seeAlsoCandidates: context.seeAlsoCandidates,
            styleGuide,
        },
        providerConfig,
    );
    written = { ...written, title: ensureValidTitle(written.title, topicOption.topic) };

    let critique = await critiqueArticle(written.title, written.contentMarkdown, factsPackage, okSources, providerConfig);
    const hasBlocker = (c: typeof critique) => c.issues.some((i) => i.severity === 'blocker');
    const majorCount = (c: typeof critique) => c.issues.filter((i) => i.severity === 'major').length;

    if (hasBlocker(critique)) {
        // Najpierw pozwalamy redaktorowi poprawić wskazane zdania w oparciu o ten sam
        // zamknięty pakiet faktów. Natychmiastowe usuwanie całych akapitów potrafiło
        // zniszczyć poprawną strukturę artykułu, gdy krytyk cytował tylko jedną frazę.
        const titleBeforeRevision = written.title;
        const revised = await reviseArticle(written.title, written.contentMarkdown, critique.issues, factsPackage, okSources, providerConfig);
        written = { title: titleBeforeRevision, contentMarkdown: revised.contentMarkdown };
        critique = await critiqueArticle(written.title, written.contentMarkdown, factsPackage, okSources, providerConfig);
        if (hasBlocker(critique)) {
            const finalPruned = pruneBlockerParagraphs(written.contentMarkdown, critique.issues);
            if (finalPruned.removedParagraphs === 0) {
                throw new StageError('critique', `Nadal blocker po celowanej rewizji: ${critique.issues.filter((i) => i.severity === 'blocker').map((i) => i.problem).join('; ')}`);
            }
            console.warn(`[weekly-article] po celowanej rewizji usunięto ${finalPruned.removedParagraphs} akapitów z pozostałymi blockerami`);
            written = { ...written, contentMarkdown: finalPruned.contentMarkdown };
        }
    } else if (majorCount(critique) >= 3) {
        const titleBeforeRevision = written.title;
        const revised = await reviseArticle(written.title, written.contentMarkdown, critique.issues, factsPackage, okSources, providerConfig);
        written = { title: titleBeforeRevision, contentMarkdown: revised.contentMarkdown };
        critique = await critiqueArticle(written.title, written.contentMarkdown, factsPackage, okSources, providerConfig);
        if (hasBlocker(critique)) {
            const pruned = pruneBlockerParagraphs(written.contentMarkdown, critique.issues);
            if (pruned.removedParagraphs === 0) {
                throw new StageError('critique', `Blocker po rewizji redakcyjnej: ${critique.issues.filter((i) => i.severity === 'blocker').map((i) => i.problem).join('; ')}`);
            }
            console.warn(`[weekly-article] po rewizji redakcyjnej usunięto ${pruned.removedParagraphs} akapitów z blockerami`);
            written = { ...written, contentMarkdown: pruned.contentMarkdown };
        }
    }

    const polished = await polishArticle(written.contentMarkdown, providerConfig);
    if (!polished.applied) console.warn(`[weekly-article] redakcja językowa odrzucona (niezmienniki): ${polished.reasons.join('; ')}`);
    written = {
        title: written.title,
        contentMarkdown: finalizeArticleStructure(polished.contentMarkdown, currentDate),
    };

    const meta = await generateMeta(written.title, written.contentMarkdown, providerConfig);

    const buildDraft = (title: string, contentMarkdown: string, m: ArticleMeta) => ({
        title,
        seoTitle: m.seoTitle,
        seoDescription: m.seoDescription,
        excerpt: m.excerpt,
        contentMarkdown,
        imageBrief: m.imageBrief,
    });
    const qualityContext = {
        now,
        recentTitles: context.recentTitles,
        usedSourceUrls: context.usedSourceUrls,
        internalLinkAllowlist: SERVICE_PATHS,
        realArticleSlugs: context.realArticleSlugs,
        sourceChecks: okSources.map((s) => ({ url: s.url, httpStatus: s.httpStatus })),
    };

    let gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, meta), qualityContext);
    let finalMeta = meta;
    if (!gate.ok) {
        const feedback = gate.errors.map((e) => `- [${e.code}] ${e.message}`).join('\n');
        console.warn(`[weekly-article] bramka jakości: ${gate.errors.length} błędów, wykonuję celowaną rewizję: ${gate.errors.map((e) => e.code).join(', ')}`);

        const metadataOnlyCodes = new Set([
            'seo_title_too_long',
            'seo_description_length',
            'excerpt_length',
            'image_headline_too_long',
            'image_chips_count',
            'image_chip_too_long',
        ]);
        const contentErrors = gate.errors.filter((error) => !metadataOnlyCodes.has(error.code));
        if (contentErrors.length > 0) {
            const qualityIssues = contentErrors.map((error) => ({
                severity: 'major' as const,
                quote: `[${error.code}]`,
                problem: error.message,
                fix:
                    error.code === 'word_count_too_low'
                        ? 'Rozwiń istniejące, poparte źródłami sekcje do co najmniej 1300 słów bez dodawania nowych faktów.'
                        : ['too_few_product_links', 'too_many_product_links', 'too_few_distinct_products', 'invalid_internal_link'].includes(error.code)
                        ? 'Keep 4–6 natural product links covering at least 3 distinct allowed Lux Aura Care product paths. Place each link beside a genuinely relevant routine step; remove unrelated or invalid links.'
                          : 'Popraw dokładnie ten błąd, zachowując wyłącznie fakty i URL-e z gruntu prawdy.',
            }));
            const titleBeforeRevision = written.title;
            const revised = await reviseArticle(written.title, written.contentMarkdown, qualityIssues, factsPackage, okSources, providerConfig);
            written = { title: titleBeforeRevision, contentMarkdown: revised.contentMarkdown };
            written = { ...written, contentMarkdown: finalizeArticleStructure(written.contentMarkdown, currentDate) };
        }
        finalMeta = await generateMeta(written.title, written.contentMarkdown, providerConfig, feedback);
        gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, finalMeta), qualityContext);
        if (!gate.ok) {
            const retryFeedback = gate.errors.map((error) => `- [${error.code}] ${error.message}`).join('\n');
            const retryContentErrors = gate.errors.filter((error) => !metadataOnlyCodes.has(error.code));
            if (retryContentErrors.length > 0) {
                const retryIssues = retryContentErrors.map((error) => ({
                    severity: 'major' as const,
                    quote: `[${error.code}]`,
                    problem: error.message,
                    fix:
                        error.code === 'word_count_too_low'
                            ? 'Rozwiń istniejące, poparte źródłami sekcje do co najmniej 1300 słów bez dodawania nowych faktów.'
                            : error.code === 'section_too_thin'
                              ? 'Rozwiń wskazaną sekcję do co najmniej 40 słów bez dodawania nowych faktów.'
                              : 'Popraw wyłącznie wskazany błąd, zachowując fakty i URL-e z gruntu prawdy.',
                }));
                const retried = await reviseArticle(written.title, written.contentMarkdown, retryIssues, factsPackage, okSources, providerConfig);
                written = { title: written.title, contentMarkdown: finalizeArticleStructure(retried.contentMarkdown, currentDate) };
            }
            finalMeta = await generateMeta(written.title, written.contentMarkdown, providerConfig, retryFeedback);
            gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, finalMeta), qualityContext);
            if (!gate.ok) {
                throw new StageError('quality-gate', `Nadal błędy po dwóch celowanych poprawkach: ${gate.errors.map((e) => e.code).join(', ')}`);
            }
        }

        // Ponowne pisanie tworzy nowy artykuł już po pierwszej krytyce. Nie wolno
        // publikować tej wersji bez osobnego sprawdzenia faktów.
        const rewrittenCritique = await critiqueArticle(written.title, written.contentMarkdown, factsPackage, okSources, providerConfig);
        if (hasBlocker(rewrittenCritique)) {
            const pruned = pruneBlockerParagraphs(written.contentMarkdown, rewrittenCritique.issues);
            if (pruned.removedParagraphs === 0) {
                throw new StageError('critique', `Blocker po poprawce bramki jakości: ${rewrittenCritique.issues.filter((i) => i.severity === 'blocker').map((i) => i.problem).join('; ')}`);
            }
            console.warn(`[weekly-article] po poprawce bramki usunięto ${pruned.removedParagraphs} akapitów z blockerami`);
            written = { ...written, contentMarkdown: finalizeArticleStructure(pruned.contentMarkdown, currentDate) };
            gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, finalMeta), qualityContext);
            if (!gate.ok) {
                // Bezpieczne usunięcie blockera może skrócić artykuł albo zostawić
                // sąsiednią sekcję zbyt cienką. Wcześniej pipeline kończył wtedy cały
                // slot, mimo że nadal miał zamknięty pakiet zweryfikowanych faktów.
                // Dajemy mu jeden ograniczony przebieg odbudowy, a jego wynik znów
                // przechodzi zarówno bramkę jakości, jak i krytykę faktograficzną.
                const recoveryFeedback = gate.errors.map((error) => `- [${error.code}] ${error.message}`).join('\n');
                const recoveryIssues = gate.errors.map((error) => ({
                    severity: 'major' as const,
                    quote: `[${error.code}]`,
                    problem: error.message,
                    fix:
                        error.code === 'word_count_too_low'
                            ? 'Rozwiń wyłącznie istniejące sekcje do co najmniej 1300 słów, używając tylko faktów i URL-i z gruntu prawdy.'
                            : error.code === 'section_too_thin'
                              ? 'Rozwiń wskazaną istniejącą sekcję do co najmniej 40 słów, bez dodawania nowych twierdzeń lub źródeł.'
                              : 'Popraw dokładnie ten błąd bez dodawania nowych faktów, URL-i ani sekcji.',
                }));
                const recovered = await reviseArticle(
                    written.title,
                    written.contentMarkdown,
                    recoveryIssues,
                    factsPackage,
                    okSources,
                    providerConfig,
                );
                written = {
                    title: written.title,
                    contentMarkdown: finalizeArticleStructure(recovered.contentMarkdown, currentDate),
                };
                finalMeta = await generateMeta(written.title, written.contentMarkdown, providerConfig, recoveryFeedback);
                gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, finalMeta), qualityContext);
                if (!gate.ok) {
                    throw new StageError('quality-gate', `Po odbudowie bezpiecznie skróconego artykułu pozostały błędy: ${gate.errors.map((e) => e.code).join(', ')}`);
                }

                const recoveryCritique = await critiqueArticle(written.title, written.contentMarkdown, factsPackage, okSources, providerConfig);
                if (hasBlocker(recoveryCritique)) {
                    const recoveryPruned = pruneBlockerParagraphs(written.contentMarkdown, recoveryCritique.issues);
                    if (recoveryPruned.removedParagraphs === 0) {
                        throw new StageError('critique', `Blocker po odbudowie artykułu: ${recoveryCritique.issues.filter((i) => i.severity === 'blocker').map((i) => i.problem).join('; ')}`);
                    }
                    console.warn(`[weekly-article] po odbudowie usunięto ${recoveryPruned.removedParagraphs} akapitów z blockerami`);
                    written = { ...written, contentMarkdown: finalizeArticleStructure(recoveryPruned.contentMarkdown, currentDate) };
                    gate = runQualityGate(buildDraft(written.title, written.contentMarkdown, finalMeta), qualityContext);
                    if (!gate.ok) {
                        throw new StageError('quality-gate', `Ostateczna bezpieczna wersja nie przeszła bramki: ${gate.errors.map((e) => e.code).join(', ')}`);
                    }
                }
            }
        }
    }

    const visualPlan = await generateVisualPlan(
        written.title,
        written.contentMarkdown,
        okSources.map((source) => source.url),
        providerConfig,
    );
    const polishLocalization = await translateArticleToPolish(
        written.title,
        written.contentMarkdown,
        finalMeta,
        visualPlan,
        providerConfig,
    );

    return {
        article: {
            title: written.title,
            excerpt: finalMeta.excerpt,
            seoTitle: finalMeta.seoTitle,
            seoDescription: finalMeta.seoDescription,
            keywords: finalMeta.keywords,
            tags: finalMeta.tags,
            contentMarkdown: written.contentMarkdown,
            imageAlt: finalMeta.imageAlt,
            format,
            topic: topicOption.topic,
            visualPlan,
            localizations: { pl: polishLocalization },
        },
        verifiedSources: okSources,
        meta: finalMeta,
    };
}

async function reportFailure(site: SiteClient, weekKey: string, env: EngineEnv, stage: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[weekly-article] PORAŻKA na etapie „${stage}”: ${message}`);
    try {
        await site.reportFailure(
            {
                kind: 'failure',
                weekKey,
                mode: env.mode === 'dry-run' ? 'draft' : env.mode,
                stage,
                message: message.slice(0, 2000),
                metrics: {},
                ...(env.runUrl ? { runUrl: env.runUrl } : {}),
            },
            { dryRun: env.mode === 'dry-run' },
        );
    } catch (reportError) {
        console.error('Nie udało się zgłosić niepowodzenia do serwisu:', reportError);
    }
    await sendTelegramNotification(
        `🤖 <b>Lux Aura Care — automatyczny artykuł</b>\n\n❌ Porażka na etapie <b>${escapeHtml(stage)}</b>\n${escapeHtml(message.slice(0, 500))}${env.runUrl ? `\n${escapeHtml(env.runUrl)}` : ''}`,
        { botToken: env.telegramBotToken, chatId: env.telegramChatId },
    );
}

async function main(): Promise<void> {
    const env = loadEnv();
    // AI SDK odczytuje ten sekret samodzielnie. Jawne przypisanie utrzymuje jeden
    // zwalidowany punkt wejścia i ułatwia lokalne testy z wstrzykniętym środowiskiem.
    if (env.aiGatewayApiKey) process.env.AI_GATEWAY_API_KEY = env.aiGatewayApiKey;
    // Watchdog może nadrobić pominięty poniedziałkowy/środowy/piątkowy slot po
    // ponownym uruchomieniu komputera. Południe UTC zachowuje wskazany dzień
    // kalendarzowy także w strefie Europe/Warsaw.
    const now = env.scheduledFor ? new Date(`${env.scheduledFor}T12:00:00.000Z`) : new Date();
    const isoWeek = isoWeekKey(now);
    const runKey = scheduledRunKey(now);
    const rotationNumber = editorialRotationNumber(now);
    const site = new SiteClient(env.siteUrl, env.cronSecret);
    const budget: CostBudget = { spentUsd: 0, capUsd: HARD_COST_CAP_USD, inputTokens: 0, outputTokens: 0, apiCalls: 0 };
    const providerConfig: ProviderConfig = {
        claudeModel: env.claudeModel,
        deepseekApiKey: env.deepseekApiKey,
        openrouterApiKey: env.openrouterApiKey,
        cwd: process.cwd(),
        env: process.env as NodeJS.ProcessEnv,
        budget,
        disableClaudeCode: env.disableClaudeCode,
    };

    console.log(`[weekly-article] start — runKey=${runKey}, isoWeek=${isoWeek}, mode=${env.mode}, force=${env.force}`);
    mkdirSync(OUT_DIR, { recursive: true });

    let context;
    try {
        context = await site.getContext(runKey);
    } catch (error) {
        console.error('Nie udało się pobrać kontekstu z serwisu:', error);
        process.exitCode = 1;
        return;
    }

    if (context.done && !env.force) {
        writeFileSync(
            join(OUT_DIR, 'run-status.json'),
            JSON.stringify({ version: 1, status: 'already_done', weekKey: runKey, url: context.done.url, checkedAt: new Date().toISOString() }, null, 2),
            'utf-8',
        );
        console.log(`[weekly-article] slot ${runKey} jest już zrobiony (${context.done.status}, ${context.done.url}) — kończę.`);
        return;
    }

    // Każdy nowy slot zaczyna od pustego katalogu surowych grafik i bez starej
    // akceptacji wizualnej. Chroni to przed przypadkowym użyciem artefaktów z
    // poprzedniego artykułu, nawet gdy identyfikatory sekcji są podobne.
    rmSync(join(OUT_DIR, 'codex-visuals'), { recursive: true, force: true });
    rmSync(join(OUT_DIR, 'visual-review.json'), { force: true });

    const replacedSlug = env.force && context.done?.url ? context.done.url.split('/').filter(Boolean).at(-1) : undefined;
    const recentForRun = replacedSlug ? context.recent.filter((article) => article.slug !== replacedSlug) : context.recent;
    const runContext: RunContext = {
        recentTitles: recentForRun.map((r) => r.title),
        // Wymuszony przebieg zastępuje sukces z tego samego slotu. GET zwraca
        // zagregowane URL-e bez wskazania slotu, więc nie da się odjąć wyłącznie
        // bieżącego zestawu. Deduplikacja pozostaje aktywna dla wszystkich normalnych
        // (harmonogramowych) przebiegów; force celowo może ponownie użyć źródeł.
        usedSourceUrls: env.force && context.done ? [] : context.usedSourceUrls,
        realArticleSlugs: recentForRun.map((r) => r.slug),
        seeAlsoCandidates: recentForRun.slice(0, 10).map((r) => ({ title: r.title, slug: r.slug })),
    };

    let selected;
    try {
        let candidates: Candidate[] = [];
        if (!env.topicHint) {
            const collected = await collectCandidates({ usedSourceUrls: context.usedSourceUrls, recentTitles: runContext.recentTitles, now });
            candidates = collected.candidates;
            console.log(`[weekly-article] zebrano ${candidates.length} kandydatów (${collected.workingFeedsCount}/${collected.totalFeedsCount} działających feedów)`);
        }
        selected = await selectTopic(
            { candidates, recentTitles: runContext.recentTitles, weekNumber: rotationNumber, topicHint: env.topicHint },
            providerConfig,
            'You are the editor-in-chief of Lux Aura Care. Select the strongest current skincare, health, beauty-tool, body-care or wellbeing topic for an evidence-led English publication. Reject unsupported medical claims and prefer topics that naturally help readers compare or use several live shop products.',
        );
    } catch (error) {
        await reportFailure(site, runKey, env, 'select', error);
        process.exitCode = 1;
        return;
    }

    const styleGuide = readFileSync(join(__dirname, '..', 'prompts', 'style-guide.md'), 'utf-8');
    const topicsToTry: TopicOption[] = [selected.primary, ...selected.reserves];

    let result: TopicAttemptResult | null = null;
    let lastError: unknown = null;
    for (const [index, topicOption] of topicsToTry.entries()) {
        try {
            result = await attemptTopic(topicOption, selected.format, selected.level, selected.titleVariants, runContext, providerConfig, styleGuide, now);
            break;
        } catch (error) {
            lastError = error;
            console.warn(`[weekly-article] temat #${index + 1} („${topicOption.topic}”) zawiódł: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    if (!result) {
        await reportFailure(site, runKey, env, lastError instanceof StageError ? lastError.stage : 'pipeline', lastError ?? new Error('brak tematów do wypróbowania'));
        process.exitCode = 1;
        return;
    }

    writeFileSync(join(OUT_DIR, 'article.md'), `# ${result.article.title}\n\n${result.article.contentMarkdown}`, 'utf-8');
    writeFileSync(join(OUT_DIR, 'meta.json'), JSON.stringify({ article: result.article, imageBrief: result.meta.imageBrief, visualPlan: result.article.visualPlan }, null, 2), 'utf-8');

    const prepared: PreparedArticleRun = {
        version: 1,
        createdAt: new Date().toISOString(),
        weekKey: runKey,
        mode: env.mode === 'dry-run' ? 'draft' : env.mode,
        force: env.force,
        article: result.article,
        sourceUrls: [...new Set(result.verifiedSources.map((source) => source.url))],
        metrics: {
            spentUsd: budget.spentUsd,
            inputTokens: budget.inputTokens,
            outputTokens: budget.outputTokens,
            apiCalls: budget.apiCalls,
        },
        ...(env.runUrl ? { runUrl: env.runUrl } : {}),
    };
    const promptManifest: VisualPromptManifest = {
        version: 1,
        articleTitle: result.article.title,
        items: result.article.visualPlan.assets.map((asset) => ({
            id: asset.id,
            role: asset.role,
            title: asset.title,
            expectedFilename: externalVisualInputFilename(asset),
            prompt: buildGenerationPrompt(result.article.visualPlan, asset),
        })),
    };
    writeFileSync(join(OUT_DIR, 'prepared.json'), JSON.stringify(prepared, null, 2), 'utf-8');
    writeFileSync(join(OUT_DIR, 'visual-prompts.json'), JSON.stringify(promptManifest, null, 2), 'utf-8');
    writeFileSync(
        join(OUT_DIR, 'run-status.json'),
        JSON.stringify({ version: 1, status: 'prepared', weekKey: runKey, articleTitle: result.article.title, preparedAt: new Date().toISOString() }, null, 2),
        'utf-8',
    );

    if (env.prepareOnly) {
        console.log(`[weekly-article] artykuł przygotowany; oczekuje na ${promptManifest.items.length} grafik z lokalnego Codex Imagegen`);
        return;
    }

    if (!env.aiGatewayApiKey) {
        await reportFailure(site, runKey, env, 'article-visuals', new Error('Ręczny tor AI Gateway wymaga AI_GATEWAY_API_KEY; lokalny harmonogram powinien używać PREPARE_ONLY=true'));
        process.exitCode = 1;
        return;
    }

    let generatedVisuals: GeneratedArticleVisual[];
    try {
        generatedVisuals = await generateArticleVisuals(result.article.visualPlan, {
            model: env.articleImageModel,
        });
    } catch (error) {
        // Jakość jest warunkiem publikacji: brak pełnego zestawu obrazów nie może
        // zostać zamaskowany starą okładką szablonową ani pustym miejscem w artykule.
        await reportFailure(site, runKey, env, 'article-visuals', error);
        process.exitCode = 1;
        return;
    }

    for (const visual of generatedVisuals) {
        writeFileSync(join(OUT_DIR, generatedVisualFilename(visual)), Buffer.from(visual.base64, 'base64'));
    }

    const generatedCover = generatedVisuals.find((visual) => visual.role === 'cover');
    if (!generatedCover) {
        await reportFailure(site, runKey, env, 'article-visuals', new Error('Pełny zestaw nie zawiera okładki'));
        process.exitCode = 1;
        return;
    }

    const cover = {
        mimeType: generatedCover.mimeType,
        base64: generatedCover.base64,
        width: generatedCover.width,
        height: generatedCover.height,
    } as const;
    const inlineImages = generatedVisuals.filter((visual) => visual.role === 'inline').map((visual) => {
        if (!visual.placementAfterHeading) throw new Error(`Grafika śródtekstowa „${visual.id}” nie ma miejsca osadzenia`);
        return {
            id: visual.id,
            placementAfterHeading: visual.placementAfterHeading,
            caption: visual.caption,
            altText: visual.altText,
            mimeType: visual.mimeType,
            base64: visual.base64,
            width: visual.width,
            height: visual.height,
            sha256: visual.sha256,
        };
    });

    const payload: PublishPayload = {
        kind: 'publish',
        weekKey: runKey,
        mode: env.mode === 'dry-run' ? 'draft' : env.mode,
        force: env.force,
        article: result.article,
        cover,
        inlineImages,
        run: {
            sourceUrls: [...new Set(result.verifiedSources.map((s) => s.url))],
            metrics: {
                spentUsd: budget.spentUsd,
                inputTokens: budget.inputTokens,
                outputTokens: budget.outputTokens,
                apiCalls: budget.apiCalls,
                imageModel: env.articleImageModel,
                imagesGenerated: generatedVisuals.length,
            },
            ...(env.runUrl ? { runUrl: env.runUrl } : {}),
        },
    };

    const dryRun = env.mode === 'dry-run';
    let publishResult;
    try {
        publishResult = await site.publish(payload, { dryRun });
    } catch (error) {
        await reportFailure(site, runKey, env, 'publish', error);
        process.exitCode = 1;
        return;
    }

    writeFileSync(join(OUT_DIR, 'publish-result.json'), JSON.stringify(publishResult, null, 2), 'utf-8');
    console.log(`[weekly-article] publikacja: HTTP ${publishResult.httpStatus}`, publishResult.body);

    if (publishResult.httpStatus >= 400) {
        await sendTelegramNotification(
            `🤖 <b>Lux Aura Care — automatyczny artykuł</b>\n\n❌ Publikacja nieudana: HTTP ${publishResult.httpStatus}\n${escapeHtml(JSON.stringify(publishResult.body).slice(0, 500))}`,
            { botToken: env.telegramBotToken, chatId: env.telegramChatId },
        );
        process.exitCode = 1;
        return;
    }

    const url = 'url' in publishResult.body ? publishResult.body.url : '(dry-run — brak URL-a)';
    const wordCount = countWords(result.article.contentMarkdown);
    await sendTelegramNotification(
        `🤖 <b>Lux Aura Care — automatyczny artykuł</b>\n\n✅ ${escapeHtml(result.article.title)}\n${escapeHtml(String(url))}\nSłowa: ${wordCount} | Źródła: ${result.verifiedSources.length} | Grafiki premium: ${generatedVisuals.length} | Koszt tekstu: ${budget.spentUsd.toFixed(3)} USD`,
        { botToken: env.telegramBotToken, chatId: env.telegramChatId },
    );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    // Keep one referenced handle while long-lived inference HTTP requests are pending.
    // Otherwise Node can terminate a still-valid top-level await with exit code 13
    // when the HTTP client keeps only unref'ed sockets/timers.
    const processKeepAlive = setInterval(() => undefined, 30_000);
    await main().catch((error) => {
        console.error('Nieoczekiwany błąd silnika:', error);
        process.exitCode = 1;
    }).finally(() => {
        clearInterval(processKeepAlive);
    });
}
