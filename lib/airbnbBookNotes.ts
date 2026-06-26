import {
  AIRBNB_FREQUENCY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/lib/serviceInquiry";
import type { AirbnbInquiryTokenPayload } from "@/lib/airbnbInquiryToken";

function labelFrom<T extends { id: string; label: string }>(
  options: readonly T[],
  id: string | undefined,
): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
}

export function buildAirbnbBookingNotes(payload: AirbnbInquiryTokenPayload): string {
  const details = payload.details;
  const parts = [
    "Airbnb-rengøring",
    `${details.bedroomCount} soveværelser, ${details.bathroomCount} badeværelser`,
    labelFrom(AIRBNB_FREQUENCY_OPTIONS, details.frequency),
    labelFrom(PROPERTY_TYPE_OPTIONS, details.propertyType),
    details.specialNotes?.trim(),
    payload.entryOtherDetails.trim(),
  ].filter((part) => part && part.length > 0);

  return parts.join(". ");
}
