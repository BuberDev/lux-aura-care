import { Sparkles } from "lucide-react";

import { CTAButton } from "@/components/cta-button";
import { cn } from "@/lib/utils";

type InlineCtaPanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function InlineCtaPanel({
  eyebrow = "Editor Note",
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: InlineCtaPanelProps) {
  return (
    <div className={cn("rounded-[2rem] border border-accent-gold/35 bg-accent-gold/10 p-6 md:p-8", className)}>
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-gold">
        <Sparkles className="size-4" aria-hidden="true" />
        {eyebrow}
      </p>
      <h3 className="mt-3 font-heading text-3xl leading-tight text-text-primary md:text-4xl">{title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CTAButton href={primaryHref} label={primaryLabel} />
        {secondaryHref && secondaryLabel ? (
          <CTAButton href={secondaryHref} label={secondaryLabel} variant="secondary" />
        ) : null}
      </div>
    </div>
  );
}
