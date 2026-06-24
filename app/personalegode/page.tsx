import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages.personalegode;

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Rengøring som personalegode", "Få tilbud inden 24 timer"),
  description: inquiryDescription("rengøring som personalegode"),
  path: "/personalegode/",
  indexable: true,
});

function PersonalegodeStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Rengøring som personalegode",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Rengøring som medarbejderfordel med fast aftale eller løbende ordning — inkl. Renzen Klub og servicefradrag.",
    url: `${siteConfig.origin}/personalegode/`,
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
      <PersonalegodeStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
