import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const config = serviceInquiryPages.kontorrengoring;

import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Kontorrengøring",
    "Få tilbud til virksomheder",
  ),
  description: inquiryDescription("kontorrengøring"),
  path: "/kontorrengoring/",
  indexable: true,
});

function KontorrengoringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kontorrengøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel kontorrengøring med fleksible aftaler til erhverv — daglig, ugentlig eller månedlig rengøring.",
    url: `${siteConfig.origin}/kontorrengoring/`,
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
      <KontorrengoringStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
