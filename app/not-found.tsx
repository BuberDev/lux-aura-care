import Link from "next/link";

import { Container } from "@/components/container";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section className="min-h-[60vh] pt-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/12 bg-white/[0.02] p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">404</p>
          <h1 className="mt-3 font-heading text-5xl">The ritual you are looking for is unavailable</h1>
          <p className="mt-4 text-text-secondary">
            Explore the latest guides and favorites to keep building your self-care routine.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton href="/blog" label="Go to Blog" />
            <Link
              href="/favorites"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm uppercase tracking-[0.12em] text-text-secondary transition-colors hover:text-text-primary"
            >
              Amazon Favorites
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
