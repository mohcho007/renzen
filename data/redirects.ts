import { getLegacyRedirectDestination } from "../lib/legacyRedirectLogic";

export interface RedirectItem {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Resolve a legacy redirect at runtime (middleware uses the same logic). */
export function getRedirectForPath(path: string): RedirectItem | undefined {
  const destination = getLegacyRedirectDestination(path);
  if (!destination) return undefined;
  return { source: path, destination, permanent: true };
}
