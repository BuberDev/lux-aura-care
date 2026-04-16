import { Sparkles } from "lucide-react";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBlock() {
  return (
    <Section id="newsletter" className="[content-visibility:auto] [contain-intrinsic-size:1px_520px]">
      <Container>
        <div className="rounded-[2rem] border border-accent-gold/40 bg-background-secondary px-6 py-12 text-background-primary md:px-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background-primary/70">
                <Sparkles className="size-4" aria-hidden="true" />
                Weekly Ritual Edit
              </p>
              <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                Join the list for one curated ritual and three quality product picks every week.
              </h2>
              <p className="text-sm text-background-primary/70">
                Built for Pinterest savers who want elegant routines they will actually keep.
              </p>
            </div>

            <form className="space-y-3" aria-label="Newsletter signup">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="border-background-primary/20 bg-white text-background-primary placeholder:text-background-primary/55"
              />
              <Button type="submit" className="w-full bg-background-primary text-text-primary hover:brightness-110">
                Subscribe
              </Button>
              <p className="text-xs text-background-primary/65">No spam. Weekly only. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
