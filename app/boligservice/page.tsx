import type { Metadata } from "next";
import { BoligserviceHubPage } from "@/components/boligservice/BoligserviceHubPage";
import { constructMetadata } from "@/lib/seo";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Boligservice", "Praktisk hjælp · få tilbud"),
  description: inquiryDescription("boligservice"),
  path: "/boligservice/",
  indexable: true,
});

export default function Page() {
  return <BoligserviceHubPage />;
}
