import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

type ProblemSolutionProps = {
  readonly headline: string;
  readonly problemParagraph: string;
  readonly solutionParagraph: string;
  readonly ctaHref: string;
  readonly productId?: string;
  readonly productName?: string;
};

export function ProblemSolution({
  headline,
  problemParagraph,
  solutionParagraph,
  ctaHref,
  productId,
  productName,
}: ProblemSolutionProps) {
  return (
    <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_440px]">
      <Container>
        <div className="rounded-[2rem] border border-white/12 bg-white/[0.02] p-7 md:p-10">
          <h2 className="font-heading text-3xl leading-tight md:text-4xl">{headline}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">{problemParagraph}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
            <span className="text-text-primary">This product helps by...</span> {solutionParagraph}
          </p>

          <div className="mt-7">
            <CTAButton
              href={ctaHref}
              label="Check on Amazon"
              variant="secondary"
              productId={productId}
              productName={productName}
              placement="product-problem-solution"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
