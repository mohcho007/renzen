import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";

export interface DynamicFaq {
  q: string;
  a: string;
}

function getLocationPhrase(locationName: string): string {
  if (locationName === "Fyn" || locationName === "Bornholm") {
    return `på ${locationName}`;
  }
  if (locationName === "Sydsjælland og øer") {
    return "på Sydsjælland og øerne";
  }
  return `i ${locationName}`;
}

export function getLocalPrice(priceString: string, multiplier: number): string {
  if (multiplier === 1) return priceString;

  return priceString.replace(/([\d.]+)\s*kr/g, (match, value) => {
    const rawNumber = Number.parseFloat(value.replace(/\./g, ""));
    if (Number.isNaN(rawNumber)) return match;

    let calculated = rawNumber * multiplier;
    if (calculated < 100) {
      calculated = Math.round(calculated / 5) * 5;
    } else if (calculated < 1000) {
      calculated = Math.round(calculated / 10) * 10;
    } else {
      calculated = Math.round(calculated / 50) * 50;
    }

    return `${calculated.toLocaleString("da-DK")} kr`;
  });
}

export function getDynamicFaqs({
  service,
  serviceSlug,
  locationName,
  localizedBasePrice,
}: {
  service: Service;
  serviceSlug: string;
  locationName: string;
  localizedBasePrice: string;
}): DynamicFaq[] {
  const serviceName = getServiceNameInSentence(service);
  const locationPhrase = getLocationPhrase(locationName);
  const nearbyLocationPhrase =
    locationName === "Danmark" ? "i dit nærområde" : locationPhrase;
  const responseLocationPhrase =
    locationName === "Danmark" ? "i området" : locationPhrase;
  const displayPrice = localizedBasePrice
    .replace(/^fra\s+/i, "")
    .replace(/\.+$/, "");
  const baseFaqs: DynamicFaq[] = [
    {
      q: `Hvor meget koster ${serviceName} ${locationPhrase}?`,
      a: `Prisen for ${serviceName} ${nearbyLocationPhrase} afhænger af opgavens omfang, f.eks. antal kvadratmeter og specifikke krav. En typisk pris starter fra ${displayPrice.toLowerCase()}. Ved at indhente 3 uforpligtende tilbud kan du sammenligne lokale priser og finde den mest økonomiske løsning.`,
    },
    {
      q: `Er det gratis og uforpligtende at indhente tilbud på ${serviceName}?`,
      a: "Ja, det er 100% gratis og helt uforpligtende at indsende din opgave hos Renbud. Når du har modtaget dine 3 personlige tilbud, kan du frit vælge det bedste tilbud eller takke nej til dem alle.",
    },
    {
      q: `Hvor hurtigt modtager jeg mine tilbud på ${serviceName} ${locationPhrase}?`,
      a: `De fleste brugere modtager de første priser og tilbud inden for 4 til 24 timer efter indsendelse. Vi sender din forespørgsel til op til 3 kvalitetssikrede firmaer ${responseLocationPhrase} for at sikre hurtig og relevant respons.`,
    },
    {
      q: `Hvordan sikrer I kvaliteten af rengøringsfirmaerne ${locationPhrase}?`,
      a: "Alle rengøringsfirmaer tilknyttet Renbud gennemgår en verifikationsproces. Vi kontrollerer CVR-registrering og relevante virksomhedsoplysninger, så du kan sammenligne tilbud fra professionelle firmaer.",
    },
    {
      q: `Kan virksomheder trække ${serviceName} fra i skat?`,
      a: "Momsregistrerede virksomheder kan normalt fratrække relevante udgifter til erhvervsrengøring og ejendomsservice som driftsomkostninger. Den konkrete skattemæssige behandling bør bekræftes med virksomhedens rådgiver.",
    },
    {
      q: `Hvad er forskellen på en fast serviceaftale og en enkeltstående opgave for ${serviceName}?`,
      a: "En fast aftale er en løbende service, der holder arealerne rene og velholdte. En enkeltstående opgave bestilles efter behov, for eksempel efter renovering, ved flytning eller som en grundig sæsonrengøring.",
    },
    {
      q: `Hvad er timeprisen typisk for professionel rengøring og service ${locationPhrase}?`,
      a: "Timeprisen varierer efter opgavetype, frekvens, geografi og nødvendigt udstyr. Indhent flere konkrete tilbud for at sammenligne den samlede pris og det inkluderede arbejde.",
    },
  ];

  let serviceFaqs: DynamicFaq[];

  if (serviceSlug === "airbnb-rengoering") {
    serviceFaqs = [
      {
        q: "Hvad indgår typisk i Airbnb rengøring mellem gæster?",
        a: "En typisk klargøring omfatter køkken, badeværelse, gulve, overflader og affald. Skift af sengetøj og håndklæder samt opfyldning af forbrugsvarer skal aftales direkte med firmaet.",
      },
      {
        q: "Kan rengøringen planlægges mellem check-out og check-in?",
        a: "Ja. Oplys adgangsforhold og det præcise tidsvindue i forespørgslen, så firmaerne kan vurdere, om de kan nå at gøre boligen klar før næste gæst.",
      },
    ];
  } else if (serviceSlug.includes("flytte")) {
    serviceFaqs = [
      {
        q: "Hvad sker der, hvis rengøringen ikke godkendes ved flyttesynet?",
        a: "Aftal eventuel godkendelsesgaranti direkte og skriftligt med rengøringsfirmaet. Renbud formidler kontakten, mens vilkår og udbedring aftales mellem dig og det valgte firma.",
      },
      {
        q: "Skal boligen være helt tom inden flytterengøring påbegyndes?",
        a: "Ja, et tomt lejemål giver firmaet fri adgang til paneler, skabe, skuffer og gulve og giver normalt det bedste resultat.",
      },
    ];
  } else if (serviceSlug === "privat-rengoering") {
    serviceFaqs = [
      {
        q: "Hvem leverer rengøringsmidler og udstyr til privat rengøring?",
        a: "Det varierer mellem firmaerne. Bekræft i tilbuddet, om firmaet medbringer midler, klude, støvsuger og moppe, og oplys eventuelle ønsker til allergivenlige produkter.",
      },
      {
        q: "Skal jeg være hjemme, når rengøringshjælpen kommer?",
        a: "Nej, det kan ofte aftales med firmaet, men nøglehåndtering og adgang til boligen skal aftales direkte og sikkert med den valgte leverandør.",
      },
    ];
  } else if (serviceSlug === "kontorrengoering") {
    serviceFaqs = [
      {
        q: "Kan kontorrengøring udføres uden for normal arbejdstid?",
        a: "Ja. Oplys ønskede tidsrum, adgangsforhold og eventuelle alarmprocedurer, så firmaerne kan tilbyde rengøring før arbejdsdagen, efter lukketid eller på bestemte ugedage.",
      },
      {
        q: "Hvad indgår normalt i en fast kontorrengøringsaftale?",
        a: "Aftalen kan omfatte gulve, frie skriveborde, møderum, køkken, toiletter, kontaktflader og affald. Det præcise omfang og frekvensen aftales med det valgte firma.",
      },
    ];
  } else if (serviceSlug === "erhvervsrengoering") {
    serviceFaqs = [
      {
        q: "Hvilke typer lokaler kan omfattes af erhvervsrengøring?",
        a: "Erhvervsrengøring kan tilpasses blandt andet butikker, kontorer, klinikker, fællesarealer, lager- og personalefaciliteter. Beskriv lokalerne og eventuelle branchekrav i forespørgslen.",
      },
      {
        q: "Kan én erhvervsaftale dække flere lokationer?",
        a: "Det kan ofte aftales. Oplys adresser, arealer, åbningstider og frekvens for hver lokation, så firmaerne kan vurdere bemanding, transport og en samlet rengøringsplan.",
      },
    ];
  } else if (
    [
      "klinikrengoering",
      "butiksrengoering",
      "institutionsrengoering",
      "byggerengoering",
      "skurvognsrengoering",
    ].includes(serviceSlug)
  ) {
    serviceFaqs = [
      {
        q: "Kan vi få rengøring uden for vores normale arbejdstid?",
        a: "Ja, mange firmaer tilbyder rengøring tidligt om morgenen eller efter lukketid. Tidspunkt og adgangsforhold aftales direkte med leverandøren.",
      },
      {
        q: "Er de tilknyttede firmaer forsikret mod skader?",
        a: "Alle virksomheder skal dokumentere en aktiv erhvervsansvarsforsikring, før de kan blive aktive på Renbud. Om en konkret skade er dækket, afhænger af policens vilkår og undtagelser.",
      },
    ];
  } else {
    serviceFaqs = [
      {
        q: "Hvordan fungerer betalingen for opgaven?",
        a: "Betaling og fakturering aftales direkte med det valgte rengøringsfirma. Sørg for, at pris, betalingsform og eventuelle tillæg fremgår af tilbuddet.",
      },
      {
        q: "Skal jeg sørge for noget før firmaets ankomst?",
        a: "Fjern løse genstande fra arbejdsområdet, og oplys på forhånd om adgang, parkering samt behov for vand eller strøm.",
      },
    ];
  }

  return [...baseFaqs, ...serviceFaqs];
}
