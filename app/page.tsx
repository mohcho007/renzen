import type { Metadata } from "next";
import { HomeStructuredData } from "@/components/home/HomeStructuredData";
import { RenzenHomePage } from "@/components/home/RenzenHomePage";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { bookOnlineDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createStaticPageMetadata({
  title: liveStyleTitle(
    "Rengøring",
    `Book nemt og trygt hos Renzen · intro fra ${INTRO_CLEANING_FROM_KR} kr.`,
  ),
  description: bookOnlineDescription(),
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <RenzenHomePage />
    </>
  );
}
