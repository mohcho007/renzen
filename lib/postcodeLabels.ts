/**
 * Friendly neighborhood labels for Copenhagen postcodes.
 * DAWA returns official names (e.g. "København Ø"); users expect local area names.
 */
export const POSTCODE_DISPLAY_LABELS: Record<string, string> = {
  "2100": "Østerbro",
  "2150": "Nordhavn",
  "2200": "Nørrebro",
  "2300": "Amager",
  "2400": "Nordvest",
  "2450": "Sydhavn",
  "2500": "Valby",
};

/** Lowercase search terms → postnr (for DAWA gaps, e.g. neighborhood names). */
const POSTCODE_SEARCH_ALIASES: Record<string, string> = {
  østerbro: "2100",
  osterbro: "2100",
  nordhavn: "2150",
  nørrebro: "2200",
  noerrebro: "2200",
  norrebro: "2200",
  amager: "2300",
  nordvest: "2400",
  sydhavn: "2450",
  valby: "2500",
};

export function getPostcodeDisplayLabel(
  postnr: string,
  fallbackNavn = "",
): string {
  return POSTCODE_DISPLAY_LABELS[postnr] ?? fallbackNavn;
}

export function formatPostcodeSuggestionText(
  postnr: string,
  fallbackNavn = "",
): string {
  const label = getPostcodeDisplayLabel(postnr, fallbackNavn);
  return label ? `${postnr} ${label}` : postnr;
}

/** Resolve a free-text query to a postnr when it matches a known neighborhood alias. */
export function resolvePostcodeFromAlias(query: string): string | null {
  const normalized = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!normalized) return null;
  return POSTCODE_SEARCH_ALIASES[normalized] ?? null;
}

export function buildAliasPostcodeSuggestion(
  query: string,
): { nr: string; navn: string; tekst: string } | null {
  const postnr = resolvePostcodeFromAlias(query);
  if (!postnr) return null;
  const navn = getPostcodeDisplayLabel(postnr);
  return {
    nr: postnr,
    navn,
    tekst: formatPostcodeSuggestionText(postnr, navn),
  };
}
