import type { City } from "@/data/cities";
import { getCityBySlug, cities } from "@/data/cities";
import { SERVED_AREA_LABEL } from "@/lib/serviceArea";
import {
  AIRBNB_INCLUDED_ROOMS,
  AIRBNB_WHY_SECTION_IMAGES,
  serviceInquiryPages,
  type EditorialCityLink,
  type EditorialImageTextBlock,
  type EditorialServiceLandingConfig,
} from "@/components/service-inquiry/serviceInquiryContent";

const AIRBNB_EDITORIAL_CITY_NAMES = [
  "København",
  "Frederiksberg",
  "Gentofte",
  "Aarhus",
  "Odense",
  "Aalborg",
  "Roskilde",
  "Helsingør",
] as const;

function editorialCityLink(name: string): EditorialCityLink {
  const city = cities.find((entry) => entry.name === name);
  if (!city) {
    throw new Error(`City not found for editorial link: ${name}`);
  }
  return { name: city.name, slug: city.slug };
}

export const AIRBNB_EDITORIAL_CITIES: EditorialCityLink[] =
  AIRBNB_EDITORIAL_CITY_NAMES.map(editorialCityLink);

/** @deprecated Use AIRBNB_EDITORIAL_CITIES */
export const AIRBNB_SERVED_EDITORIAL_CITIES = AIRBNB_EDITORIAL_CITIES;

export function getAirbnbEditorialCitySlugs(): string[] {
  return AIRBNB_EDITORIAL_CITIES.map((city) => city.slug);
}

/** @deprecated Use getAirbnbEditorialCitySlugs */
export function getAirbnbServedCitySlugs(): string[] {
  return getAirbnbEditorialCitySlugs();
}

export function getAirbnbEditorialCity(citySlug: string): City | undefined {
  const city = getCityBySlug(citySlug);
  if (!city) return undefined;
  return AIRBNB_CITY_COPY[city.slug] ? city : undefined;
}

/** @deprecated Use getAirbnbEditorialCity */
export function getAirbnbServedCity(citySlug: string): City | undefined {
  return getAirbnbEditorialCity(citySlug);
}

type AirbnbEditorialSection = {
  title: string;
  paragraphs: string[];
};

type AirbnbCityCopy = {
  heroTitle: string;
  heroDescription: string;
  metaDescription: string;
  editorialSections: AirbnbEditorialSection[];
  cityLinksDescription: string;
  hostBenefitsTitle: string;
  faqs: { question: string; answer: string }[];
};

function buildAirbnbWhySections(
  sections: AirbnbEditorialSection[],
  cityName: string,
): EditorialImageTextBlock[] {
  return sections.map((section, index) => {
    const imageMeta = AIRBNB_WHY_SECTION_IMAGES[index];
    return {
      ...section,
      image: imageMeta.image,
      imagePosition: imageMeta.imagePosition,
      imageAlt: `${imageMeta.imageAlt} i ${cityName}`,
    };
  });
}

const AIRBNB_CITY_COPY: Record<string, AirbnbCityCopy> = {
  koebenhavn: {
    heroTitle: "Driftssikker Airbnb-klargøring i København.",
    heroDescription:
      "Få pålidelig rengøring mellem gæster i din københavnske udlejningsbolig. Vi kender byens tempo, parkeringsforhold og de stramme vinduer mellem check-out og check-in — og vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    metaDescription:
      "Professionel Airbnb rengøring i København. Klargøring mellem check-out og check-in med sengetøjsskift, tjeklister og hurtig turn-around i hele hovedstaden.",
    editorialSections: [
      {
        title: "Et marked med høje forventninger",
        paragraphs: [
          "København er en af Danmarks mest efterspurgte Airbnb-destinationer — og det sætter pres på dig som vært. Gæster forventer hotelstandard i lejligheder på Østerbro, Nørrebro, Amager og i Sydhavn, og én dårlig anmeldelse om støv i hjørner eller beskidt badeværelse kan koste dig Superhost-status. Renzen hjælper dig med at holde en stabil, professionel standard uden at du selv skal stå med moppen mellem to bookinger.",
          "Vi dækker hele Københavns Kommune inden for Storkøbenhavn (postnr. 1000–2990) og arbejder dagligt i kvarterer med mange korttidsudlejninger. Vores Zenmestre kender de typiske udfordringer: kompakte bylejligheder, trapper uden elevator, betalingsparkering og gæster der checker ud sent om morgenen. Vi planlægger klargøringen, så boligen er klar til næste ankomst — med sengetøj, håndklæder og et hjem der føles gennemført rent."
        ],
      },
      {
        title: "Tjekliste der matcher din bolig",
        paragraphs: [
          "Vores Airbnb-pakke følger en fast tjekliste: stuer, køkken, soveværelser og badeværelse gøres klart til næste gæst, inklusive skift af sengetøj og håndklæder, tømning af skrald og et visuelt reset af boligen. Har du brug for linnedservice, ovnrengøring, køleskab eller vinduer, vælger du tilvalg når du sender forespørgsel — så du slipper for at koordinere flere leverandører i en travl uge.",
          "Som Renzen Klub-medlem kan du bruge Zen-kreditter på Airbnb-klargøring og andre boligservices. Det giver fleksibilitet når du har ekstra travl sæson i sommer eller under events som Distortion og Copenhagen Pride, hvor mange københavnske værter oplever tættere gæsteskifte. Du får desuden adgang til introtilbud på fast rengøring, hvis du også vil have hjælp til din egen bolig.",
        ],
      },
      {
        title: "Partner til stabil drift i København",
        paragraphs: [
          "Københavns udlejningsmarked er præget af internationale gæster med høje forventninger til renlighed og præsentation. Det gælder uanset om boligen ligger i en ejerlejlighed på Christianshavn eller en nyere lejlighed ved Metroen på Amager. Vi tilpasser klargøringen til boligens type — fra kompakte studier til større familielejligheder med flere soveværelser — og sikrer, at hvert rum fremstår indbydende.",
          "Mange værter bruger nøgleboks eller smart lock, og vi koordinerer adgangen, så rengøringen sker uden at du skal være til stede. Du modtager besked, når opgaven er udført, og kan fokusere på næste booking. Har du brug for ekstra opmærksomhed på køkkenet efter en familie med børn eller vinduespudsning før en fotosession, tilføjer du det som tilvalg."
        ],
      },
    ],
    cityLinksDescription:
      "Vi hjælper Airbnb-værter i hele Storkøbenhavn med klargøring mellem gæster — herunder København, Frederiksberg og Gentofte.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i København",
    faqs: [
      {
        question: "Dækker I hele København?",
        answer: `Ja. Vi dækker Københavns Kommune og resten af ${SERVED_AREA_LABEL} (postnr. 1000–2990), herunder Østerbro, Nørrebro, Amager, Valby og øvrige bydele.`,
      },
      {
        question: "Kan I nå at rengøre mellem samme dags check-out og check-in?",
        answer:
          "I de fleste tilfælde ja — især når vi kender boligens størrelse og gæsteskifte på forhånd. Beskriv tidsvinduet i forespørgslen, så vi kan planlægge en realistisk turn-around.",
      },
      {
        question: "Hvad koster Airbnb rengøring i København?",
        answer:
          "Prisen afhænger af boligens størrelse, antal værelser og tilvalg som linned eller ovn. Send en forespørgsel — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Skifter I sengetøj og håndklæder?",
        answer:
          "Ja. Skift af sengetøj og håndklæder er en del af vores standard Airbnb-klargøring, så boligen er klar til næste gæst.",
      },
    ],
  },
  frederiksberg: {
    heroTitle: "Pålidelig Airbnb-klargøring på Frederiksberg.",
    heroDescription:
      "Professionel rengøring mellem gæster i din udlejningsbolig på Frederiksberg. Vi kender de klassiske lejligheder, parkeringszoner og de korte vinduer mellem bookinger — og sender et uforpligtende tilbud inden for 24 timer.",
    metaDescription:
      "Airbnb rengøring på Frederiksberg. Professionel klargøring mellem gæster i herskabslejligheder og byhuse — sengetøj, bad og køkken klar til næste check-in.",
    editorialSections: [
      {
        title: "Fem stjerner kræver detaljer",
        paragraphs: [
          "Frederiksberg er et af de mest attraktive områder for korttidsudlejning tæt på København — med herskabslejligheder, høje standarder og gæster der forventer detaljer i orden. Som vært skal du levere en oplevelse der matcher de høje priser i området, og det kræver en rengøringspartner der møder op til tiden og forstår, hvad der skal til for fem stjerner.",
          "Renzen dækker hele Frederiksberg Kommune som en del af Storkøbenhavn (postnr. 1000–2990). Vores Zenmestre er vant til de typiske boligtyper i området: klassiske lejligheder med stuk, trægulve og kompakte køkkener, hvor hver kvadratmeter skal fremstå indbydende. Vi tager højde for parkeringsforhold i Frederiksbergs betalingszoner, når vi planlægger ankomst — så klargøringen starter, når gæsterne har checket ud."
        ],
      },
      {
        title: "Airbnb-pakke til herskabslejligheder",
        paragraphs: [
          "Vores Airbnb-tjekliste dækker stuer, køkken, soveværelser og badeværelse — inklusive afstøvning, gulvvask, rengøring af køkkenoverflader, badeværelse i bund og skift af sengetøj og håndklæder. Boligen resets visuelt, så den føles frisk til næste check-in. Tilvalg som linnedservice, ovn, køleskab og vinduer kan tilføjes, når du booker eller sender forespørgsel.",
          "Frederiksberg-værter har ofte gæster der booker korte ophold i forbindelse med konferencer, restauranter og kultur i København. Det betyder hyppigere gæsteskifte i højsæson — og her giver Renzen Klub ekstra fleksibilitet. Zen-kreditter kan bruges på Airbnb-klargøring, så du kan prioritere ekstra grundighed eller tilvalg i travle perioder uden at skulle finde en ny leverandør."
        ],
      },
      {
        title: "Professionel standard i et krævende marked",
        paragraphs: [
          "Uanset om du udlejer en lejlighed ved Solbjerg Plads eller tæt på Frederiksberg Centret, får du samme struktur: forespørgsel, tilbud, aftalt tidspunkt og klargøring efter tjekliste. Du kan kombinere Airbnb-klargøring med andre boligopgaver via Renzen og bruge Zen-kreditter på tværs af services.",
          "Frederiksberg er en kommune, hvor gæster ofte sammenligner din bolig med hoteller i København — og forventer samme niveau. Professionel klargøring er investeringen, der holder dine anmeldelser høje og din kalender fuld."
        ],
      },
    ],
    cityLinksDescription:
      "Vi hjælper Airbnb-værter i Storkøbenhavn med klargøring mellem gæster — herunder Frederiksberg, København og Gentofte.",
    hostBenefitsTitle: "Det får du som Airbnb-vært på Frederiksberg",
    faqs: [
      {
        question: "Dækker I hele Frederiksberg?",
        answer:
          "Ja. Vi dækker Frederiksberg Kommune som en del af Storkøbenhavn (postnr. 1000–2990).",
      },
      {
        question: "Tager I højde for parkeringszoner på Frederiksberg?",
        answer:
          "Ja. Vi planlægger ankomst med omtanke for parkeringsforhold i området, så klargøringen kan starte til aftalt tid efter check-out.",
      },
      {
        question: "Kan jeg bestille fast klargøring mellem hver booking?",
        answer:
          "Ja. Du kan bestille enkeltbesøg eller løbende klargøring via forespørgsel — beskriv blot hvor ofte du har gæster.",
      },
      {
        question: "Hvad er inkluderet i en standard klargøring?",
        answer:
          "Stuer, køkken, soveværelser og badeværelse rengøres efter vores Airbnb-tjekliste, inklusive skift af sengetøj og håndklæder samt tømning af skrald.",
      },
    ],
  },
  gentofte: {
    heroTitle: "Airbnb-klargøring til værter i Gentofte.",
    heroDescription:
      "Professionel rengøring mellem gæster i villaer og lejligheder i Gentofte, Hellerup og Charlottenlund. Vi sikrer stabil kvalitet og hurtig turn-around — og vender tilbage med et uforpligtende tilbud inden for 24 timer.",
    metaDescription:
      "Airbnb rengøring i Gentofte og omegn. Professionel klargøring mellem gæster i villaer og lejligheder — Hellerup, Charlottenlund og hele Gentofte Kommune.",
    editorialSections: [
      {
        title: "Plads, ro og høj standard",
        paragraphs: [
          "Gentofte og omegn — Hellerup, Charlottenlund, Klampenborg og Dyssegård — tiltrækker gæster der forventer plads, ro og en høj standard. Mange Airbnb-enheder her er større end centrale bylejligheder, med flere værelser, terrasser og mere kompleks klargøring mellem gæster. Som vært skal du levere en oplevelse der matcher områdets prisniveau — og det kræver en rengøringspartner med kapacitet og erfaring.",
          "Renzen dækker Gentofte Kommune som en del af Storkøbenhavn (postnr. 1000–2990). Vores Zenmestre er vant til både villaer og større lejligheder i området, hvor der ofte er flere badeværelser, større køkkener og mere gulvareal end i indre by. Vi planlægger opgaven ud fra boligens kvadratmeter og antal værelser, så turn-around-tiden passer til dit vindue mellem check-out og check-in."
        ],
      },
      {
        title: "Kapacitet til større boliger",
        paragraphs: [
          "Vores standardpakke inkluderer støvsugning og gulvvask, afstøvning af overflader, rengøring af køkken og bad, skift af sengetøj og håndklæder samt et visuelt reset af boligen. Har du brug for ekstra ydelser — linnedservice, ovn, køleskab, hovedrengøring i dybden eller vinduer — vælger du tilvalg i forespørgslen. Det giver dig én kontaktperson i stedet for at koordinere flere leverandører.",
          "Gentofte-værter oplever ofte internationale gæster og længere ophold i sommerperioden, hvilket kan betyde færre men mere omfattende gæsteskifte — eller travle weekender med korte bookinger. Med Renzen Klub kan du bruge Zen-kreditter på Airbnb-klargøring og andre boligservices, så du har økonomisk fleksibilitet når sæsonen topper."
        ],
      },
      {
        title: "Premium-oplevelse for dine gæster",
        paragraphs: [
          "I Hellerup og Charlottenlund ser vi ofte værter med høj standard og gæster, der forventer premium-oplevelse. Det handler om rene lagner, velplejede badeværelser og et køkken uden spor fra tidligere gæster. Renzen leverer den konsekvens, der skal til for at opretholde gode anmeldelser og høj belægning.",
          "Gentofte-værter med flere soveværelser og gæstebolig i kælderen eller på 1. sal har brug for en partner, der kan navigere i boligens planløsning effektivt. Vi gennemgår alle relevante rum og sikrer, at intet springes over — heller ikke trapper, entré og gæstetoilet."
        ],
      },
    ],
    cityLinksDescription:
      "Vi hjælper Airbnb-værter i Storkøbenhavn med klargøring mellem gæster — herunder Gentofte, København og Frederiksberg.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Gentofte",
    faqs: [
      {
        question: "Dækker I Hellerup og Charlottenlund?",
        answer:
          "Ja. Vi dækker hele Gentofte Kommune, herunder Hellerup, Charlottenlund, Klampenborg og Dyssegård, som en del af Storkøbenhavn (postnr. 1000–2990).",
      },
      {
        question: "Kan I klargøre større villaer med flere badeværelser?",
        answer:
          "Ja. Beskriv boligens størrelse og antal værelser i forespørgslen — vi tilpasser tidsforbrug og tilbud til opgavens omfang.",
      },
      {
        question: "Hvordan booker jeg klargøring mellem gæster?",
        answer:
          "Send en forespørgsel med boligens oplysninger og ønsket frekvens. Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Tilbyder I linnedservice som tilvalg?",
        answer:
          "Ja. Linned og vask kan tilvælges sammen med ovn, køleskab, hovedrengøring og vinduer, når du sender forespørgsel.",
      },
    ],
  },
  aarhus: {
    heroTitle: "Airbnb-klargøring i Aarhus mellem gæster.",
    heroDescription:
      "Professionel rengøring af lejligheder og byhuse i Aarhus — fra Latinerkvarteret til Risskov og Trøjborg. Hurtig turn-around og faste tjeklister til værter i Østjylland.",
    metaDescription:
      "Professionel Airbnb rengøring i Aarhus. Klargøring mellem gæster i lejligheder og byhuse — Latinerkvarteret, havnen, universitetskvarterer og hele Aarhus Kommune.",
    editorialSections: [
      {
        title: "Aarhus' dynamiske udlejningsmarked",
        paragraphs: [
          "Aarhus er blevet en af Danmarks mest dynamiske Airbnb-byer. Som universitetsby, kulturby og erhvervscentrum i Østjylland tiltrækker den gæster året rundt — studerende og forældre i eksamensperioder, forretningsrejsende til konferencer og turister, der vil opleve ARoS, Den Gamle By og havnefronten. For værter betyder det varierende belægning og et behov for rengøring, der holder tempoet.",
          "Boligtyperne i Aarhus spænder fra kompakte lejligheder i Latinerkvarteret til familievenlige boliger i Risskov, Trøjborg og Viby. Mange værter udlejer en lejlighed tæt på AU-campus eller en bolig med udsigt mod bugten. Fællesnævneren er, at gæster forventer skandinavisk renlighed og en bolig, der føles klar til brug — ikke bare visuelt pæn, men grundigt gennemført i køkken, bad og soveværelser."
        ],
      },
      {
        title: "Detaljer der giver fem stjerner",
        paragraphs: [
          "Aarhus' gæster kommer ofte fra andre dele af Danmark eller udlandet og vurderer boligen ud fra fotos og anmeldelser. Femstjernede oplevelser handler om detaljer: friske håndklæder, støvfrie hylder og et badeværelse uden hår i afløbet. Vores Zenmestre er vant til Airbnb-standarder og arbejder diskret, så naboer i ejendomme med fællesarealer ikke oplever unødig forstyrrelse.",
          "For værter med boliger i det centrale Aarhus kan parkering og adgang via baggård være praktiske udfordringer — det tager vi højde for i planlægningen. Har du brug for ekstra ydelser som vinduespudsning efter en travl sommer eller hovedrengøring mellem sæsoner, kan vi tilføje det som tilvalg. Zen-kreditter fra Renzen Klub giver fleksibilitet til løbende drift."
        ],
      },
      {
        title: "Gentagelse og forudsigelighed",
        paragraphs: [
          "Universitetsbyen betyder også perioder med forældre og studerende på besøg — og boliger der skal holde standard, selv når der har været flere gæster i huset. Vi sørger for, at køkken, bad og soveværelser fremstår som nye, uanset om det er en weekendbooking eller et ugeophold.",
          "Risskov og Trøjborg har mange familieboliger med have og terrasse — områder, gæster vælger for ro og nærhed til naturen. Vi inkluderer entré og eventuelle udearealer i aftalen, når du beskriver boligen i forespørgslen."
        ],
      },
    ],
    cityLinksDescription:
      "Ud over Aarhus dækker vi værter i Odense, Aalborg, København og andre byer med samme fokus på kvalitet og forudsigelighed.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Aarhus",
    faqs: [
      {
        question: "Dækker I hele Aarhus?",
        answer:
          "Ja. Vi hjælper værter i Aarhus Kommune og omegn — herunder Latinerkvarteret, Risskov, Trøjborg, Viby og øvrige bydele.",
      },
      {
        question: "Kan I klargøre mellem samme dags check-out og check-in?",
        answer:
          "I de fleste tilfælde ja — beskriv tidsvinduet og boligens størrelse i forespørgslen, så vi planlægger en realistisk turn-around.",
      },
      {
        question: "Hvad koster Airbnb rengøring i Aarhus?",
        answer:
          "Prisen afhænger af boligens størrelse, antal værelser og tilvalg. Send en forespørgsel — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Skifter I sengetøj og håndklæder?",
        answer:
          "Ja. Skift af sengetøj og håndklæder er en del af vores standard Airbnb-klargøring.",
      },
    ],
  },
  odense: {
    heroTitle: "Airbnb-klargøring i Odense mellem gæster.",
    heroDescription:
      "Professionel rengøring af lejligheder, byhuse og villaer i Odense — centrum, Hjallese og Tarup. Pålidelig turn-around til værter på Fyn.",
    metaDescription:
      "Airbnb rengøring i Odense. Klargøring mellem gæster i lejligheder og villaer — centrum, nær H.C. Andersens hus og hele Odense Kommune.",
    editorialSections: [
      {
        title: "Udlejning på Fyn med sin egen rytme",
        paragraphs: [
          "Odense har et udlejningsmarked, der adskiller sig fra hovedstaden. Her finder man en blanding af centrale lejligheder tæt på gågaden og H.C. Andersens Hus, familieboliger i bydele som Hjallese og Tarup — og værter, der udlejer til både turister, forretningsrejsende og familier på vej videre på Fyn. Korttidsudlejning i Odense kræver en rengøringspartner, der forstår byens rytme og boligtyper.",
          "Turister besøger Odense for kultur, zoo og som udgangspunkt for ø-hop. Gæster forventer en ren og velorganiseret bolig efter en lang køretur eller flyrejse. En professionel Airbnb-klargøring sikrer, at sengetøjet er frisk, køkkenet er klar til morgenkaffe, og badeværelset fremstår indbydende — de små ting, der afspejler sig i anmeldelserne og giver genbookinger."
        ],
      },
      {
        title: "Klargøring tilpasset Odenses boligtyper",
        paragraphs: [
          "Boliger i Odense kan have praktiske detaljer som carport, haveindgang eller parkering foran huset. Vores Zenmestre tager højde for adgangsforhold og arbejder effektivt, så boligen er klar til næste gæst uden forsinkelser. For værter med flere enheder eller en kombination af egen bolig og udlejning giver en fast partner ro i driften.",
          "Odense-værter har ofte brug for tilvalg som linnedservice, ovnrengøring eller ekstra klargøring efter familieophold med børn. Det kan tilføjes efter behov. Som medlem af Renzen Klub kan du bruge Zen-kreditter på Airbnb-rengøring og andre boligopgaver — praktisk, når du vil holde omkostningerne under kontrol uden at sænke standarden."
        ],
      },
      {
        title: "Ro i driften året rundt",
        paragraphs: [
          "Fynske gæster og turister værdsætter en bolig, der føles personlig og velplejet. Det betyder rene tekstiler, tom skraldespand, afkalkede armaturer og et køleskab, der er tømt og aftørret. Vores tjekliste dækker disse detaljer, så du slipper for at gennemgå boligen selv mellem hver booking.",
          "Odense er en cykelby, og mange gæster ankommer med bagage og sved på panden — de vil møde en kølig, ren bolig med plads til at lande. Det er den oplevelse, vi hjælper dig med at levere, gang på gang."
        ],
      },
    ],
    cityLinksDescription:
      "Vi hjælper også værter i Aarhus, Aalborg, Roskilde og andre byer med den samme grundige standard mellem gæster.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Odense",
    faqs: [
      {
        question: "Dækker I hele Odense?",
        answer:
          "Ja. Vi hjælper værter i Odense Kommune — herunder centrum, Hjallese, Tarup og øvrige bydele.",
      },
      {
        question: "Kan I rengøre større byhuse og villaer?",
        answer:
          "Ja. Beskriv boligens størrelse og antal værelser i forespørgslen — vi tilpasser tilbud og tidsforbrug til opgaven.",
      },
      {
        question: "Hvordan booker jeg klargøring mellem gæster?",
        answer:
          "Send en forespørgsel med boligens oplysninger og ønsket frekvens. Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Tilbyder I linnedservice som tilvalg?",
        answer:
          "Ja. Linned og vask kan tilvælges sammen med ovn, køleskab, hovedrengøring og vinduer.",
      },
    ],
  },
  aalborg: {
    heroTitle: "Airbnb-klargøring i Aalborg mellem gæster.",
    heroDescription:
      "Professionel rengøring af lejligheder og villaer i Aalborg — centrum, havnefronten og Nørresundby. Pålidelig turn-around til værter i Nordjylland.",
    metaDescription:
      "Professionel Airbnb rengøring i Aalborg. Klargøring mellem gæster ved havnen, i centrum og Nørresundby — sengetøj, bad og køkken klar til næste ankomst.",
    editorialSections: [
      {
        title: "Nordjyllands voksende Airbnb-marked",
        paragraphs: [
          "Aalborg har udviklet sig til en attraktiv destination for både danske og udenlandske gæster. Havnefronten, Musikkens Hus, Jomfru Ane Gade og universitetsmiljøet trækker besøgende året rundt — og skaber efterspørgsel efter korttidsudlejning i centrum, ved vandet og i Nørresundby på den anden side af Limfjorden. For værter betyder det et marked med potentiale, men også krav om konsekvent kvalitet.",
          "Boligtyperne spænder fra centrale lejligheder med udsigt mod fjorden til villaer og rækkehuse i byens omegn. Gæster i Aalborg kommer ofte til konferencer, studieophold eller weekendture — og forventer en bolig, der matcher billederne online. Professionel Airbnb-klargøring sikrer, at hver gæst møder det samme høje niveau: rene overflader, frisk sengetøj og et køkken, der er klar til brug."
        ],
      },
      {
        title: "Tilpasset din kalender og sæson",
        paragraphs: [
          "Adgang og parkering i Aalborg centrum kan kræve lidt ekstra planlægning, særligt i ældre ejendomme og omkring havnen. Vores Zenmestre er vant til at arbejde effektivt under lokale forhold og leverer den samme tjekliste hver gang — fra støvsugning og afpudsning til sengetøjsskift og tømning af skrald.",
          "Mange Aalborg-værter kombinerer udlejning med andre boligopgaver og værdsætter muligheden for tilvalg som vinduespudsning, ovnrengøring og linnedservice. Zen-kreditter fra Renzen Klub kan bruges på Airbnb-rengøring, så du får mere fleksibilitet i driften — særligt hvis du har perioder med mange gæster."
        ],
      },
      {
        title: "Klar når byen får besøg",
        paragraphs: [
          "Nørresundby på den anden side af Limfjorden har sit eget udlejningsmarked med gæster, der vil bo tæt på centrum men med mere ro. Vi dækker begge sider af fjorden og planlægger ruten, så klargøringen sker til aftalt tid.",
          "Aalborg er også universitets- og erhvervsby — med mange korte ophold til møder og konferencer. Gæsterne har sjældent tid til at vente på rengøring; de forventer, at boligen er klar ved ankomst. Det kræver en partner, der overholder tidsplanen."
        ],
      },
    ],
    cityLinksDescription:
      "Vi dækker også Aarhus, Odense, København og andre byer med samme høje standard for klargøring mellem gæster.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Aalborg",
    faqs: [
      {
        question: "Dækker I Nørresundby og havnefronten?",
        answer:
          "Ja. Vi hjælper værter i hele Aalborg Kommune, herunder centrum, Vestre Havnepromenade, Vejgaard og Nørresundby.",
      },
      {
        question: "Kan I klargøre mellem samme dags check-out og check-in?",
        answer:
          "Ofte ja — beskriv tidsvinduet i forespørgslen, så vi kan planlægge en realistisk turn-around.",
      },
      {
        question: "Hvad koster Airbnb rengøring i Aalborg?",
        answer:
          "Prisen afhænger af boligens størrelse og tilvalg. Send en forespørgsel — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Hvad er inkluderet i en standard klargøring?",
        answer:
          "Stuer, køkken, soveværelser og badeværelse rengøres efter vores Airbnb-tjekliste, inklusive skift af sengetøj og håndklæder.",
      },
    ],
  },
  roskilde: {
    heroTitle: "Airbnb-klargøring i Roskilde mellem gæster.",
    heroDescription:
      "Professionel rengøring af lejligheder og villaer i Roskilde — centrum, Trekroner og omegn. Turn-around der holder, når byen får ekstra besøg.",
    metaDescription:
      "Airbnb rengøring i Roskilde. Professionel klargøring mellem gæster i centrum og omegn — festivalperioder, pendlerophold og hele året.",
    editorialSections: [
      {
        title: "Mere end en soveby til København",
        paragraphs: [
          "Roskilde er mere end en soveby til København. Domkirken, Vikingeskibsmuseet og ikke mindst Roskilde Festival gør byen til en destination i sig selv — med gæster, der booker både for kultur, musik og som base mellem Sjælland og hovedstaden. For Airbnb-værter betyder det perioder med ekstra høj belægning, hvor turn-around-tiden bliver afgørende.",
          "Boligtyperne i Roskilde spænder fra lejligheder i centrum og ved stationen til villaer og rækkehuse i Trekroner, Svogerslev og omegn. Mange værter udlejer til festivalgæster, familier på weekendture og pendlere, der arbejder i København. Gæster forventer en ren bolig efter en lang dag — og anmeldelser afspejler hurtigt, om standarden holder."
        ],
      },
      {
        title: "Turn-around når det gælder",
        paragraphs: [
          "Roskilde-værter har ofte en blanding af korte og længere ophold. En professionel partner giver forudsigelighed året rundt — ikke kun i højsæsonen. Du kan bestille enkeltbesøg ved gæsteskifte eller lægge en fast ramme, der matcher din portefølje. Vi tager højde for praktiske forhold som parkering ved centrum og adgang i ældre ejendomme.",
          "Har du brug for ekstra ydelser efter en travl periode — for eksempel hovedrengøring, ovnrengøring eller vinduespudsning — kan vi tilføje det som tilvalg. Zen-kreditter fra Renzen Klub kan bruges på Airbnb-rengøring og andre boligopgaver, så du holder driften samlet og overskuelig."
        ],
      },
      {
        title: "Partner du kan stole på",
        paragraphs: [
          "Roskilde som universitetsby og festivalby giver en unik blanding af gæstetyper. Uanset om det er studerende, turister eller festivalgæster, skal boligen fremstå professionelt — og det er præcis det, vores Airbnb-tjekliste sikrer.",
          "Lejligheder ved Roskilde Station og i centrum har ofte gæster med tidlig ankomst fra København. Vi planlægger klargøring, så boligen er klar — også når check-out sker sent om aftenen efter en koncert eller middag i byen."
        ],
      },
    ],
    cityLinksDescription:
      "Vi hjælper også værter i København, Frederiksberg, Helsingør og andre byer med hurtig og pålidelig klargøring mellem gæster.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Roskilde",
    faqs: [
      {
        question: "Dækker I hele Roskilde?",
        answer:
          "Ja. Vi hjælper værter i Roskilde Kommune — herunder centrum, Trekroner, Svogerslev og omegn.",
      },
      {
        question: "Kan I klargøre under Roskilde Festival?",
        answer:
          "Ja — beskriv dine travle perioder i forespørgslen, så vi planlægger kapacitet og turn-around derefter.",
      },
      {
        question: "Hvordan booker jeg klargøring mellem gæster?",
        answer:
          "Send en forespørgsel med boligens oplysninger og frekvens. Vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
      {
        question: "Skifter I sengetøj og håndklæder?",
        answer:
          "Ja. Skift af sengetøj og håndklæder er en del af vores standard Airbnb-klargøring.",
      },
    ],
  },
  helsingoer: {
    heroTitle: "Airbnb-klargøring i Helsingør mellem gæster.",
    heroDescription:
      "Professionel rengøring af lejligheder, villaer og ferieboliger i Helsingør og omegn. Turn-around til værter ved Øresund og Kronborg.",
    metaDescription:
      "Airbnb rengøring i Helsingør. Klargøring mellem gæster ved Kronborg, havnen og kysten — lejligheder, villaer og ferieboliger i Nordsjælland.",
    editorialSections: [
      {
        title: "Kyst, kultur og korttidsudlejning",
        paragraphs: [
          "Helsingør er en af Nordsjællands mest besøgte byer. Kronborg, havnen, kysten og nærheden til Sverige trækker turister året rundt — og skaber et levende marked for korttidsudlejning. Værter her udlejer alt fra centrale lejligheder med udsigt mod Øresund til villaer i Snekkersten, Espergærde og de omkringliggende kystområder.",
          "Gæster i Helsingør kommer ofte for en kulturel weekend, sommerferie ved vandet eller som stop på en Øresundstur. De forventer en bolig, der føles frisk og indbydende — særligt efter en lang dag med sightseeing. Professionel Airbnb-klargøring sikrer, at sengetøjet er skiftet, badeværelset er plejet, og køkkenet er klar til morgenmad med udsigt."
        ],
      },
      {
        title: "Boliger med særlige behov",
        paragraphs: [
          "Kystboliger har ofte særlige behov: sand i entréen efter strandbesøg, saltluft ved vinduer og terrasser, der skal være præsentable. Vores Zenmestre kender de lokale forhold og kan tilføje vinduespudsning, ekstra gulvrengøring eller hovedrengøring som tilvalg, når boligen har brug for et løft mellem sæsoner.",
          "Adgang i ældre kystbygninger og villaer med have kan kræve koordinering om parkering og nøgler. Vi planlægger besøget, så det passer til din bookingkalender og dine gæsters ankomsttider. For værter med boliger i Helsingør centrum eller i de omkringliggende kystbyer giver en fast partner ro i maven."
        ],
      },
      {
        title: "Klar til ankomst hele året",
        paragraphs: [
          "Sommerhus- og ferielejligheder i Snekkersten og Espergærde har ofte sæson med intens brug. Mellem sæsonerne kan en hovedrengøring eller vinduespudsning være nødvendig — det tilføjer du som tilvalg, så boligen er klar til næste bølge af gæster.",
          "Helsingør har også mange gæster, der tager færgen til Helsingborg for en dagstur. De vender tilbage trætte og forventer en bolig i orden — med rent sengetøj, hvis de skal tidligt op næste morgen til Kronborg eller toget videre."
        ],
      },
    ],
    cityLinksDescription:
      "Vi dækker også København, Gentofte, Roskilde og andre byer med samme fokus på kvalitet mellem check-out og check-in.",
    hostBenefitsTitle: "Det får du som Airbnb-vært i Helsingør",
    faqs: [
      {
        question: "Dækker I Snekkersten og Espergærde?",
        answer:
          "Ja. Vi hjælper værter i Helsingør Kommune, herunder centrum, Snekkersten, Espergærde og kystområderne omkring byen.",
      },
      {
        question: "Kan I klargøre sommerhuse og større villaer?",
        answer:
          "Ja. Beskriv boligens størrelse og antal værelser i forespørgslen — vi tilpasser tilbud og tidsforbrug til opgaven.",
      },
      {
        question: "Tilbyder I vinduespudsning som tilvalg?",
        answer:
          "Ja. Vinduer, ovn, køleskab, linned og hovedrengøring kan tilvælges efter behov.",
      },
      {
        question: "Hvad koster Airbnb rengøring i Helsingør?",
        answer:
          "Prisen afhænger af boligens størrelse og tilvalg. Send en forespørgsel — vi vender tilbage med et uforpligtende tilbud inden for 24 timer.",
      },
    ],
  },
};

export function getAirbnbCityMetaDescription(citySlug: string): string | undefined {
  return AIRBNB_CITY_COPY[citySlug]?.metaDescription;
}

export function getAirbnbCityCopy(citySlug: string): AirbnbCityCopy | undefined {
  return AIRBNB_CITY_COPY[citySlug];
}

export function buildAirbnbCityPageConfig(
  city: City,
): EditorialServiceLandingConfig {
  const base = serviceInquiryPages["airbnb-rengoring"];
  const copy = AIRBNB_CITY_COPY[city.slug];

  if (!copy) {
    throw new Error(`Missing Airbnb city copy for slug: ${city.slug}`);
  }

  const otherCities = AIRBNB_EDITORIAL_CITIES.filter(
    (entry) => entry.slug !== city.slug,
  );

  return {
    ...base,
    slug: "airbnb-rengoring",
    heroTitle: copy.heroTitle,
    heroDescription: copy.heroDescription,
    heroImageAlt: `Professionel Airbnb rengøring i ${city.name}`,
    includedRooms: AIRBNB_INCLUDED_ROOMS,
    whyRenzen: {
      eyebrow: `Airbnb rengøring i ${city.name}`,
      sections: buildAirbnbWhySections(copy.editorialSections, city.name),
    },
    hostBenefits: base.hostBenefits
      ? {
          ...base.hostBenefits,
          title: copy.hostBenefitsTitle,
        }
      : undefined,
    cityLinks: {
      eyebrow: "Andre byer",
      title: "Airbnb rengøring i andre byer",
      description: copy.cityLinksDescription,
      cities: otherCities,
    },
    faqs: copy.faqs,
    ctaTitle: `Klar til driftssikker Airbnb-klargøring i ${city.name}?`,
  };
}

export function isAirbnbServedCitySlug(slug: string): boolean {
  return getAirbnbServedCitySlugs().includes(slug);
}
