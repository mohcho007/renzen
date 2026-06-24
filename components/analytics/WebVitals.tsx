"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVital } from "@/lib/analytics";

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVital({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
    });
  });

  return null;
}

