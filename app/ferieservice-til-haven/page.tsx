import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages["ferieservice-til-haven"];

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Ferieservice til haven", "Få tilbud inden 24 timer"),
  description: inquiryDescription("ferieservice til haven"),
  path: "/ferieservice-til-haven/",
  indexable: true,
});

function FerieserviceStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Ferieservice til haven",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Havepasning og tilsyn mens du er på ferie — vanding, græs og pleje.",
    url: `${siteConfig.origin}/ferieservice-til-haven/`,
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
      <FerieserviceStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
