import type { Metadata } from "next";
import { ErhvervsrengoringHubPage } from "@/components/erhvervsrengoring/ErhvervsrengoringHubPage";
import { constructMetadata } from "@/lib/seo";
import { liveStyleDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Erhvervsrengøring", "Få skræddersyet tilbud"),
  description: liveStyleDescription({
    action:
      "Rent kontor, butik eller klinik med faste tider og erfarne Zenmestre.",
    proof: "Skræddersyede aftaler til jeres lokaler.",
    cta: "Få uforpligtende tilbud inden for 24 timer.",
  }),
  path: "/erhvervsrengoring/",
  indexable: true,
});

export default function Page() {
  return <ErhvervsrengoringHubPage />;
}
