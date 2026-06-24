import { L27_API_PATH } from "@/lib/urls";
import type { L27Spot } from "@/lib/l27Spots";

export type L27ClientResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data: {
    success: boolean;
    data?: T;
    message?: string;
    details?: unknown;
  };
};

const MAX_SPOTS_DAYS_PER_REQUEST = 7;

export async function postL27<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<L27ClientResponse<T>> {
  const response = await fetch(L27_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });

  let data: L27ClientResponse<T>["data"];
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: "Ugyldigt svar fra booking-API." };
  }

  if (!response.ok || !data.success) {
    console.warn(`[L27] ${action} failed`, {
      status: response.status,
      message: data.message,
      details: data.details,
    });
  }

  return { ok: response.ok && !!data.success, status: response.status, data };
}

export type L27SpotsDay = { date?: string; spots?: unknown[] };

function nextDateYmd(dateYmd: string) {
  const next = new Date(`${dateYmd}T12:00:00`);
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

export async function fetchL27SpotsRange(date: string, days: number) {
  const cache: Record<string, L27Spot[]> = {};
  let cursor = date;
  let remaining = days;

  while (remaining > 0) {
    const chunkDays = Math.min(remaining, MAX_SPOTS_DAYS_PER_REQUEST);
    const result = await postL27<L27SpotsDay[]>("spots", {
      date: cursor,
      days: chunkDays,
    });

    if (!result.ok || !Array.isArray(result.data.data)) {
      if (Object.keys(cache).length === 0) {
        return { ok: false as const, cache: {} as Record<string, L27Spot[]> };
      }
      break;
    }

    result.data.data.forEach((day) => {
      if (day?.date && Array.isArray(day.spots)) {
        cache[day.date] = day.spots as L27Spot[];
      }
    });

    const lastDay = result.data.data[result.data.data.length - 1];
    if (!lastDay?.date) break;

    cursor = nextDateYmd(lastDay.date);
    remaining -= chunkDays;
  }

  return {
    ok: Object.keys(cache).length > 0,
    cache,
  };
}
