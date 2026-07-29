import { BundleCard } from "@/components/bundle-card";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { InlineCtaPanel } from "@/components/inline-cta-panel";
import { getFeaturedBundles } from "@/lib/site-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeContent } from "@/lib/i18n/messages";

export async function BundlesSection() {
  const locale = await getRequestLocale();
  const bundles = localizeContent(locale, getFeaturedBundles(4));

  return (
    <Section className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
      <Container>
        <Heading
          eyebrow="Value sets"
          title="Curated product pairings for focused results"
          description="Skip the guesswork. These collections pair complementary products so it is easier to build a focused cart."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>

        <InlineCtaPanel
          className="mt-12"
          eyebrow="Ready to choose"
          title="Start with one focused set, then add only what you need"
          description="Bundles keep the decision simple by grouping products that naturally work toward the same beauty or self-care goal."
          primaryHref="/favorites"
          primaryLabel="Browse curated sets"
          secondaryHref="/blog"
          secondaryLabel="Read more guides"
        />
      </Container>
    </Section>
  );
}
