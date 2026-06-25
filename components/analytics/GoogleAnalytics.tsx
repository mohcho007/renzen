"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  migrateConsentStorage,
  isValidConsent,
} from "@/lib/consent";
import type { ConsentState } from "@/lib/consent";
import { registerAnalyticsProvider } from "@/lib/analytics";

const GOOGLE_MEASUREMENT_ID = "G-5B7M35QQX7";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let cachedConsentValue: string | null | undefined;
let cachedConsent: ConsentState | null = null;

function getConsentSnapshot(): ConsentState | null {
  try {
    migrateConsentStorage();
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === cachedConsentValue) return cachedConsent;

    cachedConsentValue = stored;
    if (!stored) {
      cachedConsent = null;
      return cachedConsent;
    }

    const parsed: unknown = JSON.parse(stored);
    cachedConsent = isValidConsent(parsed) ? parsed : null;
    return cachedConsent;
  } catch {
    cachedConsentValue = null;
    cachedConsent = null;
    return null;
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();

  window.addEventListener(CONSENT_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(CONSENT_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function updateGoogleConsent(consent: ConsentState) {
  window.gtag?.("consent", "update", {
    analytics_storage: consent.statistics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

function removeAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  const hostnameParts = window.location.hostname.split(".");
  const domains = [
    "",
    window.location.hostname,
    hostnameParts.length > 1
      ? `.${hostnameParts.slice(-2).join(".")}`
      : "",
  ].filter(Boolean);

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    });
  });
}

export function GoogleAnalytics() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => null,
  );

  useEffect(() => {
    if (!consent) return;

    updateGoogleConsent(consent);

    if (!consent.statistics) {
      removeAnalyticsCookies();
      return;
    }

    return registerAnalyticsProvider({
      track(event) {
        const { name, ...parameters } = event;
        window.gtag?.("event", name, parameters);
      },
      reportWebVital(metric) {
        window.gtag?.("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value,
          ),
          non_interaction: true,
        });
      },
    });
  }, [consent]);

  if (!consent?.statistics) return null;

  const marketingConsent = consent.marketing ? "granted" : "denied";

  return (
    <>
      <Script id="renzen-google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: '${marketingConsent}',
            ad_user_data: '${marketingConsent}',
            ad_personalization: '${marketingConsent}'
          });
          gtag('js', new Date());
          gtag('config', '${GOOGLE_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        id="renzen-google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
