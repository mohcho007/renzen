import type { Metadata } from "next";
import { BookingConfirmationPage } from "@/components/booking/BookingConfirmationPage";
import { BOOKING_CONFIRMATION_PREVIEW_PAYLOAD } from "@/lib/bookingConfirmation";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  ...createStaticPageMetadata({
    title: "Forhåndsvisning: Booking modtaget — Renzen",
    description: "Intern forhåndsvisning af bookingbekræftelsessiden.",
    path: "/booking-modtaget/preview",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingConfirmationPreviewPage() {
  return (
    <BookingConfirmationPage
      previewPayload={BOOKING_CONFIRMATION_PREVIEW_PAYLOAD}
      skipTracking
      showPreviewBanner
    />
  );
}
