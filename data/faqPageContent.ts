import { generalFAQs, serviceFAQs } from "@/data/faqs";
import {
  INTRO_CLEANING_FROM_KR,
  KLUB_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";
import { faqSlug } from "@/lib/faqSlug";
import { ZEN_CREDIT_FAQ_SHORT } from "@/lib/zenCreditServices";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  description: string;
  items: FaqEntry[];
};

function toEntries(items: { question: string; answer: string }[]): FaqEntry[] {
  return items.map((item) => ({
    id: faqSlug(item.question),
    question: item.question,
    answer: item.answer,
  }));
}

const pricingFAQs = [
  {
    question: "Hvad koster rengøringshjælp hos Renzen?",
    answer:
      "Prisen er baseret på en fast grundpris plus et beløb pr. kvadratmeter. Faste ugentlige aftaler udløser rabat, hver 2. uge giver 15% rabat og hver 4. uge giver 5% rabat. Brug prisberegneren for at se din præcise pris.",
  },
  {
    question: "Er der skjulte gebyrer eller opstartsgebyrer?",
    answer:
      "Nej. Vores priser er gennemskuelige. Du betaler kun den beregnede pris baseret på boligens størrelse og valgt frekvens. Ingen administrationsgebyrer eller skjulte tillæg.",
  },
  {
    question: "Hvornår trækkes betalingen?",
    answer:
      "Betalingen godkendes først, efter at rengøringen er udført og afsluttet af din Zenmester. Vi trækker aldrig beløbet forud.",
  },
  {
    question: "Hvordan fungerer servicefradraget?",
    answer:
      "Rengøring i private hjem er fradragsberettiget under servicefradraget i Danmark. Du kan trække ca. 26% af arbejdslønnen fra i skat. Vi sender en faktura, som du nemt kan indberette på SKATs TastSelv.",
  },
  {
    question: "Kan jeg få servicefradrag for erhvervsrengøring?",
    answer:
      "Nej, servicefradraget gælder udelukkende for private husholdninger og dækker ikke erhvervsrengøring.",
  },
  {
    question: "Hvor meget kan jeg spare med servicefradraget?",
    answer:
      "Du kan få fradrag for serviceydelser (hjemmerengøring) på op til 11.900 kr. pr. person i husstanden. Skatteværdien er på ca. 26%, hvilket giver en direkte besparelse på arbejdslønnen.",
  },
];

const trustFAQs = [
  {
    question: "Skal jeg være hjemme under rengøringen?",
    answer:
      "Nej, det er helt op til dig. Ved første besøg er det en god idé at mødes med din Zenmester og gennemgå hjemmet. Derefter kan rengøringen ske, mens du er på arbejde, og du kan overlevere nøgler, så Zenmesteren kan komme uden at du er hjemme.",
  },
  {
    question: "Hvad dækker jeres forsikring?",
    answer:
      "Renzen er fuldt forsikret med både ansvars- og indboforsikring. Du er dækket, hvis der sker uheld under rengøringen, og behøver ikke bekymre dig om skader på dit inventar. Vores erhvervsansvarsforsikring dækker skader som direkte følge af rengøringsarbejdet, op til 10 millioner kroner.",
  },
  {
    question: "Hvad sker der hvis jeg skal aflyse?",
    answer:
      "Du kan frit aflyse eller ændre din aftale op til 48 timer før rengøringen starter. Ved aflysning senere end dette kan der forekomme et gebyr.",
  },
  {
    question: "Hvad hvis jeg ikke er tilfreds?",
    answer:
      "Kontakt os straks og beskriv problemet detaljeret – gerne med billeder. Vi tilbyder at genudføre rengøringen på de manglende steder og finder en løsning, du er tilfreds med. Din feedback hjælper os med at forbedre servicen.",
  },
];

const bookingFAQs = [
  {
    question: "Hvordan fungerer Renzen?",
    answer:
      "Du bruger prisberegneren, indtaster antal kvadratmeter og får en fast pris med det samme. Derefter kan du booke direkte online på under 2 minutter.",
  },
  {
    question: "Hvordan kan jeg booke en rengøring?",
    answer:
      "Book online via hjemmesiden på under 2 minutter: klik på Book rengøring, udfyld adresse, dato, tid og boligstørrelse, vælg rengøringstype og tilvalg, og bekræft. Du modtager en e-mail med alle detaljerne.",
  },
  {
    question: "Hvor ofte kan jeg få gjort rent?",
    answer:
      "Du kan vælge enkeltstående rengøring eller faste aftaler som ugentligt, hver anden uge eller hver 4. uge. Vi tilpasser os dit behov.",
  },
  {
    question: "Hvad koster det at booke?",
    answer:
      "Prisen afhænger af kvadratmeter og valgt service. Du ser den præcise, faste pris i beregneren før du bekræfter. Der er ingen skjulte gebyrer eller binding.",
  },
];

const klubFAQs = [
  {
    question: "Hvad er Renzen Klub?",
    answer:
      `Renzen Klub er vores medlemskab til dig, der vil have fast rengøring. Du betaler ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for et helt år og får lavere priser på rengøring plus Zen-kreditter til andre opgaver i hjemmet.`,
  },
  {
    question: "Hvad er Zen-kreditter?",
    answer: ZEN_CREDIT_FAQ_SHORT,
  },
  {
    question: "Hvad er introtilbuddet til 179 kr.?",
    answer:
      "Introtilbuddet gælder din første rengøring. Det er en engangspris, så du kan prøve en Zenmester uden risiko. Se aktuelle intropriser på dealsiden.",
  },
  {
    question: "Hvad sker der efter første rengøring?",
    answer:
      "Efter introbesøget fortsætter du til medlemspris på de næste besøg, hvis du er medlem af Renzen Klub. Du kan altid se pris og vilkår, før du godkender.",
  },
  {
    question: "Er der binding på medlemskabet?",
    answer:
      "Renzen Klub koster 790 kr. for 12 måneders medlemskab. Du kan opsige inden fornyelse, så fremtidige fornyelser stopper — den betalte periode refunderes ikke.",
  },
  {
    question: "Kan jeg kombinere klubfordele og servicefradrag?",
    answer:
      "Ja. Medlemsfordele og servicefradrag kan bruges samtidig, når betingelserne for fradrag er opfyldt.",
  },
];

const dealsFAQs = [
  {
    question: "Hvordan bruger jeg introtilbuddet i Renzen Klub?",
    answer:
      `Gå til Renzen Klub (/klub/), vælg boligstørrelse og frekvens. Intropris, normalpris og medlemskab vises, før du godkender. Din første rengøring kan starte fra ${INTRO_CLEANING_FROM_KR} kr. med aktivt Renzen Klub-medlemskab (efter ${ZEN_CREDIT_MONTHLY_KR} kr. velkomstkredit).`,
  },
  {
    question: "Gælder introtilbuddet for alle services?",
    answer:
      "Introtilbuddet gælder primært fast privat rengøring via Renzen Klub. Specialservices som flytterengøring og erhverv har egne tilbud og forespørgselsflows.",
  },
  {
    question: "Hvad er forskellen på dealside og almindelig booking?",
    answer:
      "Dealsiden samler introtilbud, Renzen Klub-medlemskab og medlemsfordele i ét flow. Almindelig booking via prisberegneren er velegnet, hvis du vil booke uden introtilbud.",
  },
];

const vinduespudsningFAQs = [
  {
    question: "Pudser I både indvendige og udvendige vinduer?",
    answer:
      "Ja. Vi tilbyder indvendig og udvendig vinduespudsning afhængigt af adgangsforhold. Angiv ønskerne i forespørgslen, så tilpasser vi tilbuddet.",
  },
  {
    question: "Hvor ofte bør vinduer pudses?",
    answer:
      "Mange vælger hver 3. eller 6. måned. Du kan også bestille en enkelt pudsning, når du har brug for det.",
  },
  {
    question: "Kan jeg bruge Zen-kreditter på vinduespudsning?",
    answer:
      "Ja. Zen-kreditter kan bruges på vinduespudsning og andre udvalgte boligservices som medlem af Renzen Klub.",
  },
  {
    question: "Kan jeg få servicefradrag på vinduespudsning?",
    answer:
      "Ja. Vinduespudsning i privat bolig kan være servicefradragsberettiget med 26% fradrag i skat på arbejdslønnen.",
  },
];

const flytterengoringExtraFAQs = [
  {
    question: "Skal boligen være tom inden rengøringen?",
    answer:
      "Ja, flytterengøring udføres i en ryddet og tom bolig. Møbler og personlige ejendele skal være fjernet, så vi kan komme til alle overflader.",
  },
  {
    question: "Kan jeg få servicefradrag på flytterengøring?",
    answer:
      "Ja. Flytterengøring er servicefradragsberettiget, så længe du er tilmeldt folkeregisteret på adressen på udførelsestidspunktet.",
  },
  {
    question: "Hvilke rengøringsmidler bruger I?",
    answer:
      "Vi bruger professionelle rengøringsmidler, der er effektive og skånsomme for miljøet.",
  },
  {
    question: "Kan I fjerne pletter fra vægge og gulve?",
    answer:
      "Vi gør vores bedste for at fjerne pletter, men kan ikke garantere fjernelse af alle vanskelige pletter.",
  },
  {
    question: "Er der noget, vi ikke skal gøre inden rengøringen?",
    answer:
      "Du behøver ikke at støvsuge eller vaske gulve eller rengøre ovnen indvendigt. Sørg for, at boligen er tom, og at der er lys, strøm og vand.",
  },
];

const kontorrengoringFAQs = [
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
];

const boligforeningerFAQs = [
  {
    question: "Kan I håndtere både trappevask og fællesarealer?",
    answer:
      "Ja. Vælg opgavetype i forespørgslen — trappe, opgang, vaskeri eller en blandet løsning. Vi tilpasser tilbuddet til foreningens behov.",
  },
  {
    question: "Hvordan fastsættes prisen for boligforeninger?",
    answer:
      "Prisen afhænger af antal lejligheder, areal, frekvens og opgavetype. Beskriv ejendommen i formularen, så sender vi et skræddersyet tilbud.",
  },
  {
    question: "Tilbyder I faste intervaller til foreninger?",
    answer:
      "Ja. Mange foreninger vælger ugentlig eller 14-dages trappevask. Engangsopgaver kan også aftales.",
  },
];

const personalegodeFAQs = [
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
    question: "Hvad med Renzen Klub til medarbejdere?",
    answer:
      "Medarbejdere kan blive medlem af Renzen Klub og få Zen-kreditter, introtilbud og rabat på fast rengøring — en attraktiv tillægsfordel.",
  },
];

const flyttesynFAQs = [
  {
    question: "Hvad dækker et flyttesyn?",
    answer:
      "Flyttesynet omfatter en systematisk gennemgang af lokalerne med fokus på stand, synlige skader og afvigelser — dokumenteret så I kan bruge materialet i jeres sagsmappe.",
  },
  {
    question: "Kan I lave både ind- og udflytningssyn?",
    answer:
      "Ja. Vælg indflytning, udflytning eller begge dele i forespørgslen. Vi tilpasser omfanget og dokumentationen til jeres behov.",
  },
  {
    question: "Hvornår bør flyttesynet udføres?",
    answer:
      "Indflytningssyn bør helst ske før indflytning, og udflytningssyn før overdragelse. Angiv jeres tidsplan i formularen, så vi kan planlægge derefter.",
  },
];

const havearbejdeFAQs = [
  {
    question: "Hvad koster havearbejde?",
    answer:
      "Prisen afhænger af havens størrelse, opgavetype og om det er enkeltbesøg eller fast aftale. Beskriv opgaven i formularen, så sender vi et skræddersyet tilbud.",
  },
  {
    question: "Kan jeg få servicefradrag på havearbejde?",
    answer:
      "Ja. Havepleje i privat bolig kan være servicefradragsberettiget med 26% fradrag i skat på arbejdslønnen.",
  },
  {
    question: "Tilbyder I faste haveaftaler?",
    answer:
      "Ja. Mange vælger fast græsslåning eller løbende havepleje gennem sæsonen. Du kan også bestille en enkelt opgave.",
  },
];

export const faqCategories: FaqCategory[] = [
  {
    id: "generelt",
    title: "Generelt om Renzen",
    description: "Hvem vi er, hvordan platformen fungerer og hvad en Zenmester er.",
    items: toEntries([...generalFAQs, ...bookingFAQs]),
  },
  {
    id: "pris-betaling",
    title: "Pris & betaling",
    description: "Priser, betaling, rabatter og servicefradrag.",
    items: toEntries(pricingFAQs),
  },
  {
    id: "tryghed",
    title: "Tryghed, forsikring & aflysning",
    description: "Forsikring, nøgler, tilfredshedsgaranti og aflysning.",
    items: toEntries(trustFAQs),
  },
  {
    id: "privat-rengoring",
    title: "Privat rengøring",
    description: "Fast rengøringshjælp, Zenmestre og løbende aftaler.",
    items: toEntries(serviceFAQs["privat-rengoring"] ?? []),
  },
  {
    id: "airbnb-rengoring",
    title: "Airbnb rengøring",
    description: "Rengøring mellem gæster, koordinering og værtsservice.",
    items: toEntries(serviceFAQs["airbnb-rengoring"] ?? []),
  },
  {
    id: "flytterengoring",
    title: "Flytterengøring",
    description: "Dybdegående rengøring ved flytning og aflevering.",
    items: toEntries([
      ...(serviceFAQs["flytterengoring"] ?? []),
      ...flytterengoringExtraFAQs,
    ]),
  },
  {
    id: "hovedrengoring",
    title: "Hovedrengøring",
    description: "Grundig rengøring fra paneler til kalk.",
    items: toEntries(serviceFAQs["hovedrengoring"] ?? []),
  },
  {
    id: "vinduespudsning",
    title: "Vinduespudsning",
    description: "Indvendig og udvendig pudsning af ruder.",
    items: toEntries(vinduespudsningFAQs),
  },
  {
    id: "kontorrengoring",
    title: "Kontorrengøring",
    description: "Rengøring til kontorer og erhvervslokaler.",
    items: toEntries([
      ...(serviceFAQs["erhvervsrengoring"] ?? []),
      ...kontorrengoringFAQs,
    ]),
  },
  {
    id: "boligforeninger",
    title: "Boligforeninger",
    description: "Trappevask og rengøring af fællesarealer.",
    items: toEntries(boligforeningerFAQs),
  },
  {
    id: "flyttesyn",
    title: "Flyttesyn",
    description: "Dokumenteret gennemgang ved ind- og udflytning.",
    items: toEntries(flyttesynFAQs),
  },
  {
    id: "personalegode",
    title: "Rengøring som personalegode",
    description: "Rengøring som medarbejderfordel i virksomheder.",
    items: toEntries(personalegodeFAQs),
  },
  {
    id: "havearbejde",
    title: "Havearbejde",
    description: "Græs, hæk, lugning og sæsonpleje.",
    items: toEntries(havearbejdeFAQs),
  },
  {
    id: "renzen-klub",
    title: "Renzen Klub",
    description: "Medlemskab, Zen-kreditter og medlemsfordele.",
    items: toEntries(klubFAQs),
  },
  {
    id: "deals",
    title: "Deals & introtilbud",
    description: "Intropriser, dealside og særlige tilbud.",
    items: toEntries(dealsFAQs),
  },
];

export function getAllFaqEntries(): FaqEntry[] {
  return faqCategories.flatMap((category) => category.items);
}
