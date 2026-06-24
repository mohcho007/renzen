import type { BoligserviceSlug } from "@/lib/serviceInquiry";

export type DateFlexibility =
  | "fast"
  | "plus_minus_3"
  | "plus_minus_1_week"
  | "fleksibel";

export type PreferredTimeWindow =
  | "formiddag"
  | "eftermiddag"
  | "hele_dagen"
  | "fleksibel";

export const PREFERRED_TIME_WINDOW_OPTIONS = [
  { id: "formiddag" as const, label: "Formiddag", sub: "Ca. kl. 8–12" },
  { id: "eftermiddag" as const, label: "Eftermiddag", sub: "Ca. kl. 12–17" },
  { id: "hele_dagen" as const, label: "Hele dagen", sub: "Fleksibelt inden for dagen" },
  { id: "fleksibel" as const, label: "Fleksibel", sub: "Vi aftaler tid sammen" },
] as const;

export const DATE_FLEXIBILITY_OPTIONS = [
  { id: "fast" as const, label: "Fast dato", sub: "Kun den valgte dag" },
  {
    id: "plus_minus_3" as const,
    label: "± 3 dage",
    sub: "Lidt fleksibilitet omkring datoen",
  },
  {
    id: "plus_minus_1_week" as const,
    label: "± 1 uge",
    sub: "Vi finder den bedste dag i ugen",
  },
  {
    id: "fleksibel" as const,
    label: "Fleksibel",
    sub: "Vi aftaler tid sammen",
  },
] as const;

export type MalerJobType = "indvendig" | "udvendig" | "begge";
export type MalerScopeMode = "rooms" | "sqm";
export type MalerRoomCount = "1" | "2_3" | "4_plus";
export type MalerSqmRange = "under_50" | "50_100" | "100_150" | "150_plus";
export type MalerSurface = "vaegge" | "loft" | "doere" | "karme";
export type MalerCurrentStand = "nyt" | "normalt" | "slidt" | "ukendt";
export type MalerWallFinish = "maling" | "tapet" | "begge" | "ukendt";
export type MalerFurnitureHandling = "kunde" | "maler" | "dele";

export const MALER_JOB_TYPE_OPTIONS = [
  { id: "indvendig" as const, label: "Indvendig" },
  { id: "udvendig" as const, label: "Udvendig" },
  { id: "begge" as const, label: "Begge dele" },
] as const;

export const MALER_SCOPE_MODE_OPTIONS = [
  { id: "rooms" as const, label: "Antal rum" },
  { id: "sqm" as const, label: "Areal (m²)" },
] as const;

export const MALER_ROOM_COUNT_OPTIONS = [
  { id: "1" as const, label: "1 rum" },
  { id: "2_3" as const, label: "2–3 rum" },
  { id: "4_plus" as const, label: "4+ rum" },
] as const;

export const MALER_SQM_RANGE_OPTIONS = [
  { id: "under_50" as const, label: "Under 50 m²" },
  { id: "50_100" as const, label: "50–100 m²" },
  { id: "100_150" as const, label: "100–150 m²" },
  { id: "150_plus" as const, label: "150+ m²" },
] as const;

export const MALER_SURFACE_OPTIONS = [
  { id: "vaegge" as const, label: "Vægge" },
  { id: "loft" as const, label: "Loft" },
  { id: "doere" as const, label: "Døre" },
  { id: "karme" as const, label: "Karme" },
] as const;

export const MALER_STAND_OPTIONS = [
  { id: "nyt" as const, label: "Nyt / velholdt" },
  { id: "normalt" as const, label: "Normal stand" },
  { id: "slidt" as const, label: "Slidt / skader" },
  { id: "ukendt" as const, label: "Ved ikke" },
] as const;

export const MALER_FINISH_OPTIONS = [
  { id: "maling" as const, label: "Maling" },
  { id: "tapet" as const, label: "Tapet" },
  { id: "begge" as const, label: "Både maling og tapet" },
  { id: "ukendt" as const, label: "Ved ikke" },
] as const;

export const MALER_FURNITURE_OPTIONS = [
  {
    id: "kunde" as const,
    label: "Jeg flytter selv",
    sub: "Møbler stilles til side inden start",
  },
  {
    id: "maler" as const,
    label: "Maleren klarer det",
    sub: "Dækning og flytning inkluderes i tilbud",
  },
  {
    id: "dele" as const,
    label: "Vi deler opgaven",
    sub: "Aftales nærmere",
  },
] as const;

export type MalerarbejdeDetails = {
  jobType: MalerJobType;
  scopeMode: MalerScopeMode;
  roomCount?: MalerRoomCount;
  sqmRange?: MalerSqmRange;
  sqmManual?: number;
  surfaces: MalerSurface[];
  currentStand: MalerCurrentStand;
  wallFinish: MalerWallFinish;
  furnitureHandling: MalerFurnitureHandling;
  accessNotes: string;
  hasPhotos: boolean;
  notes: string;
  dateFlexibility: DateFlexibility;
};

export type BoligtypeFlyt = "lejlighed" | "raekkehus" | "villa" | "kontor";
export type Parkeringsafstand = "ved_doer" | "10_30m" | "30m_plus";
export type Moebleringsgrad = "taet" | "normalt" | "let";
export type Flyttekasser = "0" | "1_10" | "11_30" | "30_plus";
export type FlytningExtra = "piano" | "hvidevarer" | "montage";

export const BOLIGTYPE_FLYT_OPTIONS = [
  { id: "lejlighed" as const, label: "Lejlighed" },
  { id: "raekkehus" as const, label: "Rækkehus" },
  { id: "villa" as const, label: "Villa" },
  { id: "kontor" as const, label: "Kontor" },
] as const;

export const PARKERING_OPTIONS = [
  { id: "ved_doer" as const, label: "Lige ved dør" },
  { id: "10_30m" as const, label: "10–30 m" },
  { id: "30m_plus" as const, label: "30 m+" },
] as const;

export const MOEBLERINGSGRAD_OPTIONS = [
  { id: "taet" as const, label: "Tæt møbleret" },
  { id: "normalt" as const, label: "Normalt" },
  { id: "let" as const, label: "Let møbleret" },
] as const;

export const FLYTTEKASSER_OPTIONS = [
  { id: "0" as const, label: "0 kasser" },
  { id: "1_10" as const, label: "1–10" },
  { id: "11_30" as const, label: "11–30" },
  { id: "30_plus" as const, label: "30+" },
] as const;

export const FLYTNING_EXTRA_OPTIONS = [
  { id: "piano" as const, label: "Piano / tungt instrument" },
  { id: "hvidevarer" as const, label: "Hvidevarer" },
  { id: "montage" as const, label: "Montage / demontering" },
] as const;

export const FLOOR_OPTIONS = [0, 1, 2, 3] as const;

export type FlytningDetails = {
  toAddress: string;
  toZip: string;
  toCity: string;
  fromPropertyType: BoligtypeFlyt;
  toPropertyType: BoligtypeFlyt;
  fromFloor: number;
  toFloor: number;
  fromElevator: boolean | null;
  toElevator: boolean | null;
  parkingDistance: Parkeringsafstand;
  furnishingLevel: Moebleringsgrad;
  boxCount?: Flyttekasser;
  boxManual?: number;
  dateFlexibility: DateFlexibility;
  extras: FlytningExtra[];
  notes: string;
};

export type MonteringItem =
  | "lamper"
  | "hylder"
  | "gardiner"
  | "billeder"
  | "tv"
  | "andet";
export type UnitCountRange = "1_3" | "4_8" | "9_plus";
export type Vaegtype = "beton" | "gips" | "trae" | "ukendt";

export const MONTERING_ITEM_OPTIONS = [
  { id: "lamper" as const, label: "Lamper" },
  { id: "hylder" as const, label: "Hylder" },
  { id: "gardiner" as const, label: "Gardiner / gardinstænger" },
  { id: "billeder" as const, label: "Billeder / spejle" },
  { id: "tv" as const, label: "TV / skærm" },
  { id: "andet" as const, label: "Andet" },
] as const;

export const UNIT_COUNT_OPTIONS = [
  { id: "1_3" as const, label: "1–3 enheder" },
  { id: "4_8" as const, label: "4–8 enheder" },
  { id: "9_plus" as const, label: "9+ enheder" },
] as const;

export const VAEGTYPE_OPTIONS = [
  { id: "beton" as const, label: "Beton / mursten" },
  { id: "gips" as const, label: "Gips / gipsvæg" },
  { id: "trae" as const, label: "Træ" },
  { id: "ukendt" as const, label: "Ved ikke" },
] as const;

export type MonteringOphaengningDetails = {
  items: MonteringItem[];
  unitCount: UnitCountRange;
  wallType?: Vaegtype;
  notes: string;
};

export type Moebeltype = "ikea" | "skab" | "seng" | "reol" | "andet";

export const MOEBELTYPE_OPTIONS = [
  { id: "ikea" as const, label: "IKEA / flatpack" },
  { id: "skab" as const, label: "Skabe" },
  { id: "seng" as const, label: "Senge" },
  { id: "reol" as const, label: "Reoler" },
  { id: "andet" as const, label: "Andet" },
] as const;

export type MoebelmonteringDetails = {
  furnitureTypes: Moebeltype[];
  pieceCount: UnitCountRange;
  hasManual: boolean | null;
  notes: string;
};

export type AffaldType =
  | "storskrald"
  | "haveaffald"
  | "byggematerialer"
  | "blandet";
export type AffaldMaengde =
  | "lille_bil"
  | "varevogn"
  | "trailer"
  | "liftbil"
  | "container";
export type Hentested = "inde" | "ude";

export const AFFALD_TYPE_OPTIONS = [
  { id: "storskrald" as const, label: "Storskrald" },
  { id: "haveaffald" as const, label: "Haveaffald" },
  { id: "byggematerialer" as const, label: "Byggematerialer" },
  { id: "blandet" as const, label: "Blandet" },
] as const;

export const AFFALD_MAENGDE_OPTIONS = [
  { id: "lille_bil" as const, label: "Lille bil", sub: "Bagagerum / enkelte ting" },
  { id: "varevogn" as const, label: "Varevogn", sub: "Mellemstor mængde" },
  { id: "trailer" as const, label: "Trailer", sub: "Større mængde" },
  { id: "liftbil" as const, label: "Liftbil", sub: "Tungt/stort (fx møbler, hvidevarer)" },
  { id: "container" as const, label: "Container", sub: "Meget stor mængde" },
] as const;

export const HENTESTED_OPTIONS = [
  { id: "inde" as const, label: "Skal hentes inde" },
  { id: "ude" as const, label: "Står ude ved vejen" },
] as const;

export type BortkoerselAffaldDetails = {
  wasteType: AffaldType;
  volume: AffaldMaengde;
  pickupLocation: Hentested;
  notes: string;
};

export type ItEnhed =
  | "pc"
  | "mac"
  | "iphone"
  | "android"
  | "tablet"
  | "router";
export type ItProblem =
  | "langsom"
  | "opsaetning"
  | "wifi"
  | "backup"
  | "andet";

export const IT_ENHED_OPTIONS = [
  { id: "pc" as const, label: "PC / Windows" },
  { id: "mac" as const, label: "Mac" },
  { id: "iphone" as const, label: "iPhone" },
  { id: "android" as const, label: "Android" },
  { id: "tablet" as const, label: "Tablet" },
  { id: "router" as const, label: "Router / netværk" },
] as const;

export const IT_PROBLEM_OPTIONS = [
  { id: "langsom" as const, label: "Langsom / fejl" },
  { id: "opsaetning" as const, label: "Opsætning / installation" },
  { id: "wifi" as const, label: "Wi-Fi / netværk" },
  { id: "backup" as const, label: "Backup / data" },
  { id: "andet" as const, label: "Andet" },
] as const;

export type ItHjaelpDetails = {
  devices: ItEnhed[];
  problemTypes: ItProblem[];
  remoteOk: boolean;
  notes: string;
};

export type FliseArea =
  | "terrasse"
  | "indkoersel"
  | "gangsti"
  | "facade"
  | "andet";
export type FliseTreatment = "algebehandling" | "hoejtryksrens" | "begge";
export type FliseSqmRange = "under_30" | "30_60" | "60_100" | "100_plus";

export const FLISE_AREA_OPTIONS = [
  { id: "terrasse" as const, label: "Terrasse" },
  { id: "indkoersel" as const, label: "Indkørsel" },
  { id: "gangsti" as const, label: "Gangsti / sti" },
  { id: "facade" as const, label: "Facadefliser" },
  { id: "andet" as const, label: "Andet" },
] as const;

export const FLISE_TREATMENT_OPTIONS = [
  { id: "algebehandling" as const, label: "Algebehandling" },
  { id: "hoejtryksrens" as const, label: "Højtryksrens" },
  { id: "begge" as const, label: "Begge dele" },
] as const;

export const FLISE_SQM_RANGE_OPTIONS = [
  { id: "under_30" as const, label: "Under 30 m²" },
  { id: "30_60" as const, label: "30–60 m²" },
  { id: "60_100" as const, label: "60–100 m²" },
  { id: "100_plus" as const, label: "100+ m²" },
] as const;

export type FliserensDetails = {
  areas: FliseArea[];
  sqmRange?: FliseSqmRange;
  sqmManual?: number;
  treatment: FliseTreatment;
  notes: string;
};

export type TagrendePropertyType = "hus" | "raekkehus" | "lejlighed" | "andet";
export type TagrendeEtager = "1" | "2" | "3_plus";
export type TagrendeLength = "kort" | "mellem" | "lang" | "ukendt";

export const TAGRENDE_PROPERTY_OPTIONS = [
  { id: "hus" as const, label: "Hus" },
  { id: "raekkehus" as const, label: "Rækkehus" },
  { id: "lejlighed" as const, label: "Lejlighed" },
  { id: "andet" as const, label: "Andet" },
] as const;

export const TAGRENDE_ETAGER_OPTIONS = [
  { id: "1" as const, label: "1 etage" },
  { id: "2" as const, label: "2 etager" },
  { id: "3_plus" as const, label: "3+ etager" },
] as const;

export const TAGRENDE_LENGTH_OPTIONS = [
  { id: "kort" as const, label: "Kort strækning", sub: "Under ca. 15 m" },
  { id: "mellem" as const, label: "Mellem", sub: "Ca. 15–30 m" },
  { id: "lang" as const, label: "Lang", sub: "Over ca. 30 m" },
  { id: "ukendt" as const, label: "Ved ikke", sub: "Vi vurderer på stedet" },
] as const;

export type TagrenderensDetails = {
  propertyType: TagrendePropertyType;
  floors: TagrendeEtager;
  gutterLength: TagrendeLength;
  notes: string;
};

export type BoligserviceDetailsBySlug = {
  fliserens: FliserensDetails;
  tagrenderens: TagrenderensDetails;
  malerarbejde: MalerarbejdeDetails;
  "flytning-og-flyttehjaelp": FlytningDetails;
  "montering-og-ophaengning": MonteringOphaengningDetails;
  moebelmontering: MoebelmonteringDetails;
  "bortkoersel-og-affald": BortkoerselAffaldDetails;
  "it-hjaelp-til-hjemmet": ItHjaelpDetails;
};

export type BoligserviceDetails =
  BoligserviceDetailsBySlug[BoligserviceSlug];

export type BoligserviceStepId =
  | "adresse"
  | "opgavetype"
  | "detaljer"
  | "forberedelse"
  | "adresser"
  | "bolig"
  | "flytteinfo"
  | "ekstra"
  | "opgave"
  | "dato"
  | "adgang"
  | "kontakt";

export const BOLIGSERVICE_STEPS: Record<
  BoligserviceSlug,
  BoligserviceStepId[]
> = {
  fliserens: ["adresse", "opgave", "dato", "adgang", "kontakt"],
  tagrenderens: ["adresse", "opgave", "dato", "adgang", "kontakt"],
  malerarbejde: [
    "adresse",
    "opgavetype",
    "detaljer",
    "forberedelse",
    "dato",
    "kontakt",
  ],
  "flytning-og-flyttehjaelp": [
    "adresser",
    "bolig",
    "flytteinfo",
    "ekstra",
    "dato",
    "kontakt",
  ],
  "montering-og-ophaengning": [
    "adresse",
    "opgave",
    "dato",
    "adgang",
    "kontakt",
  ],
  moebelmontering: ["adresse", "opgave", "dato", "adgang", "kontakt"],
  "bortkoersel-og-affald": ["adresse", "opgave", "dato", "adgang", "kontakt"],
  "it-hjaelp-til-hjemmet": ["adresse", "opgave", "dato", "adgang", "kontakt"],
};

export function getBoligserviceSteps(
  slug: BoligserviceSlug,
  details: BoligserviceDetails,
): BoligserviceStepId[] {
  const base = BOLIGSERVICE_STEPS[slug];
  if (slug === "it-hjaelp-til-hjemmet" && "remoteOk" in details && details.remoteOk) {
    return base.filter((step) => step !== "adgang");
  }
  return base;
}

export function createDefaultBoligserviceDetails(
  slug: BoligserviceSlug,
): BoligserviceDetails {
  switch (slug) {
    case "fliserens":
      return {
        areas: ["terrasse"],
        sqmRange: "30_60",
        treatment: "begge",
        notes: "",
      };
    case "tagrenderens":
      return {
        propertyType: "hus",
        floors: "1",
        gutterLength: "mellem",
        notes: "",
      };
    case "malerarbejde":
      return {
        jobType: "indvendig",
        scopeMode: "rooms",
        roomCount: "2_3",
        surfaces: ["vaegge"],
        currentStand: "normalt",
        wallFinish: "maling",
        furnitureHandling: "kunde",
        accessNotes: "",
        hasPhotos: false,
        notes: "",
        dateFlexibility: "plus_minus_3",
      };
    case "flytning-og-flyttehjaelp":
      return {
        toAddress: "",
        toZip: "",
        toCity: "",
        fromPropertyType: "lejlighed",
        toPropertyType: "lejlighed",
        fromFloor: 0,
        toFloor: 0,
        fromElevator: null,
        toElevator: null,
        parkingDistance: "ved_doer",
        furnishingLevel: "normalt",
        boxCount: "1_10",
        dateFlexibility: "plus_minus_3",
        extras: [],
        notes: "",
      };
    case "montering-og-ophaengning":
      return {
        items: ["lamper"],
        unitCount: "1_3",
        notes: "",
      };
    case "moebelmontering":
      return {
        furnitureTypes: ["ikea"],
        pieceCount: "1_3",
        hasManual: null,
        notes: "",
      };
    case "bortkoersel-og-affald":
      return {
        wasteType: "storskrald",
        volume: "lille_bil",
        pickupLocation: "ude",
        notes: "",
      };
    case "it-hjaelp-til-hjemmet":
      return {
        devices: ["pc"],
        problemTypes: ["langsom"],
        remoteOk: true,
        notes: "",
      };
  }
}

export function needsFloorQuestion(propertyType: BoligtypeFlyt): boolean {
  return propertyType === "lejlighed" || propertyType === "kontor";
}

export function needsElevatorQuestion(
  propertyType: BoligtypeFlyt,
  floor: number,
): boolean {
  if (propertyType === "lejlighed") return floor >= 1;
  if (propertyType === "kontor") return floor > 1;
  return false;
}

export function labelForOption<T extends { id: string; label: string }>(
  options: readonly T[],
  id: string,
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}
