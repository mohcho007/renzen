import { cities, getCityBySlug, type City } from "../data/cities";

/** Priority 1 editorial cities for /privat-rengoring/{slug}/ */
export const PRIVAT_RENGORING_PRIORITY_1_CITY_NAMES = [
  "København",
  "Frederiksberg",
  "København Ø",
  "Nordhavn",
  "København N",
  "København S",
  "København NV",
  "København SV",
  "Valby",
  "Vanløse",
  "Brønshøj",
  "Kastrup",
  "Dragør",
  "Hvidovre",
  "Rødovre",
  "Glostrup",
  "Brøndby",
  "Brøndby Strand",
  "Herlev",
  "Søborg",
  "Ballerup",
  "Skovlunde",
  "Albertslund",
  "Taastrup",
  "Vallensbæk",
  "Ishøj",
  "Greve",
  "Solrød Strand",
  "Karlslunde",
  "Måløv",
  "Smørum",
  "Kongens Lyngby",
  "Gentofte",
  "Dyssegård",
  "Bagsværd",
  "Hellerup",
  "Charlottenlund",
] as const;

function editorialCityLink(name: string) {
  const city = cities.find((entry) => entry.name === name);
  if (!city) {
    throw new Error(`City not found for privat rengøring priority list: ${name}`);
  }
  return { name: city.name, slug: city.slug };
}

export const PRIVAT_RENGORING_PRIORITY_1_CITIES = PRIVAT_RENGORING_PRIORITY_1_CITY_NAMES.map(
  editorialCityLink,
);

export const PRIVAT_RENGORING_PRIORITY_1_SLUGS = PRIVAT_RENGORING_PRIORITY_1_CITIES.map(
  (city) => city.slug,
);

const PRIORITY_1_SLUG_SET = new Set(PRIVAT_RENGORING_PRIORITY_1_SLUGS);

export function isPrivatRengoringPriority1Slug(slug: string): boolean {
  return PRIORITY_1_SLUG_SET.has(slug.toLowerCase().trim());
}

export function getPrivatRengoringPriority1City(slug: string): City | undefined {
  if (!isPrivatRengoringPriority1Slug(slug)) return undefined;
  return getCityBySlug(slug);
}

export function getPrivatRengoringPriority1Slugs(): string[] {
  return [...PRIVAT_RENGORING_PRIORITY_1_SLUGS];
}
