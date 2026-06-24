export type L27Spot = {
  free: boolean;
  past: boolean;
  start_hour?: number;
  hours?: number;
  hour?: number;
  start_minute?: number;
  minutes?: number;
  minute?: number;
  arrival_window?: number;
};

export type L27BookableSlot = {
  startHour: number;
  startMinute: number;
  label: string;
  arrivalWindow: number;
  spot: L27Spot;
};

function parseSpotInt(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getL27SpotTime(
  spot: L27Spot,
): { hour: number; minute: number } | null {
  const hour = parseSpotInt(spot.start_hour ?? spot.hours ?? spot.hour);
  const minute = parseSpotInt(spot.start_minute ?? spot.minutes ?? spot.minute) ?? 0;
  if (hour === null) return null;
  return { hour, minute };
}

function formatSlotLabel(startMin: number, endMin: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const startHour = Math.floor(startMin / 60);
  const startMinute = startMin % 60;
  const endHour = Math.floor((endMin % 1440) / 60);
  const endMinute = endMin % 60;
  return `${pad(startHour)}:${pad(startMinute)} – ${pad(endHour)}:${pad(endMinute)}`;
}

function inferArrivalWindowMinutes(spot: L27Spot, freeSpots: L27Spot[]) {
  const time = getL27SpotTime(spot);
  if (!time) return 60;

  const rawWindow = parseSpotInt(spot.arrival_window) ?? 0;
  if (rawWindow > 0) return rawWindow;

  const startMin = time.hour * 60 + time.minute;
  const nextStart = freeSpots
    .map((candidate) => getL27SpotTime(candidate))
    .filter((candidate): candidate is { hour: number; minute: number } => !!candidate)
    .map((candidate) => candidate.hour * 60 + candidate.minute)
    .filter((candidateMin) => candidateMin > startMin)
    .sort((a, b) => a - b)[0];

  return nextStart ? Math.max(60, nextStart - startMin) : 60;
}

export function normalizeL27SpotsToSlots(spots: L27Spot[]) {
  const empty = {
    morningSlots: [] as L27BookableSlot[],
    afternoonSlots: [] as L27BookableSlot[],
    allDaySlot: null as L27BookableSlot | null,
  };

  const freeSpots = spots.filter((spot) => spot.free && !spot.past);
  if (freeSpots.length === 0) return empty;

  const slots: L27BookableSlot[] = [];
  const seen = new Set<string>();

  freeSpots.forEach((spot) => {
    const time = getL27SpotTime(spot);
    if (!time) return;

    const startMin = time.hour * 60 + time.minute;
    const windowMin = inferArrivalWindowMinutes(spot, freeSpots);
    const endMin = startMin + windowMin;
    const key = `${startMin}-${endMin}`;
    if (seen.has(key)) return;
    seen.add(key);

    const rawWindow = parseSpotInt(spot.arrival_window) ?? 0;
    slots.push({
      startHour: time.hour,
      startMinute: time.minute,
      label: formatSlotLabel(startMin, endMin),
      arrivalWindow: rawWindow > 0 ? rawWindow : windowMin,
      spot,
    });
  });

  slots.sort(
    (a, b) =>
      a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute),
  );

  const widestSlot = slots.reduce<L27BookableSlot | null>((best, slot) => {
    if (
      !best ||
      slot.arrivalWindow > best.arrivalWindow ||
      (slot.arrivalWindow === best.arrivalWindow &&
        slot.startHour * 60 + slot.startMinute <
          best.startHour * 60 + best.startMinute)
    ) {
      return slot;
    }
    return best;
  }, null);

  const allDayStart = widestSlot
    ? widestSlot.startHour * 60 + widestSlot.startMinute
    : -1;
  const allDayEnd = widestSlot ? allDayStart + widestSlot.arrivalWindow : -1;
  const rest = slots.filter((slot) => {
    const start = slot.startHour * 60 + slot.startMinute;
    const end = start + slot.arrivalWindow;
    return !widestSlot || !(start === allDayStart && end === allDayEnd);
  });

  const noon = 12 * 60;
  return {
    morningSlots: rest.filter(
      (slot) => slot.startHour * 60 + slot.startMinute < noon,
    ),
    afternoonSlots: rest.filter(
      (slot) => slot.startHour * 60 + slot.startMinute >= noon,
    ),
    allDaySlot: widestSlot,
  };
}

export function isBookableSlotInSpots(
  spots: L27Spot[],
  selected: Pick<L27BookableSlot, "startHour" | "startMinute" | "arrivalWindow">,
) {
  const normalized = normalizeL27SpotsToSlots(spots);
  const candidates = [
    ...normalized.morningSlots,
    ...normalized.afternoonSlots,
    ...(normalized.allDaySlot ? [normalized.allDaySlot] : []),
  ];

  return candidates.some(
    (slot) =>
      slot.startHour === selected.startHour &&
      slot.startMinute === selected.startMinute &&
      slot.arrivalWindow === selected.arrivalWindow,
  );
}
