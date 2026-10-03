// Kandydat na temat artykułu — jeden news/post z feedu, HN albo wyszukiwarki,
// zanim trafi do normalizacji/deduplikacji/filtrów w Etapie 2 (spec 4.2).
export interface Candidate {
    title: string;
    url: string;
    /** Nazwa źródła do logów/raportu, np. „OpenAI”, „Hacker News”. */
    source: string;
    /** ISO 8601 — brak, gdy źródło (np. HN) nie podaje wprost daty publikacji artykułu. */
    publishedAt?: string;
    /** Liczba niezależnych źródeł, które podały tę samą wiadomość — rośnie przy scalaniu w dedupe. */
    corroboration: number;
}
