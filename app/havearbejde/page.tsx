import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages.havearbejde;

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Havearbejde", "Få tilbud inden 24 timer"),
  description: inquiryDescription("havearbejde"),
  path: "/havearbejde/",
  indexable: true,
});

function HavearbejdeStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Havearbejde",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel havehjælp med græsslåning, hækklipning, lugning og havepleje.",
    url: `${siteConfig.origin}/havearbejde/`,
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
      <HavearbejdeStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
