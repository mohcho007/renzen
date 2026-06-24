export interface CompanyRating {
  source: "Google" | "Trustpilot" | "Renbud";
  score: number;
  reviews: number;
  updatedLabel: string;
}

export interface DemoCompany {
  slug: string;
  name: string;
  initials: string;
  tagline: string;
  description: string;
  city: string;
  postalCode: string;
  address: string;
  cvr: string;
  founded: number;
  employees: string;
  companyType: string;
  websiteLabel: string;
  websiteUrl: string;
  phone: string;
  email: string;
  services: string[];
  coverageAreas: string[];
  highlights: string[];
  certifications: string[];
  ratings: CompanyRating[];
  responseTime: string;
  completedJobs: number;
  verified: boolean;
  claimed: boolean;
  sponsored: boolean;
  plan: "Basis" | "Verificeret" | "Vækst";
  accentClass: string;
}

export const DEMO_COMPANIES: DemoCompany[] = [
  {
    slug: "nordlys-rengoering",
    name: "Nordlys Rengøring ApS",
    initials: "NR",
    tagline: "Fast privat rengøring med den samme hjælper",
    description:
      "Fiktivt demonstrationsfirma med fokus på faste rengøringsaftaler for familier og mindre kontorer i Storkøbenhavn.",
    city: "Hvidovre",
    postalCode: "2650",
    address: "Demovej 12",
    cvr: "12345678",
    founded: 2018,
    employees: "6-10",
    companyType: "Anpartsselskab",
    websiteLabel: "nordlys-rengoering.example",
    websiteUrl: "https://example.com",
    phone: "+45 70 11 22 33",
    email: "kontakt@nordlys-rengoering.example",
    services: [
      "Privat rengøring",
      "Hovedrengøring",
      "Flytterengøring",
      "Kontorrengøring",
    ],
    coverageAreas: ["Hvidovre", "Rødovre", "Valby", "Brøndby"],
    highlights: [
      "Samme rengøringshold ved faste aftaler",
      "Miljøvenlige rengøringsmidler",
      "Mulighed for rengøring hver uge eller hver 14. dag",
    ],
    certifications: ["CVR-verificeret", "Erhvervsforsikring dokumenteret"],
    ratings: [
      { source: "Google", score: 4.9, reviews: 86, updatedLabel: "juni 2026" },
      { source: "Trustpilot", score: 4.6, reviews: 31, updatedLabel: "juni 2026" },
      { source: "Renbud", score: 4.8, reviews: 24, updatedLabel: "løbende" },
    ],
    responseTime: "Svar typisk inden for 35 min.",
    completedJobs: 142,
    verified: true,
    claimed: true,
    sponsored: true,
    plan: "Vækst",
    accentClass: "bg-[#dff6ed] text-[#2f6d59]",
  },
  {
    slug: "klar-kant-service",
    name: "Klar Kant Service",
    initials: "KK",
    tagline: "Vinduespudsning og ejendomsservice uden binding",
    description:
      "Fiktivt demonstrationsfirma, der hjælper private, butikker og boligforeninger med vinduespudsning og løbende ejendomsservice.",
    city: "København",
    postalCode: "2300",
    address: "Eksempelvej 8",
    cvr: "23456789",
    founded: 2020,
    employees: "3-5",
    companyType: "Enkeltmandsvirksomhed",
    websiteLabel: "klarkant.example",
    websiteUrl: "https://example.com",
    phone: "+45 71 20 30 40",
    email: "hej@klarkant.example",
    services: ["Vinduespudsning", "Trappevask", "Ejendomsservice"],
    coverageAreas: ["København", "Frederiksberg", "Tårnby", "Dragør"],
    highlights: [
      "Abonnement eller enkeltbesøg",
      "SMS før ankomst",
      "Opgaver for både private og foreninger",
    ],
    certifications: ["CVR-verificeret"],
    ratings: [
      { source: "Google", score: 4.8, reviews: 54, updatedLabel: "juni 2026" },
      { source: "Renbud", score: 4.9, reviews: 17, updatedLabel: "løbende" },
    ],
    responseTime: "Svar typisk inden for 1 time",
    completedJobs: 98,
    verified: true,
    claimed: true,
    sponsored: false,
    plan: "Verificeret",
    accentClass: "bg-sky-100 text-sky-700",
  },
  {
    slug: "roskilde-flyt-rent",
    name: "Roskilde Flyt & Rent",
    initials: "RF",
    tagline: "Flytterengøring klar til afleveringssyn",
    description:
      "Fiktivt demonstrationsfirma specialiseret i flytterengøring, hovedrengøring og rengøring efter håndværkere.",
    city: "Roskilde",
    postalCode: "4000",
    address: "Testgade 24",
    cvr: "34567890",
    founded: 2016,
    employees: "11-20",
    companyType: "Anpartsselskab",
    websiteLabel: "roskildeflytrent.example",
    websiteUrl: "https://example.com",
    phone: "+45 72 44 55 66",
    email: "tilbud@roskildeflytrent.example",
    services: ["Flytterengøring", "Hovedrengøring", "Byggerengøring"],
    coverageAreas: ["Roskilde", "Køge", "Lejre", "Greve"],
    highlights: [
      "Fast pris efter opgavebeskrivelse",
      "Mulighed for nøgleaflevering",
      "Dokumentation med billeder efter opgaven",
    ],
    certifications: ["CVR-verificeret", "Erhvervsforsikring dokumenteret"],
    ratings: [
      { source: "Google", score: 4.7, reviews: 112, updatedLabel: "juni 2026" },
      { source: "Trustpilot", score: 4.5, reviews: 48, updatedLabel: "juni 2026" },
      { source: "Renbud", score: 4.7, reviews: 36, updatedLabel: "løbende" },
    ],
    responseTime: "Svar typisk inden for 2 timer",
    completedJobs: 231,
    verified: true,
    claimed: true,
    sponsored: true,
    plan: "Vækst",
    accentClass: "bg-violet-100 text-violet-700",
  },
  {
    slug: "aarhus-kontorpleje",
    name: "Aarhus Kontorpleje",
    initials: "AK",
    tagline: "Stabil erhvervsrengøring efter lukketid",
    description:
      "Fiktivt demonstrationsfirma for kontorer, klinikker og mindre butikker med fleksible serviceplaner.",
    city: "Aarhus",
    postalCode: "8000",
    address: "Prøve Allé 5",
    cvr: "45678901",
    founded: 2012,
    employees: "21-50",
    companyType: "Anpartsselskab",
    websiteLabel: "aarhuskontorpleje.example",
    websiteUrl: "https://example.com",
    phone: "+45 73 10 20 30",
    email: "erhverv@aarhuskontorpleje.example",
    services: [
      "Erhvervsrengøring",
      "Kontorrengøring",
      "Klinikrengøring",
      "Trappevask",
    ],
    coverageAreas: ["Aarhus", "Risskov", "Viby J", "Højbjerg"],
    highlights: [
      "Fast kontaktperson",
      "Kvalitetskontrol hver måned",
      "Rengøring tidligt morgen eller efter lukketid",
    ],
    certifications: ["CVR-verificeret", "ISO 14001 oplyst"],
    ratings: [
      { source: "Google", score: 4.6, reviews: 39, updatedLabel: "juni 2026" },
      { source: "Renbud", score: 4.8, reviews: 29, updatedLabel: "løbende" },
    ],
    responseTime: "Svar typisk samme arbejdsdag",
    completedJobs: 184,
    verified: true,
    claimed: true,
    sponsored: false,
    plan: "Verificeret",
    accentClass: "bg-blue-100 text-blue-700",
  },
  {
    slug: "vestegnens-trappevask",
    name: "Vestegnens Trappevask",
    initials: "VT",
    tagline: "Trappevask til mindre boligforeninger",
    description:
      "Fiktiv basisprofil oprettet fra offentlige virksomhedsoplysninger. Virksomheden har endnu ikke gjort krav på profilen.",
    city: "Glostrup",
    postalCode: "2600",
    address: "Katalogvej 19",
    cvr: "56789012",
    founded: 2023,
    employees: "1-2",
    companyType: "Enkeltmandsvirksomhed",
    websiteLabel: "Ingen hjemmeside tilføjet",
    websiteUrl: "",
    phone: "Ikke offentliggjort",
    email: "Ikke offentliggjort",
    services: ["Trappevask", "Ejendomsservice"],
    coverageAreas: ["Glostrup"],
    highlights: ["Basisoplysninger fra CVR", "Profilen kan gøres krav på gratis"],
    certifications: ["Aktivt CVR"],
    ratings: [
      { source: "Google", score: 4.4, reviews: 9, updatedLabel: "maj 2026" },
    ],
    responseTime: "Ingen svartid registreret",
    completedJobs: 0,
    verified: false,
    claimed: false,
    sponsored: false,
    plan: "Basis",
    accentClass: "bg-stone-100 text-stone-600",
  },
  {
    slug: "fyns-friske-flader",
    name: "Fyns Friske Flader",
    initials: "FF",
    tagline: "Fliserens, facaderens og algebehandling",
    description:
      "Fiktivt demonstrationsfirma med sæsonbaserede udendørs opgaver for boligejere og mindre erhverv.",
    city: "Odense",
    postalCode: "5000",
    address: "Visualiseringsvej 3",
    cvr: "67890123",
    founded: 2019,
    employees: "3-5",
    companyType: "Anpartsselskab",
    websiteLabel: "fynsfriskeflader.example",
    websiteUrl: "https://example.com",
    phone: "+45 74 40 50 60",
    email: "booking@fynsfriskeflader.example",
    services: ["Fliserens", "Facaderens", "Algebehandling", "Tagrenderens"],
    coverageAreas: ["Odense", "Middelfart", "Nyborg", "Svendborg"],
    highlights: [
      "Gratis vurdering ud fra billeder",
      "Imprægnering som tilvalg",
      "Serviceaftaler til boligforeninger",
    ],
    certifications: ["CVR-verificeret", "Erhvervsforsikring dokumenteret"],
    ratings: [
      { source: "Google", score: 4.9, reviews: 43, updatedLabel: "juni 2026" },
      { source: "Trustpilot", score: 4.7, reviews: 18, updatedLabel: "juni 2026" },
    ],
    responseTime: "Svar typisk inden for 3 timer",
    completedJobs: 76,
    verified: true,
    claimed: true,
    sponsored: false,
    plan: "Verificeret",
    accentClass: "bg-lime-100 text-lime-700",
  },
];

export function getDemoCompany(slug: string) {
  return DEMO_COMPANIES.find((company) => company.slug === slug);
}

export function getCompanyPrimaryRating(company: DemoCompany) {
  return (
    company.ratings.find((rating) => rating.source === "Renbud") ??
    company.ratings.find((rating) => rating.source === "Google") ??
    company.ratings[0]
  );
}
