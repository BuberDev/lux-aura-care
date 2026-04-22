import { BundleCard } from "@/components/bundle-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { getFeaturedBundles } from "@/lib/site-data";

export function BundlesSection() {
  const bundles = getFeaturedBundles(4);

  return (
    <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
      <Container>
        <Heading
          eyebrow="Complete Rituals"
          title="Curated bundles for maximum impact and savings"
          description="Skip the guesswork. These collections pair complementary products for proven results—plus you save when you bundle."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>

        <InlineCtaPanel
          className="mt-12"
          eyebrow="Ready to commit"
          title="Start with one complete ritual, then add as your routine evolves"
          description="Bundles are designed for commitment and results. Each collection creates habit momentum faster than individual products."
          primaryHref="#"
          primaryLabel="Browse All Ritual Bundles"
          secondaryHref="/blog"
          secondaryLabel="Read More Guides"
        />
      </Container>
    </Section>
  );
}
