export interface RedirectItem {
  source: string;
  destination: string;
  permanent: boolean;
}

/** WordPress article slugs indexed in GSC but not migrated to data/articles.ts */
const LEGACY_ARTICLE_SLUGS = [
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
] as const;

function articleSlugSpellingVariants(slug: string): string[] {
  const variants = new Set<string>([slug]);
  variants.add(slug.replace(/rengoering/g, "rengoring"));
  variants.add(slug.replace(/rengoring/g, "rengoering"));
  return [...variants];
}

function legacyArticleRedirects(): RedirectItem[] {
  const items: RedirectItem[] = [
    {
      source: "/artikler/book-rengoering-online/",
      destination: "/book-rengoering/",
      permanent: true,
    },
  ];

  for (const slug of LEGACY_ARTICLE_SLUGS) {
    for (const variant of articleSlugSpellingVariants(slug)) {
      items.push({
        source: `/artikler/${variant}/`,
        destination: "/artikler/",
        permanent: true,
      });
    }
  }

  return items;
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
  {
    source: "/kontakt-os/",
    destination: "/kontakt/",
    permanent: true,
  },
  {
    source: "/start/",
    destination: "/book-rengoering/",
    permanent: true,
  },
  {
    source: "/deal/",
    destination: "/klub/",
    permanent: true,
  },
  {
    source: "/cookie-privatlivspolitik/",
    destination: "/cookiepolitik/",
    permanent: true,
  },
  {
    source: "/blog/",
    destination: "/artikler/",
    permanent: true,
  },
  {
    source: "/job/",
    destination: "/bliv-zenmester/",
    permanent: true,
  },
  ...legacyArticleRedirects(),
];

export function getRedirectForPath(path: string): RedirectItem | undefined {
  let normPath = path.toLowerCase().trim();
  if (!normPath.startsWith("/")) normPath = "/" + normPath;
  if (!normPath.endsWith("/")) normPath = normPath + "/";

  return redirects.find((r) => r.source.toLowerCase() === normPath);
}
