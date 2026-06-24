"use client";

import { Suspense } from "react";
import { ServiceInquiryWizard } from "@/components/service-inquiry/ServiceInquiryWizard";
import type { ServiceInquiryPageConfig } from "@/components/service-inquiry/serviceInquiryContent";

type ServiceInquiryForespoergselPageProps = {
  config: ServiceInquiryPageConfig;
};

function ServiceInquiryForespoergselWizard({
  config,
}: ServiceInquiryForespoergselPageProps) {
  return (
    <ServiceInquiryWizard
      serviceSlug={config.slug}
      serviceName={config.serviceName}
      embedded={false}
    />
  );
}

export function ServiceInquiryForespoergselPage({
  config,
}: ServiceInquiryForespoergselPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] text-[#1a3328]">
          Henter forespørgsel…
        </div>
      }
    >
      <ServiceInquiryForespoergselWizard config={config} />
    </Suspense>
  );
}
