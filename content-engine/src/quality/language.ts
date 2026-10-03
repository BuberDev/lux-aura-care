const ENGLISH_FUNCTION_WORDS = new Set([
    'the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'is', 'are', 'with', 'by', 'this', 'that', 'it', 'as', 'at',
    'from', 'be', 'or', 'not', 'can', 'will', 'has', 'have', 'their', 'which', 'what', 'how', 'why', 'when', 'into',
]);

const POLISH_FUNCTION_WORDS = new Set([
    'i', 'w', 'na', 'do', 'z', 'o', 'się', 'że', 'jest', 'są', 'nie', 'po', 'za', 'dla', 'jak', 'co', 'oraz', 'czy',
]);

export interface LanguageCheck {
    isEnglish: boolean;
    englishFunctionRatio: number;
    polishDominates: boolean;
}

export function analyzeLanguage(text: string): LanguageCheck {
    const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
    if (words.length === 0) return { isEnglish: false, englishFunctionRatio: 0, polishDominates: false };

    let english = 0;
    let polish = 0;
    for (const word of words) {
        if (ENGLISH_FUNCTION_WORDS.has(word)) english += 1;
        if (POLISH_FUNCTION_WORDS.has(word)) polish += 1;
    }

    const englishFunctionRatio = english / words.length;
    const polishDominates = polish > english;
    return { isEnglish: englishFunctionRatio >= 0.08 && !polishDominates, englishFunctionRatio, polishDominates };
}
