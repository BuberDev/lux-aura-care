// Okładka artykułu (spec 6): 1200x630, wspólny system wizualny Lux Aura Care — ciepłe tło
// marki i duży granatowy panel redakcyjny, kicker, nagłówek, chipy i własny motyw.
// Font ładowany z lokalnego pliku (staticFile) — render nie zależy od sieci/Google Fonts.
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { fitHeadline } from './fit';
import { Motif, type MotifVariant } from './motif';

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;
const MARGIN = 54;
const FONT_FAMILY = 'Geist';

export interface CoverProps {
    headline: string;
    kicker: string;
    chips: [string, string, string];
    variant: MotifVariant;
    /** Do deterministycznego ziarna motywu — ten sam slot publikacji, ten sam układ. */
    weekKey: string;
}

export const Cover: React.FC<CoverProps> = ({ headline, kicker, chips, variant, weekKey }) => {
    const [handle] = useState(() => delayRender('Ładowanie fontu Geist'));
    const [fontReady, setFontReady] = useState(false);

    useEffect(() => {
        loadFont({ family: FONT_FAMILY, url: staticFile('GeistVF.woff'), weight: '700', format: 'woff' })
            .then(() => {
                setFontReady(true);
                continueRender(handle);
            })
            .catch((error: unknown) => {
                console.error('Nie udało się załadować fontu Geist, render użyje fontu systemowego:', error);
                setFontReady(true);
                continueRender(handle);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const headlineBoxWidth = 690;
    const { fontSize, lines } = fitHeadline(headline, headlineBoxWidth, FONT_FAMILY);

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(118deg, #C7440D 0%, #148CFF 34%, #F47B3B 64%, #A8E6F0 100%)',
                fontFamily: FONT_FAMILY,
            }}
        >
            {/* Charakterystyczna, powtarzalna poświata marki. */}
            <div
                style={{
                    position: 'absolute',
                    top: -190,
                    right: -40,
                    width: 580,
                    height: 580,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,236,218,0.48) 0%, rgba(255,236,218,0) 70%)',
                }}
            />

            {/* Ziarno przeciw bandingowi na gradiencie */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
                <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain)" />
            </svg>

            {/* Kicker, prawy górny róg */}
            <div
                style={{
                    position: 'absolute',
                    top: 61,
                    right: MARGIN,
                    color: '#3B160A',
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: 2.4,
                    textTransform: 'uppercase',
                }}
            >
                {kicker}
            </div>

            {/* Granatowy panel to stały element wszystkich nowych okładek. */}
            <div
                style={{
                    position: 'absolute',
                    left: 38,
                    right: 38,
                    top: 154,
                    bottom: 38,
                    borderRadius: 30,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #071426 0%, #0A1B35 58%, #10294A 100%)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 22px 50px rgba(40,14,5,0.32)',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 84% 45%, rgba(30,104,180,0.2), transparent 35%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        left: MARGIN - 38,
                        top: 32,
                        color: '#F58A52',
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: 2.1,
                        textTransform: 'uppercase',
                    }}
                >
                    Lux Aura Care • analiza technologii
                </div>
            </div>

            {/* Nagłówek — maksymalnie 3 linie, z dużym bezpiecznym polem. */}
            {fontReady && (
                <div
                    style={{
                        position: 'absolute',
                        left: MARGIN,
                        top: 230,
                        width: headlineBoxWidth,
                        color: 'white',
                        fontWeight: 750,
                        fontSize,
                        lineHeight: 1.08,
                        letterSpacing: -1.4,
                    }}
                >
                    {lines.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            )}

            <div style={{ position: 'absolute', left: MARGIN, bottom: 66, display: 'flex', gap: 12 }}>
                {chips.map((chip, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '8px 18px',
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    >
                        {chip}
                    </div>
                ))}
            </div>

            {/* Duży motyw po prawej — wspólny styl, wariant zależny od slotu publikacji. */}
            <div
                style={{
                    position: 'absolute',
                    right: 74,
                    top: 238,
                    width: 330,
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(1.16)',
                }}
            >
                <Motif variant={variant} seedKey={weekKey} />
            </div>
        </AbsoluteFill>
    );
};
