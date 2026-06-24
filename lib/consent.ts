export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "renbud-consent";
export const CONSENT_EVENT = "renbud:consent-change";
export const CONSENT_MAX_AGE_DAYS = 180;

export type ConsentState = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  version: number;
  timestamp: string;
  expiresAt: string;
};

export function createConsentState({
  statistics,
  marketing,
}: {
  statistics: boolean;
  marketing: boolean;
}): ConsentState {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + CONSENT_MAX_AGE_DAYS);

  return {
    necessary: true,
    statistics,
    marketing,
    version: CONSENT_VERSION,
    timestamp: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function isValidConsent(value: unknown): value is ConsentState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<ConsentState>;

  return (
    state.necessary === true &&
    typeof state.statistics === "boolean" &&
    typeof state.marketing === "boolean" &&
    state.version === CONSENT_VERSION &&
    typeof state.expiresAt === "string" &&
    new Date(state.expiresAt).getTime() > Date.now()
  );
}

