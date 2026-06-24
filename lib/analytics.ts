export type AnalyticsEvent =
  | {
      name: "quote_start";
      source: string;
      service?: string;
      customerType?: string;
    }
  | {
      name: "quote_validation_error";
      source: string;
      field: "postalCode";
    }
  | {
      name: "quote_handoff";
      source: string;
      service?: string;
      customerType?: string;
    }
  | {
      name: "cta_click";
      source: string;
      destination: "quote" | "login" | "company_signup";
    }
  | {
      name: "geolocation_result";
      source: string;
      outcome: "success" | "denied" | "unavailable" | "error";
    }
  | {
      name: "runtime_error";
      boundary: "route" | "global";
      digest?: string;
    }
  | {
      name: "booking_complete";
      booking_id: string;
      source: string;
      value: number;
      currency: "DKK";
      klub: boolean;
      frequency: string;
      square_meters: number;
      item_count: number;
    };

export type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  rating?: string;
  navigationType?: string;
};

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  reportWebVital(metric: WebVitalMetric): void;
}

const providers = new Set<AnalyticsProvider>();

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  providers.add(provider);
  return () => {
    providers.delete(provider);
  };
}

export function track(event: AnalyticsEvent) {
  providers.forEach((provider) => provider.track(event));
}

export function reportWebVital(metric: WebVitalMetric) {
  providers.forEach((provider) => provider.reportWebVital(metric));
}

