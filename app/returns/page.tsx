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
          ? `Zwroty i dostawa | ${siteMeta.name}`
          : `Shipping & Returns | ${siteMeta.name}`,
    },
    description: translateText(
      locale,
      "Our 14-day EU right of withdrawal, how to request a return, and shipping information for the Lux Aura Care shop."
    ),
    alternates: getLocalizedAlternates("/returns", locale),
    openGraph: {
      url: localizePathname("/returns", locale),
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

export default async function ReturnsPage() {
  const locale = await getRequestLocale();
  const isPl = locale === "pl";

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            {isPl ? "Zwroty i dostawa" : "Shipping & Returns"}
          </h1>
          <p className="text-sm text-text-secondary">
            {isPl ? `Ostatnia aktualizacja: ${LAST_UPDATED_PL}` : `Last updated: ${LAST_UPDATED}`}
          </p>
        </div>

        <div className="space-y-10 rounded-3xl border border-border-subtle bg-surface-glass p-8 backdrop-blur-xl md:p-12">
          {isPl ? (
            <>
              <p className="text-sm text-text-secondary">
                Ta strona dotyczy wyłącznie produktów kupionych bezpośrednio w naszym sklepie (/shop), realizowanych przez Shopify. Zakupy na Amazon podlegają wyłącznie polityce zwrotów Amazon.
              </p>

              <Section title="1. 14-dniowe prawo odstąpienia od umowy">
                <p>
                  Jako konsument z Unii Europejskiej masz prawo odstąpić od umowy zakupu w ciągu 14 dni od otrzymania towaru, bez podawania przyczyny, zgodnie z unijną dyrektywą o prawach konsumenta.
                </p>
              </Section>

              <Section title="2. Jak zgłosić zwrot">
                <p>
                  Napisz do nas na {siteMeta.contactEmail} w ciągu 14 dni od otrzymania zamówienia, podając numer zamówienia i produkt, który chcesz zwrócić. Odpowiemy z dalszymi instrukcjami dotyczącymi wysyłki zwrotnej.
                </p>
              </Section>

              <Section title="3. Stan zwracanego towaru i wyjątek higieniczny">
                <p>
                  Zwracany towar powinien być nieużywany i w oryginalnym opakowaniu. Zgodnie z art. 38 pkt 5 ustawy o prawach konsumenta (odpowiadającym art. 16(e) unijnej dyrektywy 2011/83/UE), prawo odstąpienia <strong>nie przysługuje</strong> w przypadku zapieczętowanych produktów, których po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub higienę — dotyczy to np. otwartych zestawów do dermaplaningu, płatków hydrożelowych lub masek, jeśli zerwano zabezpieczenie higieniczne.
                </p>
              </Section>

              <Section title="4. Zwrot pieniędzy">
                <p>
                  Po otrzymaniu zwracanego towaru zwrot środków na oryginalną metodę płatności następuje w ciągu 14 dni, za pośrednictwem Shopify.
                </p>
              </Section>

              <Section title="5. Dostawa">
                <p>
                  Dostępne metody dostawy, koszty i orientacyjny czas realizacji wyświetlane są w koszyku przed dokonaniem płatności i mogą się różnić w zależności od kraju dostawy.
                </p>
              </Section>

              <Section title="6. Uszkodzony lub niewłaściwy produkt">
                <p>
                  Jeśli otrzymany produkt jest uszkodzony lub niezgodny z zamówieniem, skontaktuj się z nami niezwłocznie na {siteMeta.contactEmail} wraz ze zdjęciami — zaproponujemy wymianę lub zwrot pieniędzy.
                </p>
              </Section>

              <Section title="7. Kontakt">
                <p>W sprawach zwrotów i dostawy pisz na {siteMeta.contactEmail}.</p>
              </Section>
            </>
          ) : (
            <>
              <p className="text-sm text-text-secondary">
                This page applies only to products purchased directly from our shop (/shop), fulfilled through Shopify. Purchases made on Amazon are governed entirely by Amazon&apos;s own return policy.
              </p>

              <Section title="1. Your 14-day right of withdrawal">
                <p>
                  As an EU consumer, you have the right to cancel your order within 14 days of receiving your goods, for any reason and without justification, under the EU Consumer Rights Directive.
                </p>
              </Section>

              <Section title="2. How to request a return">
                <p>
                  Email us at {siteMeta.contactEmail} within 14 days of receiving your order, including your order number and the item you&apos;d like to return. We&apos;ll reply with return shipping instructions.
                </p>
              </Section>

              <Section title="3. Condition of returned goods & the hygiene exception">
                <p>
                  Returned items should generally be unused and in their original packaging. In line with Article 16(e) of EU Directive 2011/83/EU, the right of withdrawal <strong>does not apply</strong> to sealed goods which are not suitable for return for health or hygiene reasons once unsealed — this includes, for example, an opened dermaplaning kit, hydrogel patches, or sheet masks once their hygienic seal has been broken.
                </p>
              </Section>

              <Section title="4. Refunds">
                <p>
                  Once we receive your returned item, refunds are issued to your original payment method within 14 days, processed through Shopify.
                </p>
              </Section>

              <Section title="5. Shipping">
                <p>
                  Available delivery methods, costs, and estimated timing are shown in your cart before you pay, and may vary by destination country.
                </p>
              </Section>

              <Section title="6. Damaged or incorrect items">
                <p>
                  If your item arrives damaged or doesn&apos;t match your order, contact us right away at {siteMeta.contactEmail} with photos — we&apos;ll arrange a replacement or refund.
                </p>
              </Section>

              <Section title="7. Contact">
                <p>For any question about returns or shipping, email {siteMeta.contactEmail}.</p>
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
