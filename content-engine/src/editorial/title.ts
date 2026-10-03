const DANGLING_TITLE_END = /\b(?:and|or|of|to|for|from|with|by|in|on|at|as|the|a|an|but|without)$/iu;

function withoutDanglingTitleEnding(value: string): string {
    let result = value.replace(/[\s,;:.!?–—-]+$/u, '').trim();
    while (DANGLING_TITLE_END.test(result)) {
        result = result.replace(DANGLING_TITLE_END, '').replace(/[\s,;:.!?–—-]+$/u, '').trim();
    }
    return result;
}

export function ensureValidTitle(title: string, topic: string): string {
    const normalizedTitle = withoutDanglingTitleEnding(title.replace(/\s+/g, ' ').trim());
    if (normalizedTitle.length >= 30 && normalizedTitle.length <= 70) return normalizedTitle;

    const normalizedTopic = withoutDanglingTitleEnding(topic.replace(/\s+/g, ' ').trim());
    if (normalizedTopic.length >= 30 && normalizedTopic.length <= 70) return normalizedTopic;

    const expanded = normalizedTopic.length < 30 ? `${normalizedTopic}: a business analysis` : normalizedTopic;
    if (expanded.length <= 70) return expanded;

    const slice = expanded.slice(0, 71);
    const lastSpace = slice.lastIndexOf(' ');
    return withoutDanglingTitleEnding(lastSpace >= 30 ? slice.slice(0, lastSpace) : expanded.slice(0, 70));
}
