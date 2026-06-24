import type { Metadata } from "next";
import { FlytterengoringPage } from "@/components/flytterengoring/FlytterengoringPage";
import { liveStyleDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Flytterengøring",
    "Klar til flyttesyn · beregn pris",
  ),
  description: liveStyleDescription({
    action: "Professionel flytterengøring ved ind- og fraflytning.",
    proof: "Tjekliste, tilfredshedsgaranti og fast pris online.",
    cta: "Se din pris og book flytterengøring.",
  }),
  path: "/flytterengoring/",
  indexable: true,
});

function FlytterengoringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Flytterengøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel flytterengøring ved fraflytning eller indflytning med tilfredshedsgaranti.",
    url: `${siteConfig.origin}/flytterengoring/`,
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

export default function Page() {
  return (
    <>
      <FlytterengoringStructuredData />
      <FlytterengoringPage />
    </>
  );
}
