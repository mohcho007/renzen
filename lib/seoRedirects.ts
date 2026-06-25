import { cities } from "../data/cities";
import { redirects as legacyRedirects } from "../data/redirects";
import {
  PRIVAT_RENGORING_PRIORITY_1_SLUGS,
  isPrivatRengoringPriority1Slug,
} from "./privatRengoringCities";

export interface SeoRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Legacy service slugs whose city URLs should consolidate on privat-rengoring. */
const LEGACY_CLEANING_SERVICE_SLUGS = [
  "rengoring",
  "hovedrengoring",
  "engangsrengoring",
] as const;

/** Old WordPress spellings (oe) mapped to canonical slug or privat-rengoring target. */
const LEGACY_SPELLING_NATIONAL: Record<string, string> = {
  rengoering: "/privat-rengoring/",
  "privat-rengoering": "/privat-rengoring/",
  hjemmerengoering: "/privat-rengoring/",
  hjemmerengoring: "/privat-rengoring/",
  "hovedrengoering": "/privat-rengoring/",
  "engangsrengoering": "/privat-rengoring/",
  "erhvervsrengoering": "/erhvervsrengoring/",
  "airbnb-rengoering": "/airbnb-rengoring/",
  "kontorrengoering": "/kontorrengoring/",
  "klinikrengoering": "/kontorrengoring/",
  "butiksrengoering": "/kontorrengoring/",
  "institutionsrengoering": "/kontorrengoring/",
  "byggerengoering": "/boligservice/",
  dealside: "/klub/",
};

const LEGACY_SPELLING_CITY_SERVICES = new Set([
  "rengoering",
  "privat-rengoering",
  "hjemmerengoering",
  "hjemmerengoring",
  "hovedrengoering",
  "engangsrengoering",
  "erhvervsrengoering",
]);

function privatRengoringDestination(citySlug: string): string {
  return isPrivatRengoringPriority1Slug(citySlug)
    ? `/privat-rengoring/${citySlug}/`
    : "/privat-rengoring/";
}

function getCitySlugVariants(name: string, canonicalSlug: string): string[] {
  const variants = new Set<string>();

  const unicodeSlug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9æøå-]/g, "");

  const lazyAsciiSlug = name
    .toLowerCase()
    .trim()
    .replace(/æ/g, "a")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  for (const slug of [unicodeSlug, lazyAsciiSlug, canonicalSlug]) {
    if (slug) variants.add(slug);
  }

  return [...variants];
}

function addRedirect(
  map: Map<string, SeoRedirect>,
  source: string,
  destination: string,
): void {
  if (source === destination) return;
  const existing = map.get(source);
  if (existing && existing.destination !== destination) return;
  map.set(source, { source, destination, permanent: true });
}

export function buildSeoRedirects(): SeoRedirect[] {
  const map = new Map<string, SeoRedirect>();

  for (const serviceSlug of LEGACY_CLEANING_SERVICE_SLUGS) {
    addRedirect(map, `/${serviceSlug}/`, "/privat-rengoring/");

    for (const city of cities) {
      const destination = privatRengoringDestination(city.slug);
      for (const variant of getCitySlugVariants(city.name, city.slug)) {
        addRedirect(map, `/${serviceSlug}/${variant}/`, destination);
      }
    }
  }

  for (const [legacySlug, destination] of Object.entries(LEGACY_SPELLING_NATIONAL)) {
    addRedirect(map, `/${legacySlug}/`, destination);
  }

  for (const legacySlug of LEGACY_SPELLING_CITY_SERVICES) {
    for (const city of cities) {
      const destination = privatRengoringDestination(city.slug);
      for (const variant of getCitySlugVariants(city.name, city.slug)) {
        addRedirect(map, `/${legacySlug}/${variant}/`, destination);
      }
    }
  }

  for (const city of cities) {
    const isPriority1 = isPrivatRengoringPriority1Slug(city.slug);
    const destination = isPriority1
      ? `/privat-rengoring/${city.slug}/`
      : "/privat-rengoring/";

    for (const variant of getCitySlugVariants(city.name, city.slug)) {
      if (isPriority1 && variant === city.slug) continue;
      addRedirect(map, `/privat-rengoring/${variant}/`, destination);
      addRedirect(map, `/privat-rengoering/${variant}/`, destination);
    }
  }

  for (const slug of PRIVAT_RENGORING_PRIORITY_1_SLUGS) {
    addRedirect(map, `/rengoring/${slug}/`, `/privat-rengoring/${slug}/`);
  }

  for (const city of cities) {
    const destination = privatRengoringDestination(city.slug);
    for (const variant of getCitySlugVariants(city.name, city.slug)) {
      addRedirect(map, `/erhvervsrengoring/${variant}/`, destination);
    }
  }

  for (const item of legacyRedirects) {
    if (item.source === item.destination) continue;
    addRedirect(map, item.source, item.destination);
  }

  return [...map.values()];
}

/** Alias used by next.config.ts */
export const generateSeoRedirects = buildSeoRedirects;
