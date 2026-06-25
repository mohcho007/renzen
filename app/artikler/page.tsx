import type { Metadata } from "next";
import { ArtiklerHubPage } from "@/components/artikler/ArtiklerHubPage";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Artikler ⇒ Guides til rengøring og hjemmet",
  description:
    "Læs Renzens artikler om rengøring, servicefradrag, flytterengøring og praktiske tips til et lettere hjem.",
  path: "/artikler/",
  indexable: true,
});

export default function Page() {
  return <ArtiklerHubPage />;
}
