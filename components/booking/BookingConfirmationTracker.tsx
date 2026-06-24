"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { BookingConfirmationPayload } from "@/lib/bookingConfirmation";

type BookingConfirmationTrackerProps = {
  payload: BookingConfirmationPayload;
};

export function BookingConfirmationTracker({
  payload,
}: BookingConfirmationTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const eventParams = {
      booking_id: payload.bookingId,
      source: payload.source,
      value: payload.totalTodayKr,
      currency: "DKK" as const,
      klub: payload.isKlub,
      frequency: payload.frequency,
      square_meters: payload.squareMeters,
      item_count: payload.extras.length,
    };

    track({ name: "booking_complete", ...eventParams });

    window.dataLayer?.push({
      event: "booking_complete",
      ...eventParams,
    });
  }, [payload]);

  return null;
}
