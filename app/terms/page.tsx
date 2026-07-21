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
        locale === "pl" ? `Regulamin | ${siteMeta.name}` : `Terms of Service | ${siteMeta.name}`,
    },
    description: translateText(
      locale,
      "The terms that govern your use of Lux Aura Care, including our Amazon affiliate program disclosure."
    ),
    alternates: getLocalizedAlternates("/terms", locale),
    openGraph: {
      url: localizePathname("/terms", locale),
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

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const isPl = locale === "pl";

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            {isPl ? "Regulamin" : "Terms of Service"}
          </h1>
          <p className="text-sm text-text-secondary">
            {isPl ? `Ostatnia aktualizacja: ${LAST_UPDATED_PL}` : `Last updated: ${LAST_UPDATED}`}
          </p>
        </div>

        <div className="space-y-10 rounded-3xl border border-border-subtle bg-surface-glass p-8 backdrop-blur-xl md:p-12">
          {isPl ? (
            <>
              <Section title="1. O nas">
                <p>
                  Lux Aura Care to serwis redakcyjny i sklep internetowy prowadzony pod adresem luxauracare.com, z siedzibą we Wrocławiu, w Polsce. Kontakt: {siteMeta.contactEmail}. Korzystając z serwisu, akceptujesz poniższe warunki.
                </p>
              </Section>

              <Section title="2. Ujawnienie: Program Partnerski Amazon">
                <p>
                  Lux Aura Care jest uczestnikiem Programu Partnerskiego Amazon (Amazon Associates), programu reklamy afiliacyjnej stworzonego, aby umożliwić stronom zarabianie prowizji poprzez linkowanie do Amazon. Jako uczestnik programu Amazon Associates zarabiamy na kwalifikujących się zakupach. Amazon i logo Amazon są znakami towarowymi Amazon.com, Inc. lub podmiotów powiązanych.
                </p>
              </Section>

              <Section title="3. Dwa sposoby zakupów na naszej stronie">
                <p>
                  <strong>Linki partnerskie do Amazon</strong> — kliknięcie linku oznaczonego jako partnerski przenosi Cię na Amazon, gdzie zakup, płatność i dostawa podlegają w całości regulaminowi i polityce Amazon. Nie jesteśmy stroną tej transakcji.
                </p>
                <p>
                  <strong>Zakupy w naszym sklepie (/shop)</strong> — to bezpośrednia sprzedaż między Tobą a Lux Aura Care. Płatność i realizacja zamówienia są obsługiwane przez Shopify.
                </p>
              </Section>

              <Section title="4. Zamówienia i ceny">
                <p>
                  Ceny w naszym sklepie wyświetlane są w euro (EUR) i mogą podlegać przeliczeniu walutowemu przy płatności w zależności od Twojej lokalizacji. Dokładamy starań, aby ceny były prawidłowe, ale zastrzegamy sobie prawo do skorygowania oczywistych błędów przed potwierdzeniem zamówienia.
                </p>
              </Section>

              <Section title="5. Treści redakcyjne">
                <p>
                  Artykuły, poradniki i rekomendacje na naszej stronie mają charakter wyłącznie informacyjny i nie stanowią porady medycznej. Przed użyciem nowych produktów zawsze wykonaj test na małym fragmencie skóry, a w razie wątpliwości dotyczących zdrowia skonsultuj się ze specjalistą.
                </p>
              </Section>

              <Section title="6. Własność intelektualna">
                <p>
                  Treści, znak marki i wygląd strony należą do Lux Aura Care, o ile nie wskazano inaczej. Zdjęcia produktów partnerskich mogą pochodzić od odpowiednich marek lub sprzedawców.
                </p>
              </Section>

              <Section title="7. Ograniczenie odpowiedzialności">
                <p>
                  W zakresie dozwolonym przez prawo Lux Aura Care nie ponosi odpowiedzialności za treści stron trzecich (w tym Amazon i Shopify) ani za skutki stosowania rekomendacji redakcyjnych niezgodnie z ich przeznaczeniem.
                </p>
              </Section>

              <Section title="8. Prawo właściwe">
                <p>
                  Niniejszy regulamin podlega prawu polskiemu, z zastrzeżeniem bezwzględnie obowiązujących przepisów o ochronie konsumentów w Unii Europejskiej.
                </p>
              </Section>

              <Section title="9. Zmiany i kontakt">
                <p>
                  Możemy okresowo aktualizować niniejszy regulamin. Pytania kieruj na {siteMeta.contactEmail}.
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section title="1. About us">
                <p>
                  Lux Aura Care is an editorial site and online shop operated at luxauracare.com, based in Wrocław, Poland. Contact us at {siteMeta.contactEmail}. By using this site, you agree to the terms below.
                </p>
              </Section>

              <Section title="2. Amazon Associates disclosure">
                <p>
                  Lux Aura Care is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
                </p>
              </Section>

              <Section title="3. Two ways to shop with us">
                <p>
                  <strong>Amazon affiliate links</strong> — clicking a link marked as an affiliate link takes you to Amazon, where your purchase, payment, and delivery are governed entirely by Amazon&apos;s own terms and policies. We are not a party to that transaction.
                </p>
                <p>
                  <strong>Purchases in our shop (/shop)</strong> — these are a direct sale between you and Lux Aura Care. Payment and order fulfillment are handled by Shopify.
                </p>
              </Section>

              <Section title="4. Orders and pricing">
                <p>
                  Prices in our shop are displayed in euros (EUR) and may be subject to currency conversion at checkout depending on your location. We make every effort to keep prices accurate but reserve the right to correct obvious errors before an order is confirmed.
                </p>
              </Section>

              <Section title="5. Editorial content">
                <p>
                  Articles, guides, and recommendations on this site are for informational purposes only and are not medical advice. Always patch-test new products, and consult a professional for any health or skin concerns.
                </p>
              </Section>

              <Section title="6. Intellectual property">
                <p>
                  Site content, branding, and design belong to Lux Aura Care unless otherwise credited. Product images for affiliate items may belong to the respective brand or retailer.
                </p>
              </Section>

              <Section title="7. Limitation of liability">
                <p>
                  To the extent permitted by law, Lux Aura Care is not responsible for third-party content (including Amazon and Shopify) or for outcomes resulting from using editorial recommendations outside their intended use.
                </p>
              </Section>

              <Section title="8. Governing law">
                <p>
                  These terms are governed by Polish law, without prejudice to any mandatory EU consumer-protection rules that apply to you.
                </p>
              </Section>

              <Section title="9. Changes and contact">
                <p>We may update these terms from time to time. Questions can be sent to {siteMeta.contactEmail}.</p>
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
