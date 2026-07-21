import React from "react";
import { Metadata } from "next";
import { siteMeta } from "@/lib/site-data";
import { getLocalizedAlternates, localizePathname } from "@/lib/i18n/path";
import { getRequestLocale } from "@/lib/i18n/request";
import { translateText } from "@/lib/i18n/messages";

const LAST_UPDATED = "21 July 2026";
const LAST_UPDATED_PL = "21 lipca 2026";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: {
      absolute:
        locale === "pl"
          ? `Polityka prywatności | ${siteMeta.name}`
          : `Privacy Policy | ${siteMeta.name}`,
    },
    description: translateText(
      locale,
      "How Lux Aura Care collects, uses, and protects your personal data."
    ),
    alternates: getLocalizedAlternates("/privacy", locale),
    openGraph: {
      url: localizePathname("/privacy", locale),
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-semibold text-text-primary md:text-2xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-text-secondary md:text-base">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const isPl = locale === "pl";

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            {isPl ? "Polityka prywatności" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-text-secondary">
            {isPl ? `Ostatnia aktualizacja: ${LAST_UPDATED_PL}` : `Last updated: ${LAST_UPDATED}`}
          </p>
        </div>

        <div className="space-y-10 rounded-3xl border border-border-subtle bg-surface-glass p-8 backdrop-blur-xl md:p-12">
          {isPl ? (
            <>
              <Section title="1. Kto przetwarza Twoje dane">
                <p>
                  Operatorem strony luxauracare.com jest Lux Aura Care („my”, „nas”), z siedzibą we Wrocławiu, w Polsce.
                  Kontakt: <a className="text-accent-gold hover:underline" href={`mailto:${siteMeta.contactEmail}`}>{siteMeta.contactEmail}</a>.
                </p>
                <p>
                  Pełne dane rejestrowe podmiotu (forma prawna, numer NIP/REGON) udostępniamy na żądanie pod powyższym adresem e-mail.
                </p>
              </Section>

              <Section title="2. Jakie dane zbieramy">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Formularz kontaktowy</strong> — imię, adres e-mail i treść wiadomości, które sam(a) nam przekazujesz.
                  </li>
                  <li>
                    <strong>Newsletter</strong> — adres e-mail podany przy zapisie do newslettera.
                  </li>
                  <li>
                    <strong>Zamówienia w naszym sklepie</strong> — dane zamówienia i płatności są zbierane i przetwarzane bezpośrednio przez Shopify, naszego operatora płatności i realizacji zamówień. Nie przechowujemy danych Twojej karty płatniczej.
                  </li>
                  <li>
                    <strong>Zakupy na Amazon</strong> — jeśli klikniesz link partnerski prowadzący do Amazon, Twój zakup tam podlega wyłącznie polityce prywatności Amazon. Otrzymujemy jedynie zanonimizowaną informację o tym, czy doszło do sprzedaży, bez Twoich danych osobowych.
                  </li>
                  <li>
                    <strong>Analityka i pliki cookie</strong> — gdy są aktywne, możemy korzystać z Google Analytics (GA4), Meta Pixel i TikTok Pixel, aby rozumieć ruch na stronie i mierzyć skuteczność naszych działań marketingowych. Narzędzia te mogą zapisywać pliki cookie i zbierać informacje takie jak odwiedzane podstrony, typ urządzenia czy przybliżona lokalizacja.
                  </li>
                </ul>
              </Section>

              <Section title="3. Podstawa prawna przetwarzania (RODO)">
                <p>
                  Przetwarzamy Twoje dane na podstawie: zgody (newsletter, pliki cookie), wykonania umowy (obsługa zamówienia poprzez Shopify) oraz prawnie uzasadnionego interesu (analiza ruchu na stronie, bezpieczeństwo).
                </p>
              </Section>

              <Section title="4. Komu udostępniamy dane">
                <p>
                  Współpracujemy z zaufanymi dostawcami: Shopify Inc. (płatności i realizacja zamówień), Resend (wysyłka e-maili transakcyjnych i newslettera), Amazon Associates (śledzenie afiliacyjne, dane zbiorcze), dostawcami analityki (Google, Meta, TikTok) — gdy aktywni, oraz Vercel (hosting strony).
                </p>
              </Section>

              <Section title="5. Jak długo przechowujemy dane">
                <p>
                  Dane kontaktowe i newsletterowe przechowujemy tak długo, jak jest to potrzebne do świadczenia naszych usług, lub do momentu, w którym poprosisz o ich usunięcie.
                </p>
              </Section>

              <Section title="6. Twoje prawa">
                <p>
                  Zgodnie z RODO masz prawo do: dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, sprzeciwu wobec przetwarzania, przenoszenia danych oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO, uodo.gov.pl).
                </p>
                <p>
                  Aby skorzystać z któregokolwiek z tych praw, napisz do nas na {siteMeta.contactEmail}.
                </p>
              </Section>

              <Section title="7. Zmiany w polityce">
                <p>
                  Możemy okresowo aktualizować tę politykę. Data ostatniej aktualizacji widoczna jest na górze strony.
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section title="1. Who we are">
                <p>
                  luxauracare.com is operated by Lux Aura Care (&quot;we&quot;, &quot;us&quot;), based in Wrocław, Poland.
                  Contact us at{" "}
                  <a className="text-accent-gold hover:underline" href={`mailto:${siteMeta.contactEmail}`}>
                    {siteMeta.contactEmail}
                  </a>
                  .
                </p>
                <p>Full company registration details are available on request at the email above.</p>
              </Section>

              <Section title="2. Information we collect">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Contact form</strong> — your name, email address, and message when you contact us directly.
                  </li>
                  <li>
                    <strong>Newsletter</strong> — the email address you provide when subscribing.
                  </li>
                  <li>
                    <strong>Orders placed in our shop</strong> — order and payment details are collected and processed directly by Shopify, our checkout and fulfillment provider. We never store your card details ourselves.
                  </li>
                  <li>
                    <strong>Purchases on Amazon</strong> — if you follow one of our affiliate links to Amazon, that purchase is governed entirely by Amazon&apos;s own privacy policy. We only receive anonymized information about whether a sale occurred, never your personal details.
                  </li>
                  <li>
                    <strong>Analytics &amp; cookies</strong> — when enabled, we may use Google Analytics (GA4), the Meta Pixel, and the TikTok Pixel to understand how the site is used and to measure our marketing. These tools may set cookies and collect information such as pages viewed, device type, and approximate location.
                  </li>
                </ul>
              </Section>

              <Section title="3. Legal basis for processing (GDPR)">
                <p>
                  We process your data based on: your consent (newsletter, cookies), the performance of a contract (fulfilling your order through Shopify), and our legitimate interest (site analytics, security).
                </p>
              </Section>

              <Section title="4. Who we share data with">
                <p>
                  We work with trusted providers: Shopify Inc. (payments and order fulfillment), Resend (transactional and newsletter email delivery), Amazon Associates (aggregate affiliate tracking only), analytics providers (Google, Meta, TikTok) when active, and Vercel (site hosting).
                </p>
              </Section>

              <Section title="5. How long we keep your data">
                <p>
                  We retain contact and newsletter data for as long as necessary to provide our services, or until you ask us to delete it.
                </p>
              </Section>

              <Section title="6. Your rights">
                <p>
                  Under GDPR you have the right to access, correct, delete, or restrict the processing of your data, to object to processing, to data portability, and to lodge a complaint with Poland&apos;s data protection authority (UODO, uodo.gov.pl).
                </p>
                <p>To exercise any of these rights, email us at {siteMeta.contactEmail}.</p>
              </Section>

              <Section title="7. Changes to this policy">
                <p>We may update this policy from time to time. The date at the top of this page reflects the latest revision.</p>
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
