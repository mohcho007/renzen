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
import styles from "./ConsentManager.module.css";

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
    <div className={styles.overlay} role="region" aria-label="Cookieindstillinger">
      <div className={styles.card}>
        <div className={styles.cardAccent} aria-hidden="true" />
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.title}>Cookies på Renzen</h2>
            <p className={styles.body}>
              Nødvendige teknologier holder siden i gang. Statistik og
              markedsføring aktiveres kun, hvis du vælger dem.{" "}
              <Link href="/cookiepolitik" className={styles.policyLink}>
                Læs cookiepolitikken
              </Link>
              .
            </p>
          </header>

          {customizing && (
            <div className={styles.options} role="group" aria-label="Cookiekategorier">
              <label className={`${styles.option} ${styles.optionDisabled}`}>
                <input type="checkbox" checked disabled readOnly />
                <span className={styles.optionLabel}>Nødvendige</span>
              </label>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={statistics}
                  onChange={(event) => setStatistics(event.target.checked)}
                />
                <span className={styles.optionLabel}>Statistik</span>
              </label>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                <span className={styles.optionLabel}>Markedsføring</span>
              </label>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => save(false, false)}
              className={`${styles.btn} ${styles.btnGhost}`}
            >
              Afvis valgfrie
            </button>
            {customizing ? (
              <button
                type="button"
                onClick={() => save(statistics, marketing)}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Gem valg
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className={`${styles.btn} ${styles.btnOutline}`}
              >
                Tilpas
              </button>
            )}
            <button
              type="button"
              onClick={() => save(true, true)}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Accepter alle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
