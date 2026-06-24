import { Suspense } from "react";
import Dealside2LandingPage from "@/components/dealside/Dealside2LandingPage";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { bookOnlineDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { createStaticPageMetadata } from "@/lib/siteMetadata";
import "@/app/dealpage2/dealpage2.css";

export const metadata = createStaticPageMetadata({
  title: liveStyleTitle("Book rengøring", "Se pris med det samme"),
  description: `${bookOnlineDescription()} Intro fra ${INTRO_CLEANING_FROM_KR} kr. med Renzen Klub eller engangsrengøring til listepris.`,
  path: "/book-rengoering/",
});

export default function BookRengoeringPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfaf5] text-sm font-medium text-[#536159]">
          Henter booking…
        </div>
      }
    >
      <Dealside2LandingPage wizardVariant="book2" />
    </Suspense>
  );
}
