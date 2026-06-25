export interface RedirectItem {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Static legacy URL fixes (also merged into lib/seoRedirects.ts for next.config). */
export const redirects: RedirectItem[] = [
  {
    source: "/privat-rengoring/kobenhavn/",
    destination: "/privat-rengoring/koebenhavn/",
    permanent: true,
  },
  {
    source: "/privat-rengoring/københavn/",
    destination: "/privat-rengoring/koebenhavn/",
    permanent: true,
  },
  {
    source: "/privat-rengoering/kobenhavn/",
    destination: "/privat-rengoring/koebenhavn/",
    permanent: true,
  },
  {
    source: "/privat-rengoering/københavn/",
    destination: "/privat-rengoring/koebenhavn/",
    permanent: true,
  },
  {
    source: "/hjemmerengoering/",
    destination: "/privat-rengoring/",
    permanent: true,
  },
  {
    source: "/airbnb-rengoering/",
    destination: "/airbnb-rengoring/",
    permanent: true,
  },
];

export function getRedirectForPath(path: string): RedirectItem | undefined {
  let normPath = path.toLowerCase().trim();
  if (!normPath.startsWith("/")) normPath = "/" + normPath;
  if (!normPath.endsWith("/")) normPath = normPath + "/";

  return redirects.find((r) => r.source.toLowerCase() === normPath);
}
