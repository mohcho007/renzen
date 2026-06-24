import type { Metadata } from "next";
import { Suspense } from 'react';
import DealsideLandingPage from '@/components/dealside/DealsideLandingPage';
import { ZEN_CREDIT_ANNUAL_KR } from "@/data/pricing";
import { introCleaningDescription, klubIntroTitle } from "@/lib/metadataCopy";
import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createStaticPageMetadata({
  title: klubIntroTitle("vælg bolig"),
  description: `${introCleaningDescription("rengøring")} Op til ${ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. i Zen-kreditter og medlemsrabat.`,
  path: "/klub/",
});

export default function KlubPage() {
  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#17251f] font-sans">
      <Suspense fallback={<div className="text-center p-10">Henter Renzen Klub...</div>}>
        <DealsideLandingPage />
      </Suspense>
    </div>
  );
}
