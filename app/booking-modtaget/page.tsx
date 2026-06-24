import type { Metadata } from "next";
import { BookingConfirmationPage } from "@/components/booking/BookingConfirmationPage";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  ...createStaticPageMetadata({
    title: "Booking modtaget — Renzen",
    description: "Tak for din booking. Her ser du hvad der sker nu.",
    path: "/booking-modtaget",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BookingConfirmationPage />;
}
