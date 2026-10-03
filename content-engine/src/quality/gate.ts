// Orkiestrator bramki jakości (spec 4.2, Etap 7): uruchamia wszystkie reguły, dzieli
// wyniki na błędy (blokują publikację) i ostrzeżenia (trafiają tylko do raportu).
import { QUALITY_RULES, type DraftArticle, type QualityContext, type RuleFinding } from './rules';

export interface QualityGateResult {
    ok: boolean;
    errors: RuleFinding[];
    warnings: RuleFinding[];
}

export function runQualityGate(article: DraftArticle, context: QualityContext): QualityGateResult {
    const findings = QUALITY_RULES.flatMap((rule) => rule(article, context));
    const errors = findings.filter((f) => f.severity === 'error');
    const warnings = findings.filter((f) => f.severity === 'warn');
    return { ok: errors.length === 0, errors, warnings };
}

export type { DraftArticle, QualityContext, RuleFinding } from './rules';
