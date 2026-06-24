/** Greater Copenhagen / Storkøbenhavn coverage (inclusive). */
export const SERVED_POSTNR_MIN = 1000;
export const SERVED_POSTNR_MAX = 2990;

export const SERVED_AREA_LABEL = "Storkøbenhavn";

export const SERVED_AREA_POSTNR_RANGE = `${SERVED_POSTNR_MIN}–${SERVED_POSTNR_MAX}`;

export const UNSERVED_AREA_MESSAGE =
  "Vi dækker desværre ikke dit område endnu. Renzen er tilgængelig i Storkøbenhavn (postnr. 1000–2990).";

export function isServedPostcode(postnr: string): boolean {
  if (!/^\d{4}$/.test(postnr)) return false;
  const value = parseInt(postnr, 10);
  return value >= SERVED_POSTNR_MIN && value <= SERVED_POSTNR_MAX;
}
