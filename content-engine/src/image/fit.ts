// Auto-dopasowanie nagłówka okładki (spec 6): 68→44px, max 3 linie. `fitTextOnNLines`
// z @remotion/layout-utils robi dokładnie to — mierzy tekst w prawdziwej przeglądarce
// (font musi być już załadowany, patrz Cover.tsx) i zwraca największy rozmiar, który
// mieści się w zadanej liczbie linii.
import { fitTextOnNLines } from '@remotion/layout-utils';

const MAX_FONT_SIZE = 68;
const MIN_FONT_SIZE = 44;
const MAX_LINES = 3;

export interface FitHeadlineResult {
    fontSize: number;
    lines: string[];
    /** `true`, gdy dopasowany rozmiar spadł poniżej minimum ze specu — ostrzeżenie, nie błąd. */
    belowMinimum: boolean;
}

export function fitHeadline(text: string, maxBoxWidth: number, fontFamily: string): FitHeadlineResult {
    const { fontSize, lines } = fitTextOnNLines({
        text,
        maxLines: MAX_LINES,
        maxBoxWidth,
        fontFamily,
        fontWeight: 700,
        maxFontSize: MAX_FONT_SIZE,
    });

    return { fontSize, lines, belowMinimum: fontSize < MIN_FONT_SIZE };
}
