"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  const comparisonImages = [
    {
      key: "before",
      label: "Before",
      src: `/${productId}/before${imageExtension}`,
      alt: text("Before using {product}").replace("{product}", productName),
    },
    {
      key: "after",
      label: "After",
      src: `/${productId}/after${imageExtension}`,
      alt: text("After using {product}").replace("{product}", productName),
    },
  ] as const;

  return (
    <section className="bg-surface-subtle/35 py-16 sm:py-24">
      <Container className="px-4 sm:px-5 md:px-10 lg:px-16">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-5xl">
            <T text={"Product results"} />
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            <T text={"Compare the complete before and after photographs side by side."} />
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-10">
            {comparisonImages.map((image) => (
              <figure key={image.key} className="min-w-0">
                <div className="overflow-hidden rounded-2xl bg-surface-raised sm:rounded-3xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={941}
                    height={1672}
                    sizes="(max-width: 640px) calc(50vw - 16px), (max-width: 1024px) calc(50vw - 40px), 480px"
                    className="block h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="mt-3 text-center font-serif text-lg font-semibold text-text-primary sm:mt-5 sm:text-2xl">
                  <T text={image.label} />
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-relaxed text-text-secondary sm:mt-9 sm:text-sm">
            <T text={"Individual results vary. Photos do not guarantee the same result."} />
          </p>
        </div>
      </Container>
    </section>
  );
}
