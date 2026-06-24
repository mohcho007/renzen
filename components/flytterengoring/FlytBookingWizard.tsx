"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import { createStripeCardToken } from "@/components/payment/createStripeCardToken";
import { StripeCardInput } from "@/components/payment/StripeCardInput";
import { StripeElementsProvider } from "@/components/payment/StripeElementsProvider";
import {
  ConfirmCard,
  TermsConfirmCard,
} from "@/components/forms/TermsConfirmCard";
import DealSummaryTrustPanel from "@/components/dealside/DealSummaryTrustPanel";
import {
  buildFlytCustomFieldsPayload,
  buildFlytEstimateFingerprint,
  buildFlytExtrasPayload,
  buildFlytReceiptBreakdown,
  normalizeL27EstimateData,
  clampFlytSqm,
  FLYT_ARRIVAL_SLOTS,
  FLYT_DEFAULT_STAND,
  FLYT_ENTRY_OPTIONS,
  FLYT_FREQUENCY_ID,
  FLYT_SQM_DEFAULT,
  FLYT_SQM_MAX,
  FLYT_SQM_MIN,
  FLYT_STANDS,
  formatFlytKr,
  formatFlytReceiptKr,
  getFlytBathroomExtra,
  getFlytBathroomChargeableQty,
  getFlytExtraById,
  getFlytFlyttesynExtra,
  getFlytSmokingExtra,
  getFlytStand,
  getFlytStandByServiceId,
  getFlytStandConfirmationExtra,
  isFlytAllowedArrivalSlot,
  isFlytHiddenL27Extra,
  isFlytL27ServiceId,
  isFlytManagedExtraId,
  type FlytEntryOptionId,
  type L27CustomField,
  type L27EstimateData,
  type L27ExtraItem,
  type L27Service,
} from "@/lib/flytterengoring";
import {
  parseL27BookingError,
  resolveL27BookingId,
} from "@/lib/bookCleaningL27";
import {
  saveBookingConfirmation,
  type BookingConfirmationPayload,
} from "@/lib/bookingConfirmation";
import { serviceDeduction } from "@/lib/serviceDeduction";
import { L27_API_PATH } from "@/lib/urls";

type DawaAdresse = {
  vejnavn: string;
  husnr: string;
  etage?: string | null;
  dør?: string | null;
  postnr: string;
  postnrnavn: string;
};

type DawaAddressSuggestion = {
  tekst: string;
  adresse: DawaAdresse;
};

type TimeSlot = {
  startHour: number;
  startMinute: number;
  label: string;
  arrivalWindow: number;
};

type L27Spot = {
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

const STEPS = [
  "bolig",
  "adresse",
  "dato",
  "adgang",
  "kontakt",
  "betaling",
] as const;

const BATHROOM_PILL_OPTIONS = [1, 2, 3, 4] as const;

const SPOTS_RANGE_DAYS = 42;

function formatStreetAddress(adresse: DawaAdresse) {
  let line = `${adresse.vejnavn} ${adresse.husnr}`;
  if (adresse.etage) line += `, ${adresse.etage}.`;
  if (adresse.dør) line += ` ${adresse.dør}`;
  return line;
}

function toLocalYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getSpotTime(spot: L27Spot) {
  const hour = spot.start_hour ?? spot.hours ?? spot.hour ?? 0;
  const minute = spot.start_minute ?? spot.minutes ?? spot.minute ?? 0;
  return { hour, minute };
}

function getSpotLabel(spot: L27Spot) {
  const { hour, minute } = getSpotTime(spot);
  const startMin = hour * 60 + minute;
  const windowMin = spot.arrival_window || 60;
  const endMin = startMin + windowMin;
  const endHour = Math.floor((endMin % 1440) / 60);
  const endMinute = endMin % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hour)}:${pad(minute)} – ${pad(endHour)}:${pad(endMinute)}`;
}

function nextWeekdays(weekOffset: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  const weekdays: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekdays.push(d);
  }
  return weekdays;
}

function isDateInPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function getMaxBookableDate() {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setDate(max.getDate() + SPOTS_RANGE_DAYS - 1);
  return max;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getMondayOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

function getWeekOffsetForDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = getMondayOfWeek(today);
  const selectedMonday = getMondayOfWeek(date);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round(
    (selectedMonday.getTime() - currentMonday.getTime()) / msPerWeek,
  );
}

function getDaysInMonth(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  let startDow = firstOfMonth.getDay();
  startDow = (startDow + 6) % 7;

  const startDate = new Date(year, month, 1);
  startDate.setDate(startDate.getDate() - startDow);

  const days: Date[] = [];
  const current = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function spotToTimeSlot(spot: L27Spot): TimeSlot {
  const { hour, minute } = getSpotTime(spot);
  const arrivalWindow = spot.arrival_window || 60;
  const canonical = FLYT_ARRIVAL_SLOTS.find(
    (slot) =>
      slot.startHour === hour &&
      slot.startMinute === minute &&
      slot.arrivalWindow === arrivalWindow,
  );
  return {
    startHour: hour,
    startMinute: minute,
    label: canonical?.label ?? getSpotLabel(spot),
    arrivalWindow,
  };
}

function isFlytSqmInputValid(value: string) {
  const parsed = parseInt(value, 10);
  return (
    !Number.isNaN(parsed) &&
    parsed >= FLYT_SQM_MIN &&
    parsed <= FLYT_SQM_MAX
  );
}

function parseInitialState(searchParams: URLSearchParams) {
  const serviceId = Number(searchParams.get("service_id") || "0");
  const standFromService = serviceId
    ? getFlytStandByServiceId(serviceId)?.level
    : undefined;
  const stand = Number(
    searchParams.get("stand") || standFromService || FLYT_DEFAULT_STAND,
  );
  const sqm = clampFlytSqm(
    Number(
      searchParams.get("sqm") ||
        searchParams.get("pricing_param_quantity") ||
        FLYT_SQM_DEFAULT,
    ),
  );

  return {
    stand: getFlytStand(stand).level,
    sqm,
  };
}

export default function FlytBookingWizard() {
  return (
    <StripeElementsProvider>
      <FlytBookingWizardForm />
    </StripeElementsProvider>
  );
}

function FlytBookingWizardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => parseInitialState(searchParams),
    [searchParams],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const [sqm, setSqm] = useState(initial.sqm);
  const [sqmDraft, setSqmDraft] = useState(String(initial.sqm));
  const isSqmValid = isFlytSqmInputValid(sqmDraft);
  const [standLevel, setStandLevel] = useState(initial.stand);
  const stand = useMemo(() => getFlytStand(standLevel), [standLevel]);
  const standConfirmationExtra = useMemo(
    () => getFlytStandConfirmationExtra(standLevel),
    [standLevel],
  );
  const flyttesynExtra = useMemo(
    () => getFlytFlyttesynExtra(standLevel),
    [standLevel],
  );
  const bathroomExtra = useMemo(() => getFlytBathroomExtra(), []);
  const smokingExtra = useMemo(() => getFlytSmokingExtra(), []);

  const [availableExtras, setAvailableExtras] = useState<L27ExtraItem[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>(
    {},
  );

  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    DawaAddressSuggestion[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [spotsCache, setSpotsCache] = useState<Record<string, L27Spot[]>>({});
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const [entryMethod, setEntryMethod] = useState<FlytEntryOptionId | "">("");
  const [entryOtherDetails, setEntryOtherDetails] = useState("");
  const [flytCustomFields, setFlytCustomFields] = useState<L27CustomField[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [estimateTotal, setEstimateTotal] = useState<number | null>(null);
  const [estimateData, setEstimateData] = useState<L27EstimateData | null>(null);
  const [estimateForFingerprint, setEstimateForFingerprint] = useState<
    string | null
  >(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { visibleDynamicExtras, hiddenMandatoryExtras } = useMemo(() => {
    const visible: L27ExtraItem[] = [];
    const hidden: L27ExtraItem[] = [];

    availableExtras.forEach((extra) => {
      if (isFlytManagedExtraId(extra.id) || isFlytHiddenL27Extra(extra)) {
        if (extra.mandatory) hidden.push(extra);
        return;
      }
      if (extra.mandatory) {
        hidden.push(extra);
        return;
      }
      visible.push(extra);
    });

    return { visibleDynamicExtras: visible, hiddenMandatoryExtras: hidden };
  }, [availableExtras]);

  const bathroomQty = selectedExtras[String(bathroomExtra.id)] ?? 0;
  const standConfirmed = standConfirmationExtra
    ? !!selectedExtras[String(standConfirmationExtra.id)]
    : false;
  const flyttesynAccepted = flyttesynExtra
    ? !!selectedExtras[String(flyttesynExtra.id)]
    : true;
  const smokingSelected = !!selectedExtras[String(smokingExtra.id)];

  const maxBookableDate = useMemo(() => getMaxBookableDate(), []);
  const weekdayDates = useMemo(() => nextWeekdays(weekOffset), [weekOffset]);
  const maxWeekOffset = useMemo(
    () => Math.max(0, getWeekOffsetForDate(maxBookableDate)),
    [maxBookableDate],
  );
  const spotsLoaded = Object.keys(spotsCache).length > 0;

  const calendarDays = useMemo(() => getDaysInMonth(viewDate), [viewDate]);
  const calendarMonthLabel = viewDate.toLocaleDateString("da-DK", {
    month: "long",
    year: "numeric",
  });

  const selectedDateOutsideWeek = useMemo(() => {
    if (!selectedDate) return false;
    return !weekdayDates.some((d) => toLocalYmd(d) === selectedDate);
  }, [selectedDate, weekdayDates]);

  const weekLabel = useMemo(() => {
    const monday = weekdayDates[0];
    if (!monday) return "";
    const month = monday.toLocaleDateString("da-DK", { month: "long" });
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    if (weekOffset === 0) return `${capitalized} · denne uge`;
    if (weekOffset === 1) return `${capitalized} · næste uge`;
    return `${capitalized} · om ${weekOffset} uger`;
  }, [weekdayDates, weekOffset]);

  const estimateFingerprint = useMemo(
    () =>
      buildFlytEstimateFingerprint({
        sqm,
        serviceId: stand.serviceId,
        pricingParamId: stand.pricingParamId,
        selectedExtras,
        hiddenMandatoryExtras,
      }),
    [
      sqm,
      stand.serviceId,
      stand.pricingParamId,
      selectedExtras,
      hiddenMandatoryExtras,
    ],
  );

  const estimateReady =
    !isEstimating && estimateForFingerprint === estimateFingerprint;

  const receipt = useMemo(
    () =>
      buildFlytReceiptBreakdown({
        sqm,
        stand,
        selectedExtras,
        availableExtras,
        estimateTotal,
        estimateData,
        isEstimating,
        estimateReady,
      }),
    [
      sqm,
      stand,
      selectedExtras,
      availableExtras,
      estimateTotal,
      estimateData,
      isEstimating,
      estimateReady,
    ],
  );

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [stepIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const parsed = new Date(selectedDate + "T12:00:00");
    if (Number.isNaN(parsed.getTime())) return;
    const offset = getWeekOffsetForDate(parsed);
    if (offset >= 0) {
      setWeekOffset(offset);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!showCalendar) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  useEffect(() => {
    if (!detailsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [detailsOpen]);

  useEffect(() => {
    return () => {
      if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    setSelectedExtras((prev) => {
      const key = String(bathroomExtra.id);
      if ((prev[key] ?? 0) >= 1) return prev;
      return { ...prev, [key]: bathroomExtra.defaultQuantity ?? 1 };
    });
  }, [bathroomExtra]);

  useEffect(() => {
    setSelectedExtras((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of [87, 88, 89, 90, 91, 92]) {
        if (next[String(id)] !== undefined) {
          delete next[String(id)];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [standLevel]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingExtras(true);
      try {
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "services" }),
        });
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const service = (resData.data as L27Service[]).find(
            (item) => item.id === stand.serviceId,
          );
          const extras = (service?.extras ?? []).map((extra) => ({
            id: extra.id,
            name: extra.name,
            price: Number(extra.price) || 0,
            quantity_based: !!extra.quantity_based,
            mandatory: !!extra.mandatory,
            recurring: !!extra.recurring,
          }));
          setAvailableExtras(extras);
        } else {
          setAvailableExtras([]);
        }
      } catch {
        setAvailableExtras([]);
      } finally {
        setLoadingExtras(false);
      }
    };

    fetchServices();
  }, [stand.serviceId]);

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "custom_fields" }),
        });
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          setFlytCustomFields(resData.data as L27CustomField[]);
        }
      } catch {
        /* optional — booking still works without L27 custom field mapping */
      }
    };

    fetchCustomFields();
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      setLoadingSpots(true);
      try {
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "spots",
            date: toLocalYmd(new Date()),
            days: SPOTS_RANGE_DAYS,
          }),
        });
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const cache: Record<string, L27Spot[]> = {};
          resData.data.forEach((day: { date?: string; spots?: L27Spot[] }) => {
            if (day?.date && Array.isArray(day.spots)) {
              cache[day.date] = day.spots;
            }
          });
          setSpotsCache(cache);
        }
      } catch {
        /* fallback — dates remain selectable */
      } finally {
        setLoadingSpots(false);
      }
    };
    fetchSpots();
  }, []);

  const freeSpotsForDate = useCallback(
    (dateStr: string) => {
      const spots = spotsCache[dateStr] || [];
      return spots.filter((spot) => {
        if (!spot.free || spot.past) return false;
        const { hour, minute } = getSpotTime(spot);
        const arrivalWindow = spot.arrival_window || 60;
        return isFlytAllowedArrivalSlot(hour, minute, arrivalWindow);
      });
    },
    [spotsCache],
  );

  const isDateBookable = useCallback(
    (date: Date) => {
      if (!isWeekday(date) || isDateInPast(date)) return false;
      if (date > maxBookableDate) return false;
      const dateStr = toLocalYmd(date);
      if (!spotsLoaded) return true;
      return freeSpotsForDate(dateStr).length > 0;
    },
    [maxBookableDate, spotsLoaded, freeSpotsForDate],
  );

  const handleCalendarDateSelect = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setShowCalendar(false);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [] as TimeSlot[];

    const spots = freeSpotsForDate(selectedDate);
    if (spots.length === 0) return [];

    const slots = spots.map(spotToTimeSlot);
    const seen = new Set<string>();
    return slots.filter((slot) => {
      if (seen.has(slot.label)) return false;
      seen.add(slot.label);
      return true;
    });
  }, [selectedDate, freeSpotsForDate]);

  useEffect(() => {
    const requestFingerprint = buildFlytEstimateFingerprint({
      sqm,
      serviceId: stand.serviceId,
      pricingParamId: stand.pricingParamId,
      selectedExtras,
      hiddenMandatoryExtras,
    });

    const timer = setTimeout(async () => {
      setIsEstimating(true);
      try {
        const dateStr = selectedDate
          ? `${selectedDate}T${String(selectedSlot?.startHour ?? 10).padStart(2, "0")}:${String(selectedSlot?.startMinute ?? 0).padStart(2, "0")}:00`
          : `${toLocalYmd(new Date(Date.now() + 86400000))}T10:00:00`;

        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "estimate",
            service_id: String(stand.serviceId),
            pricing_param_id: String(stand.pricingParamId),
            pricing_param_quantity: sqm,
            frequency_id: String(FLYT_FREQUENCY_ID),
            service_date: dateStr,
            extras: buildFlytExtrasPayload(selectedExtras, hiddenMandatoryExtras),
          }),
        });
        const resData = await response.json();
        const normalizedEstimate = normalizeL27EstimateData(resData.data);
        if (resData.success && normalizedEstimate?.total !== undefined) {
          setEstimateTotal(normalizedEstimate.total);
          setEstimateData(normalizedEstimate);
          setEstimateForFingerprint(requestFingerprint);
        } else {
          setEstimateTotal(null);
          setEstimateData(null);
          setEstimateForFingerprint(null);
        }
      } catch {
        setEstimateTotal(null);
        setEstimateData(null);
        setEstimateForFingerprint(null);
      } finally {
        setIsEstimating(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [
    sqm,
    stand.serviceId,
    stand.pricingParamId,
    selectedExtras,
    selectedDate,
    selectedSlot,
    hiddenMandatoryExtras,
  ]);

  const handleFlytExtraCheckbox = (extraId: number, checked: boolean) => {
    setSelectedExtras((prev) => {
      const next = { ...prev };
      const key = String(extraId);
      if (checked) next[key] = 1;
      else delete next[key];
      return next;
    });
  };

  const handleSqmInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 3);
    setSqmDraft(cleaned);
    const parsed = parseInt(cleaned, 10);
    if (isFlytSqmInputValid(cleaned)) {
      setSqm(parsed);
    }
  };

  const handleSqmBlur = () => {
    const parsed = parseInt(sqmDraft, 10);
    const next = clampFlytSqm(Number.isFinite(parsed) ? parsed : sqm);
    setSqm(next);
    setSqmDraft(String(next));
  };

  const handleBathroomQtySelect = (qty: number) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [String(bathroomExtra.id)]: Math.max(
        bathroomExtra.minQuantity ?? 1,
        qty,
      ),
    }));
  };

  const handleExtraToggle = (extra: L27ExtraItem) => {
    setSelectedExtras((prev) => {
      const next = { ...prev };
      if (next[String(extra.id)]) {
        delete next[String(extra.id)];
      } else {
        next[String(extra.id)] = 1;
      }
      return next;
    });
  };

  const handleExtraQtyChange = (
    extraId: number,
    delta: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    setSelectedExtras((prev) => {
      const key = String(extraId);
      const current = prev[key] || 0;
      const nextQty = Math.max(0, current + delta);
      const next = { ...prev };
      if (nextQty === 0) delete next[key];
      else next[key] = nextQty;
      return next;
    });
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setZip("");
    setCity("");

    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);

    if (value.trim().length < 2) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    addressDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(value)}&per_side=8`,
        );
        if (res.ok) {
          const data: DawaAddressSuggestion[] = await res.json();
          setAddressSuggestions(data);
          setShowAddressSuggestions(data.length > 0);
        }
      } catch {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
    }, 250);
  };

  const handleAddressSelect = (suggestion: DawaAddressSuggestion) => {
    const { adresse } = suggestion;
    setAddress(formatStreetAddress(adresse));
    setZip(adresse.postnr);
    setCity(adresse.postnrnavn);
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  const canContinue = useMemo(() => {
    switch (step) {
      case "bolig":
        return (
          sqm >= FLYT_SQM_MIN &&
          sqm <= FLYT_SQM_MAX &&
          standConfirmed &&
          flyttesynAccepted &&
          bathroomQty >= (bathroomExtra.minQuantity ?? 1)
        );
      case "adresse":
        return address.trim().length > 2 && zip.length === 4 && city.trim().length > 0;
      case "dato":
        return !!selectedDate && !!selectedSlot;
      case "adgang":
        return (
          !!entryMethod &&
          (entryMethod !== "other" || entryOtherDetails.trim().length > 0)
        );
      case "kontakt":
        return (
          firstName.trim().length > 0 &&
          lastName.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          phone.replace(/\D/g, "").length >= 8
        );
      case "betaling":
        return cardComplete && termsAccepted;
      default:
        return false;
    }
  }, [
    step,
    sqm,
    standConfirmed,
    flyttesynAccepted,
    bathroomQty,
    bathroomExtra,
    address,
    zip,
    city,
    selectedDate,
    selectedSlot,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    cardComplete,
    termsAccepted,
  ]);

  const goNext = useCallback(async () => {
    setError("");
    if (!canContinue) return;

    if (step === "betaling") {
      setIsSubmitting(true);
      try {
        if (!isFlytL27ServiceId(stand.serviceId)) {
          setError(
            "Ugyldig flytterengøringsydelse. Gå tilbage til prisberegneren og start forfra.",
          );
          return;
        }

        const stripeToken = await createStripeCardToken(stripe, elements);
        const dateStr = `${selectedDate}T${String(selectedSlot!.startHour).padStart(2, "0")}:${String(selectedSlot!.startMinute).padStart(2, "0")}:00`;
        const customFieldsResult = buildFlytCustomFieldsPayload(
          flytCustomFields,
          stand.level,
          entryMethod as FlytEntryOptionId,
          entryOtherDetails,
        );
        if (!customFieldsResult.ok) {
          setError(customFieldsResult.error);
          return;
        }
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "booking",
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            address: address.trim(),
            city: city.trim(),
            zip: zip.trim(),
            phone: phone.trim(),
            frequency_id: String(FLYT_FREQUENCY_ID),
            service_date: dateStr,
            arrival_window: selectedSlot?.arrivalWindow ?? 60,
            stripe_token: stripeToken,
            extras: buildFlytExtrasPayload(selectedExtras, hiddenMandatoryExtras),
            service_id: String(stand.serviceId),
            pricing_param_id: String(stand.pricingParamId),
            pricing_param_quantity: sqm,
            custom_fields: customFieldsResult.payload,
          }),
        });
        const resData = await response.json();
        const resolvedBookingId = resolveL27BookingId(resData.data);
        if (!resData.success || !resolvedBookingId) {
          setError(
            parseL27BookingError(
              resData.details,
              resData.message ||
                "Der opstod en fejl under oprettelsen af din booking.",
            ),
          );
          return;
        }

        const confirmationExtras = Object.entries(selectedExtras)
          .filter(([, qty]) => qty > 0)
          .flatMap(([id, qty]) => {
            const extraId = parseInt(id, 10);
            const managed = getFlytExtraById(extraId);
            if (managed?.category === "stand_confirmation") return [];

            const extra = availableExtras.find((item) => String(item.id) === id);
            const unitPrice = extra?.price ?? managed?.price ?? 0;
            if (unitPrice <= 0) return [];

            const chargeQty =
              extraId === bathroomExtra.id
                ? getFlytBathroomChargeableQty(qty)
                : qty;
            if (chargeQty <= 0) return [];

            const label = extra?.name ?? managed?.label ?? "Tilvalg";

            return [
              {
                id,
                label,
                price: unitPrice,
                quantity: chargeQty,
              },
            ];
          });

        const confirmationPayload: BookingConfirmationPayload = {
          bookingId: resolvedBookingId,
          source: "flyt",
          firstName: firstName.trim(),
          email: email.trim(),
          date: selectedDate,
          timeSlot:
            selectedSlot?.label.split(" – ")[0] ?? selectedSlot?.label ?? "",
          address: address.trim(),
          postcode: zip.trim(),
          city: city.trim(),
          frequency: "Engangs",
          frequencyId: String(FLYT_FREQUENCY_ID),
          squareMeters: sqm,
          isKlub: false,
          totalTodayKr: receipt.total,
          extras: confirmationExtras,
          standLabel: stand.label,
          serviceLabel: `Flytterengøring · Stand ${stand.level}`,
          createdAt: new Date().toISOString(),
        };
        saveBookingConfirmation(confirmationPayload);
        setIsRedirecting(true);
        router.push("/booking-modtaget/");
        return;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Forbindelsesfejl. Prøv venligst igen senere.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }, [
    canContinue,
    step,
    selectedDate,
    selectedSlot,
    email,
    firstName,
    lastName,
    address,
    city,
    zip,
    phone,
    selectedExtras,
    hiddenMandatoryExtras,
    stand,
    sqm,
    flytCustomFields,
    entryMethod,
    entryOtherDetails,
    stripe,
    elements,
    router,
    receipt,
    availableExtras,
    stand,
    bathroomExtra,
  ]);

  const goBack = () => {
    setError("");
    if (stepIndex === 0) {
      router.push("/flytterengoring/#calculator");
      return;
    }
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !(step === "adresse" && showAddressSuggestions)
    ) {
      event.preventDefault();
      goNext();
    }
  };

  const renderReceipt = () => (
    <div className={styles.receipt}>
      <DealSummaryTrustPanel />

      <div className={styles.receiptSection}>
        {receipt.lines.map((line) => (
          <div key={line.label} className={styles.receiptRow}>
            <span>{line.label}</span>
            <strong>{formatFlytReceiptKr(line.amount)}</strong>
          </div>
        ))}

        <div className={styles.receiptTotals}>
          <div className={styles.receiptTotalNet}>
            <span>Total</span>
            <strong>{formatFlytReceiptKr(receipt.total)}</strong>
          </div>
          <div className={`${styles.receiptRow} ${styles.receiptRowGreen}`}>
            <span>
              Efter servicefradrag ({serviceDeduction.approximateTaxValuePercent}%)
            </span>
            <strong>ca. {formatFlytReceiptKr(receipt.afterFradrag)}</strong>
          </div>
        </div>
      </div>

      <p className={styles.zeroToday}>
        0 kr. trækkes ved booking
        <small>Faktureres efter rengøringen er udført</small>
      </p>
    </div>
  );

  if (isRedirecting) {
    return (
      <div className={styles.shell}>
        <main className={styles.successMain}>
          <div className={`${styles.frame} ${styles.step}`}>
            <p className={styles.successCopy}>Sender dig videre…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell} onKeyDown={handleKeyDown}>
      <header className={styles.top}>
        <div className={styles.topInner}>
          <div className={styles.topRow}>
            <button type="button" className={styles.backBtn} onClick={goBack}>
              ← {stepIndex === 0 ? "Tilbage" : "Forrige"}
            </button>
            <span className={styles.stepMeta}>
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.formColumn}>
          <div className={`${styles.frame} ${styles.step}`} key={step}>
            {step === "bolig" && (
              <>
                <p className={styles.eyebrow}>Flytterengøring</p>
                <h1 className={styles.question}>Bekræft boligen</h1>
                <p className={styles.hint}>
                  Angiv boligareal, vælg stand og bekræft detaljerne.
                </p>

                <section className={flytStyles.boligSection} aria-label="Boligareal">
                  <div className={`${styles.m2FormField} ${flytStyles.m2FormFieldTight}`}>
                    <label className={styles.fieldLabel} htmlFor="flyt-sqm">
                      Boligareal
                    </label>
                    <div className={styles.m2FormWrap}>
                      <input
                        id="flyt-sqm"
                        className={`${styles.input} ${styles.m2FormInput} ${!isSqmValid && sqmDraft.trim() !== "" ? styles.m2FormInputInvalid : ""}`}
                        type="number"
                        inputMode="numeric"
                        min={FLYT_SQM_MIN}
                        max={FLYT_SQM_MAX}
                        value={sqmDraft}
                        onChange={(event) =>
                          handleSqmInputChange(event.target.value)
                        }
                        onBlur={handleSqmBlur}
                        aria-describedby="flyt-sqm-hint"
                      />
                      <span className={styles.m2FormSuffix}>m²</span>
                    </div>
                    {!isSqmValid && sqmDraft.trim() !== "" && (
                      <p
                        id="flyt-sqm-hint"
                        className={`${styles.m2FormHint} ${styles.m2FormHintError}`}
                      >
                        {`Indtast mellem ${FLYT_SQM_MIN} og ${FLYT_SQM_MAX} m²`}
                      </p>
                    )}
                  </div>
                </section>

                <section className={flytStyles.standSection} aria-label="Boligens stand">
                  <p className={styles.fieldLabel} id="flyt-stand-label">
                    Boligens stand
                  </p>
                  <div
                    className={flytStyles.standGrid}
                    role="radiogroup"
                    aria-labelledby="flyt-stand-label"
                  >
                    {FLYT_STANDS.map((item) => {
                      const isSelected = standLevel === item.level;
                      return (
                        <div key={item.level} className={flytStyles.standCardWrap}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={`${flytStyles.standCard} ${isSelected ? flytStyles.standCardSelected : ""}`}
                            onClick={() =>
                              setStandLevel(getFlytStand(item.level).level)
                            }
                          >
                            <span className={flytStyles.standCardLevel}>
                              {item.level}
                            </span>
                            <span className={flytStyles.standCardLabel}>
                              {item.shortLabel}
                            </span>
                          </button>
                          {isSelected && (
                            <p className={flytStyles.standDescription}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section
                  className={flytStyles.confirmSection}
                  aria-label="Bekræftelser og tilvalg"
                >
                  {standConfirmationExtra && (
                    <div className={flytStyles.confirmBlock}>
                      <p className={styles.fieldLabel}>Bekræft boligens stand</p>
                      <ConfirmCard
                        checked={standConfirmed}
                        onChange={(value) =>
                          handleFlytExtraCheckbox(
                            standConfirmationExtra.id,
                            value,
                          )
                        }
                        ariaLabel="Bekræft boligens stand"
                      >
                        {standConfirmationExtra.label}
                      </ConfirmCard>
                    </div>
                  )}

                  <div className={flytStyles.confirmBlock}>
                    <p className={styles.fieldLabel}>{bathroomExtra.label}</p>
                    <div
                      className={flytStyles.pillGroup}
                      role="group"
                      aria-label="Antal badeværelser"
                    >
                      {BATHROOM_PILL_OPTIONS.map((option) => {
                        const isFourPlus = option === 4;
                        const isSelected = isFourPlus
                          ? bathroomQty >= 4
                          : bathroomQty === option;
                        const label = isFourPlus ? "4+" : String(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`${flytStyles.pillBtn} ${isSelected ? flytStyles.pillBtnSelected : ""}`}
                            onClick={() => handleBathroomQtySelect(option)}
                            aria-pressed={isSelected}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <p className={flytStyles.pillHint}>
                      1 badeværelse/toilet er inkluderet i prisen.
                      {bathroomQty > 1 && (
                        <>
                          {" "}
                          +{formatFlytKr(bathroomExtra.price)} pr. ekstra
                          (×{bathroomQty - 1}).
                        </>
                      )}
                    </p>
                  </div>

                  <div className={flytStyles.confirmBlock}>
                    <p className={styles.fieldLabel}>{smokingExtra.label}</p>
                    <div
                      className={flytStyles.togglePair}
                      role="group"
                      aria-label="Rygning i boligen"
                    >
                      <button
                        type="button"
                        className={`${flytStyles.toggleOption} ${!smokingSelected ? flytStyles.toggleOptionSelected : ""}`}
                        onClick={() =>
                          handleFlytExtraCheckbox(smokingExtra.id, false)
                        }
                        aria-pressed={!smokingSelected}
                      >
                        Nej
                      </button>
                      <button
                        type="button"
                        className={`${flytStyles.toggleOption} ${smokingSelected ? flytStyles.toggleOptionSelected : ""}`}
                        onClick={() =>
                          handleFlytExtraCheckbox(smokingExtra.id, true)
                        }
                        aria-pressed={smokingSelected}
                      >
                        Ja
                        <span className={flytStyles.togglePrice}>
                          +{formatFlytKr(smokingExtra.price)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {flyttesynExtra && (
                    <div className={flytStyles.confirmBlock}>
                      <p className={styles.fieldLabel}>Flyttesyn</p>
                      <ConfirmCard
                        checked={flyttesynAccepted}
                        onChange={(value) =>
                          handleFlytExtraCheckbox(flyttesynExtra.id, value)
                        }
                        ariaLabel="Flyttesyn"
                      >
                        {flyttesynExtra.label}
                      </ConfirmCard>
                    </div>
                  )}

                  {visibleDynamicExtras.length > 0 && (
                    <div className={flytStyles.confirmBlock}>
                      <p className={styles.fieldLabel}>Yderligere tilvalg</p>
                      {loadingExtras ? (
                        <p className={styles.loading}>Henter tilvalg…</p>
                      ) : (
                        <div className={flytStyles.extrasGrid}>
                          {visibleDynamicExtras.map((extra) => {
                            const isSelected =
                              !!selectedExtras[String(extra.id)];
                            const qty = selectedExtras[String(extra.id)] || 0;
                            return (
                              <button
                                key={extra.id}
                                type="button"
                                className={`${flytStyles.extraPill} ${isSelected ? flytStyles.extraPillSelected : ""}`}
                                onClick={() => handleExtraToggle(extra)}
                              >
                                <span className={flytStyles.extraName}>
                                  {extra.name}
                                </span>
                                <span className={flytStyles.extraPrice}>
                                  +{formatFlytKr(extra.price)}
                                </span>
                                {extra.quantity_based && isSelected && (
                                  <div
                                    className={flytStyles.extraQty}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      className={flytStyles.extraQtyBtn}
                                      onClick={(event) =>
                                        handleExtraQtyChange(extra.id, -1, event)
                                      }
                                    >
                                      −
                                    </button>
                                    <span className={flytStyles.extraQtyValue}>
                                      {qty}
                                    </span>
                                    <button
                                      type="button"
                                      className={flytStyles.extraQtyBtn}
                                      onClick={(event) =>
                                        handleExtraQtyChange(extra.id, 1, event)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}

            {step === "adresse" && (
              <>
                <h1 className={styles.question}>Hvad er adressen?</h1>
                <p className={styles.hint}>
                  Begynd at skrive — vi finder postnummer og by automatisk.
                </p>
                <div
                  className={styles.addressAutocomplete}
                  ref={addressDropdownRef}
                >
                  <input
                    className={styles.input}
                    type="text"
                    value={address}
                    onChange={(event) => handleAddressChange(event.target.value)}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) {
                        setShowAddressSuggestions(true);
                      }
                    }}
                    placeholder="F.eks. Nørrebrogade 12"
                    autoComplete="off"
                    autoFocus
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <ul className={styles.suggestionsList} role="listbox">
                      {addressSuggestions.map((suggestion) => (
                        <li key={suggestion.tekst} role="option">
                          <button
                            type="button"
                            className={styles.suggestionItem}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleAddressSelect(suggestion);
                            }}
                          >
                            {suggestion.tekst}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {zip && city && (
                  <div className={styles.badge}>
                    ✓ {zip} {city}
                  </div>
                )}
              </>
            )}

            {step === "dato" && (
              <>
                <h1 className={styles.question}>Hvornår skal vi komme?</h1>
                <p className={styles.hint}>
                  Vælg en hverdag og et tidspunkt til flytterengøringen.
                </p>
                {loadingSpots ? (
                  <p className={styles.loading}>Henter ledige datoer…</p>
                ) : (
                  <>
                    <div className={styles.dateWeekNav}>
                      <button
                        type="button"
                        className={styles.dateWeekBtn}
                        disabled={weekOffset === 0}
                        onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                      >
                        ← Forrige uge
                      </button>
                      <span className={styles.dateWeekLabel}>{weekLabel}</span>
                      <button
                        type="button"
                        className={styles.dateWeekBtn}
                        disabled={weekOffset >= maxWeekOffset}
                        onClick={() =>
                          setWeekOffset((w) => Math.min(maxWeekOffset, w + 1))
                        }
                      >
                        Næste uge →
                      </button>
                    </div>
                    <div className={styles.dateRow}>
                      {weekdayDates.map((date) => {
                        const dateStr = toLocalYmd(date);
                        const past = isDateInPast(date);
                        const beyondRange = date > maxBookableDate;
                        const freeSpots = freeSpotsForDate(dateStr);
                        const hasSpots = spotsLoaded
                          ? freeSpots.length > 0
                          : !past && !beyondRange;
                        const isSelected =
                        selectedDate === dateStr && !selectedDateOutsideWeek;
                        const weekday = date
                          .toLocaleDateString("da-DK", { weekday: "short" })
                          .replace(".", "");
                        const month = date
                          .toLocaleDateString("da-DK", { month: "short" })
                          .replace(".", "");
                        return (
                          <button
                            key={dateStr}
                            type="button"
                            className={`${styles.dateChip} ${isSelected ? styles.dateChipSelected : ""}`}
                            disabled={past || beyondRange || !hasSpots}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setSelectedSlot(null);
                              setShowCalendar(false);
                            }}
                          >
                            <span className={styles.dateWeekday}>{weekday}</span>
                            <span className={styles.dateDay}>{date.getDate()}</span>
                            <span className={styles.dateMonth}>{month}</span>
                          </button>
                        );
                      })}
                    <button
                      type="button"
                      className={`${styles.dateChip} ${styles.dateChipCalendar} ${selectedDateOutsideWeek ? styles.dateChipSelected : ""} ${showCalendar ? styles.dateChipCalendarOpen : ""}`}
                      onClick={() => {
                        setShowCalendar((open) => {
                          const next = !open;
                          if (next) {
                            const base = selectedDate
                              ? new Date(selectedDate + "T12:00:00")
                              : new Date();
                            setViewDate(
                              new Date(base.getFullYear(), base.getMonth(), 1),
                            );
                          }
                          return next;
                        });
                      }}
                      aria-expanded={showCalendar}
                      aria-label="Se kalender"
                    >
                      <span className={styles.dateWeekday}>
                        {selectedDateOutsideWeek ? "Valgt" : "Kalender"}
                      </span>
                      {selectedDateOutsideWeek ? (
                        <span className={styles.dateDay}>
                          {new Date(selectedDate + "T12:00:00").getDate()}
                        </span>
                      ) : (
                        <svg
                          className={styles.dateCalendarIcon}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      )}
                      <span className={styles.dateMonth}>
                        {selectedDateOutsideWeek
                          ? new Date(selectedDate + "T12:00:00")
                              .toLocaleDateString("da-DK", { month: "short" })
                              .replace(".", "")
                          : "Se kalender"}
                      </span>
                    </button>
                  </div>

                  {selectedDateOutsideWeek && !showCalendar && (
                    <p className={styles.dateOutsideWeekLabel}>
                      Valgt:{" "}
                      {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                        "da-DK",
                        { weekday: "long", day: "numeric", month: "long" },
                      )}
                    </p>
                  )}

                  {showCalendar && (
                    <div className={styles.calendarPanel} ref={calendarRef}>
                      <div className={styles.calendarHeader}>
                        <button
                          type="button"
                          className={styles.calendarNav}
                          onClick={handlePrevMonth}
                          aria-label="Forrige måned"
                        >
                          ‹
                        </button>
                        <span className={styles.calendarMonth}>
                          {calendarMonthLabel.charAt(0).toUpperCase() +
                            calendarMonthLabel.slice(1)}
                        </span>
                        <button
                          type="button"
                          className={styles.calendarNav}
                          onClick={handleNextMonth}
                          aria-label="Næste måned"
                        >
                          ›
                        </button>
                      </div>
                      <div className={styles.calendarGrid}>
                        {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
                          <div key={d} className={styles.calendarDow}>
                            {d}
                          </div>
                        ))}
                        {calendarDays.map((dayDate) => {
                          const dateStr = toLocalYmd(dayDate);
                          const isCurrentMonth =
                            dayDate.getMonth() === viewDate.getMonth();
                          const isWeekend = !isWeekday(dayDate);
                          const isSelected = selectedDate === dateStr;
                          const bookable = isDateBookable(dayDate);
                          const isDisabled = isWeekend || !bookable;

                          return (
                            <button
                              key={dateStr}
                              type="button"
                              className={`${styles.calendarDay} ${!isCurrentMonth ? styles.calendarDayOut : ""} ${isSelected ? styles.calendarDaySelected : ""} ${isWeekend ? styles.calendarDayWeekend : ""}`}
                              disabled={isDisabled}
                              onClick={() => handleCalendarDateSelect(dateStr)}
                            >
                              {dayDate.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                    {selectedDate && (
                      <div className={styles.timeSlotSection}>
                        <p className={styles.timeSlotDateLabel}>
                          {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                            "da-DK",
                            { weekday: "long", day: "numeric", month: "long" },
                          )}
                        </p>

                        {slotsForSelectedDate.length === 0 ? (
                          <p className={styles.loading}>
                            Ingen ledige tider denne dag — vælg en anden dato.
                          </p>
                        ) : (
                          <div className={flytStyles.arrivalSlotList}>
                            {slotsForSelectedDate.map((slot) => (
                              <button
                                key={slot.label}
                                type="button"
                                className={`${styles.timeSlot} ${selectedSlot?.label === slot.label ? styles.timeSlotSelected : ""}`}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {step === "adgang" && (
              <>
                <h1 className={styles.question}>Adgang til boligen</h1>
                <p className={styles.hint}>
                  Fortæl os hvordan rengøringsholdet kommer ind i boligen.
                </p>

                <p className={styles.fieldLabel}>Adgangsmetode</p>
                <div className={flytStyles.optionGrid}>
                  {FLYT_ENTRY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${flytStyles.optionBtn} ${entryMethod === option.id ? flytStyles.optionBtnSelected : ""}`}
                      onClick={() => {
                        setEntryMethod(option.id);
                        if (option.id !== "other") {
                          setEntryOtherDetails("");
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {entryMethod === "other" && (
                  <div className={flytStyles.entryOtherField}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="flyt-entry-other"
                    >
                      Beskriv adgangen
                    </label>
                    <textarea
                      id="flyt-entry-other"
                      className={flytStyles.entryOtherInput}
                      value={entryOtherDetails}
                      onChange={(event) =>
                        setEntryOtherDetails(event.target.value)
                      }
                      placeholder="Beskriv hvordan vi får adgang til boligen"
                      rows={4}
                      autoFocus
                    />
                  </div>
                )}
              </>
            )}

            {step === "kontakt" && (
              <>
                <h1 className={styles.question}>Dine kontaktoplysninger</h1>
                <p className={styles.hint}>
                  Vi sender bekræftelse og kontakter dig ved behov.
                </p>

                <div className={styles.fieldStack}>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="flyt-first-name">
                      Fornavn
                    </label>
                    <input
                      id="flyt-first-name"
                      className={styles.input}
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="flyt-last-name">
                      Efternavn
                    </label>
                    <input
                      id="flyt-last-name"
                      className={styles.input}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="flyt-email">
                      E-mail
                    </label>
                    <input
                      id="flyt-email"
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="flyt-phone">
                      Telefon
                    </label>
                    <input
                      id="flyt-phone"
                      className={styles.input}
                      inputMode="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {step === "betaling" && (
              <>
                <h1 className={styles.question}>Bekræft og betal</h1>
                <p className={styles.hint}>
                  Gem dit kort nu. Du betaler først efter flytterengøringen er
                  udført.
                </p>
                <div className={styles.fieldStack}>
                  <div>
                    <label className={styles.fieldLabel}>Kortoplysninger</label>
                    <StripeCardInput
                      onChange={(event) => {
                        setCardComplete(event.complete);
                        setCardError(event.error?.message ?? null);
                      }}
                      errorMessage={cardError}
                    />
                  </div>
                  <TermsConfirmCard
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                  />
                </div>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <aside
          className={`${styles.summaryPanel} ${flytStyles.summaryPanel}`}
          aria-label="Prisoversigt"
        >
          {renderReceipt()}
        </aside>
      </div>

      <div className={styles.bottomChrome}>
        <div className={styles.mobileCheckoutBar} aria-label="Prisoversigt">
          <div className={styles.mobileCheckoutLeft}>
            <p className={styles.mobileCheckoutPrice}>
              {formatFlytReceiptKr(receipt.total)}
            </p>
            <button
              type="button"
              className={styles.detailsLink}
              onClick={() => setDetailsOpen(true)}
              aria-expanded={detailsOpen}
              aria-controls="flyt-details-sheet"
            >
              <svg
                className={styles.detailsLinkIcon}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M7 6.2V10M7 4.4v.01"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Se detaljer
            </button>
          </div>
          <button
            type="button"
            className={`${styles.continueBtn} ${styles.mobileContinueBtn}`}
            disabled={!canContinue || isSubmitting}
            onClick={goNext}
          >
            {isSubmitting
              ? "Booker…"
              : step === "betaling"
                ? "Gennemfør booking"
                : "Fortsæt"}
            {!isSubmitting && <span aria-hidden>→</span>}
          </button>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerInner}>
              <span className={styles.footerHint}>
                {step === "betaling"
                  ? "Tryk Enter eller bekræft"
                  : "Tryk Enter for at fortsætte"}
              </span>
              <button
                type="button"
                className={styles.continueBtn}
                disabled={!canContinue || isSubmitting}
                onClick={goNext}
              >
                {isSubmitting
                  ? "Booker…"
                  : step === "betaling"
                    ? "Gennemfør booking"
                    : "Fortsæt"}
                {!isSubmitting && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        </footer>
      </div>

      <div
        className={`${styles.sheetBackdrop} ${detailsOpen ? styles.sheetBackdropOpen : ""}`}
        onClick={() => setDetailsOpen(false)}
        aria-hidden={!detailsOpen}
      />
      <div
        id="flyt-details-sheet"
        className={`${styles.sheetPanel} ${detailsOpen ? styles.sheetPanelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flyt-details-title"
        aria-hidden={!detailsOpen}
      >
        <div className={styles.sheetHandle} aria-hidden />
        <div className={styles.sheetHeader}>
          <h2 id="flyt-details-title" className={styles.sheetTitle}>
            Prisoversigt
          </h2>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setDetailsOpen(false)}
            aria-label="Luk prisoversigt"
          >
            ×
          </button>
        </div>
        <div className={styles.sheetBody}>{renderReceipt()}</div>
      </div>
    </div>
  );
}
