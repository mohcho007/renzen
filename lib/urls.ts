export const DOMAIN = 'https://renzen.dk';

/** Services that only have a national landing page (no /{service}/{city}/ routes). */
export const NATIONAL_ONLY_SERVICE_SLUGS = new Set([
  'rengoring',
  'hovedrengoring',
  'engangsrengoring',
  'erhvervsrengoring',
  'flytterengoring',
]);

/** Launch27 proxy — trailing slash matches next.config trailingSlash: true */
export const L27_API_PATH = '/api/l27/';

/**
 * Returns the absolute canonical URL for a given relative path.
 * Enforces trailing slashes and avoids double slashes.
 */
export function getAbsoluteUrl(path: string): string {
  // Normalize path
  let cleanPath = path.trim();
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  if (cleanPath && !cleanPath.endsWith('/')) {
    cleanPath = cleanPath + '/';
  }
  
  return `${DOMAIN}/${cleanPath}`;
}

/**
 * Returns the relative path for a service.
 * E.g., /privat-rengoring/
 */
export function getServiceUrl(serviceSlug: string): string {
  return `/${serviceSlug}/`;
}

/**
 * Returns the relative path for a service in a specific city.
 * E.g., /privat-rengoring/koebenhavn/
 */
export function getServiceCityUrl(serviceSlug: string, citySlug: string): string {
  return `/${serviceSlug}/${citySlug}/`;
}

/**
 * National page for services without city routes; otherwise the city URL.
 */
export function getServiceLocationUrl(serviceSlug: string, citySlug: string): string {
  return NATIONAL_ONLY_SERVICE_SLUGS.has(serviceSlug)
    ? getServiceUrl(serviceSlug)
    : getServiceCityUrl(serviceSlug, citySlug);
}

/**
 * Returns the relative path for a blog article.
 * E.g., /artikler/guide-rent-hjem-med-servicefradrag/
 */
export function getArticleUrl(articleSlug: string): string {
  return `/artikler/${articleSlug}/`;
}
