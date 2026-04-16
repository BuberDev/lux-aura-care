import { Droplets, ShieldCheck, Sparkles, Wind } from "lucide-react";

import { Container } from "@/components/container";

type BenefitStripProps = {
  items: string[];
};

const icons = [Droplets, Sparkles, Wind, ShieldCheck] as const;

export function BenefitStrip({ items }: BenefitStripProps) {
  return (
    <section className="border-b border-black/10 bg-background-secondary py-7 md:py-9">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Quick benefits">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];

            return (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-background-primary"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium tracking-[0.01em] md:text-base">{item}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
