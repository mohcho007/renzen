import type { City } from "@/data/cities";
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

const introFromLabel = `${INTRO_CLEANING_FROM_KR} kr.`;
const zenCreditMonthlyLabel = `${ZEN_CREDIT_MONTHLY_KR} kr./md.`;

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
      imageAlt: `${imageMeta.imageAlt.replace("Airbnb-klargøring", "Privat rengøring")} i ${cityName}`,
    };
  });
}

function cityFaqs(city: City) {
  return [
    {
      question: `Dækker I hele ${city.name}?`,
      answer: `Ja. Vi tilbyder privat rengøring i ${city.municipality} og omegn, herunder ${city.nearbyAreas.slice(0, 4).join(", ")}.`,
    },
    {
      question: `Får jeg altid den samme Zenmester i ${city.name}?`,
      answer:
        "Ja. Ved faste aftaler sender vi den samme Zenmester, så vedkommende lærer dit hjem og dine ønsker at kende.",
    },
    {
      question: `Kan jeg få servicefradrag på rengøring i ${city.name}?`,
      answer:
        "Ja. Privat rengøring er fradragsberettiget i Danmark. Du kan trække 26% af arbejdslønnen fra i skat.",
    },
    {
      question: `Hvad koster privat rengøring i ${city.name}?`,
      answer: `Prisen afhænger af boligens størrelse og frekvens. Brug prisberegneren eller send en forespørgsel — de fleste hjem i ${city.name} starter fra vores listepris med mulighed for medlemsrabat.`,
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

const PRIVAT_RENGORING_CITY_COPY: Record<string, PrivatRengoringCityCopy> = {
  "koebenhavn": {
    "heroTitle": "Privat rengøring i København med fast Zenmester.",
    "heroDescription": "Få en forsikret Zenmester til din københavnske lejlighed eller byhus. Vi kender byens tempo, parkeringszoner og trapper, så du får mere ro i hverdagen. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København. Fast Zenmester til lejligheder og byhuse i hele Københavns Kommune — forsikrede medarbejdere, servicefradrag og medlemsfordele.",
    "editorialSections": [
      {
        "title": "Byliv der kræver en fast rytme",
        "paragraphs": [
          "København er en by, hvor kalenderen sjældent giver plads til grundig rengøring mellem møder, børnepasning og sociale aftaler. Mange københavnere bor i kompakte lejligheder på Østerbro, Nørrebro, Vesterbro eller Amager — med trapper, fællesarealer og parkeringszoner, der gør hverdagen ekstra praktisk. En fast Zenmester giver dig en forudsigelig rytme: samme person, samme standard og et hjem der altid er klar, når du kommer hjem.",
          "Renzen dækker hele Københavns Kommune og matcher dig med en erfaren Zenmester, der kender byboliger. Vi tilpasser rengøringen til din boligtype — fra studielejlighed til familiebolig med flere værelser — og du kan vælge frekvens efter behov. Som medlem af Renzen Klub får du introtilbud fra 299 kr. på første rengøring og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Tilpasset lejligheder og byhuse",
        "paragraphs": [
          "Københavnske boliger har ofte detaljer, der kræver erfaring: høje paneler, smalle badeværelser, køkkener med begrænset skabsplads og vinduer mod gården. Din Zenmester lærer disse forhold at kende over tid, så du slipper for at gentage instruktioner ved hvert besøg. Det giver et jævnt resultat og tryghed — særligt hvis du arbejder hjemme eller ofte har gæster.",
          "Du styrer aftalen online og kan tilføje ekstra opgaver med Zen-kreditter fra medlemskabet — for eksempel ovnrengøring, vinduespudsning eller hovedrengøring før ferie. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen. Det er privat rengøring, der passer til en københavnsk hverdag uden unødig administration."
        ]
      },
      {
        "title": "Mere tid til det, der betyder noget",
        "paragraphs": [
          "Når rengøringen er på plads, bliver weekenderne til familietid, træning eller bare ro i stuen — i stedet for støvsuger og gulvvask. Mange københavnere oplever, at en fast aftale hver anden uge er nok til at holde hjemmet løbende rent, mens ugentlig rengøring passer til familier med små børn eller hjemmekontor.",
          "Vi hjælper også i nærliggende bydele som Frederiksberg, Valby og Hellerup. Send en forespørgsel med postnummer og boligstørrelse — eller brug prisberegneren direkte — og kom i gang med en Zenmester, der kender København."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Frederiksberg, Valby og København S."
  },
  "frederiksberg": {
    "heroTitle": "Privat rengøring på Frederiksberg med fast Zenmester.",
    "heroDescription": "Få en forsikret Zenmester til herskabslejlighed eller byhus på Frederiksberg. Vi gør det let at holde et roligt og præsentabelt hjem i en travl hverdag. Se din pris med det samme med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring på Frederiksberg. Fast Zenmester til klassiske lejligheder og byhuse — servicefradrag, forsikrede medarbejdere og introtilbud med Renzen Klub.",
    "editorialSections": [
      {
        "title": "Klassiske lejligheder med høje standarder",
        "paragraphs": [
          "Frederiksberg er kendt for sine elegante herskabslejligheder, høje lofter og detaljer som stuk, paneler og originale gulve. Det sætter krav til rengøringen: overflader skal passes på, og badeværelser i ældre ejendomme kræver omhu. Hos Renzen matcher vi dig med en Zenmester, der er vant til frederiksbergske boliger og forstår, at standarden skal være høj — uden at du skal følge med i hvert hjørne.",
          "Betalingsparkering i Frederiksberg Kommune er en praktisk detalje, vi tager højde for i planlægningen. Din faste Zenmester lærer adgang, nøgler og eventuelle særlige ønsker at kende, så rengøringen bliver en naturlig del af hverdagen. Du vælger frekvens og får gennemsigtige priser med mulighed for medlemsrabat."
        ]
      },
      {
        "title": "Rengøring der passer til herskabslejligheder",
        "paragraphs": [
          "Mange frederiksbergere bor i lejligheder med flere værelser, altan og køkkenalrum — boliger, der bruges intensivt i hverdagen. En fast aftale sikrer, at køkken, bad og stuer holdes løbende rene, mens du fokuserer på arbejde og familie. Zenmesteren medbringer rengøringsmidler og klude; du skal blot have støvsuger og moppe klar.",
          "Som Renzen Klub-medlem får du op til 20% rabat på fast rengøring, Zen-kreditter til andre boligopgaver og intropris fra 299 kr. på første besøg. Servicefradrag på 26% gør det økonomisk attraktivt at få professionel hjælp — og du beholder kontrollen med online booking og fast kontaktperson."
        ]
      },
      {
        "title": "Medlemsfordele i en krævende hverdag",
        "paragraphs": [
          "Frederiksberg ligger tæt på København, men har sit eget tempo med caféer, haver og grønne områder som Frederiksberg Have. Når rengøringen er outsourcet til en pålidelig Zenmester, får du mere tid til det — og et hjem der altid føles velkomment, når du har gæster.",
          "Vi dækker hele Frederiksberg Kommune og hjælper også i Valby, Vanløse og København. Brug prisberegneren eller send en forespørgsel — så matcher vi dig med en Zenmester, der kender området."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København, Valby og Vanløse."
  },
  "koebenhavn-oe": {
    "heroTitle": "Privat rengøring i København Ø.",
    "heroDescription": "I København Ø får du en forsikret Zenmester tilpasset din bolig og din rytme. Fra Østerbro, Trianglen og Nordhavnskanten gør vi hverdagen lettere med fast kvalitet, mindre stress og mere overskud i hjemmet. Se prisen med det samme, og vælg en fast aftale med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København Ø. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i København Ø",
        "paragraphs": [
          "I København Ø møder vi lejligheder og byhuse i kvarterer som Østerbro, Trianglen og Nordhavnskanten. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Parkeringszoner og ældre ejendomme med trapper. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i København Ø",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for København Ø. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i København Ø",
        "paragraphs": [
          "Boliger i København Ø varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i København Ø — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender København Ø."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København Ø og omkringliggende byer."
  },
  "nordhavn": {
    "heroTitle": "Privat rengøring i Nordhavn.",
    "heroDescription": "I Nordhavn får du en forsikret Zenmester tilpasset din bolig og din rytme. Fra Orientkaj, Århusgadekvarteret og Tuborg Havn gør vi hverdagen lettere med fast kvalitet, mindre stress og mere overskud i hjemmet. Se prisen med det samme, og vælg en fast aftale med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Nordhavn. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Orientkaj, Århusgadekvarteret og Tuborg Havn — boliger vi kender",
        "paragraphs": [
          "I Nordhavn møder vi nye lejligheder og byhuse i kvarterer som Orientkaj, Århusgadekvarteret og Tuborg Havn. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Elevator, parkeringskælder og moderne materialer. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Nordhavn",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Nordhavn. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Nordhavn",
        "paragraphs": [
          "Boliger i Nordhavn varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Nordhavn — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Nordhavn."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Nordhavn og omkringliggende byer."
  },
  "koebenhavn-n": {
    "heroTitle": "Privat rengøring i København N.",
    "heroDescription": "Privat rengøring i København N med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Nørrebro, Nordvest og Griffenfeldsgade-kvarteret, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København N. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til København N",
        "paragraphs": [
          "I København N møder vi lejligheder i kvarterer som Nørrebro, Nordvest og Griffenfeldsgade-kvarteret. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Livlige gader og varierede baggårde. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for København N. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i København N",
        "paragraphs": [
          "Boliger i København N varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i København N — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender København N."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København N og omkringliggende byer."
  },
  "koebenhavn-s": {
    "heroTitle": "Privat rengøring i København S med fast Zenmester.",
    "heroDescription": "Privat rengøring i København S med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Amagerbro, Islands Brygge og Kastrupvej, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København S. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i København S",
        "paragraphs": [
          "I København S møder vi lejligheder og rækkehuse i kvarterer som Amagerbro, Islands Brygge og Kastrupvej. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Amager med både by og grønt. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i København S",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for København S. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i København S",
        "paragraphs": [
          "Boliger i København S varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i København S — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender København S."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København S og omkringliggende byer."
  },
  "koebenhavn-nv": {
    "heroTitle": "Privat rengøring i København NV.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i København NV. Vi dækker hele København NV, også omkring Brønshøj, Husum og Bellahøj, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København NV. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Brønshøj, Husum og Bellahøj — boliger vi kender",
        "paragraphs": [
          "I København NV møder vi lejligheder og rækkehuse i kvarterer som Brønshøj, Husum og Bellahøj. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Blandede ejendomme fra mursten til nybyg. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i København NV",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for København NV. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i København NV",
        "paragraphs": [
          "Boliger i København NV varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i København NV — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender København NV."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København NV og omkringliggende byer."
  },
  "koebenhavn-sv": {
    "heroTitle": "Privat rengøring i København SV.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i København SV. Vi dækker hele København SV, også omkring Sydhavnen, Valby og Ellebjerg, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i København SV. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til København SV",
        "paragraphs": [
          "I København SV møder vi lejligheder i kvarterer som Sydhavnen, Valby og Ellebjerg. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Kompakte lejligheder og fællesarealer. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for København SV. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i København SV",
        "paragraphs": [
          "Boliger i København SV varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i København SV — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender København SV."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder København SV og omkringliggende byer."
  },
  "valby": {
    "heroTitle": "Privat rengøring i Valby med fast Zenmester.",
    "heroDescription": "Privat rengøring i Valby med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Valby Langgade, Toftegårds Plads og Grønttorvet, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Valby. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Valby",
        "paragraphs": [
          "I Valby møder vi lejligheder og villaer i kvarterer som Valby Langgade, Toftegårds Plads og Grønttorvet. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Villaer, rækkehuse og lejligheder side om side. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Valby",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Valby. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Valby",
        "paragraphs": [
          "Boliger i Valby varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Valby — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Valby."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Valby og omkringliggende byer."
  },
  "vanloese": {
    "heroTitle": "Privat rengøring i Vanløse.",
    "heroDescription": "I Vanløse matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Vanløse Torv, Jernbanebyen og Bellahøj holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Vanløse. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Vanløse Torv, Jernbanebyen og Bellahøj — boliger vi kender",
        "paragraphs": [
          "I Vanløse møder vi lejligheder og villaer i kvarterer som Vanløse Torv, Jernbanebyen og Bellahøj. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Blandet byggeri med gode forbindelser. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Vanløse",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Vanløse. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Vanløse",
        "paragraphs": [
          "Boliger i Vanløse varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Vanløse — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Vanløse."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Vanløse og omkringliggende byer."
  },
  "broenshoej": {
    "heroTitle": "Privat rengøring i Brønshøj.",
    "heroDescription": "I Brønshøj matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Brønshøj Torv, Bellahøj og Utterslev Mose holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Brønshøj. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Brønshøj",
        "paragraphs": [
          "I Brønshøj møder vi murmestervillaer og lejligheder i kvarterer som Brønshøj Torv, Bellahøj og Utterslev Mose. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Murmestervillaer med trapper og haver. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Brønshøj. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Brønshøj",
        "paragraphs": [
          "Boliger i Brønshøj varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Brønshøj — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Brønshøj."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Brønshøj og omkringliggende byer."
  },
  "kastrup": {
    "heroTitle": "Privat rengøring i Kastrup med fast Zenmester.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Kastrup, så du får en løsning du kan regne med. Vi hjælper i hele Kastrup, fra Kastrupvej, Torvegade og Amager Strandvej, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Kastrup. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Kastrup",
        "paragraphs": [
          "I Kastrup møder vi villaer og lejligheder i kvarterer som Kastrupvej, Torvegade og Amager Strandvej. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Tæt på lufthavn og havn. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Kastrup",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Kastrup. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Kastrup",
        "paragraphs": [
          "Boliger i Kastrup varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Kastrup — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Kastrup."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Kastrup og omkringliggende byer."
  },
  "dragoer": {
    "heroTitle": "Privat rengøring i Dragør.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Dragør. Vi dækker hele Dragør, også omkring Dragør gamle by, Sydstranden og havnen, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Dragør. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Dragør gamle by, Sydstranden og havnen — boliger vi kender",
        "paragraphs": [
          "I Dragør møder vi historiske huse og villaer i kvarterer som Dragør gamle by, Sydstranden og havnen. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Charmerende gader og ældre huse. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Dragør",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Dragør. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Dragør",
        "paragraphs": [
          "Boliger i Dragør varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Dragør — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Dragør."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Dragør og omkringliggende byer."
  },
  "hvidovre": {
    "heroTitle": "Privat rengøring i Hvidovre med fast Zenmester.",
    "heroDescription": "I Hvidovre matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Hvidovre Stationsvej, Avedøre og Friheden holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Hvidovre. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Hvidovre",
        "paragraphs": [
          "I Hvidovre møder vi villaer og lejligheder i kvarterer som Hvidovre Stationsvej, Avedøre og Friheden. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Parcelhuse, villaer og etageboliger. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Hvidovre. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Hvidovre",
        "paragraphs": [
          "Boliger i Hvidovre varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Hvidovre — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Hvidovre."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Hvidovre og omkringliggende byer."
  },
  "roedovre": {
    "heroTitle": "Privat rengøring i Rødovre med fast Zenmester.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Rødovre. Vi dækker hele Rødovre, også omkring Rødovre Centrum, Damhussøen og Islev, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Rødovre. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Rødovre",
        "paragraphs": [
          "I Rødovre møder vi villaer og lejligheder i kvarterer som Rødovre Centrum, Damhussøen og Islev. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Familieboliger med haver. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Rødovre",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Rødovre. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Rødovre",
        "paragraphs": [
          "Boliger i Rødovre varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Rødovre — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Rødovre."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Rødovre og omkringliggende byer."
  },
  "glostrup": {
    "heroTitle": "Privat rengøring i Glostrup med fast Zenmester.",
    "heroDescription": "I Glostrup matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Glostrup Centrum, Hvissinge og Ejby holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Glostrup. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Glostrup Centrum, Hvissinge og Ejby — boliger vi kender",
        "paragraphs": [
          "I Glostrup møder vi parcelhuse og lejligheder i kvarterer som Glostrup Centrum, Hvissinge og Ejby. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Centrumlejligheder og parcelhuse. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Glostrup",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Glostrup. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Glostrup",
        "paragraphs": [
          "Boliger i Glostrup varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Glostrup — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Glostrup."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Glostrup og omkringliggende byer."
  },
  "broendby": {
    "heroTitle": "Privat rengøring i Brøndby med fast Zenmester.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Brøndby, så du får en løsning du kan regne med. Vi hjælper i hele Brøndby, fra Brøndbyvester, Brøndbyøster og Gammel Køge Landevej, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Brøndby. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Brøndby",
        "paragraphs": [
          "I Brøndby møder vi parcelhuse og lejligheder i kvarterer som Brøndbyvester, Brøndbyøster og Gammel Køge Landevej. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Parcelhuse tæt på motorvejen. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Brøndby. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Brøndby",
        "paragraphs": [
          "Boliger i Brøndby varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Brøndby — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Brøndby."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Brøndby og omkringliggende byer."
  },
  "broendby-strand": {
    "heroTitle": "Privat rengøring i Brøndby Strand.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Brøndby Strand. Vi dækker hele Brøndby Strand, også omkring Brøndby Strand Centrum og kysten, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Brøndby Strand. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Brøndby Strand",
        "paragraphs": [
          "I Brøndby Strand møder vi lejligheder og rækkehuse i kvarterer som Brøndby Strand Centrum og kysten. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Store etageboligkomplekser. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Brøndby Strand",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Brøndby Strand. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Brøndby Strand",
        "paragraphs": [
          "Boliger i Brøndby Strand varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Brøndby Strand — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Brøndby Strand."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Brøndby Strand og omkringliggende byer."
  },
  "herlev": {
    "heroTitle": "Privat rengøring i Herlev med fast Zenmester.",
    "heroDescription": "I Herlev matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Herlev Hovedgade, Hjortespring og Skovlundevej holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Herlev. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Herlev Hovedgade, Hjortespring og Skovlundevej — boliger vi kender",
        "paragraphs": [
          "I Herlev møder vi villaer, rækkehuse og lejligheder i kvarterer som Herlev Hovedgade, Hjortespring og Skovlundevej. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Tæt på hospital og erhverv. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Herlev",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Herlev. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Herlev",
        "paragraphs": [
          "Boliger i Herlev varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Herlev — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Herlev."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Herlev og omkringliggende byer."
  },
  "soeborg": {
    "heroTitle": "Privat rengøring i Søborg.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Søborg, så du får en løsning du kan regne med. Vi hjælper i hele Søborg, fra Søborg Hovedgade, Bagsværd og Hillerødgade, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Søborg. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Søborg",
        "paragraphs": [
          "I Søborg møder vi murmestervillaer og lejligheder i kvarterer som Søborg Hovedgade, Bagsværd og Hillerødgade. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Murmestervillaer og centrumlejligheder. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Søborg. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Søborg",
        "paragraphs": [
          "Boliger i Søborg varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Søborg — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Søborg."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Søborg og omkringliggende byer."
  },
  "ballerup": {
    "heroTitle": "Privat rengøring i Ballerup.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Ballerup. Vi dækker hele Ballerup, også omkring Ballerup Centrum, Måløv og Grantofte, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Ballerup. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Ballerup",
        "paragraphs": [
          "I Ballerup møder vi rækkehuse og parcelhuse i kvarterer som Ballerup Centrum, Måløv og Grantofte. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Rækkehuse og parcelhuse med haver. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Ballerup",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Ballerup. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Ballerup",
        "paragraphs": [
          "Boliger i Ballerup varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Ballerup — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Ballerup."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Ballerup og omkringliggende byer."
  },
  "skovlunde": {
    "heroTitle": "Privat rengøring i Skovlunde.",
    "heroDescription": "Privat rengøring i Skovlunde med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Skovlunde Byvej, Ballerup og Herlev, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Skovlunde. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Skovlunde Byvej, Ballerup og Herlev — boliger vi kender",
        "paragraphs": [
          "I Skovlunde møder vi parcelhuse og rækkehuse i kvarterer som Skovlunde Byvej, Ballerup og Herlev. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Rolige villakvarterer. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Skovlunde",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Skovlunde. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Skovlunde",
        "paragraphs": [
          "Boliger i Skovlunde varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Skovlunde — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Skovlunde."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Skovlunde og omkringliggende byer."
  },
  "albertslund": {
    "heroTitle": "Privat rengøring i Albertslund.",
    "heroDescription": "I Albertslund får du en forsikret Zenmester tilpasset din bolig og din rytme. Fra Albertslund Centrum, Herstedvester og Vestervang gør vi hverdagen lettere med fast kvalitet, mindre stress og mere overskud i hjemmet. Se prisen med det samme, og vælg en fast aftale med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Albertslund. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Albertslund",
        "paragraphs": [
          "I Albertslund møder vi rækkehuse og parcelhuse i kvarterer som Albertslund Centrum, Herstedvester og Vestervang. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Planlagte kvarterer. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Albertslund. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Albertslund",
        "paragraphs": [
          "Boliger i Albertslund varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Albertslund — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Albertslund."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Albertslund og omkringliggende byer."
  },
  "taastrup": {
    "heroTitle": "Privat rengøring i Taastrup.",
    "heroDescription": "I Taastrup får du en forsikret Zenmester tilpasset din bolig og din rytme. Fra Taastrup Centrum, Høje Taastrup og Korshøj gør vi hverdagen lettere med fast kvalitet, mindre stress og mere overskud i hjemmet. Se prisen med det samme, og vælg en fast aftale med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Taastrup. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Taastrup",
        "paragraphs": [
          "I Taastrup møder vi rækkehuse, lejligheder og villaer i kvarterer som Taastrup Centrum, Høje Taastrup og Korshøj. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Station og gode forbindelser. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Taastrup",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Taastrup. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Taastrup",
        "paragraphs": [
          "Boliger i Taastrup varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Taastrup — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Taastrup."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Taastrup og omkringliggende byer."
  },
  "vallensbaek": {
    "heroTitle": "Privat rengøring i Vallensbæk.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Vallensbæk. Vi dækker hele Vallensbæk, også omkring Vallensbæk Stationsplads, Kirkevang og kysten, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Vallensbæk. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Vallensbæk Stationsplads, Kirkevang og kysten — boliger vi kender",
        "paragraphs": [
          "I Vallensbæk møder vi rækkehuse og villaer i kvarterer som Vallensbæk Stationsplads, Kirkevang og kysten. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Villaer tæt på natur. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Vallensbæk",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Vallensbæk. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Vallensbæk",
        "paragraphs": [
          "Boliger i Vallensbæk varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Vallensbæk — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Vallensbæk."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Vallensbæk og omkringliggende byer."
  },
  "ishoej": {
    "heroTitle": "Privat rengøring i Ishøj.",
    "heroDescription": "Privat rengøring i Ishøj med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Ishøj Centrum, Vejleåparken og Strandvejen, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Ishøj. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Ishøj",
        "paragraphs": [
          "I Ishøj møder vi lejligheder og parcelhuse i kvarterer som Ishøj Centrum, Vejleåparken og Strandvejen. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Etageboliger og parcelhuse. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Ishøj. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Ishøj",
        "paragraphs": [
          "Boliger i Ishøj varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Ishøj — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Ishøj."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Ishøj og omkringliggende byer."
  },
  "greve": {
    "heroTitle": "Privat rengøring i Greve.",
    "heroDescription": "Privat rengøring i Greve med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Greve Centrum, Tune og Kildebrønde, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Greve. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Greve",
        "paragraphs": [
          "I Greve møder vi parcelhuse og rækkehuse i kvarterer som Greve Centrum, Tune og Kildebrønde. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Familievenlige parcelhuse. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Greve",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Greve. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Greve",
        "paragraphs": [
          "Boliger i Greve varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Greve — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Greve."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Greve og omkringliggende byer."
  },
  "solroed-strand": {
    "heroTitle": "Privat rengøring i Solrød Strand.",
    "heroDescription": "Privat rengøring i Solrød Strand med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Solrød Center, Solrød Strandvej og havnen, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Solrød Strand. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Solrød Center, Solrød Strandvej og havnen — boliger vi kender",
        "paragraphs": [
          "I Solrød Strand møder vi strandvillaer og parcelhuse i kvarterer som Solrød Center, Solrød Strandvej og havnen. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Strandnære villaer. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Solrød Strand",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Solrød Strand. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Solrød Strand",
        "paragraphs": [
          "Boliger i Solrød Strand varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Solrød Strand — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Solrød Strand."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Solrød Strand og omkringliggende byer."
  },
  "karlslunde": {
    "heroTitle": "Privat rengøring i Karlslunde.",
    "heroDescription": "Privat rengøring i Karlslunde med en forsikret Zenmester giver en tryg hverdag fra første besøg. Uanset om du bor nær Karlslunde Strandvej, Greve og Karlstrup, giver vi dig en nem rengøringsrutine med mere tid og ro. Book enkelt online, og se din pris hurtigt med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Karlslunde. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Karlslunde",
        "paragraphs": [
          "I Karlslunde møder vi villaer og parcelhuse i kvarterer som Karlslunde Strandvej, Greve og Karlstrup. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Villaer i grønne omgivelser. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Karlslunde. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Karlslunde",
        "paragraphs": [
          "Boliger i Karlslunde varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Karlslunde — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Karlslunde."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Karlslunde og omkringliggende byer."
  },
  "maaloev": {
    "heroTitle": "Privat rengøring i Måløv.",
    "heroDescription": "I Måløv matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Måløv Bygade, Ballerup og Smørum holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Måløv. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Måløv",
        "paragraphs": [
          "I Måløv møder vi rækkehuse og parcelhuse i kvarterer som Måløv Bygade, Ballerup og Smørum. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Villakvarterer med haver. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Måløv",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Måløv. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Måløv",
        "paragraphs": [
          "Boliger i Måløv varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Måløv — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Måløv."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Måløv og omkringliggende byer."
  },
  "smoerum": {
    "heroTitle": "Privat rengøring i Smørum.",
    "heroDescription": "I Smørum matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Smørum Bygade, Stenløse og Måløv holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Smørum. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Smørum Bygade, Stenløse og Måløv — boliger vi kender",
        "paragraphs": [
          "I Smørum møder vi villaer og rækkehuse i kvarterer som Smørum Bygade, Stenløse og Måløv. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Nyere villaområder. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Smørum",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Smørum. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Smørum",
        "paragraphs": [
          "Boliger i Smørum varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Smørum — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Smørum."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Smørum og omkringliggende byer."
  },
  "kongens-lyngby": {
    "heroTitle": "Privat rengøring i Kongens Lyngby.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Kongens Lyngby, så du får en løsning du kan regne med. Vi hjælper i hele Kongens Lyngby, fra Lyngby Hovedgade, Sorgenfri og Virum, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Kongens Lyngby. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Kongens Lyngby",
        "paragraphs": [
          "I Kongens Lyngby møder vi villaer, rækkehuse og lejligheder i kvarterer som Lyngby Hovedgade, Sorgenfri og Virum. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Centrum og villaer ved sø og skov. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Kongens Lyngby. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Kongens Lyngby",
        "paragraphs": [
          "Boliger i Kongens Lyngby varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Kongens Lyngby — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Kongens Lyngby."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Kongens Lyngby og omkringliggende byer."
  },
  "gentofte": {
    "heroTitle": "Privat rengøring i Gentofte.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Gentofte. Vi dækker hele Gentofte, også omkring Gentofte Hovedgade, Ordrup og Jægersborg, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Gentofte. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Gentofte",
        "paragraphs": [
          "I Gentofte møder vi villaer og lejligheder i kvarterer som Gentofte Hovedgade, Ordrup og Jægersborg. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Store villaer og elegante lejligheder. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Gentofte",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Gentofte. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Gentofte",
        "paragraphs": [
          "Boliger i Gentofte varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Gentofte — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Gentofte."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Gentofte og omkringliggende byer."
  },
  "dyssegaard": {
    "heroTitle": "Privat rengøring i Dyssegård.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Dyssegård, så du får en løsning du kan regne med. Vi hjælper i hele Dyssegård, fra Dyssegårdsvej, Søborg og Hellerup, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Dyssegård. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Dyssegårdsvej, Søborg og Hellerup — boliger vi kender",
        "paragraphs": [
          "I Dyssegård møder vi villaer og rækkehuse i kvarterer som Dyssegårdsvej, Søborg og Hellerup. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Grønne kvarterer mellem by og skov. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Dyssegård",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Dyssegård. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Dyssegård",
        "paragraphs": [
          "Boliger i Dyssegård varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Dyssegård — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Dyssegård."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Dyssegård og omkringliggende byer."
  },
  "bagsvaerd": {
    "heroTitle": "Privat rengøring i Bagsværd.",
    "heroDescription": "Lad en forsikret Zenmester tage rengøringen i Bagsværd, så du får en løsning du kan regne med. Vi hjælper i hele Bagsværd, fra Bagsværd Stationsplads, søen og skoven, så du sparer tid i en travl uge og kommer hjem til ro. Få fuldt prisoverblik med få klik, og start med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Bagsværd. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Rengøring der passer til Bagsværd",
        "paragraphs": [
          "I Bagsværd møder vi villaer og lejligheder i kvarterer som Bagsværd Stationsplads, søen og skoven. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Sø, skov og blandede boligtyper. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Servicefradrag og gennemsigtige priser",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Bagsværd. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Klar til at komme i gang i Bagsværd",
        "paragraphs": [
          "Boliger i Bagsværd varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Bagsværd — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Bagsværd."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Bagsværd og omkringliggende byer."
  },
  "hellerup": {
    "heroTitle": "Privat rengøring i Hellerup.",
    "heroDescription": "Få en forsikret Zenmester til dit hjem i Hellerup. Vi dækker hele Hellerup, også omkring Strandvejen, Hellerupvej og Tuborg, så du får mere komfort og mindre praktisk bøvl. Se din pris på under to minutter med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Hellerup. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Hverdagsliv i Hellerup",
        "paragraphs": [
          "I Hellerup møder vi villaer og herskabslejligheder i kvarterer som Strandvejen, Hellerupvej og Tuborg. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Eksklusive boliger med høje forventninger. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Fast Zenmester til dit hjem i Hellerup",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Hellerup. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Tryg rengøringspartner i Hellerup",
        "paragraphs": [
          "Boliger i Hellerup varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Hellerup — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Hellerup."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Hellerup og omkringliggende byer."
  },
  "charlottenlund": {
    "heroTitle": "Privat rengøring i Charlottenlund.",
    "heroDescription": "I Charlottenlund matcher vi dig med en forsikret Zenmester, der lærer dit hjem at kende. I kvarterer som Charlottenlund Strandvej, Jægersborg og Ordrup holder vi dit hjem løbende rent, så du kan bruge tiden på det vigtige. Tjek din pris med det samme, og kom nemt i gang med Renzen Klub fordele.",
    "metaDescription": "Privat rengøring i Charlottenlund. Fast Zenmester, forsikrede medarbejdere og op til 26% servicefradrag. Book rengøringshjælp med Renzen Klub fordele.",
    "editorialSections": [
      {
        "title": "Charlottenlund Strandvej, Jægersborg og Ordrup — boliger vi kender",
        "paragraphs": [
          "I Charlottenlund møder vi patricievillaer og store lejligheder i kvarterer som Charlottenlund Strandvej, Jægersborg og Ordrup. Hverdagen er ofte fyldt med arbejde, børn og transport — og det er her en fast Zenmester gør en markant forskel. Hos Renzen matcher vi dig med en erfaren medarbejder, der lærer dit hjem at kende: adgang, materialer og de steder, der kræver ekstra omhu.",
          "Patricievillaer ved kysten. Vi tilpasser rengøringen til din bolig og frekvens, så hjemmet holder en jævn standard uden at du skal bruge weekender på gulvvask. Som medlem af Renzen Klub får du introtilbud fra 299 kr. og løbende medlemsrabat på fast aftale."
        ]
      },
      {
        "title": "Forudsigelig kvalitet i Charlottenlund",
        "paragraphs": [
          "En fast aftale betyder, at du slipper for at forklare boligen fra bunden ved hvert besøg. Din Zenmester husker køkkenets overflader, badeværelsets fliser og de detaljer, der er typiske for Charlottenlund. Det giver ro i hverdagen — uanset om du arbejder hjemme, har små børn eller ofte modtager gæster.",
          "Du vælger frekvens efter behov og styrer aftalen online. Zen-kreditter fra medlemskabet kan bruges på vinduespudsning, ovn eller hovedrengøring. Alle Zenmestre er forsikrede, og du kan trække 26% servicefradrag på arbejdslønnen."
        ]
      },
      {
        "title": "Renzen Klub i Charlottenlund",
        "paragraphs": [
          "Boliger i Charlottenlund varierer, men fællesnævneren er, at du fortjener en pålidelig partner. Vi tager højde for parkering, trapper og nøgleadgang i Charlottenlund — og sørger for, at rengøringen passer ind i din uge uden bøvl.",
          "Vi hjælper også i nærliggende områder i Storkøbenhavn. Brug prisberegneren eller send en forespørgsel med postnummer og boligstørrelse — så kommer du hurtigt i gang med en Zenmester, der kender Charlottenlund."
        ]
      }
    ],
    "cityLinksDescription": "Vi tilbyder privat rengøring i hele Storkøbenhavn — herunder Charlottenlund og omkringliggende byer."
  }
};

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
    throw new Error(`Missing privat rengøring city copy for slug: ${city.slug}`);
  }

  const otherCities = PRIVAT_RENGORING_PRIORITY_1_CITIES.filter(
    (entry) => entry.slug !== city.slug,
  ).slice(0, 8);

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
    heroImageAlt: `Privat rengøring i ${city.name} med Renzen`,
    trustBadges: [
      "Forsikrede Zenmestre",
      "Tilfredshedsgaranti",
      "26% servicefradrag",
    ],
    stats: [
      ["4,8 ud af 5", "Kundevurdering"],
      [`Fra ${introFromLabel}`, "Første rengøring med Klub"],
      ["26%", "Muligt servicefradrag"],
      ["Fast Zenmester", "Samme ansigt hver gang"],
    ],
    includedEyebrow: "Hvad er inkluderet",
    includedTitle: "Det får du med privat rengøring",
    includedDescription:
      "Vores standardrengøring dækker det, de fleste hjem har brug for hver uge eller hver anden uge — tilpasset din bolig og dine ønsker.",
    includedItems: PRIVAT_INCLUDED_ITEMS,
    whyRenzen: {
      eyebrow: `Privat rengøring i ${city.name}`,
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
        `Angiv postnummer, størrelse og ønsket frekvens for dit hjem i ${city.name}.`,
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
        answer: `Introtilbuddet giver din første rengøring fra ${introFromLabel} (op til 70 m²) ved fast rengøring hver 2. uge og aktivt Renzen Klub-medlemskab.`,
      },
      {
        question: "Kan jeg styre mit medlemskab online?",
        answer: `Ja. Du vælger medlemskab online ved booking. Månedsplan koster ${KLUB_MONTHLY_KR} kr., årsplan ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr.`,
      },
      {
        question: "Hvad er fordelene ved Renzen Klub?",
        answer: `Op til 20% medlemsrabat, Zen-kreditter, intropris fra ${introFromLabel} og 26% servicefradrag.`,
      },
    ],
    ctaTitle: `Klar til privat rengøring i ${city.name}?`,
    bottomCtaLabel: "Se din pris",
    formTitle: "Få et uforpligtende tilbud",
    formDescription:
      "Udfyld formularen — vi vender tilbage med et skræddersyet tilbud uden binding.",
    showSizeField: true,
    showHeroInputs: true,
    heroFormWideInputs: true,
    sizeFieldLabel: "Boligstørrelse",
    sizeFieldPlaceholder: "F.eks. 100",
    klubPromoDescription: `Med Renzen Klub får du ${zenCreditMonthlyLabel} i Zen-kreditter hver måned — plus introtilbud på fast rengøring fra ${introFromLabel}.`,
  };
}
