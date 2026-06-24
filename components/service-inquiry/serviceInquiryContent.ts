import type { BoligserviceSlug, ServiceInquirySlug } from "@/lib/serviceInquiry";
import { cities } from "@/data/cities";
import { INTRO_CLEANING_FROM_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import { serviceFAQs } from "@/data/faqs";

import {
  ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
  ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_MAN,
} from "@/lib/zenCreditServices";

const introCleaningFromKrLabel = `${INTRO_CLEANING_FROM_KR} kr.`;
const zenCreditMonthlyLabel = `${ZEN_CREDIT_MONTHLY_KR} kr./md.`;
const zenCreditMonthlyProse = `${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter hver måned`;

export type CoreServiceInquirySlug = Exclude<ServiceInquirySlug, BoligserviceSlug>;

export type KlubMaskVariant = "intro" | "zenCredit";

export type ProcessRadialStepIcon =
  | "booking"
  | "coordination"
  | "inspection"
  | "moveOut"
  | "moveIn"
  | "documentation"
  | "report"
  | "renovation"
  | "followup";

export type ProcessRadialLabelAnchor =
  | "radial"
  | "center"
  | "right"
  | "left"
  | "top"
  | "bottom";

export type ProcessRadialStep = {
  label: string;
  icon: ProcessRadialStepIcon;
  labelAnchor?: ProcessRadialLabelAnchor;
  labelOffset?: { x?: number; y?: number; radial?: number };
};

export type ProcessRadialConfig = {
  eyebrow?: string;
  title: string;
  body?: string[];
  hubSubtitle?: string;
  steps: ProcessRadialStep[];
};

export type IncludedRoom = {
  title: string;
  items: string[];
};

export type EditorialProseSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type EditorialListSection = {
  eyebrow: string;
  title: string;
  description?: string;
  items: string[];
  image?: string;
  imageAlt?: string;
};

export type EditorialCityLink = {
  name: string;
  slug: string;
};

function editorialCityLink(name: string): EditorialCityLink {
  const city = cities.find((entry) => entry.name === name);
  if (!city) {
    throw new Error(`City not found for editorial link: ${name}`);
  }
  return { name: city.name, slug: city.slug };
}

/** Airbnb city links on the national page — Storkøbenhavn only (postnr. 1000–2990). */
const AIRBNB_SERVED_EDITORIAL_CITY_NAMES = [
  "København",
  "Frederiksberg",
  "Gentofte",
  "Aarhus",
  "Odense",
  "Aalborg",
  "Roskilde",
  "Helsingør",
] as const;

export type EditorialCityLinksSection = {
  eyebrow: string;
  title: string;
  description: string;
  cities: EditorialCityLink[];
};

export const AIRBNB_INCLUDED_ROOMS: IncludedRoom[] = [
  {
    title: "Stuer & opholdsrum",
    items: [
      "Støvsugning og moppe alle gulve",
      "Tør alle overflader af",
      "Spejle og glas pudses",
      "Fjern spindelvæv",
      "Rengør lyskontakter",
      "Rengør dørhåndtag",
      "Rengør vindueskarme",
      "Rengør gange og trapper",
    ],
  },
  {
    title: "Køkken",
    items: [
      "Rengøring af vask og overflader",
      "Tør hvidevarer af udvendigt",
      "Tømning af opvaskemaskine",
      "Aftørring af skabslåger udvendigt",
      "Tømning af skraldespande",
      "Spejle og glas pudses",
      "Fjern spindelvæv",
      "Rengør lyskontakter",
      "Rengør dørhåndtag",
      "Rengør vindueskarme",
    ],
  },
  {
    title: "Soveværelser",
    items: [
      "Vask og strygning af tøj",
      "Skift af sengetøj",
      "Aftørring af overflader",
      "Rengør vindueskarme",
      "Rengør gange og trapper",
      "Skift af håndklæder",
    ],
  },
  {
    title: "Badeværelse",
    items: [
      "Støvsugning og moppe gulvet",
      "Rengør og skrubbe toilettet",
      "Rengør håndvasken",
      "Rengør ydersiden af skab",
      "Rengør ydersiden af skuffer",
      "Tør alle overflader af",
      "Spejle og glas pudses",
      "Fjern spindelvæv",
      "Rengør lyskontakter",
      "Rengør dørhåndtag",
      "Rengør vindueskarme",
      "Tømme skraldespande",
      "Skift af håndklæder",
    ],
  },
];

export type ServiceInquiryPageConfig = {
  slug: CoreServiceInquirySlug;
  klubMaskVariant: KlubMaskVariant;
  klubMaskServiceLine?: string;
  showKlubMask?: boolean;
  showKlubSections: boolean;
  serviceName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  /** Replaces default hero-vector.svg in the bottom-right of the hero copy column. */
  heroCornerImage?: string;
  heroWrapperClassName?: string;
  heroImageClassName?: string;
  heroFormWideInputs?: boolean;
  /** On mobile, use cream (#fbfaf5) hero background to match stats section. */
  heroCreamOnMobile?: boolean;
  trustBadges: string[];
  stats: [string, string][];
  includedEyebrow: string;
  includedTitle: string;
  includedDescription: string;
  includedItems: string[];
  includedRooms?: IncludedRoom[];
  whyRenzen?: EditorialProseSection;
  showReviews?: boolean;
  hostBenefits?: EditorialListSection;
  tilvalg?: EditorialListSection;
  cityLinks?: EditorialCityLinksSection;
  howItWorksEyebrow: string;
  howItWorksTitle: string;
  howItWorksBackgroundImage?: string;
  howItWorks: [string, string][];
  processSection?: ProcessRadialConfig;
  faqs: { question: string; answer: string }[];
  klubFaqs: { question: string; answer: string }[];
  ctaTitle: string;
  bottomCtaLabel?: string;
  formTitle: string;
  formDescription: string;
  showSizeField?: boolean;
  showHeroInputs?: boolean;
  sizeFieldLabel: string;
  sizeFieldPlaceholder: string;
  klubPromoDescription: string;
};

export type EditorialServiceLandingConfig = Omit<
  ServiceInquiryPageConfig,
  "slug"
> & {
  slug: string;
};

export const serviceInquiryPages: Record<
  CoreServiceInquirySlug,
  ServiceInquiryPageConfig
> = {
  hovedrengoring: {
    slug: "hovedrengoring",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til din hovedrengøring",
    showKlubSections: true,
    serviceName: "Hovedrengøring",
    heroEyebrow: "Dybdegående rengøring · Servicefradrag",
    heroTitle: "Hovedrengøring helt i bund.",
    heroDescription:
      "Få en grundig hovedrengøring tilpasset din bolig. Beskriv opgaven — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/services/hovedrengoering-2.jpg",
    heroImageAlt: "Grundig hovedrengøring i en privat bolig",
    trustBadges: [
      "Verificerede Zenmestre",
      "26% servicefradrag",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [`Fra ${introCleaningFromKrLabel}`, "Første rengøring med Klub"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "En grundig rengøring fra paneler til kalk.",
    includedDescription:
      "Hovedrengøring går dybere end den løbende rengøring. Vi prioriterer de områder, der trænger mest — og tilpasser opgaven til boligens stand.",
    includedItems: [
      "Afkalkning af fliser, armaturer og fuger i bad og køkken",
      "Aftørring af døre, karme, paneler og stikkontakter",
      "Rengøring ovenpå høje skabe og svært tilgængelige flader",
      "Indvendig og udvendig rensning af ovn og emhætte",
      "Rengøring bag hårde hvidevarer, hvis de er trukket frem",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til skinnende hjem.",
    howItWorks: [
      [
        "Beskriv opgaven",
        "Fortæl os om boligen, areal og hvad der er vigtigst for dig.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester udfører hovedrengøringen efter aftalt plan.",
      ],
    ],
    faqs: [
      {
        question: "Hvad er forskellen på almindelig rengøring og hovedrengøring?",
        answer:
          "En hovedrengøring er langt mere dybdegående. Vi afkalker fliser, aftørrer paneler og dørkarme, rengør ovenpå skabe og tager de områder, der typisk overses i ugentlig rengøring.",
      },
      {
        question: "Hvornår giver hovedrengøring mening?",
        answer:
          "Før gæster, efter en travl periode, ved sæsonskifte eller når boligen skal gøres helt præsentabel igen. Mange vælger også en årlig hovedrengøring som supplement til fast rengøring.",
      },
      {
        question: "Kan jeg få servicefradrag?",
        answer:
          "Ja. Hovedrengøring i privat bolig er servicefradragsberettiget. Du kan trække 26% af arbejdslønnen fra i skat.",
      },
      {
        question: "Hvor lang tid tager en hovedrengøring?",
        answer:
          "Det afhænger af boligens størrelse og stand. Vi vurderer tidsforbruget ud fra dine oplysninger og giver et realistisk estimat i tilbuddet.",
      },
    ],
    ctaTitle: "Klar til en grundig hovedrengøring?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud uden binding.",
    sizeFieldLabel: "Boligstørrelse",
    sizeFieldPlaceholder: "F.eks. 100 m²",
    klubPromoDescription:
      `Som medlem får du op til 20% rabat på fast rengøring og kan bruge Zen-kreditter på hovedrengøring og andre boligservices. Introtilbuddet giver din første rengøring fra ${INTRO_CLEANING_FROM_KR} kr.`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på hovedrengøring?",
        answer:
          "Ja. Zen-kreditter kan bruges på hovedrengøring og andre udvalgte boligservices. Mange medlemmer kombinerer fast rengøring med en årlig hovedrengøring og bruger kreditterne til at nedbringe prisen på den dybere rengøring.",
      },
      {
        question: "Skal jeg have fast rengøring for at bestille hovedrengøring?",
        answer:
          "Nej. Du kan bestille hovedrengøring som enkeltbesøg via forespørgsel. Som medlem får du dog mest værdi, hvis du kombinerer med fast rengøring og bruger introtilbuddet og Zen-kreditterne.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til hovedrengøring?",
        answer:
          `Du får op til 20% medlemsrabat på fast rengøring, Zen-kreditter til hovedrengøring og andre boligservices, intropris fra ${introCleaningFromKrLabel}, fast Zenmester og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  "airbnb-rengoring": {
    slug: "airbnb-rengoring",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til din Airbnb-rengøring",
    showKlubSections: false,
    serviceName: "Airbnb rengøring",
    heroEyebrow: "Superhost · Hurtig turn-around",
    heroTitle: "Driftssikker klargøring mellem gæster.",
    heroDescription:
      "Hurtig og pålidelig rengøring af din udlejningsbolig mellem gæster. Faste tjeklister, kalendersynkronisering og verificerede Zenmestre — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/airbnb-rengoerng.avif",
    heroImageAlt: "Professionel Airbnb rengøring af udlejningsbolig",
    heroCornerImage: "/icons/house-bg (1).png",
    trustBadges: [
      "Verificerede Zenmestre",
      "Hurtig turn-around",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["Superhost", "5-stjernede anmeldelser"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Det får du med Renzen",
    includedTitle: "Hvad er inkluderet i en Airbnb klargøring?",
    includedDescription:
      "Her er det, der typisk bliver gjort, så boligen fremstår ren, præsentabel og klar til næste gæst.",
    includedItems: [],
    includedRooms: AIRBNB_INCLUDED_ROOMS,
    whyRenzen: {
      eyebrow: "Hvorfor vælge Renzen",
      title: "Airbnb rengøring",
      paragraphs: [
        "Vi hjælper Airbnb-værter med professionel klargøring mellem gæster. Uanset om du udlejer en lejlighed, gør vi det nemt at holde boligen ren, præsentabel og klar til næste check-in.",
      ],
    },
    showReviews: true,
    hostBenefits: {
      eyebrow: "Det får du som Airbnb vært",
      title: "Det får du som Airbnb vært",
      items: [
        "Klargøring mellem check-out og check-in",
        "Skift af sengetøj og håndklæder",
        "Pænt reset af boligen",
        "Stabil kvalitet mellem gæster",
        "Nem administration online",
      ],
      image: "/zenmester-gor-rent-rundt.jpg",
      imageAlt: "Airbnb vært med Renzen klargøring",
    },
    tilvalg: {
      eyebrow: "Ekstra services",
      title: "Tilvalg, der gør din drift lettere",
      description:
        "Tilføj ekstra ydelser som linnedservice, ovn, køleskab, hovedrengøring og vinduer efter behov. Du vælger selv tilvalgene, når du booker eller sender en forespørgsel.",
      items: [
        "Linned og vask",
        "Ovn",
        "Køleskab",
        "Hovedrengøring",
        "Vinduer efter behov",
      ],
    },
    cityLinks: {
      eyebrow: "Lokal dækning",
      title: "Airbnb rengøring i København og resten af landet",
      description:
        "Vi hjælper værter i hele Storkøbenhavn — fra Østerbro, Nørrebro og Amager til Valby og Frederiksberg — og i øvrige større byer med Airbnb-klargøring mellem gæster.",
      cities: AIRBNB_SERVED_EDITORIAL_CITY_NAMES.map((name) =>
        editorialCityLink(name),
      ),
    },
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til check-in-klar bolig.",
    howItWorksBackgroundImage: "/nyd-friheden.jpg",
    howItWorks: [
      [
        "Beskriv boligen",
        "Fortæl os om størrelse, værelser og hvor ofte du har gæster.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "Zenmesteren rengør i tidsrummet mellem check-out og check-in.",
      ],
    ],
    faqs: serviceFAQs["airbnb-rengoring"],
    ctaTitle: "Klar til driftssikker Airbnb rengøring?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud uden binding.",
    sizeFieldLabel: "Boligstørrelse",
    sizeFieldPlaceholder: "F.eks. 70 m²",
    klubPromoDescription:
      `Zen-kreditter kan bruges på Airbnb rengøring og andre udvalgte boligservices. Med Renzen Klub får du ${ZEN_CREDIT_MONTHLY_KR} kr. i kreditter hver måned — plus introtilbud på fast rengøring fra ${introCleaningFromKrLabel}`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på Airbnb rengøring?",
        answer:
          "Ja. Zen-kreditter kan bruges på Airbnb rengøring og andre udvalgte boligservices. Mange udlejere bruger kreditterne til linnedskift, ekstra klargøring eller andre opgaver omkring udlejningen.",
      },
      {
        question: "Skal jeg have fast rengøring for at bestille Airbnb rengøring?",
        answer:
          "Nej. Du kan bestille Airbnb rengøring som enkeltbesøg eller fast aftale via forespørgsel. Som medlem får du dog mest værdi, hvis du kombinerer med Renzen Klub og bruger Zen-kreditterne løbende.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til Airbnb rengøring?",
        answer:
          `Du får ${zenCreditMonthlyProse} til Airbnb rengøring og andre boligservices, op til 20% medlemsrabat på fast rengøring, intropris fra ${introCleaningFromKrLabel} og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  vinduespudsning: {
    slug: "vinduespudsning",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til din vinduespudsning",
    showKlubSections: true,
    serviceName: "Vinduespudsning",
    heroEyebrow: "Indvendig & udvendig · Fast interval muligt",
    heroTitle: "Klare ruder, lysere hjem.",
    heroDescription:
      "Professionel vinduespudsning tilpasset dine ruder og etager. Beskriv boligen — vi sender et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/vinduespudser-1.jpg",
    heroImageAlt: "Professionel vinduespudsning ved en privat bolig",
    trustBadges: [
      "Erfarne vinduespudsere",
      "26% servicefradrag",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad vi pudser",
    includedTitle: "Rene vinduer indvendigt og udvendigt.",
    includedDescription:
      "Antal vinduer, sprosser, etager og adgang afgør metode og pris. En præcis beskrivelse gør det nemmere at sammenligne og planlægge.",
    includedItems: [
      "Indvendig og udvendig pudsning efter aftale",
      "Rengøring af rammer og karme, hvis ønsket",
      "Håndtering af sprosser og ovenlys",
      "Valg mellem enkeltbesøg eller fast interval",
      "Tilpasning til etagehøjde og adgangsforhold",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til klare ruder.",
    howItWorks: [
      [
        "Beskriv dine ruder",
        "Angiv antal vinduer, etager og om det er indvendig eller udvendig pudsning.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester pudser dine vinduer efter aftalt plan.",
      ],
    ],
    faqs: [
      {
        question: "Hvad koster vinduespudsning?",
        answer:
          "Prisen afhænger af antal vinduer, etager, sprosser og om pudsningen er indvendig, udvendig eller begge dele. Beskriv boligen i formularen, så sender vi et skræddersyet tilbud.",
      },
      {
        question: "Kan I pudse udvendigt på højere etager?",
        answer:
          "Ja. Vi vurgerer adgang og etagehøjde ud fra dine oplysninger og vælger den rette metode — herunder teleskopudstyr, hvor det er muligt.",
      },
      {
        question: "Tilbyder I faste intervaller?",
        answer:
          "Ja. Mange vælger en fast aftale hver 3. eller 6. måned. Du kan også bestille en enkelt pudsning, når du har brug for det.",
      },
      {
        question: "Kan jeg få servicefradrag?",
        answer:
          "Ja. Vinduespudsning i privat bolig er servicefradragsberettiget med 26% fradrag i skat på arbejdslønnen.",
      },
    ],
    ctaTitle: "Klar til klare ruder?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et tilbud uden binding.",
    sizeFieldLabel: "Antal ruder",
    sizeFieldPlaceholder: "F.eks. 12 ruder",
    klubPromoDescription:
      `Zen-kreditter kan bruges på vinduespudsning og andre udvalgte boligservices. Med Renzen Klub får du ${ZEN_CREDIT_MONTHLY_KR} kr. i kreditter hver måned — plus introtilbud på fast rengøring fra ${introCleaningFromKrLabel}`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på vinduespudsning?",
        answer:
          "Ja. Zen-kreditter kan bruges på vinduespudsning og andre udvalgte boligservices. Mange medlemmer bruger kreditterne til faste intervaller eller en ekstra pudsning, så vinduerne holdes rene uden ekstra omkostninger.",
      },
      {
        question: "Tilbyder I faste intervaller som medlem?",
        answer:
          "Ja. Du kan vælge en fast aftale hver 3. eller 6. måned — eller bestille en enkelt pudsning, når du har brug for det. Som medlem kan du bruge Zen-kreditter til at holde vinduerne rene løbende.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til vinduespudsning?",
        answer:
          `Du får ${zenCreditMonthlyProse} til vinduespudsning og andre boligservices, op til 20% medlemsrabat på fast rengøring, intropris fra ${introCleaningFromKrLabel} og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  havearbejde: {
    slug: "havearbejde",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til dit havearbejde",
    showKlubSections: true,
    serviceName: "Havearbejde",
    heroEyebrow: "Havepleje · Zen-kreditter",
    heroTitle: "Professionel hjælp til haven.",
    heroDescription:
      "Få hjælp til græsslåning, hækklipning, lugning og andet havearbejde. Beskriv opgaven — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/havearbejde-3.png",
    heroImageAlt: "Professionel havehjælp i en privat have",
    heroCornerImage: "/icons/have-bg.png",
    trustBadges: [
      "Erfarne havefolk",
      "26% servicefradrag",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad vi kan hjælpe med",
    includedTitle: "Havepleje tilpasset din have og sæson.",
    includedDescription:
      "Fra løbende græsslåning til større opgaver som beskæring og klargøring. Vi tilpasser opgaven til havens størrelse og dine ønsker.",
    includedItems: [
      "Græsslåning og kantklipning",
      "Hækklipning og beskæring af buske",
      "Lugning, ukrudt og pleje af bede",
      "Affald, oprydning og bortkørsel efter aftale",
      "Enkeltbesøg eller faste aftaler gennem sæsonen",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til en velplejet have.",
    howItWorks: [
      [
        "Beskriv haven",
        "Fortæl os om havestørrelse, opgavetype og hvornår du ønsker hjælp.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester udfører havearbejdet efter aftalt plan.",
      ],
    ],
    faqs: [
      {
        question: "Hvad koster havearbejde?",
        answer:
          "Prisen afhænger af havens størrelse, opgavetype og om det er enkeltbesøg eller fast aftale. Beskriv opgaven i formularen, så sender vi et skræddersyet tilbud.",
      },
      {
        question: "Kan jeg få servicefradrag på havearbejde?",
        answer:
          "Ja. Havepleje i privat bolig kan være servicefradragsberettiget med 26% fradrag i skat på arbejdslønnen, når opgaven falder ind under boligjobordningen.",
      },
      {
        question: "Tilbyder I faste aftaler?",
        answer:
          "Ja. Mange vælger fast græsslåning eller løbende havepleje gennem sæsonen. Du kan også bestille en enkelt opgave, når du har brug for det.",
      },
      {
        question: "Skal jeg være hjemme under besøget?",
        answer:
          "Det er ikke altid nødvendigt. Angiv adgangsforhold i formularen — f.eks. nøgle, portkode eller at du er hjemme — så planlægger vi besøget derefter.",
      },
    ],
    ctaTitle: "Klar til hjælp i haven?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et tilbud uden binding.",
    sizeFieldLabel: "Haveareal",
    sizeFieldPlaceholder: "F.eks. 150 m²",
    klubPromoDescription:
      `Zen-kreditter kan bruges på havearbejde og andre udvalgte boligservices. Med Renzen Klub får du ${ZEN_CREDIT_MONTHLY_KR} kr. i kreditter hver måned — plus introtilbud på fast rengøring fra ${introCleaningFromKrLabel}`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på havearbejde?",
        answer:
          "Ja. Zen-kreditter kan bruges på havearbejde og andre udvalgte boligservices. Mange medlemmer bruger kreditterne til græsslåning, hækklipning eller sæsonklargøring.",
      },
      {
        question: "Skal jeg have fast rengøring for at bestille havearbejde?",
        answer:
          "Nej. Du kan bestille havearbejde som enkeltbesøg via forespørgsel. Som medlem får du dog mest værdi, hvis du kombinerer med Renzen Klub og bruger Zen-kreditterne løbende.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til havearbejde?",
        answer:
          `Du får ${zenCreditMonthlyProse} til havearbejde og andre boligservices, op til 20% medlemsrabat på fast rengøring, intropris fra ${introCleaningFromKrLabel} og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  "foraars-og-efteraarsklargoering": {
    slug: "foraars-og-efteraarsklargoering",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til dit havearbejde",
    showKlubSections: true,
    heroCreamOnMobile: true,
    serviceName: "Forårs- og efterårsklargøring",
    heroEyebrow: "Sæsonklargøring · Zen-kreditter",
    heroTitle: "Gør haven klar til sæsonen.",
    heroDescription:
      "Få professionel hjælp til forårs- og efterårsklargøring. Beskriv haven og ønsket periode — vi sender et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/services/havearbejde.webp",
    heroImageAlt: "Forårsklargøring i en privat have",
    heroCornerImage: "/icons/have-bg.png",
    trustBadges: [
      "Erfarne havefolk",
      "26% servicefradrag",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad klargøringen omfatter",
    includedTitle: "Forår og efterår — fra oprydning til klargøring.",
    includedDescription:
      "Sæsonskifte kræver ofte mere end løbende pleje. Vi hjælper med at få haven i stand, så den er klar til den nye sæson eller vinteren.",
    includedItems: [
      "Oprydning af blade, grene og vinterrester",
      "Lugning, beskæring og klargøring af bede",
      "Græspleje og forberedelse af plænen",
      "Affald og bortkørsel efter aftale",
      "Tilpasning til forår eller efterår efter behov",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til en klar have.",
    howItWorks: [
      [
        "Beskriv sæsonen",
        "Angiv om det er forår, efterår eller begge — og havens størrelse.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester klargør haven efter aftalt plan.",
      ],
    ],
    faqs: [
      {
        question: "Hvad er forskellen på forårs- og efterårsklargøring?",
        answer:
          "Forårsklargøring handler om at gøre haven klar til vækst — oprydning, lugning og pleje af bede og plæne. Efterårsklargøring fokuserer på at rydde op, beskære og forberede haven til vinter.",
      },
      {
        question: "Hvornår bør jeg bestille klargøring?",
        answer:
          "Forår bookes typisk i marts–maj, efterår i september–november. Jo før du sender forespørgsel, desto nemmere er det at finde en passende dato.",
      },
      {
        question: "Kan jeg booke begge sæsoner?",
        answer:
          "Ja. Vælg begge sæsoner i formularen, så tilpasser vi tilbuddet til forår og efterår.",
      },
      {
        question: "Kan jeg bruge Zen-kreditter?",
        answer:
          "Ja. Sæsonklargøring er en af de boligservices, du kan bruge Zen-kreditter på som medlem af Renzen Klub.",
      },
    ],
    ctaTitle: "Klar til sæsonklargøring?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et tilbud uden binding.",
    sizeFieldLabel: "Haveareal",
    sizeFieldPlaceholder: "F.eks. 150 m²",
    klubPromoDescription:
      `Zen-kreditter kan bruges på sæsonklargøring og andre udvalgte boligservices. Med Renzen Klub får du ${ZEN_CREDIT_MONTHLY_KR} kr. i kreditter hver måned — plus introtilbud på fast rengøring fra ${introCleaningFromKrLabel}`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på sæsonklargøring?",
        answer:
          "Ja. Zen-kreditter kan bruges på forårs- og efterårsklargøring og andre udvalgte boligservices. Mange medlemmer bruger kreditterne til den årlige sæsonstart.",
      },
      {
        question: "Skal jeg have fast rengøring for at bestille klargøring?",
        answer:
          "Nej. Du kan bestille sæsonklargøring som enkeltbesøg via forespørgsel. Som medlem får du mest værdi ved at kombinere med Renzen Klub og Zen-kreditter.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til sæsonklargøring?",
        answer:
          `Du får ${zenCreditMonthlyProse} til havearbejde og andre boligservices, op til 20% medlemsrabat på fast rengøring, intropris fra ${introCleaningFromKrLabel} og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  "ferieservice-til-haven": {
    slug: "ferieservice-til-haven",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til dit havearbejde",
    showKlubSections: true,
    serviceName: "Ferieservice til haven",
    heroEyebrow: "Pasning mens du er væk · Zen-kreditter",
    heroTitle: "Hold haven i live, mens du er på ferie.",
    heroDescription:
      "Få hjælp til vanding, græs og tilsyn, mens du er væk. Beskriv ferieperioden og haven — vi sender et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/havearbejde-3.png",
    heroImageAlt: "Havepasning og tilsyn i en privat have",
    heroCornerImage: "/icons/have-bg.png",
    trustBadges: [
      "Pålideligt tilsyn",
      "26% servicefradrag",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad ferieservicen kan omfatte",
    includedTitle: "Tryghed i haven, mens du er væk.",
    includedDescription:
      "Vi passer det, du har brug for — fra vanding og græs til generelt tilsyn. Du vælger opgaverne, og vi tilpasser besøgene til ferieperioden.",
    includedItems: [
      "Vanding af planter, bede og krukker",
      "Græsslåning ved længere fravær",
      "Pasning af bede og lugning efter behov",
      "Affald, oprydning og kort tilsyn",
      "Tilpasset plan for din ferieperiode",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til tryg ferie.",
    howItWorks: [
      [
        "Beskriv ferien",
        "Angiv periode, havestørrelse og hvad der skal passes.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi passer haven",
        "En erfaren Zenmester følger den aftalte plan, mens du er væk.",
      ],
    ],
    faqs: [
      {
        question: "Hvad kan ferieservice til haven omfatte?",
        answer:
          "Typisk vanding, græsslåning, pasning af bede og kort tilsyn. Du vælger opgaverne i formularen, så tilpasser vi besøg og pris til din ferie.",
      },
      {
        question: "Hvor tidligt skal jeg bestille?",
        answer:
          "Jo før, desto bedre — især i sommerferien. Send gerne forespørgsel et par uger før afrejse, så vi kan planlægge besøgene.",
      },
      {
        question: "Skal jeg give adgang til haven?",
        answer:
          "Ja. Angiv adgangsforhold i formularen — f.eks. nøgle, portkode eller nabohjælp — så vi kan passe haven, mens du er væk.",
      },
      {
        question: "Kan jeg bruge Zen-kreditter?",
        answer:
          "Zen-kreditter kan bruges på havearbejde og de øvrige udvalgte boligservices i Renzen Klub — ikke på ferieservice til haven som sådan. Som medlem får du stadig introtilbud og rabat på fast rengøring.",
      },
    ],
    ctaTitle: "Skal haven passes, mens du er væk?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et tilbud uden binding.",
    sizeFieldLabel: "Haveareal",
    sizeFieldPlaceholder: "F.eks. 150 m²",
    klubPromoDescription:
      `Som medlem får du ${zenCreditMonthlyProse} til havearbejde og andre udvalgte boligservices — plus introtilbud på fast rengøring fra ${introCleaningFromKrLabel}`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Kan jeg bruge Zen-kreditter på ferieservice?",
        answer:
          "Nej. Zen-kreditter gælder de 10 udvalgte boligservices i Renzen Klub — herunder havearbejde, men ikke ferieservice til haven som særskilt ydelse.",
      },
      {
        question: "Skal jeg have fast rengøring for at bestille ferieservice?",
        answer:
          "Nej. Du kan bestille ferieservice som enkeltbesøg via forespørgsel. Som medlem får du mest værdi ved at kombinere med Renzen Klub og Zen-kreditter.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til ferieservice?",
        answer:
          `Du får ${zenCreditMonthlyProse} til havearbejde og andre boligservices, op til 20% medlemsrabat på fast rengøring, intropris fra ${introCleaningFromKrLabel} og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
  kontorrengoring: {
    slug: "kontorrengoring",
    klubMaskVariant: "intro",
    showKlubMask: false,
    showKlubSections: false,
    serviceName: "Kontorrengøring",
    heroEyebrow: "Erhverv · Fleksible aftaler",
    heroTitle: "Professionel kontorrengøring.",
    heroDescription:
      "Hold kontoret rent og præsentabelt med faste Zenmestre og skræddersyede aftaler. Beskriv lokalerne — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/erhvervsrengoering.jpeg",
    heroImageAlt: "Professionel kontorrengøring i erhvervslokaler",
    trustBadges: [
      "CVR-verificerede partnere",
      "Forsikrede Zenmestre",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["CVR", "Verificerede partnere"],
      ["Forsikret", "Alle Zenmestre"],
      ["24 timer", "Svar på tilbud"],
      ["Fleksible tider", "Morgen eller aften"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "Rengøring tilpasset jeres kontor.",
    includedDescription:
      "Vi tilpasser opgaven til areal, antal medarbejdere og jeres ønskede frekvens — fra daglig service til ugentlig eller månedlig rengøring.",
    includedItems: [
      "Støvsugning og gulvvask i kontor- og mødelokaler",
      "Aftørring af skriveborde, overflader og kontaktpunkter",
      "Rengøring af køkken, tekøkken og opvask",
      "Toiletter og håndvaske",
      "Affaldstømning og let oprydning i fællesarealer",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til fast kontorrengøring.",
    howItWorks: [
      [
        "Beskriv kontoret",
        "Angiv areal, antal medarbejdere, frekvens og ønsket tidspunkt.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester udfører rengøringen efter den aftalte plan.",
      ],
    ],
    faqs: [
      {
        question: "Kan rengøringen ske uden for arbejdstid?",
        answer:
          "Ja. Mange kontorer vælger morgen før åbning eller aften efter lukketid. Angiv jeres præference i forespørgslen.",
      },
      {
        question: "Hvad koster kontorrengøring?",
        answer:
          "Prisen afhænger af areal, frekvens og opgavens omfang. Beskriv kontoret i formularen, så sender vi et skræddersyet tilbud.",
      },
      {
        question: "Skal vi have en fast aftale?",
        answer:
          "Nej. Du kan starte med en engangsrengøring eller vælge fast interval — dagligt, ugentligt eller månedligt.",
      },
      {
        question: "Er Zenmestrene forsikrede?",
        answer:
          "Ja. Alle Zenmestre er forsikrede, og vi arbejder kun med verificerede partnere til erhvervsopgaver.",
      },
    ],
    ctaTitle: "Klar til et rent kontor?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet erhvervstilbud uden binding.",
    sizeFieldLabel: "Areal i m²",
    sizeFieldPlaceholder: "F.eks. 200 m²",
    klubPromoDescription: "",
    klubFaqs: [],
  },
  boligforeninger: {
    slug: "boligforeninger",
    klubMaskVariant: "intro",
    showKlubMask: false,
    showKlubSections: false,
    serviceName: "Rengøring til boligforeninger",
    heroEyebrow: "Andel · Ejer · Leje",
    heroTitle: "Rene opgange og fællesarealer.",
    heroDescription:
      "Trappevask, opgange og fællesarealer til andels-, ejer- og lejeboligforeninger. Beskriv ejendommen — vi sender et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/trappe-rengøring.webp",
    heroImageAlt: "Rengøring af trappe og opgang i boligforening",
    trustBadges: [
      "Erfaring med foreninger",
      "Forsikrede Zenmestre",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["CVR", "Verificerede partnere"],
      ["Forsikret", "Alle Zenmestre"],
      ["24 timer", "Svar på tilbud"],
      ["Fleksible tider", "Tilpasset beboere"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "Rengøring af fællesarealer i foreningen.",
    includedDescription:
      "Vi tilpasser opgaven til antal lejligheder, areal og den type rengøring, foreningen har brug for — fra trappevask til vaskeri og teknikrum.",
    includedItems: [
      "Trappevask og rengøring af opgange",
      "Gulvvask og aftørring i fællesarealer",
      "Rengøring af vaskeri og teknikrum",
      "Affald og let oprydning i opgange",
      "Fast interval eller engangsopgaver efter aftale",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til fast foreningsaftale.",
    howItWorks: [
      [
        "Beskriv ejendommen",
        "Angiv antal lejligheder, fællesarealer og ønsket opgavetype.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En erfaren Zenmester udfører rengøringen efter den aftalte plan.",
      ],
    ],
    faqs: [
      {
        question: "Kan I håndtere både trappevask og fællesarealer?",
        answer:
          "Ja. Vælg opgavetype i forespørgslen — trappe, opgang, vaskeri eller en blandet løsning. Vi tilpasser tilbuddet til foreningens behov.",
      },
      {
        question: "Hvordan fastsættes prisen?",
        answer:
          "Prisen afhænger af antal lejligheder, areal, frekvens og opgavetype. Beskriv ejendommen i formularen, så sender vi et skræddersyet tilbud.",
      },
      {
        question: "Skal bestyrelsen godkende tilbuddet?",
        answer:
          "Ja. Forespørgslen er uforpligtende — I modtager et tilbud, som bestyrelsen kan vurdere og godkende, før der indgås aftale.",
      },
      {
        question: "Tilbyder I faste intervaller?",
        answer:
          "Ja. Mange foreninger vælger ugentlig eller 14-dages trappevask. Engangsopgaver kan også aftales.",
      },
    ],
    ctaTitle: "Skal opgange og fællesarealer holdes rene?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et tilbud til foreningen uden binding.",
    sizeFieldLabel: "Antal opgange",
    sizeFieldPlaceholder: "F.eks. 3 opgange",
    klubPromoDescription: "",
    klubFaqs: [],
  },
  flyttesyn: {
    slug: "flyttesyn",
    klubMaskVariant: "intro",
    showKlubMask: false,
    showKlubSections: false,
    showHeroInputs: false,
    serviceName: "Flyttesyn",
    heroEyebrow: "Ind- og fraflytningssyn",
    heroTitle: "Din professionelle synspartner.",
    heroDescription:
      "Vi er specialister i ind- og fraflytningssyn, men vores vigtigste opgave er at give lejere en god oplevelse. Beskriv boligen — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/flytterengoring-hero.jpg",
    heroImageAlt: "Professionelt flyttesyn ved ind- og fraflytning",
    trustBadges: [
      "Landsdækkende synsteam",
      "Én fast kontaktperson",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["100+", "Synkonsulenter i hele landet"],
      ["Forsikret", "Alle Zenmestre"],
      ["24 timer", "Svar på tilbud"],
      ["Ind & ud", "Fraflytning og indflytning"],
    ],
    includedEyebrow: "Vores fokus",
    includedTitle: "En god start og et trygt farvel.",
    includedDescription:
      "Et flyttesyn sætter tonen, uanset om lejeren flytter ind eller ud. Vi sørger for en professionel og rolig gennemgang, hvor stand og bemærkninger registreres korrekt fra starten.",
    includedItems: [
      "Lejeroplevelse i centrum ved både ind- og fraflytning",
      "Landsdækkende team på 100+ erfarne synkonsulenter",
      "Optimeret synsproces med præcis registrering af stand og skader",
      "Dokumentation klar til sagsmappe, lejekontrakt og opfølgning",
      "Professionel tilgang der skaber ro for lejer og udlejer",
    ],
    howItWorksEyebrow: "Vi tilbyder",
    howItWorksTitle: "En totalløsning gennem hele forløbet.",
    howItWorks: [
      [
        "Book online",
        "Udlejer eller administrator bestiller via hjemmesiden. Vi tildeler én fast kontaktperson, der følger sagen fra opsigelse til afslutning.",
      ],
      [
        "Vi koordinerer alt",
        "Renzen kontakter lejerne, planlægger syn og sikrer dokumentation ved fraflytning og indflytning, så I slipper for at koordinere selv.",
      ],
      [
        "Processen lukkes ordentligt",
        "Vi følger boligen i de første 14 dage efter indflytning, så udlejer og lejer undgår tvivl og har klart ansvar hele vejen.",
      ],
    ],
    processSection: {
      eyebrow: "Totalløsningen",
      title: "Sådan ser forløbet ud",
      body: [
        "Med Renzens totalløsning holder én fast kontaktperson tråden fra bestilling til opfølgning. Vi koordinerer dialog med lejerne, planlægger syn og leverer dokumentation undervejs — så udlejer og administrator slipper for at styre detaljerne selv.",
        "Forløbet dækker både fraflytning og indflytning: fra første kontakt og syn til færdige rapporter og de første 14 dage efter indflytning, hvor vi sikrer at processen lukkes ordentligt.",
      ],
      steps: [
        { label: "Bestilling", icon: "booking" },
        {
          label: "Koordinering",
          icon: "coordination",
          labelOffset: { y: -3 },
        },
        { label: "Fraflytningssyn", icon: "moveOut" },
        { label: "Rapport fraflytning", icon: "documentation" },
        { label: "Istandsættelse", icon: "renovation" },
        { label: "Indflytningssyn", icon: "moveIn" },
        { label: "Rapport indflytning", icon: "report" },
        {
          label: "Opfølgning",
          icon: "followup",
          labelOffset: { radial: 6, y: 4 },
        },
      ],
    },
    faqs: [
      {
        question: "Hvad er en totalløsning til flyttesyn?",
        answer:
          "Vi dækker hele forløbet fra udlejer modtager opsigelse, til den nye lejer har boet i boligen i 14 dage. Renzen håndterer kontakt til lejerne, koordinerer syn og leverer dokumentation undervejs.",
      },
      {
        question: "Kan I lave både ind- og fraflytningssyn?",
        answer:
          "Ja. Vi tilbyder fraflytningssyn, indflytningssyn eller begge dele. I vælger omfanget i forespørgslen, og vi tilpasser planen til jeres tidslinje.",
      },
      {
        question: "Hvem er kontaktpersonen?",
        answer:
          "Ved totalløsningen får I én fast kontaktperson hos Renzen, som koordinerer al dialog med lejerne og holder jer orienteret undervejs.",
      },
      {
        question: "Er synkonsulenterne forsikrede?",
        answer:
          "Ja. Alle Zenmestre er forsikrede, og vores landsdækkende team er uddannet til at gennemføre syn og registrere stand korrekt.",
      },
    ],
    ctaTitle: "Klar til en synspartner, der tager sig af hele forløbet?",
    bottomCtaLabel: "Beskriv jeres behov",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud til flyttesyn uden binding.",
    sizeFieldLabel: "Areal i m²",
    sizeFieldPlaceholder: "F.eks. 250 m²",
    klubPromoDescription: "",
    klubFaqs: [],
  },
  personalegode: {
    slug: "personalegode",
    klubMaskVariant: "zenCredit",
    klubMaskServiceLine: "til medarbejdernes rengøring",
    showKlubSections: true,
    serviceName: "Rengøring som personalegode",
    heroEyebrow: "Medarbejderfordel · Renzen Klub",
    heroTitle: "Rengøring som personalegode.",
    heroDescription:
      "Giv medarbejderne rengøring hjemme som en attraktiv fordel. Beskriv virksomheden — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/personalegode.png",
    heroImageAlt: "Rengøring som personalegode for medarbejdere",
    heroImageClassName: "heroImageRightTop",
    trustBadges: [
      "Skræddersyet HR-løsning",
      "26% servicefradrag for medarbejdere",
      "Uforpligtende tilbud",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
      ["26%", "Muligt servicefradrag"],
      ["Forsikret", "Alle Zenmestre"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "En fordel medarbejderne faktisk bruger.",
    includedDescription:
      "Rengøring som personalegode kan tilbydes som fast aftale for alle eller som løbende ordning, hvor medarbejdere selv bestiller. Vi hjælper med opsætning og koordinering.",
    includedItems: [
      "Privat rengøring hos medarbejderne",
      "Fast interval eller løbende bestilling",
      "Tilpasning til lejlighed og hus",
      "Koordinering med HR og kontaktperson",
      "Mulighed for Renzen Klub og Zen-kreditter",
    ],
    howItWorksEyebrow: "Sådan fungerer det",
    howItWorksTitle: "Fra forespørgsel til medarbejderfordel.",
    howItWorks: [
      [
        "Beskriv virksomheden",
        "Angiv antal medarbejdere, ønsket model og boligtype.",
      ],
      [
        "Modtag tilbud",
        "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "Medarbejderne får adgang til rengøring via den aftalte ordning.",
      ],
    ],
    faqs: [
      {
        question: "Hvordan fungerer rengøring som personalegode?",
        answer:
          "Virksomheden tilbyder medarbejderne rengøring hjemme — enten som fast aftale eller løbende ordning. Medarbejderne kan typisk bruge servicefradrag på arbejdslønnen.",
      },
      {
        question: "Kan medarbejdere vælge selv?",
        answer:
          "Ja, ved den løbende model bestiller medarbejderne selv rengøring. Ved fast aftale kan alle få samme interval eller en tilpasset løsning.",
      },
      {
        question: "Hvad med Renzen Klub?",
        answer:
          "Medarbejdere kan blive medlem af Renzen Klub og få Zen-kreditter, introtilbud og rabat på fast rengøring — en attraktiv tillægsfordel.",
      },
      {
        question: "Hvem er kontaktperson?",
        answer:
          "Angiv HR-kontakt i forespørgslen. Vi koordinerer opsætning, onboarding og løbende spørgsmål med den angivne kontaktperson.",
      },
    ],
    ctaTitle: "Klar til at tilbyde rengøring som fordel?",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud til jeres HR-afdeling.",
    sizeFieldLabel: "Antal medarbejdere",
    sizeFieldPlaceholder: "F.eks. 25 medarbejdere",
    klubPromoDescription:
      `Medarbejdere kan blive medlem af Renzen Klub og få ${zenCreditMonthlyProse}, introtilbud fra ${introCleaningFromKrLabel} og op til 20% rabat på fast rengøring — en stærk tillægsfordel til personalegode-ordningen.`,
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_MAN,
      },
      {
        question: "Kan medarbejdere bruge Zen-kreditter på rengøring?",
        answer:
          "Ja. Zen-kreditter kan bruges på rengøring og andre udvalgte boligservices. Det gør personalegode-ordningen endnu mere attraktiv for medarbejderne.",
      },
      {
        question: "Skal alle medarbejdere have samme aftale?",
        answer:
          "Nej. I kan vælge fast aftale for alle eller en løbende model, hvor medarbejdere selv bestiller. Vi hjælper med at finde den rigtige opsætning.",
      },
      {
        question: "Hvad er fordelene ved Renzen Klub til personalegode?",
        answer:
          `Medarbejdere får introtilbud fra ${introCleaningFromKrLabel}, ${zenCreditMonthlyProse}, op til 20% rabat på fast rengøring og mulighed for 26% servicefradrag på arbejdslønnen.`,
      },
    ],
  },
};
