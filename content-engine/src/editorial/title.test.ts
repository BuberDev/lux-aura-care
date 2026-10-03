import { describe, expect, it } from 'vitest';
import { ensureValidTitle } from './title';

describe('ensureValidTitle', () => {
    it('removes a conjunction left at the end of a title', () => {
        expect(
            ensureValidTitle(
                'Stablecoin settlement: what companies need to know and',
                'Stablecoin settlement for enterprise finance',
            ),
        ).toBe('Stablecoin settlement: what companies need to know');
    });

    it('zachowuje kompletny tytuł o prawidłowej długości', () => {
        const title = 'Bezpieczeństwo agentów AI w firmie: praktyczny audyt';
        expect(ensureValidTitle(title, 'Inny temat')).toBe(title);
    });
});
