import { Check } from "lucide-react";

import { Container } from "@/components/container";
import { Section } from "@/components/section";

type BenefitListItem = {
  title: string;
  description: string;
};

type BenefitListProps = {
  items: BenefitListItem[];
};

export function BenefitList({ items }: BenefitListProps) {
  return (
    <Section className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_700px]">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Detailed Benefits</p>
          <h2 className="mt-3 font-heading text-3xl leading-tight text-background-primary sm:text-4xl">
            Why this pick works in real routines
          </h2>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Detailed product benefits">
          {items.map((item) => (
            <li key={item.title} className="rounded-3xl border border-black/12 bg-black/[0.03] p-6 text-background-primary">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
                <Check className="size-4" aria-hidden="true" />
                Benefit
              </p>
              <h3 className="mt-3 font-heading text-2xl leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
