import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDollarSign,
  Globe2,
  RotateCcw,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAffiliateRoute, hasPolishAmazonOffer } from "@/lib/affiliate";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizePathname } from "@/lib/i18n/path";
import { getProductById } from "@/lib/site-data";
import { localizeProduct } from "@/lib/product-localization";

export const metadata: Metadata = {
  title: { absolute: "Zakup na Amazon.com | Lux Aura Care" },
  robots: { index: false, follow: false },
};

type AmazonComNoticePageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AmazonComNoticePage({
  params,
  searchParams,
}: AmazonComNoticePageProps) {
  const [{ productId }, query, locale] = await Promise.all([
    params,
    searchParams,
    getRequestLocale(),
  ]);
  const sourceProduct = getProductById(productId);

  if (!sourceProduct) {
    notFound();
  }

  if (locale !== "pl" || hasPolishAmazonOffer(productId)) {
    redirect(localizePathname(`/favorites/${productId}`, locale));
  }

  const product = localizeProduct(locale, sourceProduct);
  const continueUrl = new URL(
    getAffiliateRoute(productId, firstValue(query.campaign)),
    "https://luxauracare.local"
  );
  continueUrl.searchParams.set("locale", "pl");
  continueUrl.searchParams.set("market", "us");
  continueUrl.searchParams.set("confirmed", "1");

  const source = firstValue(query.source);
  const pin = firstValue(query.pin);
  if (source) continueUrl.searchParams.set("source", source);
  if (pin) continueUrl.searchParams.set("pin", pin);

  const continueHref = `${continueUrl.pathname}${continueUrl.search}`;
  const productHref = localizePathname(`/favorites/${productId}`, locale);

  const details = [
    {
      icon: CircleDollarSign,
      title: "Cena i waluta",
      description: "Cena końcowa może być podana w USD. Amazon pokaże pełne podsumowanie przed zakupem.",
    },
    {
      icon: Truck,
      title: "Dostawa do Polski",
      description: "Dostępność, koszt i przewidywany termin dostawy zależą od sprzedawcy i adresu.",
    },
    {
      icon: RotateCcw,
      title: "Zwroty i obsługa",
      description: "Przed zakupem sprawdź warunki zwrotu oraz informacje o sprzedawcy na stronie oferty.",
    },
  ];

  return (
    <section className="relative isolate flex min-h-[72vh] items-center overflow-hidden px-4 py-14 sm:px-6 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,color-mix(in_srgb,var(--accent-gold)_14%,transparent),transparent_42%)]"
        aria-hidden="true"
      />

      <Card className="mx-auto w-full max-w-5xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-72 overflow-hidden bg-surface-subtle lg:min-h-full">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                Wybrany produkt
              </p>
              <p className="mt-2 font-heading text-2xl leading-tight text-white">{product.name}</p>
            </div>
          </div>

          <div className="p-6 sm:p-9 lg:p-12">
            <Badge className="gap-2">
              <Globe2 className="size-3.5" aria-hidden="true" />
              Amazon.com · sklep zagraniczny
            </Badge>

            <h1 className="mt-6 max-w-xl font-heading text-3xl leading-tight sm:text-4xl">
              Ten produkt nie jest obecnie dostępny na Amazon.pl
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-text-secondary">
              Możesz sprawdzić tę samą rekomendację na Amazon.com. Zanim przejdziesz dalej,
              zwróć uwagę na poniższe różnice związane z zakupem międzynarodowym.
            </p>

            <div className="mt-7 grid gap-3">
              {details.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border-subtle bg-surface-subtle p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-gold/12 text-accent-gold">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:flex-1">
                <a href={continueHref} rel="sponsored nofollow">
                  Przejdź do Amazon.com
                  <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="sm:flex-1">
                <Link href={productHref}>
                  <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                  Wróć do produktu
                </Link>
              </Button>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-text-secondary">
              Link partnerski: możemy otrzymać prowizję od kwalifikującego się zakupu, bez
              dodatkowych kosztów dla Ciebie. Decyzję o zakupie podejmujesz bezpośrednio w Amazon.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
