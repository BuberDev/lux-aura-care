import Image from "next/image";
import { Clock3 } from "lucide-react";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getAffiliateRoute } from "@/lib/affiliate";
import { getGlowRoutineSteps, getProductProof } from "@/lib/site-data";

export function RoutineSection() {
  const steps = getGlowRoutineSteps();

  return (
    <Section id="routine" className="atmosphere-surface [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
      <Container>
        <Heading
          eyebrow="Night Routine"
          title="The 12-minute glow routine our readers repeat the most"
          description="Built for low-attention evenings: short steps, clear outcomes, and one product action at a time."
        />

        <ol className="mt-12 grid gap-6 lg:grid-cols-2">
          {steps.map((step) => {
            const proof = getProductProof(step.product.id);

            return (
              <li key={step.step} className="rounded-3xl border border-white/12 bg-white/[0.02] p-5 md:p-6">
                <div className="grid gap-5 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src={step.product.image}
                      alt={step.product.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 120px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge>Step {step.step}</Badge>
                      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
                        <Clock3 className="size-3.5" aria-hidden="true" />
                        {step.timing}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl leading-tight">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-accent-gold">{proof.socialProof}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                      <p className="text-sm text-text-secondary">{step.product.name}</p>
                      <CTAButton
                        href={getAffiliateRoute(step.product.id, "routine-step")}
                        label="Check on Amazon"
                        className="h-10 px-5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex justify-center">
          <CTAButton href="/blog" label="Read Full Routine Guides" variant="secondary" />
        </div>
      </Container>
    </Section>
  );
}
