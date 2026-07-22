"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { LocalizedLink } from "@/components/localized-link";

const CONSENT_COOKIE = "lux_consent";

function setConsentCookie(value: "granted" | "denied") {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function hasStoredConsent() {
  return document.cookie.split("; ").some((row) => row.startsWith(`${CONSENT_COOKIE}=`));
}

export function CookieConsentBanner() {
  const { locale } = useI18n();
  const isPl = locale === "pl";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasStoredConsent()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const decide = (value: "granted" | "denied") => {
    setConsentCookie(value);
    setVisible(false);
    window.location.reload();
  };

  return (
    <section
      aria-label={isPl ? "Zgoda na pliki cookie" : "Cookie consent"}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface-glass p-4 backdrop-blur-xl md:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-text-secondary">
          {isPl ? (
            <>
              Używamy plików cookie do analityki i pomiaru skuteczności reklam (Google Analytics, Meta,
              TikTok) — tylko za Twoją zgodą. Szczegóły w{" "}
              <LocalizedLink href="/privacy" className="text-accent-gold hover:underline">
                Polityce prywatności
              </LocalizedLink>
              .
            </>
          ) : (
            <>
              We use cookies for analytics and ad measurement (Google Analytics, Meta, TikTok) — only with
              your consent. Details in our{" "}
              <LocalizedLink href="/privacy" className="text-accent-gold hover:underline">
                Privacy Policy
              </LocalizedLink>
              .
            </>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-border-subtle px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            {isPl ? "Odrzuć" : "Reject"}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-accent-gold px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            {isPl ? "Akceptuj" : "Accept"}
          </button>
        </div>
      </div>
    </section>
  );
}
