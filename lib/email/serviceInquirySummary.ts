import {
  AFFALD_MAENGDE_OPTIONS,
  AFFALD_TYPE_OPTIONS,
  BOLIGTYPE_FLYT_OPTIONS,
  DATE_FLEXIBILITY_OPTIONS,
  FLISE_AREA_OPTIONS,
  FLISE_SQM_RANGE_OPTIONS,
  FLISE_TREATMENT_OPTIONS,
  FLYTNING_EXTRA_OPTIONS,
  FLYTTEKASSER_OPTIONS,
  HENTESTED_OPTIONS,
  IT_ENHED_OPTIONS,
  IT_PROBLEM_OPTIONS,
  labelForOption,
  MALER_FINISH_OPTIONS,
  MALER_FURNITURE_OPTIONS,
  MALER_JOB_TYPE_OPTIONS,
  MALER_ROOM_COUNT_OPTIONS,
  MALER_SCOPE_MODE_OPTIONS,
  MALER_SQM_RANGE_OPTIONS,
  MALER_STAND_OPTIONS,
  MALER_SURFACE_OPTIONS,
  MOEBLERINGSGRAD_OPTIONS,
  MOEBELTYPE_OPTIONS,
  MONTERING_ITEM_OPTIONS,
  PARKERING_OPTIONS,
  PREFERRED_TIME_WINDOW_OPTIONS,
  TAGRENDE_ETAGER_OPTIONS,
  TAGRENDE_LENGTH_OPTIONS,
  TAGRENDE_PROPERTY_OPTIONS,
  UNIT_COUNT_OPTIONS,
  VAEGTYPE_OPTIONS,
} from "@/lib/boligserviceInquiry";
import {
  AIRBNB_FREQUENCY_OPTIONS,
  BOLIGFORENING_FREQUENCY_OPTIONS,
  BOLIGFORENING_TASK_OPTIONS,
  COMMERCIAL_ENTRY_OPTIONS,
  FERIESERVICE_CARE_OPTIONS,
  FLYTTESYN_INSPECTION_OPTIONS,
  FULL_WEEK_DAY_OPTIONS,
  GARDEN_SIZE_CATEGORY_OPTIONS,
  HAVEARBEJDE_TASK_OPTIONS,
  HOVEDRENGORING_FREQUENCY_OPTIONS,
  isCommercialServiceSlug,
  KONTOR_FREQUENCY_OPTIONS,
  KONTOR_TIME_OPTIONS,
  PERSONALEGODE_ENTRY_OPTIONS,
  PERSONALEGODE_HOUSING_OPTIONS,
  PERSONALEGODE_MODEL_OPTIONS,
  PREFERRED_TIMING_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  SAESON_OPTIONS,
  SERVICE_ENTRY_OPTIONS,
  type ServiceInquiryPayload,
  type ServiceInquirySlug,
  VINDUES_CLEANING_TYPE_OPTIONS,
  VINDUES_FLOOR_OPTIONS,
  WEEKDAY_DAY_OPTIONS,
} from "@/lib/serviceInquiry";
import { sanitizeOptionalNote } from "@/lib/optionalNote";
import { siteConfig } from "@/lib/siteConfig";

export type SummaryLine = { label: string; value: string };

function optionalNoteLine(label: string, value: unknown): SummaryLine | null {
  const text = sanitizeOptionalNote(value);
  if (!text) return null;
  return { label, value: text };
}

export const SERVICE_INQUIRY_SERVICE_NAMES: Record<ServiceInquirySlug, string> = {
  "airbnb-rengoring": "Airbnb rengøring",
  hovedrengoring: "Hovedrengøring",
  vinduespudsning: "Vinduespudsning",
  havearbejde: "Havearbejde",
  "foraars-og-efteraarsklargoering": "Forårs- og efterårsklargøring",
  "ferieservice-til-haven": "Ferieservice til haven",
  kontorrengoring: "Kontorrengøring",
  boligforeninger: "Rengøring til boligforeninger",
  flyttesyn: "Flyttesyn",
  personalegode: "Rengøring som personalegode",
  fliserens: "Fliserens",
  tagrenderens: "Tagrenderens",
  "flytning-og-flyttehjaelp": "Flytning & flyttehjælp",
  malerarbejde: "Malerarbejde",
  "bortkoersel-og-affald": "Bortkørsel & affald",
  "montering-og-ophaengning": "Montering & ophængning",
  moebelmontering: "Møbelmontering",
  "it-hjaelp-til-hjemmet": "IT-hjælp til hjemmet",
};

function labelFrom<T extends { id: string; label: string }>(
  options: readonly T[],
  id: string | undefined,
): string {
  if (!id) return "";
  return labelForOption(options, id);
}

function labelsFrom<T extends { id: string; label: string }>(
  options: readonly T[],
  ids: string[] | undefined,
): string {
  if (!ids?.length) return "";
  return ids.map((id) => labelFrom(options, id)).join(", ");
}

function formatDateDa(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatGardenSize(details: {
  gardenSizeMode?: string;
  gardenSqm?: number;
  gardenSizeCategory?: string;
}): string {
  if (details.gardenSizeMode === "category" && details.gardenSizeCategory) {
    return labelFrom(GARDEN_SIZE_CATEGORY_OPTIONS, details.gardenSizeCategory);
  }
  if (typeof details.gardenSqm === "number" && details.gardenSqm > 0) {
    return `${details.gardenSqm} m²`;
  }
  return "";
}

function formatFacilityCounts(details: {
  kitchenCount?: number;
  toiletCount?: number;
  workplaceCount?: number;
}): SummaryLine[] {
  const lines: SummaryLine[] = [];
  if (typeof details.kitchenCount === "number") {
    lines.push({ label: "Antal køkkener", value: String(details.kitchenCount) });
  }
  if (typeof details.toiletCount === "number") {
    lines.push({ label: "Antal toiletter", value: String(details.toiletCount) });
  }
  if (typeof details.workplaceCount === "number") {
    lines.push({
      label: "Antal arbejdspladser",
      value: String(details.workplaceCount),
    });
  }
  return lines;
}

function formatCleaningDays(dayIds: string[] | undefined): string {
  if (!dayIds?.length) return "";
  return dayIds
    .map((id) => labelFrom(FULL_WEEK_DAY_OPTIONS, id))
    .filter(Boolean)
    .join(", ");
}

function formatWeekdayDays(dayIds: string[] | undefined): string {
  if (!dayIds?.length) return "";
  return dayIds
    .map((id) => labelFrom(WEEKDAY_DAY_OPTIONS, id))
    .filter(Boolean)
    .join(", ");
}

function formatDetailsLines(
  serviceSlug: ServiceInquirySlug,
  details: ServiceInquiryPayload["details"],
): SummaryLine[] {
  const lines: SummaryLine[] = [];
  const d = details as Record<string, unknown>;

  switch (serviceSlug) {
    case "hovedrengoring":
      lines.push(
        { label: "Areal", value: `${d.sqm} m²` },
        {
          label: "Boligtype",
          value: labelFrom(PROPERTY_TYPE_OPTIONS, d.propertyType as string),
        },
        {
          label: "Hyppighed",
          value: labelFrom(HOVEDRENGORING_FREQUENCY_OPTIONS, d.frequency as string),
        },
      );
      {
        const note = optionalNoteLine("Bemærkninger", d.specialNotes);
        if (note) lines.push(note);
      }
      break;

    case "airbnb-rengoring":
      lines.push(
        { label: "Areal", value: `${d.sqm} m²` },
        {
          label: "Boligtype",
          value: labelFrom(PROPERTY_TYPE_OPTIONS, d.propertyType as string),
        },
        { label: "Soveværelser", value: String(d.bedroomCount) },
        { label: "Badeværelser", value: String(d.bathroomCount) },
        {
          label: "Hyppighed",
          value: labelFrom(AIRBNB_FREQUENCY_OPTIONS, d.frequency as string),
        },
      );
      {
        const note = optionalNoteLine("Bemærkninger", d.specialNotes);
        if (note) lines.push(note);
      }
      break;

    case "vinduespudsning":
      lines.push(
        { label: "Antal vinduer", value: String(d.windowCount) },
        {
          label: "Etager",
          value: labelFrom(VINDUES_FLOOR_OPTIONS, d.floors as string),
        },
        {
          label: "Type",
          value: labelFrom(VINDUES_CLEANING_TYPE_OPTIONS, d.cleaningType as string),
        },
      );
      {
        const note = optionalNoteLine("Adgangsnoter", d.accessNotes);
        if (note) lines.push(note);
      }
      break;

    case "havearbejde":
      lines.push(
        { label: "Havestørrelse", value: formatGardenSize(d) },
        {
          label: "Opgavetyper",
          value: labelsFrom(HAVEARBEJDE_TASK_OPTIONS, d.taskTypes as string[]),
        },
      );
      {
        const note = optionalNoteLine("Opgavenoter", d.taskNotes);
        if (note) lines.push(note);
      }
      break;

    case "foraars-og-efteraarsklargoering":
      lines.push(
        {
          label: "Sæson",
          value: labelFrom(SAESON_OPTIONS, d.season as string),
        },
        { label: "Havestørrelse", value: formatGardenSize(d) },
      );
      {
        const periodNote = optionalNoteLine("Periode", d.periodNotes);
        if (periodNote) lines.push(periodNote);
        const note = optionalNoteLine("Bemærkninger", d.specialNotes);
        if (note) lines.push(note);
      }
      break;

    case "ferieservice-til-haven":
      lines.push(
        {
          label: "Ferie fra",
          value: formatDateDa(String(d.holidayFrom)),
        },
        {
          label: "Ferie til",
          value: formatDateDa(String(d.holidayTo)),
        },
        { label: "Havestørrelse", value: formatGardenSize(d) },
        {
          label: "Pasningsopgaver",
          value: labelsFrom(FERIESERVICE_CARE_OPTIONS, d.careTasks as string[]),
        },
      );
      {
        const note = optionalNoteLine("Noter", d.careNotes);
        if (note) lines.push(note);
      }
      break;

    case "kontorrengoring":
      lines.push(
        { label: "Kontorareal", value: `${d.officeSqm} m²` },
        { label: "Medarbejdere", value: String(d.employeeCount) },
        ...formatFacilityCounts(d),
        {
          label: "Hyppighed",
          value: labelFrom(KONTOR_FREQUENCY_OPTIONS, d.frequency as string),
        },
        {
          label: "Foretrukket tid",
          value: labelFrom(KONTOR_TIME_OPTIONS, d.preferredTime as string),
        },
        {
          label: "Foretrukne dage",
          value: formatWeekdayDays(d.preferredCleaningDays as string[]),
        },
        { label: "CVR", value: String(d.cvr) },
        { label: "Opgavebeskrivelse", value: String(d.taskDescription) },
      );
      break;

    case "boligforeninger":
      lines.push(
        { label: "Forening", value: String(d.associationName) },
        { label: "Antal opgange", value: String(d.staircaseCount) },
        { label: "Fællesarealer", value: `${d.commonAreaSqm} m²` },
        ...formatFacilityCounts(d),
        {
          label: "Opgavetyper",
          value: labelsFrom(BOLIGFORENING_TASK_OPTIONS, d.taskTypes as string[]),
        },
        {
          label: "Hyppighed",
          value: labelFrom(
            BOLIGFORENING_FREQUENCY_OPTIONS,
            d.frequency as string,
          ),
        },
        {
          label: "Foretrukne dage",
          value: formatCleaningDays(d.preferredCleaningDays as string[]),
        },
        { label: "Opgavebeskrivelse", value: String(d.taskDescription) },
      );
      break;

    case "flyttesyn":
      lines.push(
        { label: "Areal", value: `${d.propertySqm} m²` },
        {
          label: "Type",
          value: labelFrom(FLYTTESYN_INSPECTION_OPTIONS, d.inspectionType as string),
        },
        { label: "CVR", value: String(d.cvr) },
        { label: "Opgavebeskrivelse", value: String(d.taskDescription) },
      );
      break;

    case "personalegode":
      lines.push(
        { label: "Medarbejdere", value: String(d.employeeCount) },
        { label: "CVR", value: String(d.cvr) },
        {
          label: "Model",
          value: labelFrom(PERSONALEGODE_MODEL_OPTIONS, d.benefitModel as string),
        },
        {
          label: "Boligtype",
          value: labelFrom(
            PERSONALEGODE_HOUSING_OPTIONS,
            d.employeeHousingType as string,
          ),
        },
        { label: "Ønsket løsning", value: String(d.wishDescription) },
      );
      break;

    case "fliserens":
      lines.push(
        {
          label: "Områder",
          value: labelsFrom(FLISE_AREA_OPTIONS, d.areas as string[]),
        },
        {
          label: "Behandling",
          value: labelFrom(FLISE_TREATMENT_OPTIONS, d.treatment as string),
        },
      );
      if (d.sqmRange) {
        lines.push({
          label: "Areal",
          value: labelFrom(FLISE_SQM_RANGE_OPTIONS, d.sqmRange as string),
        });
      } else if (typeof d.sqmManual === "number") {
        lines.push({ label: "Areal", value: `${d.sqmManual} m²` });
      }
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "tagrenderens":
      lines.push(
        {
          label: "Boligtype",
          value: labelFrom(TAGRENDE_PROPERTY_OPTIONS, d.propertyType as string),
        },
        {
          label: "Etager",
          value: labelFrom(TAGRENDE_ETAGER_OPTIONS, d.floors as string),
        },
        {
          label: "Tagrendelængde",
          value: labelFrom(TAGRENDE_LENGTH_OPTIONS, d.gutterLength as string),
        },
      );
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "malerarbejde":
      lines.push(
        {
          label: "Opgavetype",
          value: labelFrom(MALER_JOB_TYPE_OPTIONS, d.jobType as string),
        },
        {
          label: "Omfang",
          value: labelFrom(MALER_SCOPE_MODE_OPTIONS, d.scopeMode as string),
        },
      );
      if (d.scopeMode === "rooms" && d.roomCount) {
        lines.push({
          label: "Antal rum",
          value: labelFrom(MALER_ROOM_COUNT_OPTIONS, d.roomCount as string),
        });
      }
      if (d.scopeMode === "sqm") {
        if (d.sqmRange) {
          lines.push({
            label: "Areal",
            value: labelFrom(MALER_SQM_RANGE_OPTIONS, d.sqmRange as string),
          });
        } else if (typeof d.sqmManual === "number") {
          lines.push({ label: "Areal", value: `${d.sqmManual} m²` });
        }
      }
      lines.push(
        {
          label: "Overflader",
          value: labelsFrom(MALER_SURFACE_OPTIONS, d.surfaces as string[]),
        },
        {
          label: "Stand",
          value: labelFrom(MALER_STAND_OPTIONS, d.currentStand as string),
        },
        {
          label: "Vægfinish",
          value: labelFrom(MALER_FINISH_OPTIONS, d.wallFinish as string),
        },
        {
          label: "Møbler",
          value: labelFrom(MALER_FURNITURE_OPTIONS, d.furnitureHandling as string),
        },
        {
          label: "Datofleksibilitet",
          value: labelFrom(DATE_FLEXIBILITY_OPTIONS, d.dateFlexibility as string),
        },
      );
      {
        const accessNote = optionalNoteLine("Adgangsnoter", d.accessNotes);
        if (accessNote) lines.push(accessNote);
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "flytning-og-flyttehjaelp":
      lines.push(
        {
          label: "Fra boligtype",
          value: labelFrom(BOLIGTYPE_FLYT_OPTIONS, d.fromPropertyType as string),
        },
        {
          label: "Til-adresse",
          value: `${d.toAddress}, ${d.toZip} ${d.toCity}`,
        },
        {
          label: "Til boligtype",
          value: labelFrom(BOLIGTYPE_FLYT_OPTIONS, d.toPropertyType as string),
        },
        { label: "Fra etage", value: String(d.fromFloor) },
        { label: "Til etage", value: String(d.toFloor) },
      );
      if (d.fromElevator !== null && d.fromElevator !== undefined) {
        lines.push({
          label: "Elevator (fra)",
          value: d.fromElevator ? "Ja" : "Nej",
        });
      }
      if (d.toElevator !== null && d.toElevator !== undefined) {
        lines.push({
          label: "Elevator (til)",
          value: d.toElevator ? "Ja" : "Nej",
        });
      }
      lines.push(
        {
          label: "Parkering",
          value: labelFrom(PARKERING_OPTIONS, d.parkingDistance as string),
        },
        {
          label: "Møblering",
          value: labelFrom(MOEBLERINGSGRAD_OPTIONS, d.furnishingLevel as string),
        },
      );
      if (d.boxCount) {
        lines.push({
          label: "Flyttekasser",
          value: labelFrom(FLYTTEKASSER_OPTIONS, d.boxCount as string),
        });
      } else if (typeof d.boxManual === "number") {
        lines.push({ label: "Flyttekasser", value: String(d.boxManual) });
      }
      lines.push(
        {
          label: "Ekstra",
          value: labelsFrom(FLYTNING_EXTRA_OPTIONS, d.extras as string[]),
        },
        {
          label: "Datofleksibilitet",
          value: labelFrom(DATE_FLEXIBILITY_OPTIONS, d.dateFlexibility as string),
        },
      );
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "montering-og-ophaengning":
      lines.push(
        {
          label: "Opgavetyper",
          value: labelsFrom(MONTERING_ITEM_OPTIONS, d.items as string[]),
        },
        {
          label: "Antal enheder",
          value: labelFrom(UNIT_COUNT_OPTIONS, d.unitCount as string),
        },
      );
      if (d.wallType) {
        lines.push({
          label: "Vægtype",
          value: labelFrom(VAEGTYPE_OPTIONS, d.wallType as string),
        });
      }
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "moebelmontering":
      lines.push(
        {
          label: "Møbeltyper",
          value: labelsFrom(MOEBELTYPE_OPTIONS, d.furnitureTypes as string[]),
        },
        {
          label: "Antal styk",
          value: labelFrom(UNIT_COUNT_OPTIONS, d.pieceCount as string),
        },
      );
      if (d.hasManual !== null && d.hasManual !== undefined) {
        lines.push({
          label: "Manual/emballage",
          value: d.hasManual ? "Ja" : "Nej",
        });
      }
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "bortkoersel-og-affald":
      lines.push(
        {
          label: "Affaldstype",
          value: labelFrom(AFFALD_TYPE_OPTIONS, d.wasteType as string),
        },
        {
          label: "Mængde",
          value: labelFrom(AFFALD_MAENGDE_OPTIONS, d.volume as string),
        },
        {
          label: "Hentested",
          value: labelFrom(HENTESTED_OPTIONS, d.pickupLocation as string),
        },
      );
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;

    case "it-hjaelp-til-hjemmet":
      lines.push(
        {
          label: "Enheder",
          value: labelsFrom(IT_ENHED_OPTIONS, d.devices as string[]),
        },
        {
          label: "Problemtyper",
          value: labelsFrom(IT_PROBLEM_OPTIONS, d.problemTypes as string[]),
        },
        {
          label: "Fjernhjælp OK",
          value: d.remoteOk ? "Ja" : "Nej",
        },
      );
      {
        const note = optionalNoteLine("Noter", d.notes);
        if (note) lines.push(note);
      }
      break;
  }

  return lines.filter((line) => line.value.trim());
}

export function getServiceDisplayName(serviceSlug: ServiceInquirySlug): string {
  return SERVICE_INQUIRY_SERVICE_NAMES[serviceSlug] ?? serviceSlug;
}

export function getServicePageUrl(serviceSlug: ServiceInquirySlug): string {
  return `${siteConfig.origin}/${serviceSlug}`;
}

export function formatEntryMethodLabel(
  serviceSlug: ServiceInquirySlug,
  entryMethod: string,
  entryOtherDetails: string,
): string {
  const options: Array<{ id: string; label: string }> = isCommercialServiceSlug(
    serviceSlug,
  )
    ? serviceSlug === "personalegode"
      ? PERSONALEGODE_ENTRY_OPTIONS
      : COMMERCIAL_ENTRY_OPTIONS
    : SERVICE_ENTRY_OPTIONS;

  const label = labelFrom(options, entryMethod);
  if (entryMethod === "other" || entryMethod === "door_code") {
    const extra = entryOtherDetails.trim();
    return extra ? `${label}: ${extra}` : label;
  }
  return label;
}

export function formatPreferredSchedule(
  payload: ServiceInquiryPayload,
): string {
  if (payload.preferredTiming) {
    return labelFrom(PREFERRED_TIMING_OPTIONS, payload.preferredTiming);
  }

  const parts: string[] = [];
  if (payload.preferredDate) {
    parts.push(formatDateDa(payload.preferredDate));
  }
  if (payload.preferredTimeWindow) {
    parts.push(
      labelFrom(PREFERRED_TIME_WINDOW_OPTIONS, payload.preferredTimeWindow),
    );
  }
  return parts.join(" · ");
}

export function buildServiceInquirySummaryLines(
  inquiry: ServiceInquiryPayload & { receivedAt?: string },
): SummaryLine[] {
  const serviceName = getServiceDisplayName(inquiry.serviceSlug);
  const lines: SummaryLine[] = [
    { label: "Service", value: serviceName },
  ];

  if (inquiry.receivedAt) {
    lines.push({
      label: "Modtaget",
      value: new Intl.DateTimeFormat("da-DK", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(inquiry.receivedAt)),
    });
  }

  lines.push(
    {
      label: "Navn",
      value: `${inquiry.firstName} ${inquiry.lastName}`.trim(),
    },
    { label: "E-mail", value: inquiry.email },
    { label: "Telefon", value: inquiry.phone },
    {
      label: "Adresse",
      value: `${inquiry.address}, ${inquiry.zip} ${inquiry.city}`,
    },
    {
      label: inquiry.preferredTiming ? "Tidsplan" : "Ønsket dato",
      value: formatPreferredSchedule(inquiry),
    },
    {
      label: "Adgang",
      value: formatEntryMethodLabel(
        inquiry.serviceSlug,
        inquiry.entryMethod,
        inquiry.entryOtherDetails,
      ),
    },
  );

  lines.push(...formatDetailsLines(inquiry.serviceSlug, inquiry.details));
  return lines.filter((line) => line.value.trim());
}

export function buildCustomerSummaryLines(
  inquiry: ServiceInquiryPayload,
): SummaryLine[] {
  const lines: SummaryLine[] = [
    {
      label: "Service",
      value: getServiceDisplayName(inquiry.serviceSlug),
    },
    {
      label: "Adresse",
      value: `${inquiry.address}, ${inquiry.zip} ${inquiry.city}`,
    },
    {
      label: inquiry.preferredTiming ? "Tidsplan" : "Ønsket dato",
      value: formatPreferredSchedule(inquiry),
    },
    { label: "Telefon", value: inquiry.phone },
  ];

  if (isCommercialServiceSlug(inquiry.serviceSlug)) {
    const details = inquiry.details as Record<string, unknown>;
    if (inquiry.serviceSlug === "boligforeninger" && details.associationName) {
      lines.push({
        label: "Forening",
        value: String(details.associationName),
      });
    }
    if (
      (inquiry.serviceSlug === "kontorrengoring" ||
        inquiry.serviceSlug === "flyttesyn" ||
        inquiry.serviceSlug === "personalegode") &&
      details.cvr
    ) {
      lines.push({ label: "CVR", value: String(details.cvr) });
    }
  }

  return lines.filter((line) => line.value.trim());
}

export function isB2BServiceSlug(serviceSlug: ServiceInquirySlug): boolean {
  return isCommercialServiceSlug(serviceSlug);
}
