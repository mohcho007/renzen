import { Suspense } from "react";
import FlytBookingWizard from "@/components/flytterengoring/FlytBookingWizard";

export default function FlytterengoringBookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] text-[#1a3328]">
          Henter booking…
        </div>
      }
    >
      <FlytBookingWizard />
    </Suspense>
  );
}
