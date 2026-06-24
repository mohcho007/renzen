import { Suspense } from "react";
import Dealside2LandingPage from "@/components/dealside/Dealside2LandingPage";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { liveStyleDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { createStaticPageMetadata } from "@/lib/siteMetadata";
import "./dealpage2.css";

export const metadata = createStaticPageMetadata({
  title: liveStyleTitle(
    "Renzen Klub",
    `Vælg bolig · book fra ${INTRO_CLEANING_FROM_KR} kr.`,
  ),
  description: liveStyleDescription({
    action: "Se introprisen med det samme.",
    proof: "Fast rengøring hver 2. uge, 0 kr. ved booking og tydelige priser med Renzen Klub.",
    cta: "Vælg bolig og book før du godkender.",
  }),
  path: "/dealpage2/",
});

export default function DealPage2() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfaf5] text-sm font-medium text-[#536159]">
          Henter…
        </div>
      }
    >
      <Dealside2LandingPage />
    </Suspense>
  );
}
