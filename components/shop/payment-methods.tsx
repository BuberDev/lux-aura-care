"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/components/i18n-provider";

export function PaymentMethods() {
  const { text } = useI18n();

  return (
    <section className="pt-1 text-center" aria-labelledby="payment-methods-heading">
      <p
        id="payment-methods-heading"
        className="inline-block text-[11px] font-medium text-text-secondary underline decoration-border-strong underline-offset-4"
      >
        {text("More payment options")}
      </p>

      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-text-primary sm:gap-x-4"
        aria-label={text("Payment methods available at checkout")}
      >
        <PaymentMark label="American Express"><AmexMark /></PaymentMark>
        <PaymentMark label="Apple Pay"><ApplePayMark /></PaymentMark>
        <PaymentMark label="BLIK"><BlikMark /></PaymentMark>
        <PaymentMark label="Google Pay"><GooglePayMark /></PaymentMark>
        <PaymentMark label="Klarna"><KlarnaMark /></PaymentMark>
        <PaymentMark label="Maestro"><MaestroMark /></PaymentMark>
        <PaymentMark label="Mastercard"><MastercardMark /></PaymentMark>
        <PaymentMark label="PayPal"><PayPalMark /></PaymentMark>
        <PaymentMark label="Shop Pay"><ShopPayMark /></PaymentMark>
        <PaymentMark label="UnionPay"><UnionPayMark /></PaymentMark>
        <PaymentMark label="Visa"><VisaMark /></PaymentMark>
      </div>

      <p className="sr-only">
        {text("Available methods are confirmed before you complete the order.")}
      </p>
    </section>
  );
}

function PaymentMark({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <span className="flex h-5 min-w-8 items-center justify-center" role="img" aria-label={label}>
      {children}
    </span>
  );
}

function AmexMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 48 28" aria-hidden="true">
      <rect width="48" height="28" rx="3" fill="#0877C9" />
      <text x="5" y="18.5" fill="#fff" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900">AM</text>
      <text x="5" y="25" fill="#fff" fontFamily="Arial, sans-serif" fontSize="8.2" fontWeight="900">EX</text>
    </svg>
  );
}

function ApplePayMark() {
  return (
    <svg className="h-4 w-auto text-current" viewBox="0 0 57 24" aria-hidden="true">
      <g fill="currentColor">
        <path d="M11.8 7.15c-1.18-.07-2.62.68-3.27.68-.69 0-1.75-.64-2.82-.62-1.45.02-2.79.84-3.54 2.13-1.53 2.65-.39 6.56 1.08 8.7.72 1.03 1.56 2.18 2.67 2.14 1.07-.04 1.48-.69 2.78-.69 1.28 0 1.65.69 2.78.66 1.17-.02 1.91-1.04 2.6-2.08.83-1.19 1.16-2.36 1.17-2.42-.03-.01-2.25-.87-2.27-3.45-.02-2.17 1.77-3.2 1.85-3.25a4.02 4.02 0 0 0-3.03-1.8Z" />
        <path d="M10.95 3.58a4.08 4.08 0 0 0-2.64 1.36 3.77 3.77 0 0 0-.96 2.75 3.4 3.4 0 0 0 2.57-1.31 3.93 3.93 0 0 0 1.03-2.8Z" />
      </g>
      <text x="18" y="18" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">Pay</text>
    </svg>
  );
}

function BlikMark() {
  return (
    <svg className="h-3.5 w-auto" viewBox="0 0 43 20" aria-hidden="true">
      <text x="0" y="16" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="900">BLIK</text>
      <circle cx="24.3" cy="3.2" r="2.3" fill="#E31E24" />
    </svg>
  );
}

function GooglePayMark() {
  return (
    <svg className="h-3.5 w-auto" viewBox="0 0 53 20" aria-hidden="true">
      <text x="0" y="16" fill="#4285F4" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700">G</text>
      <text x="15" y="16" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="600">Pay</text>
    </svg>
  );
}

function KlarnaMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 55 28" aria-hidden="true">
      <rect width="55" height="28" rx="3" fill="#FFB3C7" />
      <text x="6" y="18" fill="#17120D" fontFamily="Arial, sans-serif" fontSize="11.5" fontWeight="800">Klarna.</text>
    </svg>
  );
}

function MaestroMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 46 28" aria-hidden="true">
      <circle cx="18" cy="14" r="12" fill="#0099DF" />
      <circle cx="28" cy="14" r="12" fill="#ED1C24" fillOpacity=".92" />
      <path d="M23 4.57A12 12 0 0 1 23 23.43 12 12 0 0 1 23 4.57Z" fill="#7752A1" />
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 46 28" aria-hidden="true">
      <circle cx="18" cy="14" r="12" fill="#EB001B" />
      <circle cx="28" cy="14" r="12" fill="#F79E1B" />
      <path d="M23 4.57A12 12 0 0 1 23 23.43 12 12 0 0 1 23 4.57Z" fill="#FF5F00" />
    </svg>
  );
}

function PayPalMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 34 28" aria-hidden="true">
      <path d="M11.2 3h10.2c5.1 0 7.1 2.5 6.3 6.4-1 5.3-4.6 7.3-9.2 7.3h-2.7L14.5 24H8.8L11.2 3Z" fill="#003087" />
      <path d="M15.6 7.1h8.2c4.2 0 5.8 2.1 5.1 5.3-.8 4.3-3.8 6-7.5 6h-2.2l-1 5.6h-4.7l2.1-16.9Z" fill="#009CDE" fillOpacity=".9" />
    </svg>
  );
}

function ShopPayMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 57 28" aria-hidden="true">
      <rect width="57" height="28" rx="4" fill="#5A31F4" />
      <text x="7" y="18" fill="#fff" fontFamily="Arial, sans-serif" fontSize="11.5" fontWeight="800">shop</text>
      <text x="36" y="18" fill="#fff" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="700">pay</text>
    </svg>
  );
}

function UnionPayMark() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 58 28" aria-hidden="true">
      <path d="M7 1h19l-5 26H2L7 1Z" fill="#D9252A" />
      <path d="M19 1h20l-5 26H14l5-26Z" fill="#1769AA" />
      <path d="M34 1h20l-5 26H29l5-26Z" fill="#159A79" />
      <text x="8" y="17.5" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7.1" fontWeight="800">UnionPay</text>
    </svg>
  );
}

function VisaMark() {
  return (
    <svg className="h-3.5 w-auto" viewBox="0 0 60 22" aria-hidden="true">
      <text x="1" y="18" fill="#2453C5" fontFamily="Arial, sans-serif" fontSize="21" fontStyle="italic" fontWeight="900">VISA</text>
    </svg>
  );
}
