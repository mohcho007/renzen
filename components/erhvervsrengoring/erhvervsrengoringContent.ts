export const erhvervsrengoringHubIntro = {
  eyebrow: "Erhverv",
  title: "Professionel rengøring til virksomheder.",
  description:
    "Stabile serviceaftaler med faste standarder, tilpasset jeres lokaler og arbejdstider. Én kontakt — uforpligtende tilbud inden for 24 timer.",
};

export type ErhvervsrengoringHubItem = {
  slug: string;
  label: string;
  description: string;
  inquiryPath?: string;
};

export const erhvervsrengoringHubItems: ErhvervsrengoringHubItem[] = [
  {
    slug: "kontorrengoring",
    label: "Kontorrengøring",
    description:
      "En ren og indbydende arbejdsplads, uge efter uge — tilpasset jeres åbningstider.",
    inquiryPath: "/kontorrengoring/forespoergsel/",
  },
  {
    slug: "boligforeninger",
    label: "Boligforeninger",
    description:
      "Trappevask, opgange og fællesarealer til andels-, ejer- og lejeboligforeninger.",
    inquiryPath: "/boligforeninger/forespoergsel/",
  },
  {
    slug: "flyttesyn",
    label: "Flyttesyn",
    description:
      "Dokumenteret gennemgang ved ind- og udflytning, klar til jeres sagsmappe.",
    inquiryPath: "/flyttesyn/forespoergsel/",
  },
  {
    slug: "personalegode",
    label: "Rengøring som personalegode",
    description:
      "Giv medarbejderne mere overskud i hverdagen med rengøring som personalegode.",
    inquiryPath: "/personalegode/forespoergsel/",
  },
];

export const erhvervsrengoringMegaMenuItems = erhvervsrengoringHubItems;

export function erhvervsrengoringInquiryPath() {
  return "/kontorrengoring/forespoergsel/";
}
