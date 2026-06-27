"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import DealSummaryTrustPanel from "@/components/dealside/DealSummaryTrustPanel";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import { WizardStepMeta } from "@/components/wizard/WizardExitButton";
import { createStripeCardToken } from "@/components/payment/createStripeCardToken";
import { StripeCardInput } from "@/components/payment/StripeCardInput";
import { StripeElementsProvider } from "@/components/payment/StripeElementsProvider";
import { TermsConfirmCard } from "@/components/forms/TermsConfirmCard";
import { buildAirbnbBookingNotes } from "@/lib/airbnbBookNotes";
import { AIRBNB_L27_FREQUENCY_ID } from "@/lib/airbnbInquiryPricing";
import type { AirbnbInquiryTokenPayload } from "@/lib/airbnbInquiryToken";
import {
  buildBookCleaningCustomFieldsPayload,
  buildBookCleaningExtrasPayload,
  L27_BOOK_PRICING_PARAM_ID,
  L27_BOOK_SERVICE_ID,
  parseL27BookingError,
  resolveL27BookingId,
  type BookEntryOptionId,
  type BookServiceExtra,
} from "@/lib/bookCleaningL27";
import {
  saveBookingConfirmation,
  type BookingConfirmationPayload,
} from "@/lib/bookingConfirmation";
import { formatFlytReceiptKr } from "@/lib/flytterengoring";
import type { L27CustomField } from "@/lib/flytterengoring";
import {
  isBookableSlotInSpots,
  normalizeL27SpotsToSlots,
  type L27Spot,
} from "@/lib/l27Spots";
import { L27_API_PATH } from "@/lib/urls";
import { exitWizardNavigation } from "@/lib/wizardExit";

const STEPS = ["tidspunkt", "kontakt", "betaling"] as const;
const SPOTS_RANGE_DAYS = 42;

type TimeSlot = {
  startHour: number;
  startMinute: number;
  label: string;
  arrivalWindow: number;
};

function toLocalYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isDateInPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
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

function parseInitialPreferredDate(preferredDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return "";
  const date = new Date(`${preferredDate}T12:00:00`);
  if (Number.isNaN(date.getTime()) || isDateInPast(date)) return "";
  if (!isWeekday(date)) return "";
  if (date > getMaxBookableDate()) return "";
  return preferredDate;
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

function mapEntryMethod(entryMethod: string): BookEntryOptionId {
  if (
    entryMethod === "home" ||
    entryMethod === "mat" ||
    entryMethod === "neighbor" ||
    entryMethod === "other"
  ) {
    return entryMethod;
  }
  return "other";
}

type AirbnbBookWizardProps = {
  inquiry: AirbnbInquiryTokenPayload;
};

function AirbnbBookWizardForm({ inquiry }: AirbnbBookWizardProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const initialPreferredDate = useMemo(
    () => parseInitialPreferredDate(inquiry.preferredDate),
    [inquiry.preferredDate],
  );
  const maxBookableDate = useMemo(() => getMaxBookableDate(), []);
  const initialWeekOffset = useMemo(() => {
    if (initialPreferredDate) {
      return Math.max(
        0,
        getWeekOffsetForDate(new Date(`${initialPreferredDate}T12:00:00`)),
      );
    }
    return getMinWeekOffset(maxBookableDate);
  }, [initialPreferredDate, maxBookableDate]);

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [selectedDate, setSelectedDate] = useState(initialPreferredDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [spotsCache, setSpotsCache] = useState<Record<string, L27Spot[]>>({});
  const [loadingSpots, setLoadingSpots] = useState(true);
  const spotsLoaded = Object.keys(spotsCache).length > 0;

  const [firstName, setFirstName] = useState(inquiry.firstName);
  const [lastName, setLastName] = useState(inquiry.lastName);
  const [email, setEmail] = useState(inquiry.email);
  const [phone, setPhone] = useState(inquiry.phone);

  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [serviceExtras, setServiceExtras] = useState<BookServiceExtra[]>([]);
  const [bookCustomFields, setBookCustomFields] = useState<L27CustomField[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");

  const sqm = inquiry.details.sqm;
  const lockedPriceKr = inquiry.estimatedPriceKr;
  const bookingNotes = useMemo(() => buildAirbnbBookingNotes(inquiry), [inquiry]);
  const entryMethod = mapEntryMethod(inquiry.entryMethod);
  const entryOtherDetails = useMemo(() => {
    const base = inquiry.entryOtherDetails.trim();
    if (entryMethod === "other") {
      return base ? `${base}. ${bookingNotes}` : bookingNotes;
    }
    return bookingNotes;
  }, [bookingNotes, entryMethod, inquiry.entryOtherDetails]);

  const weekdayDates = useMemo(() => nextWeekdays(weekOffset), [weekOffset]);
  const maxWeekOffset = useMemo(
    () => Math.max(0, getWeekOffsetForDate(maxBookableDate)),
    [maxBookableDate],
  );
  const weekLabel = useMemo(() => {
    const first = weekdayDates[0];
    const last = weekdayDates[weekdayDates.length - 1];
    if (!first || !last) return "";
    const fmt = (date: Date) =>
      date.toLocaleDateString("da-DK", { day: "numeric", month: "short" });
    return `${fmt(first)} – ${fmt(last)}`;
  }, [weekdayDates]);

  useEffect(() => {
    let cancelled = false;

    const loadServiceData = async () => {
      try {
        const [servicesRes, fieldsRes] = await Promise.all([
          fetch(L27_API_PATH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "services" }),
          }),
          fetch(L27_API_PATH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "custom_fields" }),
          }),
        ]);

        const servicesData = await servicesRes.json();
        if (!cancelled && servicesData.success && Array.isArray(servicesData.data)) {
          const service = servicesData.data.find(
            (item: { id?: number }) => item.id === L27_BOOK_SERVICE_ID,
          );
          const extras = (service?.extras ?? []).map(
            (extra: {
              id: string | number;
              name: string;
              price: number | string;
              mandatory?: boolean;
              recurring?: boolean;
            }) => ({
              id: String(extra.id),
              name: extra.name,
              price: Number(extra.price) || 0,
              mandatory: !!extra.mandatory,
              recurring: !!extra.recurring,
            }),
          );
          setServiceExtras(extras);
        }

        const fieldsData = await fieldsRes.json();
        if (!cancelled && fieldsData.success && Array.isArray(fieldsData.data)) {
          setBookCustomFields(fieldsData.data as L27CustomField[]);
        }
      } catch {
        /* optional */
      }
    };

    void loadServiceData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

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
        if (!cancelled && resData.success && Array.isArray(resData.data)) {
          const cache: Record<string, L27Spot[]> = {};
          resData.data.forEach((day: { date?: string; spots?: L27Spot[] }) => {
            if (day?.date && Array.isArray(day.spots)) {
              cache[day.date] = day.spots;
            }
          });
          setSpotsCache(cache);
        }
      } catch {
        /* dates remain selectable until spots load */
      } finally {
        if (!cancelled) {
          setLoadingSpots(false);
        }
      }
    };

    void fetchSpots();
    return () => {
      cancelled = true;
    };
  }, []);

  const freeSpotsForDate = useCallback(
    (dateStr: string) => {
      const spots = spotsCache[dateStr] || [];
      return spots.filter((spot) => spot.free && !spot.past);
    },
    [spotsCache],
  );

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [] as TimeSlot[];
    const normalized = normalizeL27SpotsToSlots(freeSpotsForDate(selectedDate));
    return [
      ...(normalized.allDaySlot ? [toTimeSlot(normalized.allDaySlot)] : []),
      ...normalized.morningSlots.map(toTimeSlot),
      ...normalized.afternoonSlots.map(toTimeSlot),
    ];
  }, [selectedDate, freeSpotsForDate]);

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

  const bookingExtrasPayload = useMemo(
    () =>
      buildBookCleaningExtrasPayload(
        {},
        false,
        "normal",
        serviceExtras,
        false,
      ),
    [serviceExtras],
  );

  const canContinue = useMemo(() => {
    switch (step) {
      case "tidspunkt":
        return !!selectedDate && !!selectedSlot && isSelectedSlotBookable;
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
    selectedDate,
    selectedSlot,
    isSelectedSlotBookable,
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
        if (!stripe || !elements) {
          setError("Betaling er ikke klar endnu. Prøv igen om et øjeblik.");
          return;
        }

        const daySpots = freeSpotsForDate(selectedDate);
        if (!selectedSlot || !isBookableSlotInSpots(daySpots, selectedSlot)) {
          setSelectedSlot(null);
          setError(
            "Det valgte tidspunkt er ikke længere ledigt. Vælg en anden dato eller tid.",
          );
          return;
        }

        const stripeToken = await createStripeCardToken(stripe, elements);
        const dateStr = `${selectedDate}T${String(selectedSlot.startHour).padStart(2, "0")}:${String(selectedSlot.startMinute).padStart(2, "0")}:00`;
        const customFields = buildBookCleaningCustomFieldsPayload(
          bookCustomFields,
          entryMethod,
          entryOtherDetails,
          "normal",
          "Ved ikke",
        );

        const response = await fetch(L27_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "booking",
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            address: inquiry.address.trim(),
            city: inquiry.city.trim(),
            zip: inquiry.zip.trim(),
            phone: phone.trim(),
            frequency_id: String(AIRBNB_L27_FREQUENCY_ID),
            service_date: dateStr,
            arrival_window: selectedSlot.arrivalWindow,
            stripe_token: stripeToken,
            extras: bookingExtrasPayload,
            service_id: String(L27_BOOK_SERVICE_ID),
            pricing_param_id: String(L27_BOOK_PRICING_PARAM_ID),
            pricing_param_quantity: sqm,
            ...(customFields ? { custom_fields: customFields } : {}),
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

        const confirmationPayload: BookingConfirmationPayload = {
          bookingId: resolvedBookingId,
          source: "airbnb",
          firstName: firstName.trim(),
          email: email.trim(),
          date: selectedDate,
          timeSlot:
            selectedSlot.label.split(" – ")[0] ?? selectedSlot.label ?? "",
          address: inquiry.address.trim(),
          postcode: inquiry.zip.trim(),
          city: inquiry.city.trim(),
          frequency: "Engangsrengøring",
          frequencyId: String(AIRBNB_L27_FREQUENCY_ID),
          squareMeters: sqm,
          isKlub: false,
          totalTodayKr: lockedPriceKr,
          extras: [],
          serviceLabel: "Airbnb rengøring",
          createdAt: new Date().toISOString(),
        };
        saveBookingConfirmation(confirmationPayload);
        setIsRedirecting(true);
        router.push("/booking-modtaget/");
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Kunne ikke gennemføre bookingen. Prøv igen.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  }, [
    canContinue,
    step,
    stripe,
    elements,
    freeSpotsForDate,
    selectedDate,
    selectedSlot,
    bookCustomFields,
    entryMethod,
    entryOtherDetails,
    email,
    firstName,
    lastName,
    inquiry.address,
    inquiry.city,
    inquiry.zip,
    phone,
    bookingExtrasPayload,
    sqm,
    lockedPriceKr,
    router,
  ]);

  const goBack = useCallback(() => {
    setError("");
    if (stepIndex === 0) {
      router.push("/airbnb-rengoring/");
      return;
    }
    setStepIndex((current) => Math.max(current - 1, 0));
  }, [stepIndex, router]);

  const exitWizard = useCallback(() => {
    exitWizardNavigation({
      router,
      fallback: { type: "path", path: "/airbnb-rengoring/" },
    });
  }, [router]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void goNext();
    }
  };

  const renderSummary = () => (
    <div className={styles.receipt}>
      <DealSummaryTrustPanel />

      <p className={styles.receiptEarlyLabel}>Din booking</p>
      <div className={styles.receiptHead}>
        <p className={styles.receiptPackage}>Airbnb rengøring</p>
        <p className={styles.receiptMeta}>Engangs pris · låst fra din forespørgsel</p>
      </div>

      <div className={styles.selectionGrid}>
        <div
          className={styles.selectionCell}
          style={{ gridColumn: "1 / -1" }}
        >
          <span className={styles.selectionLabel}>Adresse</span>
          <span className={styles.selectionValue}>
            {inquiry.address}, {inquiry.zip} {inquiry.city}
          </span>
        </div>
        <div className={styles.selectionCell}>
          <span className={styles.selectionLabel}>Areal</span>
          <span className={styles.selectionValue}>{sqm} m²</span>
        </div>
        <div className={styles.selectionCell}>
          <span className={styles.selectionLabel}>Soveværelser</span>
          <span className={styles.selectionValue}>
            {inquiry.details.bedroomCount}
          </span>
        </div>
        <div className={styles.selectionCell}>
          <span className={styles.selectionLabel}>Badeværelser</span>
          <span className={styles.selectionValue}>
            {inquiry.details.bathroomCount}
          </span>
        </div>
        {selectedDate && selectedSlot && (
          <>
            <div className={styles.selectionCell}>
              <span className={styles.selectionLabel}>Dato</span>
              <span className={styles.selectionValue}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                  "da-DK",
                  { weekday: "long", day: "numeric", month: "long" },
                )}
              </span>
            </div>
            <div className={styles.selectionCell}>
              <span className={styles.selectionLabel}>Tid</span>
              <span className={styles.selectionValue}>{selectedSlot.label}</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.receiptSection}>
        <div className={styles.receiptTotals}>
          <div className={styles.receiptTotalNet}>
            <span>Total</span>
            <strong>{formatFlytReceiptKr(lockedPriceKr)}</strong>
          </div>
        </div>
      </div>

      <p className={styles.zeroToday}>
        Du betaler først efter rengøringen
        <small>Ingen tilvalg eller abonnement</small>
      </p>
    </div>
  );

  if (isRedirecting) {
    return (
      <div className={styles.shell}>
        <main className={styles.successMain}>
          <p className={styles.loading}>Sender dig videre…</p>
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
            <WizardStepMeta
              current={stepIndex + 1}
              total={STEPS.length}
              onExit={exitWizard}
              exitAriaLabel="Luk booking"
            />
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
            {step === "tidspunkt" && (
              <>
                <h1 className={styles.question}>Vælg tidspunkt</h1>
                <p className={styles.hint}>
                  {initialPreferredDate
                    ? "Vi har foreslået din ønskede dato — vælg det tidspunkt, der passer mellem gæsteskift."
                    : "Vælg en hverdag og et ledigt tidspunkt til Airbnb-rengøringen."}
                </p>
                {loadingSpots ? (
                  <p className={styles.loading}>Henter ledige tider…</p>
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
                        const hasSpots = spotsLoaded
                          ? freeSpotsForDate(dateStr).length > 0
                          : !past && !beyondRange;
                        const isSelected = selectedDate === dateStr;
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
                            }}
                          >
                            <span className={styles.dateWeekday}>{weekday}</span>
                            <span className={styles.dateDay}>{date.getDate()}</span>
                            <span className={styles.dateMonth}>{month}</span>
                          </button>
                        );
                      })}
                    </div>

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

            {step === "kontakt" && (
              <>
                <h1 className={styles.question}>Bekræft kontaktoplysninger</h1>
                <p className={styles.hint}>
                  Vi sender bekræftelse til denne e-mail og ringer ved behov.
                </p>
                <div className={styles.fieldStack}>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="airbnb-first-name">
                      Fornavn
                    </label>
                    <input
                      id="airbnb-first-name"
                      className={styles.input}
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="airbnb-last-name">
                      Efternavn
                    </label>
                    <input
                      id="airbnb-last-name"
                      className={styles.input}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="airbnb-email">
                      E-mail
                    </label>
                    <input
                      id="airbnb-email"
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="airbnb-phone">
                      Telefon
                    </label>
                    <input
                      id="airbnb-phone"
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
                  Gem dit kort nu. Du betaler {formatFlytReceiptKr(lockedPriceKr)}{" "}
                  efter rengøringen er udført.
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
          {renderSummary()}
        </aside>
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
              onClick={() => void goNext()}
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
  );
}

export default function AirbnbBookWizard({ inquiry }: AirbnbBookWizardProps) {
  return (
    <StripeElementsProvider>
      <AirbnbBookWizardForm inquiry={inquiry} />
    </StripeElementsProvider>
  );
}

export function AirbnbBookInvalidState() {
  return (
    <div className={styles.shell}>
      <main className={styles.successMain}>
        <div className={`${styles.frame} ${styles.step}`}>
          <h1 className={styles.question}>Linket er ugyldigt</h1>
          <p className={styles.hint}>
            Book-linket er udløbet eller kan ikke bruges. Send en ny forespørgsel,
            så sender vi en frisk pris og et nyt link.
          </p>
          <Link href="/airbnb-rengoring/forespoergsel/" className={styles.backBtn}>
            Send ny forespørgsel
          </Link>
        </div>
      </main>
    </div>
  );
}
