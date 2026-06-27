# Product market variants

Each entry in `products` represents one editorial product family. Marketplace-specific
offers live under `marketVariants` and are selected independently from translated UI copy.

## Same product on both marketplaces

When Amazon.com and Amazon.pl sell the same SKU, keep shared content on the product and
provide marketplace-specific links and price states:

```ts
marketVariants: {
  us: {
    affiliateUrl: "https://amzn.to/us-link",
    price: {
      status: "indicative",
      amount: 19.99,
      currency: "USD",
    },
  },
  pl: {
    affiliateUrl: "https://amzn.to/pl-link",
    price: {
      status: "verified",
      amount: 79.99,
      currency: "PLN",
      checkedAt: "2026-06-23",
    },
  },
},
```

## Similar Polish substitute

When the Polish marketplace uses a different but comparable product, set
`isAlternative: true` and override every fact that differs:

```ts
marketVariants: {
  us: {
    affiliateUrl: "https://amzn.to/us-link",
    marketProductId: "US-ASIN",
    price: {
      status: "indicative",
      amount: 19.99,
      currency: "USD",
    },
  },
  pl: {
    affiliateUrl: "https://amzn.to/pl-link",
    marketProductId: "PL-ASIN",
    isAlternative: true,
    name: "Nazwa polskiego zamiennika",
    benefit: "Korzyść właściwa dla polskiego produktu.",
    description: "Opis zweryfikowany dla polskiej oferty.",
    image: "/products/product-family-id/pl/cover.webp",
    imageAlt: "Opis polskiego produktu na zdjęciu",
    gallery: [
      {
        image: "/products/product-family-id/pl/gallery-01.webp",
        imageAlt: "Polski produkt — widok opakowania",
        title: "Opakowanie",
      },
    ],
    price: {
      status: "verified",
      amount: 89.99,
      currency: "PLN",
      checkedAt: "2026-06-23",
    },
  },
},
```

For a Polish offer whose current price has not been verified yet, explicitly use:

```ts
pl: {
  affiliateUrl: "https://amzn.to/pl-link",
  price: {
    status: "unknown",
    amount: null,
    currency: "PLN",
  },
},
```

The page will then show “Sprawdź cenę na Amazon.pl”. It will never inherit or convert the
price of the US product.

## Image directories

Use market names rather than language names because language and marketplace are separate
concepts:

```text
public/products/<product-family-id>/us/cover.webp
public/products/<product-family-id>/us/gallery-01.webp
public/products/<product-family-id>/pl/cover.webp
public/products/<product-family-id>/pl/gallery-01.webp
```

Shared images for the exact same SKU may remain in the existing product directory. A
substitute must always have its own market-specific images and accurate alternative text.

## Runtime behavior

- Polish locale + `marketVariants.pl`: the complete Polish variant is rendered.
- Polish locale without `marketVariants.pl`: the Amazon.com disclosure screen is shown.
- English locale: the US variant is rendered.
- Affiliate redirects, structured data, search, bundles, related products, and article
  product blocks use the resolved market variant.

## Prices and currency conversion

- Every marketplace keeps its entire price object inside its own variant.
- Every Amazon.pl variant must explicitly use PLN and provide either `status: "verified"`
  with `checkedAt`, or `status: "unknown"` with `amount: null`.
- Existing unverified USD reference amounts use `status: "indicative"`; they are visible as
  estimates but are not emitted as exact Schema.org offers.
- An Amazon.pl substitute never inherits or converts the price of the US product.
- Conversion is used only as secondary context for an Amazon.com offer viewed in Polish,
  for example `$19.99` with `około 74,53 zł` underneath.
- `CURRENCY_API_KEY` enables the frequently refreshed CurrencyAPI quote (cached for 15 minutes).
- Without the key, the helper conversion uses the latest official NBP reference rate
  (cached for 6 hours).
- The converted amount is labelled as an estimate and is never presented as an Amazon.pl
  marketplace price.
