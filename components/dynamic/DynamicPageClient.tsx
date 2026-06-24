"use client";

import React, { useState, useRef, useEffect } from "react";

import {
  CITIES,
  City,
  getLocationPhrase,
  REGIONS,
  Region,
} from "@/lib/cities";
import {
  getServiceNameInSentence,
  SERVICES,
  Service,
} from "@/lib/services";
import { LOCAL_MARKET_DATA, LocalMarketData } from "@/lib/localStats";
import { DynamicAudienceSections } from "@/components/dynamic/DynamicAudienceSections";
import { DynamicHeader } from "@/components/dynamic/DynamicHeader";
import {
  ServiceSelectorModal,
  type ServiceSelectorModalHandle,
} from "@/components/dynamic/ServiceSelectorModal";
import { DynamicFaqSection } from "@/components/dynamic/DynamicFaqSection";
import {
  DynamicPracticalGuideSection,
  type DynamicPracticalGuide,
} from "@/components/dynamic/DynamicPracticalGuideSection";
import { DynamicFinalCta } from "@/components/dynamic/DynamicFinalCta";
import { DynamicMarketAnalysisSection } from "@/components/dynamic/DynamicMarketAnalysisSection";
import { DynamicProximitySection } from "@/components/dynamic/DynamicProximitySection";
import { DynamicHeroSection } from "@/components/dynamic/DynamicHeroSection";
import { DynamicBreadcrumbs } from "@/components/dynamic/DynamicBreadcrumbs";
import {
  serviceDeduction,
  serviceDeductionText,
} from "@/lib/serviceDeduction";
import { getLocalPrice } from "@/lib/dynamicPageContent";
import type { DynamicAudienceContent } from "@/lib/audienceContent";

// Dynamic Layout component prop types
interface DynamicPageLayoutProps {
  serviceSlug: string;
  citySlug?: string;
  regionSlug?: string;
  audienceContent: DynamicAudienceContent;
  pricingSection: React.ReactNode;
  comparisonSection: React.ReactNode;
  howItWorksSection: React.ReactNode;
  appDownloadSection: React.ReactNode;
  footerSection: React.ReactNode;
}

interface DawaSuggestion {
  tekst: string;
}

const HERO_IMAGES_MAP: Record<string, string> = {
  // Private
  "privat-rengoering": "/familyoutside2.jpg",
  "airbnb-rengoering": "/airbnb-rengoring.jpg",
  "flytterengoering": "/flytterengøring.jpg",
  "hovedrengoering": "/hovedrengoering.jpg",
  "doedsborengoering": "/dødsborengøring.webp",
  "vinduespudsning": "/vinduespudser-1.jpg",
  "taepperens": "/taepperens.png",
  "havearbejde": "/havearbejde.png",
  
  // Erhverv
  "kontorrengoering": "/erhvervsrengoering.jpeg",
  "erhvervsrengoering": "/erhvervsrengoering.jpeg",
  "klinikrengoering": "/klinikrengøring.png",
  "butiksrengoering": "/butiksrengøring.png",
  "institutionsrengoering": "/institutionsrengøring.png",
  "byggerengoering": "/byggerengøring.jpg",
  "skurvognsrengoering": "/byggerengøring.jpg",
  "flytterengoering-erhverv": "/flytterengøring.jpg",
  "facaderens": "/facaderens.png",
  "erhverv-anden-rengoering": "/erhvervsrengoering.jpeg",
  "skadeservice": "/skadeservice.png",
  
  // Ejendom (Community)
  "trappevask": "/trappe-rengøring.webp",
  "elevatorrengoering": "/elevatorrengøring.png",
  "ejendoms-facaderens": "/facaderens.png",
  "altanrengoering": "/altanrengøring.png",
  "ejendoms-vinduespudsning": "/vinduespudser-1.jpg",
  
  // Udeareal (Outdoor)
  "fliserens": "/fliserens-1.webp",
  "algebehandling": "/fliserens-1.webp",
  "fliserens-og-algebehandling": "/fliserens-1.webp",
  "tagrenderens": "/tagrende-rens.webp",
  "tagrens": "/tagrens.png",
  "solcellerens": "/solcellerens.png"
};

function getScopeLimits(
  serviceSlug: string,
  serviceTab: string,
  locationPhrase: string,
) {
  const cleanService = serviceSlug.toLowerCase();
  
  // Categorized defaults (Private, Commercial B2B, Property Community, Outdoor)
  let suitable = `Private og erhverv ${locationPhrase}, der vil have tilbud fra godkendte CVR registrerede firmaer med forsikring.`;
  let unsuitable = `Meget små eller uklart beskrevne opgaver, hvor firmaerne ikke har et tilstrækkeligt grundlag for at give et præcist tilbud.`;

  if (serviceTab === "private") {
    suitable = `Private ${locationPhrase}, der ønsker professionel rengøring med en tydelig skriftlig aftale.`;
    unsuitable = `Meget små eller uklart beskrevne opgaver, hvor firmaerne ikke har et tilstrækkeligt grundlag for at give et præcist tilbud.`;
  } else if (serviceTab === "company") {
    suitable = `Virksomheder ${locationPhrase}, der søger en stabil og fleksibel erhvervsrengøring.`;
    unsuitable = `Akutte saneringsopgaver efter brand- og vandskader.`;
  } else if (serviceTab === "community") {
    suitable = `Boligforeninger og ejendomme ${locationPhrase}, der har brug for fast ejendomsservice eller trappevask.`;
    unsuitable = `Enkelte lejere, der søger privat rengøring udenom foreningens aftale.`;
  } else if (serviceTab === "outdoor") {
    suitable = `Husejere og foreninger ${locationPhrase}, der skal have ordnet have eller renset udendørs arealer.`;
    unsuitable = `Indendørs rengøring eller opgaver uden adgang til vand og strøm.`;
  }

  // Highly specific overrides for key services to maximize AEO/GEO crawl quality
  if (cleanService.includes("kontor")) {
    suitable = `Kontorer ${locationPhrase}, der ønsker fast rengøring af arbejdspladser, møderum, køkken og sanitære områder.`;
    unsuitable = `Butikker, klinikker, lagerhaller eller andre lokaler, hvor kontorrengøring ikke dækker hele opgaven.`;
  } else if (cleanService.includes("erhvervsrengoering")) {
    suitable = `Virksomheder ${locationPhrase} med kontorer, butikker, klinikker, lager eller flere typer erhvervslokaler.`;
    unsuitable = `Akut skadesanering eller meget specialiserede opgaver, der kræver særskilt autorisation eller udstyr.`;
  } else if (cleanService.includes("airbnb")) {
    suitable = `Airbnb-værter og ferieboligudlejere ${locationPhrase}, der ønsker stabil klargøring mellem gæster.`;
    unsuitable = `Hotelrengøring med døgnbemanding eller opgaver, hvor nøgleadgang og check-in-tider ikke kan aftales på forhånd.`;
  } else if (cleanService.includes("institution")) {
    suitable = `Skoler, institutioner og dagtilbud ${locationPhrase}, der ønsker rengøring tilpasset deres hygiejnekrav.`;
    unsuitable = `Akutte saneringsopgaver eller fjernelse af miljøfarligt affald.`;
  } else if (cleanService.includes("solcelle")) {
    suitable = `Vask af solceller med ultra-rent vand ${locationPhrase} for at optimere strømproduktionen.`;
    unsuitable = `Opgaver på meget stejle tage uden sikker adgang, samt vask i frostvejr.`;
  } else if (cleanService.includes("flise") || cleanService.includes("alge")) {
    suitable = `Professionel fliserens og algebehandling af terrasser og indkørsler ${locationPhrase}.`;
    unsuitable = `Indendørs arealer eller fliser, der er ødelagt af frost og kræver udskiftning.`;
  } else if (cleanService.includes("vindue")) {
    suitable = `Vinduespudsning af private hjem, lejligheder og erhverv ${locationPhrase}.`;
    unsuitable = `Ruder over 3. sal, der kræver lift eller specialudstyr (medmindre andet er aftalt).`;
  } else if (cleanService.includes("flytte")) {
    suitable = `Flytterengøring af tomme boliger eller erhvervslejemål ${locationPhrase} før fraflytning.`;
    unsuitable = `Rengøring i møblerede boliger eller mens flyttefolkene stadig arbejder.`;
  } else if (cleanService.includes("bygge") || cleanService.includes("skurvogn")) {
    suitable = `Håndværkerrengøring og slutrengøring af byggepladser ${locationPhrase}.`;
    unsuitable = `Grovsortering af byggeaffald eller bortkørsel af asbest og farligt affald.`;
  } else if (cleanService.includes("altan")) {
    suitable = `Grundig rensning og algefjernelse på altaner ${locationPhrase}.`;
    unsuitable = `Altaner uden gulvafløb, hvor vandet vil løbe ned til underboen.`;
  } else if (cleanService.includes("tagre")) {
    suitable = `Tømning og rensning af tagrender ${locationPhrase} for at undgå vandskader.`;
    unsuitable = `Bygninger over 2 etager uden lift, eller tagrender der er gennemtærede.`;
  } else if (cleanService.includes("tagrens")) {
    suitable = `Professionel tagrens og algebehandling af tage ${locationPhrase}.`;
    unsuitable = `Tage med asbest (da de ikke må højtryksspules) eller tage med alvorlige skader.`;
  }

  return { suitable, unsuitable };
}

export default function DynamicPageClient({
  serviceSlug,
  citySlug,
  regionSlug,
  audienceContent,
  pricingSection,
  comparisonSection,
  howItWorksSection,
  appDownloadSection,
  footerSection,
}: DynamicPageLayoutProps) {
  const service: Service = SERVICES[serviceSlug];
  const serviceName = getServiceNameInSentence(service);
  const city: City | undefined = citySlug ? CITIES[citySlug] : undefined;
  const region: Region | undefined = regionSlug ? REGIONS[regionSlug] : undefined;
  const locationPhrase = city
    ? getLocationPhrase(city)
    : region
      ? getLocationPhrase(region)
      : "";

  const activeCity = city || (region ? CITIES[region.defaultCitySlug] : undefined);
  const tierMultiplier = activeCity 
    ? (activeCity.tier === 1 ? 1.12 : activeCity.tier === 3 ? 0.90 : 1.00)
    : 1.00;

  const localStats: LocalMarketData | undefined = city
    ? LOCAL_MARKET_DATA[city.municipalitySlug ?? city.slug]
    : undefined;
  const scopeLimits = getScopeLimits(
    serviceSlug,
    service?.tab || "private",
    locationPhrase || "i Danmark",
  );

  const basePriceString = service?.pricingTable?.[0]?.price || "";
  const localizedBasePrice = getLocalPrice(basePriceString, tierMultiplier);
  const cleanBasePrice = localizedBasePrice.replace(/^fra\s+/i, "");
  const pageLocationPhrase = locationPhrase || "i Danmark";
  const nearbyLocationPhrase = locationPhrase || "i dit nærområde";
  const faqBasePrice = cleanBasePrice.replace(/\.+$/, "");

  const blufText = city && localStats
    ? `Leder du efter ${serviceName} ${locationPhrase}? Modtag 3 uforpligtende tilbud fra aktive CVR-registrerede rengøringsfirmaer med dækning i ${localStats.municipalityName}. Priserne starter typisk fra ${cleanBasePrice.toLowerCase()}, og det tager under 1 minut at indsende din opgave.`
    : region
      ? `Leder du efter ${serviceName} ${locationPhrase}? Sammenlign uforpligtende tilbud fra kvalitetssikrede rengøringsfirmaer. Priserne tilpasses det lokale prisniveau, og det tager under 1 minut at komme i gang.`
      : `${service.description} Få nemt og hurtigt 3 gratis tilbud fra lokale, godkendte firmaer.`;

  const statsUpdatedDateText = `Priser og markedsdata sidst opdateret: juni 2026`;

  const parentRegion: Region | undefined = region || (city ? REGIONS[city.region] : undefined);

  const breadcrumbs = [
    { label: "Hjem", href: "/" }
  ];

  if (service) {
    breadcrumbs.push({
      label: service.name,
      href: `/${serviceSlug}`
    });
  }

  if (parentRegion) {
    breadcrumbs.push({
      label: parentRegion.name,
      href: `/${serviceSlug}/${parentRegion.slug}`
    });
  }

  if (city) {
    breadcrumbs.push({
      label: city.name,
      href: `/${serviceSlug}/${citySlug}`
    });
  }

  // Initialize form state using service and city/region variables
  const activeTab = service.tab;
  const selectedService = service.id;
  const [postalCode, setPostalCode] = useState(
    city 
      ? `${city.defaultPostal} ${city.name}` 
      : region 
        ? `${CITIES[region.defaultCitySlug]?.defaultPostal || "1000"} ${CITIES[region.defaultCitySlug]?.name || region.name}` 
        : ""
  );
  
  const [isLocating, setIsLocating] = useState(false);
  // DAWA Autocomplete State
  const [suggestions, setSuggestions] = useState<DawaSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ref for controlling the ServiceSelectorModal directly to prevent parent re-renders
  const serviceSelectorRef = useRef<ServiceSelectorModalHandle>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolokalisering er ikke understøttet af din enhed.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.dataforsyningen.dk/adgangsadresser/reverse?x=${longitude}&y=${latitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.postnummer) {
              setPostalCode(`${data.postnummer.nr} ${data.postnummer.navn}`);
              setSuggestions([]);
              setShowSuggestions(false);
            } else {
              alert("Kunne ikke finde postnummer for din placering.");
            }
          } else {
            alert("Fejl ved kommunikation med adresseregisteret.");
          }
        } catch {
          alert("Netværksfejl under placeringssøgning.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Giv adgang til din placering i browseren for at hente postnummer.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePostalCodeChange = async (val: string) => {
    setPostalCode(val);
    if (val.trim().length >= 2) {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/postnumre/autocomplete?q=${encodeURIComponent(val)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching DAWA suggestions:", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const baseFaqs = [
    {
      q: `Hvor meget koster ${serviceName} ${pageLocationPhrase}?`,
      a: `Prisen for ${serviceName} ${nearbyLocationPhrase} afhænger af opgavens omfang, f.eks. antal kvadratmeter og specifikke krav. En typisk pris starter fra ${faqBasePrice.toLowerCase()}. Ved at indhente 3 uforpligtende tilbud kan du sammenligne lokale priser og finde den mest økonomiske løsning.`
    },
    {
      q: `Er det gratis og uforpligtende at indhente tilbud på ${serviceName}?`,
      a: "Ja, det er 100% gratis og helt uforpligtende at indsende din opgave hos Renbud. Når du har modtaget dine 3 personlige tilbud, kan du frit vælge det bedste tilbud – eller takke nej til dem alle, hvis ingen af dem matcher dine ønsker."
    },
    {
      q: `Hvor hurtigt modtager jeg mine tilbud på ${serviceName} ${pageLocationPhrase}?`,
      a: `De fleste brugere modtager de første priser og tilbud inden for 4 til 24 timer efter indsendelse. Vi sender din forespørgsel til op til 3 kvalitetssikrede firmaer ${locationPhrase || "i området"} for at sikre hurtig og relevant respons.`
    },
    {
      q: `Hvordan sikrer I kvaliteten af rengøringsfirmaerne ${pageLocationPhrase}?`,
      a: `Alle rengøringsfirmaer tilknyttet Renbud gennemgår en grundig verifikationsproces. Vi kontrollerer CVR registeret, forsikringsdækning samt historiske kundeanmeldelser, så du altid er sikret en tryg og professionel service.`
    },
    {
      q: `Kan virksomheder trække ${serviceName} fra i skat?`,
      a: "Momsregistrerede virksomheder kan normalt fratrække relevante udgifter til erhvervsrengøring og ejendomsservice som driftsomkostninger. Den konkrete skatte- og momsmæssige behandling bør bekræftes med virksomhedens rådgiver."
    },
    {
      q: `Hvad er forskellen på en fast serviceaftale og en enkeltstående opgave for ${serviceName}?`,
      a: `En fast aftale er en løbende service (f.eks. ugentligt eller månedligt), der holder dine arealer rene og velholdte kontinuerligt. En enkeltstående opgave er en dybdegående engangsydelse, som typisk bestilles efter behov, f.eks. efter renovering, ved flytning eller som en grundig sæsonrengøring.`
    },
    {
      q: `Hvad er timeprisen typisk for professionel rengøring og service ${pageLocationPhrase}?`,
      a: `Timeprisen for professionelle serviceydelser ${nearbyLocationPhrase} varierer typisk mellem 250 kr. og 450 kr. pr. time ex. moms for erhverv, afhængigt af opgavens type, frekvens og nødvendige midler.`
    }
  ];

  const getServiceSpecificFaqs = () => {
    const isFlytte = serviceSlug.includes("flytte");
    const isPrivat = serviceSlug === "privat-rengoering";
    const isAirbnb = serviceSlug === "airbnb-rengoering";
    const isKontor = serviceSlug === "kontorrengoering";
    const isGeneralErhverv = serviceSlug === "erhvervsrengoering";
    const isErhverv = ["klinikrengoering", "butiksrengoering", "institutionsrengoering", "byggerengoering", "skurvognsrengoering"].includes(serviceSlug);

    if (isFlytte) {
      return [
        {
          q: "Hvad sker der, hvis rengøringen ikke godkendes ved flyttesynet?",
          a: "Nogle rengøringsfirmaer tilbyder en skriftlig ordning for udbedring af mangler efter flyttesynet. Spørg det enkelte firma, hvad tilbuddet omfatter, og få eventuelle vilkår skrevet ind i aftalen."
        },
        {
          q: "Skal boligen være helt tom inden flytterengøring påbegyndes?",
          a: "Ja, for at opnå det bedste resultat skal boligen være fuldstændig tømt for møbler og personlige ejendele. Dette giver rengøringsfolkene fri adgang til at rengøre paneler, skuffer, skabe indvendigt og foretage en grundig gulvvask."
        }
      ];
    }

    if (isAirbnb) {
      return [
        {
          q: "Hvad indgår typisk i Airbnb rengøring mellem gæster?",
          a: "En typisk klargøring omfatter rengøring af køkken og badeværelse, støvsugning og gulvvask, aftørring af overflader, tømning af affald og et pænt reset af boligen. Skift af sengetøj, håndklæder og opfyldning af forbrugsvarer skal aftales i tilbuddet."
        },
        {
          q: "Kan rengøringen planlægges mellem check-out og check-in?",
          a: "Ja. Oplys de præcise adgangsforhold og tidsvinduer i opgaven, så firmaerne kan vurdere, om de kan levere en fast og pålidelig klargøring før næste gæst ankommer."
        }
      ];
    }

    if (isPrivat) {
      return [
        {
          q: "Hvem leverer rengøringsmidler og udstyr til privat rengøring?",
          a: "I de fleste tilfælde medbringer det valgte professionelle rengøringsfirma selv alle nødvendige rengøringsmidler, klude, støvsuger og moppe. Ønsker du, at de bruger dine egne specifikke produkter (f.eks. allergivenlige midler), kan du blot aftale dette med firmaet på forhånd."
        },
        {
          q: "Skal jeg være hjemme, når rengøringshjælpen kommer?",
          a: "Nej, du behøver ikke at være hjemme. Mange vælger at overlade en nøgle til rengøringsfirmaet eller lægge den i en nøgleboks. Alle aktive virksomheder på Renbud har dokumenteret CVR-registrering og erhvervsansvarsforsikring, men nøglehåndtering og adgang bør stadig aftales skriftligt."
        }
      ];
    }

    if (isKontor) {
      return [
        {
          q: "Kan kontorrengøring udføres uden for vores normale arbejdstid?",
          a: "Ja. Oplys jeres ønskede tidsrum, adgangsforhold og eventuelle alarmprocedurer i forespørgslen. Firmaerne kan derefter tilbyde rengøring før arbejdsdagen, efter lukketid eller på aftalte ugedage."
        },
        {
          q: "Hvad indgår normalt i en fast kontorrengøringsaftale?",
          a: "Aftalen kan blandt andet omfatte støvsugning og gulvvask, aftørring af frie skriveborde og kontaktflader, rengøring af møderum, køkken og toiletter samt tømning af affald. Den præcise arbejdsplan aftales med det valgte firma."
        }
      ];
    }

    if (isGeneralErhverv) {
      return [
        {
          q: "Hvilke typer erhvervslokaler kan omfattes af erhvervsrengøring?",
          a: "Erhvervsrengøring kan tilpasses blandt andet butikker, kontorer, klinikker, fællesarealer, lager- og personalefaciliteter. Beskriv lokalerne og eventuelle branchekrav, så firmaerne kan sammensætte det rigtige tilbud."
        },
        {
          q: "Kan én erhvervsaftale dække flere lokationer eller forskellige lokaletyper?",
          a: "Det kan ofte aftales. Oplys adresser, arealer, åbningstider og ønsket frekvens for hver lokation, så leverandørerne kan vurdere bemanding, transport og en samlet rengøringsplan."
        }
      ];
    }

    if (isErhverv) {
      return [
        {
          q: "Kan vi få kontorrengøring uden for vores normale arbejdstid?",
          a: "Ja, absolut. De fleste erhvervsopgaver udføres enten tidligt om morgenen før arbejdstid eller om aftenen efter lukketid. Dette sikrer, at dine medarbejdere ikke forstyrres under deres daglige arbejde."
        },
        {
          q: "Er jeres tilknyttede firmaer forsikret mod skader på it-udstyr?",
          a: "Alle virksomheder skal dokumentere en aktiv erhvervsansvarsforsikring, før de kan blive aktive på Renbud. Om en konkret skade på it-udstyr eller inventar er dækket, afhænger af policens vilkår og undtagelser."
        }
      ];
    }

    return [
      {
        q: "Hvordan fungerer betalingen for opgaven?",
        a: "Efter opgaven er udført, modtager du en elektronisk faktura direkte fra det valgte rengøringsfirma. Betalingen sker via bankoverførsel eller MobilePay som angivet på fakturaen, hvilket også sikrer korrekt dokumentation til evt. skattefradrag."
      },
      {
        q: "Skal jeg sørge for noget forud for rengøringsfirmaets ankomst?",
        a: "Vi anbefaler at fjerne løse genstande fra de berørte områder (f.eks. fjerne møbler fra altanen eller krukker fra fliserne). Ved udendørs opgaver som fliserens skal der desuden være adgang til en udendørs vandhane med normalt tryk samt stikkontakt."
      }
    ];
  };

  const faqs = [...baseFaqs, ...getServiceSpecificFaqs()];

  const getServiceGuide = (): DynamicPracticalGuide => {
    const isFlytte = serviceSlug.includes("flytte");
    const isPrivat = serviceSlug === "privat-rengoering";
    const isAirbnb = serviceSlug === "airbnb-rengoering";
    const isKontor = serviceSlug === "kontorrengoering";
    const isGeneralErhverv = serviceSlug === "erhvervsrengoering";
    const isErhverv = ["klinikrengoering", "butiksrengoering", "institutionsrengoering", "byggerengoering", "skurvognsrengoering"].includes(serviceSlug);

    if (isAirbnb) {
      return {
        title: `Praktisk guide til Airbnb rengøring ${pageLocationPhrase}`,
        disclaimerTitle: "Aftal adgang og tidsvindue tydeligt",
        disclaimerText: `Renbud formidler kontakten til selvstændige rengøringsfirmaer. Aftal nøglehåndtering, check-out, næste check-in og eventuelle ekstraopgaver direkte og skriftligt med det valgte firma.`,
        checklistTitle: "Typisk tjekliste ved gæsteskifte",
        checklistItems: [
          "Rengøring og afkalkning af badeværelse",
          "Aftørring af køkken, bordplader og komfur",
          "Støvsugning og gulvvask i alle opholdsrum",
          "Tømning af affald og isætning af nye poser",
          "Aftørring af håndtag, kontakter og andre berøringsflader",
          "Skift af sengetøj og håndklæder, hvis det er aftalt",
          "Kontrol af synlige skader eller glemte ejendele efter aftale",
          "Afsluttende reset, så boligen er præsentabel ved check-in"
        ],
        extraTitle: "Oplys dette i din forespørgsel",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>Beskriv boligens størrelse, antal senge og badeværelser, hvor ofte du har gæsteskift, og hvor kort tidsvinduet mellem gæster typisk er.</p>
            <p>Angiv også, om firmaet skal håndtere linned, håndklæder, nøgleboks, forbrugsvarer eller fotodokumentation.</p>
          </div>
        )
      };
    }

    if (isFlytte) {
      return {
        title: `Praktisk guide & tjekliste til flytterengøring ${pageLocationPhrase}`,
        disclaimerTitle: "Vigtigt om garanti og flyttesyn",
        disclaimerText: `Når du bestiller flytterengøring via Renbud, modtager du tilbud fra selvstændige, CVR registrerede rengøringsfirmaer. Bemærk, at den juridiske aftale og eventuelle godkendelsesgarantier indgås direkte med det valgte firma. Vi anbefaler altid, at du gennemgår boligen sammen med rengøringsfirmaet før den endelige aflevering til udlejer eller køber.`,
        checklistTitle: "27 punkter udlejere og købere typisk tjekker",
        checklistItems: [
          "Afkalkning af armaturer, fliser og bruseniche i badeværelse",
          "Rengøring af toilet, vask, spejle samt rensning af gulvafløb",
          "Indvendig og udvendig rengøring af ovn, bageplader og rist",
          "Grundig rengøring af emhætte og fedtfilter",
          "Aftørring af køkkenskabe og skuffer (indvendigt og udvendigt)",
          "Afrimning og rengøring af køleskab samt fryser indvendigt",
          "Aftørring af alle døre, karme, paneler, kontakter og stik",
          "Støvsugning og grundig vask af alle gulve og paneler",
          "Aftørring af radiatorer og rørforbindelser",
          "Indvendig og udvendig vinduespudsning (hvis bestilt)"
        ],
        extraTitle: "Hvor lang tid tager en flytterengøring?",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>Tidsforbruget afhænger primært af boligens størrelse og dens stand inden rengøringen påbegyndes:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li><strong className="text-zinc-700 font-bold">Under 50 m²:</strong> Typisk 3 - 5 timer (1-2 personer)</li>
              <li><strong className="text-zinc-700 font-bold">50 - 100 m²:</strong> Typisk 5 - 8 timer (2 personer)</li>
              <li><strong className="text-zinc-700 font-bold">101 - 150 m²:</strong> Typisk 8 - 12 timer (2-3 personer)</li>
            </ul>
            <p className="text-[10px] text-zinc-400 mt-2">Bemærk: Rengøring af ovn, emhætte og afkalkning af badeværelse er altid de mest tidskrævende opgaver.</p>
          </div>
        )
      };
    }

    if (isPrivat) {
      return {
        title: `Kvalitetsstandard for privat rengøring ${pageLocationPhrase}`,
        disclaimerTitle: "Få skattebesparelse med servicefradraget",
        disclaimerText: `Som privatperson kan du få fradrag for den arbejdsløn, der vedrører privat rengøringshjælp, via servicefradraget. I ${serviceDeduction.year} er loftet ${serviceDeductionText.maximumPerPerson} pr. person. Skatteværdien er ca. ${serviceDeductionText.taxValue} af den fradragsberettigede arbejdsløn. Husk at betale elektronisk og gemme din faktura som dokumentation til Skattestyrelsen.`,
        checklistTitle: "Dette inkluderer en standard privat rengøring",
        checklistItems: [
          "Støvsugning af alle gulve, tæpper og tilgængelige flader",
          "Grundig vask af hårde gulve i alle opholdsrum",
          "Aftørring af støv på borde, reoler, vindueskarme og frie overflader",
          "Rengøring af badeværelse: toilet, håndvask, spejl og bruseniche",
          "Aftørring af køkkenborde, køkkenvask og udvendige flader på hvidevarer",
          "Tømning af skraldespande (efter forudgående aftale)",
          "Aftørring af dørhåndtag og lyskontakter i boligen"
        ],
        extraTitle: "Regelmæssig hjælp betaler sig",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>At vælge en fast ugentlig eller hver anden uge aftale har flere fordele frem for enkeltstående opgaver:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li><strong className="text-zinc-700 font-bold">Lavere timepris:</strong> Faste aftaler udløser rabat hos leverandørerne.</li>
              <li><strong className="text-zinc-700 font-bold">Fast Zenmester:</strong> Du får typisk tilknyttet den samme Zenmester hver gang.</li>
              <li><strong className="text-zinc-700 font-bold">Løbende vedligeholdelse:</strong> Hjemmet holdes pænt, hvilket mindsker behovet for dyre hovedrengøringer.</li>
            </ul>
          </div>
        )
      };
    }

    if (isKontor) {
      return {
        title: `Plan for kontorrengøring ${pageLocationPhrase}`,
        disclaimerTitle: "Tilpas rengøringen til arbejdsdagen",
        disclaimerText: "En god kontoraftale beskriver frekvens, adgang, alarm, aflåsning og hvilke områder der må rengøres uden medarbejdere til stede. Aftal også tydeligt, hvordan skriveborde med dokumenter og personligt udstyr skal håndteres.",
        checklistTitle: "Typiske punkter i kontorrengøring",
        checklistItems: [
          "Støvsugning og gulvvask i kontorer, gange og møderum",
          "Aftørring af frie skriveborde, borde og vindueskarme",
          "Rengøring af møderum og klargøring af fællesområder",
          "Aftørring af dørhåndtag, kontakter og andre kontaktflader",
          "Rengøring af tekøkken, spiseområde og synlige køkkenflader",
          "Rengøring og opfyldning i toilet- og sanitetsområder",
          "Tømning af affald og håndtering af aftalt kildesortering"
        ],
        extraTitle: "Oplys dette om kontoret",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>Angiv kontorets areal, antal arbejdspladser, møderum, toiletter og køkkenområder samt hvor ofte der ønskes rengøring.</p>
            <p>Beskriv også adgang, alarm, parkering og om arbejdet skal udføres før, under eller efter normal arbejdstid.</p>
          </div>
        )
      };
    }

    if (isGeneralErhverv) {
      return {
        title: `Erhvervsrengøring til virksomhedens lokaler ${pageLocationPhrase}`,
        disclaimerTitle: "Én plan skal passe til jeres drift",
        disclaimerText: "Erhvervslokaler har forskellige krav til hygiejne, adgang og rengøringsfrekvens. Beskriv alle lokaletyper, åbningstider og eventuelle branchekrav, så tilbuddene kan sammenlignes på samme grundlag.",
        checklistTitle: "Det bør en erhvervsaftale tage højde for",
        checklistItems: [
          "Kortlægning af kontorer, kundeområder, lager og fællesfaciliteter",
          "Rengøringsfrekvens tilpasset trafik og åbningstider",
          "Særskilte krav til sanitære rum, køkken og personalefaciliteter",
          "Gulvpleje tilpasset tæpper, vinyl, træ eller industrigulve",
          "Affaldshåndtering og kildesortering efter virksomhedens rutiner",
          "Adgang, alarm, nøglehåndtering og ansvar ved aflåsning",
          "Fast kvalitetskontrol og procedure for ændringer i aftalen"
        ],
        extraTitle: "Beskriv virksomhedens samlede behov",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>Oplys areal, lokaletyper, antal adresser, åbningstider og ønsket frekvens. Det gør det lettere at sammenligne bemanding og samlet pris.</p>
            <p>Kontorrengøring kan indgå som en del af aftalen, mens klinik-, butiks- eller lagerområder kan kræve deres egne arbejdsplaner.</p>
          </div>
        )
      };
    }

    if (isErhverv) {
      return {
        title: `Professionel erhvervsrengøring ${pageLocationPhrase}`,
        disclaimerTitle: "Skattemæssigt fradrag & moms for virksomheder",
        disclaimerText: `Erhvervsrengøring er en fuldt fradragsberettiget driftsomkostning for momsregistrerede virksomheder. Alle priser opgives ex. moms, og momsbeløbet kan modregnes direkte i din virksomheds momsregnskab. Dette sikrer en yderst attraktiv nettopris for at holde kontorer, klinikker og butikker pæne og professionelle.`,
        checklistTitle: "Standard punkter for erhvervsaftaler",
        checklistItems: [
          "Aftørring og desinfektion af skriveborde, mødeborde og fællesflader",
          "Tømning af affaldsspande og kildesortering på kontorer",
          "Støvsugning af tæppebelagte kontorområder og gangarealer",
          "Grundig vask og desinfektion af sanitære rum og toiletter",
          "Aftørring af køkkenflader, kaffemaskineområder og opvaskemaskine",
          "Aftørring af kontaktflader såsom håndtag, gelændere og elevatorer",
          "Genopfyldning af håndsæbe, håndpapir og toiletpapir (valgfrit tilkøb)"
        ],
        extraTitle: "Sikkerhed & Professionelle standarder",
        extraContent: (
          <div className="space-y-3 text-xs text-zinc-500 font-medium">
            <p>Erhvervsrengøring udføres i overensstemmelse med gældende branchestandarder:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li><strong className="text-zinc-700 font-bold">Arbejdsmiljø:</strong> Vores partnere følger Arbejdstilsynets retningslinjer for ergonomi og kemi.</li>
              <li><strong className="text-zinc-700 font-bold">Fleksibilitet:</strong> Udføres typisk uden for jeres arbejdstid for minimal forstyrrelse.</li>
              <li><strong className="text-zinc-700 font-bold">Forsikring:</strong> Aktive virksomheder har dokumenteret erhvervsansvarsforsikring; konkret dækning afhænger af policens vilkår.</li>
            </ul>
          </div>
        )
      };
    }

    return {
      title: `Praktisk info for ${serviceName} ${pageLocationPhrase}`,
      disclaimerTitle: "Kvalitet og forsikring",
      disclaimerText: "Alle virksomheder skal dokumentere en aktiv erhvervsansvarsforsikring, før de kan blive aktive på Renbud. Forsikringen kan dække skader efter dens konkrete vilkår og undtagelser. Aftal altid opgavens omfang, pris og ansvar skriftligt med det valgte firma.",
      checklistTitle: "Typiske faser i arbejdets udførelse",
      checklistItems: [
        "Forberedelse og inspektion af overflader / arbejdsområde",
        "Opsætning af eventuelt nødvendigt sikkerhedsudstyr",
        "Udførelse med professionelle maskiner og godkendte rensemidler",
        "Efterfølgende oprydning og fjernelse af groft affald",
        "Slutinspektion og godkendelse af kunden på stedet",
        "Fremsendelse af elektronisk faktura med fradragsberettiget arbejdsløn"
      ],
      extraTitle: "Sådan gør du klar til besøget",
      extraContent: (
        <div className="space-y-3 text-xs text-zinc-500 font-medium">
          <p>For at sikre den mest effektive og hurtige udførelse af din opgave anbefaler vi følgende forberedelser:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong className="text-zinc-700 font-bold">Fri adgang:</strong> Sørg for at rydde områderne (f.eks. altanen, fliserne eller tagrenderne) for løse genstande.</li>
            <li><strong className="text-zinc-700 font-bold">Forsyninger:</strong> Sikr dig at der er adgang til udendørs vandhane og strømstik, hvis opgaven kræver det (f.eks. ved fliserens).</li>
            <li><strong className="text-zinc-700 font-bold">Parkering:</strong> Oplys gerne om eventuelle parkeringsforhold tæt på boligen for nem aflæsning af udstyr.</li>
          </ul>
        </div>
      )
    };
  };
  if (!service) return null;

  const heroImage = HERO_IMAGES_MAP[serviceSlug] || "/familyoutside2.jpg";
  const heroImagePosition =
    serviceSlug === "airbnb-rengoering" ? "right" : "left";
  const heroImageOffsetX = serviceSlug === "airbnb-rengoering" ? 100 : 0;
  const heroAlt = `Professionel ${serviceName}`;

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
      {/* Sticky Header Outside Hero Section */}
      <DynamicHeader />

      <DynamicHeroSection
        service={service}
        city={city}
        region={region}
        heroImage={heroImage}
        heroAlt={heroAlt}
        heroImagePosition={heroImagePosition}
        heroImageOffsetX={heroImageOffsetX}
        blufText={blufText}
        postalCode={postalCode}
        isLocating={isLocating}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onPostalCodeChange={handlePostalCodeChange}
        onPostalCodeSelect={setPostalCode}
        onHideSuggestions={() => setShowSuggestions(false)}
        onGeolocate={handleGeolocate}
        onOpenSelector={(value) =>
          serviceSelectorRef.current?.open(value, activeTab, selectedService)
        }
      />
      <DynamicBreadcrumbs
        breadcrumbs={breadcrumbs}
        updatedText={statsUpdatedDateText}
      />

      {pricingSection}
      {comparisonSection}

      <DynamicPracticalGuideSection guide={getServiceGuide()} />

      {howItWorksSection}



      <DynamicAudienceSections
        content={audienceContent}
        onPrimaryClick={() =>
          serviceSelectorRef.current?.open("", activeTab, selectedService)
        }
        onSecondaryClick={() =>
          serviceSelectorRef.current?.open("", activeTab, selectedService)
        }
      />



      {appDownloadSection}

      {/* Customer Reviews Section Removed to maintain high organic quality scores */}

      <DynamicFaqSection faqs={faqs} />

      <DynamicMarketAnalysisSection
        city={city}
        localStats={localStats}
        scopeLimits={scopeLimits}
      />

      <DynamicProximitySection
        service={service}
        city={city}
        region={region}
      />

      <DynamicFinalCta
        activeTab={activeTab}
        selectedService={selectedService}
        postalCode={postalCode}
      />

      {footerSection}

      {/* Modal Popup (Encapsulated subcomponent for 120fps isolation) */}
      <ServiceSelectorModal
        ref={serviceSelectorRef}
      />
    </div>
  );
}
