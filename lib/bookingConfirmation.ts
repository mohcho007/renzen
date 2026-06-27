export const BOOKING_CONFIRMATION_STORAGE_KEY = "renzen_booking_confirmation";

const STALENESS_MS = 30 * 60 * 1000;

export type BookingConfirmationExtra = {
  id: string;
  label: string;
  price: number;
  quantity: number;
};

export type BookingConfirmationSource = "book2" | "flyt" | "airbnb";

export type BookingConfirmationPayload = {
  bookingId: string;
  source: BookingConfirmationSource;
  firstName: string;
  email: string;
  date: string;
  timeSlot: string;
  address: string;
  postcode: string;
  city: string;
  frequency: string;
  frequencyId: string;
  squareMeters: number;
  isKlub: boolean;
  totalTodayKr: number;
  recurringKr?: number;
  extras: BookingConfirmationExtra[];
  boligstandLabel?: string;
  boligstandSurchargeKr?: number;
  standLabel?: string;
  serviceLabel: string;
  createdAt: string;
};

export const BOOKING_CONFIRMATION_PREVIEW_PAYLOAD: BookingConfirmationPayload = {
  bookingId: "RZ-482917",
  source: "book2",
  firstName: "Mette",
  email: "mette.hansen@example.dk",
  date: "2026-07-14",
  timeSlot: "10:00",
  address: "Nørrebrogade 42",
  postcode: "2200",
  city: "København N",
  frequency: "Hver 2. uge",
  frequencyId: "22",
  squareMeters: 95,
  isKlub: true,
  totalTodayKr: 813,
  recurringKr: 679,
  extras: [
    { id: "52", label: "Køleskab indvendigt", price: 215, quantity: 1 },
    { id: "217", label: "Køkkenskabe indvendigt", price: 35, quantity: 4 },
  ],
  boligstandLabel: "Trænger til ekstra tid",
  boligstandSurchargeKr: 199,
  serviceLabel: "Hver 2. uge",
  createdAt: "2026-06-23T10:00:00.000Z",
};

function isBookingConfirmationSource(
  value: unknown,
): value is BookingConfirmationSource {
  return value === "book2" || value === "flyt" || value === "airbnb";
}

function isValidPayload(value: unknown): value is BookingConfirmationPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as BookingConfirmationPayload;
  return (
    typeof payload.bookingId === "string" &&
    isBookingConfirmationSource(payload.source) &&
    typeof payload.firstName === "string" &&
    typeof payload.createdAt === "string"
  );
}

function isStale(createdAt: string): boolean {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return true;
  return Date.now() - created > STALENESS_MS;
}

export function saveBookingConfirmation(payload: BookingConfirmationPayload) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      BOOKING_CONFIRMATION_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // sessionStorage may be unavailable in private mode
  }
}

export function hasBookingConfirmation(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_STORAGE_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidPayload(parsed)) return false;
    return !isStale(parsed.createdAt);
  } catch {
    return false;
  }
}

export function consumeBookingConfirmation(): BookingConfirmationPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_STORAGE_KEY);
    sessionStorage.removeItem(BOOKING_CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidPayload(parsed) || isStale(parsed.createdAt)) return null;
    return parsed;
  } catch {
    return null;
  }
}
