export interface RedirectItem {
  source: string;
  destination: string;
  permanent: boolean;
}

export const redirects: RedirectItem[] = [
  // Examples of legacy or misformatted Danish character URLs redirecting to ae/oe/aa counterparts
  {
    source: '/privat-rengoring/kobenhavn/',
    destination: '/privat-rengoring/koebenhavn/',
    permanent: true,
  },
  {
    source: '/privat-rengoring/københavn/',
    destination: '/privat-rengoring/koebenhavn/',
    permanent: true,
  },
  {
    source: '/privat-rengoring/frederiksberg/',
    destination: '/privat-rengoring/frederiksberg/',
    permanent: true, // Ensuring fallback or typo match
  },
  {
    source: '/rengoring/københavn/',
    destination: '/rengoring/koebenhavn/',
    permanent: true,
  },
  {
    source: '/hjemmerengoering/',
    destination: '/privat-rengoring/',
    permanent: true,
  },
  {
    source: '/airbnb-rengoering/',
    destination: '/airbnb-rengoring/',
    permanent: true,
  },
];

export function getRedirectForPath(path: string): RedirectItem | undefined {
  // Normalize path with leading and trailing slashes
  let normPath = path.toLowerCase().trim();
  if (!normPath.startsWith('/')) normPath = '/' + normPath;
  if (!normPath.endsWith('/')) normPath = normPath + '/';

  return redirects.find(r => r.source.toLowerCase() === normPath);
}
