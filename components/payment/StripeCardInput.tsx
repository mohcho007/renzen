"use client";

import { CardElement } from "@stripe/react-stripe-js";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import styles from "./StripeCardInput.module.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#0f172a",
      fontFamily:
        'var(--font-plus-jakarta-sans), "Plus Jakarta Sans", system-ui, sans-serif',
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#b91c1c",
    },
  },
  hidePostalCode: true,
} as const;

type StripeCardInputProps = {
  id?: string;
  className?: string;
  onChange?: (event: StripeCardElementChangeEvent) => void;
  errorMessage?: string | null;
};

export function StripeCardInput({
  id = "stripe-card-element",
  className,
  onChange,
  errorMessage,
}: StripeCardInputProps) {
  return (
    <div className={className}>
      <div id={id} className={styles.shell}>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={onChange} />
      </div>
      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
