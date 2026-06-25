import { cities } from "../data/cities";
import { isPrivatRengoringPriority1Slug } from "./privatRengoringCities";

/** National-only slugs that consolidate on privat-rengoring (no real page). */
export const NATIONAL_PRIVAT_CONSOLIDATION_SLUGS = ["engangsrengoring"] as const;

/** WP spellings (oe) that had real /{service}/{city}/ URLs on the old site. */
export const LEGACY_SPELLING_CITY_SERVICES = new Set([
  "privat-rengoering",
  "hjemmerengoering",
  "hjemmerengoring",
]);

/** National legacy spelling → destination (no city segment). */
export const LEGACY_SPELLING_NATIONAL: Record<string, string> = {
  rengoering: "/rengoring/",
  "privat-rengoering": "/privat-rengoring/",
  hjemmerengoering: "/privat-rengoring/",
  hjemmerengoring: "/privat-rengoring/",
  hovedrengoering: "/hovedrengoring/",
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

/** Static legacy paths handled in middleware (not next.config). */
export const STATIC_LEGACY_REDIRECTS: Record<string, string> = {
  "/kontakt-os/": "/kontakt/",
  "/start/": "/book-rengoering/",
  "/deal/": "/klub/",
  "/cookie-privatlivspolitik/": "/cookiepolitik/",
  "/blog/": "/artikler/",
  "/job/": "/bliv-zenmester/",
  "/hjemmerengoering/": "/privat-rengoring/",
  "/airbnb-rengoering/": "/airbnb-rengoring/",
  "/privat-rengoring/kobenhavn/": "/privat-rengoring/koebenhavn/",
  "/privat-rengoring/københavn/": "/privat-rengoring/koebenhavn/",
  "/privat-rengoering/kobenhavn/": "/privat-rengoring/koebenhavn/",
  "/privat-rengoering/københavn/": "/privat-rengoring/koebenhavn/",
  "/priser/": "/",
};

/** WordPress root URLs indexed in GSC → /artikler/{slug}/ */
export const LEGACY_WP_ARTICLE_SLUGS = [
  "svanemaerket-rengoering",
  "budget-for-erhvervsrengoering",
  "minimalistisk-rengoering",
  "hvor-lang-tid-tager-professionel-rengoering",
  "tjekliste-dybderengoering-af-koekken",
  "privat-rengoeringsfirma-vs-freelancer",
  "forsikret-rengoeringshjaelp",
  "indflytningsrengoering-tjekliste",
  "hvad-er-et-rengoeringsabonnement",
  "rengoering-med-boern-og-kaeledyr",
  "kontorforsyninger-paa-abonnement",
  "miljoevenlige-rengoeringsmidler-etiket",
  "allergivenlig-rengoering-rent-hjem",
  "bestil-rengoering-forberedelse",
  "erhvervsrengoering-koebenhavn",
  "hvor-ofte-professionel-rengoering",
  "engangs-rengoering-vs-fast-rengoering",
  "saadan-arbejder-vores-zenmestre",
  "kvalitetssikring-rengoering-2026",
  "kontorrengoering-tjekliste-guide",
  "forberedelse-foer-rengoering",
  "vinduespudsning-teknikker-udstyr-sikkerhed",
  "hvad-indgaar-ikke-i-professionel-rengoering",
  "hvad-koster-rengoering-i-danmark",
  "kvalitetskontrol-erhvervsrengoering",
  "book-rengoering-online",
  "billig-rengoering-vs-kvalitet",
  "flytterengoering-guide-praktiske-tips-til-effektiv-rengoering",
] as const;

function articleSlugSpellingVariants(slug: string): string[] {
  const variants = new Set<string>([slug]);
  variants.add(slug.replace(/rengoering/g, "rengoring"));
  variants.add(slug.replace(/rengoring/g, "rengoering"));
  return [...variants];
}

/** WP root paths: /{slug}/ → /artikler/{slug}/ */
const LEGACY_WP_ARTICLE_ROOT_PATHS = new Map<string, string>();
for (const slug of LEGACY_WP_ARTICLE_SLUGS) {
  const dest = `/artikler/${slug}/`;
  for (const variant of articleSlugSpellingVariants(slug)) {
    LEGACY_WP_ARTICLE_ROOT_PATHS.set(`/${variant}/`, dest);
  }
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

/** Maps any known city slug variant → canonical slug. */
const CITY_VARIANT_TO_CANONICAL = new Map<string, string>();
for (const city of cities) {
  for (const variant of getCitySlugVariants(city.name, city.slug)) {
    CITY_VARIANT_TO_CANONICAL.set(variant, city.slug);
  }
}

export function resolveCitySlug(segment: string): string | undefined {
  return CITY_VARIANT_TO_CANONICAL.get(segment.toLowerCase().trim());
}

export function privatRengoringDestination(citySlug: string | undefined): string {
  if (citySlug && isPrivatRengoringPriority1Slug(citySlug)) {
    return `/privat-rengoring/${citySlug}/`;
  }
  return "/privat-rengoring/";
}

export function normalizePath(pathname: string): string {
  let path = pathname.toLowerCase().trim();
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}

/**
 * Returns a redirect destination for legacy SEO paths, or undefined to continue.
 */
export function getLegacyRedirectDestination(pathname: string): string | undefined {
  const path = normalizePath(pathname);

  const staticDest = STATIC_LEGACY_REDIRECTS[path];
  if (staticDest) return staticDest;

  const wpArticleDest = LEGACY_WP_ARTICLE_ROOT_PATHS.get(path);
  if (wpArticleDest) return wpArticleDest;

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return undefined;

  const [service, citySegment] = segments;

  if (segments.length === 1) {
    const nationalDest = LEGACY_SPELLING_NATIONAL[service];
    if (nationalDest) return nationalDest;

    if (
      (NATIONAL_PRIVAT_CONSOLIDATION_SLUGS as readonly string[]).includes(
        service,
      )
    ) {
      return "/privat-rengoring/";
    }

    return undefined;
  }

  if (segments.length !== 2) return undefined;

  const canonical = resolveCitySlug(citySegment);

  if (service === "privat-rengoring" || service === "privat-rengoering") {
    if (!canonical || !isPrivatRengoringPriority1Slug(canonical)) {
      return "/privat-rengoring/";
    }
    if (citySegment !== canonical || service === "privat-rengoering") {
      return `/privat-rengoring/${canonical}/`;
    }
    return undefined;
  }

  if (LEGACY_SPELLING_CITY_SERVICES.has(service)) {
    return privatRengoringDestination(canonical);
  }

  return undefined;
}
