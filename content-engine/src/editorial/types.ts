// Wspólne typy pipeline'u redakcyjnego (spec 4.2, Etapy 3–6).
import type { Candidate } from '../harvest/types';

export type ArticleFormat = 'news-analysis' | 'practical-guide' | 'explainer';
export type ArticleLevel = 'basic' | 'advanced';

export interface TopicOption {
    topic: string;
    angle: string;
    keyword: string;
    /** URL-e kandydatów z harvestu, które uzasadniają ten temat. */
    candidateUrls: string[];
}

export interface TitleVariant {
    title: string;
}

export interface SelectedTopic {
    primary: TopicOption;
    reserves: TopicOption[];
    format: ArticleFormat;
    level: ArticleLevel;
    levelOverrideReason: string | null;
    titleVariants: TitleVariant[];
}

export interface Fact {
    id: string;
    statement: string;
    sourceUrl: string;
    sourceTitle: string;
    publishedAt: string | null;
}

export interface FactsPackage {
    facts: Fact[];
    background: string;
}

export interface VerifiedSource {
    url: string;
    httpStatus: number | null;
    title: string | null;
    publishedAt: string | null;
    /** Fragment tekstu strony (do ~3000 znaków) — grunt prawdy dla krytyka, nie tylko streszczenie modelu. */
    excerpt: string | null;
}

export interface ArticleBrief {
    topic: string;
    angle: string;
    format: ArticleFormat;
    level: ArticleLevel;
}

export interface ArticleMeta {
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    tags: string[];
    imageAlt: string;
    imageBrief: { headline: string; kicker: string; chips: [string, string, string] };
}

export type VisualAssetType =
    | 'editorial-cover'
    | 'technical-diagram'
    | 'data-visualization'
    | 'editorial-illustration'
    | 'editorial-photo';

export interface ArticleVisualAsset {
    id: string;
    role: 'cover' | 'inline';
    assetType: VisualAssetType;
    title: string;
    placementAfterHeading: string | null;
    purpose: string;
    aspectRatio: string;
    prompt: string;
    negativePrompt: string;
    caption: string;
    altText: string;
    requiredFacts: string[];
}

export interface ArticleVisualPlan {
    version: 1;
    artDirection: string;
    brandRules: string[];
    assets: ArticleVisualAsset[];
}

export interface CritiqueIssue {
    severity: 'blocker' | 'major' | 'minor';
    quote: string;
    problem: string;
    fix: string;
}

export interface CritiqueResult {
    issues: CritiqueIssue[];
}

/** Historia potrzebna do selekcji/deduplikacji — z GET /api/cron/weekly-article (M1). */
export interface EngineHistory {
    recentTitles: string[];
    usedSourceUrls: string[];
    realArticleSlugs: string[];
}

export interface HarvestedCandidates {
    candidates: Candidate[];
}
