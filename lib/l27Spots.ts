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

const FLEX_MIN_ARRIVAL_WINDOW = 240;

function parseSpotInt(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getL27SpotTime(
  spot: L27Spot,
): { hour: number; minute: number } | null {
  const hour = parseSpotInt(spot.start_hour ?? spot.hours ?? spot.hour);
  const minute =
    parseSpotInt(spot.start_minute ?? spot.minutes ?? spot.minute) ?? 0;
  if (hour === null) return null;
  return { hour, minute };
}

export function getL27SpotArrivalWindow(spot: L27Spot): number {
  return parseSpotInt(spot.arrival_window) ?? 0;
}

function formatSlotLabel(startMin: number, endMin: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const startHour = Math.floor(startMin / 60);
  const startMinute = startMin % 60;
  const endHour = Math.floor((endMin % 1440) / 60);
  const endMinute = endMin % 60;
  return `${pad(startHour)}:${pad(startMinute)} – ${pad(endHour)}:${pad(endMinute)}`;
}

function formatSpotLabel(hour: number, minute: number, arrivalWindow: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  if (arrivalWindow === 0) {
    return `${pad(hour)}:${pad(minute)}`;
  }
  const startMin = hour * 60 + minute;
  return formatSlotLabel(startMin, startMin + arrivalWindow);
}

function slotKey(
  slot: Pick<L27BookableSlot, "startHour" | "startMinute" | "arrivalWindow">,
) {
  return `${slot.startHour}-${slot.startMinute}-${slot.arrivalWindow}`;
}

function spotToBookableSlot(spot: L27Spot): L27BookableSlot | null {
  const time = getL27SpotTime(spot);
  if (!time) return null;

  const arrivalWindow = getL27SpotArrivalWindow(spot);
  return {
    startHour: time.hour,
    startMinute: time.minute,
    label: formatSpotLabel(time.hour, time.minute, arrivalWindow),
    arrivalWindow,
    spot,
  };
}

export function normalizeL27SpotsToSlots(spots: L27Spot[]) {
  const empty = {
    morningSlots: [] as L27BookableSlot[],
    afternoonSlots: [] as L27BookableSlot[],
    allDaySlot: null as L27BookableSlot | null,
  };

  const freeSpots = spots.filter((spot) => spot.free && !spot.past);
  if (freeSpots.length === 0) return empty;

  const seen = new Set<string>();
  const slots: L27BookableSlot[] = [];

  freeSpots.forEach((spot) => {
    const slot = spotToBookableSlot(spot);
    if (!slot) return;
    const key = slotKey(slot);
    if (seen.has(key)) return;
    seen.add(key);
    slots.push(slot);
  });

  slots.sort(
    (a, b) =>
      a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute),
  );

  const flexCandidates = slots.filter(
    (slot) => slot.arrivalWindow >= FLEX_MIN_ARRIVAL_WINDOW,
  );
  const allDaySlot = flexCandidates.reduce<L27BookableSlot | null>(
    (best, slot) =>
      !best || slot.arrivalWindow > best.arrivalWindow ? slot : best,
    null,
  );

  const rest = allDaySlot
    ? slots.filter((slot) => slotKey(slot) !== slotKey(allDaySlot))
    : slots;

  const noon = 12 * 60;
  return {
    morningSlots: rest.filter(
      (slot) => slot.startHour * 60 + slot.startMinute < noon,
    ),
    afternoonSlots: rest.filter(
      (slot) => slot.startHour * 60 + slot.startMinute >= noon,
    ),
    allDaySlot,
  };
}

export function isBookableSlotInSpots(
  spots: L27Spot[],
  selected: Pick<L27BookableSlot, "startHour" | "startMinute" | "arrivalWindow">,
) {
  return spots.some((spot) => {
    if (!spot.free || spot.past) return false;
    const time = getL27SpotTime(spot);
    if (!time) return false;
    const arrivalWindow = getL27SpotArrivalWindow(spot);
    return (
      time.hour === selected.startHour &&
      time.minute === selected.startMinute &&
      arrivalWindow === selected.arrivalWindow
    );
  });
}
