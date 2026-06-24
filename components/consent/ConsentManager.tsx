"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  createConsentState,
  isValidConsent,
} from "@/lib/consent";
import type { ConsentState } from "@/lib/consent";

function readConsent(): ConsentState | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isValidConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistConsent(state: ConsentState) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function ConsentManager() {
  const [consent, setConsent] = useState<ConsentState | null | undefined>();
  const [customizing, setCustomizing] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setConsent(readConsent());

    const openSettings = () => {
      const current = readConsent();
      setStatistics(current?.statistics ?? false);
      setMarketing(current?.marketing ?? false);
      setConsent(null);
      setCustomizing(true);
    };

    const settingsEvent = `${CONSENT_EVENT}:settings`;
    window.addEventListener(settingsEvent, openSettings);
    return () =>
      window.removeEventListener(settingsEvent, openSettings);
  }, []);

  if (consent === undefined || consent) return null;

  const save = (nextStatistics: boolean, nextMarketing: boolean) => {
    const next = createConsentState({
      statistics: nextStatistics,
      marketing: nextMarketing,
    });
    persistConsent(next);
    setConsent(next);
    setCustomizing(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
      role="region"
      aria-label="Cookieindstillinger"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg font-extrabold text-brand-blue">
              Cookies på Renzen
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              Nødvendige teknologier holder siden i gang. Statistik og
              markedsføring aktiveres kun, hvis du vælger dem.{" "}
              <Link
                href="/cookiepolitik"
                className="font-semibold text-brand-green underline"
              >
                Læs cookiepolitikken
              </Link>
              .
            </p>
          </div>

          {customizing && (
            <div className="grid gap-3 rounded-xl bg-zinc-50 p-4 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <input type="checkbox" checked disabled />
                Nødvendige
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={statistics}
                  onChange={(event) => setStatistics(event.target.checked)}
                />
                Statistik
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                Markedsføring
              </label>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => save(false, false)}
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
            >
              Afvis valgfrie
            </button>
            {customizing ? (
              <button
                type="button"
                onClick={() => save(statistics, marketing)}
                className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-[#111943]"
              >
                Gem valg
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="rounded-full border border-brand-green px-5 py-2.5 text-sm font-bold text-brand-green hover:bg-emerald-50"
              >
                Tilpas
              </button>
            )}
            <button
              type="button"
              onClick={() => save(true, true)}
              className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
            >
              Accepter alle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
