// Rejestruje kompozycję `Cover` dla Remotion (bundle+renderStill w render.ts).
import React from 'react';
import { Composition } from 'remotion';
import { Cover, COVER_HEIGHT, COVER_WIDTH, type CoverProps } from './Cover';

const DEFAULT_PROPS: CoverProps = {
    headline: 'Agenci AI w firmie: co się zmienia',
    kicker: 'AKTUALNOŚCI AI',
    chips: ['AI', 'Automatyzacja', 'Biznes'],
    variant: 'grid',
    weekKey: '2026-W01',
};

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="Cover"
            component={Cover as unknown as React.FC<Record<string, unknown>>}
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            fps={30}
            durationInFrames={1}
            defaultProps={DEFAULT_PROPS as unknown as Record<string, unknown>}
        />
    );
};
