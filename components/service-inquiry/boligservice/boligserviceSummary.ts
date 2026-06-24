import type {
  BortkoerselAffaldDetails,
  BoligserviceDetails,
  FliserensDetails,
  FlytningDetails,
  ItHjaelpDetails,
  MalerarbejdeDetails,
  MoebelmonteringDetails,
  MonteringOphaengningDetails,
  TagrenderensDetails,
} from "@/lib/boligserviceInquiry";
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
  MALER_FINISH_OPTIONS,
  MALER_FURNITURE_OPTIONS,
  MALER_JOB_TYPE_OPTIONS,
  MALER_ROOM_COUNT_OPTIONS,
  MALER_SQM_RANGE_OPTIONS,
  MALER_STAND_OPTIONS,
  MALER_SURFACE_OPTIONS,
  MOEBELTYPE_OPTIONS,
  MOEBLERINGSGRAD_OPTIONS,
  MONTERING_ITEM_OPTIONS,
  PARKERING_OPTIONS,
  PREFERRED_TIME_WINDOW_OPTIONS,
  TAGRENDE_ETAGER_OPTIONS,
  TAGRENDE_LENGTH_OPTIONS,
  TAGRENDE_PROPERTY_OPTIONS,
  UNIT_COUNT_OPTIONS,
  VAEGTYPE_OPTIONS,
  labelForOption,
  needsElevatorQuestion,
  needsFloorQuestion,
} from "@/lib/boligserviceInquiry";
import {
  SERVICE_ENTRY_OPTIONS,
  type BoligserviceSlug,
  type PreferredTimeWindow,
} from "@/lib/serviceInquiry";
import { sanitizeOptionalNote } from "@/lib/optionalNote";

export type SummaryValue = string | string[];

function pushOptionalNoteItem(
  items: [string, SummaryValue][],
  label: string,
  value: string,
) {
  const text = sanitizeOptionalNote(value);
  if (text) items.push([label, text]);
}

export function buildBoligserviceSummaryItems(
  slug: BoligserviceSlug,
  serviceName: string,
  address: string,
  zip: string,
  city: string,
  details: BoligserviceDetails,
  preferredDate: string,
  preferredTimeWindow: PreferredTimeWindow,
  entryMethod: string,
): [string, SummaryValue][] {
  const items: [string, SummaryValue][] = [
    [serviceName, ""],
    [address, `${zip} ${city}`],
  ];

  switch (slug) {
    case "fliserens": {
      const d = details as FliserensDetails;
      items.push(
        [
          "Område",
          d.areas.map((id) => labelForOption(FLISE_AREA_OPTIONS, id)),
        ],
        ["Behandling", labelForOption(FLISE_TREATMENT_OPTIONS, d.treatment)],
        [
          "Areal",
          typeof d.sqmManual === "number" && d.sqmManual > 0
            ? `${d.sqmManual} m²`
            : labelForOption(FLISE_SQM_RANGE_OPTIONS, d.sqmRange ?? ""),
        ],
      );
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
    case "tagrenderens": {
      const d = details as TagrenderensDetails;
      items.push(
        [
          "Boligtype",
          labelForOption(TAGRENDE_PROPERTY_OPTIONS, d.propertyType),
        ],
        ["Etager", labelForOption(TAGRENDE_ETAGER_OPTIONS, d.floors)],
        [
          "Tagrender",
          labelForOption(TAGRENDE_LENGTH_OPTIONS, d.gutterLength),
        ],
      );
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
    case "malerarbejde": {
      const d = details as MalerarbejdeDetails;
      items.push(
        ["Opgavetype", labelForOption(MALER_JOB_TYPE_OPTIONS, d.jobType)],
        [
          "Omfang",
          d.scopeMode === "rooms"
            ? labelForOption(MALER_ROOM_COUNT_OPTIONS, d.roomCount ?? "")
            : typeof d.sqmManual === "number" && d.sqmManual > 0
              ? `${d.sqmManual} m²`
              : labelForOption(MALER_SQM_RANGE_OPTIONS, d.sqmRange ?? ""),
        ],
        [
          "Overflader",
          d.surfaces.map((id) =>
            labelForOption(MALER_SURFACE_OPTIONS, id),
          ),
        ],
        ["Stand", labelForOption(MALER_STAND_OPTIONS, d.currentStand)],
        ["Finish", labelForOption(MALER_FINISH_OPTIONS, d.wallFinish)],
        [
          "Møbler",
          labelForOption(MALER_FURNITURE_OPTIONS, d.furnitureHandling),
        ],
      );
      pushOptionalNoteItem(items, "Adgangsnoter", d.accessNotes);
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      if (d.hasPhotos) items.push(["Billeder", "Kan sendes efter"]);
      items.push([
        "Fleksibilitet",
        labelForOption(DATE_FLEXIBILITY_OPTIONS, d.dateFlexibility),
      ]);
      break;
    }
    case "flytning-og-flyttehjaelp": {
      const d = details as FlytningDetails;
      items.push(
        ["Til adresse", `${d.toAddress}, ${d.toZip} ${d.toCity}`],
        [
          "Fra boligtype",
          labelForOption(BOLIGTYPE_FLYT_OPTIONS, d.fromPropertyType),
        ],
        [
          "Til boligtype",
          labelForOption(BOLIGTYPE_FLYT_OPTIONS, d.toPropertyType),
        ],
      );
      if (needsFloorQuestion(d.fromPropertyType)) {
        items.push([
          "Fra etage",
          d.fromFloor === 0
            ? "Stue"
            : d.fromFloor === 3
              ? "3+ sal"
              : `${d.fromFloor}. sal`,
        ]);
      }
      if (needsFloorQuestion(d.toPropertyType)) {
        items.push([
          "Til etage",
          d.toFloor === 0
            ? "Stue"
            : d.toFloor === 3
              ? "3+ sal"
              : `${d.toFloor}. sal`,
        ]);
      }
      items.push(
        [
          "Parkering",
          labelForOption(PARKERING_OPTIONS, d.parkingDistance),
        ],
        [
          "Møblering",
          labelForOption(MOEBLERINGSGRAD_OPTIONS, d.furnishingLevel),
        ],
        [
          "Flyttekasser",
          typeof d.boxManual === "number"
            ? `${d.boxManual} kasser (ca.)`
            : labelForOption(FLYTTEKASSER_OPTIONS, d.boxCount ?? "1_10"),
        ],
      );
      if (d.extras.length > 0) {
        items.push([
          "Ekstra",
          d.extras.map((id) =>
            labelForOption(FLYTNING_EXTRA_OPTIONS, id),
          ),
        ]);
      }
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      items.push([
        "Fleksibilitet",
        labelForOption(DATE_FLEXIBILITY_OPTIONS, d.dateFlexibility),
      ]);
      break;
    }
    case "montering-og-ophaengning": {
      const d = details as MonteringOphaengningDetails;
      items.push(
        [
          "Montering",
          d.items.map((id) => labelForOption(MONTERING_ITEM_OPTIONS, id)),
        ],
        ["Antal", labelForOption(UNIT_COUNT_OPTIONS, d.unitCount)],
      );
      if (d.wallType) {
        items.push(["Vægtype", labelForOption(VAEGTYPE_OPTIONS, d.wallType)]);
      }
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
    case "moebelmontering": {
      const d = details as MoebelmonteringDetails;
      items.push(
        [
          "Møbeltype",
          d.furnitureTypes.map((id) => labelForOption(MOEBELTYPE_OPTIONS, id)),
        ],
        ["Antal", labelForOption(UNIT_COUNT_OPTIONS, d.pieceCount)],
      );
      if (d.hasManual !== null) {
        items.push(["Manual/emballage", d.hasManual ? "Ja" : "Nej"]);
      }
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
    case "bortkoersel-og-affald": {
      const d = details as BortkoerselAffaldDetails;
      items.push(
        ["Type", labelForOption(AFFALD_TYPE_OPTIONS, d.wasteType)],
        ["Mængde", labelForOption(AFFALD_MAENGDE_OPTIONS, d.volume)],
        ["Hentested", labelForOption(HENTESTED_OPTIONS, d.pickupLocation)],
      );
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
    case "it-hjaelp-til-hjemmet": {
      const d = details as ItHjaelpDetails;
      items.push(
        [
          "Enhed",
          d.devices.map((id) => labelForOption(IT_ENHED_OPTIONS, id)),
        ],
        [
          "Problem",
          d.problemTypes.map((id) => labelForOption(IT_PROBLEM_OPTIONS, id)),
        ],
        ["Fjernhjælp", d.remoteOk ? "Ja" : "Nej"],
      );
      pushOptionalNoteItem(items, "Bemærkninger", d.notes);
      break;
    }
  }

  if (preferredDate) {
    items.push([
      "Ønsket dato",
      new Date(preferredDate + "T12:00:00").toLocaleDateString("da-DK", {
        weekday: "short",
        day: "numeric",
        month: "long",
      }),
    ]);
  }

  if (preferredTimeWindow) {
    items.push([
      "Tidspunkt",
      labelForOption(PREFERRED_TIME_WINDOW_OPTIONS, preferredTimeWindow),
    ]);
  }

  if (entryMethod) {
    const entryLabel =
      SERVICE_ENTRY_OPTIONS.find((option) => option.id === entryMethod)
        ?.label ?? entryMethod;
    items.push(["Adgang", entryLabel]);
  }

  return items;
}

export function validateBoligserviceStep(
  slug: BoligserviceSlug,
  step: string,
  context: {
    address: string;
    zip: string;
    city: string;
    details: BoligserviceDetails;
    preferredDate: string;
    preferredTimeWindow: PreferredTimeWindow;
    entryMethod: string;
    entryOtherDetails: string;
  },
): boolean {
  const {
    address,
    zip,
    city,
    details,
    preferredDate,
    preferredTimeWindow,
    entryMethod,
    entryOtherDetails,
  } = context;
  const postnummerFilled = zip.length === 4 && city.trim().length > 0;

  switch (step) {
    case "adresse":
      return address.trim().length > 0 && postnummerFilled;
    case "adresser": {
      if (!address.trim() || !postnummerFilled) return false;
      const flyt = details as FlytningDetails;
      return (
        flyt.toAddress.trim().length > 0 &&
        flyt.toZip.length === 4 &&
        flyt.toCity.trim().length > 0
      );
    }
    case "opgavetype": {
      const maler = details as MalerarbejdeDetails;
      if (maler.scopeMode === "rooms") return Boolean(maler.roomCount);
      if (typeof maler.sqmManual === "number" && maler.sqmManual >= 1) {
        return true;
      }
      return Boolean(maler.sqmRange);
    }
    case "detaljer": {
      const maler = details as MalerarbejdeDetails;
      return maler.surfaces.length > 0;
    }
    case "forberedelse":
      if (!entryMethod) return false;
      if (entryMethod === "other") {
        return entryOtherDetails.trim().length > 0;
      }
      return true;
    case "bolig": {
      const flyt = details as FlytningDetails;
      const fromElevatorOk =
        !needsElevatorQuestion(flyt.fromPropertyType, flyt.fromFloor) ||
        flyt.fromElevator !== null;
      const toElevatorOk =
        !needsElevatorQuestion(flyt.toPropertyType, flyt.toFloor) ||
        flyt.toElevator !== null;
      return fromElevatorOk && toElevatorOk;
    }
    case "flytteinfo": {
      const flyt = details as FlytningDetails;
      if (typeof flyt.boxManual === "number") {
        return flyt.boxManual >= 0;
      }
      return Boolean(flyt.boxCount);
    }
    case "ekstra":
      return true;
    case "opgave":
      if (slug === "fliserens") {
        const fliserens = details as FliserensDetails;
        if (fliserens.areas.length === 0 || !fliserens.treatment) return false;
        if (typeof fliserens.sqmManual === "number" && fliserens.sqmManual >= 1) {
          return true;
        }
        return Boolean(fliserens.sqmRange);
      }
      if (slug === "tagrenderens") return true;
      if (slug === "montering-og-ophaengning") {
        const montering = details as MonteringOphaengningDetails;
        return montering.items.length > 0;
      }
      if (slug === "moebelmontering") {
        const moebel = details as MoebelmonteringDetails;
        return moebel.furnitureTypes.length > 0 && moebel.hasManual !== null;
      }
      if (slug === "bortkoersel-og-affald") return true;
      if (slug === "it-hjaelp-til-hjemmet") {
        const it = details as ItHjaelpDetails;
        return it.devices.length > 0 && it.problemTypes.length > 0;
      }
      return false;
    case "dato":
      return preferredDate.length === 10 && Boolean(preferredTimeWindow);
    case "adgang":
      if (!entryMethod) return false;
      if (entryMethod === "other") {
        return entryOtherDetails.trim().length > 0;
      }
      return true;
    case "kontakt":
      return true;
    default:
      return false;
  }
}
