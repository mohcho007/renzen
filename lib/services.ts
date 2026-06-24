export interface PricingRow {
  label: string;
  price: string;
}

export interface Service {
  slug: string;
  id: string; // Maps to internal service ID in the main app
  tab: "private" | "company" | "community" | "outdoor"; // Maps to type query param
  name: string;
  headline: string;
  description: string;
  checklist: string[];
  pricingTable: PricingRow[]; // Custom pricing rows for each service
}

export function getServiceNameInSentence(
  service: Pick<Service, "name">,
): string {
  return service.name.startsWith("Airbnb")
    ? service.name
    : service.name.toLowerCase();
}

export const SERVICES: Record<string, Service> = {
  // --- PRIVATE (B2C) SERVICES ---
  "privat-rengoering": {
    slug: "privat-rengoering",
    id: "regular_cleaning",
    tab: "private",
    name: "Privat rengøring",
    headline: "Privat rengøringshjælp",
    description: "Få mere tid i hverdagen med professionel og pålidelig privat rengøringshjælp, der er tilpasset din bolig og dine ønsker.",
    checklist: [
      "Erfarne og CVR verificerede rengøringsfirmaer",
      "Skræddersyede rengøringsplaner efter dine ønsker",
      "100% uforpligtende prissammenligning",
      "Sikkerhed og tryghed i fokus under hele processen"
    ],
    pricingTable: [
      { label: "Lille lejlighed (under 80 m²)", price: "Fra 450 kr. pr. gang" },
      { label: "Mellem bolig (80 - 140 m²)", price: "Fra 750 kr. pr. gang" },
      { label: "Stor bolig (over 140 m²)", price: "Fra 1.150 kr. pr. gang" },
      { label: "Standard timepris (inkl. moms)", price: "Fra 280 kr. pr. time" }
    ]
  },
  "airbnb-rengoering": {
    slug: "airbnb-rengoering",
    id: "regular_cleaning",
    tab: "private",
    name: "Airbnb rengøring",
    headline: "Klargøring mellem Airbnb-gæster",
    description: "Få tilbud på stabil rengøring og klargøring af ferieboliger mellem check-out og næste check-in, tilpasset boligen og din udlejningsplan.",
    checklist: [
      "Rengøring af køkken, badeværelse, gulve og berøringsflader",
      "Skift af sengetøj og håndklæder efter nærmere aftale",
      "Tømning af affald og et præsentabelt reset før næste gæst",
      "Mulighed for faste aftaler ved hyppige gæsteskift"
    ],
    pricingTable: [
      { label: "Feriebolig op til 70 m²", price: "Fra 750 kr. pr. klargøring" },
      { label: "Feriebolig på 71 - 100 m²", price: "Fra 950 kr. pr. klargøring" },
      { label: "Feriebolig på 101 - 130 m²", price: "Fra 1.150 kr. pr. klargøring" },
      { label: "Større bolig eller særlige ønsker", price: "Efter tilbud" }
    ]
  },
  "flytterengoering": {
    slug: "flytterengoering",
    id: "move_out_cleaning",
    tab: "private",
    name: "Flytterengøring",
    headline: "Flytterengøring af bolig",
    description: "Slip for en tidskrævende del af flytningen. Få uforpligtende tilbud på grundig flytterengøring før aflevering.",
    checklist: [
      "Gør boligen klar til flyttesyn og aflevering",
      "Omfatter grundig rengøring af ovn, emhætte, paneler og toiletter",
      "Professionelt udstyr og miljøvenlige rengøringsmidler",
      "Hurtig og effektiv service udført til fast aftalt tid"
    ],
    pricingTable: [
      { label: "Lille lejlighed (under 50 m²)", price: "Fra 3.200 kr." },
      { label: "Mellem lejlighed/hus (50 - 100 m²)", price: "Fra 4.600 kr." },
      { label: "Stort hus (101 - 150 m²)", price: "Fra 6.000 kr." },
      { label: "Vejledende timepris (professionel)", price: "Fra 550 kr. pr. time" }
    ]
  },
  "hovedrengoering": {
    slug: "hovedrengoering",
    id: "main_cleaning",
    tab: "private",
    name: "Hovedrengøring",
    headline: "Gennemgribende hovedrengøring",
    description: "Trænger hjemmet til en ordentlig tur? Få uforpligtende tilbud på en komplet hovedrengøring fra professionelle rengøringsfirmaer.",
    checklist: [
      "Grundig rengøring helt i bund i alle kroge og hjørner",
      "Fokus på afkalkning, paneler, døre, skabe og hvidevarer",
      "Perfekt som forårsrengøring eller før et større arrangement",
      "Pålidelige fagfolk, der leverer et stærkt og skinnende resultat"
    ],
    pricingTable: [
      { label: "Lille bolig (under 80 m²)", price: "Fra 2.200 kr." },
      { label: "Mellem bolig (80 - 140 m²)", price: "Fra 3.600 kr." },
      { label: "Stor bolig (over 140 m²)", price: "Fra 5.200 kr." },
      { label: "Gennemsnitlig timepris (inkl. moms)", price: "Fra 450 kr. pr. time" }
    ]
  },
  "doedsborengoering": {
    slug: "doedsborengoering",
    id: "estate_cleaning",
    tab: "private",
    name: "Dødsborengøring",
    headline: "Respektfuld rengøring af dødsbo",
    description: "Få professionel hjælp til en diskret, omsorgsfuld og fuldstændig grundig rengøring af dødsboer under ordnede forhold.",
    checklist: [
      "Yderst respektfuld og omsorgsfuld håndtering af opgaven",
      "Mulighed for kombineret tømning og efterfølgende rengøring",
      "Grundig klargøring af boligen til overdragelse eller salg",
      "Fast uforpligtende pris uden skjulte gebyrer eller tillæg"
    ],
    pricingTable: [
      { label: "Lille dødsbo (under 80 m²)", price: "Fra 3.500 kr." },
      { label: "Mellem dødsbo (80 - 140 m²)", price: "Fra 5.500 kr." },
      { label: "Stort dødsbo (over 140 m²)", price: "Fra 8.000 kr." },
      { label: "Efter besigtigelse / tilbud", price: "Fast prisaftale" }
    ]
  },
  "vinduespudsning": {
    slug: "vinduespudsning",
    id: "window_cleaning",
    tab: "private",
    name: "Vinduespudsning",
    headline: "Professionel vinduespudsning",
    description: "Få krystalklare og stribefrie ruder med professionel vinduespudsning udført af erfarne og lokale vinduespudsere.",
    checklist: [
      "Stribefri pudsning af alle typer vinduer og glaspartier",
      "Mulighed for abonnementsaftaler (f.eks. hver 4. eller 8. uge)",
      "Både indvendig og udvendig polering samt aftørring af karme",
      "Hurtig og sikker udførelse med professionelt vaskeanlæg"
    ],
    pricingTable: [
      { label: "Standard lejlighed (kun udvendig)", price: "Fra 150 kr. pr. gang" },
      { label: "1-plans hus (indvendig & udvendig)", price: "Fra 295 kr. pr. gang" },
      { label: "2-plans villa (indvendig & udvendig)", price: "Fra 495 kr. pr. gang" },
      { label: "Vejledende timepris", price: "Fra 350 kr. pr. time" }
    ]
  },
  "taepperens": {
    slug: "taepperens",
    id: "other_cleaning",
    tab: "private",
    name: "Tæpperens",
    headline: "Professionel tæpperens i hjemmet",
    description: "Få renset dine gulvtæpper i dybden. Professionel damp- og tæpperens fjerner effektivt pletter, snavs, dårlig lugt og støvmider.",
    checklist: [
      "Dybdegående rensning med professionelle tæpperensemaskiner",
      "Fjerner effektivt genstridige pletter og ubehagelig lugt",
      "Miljøvenlige og allergivenlige rensevæsker beskytter tæppet",
      "Hurtig tørretid og flot genopfriskning af farver og fibre"
    ],
    pricingTable: [
      { label: "Rens af løst tæppe (pris pr. m²)", price: "Fra 65 kr. pr. m²" },
      { label: "Væg-til-væg tæppe (op til 50 m²)", price: "Fra 1.250 kr." },
      { label: "Væg-til-væg tæppe (51 - 120 m²)", price: "Fra 2.200 kr." },
      { label: "Opstarts- og mindstepris pr. opgave", price: "Fra 950 kr." }
    ]
  },
  "anden-rengoering": {
    slug: "anden-rengoering",
    id: "other_cleaning",
    tab: "private",
    name: "Anden rengøring",
    headline: "Specialrengøring efter behov",
    description: "Har du en rengøringsopgave, der falder uden for de almindelige kategorier? Indhent uforpligtende tilbud på din specialopgave her.",
    checklist: [
      "Fleksibel hjælp til alle typer rengøringsopgaver",
      "Mulighed for periodisk grovrengøring eller enkeltstående opgaver",
      "Rådgivning og skræddersyet løsning tilpasset din bolig",
      "CVR registrerede og forsikrede firmaer sikrer din tryghed"
    ],
    pricingTable: [
      { label: "Mindre specialopgave", price: "Fra 950 kr." },
      { label: "Større rengøringsopgave", price: "Efter tilbud" },
      { label: "Timepris for specialopgaver", price: "Fra 350 kr. pr. time" },
      { label: "Besigtigelse & prisfastsættelse", price: "Gratis og uforpligtende" }
    ]
  },

  // --- COMPANY (B2B) SERVICES ---
  "kontorrengoering": {
    slug: "kontorrengoering",
    id: "regular_cleaning",
    tab: "company",
    name: "Kontorrengøring",
    headline: "Fast kontorrengøring til arbejdspladser",
    description: "Skab et sundt arbejdsmiljø og et flot ansigt udadtil med en professionel og fleksibel kontorrengøringsaftale.",
    checklist: [
      "Fleksible arbejdstider tilpasset jeres kontors åbningstider",
      "Understøtter et rent og præsentabelt arbejdsmiljø",
      "Altid CVR registrerede og forsikrede rengøringsfirmaer",
      "Fast kontaktperson og skræddersyede rengøringsplaner"
    ],
    pricingTable: [
      { label: "Lille kontor (under 100 m²)", price: "Fra 1.850 kr./md. ex moms" },
      { label: "Mellem kontor (100 - 300 m²)", price: "Fra 3.200 kr./md. ex moms" },
      { label: "Stort kontordomicil (300+ m²)", price: "Efter tilbud" },
      { label: "Erhvervs-timepris (erfarne firmaer)", price: "Fra 250 kr. pr. time ex moms" }
    ]
  },
  "erhvervsrengoering": {
    slug: "erhvervsrengoering",
    id: "regular_cleaning",
    tab: "company",
    name: "Erhvervsrengøring",
    headline: "Komplet erhvervsrengøring",
    description: "Få uforpligtende tilbud på erhvervsrengøring til din virksomhed. Vi dækker alle typer erhvervslokaler, kontorer, klinikker og lager.",
    checklist: [
      "Professionel rengøring målrettet B2B virksomheder",
      "Fleksible aftaler: dagligt, ugentligt eller efter behov",
      "Mulighed for miljøvenlige midler og dokumenterede arbejdsgange",
      "Sikret tryghed med CVR verificerede og forsikrede rengøringshold"
    ],
    pricingTable: [
      { label: "Mindre erhvervslokale (under 100 m²)", price: "Fra 1.850 kr./md. ex moms" },
      { label: "Mellem erhvervslokale (100 - 300 m²)", price: "Fra 3.200 kr./md. ex moms" },
      { label: "Stort erhvervsareal / domicil", price: "Efter tilbud" },
      { label: "Gennemsnitlig erhvervstimepris", price: "Fra 250 kr. pr. time ex moms" }
    ]
  },
  "klinikrengoering": {
    slug: "klinikrengoering",
    id: "regular_cleaning",
    tab: "company",
    name: "Klinikrengøring",
    headline: "Professionel klinikrengøring",
    description: "Hygiejne og sanitære forhold i topklasse. Få tilbud på klinikrengøring af lægepraksisser, tandlægeklinikker og behandlerrum.",
    checklist: [
      "Overholder alle gældende retningslinjer for klinisk hygiejne",
      "Fokus på kritisk desinfektion af berøringsflader og udstyr",
      "Specielt uddannet personale med kendskab til klinikstandarder",
      "Skræddersyet frekvens og tidsplan uden at forstyrre patienter"
    ],
    pricingTable: [
      { label: "Lille klinik (under 80 m²)", price: "Fra 2.450 kr./md. ex moms" },
      { label: "Mellem behandlerklinik (80 - 200 m²)", price: "Fra 4.800 kr./md. ex moms" },
      { label: "Større lægecenter eller specialklinik", price: "Efter tilbud" },
      { label: "Hygiejnecertificeret timepris", price: "Fra 320 kr. pr. time ex moms" }
    ]
  },
  "butiksrengoering": {
    slug: "butiksrengoering",
    id: "regular_cleaning",
    tab: "company",
    name: "Butiksrengøring",
    headline: "Butiksrengøring der indbyder kunder",
    description: "Fremstå knivskarpt over for dine kunder. Få uforpligtende tilbud på stabil butiksrengøring og detailrengøring.",
    checklist: [
      "Aftørring af udstillinger, diske, spejle og indgangspartier",
      "Grundig vask af butiksgulve med egnede maskiner",
      "Udføres uden for åbningstid (tidlig morgen eller sen aften)",
      "Pålidelige og præsentable rengøringsassistenter"
    ],
    pricingTable: [
      { label: "Mindre detailbutik (under 150 m²)", price: "Fra 2.200 kr./md. ex moms" },
      { label: "Mellem showroom / butik (150 - 400 m²)", price: "Fra 4.500 kr./md. ex moms" },
      { label: "Stort storcenter / varehus", price: "Efter tilbud" },
      { label: "Timepris (aften- og natrengøring)", price: "Fra 270 kr. pr. time ex moms" }
    ]
  },
  "institutionsrengoering": {
    slug: "institutionsrengoering",
    id: "regular_cleaning",
    tab: "company",
    name: "Institutionsrengøring",
    headline: "Professionel institutionsrengøring",
    description: "Rengøring af skoler, daginstitutioner, vuggestuer og børnehaver med højt fokus på hygiejne og sundt indeklima.",
    checklist: [
      "Forebygger smittespredning blandt børn og personale",
      "Dybdegående rengøring af legeområder, toiletter og køkkener",
      "Mulighed for skånsomme og miljømærkede rengøringsmidler",
      "Krav til relevante attester kan aftales med leverandøren"
    ],
    pricingTable: [
      { label: "Lille institution (under 200 m²)", price: "Fra 4.500 kr./md. ex moms" },
      { label: "Mellem vuggestue/børnehave", price: "Fra 8.900 kr./md. ex moms" },
      { label: "Stor skole / uddannelsescenter", price: "Efter tilbud" },
      { label: "Standard timepris (erhverv)", price: "Fra 260 kr. pr. time ex moms" }
    ]
  },
  "byggerengoering": {
    slug: "byggerengoering",
    id: "construction_cleaning",
    tab: "company",
    name: "Byggerengøring",
    headline: "Byggerengøring efter renovering og nybyggeri",
    description: "Få bugt med fint byggestøv, fugerester, malingpletter og groft affald efter renovering eller nybyggeri.",
    checklist: [
      "Effektiv fjernelse af fint slibestøv fra alle vandrette flader",
      "Klargøring af boliger eller erhvervsbyggeri til indflytning",
      "Professionelt udstyr, herunder støvsugere med HEPA-filtre",
      "Erfarne hold, der leverer et fejlfrit resultat til tiden"
    ],
    pricingTable: [
      { label: "Lille byggerengøring (renovering)", price: "Fra 2.500 kr. ex moms" },
      { label: "Mellem byggeplads / nybyg", price: "Fra 4.800 kr. ex moms" },
      { label: "Større entreprise (over 300 m²)", price: "Fra 9.500 kr. ex moms" },
      { label: "Timepris pr. rengøringsassistent", price: "Fra 350 kr. pr. time ex moms" }
    ]
  },
  "skurvognsrengoering": {
    slug: "skurvognsrengoering",
    id: "construction_cleaning",
    tab: "company",
    name: "Skurvognsrengøring",
    headline: "Rengøring af skurvogne på byggepladser",
    description: "Hold dine mandskabsvogne rene og sanitære. Stabil og grundig rengøring af skurvogne, kantinevogne og toiletpavilloner.",
    checklist: [
      "Sikrer ordentlige og lovmæssige forhold for jeres håndværkere",
      "Grundig vask af gulve, toiletter, bade og spiseborde",
      "Mulighed for fleksible intervaller (f.eks. 1-2 gange om ugen)",
      "Udføres af mobile rengøringshold med eget udstyr og midler"
    ],
    pricingTable: [
      { label: "Enkelt skurvogn (pris pr. gang)", price: "Fra 950 kr. ex moms" },
      { label: "Skurvognspark (3-5 vogne pr. gang)", price: "Fra 2.400 kr. ex moms" },
      { label: "Månedlig aftale (ugentlig rengøring)", price: "Fra 3.800 kr./md. ex moms" },
      { label: "Timepris for grov rengøring", price: "Fra 310 kr. pr. time ex moms" }
    ]
  },
  "flytterengoering-erhverv": {
    slug: "flytterengoering-erhverv",
    id: "move_out_cleaning",
    tab: "company",
    name: "Flytterengøring for erhverv",
    headline: "Slutrengøring ved erhvervsflytning",
    description: "Få professionel slutrengøring af fraflyttede kontorer eller butikslokaler før gennemgang og aflevering til udlejer.",
    checklist: [
      "Klargøring til afleverings- eller flyttesyn",
      "Komplet rengøring af køkkener, toiletter, paneler og vinduer",
      "Hurtig udrykning og effektiv udførelse til fast aftalt pris",
      "Forsikrede og CVR registrerede professionelle firmaer"
    ],
    pricingTable: [
      { label: "Lille erhvervslejemål (under 100 m²)", price: "Fra 4.500 kr. ex moms" },
      { label: "Mellem erhvervslejemål (100 - 300 m²)", price: "Fra 7.800 kr. ex moms" },
      { label: "Stort kontordomicil / lager (300+ m²)", price: "Efter tilbud" },
      { label: "Eventuel godkendelsesgaranti", price: "Aftales med firmaet" }
    ]
  },
  "facaderens": {
    slug: "facaderens",
    id: "facade_cleaning",
    tab: "company",
    name: "Facaderens",
    headline: "Professionel facaderens",
    description: "Fjern alger, sod, atmosfærisk snavs og graffiti. En korrekt udført facaderens forbedrer udtrykket og kan hjælpe med at beskytte overfladen.",
    checklist: [
      "Skånsom afrensning af mursten, beton, puds eller træfacader",
      "Efterfølgende imprægnering modvirker fugtindtrængning og alger",
      "Professionelt højtryksudstyr med præcis temperaturregulering",
      "Hurtig besigtigelse og uforpligtende fastprisaftale"
    ],
    pricingTable: [
      { label: "Lille facade / murværk (under 50 m²)", price: "Fra 2.800 kr. ex moms" },
      { label: "Mellem facade (50 - 150 m²)", price: "Fra 4.900 kr. ex moms" },
      { label: "Stor facade (over 150 m²)", price: "Fra 8.500 kr. ex moms" },
      { label: "Vejledende m²-pris for ren facaderens", price: "Fra 75 kr. pr. m² ex moms" }
    ]
  },
  "erhverv-anden-rengoering": {
    slug: "erhverv-anden-rengoering",
    id: "other_cleaning",
    tab: "company",
    name: "Anden erhvervsrengøring",
    headline: "Specialrengøring til erhverv",
    description: "Indhent uforpligtende priser på skræddersyede specialopgaver, periodiske dybderengøringer eller unikke erhvervsopgaver.",
    checklist: [
      "Alt inden for erhvervsservice og specialrengøring",
      "Skræddersyede aftaler og grundig behovsafklaring",
      "Erfarne fagfolk med det rette specialudstyr",
      "Gratis besigtigelse og fast uforpligtende prisaftale"
    ],
    pricingTable: [
      { label: "Mindre erhvervsspecialopgave", price: "Fra 1.500 kr. ex moms" },
      { label: "Større sanerings- eller renseopgave", price: "Efter tilbud" },
      { label: "Timepris for specialpersonale (erhverv)", price: "Fra 380 kr. pr. time ex moms" },
      { label: "Uforpligtende prisaftale efter besigtigelse", price: "Fast pris tilbydes" }
    ]
  },
  "skadeservice": {
    slug: "skadeservice",
    id: "other_cleaning",
    tab: "company",
    name: "Skadeservice",
    headline: "Akut skadeservice & rengøring",
    description: "Hurtig og professionel hjælp til rengøring og udbedring efter vandskade, sodskade, brand, skybrud eller skimmel.",
    checklist: [
      "Akut udrykning og hurtig opsætning af affugtningsudstyr",
      "Professionel rengøring og desinficering efter sod og brand",
      "Erfarne skadesaneringsteknikere tilknyttet",
      "Tæt samarbejde med forsikringsselskaber for nem sagshåndtering"
    ],
    pricingTable: [
      { label: "Akut udrykning og besigtigelse", price: "Fra 1.850 kr. ex moms" },
      { label: "Opsætning af affugter (døgnpris)", price: "Fra 350 kr. pr. døgn" },
      { label: "Saneringsrengøring (timepris)", price: "Fra 450 kr. pr. time ex moms" },
      { label: "Lugtsanering / ozonbehandling", price: "Efter tilbud" }
    ]
  },

  // --- COMMUNITY (Boligselskab/Ejendom) SERVICES ---
  "trappevask": {
    slug: "trappevask",
    id: "stairs_cleaning",
    tab: "community",
    name: "Trappevask",
    headline: "Trappevask til ejendomme",
    description: "Hold ejendommens opgange pæne og indbydende. Få uforpligtende tilbud på stabil trappevask til andelsboliger og ejerforeninger.",
    checklist: [
      "Stabil og regelmæssig trappevask udført af erfarne folk",
      "Inkluderer aftørring af gelændere, postkasser og paneler",
      "Brug af svanemærkede og skånsomme rengøringsmidler",
      "Tydelig dokumentation og tæt opfølgning på kvaliteten"
    ],
    pricingTable: [
      { label: "Mindre opgang (1 - 3 etager)", price: "Fra 450 kr. pr. vask" },
      { label: "Mellem opgang (4 - 5 etager)", price: "Fra 750 kr. pr. vask" },
      { label: "Stor ejendom / flere opgange", price: "Efter besigtigelse" },
      { label: "Månedlig abonnementsaftale", price: "Fra 1.200 kr./md. ex moms" }
    ]
  },
  "elevatorrengoering": {
    slug: "elevatorrengoering",
    id: "elevator_cleaning",
    tab: "community",
    name: "Elevatorrengøring",
    headline: "Professionel elevatorrengøring",
    description: "Hold ejendommens elevatorer rene og præsentable. Vi formidler tilbud på rens af stålpaneler, spejle, døre og elevatorgulve.",
    checklist: [
      "Hygiejnisk afspritning og desinfektion af knapper og paneler",
      "Specialrens og polering af stål- og glasoverflader",
      "Grundig støvsugning og vask af elevatorgulv",
      "Regelmæssig service tilknyttet ejendommens trappevask"
    ],
    pricingTable: [
      { label: "Enkelt elevator (ugentlig rengøring)", price: "Fra 350 kr. pr. gang" },
      { label: "Månedlig abonnementsaftale (1 elevator)", price: "Fra 1.200 kr./md. ex moms" },
      { label: "Flere elevatorer i ejendom (tilbud)", price: "Efter besigtigelse" },
      { label: "Akut desinfektion af elevator", price: "Fra 850 kr. ex moms" }
    ]
  },
  "ejendoms-facaderens": {
    slug: "ejendoms-facaderens",
    id: "facade_cleaning",
    tab: "community",
    name: "Facaderens for ejendomme",
    headline: "Facaderens til boligforeninger",
    description: "Fjern effektivt mos, alger, snavs og graffiti fra ejendommens facade, så murværket beskyttes og ejendommens værdi bevares.",
    checklist: [
      "Højtryksafrensning med tempereret vand tilpasset facadens type",
      "Algerens og imprægnering sikrer mod fremtidig grøn belægning",
      "Sikker udførelse med lifte og godkendt stilladsudstyr",
      "Miljøvenlig opsamling af spildevand, hvor påkrævet"
    ],
    pricingTable: [
      { label: "Lille boligblok facade (under 150 m²)", price: "Fra 4.900 kr. ex moms" },
      { label: "Mellem ejendomsfacade (150-400 m²)", price: "Fra 9.800 kr. ex moms" },
      { label: "Større boligforening / karré", price: "Efter tilbud" },
      { label: "Graffitibehandling og imprægnering", price: "Fra 95 kr. pr. m² ex moms" }
    ]
  },
  "altanrengoering": {
    slug: "altanrengoering",
    id: "balcony_cleaning",
    tab: "community",
    name: "Altanrengøring",
    headline: "Professionel altanrengøring for ejendomme",
    description: "Gør altanerne klar til foråret. Professionel højtryksrens og algebehandling af betonflader, træværk og glasværn på ejendommens altaner.",
    checklist: [
      "Effektiv fjernelse af alger, sod, blade og fugleklatter",
      "Skånsom og sikker rensning, der ikke skader underboens altan",
      "Rengøring af rækværk, skillevægge og glaspartier",
      "Stærke rabatter ved samlet bestilling til hele boligforeningen"
    ],
    pricingTable: [
      { label: "Enkelt altan (standard rens)", price: "Fra 650 kr." },
      { label: "Altaner i hel boligblok (pris pr. stk)", price: "Fra 290 kr. ex moms" },
      { label: "Dybdegående algebehandling af altaner", price: "Fra 450 kr. pr. altan" },
      { label: "Opstarts- og mindstepris pr. ejendom", price: "Fra 1.500 kr." }
    ]
  },
  "ejendoms-vinduespudsning": {
    slug: "ejendoms-vinduespudsning",
    id: "window_cleaning",
    tab: "community",
    name: "Vinduespudsning for ejendomme",
    headline: "Vinduespudsning til boligforeninger",
    description: "Få flotte stribefrie ruder i hele ejendommen med en skræddersyet aftale om vinduespolering til andelsboliger, ejerforeninger og erhvervsejendomme.",
    checklist: [
      "Polering af vinduer i opgange, kældre og fælleslokaler",
      "Mulighed for abonnementsaftale (f.eks. hver 4., 8. eller 12. uge)",
      "Sikker udførelse med vaskeanlæg (rentvandsanlæg op til 5. sal)",
      "Tilvalg af indvendig vinduespudsning i beboernes lejligheder"
    ],
    pricingTable: [
      { label: "Lille opgang (vinduer i fællesareal)", price: "Fra 450 kr. pr. polering" },
      { label: "Mellem ejendom (fællesarealer & opgange)", price: "Fra 950 kr. pr. polering" },
      { label: "Komplet ejendom inkl. lejligheder udvendig", price: "Efter tilbud" },
      { label: "Abonnementsaftale (f.eks. hver 8. uge)", price: "Fra 800 kr./gang ex moms" }
    ]
  },
  "ejendomsservice": {
    slug: "ejendomsservice",
    id: "other_cleaning",
    tab: "community",
    name: "Ejendomsservice",
    headline: "Komplet ejendomsservice",
    description: "Få professionel pasning af jeres ejendom, fællesarealer og grønne områder med en skræddersyet ejendomsserviceaftale.",
    checklist: [
      "Professionel pasning af ejendommen samt mindre reparationer",
      "Snerydning, saltning og pasning af udendørs fællesarealer",
      "Erfarne ejendomsfunktionærer og viceværter tilknyttet",
      "Skræddersyede serviceaftaler, der matcher jeres forenings budget"
    ],
    pricingTable: [
      { label: "Lille forening (under 10 boliger)", price: "Fra 2.200 kr./md. ex moms" },
      { label: "Mellem ejer- eller andelsforening", price: "Fra 4.500 kr./md. ex moms" },
      { label: "Stor forening (flere gårde/bygninger)", price: "Fra 8.500 kr./md. ex moms" },
      { label: "Timepris for viceværtopgaver", price: "Fra 380 kr. pr. time ex moms" }
    ]
  },

  // --- OUTDOOR SERVICES ---
  "fliserens": {
    slug: "fliserens",
    id: "tile_cleaning",
    tab: "outdoor",
    name: "Fliserens",
    headline: "Fliserens & imprægnering",
    description: "Giv dine fliser nyt liv. Professionel fliserens fjerner effektivt alger, flisepest og snavs, så din terrasse fremstår som ny.",
    checklist: [
      "Fjerner effektivt mos, alger, flisepest og sorte pletter",
      "Efterfølgende imprægnering sikrer fliserne mod fremtidige angreb",
      "Miljøgodkendte midler og professionelt renseudstyr",
      "Giver din terrasse, indkørsel eller gangsti et flot løft"
    ],
    pricingTable: [
      { label: "Basis fliserens (pris pr. m²)", price: "Fra 29 kr. pr. m²" },
      { label: "Fliserens + Imprægnering (pris pr. m²)", price: "Fra 49 kr. pr. m²" },
      { label: "Komplet rens + Imprægnering + Fugesand", price: "Fra 69 kr. pr. m²" },
      { label: "Opstarts- og mindstepris pr. opgave", price: "Fra 1.200 kr." }
    ]
  },
  "algebehandling": {
    slug: "algebehandling",
    id: "algae_cleaning",
    tab: "outdoor",
    name: "Algebehandling",
    headline: "Algebehandling af tag & fliser",
    description: "Få behandlet grønne belægninger på udendørs overflader. Algebehandlingen virker gradvist og skal tilpasses materialet.",
    checklist: [
      "Målrettet behandling af algebelægninger på egnede overflader",
      "Kan begrænse ny vækst og fugtrelaterede belægninger",
      "Skånsom sprøjtning, der virker over de efterfølgende uger",
      "Miljøvenlig skumbehandling med biologisk nedbrydelige midler"
    ],
    pricingTable: [
      { label: "Algebehandling af tag (op til 150 m²)", price: "Fra 995 kr." },
      { label: "Algebehandling af tag (150 - 250 m²)", price: "Fra 1.495 kr." },
      { label: "Algebehandling af fliser / terrasse", price: "Fra 850 kr." },
      { label: "Mindstepris pr. udrykning", price: "Fra 850 kr." }
    ]
  },
  "fliserens-og-algebehandling": {
    slug: "fliserens-og-algebehandling",
    id: "tile_and_algae",
    tab: "outdoor",
    name: "Fliserens & algebehandling",
    headline: "Komplet fliserens & algebehandling",
    description: "Giv dine flisearealer den ultimative tur. Få renset fliserne helt i bund og giv dem en forebyggende algebehandling og imprægnering.",
    checklist: [
      "Komplet afrensning af mos, flisepest og mørke belægninger",
      "Professionel kemisk algebehandling for et langtidsholdbart resultat",
      "Dybdegående imprægnering beskytter mod fugt og nye alger",
      "Nyt ukrudtshæmmende fugesand fejes ud over fliserne til sidst"
    ],
    pricingTable: [
      { label: "Fliserens + Imprægnering (pris pr. m²)", price: "Fra 49 kr. pr. m²" },
      { label: "Komplet rens + Imprægnering + Fugesand", price: "Fra 69 kr. pr. m²" },
      { label: "Algerens alene (pris pr. m²)", price: "Fra 15 kr. pr. m²" },
      { label: "Opstarts- og mindstepris pr. opgave", price: "Fra 1.200 kr." }
    ]
  },
  "tagrenderens": {
    slug: "tagrenderens",
    id: "gutter_cleaning",
    tab: "outdoor",
    name: "Tagrenderens",
    headline: "Professionel tagrenderens",
    description: "Undgå stoppede tagrender og dyre fugtskader på dit hus. Få hurtig, sikker og effektiv tagrenderens af lokale fagfolk.",
    checklist: [
      "Fuldstændig tømning af tagrender for blade, mos og skidt",
      "Visuel kontrol af nedløbsrør for at sikre frit vandgennemløb",
      "Brug af tagrendestøvsugere sikrer hurtigt arbejde uden stiger",
      "Konkurrencedygtige priser og professionel udførelse"
    ],
    pricingTable: [
      { label: "1-plans hus (op til 30 meter)", price: "Fra 795 kr." },
      { label: "2-plans hus (op til 30 meter)", price: "Fra 1.195 kr." },
      { label: "Større ejendom (pris pr. løbende meter)", price: "Fra 35 kr. pr. meter" },
      { label: "Opstarts- og mindstepris pr. opgave", price: "Fra 795 kr." }
    ]
  },
  "tagrens": {
    slug: "tagrens",
    id: "roof_cleaning",
    tab: "outdoor",
    name: "Tagrens",
    headline: "Tagrens med algebehandling",
    description: "Få vurderet behovet for skånsom tagrens og algebehandling. Metode og udstyr skal altid tilpasses tagets materiale og stand.",
    checklist: [
      "Fjerner skadeligt mos og grimme algebelægninger på tagsten",
      "Modvirker frostsprængninger og forlænger tagets levetid",
      "Miljøgodkendte og skånsomme midler sprøjtes på taget",
      "Fast uforpligtende tilbud baseret på tagets hældning og størrelse"
    ],
    pricingTable: [
      { label: "Tagrens og algebehandling (under 150 m²)", price: "Fra 1.450 kr." },
      { label: "Tagrens og algebehandling (150-250 m²)", price: "Fra 2.250 kr." },
      { label: "Imprægnering efter tagrens (pris pr. m²)", price: "Fra 85 kr. pr. m²" },
      { label: "Mindstepris pr. tagbehandling", price: "Fra 1.450 kr." }
    ]
  },

  // --- MIXED OUTDOOR/PRIVATE NICHE SERVICES (FALLING BACK TO B2C 'other_cleaning') ---
  "havearbejde": {
    slug: "havearbejde",
    id: "other_cleaning",
    tab: "private",
    name: "Havearbejde",
    headline: "Havearbejde & grøn vedligeholdelse",
    description: "Få professionel hjælp til haven. Indhent uforpligtende tilbud på græsslåning, hækklipning, lugning og generel havepleje.",
    checklist: [
      "Professionel havehjælp tilpasset dine ønsker og behov",
      "Faste aftaler eller enkeltstående haveopgaver",
      "Mulighed for servicefradrag (boligjobordningen) på havepleje",
      "Erfarne og lokale gartnere og havefolk"
    ],
    pricingTable: [
      { label: "Græsslåning & kantklipning", price: "Fra 350 kr. pr. gang" },
      { label: "Hækklipning (pris pr. løbende meter)", price: "Fra 45 kr. pr. meter" },
      { label: "Havepleje og lugning (timepris)", price: "Fra 345 kr. pr. time" },
      { label: "Mindstepris for havehjælp", price: "Fra 600 kr." }
    ]
  },
  "snerydning": {
    slug: "snerydning",
    id: "other_cleaning",
    tab: "company",
    name: "Snerydning",
    headline: "Snerydning & saltning",
    description: "Undgå glatte fortove, indkørsler og p-pladser. Pålidelig snerydning og saltning for private, virksomheder og boligforeninger.",
    checklist: [
      "Døgnberedskab sikrer rydning før arbejdsdagens start",
      "Saltning modvirker glat føre og minimerer risiko for uheld",
      "Overholder gældende kommunale regler om glatførebekæmpelse",
      "Fast sæsonabonnement eller betaling pr. udkald efter aftale"
    ],
    pricingTable: [
      { label: "Snerydning & saltning af fortov (villa)", price: "Fra 250 kr. pr. gang" },
      { label: "Udrykning mindre p-plads / erhverv", price: "Fra 750 kr. pr. gang" },
      { label: "Fast vintersæson-beredskab", price: "Fra 2.200 kr./sæson" },
      { label: "Timepris (nat- og weekendudrykning)", price: "Fra 480 kr. pr. time ex moms" }
    ]
  },
  "solcellerens": {
    slug: "solcellerens",
    id: "window_cleaning",
    tab: "private",
    name: "Solcellerens",
    headline: "Skånsom rengøring af solceller",
    description: "Få maksimalt udbytte af dine solceller med professionel afvaskning af snavs, støv, sod og alger med kalkfrit ultra-rentvandsudstyr.",
    checklist: [
      "Kan hjælpe med at bevare panelernes udbytte ved synlig tilsmudsning",
      "Brug af specialudstyr uden kemikalier skåner panelerne og miljøet",
      "Fjerner fastgroet snavs, pollen, sodpartikler og fugleklatter",
      "Hurtig og sikker udførelse fra jorden med teleskopstænger"
    ],
    pricingTable: [
      { label: "Solcellerens (op til 15 paneler)", price: "Fra 695 kr." },
      { label: "Solcellerens (16 - 30 paneler)", price: "Fra 1.095 kr." },
      { label: "Solcellerens (over 30 paneler)", price: "Fra 35 kr. pr. panel" },
      { label: "Opstarts- og mindstepris pr. opgave", price: "Fra 695 kr." }
    ]
  }
};
