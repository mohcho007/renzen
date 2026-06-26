import {
  L27_BOOK_PRICING_PARAM_ID,
  L27_BOOK_SERVICE_ID,
} from "@/lib/bookCleaningL27";
import { listPriceKr } from "@/data/pricing";

/** Launch27 engangs frequency for book-rengoering service 246. */
export const AIRBNB_L27_FREQUENCY_ID = 1;

function buildEstimateServiceDate(preferredDate?: string): string {
  if (preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    const preferred = new Date(`${preferredDate}T10:00:00`);
    if (!Number.isNaN(preferred.getTime()) && preferred.getTime() >= Date.now()) {
      return `${preferredDate}T10:00:00`;
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const d = String(tomorrow.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T10:00:00`;
}

export function fallbackAirbnbEngangsPriceKr(sqm: number): number {
  return Math.round(listPriceKr(sqm));
}

export async function fetchAirbnbEngangsEstimateKr(
  sqm: number,
  preferredDate?: string,
): Promise<{ priceKr: number; source: "l27" | "fallback" }> {
  const subdomain = process.env.LAUNCH27_SUBDOMAIN;
  const apiKey = process.env.LAUNCH27_API_KEY;

  if (!subdomain || !apiKey || sqm < 20) {
    return { priceKr: fallbackAirbnbEngangsPriceKr(sqm), source: "fallback" };
  }

  try {
    const response = await fetch(
      `https://${subdomain}.launch27.com/v1/booking/estimate_price`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          service_date: buildEstimateServiceDate(preferredDate),
          frequency_id: AIRBNB_L27_FREQUENCY_ID,
          services: [
            {
              id: L27_BOOK_SERVICE_ID,
              pricing_parameters: [
                {
                  id: L27_BOOK_PRICING_PARAM_ID,
                  quantity: Math.round(sqm),
                },
              ],
              extras: [],
            },
          ],
        }),
        cache: "no-store",
      },
    );

    const data = await response.json();
    const total = Number(data?.total);
    if (response.ok && Number.isFinite(total) && total > 0) {
      return { priceKr: Math.round(total), source: "l27" };
    }
  } catch (error) {
    console.error("[airbnb-inquiry] L27 estimate failed:", error);
  }

  return { priceKr: fallbackAirbnbEngangsPriceKr(sqm), source: "fallback" };
}
