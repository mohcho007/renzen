export interface SeededReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

// Seeded pseudo-random number generator (Mulberry32-like)
function createSeededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h = h ^ h >>> 16) >>> 0) / 4294967296;
  };
}

// Map technical service names to natural language expressions a customer would use
const NATURAL_SERVICES: Record<string, string[]> = {
  "privat-rengoering": ["privatrengøring", "rengøringshjælp", "almindelig rengøring", "ugentlig rengøring"],
  "airbnb-rengoering": ["Airbnb rengøring", "klargøring mellem gæster", "rengøring af feriebolig", "rengøring ved gæsteskifte"],
  "flytterengoering": ["flytterengøring", "rengøring ved flytning", "slutrengøring efter fraflytning", "flytte-rengøring"],
  "hovedrengoering": ["hovedrengøring", "bundrengøring", "grovrengøring", "rengøring helt i bund"],
  "doedsborengoering": ["dødsbo rengøring", "rengøring af dødsbo", "tømning og rengøring af boet"],
  "vinduespudsning": ["vinduespudsning", "vinduespolering", "pudsning af vinduer", "pudsning af ruder"],
  "taepperens": ["tæpperens", "rens af tæpper", "tæpperensning"],
  "anden-rengoering": ["rengøringshjælp", "specialrengøring", "grovrengøring"],
  "kontorrengoering": ["kontorrengøring", "rengøring af kontoret", "firma rengøring"],
  "erhvervsrengoering": ["erhvervsrengøring", "rengøring af firmaet", "kontorrengøring", "rengøring af vores lokaler"],
  "klinikrengoering": ["klinikrengøring", "rengøring af klinikken", "klinik rengøring"],
  "butiksrengoering": ["butiksrengøring", "rengøring af butikken", "butiks-rengøring"],
  "institutionsrengoering": ["institutionsrengøring", "rengøring af lokalerne", "skolerengøring"],
  "byggerengoering": ["byggerengøring", "rengøring efter håndværkere", "håndværkerrengøring"],
  "skurvognsrengoering": ["skurvognsrengøring", "rengøring af mandskabsvogne", "rengøring af skurvogne"],
  "flytterengoering-erhverv": ["flytterengøring til erhverv", "slutrengøring af lokalerne", "slutrengøring ved fraflytning"],
  "facaderens": ["facaderens", "rens af facaden", "facaderensning"],
  "erhverv-anden-rengoering": ["erhvervsrengøring", "rengøringshjælp", "speciel erhvervsrengøring"],
  "skadeservice": ["skadeservice", "rengøring efter vandskade", "skadesanering"],
  "trappevask": ["trappevask", "trapperengøring", "vask af opgange"],
  "elevatorrengoering": ["elevatorrengøring", "rens af elevator", "elevator rengøring"],
  "ejendoms-facaderens": ["facaderens af ejendommen", "rens af facaden", "facaderensning"],
  "altanrengoering": ["altanrengøring", "rens af altaner", "altan-rens"],
  "ejendoms-vinduespudsning": ["vinduespudsning i foreningen", "vinduespolering", "vinduespudsning"],
  "ejendomsservice": ["ejendomsservice", "viceværtopgaver", "ejendomsdrift"],
  "fliserens": ["fliserens", "rens af fliser", "fliserensning", "afrensning af terrassen"],
  "algebehandling": ["algebehandling", "algerens", "tagbehandling"],
  "fliserens-og-algebehandling": ["fliserens og algerens", "fliserens", "algebehandling af fliser"],
  "tagrenderens": ["tagrenderens", "rens af tagrender", "tagrendetømning"],
  "tagrens": ["tagrens", "algebehandling af tag", "tagrensning"],
  "havearbejde": ["havearbejde", "havehjælp", "hækklipning", "græsslåning og lugning"],
  "snerydning": ["snerydning", "snerydning og saltning", "snerydder"],
  "solcellerens": ["solcellerens", "vask af solceller", "solcellerengøring"]
};

// Map grammatical/prepositional city names so they read naturally in Danish sentences
function getNaturalCityName(cityName: string): string {
  if (cityName === "Vesthimmerlands") return "Vesthimmerland";
  if (cityName === "Nordfyns") return "Nordfyn";
  return cityName;
}

const FIRST_NAMES = [
  "Morten", "Sofie", "Thomas", "Camilla", "Jesper", "Mette", "Lars", "Freja", 
  "Christian", "Christina", "Mikkel", "Anette", "Peter", "Louise", "Henrik", 
  "Kirsten", "Anders", "Julie", "Søren", "Helle", "Jens", "Karen", "Jonas", "Signe"
];

const LAST_INITIALS = [
  "S.", "L.", "B.", "M.", "H.", "P.", "K.", "V.", "T.", "F.", "N.", "D.", "G.", "O.", "R.", "A.", "E.", "C.", "I."
];

// Spintax database for reviews. Focuses on realistic human details, conversational tone, and minor flaws.
const REVIEW_SLOTS = [
  // Slot 1: General satisfaction, speed, and real-life context
  {
    intros: [
      "Stod og skulle bruge noget hurtig [service] i [city]. Det gik sgu over al forventning.",
      "Det var mega nemt at hente tilbud på [service] herinde.",
      "Efter vi flyttede til [city], har det været svært at finde en god aftale på [service]. Renbud løste det hurtigt.",
      "Rigtig fin service til at sammenligne priser på [service] i [city] og omegn."
    ],
    processes: [
      " Lagde opgaven op på et par minutter, og fik hurtigt svar fra et par lokale firmaer.",
      " Siden er nem at bruge. Der gik ikke lang tid før de første priser tikkede ind.",
      " Indtastede detaljerne og fik 3 uforpligtende priser direkte i indbakken.",
      " Kommunikationen kørte fint, selvom det ene firma lige var 10 minutter forsinket – men de ringede i forvejen, så helt ok."
    ],
    outcomes: [
      " Rengøringen var helt i top, og fyren der kom var super flink og tog skoene af.",
      " Opgaven blev løst præcis som aftalt. Absolut intet at klage over.",
      " Meget grundigt arbejde. Der var en lille plet de overså på en liste, men det fiksede de med det samme uden bøvl.",
      " Dejligt med ordnede forhold og en god, fair pris på arbejdet. Kan varmt anbefales."
    ]
  },
  // Slot 2: Price transparency and customer savings/veracity
  {
    intros: [
      "Var lidt skeptisk over prisen for [service] i [city] til at starte med.",
      "Kan varmt anbefale at bruge denne portal til [service].",
      "Det er utrolig rart at man kan sammenligne priser så let uden at skulle ringe rundt selv.",
      "Har brugt Renbud et par gange nu til [service] i [city] og er godt tilfreds."
    ],
    processes: [
      " De priser jeg fik, var noget skarpere end dem, jeg selv havde fundet hos de store firmaer.",
      " Dejligt nemt at man kan se andres erfaringer med firmaerne inden man vælger.",
      " Svarerne kom hurtigt, og der var heldigvis ingen irriterende skjulte gebyrer eller tillæg bagefter.",
      " Forløbet var super enkelt, og tilbuddene var meget nemme at gennemskue."
    ],
    outcomes: [
      " Vi sparede en god skilling i forhold til det tilbud, vi fik fra vores normale firma.",
      " Firmaet vi valgte leverede super kvalitet. Alt var pænt og rent.",
      " Hurtig udrykning og et flot stykke arbejde. Meget professionelle folk.",
      " God dialog og resultatet var præcis som vi håbede. Fem stjerner herfra."
    ]
  },
  // Slot 3: Local trust and detail-oriented feedback
  {
    intros: [
      "Rigtig glad for at vi fandt et lokalt firma til [service] i [city].",
      "Havde brug for en ordentlig omgang [service], og det fik jeg virkelig her.",
      "Det fungerer bare super godt med at matche lokale leverandører.",
      "Enkel og ligetil måde at få klaret [service] på."
    ],
    processes: [
      " De lokale folk var hurtige til at svare og kom ud og kiggede på opgaven først.",
      " Rart at vide at alle firmaerne er tjekket for CVR og forsikring på forhånd.",
      " Det tog ikke mange klik at sende opgaven afsted, og dialogen bagefter var rigtig fin.",
      " Fik hurtigt kontakt med et par gode firmaer der dækker [city] området."
    ],
    outcomes: [
      " Opgaven blev udført hurtigt og effektivt til den aftalte pris. Super tilfreds.",
      " De var utrolig detaljeorienterede og kom ud i alle krogene. Rigtig god service.",
      " Det var nemt, uforpligtende og prisen passede perfekt til vores budget.",
      " Pålidelige folk, godt humør og flot rent bagefter. Kæmpe anbefaling."
    ]
  }
];

export function getSeededReviews(
  citySlug: string,
  cityName: string,
  postalCode: string,
  serviceSlug: string
): SeededReview[] {
  const reviews: SeededReview[] = [];
  
  // Determine natural naming conventions
  const naturalCity = getNaturalCityName(cityName);
  const serviceOptions = NATURAL_SERVICES[serviceSlug] || [serviceSlug];
  
  for (let slotIdx = 0; slotIdx < 3; slotIdx++) {
    // Generate a unique seed for this specific slot of this city and service
    const rand = createSeededRandom(`${citySlug}-${serviceSlug.toLowerCase()}-slot-${slotIdx}`);
    
    // Pick name
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastInitial = LAST_INITIALS[Math.floor(rand() * LAST_INITIALS.length)];
    const name = `${firstName} ${lastInitial}`;
    
    // Pick rating: mostly 5, occasionally 4
    const rating = rand() > 0.85 ? 4 : 5;
    
    // Pick dynamic service synonym
    const serviceName = serviceOptions[Math.floor(rand() * serviceOptions.length)];
    
    // Pick spintax parts
    const slot = REVIEW_SLOTS[slotIdx];
    const intro = slot.intros[Math.floor(rand() * slot.intros.length)];
    const process = slot.processes[Math.floor(rand() * slot.processes.length)];
    const outcome = slot.outcomes[Math.floor(rand() * slot.outcomes.length)];
    
    // Combine and replace tokens
    let text = `${intro}${process}${outcome}`;
    text = text.replace(/\[service\]/g, serviceName);
    text = text.replace(/\[city\]/g, naturalCity);
    text = text.replace(/\[postal\]/g, postalCode);
    
    // Pick a realistic date in the last few months (relative to 2026)
    const monthsAgo = Math.floor(rand() * 5);
    const daysAgo = Math.floor(rand() * 28) + 1;
    const months = [
      "januar", "februar", "marts", "april", "maj", 
      "juni", "juli", "august", "september", "oktober", "november", "december"
    ];
    const date = `${daysAgo}. ${months[monthsAgo]} 2026`;
    
    reviews.push({ name, rating, text, date });
  }
  
  return reviews;
}
