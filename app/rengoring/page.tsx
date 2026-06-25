import type { Metadata } from "next";
import { RengoringHubPage } from "@/components/rengoring/RengoringHubPage";
import { constructMetadata } from "@/lib/seo";
import {
  introCleaningDescription,
  introPriceHook,
  liveStyleTitle,
} from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Rengøring", `${introPriceHook()} · beregn pris`),
  description: introCleaningDescription("rengøring"),
  path: "/rengoring/",
  indexable: true,
});

export default function Page() {
  return <RengoringHubPage />;
}
