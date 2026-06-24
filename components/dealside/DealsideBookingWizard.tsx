"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TermsConfirmCard } from "@/components/forms/TermsConfirmCard";
import { ZEN_CREDIT_SERVICES_COMPACT } from "@/lib/zenCreditServices";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR,
  KLUB_MONTHLY_KR,
  KLUB_MONTHLY_MIN_MONTHS,
  listPriceKr,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";
import { DEAL_PACKAGES } from "@/components/dealside/dealPackages";

const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;

interface ExtraService {
  id: string;
  title: string;
  icon: string;
  introPrice: number; // member price
  normalPrice: number;
  savings: number;
}

const EXTRAS: ExtraService[] = [
  { id: "53", title: "Grundig ovnrengøring", icon: "/icons/deep-cleaning.png", introPrice: 199, normalPrice: 349, savings: 150 },
  { id: "52", title: "Køleskab indvendigt", icon: "/icons/house-cleaning.png", introPrice: 119, normalPrice: 199, savings: 80 },
  { id: "93", title: "Afkalkning af bad/køkken", icon: "/icons/tiles.png", introPrice: 189, normalPrice: 299, savings: 110 },
  { id: "56", title: "Fodpaneler", icon: "/icons/bygge.png", introPrice: 59, normalPrice: 99, savings: 40 }
];

const CITY_MAP: { [key: string]: string } = {
  "2100": "København Ø",
  "2200": "København N",
  "2300": "København S",
  "2400": "København NV",
  "2000": "Frederiksberg",
  "2500": "Valby",
  "2650": "Hvidovre",
  "8000": "Aarhus C",
  "5000": "Odense C",
  "9000": "Aalborg",
};

interface Package {
  m2: number;
  title: string;
  rooms: string;
  introPrice: number;
  normalPrice: number;
  savings: number;
}

const PACKAGES: Package[] = DEAL_PACKAGES;

interface L27Spot {
  free: boolean;
  past: boolean;
  start_hour?: number;
  hours?: number;
  hour?: number;
  start_minute?: number;
  minutes?: number;
  minute?: number;
  arrival_window?: number;
}

export default function DealsideBookingWizard({ initialZip = "" }: { initialZip?: string }) {
  const [step, setStep] = useState(1);
  const [planType, setPlanType] = useState<'annual' | 'monthly'>('annual'); // default to annual

  // Form fields
  const [zip, setZip] = useState(initialZip);
  const [city, setCity] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);

  useEffect(() => {
    if (initialZip && initialZip.length === 4) {
      setZip(initialZip);
      if (CITY_MAP[initialZip]) {
        setCity(CITY_MAP[initialZip]);
        setIsZipValid(true);
      } else {
        setCity("Storkøbenhavn");
        setIsZipValid(true);
      }
      setStep(2);
    }
  }, [initialZip]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedM2, setSelectedM2] = useState<number>(100); // Default Mellem
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [selectedDateStr, setSelectedDateStr] = useState(""); // YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startHour: number; startMinute: number; label: string } | null>(null);

  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [spotsCache, setSpotsCache] = useState<{ [date: string]: L27Spot[] }>({});
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);

  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  
  // Urgency countdown timer
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes
  useEffect(() => {
    if (step < 2) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);
  const countdownMin = String(Math.floor(countdown / 60)).padStart(2, "0");
  const countdownSec = String(countdown % 60).padStart(2, "0");
  const [isBooked, setIsBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-lookup city on ZIP input
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    setZip(val);
    if (val.length === 4) {
      if (CITY_MAP[val]) {
        setCity(CITY_MAP[val]);
        setIsZipValid(true);
      } else {
        setCity("Storkøbenhavn");
        setIsZipValid(true);
      }
    } else {
      setIsZipValid(false);
      setCity("");
    }
  };

  // Generate Monday-Friday of the current week for quick date select
  const quickSelectDates = React.useMemo(() => {
    const list = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const toLocalYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    let startDow = firstOfMonth.getDay();
    startDow = (startDow + 6) % 7; // Monday = 0, Sunday = 6

    const startDate = new Date(year, month, 1);
    startDate.setDate(startDate.getDate() - startDow);

    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getIsoWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const calendarDays = getDaysInMonth(viewDate);
  const currentMonthName = viewDate.toLocaleDateString("da-DK", { month: "long", year: "numeric" });

  const getFreeSpotsForDate = (dateStr: string) => {
    return spotsCache[dateStr] || [];
  };

  const hasFreeSpots = (dateStr: string) => {
    return getFreeSpotsForDate(dateStr).length > 0;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getFormattedDateDisplay = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString + "T00:00:00");
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    let display = d.toLocaleDateString("da-DK", options);
    if (selectedTimeSlot) {
      display += ` kl. ${selectedTimeSlot.label}`;
    }
    return display;
  };

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  // Fetch available calendar spots dynamically from Launch27 API
  useEffect(() => {
    const fetchLiveSpots = async () => {
      if (calendarDays.length === 0) return;
      setIsLoadingSpots(true);
      const startDateStr = toLocalYmd(calendarDays[0]);

      try {
        const response = await fetch("/api/l27", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "spots",
            date: startDateStr,
            service_id: "213",
            pricing_param_id: "86",
            pricing_param_quantity: selectedM2,
          }),
        });

        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const cache: { [date: string]: L27Spot[] } = {};
          resData.data.forEach((day: { date: string; spots: L27Spot[] }) => {
            if (day && day.date && Array.isArray(day.spots)) {
              cache[day.date] = day.spots;
            }
          });
          setSpotsCache(cache);
        }
      } catch (err) {
        console.error("Failed to fetch spots:", err);
      } finally {
        setIsLoadingSpots(false);
      }
    };

    fetchLiveSpots();
  }, [viewDate, selectedM2]);

  // Spots parsing helpers/mock slots
  const spotsToRender = selectedDateStr ? getFreeSpotsForDate(selectedDateStr) : [];
  const useMocks = spotsToRender.length === 0;

  const mockAllDaySlot = { startHour: 8, startMinute: 0, label: "08:00 - 16:00" };
  const mockMorningSlots = [
    { startHour: 8, startMinute: 0, label: "08:00 - 10:00" },
    { startHour: 10, startMinute: 0, label: "10:00 - 12:00" },
  ];
  const mockAfternoonSlots = [
    { startHour: 12, startMinute: 0, label: "12:00 - 14:00" },
    { startHour: 14, startMinute: 0, label: "14:00 - 16:00" },
  ];

  let liveAllDaySlot: { startHour: number; startMinute: number; label: string } | null = null;
  const liveMorningSlots: Array<{ startHour: number; startMinute: number; label: string }> = [];
  const liveAfternoonSlots: Array<{ startHour: number; startMinute: number; label: string }> = [];

  const getSpotTime = (spot: L27Spot) => {
    const h = spot.start_hour !== undefined ? spot.start_hour : (spot.hours !== undefined ? spot.hours : (spot.hour !== undefined ? spot.hour : 0));
    const m = spot.start_minute !== undefined ? spot.start_minute : (spot.minutes !== undefined ? spot.minutes : (spot.minute !== undefined ? spot.minute : 0));
    return { hour: h, minute: m };
  };

  const getSpotLabel = (spot: L27Spot) => {
    const { hour, minute } = getSpotTime(spot);
    const startMin = hour * 60 + minute;
    const windowMin = spot.arrival_window || 60;
    const endMin = startMin + windowMin;

    const startHour = Math.floor((startMin % 1440) / 60);
    const startMinute = startMin % 60;
    const endHour = Math.floor((endMin % 1440) / 60);
    const endMinute = endMin % 60;

    return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
  };

  if (!useMocks) {
    let maxWindow = 0;
    let widestSpot: L27Spot | null = null;

    spotsToRender.forEach((s) => {
      const window = s.arrival_window || 60;
      if (window > maxWindow) {
        maxWindow = window;
        widestSpot = s;
      }
    });

    if (widestSpot && maxWindow >= 240) {
      const { hour, minute } = getSpotTime(widestSpot);
      liveAllDaySlot = { startHour: hour, startMinute: minute, label: getSpotLabel(widestSpot) };
    }

    spotsToRender.forEach((s) => {
      if (s === widestSpot && maxWindow >= 240) return;
      const { hour, minute } = getSpotTime(s);
      const slotObj = { startHour: hour, startMinute: minute, label: getSpotLabel(s) };
      if (hour < 12) {
        liveMorningSlots.push(slotObj);
      } else {
        liveAfternoonSlots.push(slotObj);
      }
    });
  }

  // Set default date
  useEffect(() => {
    if (!selectedDateStr) {
      const firstAvailable = quickSelectDates.find(d => !isDateInPast(d));
      if (firstAvailable) {
        setSelectedDateStr(toLocalYmd(firstAvailable));
      }
    }
  }, [quickSelectDates, selectedDateStr]);

  // Sync selected time slot if date changes
  useEffect(() => {
    if (selectedDateStr) {
      // Auto-select flexible/all-day slot as default
      const defaultSlot = useMocks ? mockAllDaySlot : (liveAllDaySlot || liveMorningSlots[0] || liveAfternoonSlots[0] || null);
      setSelectedTimeSlot(defaultSlot);
    }
  }, [selectedDateStr, useMocks, liveAllDaySlot, liveMorningSlots.length, liveAfternoonSlots.length]);

  // Pricing calculations
  const activePkg = PACKAGES.find((p) => p.m2 === selectedM2) || PACKAGES[1];
  
  // Selected extras calculations
  const extrasIntroTotal = selectedExtras.reduce((sum, id) => {
    const extra = EXTRAS.find(e => e.id === id);
    return sum + (extra ? extra.introPrice : 0);
  }, 0);

  const extrasSavingsTotal = selectedExtras.reduce((sum, id) => {
    const extra = EXTRAS.find(e => e.id === id);
    return sum + (extra ? extra.savings : 0);
  }, 0);

  const totalFirstCleanPrice = activePkg.introPrice + extrasIntroTotal;
  const totalFirstCleanPriceNet = Math.round(totalFirstCleanPrice * 0.74);
  const totalSavings = activePkg.savings + extrasSavingsTotal;

  // Subsequent cleaning math
  const subsequentCleanPriceGross = Math.round(listPriceKr(selectedM2) * 0.85); // 15% discount for biweekly
  const subsequentCleanPriceNet = Math.round(subsequentCleanPriceGross * 0.74); // 26% tax deduction
  const firstCleanPriceNet = Math.round(activePkg.introPrice * 0.74);

  const formatPriceDK = (amount: number) => {
    return amount.toLocaleString("da-DK") + " kr.";
  };

  const nextStep = () => {
    if (step === 1) {
      if (!isZipValid) return alert("Indtast venligst et gyldigt postnummer.");
    }
    if (step === 4) {
      if (!selectedDateStr || !selectedTimeSlot) {
        return alert("Vælg venligst både dato og tidspunkt for din rengøring.");
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) return alert("Udfyld venligst dine kontaktoplysninger.");
    if (!address) return alert("Indtast venligst din adresse.");
    if (!cardNumber || !cardExpiry || !cardCvc) return alert("Indtast venligst dine kortoplysninger.");
    if (!termsAccepted) return alert("Du skal acceptere handelsbetingelserne for at fortsætte.");

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const timeStr = selectedTimeSlot 
        ? `${String(selectedTimeSlot.startHour).padStart(2, "0")}:${String(selectedTimeSlot.startMinute).padStart(2, "0")}:00` 
        : "08:00:00";

      const response = await fetch("/api/l27", {
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
          frequency_id: "22", // Biweekly recurring default
          welcome_deal: true,
          service_date: `${selectedDateStr}T${timeStr}`,
          arrival_window: 240, // 4 hours window
          stripe_token: "tok_visa", // Stripe Card Mock token matching regular wizard
          extras: selectedExtras.map(id => ({ id: parseInt(id, 10), quantity: 1, recurring: true })),
          discount_code: "VELKOMMEN",
          service_id: "213",
          pricing_param_id: "86",
          pricing_param_quantity: selectedM2,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data?.booking_id) {
        setBookingId(resData.data.booking_id);
        setIsBooked(true);
      } else {
        setErrorMessage(resData.message || "Der opstod en fejl under oprettelsen af din booking.");
      }
    } catch (err) {
      setErrorMessage("Forbindelsesfejl. Prøv venligst igen senere.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <div className="l27-dealside-wizard success-screen">
        <div className="success-icon">✓</div>
        <h2>Tak for din bestilling, {firstName}!</h2>
        <p>Vi har modtaget din booking (Ref: <strong>{bookingId}</strong>). En bekræftelse er sendt til <strong>{email}</strong>.</p>
        
        <div className="summary-receipt">
          <h3>Booking Detaljer:</h3>
          <div className="receipt-row"><strong>Rengøring:</strong> Certificeret Zenmester (automatisk tildelt)</div>
          <div className="receipt-row"><strong>Adresse:</strong> {address}, {zip} {city}</div>
          <div className="receipt-row"><strong>Tidspunkt:</strong> {selectedDateStr} kl. {selectedTimeSlot ? selectedTimeSlot.label : "08:00 - 16:00"}</div>
          <div className="receipt-row"><strong>Boligpakke:</strong> {activePkg.title} ({selectedM2} m²)</div>
          {selectedExtras.length > 0 && (
            <div className="receipt-row">
              <strong>Tilvalg:</strong> {selectedExtras.map(id => EXTRAS.find(e => e.id === id)?.title).join(", ")}
            </div>
          )}
          <hr />
          <div className="receipt-row highlight">
            <span>Billed efter service:</span>
            <strong>{formatPriceDK(totalFirstCleanPrice)}</strong>
          </div>
          <div className="receipt-row sub">
            <span>Egenbetaling (efter servicefradrag):</span>
            <span>{formatPriceDK(totalFirstCleanPriceNet)}</span>
          </div>
          <div className="receipt-row info-zero">
            <span>Betalt i dag:</span>
            <strong>0 kr.</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="l27-dealside-wizard-container">

      {/* Named Progress Stepper */}
      <div className="wizard-stepper">
        {[
          { key: 1, label: "Postnr", active: step === 1, completed: step > 1, circleNum: 1 },
          { key: 2, label: "Pakke", active: step === 2, completed: step > 2, circleNum: 2 },
          { key: 3, label: "Tilvalg", active: step === 3, completed: step > 3, circleNum: 3 },
          { key: 4, label: "Dato", active: step === 4, completed: step > 4, circleNum: 4 },
          { key: 5, label: "Bestil", active: step === 5 || step === 6, completed: step > 6, circleNum: 5 }
        ].map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`stepper-step ${s.active ? "active" : ""} ${s.completed ? "completed" : ""}`}>
              <div className="stepper-circle">
                {s.completed ? "✓" : s.circleNum}
              </div>
              <span className="stepper-label">{s.label}</span>
            </div>
            {i < 4 && <div className={`stepper-line ${s.completed ? "completed" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Urgency Banner (visible after step 1) */}
      {step > 1 && (
        <div className="wizard-urgency-banner">
          <div className="urgency-congrats">
            {step === 2
              ? `Tillykke! Du har reserveret en introrabat i ${city || "dit område"}.`
              : `Din intropris er reserveret — færdiggør din booking.`
            }
          </div>
          <div className="urgency-details">
            <span className="urgency-timer">⌚ Vi holder den i {countdownMin}:{countdownSec}</span>
            <span className="urgency-spots">🔥 Kun 7 introtilbud tilbage i dag</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wizard-step">
          <h2>Tjek dækning og se priser i dit område</h2>
          <p className="step-desc">Indtast dit postnummer, så viser vi dig de tilgængelige boligpakker og introtilbud i dit område.</p>

          <div className="input-group">
            <label htmlFor="dealside-zip">Postnummer</label>
            <input
              type="text"
              id="dealside-zip"
              placeholder="F.eks. 2100"
              value={zip}
              onChange={handleZipChange}
              style={{ fontSize: "1.15rem", padding: "16px 18px" }}
            />
            {zip.length === 4 && (
              <span className={`zip-status-badge ${isZipValid ? "success" : "error"}`}>
                {isZipValid ? `✓ Vi dækker ${city}! Se dine priser nedenfor.` : "❌ Vi dækker desværre ikke dette område endnu."}
              </span>
            )}
          </div>

          {isZipValid && (
            <div style={{ background: "rgba(32,109,105,0.06)", borderRadius: "12px", padding: "16px 20px", marginTop: "12px", fontSize: "0.9rem", color: "rgba(25,34,81,0.8)", lineHeight: 1.6 }}>
              <strong>✓ Ingen personlige oplysninger kræves endnu</strong> — se priser og vælg pakke først. Du udfylder kontaktinfo i sidste trin.
            </div>
          )}

          <button type="button" className="btn-primary" onClick={nextStep} disabled={!isZipValid} style={{ marginTop: "24px" }}>
            Se boligpakker & priser →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <h2>Vælg din boligpakke</h2>
          <p className="step-desc">Introtilbuddet gælder kun din første rengøring – vælg din størrelse.</p>

          <div className="packages-grid">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.m2}
                className={`package-card ${selectedM2 === pkg.m2 ? "active" : ""}`}
                onClick={() => setSelectedM2(pkg.m2)}
              >
                {pkg.m2 === 100 && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #206d69, #154c49)", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "3px 14px", borderRadius: "20px", letterSpacing: "0.05em", whiteSpace: "nowrap", zIndex: 2 }}>
                    ★ MEST POPULÆR
                  </div>
                )}
                <div className="package-title">{pkg.title}</div>
                <div className="package-rooms">{pkg.rooms} (op til {pkg.m2} m²)</div>
                <div className="package-price-row">
                  <span className="price-old">{formatPriceDK(pkg.normalPrice)}</span>
                  <span className="price-new">{formatPriceDK(pkg.introPrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "6px" }}>
                  <span className="package-savings" style={{ marginTop: 0 }}>Spar {formatPriceDK(pkg.savings)}</span>
                  <span style={{ background: "#e6f4ea", color: "#166534", fontSize: "0.72rem", fontWeight: 800, padding: "4px 8px", borderRadius: "8px", fontFamily: "var(--font-mono), monospace" }}>
                    {Math.round((pkg.savings / pkg.normalPrice) * 100)}% rabat
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="wizard-navigation-buttons">
            <button type="button" className="btn-secondary" onClick={prevStep}>Tilbage</button>
            <button type="button" className="btn-primary" onClick={nextStep}>Vælg tilvalg →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-step">
          <h2>Tilpas din rengøring med tilvalg</h2>
          <p className="step-desc">Vælg eventuelle ekstra opgaver, du ønsker udført. Som Renzen Klub-medlem sparer du op til 43% på tilvalg — og fra din 4. medlemsmåned kan du bruge dine Zen-kreditter her.</p>

          <div className="cleaners-list">
            {EXTRAS.map((extra) => {
              const isSelected = selectedExtras.includes(extra.id);
              return (
                <div
                  key={extra.id}
                  className={`cleaner-card ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedExtras(selectedExtras.filter(id => id !== extra.id));
                    } else {
                      setSelectedExtras([...selectedExtras, extra.id]);
                    }
                  }}
                >
                  <img className="cleaner-avatar" src={extra.icon} alt={extra.title} style={{ objectFit: "contain", padding: "4px" }} />
                  <div className="cleaner-details">
                    <div className="cleaner-header">
                      <span className="cleaner-name">{extra.title}</span>
                      <span className="cleaner-rating">Spar {formatPriceDK(extra.savings)}</span>
                    </div>
                    <div className="cleaner-specialty">Renzen Klub pris: {formatPriceDK(extra.introPrice)}</div>
                    <p className="cleaner-desc">Normalpris: {formatPriceDK(extra.normalPrice)}</p>
                  </div>
                  <div className="cleaner-select-checkbox">
                    <div className="checkbox-ring">
                      <div className="checkbox-dot" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wizard-navigation-buttons">
            <button type="button" className="btn-secondary" onClick={prevStep}>Tilbage</button>
            <button type="button" className="btn-primary" onClick={nextStep}>Vælg dato og tid →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-step">
          <h2>Hvornår skal vi komme?</h2>
          <p className="step-desc">Vælg din første rengøringsdato nedenfor. Vi runder af med gratis ombooking indtil 24 timer før.</p>

          <div className="l27-calendar-container" style={{ display: "block", width: "100%" }}>
            {/* Horizontal Date Cards Row */}
            <div className="l27-date-row">
              {quickSelectDates.map((d, idx) => {
                const dateStr = toLocalYmd(d);
                const isSelected = selectedDateStr === dateStr;
                const isPast = isDateInPast(d);
                const isUnavailable = !isPast && !isLoadingSpots && Object.keys(spotsCache).length > 0 && !hasFreeSpots(dateStr);
                
                const dayName = d.toLocaleDateString("da-DK", { weekday: "short" }).toUpperCase().replace('.', '');
                const dayNum = d.getDate();
                const monthName = d.toLocaleDateString("da-DK", { month: "short" }).toLowerCase().replace('.', '');
                
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`l27-date-tile ${isSelected ? "selected" : ""} ${isUnavailable ? "disabled" : ""}`}
                    disabled={isUnavailable}
                    onClick={() => {
                      setSelectedDateStr(dateStr);
                      setShowFullCalendar(false); // Close full calendar if open
                    }}
                  >
                    <span className="day-name">{dayName}</span>
                    <span className="day-num">{dayNum}</span>
                    <span className="day-month">{monthName}</span>
                  </button>
                );
              })}

              {/* Calendar Toggle Tile */}
              {(() => {
                const isDateInQuick = quickSelectDates.some(d => toLocalYmd(d) === selectedDateStr);
                const isCalSelected = selectedDateStr !== "" && !isDateInQuick;
                const selectedDateObj = isCalSelected ? new Date(selectedDateStr) : null;
                
                const calTileDayName = isCalSelected ? "VALGT" : "KALENDER";
                const calTileDayNum = selectedDateObj ? selectedDateObj.getDate() : "";
                const calTileMonth = selectedDateObj 
                  ? selectedDateObj.toLocaleDateString("da-DK", { month: "short" }).toLowerCase().replace('.', '') 
                  : "Vælg...";
                
                return (
                  <button
                    type="button"
                    className={`l27-date-tile calendar-tile ${isCalSelected ? "selected" : ""} ${showFullCalendar ? "active-dropdown" : ""}`}
                    onClick={() => setShowFullCalendar(!showFullCalendar)}
                  >
                    <span className="day-name">{calTileDayName}</span>
                    {isCalSelected ? (
                      <span className="day-num">{calTileDayNum}</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBlock: "2px" }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    )}
                    <span className="day-month">{calTileMonth}</span>
                  </button>
                );
              })()}
            </div>

            {/* Inline Collapsible Full Calendar */}
            {showFullCalendar && (
              <div className="l27-open-calendar" id="l27-open-calendar" style={{ marginTop: "16px" }}>
                <div className="l27-cal-header">
                  <button type="button" className="l27-cal-nav" onClick={handlePrevMonth}>
                    ‹
                  </button>
                  <div className="l27-cal-month">{currentMonthName}</div>
                  <button type="button" className="l27-cal-nav" onClick={handleNextMonth}>
                    ›
                  </button>
                </div>

                <div className="l27-cal-grid">
                  <div className="l27-cal-dow l27-cal-week">#</div>
                  {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
                    <div key={d} className="l27-cal-dow">
                      {d}
                    </div>
                  ))}

                  {/* Weeks grid */}
                  {Array.from({ length: 6 }).map((_, weekIdx) => {
                    const weekFirstDay = calendarDays[weekIdx * 7];
                    const weekNum = getIsoWeekNumber(weekFirstDay);

                    return (
                      <React.Fragment key={weekIdx}>
                        <div className="l27-cal-week">{weekNum}</div>
                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                          const dayDate = calendarDays[weekIdx * 7 + dayIdx];
                          const dateStr = toLocalYmd(dayDate);
                          const isCurrentMonth = dayDate.getMonth() === viewDate.getMonth();
                          const isPast = isDateInPast(dayDate);
                          const isSelected = selectedDateStr === dateStr;
                          const isUnavailable = !isPast && !isLoadingSpots && Object.keys(spotsCache).length > 0 && !hasFreeSpots(dateStr);

                          return (
                            <button
                              key={dayIdx}
                              type="button"
                              className={`l27-cal-day ${!isCurrentMonth ? "is-out" : ""} ${
                                isSelected ? "is-selected" : ""
                              }`}
                              disabled={isPast || isUnavailable}
                              onClick={() => {
                                setSelectedDateStr(dateStr);
                                setShowFullCalendar(false); // Close full calendar after selection
                              }}
                            >
                              <span className="l27-cal-num">{dayDate.getDate()}</span>
                            </button>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="l27-field-group" style={{ marginTop: "24px" }}>
            <label id="l27-times-label" style={{ fontSize: "1.05rem", fontWeight: 850, color: "#192251", marginBottom: "12px", display: "block", textAlign: "left" }}>
              {selectedDateStr
                ? `Ledige tider den ${getFormattedDateDisplay(selectedDateStr).split(" kl. ")[0]}`
                : "Ledige tider"}
            </label>

            <div id="l27-time-slots" className="l27-time-grid">
              {isLoadingSpots ? (
                <p className="l27-hint">Henter ledige tider...</p>
              ) : !selectedDateStr ? (
                <p className="l27-hint">Vælg en dato i kalenderen for at se ledige tider</p>
              ) : (
                <div className="l27-time-groups">
                  {/* All day Slot */}
                  {liveAllDaySlot && (
                    <div className="l27-time-all-day" style={{ marginBottom: "12px" }}>
                      <div
                        className={`l27-time-slot l27-time-slot--wide l27-time-slot--best ${
                          selectedTimeSlot?.label === liveAllDaySlot.label ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTimeSlot(liveAllDaySlot)}
                      >
                        <div className="l27-time-slot-inner">
                          <div className="l27-time-slot-title">Fleksibel tid</div>
                          <div className="l27-time-slot-range">{liveAllDaySlot.label}</div>
                        </div>
                        <span className="l27-badge-best">bedste chance for ledig tid</span>
                      </div>
                    </div>
                  )}

                  {useMocks && (
                    <div className="l27-time-all-day" style={{ marginBottom: "12px" }}>
                      <div
                        className={`l27-time-slot l27-time-slot--wide l27-time-slot--best ${
                          selectedTimeSlot?.label === mockAllDaySlot.label ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTimeSlot(mockAllDaySlot)}
                      >
                        <div className="l27-time-slot-inner">
                          <div className="l27-time-slot-title">Fleksibel tid</div>
                          <div className="l27-time-slot-range">{mockAllDaySlot.label}</div>
                        </div>
                        <span className="l27-badge-best">bedste chance for ledig tid</span>
                      </div>
                    </div>
                  )}

                  <div className="l27-time-columns" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Morning Slots */}
                    <div className="l27-time-col">
                      <div className="l27-time-group-title" style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "rgba(25, 34, 81, 0.5)", marginBottom: "8px", textAlign: "left" }}>Morgen</div>
                      {(useMocks ? mockMorningSlots : liveMorningSlots).length > 0 ? (
                        (useMocks ? mockMorningSlots : liveMorningSlots).map((slot, idx) => (
                          <div
                            key={idx}
                            className={`l27-time-slot ${
                              selectedTimeSlot?.label === slot.label ? "selected" : ""
                            }`}
                            onClick={() => setSelectedTimeSlot(slot)}
                            style={{ marginBottom: "8px" }}
                          >
                            <span className="l27-time-slot-text">{slot.label}</span>
                          </div>
                        ))
                      ) : (
                        <p className="l27-hint">Ingen tider</p>
                      )}
                    </div>

                    {/* Afternoon Slots */}
                    <div className="l27-time-col">
                      <div className="l27-time-group-title" style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "rgba(25, 34, 81, 0.5)", marginBottom: "8px", textAlign: "left" }}>Eftermiddag</div>
                      {(useMocks ? mockAfternoonSlots : liveAfternoonSlots).length > 0 ? (
                        (useMocks ? mockAfternoonSlots : liveAfternoonSlots).map((slot, idx) => (
                          <div
                            key={idx}
                            className={`l27-time-slot ${
                              selectedTimeSlot?.label === slot.label ? "selected" : ""
                            }`}
                            onClick={() => setSelectedTimeSlot(slot)}
                            style={{ marginBottom: "8px" }}
                          >
                            <span className="l27-time-slot-text">{slot.label}</span>
                          </div>
                        ))
                      ) : (
                        <p className="l27-hint">Ingen tider</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {selectedDateStr && (
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#206d69", fontWeight: 600 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Gratis ombooking indtil 24 timer før.
              </div>
            )}
          </div>

          <h3 className="section-sub" style={{ marginTop: "24px" }}>Automatisk Zenmester Match</h3>
          <div className="time-slot-card active" style={{ cursor: "default", display: "flex", alignItems: "center", gap: "12px", border: "1.5px solid #206d69", padding: "16px", borderRadius: "14px", background: "#f4fbfa" }}>
            <span style={{ fontSize: "1.5rem" }}>✨</span>
            <div style={{ textAlign: "left" }}>
              <span className="slot-title" style={{ color: "#206d69", fontWeight: 850 }}>Vi matcher automatisk den bedste ledige Zenmester</span>
              <span className="slot-desc" style={{ color: "rgba(25, 34, 81, 0.75)", marginTop: "2px" }}>
                Rengøringen udføres af en af vores forsikrede, straffeattest-tjekkede og fuldt certificerede Zenmestre. 100% tilfredshedsgaranti.
              </span>
            </div>
          </div>

          <div className="wizard-navigation-buttons" style={{ marginTop: "30px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep}>Tilbage</button>
            <button type="button" className="btn-primary" onClick={nextStep}>Bekræft og betal →</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="wizard-step">
          <h2>Vælg din medlemsplan</h2>
          <p className="step-desc">De fleste vælger årsplanen — samme fordele til {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md. Dit medlemskab låser intropris på {formatPriceDK(activePkg.introPrice)} og giver rabatter + kreditter.</p>

          {/* Annual / Monthly toggle — PRIMARY element */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {/* Annual card */}
            <div
              onClick={() => setPlanType('annual')}
              style={{
                position: "relative",
                border: planType === 'annual' ? "2.5px solid #206d69" : "1.5px solid #d1d5db",
                borderRadius: "16px",
                padding: "20px 16px",
                cursor: "pointer",
                background: planType === 'annual' ? "#fff" : "#fafafa",
                boxShadow: planType === 'annual' ? "0 4px 20px rgba(32,109,105,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                textAlign: "left"
              }}
            >
              <div style={{ position: "absolute", top: "-10px", right: "12px", background: "#206d69", color: "#fff", fontSize: "0.65rem", fontWeight: 800, padding: "3px 10px", borderRadius: "8px", letterSpacing: "0.04em" }}>BEDST PRIS</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#111827" }}>Årligt</span>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2.5px solid ${planType === 'annual' ? '#206d69' : '#94a3b8'}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {planType === 'annual' && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#206d69" }} />}
                </div>
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 950, color: "#206d69", marginBottom: "2px" }}>{KLUB_ANNUAL_KR} kr./år</div>
              <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "8px" }}>= kun {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md.</div>
              <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>Spar {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} kr. vs. månedsplan</div>
            </div>

            {/* Monthly card */}
            <div
              onClick={() => setPlanType('monthly')}
              style={{
                border: planType === 'monthly' ? "2.5px solid #206d69" : "1.5px solid #d1d5db",
                borderRadius: "16px",
                padding: "20px 16px",
                cursor: "pointer",
                background: planType === 'monthly' ? "#fff" : "#fafafa",
                boxShadow: planType === 'monthly' ? "0 4px 20px rgba(32,109,105,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", marginTop: "4px" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#111827" }}>Månedlig</span>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2.5px solid ${planType === 'monthly' ? '#206d69' : '#94a3b8'}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {planType === 'monthly' && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#206d69" }} />}
                </div>
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 950, color: "#206d69", marginBottom: "2px" }}>{KLUB_MONTHLY_KR} kr./md.</div>
              <div style={{ fontSize: "0.85rem", color: "#475569" }}>Min. {KLUB_MONTHLY_MIN_MONTHS} mdr. binding</div>
            </div>
          </div>

          {/* What you get — compact benefits */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "20px", textAlign: "left" }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", marginBottom: "14px" }}>Dit medlemskab inkluderer:</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "#374151" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#206d69", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>✓</span>
                <div><strong>Op til 20% rabat</strong> på rengøring — 20% ved ugentlig, 15% hver 2. uge</div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#206d69", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>✓</span>
                <div><strong>{ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter hver måned</strong> — brug på {ZEN_CREDIT_SERVICES_COMPACT}. Maks. 1 service pr. md. Udløber hver måned.</div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#206d69", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>✓</span>
                <div><strong>Fra måned 4:</strong> kreditter kan også bruges på tilvalg (ovnrengøring, køleskab m.m.)</div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#206d69", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>✓</span>
                <div><strong>14 dages fortrydelsesret</strong> — fuld refusion indtil din første rengøring er udført</div>
              </div>
            </div>

            {/* Compact wallet visual */}
            <div style={{ marginTop: "16px", padding: "12px 14px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.1rem" }}>💰</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#166534" }}>Op til {ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. i kreditter over {zenCreditAnnualMonths} mdr.</div>
                <div style={{ fontSize: "0.75rem", color: "#15803d" }}>Brug på: {ZEN_CREDIT_SERVICES_COMPACT}</div>
              </div>
            </div>
          </div>

          {/* Fine print */}
          <div style={{ marginTop: "12px", fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.5 }}>
            💡 {planType === 'annual' ? '12' : '6'} mdr. binding. Ved tidlig opsigelse efterfaktureres introrengøringen til normalpris.
          </div>

          <div className="wizard-navigation-buttons" style={{ marginTop: "24px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep}>Tilbage</button>
            <button type="button" className="btn-primary" onClick={nextStep}>Aktiver medlemskab & fortsæt →</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <form className="wizard-step" onSubmit={handleSubmit}>
          <h2>Næsten i mål — udfyld dine oplysninger</h2>

          {errorMessage && <div className="error-alert-box">{errorMessage}</div>}

          {/* Section: Contact Info */}
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(25,34,81,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>👤</span> Dine oplysninger
            </h3>
            <div className="inputs-row">
              <div className="input-group">
                <label>Fornavn</label>
                <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Efternavn</label>
                <input type="text" placeholder="Efternavn" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="inputs-row">
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" placeholder="Din e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Telefonnummer</label>
                <input type="tel" placeholder="Mobilnummer" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div style={{ marginBottom: "8px", borderTop: "1px solid rgba(25,34,81,0.06)", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(25,34,81,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>🏠</span> Adresse
            </h3>
            <div className="input-group">
              <label>Adresse og husnummer</label>
              <input
                type="text"
                placeholder="F.eks. Nørrebrogade 12, 2. tv"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Payment */}
          <div style={{ borderTop: "1px solid rgba(25,34,81,0.06)", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(25,34,81,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>🔒</span> Sikker betaling
            </h3>
            <div className="payment-card-input-box">
              <div className="input-group">
                <label>Kortnummer</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").substring(0, 16))}
                />
              </div>
              <div className="inputs-row" style={{ marginTop: "12px" }}>
                <div className="input-group">
                  <label>Udløbsdato (MM/ÅÅ)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                  />
                </div>
                <div className="input-group">
                  <label>CVC / Kontrolcifre</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                  />
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(25,34,81,0.45)", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              🔒 SSL-krypteret · Vi gemmer aldrig dine kortoplysninger
            </div>
          </div>

          {/* Transparent pricing summary */}
          <div className="summary-price-card">
            <div className="summary-price-row">
              <div className="row-labels">
                <span className="main-label">Første rengøring — intropris</span>
                {selectedExtras.length > 0 && (
                  <span className="sub-label" style={{ color: "rgba(25, 34, 81, 0.5)", marginTop: "4px" }}>
                    Inkl. tilvalg: {selectedExtras.map(id => EXTRAS.find(e => e.id === id)?.title).join(", ")}
                  </span>
                )}
              </div>
              <span className="row-val">{formatPriceDK(totalFirstCleanPrice)}</span>
            </div>

            <div className="summary-price-row border-top" style={{ background: "rgba(32,109,105,0.04)" }}>
              <div className="row-labels">
                <span className="main-label" style={{ color: "#206d69" }}>⬇ Din egenbetaling efter 26% servicefradrag</span>
              </div>
              <span className="row-val" style={{ color: "#206d69", fontSize: "1.2rem", fontWeight: 700 }}>{formatPriceDK(totalFirstCleanPriceNet)}</span>
            </div>

            <div className="summary-price-row ongoing border-top">
              <div className="row-labels">
                <span className="main-label">Renzen Klub medlemskab</span>
                <span className="sub-label">Inkl. 15% rabat på rengøring + {ZEN_CREDIT_MONTHLY_KR} kr. Zen-kredit pr. md. til andre services</span>
              </div>
              <span className="row-val">{KLUB_MONTHLY_KR} kr./md.</span>
            </div>

            <div className="summary-price-row ongoing border-top">
              <div className="row-labels">
                <span className="main-label">Derefter løbende pr. gang (hver 2. uge)</span>
                <span className="sub-label">Egenbetaling efter fradrag: <strong style={{ color: "#206d69" }}>{formatPriceDK(subsequentCleanPriceNet)}</strong></span>
              </div>
              <span className="row-val">{formatPriceDK(subsequentCleanPriceGross)}</span>
            </div>

            <div className="summary-savings-badge">
              <span>Din besparelse i dag:</span>
              <span>Spar {formatPriceDK(totalSavings)}</span>
            </div>

            <div className="summary-pay-today-alert">
              <div className="header-row">
                <span>Betaling i dag:</span>
                <strong>0 kr.</strong>
              </div>
              <p>Vi trækker først betalingen for rengøringen efter vores Zenmester har gjort dit hjem rent.</p>
            </div>
          </div>

          <TermsConfirmCard
            id="dealside-terms"
            checked={termsAccepted}
            onChange={setTermsAccepted}
            ariaLabel="Accepter vilkår for Renzen Klub"
            description={
              <>
                Læs{" "}
                <Link
                  href="/handelsbetingelser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  handelsbetingelserne
                </Link>
                .
              </>
            }
          >
            Jeg accepterer vilkårene for Renzen Klub (
            {planType === "annual"
              ? `${KLUB_ANNUAL_KR} kr./år · 12 mdr. binding`
              : `${KLUB_MONTHLY_KR} kr./md. · min. ${KLUB_MONTHLY_MIN_MONTHS} mdr. binding`}
            ). Zen-kreditter ({ZEN_CREDIT_MONTHLY_KR} kr./md.) udløber ved månedens udgang og
            overføres ikke. Tilvalg-kreditter aktiveres efter 3 måneders aktivt
            medlemskab. Du har 14 dages fortrydelsesret fra tilmeldingsdatoen.
          </TermsConfirmCard>

          <p style={{ fontSize: "0.78rem", color: "rgba(25,34,81,0.5)", marginTop: "8px", lineHeight: 1.5 }}>
            Ved opsigelse af medlemskabet inden 6 måneder opkræves normal engangspris for den udførte introrengøring. Opsigelse kan ske nemt via e-mail eller din profil.
          </p>

          <div style={{ background: "#fafafa", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "16px", marginTop: "20px", fontSize: "0.8rem", color: "rgba(25, 34, 81, 0.75)", lineHeight: 1.5, textAlign: "left" }}>
            <strong style={{ display: "block", color: "#192251", fontSize: "0.85rem", fontWeight: 800, marginBottom: "8px" }}>
              Fordele, introtilbud & medlemskab af Renzen Klub:
            </strong>
            <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li><strong>Medlemsbetingelser:</strong> {planType === 'annual' ? `Introtilbuddet forudsætter et 12-måneders medlemskab af Renzen Klub til ${KLUB_ANNUAL_KR} kr./år, som automatisk fornyes indtil du afmelder dig.` : `Introtilbuddet forudsætter et 6-måneders medlemskab af Renzen Klub til ${KLUB_MONTHLY_KR} kr./md., som automatisk fornyes indtil du afmelder dig.`}</li>
              <li><strong>Zen-kreditter:</strong> Hver måned modtager du {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter, som du kan bruge på én udvalgt boligservice pr. måned (f.eks. flytterengøring, havearbejde, vinduespudsning eller malerarbejde). Kreditter udløber ved månedens udgang og overføres ikke til næste måned.</li>
              <li><strong>Tilvalg-kreditter:</strong> Fra dit 4. aktive medlemsmåned kan du også bruge Zen-kreditter som rabat på tilvalg (ovnrengøring, køleskab m.m.).</li>
              <li><strong>Faste rabatter:</strong> Du kan booke ubegrænsede løbende rengøringer til faste medlemspriser (spar 20% ved ugentlig / 15% ved biweekly rengøring).</li>
              <li><strong>Refusion & fortrydelse:</strong> Du har 14 dages fuld fortrydelsesret på dit medlemskab fra tilmeldingsdatoen, så længe din introrengøring ikke er udført.</li>
            </ul>
          </div>

          <div className="wizard-navigation-buttons" style={{ marginTop: "24px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep} disabled={isSubmitting}>Tilbage</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting || !termsAccepted || !firstName || !lastName || !email || !phone || !address}>
              {isSubmitting ? "Booker..." : `Reserver rengøring til ${formatPriceDK(totalFirstCleanPrice)} →`}
            </button>
          </div>
        </form>
      )}
      {/* Persistent Bottom Summary (visible from step 2+) */}
      {step >= 2 && (
        <div className="wizard-sticky-summary">
          <div className="sticky-summary-left">
            <span className="summary-label">Du får:</span>
            <strong>{activePkg.title} rengøring</strong>
            {selectedExtras.length > 0 && (
              <span className="summary-extras">+ {selectedExtras.length} tilvalg</span>
            )}
          </div>
          <div className="sticky-summary-right">
            <span className="summary-old-price">{formatPriceDK(activePkg.normalPrice + selectedExtras.reduce((s, id) => s + (EXTRAS.find(e => e.id === id)?.normalPrice || 0), 0))}</span>
            <span className="summary-new-price">{formatPriceDK(totalFirstCleanPrice)}</span>
            <span style={{ fontSize: "0.68rem", color: "rgba(25,34,81,0.55)", fontWeight: 600, lineHeight: 1.2 }}>Egenbetaling: {formatPriceDK(Math.round(totalFirstCleanPrice * 0.74))} efter fradrag</span>
            <span className="summary-discount-badge">{Math.round((totalSavings / (activePkg.normalPrice + selectedExtras.reduce((s, id) => s + (EXTRAS.find(e => e.id === id)?.normalPrice || 0), 0))) * 100)}% rabat</span>
          </div>
        </div>
      )}
    </div>
  );
}
