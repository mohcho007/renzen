import type { Metadata } from "next";
import { BoligserviceForespoergselPage } from "@/components/boligservice/BoligserviceForespoergselPage";
import { boligservicePages } from "@/components/boligservice/boligserviceContent";
import { constructMetadata } from "@/lib/seo";
import { forespoergselTitle } from "@/lib/metadataCopy";

const config = boligservicePages["montering-og-ophaengning"];

export const metadata: Metadata = constructMetadata({
  title: forespoergselTitle(config.serviceName),
  description: config.formDescription,
  path: "/montering-og-ophaengning/forespoergsel/",
  indexable: false,
});

export default function Page() {
  return (
    <BoligserviceForespoergselPage slug="montering-og-ophaengning" />
  );
}
