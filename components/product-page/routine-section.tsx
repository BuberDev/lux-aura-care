import { Clock3 } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

type RoutineStep = {
  title: string;
  description: string;
};

type RoutineSectionProps = {
  title: string;
  steps: RoutineStep[];
  ctaHref: string;
};

export function RoutineSection({ title, steps, ctaHref }: RoutineSectionProps) {
  return (
    <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_780px]">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Ritual Flow</p>
          <h2 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Built for real evenings: low effort, calming pace, and clear moments that feel intentionally luxurious.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-3" aria-label="How to use as a ritual">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-white/12 bg-white/[0.02] p-6">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
                <Clock3 className="size-4" aria-hidden="true" />
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-heading text-2xl leading-tight">{step.title.replace(/^Step \d+: /, "")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center">
          <CTAButton href={ctaHref} label="View details" variant="secondary" />
        </div>
      </Container>
    </Section>
  );
}
