import type { EditorialServiceLandingConfig } from "@/components/service-inquiry/serviceInquiryContent";
import {
  BOLIGSERVICE_SLUGS,
  type BoligserviceSlug,
} from "@/lib/serviceInquiry";
import { ZEN_CREDIT_BOLIGSERVICE_FAQ_ANSWER } from "@/lib/zenCreditServices";
import { INTRO_CLEANING_FROM_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";

const zenCreditMonthlyProse = `${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter hver måned`;
const zenCreditMonthlyLabel = `${ZEN_CREDIT_MONTHLY_KR} kr./md.`;

export type { BoligserviceSlug };
export { BOLIGSERVICE_SLUGS };

export function boligserviceInquiryPath(slug: BoligserviceSlug) {
  return `/${slug}/forespoergsel/`;
}

export const boligserviceHubIntro = {
  eyebrow: "Boligservice",
  title: "Det praktiske i hjemmet. Klaret.",
  description:
    "Fliserens, tagrenderens, maling, flytning og det der fylder. Zenmestre der møder op, når det passer dig.",
};

export type BoligserviceHubItem = {
  slug: BoligserviceSlug;
  label: string;
  description: string;
};

export const boligserviceMegaMenuItems: BoligserviceHubItem[] = [
  {
    slug: "fliserens",
    label: "Fliserens",
    description: "Algebehandling og højtryksrens, der løfter udearealet.",
  },
  {
    slug: "tagrenderens",
    label: "Tagrenderens",
    description: "Fri for løv og blade, så vandet kan løbe væk.",
  },
  {
    slug: "flytning-og-flyttehjaelp",
    label: "Flytning & flyttehjælp",
    description: "Hjælp til at flytte, fra kasser til lastbil.",
  },
  {
    slug: "malerarbejde",
    label: "Malerarbejde",
    description: "Friske vægge og pæn finish i dine rum.",
  },
  {
    slug: "bortkoersel-og-affald",
    label: "Bortkørsel & affald",
    description: "Det der skal væk, hentet og kørt.",
  },
  {
    slug: "montering-og-ophaengning",
    label: "Montering & ophængning",
    description: "Lamper, hylder og gardiner sat ordentligt op.",
  },
];

export const boligserviceHubItems: BoligserviceHubItem[] = [
  ...boligserviceMegaMenuItems,
  {
    slug: "moebelmontering",
    label: "Møbelmontering",
    description: "Flatpak til færdigt møbel, uden bøvl.",
  },
  {
    slug: "it-hjaelp-til-hjemmet",
    label: "IT-hjælp til hjemmet",
    description: "Wi-Fi, computer og tablet. Vi hjælper derhjemme.",
  },
];

const sharedDefaults: Pick<
  EditorialServiceLandingConfig,
  | "klubMaskVariant"
  | "showKlubSections"
  | "trustBadges"
  | "stats"
  | "howItWorksEyebrow"
  | "howItWorks"
  | "formTitle"
  | "formDescription"
  | "showSizeField"
  | "sizeFieldLabel"
  | "sizeFieldPlaceholder"
  | "klubPromoDescription"
  | "klubFaqs"
> = {
  klubMaskVariant: "zenCredit",
  showKlubSections: true,
  trustBadges: [
    "Verificerede Zenmestre",
    "26% servicefradrag",
    "Uforpligtende tilbud",
  ],
  stats: [
    ["4,8 ud af 5", "Kundevurdering"],
    [zenCreditMonthlyLabel, "Zen-kreditter som medlem"],
    ["26%", "Muligt servicefradrag"],
    ["Forsikret", "Alle Zenmestre"],
  ],
  howItWorksEyebrow: "Sådan fungerer det",
  howItWorks: [
    [
      "Beskriv opgaven",
      "Fortæl os hvad du har brug for hjælp til, og hvornår det passer dig.",
    ],
    [
      "Modtag tilbud",
      "Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    ],
    [
      "Vi klarer resten",
      "En kvalitetssikret Zenmester udfører opgaven efter aftalt plan.",
    ],
  ],
  formTitle: "Få et uforpligtende tilbud",
  formDescription:
    "Udfyld formularen. Vi vender tilbage med et tilbud uden binding.",
  showSizeField: false,
  sizeFieldLabel: "Postnummer",
  sizeFieldPlaceholder: "",
  klubPromoDescription:
    `Som medlem får du ${zenCreditMonthlyProse} til boligservice og andre opgaver i hjemmet. Introtilbuddet giver din første rengøring fra ${INTRO_CLEANING_FROM_KR} kr.`,
  klubFaqs: [
    {
      question: "Kan jeg bruge Zen-kreditter på boligservice?",
      answer: ZEN_CREDIT_BOLIGSERVICE_FAQ_ANSWER,
    },
    {
      question: "Er boligservice servicefradragsberettiget?",
      answer:
        "Mange opgaver i hjemmet kan være omfattet af servicefradraget med 26% fradrag i skat på arbejdslønnen, når opgaven falder ind under boligjobordningen.",
    },
    {
      question: "Skal jeg være hjemme under besøget?",
      answer:
        "Det afhænger af opgaven. Angiv adgangsforhold, når du kontakter os, så planlægger vi besøget derefter.",
    },
    {
      question: "Hvad koster det?",
      answer:
        "Prisen afhænger af opgavens omfang og kompleksitet. Kontakt os med en kort beskrivelse, så sender vi et tilbud tilpasset opgaven.",
    },
  ],
};

export const boligservicePages: Record<
  BoligserviceSlug,
  EditorialServiceLandingConfig
> = {
  fliserens: {
    ...sharedDefaults,
    slug: "fliserens",
    klubMaskServiceLine: "til fliserens",
    serviceName: "Fliserens",
    heroEyebrow: "Udearealer · Boligservice",
    heroTitle: "Algebehandling og højtryksrens, der løfter udearealet.",
    heroDescription:
      "Terrasse, indkørsel eller gangsti. Beskriv opgaven, så sender vi et uforpligtende tilbud inden for 24 timer.",
    heroImage: "/fliserens-1.webp",
    heroImageAlt: "Fliserens af terrasse og indkørsel",
    includedEyebrow: "Hvad fliserensen omfatter",
    includedTitle: "Fliser der fremstår rene og indbydende.",
    includedDescription:
      "Alger, flisepest og snavs fjernes grundigt, så udearealet igen ser velplejet ud.",
    includedItems: [
      "Algebehandling og højtryksrens af fliser",
      "Terrasser, indkørsler og gangstier",
      "Fjernelse af alger, flisepest og snavs",
      "Efterbehandling og imprægnering efter aftale",
      "Rådgivning om vedligehold",
    ],
    howItWorksTitle: "Fra forespørgsel til rene fliser.",
    faqs: [
      {
        question: "Hvilke flader kan I rense?",
        answer:
          "Typisk terrasser, indkørsler, gangstier og andre belagte udearealer. Beskriv arealet, så vurderer vi opgaven og sender et tilbud.",
      },
      {
        question: "Skal jeg fjerne møbler og krukker?",
        answer:
          "Det er en fordel at rydde området, så Zenmesteren kan komme til. Nævn det i din henvendelse, hvis du har brug for hjælp til det.",
      },
      {
        question: "Er fliserens servicefradragsberettiget?",
        answer:
          "Ja, når opgaven udføres i privat bolig og falder ind under boligjobordningen.",
      },
    ],
    ctaTitle: "Klar til rene fliser?",
  },
  tagrenderens: {
    ...sharedDefaults,
    slug: "tagrenderens",
    klubMaskServiceLine: "til tagrenderens",
    serviceName: "Tagrenderens",
    heroEyebrow: "Tagrender · Boligservice",
    heroTitle: "Fri for løv og blade, så vandet kan løbe væk.",
    heroDescription:
      "Rens af tagrender og nedløb, så regnvandet ledes væk som det skal. Uforpligtende tilbud inden for 24 timer.",
    heroImage: "/tagrende-rens.webp",
    heroImageAlt: "Tagrenderens på et privat hus",
    includedEyebrow: "Hvad tagrenderensen omfatter",
    includedTitle: "Tagrender der fungerer, sæson efter sæson.",
    includedDescription:
      "Løv, blade og snavs fjernes, så vandet kan løbe frit og undgå skader på tag og facade.",
    includedItems: [
      "Rens af tagrender og nedløb",
      "Fjernelse af løv, blade og snavs",
      "Kontrol af vandafledning",
      "Sikker adgang med korrekt udstyr",
      "Rådgivning om vedligehold og interval",
    ],
    howItWorksTitle: "Fra forespørgsel til rene tagrender.",
    faqs: [
      {
        question: "Hvor ofte bør tagrender renses?",
        answer:
          "De fleste huse har gavn af rens én til to gange om året, typisk forår og efterår. Vi hjælper gerne med at finde et interval, der passer til dit hus.",
      },
      {
        question: "Skal jeg være hjemme?",
        answer:
          "Det afhænger af adgangen til tagrenderne. Angiv forholdene i din henvendelse, så planlægger vi besøget derefter.",
      },
      {
        question: "Er tagrenderens servicefradragsberettiget?",
        answer:
          "Ja, når opgaven udføres i privat bolig og falder ind under boligjobordningen.",
      },
    ],
    ctaTitle: "Klar til rene tagrender?",
  },
  "montering-og-ophaengning": {
    ...sharedDefaults,
    slug: "montering-og-ophaengning",
    klubMaskServiceLine: "til montering og ophængning",
    serviceName: "Montering & ophængning",
    heroEyebrow: "Handyman · Boligservice",
    heroTitle: "Lamper, hylder og gardiner sat ordentligt op.",
    heroDescription:
      "Beskriv opgaven, så matcher vi dig med en Zenmester. Uforpligtende tilbud inden for 24 timer.",
    heroImage: "/services/handyman.webp",
    heroImageAlt: "Montering og ophængning i et privat hjem",
    includedEyebrow: "Hvad vi kan hjælpe med",
    includedTitle: "På plads, sikkert og pænt.",
    includedDescription:
      "Lamper, hylder, gardinstænger og det der skal hænge lige. Vi sørger for solid montering, så det sidder, som det skal.",
    includedItems: [
      "Ophængning af lamper og loftarmaturer",
      "Montering af hylder, reoler og TV-beslag",
      "Gardinstænger, persienner og rullegardiner",
      "Billeder, spejle og vægdekoration",
      "Små reparationer og justeringer efter behov",
    ],
    howItWorksTitle: "Fra forespørgsel til færdig montering.",
    faqs: [
      {
        question: "Hvilke opgaver dækker montering og ophængning?",
        answer:
          "Typisk lamper, hylder, gardiner, billeder og beslag til TV og møbler. Beskriv opgaven, så vurderer vi omfanget og sender et tilbud.",
      },
      {
        question: "Medbringer Zenmesteren værktøj?",
        answer:
          "Ja. Vores Zenmestre medbringer standardværktøj til almindelig montering. Ved særlige materialer eller tunge installationer aftaler vi det på forhånd.",
      },
      {
        question: "Kan jeg få servicefradrag?",
        answer:
          "Ja, når opgaven falder ind under boligjobordningen. Du kan trække 26% af arbejdslønnen fra i skat.",
      },
    ],
    ctaTitle: "Klar til hjælp med montering?",
  },
  moebelmontering: {
    ...sharedDefaults,
    slug: "moebelmontering",
    klubMaskServiceLine: "til møbelmontering",
    serviceName: "Møbelmontering",
    heroEyebrow: "Møbler · Boligservice",
    heroTitle: "Flatpak til færdigt møbel, uden frustration.",
    heroDescription:
      "Skabe, senge og reoler samlet korrekt. Beskriv hvad der skal samles, så sender vi et tilbud inden for 24 timer.",
    heroImage: "/services/handyman.webp",
    heroImageAlt: "Møbelmontering i en privat bolig",
    includedEyebrow: "Typiske opgaver",
    includedTitle: "Samlet korrekt, første gang.",
    includedDescription:
      "Vi samler møblerne ordentligt, så du slipper for manualer, skruer og halvt færdige skabe.",
    includedItems: [
      "Skabe, kommoder og garderobeskabe",
      "Senge, sengestel og sengegavle",
      "Reoler, borde og kontormøbler",
      "Køkken- og badeværelsesmøbler efter aftale",
      "Fastgørelse til væg ved behov",
    ],
    howItWorksTitle: "Fra forespørgsel til samlede møbler.",
    faqs: [
      {
        question: "Hvilke møbler kan I samle?",
        answer:
          "De fleste møbler fra kendte mærker og flatpak-leverandører. Send mærke og type, så vurderer vi opgaven og tidsforbruget.",
      },
      {
        question: "Hvor lang tid tager det?",
        answer:
          "Det afhænger af møblet. Et skab tager typisk 1–3 timer, mens større opgaver aftales individuelt i tilbuddet.",
      },
      {
        question: "Kan I bortskaffe emballage?",
        answer:
          "Ja, efter aftale. Nævn det i din henvendelse, så inkluderer vi det i tilbuddet.",
      },
    ],
    ctaTitle: "Klar til hjælp med møbler?",
  },
  malerarbejde: {
    ...sharedDefaults,
    showSizeField: true,
    sizeFieldLabel: "Areal (m²)",
    sizeFieldPlaceholder: "F.eks. 100",
    slug: "malerarbejde",
    klubMaskServiceLine: "til malerarbejde",
    serviceName: "Malerarbejde",
    heroEyebrow: "Maling · Boligservice",
    heroTitle: "Friske vægge og pæn finish.",
    heroDescription:
      "Indvendig maling og touch-up, tilpasset rummene og din tidsplan. Uforpligtende tilbud inden for 24 timer.",
    heroImage: "/services/maler.webp",
    heroImageAlt: "Malerarbejde i en privat bolig",
    includedEyebrow: "Hvad malerarbejdet omfatter",
    includedTitle: "Farve der løfter rummet.",
    includedDescription:
      "Vægge, lofter og detaljer forberedt og malet med omhu, så resultatet holder.",
    includedItems: [
      "Maling af vægge og lofter",
      "Spartling og forberedelse af overflader",
      "Maling af døre, karme og paneler",
      "Touch-up og mindre reparationer",
      "Rådgivning om farver og finish",
    ],
    howItWorksTitle: "Fra forespørgsel til friske rum.",
    faqs: [
      {
        question: "Medbringer I maling?",
        answer:
          "Det aftales i tilbuddet. Du kan stille maling til rådighed, eller vi kan hjælpe med indkøb efter aftale.",
      },
      {
        question: "Hvor stort et område kan I male?",
        answer:
          "Fra en enkelt væg til hele rum og lejligheder. Beskriv areal og stand, så vurderer vi tidsforbruget.",
      },
      {
        question: "Er malerarbejde servicefradragsberettiget?",
        answer:
          "Ja, når opgaven udføres i privat bolig og falder ind under boligjobordningen.",
      },
    ],
    ctaTitle: "Klar til friske vægge?",
  },
  "flytning-og-flyttehjaelp": {
    ...sharedDefaults,
    slug: "flytning-og-flyttehjaelp",
    klubMaskServiceLine: "til flyttehjælp",
    serviceName: "Flytning & flyttehjælp",
    heroEyebrow: "Flytning · Boligservice",
    heroTitle: "Flyttehjælp når du skal videre",
    heroDescription:
      "Fortæl os hvad du skal have flyttet. Vi vender tilbage med et tilbud inden for 24 timer.",
    heroImage: "/services/flyttehjaelp.webp",
    heroImageAlt: "Flyttehjælp i en privat bolig",
    includedEyebrow: "Hvad flyttehjælpen omfatter",
    includedTitle: "Hjælp hele vejen",
    includedDescription:
      "Pakning, bæring og transport. Vi tager det tunge arbejde, så du kan fokusere på resten.",
    includedItems: [
      "Hjælp til at bære møbler og kasser",
      "Pakning og beskyttelse af inventar",
      "Transport med varevogn efter aftale",
      "Ned- og opmontering af møbler",
      "Enkel flyttehjælp eller fuld flytning",
    ],
    howItWorksTitle: "Fra forespørgsel til færdig flytning.",
    faqs: [
      {
        question: "Kan I hjælpe med hele flytningen?",
        answer:
          "Ja. Vi kan hjælpe med alt fra enkel flyttehjælp til fuld flytning med transport. Beskriv omfanget, så tilpasser vi tilbuddet.",
      },
      {
        question: "Medbringer I flyttekasser?",
        answer:
          "Det aftales individuelt. Nævn det i din henvendelse, hvis du har brug for kasser eller emballage.",
      },
      {
        question: "Dækker I også flytterengøring?",
        answer:
          "Ja. Flytterengøring er en separat service. Se vores side om flytterengøring, hvis boligen skal overdrages rent.",
      },
    ],
    ctaTitle: "Klar til en lettere flytning?",
  },
  "bortkoersel-og-affald": {
    ...sharedDefaults,
    slug: "bortkoersel-og-affald",
    klubMaskServiceLine: "til bortkørsel",
    serviceName: "Bortkørsel & affald",
    heroEyebrow: "Bortkørsel · Boligservice",
    heroTitle: "Det der skal væk, hentet og kørt.",
    heroDescription:
      "Fra enkel genstand til større mængder. Beskriv hvad der skal væk, så sender vi et tilbud inden for 24 timer.",
    heroImage: "/services/affaldshaandtering.webp",
    heroImageAlt: "Bortkørsel af affald fra en privat bolig",
    includedEyebrow: "Hvad vi kan tage med",
    includedTitle: "Mere plads, mindre bøvl.",
    includedDescription:
      "Vi henter og kører det væk, fra kælder og garage til have og stue.",
    includedItems: [
      "Haveaffald, grene og større genstande",
      "Møbler, madrasser og hårde hvidevarer",
      "Byggematerialer og rester fra renovering",
      "Kasser, pap og mindre affald",
      "Sortering og korrekt bortskaffelse",
    ],
    howItWorksTitle: "Fra forespørgsel til ryddet op.",
    faqs: [
      {
        question: "Hvad kan I tage med?",
        answer:
          "De fleste genstande fra hjemmet, haven og kælderen. Beskriv hvad der skal væk, inkl. størrelse og mængde, så vurderer vi opgaven.",
      },
      {
        question: "Skal jeg sortere affaldet selv?",
        answer:
          "Det er en fordel, men ikke altid nødvendigt. Vi kan hjælpe med sortering efter aftale.",
      },
      {
        question: "Kan I komme med kort varsel?",
        answer:
          "Ofte ja, afhængigt af kapacitet. Skriv hvornår det passer dig, så finder vi en dato.",
      },
    ],
    ctaTitle: "Klar til at få ryddet op?",
  },
  "it-hjaelp-til-hjemmet": {
    ...sharedDefaults,
    slug: "it-hjaelp-til-hjemmet",
    klubMaskServiceLine: "til IT-hjælp",
    serviceName: "IT-hjælp til hjemmet",
    heroEyebrow: "IT · Boligservice",
    heroTitle: "Teknologi der virker i dit hjem",
    heroDescription:
      "Opsætning, fejlfinding og vejledning hjemme hos dig. Uforpligtende tilbud inden for 24 timer.",
    heroImage: "/services/it-support-e1754072179236.jpg",
    heroImageAlt: "IT-hjælp i et privat hjem",
    includedEyebrow: "Hvad IT-hjælpen omfatter",
    includedTitle: "Enheder der bare virker.",
    includedDescription:
      "Computer, telefon og tablet opsat, repareret og forklaret uden jargon.",
    includedItems: [
      "Opsætning af computer, tablet og telefon",
      "Wi-Fi, printer og smart home-enheder",
      "Fejlfinding og opdateringer",
      "Backup og sikkerhed",
      "Personlig vejledning i dit tempo",
    ],
    howItWorksTitle: "Fra forespørgsel til enheder, der virker.",
    faqs: [
      {
        question: "Kommer I hjem til mig?",
        answer:
          "Ja. IT-hjælpen udføres typisk i dit hjem, så vi kan se og løse problemet direkte på enhederne.",
      },
      {
        question: "Hjælper I ældre og mindre teknisk erfarne?",
        answer:
          "Ja. Vi tager os tid til at forklare og guide, uden jargon og i et tempo der passer dig.",
      },
      {
        question: "Er IT-hjælp servicefradragsberettiget?",
        answer:
          "Ja, når opgaven udføres i privat bolig og falder ind under boligjobordningen.",
      },
    ],
    ctaTitle: "Klar til IT-hjælp i hjemmet?",
  },
};
