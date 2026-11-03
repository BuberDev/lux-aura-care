"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

import { Container } from "@/components/container";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";

type ProductResultsComparisonProps = {
  readonly productId: string;
  readonly productName: string;
};

const supportedExtensions = [".webp", ".jpg", ".jpeg", ".png"] as const;

async function imageExists(url: string, signal: AbortSignal) {
  try {
    const response = await fetch(url, { method: "HEAD", signal });
    return response.ok;
  } catch {
    return false;
  }
}

export function ProductResultsComparison({
  productId,
  productName,
}: ProductResultsComparisonProps) {
  const { text } = useI18n();
  const [position, setPosition] = useState(50);
  const [imageExtension, setImageExtension] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all(
      supportedExtensions.map(async (extension) => {
        const [beforeExists, afterExists] = await Promise.all([
          imageExists(`/${productId}/before${extension}`, controller.signal),
          imageExists(`/${productId}/after${extension}`, controller.signal),
        ]);
        return beforeExists && afterExists ? extension : null;
      })
    ).then((extensions) => {
      if (!controller.signal.aborted) {
        setImageExtension(extensions.find(Boolean) ?? null);
      }
    });

    return () => controller.abort();
  }, [productId]);

  if (!imageExtension) return null;

  return (
    <section className="border-b border-border-subtle bg-surface-subtle/35 py-12 sm:py-16">
      <Container className="px-2 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-accent-gold sm:text-xs">
            <T text={"Before and after"} />
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
            <T text={"Product results"} />
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised shadow-[0_24px_70px_rgba(41,31,20,0.16)] sm:aspect-[4/3]">
            <Image
              src={`/${productId}/before${imageExtension}`}
              alt={text("Before using {product}").replace("{product}", productName)}
              fill
              sizes="(max-width: 768px) calc(100vw - 1rem), 768px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            >
              <Image
                src={`/${productId}/after${imageExtension}`}
                alt={text("After using {product}").replace("{product}", productName)}
                fill
                sizes="(max-width: 768px) calc(100vw - 1rem), 768px"
                className="object-cover"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between p-3 sm:p-4">
              <span className="rounded-full border border-white/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <T text={"Before"} />
              </span>
              <span className="rounded-full border border-white/35 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-900 backdrop-blur-md">
                <T text={"After"} />
              </span>
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_0_18px_rgba(0,0,0,0.28)]"
              style={{ left: `${position}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#a17f45] text-white shadow-xl sm:size-11">
                <MoveHorizontal className="size-5" aria-hidden="true" />
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label={text("Move the comparison slider")}
              className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0"
            />
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-text-secondary">
            <T text={"Individual results vary. Photos do not guarantee the same result."} />
          </p>
        </div>
      </Container>
    </section>
  );
}
