"use client";

import Image from "next/image";
import { ArrowRight, MessageCircle, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { Container } from "@/components/container";
import { LocalizedLink } from "@/components/localized-link";
import { useI18n } from "@/components/i18n-provider";
import type { ShopProduct } from "@/lib/shop-data";
import type { ShopPageProfile } from "@/lib/shop-page-engine";

const spacing = "px-4 sm:px-5 md:px-10 lg:px-16";
const eyebrow = "text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold sm:text-xs";
const heading = "font-serif text-2xl font-semibold leading-tight text-text-primary sm:text-3xl lg:text-4xl";

const demonstrationMedia: Record<string, {
  before: string;
  caption: { pl: string; en: string };
  inUse?: string;
}> = {
  "clear-skin-patches": { before: "/product-demonstrations/clear-skin-patches-before.webp", caption: { pl: "Przykładowa niedoskonałość przed nałożeniem plastra.", en: "An example blemish before applying a patch." } },
  "gold-eye-patches": { before: "/product-demonstrations/gold-eye-patches-before.webp", inUse: "/product-demonstrations/gold-eye-patches-in-use.webp", caption: { pl: "Okolica oczu przed założeniem płatków.", en: "The eye area before applying the patches." } },
  "gua-sha-jade-roller-set": { before: "/product-demonstrations/gua-sha-jade-roller-set-before.webp", inUse: "/product-demonstrations/gua-sha-jade-roller-set-in-use.webp", caption: { pl: "Twarz przed rozpoczęciem masażu rollerem.", en: "The face before a roller massage." } },
  "vibro-glow-face-massager": { before: "/product-demonstrations/vibro-glow-face-massager-before.webp", caption: { pl: "Twarz przed krótkim masażem wibracyjnym.", en: "The face before a short vibrating massage." } },
  "centella-collagen-sleep-masks": { before: "/product-demonstrations/centella-collagen-sleep-masks-before.webp", caption: { pl: "Twarz przed wieczorną pielęgnacją.", en: "The face before an evening skincare routine." } },
  "resin-body-gua-sha-tool": { before: "/product-demonstrations/resin-body-gua-sha-tool-before.webp", caption: { pl: "Skóra ramienia przed masażem ciała.", en: "Arm skin before a body massage." } },
  "natural-bristle-spa-brush": { before: "/product-demonstrations/natural-bristle-spa-brush-before.webp", caption: { pl: "Trudno dostępne plecy przed szczotkowaniem.", en: "A hard-to-reach back before brushing." } },
  "exfoliating-spa-body-brush": { before: "/product-demonstrations/exfoliating-spa-body-brush-before.webp", caption: { pl: "Sucha skóra ramienia przed szczotkowaniem.", en: "Dry arm skin before brushing." } },
  "ice-face-roller-gua-sha-set": { before: "/product-demonstrations/ice-face-roller-gua-sha-set-before.webp", caption: { pl: "Okolica oczu przed chłodzącym masażem.", en: "The eye area before a cooling massage." } },
  "seaweed-collagen-crystal-mask": { before: "/product-demonstrations/seaweed-collagen-crystal-mask-before.webp", caption: { pl: "Twarz przed nałożeniem maski.", en: "The face before applying the mask." } },
  "floral-grace-maxi-dress": { before: "/product-demonstrations/floral-grace-maxi-dress-before.webp", caption: { pl: "Przykładowa stylizacja przed założeniem sukienki.", en: "An example outfit before putting on the dress." } },
  "lux-aura-face-roller-gua-sha-set": { before: "/product-demonstrations/lux-aura-face-roller-gua-sha-set-black-before.webp", caption: { pl: "Twarz przed masażem zestawem do pielęgnacji.", en: "The face before a massage with the skincare set." } },
};

export function ProductTrustStrip({ product }: { product: ShopProduct }) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  const hasReviews = Boolean(product.reviews?.length && product.rating);
  const items = [
    { icon: hasReviews ? Star : MessageCircle,
      title: hasReviews ? `${product.rating!.value}/5 · ${product.rating!.count} ${pl ? "opinii u dostawcy" : "supplier reviews"}` : pl ? "Masz pytanie o produkt?" : "A question about this product?",
      detail: hasReviews ? pl ? "Sprawdź źródło i treść opinii" : "Read the source and review details" : pl ? "Porozmawiaj z Lux Aura Care" : "Contact Lux Aura Care",
      href: hasReviews ? "#customer-reviews" : "/contact" },
    { icon: ShieldCheck, title: pl ? "Bezpieczna płatność" : "Secure payment", detail: pl ? "Zamówienie obsługiwane przez Shopify" : "Checkout powered by Shopify", href: "#purchase-assurance" },
    { icon: PackageCheck, title: pl ? "Jasne zasady zwrotu" : "Clear return terms", detail: pl ? "Poznaj warunki przed zakupem" : "Read the terms before ordering", href: "/returns" },
  ];
  return <section data-product-section="social-proof" className="border-y border-border-subtle bg-surface-subtle/60">
    <Container className={spacing}>
      <div className="mx-auto grid max-w-6xl divide-y divide-border-subtle md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map(({ icon: Icon, title, detail, href }) => <LocalizedLink key={title} href={href} className="group flex items-center gap-3 py-5 md:px-6 first:md:pl-0">
          <Icon className="size-5 shrink-0 text-accent-gold" aria-hidden="true" />
          <div><p className="text-xs font-semibold text-text-primary group-hover:underline">{title}</p><p className="mt-1 text-[11px] text-text-secondary">{detail}</p></div>
        </LocalizedLink>)}
      </div>
    </Container>
  </section>;
}

export function ProductStorySections({ product, profile }: { product: ShopProduct; profile: ShopPageProfile }) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  const isSignatureSet = product.id === "lux-aura-face-roller-gua-sha-set";
  const image = isSignatureSet
    ? product.gallery?.find((item) => /packaging/i.test(`${item.label} ${item.url}`)) ?? product.gallery?.[0]
    : product.gallery?.[2] ?? product.gallery?.[0];
  const signatureDetails = isSignatureSet
    ? [
        {
          image: product.gallery?.find((item) => /black-stone.*front|black.*front/i.test(`${item.label} ${item.url}`)),
          title: pl ? "Dwa narzędzia w zestawie" : "Two tools in the set",
          detail: pl ? "Dwustronny roller i dopasowana płytka gua sha." : "A double-ended roller and a matching gua sha tool.",
        },
        {
          image: product.gallery?.find((item) => /rose-quartz.*front|rose.*front/i.test(`${item.label} ${item.url}`)),
          title: pl ? "Wybierz wykończenie" : "Choose your finish",
          detail: pl ? "Czarny kamień ze złotymi detalami lub różowy kamień z detalami w odcieniu różowego złota." : "Black stone with gold details or rose quartz with rose-gold details.",
        },
        {
          image: product.gallery?.find((item) => /in-use|roller-in-use/i.test(`${item.label} ${item.url}`)),
          title: pl ? "Masaż z serum lub olejkiem" : "Massage with serum or oil",
          detail: pl ? "Zobacz profil narzędzia w użyciu. Stosuj lekki nacisk i zapewnij skórze poślizg." : "See the tool in use. Keep pressure light and use enough slip on the skin.",
        },
      ]
    : [];
  return <section className="border-b border-border-subtle py-12 sm:py-16">
    <Container className={spacing}>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div className="relative aspect-[4/3] max-h-[440px] overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle">
          <Image src={image?.url ?? product.image} alt={`${product.name} — ${image?.label ?? product.imageAlt}`} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-contain" />
        </div>
        <div className="space-y-7">
          <div data-product-section="problem">
            <p className={eyebrow}>{pl ? "Dopasowane do codzienności" : "Made for your everyday"}</p>
            <h2 className={`${heading} mt-3`}>{profile.problem}</h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary">{profile.context}</p>
          </div>
          <div data-product-section="solution" className="border-l-2 border-accent-gold pl-5">
            <h3 className="font-serif text-xl font-semibold text-text-primary">{profile.solution}</h3>
            <p className="mt-2 text-sm leading-7 text-text-secondary">{profile.description}</p>
          </div>
        </div>
      </div>
      {signatureDetails.length > 0 && <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
        {signatureDetails.map(({ image: detailImage, title, detail }) => <article key={title} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle/40">
          <div className="relative aspect-[4/3] bg-surface-subtle">
            <Image src={detailImage?.url ?? product.image} alt={`${product.name} — ${detailImage?.label ?? title}`} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-contain p-3" />
          </div>
          <div className="p-5"><h3 className="text-sm font-semibold text-text-primary">{title}</h3><p className="mt-2 text-xs leading-6 text-text-secondary">{detail}</p></div>
        </article>)}
      </div>}
    </Container>
  </section>;
}

export function ProductUseDemonstration({ product, profile, fashion, variantId }: { product: ShopProduct; profile: ShopPageProfile; fashion: boolean; variantId?: string }) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  const isSignatureSet = product.id === "lux-aura-face-roller-gua-sha-set";
  const demonstration = demonstrationMedia[product.id];
  const selectedProductImage = isSignatureSet
    ? product.gallery?.find((item) => variantId === "rose-quartz"
      ? /rose-quartz-roller-gua-sha-front/i.test(item.url)
      : /black-roller-gua-sha-front/i.test(item.url))
    : undefined;
  const productImage = selectedProductImage
    ?? product.gallery?.find((item) => /flat-lay|whats-inside/i.test(item.url) || /flat lay|what.s inside/i.test(item.label))
    ?? product.gallery?.find((item) => /main-product-photo/i.test(item.url) || /product photo|product|luxe set/i.test(item.label))
    ?? product.gallery?.[0];
  const selectedFinishImage = isSignatureSet
    ? product.gallery?.find((item) => variantId === "rose-quartz"
      ? /rose-quartz-face-roller-in-use/i.test(item.url)
      : /black-gua-sha-in-use/i.test(item.url))
    : undefined;
  const useImage = selectedFinishImage ?? product.gallery?.find((item) => item.url !== productImage?.url
    && /in-use|application|how-to-use|usage|daily-ritual|evening-ritual|night-routine|lifestyle-(?:cheek-use|usage|application)|(?:back-massage|body-exfoliation|body-massage)-lifestyle|rolling/i.test(item.url)
  );
  const secondaryImage = useImage
    ?? product.gallery?.find((item) => item.url !== productImage?.url)
    ?? productImage;
  const selectedDressVariant = fashion ? product.variants?.find((variant) => variant.id === variantId) ?? product.variants?.[0] : undefined;
  const beforeUrl = isSignatureSet && variantId === "rose-quartz"
    ? "/product-demonstrations/lux-aura-face-roller-gua-sha-set-rose-before.webp"
    : demonstration?.before;
  const preparedImage = beforeUrl
    ? { url: beforeUrl, label: pl ? "Przykładowa modelka przed użyciem" : "Illustrative model before use" }
    : productImage;
  const inUseImage = selectedDressVariant
    ? { url: selectedDressVariant.image, label: selectedDressVariant.imageAlt }
    : demonstration?.inUse
      ? { url: demonstration.inUse, label: pl ? "Przykładowe użycie produktu" : "Illustrative product use" }
      : secondaryImage;
  const comparisonHeading = fashion
    ? pl ? "Od codziennego stroju do wybranej sukienki" : "From everyday outfit to your chosen dress"
    : pl ? "Przed użyciem i w trakcie pielęgnacji" : "Before use and during your routine";
  return <section id="product-demonstration" data-product-section="product-demonstration" aria-labelledby="routine-comparison-title" className="scroll-mt-24 border-b border-border-subtle bg-surface-subtle/35 py-12 sm:py-16">
    <Container className={spacing}>
      <div className="mx-auto max-w-5xl">
        <p className={eyebrow}>{fashion ? (pl ? "Stylizacja w praktyce" : "Styling in practice") : (pl ? "Przed użyciem / w praktyce" : "Before use / in practice")}</p>
        <h2 id="routine-comparison-title" className={`${heading} mt-3`}>{comparisonHeading}</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {[
            { image: preparedImage, label: fashion ? pl ? "Przed stylizacją" : "Before styling" : pl ? "Przed użyciem" : "Before use", detail: demonstration?.caption[pl ? "pl" : "en"] ?? profile.before },
            { image: inUseImage, label: fashion ? pl ? "Wybrany wariant" : "Selected variant" : pl ? "W pielęgnacji" : "In the routine", detail: fashion ? (selectedDressVariant?.label ?? profile.after) : profile.after },
          ].map(({ image: item, label, detail }, index) => <figure key={`${index}-${item?.url ?? product.id}`} className={`overflow-hidden rounded-2xl border bg-background-primary ${index === 1 ? "border-accent-gold/40 shadow-sm" : "border-border-subtle"}`}>
            <div className={`relative overflow-hidden bg-[#eee7dc] ${fashion ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={item?.url ?? product.image} alt={`${product.name} — ${item?.label ?? label}`} fill sizes="(max-width: 639px) 94vw, (max-width: 1023px) 46vw, 480px" className="object-contain p-2 sm:p-4" />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm ${index === 0 ? "bg-black/70 text-white" : "bg-white/95 text-stone-900"}`}>{label}</span>
            </div>
            <figcaption className="min-h-24 px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-sm font-semibold leading-6 text-text-primary">{detail}</p>
            </figcaption>
          </figure>)}
        </div>
        <p className="mt-4 text-xs leading-6 text-text-secondary">{fashion
          ? pl ? "Inspiracja stylizacyjna · po prawej wariant sukienki wybrany powyżej." : "Styling inspiration · your selected dress variant appears on the right."
          : pl ? "Przykładowe ujęcia: skóra przed pielęgnacją i produkt w użyciu. Rezultaty mogą się różnić." : "Illustrative scenes: skin before the routine and the product in use. Individual results may vary."}</p>
      </div>
    </Container>
  </section>;
}

export function ProductComparisonTable({ product, profile }: { product: ShopProduct; profile: ShopPageProfile }) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  return <section data-product-section="comparison" className="border-b border-border-subtle bg-surface-subtle/35 py-12 sm:py-16">
    <Container className={spacing}>
      <div className="mx-auto max-w-5xl">
        <p className={eyebrow}>{pl ? "Świadomy wybór" : "A considered choice"}</p>
        <h2 className={`${heading} mt-3`}>{pl ? "Porównaj zastosowanie, wybierz dla siebie" : "Compare the use. Find your fit."}</h2>
        <div className="mt-7 overflow-hidden rounded-2xl border border-border-subtle">
          <table className="w-full table-fixed text-left text-xs leading-6 sm:text-sm">
            <caption className="sr-only">{product.name} / {profile.alternative}</caption>
            <thead><tr className="border-b border-border-subtle">
              <th scope="col" className="w-[24%] p-3 font-medium text-text-secondary sm:p-5">{pl ? "Cecha" : "Feature"}</th>
              <th scope="col" className="bg-accent-gold/10 p-3 font-semibold text-text-primary sm:p-5">{product.name}</th>
              <th scope="col" className="p-3 font-medium text-text-secondary sm:p-5">{profile.alternative}</th>
            </tr></thead>
            <tbody>{profile.comparison.map(([feature, item, alternative]) => <tr key={feature} className="border-b border-border-subtle last:border-0">
              <th scope="row" className="break-words p-3 font-medium text-text-primary sm:p-5">{feature}</th>
              <td className="break-words bg-accent-gold/[0.04] p-3 text-text-primary sm:p-5">{item}</td>
              <td className="break-words p-3 text-text-secondary sm:p-5">{alternative}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </Container>
  </section>;
}

export function ProductPurchaseAssurance({ fulfillment }: Pick<ShopProduct, "fulfillment">) {
  const { locale } = useI18n();
  const pl = locale === "pl";
  const shippingDescription = fulfillment === "owner"
    ? pl
      ? "Ten zestaw marki Lux Aura Care mamy we własnym zapasie — pakujemy go i wysyłamy osobiście. Dostawa standardowa do Polski jest bezpłatna, niezależnie od wartości zamówienia."
      : "We hold our signature set in our own stock, and personally pack and dispatch each order. Standard delivery to Poland is free, with no minimum order."
    : pl
      ? "Dostawa standardowa do Polski jest bezpłatna, niezależnie od wartości zamówienia — pokrywamy jej koszt. Produkt wysyła nasz dostawca, dlatego czas transportu zależy od produktu i kraju doręczenia."
      : "Standard delivery to Poland is free, with no minimum order — we cover the shipping cost. Your product ships from our supplier, so transit time depends on the product and destination.";
  return <section id="purchase-assurance" className="border-b border-border-subtle py-12 sm:py-16">
    <Container className={spacing}>
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        <article data-product-section="guarantee" className="rounded-2xl border border-border-subtle p-6 sm:p-8">
          <ShieldCheck className="mb-5 size-6 text-accent-gold" aria-hidden="true" />
          <h2 className="font-serif text-2xl font-semibold text-text-primary">{pl ? "Spokojny zakup, jasne zasady" : "Buy with clear terms"}</h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">{pl ? "Zgodnie z naszą polityką konsumentom z UE przysługuje 14 dni na odstąpienie od umowy. Wyjątek dotyczy m.in. zapieczętowanych produktów higienicznych po otwarciu. Jeśli otrzymasz uszkodzony lub niewłaściwy produkt, pomożemy w wymianie lub zwrocie środków." : "Our policy gives EU consumers 14 days to withdraw from their purchase, with exceptions including unsealed hygiene-sensitive goods. If an item arrives damaged or incorrect, contact us for help with a replacement or refund."}</p>
          <LocalizedLink href="/returns" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent-gold underline underline-offset-4">{pl ? "Warunki zwrotu i reklamacji" : "Return and issue resolution terms"}<ArrowRight className="size-3.5" aria-hidden="true" /></LocalizedLink>
        </article>
        <article id="product-shipping" data-product-section="shipping" className="scroll-mt-28 rounded-2xl border border-border-subtle bg-surface-subtle p-6 sm:p-8">
          <Truck className="mb-5 size-6 text-accent-gold" aria-hidden="true" />
          <h2 className="font-serif text-2xl font-semibold text-text-primary">{pl ? "Dostawa Twojego zamówienia" : "Delivery of your order"}</h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">{shippingDescription}</p>
          <dl className="mt-5 divide-y divide-border-subtle border-y border-border-subtle text-xs sm:text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-text-secondary">{pl ? "Standardowa · Polska" : "Standard · Poland"}</dt><dd className="shrink-0 font-semibold text-accent-gold">{pl ? "Bezpłatna" : "Free"}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-text-secondary">{pl ? "Ekspresowa · Polska" : "Express · Poland"}</dt><dd className="shrink-0 font-semibold text-text-primary">{pl ? "65 zł" : "65 PLN"}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-6 text-text-secondary">{pl ? "Ekspres jest opcją dodatkowo płatną. Dostępne metody zobaczysz po podaniu adresu w kasie; możliwość szybszej wysyłki zależy od produktu i przewoźnika. Dostawy poza Polskę są rozliczane według stawek pokazanych w kasie." : "Express is a paid option. Enter your address at checkout to see delivery methods; faster shipping depends on the product and carrier. Delivery outside Poland is charged at the rates shown at checkout."}</p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{pl ? "Potrzebujesz produktu na konkretny dzień? Skontaktuj się z nami przed zakupem." : "Need it for a particular date? Contact us before ordering."}</p>
          <LocalizedLink href="/contact" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent-gold underline underline-offset-4">{pl ? "Zapytaj o dostawę" : "Ask about delivery"}<ArrowRight className="size-3.5" aria-hidden="true" /></LocalizedLink>
        </article>
      </div>
    </Container>
  </section>;
}
