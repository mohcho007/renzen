import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages.boligforeninger;

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Rengøring til boligforeninger", "Få tilbud inden 24 timer"),
  description: inquiryDescription("rengøring til boligforeninger"),
  path: "/boligforeninger/",
  indexable: true,
});

function BoligforeningerStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Rengøring til boligforeninger",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Trappevask, opgange og fællesarealer til boligforeninger med faste intervaller eller engangsopgaver.",
    url: `${siteConfig.origin}/boligforeninger/`,
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
      <BoligforeningerStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
