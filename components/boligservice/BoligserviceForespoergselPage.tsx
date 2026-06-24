"use client";

import { Suspense } from "react";
import { BoligserviceInquiryWizard } from "@/components/service-inquiry/BoligserviceInquiryWizard";
import {
  boligservicePages,
  type BoligserviceSlug,
} from "@/components/boligservice/boligserviceContent";

type BoligserviceForespoergselPageProps = {
  slug: BoligserviceSlug;
};

function BoligserviceForespoergselWizard({
  slug,
}: BoligserviceForespoergselPageProps) {
  const config = boligservicePages[slug];

  return (
    <BoligserviceInquiryWizard
      serviceSlug={slug}
      serviceName={config.serviceName}
      embedded={false}
    />
  );
}

export function BoligserviceForespoergselPage({
  slug,
}: BoligserviceForespoergselPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] text-[#1a3328]">
          Henter forespørgsel…
        </div>
      }
    >
      <BoligserviceForespoergselWizard slug={slug} />
    </Suspense>
  );
}
