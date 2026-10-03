// Abstrakcyjny motyw po prawej stronie okładki (spec 6) — wyłącznie własna grafika
// wektorowa, zero cudzych logotypów/zrzutów ekranu. Trzy warianty rotowane wg slotu;
// pozycje w obrębie wariantu są deterministyczne (ten sam weekKey -> ten sam obraz).
import React from 'react';

const ACCENT = '#00B8D9';
const ACCENT_DIM = 'rgba(255, 106, 36, 0.55)';
const LINE = 'rgba(137, 190, 241, 0.3)';

export type MotifVariant = 'grid' | 'flow' | 'bars';

/** Prosty deterministyczny PRNG (mulberry32) — ten sam seed zawsze daje tę samą sekwencję. */
function mulberry32(seed: number): () => number {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashSeed(text: string): number {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) | 0;
    }
    return hash >>> 0;
}

/** Wybiera wariant motywu deterministycznie z numeru slotu (rotacja, nie losowość). */
export function motifVariantFor(weekNumber: number): MotifVariant {
    const variants: MotifVariant[] = ['grid', 'flow', 'bars'];
    return variants[weekNumber % 3];
}

function GridMotif({ seed }: { seed: number }) {
    const rand = mulberry32(seed);
    const nodes = Array.from({ length: 7 }, (_, i) => ({
        x: 60 + (i % 3) * 90 + rand() * 20,
        y: 60 + Math.floor(i / 3) * 90 + rand() * 20,
    }));
    const edges: [number, number][] = [
        [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 6],
    ];
    return (
        <svg width="260" height="260" viewBox="0 0 320 320">
            {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={LINE} strokeWidth={1.5} />
            ))}
            {nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r={i === 3 ? 10 : 6} fill={i === 3 ? ACCENT : ACCENT_DIM} />
            ))}
        </svg>
    );
}

function FlowMotif({ seed }: { seed: number }) {
    const rand = mulberry32(seed);
    const steps = 5;
    const points = Array.from({ length: steps }, (_, i) => ({
        x: 40 + i * 60,
        y: 260 - i * 45 + (rand() - 0.5) * 20,
    }));
    const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    return (
        <svg width="260" height="260" viewBox="0 0 320 320">
            <path d={path} fill="none" stroke={LINE} strokeWidth={2} />
            {points.map((p, i) => (
                <rect key={i} x={p.x - 8} y={p.y - 8} width={16} height={16} rx={4} fill={i === steps - 1 ? ACCENT : ACCENT_DIM} />
            ))}
        </svg>
    );
}

function BarsMotif({ seed }: { seed: number }) {
    const rand = mulberry32(seed);
    const bars = Array.from({ length: 6 }, () => 40 + rand() * 220);
    return (
        <svg width="260" height="260" viewBox="0 0 320 320">
            {bars.map((h, i) => (
                <rect key={i} x={20 + i * 48} y={300 - h} width={28} height={h} rx={4} fill={i === bars.length - 2 ? ACCENT : ACCENT_DIM} />
            ))}
        </svg>
    );
}

export function Motif({ variant, seedKey }: { variant: MotifVariant; seedKey: string }) {
    const seed = hashSeed(seedKey);
    if (variant === 'grid') return <GridMotif seed={seed} />;
    if (variant === 'flow') return <FlowMotif seed={seed} />;
    return <BarsMotif seed={seed} />;
}
