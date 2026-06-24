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

/**
 * Hovedstaden municipalities with primary postcodes above {@link SERVED_POSTNR_MAX}.
 * Solrød and other Sjælland postcodes in range are excluded via region check.
 */
const HOVEDSTADEN_OUT_OF_AREA_SLUGS = new Set([
  "aalsgaarde",
  "dronningmoelle",
  "espergaerde",
  "fredensborg",
  "frederikssund",
  "frederiksvaeerk",
  "gilleleje",
  "goerloese",
  "graested",
  "hellebaek",
  "helsinge",
  "helsingoer",
  "hillerod",
  "hornbaek",
  "humlebaek",
  "hundested",
  "jaegerspris",
  "kvistgaard",
  "liseleje",
  "melby",
  "snekkersten",
  "tikoeb",
  "tisvildeleje",
  "vejby",
  "olsted",
]);

export function isCityInServedArea(city: {
  slug: string;
  region: string;
}): boolean {
  if (city.region !== "Region Hovedstaden") return false;
  return !HOVEDSTADEN_OUT_OF_AREA_SLUGS.has(city.slug);
}

/** Primary postcodes for editorial Airbnb city pages (national landing links). */
export const AIRBNB_EDITORIAL_CITY_POSTNR: Record<string, string> = {
  koebenhavn: "2100",
  frederiksberg: "2000",
  gentofte: "2820",
  aarhus: "8000",
  odense: "5000",
  aalborg: "9000",
  roskilde: "4000",
  helsingoer: "3000",
};

export function isAirbnbEditorialCityServed(citySlug: string): boolean {
  const postnr = AIRBNB_EDITORIAL_CITY_POSTNR[citySlug];
  return postnr ? isServedPostcode(postnr) : isCityInServedArea({ slug: citySlug, region: "Region Hovedstaden" });
}
