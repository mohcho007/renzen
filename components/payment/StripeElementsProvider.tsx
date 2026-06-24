"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useMemo, type ReactNode } from "react";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripePromise(publishableKey: string): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export function StripeElementsProvider({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  const stripe = useMemo(
    () => (publishableKey ? getStripePromise(publishableKey) : null),
    [publishableKey],
  );

  if (!publishableKey || !stripe) {
    return (
      <div
        role="alert"
        style={{
          margin: "1rem 0",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #fecaca",
          background: "#fef2f2",
          color: "#991b1b",
          fontSize: "0.9rem",
        }}
      >
        Stripe er ikke konfigureret. Tilføj{" "}
        <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> (pk_live_…) i{" "}
        <code>.env.local</code> — samme nøgle som i Launch27 / WordPress-plugin.
      </div>
    );
  }

  return <Elements stripe={stripe}>{children}</Elements>;
}
