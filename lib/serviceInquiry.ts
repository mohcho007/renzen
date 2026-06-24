import type { BoligserviceDetails, PreferredTimeWindow } from "@/lib/boligserviceInquiry";
import { FLYT_ENTRY_OPTIONS, type FlytEntryOptionId } from "@/lib/flytterengoring";

export type { BoligserviceDetails, PreferredTimeWindow } from "@/lib/boligserviceInquiry";

export type BoligserviceSlug =
  | "fliserens"
  | "tagrenderens"
  | "flytning-og-flyttehjaelp"
  | "malerarbejde"
  | "bortkoersel-og-affald"
  | "montering-og-ophaengning"
  | "moebelmontering"
  | "it-hjaelp-til-hjemmet";

export const BOLIGSERVICE_SLUGS: BoligserviceSlug[] = [
  "fliserens",
  "tagrenderens",
  "flytning-og-flyttehjaelp",
  "malerarbejde",
  "bortkoersel-og-affald",
  "montering-og-ophaengning",
  "moebelmontering",
  "it-hjaelp-til-hjemmet",
];

export type ServiceInquirySlug =
  | "airbnb-rengoring"
  | "hovedrengoring"
  | "vinduespudsning"
  | "havearbejde"
  | "foraars-og-efteraarsklargoering"
  | "ferieservice-til-haven"
  | "kontorrengoring"
  | "boligforeninger"
  | "flyttesyn"
  | "personalegode"
  | BoligserviceSlug;

export const SERVICE_INQUIRY_SLUGS: ServiceInquirySlug[] = [
  "airbnb-rengoring",
  "hovedrengoring",
  "vinduespudsning",
  "havearbejde",
  "foraars-og-efteraarsklargoering",
  "ferieservice-til-haven",
  "kontorrengoring",
  "boligforeninger",
  "flyttesyn",
  "personalegode",
  ...BOLIGSERVICE_SLUGS,
];

export function isBoligserviceSlug(
  slug: ServiceInquirySlug,
): slug is BoligserviceSlug {
  return BOLIGSERVICE_SLUGS.includes(slug as BoligserviceSlug);
}

export const SERVICE_ENTRY_OPTIONS = FLYT_ENTRY_OPTIONS;

export type CommercialEntryOptionId =
  | "contact_present"
  | "reception_key"
  | "door_code"
  | "key_box"
  | "other";

export type PersonalegodeEntryOptionId =
  | "employee_agreement"
  | "door_code"
  | "key_box"
  | "other";

export type ServiceEntryOptionId =
  | FlytEntryOptionId
  | CommercialEntryOptionId
  | PersonalegodeEntryOptionId;

export type CommercialEntryOption = {
  id: CommercialEntryOptionId;
  label: string;
};

export const COMMERCIAL_ENTRY_OPTIONS: CommercialEntryOption[] = [
  {
    id: "contact_present",
    label: "Kontaktperson er til stede ved ankomst",
  },
  {
    id: "reception_key",
    label: "Nøgle eller adgangskort afhentes i reception",
  },
  { id: "door_code", label: "Kode til dør / port" },
  { id: "key_box", label: "Nøgleboks / nøglesafe" },
  { id: "other", label: "Andet" },
];

export type PersonalegodeEntryOption = {
  id: PersonalegodeEntryOptionId;
  label: string;
};

export const PERSONALEGODE_ENTRY_OPTIONS: PersonalegodeEntryOption[] = [
  {
    id: "employee_agreement",
    label: "Aftales med den enkelte medarbejder",
  },
  { id: "door_code", label: "Kode til dør / port" },
  { id: "key_box", label: "Nøgleboks / nøglesafe" },
  { id: "other", label: "Andet" },
];

export type PreferredTimingId =
  | "snarest"
  | "inden_1_maaned"
  | "inden_2_maaneder"
  | "inden_3_maaneder";

export const PREFERRED_TIMING_OPTIONS = [
  { id: "snarest" as const, label: "Snarest", sub: "Så hurtigt som muligt" },
  {
    id: "inden_1_maaned" as const,
    label: "Inden for 1 måned",
    sub: "Vi planlægger inden for 30 dage",
  },
  {
    id: "inden_2_maaneder" as const,
    label: "Inden for 2 måneder",
    sub: "Vi planlægger inden for 60 dage",
  },
  {
    id: "inden_3_maaneder" as const,
    label: "Inden for 3 måneder",
    sub: "Vi planlægger inden for 90 dage",
  },
] as const;

/** @deprecated Use PREFERRED_TIMING_OPTIONS */
export const PERSONALEGODE_TIMING_OPTIONS = PREFERRED_TIMING_OPTIONS;

export const WEEKDAY_DAY_OPTIONS = [
  { id: "mon" as const, label: "Man" },
  { id: "tue" as const, label: "Tir" },
  { id: "wed" as const, label: "Ons" },
  { id: "thu" as const, label: "Tor" },
  { id: "fri" as const, label: "Fre" },
] as const;

export const WEEKEND_DAY_OPTIONS = [
  { id: "sat" as const, label: "Lør" },
  { id: "sun" as const, label: "Søn" },
] as const;

export const FULL_WEEK_DAY_OPTIONS = [
  ...WEEKDAY_DAY_OPTIONS,
  ...WEEKEND_DAY_OPTIONS,
] as const;

export type WeekdayDayId = (typeof WEEKDAY_DAY_OPTIONS)[number]["id"];
export type FullWeekDayId = (typeof FULL_WEEK_DAY_OPTIONS)[number]["id"];

export type HovedrengoringDetails = {
  sqm: number;
  propertyType: "lejlighed" | "hus" | "raekkehus" | "andet";
  frequency: "engangs" | "kvartalsvis" | "halvaarligt" | "ved_behov";
  specialNotes: string;
};

export type AirbnbRengoringDetails = {
  sqm: number;
  propertyType: "lejlighed" | "hus" | "raekkehus" | "andet";
  bedroomCount: number;
  bathroomCount: number;
  frequency: "per_gaesteskifte" | "ugentlig" | "14_dage" | "ved_behov";
  specialNotes: string;
};

export type VinduespudsningDetails = {
  windowCount: number;
  floors: "1" | "2" | "3+";
  cleaningType: "indvendig" | "udvendig" | "begge";
  accessNotes: string;
};

export type GardenSizeCategory = "lille" | "mellem" | "stor";

export type HavearbejdeDetails = {
  gardenSizeMode: "sqm" | "category";
  gardenSqm: number;
  gardenSizeCategory: GardenSizeCategory;
  taskTypes: string[];
  taskNotes: string;
};

export type ForaarsEfteraarsklargoeringDetails = {
  season: "foraar" | "efteraar" | "begge";
  gardenSizeMode: "sqm" | "category";
  gardenSqm: number;
  gardenSizeCategory: GardenSizeCategory;
  periodNotes: string;
  specialNotes: string;
};

export type FerieserviceDetails = {
  holidayFrom: string;
  holidayTo: string;
  gardenSizeMode: "sqm" | "category";
  gardenSqm: number;
  gardenSizeCategory: GardenSizeCategory;
  careTasks: string[];
  careNotes: string;
};

export const FACILITY_COUNT_PILL_OPTIONS = [0, 1, 2, 3] as const;

export type FacilityCountPill = (typeof FACILITY_COUNT_PILL_OPTIONS)[number];

export type FacilityCount = number;

export type CommercialFacilityCounts = {
  kitchenCount: FacilityCount;
  toiletCount: FacilityCount;
  workplaceCount: FacilityCount;
};

export function formatFacilityCountLabel(count: FacilityCount): string {
  return String(count);
}

export function isValidFacilityCount(value: unknown): value is FacilityCount {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 999
  );
}

export function isCommercialServiceSlug(slug: ServiceInquirySlug): boolean {
  return (
    slug === "kontorrengoring" ||
    slug === "boligforeninger" ||
    slug === "flyttesyn" ||
    slug === "personalegode"
  );
}

export function isPersonalegodeSlug(slug: ServiceInquirySlug): boolean {
  return slug === "personalegode";
}

export function usesPreferredTiming(slug: ServiceInquirySlug): boolean {
  return (
    slug === "personalegode" ||
    slug === "boligforeninger" ||
    slug === "kontorrengoring" ||
    slug === "flyttesyn"
  );
}

export type KontorrengoringDetails = CommercialFacilityCounts & {
  officeSqm: number;
  employeeCount: number;
  frequency: "daglig" | "ugentlig" | "14_dage" | "maanedlig" | "engangs";
  preferredTime: "morgen" | "aften" | "fleksibel";
  preferredCleaningDays: WeekdayDayId[];
  cvr: string;
  taskDescription: string;
};

export type BoligforeningDetails = CommercialFacilityCounts & {
  staircaseCount: number;
  commonAreaSqm: number;
  taskTypes: BoligforeningTaskTypeId[];
  frequency: "ugentlig" | "14_dage" | "maanedlig" | "engangs";
  preferredCleaningDays: FullWeekDayId[];
  associationName: string;
  taskDescription: string;
};

export type PersonalegodeDetails = {
  employeeCount: number;
  benefitModel: "fast" | "loebende";
  employeeHousingType: "lejlighed" | "hus" | "blandet";
  wishDescription: string;
  cvr: string;
};

export const FLYTTESYN_INSPECTION_OPTIONS = [
  { id: "indflytning" as const, label: "Indflytning", sub: "Gennemgang ved indflytning" },
  { id: "udflytning" as const, label: "Udflytning", sub: "Gennemgang ved udflytning" },
  { id: "begge" as const, label: "Begge", sub: "Ind- og udflytning" },
] as const;

export type FlyttesynDetails = {
  propertySqm: number;
  inspectionType: (typeof FLYTTESYN_INSPECTION_OPTIONS)[number]["id"];
  taskDescription: string;
  cvr: string;
};

export type ServiceInquiryDetails =
  | AirbnbRengoringDetails
  | HovedrengoringDetails
  | VinduespudsningDetails
  | HavearbejdeDetails
  | ForaarsEfteraarsklargoeringDetails
  | FerieserviceDetails
  | KontorrengoringDetails
  | BoligforeningDetails
  | FlyttesynDetails
  | PersonalegodeDetails
  | BoligserviceDetails;

export type ServiceInquiryPayload = {
  serviceSlug: ServiceInquirySlug;
  address: string;
  zip: string;
  city: string;
  preferredDate: string;
  preferredTimeWindow?: PreferredTimeWindow;
  preferredTiming?: PreferredTimingId;
  entryMethod: ServiceEntryOptionId;
  entryOtherDetails: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  termsAccepted: boolean;
  details: ServiceInquiryDetails;
};

export const PROPERTY_TYPE_OPTIONS = [
  { id: "lejlighed" as const, label: "Lejlighed" },
  { id: "hus" as const, label: "Hus" },
  { id: "raekkehus" as const, label: "Rækkehus" },
  { id: "andet" as const, label: "Andet" },
];

export const HOVEDRENGORING_FREQUENCY_OPTIONS = [
  { id: "engangs" as const, label: "Én gang", sub: "Engangshovedrengøring" },
  { id: "kvartalsvis" as const, label: "Hver 3. måned", sub: "Fast interval" },
  { id: "halvaarligt" as const, label: "Hver 6. måned", sub: "Fast interval" },
  { id: "ved_behov" as const, label: "Ved behov", sub: "Ikke fast interval" },
];

export const AIRBNB_BEDROOM_OPTIONS = [1, 2, 3, 4] as const;
export const AIRBNB_BATHROOM_OPTIONS = [1, 2, 3] as const;

export const AIRBNB_FREQUENCY_OPTIONS = [
  {
    id: "per_gaesteskifte" as const,
    label: "Per gæsteskifte",
    sub: "Mellem hver booking",
  },
  { id: "ugentlig" as const, label: "Ugentlig", sub: "Fast interval" },
  { id: "14_dage" as const, label: "Hver 14. dag", sub: "Fast interval" },
  { id: "ved_behov" as const, label: "Ved behov", sub: "Ikke fast interval" },
];

export const VINDUES_FLOOR_OPTIONS = [
  { id: "1" as const, label: "1 etage" },
  { id: "2" as const, label: "2 etager" },
  { id: "3+" as const, label: "3+ etager" },
];

export const VINDUES_CLEANING_TYPE_OPTIONS = [
  { id: "indvendig" as const, label: "Indvendig" },
  { id: "udvendig" as const, label: "Udvendig" },
  { id: "begge" as const, label: "Begge dele" },
];

export const WINDOW_COUNT_OPTIONS = [4, 8, 12, 16, 20, 24] as const;

export const GARDEN_SIZE_CATEGORY_OPTIONS = [
  { id: "lille" as const, label: "Lille", sub: "Under ca. 100 m²" },
  { id: "mellem" as const, label: "Mellem", sub: "Ca. 100–300 m²" },
  { id: "stor" as const, label: "Stor", sub: "Over ca. 300 m²" },
];

export const HAVEARBEJDE_TASK_OPTIONS = [
  { id: "graesslaaning", label: "Græsslåning" },
  { id: "haekklipning", label: "Hækklipning" },
  { id: "lugning", label: "Lugning og ukrudt" },
  { id: "beskaering", label: "Beskæring" },
  { id: "affald", label: "Affald og oprydning" },
  { id: "andet", label: "Andet / blandet" },
] as const;

export type HavearbejdeTaskTypeId = (typeof HAVEARBEJDE_TASK_OPTIONS)[number]["id"];

export const SAESON_OPTIONS = [
  { id: "foraar" as const, label: "Forår" },
  { id: "efteraar" as const, label: "Efterår" },
  { id: "begge" as const, label: "Begge sæsoner" },
];

export const FERIESERVICE_CARE_OPTIONS = [
  { id: "vanding", label: "Vanding" },
  { id: "graes", label: "Græsslåning" },
  { id: "planter", label: "Pasning af planter og bede" },
  { id: "affald", label: "Affald og oprydning" },
  { id: "tilsyn", label: "Generelt tilsyn" },
] as const;

export const KONTOR_FREQUENCY_OPTIONS = [
  { id: "daglig" as const, label: "Daglig", sub: "Hver hverdag" },
  { id: "ugentlig" as const, label: "Ugentlig", sub: "Én gang om ugen" },
  { id: "14_dage" as const, label: "Hver 14. dag", sub: "Fast interval" },
  { id: "maanedlig" as const, label: "Månedlig", sub: "Fast interval" },
  { id: "engangs" as const, label: "Engangs", sub: "Én opgave" },
];

export const KONTOR_TIME_OPTIONS = [
  { id: "morgen" as const, label: "Morgen", sub: "Før arbejdstid" },
  { id: "aften" as const, label: "Aften", sub: "Efter arbejdstid" },
  { id: "fleksibel" as const, label: "Fleksibel", sub: "Vi aftaler tid" },
];

export const BOLIGFORENING_TASK_OPTIONS = [
  { id: "trappe" as const, label: "Trappevask" },
  { id: "opgang" as const, label: "Opgange og fællesarealer" },
  { id: "vaskeri" as const, label: "Vaskeri og teknikrum" },
  { id: "andet" as const, label: "Andet / blandet" },
] as const;

export type BoligforeningTaskTypeId =
  (typeof BOLIGFORENING_TASK_OPTIONS)[number]["id"];

export const BOLIGFORENING_FREQUENCY_OPTIONS = [
  { id: "ugentlig" as const, label: "Ugentlig", sub: "Én gang om ugen" },
  { id: "14_dage" as const, label: "Hver 14. dag", sub: "Fast interval" },
  { id: "maanedlig" as const, label: "Månedlig", sub: "Fast interval" },
  { id: "engangs" as const, label: "Engangs", sub: "Én opgave" },
];

export const PERSONALEGODE_MODEL_OPTIONS = [
  { id: "fast" as const, label: "Fast aftale", sub: "Samme interval for alle" },
  { id: "loebende" as const, label: "Løbende", sub: "Medarbejdere bestiller selv" },
];

export const PERSONALEGODE_HOUSING_OPTIONS = [
  { id: "lejlighed" as const, label: "Primært lejlighed" },
  { id: "hus" as const, label: "Primært hus" },
  { id: "blandet" as const, label: "Blandet boligtype" },
];
