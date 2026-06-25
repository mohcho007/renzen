export const rengoringHubIntro = {
  eyebrow: "Hjemmeservice",
  title: "Professionel rengøring til dit hjem.",
  description:
    "Fast hjælp, grundige enkeltbesøg og specialrengøring — udført af verificerede Zenmestre, når det passer dig.",
};

export type RengoringHubItem = {
  slug: string;
  label: string;
  description: string;
};

export const rengoringMegaMenuItems: RengoringHubItem[] = [
  {
    slug: "privat-rengoring",
    label: "Privatrengøring",
    description: "En fast hånd til den løbende rengøring.",
  },
  {
    slug: "airbnb-rengoring",
    label: "Airbnb rengøring",
    description: "Klargøring mellem gæster — hurtigt og driftssikkert.",
  },
  {
    slug: "flytterengoring",
    label: "Flytterengøring",
    description: "En grundig afslutning, når boligen skifter hænder.",
  },
  {
    slug: "hovedrengoring",
    label: "Hovedrengøring",
    description: "Ekstra grundigt fra paneler til svært tilgængelige steder.",
  },
  {
    slug: "vinduespudsning",
    label: "Vinduespudsning",
    description: "Klare ruder og et lysere hjem, inde og ude.",
  },
];

export const rengoringHubItems: RengoringHubItem[] = [
  ...rengoringMegaMenuItems,
  {
    slug: "engangsrengoring",
    label: "Engangsrengøring",
    description: "Én grundig rengøring, når du har brug for ekstra hjælp.",
  },
];

export function rengoringBookingPath() {
  return "/book-rengoering/";
}
