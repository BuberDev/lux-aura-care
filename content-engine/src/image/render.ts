// Render okładki: bundle() raz na wywołanie -> selectComposition() -> renderStill()
// (spec 6). Cel ≤600KB przy q=90, twardy limit 1,5MB — przy przekroczeniu render
// powtarza się z q=82 (spec 6: "przy przekroczeniu render q=82").
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CoverProps } from './Cover';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRY_POINT = join(__dirname, 'entry.tsx');

const TARGET_MAX_BYTES = 600 * 1024;
const HARD_MAX_BYTES = 1.5 * 1024 * 1024;
const DEFAULT_JPEG_QUALITY = 90;
const FALLBACK_JPEG_QUALITY = 82;
const RENDER_SCALE = 2; // 1200x630 -> 2400x1260

export interface RenderCoverResult {
    buffer: Buffer;
    width: number;
    height: number;
}

export async function renderCover(props: CoverProps): Promise<RenderCoverResult> {
    const serveUrl = await bundle({ entryPoint: ENTRY_POINT, onProgress: () => {} });
    const inputProps = props as unknown as Record<string, unknown>;
    const composition = await selectComposition({ serveUrl, id: 'Cover', inputProps });

    const render = (jpegQuality: number) =>
        renderStill({
            composition,
            serveUrl,
            output: null, // bufor, nie plik — wywołujący decyduje, co z nim zrobić (base64 do M1)
            imageFormat: 'jpeg',
            jpegQuality,
            scale: RENDER_SCALE,
            inputProps,
        });

    let { buffer } = await render(DEFAULT_JPEG_QUALITY);
    if (buffer && buffer.byteLength > TARGET_MAX_BYTES) {
        const retry = await render(FALLBACK_JPEG_QUALITY);
        if (retry.buffer) buffer = retry.buffer;
    }

    if (!buffer) throw new Error('renderStill nie zwrócił bufora obrazu');
    if (buffer.byteLength > HARD_MAX_BYTES) {
        throw new Error(`Okładka przekracza twardy limit ${HARD_MAX_BYTES} B (ma ${buffer.byteLength} B)`);
    }

    return { buffer, width: composition.width * RENDER_SCALE, height: composition.height * RENDER_SCALE };
}
