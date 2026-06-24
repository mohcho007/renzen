"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { fetchL27SpotsRange } from "@/lib/l27Client";
import {
  isBookableSlotInSpots,
  normalizeL27SpotsToSlots,
  type L27Spot,
} from "@/lib/l27Spots";
import { L27_API_PATH } from "@/lib/urls";
import Image from "next/image";
import { createStripeCardToken } from "@/components/payment/createStripeCardToken";
import { StripeCardInput } from "@/components/payment/StripeCardInput";
import { StripeElementsProvider } from "@/components/payment/StripeElementsProvider";
import {
  CalendarCheck,
  Percent,
  Sparkles,
  Tag,
  UserRound,
} from "lucide-react";
import {
  type DealPackage,
  exceedsIntroTierCap,
  getPackageTierForM2,
} from "@/components/dealside/dealPackages";
import styles from "./DealTypeformWizard.module.css";
import { TermsConfirmCard } from "@/components/forms/TermsConfirmCard";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  listPriceKr,
  ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";
import {
  DawaAddressField,
  formatStreetAddress,
  useDawaAddress,
  useDawaPostcode,
  type DawaAddressSuggestion,
  type DawaPostnummerSuggestion,
} from "@/components/service-inquiry/boligservice/DawaAddressField";
import {
  isServedPostcode,
  SERVED_AREA_LABEL,
  SERVED_AREA_POSTNR_RANGE,
  UNSERVED_AREA_MESSAGE,
} from "@/lib/serviceArea";
import {
  saveBookingConfirmation,
  type BookingConfirmationPayload,
} from "@/lib/bookingConfirmation";

type TimeSlot = {
  startHour: number;
  startMinute: number;
  label: string;
  arrivalWindow: number;
};

import {
  BOOK_CLEANLINESS_LEVELS,
  BOOK_ENTRY_OPTIONS,
  BOOK_LAST_CLEANED_OPTIONS,
  buildBookCleaningCustomFieldsPayload,
  buildBookCleaningExtrasPayload,
  isSelectableL27Extra,
  L27_BOOK_PRICING_PARAM_ID,
  L27_BOOK_SERVICE_ID,
  parseL27BookingError,
  resolveL27BookingId,
  resolveBookExtraDisplay,
  type BookEntryOptionId,
  type BookCleanlinessLevelId,
} from "@/lib/bookCleaningL27";
import type { L27CustomField } from "@/lib/flytterengoring";

type BookExtra = {
  id: string;
  name: string;
  price: number;
  quantityBased: boolean;
};

const L27_SERVICE_ID = L27_BOOK_SERVICE_ID;

const BOOK_EXTRAS_FALLBACK: BookExtra[] = [
  { id: "52", name: "Køleskab indvendigt", price: 215, quantityBased: false },
  { id: "53", name: "Ovn og emhætte", price: 599, quantityBased: false },
  { id: "217", name: "Køkkenskabe indvendigt", price: 35, quantityBased: true },
  { id: "93", name: "Afkalkning af bad/køkken", price: 729, quantityBased: false },
  { id: "56", name: "Fodpaneler", price: 79, quantityBased: false },
  { id: "58", name: "Ekstra kæledyrshår", price: 75, quantityBased: false },
];

function cleanlinessReceiptSubline(levelId: string): string {
  if (levelId === "extra") return "Boligen trænger til ekstra tid";
  if (levelId === "heavy") return "Boligen er meget beskidt";
  return "Ekstra tid på rengøringen";
}

type FrequencyType = "recurring" | "oneoff";

type FrequencyOption = {
  id: string;
  label: string;
  sub: string;
  type: FrequencyType;
  discount: number;
};

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: "17", label: "Hver uge", sub: "Spar 20%", type: "recurring", discount: 20 },
  { id: "22", label: "Hver 2. uge", sub: "Spar 15%", type: "recurring", discount: 15 },
  { id: "19", label: "Hver 4. uge", sub: "Spar 5%", type: "recurring", discount: 5 },
  { id: "1", label: "Én gang", sub: "Engangsrengøring", type: "oneoff", discount: 0 },
];

const DEFAULT_FREQUENCY_ID = "22";

/** Approximate recurring visits per calendar year by frequency. */
const FREQUENCY_VISITS_PER_YEAR: Record<string, number> = {
  "17": 52,
  "22": 26,
  "19": 13,
  "1": 0,
};

const BOOK2_INTRO_DISCLAIMER =
  "Introprisen er en medlemsfordel for nye Renzen Klub medlemmer. Du betaler ikke nu — fakturering sker først efter rengøringen. Skulle du fortryde, kan du kontakte os inden for 14 dage. Hvis introfordelen eller Zenkreditter allerede er brugt, kan prisen blive reguleret til normal engangspris.";

const RECURRING_FREQUENCY_OPTIONS = FREQUENCY_OPTIONS.filter(
  (option) => option.type === "recurring",
);

const STEPS = [
  "postnummer",
  "frekvens",
  "boligstand",
  "dato",
  "tilvalg",
  "adgang",
  "kontakt",
  "betaling",
] as const;

type StepId = (typeof STEPS)[number];

function toLocalYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatKrAmount(amount: number) {
  return amount.toLocaleString("da-DK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatKr(amount: number) {
  return `${formatKrAmount(amount)} kr.`;
}

function formatReceiptKr(amount: number) {
  return `${formatKrAmount(amount)} kr.`;
}

function formatReceiptDelta(amount: number, positive: boolean) {
  const prefix = positive ? "+" : "-";
  return `${prefix}${formatKrAmount(Math.abs(amount))} kr.`;
}

function toTimeSlot(slot: {
  startHour: number;
  startMinute: number;
  label: string;
  arrivalWindow: number;
}): TimeSlot {
  return {
    startHour: slot.startHour,
    startMinute: slot.startMinute,
    label: slot.label,
    arrivalWindow: slot.arrivalWindow,
  };
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

const SPOTS_RANGE_DAYS = 42;
const MOBILE_DATE_VISIBLE = 3;

function isDateInPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getMaxBookableDate() {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setDate(max.getDate() + SPOTS_RANGE_DAYS - 1);
  return max;
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

function isTodayWeekend() {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

function getMinWeekOffset(maxBookableDate: Date) {
  if (isTodayWeekend()) return 1;
  const hasBookableThisWeek = nextWeekdays(0).some(
    (d) => !isDateInPast(d) && d <= maxBookableDate,
  );
  return hasBookableThisWeek ? 0 : 1;
}

function getMobileDateStartForWeek(
  bookableWeekdays: Date[],
  weekOffset: number,
) {
  if (bookableWeekdays.length === 0) return 0;
  const visibleYmd = new Set(nextWeekdays(weekOffset).map(toLocalYmd));
  const firstVisibleIdx = bookableWeekdays.findIndex((d) =>
    visibleYmd.has(toLocalYmd(d)),
  );
  if (firstVisibleIdx < 0) return 0;
  const centered = Math.max(
    0,
    firstVisibleIdx - Math.floor(MOBILE_DATE_VISIBLE / 2),
  );
  const maxStart = Math.max(0, bookableWeekdays.length - MOBILE_DATE_VISIBLE);
  return Math.min(centered, maxStart);
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

const M2_MIN = 30;
const M2_MAX = 300;

function parseActualM2(value: string, fallback: number) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < M2_MIN || parsed > M2_MAX) {
    return fallback;
  }
  return parsed;
}

function isActualM2InputValid(value: string) {
  const parsed = parseInt(value, 10);
  return !Number.isNaN(parsed) && parsed >= M2_MIN && parsed <= M2_MAX;
}

function getInitialStepIndex(
  initialPostcode: string | undefined,
  initialActualM2: number | undefined,
): number {
  const postcode = initialPostcode?.replace(/\D/g, "").slice(0, 4);
  const hasPostcode = postcode?.length === 4;
  const hasM2 =
    initialActualM2 != null &&
    initialActualM2 >= M2_MIN &&
    initialActualM2 <= M2_MAX;
  if (hasPostcode && hasM2) {
    return STEPS.indexOf("frekvens");
  }
  return 0;
}

function computeDealPricing(
  actualM2: number,
  introPkg: DealPackage,
  clubSelected: boolean,
  frequencyDiscount: number,
) {
  const adminFee = 5;
  const standardPrice = listPriceKr(actualM2);
  const isOneTime = !clubSelected;

  if (isOneTime) {
    const deductibleLabor = standardPrice;
    const fradragAmount = Math.round(deductibleLabor * 0.26);
    const firstVisitGross = standardPrice + adminFee;
    const firstVisitNet = Math.max(0, firstVisitGross - fradragAmount);

    return {
      adminFee,
      clubFee: 0,
      zenWalletCredit: 0,
      standardPrice,
      fradragAmount,
      firstVisitGross,
      firstVisitNet,
      firstVisitIntro: standardPrice,
      firstVisitSavings: 0,
      checkoutTotal: firstVisitGross,
      ongoingGross: 0,
      ongoingNet: 0,
      isOneTime: true as const,
    };
  }

  const ongoingGross = Math.round(standardPrice * (1 - frequencyDiscount / 100));
  const ongoingNet = Math.max(
    0,
    ongoingGross - Math.round(ongoingGross * 0.26),
  );
  const clubFee = KLUB_ANNUAL_KR;

  if (exceedsIntroTierCap(actualM2)) {
    const deductibleLabor = standardPrice;
    const fradragAmount = Math.round(deductibleLabor * 0.26);
    const firstVisitGross = standardPrice + adminFee + clubFee;
    const firstVisitNet = Math.max(0, firstVisitGross - fradragAmount);

    return {
      adminFee,
      clubFee,
      zenWalletCredit: 0,
      standardPrice,
      fradragAmount,
      firstVisitGross,
      firstVisitNet,
      firstVisitIntro: standardPrice,
      firstVisitSavings: 0,
      checkoutTotal: standardPrice + clubFee,
      ongoingGross,
      ongoingNet,
      isOneTime: false as const,
    };
  }

  const introPrice = introPkg.introPrice;
  const firstVisitSavings = standardPrice - introPrice;
  const deductibleLabor = introPrice;
  const fradragAmount = Math.round(deductibleLabor * 0.26);
  const firstVisitGross = introPrice + adminFee + clubFee;
  const firstVisitNet = Math.max(0, firstVisitGross - fradragAmount);

  return {
    adminFee,
    clubFee,
    zenWalletCredit: ZEN_CREDIT_MONTHLY_KR,
    standardPrice,
    fradragAmount,
    firstVisitGross,
    firstVisitNet,
    firstVisitIntro: introPrice,
    firstVisitSavings,
    checkoutTotal: introPrice + clubFee,
    ongoingGross,
    ongoingNet,
    isOneTime: false as const,
  };
}

function getFrequencyOption(id: string) {
  return (
    FREQUENCY_OPTIONS.find((option) => option.id === id) ??
    FREQUENCY_OPTIONS.find((option) => option.id === DEFAULT_FREQUENCY_ID)!
  );
}

function getNextStepIndex(currentIndex: number) {
  return Math.min(currentIndex + 1, STEPS.length - 1);
}

function getPrevStepIndex(currentIndex: number) {
  return Math.max(0, currentIndex - 1);
}

export type DealWizardVariant = "dealpage2" | "book2";

type DealTypeformWizardProps = {
  pkg: DealPackage;
  onBack: () => void;
  variant?: DealWizardVariant;
  initialActualM2?: number;
  initialPostcode?: string;
  initialClubSelected?: boolean;
};

export default function DealTypeformWizard(props: DealTypeformWizardProps) {
  return (
    <StripeElementsProvider>
      <DealTypeformWizardForm {...props} />
    </StripeElementsProvider>
  );
}

function DealTypeformWizardForm({
  pkg,
  onBack,
  variant = "dealpage2",
  initialActualM2,
  initialPostcode,
  initialClubSelected,
}: DealTypeformWizardProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const isBook2 = variant === "book2";
  const [stepIndex, setStepIndex] = useState(() =>
    getInitialStepIndex(initialPostcode, initialActualM2),
  );
  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const [address, setAddress] = useState("");
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [zipSuggestions, setZipSuggestions] = useState<DawaPostnummerSuggestion[]>(
    [],
  );
  const [showZipSuggestions, setShowZipSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<
    DawaAddressSuggestion[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [entryMethod, setEntryMethod] = useState<BookEntryOptionId | "">("");
  const [entryOtherDetails, setEntryOtherDetails] = useState("");
  const [bookFrequencyId, setBookFrequencyId] = useState(DEFAULT_FREQUENCY_ID);
  const [recurringFrequencyId, setRecurringFrequencyId] = useState(DEFAULT_FREQUENCY_ID);
  const [clubSelected, setClubSelected] = useState(
    initialClubSelected ?? !isBook2,
  );
  const chosenFrequencyId = isBook2 ? bookFrequencyId : recurringFrequencyId;
  const billingFrequencyId = clubSelected
    ? getFrequencyOption(chosenFrequencyId).type === "oneoff"
      ? DEFAULT_FREQUENCY_ID
      : chosenFrequencyId
    : "1";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscountKr, setPromoDiscountKr] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoIsError, setPromoIsError] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const [spotsCache, setSpotsCache] = useState<Record<string, L27Spot[]>>({});
  const [spotsFetchState, setSpotsFetchState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [weekOffset, setWeekOffset] = useState(() =>
    getMinWeekOffset(getMaxBookableDate()),
  );
  const [mobileDateStartIndex, setMobileDateStartIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [receiptPriceBreakdownOpen, setReceiptPriceBreakdownOpen] =
    useState(false);
  const [klubOfferOpen, setKlubOfferOpen] = useState(false);
  const [pendingKlubSlot, setPendingKlubSlot] = useState<TimeSlot | null>(null);
  const [actualM2Input, setActualM2Input] = useState(() =>
    isBook2
      ? initialActualM2 != null
        ? String(initialActualM2)
        : ""
      : String(pkg.m2),
  );
  const [cleanlinessLevel, setCleanlinessLevel] = useState<
    BookCleanlinessLevelId | ""
  >("");
  const [lastCleaned, setLastCleaned] = useState("");
  const [availableExtras, setAvailableExtras] = useState<BookExtra[]>(
    BOOK_EXTRAS_FALLBACK,
  );
  const [serviceExtras, setServiceExtras] = useState<
    { id: string; name: string; price: number; mandatory?: boolean; recurring?: boolean }[]
  >([]);
  const [bookCustomFields, setBookCustomFields] = useState<L27CustomField[]>(
    [],
  );
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>(
    {},
  );
  const [loadingExtras, setLoadingExtras] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const mobileCalendarTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopCalendarTriggerRef = useRef<HTMLButtonElement>(null);
  const carouselSwipeRef = useRef<{ x: number; y: number } | null>(null);
  const didSyncDatoDatesRef = useRef(false);
  const postcodeDropdownRef = useRef<HTMLDivElement>(null);
  const { fetchSuggestions: fetchZipSuggestions, lookupPostnummer } =
    useDawaPostcode(isServedPostcode);
  const { fetchSuggestions: fetchAddressSuggestions } = useDawaAddress();

  const spotsCacheRef = useRef(spotsCache);
  spotsCacheRef.current = spotsCache;

  const refreshSpots = useCallback(async () => {
    const hasCache = Object.keys(spotsCacheRef.current).length > 0;
    if (!hasCache) {
      setLoadingSpots(true);
      setSpotsFetchState("loading");
    }
    try {
      const result = await fetchL27SpotsRange(
        toLocalYmd(new Date()),
        SPOTS_RANGE_DAYS,
      );
      if (!result.ok) {
        if (!hasCache) setSpotsFetchState("error");
        return;
      }
      setSpotsCache(result.cache);
      setSpotsFetchState("ready");
    } catch {
      if (!hasCache) setSpotsFetchState("error");
    } finally {
      setLoadingSpots(false);
    }
  }, []);

  useEffect(() => {
    if (!isBook2) {
      setActualM2Input(String(pkg.m2));
    }
  }, [pkg.m2, isBook2]);

  useEffect(() => {
    const postcode = initialPostcode?.replace(/\D/g, "").slice(0, 4);
    if (!postcode || postcode.length !== 4) return;

    void lookupPostnummer(postcode).then((result) => {
      if (!result) {
        setPostcodeQuery(postcode);
        setZip(postcode);
        setCity("");
        return;
      }
      setPostcodeQuery(result.tekst);
      setZip(result.nr);
      setCity(isServedPostcode(result.nr) ? result.navn : "");
    });
  }, [initialPostcode, lookupPostnummer]);

  useEffect(() => {
    let cancelled = false;

    const loadExtras = async () => {
      setLoadingExtras(true);
      try {
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "services" }),
        });
        const resData = await response.json();
        if (cancelled) return;

        if (resData.success && Array.isArray(resData.data)) {
          const service = (
            resData.data as { id: number; extras?: unknown[] }[]
          ).find((item) => item.id === L27_SERVICE_ID);
          const allExtras = (service?.extras ?? []).map((extra) => {
            const item = extra as {
              id: number;
              name: string;
              price: number | string;
              quantity_based?: boolean;
              mandatory?: boolean;
              recurring?: boolean;
            };
            return {
              id: String(item.id),
              name: item.name,
              price: Number(item.price) || 0,
              quantityBased: !!item.quantity_based,
              mandatory: !!item.mandatory,
              recurring: !!item.recurring,
            };
          });
          const extras = allExtras
            .filter((extra) =>
              isSelectableL27Extra({
                id: extra.id,
                name: extra.name,
                mandatory: extra.mandatory,
              }),
            )
            .map(({ id, name, price, quantityBased }) => ({
              id,
              name,
              price,
              quantityBased,
            }));
          setServiceExtras(
            allExtras.map(({ id, name, price, mandatory, recurring }) => ({
              id,
              name,
              price,
              mandatory,
              recurring,
            })),
          );
          if (extras.length > 0) {
            setAvailableExtras(extras);
          }
        }
      } catch {
        if (!cancelled) {
          setAvailableExtras(BOOK_EXTRAS_FALLBACK);
        }
      } finally {
        if (!cancelled) {
          setLoadingExtras(false);
        }
      }
    };

    loadExtras();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCustomFields = async () => {
      try {
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "custom_fields" }),
        });
        const resData = await response.json();
        if (cancelled || !resData.success || !Array.isArray(resData.data)) {
          return;
        }
        setBookCustomFields(resData.data as L27CustomField[]);
      } catch {
        // Custom fields are optional until configured in Launch27.
      }
    };

    void loadCustomFields();
    return () => {
      cancelled = true;
    };
  }, []);

  const isActualM2Valid = isActualM2InputValid(actualM2Input);
  const effectiveM2 = isBook2
    ? isActualM2Valid
      ? parseInt(actualM2Input, 10)
      : null
    : parseActualM2(actualM2Input, pkg.m2);
  const tierM2 = effectiveM2 ?? pkg.m2;
  const effectiveIntroPkg = useMemo(
    () => getPackageTierForM2(tierM2),
    [tierM2],
  );
  const introTierExceeded = exceedsIntroTierCap(tierM2);

  const weekdayDates = useMemo(() => nextWeekdays(weekOffset), [weekOffset]);
  const maxBookableDate = useMemo(() => getMaxBookableDate(), []);
  const maxWeekOffset = useMemo(
    () => Math.max(0, getWeekOffsetForDate(maxBookableDate)),
    [maxBookableDate],
  );
  const minWeekOffset = useMemo(
    () => getMinWeekOffset(maxBookableDate),
    [maxBookableDate],
  );

  const bookableWeekdays = useMemo(() => {
    const days: Date[] = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= maxBookableDate) {
      if (isWeekday(cursor) && !isDateInPast(cursor)) {
        days.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [maxBookableDate]);

  const mobileVisibleDates = useMemo(
    () =>
      bookableWeekdays.slice(
        mobileDateStartIndex,
        mobileDateStartIndex + MOBILE_DATE_VISIBLE,
      ),
    [bookableWeekdays, mobileDateStartIndex],
  );

  const calendarDays = useMemo(() => getDaysInMonth(viewDate), [viewDate]);
  const calendarMonthLabel = viewDate.toLocaleDateString("da-DK", {
    month: "long",
    year: "numeric",
  });

  const selectedDateOutsideWeek = useMemo(() => {
    if (!selectedDate) return false;
    return !weekdayDates.some((d) => toLocalYmd(d) === selectedDate);
  }, [selectedDate, weekdayDates]);

  const mobileMonthLabel = useMemo(() => {
    const refDate = selectedDate
      ? new Date(selectedDate + "T12:00:00")
      : mobileVisibleDates[0] ?? new Date();
    const month = refDate.toLocaleDateString("da-DK", { month: "long" });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }, [selectedDate, mobileVisibleDates]);

  const weekLabel = useMemo(() => {
    const monday = weekdayDates[0];
    if (!monday) return "";
    const month = monday.toLocaleDateString("da-DK", { month: "long" });
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    if (weekOffset === 0) return `${capitalized} · denne uge`;
    if (weekOffset === 1) return `${capitalized} · næste uge`;
    return `${capitalized} · om ${weekOffset} uger`;
  }, [weekdayDates, weekOffset]);

  const spotsLoaded = spotsFetchState === "ready";
  const isZipServed = isServedPostcode(zip);
  const postnummerFilled =
    zip.length === 4 && city.trim().length > 0 && isZipServed;
  const showZipUnserved = zip.length === 4 && !isZipServed;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [stepIndex]);

  useEffect(() => {
    setDetailsOpen(false);
  }, [stepIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postcodeDropdownRef.current &&
        !postcodeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowZipSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (step === "postnummer" && zip.length === 4 && city) {
      setPostcodeQuery(`${zip} ${city}`);
    }
  }, [step, zip, city]);

  useEffect(() => {
    if (!selectedDate) return;
    const parsed = new Date(selectedDate + "T12:00:00");
    if (Number.isNaN(parsed.getTime())) return;
    const offset = getWeekOffsetForDate(parsed);
    if (offset >= 0) {
      setWeekOffset(Math.max(offset, minWeekOffset));
    }
  }, [selectedDate, minWeekOffset]);

  useEffect(() => {
    setWeekOffset((w) => Math.max(w, minWeekOffset));
  }, [minWeekOffset]);

  useEffect(() => {
    if (step !== "dato") {
      didSyncDatoDatesRef.current = false;
      return;
    }
    if (didSyncDatoDatesRef.current) return;
    setWeekOffset((w) => Math.max(w, minWeekOffset));
    if (selectedDate) {
      didSyncDatoDatesRef.current = true;
      return;
    }
    if (bookableWeekdays.length === 0) return;
    setMobileDateStartIndex(
      getMobileDateStartForWeek(bookableWeekdays, minWeekOffset),
    );
    didSyncDatoDatesRef.current = true;
  }, [step, minWeekOffset, selectedDate, bookableWeekdays]);

  useEffect(() => {
    if (!selectedDate || bookableWeekdays.length === 0) return;
    const idx = bookableWeekdays.findIndex(
      (d) => toLocalYmd(d) === selectedDate,
    );
    if (idx < 0) return;
    const centered = Math.max(0, idx - Math.floor(MOBILE_DATE_VISIBLE / 2));
    const maxStart = Math.max(0, bookableWeekdays.length - MOBILE_DATE_VISIBLE);
    setMobileDateStartIndex(Math.min(centered, maxStart));
  }, [selectedDate, bookableWeekdays]);

  useEffect(() => {
    if (!showCalendar) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (calendarRef.current?.contains(target)) return;
      if (mobileCalendarTriggerRef.current?.contains(target)) return;
      if (desktopCalendarTriggerRef.current?.contains(target)) return;
      setShowCalendar(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
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
    if (step !== "dato") return;
    void refreshSpots();
  }, [step, refreshSpots]);

  const freeSpotsForDate = useCallback(
    (dateStr: string) => {
      const spots = spotsCache[dateStr] || [];
      return spots.filter((s) => s.free && !s.past);
    },
    [spotsCache],
  );

  const isDateBookable = useCallback(
    (date: Date) => {
      if (!isWeekday(date) || isDateInPast(date)) return false;
      if (date > maxBookableDate) return false;
      if (!spotsLoaded) return false;
      const dateStr = toLocalYmd(date);
      return freeSpotsForDate(dateStr).length > 0;
    },
    [maxBookableDate, spotsLoaded, freeSpotsForDate],
  );

  const isSelectedSlotBookable = useMemo(() => {
    if (!selectedDate || !selectedSlot) return false;
    const spots = freeSpotsForDate(selectedDate);
    if (spots.length === 0) return false;
    return isBookableSlotInSpots(spots, selectedSlot);
  }, [selectedDate, selectedSlot, freeSpotsForDate]);

  useEffect(() => {
    if (!selectedSlot || !selectedDate) return;
    const spots = freeSpotsForDate(selectedDate);
    if (spots.length === 0) return;
    if (!isBookableSlotInSpots(spots, selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [selectedSlot, selectedDate, freeSpotsForDate]);

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
    const empty = {
      morningSlots: [] as TimeSlot[],
      afternoonSlots: [] as TimeSlot[],
      allDaySlot: null as TimeSlot | null,
    };
    if (!selectedDate) return empty;

    const normalized = normalizeL27SpotsToSlots(freeSpotsForDate(selectedDate));
    return {
      morningSlots: normalized.morningSlots.map(toTimeSlot),
      afternoonSlots: normalized.afternoonSlots.map(toTimeSlot),
      allDaySlot: normalized.allDaySlot
        ? toTimeSlot(normalized.allDaySlot)
        : null,
    };
  }, [selectedDate, freeSpotsForDate]);

  const activeFrequency = useMemo(
    () => getFrequencyOption(billingFrequencyId),
    [billingFrequencyId],
  );
  const chosenFrequency = useMemo(
    () => getFrequencyOption(chosenFrequencyId),
    [chosenFrequencyId],
  );
  const isOneTime = !clubSelected;

  const listPrice = useMemo(
    () => (effectiveM2 !== null ? listPriceKr(effectiveM2) : 0),
    [effectiveM2],
  );

  const introPrice = introTierExceeded
    ? listPrice
    : effectiveIntroPkg.introPrice;

  const memberPriceDeal = useMemo(
    () =>
      Math.round(
        listPrice *
          (1 - getFrequencyOption(recurringFrequencyId).discount / 100),
      ),
    [listPrice, recurringFrequencyId],
  );

  const bookMemberPrice = useMemo(
    () =>
      Math.round(
        listPrice *
          (1 - getFrequencyOption(bookFrequencyId).discount / 100),
      ),
    [listPrice, bookFrequencyId],
  );

  const selectTimeSlot = useCallback(
    (slot: TimeSlot, withKlub: boolean) => {
      setSelectedSlot(slot);
      setClubSelected(withKlub);
    },
    [],
  );

  const klubOfferComparison = useMemo(() => {
    if (
      !isBook2 ||
      effectiveM2 === null ||
      introTierExceeded ||
      chosenFrequency.type !== "recurring"
    ) {
      return null;
    }
    const introPkg = getPackageTierForM2(effectiveM2);
    const klubPricing = computeDealPricing(
      effectiveM2,
      introPkg,
      true,
      chosenFrequency.discount,
    );
    const engangsList = listPriceKr(effectiveM2);
    const cleaningDue = Math.max(
      0,
      klubPricing.firstVisitIntro - ZEN_CREDIT_MONTHLY_KR,
    );
    const klubTotal = cleaningDue + klubPricing.clubFee;
    const savingsVsEngangs = engangsList - klubTotal;
    const ongoingPrice = Math.round(
      engangsList * (1 - chosenFrequency.discount / 100),
    );
    return {
      cleaningDue,
      klubFee: klubPricing.clubFee,
      klubTotal,
      engangsList,
      savingsVsEngangs,
      ongoingPrice,
      freqDiscount: chosenFrequency.discount,
      creditsRemaining: ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR,
    };
  }, [
    isBook2,
    effectiveM2,
    introTierExceeded,
    chosenFrequency.type,
    chosenFrequency.discount,
  ]);

  const openKlubOffer = useCallback((slot: TimeSlot) => {
    setPendingKlubSlot(slot);
    setKlubOfferOpen(true);
  }, []);

  const closeKlubOffer = useCallback(() => {
    setKlubOfferOpen(false);
    setPendingKlubSlot(null);
  }, []);

  const confirmKlubOffer = useCallback(
    (withKlub: boolean) => {
      if (pendingKlubSlot) {
        selectTimeSlot(pendingKlubSlot, withKlub);
      }
      closeKlubOffer();
    },
    [pendingKlubSlot, selectTimeSlot, closeKlubOffer],
  );

  const pricing = useMemo(() => {
    const m2 = isBook2 ? effectiveM2 : parseActualM2(actualM2Input, pkg.m2);
    const introPkg = getPackageTierForM2(m2 ?? pkg.m2);
    return computeDealPricing(
      m2 ?? pkg.m2,
      introPkg,
      clubSelected,
      activeFrequency.discount,
    );
  }, [
    isBook2,
    effectiveM2,
    actualM2Input,
    pkg.m2,
    clubSelected,
    activeFrequency.discount,
  ]);

  const klubReceiptTotal = useMemo(() => {
    const zenApplied = introTierExceeded ? 0 : ZEN_CREDIT_MONTHLY_KR;
    return pricing.firstVisitIntro + pricing.clubFee - zenApplied;
  }, [
    pricing.firstVisitIntro,
    pricing.clubFee,
    introTierExceeded,
  ]);

  const cleanlinessSurcharge = useMemo(() => {
    const level = BOOK_CLEANLINESS_LEVELS.find(
      (option) => option.id === cleanlinessLevel,
    );
    return level?.surchargeKr ?? 0;
  }, [cleanlinessLevel]);

  const selectedExtrasTotal = useMemo(() => {
    return Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
      if (qty <= 0) return sum;
      const extra = availableExtras.find((item) => item.id === id);
      return sum + (extra?.price ?? 0) * qty;
    }, 0);
  }, [selectedExtras, availableExtras]);

  const tilvalgReceiptTotal = cleanlinessSurcharge + selectedExtrasTotal;

  const klubReceiptGrandTotal = klubReceiptTotal + tilvalgReceiptTotal;

  const engangsReceiptGrandTotal = pricing.firstVisitGross + tilvalgReceiptTotal;

  const receiptPromoDiscountKr = promoCode ? promoDiscountKr : 0;
  const klubReceiptGrandTotalWithPromo = Math.max(
    0,
    klubReceiptGrandTotal - receiptPromoDiscountKr,
  );
  const engangsReceiptGrandTotalWithPromo = Math.max(
    0,
    engangsReceiptGrandTotal - receiptPromoDiscountKr,
  );

  const selectedCleanlinessLabel = useMemo(
    () =>
      BOOK_CLEANLINESS_LEVELS.find((option) => option.id === cleanlinessLevel)
        ?.label ?? "",
    [cleanlinessLevel],
  );

  const handleExtraToggle = useCallback((extraId: string) => {
    setSelectedExtras((current) => {
      const next = { ...current };
      if (next[extraId]) {
        delete next[extraId];
      } else {
        next[extraId] = 1;
      }
      return next;
    });
  }, []);

  const handleExtraQtyChange = useCallback(
    (extraId: string, delta: number) => {
      setSelectedExtras((current) => {
        const currentQty = current[extraId] ?? 0;
        const nextQty = Math.max(0, currentQty + delta);
        const next = { ...current };
        if (nextQty === 0) {
          delete next[extraId];
        } else {
          next[extraId] = nextQty;
        }
        return next;
      });
    },
    [],
  );

  const bookingExtrasPayload = useMemo(
    () =>
      buildBookCleaningExtrasPayload(
        selectedExtras,
        activeFrequency.type === "recurring",
        cleanlinessLevel,
        serviceExtras,
        clubSelected && activeFrequency.type !== "oneoff",
      ),
    [
      selectedExtras,
      activeFrequency.type,
      clubSelected,
      cleanlinessLevel,
      serviceExtras,
    ],
  );

  const fetchL27Estimate = useCallback(
    async (
      discountCode?: string,
    ): Promise<
      | { ok: true; total: number; duration?: number }
      | { ok: false; details?: unknown; message?: string }
    > => {
      if (
        !selectedDate ||
        !selectedSlot ||
        effectiveM2 === null ||
        !isSelectedSlotBookable
      ) {
        return { ok: false, message: "Manglende dato, tid eller m²." };
      }

      const serviceDate = `${selectedDate}T${String(selectedSlot.startHour).padStart(2, "0")}:${String(selectedSlot.startMinute).padStart(2, "0")}:00`;
      const response = await fetch(L27_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "estimate",
          service_id: String(L27_BOOK_SERVICE_ID),
          pricing_param_id: String(L27_BOOK_PRICING_PARAM_ID),
          pricing_param_quantity: effectiveM2,
          frequency_id: billingFrequencyId,
          service_date: serviceDate,
          extras: bookingExtrasPayload,
          ...(discountCode ? { discount_code: discountCode } : {}),
        }),
      });
      const resData = await response.json();
      if (!resData.success) {
        return {
          ok: false,
          details: resData.details,
          message: resData.message,
        };
      }

      const total = Number(resData.data?.total);
      if (!Number.isFinite(total)) {
        return { ok: false, message: "Ugyldigt prissvar fra Launch27." };
      }
      return { ok: true, total, duration: Number(resData.data?.duration) || undefined };
    },
    [
      selectedDate,
      selectedSlot,
      effectiveM2,
      billingFrequencyId,
      bookingExtrasPayload,
      isSelectedSlotBookable,
    ],
  );

  useEffect(() => {
    setPromoCode("");
    setPromoInput("");
    setPromoDiscountKr(0);
    setPromoMsg("");
    setPromoIsError(false);
    setShowPromoInput(false);
  }, [billingFrequencyId, effectiveM2, clubSelected, cleanlinessLevel]);

  const handlePromoApply = useCallback(async () => {
    setPromoIsError(false);
    setPromoMsg("");

    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoIsError(true);
      setPromoMsg("Indtast en rabatkode.");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      setPromoIsError(true);
      setPromoMsg("Vælg dato og tid først.");
      return;
    }
    if (!isSelectedSlotBookable) {
      setPromoIsError(true);
      setPromoMsg(
        "Det valgte tidspunkt er ikke længere ledigt. Vælg en anden dato eller tid.",
      );
      return;
    }

    setIsValidatingPromo(true);
    try {
      const baseResult = await fetchL27Estimate();
      if (!baseResult.ok) {
        setPromoIsError(true);
        setPromoMsg(
          parseL27BookingError(
            baseResult.details,
            "Kunne ikke beregne pris for det valgte tidspunkt. Vælg en anden dato eller tid.",
          ),
        );
        return;
      }
      const discountedResult = await fetchL27Estimate(code);
      if (!discountedResult.ok) {
        setPromoIsError(true);
        const timeError = parseL27BookingError(
          discountedResult.details,
          "",
        );
        setPromoMsg(
          timeError && /tidspunkt|booked this time/i.test(timeError)
            ? timeError
            : "Ugyldig rabatkode.",
        );
        return;
      }

      const discount = Math.max(
        0,
        Math.round(baseResult.total - discountedResult.total),
      );
      if (discount <= 0) {
        setPromoIsError(true);
        setPromoMsg("Rabatkoden kan ikke bruges på denne booking.");
        return;
      }

      setPromoCode(code);
      setPromoDiscountKr(discount);
      setPromoMsg(`Rabatkode ${code} er tilføjet.`);
    } catch {
      setPromoIsError(true);
      setPromoMsg("Kunne ikke kontrollere rabatkoden. Prøv igen.");
    } finally {
      setIsValidatingPromo(false);
    }
  }, [fetchL27Estimate, promoInput, selectedDate, selectedSlot, isSelectedSlotBookable]);

  const handlePromoRemove = useCallback(() => {
    setPromoCode("");
    setPromoInput("");
    setPromoDiscountKr(0);
    setPromoMsg("");
    setPromoIsError(false);
  }, []);

  const introCleaningDueKr = useMemo(() => {
    if (introTierExceeded) return pricing.firstVisitIntro;
    return Math.max(0, pricing.firstVisitIntro - ZEN_CREDIT_MONTHLY_KR);
  }, [introTierExceeded, pricing.firstVisitIntro]);

  const frekvensStepIndex = STEPS.indexOf("frekvens");
  const datoStepIndex = STEPS.indexOf("dato");
  const frequencyStepReached = stepIndex >= frekvensStepIndex;
  const receiptServiceLabel = useMemo(() => {
    if (chosenFrequency.type === "oneoff") {
      return "Engangsrengøring";
    }
    if (!isBook2 && !clubSelected) {
      return "Engangsrengøring";
    }
    if (
      isBook2 &&
      stepIndex >= datoStepIndex &&
      selectedSlot &&
      !clubSelected
    ) {
      return "Engangsrengøring";
    }
    return chosenFrequency.label;
  }, [
    chosenFrequency,
    isBook2,
    stepIndex,
    datoStepIndex,
    clubSelected,
    selectedSlot,
  ]);
  const showPricingSummary = (() => {
    if (isBook2) {
      if (stepIndex < datoStepIndex || effectiveM2 === null) return false;
      if (stepIndex === datoStepIndex && !selectedDate) return false;
      return true;
    }
    if (stepIndex < frekvensStepIndex) return false;
    if (stepIndex === datoStepIndex && !selectedDate) return false;
    return true;
  })();
  const showKlubSummary = clubSelected && showPricingSummary;
  const displayReceiptGrandTotal = showKlubSummary
    ? klubReceiptGrandTotalWithPromo
    : engangsReceiptGrandTotalWithPromo;

  const klubColumnFrequency = useMemo(
    () => getFrequencyOption(isBook2 ? bookFrequencyId : recurringFrequencyId),
    [isBook2, bookFrequencyId, recurringFrequencyId],
  );

  const klubColumnIntroPrice = introPrice;

  const klubColumnSavings = introTierExceeded ? 0 : listPrice - introPrice;

  const isRecurringBooking = chosenFrequency.type === "recurring";

  const dateTileMemberPrice = isRecurringBooking
    ? isBook2
      ? bookMemberPrice
      : memberPriceDeal
    : listPrice;

  const dateTileMemberNet = Math.max(
    0,
    dateTileMemberPrice - Math.round(dateTileMemberPrice * 0.26),
  );

  const bookKlubButtonPrice = useMemo(() => {
    if (introTierExceeded || chosenFrequency.type === "oneoff") {
      return bookMemberPrice;
    }
    return Math.max(0, introPrice - ZEN_CREDIT_MONTHLY_KR);
  }, [
    bookMemberPrice,
    chosenFrequency.type,
    introPrice,
    introTierExceeded,
  ]);

  const canMobileDatePrev = mobileDateStartIndex > 0;
  const canMobileDateNext =
    mobileDateStartIndex + MOBILE_DATE_VISIBLE < bookableWeekdays.length;

  const handleCarouselTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;
      carouselSwipeRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [],
  );

  const handleCarouselTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = carouselSwipeRef.current;
      if (!start) return;
      const touch = event.changedTouches[0];
      carouselSwipeRef.current = null;
      if (!touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0 && canMobileDateNext) {
        setMobileDateStartIndex((index) =>
          Math.min(
            Math.max(0, bookableWeekdays.length - MOBILE_DATE_VISIBLE),
            index + 1,
          ),
        );
      } else if (dx > 0 && canMobileDatePrev) {
        setMobileDateStartIndex((index) => Math.max(0, index - 1));
      }
    },
    [bookableWeekdays.length, canMobileDateNext, canMobileDatePrev],
  );

  const toggleCalendar = useCallback(() => {
    setShowCalendar((open) => {
      const next = !open;
      if (next) {
        const base = selectedDate
          ? new Date(selectedDate + "T12:00:00")
          : mobileVisibleDates[0] ?? new Date();
        setViewDate(new Date(base.getFullYear(), base.getMonth(), 1));
      }
      return next;
    });
  }, [selectedDate, mobileVisibleDates]);

  const handleSelectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setShowCalendar(false);
  }, []);

  const handleSelectWithoutKlub = useCallback(() => {
    setClubSelected(false);
  }, []);

  const handleSelectWithKlub = useCallback(() => {
    setClubSelected(true);
  }, []);

  const receiptFrequencyLabel =
    chosenFrequency.type === "oneoff"
      ? "Engangs"
      : chosenFrequency.label.toLowerCase();

  const formattedVisitDate = useMemo(() => {
    if (!selectedDate) return "—";
    return new Date(selectedDate + "T12:00:00").toLocaleDateString("da-DK", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [selectedDate]);

  const klubAnnualCleaningSavings = useMemo(() => {
    if (
      !clubSelected ||
      chosenFrequency.type !== "recurring" ||
      effectiveM2 === null
    ) {
      return 0;
    }
    const visitsPerYear = FREQUENCY_VISITS_PER_YEAR[chosenFrequency.id] ?? 26;
    const perVisitSaving = Math.max(0, listPrice - pricing.ongoingGross);
    return perVisitSaving * visitsPerYear;
  }, [
    clubSelected,
    chosenFrequency.type,
    chosenFrequency.id,
    effectiveM2,
    listPrice,
    pricing.ongoingGross,
  ]);

  const renderBook2TimeRow = (
    slot: TimeSlot,
    timeLabel: string,
    timeSub?: string,
  ) => {
    const isSelectedNormal =
      selectedSlot?.label === slot.label && !clubSelected;
    const isSelectedKlub = selectedSlot?.label === slot.label && clubSelected;
    const showKlubOfferModal =
      isBook2 &&
      !introTierExceeded &&
      chosenFrequency.type === "recurring";

    return (
      <div className={styles.timePriceRow} key={slot.label}>
        <div className={styles.timePriceTime}>
          <span className={styles.timePriceTimeMain}>{timeLabel}</span>
          {timeSub && (
            <span className={styles.timePriceTimeSub}>{timeSub}</span>
          )}
        </div>
        <button
          type="button"
          className={`${styles.timePriceBtn} ${styles.timePriceBtnNormal} ${isSelectedNormal ? styles.timePriceBtnSelected : ""}`}
          onClick={() => selectTimeSlot(slot, false)}
        >
          <span>{formatKrAmount(listPrice)} kr</span>
          <span className={styles.timePriceBtnSub}>Engangs</span>
        </button>
        <button
          type="button"
          className={`${styles.timePriceBtn} ${styles.timePriceBtnKlub} ${isSelectedKlub ? styles.timePriceBtnSelected : ""}`}
          onClick={() =>
            showKlubOfferModal
              ? openKlubOffer(slot)
              : selectTimeSlot(slot, true)
          }
        >
          <span>{formatKrAmount(bookKlubButtonPrice)} kr</span>
          <span className={styles.timePriceBtnSub}>
            {introTierExceeded ? "Intro + Klub" : "1. rengøring + Klub"}
          </span>
        </button>
      </div>
    );
  };

  const renderKlubOfferModal = () => {
    if (!klubOfferOpen || !klubOfferComparison) return null;

    const { cleaningDue, freqDiscount } = klubOfferComparison;

    const benefits = [
      {
        icon: Tag,
        text: `Første rengøring fra ${formatKrAmount(cleaningDue)} kr.`,
      },
      {
        icon: Percent,
        text: `Spar ${freqDiscount}% på fast rengøring`,
      },
      {
        icon: Sparkles,
        text: `Få ${formatKrAmount(ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR)} kr. i Zenkreditter`,
      },
      {
        icon: Sparkles,
        text: "Brug kreditter på ekstra hjælp i hjemmet",
      },
      {
        icon: CalendarCheck,
        text: "Få prioriteret booking og fast Zenmester",
      },
      {
        icon: UserRound,
        text: "Få medlemspriser på udvalgte boligservices",
      },
    ];

    return (
      <div
        className={`${styles.klubOfferLayer} ${klubOfferOpen ? styles.klubOfferLayerOpen : ""}`}
        aria-hidden={!klubOfferOpen}
      >
        <div
          className={styles.klubOfferPanel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="klub-offer-title"
        >
          <div className={styles.klubOfferInner}>
          <div className={styles.klubOfferTopBar}>
            <div className={styles.klubOfferBrand}>
              <Image
                src="/renzen-logo-ny.png"
                alt="Renzen"
                width={162}
                height={42}
                className={styles.klubOfferLogo}
              />
              <span className={styles.klubOfferBrandLabel}>Klub</span>
            </div>
            <button
              type="button"
              className={styles.klubOfferClose}
              onClick={() => confirmKlubOffer(false)}
              aria-label="Luk og vælg engangsrengøring"
            >
              ×
            </button>
          </div>

          <div className={styles.klubOfferBody}>
            <h2 id="klub-offer-title" className={styles.klubOfferHeadline}>
              Bliv medlem — og få mere for dine penge
            </h2>
            <p className={styles.klubOfferSubhead}>
              Renzen Klub giver dig lavere priser,{" "}
              {formatKrAmount(ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR)} kr. i
              Zenkreditter og ekstra fordele til hjemmet — samlet for kun{" "}
              {formatKrAmount(KLUB_ANNUAL_KR)} kr. om året.
            </p>

            <ul className={styles.klubOfferBenefits}>
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className={styles.klubOfferBenefit}>
                  <span className={styles.klubOfferBenefitIcon} aria-hidden>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className={styles.klubOfferAnnualBlock}>
              <p className={styles.klubOfferAnnual}>
                Kun <strong>{formatKrAmount(KLUB_ANNUAL_KR)} kr.</strong> om året
              </p>
              <p className={styles.klubOfferAnnualSub}>
                Tjener sig typisk hjem efter få faste rengøringer
              </p>
            </div>
          </div>

          <div className={styles.klubOfferCtaRow}>
            <button
              type="button"
              className={styles.klubOfferAccept}
              onClick={() => confirmKlubOffer(true)}
            >
              Ja, tilføj Klub
            </button>
            <button
              type="button"
              className={styles.klubOfferDecline}
              onClick={() => confirmKlubOffer(false)}
            >
              Nej tak
            </button>
          </div>

          <p className={styles.klubOfferLegal}>{BOOK2_INTRO_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTilvalgReceiptRows = () => {
    if (!showPricingSummary) return null;

    const extraRows = Object.entries(selectedExtras)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const extra = availableExtras.find((item) => item.id === id);
        if (!extra) return null;
        const lineTotal = extra.price * qty;
        return (
          <div key={id} className={styles.receiptRow}>
            <span className={styles.receiptRowLabel}>
              {extra.name}
              {qty > 1 ? (
                <small className={styles.receiptRowSubline}>× {qty}</small>
              ) : null}
            </span>
            <strong>{formatReceiptKr(lineTotal)}</strong>
          </div>
        );
      });

    if (
      cleanlinessSurcharge <= 0 &&
      !extraRows.some((row) => row !== null)
    ) {
      return null;
    }

    return (
      <>
        {cleanlinessSurcharge > 0 && (
          <div className={styles.receiptRow}>
            <span className={styles.receiptRowLabel}>
              Ekstra tid
              <small className={styles.receiptRowSubline}>
                {cleanlinessReceiptSubline(cleanlinessLevel)}
              </small>
            </span>
            <strong>{formatReceiptKr(cleanlinessSurcharge)}</strong>
          </div>
        )}
        {extraRows}
      </>
    );
  };

  const renderPromoDiscountRow = () => {
    if (receiptPromoDiscountKr <= 0 || !promoCode) return null;
    return (
      <div className={`${styles.receiptRow} ${styles.receiptRowGreen}`}>
        <span>Rabatkode ({promoCode})</span>
        <strong>{formatReceiptDelta(receiptPromoDiscountKr, false)}</strong>
      </div>
    );
  };

  const renderPromoSection = () => {
    if (!showPricingSummary) return null;

    return (
      <div className={styles.promoSection}>
        {!showPromoInput && !promoCode ? (
          <button
            type="button"
            className={styles.promoToggle}
            onClick={() => setShowPromoInput(true)}
          >
            Har du en rabatkode?
          </button>
        ) : (
          <>
            <label className={styles.promoLabel} htmlFor="deal-promo-input">
              Rabatkode
            </label>
            <div className={styles.promoControls}>
              <input
                id="deal-promo-input"
                type="text"
                className={styles.promoInput}
                placeholder="Indtast kode"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                disabled={!!promoCode || isValidatingPromo}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (!promoCode) void handlePromoApply();
                  }
                }}
              />
              <button
                type="button"
                className={`${styles.promoBtn} ${promoCode ? styles.promoBtnRemove : ""}`}
                onClick={() => {
                  if (promoCode) {
                    handlePromoRemove();
                  } else {
                    void handlePromoApply();
                  }
                }}
                disabled={isValidatingPromo}
              >
                {isValidatingPromo
                  ? "Tjekker…"
                  : promoCode
                    ? "Fjern"
                    : "Tilføj"}
              </button>
            </div>
            {promoMsg && (
              <p
                className={
                  promoIsError ? styles.promoMsgError : styles.promoMsgSuccess
                }
                role={promoIsError ? "alert" : "status"}
              >
                {promoMsg}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderReceipt = (compact = false) => {
    const totalLabel = isBook2 ? "Samlet pris" : "Total i dag";
    const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
      "da-DK",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    );

    return (
      <div className={styles.receipt}>
        {!compact && (
          <div className={styles.trustRow}>
            <span>4,8 kundescore</span>
            <span>RenCover 10 mio.</span>
          </div>
        )}

        <div className={styles.receiptHead}>
          {frequencyStepReached && (
            <p className={styles.receiptPackage}>{receiptServiceLabel}</p>
          )}
          <p className={styles.receiptMeta}>
            {isBook2 && !isActualM2Valid
              ? "— m²"
              : `${effectiveM2 ?? tierM2} m²`}
          </p>
        </div>

        {!compact && postnummerFilled && (
          <div className={styles.selectionGrid}>
            <div
              className={styles.selectionCell}
              style={{ gridColumn: "1 / -1" }}
            >
              <span className={styles.selectionLabel}>Postnummer</span>
              <span className={styles.selectionValue}>
                {zip} {city}
              </span>
            </div>
            {showPricingSummary && stepIndex >= datoStepIndex && selectedDate && (
              <>
                <div className={styles.selectionCell}>
                  <span className={styles.selectionLabel}>Dato</span>
                  <span className={styles.selectionValue}>
                    {formattedVisitDate}
                  </span>
                </div>
                <div className={styles.selectionCell}>
                  <span className={styles.selectionLabel}>Tid</span>
                  <span className={styles.selectionValue}>
                    {selectedSlot?.label ?? "—"}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {!showPricingSummary ? (
          <>
            <p className={styles.receiptKlubNote}>
              {isBook2
                ? "Pris vises, når du vælger dato og tid."
                : "Pris vises, når du vælger frekvens og medlemskab."}
            </p>
          </>
        ) : !showKlubSummary ? (
          <>
            <div
              className={`${styles.receiptSection} ${styles.receiptSectionPreTotal}`}
            >
              <div className={styles.receiptSectionHead}>
                <span className={styles.receiptSectionTitle}>Rengøring</span>
              </div>
              <div className={styles.receiptBreakdown}>
                <div className={styles.receiptRow}>
                  <span>Engangsrengøring:</span>
                  <strong>{formatReceiptKr(pricing.firstVisitIntro)}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Administrationsgebyr:</span>
                  <strong>{formatReceiptDelta(pricing.adminFee, true)}</strong>
                </div>
                {renderTilvalgReceiptRows()}
              </div>
              <div className={styles.receiptTotals}>
                {renderPromoDiscountRow()}
                <div className={styles.receiptFirstVisitTotal}>
                  <span>{totalLabel}</span>
                  <strong>{formatReceiptKr(engangsReceiptGrandTotalWithPromo)}</strong>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`${styles.receiptSection} ${styles.receiptSectionFirstVisit}`}
            >
              <div className={styles.receiptSectionHead}>
                <span className={styles.receiptSectionTitle}>
                  1. rengøring{" "}
                  {!introTierExceeded && (
                    <span className={styles.receiptSectionSubtitle}>
                      (Første besøg)
                    </span>
                  )}
                </span>
                {pricing.firstVisitSavings > 0 && !isBook2 && (
                  <span className={styles.saveBadge}>
                    Spar {formatReceiptKr(pricing.firstVisitSavings)}
                  </span>
                )}
              </div>
              <div className={styles.receiptBreakdown}>
                {introTierExceeded ? (
                  <div className={styles.receiptRow}>
                    <span>Rengøring:</span>
                    <strong>{formatReceiptKr(pricing.firstVisitIntro)}</strong>
                  </div>
                ) : (
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptRowLabel}>
                      1. rengøring
                      <small className={styles.receiptRowSubline}>
                        Første besøg
                      </small>
                    </span>
                    <strong>{formatReceiptKr(introCleaningDueKr)}</strong>
                  </div>
                )}
              </div>
              {!introTierExceeded && (
                <>
                  <div className={styles.receiptBreakdownToggleWrap}>
                    <button
                      type="button"
                      className={styles.receiptBreakdownToggle}
                      onClick={() =>
                        setReceiptPriceBreakdownOpen((open) => !open)
                      }
                      aria-expanded={receiptPriceBreakdownOpen}
                    >
                      {receiptPriceBreakdownOpen
                        ? "Skjul prisopdeling"
                        : "Se hvordan prisen er sat sammen"}
                    </button>
                  </div>
                  {receiptPriceBreakdownOpen && (
                    <div className={styles.receiptBreakdownDetail}>
                      <div className={styles.receiptRow}>
                        <span>Normalpris:</span>
                        <strong className={styles.receiptPriceStruck}>
                          {formatReceiptKr(pricing.standardPrice)}
                        </strong>
                      </div>
                      <div className={styles.receiptRow}>
                        <span className={styles.receiptRowLabel}>
                          Intropris
                          <small className={styles.receiptRowSubline}>
                            1. rengøring
                          </small>
                        </span>
                        <strong>
                          {formatReceiptKr(pricing.firstVisitIntro)}
                        </strong>
                      </div>
                      <div
                        className={`${styles.receiptRow} ${styles.receiptRowGreen}`}
                      >
                        <span className={styles.receiptRowLabel}>
                          Velkomstkredit
                          <small className={styles.receiptRowSubline}>
                            Anvendes på 1. besøg
                          </small>
                        </span>
                        <strong>
                          {formatReceiptDelta(ZEN_CREDIT_MONTHLY_KR, false)}
                        </strong>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className={styles.receiptBreakdown}>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptRowLabel}>
                    Renzen Klub
                    <small className={styles.receiptRowSubline}>
                      12 mdr. · {klubMonthlyLabel} kr./md.
                    </small>
                  </span>
                  <strong>{formatReceiptKr(pricing.clubFee)}</strong>
                </div>
                {renderTilvalgReceiptRows()}
              </div>
            </div>

            <div className={styles.receiptTotals}>
              {renderPromoDiscountRow()}
              <div className={styles.receiptFirstVisitTotal}>
                <span>{totalLabel}</span>
                <strong>{formatReceiptKr(klubReceiptGrandTotalWithPromo)}</strong>
              </div>
            </div>

            {klubAnnualCleaningSavings > 0 && (
              <div className={styles.receiptMembershipCallout}>
                Med Klub sparer du ca. {formatKr(klubAnnualCleaningSavings)} om
                året på din faste rengøring og får op til{" "}
                {formatReceiptKr(ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR)} i
                Zenkreditter til ekstra hjælp i hjemmet.
              </div>
            )}

            <div
              className={`${styles.receiptSection} ${styles.receiptSectionRecurring}`}
            >
              <div className={styles.receiptSectionHead}>
                <span className={styles.receiptSectionTitle}>
                  Din faste pris herefter
                </span>
              </div>
              <div className={styles.receiptBreakdown}>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptRowLabel}>
                    Rengøring:
                    <small className={styles.receiptRowSubline}>
                      {receiptFrequencyLabel}
                      {activeFrequency.discount > 0 && (
                        <> (spar {activeFrequency.discount} %)</>
                      )}
                    </small>
                  </span>
                  <strong>{formatReceiptKr(pricing.ongoingGross)}</strong>
                </div>
                <div className={`${styles.receiptRow} ${styles.receiptRowGreen}`}>
                  <span>Efter servicefradrag ca.</span>
                  <strong>{formatReceiptKr(pricing.ongoingNet)}</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {renderPromoSection()}

        <div className={styles.receiptPaymentNote}>
          <div className={styles.selectionCell}>
            <span className={styles.selectionLabel}>Betaling</span>
            <span className={styles.selectionValue}>
              0 kr. trækkes ved booking
            </span>
            <span className={styles.selectionSub}>
              {isBook2 && showKlubSummary && !introTierExceeded
                ? "Faktureres efter rengøringen er udført · 14 dages fortrydelse på Klub hvis intro og kreditter ikke er brugt"
                : "Faktureres efter rengøringen er udført"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const canContinue = useMemo(() => {
    switch (step) {
      case "postnummer":
        return (
          postnummerFilled && (!isBook2 || isActualM2Valid)
        );
      case "dato":
        return (
          spotsLoaded &&
          !!selectedDate &&
          !!selectedSlot &&
          isSelectedSlotBookable
        );
      case "frekvens":
        return true;
      case "boligstand":
        return !!cleanlinessLevel && !!lastCleaned;
      case "tilvalg":
        return true;
      case "adgang":
        return (
          !!entryMethod &&
          (entryMethod !== "other" || entryOtherDetails.trim().length > 0)
        );
      case "kontakt":
        return (
          postnummerFilled &&
          address.trim().length > 2 &&
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
    address,
    zip,
    city,
    selectedDate,
    selectedSlot,
    isSelectedSlotBookable,
    spotsLoaded,
    billingFrequencyId,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    cardComplete,
    termsAccepted,
    isActualM2Valid,
    isBook2,
    postnummerFilled,
    cleanlinessLevel,
    lastCleaned,
  ]);

  const goNext = useCallback(async () => {
    setError("");
    if (!canContinue) return;

    if (step === "betaling") {
      setIsSubmitting(true);
      try {
        if (!selectedDate || !selectedSlot) {
          setError(
            "Vælg dato og tid før du bekræfter bookingen.",
          );
          return;
        }

        const dayResult = await fetchL27SpotsRange(selectedDate, 1);
        const daySpots = dayResult.cache[selectedDate] ?? [];
        if (
          !dayResult.ok ||
          !selectedSlot ||
          !isBookableSlotInSpots(daySpots, selectedSlot)
        ) {
          if (dayResult.ok) {
            setSpotsCache((prev) => ({ ...prev, ...dayResult.cache }));
          }
          setSelectedSlot(null);
          setError(
            "Det valgte tidspunkt er ikke længere ledigt. Gå tilbage og vælg en anden dato eller tid.",
          );
          return;
        }
        setSpotsCache((prev) => ({ ...prev, ...dayResult.cache }));

        const stripeToken = await createStripeCardToken(stripe, elements);
        const dateStr = `${selectedDate}T${String(selectedSlot!.startHour).padStart(2, "0")}:${String(selectedSlot!.startMinute).padStart(2, "0")}:00`;
        const customFields = buildBookCleaningCustomFieldsPayload(
          bookCustomFields,
          entryMethod,
          entryOtherDetails,
          cleanlinessLevel,
          lastCleaned,
        );
        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "booking",
            email,
            first_name: firstName,
            last_name: lastName,
            address,
            city,
            zip,
            phone,
            frequency_id: billingFrequencyId,
            service_date: dateStr,
            arrival_window: selectedSlot.arrivalWindow,
            stripe_token: stripeToken,
            extras: bookingExtrasPayload,
            service_id: String(L27_BOOK_SERVICE_ID),
            pricing_param_id: String(L27_BOOK_PRICING_PARAM_ID),
            pricing_param_quantity: effectiveM2 ?? parseInt(actualM2Input, 10),
            ...(customFields ? { custom_fields: customFields } : {}),
            ...(promoCode ? { discount_code: promoCode } : {}),
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

        if (isBook2) {
          const confirmationExtras = Object.entries(selectedExtras)
            .filter(([, qty]) => qty > 0)
            .flatMap(([id, qty]) => {
              const extra = availableExtras.find((item) => item.id === id);
              if (!extra) return [];
              return [
                {
                  id,
                  label: extra.name,
                  price: extra.price,
                  quantity: qty,
                },
              ];
            });
          const book2KlubSummary =
            clubSelected && chosenFrequency.type !== "oneoff";
          const confirmationPayload: BookingConfirmationPayload = {
            bookingId: resolvedBookingId,
            source: "book2",
            firstName: firstName.trim(),
            email: email.trim(),
            date: selectedDate,
            timeSlot: selectedSlot?.label.split(" – ")[0] ?? selectedSlot?.label ?? "",
            address: address.trim(),
            postcode: zip,
            city,
            frequency: chosenFrequency.label,
            frequencyId: chosenFrequencyId,
            squareMeters: effectiveM2 ?? parseInt(actualM2Input, 10),
            isKlub: book2KlubSummary,
            totalTodayKr: book2KlubSummary
              ? klubReceiptGrandTotalWithPromo
              : engangsReceiptGrandTotalWithPromo,
            recurringKr:
              book2KlubSummary && chosenFrequency.type === "recurring"
                ? pricing.ongoingGross
                : undefined,
            extras: confirmationExtras,
            boligstandLabel: selectedCleanlinessLabel || undefined,
            boligstandSurchargeKr:
              cleanlinessSurcharge > 0 ? cleanlinessSurcharge : undefined,
            serviceLabel: receiptServiceLabel,
            createdAt: new Date().toISOString(),
          };
          saveBookingConfirmation(confirmationPayload);
          setIsRedirecting(true);
          router.push("/booking-modtaget/");
          return;
        }

        setBookingId(resolvedBookingId);
        setIsDone(true);
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

    setStepIndex((i) => getNextStepIndex(i));
  }, [
    canContinue,
    step,
    selectedDate,
    selectedSlot,
    isSelectedSlotBookable,
    email,
    firstName,
    lastName,
    address,
    city,
    zip,
    phone,
    effectiveM2,
    postnummerFilled,
    billingFrequencyId,
    clubSelected,
    isOneTime,
    bookingExtrasPayload,
    bookCustomFields,
    entryMethod,
    entryOtherDetails,
    cleanlinessLevel,
    lastCleaned,
    isBook2,
    router,
    selectedExtras,
    availableExtras,
    chosenFrequency,
    chosenFrequencyId,
    actualM2Input,
    klubReceiptGrandTotal,
    engangsReceiptGrandTotal,
    pricing.ongoingGross,
    selectedCleanlinessLabel,
    cleanlinessSurcharge,
    receiptServiceLabel,
    promoCode,
    promoDiscountKr,
    klubReceiptGrandTotalWithPromo,
    engangsReceiptGrandTotalWithPromo,
    stripe,
    elements,
  ]);

  const goBack = () => {
    setError("");
    if (stepIndex === 0) {
      onBack();
      return;
    }
    setStepIndex((i) => getPrevStepIndex(i));
  };

  const handlePostcodeInputChange = (value: string) => {
    setPostcodeQuery(value);
    setZip("");
    setCity("");

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length === 4) {
      setShowZipSuggestions(false);
      void lookupPostnummer(digitsOnly).then((result) => {
        if (!result) {
          setZip(digitsOnly);
          setCity("");
          return;
        }
        setPostcodeQuery(result.tekst);
        setZip(result.nr);
        setCity(isServedPostcode(result.nr) ? result.navn : "");
      });
      return;
    }

    fetchZipSuggestions(value, setZipSuggestions, setShowZipSuggestions);
  };

  const handlePostcodeSelect = (suggestion: DawaPostnummerSuggestion) => {
    setPostcodeQuery(suggestion.tekst);
    setZip(suggestion.nr);
    setCity(suggestion.navn);
    setZipSuggestions([]);
    setShowZipSuggestions(false);
  };

  const handleContactAddressChange = (value: string) => {
    setAddress(value);
    fetchAddressSuggestions(
      value,
      setAddressSuggestions,
      setShowAddressSuggestions,
      zip,
    );
  };

  const handleContactAddressSelect = (suggestion: DawaAddressSuggestion) => {
    if (suggestion.adresse.postnr !== zip) return;
    setAddress(formatStreetAddress(suggestion.adresse));
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      goNext();
    }
  };

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

  if (isDone) {
    return (
      <div className={styles.shell}>
        <main className={styles.successMain}>
          <div className={`${styles.frame} ${styles.step}`}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>Du er booket</h1>
            <p className={styles.successCopy}>
              Tak {firstName}. Vi har modtaget din booking
              {bookingId ? ` (${bookingId})` : ""} og sender bekræftelse til{" "}
              {email}. Din{" "}
              {isOneTime ? "rengøring" : "første rengøring"} koster{" "}
              {formatKr(pricing.firstVisitIntro)} efter besøget.
            </p>
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
          {step === "postnummer" && (
            <>
              <h1 className={styles.question}>Hvor bor du?</h1>
              <p className={styles.hint}>
                Indtast postnummer{isBook2 ? " og boligens størrelse" : ""} i{" "}
                {SERVED_AREA_LABEL} (postnr. {SERVED_AREA_POSTNR_RANGE}) — gade
                og nummer kommer senere.
              </p>
              <div className={styles.fieldStack}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="deal-zip">
                    Postnummer
                  </label>
                  <div
                    className={styles.addressAutocomplete}
                    ref={postcodeDropdownRef}
                  >
                    <input
                      id="deal-zip"
                      className={styles.input}
                      value={postcodeQuery}
                      onChange={(e) =>
                        handlePostcodeInputChange(e.target.value)
                      }
                      placeholder="F.eks. 2100 eller Nørrebro"
                      autoFocus
                      autoComplete="off"
                    />
                    {showZipSuggestions && zipSuggestions.length > 0 && (
                      <ul className={styles.suggestionsList} role="listbox">
                        {zipSuggestions.map((suggestion) => (
                          <li key={suggestion.tekst} role="option">
                            <button
                              type="button"
                              className={styles.suggestionItem}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handlePostcodeSelect(suggestion);
                              }}
                            >
                              {suggestion.tekst}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {postnummerFilled && (
                    <div className={styles.badge}>✓ Vi dækker {city}</div>
                  )}
                  {showZipUnserved && (
                    <p className={styles.areaUnserved} role="alert">
                      {UNSERVED_AREA_MESSAGE}
                    </p>
                  )}
                </div>
                {city && postnummerFilled && (
                  <div>
                    <label className={styles.fieldLabel} htmlFor="deal-city">
                      By
                    </label>
                    <input
                      id="deal-city"
                      className={`${styles.input} ${styles.inputReadonly}`}
                      value={city}
                      readOnly
                      tabIndex={-1}
                    />
                  </div>
                )}
              </div>
              {isBook2 && (
                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="deal-actual-m2">
                    Dit faktiske areal
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="deal-actual-m2"
                      className={`${styles.input} ${styles.m2FormInput} ${!isActualM2Valid && actualM2Input.trim() !== "" ? styles.m2FormInputInvalid : ""}`}
                      type="number"
                      inputMode="numeric"
                      min={M2_MIN}
                      max={M2_MAX}
                      value={actualM2Input}
                      onChange={(e) =>
                        setActualM2Input(
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                      aria-describedby="deal-actual-m2-hint"
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                  <p
                    id="deal-actual-m2-hint"
                    className={`${styles.m2FormHint} ${!isActualM2Valid && actualM2Input.trim() !== "" ? styles.m2FormHintError : ""}`}
                  >
                    {!isActualM2Valid && actualM2Input.trim() !== ""
                      ? `Indtast mellem ${M2_MIN} og ${M2_MAX} m²`
                      : "Løbende pris beregnes ud fra dit faktiske areal"}
                  </p>
                </div>
              )}
            </>
          )}

          {step === "dato" && (
            <>
              <h1 className={styles.question}>Hvornår skal vi komme?</h1>
              <p className={styles.hint}>
                Vælg en hverdag og et tidspunkt til din første rengøring.
              </p>
              {loadingSpots ? (
                <p className={styles.loading}>Henter ledige datoer…</p>
              ) : spotsFetchState === "error" ? (
                <div className={styles.loading}>
                  <p>
                    Kunne ikke hente ledige tider fra bookingsystemet. Prøv igen
                    om et øjeblik.
                  </p>
                  <button
                    type="button"
                    className={styles.dateWeekBtn}
                    onClick={() => void refreshSpots()}
                  >
                    Prøv igen
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.dateStepMobile}>
                    {!isBook2 && isRecurringBooking && (
                      <div className={styles.datePromoCard}>
                        <div className={styles.datePromoMark} aria-hidden>
                          R
                        </div>
                        <div className={styles.datePromoBody}>
                          <p className={styles.datePromoTitle}>
                            Lås op for fordele
                          </p>
                          <p className={styles.datePromoCopy}>
                            {klubColumnSavings > 0 ? (
                              <>
                                Spar op til{" "}
                                <strong>{formatKr(klubColumnSavings)}</strong> på
                                intro og{" "}
                                <strong>{formatKr(ZEN_CREDIT_MONTHLY_KR)}</strong>{" "}
                                i Zen-kredit med Renzen Klub.
                              </>
                            ) : (
                              <>
                                Få medlemspris, Zen-kredit og løbende fordele med
                                Renzen Klub.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      ref={mobileCalendarTriggerRef}
                      className={styles.dateMonthTrigger}
                      onClick={toggleCalendar}
                      aria-expanded={showCalendar}
                      aria-controls="deal-mobile-calendar"
                      aria-label="Vælg måned i kalender"
                    >
                      <svg
                        className={styles.dateMonthIcon}
                        width="18"
                        height="18"
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
                      <span>{mobileMonthLabel}</span>
                      <svg
                        className={`${styles.dateMonthChevron} ${showCalendar ? styles.dateMonthChevronOpen : ""}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className={styles.dateCarousel}
                      onTouchStart={handleCarouselTouchStart}
                      onTouchEnd={handleCarouselTouchEnd}
                    >
                      <button
                        type="button"
                        className={styles.dateCarouselNav}
                        disabled={!canMobileDatePrev}
                        onClick={() =>
                          setMobileDateStartIndex((i) => Math.max(0, i - 1))
                        }
                        aria-label="Forrige datoer"
                      >
                        ‹
                      </button>
                      <div className={styles.dateCarouselTrack}>
                        {mobileVisibleDates.map((date) => {
                          const dateStr = toLocalYmd(date);
                          const freeSpots = freeSpotsForDate(dateStr);
                          const hasSpots = freeSpots.length > 0;
                          const isSelected = selectedDate === dateStr;
                          const weekday = date
                            .toLocaleDateString("da-DK", { weekday: "short" })
                            .replace(".", "")
                            .toUpperCase();

                          return (
                            <button
                              key={dateStr}
                              type="button"
                              className={`${styles.dateCarouselChip} ${isSelected ? styles.dateCarouselChipSelected : ""}`}
                              disabled={!hasSpots}
                              onClick={() => handleSelectDate(dateStr)}
                            >
                              <span className={styles.dateCarouselWeekday}>
                                {weekday}
                              </span>
                              <span className={styles.dateCarouselDay}>
                                {date.getDate()}
                              </span>
                              {isSelected && hasSpots && !isBook2 && (
                                <>
                                  <span className={styles.dateCarouselPrice}>
                                    {`${formatKrAmount(dateTileMemberPrice)} kr`}
                                  </span>
                                  {isRecurringBooking && (
                                    <span className={styles.dateCarouselEarn}>
                                      Efter fradrag ca.{" "}
                                      {formatKrAmount(dateTileMemberNet)} kr
                                    </span>
                                  )}
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        className={styles.dateCarouselNav}
                        disabled={!canMobileDateNext}
                        onClick={() =>
                          setMobileDateStartIndex((i) =>
                            Math.min(
                              Math.max(0, bookableWeekdays.length - MOBILE_DATE_VISIBLE),
                              i + 1,
                            ),
                          )
                        }
                        aria-label="Næste datoer"
                      >
                        ›
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
                  </div>

                  <div className={styles.dateStepDesktop}>
                    <div className={styles.dateWeekNav}>
                      <button
                        type="button"
                        className={styles.dateWeekBtn}
                        disabled={weekOffset <= minWeekOffset}
                        onClick={() =>
                          setWeekOffset((w) => Math.max(minWeekOffset, w - 1))
                        }
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
                        const hasSpots = freeSpots.length > 0;
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
                            onClick={() => handleSelectDate(dateStr)}
                          >
                            <span className={styles.dateWeekday}>{weekday}</span>
                            <span className={styles.dateDay}>{date.getDate()}</span>
                            <span className={styles.dateMonth}>{month}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        ref={desktopCalendarTriggerRef}
                        className={`${styles.dateChip} ${styles.dateChipCalendar} ${selectedDateOutsideWeek ? styles.dateChipSelected : ""} ${showCalendar ? styles.dateChipCalendarOpen : ""}`}
                        onClick={toggleCalendar}
                        aria-expanded={showCalendar}
                        aria-controls="deal-mobile-calendar"
                        aria-label="Vælg dato i kalender"
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
                            : "Vælg dato"}
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
                  </div>

                  {showCalendar && (
                    <div
                      id="deal-mobile-calendar"
                      className={styles.calendarPanel}
                      ref={calendarRef}
                    >
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

                      {slotsForSelectedDate.morningSlots.length === 0 &&
                      slotsForSelectedDate.afternoonSlots.length === 0 &&
                      !slotsForSelectedDate.allDaySlot ? (
                        <p className={styles.loading}>
                          Ingen ledige tider denne dag — vælg en anden dato.
                        </p>
                      ) : isBook2 ? (
                        <div className={styles.timePricePanel}>
                          <div className={styles.timePriceHeader}>
                            <span>Tid</span>
                            <span>Normalpris</span>
                            <span>Renzen Klub</span>
                          </div>
                          {slotsForSelectedDate.allDaySlot &&
                            renderBook2TimeRow(
                              slotsForSelectedDate.allDaySlot,
                              "Flex tid",
                              slotsForSelectedDate.allDaySlot.label,
                            )}
                          {[
                            ...slotsForSelectedDate.morningSlots,
                            ...slotsForSelectedDate.afternoonSlots,
                          ]
                            .sort(
                              (a, b) =>
                                a.startHour * 60 +
                                a.startMinute -
                                (b.startHour * 60 + b.startMinute),
                            )
                            .map((slot) =>
                              renderBook2TimeRow(
                                slot,
                                slot.label.split(" – ")[0],
                              ),
                            )}
                        </div>
                      ) : (
                        <>
                          {slotsForSelectedDate.allDaySlot && (
                            <button
                              type="button"
                              className={`${styles.timeSlotWide} ${selectedSlot?.label === slotsForSelectedDate.allDaySlot.label ? styles.timeSlotSelected : ""}`}
                              onClick={() =>
                                setSelectedSlot(slotsForSelectedDate.allDaySlot)
                              }
                            >
                              <span className={styles.timeSlotWideTitle}>
                                Fleksibel tid
                              </span>
                              <span className={styles.timeSlotWideRange}>
                                {slotsForSelectedDate.allDaySlot.label}
                              </span>
                            </button>
                          )}

                          <div className={styles.timeSlotGrid}>
                            <div className={styles.timeSlotCol}>
                              <p className={styles.timeSlotGroupTitle}>Morgen</p>
                              {slotsForSelectedDate.morningSlots.length > 0 ? (
                                slotsForSelectedDate.morningSlots.map((slot) => (
                                  <button
                                    key={slot.label}
                                    type="button"
                                    className={`${styles.timeSlot} ${selectedSlot?.label === slot.label ? styles.timeSlotSelected : ""}`}
                                    onClick={() => setSelectedSlot(slot)}
                                  >
                                    {slot.label}
                                  </button>
                                ))
                              ) : (
                                <p className={styles.timeSlotEmpty}>Ingen tider</p>
                              )}
                            </div>

                            <div className={styles.timeSlotCol}>
                              <p className={styles.timeSlotGroupTitle}>
                                Eftermiddag
                              </p>
                              {slotsForSelectedDate.afternoonSlots.length > 0 ? (
                                slotsForSelectedDate.afternoonSlots.map((slot) => (
                                  <button
                                    key={slot.label}
                                    type="button"
                                    className={`${styles.timeSlot} ${selectedSlot?.label === slot.label ? styles.timeSlotSelected : ""}`}
                                    onClick={() => setSelectedSlot(slot)}
                                  >
                                    {slot.label}
                                  </button>
                                ))
                              ) : (
                                <p className={styles.timeSlotEmpty}>Ingen tider</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {step === "tilvalg" && (
            <>
              <h1 className={styles.question}>Tilvalg til rengøringen?</h1>
              <p className={styles.hint}>
                Giv boligen et ekstra løft — vælg de opgaver, du vil have med.
                Du kan også springe over og tilføje senere.
              </p>

              {loadingExtras ? (
                <p className={styles.loading}>Henter tilvalg…</p>
              ) : (
                <div className={styles.extrasGrid}>
                  {availableExtras.map((extra) => {
                    const qty = selectedExtras[extra.id] ?? 0;
                    const isSelected = qty > 0;
                    const display = resolveBookExtraDisplay(extra);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        className={`${styles.extrasChoice} ${isSelected ? styles.extrasChoiceSelected : ""}`}
                        onClick={() => {
                          if (extra.quantityBased && isSelected) return;
                          handleExtraToggle(extra.id);
                        }}
                      >
                        <span className={styles.extrasChoiceMain}>
                          <span className={styles.choiceTitle}>
                            {display.label}
                          </span>
                          <span className={styles.choiceSub}>{display.sub}</span>
                        </span>
                        <span className={styles.choiceAside}>
                          {extra.quantityBased && isSelected ? (
                            <span
                              className={styles.extrasQty}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                className={styles.extrasQtyBtn}
                                aria-label={`Færre ${display.label}`}
                                onClick={() =>
                                  handleExtraQtyChange(extra.id, -1)
                                }
                              >
                                −
                              </button>
                              <span className={styles.extrasQtyVal}>{qty}</span>
                              <button
                                type="button"
                                className={styles.extrasQtyBtn}
                                aria-label={`Flere ${display.label}`}
                                onClick={() =>
                                  handleExtraQtyChange(extra.id, 1)
                                }
                              >
                                +
                              </button>
                            </span>
                          ) : (
                            <span className={styles.choicePrice}>
                              +{formatKr(extra.price)}
                              {extra.quantityBased ? "/stk." : ""}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === "frekvens" && (
            <>
              <h1 className={styles.question}>Hvor ofte skal vi gøre rent?</h1>
              {isBook2 ? (
                <>
                  <p className={styles.hint}>
                    Mest populære valg er hver 2. uge – giver det bedste resultat
                    over tid.
                  </p>
                  <div className={styles.choiceList}>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${bookFrequencyId === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setBookFrequencyId(option.id)}
                      >
                        <span>
                          <span className={styles.choiceTitle}>
                            {option.label}
                          </span>
                          <span className={styles.choiceSub}>{option.sub}</span>
                        </span>
                        <span className={styles.choiceAside}>
                          {option.id === DEFAULT_FREQUENCY_ID && (
                            <span className={styles.choiceBadge}>
                              Populært
                            </span>
                          )}
                          {option.type === "recurring" && option.discount > 0 && (
                            <span className={styles.choicePrice}>
                              -{option.discount}%
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.hint}>
                    Vælg med eller uden Renzen Klub. Med Klub får du intropris,
                    løbende rabat og op til {ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. i Zen-kreditter.
                  </p>

                  {clubSelected && (
                    <div className={styles.freqPicker}>
                      {RECURRING_FREQUENCY_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`${styles.freqChip} ${recurringFrequencyId === option.id ? styles.freqChipSelected : ""}`}
                          onClick={() => setRecurringFrequencyId(option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={styles.pricingColumns}>
                    <button
                      type="button"
                      className={`${styles.pricingColumn} ${!clubSelected ? styles.pricingColumnSelected : ""}`}
                      onClick={handleSelectWithoutKlub}
                    >
                      <p className={styles.pricingColumnTitle}>Uden Renzen Klub</p>
                      <p className={styles.pricingColumnPrice}>
                        {formatKr(listPrice)}
                      </p>
                      <p className={styles.pricingColumnSub}>Engangs</p>
                    </button>

                    <button
                      type="button"
                      className={`${styles.pricingColumn} ${styles.pricingColumnKlub} ${clubSelected ? styles.pricingColumnSelected : ""}`}
                      onClick={handleSelectWithKlub}
                    >
                      {klubColumnSavings > 0 && (
                        <span className={styles.pricingColumnBadge}>
                          Spar {formatKrAmount(klubColumnSavings)} kr.
                        </span>
                      )}
                      <p className={styles.pricingColumnTitle}>Med Renzen Klub</p>
                      <p className={styles.pricingColumnPrice}>
                        {formatKr(klubColumnIntroPrice)}
                        <span className={styles.pricingColumnPriceHint}>
                          {" "}
                          første besøg
                        </span>
                      </p>
                      <p className={styles.pricingColumnSub}>
                        {formatKr(memberPriceDeal)} herefter (
                        {klubColumnFrequency.discount}%)
                      </p>
                      <p className={styles.pricingColumnCredit}>
                        + optjen {ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. kreditter
                      </p>
                      <p className={styles.pricingColumnFine}>
                        Inkl. årsplan · {KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. (12 mdr.)
                      </p>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {step === "boligstand" && (
            <>
              <h1 className={styles.question}>Hvordan ser boligen ud?</h1>
              <p className={styles.hint}>
                Det hjælper os med at planlægge den rette tid til din
                rengøring. Beskidte hjem tager længere — prisen justeres
                derefter.
              </p>

              <p className={styles.stepSectionLabel}>Rengøringsstand</p>
              <div className={styles.choiceList}>
                {BOOK_CLEANLINESS_LEVELS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.choice} ${cleanlinessLevel === option.id ? styles.choiceSelected : ""}`}
                    onClick={() => setCleanlinessLevel(option.id)}
                  >
                    <span>
                      <span className={styles.choiceTitle}>{option.label}</span>
                      <span className={styles.choiceSub}>{option.sub}</span>
                    </span>
                    <span className={styles.choiceAside}>
                      {option.surchargeKr > 0 ? (
                        <span className={styles.choicePrice}>
                          +{formatKr(option.surchargeKr)}
                        </span>
                      ) : (
                        <span className={styles.choiceSub}>Inkl.</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <p className={styles.stepSectionLabel}>Hvornår blev der sidst gjort rent?</p>
              <div className={styles.choiceList}>
                {BOOK_LAST_CLEANED_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.choice} ${lastCleaned === option ? styles.choiceSelected : ""}`}
                    onClick={() => setLastCleaned(option)}
                  >
                    <span className={styles.choiceTitle}>{option}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "adgang" && (
            <>
              <h1 className={styles.question}>Hvordan kommer vi ind?</h1>
              <p className={styles.hint}>
                Vælg den løsning, der passer til dit hjem.
              </p>
              <div className={styles.choiceList}>
                {BOOK_ENTRY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.choice} ${entryMethod === option.id ? styles.choiceSelected : ""}`}
                    onClick={() => {
                      setEntryMethod(option.id);
                      if (option.id !== "other") {
                        setEntryOtherDetails("");
                      }
                    }}
                  >
                    <span className={styles.choiceTitle}>{option.label}</span>
                  </button>
                ))}
              </div>
              {entryMethod === "other" && (
                <div className={styles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="book-entry-other">
                    Beskriv adgangen
                  </label>
                  <textarea
                    id="book-entry-other"
                    className={styles.entryOtherInput}
                    value={entryOtherDetails}
                    onChange={(event) => setEntryOtherDetails(event.target.value)}
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
              <h1 className={styles.question}>Hvem booker?</h1>
              <p className={styles.hint}>
                Vi bruger oplysningerne til bekræftelse og kontakt om besøget.
              </p>
              <div className={styles.fieldStack}>
                <DawaAddressField
                  id="deal-address"
                  label="Gade og nummer"
                  address={address}
                  zip={zip}
                  city={city}
                  onAddressChange={handleContactAddressChange}
                  onSelect={handleContactAddressSelect}
                  suggestions={addressSuggestions}
                  showSuggestions={showAddressSuggestions}
                  setShowSuggestions={setShowAddressSuggestions}
                  placeholder="Begynd at skrive din adresse"
                  autoFocus
                  showPostnummerBadge={false}
                  hint={
                    postnummerFilled
                      ? `Vi viser kun adresser i ${zip} ${city}.`
                      : undefined
                  }
                />
                {!postnummerFilled && (
                  <p className={styles.areaUnserved} role="alert">
                    {UNSERVED_AREA_MESSAGE}
                  </p>
                )}
                <div>
                  <label className={styles.fieldLabel} htmlFor="deal-fn">
                    Fornavn
                  </label>
                  <input
                    id="deal-fn"
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="deal-ln">
                    Efternavn
                  </label>
                  <input
                    id="deal-ln"
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="deal-email">
                    E-mail
                  </label>
                  <input
                    id="deal-email"
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dig@eksempel.dk"
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="deal-phone">
                    Telefon
                  </label>
                  <input
                    id="deal-phone"
                    className={styles.input}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="12 34 56 78"
                  />
                </div>
              </div>
            </>
          )}

          {step === "betaling" && (
            <>
              <h1 className={styles.question}>Bekræft bookingen</h1>
              <p className={styles.hint}>
                0 kr. trækkes i dag. Betaling sker efter rengøringen.
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
              </div>

              <TermsConfirmCard
                checked={termsAccepted}
                onChange={setTermsAccepted}
                includeClubTerms={clubSelected}
              />
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <aside className={styles.summaryPanel} aria-label="Prisoversigt">
          {renderReceipt()}
        </aside>
      </div>

      <div className={styles.bottomChrome}>
        <div className={styles.mobileCheckoutBar} aria-label="Prisoversigt">
          <div className={styles.mobileCheckoutLeft}>
            <p className={styles.mobileCheckoutPrice}>
              {showPricingSummary
                ? formatKr(displayReceiptGrandTotal)
                : "—"}
            </p>
            {showPricingSummary && (
              <p className={styles.mobileCheckoutSub}>
                {showKlubSummary
                  ? introTierExceeded
                    ? tilvalgReceiptTotal > 0
                      ? `Intro + Klub + tilvalg`
                      : "Intro + Klub"
                    : tilvalgReceiptTotal > 0
                      ? `${formatKr(introCleaningDueKr)} + Klub + tilvalg`
                      : `${formatKr(introCleaningDueKr)} + Klub`
                  : tilvalgReceiptTotal > 0
                    ? "Engangs + tilvalg"
                    : "Engangs"}
              </p>
            )}
            <button
              type="button"
              className={styles.detailsLink}
              onClick={() => setDetailsOpen(true)}
              aria-expanded={detailsOpen}
              aria-controls="deal-details-sheet"
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
                ? "Bekræft booking"
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
                    ? "Bekræft booking"
                    : "Fortsæt"}
                {!isSubmitting && <span aria-hidden>→</span>}
              </button>
            </div>
            <div className={styles.footerSpacer} aria-hidden />
          </div>
        </footer>
      </div>

      {renderKlubOfferModal()}

      <div
        className={`${styles.sheetBackdrop} ${detailsOpen ? styles.sheetBackdropOpen : ""}`}
        onClick={() => setDetailsOpen(false)}
        aria-hidden={!detailsOpen}
      />
      <div
        id="deal-details-sheet"
        className={`${styles.sheetPanel} ${detailsOpen ? styles.sheetPanelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-details-title"
        aria-hidden={!detailsOpen}
      >
        <div className={styles.sheetHandle} aria-hidden />
        <div className={styles.sheetHeader}>
          <h2 id="deal-details-title" className={styles.sheetTitle}>
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
        <div className={styles.sheetBody}>{renderReceipt(true)}</div>
      </div>
    </div>
  );
}
