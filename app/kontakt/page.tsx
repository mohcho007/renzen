import type { Metadata } from "next";
import { KontaktPage } from "@/components/kontakt/KontaktPage";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createStaticPageMetadata({
  title: "Kontakt os — Renzen",
  description:
    "Ring, skriv eller send en besked til Renzen. Personlig kundeservice om booking, priser, forsikring og Renzen Klub — med tilfredshedsgaranti.",
  path: "/kontakt",
});

export default function Page() {
  return <KontaktPage />;
}
