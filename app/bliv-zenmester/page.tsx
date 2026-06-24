import type { Metadata } from "next";
import { BlivZenmesterPage } from "@/components/bliv-zenmester/BlivZenmesterPage";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createStaticPageMetadata({
  title: "Bliv Zenmester — Arbejd med Renzen",
  description:
    "Bliv Zenmester-partner hos Renzen. Få adgang til kunder og booking — og behold 70% af omsætningen. Ansøg online i dag.",
  path: "/bliv-zenmester",
});

export default function Page() {
  return <BlivZenmesterPage />;
}
