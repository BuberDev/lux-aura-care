import { Check } from "lucide-react";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { T } from "@/components/translated-text";

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
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold"><T text={"Detailed Benefits"} /></p>
          <h2 className="mt-3 font-heading text-3xl leading-tight text-text-primary sm:text-4xl">
            <T text={"Why this pick works in real routines"} />
          </h2>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="rounded-3xl border border-border-subtle bg-surface-subtle p-6 text-text-primary">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
                <Check className="size-4" aria-hidden="true" />
                <T text={"Benefit"} />
              </p>
              <h3 className="mt-3 font-heading text-2xl leading-tight"><T text={item.title} /></h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary"><T text={item.description} /></p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
