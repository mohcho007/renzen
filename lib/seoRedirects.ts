export interface SeoRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

import { getLegacyRedirectDestination } from "./legacyRedirectLogic";

/** @deprecated Legacy SEO redirects now run in middleware.ts */
export function buildSeoRedirects(): SeoRedirect[] {
  return [];
}

/** @deprecated Legacy SEO redirects now run in middleware.ts */
export const generateSeoRedirects = buildSeoRedirects;

export { getLegacyRedirectDestination };
