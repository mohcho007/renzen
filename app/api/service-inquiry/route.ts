import { sendServiceInquiryEmails } from "@/lib/email/sendServiceInquiryEmails";
import { NextRequest, NextResponse } from "next/server";
import {
  COMMERCIAL_ENTRY_OPTIONS,
  isBoligserviceSlug,
  isCommercialServiceSlug,
  isPersonalegodeSlug,
  isValidFacilityCount,
  usesPreferredTiming,
  PERSONALEGODE_ENTRY_OPTIONS,
  PREFERRED_TIMING_OPTIONS,
  SERVICE_ENTRY_OPTIONS,
  SERVICE_INQUIRY_SLUGS,
  type PreferredTimingId,
  type ServiceInquiryPayload,
  type ServiceInquirySlug,
} from "@/lib/serviceInquiry";
import {
  PREFERRED_TIME_WINDOW_OPTIONS,
  type BortkoerselAffaldDetails,
  type FliserensDetails,
  type FlytningDetails,
  type ItHjaelpDetails,
  type MalerarbejdeDetails,
  type MoebelmonteringDetails,
  type MonteringOphaengningDetails,
  type PreferredTimeWindow,
  type TagrenderensDetails,
} from "@/lib/boligserviceInquiry";

function validateCommercialFacilityCounts(
  details: ServiceInquiryPayload["details"],
): { ok: true } | { ok: false; message: string } {
  if (
    !("kitchenCount" in details) ||
    !isValidFacilityCount(details.kitchenCount)
  ) {
    return { ok: false, message: "Angiv antal køkkener." };
  }
  if (
    !("toiletCount" in details) ||
    !isValidFacilityCount(details.toiletCount)
  ) {
    return { ok: false, message: "Angiv antal toiletter." };
  }
  if (
    !("workplaceCount" in details) ||
    !isValidFacilityCount(details.workplaceCount)
  ) {
    return { ok: false, message: "Angiv antal arbejdspladser." };
  }
  return { ok: true };
}

function getValidEntryIds(serviceSlug: ServiceInquirySlug): string[] {
  if (isPersonalegodeSlug(serviceSlug)) {
    return PERSONALEGODE_ENTRY_OPTIONS.map((option) => option.id);
  }
  if (isCommercialServiceSlug(serviceSlug)) {
    return COMMERCIAL_ENTRY_OPTIONS.map((option) => option.id);
  }
  return SERVICE_ENTRY_OPTIONS.map((option) => option.id);
}

function isValidPreferredTiming(value: unknown): value is PreferredTimingId {
  return PREFERRED_TIMING_OPTIONS.some((option) => option.id === value);
}

function isValidPreferredTimeWindow(
  value: unknown,
): value is PreferredTimeWindow {
  return PREFERRED_TIME_WINDOW_OPTIONS.some((option) => option.id === value);
}

export const dynamic = "force-dynamic";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePayload(body: unknown): { ok: true; data: ServiceInquiryPayload } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Ugyldig forespørgsel." };
  }

  const payload = body as Partial<ServiceInquiryPayload>;
  const serviceSlug = payload.serviceSlug as ServiceInquirySlug | undefined;

  if (!serviceSlug || !SERVICE_INQUIRY_SLUGS.includes(serviceSlug)) {
    return { ok: false, message: "Ugyldig service." };
  }

  const requiredStrings: Array<keyof ServiceInquiryPayload> = [
    "address",
    "zip",
    "city",
    "entryMethod",
    "firstName",
    "lastName",
    "email",
    "phone",
  ];

  for (const field of requiredStrings) {
    const value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return { ok: false, message: `Mangler felt: ${field}` };
    }
  }

  if (payload.zip!.length !== 4) {
    return { ok: false, message: "Ugyldigt postnummer." };
  }

  if (!isValidEmail(payload.email!)) {
    return { ok: false, message: "Ugyldig e-mail." };
  }

  if (payload.phone!.replace(/\D/g, "").length < 8) {
    return { ok: false, message: "Ugyldigt telefonnummer." };
  }

  if (!payload.termsAccepted) {
    return { ok: false, message: "Du skal acceptere handelsbetingelserne." };
  }

  if (usesPreferredTiming(serviceSlug)) {
    if (!isValidPreferredTiming(payload.preferredTiming)) {
      return { ok: false, message: "Angiv hvornår opgaven skal udføres." };
    }
  } else {
    const preferredDate = payload.preferredDate;
    if (typeof preferredDate !== "string" || preferredDate.trim().length !== 10) {
      return { ok: false, message: "Angiv en gyldig ønsket dato." };
    }
    if (isBoligserviceSlug(serviceSlug)) {
      if (!isValidPreferredTimeWindow(payload.preferredTimeWindow)) {
        return { ok: false, message: "Angiv foretrukket tidspunkt." };
      }
    }
  }

  if (payload.entryMethod === "other" && !payload.entryOtherDetails?.trim()) {
    return { ok: false, message: "Beskriv adgangen ved valget Andet." };
  }

  if (payload.entryMethod === "door_code" && !payload.entryOtherDetails?.trim()) {
    return { ok: false, message: "Angiv kode til dør eller port." };
  }

  const validEntryIds = getValidEntryIds(serviceSlug);

  if (!validEntryIds.includes(payload.entryMethod!)) {
    return { ok: false, message: "Ugyldig adgangsmetode." };
  }

  if (!payload.details || typeof payload.details !== "object") {
    return { ok: false, message: "Mangler servicedetaljer." };
  }

  if (serviceSlug === "hovedrengoring") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (!("sqm" in details) || typeof details.sqm !== "number" || details.sqm < 20) {
      return { ok: false, message: "Angiv et gyldigt areal." };
    }
  }

  if (serviceSlug === "airbnb-rengoring") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (!("sqm" in details) || typeof details.sqm !== "number" || details.sqm < 20) {
      return { ok: false, message: "Angiv et gyldigt areal." };
    }
    if (
      !("bedroomCount" in details) ||
      typeof details.bedroomCount !== "number" ||
      details.bedroomCount < 1
    ) {
      return { ok: false, message: "Angiv antal soveværelser." };
    }
    if (
      !("bathroomCount" in details) ||
      typeof details.bathroomCount !== "number" ||
      details.bathroomCount < 1
    ) {
      return { ok: false, message: "Angiv antal badeværelser." };
    }
  }

  if (serviceSlug === "vinduespudsning") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (!("windowCount" in details) || typeof details.windowCount !== "number") {
      return { ok: false, message: "Angiv antal vinduer." };
    }
  }

  if (serviceSlug === "havearbejde") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("taskTypes" in details) ||
      !Array.isArray(details.taskTypes) ||
      details.taskTypes.length === 0
    ) {
      return { ok: false, message: "Vælg mindst én opgavetype." };
    }
  }

  if (serviceSlug === "foraars-og-efteraarsklargoering") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (!("season" in details) || typeof details.season !== "string") {
      return { ok: false, message: "Angiv sæson." };
    }
  }

  if (serviceSlug === "ferieservice-til-haven") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("holidayFrom" in details) ||
      !("holidayTo" in details) ||
      typeof details.holidayFrom !== "string" ||
      typeof details.holidayTo !== "string" ||
      details.holidayFrom.length !== 10 ||
      details.holidayTo.length !== 10
    ) {
      return { ok: false, message: "Angiv en gyldig ferieperiode." };
    }
    if (
      !("careTasks" in details) ||
      !Array.isArray(details.careTasks) ||
      details.careTasks.length === 0
    ) {
      return { ok: false, message: "Vælg mindst én pasningsopgave." };
    }
  }

  if (serviceSlug === "kontorrengoring") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("officeSqm" in details) ||
      typeof details.officeSqm !== "number" ||
      details.officeSqm < 20
    ) {
      return { ok: false, message: "Angiv et gyldigt kontorareal." };
    }
    if (
      !("employeeCount" in details) ||
      typeof details.employeeCount !== "number" ||
      details.employeeCount < 1
    ) {
      return { ok: false, message: "Angiv antal medarbejdere." };
    }
    const facilityValidation = validateCommercialFacilityCounts(details);
    if (!facilityValidation.ok) return facilityValidation;
    if (
      !("preferredCleaningDays" in details) ||
      !Array.isArray(details.preferredCleaningDays)
    ) {
      return { ok: false, message: "Angiv foretrukne rengøringsdage." };
    }
    if (
      !("taskDescription" in details) ||
      typeof details.taskDescription !== "string"
    ) {
      return { ok: false, message: "Angiv opgavebeskrivelse." };
    }
    if (!("cvr" in details) || typeof details.cvr !== "string") {
      return { ok: false, message: "Ugyldigt CVR-nummer." };
    }
  }

  if (serviceSlug === "boligforeninger") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("staircaseCount" in details) ||
      typeof details.staircaseCount !== "number" ||
      details.staircaseCount < 1
    ) {
      return { ok: false, message: "Angiv antal opgange." };
    }
    if (
      !("taskDescription" in details) ||
      typeof details.taskDescription !== "string"
    ) {
      return { ok: false, message: "Ugyldig opgavebeskrivelse." };
    }
    if (
      !("commonAreaSqm" in details) ||
      typeof details.commonAreaSqm !== "number" ||
      details.commonAreaSqm < 20
    ) {
      return { ok: false, message: "Angiv et gyldigt areal for fællesarealer." };
    }
    const facilityValidation = validateCommercialFacilityCounts(details);
    if (!facilityValidation.ok) return facilityValidation;
    if (
      !("taskTypes" in details) ||
      !Array.isArray(details.taskTypes) ||
      details.taskTypes.length === 0
    ) {
      return { ok: false, message: "Vælg mindst én opgavetype." };
    }
    if (
      !("preferredCleaningDays" in details) ||
      !Array.isArray(details.preferredCleaningDays)
    ) {
      return { ok: false, message: "Angiv foretrukne rengøringsdage." };
    }
    if (
      !("associationName" in details) ||
      typeof details.associationName !== "string" ||
      !details.associationName.trim()
    ) {
      return { ok: false, message: "Angiv boligforeningens navn." };
    }
  }

  if (serviceSlug === "personalegode") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("employeeCount" in details) ||
      typeof details.employeeCount !== "number" ||
      details.employeeCount < 1
    ) {
      return { ok: false, message: "Angiv antal medarbejdere." };
    }
    if (!("cvr" in details) || typeof details.cvr !== "string") {
      return { ok: false, message: "Ugyldigt CVR-nummer." };
    }
    if (
      !("wishDescription" in details) ||
      typeof details.wishDescription !== "string"
    ) {
      return { ok: false, message: "Angiv beskrivelse af ønsket løsning." };
    }
  }

  if (serviceSlug === "flyttesyn") {
    const details = payload.details as ServiceInquiryPayload["details"];
    if (
      !("propertySqm" in details) ||
      typeof details.propertySqm !== "number" ||
      details.propertySqm < 20
    ) {
      return { ok: false, message: "Angiv et gyldigt areal." };
    }
    if (
      !("inspectionType" in details) ||
      typeof details.inspectionType !== "string" ||
      !["indflytning", "udflytning", "begge"].includes(details.inspectionType)
    ) {
      return { ok: false, message: "Angiv type af flyttesyn." };
    }
    if (
      !("taskDescription" in details) ||
      typeof details.taskDescription !== "string"
    ) {
      return { ok: false, message: "Angiv opgavebeskrivelse." };
    }
    if (!("cvr" in details) || typeof details.cvr !== "string") {
      return { ok: false, message: "Ugyldigt CVR-nummer." };
    }
  }

  if (isBoligserviceSlug(serviceSlug)) {
    const details = payload.details;
    if (!details || typeof details !== "object") {
      return { ok: false, message: "Mangler servicedetaljer." };
    }

    if (serviceSlug === "malerarbejde") {
      const d = details as MalerarbejdeDetails;
      if (!d.jobType || !d.scopeMode) {
        return { ok: false, message: "Angiv opgavetype." };
      }
      if (d.scopeMode === "rooms" && !d.roomCount) {
        return { ok: false, message: "Angiv antal rum." };
      }
      if (d.scopeMode === "sqm" && !d.sqmRange) {
        const manualSqm = d.sqmManual;
        if (
          typeof manualSqm !== "number" ||
          manualSqm < 1 ||
          manualSqm > 999
        ) {
          return { ok: false, message: "Angiv areal." };
        }
      }
      if (!Array.isArray(d.surfaces) || d.surfaces.length === 0) {
        return { ok: false, message: "Vælg mindst én overflade." };
      }
      if (!d.furnitureHandling) {
        return { ok: false, message: "Angiv møbelhåndtering." };
      }
    }

    if (serviceSlug === "flytning-og-flyttehjaelp") {
      const d = details as FlytningDetails;
      if (!d.toAddress?.trim() || d.toZip?.length !== 4 || !d.toCity?.trim()) {
        return { ok: false, message: "Angiv gyldig til-adresse." };
      }
      if (!d.fromPropertyType || !d.toPropertyType) {
        return { ok: false, message: "Angiv boligtype." };
      }
    }

    if (serviceSlug === "montering-og-ophaengning") {
      const d = details as MonteringOphaengningDetails;
      if (!Array.isArray(d.items) || d.items.length === 0) {
        return { ok: false, message: "Vælg mindst én monteringsopgave." };
      }
      if (!d.unitCount) {
        return { ok: false, message: "Angiv antal enheder." };
      }
    }

    if (serviceSlug === "moebelmontering") {
      const d = details as MoebelmonteringDetails;
      if (!Array.isArray(d.furnitureTypes) || d.furnitureTypes.length === 0) {
        return { ok: false, message: "Vælg møbeltype." };
      }
      if (!d.pieceCount) {
        return { ok: false, message: "Angiv antal styk." };
      }
      if (d.hasManual === null || d.hasManual === undefined) {
        return { ok: false, message: "Angiv om manual/emballage findes." };
      }
    }

    if (serviceSlug === "fliserens") {
      const d = details as FliserensDetails;
      if (!Array.isArray(d.areas) || d.areas.length === 0) {
        return { ok: false, message: "Vælg mindst ét område." };
      }
      if (!d.treatment) {
        return { ok: false, message: "Udfyld fliserensoplysninger." };
      }
      if (!d.sqmRange) {
        const manualSqm = d.sqmManual;
        if (
          typeof manualSqm !== "number" ||
          manualSqm < 1 ||
          manualSqm > 999
        ) {
          return { ok: false, message: "Angiv areal." };
        }
      }
    }

    if (serviceSlug === "tagrenderens") {
      const d = details as TagrenderensDetails;
      if (!d.propertyType || !d.floors || !d.gutterLength) {
        return { ok: false, message: "Udfyld tagrenderensoplysninger." };
      }
    }

    if (serviceSlug === "bortkoersel-og-affald") {
      const d = details as BortkoerselAffaldDetails;
      if (!d.wasteType || !d.volume || !d.pickupLocation) {
        return { ok: false, message: "Udfyld affaldsoplysninger." };
      }
    }

    if (serviceSlug === "it-hjaelp-til-hjemmet") {
      const d = details as ItHjaelpDetails;
      if (!Array.isArray(d.devices) || d.devices.length === 0) {
        return { ok: false, message: "Vælg mindst én enhed." };
      }
      if (!Array.isArray(d.problemTypes) || d.problemTypes.length === 0) {
        return { ok: false, message: "Vælg problemtype." };
      }
      if (typeof d.remoteOk !== "boolean") {
        return { ok: false, message: "Angiv om fjernhjælp er OK." };
      }
    }
  }

  return { ok: true, data: payload as ServiceInquiryPayload };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validatePayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 },
      );
    }

    const inquiry = {
      ...validation.data,
      receivedAt: new Date().toISOString(),
    };

    console.info("[service-inquiry]", JSON.stringify(inquiry, null, 2));

    const webhookUrl = process.env.SERVICE_INQUIRY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inquiry),
        });
      } catch (webhookError) {
        console.error("[service-inquiry] webhook failed:", webhookError);
      }
    }

    await sendServiceInquiryEmails(inquiry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[service-inquiry] error:", error);
    return NextResponse.json(
      { success: false, message: "Serverfejl. Prøv igen senere." },
      { status: 500 },
    );
  }
}
