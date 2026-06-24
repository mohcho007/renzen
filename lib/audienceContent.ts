import {
  getLocationPhrase,
  type City,
  type Region,
} from "@/lib/cities";
import { LOCAL_MARKET_DATA, type LocalMarketData } from "@/lib/localStats";
import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";

export interface AudienceContentBlock {
  eyebrow: string;
  title: string;
  description: string;
  benefits: [string, string, string];
  ctaLabel: string;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  imagePosition?: "center" | "top";
}

export interface DynamicAudienceContent {
  blocks: [AudienceContentBlock, AudienceContentBlock];
}

interface ServiceAudienceProfile {
  blocks: [AudienceContentBlock, AudienceContentBlock];
  regionalAngles: [string, string];
  briefingTips: [string, string];
}

const SERVICE_AUDIENCE_PROFILES: Record<string, ServiceAudienceProfile> = {
  "privat-rengoering": {
    blocks: [
      {
        eyebrow: "Til den travle hverdag",
        title: "Fast rengøringshjælp, der passer til hjemmet",
        description:
          "Få en stabil aftale om den løbende rengøring, så køkken, bad, gulve og opholdsrum bliver passet i en rytme, der fungerer for familien.",
        benefits: [
          "Vælg ugentlig, hver anden uge eller en anden fast rytme",
          "Aftal tydeligt hvilke rum og opgaver der skal prioriteres",
          "Sammenlign tilbud fra CVR-registrerede rengøringsfirmaer",
        ],
        ctaLabel: "Få tilbud på privat rengøring",
        image: "/renzen-rengøring-privat.png",
        imageAlt: "Fast privat rengøringshjælp i hjemmet",
        imageFit: "contain",
      },
      {
        eyebrow: "Til boliger med særlige behov",
        title: "En rengøringsplan tilpasset jeres bolig",
        description:
          "Boligens størrelse, materialer, husdyr og familiens hverdag har betydning for opgaven. Beskriv behovet én gang og sammenlign firmaernes forslag til omfang og frekvens.",
        benefits: [
          "Mulighed for fokus på allergi, husdyr eller sarte overflader",
          "Aftal nøglehåndtering og adgang direkte med firmaet",
          "Få pris og opgavebeskrivelse på skrift før opstart",
        ],
        ctaLabel: "Beskriv dit rengøringsbehov",
        image: "/familyoutside2.jpg",
        imageAlt: "Familie der ønsker hjælp til rengøring i hjemmet",
        imageFit: "cover",
      },
    ],
    regionalAngles: [
      "Faste aftaler kan tilpasses både lejligheder, parcelhuse og større boliger på tværs af området.",
      "Beskriv boligtype og ønsket frekvens, så firmaerne kan planlægge kørsel og en stabil fast aftale.",
    ],
    briefingTips: [
      "boligens areal, antal badeværelser og ønsket frekvens",
      "adgang, husdyr og de rum der skal prioriteres",
    ],
  },
  erhvervsrengoering: {
    blocks: [
      {
        eyebrow: "Til virksomheder med blandede lokaler",
        title: "Erhvervsrengøring samlet i én driftsaftale",
        description:
          "Saml rengøring af kundeområder, kontorer, personalerum, lager og fællesfaciliteter i en plan, der følger virksomhedens åbningstider og daglige drift.",
        benefits: [
          "Arbejdsplan tilpasset forskellige lokaletyper",
          "Mulighed for én aftale på tværs af flere adresser",
          "Fast procedure for kvalitet, adgang og ændringer",
        ],
        ctaLabel: "Få tilbud på erhvervsrengøring",
        image: "/erhvervsrengoering.jpeg",
        imageAlt: "Professionel rengøring af virksomhedslokaler",
        imageFit: "cover",
      },
      {
        eyebrow: "Til drifts- og indkøbsansvarlige",
        title: "Sammenlign aftaler på mere end timeprisen",
        description:
          "En erhvervsaftale bør beskrive bemanding, frekvens, kontrol, materialer og håndtering af ekstraopgaver. Det gør tilbuddene lettere at sammenligne og følge op på.",
        benefits: [
          "Tydeligt omfang for hver afdeling og lokaletype",
          "Aftalte kontaktveje ved fejl og ændrede behov",
          "Prisstruktur med frekvens og eventuelle tillæg",
        ],
        ctaLabel: "Indhent en samlet erhvervspris",
        image: "/renzen-rengøring-erhverv.png",
        imageAlt: "Driftsansvarlig der planlægger erhvervsrengøring",
        imageFit: "cover",
        imagePosition: "top",
      },
    ],
    regionalAngles: [
      "Virksomheder med flere adresser kan beskrive lokationerne samlet og få tilbud på en koordineret løsning.",
      "Afstande, åbningstider og adgangsforhold bør fremgå tydeligt, når leverandøren skal dække et større område.",
    ],
    briefingTips: [
      "lokaletyper, samlet areal og ønsket rengøringsfrekvens",
      "antal adresser, åbningstider og krav til kvalitetskontrol",
    ],
  },
  flytterengoering: {
    blocks: [
      {
        eyebrow: "Til lejere og boligejere",
        title: "Gør boligen klar til aflevering",
        description:
          "Flytterengøring samler de tidskrævende slutopgaver, når boligen er tømt. Oplys størrelse, stand og afleveringsfrist, så tilbuddene dækker det samme arbejde.",
        benefits: [
          "Fokus på køkken, bad, skabe, paneler og gulve",
          "Mulighed for vinduespudsning og andre tilvalg",
          "Skriftlig afgrænsning af opgaven før afleveringen",
        ],
        ctaLabel: "Få tilbud på flytterengøring",
        image: "/flytterengøring.jpg",
        imageAlt: "Grundig flytterengøring af en tom bolig",
        imageFit: "cover",
      },
      {
        eyebrow: "Til udlejere og administratorer",
        title: "Klargøring mellem fraflytning og ny indflytning",
        description:
          "Ved genudlejning er tidsplanen ofte stram. En præcis opgavebeskrivelse gør det lettere at koordinere rengøring med syn, reparationer og næste overtagelse.",
        benefits: [
          "Planlæg arbejdet efter håndværkere og før indflytning",
          "Beskriv krav til dokumentation og slutkontrol",
          "Mulighed for faste aftaler ved flere lejemål",
        ],
        ctaLabel: "Planlæg klargøring af lejemål",
        image: "/udlejer.jpg",
        imageAlt: "Udlejer der planlægger klargøring af et lejemål",
        imageFit: "cover",
      },
    ],
    regionalAngles: [
      "Oplys flyttedato og adresse tidligt, så firmaerne kan vurdere transport og kapacitet i afleveringsugen.",
      "Ved flere lejemål kan opgaverne samles med en ensartet tjekliste og klare frister.",
    ],
    briefingTips: [
      "boligens areal, stand og datoen for aflevering",
      "eventuelle tilvalg, adgang og krav til slutkontrol",
    ],
  },
  hovedrengoering: {
    blocks: [
      {
        eyebrow: "Til hjemmet der trænger til en grundig omgang",
        title: "Hovedrengøring helt ind i kroge og kanter",
        description:
          "En hovedrengøring går længere end den løbende rengøring og kan omfatte paneler, døre, skabe, kalk, fedt og andre områder, der kræver ekstra tid.",
        benefits: [
          "Prioritér de områder der har størst behov",
          "Aftal om ovn, skabe og vinduer skal med",
          "Få et tilbud baseret på boligens faktiske stand",
        ],
        ctaLabel: "Få tilbud på hovedrengøring",
        image: "/hovedrengoering.jpg",
        imageAlt: "Grundig hovedrengøring i en privat bolig",
        imageFit: "cover",
      },
      {
        eyebrow: "Før gæster, salg eller sæsonskifte",
        title: "Få boligen tilbage til et godt udgangspunkt",
        description:
          "Hovedrengøring er relevant før en særlig begivenhed, efter en travl periode eller når hjemmet skal gøres præsentabelt. En prioriteret liste holder opgaven inden for budgettet.",
        benefits: [
          "Velegnet som enkeltstående grundig rengøring",
          "Mulighed for at kombinere med faste aftaler bagefter",
          "Tydelig prioritering hvis tiden eller budgettet er fast",
        ],
        ctaLabel: "Beskriv din hovedrengøring",
        image: "/renzen-rengøring-privat-2.png",
        imageAlt: "Bolig gjort klar med en grundig rengøring",
        imageFit: "contain",
      },
    ],
    regionalAngles: [
      "Firmaerne kan vurdere transport, tidsforbrug og bemanding ud fra boligens placering og omfang.",
      "En detaljeret prioritering gør det lettere at sammenligne tilbud fra forskellige dele af området.",
    ],
    briefingTips: [
      "boligens størrelse, nuværende stand og de vigtigste rum",
      "ønsket dato, tilvalg og om opgaven har en fast tidsramme",
    ],
  },
  "airbnb-rengoering": {
    blocks: [
      {
        eyebrow: "Til private Airbnb-værter",
        title: "Stabil klargøring mellem hver gæst",
        description:
          "Få hjælp til rengøring og reset af ferieboligen i det korte tidsrum mellem check-out og næste check-in. Aftal en fast tjekliste, så oplevelsen bliver ens hver gang.",
        benefits: [
          "Rengøring af køkken, bad, gulve og kontaktflader",
          "Mulighed for linned, håndklæder og forbrugsvarer",
          "Tidsplan tilpasset check-out og næste check-in",
        ],
        ctaLabel: "Få tilbud på Airbnb rengøring",
        image: "/airbnb-rengoring.jpg",
        imageAlt: "Rengøring og klargøring af en Airbnb bolig",
        imageFit: "cover",
      },
      {
        eyebrow: "Til professionelle værter",
        title: "En driftsklar løsning til flere gæsteskift",
        description:
          "Ved hyppige bookinger eller flere boliger skal adgang, linned, kontrol og akutte ændringer fungere som en fast proces. Beskriv volumen og tidsvinduer for at få sammenlignelige tilbud.",
        benefits: [
          "Ensartede tjeklister på tværs af boliger",
          "Aftalt procedure for skader og glemte ejendele",
          "Mulighed for fotodokumentation efter klargøring",
        ],
        ctaLabel: "Planlæg faste gæsteskift",
        image: "/udlejer.jpg",
        imageAlt: "Professionel vært der administrerer ferieboliger",
        imageFit: "cover",
      },
    ],
    regionalAngles: [
      "Afstand mellem boliger og skiftende bookingdage bør indgå i planlægningen af en fast løsning.",
      "Ved ferieboliger uden for de største byer er tydelig nøgleadgang og realistiske tidsvinduer særligt vigtige.",
    ],
    briefingTips: [
      "boligens størrelse, antal senge og tidsrummet mellem gæster",
      "bookingfrekvens, nøgleadgang og behov for linned eller kontrol",
    ],
  },
  kontorrengoering: {
    blocks: [
      {
        eyebrow: "Til mindre kontorer",
        title: "En enkel rengøringsplan for arbejdspladsen",
        description:
          "Hold skriveborde, møderum, køkken, toiletter og fællesarealer præsentable med en fast plan, der passer til medarbejderantal og brugen af lokalerne.",
        benefits: [
          "Frekvens tilpasset kontorets størrelse og aktivitet",
          "Rengøring før eller efter normal arbejdstid",
          "Tydelig aftale om skriveborde og personligt udstyr",
        ],
        ctaLabel: "Få tilbud på kontorrengøring",
        image: "/erhvervsrengoering.jpeg",
        imageAlt: "Fast rengøring af et moderne kontor",
        imageFit: "cover",
      },
      {
        eyebrow: "Til større arbejdspladser",
        title: "Kontorrengøring med zoner og kvalitetskontrol",
        description:
          "Større kontorer har forskellige behov i arbejdszoner, mødeområder, kantine og sanitære rum. En opdelt arbejdsplan gør ansvar og kvalitet lettere at følge.",
        benefits: [
          "Zoner og frekvens efter trafik og anvendelse",
          "Plan for affald, forbrugsvarer og fællesfaciliteter",
          "Fast kontaktperson og dokumenteret opfølgning",
        ],
        ctaLabel: "Indhent en kontoraftale",
        image: "/renzen-rengøring-erhverv.png",
        imageAlt: "Professionel rengøring på en større arbejdsplads",
        imageFit: "cover",
        imagePosition: "top",
      },
    ],
    regionalAngles: [
      "Kontorets placering, adgang og ønskede arbejdstidspunkter hjælper firmaerne med at planlægge en stabil rute.",
      "Virksomheder med flere kontorer kan beskrive adresserne samlet, men bør angive behovet for hver lokation.",
    ],
    briefingTips: [
      "kontorets areal, antal arbejdspladser og ønsket frekvens",
      "møderum, køkken, toiletter, adgang og arbejdstidspunkter",
    ],
  },
  trappevask: {
    blocks: [
      {
        eyebrow: "Til bolig- og ejerforeninger",
        title: "Fast trappevask med en tydelig arbejdsplan",
        description:
          "Opgange kræver regelmæssig rengøring af trin, reposer, gelændere og indgangspartier. Beskriv antal opgange og etager for at få sammenlignelige tilbud.",
        benefits: [
          "Frekvens efter trafik, årstid og ejendommens størrelse",
          "Mulighed for måtter, elevator og fællesarealer",
          "Fast kontrol af de aftalte opgange",
        ],
        ctaLabel: "Få tilbud på trappevask",
        image: "/trappe-rengøring.webp",
        imageAlt: "Professionel trappevask i en boligejendom",
        imageFit: "cover",
      },
      {
        eyebrow: "Til administratorer og udlejere",
        title: "Saml flere ejendomme i en driftssikker aftale",
        description:
          "Ved flere adresser er ruteplan, adgang og ensartet kvalitet afgørende. Oplys hver ejendoms opgange, etager og ønskede frekvens i samme forespørgsel.",
        benefits: [
          "Samlet oversigt over adresser og arbejdsomfang",
          "Procedure for nøgler, porte og adgang til kælder",
          "Mulighed for ekstra indsats i vinterhalvåret",
        ],
        ctaLabel: "Planlæg trappevask for ejendomme",
        image: "/erhvervsrengøring.png",
        imageAlt: "Ejendomsadministrator der planlægger trappevask",
        imageFit: "contain",
      },
    ],
    regionalAngles: [
      "Ejendomme på flere adresser kan samles i en rute, når antal opgange og adgangsforhold er beskrevet tydeligt.",
      "Afstande mellem ejendommene og sæsonbestemte behov bør indgå i den samlede arbejdsplan.",
    ],
    briefingTips: [
      "antal opgange, etager, elevatorer og ønsket frekvens",
      "adresser, adgangsforhold og eventuelle fællesarealer",
    ],
  },
  vinduespudsning: {
    blocks: [
      {
        eyebrow: "Til huse og lejligheder",
        title: "Vinduespudsning tilpasset boligens ruder",
        description:
          "Antal vinduer, sprosser, etager og adgang afgør både metode og pris. En præcis beskrivelse gør det lettere at sammenligne tilbud på indvendig og udvendig pudsning.",
        benefits: [
          "Vælg enkeltbesøg eller en fast intervalaftale",
          "Angiv ovenlys, sprosser og svært tilgængelige ruder",
          "Aftal om rammer og karme skal være inkluderet",
        ],
        ctaLabel: "Få tilbud på vinduespudsning",
        image: "/vinduespudser-1.jpg",
        imageAlt: "Professionel vinduespudsning ved en privat bolig",
        imageFit: "cover",
      },
      {
        eyebrow: "Til virksomheder og ejendomme",
        title: "Rene facadevinduer med mindst mulig forstyrrelse",
        description:
          "Butikker, kontorer og ejendomme kan have behov for faste intervaller, særligt udstyr og arbejde uden for åbningstid. Beskriv facade, højde og adgang i forespørgslen.",
        benefits: [
          "Plan for facadeglas, indgangspartier og fællesruder",
          "Mulighed for rentvandsanlæg og teleskopudstyr",
          "Faste intervaller efter trafik og eksponering",
        ],
        ctaLabel: "Indhent en fast vinduesaftale",
        image: "/renzen-rengøring-erhverv-1.png",
        imageAlt: "Vinduespudsning af virksomhed og ejendom",
        imageFit: "contain",
      },
    ],
    regionalAngles: [
      "Boligens eller ejendommens placering og adgang hjælper firmaerne med at vælge metode og planlægge ruten.",
      "Ved flere adresser bør antal ruder, højde og ønsket interval oplyses for hver lokation.",
    ],
    briefingTips: [
      "antal vinduer, etager, sprosser og ønsket interval",
      "adgang, facadehøjde og behov for indvendig pudsning",
    ],
  },
  "fliserens-og-algebehandling": {
    blocks: [
      {
        eyebrow: "Til terrasser og indkørsler",
        title: "Få fliserne renset uden at gætte på omfanget",
        description:
          "Areal, belægningstype, fuger og graden af alger har betydning for metode og pris. Oplys kvadratmeter og send gerne billeder med forespørgslen.",
        benefits: [
          "Rensning tilpasset flisernes type og tilstand",
          "Mulighed for algebehandling, fugesand og imprægnering",
          "Tydelig pris pr. areal eller samlet opgave",
        ],
        ctaLabel: "Få tilbud på fliserens",
        image: "/fliserens-1.webp",
        imageAlt: "Professionel fliserens af terrasse og indkørsel",
        imageFit: "cover",
      },
      {
        eyebrow: "Til foreninger og erhvervsarealer",
        title: "Planlæg rens af større udendørs belægninger",
        description:
          "Gårdrum, gangarealer og fælles terrasser kræver ofte afspærring, adgang til vand og en plan for efterbehandling. Beskriv brugen af arealet og ønsket tidspunkt.",
        benefits: [
          "Opdeling af større arealer i praktiske etaper",
          "Plan for vand, afløb og adgang under arbejdet",
          "Mulighed for løbende vedligeholdelsesbehandling",
        ],
        ctaLabel: "Indhent pris på større arealer",
        image: "/fliserens-d1.webp",
        imageAlt: "Rensning af større udendørs flisearealer",
        imageFit: "cover",
      },
    ],
    regionalAngles: [
      "Transport, adgang til vand og arealets placering bør beskrives, så firmaerne kan beregne opgaven korrekt.",
      "Større arealer kan planlægges i etaper, hvis de fortsat skal kunne bruges under arbejdet.",
    ],
    briefingTips: [
      "antal kvadratmeter, belægningstype og graden af alger",
      "adgang til vand, afløb og ønsket efterbehandling",
    ],
  },
  byggerengoering: {
    blocks: [
      {
        eyebrow: "Til private renoveringer",
        title: "Fjern byggestøv før rummene tages i brug",
        description:
          "Efter ombygning eller renovering kan fint støv sidde på gulve, vægge, skabe og installationer. Beskriv byggeriets fase og hvilke rum der skal afleveres rene.",
        benefits: [
          "Fjernelse af fint støv fra flader og inventar",
          "Rengøring efter håndværkere før indflytning",
          "Mulighed for flere etaper under projektet",
        ],
        ctaLabel: "Få tilbud på byggerengøring",
        image: "/byggerengøring.jpg",
        imageAlt: "Byggerengøring efter privat renovering",
        imageFit: "cover",
      },
      {
        eyebrow: "Til entreprenører og projektledere",
        title: "Byggerengøring koblet til afleveringsplanen",
        description:
          "På større projekter bør grovrengøring, løbende rengøring og slutrengøring planlægges som separate leverancer med klare milepæle og ansvarsområder.",
        benefits: [
          "Bemanding efter projektets tidsplan og etaper",
          "Afgrænsning mellem byggeaffald og rengøringsopgaver",
          "Slutkontrol før aflevering til bygherre eller lejer",
        ],
        ctaLabel: "Planlæg rengøring af byggeprojekt",
        image: "/renzen-rengøring-erhverv-2.png",
        imageAlt: "Projektleder der planlægger byggerengøring",
        imageFit: "contain",
      },
    ],
    regionalAngles: [
      "Projektadresse, adgang og tidsplan er afgørende, når bemanding og udstyr skal koordineres over afstand.",
      "Ved flere byggepladser bør faser og afleveringsdatoer angives særskilt for hver adresse.",
    ],
    briefingTips: [
      "projektets areal, byggefase og datoen for aflevering",
      "adgang, etaper og grænsen mellem affald og rengøring",
    ],
  },
};

export const PRIORITY_CITY_SLUGS = Object.entries(LOCAL_MARKET_DATA)
  .sort(([, first], [, second]) => second.population - first.population)
  .slice(0, 20)
  .map(([slug]) => slug);

const PRIORITY_CITY_SET = new Set(PRIORITY_CITY_SLUGS);

function stableVariant(value: string, count: number): number {
  let hash = 0;
  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash % count;
}

function getFallbackProfile(service: Service): ServiceAudienceProfile {
  const isBusiness = service.tab === "company" || service.tab === "community";
  const primaryAudience =
    service.tab === "company"
      ? "Til virksomheder"
      : service.tab === "community"
        ? "Til foreninger og ejendomme"
        : service.tab === "outdoor"
          ? "Til boligejere og ejendomme"
          : "Til private boliger";
  const image = isBusiness
    ? "/renzen-rengøring-erhverv.png"
    : "/renzen-rengøring-privat.png";
  const serviceName = getServiceNameInSentence(service);
  return {
    blocks: [
      {
        eyebrow: `${primaryAudience}: ${service.name}`,
        title: service.headline,
        description: service.description,
        benefits: [
          service.checklist[0],
          service.checklist[1],
          service.checklist[2],
        ],
        ctaLabel: `Få tilbud på ${serviceName}`,
        image,
        imageAlt: `Professionel hjælp til ${serviceName}`,
        imageFit: "contain",
      },
      {
        eyebrow: `Når ${serviceName} kræver ekstra planlægning`,
        title: `Beskriv behovet for ${serviceName} præcist`,
        description: `En tydelig beskrivelse af ${serviceName} gør det lettere for firmaerne at beregne samme opgave og afgive tilbud, der kan sammenlignes på et fair grundlag.`,
        benefits: [
          "Beskriv areal, antal eller omfang",
          "Angiv adgang og den ønskede tidsplan",
          "Få pris og inkluderede opgaver på skrift",
        ],
        ctaLabel: "Beskriv opgaven",
        image,
        imageAlt: `Planlægning af ${serviceName}`,
        imageFit: "contain",
      },
    ],
    regionalAngles: [
      `Placeringen og omfanget af ${serviceName} hjælper firmaerne med at beregne transport, tid og nødvendigt udstyr.`,
      `Ved ${serviceName} på flere adresser bør behov og tidsplan beskrives særskilt for hver lokation.`,
    ],
    briefingTips: [
      "opgavens omfang, adgang og ønsket tidspunkt",
      "særlige krav, eventuelle tilvalg og den ønskede tidsplan",
    ],
  };
}

function getPriorityCityParagraph({
  service,
  stats,
  tip,
  blockIndex,
}: {
  service: Service;
  stats: LocalMarketData;
  tip: string;
  blockIndex: number;
}): string {
  const serviceName = getServiceNameInSentence(service);
  if (blockIndex === 0) {
    return `${stats.municipalityName} har ${stats.population.toLocaleString("da-DK")} indbyggere og ${stats.households.toLocaleString("da-DK")} husstande. Når du indhenter tilbud på ${serviceName}, bør du især oplyse ${tip}.`;
  }

  return `Opgaven ligger i ${stats.municipalityName}. Ved ${serviceName} bør du oplyse ${tip}, så relevante firmaer i området kan vurdere opgaven og afgive sammenlignelige tilbud.`;
}

function getLongTailCityParagraph({
  service,
  city,
  tip,
  blockIndex,
  locationPhrase,
}: {
  service: Service;
  city: City;
  tip: string;
  blockIndex: number;
  locationPhrase: string;
}): string {
  const serviceName = getServiceNameInSentence(service);
  const variants = [
    () =>
      `Opgaven udføres med udgangspunkt i ${city.defaultPostal} ${city.name}. Oplys ${tip}, så firmaerne kan beregne et relevant tilbud på ${serviceName}.`,
    () =>
      `Ved ${serviceName} ${locationPhrase} bør tilbuddet tage højde for ${tip}. En præcis adresse hjælper firmaet med at vurdere transport og adgang.`,
    () =>
      `Opgaven med ${serviceName} placeres ${locationPhrase}. Beskriv ${tip}, så pris, tidsplan og inkluderede opgaver kan sammenlignes på samme grundlag.`,
    () =>
      `For ${serviceName} ${locationPhrase} er adresse og postnummer ${city.defaultPostal} et naturligt udgangspunkt. Tilføj oplysninger om ${tip}, før forespørgslen sendes til relevante firmaer.`,
  ];

  const variant = stableVariant(
    `${service.slug}:${city.slug}:${blockIndex}`,
    variants.length,
  );
  return variants[variant]();
}

function getLocalizedTitle({
  block,
  locationName,
  locationPhrase,
  variant,
}: {
  block: AudienceContentBlock;
  locationName: string;
  locationPhrase: string;
  variant: number;
}): string {
  const titles = [
    `${block.title} ${locationPhrase}`,
    `${locationName}: ${block.title}`,
    `${block.title} - lokalt ${locationPhrase}`,
    `Lokalt ${locationPhrase}: ${block.title}`,
  ];

  return titles[variant];
}

function getLocalizedDescription({
  block,
  localParagraph,
  variant,
}: {
  block: AudienceContentBlock;
  localParagraph: string;
  variant: number;
}): string {
  const descriptions = [
    `${block.description} ${localParagraph}`,
    `${localParagraph} ${block.description} Sørg desuden for, at tilbuddet tydeligt angiver arbejdsomfang, pris og eventuelle tillæg.`,
    `${localParagraph} Det giver et bedre grundlag for at sammenligne både arbejdsomfang, tidsplan og pris.`,
    `${block.description} ${localParagraph} En tydelig afgrænsning gør den efterfølgende aftale lettere at følge.`,
  ];

  return descriptions[variant];
}

function localizeBlock({
  block,
  service,
  profile,
  blockIndex,
  city,
  region,
  localStats,
}: {
  block: AudienceContentBlock;
  service: Service;
  profile: ServiceAudienceProfile;
  blockIndex: number;
  city?: City;
  region?: Region;
  localStats?: LocalMarketData;
}): AudienceContentBlock {
  const locationName = city?.name ?? region?.name;
  if (!locationName) return block;
  const locationPhrase = getLocationPhrase(city ?? region!);

  const variant = stableVariant(
    `${service.slug}:${city?.slug ?? region?.slug}:${blockIndex}:content`,
    4,
  );
  const tip = profile.briefingTips[blockIndex];
  let localParagraph: string;
  let localBenefit: string;

  if (city && PRIORITY_CITY_SET.has(city.slug) && localStats) {
    localParagraph = getPriorityCityParagraph({
      service,
      stats: localStats,
      tip,
      blockIndex,
    });
    localBenefit = `Lokalt udgangspunkt ${locationPhrase}`;
  } else if (city) {
    localParagraph = getLongTailCityParagraph({
      service,
      city,
      tip,
      blockIndex,
      locationPhrase,
    });
    localBenefit = `Opgaven matches med udgangspunkt i ${city.defaultPostal}`;
  } else {
    localParagraph = `For opgaver ${locationPhrase} er dette særligt relevant: ${profile.regionalAngles[blockIndex]}`;
    localBenefit = `Tilbud fra firmaer med dækning ${locationPhrase}`;
  }

  return {
    ...block,
    eyebrow: `${block.eyebrow} ${locationPhrase}`,
    title: getLocalizedTitle({
      block,
      locationName,
      locationPhrase,
      variant,
    }),
    description: getLocalizedDescription({
      block,
      localParagraph,
      variant,
    }),
    benefits: [block.benefits[0], block.benefits[1], localBenefit],
    imageAlt: `${block.imageAlt} ${locationPhrase}`,
  };
}

export function getAudienceContent({
  service,
  city,
  region,
  localStats,
}: {
  service: Service;
  city?: City;
  region?: Region;
  localStats?: LocalMarketData;
}): DynamicAudienceContent {
  const profile =
    SERVICE_AUDIENCE_PROFILES[service.slug] ?? getFallbackProfile(service);

  return {
    blocks: profile.blocks.map((block, blockIndex) =>
      localizeBlock({
        block,
        service,
        profile,
        blockIndex,
        city,
        region,
        localStats,
      }),
    ) as [AudienceContentBlock, AudienceContentBlock],
  };
}
