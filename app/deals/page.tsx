import type { Metadata } from "next";
import RenzenDealsHubPage from "@/components/deals/RenzenDealsHubPage";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { constructMetadata } from "@/lib/seo";
import { liveStyleDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Renzen tilbud",
    `Intro fra ${INTRO_CLEANING_FROM_KR} kr. · se alle deals`,
  ),
  description: liveStyleDescription({
    action: "Alle Renzen-tilbud samlet.",
    proof: `Intro fra ${INTRO_CLEANING_FROM_KR} kr., flyt + rengøring, Zen-kreditter og sæsonrabatter.`,
    cta: "Sammenlign fordele og book det, der passer dig.",
  }),
  path: "/deals/",
  indexable: true,
});

function DealsHubStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Renzen Deals Hub",
    description:
      "Overblik over tilbud, rabatkoder og Renzen Klub-fordele på rengøring, flyt og havearbejde.",
    url: `${siteConfig.origin}/deals/`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function DealsPage() {
  return (
    <>
      <DealsHubStructuredData />
      <RenzenDealsHubPage />
    </>
  );
}
