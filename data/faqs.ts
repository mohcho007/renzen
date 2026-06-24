export interface FAQItem {
  question: string;
  answer: string;
}

export const generalFAQs: FAQItem[] = [
  {
    question: 'Hvem er Renzen?',
    answer: 'Renzen er din professionelle rengøringsplatform. Vi matcher dig med godkendte Zenmestre i dit område — med fokus på høj kvalitet, tryghed og gennemsigtige priser. Du booker og betaler samlet gennem Renzen og får tilfredshedsgaranti.'
  },
  {
    question: 'Hvem er Zenmestrene?',
    answer: 'Zenmestrene er Renzens professionelle rengøringshjælp — godkendt gennem grundig screening, certificeret med løbende uddannelse og med ren straffeattest. Alle er verificerede partnere i Renzens netværk. Du booker én service gennem Renzen og får en pålidelig, punktlig og grundig Zenmester, der kan tilpasses dine behov.'
  },
  {
    question: 'Er Renzen forsikret?',
    answer: 'Ja, Renzen er fuldt forsikret med både ansvars- og indboforsikring. Det betyder, at du er dækket, hvis der sker uheld under rengøringen, og at du ikke skal bekymre dig om skader på dit inventar.'
  },
  {
    question: 'Hvordan fungerer servicefradraget?',
    answer: 'Rengøring i private hjem er fradragsberettiget under servicefradraget (Håndværkerfradraget) i Danmark. Du kan trække 26% af arbejdslønnen fra i skat. Vi sender dig en faktura, som du nemt kan indberette direkte på SKATs TastSelv.'
  },
  {
    question: 'Hvad skal jeg have til rådighed for min Zenmester?',
    answer: 'For at undgå krydskontaminering bruger Zenmesteren dine rengøringsmidler og -udstyr. Sørg for at have klar: universalrengøring, gulvpleje, glasrens, toiletrens, afkalkningsmidler, støvkost, støvsuger, moppe, gulvspand, rene klude, svampe og handsker. Mangler du noget, kan du kontakte os om en rengøringspakke mod et gebyr.'
  },
  {
    question: 'Kan jeg give min ZenMester specielle instruktioner?',
    answer: 'Ja, du kan altid give din Zenmester specielle instruktioner.'
  },
  {
    question: 'Hvordan betaler jeg?',
    answer: 'Betalingen foregår helt automatisk og sikkert via betalingskort efter hver udført rengøring. Vi trækker først pengene, når opgaven er udført, og du modtager en faktura med det samme på e-mail.'
  }
];

export const serviceFAQs: { [serviceSlug: string]: FAQItem[] } = {
  'rengoring': [
    {
      question: 'Hvad er inkluderet i en almindelig rengøring?',
      answer: 'Standard rengøring omfatter støvaftørring af alle vandrette overflader, støvsugning og gulvvask i alle rum, aftørring af køkkenfronter, rengøring af håndvask, toilet, spejl og bruseniche samt tømning af skraldespande.'
    },
    {
      question: 'Kan jeg bestille ekstra opgaver?',
      answer: 'Ja, du kan nemt tilføje ekstra ydelser såsom indvendig ovnrengøring, aftørring af køleskab, pudsning af vinduer eller vask af paneler under din booking.'
    }
  ],
  'privat-rengoring': [
    {
      question: 'Hvem kommer for at gøre rent hjemme hos mig?',
      answer: 'Det gør en af vores dygtige Zenmestre – godkendte, certificerede og med ren straffeattest. De er venlige, professionelle, punktlige og grundige, så du kan føle dig tryg ved at have dem i dit hjem.'
    },
    {
      question: 'Får jeg altid den samme Zenmester?',
      answer: 'Ja, ved faste aftaler (f.eks. ugentligt eller hver 2. uge) tilstræber vi altid at sende den samme faste Zenmester til dit hjem. Det skaber tryghed og sikrer, at din Zenmester kender dit hjem og dine præferencer.'
    },
    {
      question: 'Hvad hvis min faste Zenmester bliver syg eller har ferie?',
      answer: 'I tilfælde af ferie eller sygdom tilbyder vi dig en kompetent afløser, så du ikke skal undvære din rengøring. Du bestemmer selv, om du vil takke ja til afløseren eller springe rengøringen over.'
    },
    {
      question: 'Skal jeg være hjemme, mens der bliver gjort rent?',
      answer: 'Nej, det er helt op til dig. Ved første besøg er det en god idé at mødes med din Zenmester og gennemgå hjemmet. Derefter kan rengøringen ske, mens du er på arbejde, og kommunikation kan foregå via beskedsystemet.'
    },
    {
      question: 'Hvordan fungerer nøgleoverdragelse?',
      answer: 'Når du har booket, koordinerer I nøgleoverdragelse via beskedsystemet. Ved første møde viser du, hvor rengøringsmidlerne står, og I afstemmer forventninger. Du kan overlevere nøgler, så Zenmesteren kan komme uden at du er hjemme.'
    },
    {
      question: 'Hvad sker der, hvis der sker en skade under rengøringen?',
      answer: 'Renzen er fuldt forsikret med ansvars- og indboforsikring. Sker der uheld under rengøringen, er du dækket, og du behøver ikke bekymre dig om skader på dit inventar.'
    },
    {
      question: 'Har Zenmesteren selv rengøringsmidler og udstyr med?',
      answer: 'Som udgangspunkt bruger Zenmesteren dine rengøringsmidler og udstyr. Sørg for universalrengøringsmiddel, glasrens, toiletbørste, klude, mikrofiberklud, støvsuger og gulvspand. Kontakt os, hvis du mangler udstyr – vi kan levere en rengøringspakke mod et gebyr.'
    }
  ],
  'flytterengoring': [
    {
      question: 'Hvad inkluderer en flytterengøring?',
      answer: 'Flytterengøring dækker typisk alle værelser, badeværelser, køkken, garderober og fællesarealer. Vi støvsuger, vasker gulve, rengør vinduer (indvendigt), støver af og tager os af de små detaljer.'
    },
    {
      question: 'Hvor grundig er en flytterengøring?',
      answer: 'En flytterengøring er en dybdegående rengøring, hvor alt gås igennem. Det inkluderer indvendig og udvendig rengøring af alle skabe, skuffer, ovn, emhætte, afkalkning af fliser og armaturer, samt vask af døre, karme, paneler og stikkontakter.'
    },
    {
      question: 'Hvad skal jeg sørge for inden rengøringen?',
      answer: 'Fjern personlige ejendele og møbler fra de områder, der skal rengøres. Tøm køleskab og fryser, træk hvidevarer ud, fjern gardiner og persienner, og sørg for adgang, lys og strøm i alle rum.'
    },
    {
      question: 'Rengør I bag hvidevarer?',
      answer: 'Ja, hvis hvidevarerne er trukket ud og slukket. Vi flytter ikke tunge hvidevarer – som kunde skal du sørge for, at de er trukket frem, så vi kan rengøre bag dem.'
    },
    {
      question: 'Hvad koster flytterengøring?',
      answer: 'Prisen afhænger af boligens størrelse, omfanget af rengøringen og dine specifikke ønsker. Vi tilbyder gratis og uforpligtende tilbud.'
    },
    {
      question: 'Hvor lang tid tager flytterengøring?',
      answer: 'Tiden afhænger af boligens størrelse og omfanget af rengøringen. Vi giver et estimat, når du bestiller.'
    },
    {
      question: 'Kan I rengøre på en bestemt dato og tid?',
      answer: 'Vi forsøger at imødekomme alle ønsker om dato og tid. Bestil i god tid, da vi har et begrænset antal pladser.'
    },
    {
      question: 'Giver I garanti for godkendelse af flytterengøringen?',
      answer: 'Vi udfører flytterengøringen efter en grundig tjekliste. Skulle udlejer eller køber mod forventning have bemærkninger til rengøringen, udbedrer vi fejlene uden ekstra beregning inden for rammerne af vores tilfredshedsgaranti.'
    },
    {
      question: 'Forudsætninger for flytterengøring',
      answer: 'Boligen skal være tom for møbler og personlige ejendele, i almindelig rengjort stand, og uden omfattende nikotinbelægning (rygerhjem kræver særskilt aftale). Ekstra ydelser som udvendig vinduespudsning kan tilkøbes.'
    },
    {
      question: 'Har I nogen serviceundtagelser?',
      answer: 'Vi tilbyder generelt ikke havearbejde, skimmelfjernelse, udvendig vinduespudsning, altanrengøring, svær pletfjernelse, løft af tunge møbler, reparation af vægge, rengøring af lofter/lysekroner eller professionel rengøring af kraftigt beskidte køkkenapparater.'
    }
  ],
  'airbnb-rengoring': [
    {
      question: 'Hvad koster Airbnb rengøring?',
      answer: 'Prisen afhænger af boligens størrelse, antal værelser og badeværelser, behov for ekstra rengøring og frekvens. Kontakt os for et gratis tilbud.'
    },
    {
      question: 'Hvad tilbyder I i jeres Airbnb rengøringspakke?',
      answer: 'Standardpakken inkluderer rengøring af alle værelser, badeværelser, køkken og fællesarealer – støvsugning, gulvvask, vinduesrengøring og detaljer. Ekstra ydelser som ovnrengøring, køleskabsrengøring og vinduespudsning kan tilkøbes.'
    },
    {
      question: 'Hvem rengør min Airbnb?',
      answer: 'En af vores godkendte Zenmestre med ren straffeattest. De er omhyggelige, pålidelige og leverer et højt serviceniveau.'
    },
    {
      question: 'Hvordan koordineres Airbnb rengøring med gæsternes ankomst?',
      answer: 'Vi rengør i tidsrummet mellem check-out (typisk kl. 10/11) og check-in (typisk kl. 15/16). Du kan dele din bookingkalender med os, så vi automatisk planlægger rengøringen efter dine bookinger.'
    },
    {
      question: 'Hvordan koordinerer I rengøringen med mine gæster?',
      answer: 'Vi kan koordinere direkte med dine gæster eller med dig – f.eks. via besked for at aftale tidspunkt eller med din tilladelse til adgang.'
    },
    {
      question: 'Hvad gør I, hvis der er skader på min Airbnb?',
      answer: 'Vi underretter dig straks om eventuelle skader og kan hjælpe med indberetning til din Airbnb-forsikring.'
    },
    {
      question: 'Hvad er jeres afbestillingspolitik?',
      answer: 'Du kan afbestille op til 24 timer før den planlagte tid uden beregning. Ved afbestilling senere end 24 timer før opkræves 50% af prisen.'
    },
    {
      question: 'Kan I tilbyde rengøring på andre tidspunkter end dagtimerne?',
      answer: 'Ja, vi tilbyder rengøring på alle tidspunkter af dagen og ugen, så det passer dig og dine gæster.'
    },
    {
      question: 'Står I også for linned og håndklæder?',
      answer: 'Vi skifter gerne sengetøj og håndklæder og lægger det pænt frem til gæsterne, såfremt du har rent linned liggende klar i boligen. Vask af linned er ikke en standarddel af rengøringen, men kan aftales særskilt.'
    },
    {
      question: 'Hvordan kan jeg booke Airbnb-rengøring?',
      answer: 'Book online via hjemmesiden eller kontakt os via telefon eller e-mail.'
    }
  ],
  'erhvervsrengoring': [
    {
      question: 'Hvad inkluderer erhvervsrengøring?',
      answer: 'Erhvervsrengøring dækker typisk kontorer, butikker, klinikker, produktionsfaciliteter og andre erhvervsmæssige omgivelser. Vi støvsuger, vasker gulve, pudser spejle, støver af og tager os af de små detaljer.'
    },
    {
      question: 'Tilbyder I erhvervsrengøring uden for normal arbejdstid?',
      answer: 'Ja, vi kan udføre erhvervsrengøring tidligt om morgenen, om aftenen eller i weekenden, så vi ikke forstyrrer jeres medarbejdere eller kunder i løbet af arbejdsdagen.'
    },
    {
      question: 'Hvilke erhvervstyper gør I rent for?',
      answer: 'Vi udfører rengøring for kontorer, klinikker, butikker, mindre showrooms og liberale erhverv. Vi skræddersyr en aftale, der passer til jeres lokaler og frekvensbehov.'
    },
    {
      question: 'Hvor ofte skal vi have rengjort?',
      answer: 'Det afhænger af jeres behov. Vi tilbyder rengøring dagligt, ugentligt, månedligt eller på anden frekvens.'
    },
    {
      question: 'Hvad koster erhvervsrengøring?',
      answer: 'Prisen afhænger af virksomhedens størrelse, omfanget af rengøringen og jeres ønsker. Vores timepris for erhvervsrengøring er 350 kr. ex. moms. Vi tilbyder gratis og uforpligtende tilbud.'
    },
    {
      question: 'Hvad skal vi gøre inden rengøringen?',
      answer: 'Fjern personlige ejendele fra de områder, der skal rengøres, og sørg for adgang til alle områder.'
    },
    {
      question: 'Hvad tilbyder I af ekstra tjenester?',
      answer: 'Udover erhvervsrengøring tilbyder vi vinduespudsning, rengøring og vedligeholdelse af udendørsarealer og genopfyldning af service.'
    },
    {
      question: 'Hvem er jeres kunder?',
      answer: 'Vi har kunder blandt små og store virksomheder, offentlige institutioner og private organisationer.'
    },
    {
      question: 'Hvorfor skal vi vælge jer?',
      answer: 'Vi leverer professionel erhvervsrengøring via godkendte Zenmestre, med gyldige forsikringer, tilfredshedsgaranti og gratis uforpligtende besigtigelse. Kontakt os for et tilbud på erhvervsrengøring.'
    }
  ],
  'hovedrengoring': [
    {
      question: 'Hvad er forskellen på almindelig rengøring og hovedrengøring?',
      answer: 'En hovedrengøring er langt mere dybdegående end en almindelig ugentlig rengøring. Her afkalker vi fliser i dybden, aftørrer ovenpå høje skabe, vasker paneler, døre, karme og stikkontakter, samt rengør bag hårde hvidevarer, hvis de er trukket frem.'
    }
  ],
  'engangsrengoring': [
    {
      question: 'Er der binding på en engangsrengøring?',
      answer: 'Nej, overhovedet ikke. En engangsrengøring er en enkeltstående opgave uden abonnement eller løbende forpligtelser. Du betaler kun for den konkrete gang.'
    }
  ]
};

export function getFAQsForService(serviceSlug: string): FAQItem[] {
  const specific = serviceFAQs[serviceSlug] || [];
  return [...specific, ...generalFAQs];
}
