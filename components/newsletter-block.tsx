"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "newsletter",
        }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string; message?: string };

      if (data.success) {
        setStatus("success");
        setMessage("Check your email for your 15% off code!");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <Section id="newsletter" className="[content-visibility:auto] [contain-intrinsic-size:1px_520px]">
      <Container>
        <div className="rounded-[2rem] border border-accent-gold/40 bg-background-secondary px-6 py-12 text-background-primary md:px-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background-primary/70">
                <Sparkles className="size-4" aria-hidden="true" />
                Exclusive Subscriber Benefit
              </p>
              <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                Get 15% off your first bundle + weekly ritual guides.
              </h2>
              <p className="text-sm text-background-primary/70">
                1 curated ritual + 3 product picks sent Friday mornings. Unsubscribe anytime—no hard feelings.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-background-primary/70">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-background-primary/50" />
                  Exclusive bundle discounts (15-25% off)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-background-primary/50" />
                  New product picks before Instagram
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-background-primary/50" />
                  Abandoned routine recovery emails
                </li>
              </ul>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit} aria-label="Newsletter signup">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                required
                disabled={status === "loading"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-background-primary/20 bg-white text-background-primary placeholder:text-background-primary/55 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-background-primary text-text-primary hover:brightness-110 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Get 15% Off + Weekly Guides"}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
                  <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                  <p>{message}</p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  <p>{message}</p>
                </div>
              )}

              <p className="text-xs text-background-primary/65">We send Friday mornings only. Unsubscribe instantly.</p>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
