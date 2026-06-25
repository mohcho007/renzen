/**
 * One-off generator for privatRengoringCityContent.ts — run with:
 * node scripts/generate-privat-rengoring-content.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(
  __dirname,
  "../components/privat-rengoring/privatRengoringCityContent.ts",
);

/** slug -> unique editorial copy */
const CITY_COPY = {
  koebenhavn: {
    heroTitle: "Privat rengøring i København.",
    heroDescription:
      "Privat rengøring i København, der gør hverdagen lettere. Du får mere ro i hjemmet, mere tid i kalenderen og en nem løsning, der bare fungerer. Se prisen med det samme og book på under to minutter.",
    metaDescription:
      "Privat rengøring i København. Fast Zenmester til lejligheder og byhuse i hele Københavns Kommune — forsikrede medarbejdere, servicefradrag og medlemsfordele.",
    sections: [
      {
        title: "Byliv der kræver en fast rytme",
        paragraphs: [
          "København er en by, hvor kalenderen sjældent giver plads til grundig rengøring mellem møder, børnepasning og sociale aftaler. Mange københavnere bor i kompakte lejligheder på Østerbro, Nørrebro, Vesterbro eller Amager — med trapper, fællesarealer og parkeringszoner, der gør hverdagen ekstra praktisk. En fast Zenmester giver dig en forudsigelig rytme: samme person, samme standard og et hjem der altid er klar, når du kommer hjem.",
          "Renzen dækker hele Københavns Kommune og matcher dig med en erfaren Zenmester, der kender byboliger. Vi tilpasser rengøringen til din boligtype — fra studielejlighed til familiebolig med flere værelser — og du kan vælge frekvens efter behov. Som medlem af Renzen Klub får du introtilbud fra 299 kr. på første rengøring og løbende medlemsrabat på fast aftale.",
        ],
      },
      {
        title: "Tilpasset lejligheder og byhuse",
        paragraphs: [
          "Københavnske boliger har ofte detaljer, der kræver erfaring: høje paneler, smalle badeværelser, køkkener med begrænset skabsplads og vinduer mod gården. Din Zenmester lærer disse forhold at kende over tid, så du slipper for at gentage instruktioner ved hvert besøg. Det giver et jævnt resultat og tryghed — særligt hvis du arbejder hjemme eller ofte har gæster.",
          "Du styrer aftalen online og kan tilføje ekstra opgaver med Zen-kreditter fra medlemskabet — for eksempel ovnrengøring, vinduespudsning eller hovedrengøring før ferie. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen. Det er privat rengøring, der passer til en københavnsk hverdag uden unødig administration.",
        ],
      },
      {
        title: "Mere tid til det, der betyder noget",
        paragraphs: [
          "Når rengøringen er på plads, bliver weekenderne til familietid, træning eller bare ro i stuen — i stedet for støvsuger og gulvvask. Mange københavnere oplever, at en fast aftale hver anden uge er nok til at holde hjemmet løbende rent, mens ugentlig rengøring passer til familier med små børn eller hjemmekontor.",
          "Vi hjælper også i nærliggende bydele som Frederiksberg, Valby og Hellerup. Send en forespørgsel med postnummer og boligstørrelse — eller brug prisberegneren direkte — og kom i gang med en Zenmester, der kender København.",
        ],
      },
    ],
    cityLinksDescription:
      "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Frederiksberg, Valby og København S.",
  },
  frederiksberg: {
    heroTitle: "Privat rengøring på Frederiksberg.",
    heroDescription:
      "Privat rengøring på Frederiksberg, så hjemmet er i orden uden at stjæle din fritid. Mere ro, mere tid og en nem løsning fra start til slut. Se prisen med det samme og book på under to minutter.",
    metaDescription:
      "Privat rengøring på Frederiksberg. Fast Zenmester til klassiske lejligheder og byhuse — servicefradrag, forsikrede medarbejdere og introtilbud med Renzen Klub.",
    sections: [
      {
        title: "Klassiske lejligheder med høje standarder",
        paragraphs: [
          "Frederiksberg er kendt for sine elegante herskabslejligheder, høje lofter og detaljer som stuk, paneler og originale gulve. Det sætter krav til rengøringen: overflader skal passes på, og badeværelser i ældre ejendomme kræver omhu. Hos Renzen matcher vi dig med en Zenmester, der er vant til frederiksbergske boliger og forstår, at standarden skal være høj — uden at du skal følge med i hvert hjørne.",
          "Betalingsparkering i Frederiksberg Kommune er en praktisk detalje, vi tager højde for i planlægningen. Din faste Zenmester lærer adgang, nøgler og eventuelle særlige ønsker at kende, så rengøringen bliver en naturlig del af hverdagen. Du vælger frekvens og får gennemsigtige priser med mulighed for medlemsrabat.",
        ],
      },
      {
        title: "Rengøring der passer til herskabslejligheder",
        paragraphs: [
          "Mange frederiksbergere bor i lejligheder med flere værelser, altan og køkkenalrum — boliger, der bruges intensivt i hverdagen. En fast aftale sikrer, at køkken, bad og stuer holdes løbende rene, mens du fokuserer på arbejde og familie. Zenmesteren medbringer rengøringsmidler og klude; du skal blot have støvsuger og moppe klar.",
          "Som Renzen Klub-medlem får du op til 20% rabat på fast rengøring, Zen-kreditter til andre boligopgaver og intropris fra 299 kr. på første besøg. Servicefradrag på 26% gør det økonomisk attraktivt at få professionel hjælp — og du beholder kontrollen med online booking og fast kontaktperson.",
        ],
      },
      {
        title: "Medlemsfordele i en krævende hverdag",
        paragraphs: [
          "Frederiksberg ligger tæt på København, men har sit eget tempo med caféer, haver og grønne områder som Frederiksberg Have. Når rengøringen er outsourcet til en pålidelig Zenmester, får du mere tid til det — og et hjem der altid føles velkomment, når du har gæster.",
          "Vi dækker hele Frederiksberg Kommune og hjælper også i Valby, Vanløse og København. Brug prisberegneren eller send en forespørgsel — så matcher vi dig med en Zenmester, der kender området.",
        ],
      },
    ],
    cityLinksDescription:
      "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København, Valby og Vanløse.",
  },
};

// For remaining cities, emit structured unique copy from city metadata
const REMAINING = [
  ["koebenhavn-oe", "København Ø", "lejligheder og byhuse", "Østerbro, Trianglen og Nordhavnskanten", "Parkeringszoner og ældre ejendomme med trapper"],
  ["nordhavn", "Nordhavn", "nye lejligheder og byhuse", "Orientkaj, Århusgadekvarteret og Tuborg Havn", "Elevator, parkeringskælder og moderne materialer"],
  ["koebenhavn-n", "København N", "lejligheder", "Nørrebro, Nordvest og Griffenfeldsgade-kvarteret", "Livlige gader og varierede baggårde"],
  ["koebenhavn-s", "København S", "lejligheder og rækkehuse", "Amagerbro, Islands Brygge og Kastrupvej", "Amager med både by og grønt"],
  ["koebenhavn-nv", "København NV", "lejligheder og rækkehuse", "Brønshøj, Husum og Bellahøj", "Blandede ejendomme fra mursten til nybyg"],
  ["koebenhavn-sv", "København SV", "lejligheder", "Sydhavnen, Valby og Ellebjerg", "Kompakte lejligheder og fællesarealer"],
  ["valby", "Valby", "lejligheder og villaer", "Valby Langgade, Toftegårds Plads og Grønttorvet", "Villaer, rækkehuse og lejligheder side om side"],
  ["vanloese", "Vanløse", "lejligheder og villaer", "Vanløse Torv, Jernbanebyen og Bellahøj", "Blandet byggeri med gode forbindelser"],
  ["broenshoej", "Brønshøj", "murmestervillaer og lejligheder", "Brønshøj Torv, Bellahøj og Utterslev Mose", "Murmestervillaer med trapper og haver"],
  ["kastrup", "Kastrup", "villaer og lejligheder", "Kastrupvej, Torvegade og Amager Strandvej", "Tæt på lufthavn og havn"],
  ["dragoer", "Dragør", "historiske huse og villaer", "Dragør gamle by, Sydstranden og havnen", "Charmerende gader og ældre huse"],
  ["hvidovre", "Hvidovre", "villaer og lejligheder", "Hvidovre Stationsvej, Avedøre og Friheden", "Parcelhuse, villaer og etageboliger"],
  ["roedovre", "Rødovre", "villaer og lejligheder", "Rødovre Centrum, Damhussøen og Islev", "Familieboliger med haver"],
  ["glostrup", "Glostrup", "parcelhuse og lejligheder", "Glostrup Centrum, Hvissinge og Ejby", "Centrumlejligheder og parcelhuse"],
  ["broendby", "Brøndby", "parcelhuse og lejligheder", "Brøndbyvester, Brøndbyøster og Gammel Køge Landevej", "Parcelhuse tæt på motorvejen"],
  ["broendby-strand", "Brøndby Strand", "lejligheder og rækkehuse", "Brøndby Strand Centrum og kysten", "Store etageboligkomplekser"],
  ["herlev", "Herlev", "villaer, rækkehuse og lejligheder", "Herlev Hovedgade, Hjortespring og Skovlundevej", "Tæt på hospital og erhverv"],
  ["soeborg", "Søborg", "murmestervillaer og lejligheder", "Søborg Hovedgade, Bagsværd og Hillerødgade", "Murmestervillaer og centrumlejligheder"],
  ["ballerup", "Ballerup", "rækkehuse og parcelhuse", "Ballerup Centrum, Måløv og Grantofte", "Rækkehuse og parcelhuse med haver"],
  ["skovlunde", "Skovlunde", "parcelhuse og rækkehuse", "Skovlunde Byvej, Ballerup og Herlev", "Rolige villakvarterer"],
  ["albertslund", "Albertslund", "rækkehuse og parcelhuse", "Albertslund Centrum, Herstedvester og Vestervang", "Planlagte kvarterer"],
  ["taastrup", "Taastrup", "rækkehuse, lejligheder og villaer", "Taastrup Centrum, Høje Taastrup og Korshøj", "Station og gode forbindelser"],
  ["vallensbaek", "Vallensbæk", "rækkehuse og villaer", "Vallensbæk Stationsplads, Kirkevang og kysten", "Villaer tæt på natur"],
  ["ishoej", "Ishøj", "lejligheder og parcelhuse", "Ishøj Centrum, Vejleåparken og Strandvejen", "Etageboliger og parcelhuse"],
  ["greve", "Greve", "parcelhuse og rækkehuse", "Greve Centrum, Tune og Kildebrønde", "Familievenlige parcelhuse"],
  ["solroed-strand", "Solrød Strand", "strandvillaer og parcelhuse", "Solrød Center, Solrød Strandvej og havnen", "Strandnære villaer"],
  ["karlslunde", "Karlslunde", "villaer og parcelhuse", "Karlslunde Strandvej, Greve og Karlstrup", "Villaer i grønne omgivelser"],
  ["maaloev", "Måløv", "rækkehuse og parcelhuse", "Måløv Bygade, Ballerup og Smørum", "Villakvarterer med haver"],
  ["smoerum", "Smørum", "villaer og rækkehuse", "Smørum Bygade, Stenløse og Måløv", "Nyere villaområder"],
  ["kongens-lyngby", "Kongens Lyngby", "villaer, rækkehuse og lejligheder", "Lyngby Hovedgade, Sorgenfri og Virum", "Centrum og villaer ved sø og skov"],
  ["gentofte", "Gentofte", "villaer og lejligheder", "Gentofte Hovedgade, Ordrup og Jægersborg", "Store villaer og elegante lejligheder"],
  ["dyssegaard", "Dyssegård", "villaer og rækkehuse", "Dyssegårdsvej, Søborg og Hellerup", "Grønne kvarterer mellem by og skov"],
  ["bagsvaerd", "Bagsværd", "villaer og lejligheder", "Bagsværd Stationsplads, søen og skoven", "Sø, skov og blandede boligtyper"],
  ["hellerup", "Hellerup", "villaer og herskabslejligheder", "Strandvejen, Hellerupvej og Tuborg", "Eksklusive boliger med høje forventninger"],
  ["charlottenlund", "Charlottenlund", "patricievillaer og store lejligheder", "Charlottenlund Strandvej, Jægersborg og Ordrup", "Patricievillaer ved kysten"],
];

const SECTION_TITLE_SETS = [
  [
    (n, l) => `Hverdagsliv i ${n}`,
    (n) => `Fast Zenmester til dit hjem i ${n}`,
    (n) => `Tryg rengøringspartner i ${n}`,
  ],
  [
    (n, l) => `${l} — boliger vi kender`,
    (n) => `Forudsigelig kvalitet i ${n}`,
    (n) => `Renzen Klub i ${n}`,
  ],
  [
    (n, l) => `Rengøring der passer til ${n}`,
    (n) => `Servicefradrag og gennemsigtige priser`,
    (n) => `Klar til at komme i gang i ${n}`,
  ],
];

const HERO_CTA = "Se prisen med det samme og book på under to minutter.";

/** Frederiksberg uses "på", all others use "i". */
function heroPrep(name) {
  return name === "Frederiksberg" ? "på" : "i";
}

const HERO_LINE1_VARIANTS = [
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, der gør hverdagen lettere.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, så hjemmet er i orden uden at stjæle din fritid.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, der passer ind i en travl hverdag.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, når du vil have styr på hjemmet uden besvær.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name} — mere overskud og mindre husarbejde.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name} til dig, der vil have hverdagen tilbage.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, så rengøringen ikke fylder i kalenderen.`,
  (name) => `Privat rengøring ${heroPrep(name)} ${name}, der giver dig ro omkring hjemmet.`,
];

const HERO_LINE2_VARIANTS = [
  "Du får mere ro i hjemmet, mere tid i kalenderen og en nem løsning, der bare fungerer.",
  "Mere ro, mere tid og en nem løsning fra start til slut.",
  "Ro i hjemmet, tid til det vigtige og en nem aftale, der holder.",
  "Få ro i boligen, tid til dig selv og en rengøring, der er nem at komme i gang med.",
  "Mindre stress, mere fri tid og en løsning, der er let at holde fast i.",
  "Mere ro omkring hjemmet, mere plads i ugen og en nem vej til fast hjælp.",
  "Du får ro i hjemmet, tid til det, der betyder noget, og en nem løsning hele vejen.",
  "Mere ro, mere tid i hverdagen og en rengøring, der er nem at booke og holde fast i.",
];

function slugHash(slug) {
  return slug.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function pickHeroVariant(slug, variants) {
  return variants[slugHash(slug) % variants.length];
}

function buildHeroDescription(name, slug) {
  const line1 = pickHeroVariant(slug, HERO_LINE1_VARIANTS)(name);
  const line2 = pickHeroVariant(slug + "b", HERO_LINE2_VARIANTS);
  return `${line1} ${line2} ${HERO_CTA}`;
}

function buildHeroTitle(name) {
  return `Privat rengøring ${heroPrep(name)} ${name}.`;
}

let setIdx = 0;
for (const [slug, name, housing, landmarks, localNote] of REMAINING) {
  const titles = SECTION_TITLE_SETS[setIdx % SECTION_TITLE_SETS.length];
  setIdx++;
  CITY_COPY[slug] = {
    heroTitle: buildHeroTitle(name),
    heroDescription: buildHeroDescription(name, slug),
    metaDescription: `Privat rengøring i ${name}. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.`,
    sections: [
      {
        title: titles[0](name, landmarks),
        paragraphs: [
          `I ${name} møder vi ${housing} i kvarterer som ${landmarks}. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.`,
          `${localNote}. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale.`,
        ],
      },
      {
        title: titles[1](name, landmarks),
        paragraphs: [
          `En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for ${name}. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.`,
          `Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen.`,
        ],
      },
      {
        title: titles[2](name, landmarks),
        paragraphs: [
          `Boliger i ${name} varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i ${name} — og sørger for, at rengøringen passer ind i din uge uden bøvl.`,
          `Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender ${name}.`,
        ],
      },
    ],
    cityLinksDescription: `Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder ${name} og omkringliggende byer.`,
  };
}

const slugs = Object.keys(CITY_COPY);
const file = `import type { City } from "@/data/cities";
import {
  AIRBNB_WHY_SECTION_IMAGES,
  type EditorialImageTextBlock,
  type EditorialServiceLandingConfig,
} from "@/components/service-inquiry/serviceInquiryContent";
import {
  PRIVAT_RENGORING_PRIORITY_1_CITIES,
  getPrivatRengoringPriority1City,
} from "@/lib/privatRengoringCities";
import { INTRO_CLEANING_FROM_KR, KLUB_ANNUAL_KR, KLUB_MONTHLY_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import {
  ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
  ZEN_CREDIT_SERVICES_SECTION_INTRO,
} from "@/lib/zenCreditServices";

const introFromLabel = \`\${INTRO_CLEANING_FROM_KR} kr.\`;
const zenCreditMonthlyLabel = \`\${ZEN_CREDIT_MONTHLY_KR} kr./md.\`;

type PrivatRengoringEditorialSection = {
  title: string;
  paragraphs: string[];
};

type PrivatRengoringCityCopy = {
  heroTitle: string;
  heroDescription: string;
  metaDescription: string;
  editorialSections: PrivatRengoringEditorialSection[];
  cityLinksDescription: string;
  faqs: { question: string; answer: string }[];
};

const PRIVAT_INCLUDED_ITEMS = [
  "Støvsugning og gulvvask i alle rum",
  "Afstøvning af overflader, hylder og møbler",
  "Rengøring af køkken, bordplader og håndvask",
  "Rengøring af toilet, håndvask og brusekabine",
  "Tømning af skraldespande og affald",
  "Din faste Zenmester lærer dit hjem at kende",
];

function buildPrivatWhySections(
  sections: PrivatRengoringEditorialSection[],
  cityName: string,
): EditorialImageTextBlock[] {
  return sections.map((section, index) => {
    const imageMeta = AIRBNB_WHY_SECTION_IMAGES[index];
    return {
      ...section,
      image: imageMeta.image,
      imagePosition: imageMeta.imagePosition,
      imageAlt: \`\${imageMeta.imageAlt} i \${cityName}\`,
    };
  });
}

function defaultFaqs(cityName: string, municipality: string, nearby: string[]) {
  return [
    {
      question: \`Dækker I hele \${cityName}?\`,
      answer: \`Ja. Vi tilbyder privat rengøring i \${municipality} og omegn, herunder \${nearby.slice(0, 4).join(", ")}.\`,
    },
    {
      question: \`Får jeg altid den samme Zenmester i \${cityName}?\`,
      answer:
        "Ja. Ved faste aftaler sender vi den samme Zenmester, så vedkommende lærer dit hjem og dine ønsker at kende.",
    },
    {
      question: \`Kan jeg få servicefradrag på rengøring i \${cityName}?\`,
      answer:
        "Ja. Privat rengøring er fradragsberettiget i Danmark. Du kan trække 26% af arbejdslønnen fra i skat.",
    },
    {
      question: \`Hvad koster privat rengøring i \${cityName}?\`,
      answer: \`Prisen afhænger af boligens størrelse og frekvens. Brug prisberegneren eller send en forespørgsel — de fleste hjem i \${cityName} starter fra vores listepris med mulighed for medlemsrabat.\`,
    },
  ];
}

const PRIVAT_RENGORING_CITY_COPY: Record<string, PrivatRengoringCityCopy> = ${JSON.stringify(CITY_COPY, null, 2)
  .replace(/"sections":/g, '"editorialSections":')
  .replace(/"sections"/g, '"editorialSections"')};

// Fix JSON key from generator
${""}
`;

// Fix the sections -> editorialSections in the JSON output
let fixed = file.replace(/"sections":/g, '"editorialSections":');

// Add faqs to each city entry programmatically in the output - the JSON won't have faqs
// Instead rebuild the copy object properly
const copyWithFaqs = {};
for (const slug of slugs) {
  copyWithFaqs[slug] = {
    ...CITY_COPY[slug],
    editorialSections: CITY_COPY[slug].sections,
    faqs: null, // placeholder
  };
  delete copyWithFaqs[slug].sections;
}

const finalFile = `import type { City } from "@/data/cities";
import {
  AIRBNB_WHY_SECTION_IMAGES,
  type EditorialImageTextBlock,
  type EditorialServiceLandingConfig,
} from "@/components/service-inquiry/serviceInquiryContent";
import {
  PRIVAT_RENGORING_PRIORITY_1_CITIES,
} from "@/lib/privatRengoringCities";
import { INTRO_CLEANING_FROM_KR, KLUB_ANNUAL_KR, KLUB_MONTHLY_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import {
  ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
} from "@/lib/zenCreditServices";

const introFromLabel = \`\${INTRO_CLEANING_FROM_KR} kr.\`;
const zenCreditMonthlyLabel = \`\${ZEN_CREDIT_MONTHLY_KR} kr./md.\`;

type PrivatRengoringEditorialSection = {
  title: string;
  paragraphs: string[];
};

type PrivatRengoringCityCopy = {
  heroTitle: string;
  heroDescription: string;
  metaDescription: string;
  editorialSections: PrivatRengoringEditorialSection[];
  cityLinksDescription: string;
};

function buildPrivatWhySections(
  sections: PrivatRengoringEditorialSection[],
  cityName: string,
): EditorialImageTextBlock[] {
  return sections.map((section, index) => {
    const imageMeta = AIRBNB_WHY_SECTION_IMAGES[index];
    return {
      ...section,
      image: imageMeta.image,
      imagePosition: imageMeta.imagePosition,
      imageAlt: \`\${imageMeta.imageAlt.replace("Airbnb-klargøring", "Privat rengøring")} i \${cityName}\`,
    };
  });
}

function cityFaqs(city: City) {
  return [
    {
      question: \`Dækker I hele \${city.name}?\`,
      answer: \`Ja. Vi tilbyder privat rengøring i \${city.municipality} og omegn, herunder \${city.nearbyAreas.slice(0, 4).join(", ")}.\`,
    },
    {
      question: \`Får jeg altid den samme Zenmester i \${city.name}?\`,
      answer:
        "Ja. Ved faste aftaler sender vi den samme Zenmester, så vedkommende lærer dit hjem og dine ønsker at kende.",
    },
    {
      question: \`Kan jeg få servicefradrag på rengøring i \${city.name}?\`,
      answer:
        "Ja. Privat rengøring er fradragsberettiget i Danmark. Du kan trække 26% af arbejdslønnen fra i skat.",
    },
    {
      question: \`Hvad koster privat rengøring i \${city.name}?\`,
      answer: \`Prisen afhænger af boligens størrelse og frekvens. Brug prisberegneren eller send en forespørgsel — de fleste hjem i \${city.name} starter fra vores listepris med mulighed for medlemsrabat.\`,
    },
  ];
}

const PRIVAT_INCLUDED_ITEMS = [
  "Støvsugning og gulvvask i alle rum",
  "Afstøvning af overflader, hylder og møbler",
  "Rengøring af køkken, bordplader og håndvask",
  "Rengøring af toilet, håndvask og brusekabine",
  "Tømning af skraldespande og affald",
  "Din faste Zenmester lærer dit hjem at kende",
];

const PRIVAT_RENGORING_CITY_COPY: Record<string, PrivatRengoringCityCopy> = ${JSON.stringify(
  Object.fromEntries(
    slugs.map((slug) => [
      slug,
      {
        heroTitle: CITY_COPY[slug].heroTitle,
        heroDescription: CITY_COPY[slug].heroDescription,
        metaDescription: CITY_COPY[slug].metaDescription,
        editorialSections: CITY_COPY[slug].sections,
        cityLinksDescription: CITY_COPY[slug].cityLinksDescription,
      },
    ]),
  ),
  null,
  2,
)};

export function getPrivatRengoringCityMetaDescription(
  citySlug: string,
): string | undefined {
  return PRIVAT_RENGORING_CITY_COPY[citySlug]?.metaDescription;
}

export function getPrivatRengoringCityCopy(
  citySlug: string,
): PrivatRengoringCityCopy | undefined {
  return PRIVAT_RENGORING_CITY_COPY[citySlug];
}

export function buildPrivatRengoringCityPageConfig(
  city: City,
): EditorialServiceLandingConfig {
  const copy = PRIVAT_RENGORING_CITY_COPY[city.slug];
  if (!copy) {
    throw new Error(\`Missing privat rengøring city copy for slug: \${city.slug}\`);
  }

  const otherCities = PRIVAT_RENGORING_PRIORITY_1_CITIES.filter(
    (entry) => entry.slug !== city.slug,
  );

  return {
    slug: "privat-rengoring",
    klubMaskVariant: "intro",
    klubMaskServiceLine: "til din rengøring",
    showKlubSections: true,
    serviceName: "Privat rengøring",
    heroEyebrow: "Renzen Klub · Fast Zenmester",
    heroTitle: copy.heroTitle,
    heroDescription: copy.heroDescription,
    heroImage: "/flytterengoring-hero.jpg",
    heroImageAlt: \`Privat rengøring i \${city.name} med Renzen\`,
    trustBadges: [
      "Forsikrede Zenmestre",
      "Tilfredshedsgaranti",
      "26% servicefradrag",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [\`Fra \${introFromLabel}\`, "Første rengøring med Klub"],
      ["26%", "Muligt servicefradrag"],
      ["Fast Zenmester", "Samme ansigt hver gang"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "Det får du med privat rengøring",
    includedDescription:
      "Vores standardrengøring dækker det, de fleste hjem har brug for hver uge eller hver anden uge — tilpasset din bolig og dine ønsker.",
    includedItems: PRIVAT_INCLUDED_ITEMS,
    whyRenzen: {
      eyebrow: \`Privat rengøring i \${city.name}\`,
      sections: buildPrivatWhySections(copy.editorialSections, city.name),
    },
    showReviews: true,
    cityLinks: {
      eyebrow: "Andre byer",
      title: "Privat rengøring i andre byer",
      description: copy.cityLinksDescription,
      cities: otherCities,
    },
    howItWorksEyebrow: "Sådan kommer du i gang",
    howItWorksTitle: "Fra forespørgsel til fast Zenmester",
    howItWorks: [
      [
        "Beskriv din bolig",
        \`Angiv postnummer, størrelse og ønsket frekvens for dit hjem i \${city.name}.\`,
      ],
      [
        "Modtag tilbud",
        "Se pris med det samme eller få et uforpligtende tilbud inden for 24 timer.",
      ],
      [
        "Vi klarer resten",
        "En fast Zenmester overtager rengøringen efter aftalt plan.",
      ],
    ],
    faqs: cityFaqs(city),
    klubFaqs: [
      {
        question: "Hvad er Zen-kreditter og medlemskabet?",
        answer: ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
      },
      {
        question: "Hvordan bruger jeg introtilbuddet?",
        answer: \`Introtilbuddet giver din første rengøring fra \${introFromLabel} (op til 70 m²) ved fast rengøring hver 2. uge og aktivt Renzen Klub-medlemskab.\`,
      },
      {
        question: "Kan jeg styre mit medlemskab online?",
        answer: \`Ja. Du vælger medlemskab online ved booking. Månedsplan koster \${KLUB_MONTHLY_KR} kr., årsplan \${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr.\`,
      },
      {
        question: "Hvad er fordelene ved Renzen Klub?",
        answer: \`Op til 20% medlemsrabat, Zen-kreditter, intropris fra \${introFromLabel} og 26% servicefradrag.\`,
      },
    ],
    ctaTitle: \`Klar til privat rengøring i \${city.name}?\`,
    bottomCtaLabel: "Se din pris",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud uden binding.",
    showSizeField: true,
    showHeroInputs: true,
    heroFormWideInputs: true,
    sizeFieldLabel: "Boligstørrelse",
    sizeFieldPlaceholder: "F.eks. 100",
    klubPromoDescription: \`Med Renzen Klub får du \${zenCreditMonthlyLabel} i Zen-kreditter hver måned — plus introtilbud på fast rengøring fra \${introFromLabel}.\`,
  };
}
`;

fs.writeFileSync(outPath, finalFile, "utf8");
console.log(`Wrote ${slugs.length} cities to ${outPath}`);
