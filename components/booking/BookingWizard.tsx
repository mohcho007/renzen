"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { TermsConfirmCard } from "@/components/forms/TermsConfirmCard";
import { createStripeCardToken } from "@/components/payment/createStripeCardToken";
import { StripeCardInput } from "@/components/payment/StripeCardInput";
import { StripeElementsProvider } from "@/components/payment/StripeElementsProvider";
import { ZEN_CREDIT_SERVICES_COMPACT } from "@/lib/zenCreditServices";
import { getPackageTierForM2 } from "@/components/dealside/dealPackages";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR,
  KLUB_MONTHLY_KR,
  KLUB_MONTHLY_MIN_MONTHS,
  listPriceKr,
  ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";

const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;
const zenCreditRemainingMonths = zenCreditAnnualMonths - 1;

// Frequency options matching Launch27 API
interface Frequency {
  id: string;
  name: string;
  discount: number; // percent
  type: "recurring" | "oneoff";
}

const FREQUENCIES: Frequency[] = [
  { id: "17", name: "Hver uge - Spar 20%", discount: 20, type: "recurring" },
  { id: "22", name: "Hver 2. uge - Spar 15%", discount: 15, type: "recurring" },
  { id: "19", name: "Hver 4. uge - Spar 5%", discount: 5, type: "recurring" },
  { id: "1", name: "Enkelt gang - Ingen rabat", discount: 0, type: "oneoff" },
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

// Extra items (Tilvalg) matching l27-form.js
interface Extra {
  id: string;
  name: string;
  price: number;
  icon: string;
  quantityBased?: boolean;
}

const EXTRAS_LIST: Extra[] = [
  { id: "52", name: "Køleskab indvendigt", price: 215, icon: "https://renzen.dk/wp-content/uploads/2025/05/fridge-1.png", quantityBased: false },
  { id: "53", name: "Ovn og emhætte", price: 599, icon: "https://renzen.dk/wp-content/uploads/2025/05/oven.png", quantityBased: false },
  { id: "217", name: "Køkkenskabe indvendigt", price: 35, icon: "https://renzen.dk/wp-content/uploads/2025/05/kitchen_9263039.png", quantityBased: true },
  { id: "93", name: "Afkalkning af bad/køkken", price: 729, icon: "https://renzen.dk/wp-content/uploads/2025/05/bath_13134933.png", quantityBased: false },
  { id: "56", name: "Fodpaneler", price: 79, icon: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23111827%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M10%2046h44%22%2F%3E%3Cpath%20d%3D%22M12%2046v6h40v-6%22%2F%3E%3Cpath%20d%3D%22M14%2026h36%22%2F%3E%3Cpath%20d%3D%22M14%2026v14%22%2F%3E%3Cpath%20d%3D%22M50%2026v14%22%2F%3E%3Cpath%20d%3D%22M22%2034h20%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E", quantityBased: false },
  { id: "57", name: "Sofagruppe", price: 129, icon: "https://renzen.dk/wp-content/uploads/2025/05/sofa-1.png", quantityBased: false },
  { id: "58", name: "Ekstra kæledyrshår", price: 75, icon: "https://renzen.dk/wp-content/uploads/2025/05/dog.png", quantityBased: false }
];

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

const renderExtraIcon = (extra: Extra) => {
  switch (extra.id) {
    case "52": // Køleskab indvendigt
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="5" y1="10" x2="19" y2="10"/>
          <line x1="9" y1="5" x2="9" y2="7"/>
          <line x1="9" y1="13" x2="9" y2="17"/>
        </svg>
      );
    case "53": // Ovn og emhætte
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <rect x="7" y="8" width="10" height="7" rx="1"/>
          <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
          <circle cx="12" cy="5.5" r="0.75" fill="currentColor"/>
          <circle cx="16" cy="5.5" r="0.75" fill="currentColor"/>
        </svg>
      );
    case "217": // Køkkenskabe indvendigt
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <circle cx="7.5" cy="7.5" r="0.75" fill="currentColor"/>
          <circle cx="16.5" cy="7.5" r="0.75" fill="currentColor"/>
          <circle cx="7.5" cy="16.5" r="0.75" fill="currentColor"/>
          <circle cx="16.5" cy="16.5" r="0.75" fill="currentColor"/>
        </svg>
      );
    case "93": // Afkalkning af bad/køkken
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
          <path d="M19 3h.01"/>
          <path d="M22 6h.01"/>
          <path d="M16 6h.01"/>
        </svg>
      );
    case "56": // Fodpaneler
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 46h44"/>
          <path d="M12 46v6h40v-6"/>
          <path d="M14 26h36"/>
          <path d="M14 26v14"/>
          <path d="M50 26v14"/>
          <path d="M22 34h20"/>
        </svg>
      );
    case "57": // Sofagruppe
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/>
          <path d="M3 11h18a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/>
          <line x1="5" y1="11" x2="5" y2="17"/>
          <line x1="19" y1="11" x2="19" y2="17"/>
        </svg>
      );
    case "58": // Ekstra kæledyrshår
      return (
        <svg className="l27-extra-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7.5" cy="8.5" r="1.5" fill="currentColor"/>
          <circle cx="11.5" cy="6.5" r="1.5" fill="currentColor"/>
          <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M11.5 11c-2 0-3.5 1.5-3.5 3.5 0 1 .8 1.8 1.8 1.8h3.4c1 0 1.8-.8 1.8-1.8 0-2-1.5-3.5-3.5-3.5z"/>
        </svg>
      );
    default:
      return <img className="l27-extra-icon" src={extra.icon} alt={extra.name} />;
  }
};

// renderTrustSection is defined inside BookingWizard to access local carousel state

type BookingWizardVariant = "default" | "editorial" | "deal";

const DEAL_WIZARD_STEPS = ["Bolig", "Tid", "Medlemskab", "Bekræft"];

const STEP_COPY: Record<
  BookingWizardVariant,
  Record<1 | 2 | 3 | 4, { title: string; description: string }>
> = {
  default: {
    1: {
      title: "Rengøringshjælp",
      description:
        "Synes du det er kedeligt at gøre rent selv? Selvfølgelig kan vi hjælpe dig med rengøringen! Det er godt for din bolig at blive gjort rent regelmæssigt. Rutinemæssig rengøring af din bolig gør den til et mere hyggeligt sted og skaber et bedre indeklima.",
    },
    2: {
      title: "Hvornår skal vi komme?",
      description:
        "Vælg en dato og et tidspunkt, der passer dig bedst. Vi tilpasser os din hverdag.",
    },
    3: {
      title: "Vælg din medlemsplan",
      description:
        "Dit medlemskab låser din intropris og giver rabatter + kreditter til alle boligopgaver.",
    },
    4: {
      title: "Betaling & detaljer",
      description:
        "Indtast dine kontaktoplysninger og betalingskort for at gennemføre din booking.",
    },
  },
  editorial: {
    1: {
      title: "Dit hjem",
      description:
        "Indtast adresse og størrelse. Introtilbuddet gælder fast rengøring hver 2. uge med Renzen Klub.",
    },
    2: {
      title: "Vælg tid",
      description:
        "Book din første rengøring. Du betaler 0 kr. i dag — vi trækker først efter besøget.",
    },
    3: {
      title: "Renzen Klub",
      description:
        "Vælg års- eller månedsplan. Medlemskabet låser introprisen og giver løbende fordele.",
    },
    4: {
      title: "Bekræft booking",
      description:
        "Tjek dine oplysninger og gem betalingskort. Du godkender først, når du har set den fulde pris.",
    },
  },
  deal: {
    1: {
      title: "Hvor skal vi gøre rent?",
      description: "Kun adressen mangler. Bolig, intropris og hver 2. uge er allerede valgt.",
    },
    2: {
      title: "Hvornår passer det dig?",
      description: "Vælg dato og tidspunkt til din første rengøring.",
    },
    3: {
      title: "Vælg medlemsplan",
      description: "Årsplan giver bedst værdi. Du ser den samlede pris, før du går videre.",
    },
    4: {
      title: "Bekræft og gem kort",
      description: "0 kr. trækkes i dag. Betaling sker først efter rengøringen.",
    },
  },
};

export default function BookingWizard(props: {
  initialZip?: string;
  initialM2?: string;
  variant?: BookingWizardVariant;
  dealPackageLabel?: string;
  dealIntroPrice?: number;
}) {
  return (
    <StripeElementsProvider>
      <BookingWizardForm {...props} />
    </StripeElementsProvider>
  );
}

function BookingWizardForm({
  initialZip,
  initialM2,
  variant = "default",
  dealPackageLabel,
  dealIntroPrice,
}: {
  initialZip?: string;
  initialM2?: string;
  variant?: BookingWizardVariant;
  dealPackageLabel?: string;
  dealIntroPrice?: number;
} = {}) {
  const stripe = useStripe();
  const elements = useElements();
  const isDealFlow = variant === "deal";
  const stepCopyVariant: BookingWizardVariant = isDealFlow ? "deal" : variant;
  const searchParams = useSearchParams();
  const postcodeParam = searchParams.get("postcode") || "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Form inputs - dynamically initialized based on presence of initialM2 (from Dealside)
  const [m2, setM2] = useState(initialM2 || "");
  const [selectedFreqId, setSelectedFreqId] = useState(initialM2 ? "22" : "");
  const [lastRecurringFreqId, setLastRecurringFreqId] = useState("22");

  useEffect(() => {
    const freq = FREQUENCIES.find((f) => f.id === selectedFreqId);
    if (freq && freq.type === "recurring") {
      setLastRecurringFreqId(selectedFreqId);
    }
  }, [selectedFreqId]);

  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);
  const [shuffledTestimonials, setShuffledTestimonials] = useState<{
    name: string;
    city: string;
    initials: string;
    text: string;
    timestamp: string;
  }[]>([]);

  useEffect(() => {
    const list = [
      { name: "Marie S.", city: "Frederiksberg", initials: "MS", text: "Vi har fået gjort rent fast hver 2. uge i næsten et år nu, og det er den bedste beslutning, vi har taget. Vores faste Zenmester leverer altid et fantastisk stykke arbejde." },
      { name: "Kasper D.", city: "København Ø", initials: "KD", text: "Fantastisk service! Det er utrolig nemt at booke, og lejligheden er skinnende ren hver gang." },
      { name: "Sofie L.", city: "Valby", initials: "SL", text: "Pålidelig og grundig rengøring. Rigtig rart med den samme faste rengøringsassistent hver gang." },
      { name: "Thomas M.", city: "København S", initials: "TM", text: "Super tilfreds. Rengøringen er i top, og fakturaen indeholder alt det nødvendige til at få servicefradrag nemt og hurtigt." },
      { name: "Nanna H.", city: "Gentofte", initials: "NH", text: "Renzen Klub er alle pengene værd. Dejligt at optjene kreditter, som vi kan bruge på havearbejde." },
      { name: "Morten B.", city: "Lyngby", initials: "MB", text: "Utrolig venlig Zenmester og meget grundig rengøring af både køkken og badeværelse. Kan varmt anbefales!" },
      { name: "Camilla K.", city: "København N", initials: "CK", text: "Hurtig booking og perfekt resultat. Dejligt at komme hjem til et rent og velduftende hjem." },
      { name: "Jonas V.", city: "Hvidovre", initials: "JV", text: "Vi har brugt Renzen i over 6 måneder nu. Altid stabile, fleksible og super professionelle." },
      { name: "Sarah T.", city: "Hellerup", initials: "ST", text: "Rigtig god vinduespudsning og rengøring. Kreditsystemet fungerer super godt." },
      { name: "Lars P.", city: "København NV", initials: "LP", text: "Professionel service til en fair pris. Deres tilfredshedsgaranti gør, at man kan føle sig helt tryg." }
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const withTimestamps = shuffled.map((item, index) => {
      let timeText = "";
      if (index === 0) {
        timeText = "ca. 49 min. siden";
      } else if (index === 1) {
        timeText = "I går";
      } else if (index < 7) {
        timeText = `${index} dage siden`;
      } else if (index < 9) {
        timeText = "1 uge siden";
      } else {
        timeText = "2 uger siden";
      }
      return { ...item, timestamp: timeText };
    });

    setShuffledTestimonials(withTimestamps);
  }, []);

  useEffect(() => {
    if (shuffledTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonialIdx((prev) => (prev + 1) % shuffledTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [shuffledTestimonials]);

  const renderTrustSection = () => {
    if (shuffledTestimonials.length === 0) return null;
    const current = shuffledTestimonials[currentTestimonialIdx];

    return (
      <div style={{ background: "transparent", border: "none", padding: "0 0 16px 0", marginBottom: "16px", textAlign: "left" }}>
        {/* Testimonial */}
        <div style={{ marginBottom: "12px", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#0f172a", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            Live anmeldelser
          </h4>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#e2f6ff",
              color: "#206d69",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.85rem",
              marginRight: "10px",
              flexShrink: 0
            }}>
              {current.initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <strong style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{current.name}</strong>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>· {current.timestamp}</span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{current.city}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#206d69">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <p style={{ margin: "0", fontSize: "0.75rem", color: "#475569", lineHeight: "1.4", minHeight: "50px" }}>
            {current.text}
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "12px 0" }} />

        {/* Insurance */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", marginBottom: "8px" }}>
            Bookingen beskyttes af <span style={{ fontWeight: 800, color: "#0a1931" }}>Ren</span><span style={{ fontWeight: 800, fontStyle: "italic", color: "#206d69" }}>Cover</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#e6f4f1" stroke="#206d69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14l-0.6-0.5c-2-1.8-3.4-3.1-3.4-4.7 0-1.3 1-2.3 2.3-2.3.7 0 1.4 0.3 1.7 0.9.3-0.6 1-0.9 1.7-0.9 1.3 0 2.3 1 2.3 2.3 0 1.6-1.4 2.9-3.4 4.7l-0.6 0.5z" fill="#206d69" />
            </svg>
            <div style={{ fontSize: "0.75rem", color: "#475569", lineHeight: "1.4" }}>
              Din rengøring er forsikret for <strong style={{ color: "#0f172a" }}>10.000.000 kr.</strong> <span style={{ textDecoration: "underline", fontWeight: 700, cursor: "pointer", color: "#0f172a" }}>Se detaljer</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDealTrustStrip = () => (
    <div className="l27-deal-trust-strip">
      <div className="l27-deal-trust-item">
        <strong>4,8</strong>
        <span>Kundevurdering</span>
      </div>
      <div className="l27-deal-trust-item">
        <strong>RenCover</strong>
        <span>10 mio. kr. forsikring</span>
      </div>
      <div className="l27-deal-trust-item">
        <strong>0 kr.</strong>
        <span>Trækkes i dag</span>
      </div>
    </div>
  );

  // Steps state
  const [currentStep, setCurrentStep] = useState(1);

  // Sync search parameters on client mount
  useEffect(() => {
    const m2Param = searchParams.get("m2");
    if (m2Param) {
      setM2(m2Param);
    }
    const freqParam = searchParams.get("frequency_id");
    if (freqParam) {
      setSelectedFreqId(freqParam);
    }
  }, [searchParams]);
  const [selectedExtras, setSelectedExtras] = useState<{ [id: string]: number }>({});
  const [clubSelected, setClubSelected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [planType, setPlanType] = useState<'annual' | 'monthly'>('annual');

  // Date and Time selection
  const [selectedDateStr, setSelectedDateStr] = useState(""); // YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startHour: number; startMinute: number; label: string } | null>(null);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // ISO Week number helper
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Generate Monday-Friday of the week based on weekOffset
  const quickSelectDates = React.useMemo(() => {
    const list = [];
    const today = new Date();
    const day = today.getDay();
    const isWeekend = day === 0 || day === 6;

    const baseDate = new Date(today);
    if (isWeekend) {
      const daysToNextMonday = day === 0 ? 1 : 2;
      baseDate.setDate(today.getDate() + daysToNextMonday);
    } else {
      const diff = today.getDate() - day + 1;
      baseDate.setDate(diff);
    }

    const monday = new Date(baseDate);
    
    // Add offset weeks
    monday.setDate(monday.getDate() + weekOffset * 7);

    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      list.push(d);
    }
    return list;
  }, [weekOffset]);

  // Auto-sync weekOffset when selectedDateStr changes
  useEffect(() => {
    if (!selectedDateStr) return;
    const selectedDate = new Date(selectedDateStr);
    if (isNaN(selectedDate.getTime())) return;
    
    const today = new Date();
    const day = today.getDay();
    const isWeekend = day === 0 || day === 6;

    const baseDate = new Date(today);
    if (isWeekend) {
      const daysToNextMonday = day === 0 ? 1 : 2;
      baseDate.setDate(today.getDate() + daysToNextMonday);
    } else {
      const diff = today.getDate() - day + 1;
      baseDate.setDate(diff);
    }

    const currentMonday = new Date(baseDate);
    currentMonday.setHours(0, 0, 0, 0);

    const selDay = selectedDate.getDay();
    const selDiff = selectedDate.getDate() - selDay + (selDay === 0 ? -6 : 1);
    const selectedMonday = new Date(selectedDate.setDate(selDiff));
    selectedMonday.setHours(0, 0, 0, 0);

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const diffWeeks = Math.round((selectedMonday.getTime() - currentMonday.getTime()) / msPerWeek);
    
    if (diffWeeks >= 0) {
      setWeekOffset(diffWeeks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr]);

  // Personal information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");

  // Stripe card (tokenized via Elements → Launch27)
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Promo code
  const [promoInput, setPromoInput] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoIsError, setPromoIsError] = useState(false);

  // Calendar and spots state
  const [viewDate, setViewDate] = useState(() => new Date());
  const [spotsCache, setSpotsCache] = useState<{ [date: string]: L27Spot[] }>({});
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);

  // Live Pricing API response state
  const [apiPricing, setApiPricing] = useState<{
    subtotal: number;
    discount: number;
    adminFee: number;
    clubFee: number;
    promoDiscount: number;
    fradrag: number;
    finalPrice: number;
  } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // UI state
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [entryMethod, setEntryMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [dealExtrasOpen, setDealExtrasOpen] = useState(false);

  const handleZipChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, "").substring(0, 4);
    setZip(cleanVal);
    if (cleanVal.length === 4) {
      setCity(CITY_MAP[cleanVal] || (isDealFlow ? "Storkøbenhavn" : ""));
    } else if (isDealFlow) {
      setCity("");
    }
  };

  // Parse postcode parameter or initialZip prop
  useEffect(() => {
    const activeZip = initialZip || postcodeParam;
    if (activeZip) {
      const trimmed = activeZip.trim();
      const match = trimmed.match(/^(\d{4})(?:\s+(.+))?$/);
      if (match) {
        setZip(match[1]);
        if (match[2]) {
          setCity(match[2]);
        } else {
          setCity(CITY_MAP[match[1]] || "");
        }
      } else {
        setZip(trimmed);
        setCity(CITY_MAP[trimmed] || "");
      }
    }
  }, [postcodeParam, initialZip]);

  // Auto-enforce clubSelected based on frequency type (Homeaglow model)
  useEffect(() => {
    const freq = FREQUENCIES.find((f) => f.id === selectedFreqId);
    if (freq) {
      if (freq.type === "recurring") {
        setClubSelected(true);
      } else {
        setClubSelected(false);
      }
    }
  }, [selectedFreqId]);

  // Pricing calculations fallback (local math if API config or response is missing)
  const m2Num = parseInt(m2, 10);
  const isM2Valid = !isNaN(m2Num) && m2Num >= 70 && m2Num <= 200;

  const localBaseCleaningPrice = isM2Valid ? listPriceKr(m2Num) : 0;
  const localExtrasPrice = Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
    if (qty <= 0) return sum;
    const extra = EXTRAS_LIST.find((e) => e.id === id);
    return sum + (extra ? extra.price * qty : 0);
  }, 0);

  const localSubtotal = localBaseCleaningPrice + localExtrasPrice;
  const activeFreq = FREQUENCIES.find((f) => f.id === selectedFreqId) || FREQUENCIES[1];
  const discountPercent = clubSelected ? activeFreq.discount : 0;
  const localFrequencyDiscountAmount = activeFreq.type === "oneoff" 
    ? 0 
    : Math.round(localBaseCleaningPrice * (discountPercent / 100));

  const adminFee = 5;
  const clubFee = clubSelected
    ? (currentStep < 3
        ? KLUB_MONTHLY_KR
        : (planType === 'annual' ? KLUB_ANNUAL_KR : KLUB_MONTHLY_KR))
    : 0;

  let localPromoDiscountAmount = 0;
  if (promoCode) {
    if (promoCode === "RENZEN10") {
      localPromoDiscountAmount = Math.round((localSubtotal - localFrequencyDiscountAmount) * 0.1);
    } else if (promoCode === "VELKOMMEN") {
      localPromoDiscountAmount = 50;
    }
  }

  const isFrequencySelected = selectedFreqId !== "";
  const isRecurring = isFrequencySelected && activeFreq.type === "recurring";
  const isOneOff = isFrequencySelected && activeFreq.type === "oneoff";
  const defaultIntroPrice = getPackageTierForM2(70).introPrice;
  let welcomePrice = defaultIntroPrice;
  if (isM2Valid) {
    welcomePrice = getPackageTierForM2(m2Num).introPrice;
  }

  // Today's actual billing price (gross) — Zen-kredit is earned separately, not deducted here.
  const localPriceBeforeFradrag = isM2Valid
    ? (isRecurring 
        ? Math.max(0, welcomePrice + localExtrasPrice + adminFee + clubFee - localPromoDiscountAmount)
        : Math.max(0, localSubtotal + adminFee + clubFee - localPromoDiscountAmount))
    : 0;

  const localDeductibleLabor = isM2Valid
    ? (isRecurring
        ? Math.max(0, welcomePrice + localExtrasPrice - localPromoDiscountAmount)
        : Math.max(0, localSubtotal - localPromoDiscountAmount))
    : 0;
  const localFradragAmount = Math.round(localDeductibleLabor * 0.26);
  const localFinalPrice = Math.max(0, localPriceBeforeFradrag - localFradragAmount);

  // Active pricing breakdown (prefers API data, falls back to local calculations)
  const subtotal = apiPricing ? apiPricing.subtotal : localSubtotal;
  const frequencyDiscountAmount = apiPricing ? apiPricing.discount : localFrequencyDiscountAmount;
  const promoDiscountAmount = apiPricing ? apiPricing.promoDiscount : localPromoDiscountAmount;
  
  // Billed today (includes welcome deal if recurring)
  const priceBeforeFradrag = isM2Valid
    ? (isRecurring
        ? Math.max(0, welcomePrice + localExtrasPrice + adminFee + clubFee - promoDiscountAmount)
        : Math.max(0, subtotal + adminFee + clubFee - promoDiscountAmount))
    : 0;

  const deductibleLabor = isM2Valid
    ? (isRecurring
        ? Math.max(0, welcomePrice + localExtrasPrice - promoDiscountAmount)
        : Math.max(0, subtotal - promoDiscountAmount))
    : 0;
  const fradragAmount = Math.round(deductibleLabor * 0.26);
  const finalPrice = Math.max(0, priceBeforeFradrag - fradragAmount);

  // Subsequent cleanings calculations (per visit, excluding club fee and one-time extras)
  const subsequentCleanPriceGross = isM2Valid
    ? (isRecurring
        ? Math.max(0, (subtotal - localExtrasPrice) - frequencyDiscountAmount - promoDiscountAmount)
        : 0)
    : 0;
  const subsequentCleanPriceNet = Math.max(0, subsequentCleanPriceGross - Math.round(subsequentCleanPriceGross * 0.26));
  const biweeklyPreviewPriceGross = isM2Valid ? Math.round(localBaseCleaningPrice * 0.85) : 0;
  const biweeklyPreviewPriceNet = Math.max(
    0,
    biweeklyPreviewPriceGross - Math.round(biweeklyPreviewPriceGross * 0.26)
  );
  const subsequentCleanSavings = isM2Valid && isRecurring
    ? Math.max(0, localBaseCleaningPrice - subsequentCleanPriceNet)
    : 0;

  // Savings is the difference between regular base price (gross) and welcome price (199), plus promo discounts.
  const savingsAmount = isRecurring && isM2Valid
    ? Math.max(0, (localBaseCleaningPrice - welcomePrice) + promoDiscountAmount)
    : promoDiscountAmount;

  const showFuturePayments = isRecurring || (clubSelected && planType === 'monthly');

  // Local date formatter to YYYY-MM-DD
  const toLocalYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  // 1. Fetch available calendar spots dynamically from Launch27 API
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
            days: 42,
          }),
        });
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const cache: { [date: string]: L27Spot[] } = {};
          resData.data.forEach((day: { date?: string; spots?: L27Spot[] }) => {
            if (day && day.date && Array.isArray(day.spots)) {
              cache[day.date] = day.spots;
            }
          });
          setSpotsCache(cache);
        }
      } catch (err) {
        console.error("Error fetching live spots from proxy:", err);
      } finally {
        setIsLoadingSpots(false);
      }
    };

    fetchLiveSpots();
  }, [viewDate]);

  const getFreeSpotsForDate = (dateStr: string) => {
    const spots = spotsCache[dateStr] || [];
    return spots.filter((s) => s.free && !s.past);
  };

  const hasFreeSpots = (dateStr: string) => {
    return getFreeSpotsForDate(dateStr).length > 0;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // 2. Fetch price estimates dynamically from Launch27 API
  useEffect(() => {
    const getLiveEstimate = async () => {
      if (!isM2Valid) {
        setApiPricing(null);
        return;
      }
      setIsEstimating(true);

      try {
        const dateStr = selectedDateStr
          ? `${selectedDateStr}T${selectedTimeSlot ? formatTime(selectedTimeSlot.startHour, selectedTimeSlot.startMinute) : "10:00"}:00`
          : `${toLocalYmd(new Date(Date.now() + 86400000))}T10:00:00`; // tomorrow 10:00

        const formatExtras = (isRecurring: boolean) => {
          const payload: { id: number; quantity: number; recurring: boolean }[] = [];
          Object.entries(selectedExtras).forEach(([id, qty]) => {
            if (qty <= 0) return;
            payload.push({
              id: parseInt(id, 10),
              quantity: qty,
              recurring: isRecurring,
            });
          });
          return payload;
        };

        const extrasBase = formatExtras(false);
        const extrasSelected = formatExtras(activeFreq.type === "recurring" && clubSelected);

        // Fetch One-Off Base Price (corresponds to subtotal/pris før rabat)
        const baseRes = await fetch("/api/l27", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "estimate",
            service_id: "213",
            pricing_param_id: "86",
            pricing_param_quantity: m2Num,
            frequency_id: "1", // Enkelt gang frequency_id
            service_date: dateStr,
            extras: extrasBase,
          }),
        });
        const baseData = await baseRes.json();

        // Fetch Selected Frequency Price (corresponds to active total price)
        const selRes = await fetch("/api/l27", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "estimate",
            service_id: "213",
            pricing_param_id: "86",
            pricing_param_quantity: m2Num,
            frequency_id: (activeFreq.type === "recurring" && !clubSelected) ? "1" : selectedFreqId,
            service_date: dateStr,
            extras: extrasSelected,
            discount_code: promoCode,
          }),
        });
        const selData = await selRes.json();

        if (baseData.success && selData.success) {
          const baseTotal = baseData.data.total || 0;
          const selectedTotal = selData.data.total || 0;

          const computedSubtotal = baseTotal;
          const computedDiscount = Math.max(0, baseTotal - selectedTotal);
          const computedPriceBeforeFradrag = selectedTotal;
          const computedFradrag = Math.round(computedPriceBeforeFradrag * 0.26);
          const computedFinalPrice = computedPriceBeforeFradrag - computedFradrag;

          setApiPricing({
            subtotal: computedSubtotal,
            discount: computedDiscount,
            adminFee,
            clubFee,
            promoDiscount: 0,
            fradrag: computedFradrag,
            finalPrice: computedFinalPrice,
          });
        } else {
          setApiPricing(null);
        }
      } catch (err) {
        console.error("Error fetching live price estimate:", err);
        setApiPricing(null);
      } finally {
        setIsEstimating(false);
      }
    };

    const timer = setTimeout(() => {
      getLiveEstimate();
    }, 400); // Debounce pricing updates

    return () => clearTimeout(timer);
  }, [m2, selectedFreqId, selectedExtras, clubSelected, promoCode, selectedDateStr, selectedTimeSlot]);

  // Spots parsing helpers
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

  const spotsToRender = selectedDateStr ? getFreeSpotsForDate(selectedDateStr) : [];
  const useMocks = spotsToRender.length === 0;

  // Mock slot data
  const mockAllDaySlot = { startHour: 8, startMinute: 0, label: "08:00 - 16:00" };
  const mockMorningSlots = [
    { startHour: 8, startMinute: 0, label: "08:00 - 10:00" },
    { startHour: 10, startMinute: 0, label: "10:00 - 12:00" },
  ];
  const mockAfternoonSlots = [
    { startHour: 12, startMinute: 0, label: "12:00 - 14:00" },
    { startHour: 14, startMinute: 0, label: "14:00 - 16:00" },
  ];

  // Live slots parsing
  let liveAllDaySlot: { startHour: number; startMinute: number; label: string } | null = null;
  const liveMorningSlots: Array<{ startHour: number; startMinute: number; label: string }> = [];
  const liveAfternoonSlots: Array<{ startHour: number; startMinute: number; label: string }> = [];

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



  // Extras click
  const handleExtraQtyChange = (id: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedExtras((prev) => {
      const current = prev[id] || 0;
      const nextQty = current + delta;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[id];
      } else {
        next[id] = nextQty;
      }
      return next;
    });
  };

  const handleExtraClick = (id: string) => {
    const extra = EXTRAS_LIST.find((e) => e.id === id);
    if (!extra) return;

    setSelectedExtras((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      } else {
        return { ...prev, [id]: 1 };
      }
    });
  };

  // Promo actions
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoIsError(false);
    setPromoMsg("");

    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoIsError(true);
      setPromoMsg("Indtast en rabatkode.");
      return;
    }

    if (code === "RENZEN10") {
      setPromoCode(code);
      setPromoMsg("Rabatkode RENZEN10 tilføjet (10% rabat).");
    } else if (code === "VELKOMMEN") {
      setPromoCode(code);
      setPromoMsg("Rabatkode VELKOMMEN tilføjet (50 kr. rabat).");
    } else {
      setPromoIsError(true);
      setPromoMsg("Ugyldig rabatkode.");
    }
  };

  const handlePromoRemove = () => {
    setPromoCode("");
    setPromoInput("");
    setPromoMsg("");
    setPromoIsError(false);
  };

  // Validation
  const isStep1Valid = () => {
    const hasAddress = isM2Valid && !!selectedFreqId && zip.length === 4 && address.trim().length > 0;
    if (isDealFlow) {
      return hasAddress && city.trim().length > 0;
    }
    return hasAddress && !!CITY_MAP[zip];
  };
  const isStep2Valid = () => !!selectedDateStr && !!selectedTimeSlot && !!entryMethod;
  const isStep3Valid = () => true;
  const isStep4Valid = () => {
    return (
      !!firstName.trim() &&
      !!lastName.trim() &&
      !!email.trim() &&
      !!phone.trim() &&
      cardComplete &&
      (!clubSelected || termsAccepted)
    );
  };

  const goStep = (step: number) => {
    const target = Math.max(1, Math.min(4, step));
    if (target === 2 && !isStep1Valid()) return;
    if (target === 3 && (!isStep1Valid() || !isStep2Valid())) return;
    if (target === 4 && (!isStep1Valid() || !isStep2Valid() || !isStep3Valid())) return;
    setCurrentStep(target);
    window.scrollTo(0, 0);
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

  // Booking submit to Launch27 API proxy
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    if (!isStep1Valid() || !isStep2Valid() || !isStep4Valid()) {
      const errorsList = [];
      if (!isM2Valid) {
        errorsList.push("Indtast boligstørrelse (min. 70 m² og maks. 200 m²).");
      }
      if (!selectedFreqId) {
        errorsList.push("Vælg en rengøringsfrekvens.");
      }
      if (zip.length !== 4 || !CITY_MAP[zip]) {
        errorsList.push("Indtast et gyldigt postnummer, som vi dækker (f.eks. 2100).");
      }
      if (!isStep2Valid()) {
        errorsList.push("Vælg dato, tidspunkt og adgangsmetode.");
      }
      
      const isDetailsFilled =
        !!firstName.trim() &&
        !!lastName.trim() &&
        !!email.trim() &&
        !!phone.trim() &&
        !!address.trim() &&
        !!zip.trim() &&
        !!city.trim() &&
        cardComplete;
      if (!isDetailsFilled) {
        errorsList.push("Udfyld alle kontaktoplysninger og betalingskort.");
      } else if (clubSelected && !termsAccepted) {
        errorsList.push("Du skal acceptere medlemsbetingelserne for Renzen Klub for at gennemføre bestillingen.");
      }
      
      setValidationErrors(errorsList);
      return;
    }

    setIsSubmitting(true);

    try {
      const stripeToken = await createStripeCardToken(stripe, elements);
      const dateStr = `${selectedDateStr}T${selectedTimeSlot ? formatTime(selectedTimeSlot.startHour, selectedTimeSlot.startMinute) : "10:00"}:00`;
      
      const formatExtras = (isRecurring: boolean) => {
        const payload: { id: number; quantity: number; recurring: boolean }[] = [];
        Object.entries(selectedExtras).forEach(([id, qty]) => {
          if (qty <= 0) return;
          payload.push({
            id: parseInt(id, 10),
            quantity: qty,
            recurring: isRecurring,
          });
        });
        return payload;
      };

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
          frequency_id: selectedFreqId,
          welcome_deal: activeFreq.type === "recurring",
          service_date: dateStr,
          arrival_window: selectedTimeSlot?.label === "08:00 - 16:00" ? 480 : 120,
          stripe_token: stripeToken,
          extras: formatExtras(activeFreq.type === "recurring" && clubSelected),
          discount_code: promoCode,
          service_id: "213",
          pricing_param_id: "86",
          pricing_param_quantity: m2Num,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data?.booking_id) {
        setBookingId(resData.data.booking_id);
        setIsBooked(true);
      } else {
        setValidationErrors([
          resData.message || "Der opstod en fejl under oprettelsen af din booking.",
        ]);
      }
    } catch (err) {
      console.error("Booking submission exception:", err);
      setValidationErrors([
        err instanceof Error
          ? err.message
          : "Forbindelsesfejl. Prøv venligst igen senere.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPriceDK = (amount: number) => {
    const hasFraction = amount % 1 !== 0;
    return amount.toLocaleString("da-DK", {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0
    }) + " kr";
  };

  const renderExtrasPills = () => (
    <div id="l27-extras-list" className="l27-extras-pills">
      {EXTRAS_LIST.map((extra) => {
        const isSelected = !!selectedExtras[extra.id];
        const qty = selectedExtras[extra.id] || 0;
        return (
          <div
            key={extra.id}
            className={`l27-extra-pill-btn ${isSelected ? "selected" : ""} ${extra.quantityBased ? "has-qty" : ""}`}
            onClick={() => handleExtraClick(extra.id)}
          >
            {renderExtraIcon(extra)}
            <span className="l27-extra-name">{extra.name}</span>
            <span className="l27-extra-price">+{formatPriceDK(extra.price)}</span>

            {extra.quantityBased && (
              <div
                className="l27-pill-qty"
                onClick={(e) => e.stopPropagation()}
                style={{ display: isSelected ? "flex" : "none" }}
              >
                <button
                  type="button"
                  className="l27-pill-qty-btn"
                  onClick={(e) => handleExtraQtyChange(extra.id, -1, e)}
                >
                  −
                </button>
                <span className="l27-pill-qty-val">{qty}</span>
                <button
                  type="button"
                  className="l27-pill-qty-btn"
                  onClick={(e) => handleExtraQtyChange(extra.id, 1, e)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (isBooked) {
    return (
      <div id="l27-booking-form-container">
        <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
        <div className="l27-main-content" style={{ maxWidth: "100%", flex: 1 }}>
          <div className="l27-success-message">
            <h2>Tak for din bestilling!</h2>
            <p>Vi har modtaget din booking (Ref: <strong>{bookingId}</strong>) og har sendt en bekræftelse til <strong>{email}</strong>.</p>
            <div style={{ marginTop: "30px", border: "1px solid #d6e2e1", borderRadius: "4px", padding: "20px", display: "inline-block", textAlign: "left", background: "#e1f2ef", color: "#111827" }}>
              <h4 style={{ fontWeight: 700, marginBottom: "10px" }}>Detaljer:</h4>
              <div style={{ marginBottom: "6px" }}><strong>Navn:</strong> {firstName} {lastName}</div>
              <div style={{ marginBottom: "6px" }}><strong>Adresse:</strong> {address}, {zip} {city}</div>
              <div style={{ marginBottom: "6px" }}><strong>Tid:</strong> {getFormattedDateDisplay(selectedDateStr)}</div>
              <div style={{ marginBottom: "6px" }}><strong>Frekvens:</strong> {activeFreq.name}</div>
              <div style={{ marginBottom: "6px" }}><strong>Størrelse:</strong> {m2} m²</div>
              <div style={{ borderTop: "1px dashed #d6e2e1", marginTop: "12px", paddingTop: "12px" }}>
                <div style={{ marginBottom: "4px" }}>
                  <strong>Betalt (inkl. moms):</strong> <span style={{ color: "#111827", fontWeight: 700 }}>{formatPriceDK(priceBeforeFradrag)} / gang</span>
                </div>
                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  <strong>Forventet pris efter servicefradrag:</strong> <span style={{ color: "#206d69", fontWeight: 700 }}>{formatPriceDK(finalPrice)} / gang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="l27-booking-wizard-wrapper" className={isDealFlow ? "l27-deal-flow" : undefined} style={{ width: "100%", textAlign: "left", fontFamily: 'var(--font-plus-jakarta-sans), "Plus Jakarta Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />



      <div id="l27-booking-form-container">

      {/* Mobile Summary Header (collapsible) */}
      <div className="l27-mobile-summary-header">
        <div className="l27-mobile-brand">
          <Image
            className="l27-mobile-logo"
            src="/renzen-logo-ny.png"
            alt="Renzen"
            width={140}
            height={35}
            priority
          />
        </div>
        <button
          type="button"
          className="l27-mobile-summary-toggle"
          id="l27-toggle-summary"
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
        >
          <span className="l27-mobile-summary-price" id="l27-mobile-price">
            {isM2Valid && isFrequencySelected ? (isEstimating ? "Beregner..." : `1. rengøring: ${formatPriceDK(priceBeforeFradrag)} (0 kr. i dag)`) : "- kr"}
          </span>
          <span className="l27-toggle-icon">{isMobileSummaryOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Mobile Summary Dropdown */}
      <div className={`l27-mobile-summary-dropdown ${isMobileSummaryOpen ? "open" : ""}`} style={{ maxHeight: isMobileSummaryOpen ? "85vh" : "0" }}>
        <div className="l27-mobile-summary-content">
          {isDealFlow ? renderDealTrustStrip() : renderTrustSection()}
          {/* Metadata Card (Date, Freq, Size) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Dato</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                {getFormattedDateDisplay(selectedDateStr) || "-"}
              </div>
            </div>
            <div style={{ textAlign: "center", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Frekvens</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px", lineHeight: "1.2" }}>
                {isFrequencySelected ? activeFreq.name.split(" - ")[0] : "-"}
                {isFrequencySelected && activeFreq.discount > 0 && (
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#16a34a", fontWeight: 600, marginTop: "2px" }}>
                    ({activeFreq.discount}% rabat)
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Størrelse</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                {isM2Valid ? `${m2} m²` : "-"}
              </div>
            </div>
          </div>

          {/* Extras / Tilvalg list */}
          {Object.entries(selectedExtras).length > 0 && (
            <div id="l27-summary-extras-wrap" style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Valgte tilvalg:</div>
              <div id="l27-summary-extras-list" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {Object.entries(selectedExtras).map(([id, qty]) => {
                  const extra = EXTRAS_LIST.find((e) => e.id === id);
                  if (!extra || qty <= 0) return null;
                  return (
                    <span key={id} style={{ background: "#f1f5f9", color: "#334155", fontSize: "0.75rem", fontWeight: 600, padding: "4px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px", border: "1px solid #e2e8f0" }}>
                      {extra.name} {qty > 1 ? `(×${qty})` : ""} <span style={{ color: "#64748b", fontWeight: 500 }}>+{formatPriceDK(extra.price * qty)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {isM2Valid && isFrequencySelected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              {/* Section 1: First Cleaning (Today's terms) */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    1. rengøring {isRecurring && "(Intropris)"}
                  </span>
                  {savingsAmount > 0 && (
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", padding: "2px 6px", borderRadius: "6px" }}>
                      Spar {formatPriceDK(savingsAmount)}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "#475569" }}>
                  {showPriceDetails && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px", marginBottom: "4px" }}>
                      {clubSelected ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Rengøring (standardpris):</span>
                            <span>{formatPriceDK(subtotal)}</span>
                          </div>
                          {isRecurring && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Intropris:</span>
                              <span>{formatPriceDK(welcomePrice)}</span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontStyle: "italic" }}>
                            <span>Zen kredit optjent:</span>
                            <span>{formatPriceDK(ZEN_CREDIT_MONTHLY_KR)}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{clubSelected ? "Din intropris:" : "Engangspris:"}</span>
                          <span>{formatPriceDK(subtotal)}</span>
                        </div>
                      )}
                      {localExtrasPrice > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Tilvalg (første rengøring):</span>
                          <span>+{formatPriceDK(localExtrasPrice)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Administrationsgebyr:</span>
                        <span>+{formatPriceDK(adminFee)}</span>
                      </div>
                      {clubSelected && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{currentStep < 3 ? "Renzen Klub (1. md):" : (planType === 'annual' ? "Renzen Klub (12 mdr.):" : "Renzen Klub (1. md):")}</span>
                          <span>+{formatPriceDK(clubFee)}</span>
                        </div>
                      )}
                      {promoCode && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#b45309", fontWeight: 600 }}>
                          <span>Rabatkode ({promoCode}):</span>
                          <span>-{formatPriceDK(promoDiscountAmount)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: 600 }}>
                        <span>Servicefradrag (26%):</span>
                        <span>-{formatPriceDK(fradragAmount)}</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderTop: "1px solid #e2e8f0", paddingTop: "8px", marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569" }}>
                      <span>Total:</span>
                      <span>{isEstimating ? "..." : formatPriceDK(priceBeforeFradrag)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>Total efter servicefradrag:</span>
                      <strong style={{ fontSize: "1.1rem", color: "#206d69", fontWeight: 900 }}>
                        {isEstimating ? "..." : formatPriceDK(finalPrice)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                    <button
                      type="button"
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#206d69",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 600,
                        textDecoration: "underline"
                      }}
                    >
                      {showPriceDetails ? "Skjul detaljer" : "Se detaljer"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease', transform: showPriceDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 0 kr today badge */}
                <div style={{ marginTop: "10px", fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🔒</span>
                  <span style={{ fontWeight: 700 }}>0 kr. trækkes i dag</span>
                </div>
              </div>

              {/* Section 2: Membership & Future visits */}
              {showFuturePayments && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Løbende aftale
                    </span>
                    {subsequentCleanSavings > 0 && (
                      <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: "6px" }}>
                        Spar {formatPriceDK(subsequentCleanSavings)} / gang
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "#475569" }}>
                    {clubSelected && planType !== 'annual' && (
                      <div style={{ background: "#ececec", borderRadius: "8px", padding: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, color: "#475569" }}>Klubmedlemskab:</span>
                          <strong style={{ color: "#475569" }}>{KLUB_MONTHLY_KR} kr./md.</strong>
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block", marginTop: "2px" }}>
                          Inkl. {activeFreq.discount}% rabat & digital wallet:
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", fontSize: "0.7rem", fontWeight: 700, color: "#475569" }}>
                          <span>💰</span>
                          <span>Zen kredit optjent denne måned (udløber månedligt)</span>
                        </div>
                      </div>
                    )}

                    {isRecurring && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>Rengøringspris efter rabat:</span>
                          <strong style={{ color: "#0f172a" }}>{formatPriceDK(subsequentCleanPriceGross)} / gang</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: "#166534", fontWeight: 700, marginTop: "2px" }}>
                          <span>Rengøringspris efter fradrag:</span>
                          <span>{formatPriceDK(subsequentCleanPriceNet)} / gang</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "0.85rem" }}>
              Indtast postnummer, m² og vælg frekvens for at se prisoversigt.
              <span id="l27-total-price-mobile" style={{ display: "none" }}>- kr</span>
            </div>
          )}
          {currentStep === 4 && (
            <>
              <div className="l27-promo-section" id="l27-promo-section-mobile" style={{ marginBlock: "8px" }}>
                {!showPromoInput && !promoCode ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    style={{ background: "none", border: "none", color: "#206d69", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                  >
                    Har du en rabatkode?
                  </button>
                ) : (
                  <>
                    <div className="l27-promo-title" style={{ fontSize: "0.85rem", fontWeight: 700 }}>Rabatkode</div>
                    <div className="l27-promo-controls">
                      <input
                        type="text"
                        id="l27-promo-input-mobile"
                        className="l27-promo-input"
                        placeholder="Indtast kode"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={!!promoCode}
                      />
                      <button
                        type="button"
                        id="l27-promo-btn-mobile"
                        className={`l27-promo-btn ${promoCode ? "is-remove" : ""}`}
                        onClick={promoCode ? handlePromoRemove : handlePromoSubmit}
                      >
                        {promoCode ? "Fjern" : "Tilføj"}
                      </button>
                    </div>
                    {promoMsg && (
                      <div id="l27-promo-msg-mobile" className={`l27-promo-msg ${promoIsError ? "is-error" : ""}`}>
                        {promoMsg}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Column Wrapper */}
      <div className="l27-main-column">
        {/* Progress bar only (no step tabs) */}
        {isDealFlow ? (
          <div className="l27-deal-steps" aria-label="Bookingtrin">
            {DEAL_WIZARD_STEPS.map((label, index) => {
              const stepNumber = index + 1;
              const state =
                currentStep > stepNumber
                  ? "completed"
                  : currentStep === stepNumber
                    ? "active"
                    : "upcoming";
              return (
                <div key={label} className={`l27-deal-step l27-deal-step--${state}`}>
                  <span className="l27-deal-step-number">
                    {String(stepNumber).padStart(2, "0")}
                  </span>
                  <span className="l27-deal-step-label">{label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="l27-steps-header" style={{ marginBottom: 0 }}>
            <div className="l27-steps-indicator-bar">
              <div
                className="l27-steps-indicator-fill"
                style={{
                  width: `${
                    currentStep === 1
                      ? 25
                      : currentStep === 2
                      ? 50
                      : currentStep === 3
                      ? 75
                      : 100
                  }%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Step title and description */}
        <div
          className={
            isDealFlow
              ? "l27-step-intro l27-step-intro--deal"
              : variant === "editorial"
                ? "l27-step-intro l27-step-intro--editorial"
                : "l27-step-intro"
          }
          style={{ padding: "24px 0 8px" }}
        >
          <h2
            style={{
              fontSize: isDealFlow ? "1.75rem" : "1.5rem",
              fontWeight: 800,
              color: isDealFlow || variant === "editorial" ? "#173c2c" : "#1e293b",
              margin: "0 0 8px 0",
              fontFamily: isDealFlow
                ? 'var(--font-bricolage-grotesque), "Bricolage Grotesque", sans-serif'
                : undefined,
            }}
          >
            {STEP_COPY[stepCopyVariant][currentStep as 1 | 2 | 3 | 4].title}
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: isDealFlow || variant === "editorial" ? "#69746c" : "#64748b",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: isDealFlow ? "42rem" : undefined,
            }}
          >
            {STEP_COPY[stepCopyVariant][currentStep as 1 | 2 | 3 | 4].description}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="l27-main-content">


        <form onSubmit={handleFormSubmit} id="l27-booking-form">


          {/* Error messages */}
          {validationErrors.length > 0 && (
            <div id="l27-message">
              <div className="error">
                {validationErrors.map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Dit hjem */}
          {currentStep === 1 && (
            <div className="l27-step">
              {isDealFlow && (
                <div className="l27-deal-locked-offer">
                  <div className="l27-deal-locked-item">
                    <span className="l27-deal-locked-label">Bolig</span>
                    <strong>{dealPackageLabel || `${m2} m²`}</strong>
                  </div>
                  <div className="l27-deal-locked-item">
                    <span className="l27-deal-locked-label">Intropris</span>
                    <strong>{dealIntroPrice ?? welcomePrice} kr.</strong>
                  </div>
                  <div className="l27-deal-locked-item">
                    <span className="l27-deal-locked-label">Aftale</span>
                    <strong>Hver 2. uge · Renzen Klub</strong>
                  </div>
                </div>
              )}

              <div className={`l27-form-section ${isDealFlow ? "l27-deal-address-form" : ""}`}>
                {!isDealFlow && (
                <div className="l27-field-group">
                  <label htmlFor="l27-m2-input" style={{ fontWeight: 700 }}>Areal</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      id="l27-m2-input"
                      min="70"
                      max="200"
                      placeholder="Indtast antal m²"
                      value={m2}
                      onChange={(e) => setM2(e.target.value)}
                      required
                      style={{ paddingRight: "48px" }}
                    />
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500, pointerEvents: "none" }}>m2</span>
                  </div>
                </div>
                )}
                <div className="l27-field-group">
                  <label htmlFor="l27-address-step1" style={{ fontWeight: 700 }}>
                    {isDealFlow ? "Adresse" : "Tilføj adresse"}
                  </label>
                  <input
                    type="text"
                    id="l27-address-step1"
                    placeholder="Gade og husnummer"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="l27-field-row">
                  <div className="l27-field-group">
                    <label htmlFor="l27-postnummer-input" style={{ fontWeight: 700 }}>Postnummer*</label>
                    <input
                      type="text"
                      id="l27-postnummer-input"
                      placeholder="f.eks. 2100"
                      value={zip}
                      onChange={(e) => handleZipChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="l27-field-group">
                    <label htmlFor="l27-city-step1" style={{ fontWeight: 700 }}>By</label>
                    <input
                      type="text"
                      id="l27-city-step1"
                      value={city}
                      readOnly
                      placeholder="Udfyldes automatisk"
                      style={{ background: isDealFlow ? "#edf2ea" : "#f8fafc" }}
                    />
                  </div>
                </div>
                {zip.length === 4 && city && (
                  <div className="l27-postcode-badge">
                    <span className="l27-postcode-badge-icon">✓</span> Vi dækker dit område {city && `(${city})`}
                  </div>
                )}
              </div>

              {!isDealFlow && (
              <>
              <div className="l27-form-section">
                <h2>Hvor ofte?</h2>
                <div className="l27-frequency-selector">
                  {/* Recurring Card */}
                  <div
                    className={`l27-frequency-type-card l27-recurring-card ${isRecurring ? "active" : ""}`}
                    onClick={() => {
                      if (!isRecurring) {
                        setSelectedFreqId(lastRecurringFreqId);
                      }
                    }}
                  >
                    <span className="l27-best-badge">Populær</span>
                    <div className="l27-frequency-type-header">
                      <div className="l27-frequency-type-title" style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start", textAlign: "left" }}>
                        <label style={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: 700 }}>Tilbagevendende rengøring</label>
                        <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                          Fra {welcomePrice} kr. første gang • Derefter ca. {isM2Valid ? formatPriceDK(isRecurring ? subsequentCleanPriceNet : biweeklyPreviewPriceNet) : "595 kr."} efter rabat og fradrag
                        </span>
                      </div>
                      <span className="l27-frequency-type-price">
                        {isM2Valid ? formatPriceDK(welcomePrice) : "- kr"}
                      </span>
                    </div>

                    <div className="l27-frequency-benefits">
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Den rene følelse på repeat</span>
                        <span className="l27-benefit-desc">Få en 5-stjernet rengøring på samme tid hver uge eller hver anden uge.</span>
                      </div>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Behold din foretrukne rengøringsassistent</span>
                        <span className="l27-benefit-desc">Få den samme dygtige rengøringsassistent hver gang.</span>
                      </div>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Renzen Klub medlemskab</span>
                        <span className="l27-benefit-desc">
                          {planType === 'annual'
                            ? `${KLUB_ANNUAL_KR} kr. for 12 mdr. (= ${KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md.)`
                            : `${KLUB_MONTHLY_KR} kr./md. · min. ${KLUB_MONTHLY_MIN_MONTHS} betalte mdr.`}{' '}
                          Optjen {zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter pr. medlemsår. Se opsigelsesvilkår.
                        </span>
                      </div>
                    </div>

                    {/* Recurring frequency options (2 columns) */}
                    <div className="l27-frequency-options l27-frequency-grid">
                      {FREQUENCIES.filter(f => f.type === "recurring").map((freq) => {
                        const isSelected = selectedFreqId === freq.id;
                        const nameParts = freq.name.split(" - ");
                        const displayName = nameParts[0];
                        return (
                          <label
                            key={freq.id}
                            className={`l27-freq-option ${isSelected ? "selected" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFreqId(freq.id);
                            }}
                          >
                            <input
                              type="radio"
                              name="frequency_id"
                              value={freq.id}
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span className="l27-freq-option-text">
                              {displayName}{freq.discount > 0 ? ` - ${freq.discount}% rabat` : ""}
                            </span>
                            <span className="l27-freq-discount">Velkomstpris: {welcomePrice} kr.</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {isRecurring && clubSelected && (
                    <div className="l27-wallet-success-banner" style={{ marginTop: "12px", marginBottom: "12px", background: "#ececec", border: "none", padding: "8px 12px", borderRadius: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "1.2rem" }}>🎉</span>
                      <div>
                        <h4 style={{ margin: "0 0 2px 0", color: "#272727", fontSize: "0.85rem", fontWeight: 600 }}>Du har valgt Renzen Klub!</h4>
                        <p style={{ margin: 0, color: "#272727", fontSize: "0.8rem", lineHeight: "1.3" }}>
                          De første <strong>{ZEN_CREDIT_MONTHLY_KR} kr.</strong> bruges på denne rengøring. Derefter optjener du {zenCreditRemainingMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. over de næste {zenCreditRemainingMonths} aktive medlemsmåneder — i alt {ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. pr. medlemsår. Hver kredit udløber ved månedens udgang.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* One-off Card */}
                  <div
                    className={`l27-frequency-type-card l27-oneoff-card ${isOneOff ? "active" : ""}`}
                    onClick={() => {
                      if (!isOneOff) {
                        setSelectedFreqId("1"); // One-off ID
                      }
                    }}
                  >
                    <div className="l27-frequency-type-header">
                      <div className="l27-frequency-type-title">
                        <label style={{ cursor: "pointer" }}>Enkelt rengøring</label>
                      </div>
                      <span className="l27-frequency-type-price" id="l27-oneoff-price">
                        {isM2Valid ? formatPriceDK(localSubtotal + adminFee) : "- kr"}
                      </span>
                    </div>

                    <div className="l27-frequency-benefits">
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Perfekt til dybderengøring</span>
                        <span className="l27-benefit-desc">Ideel til større rengøringer der kræver ekstra tid.</span>
                      </div>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Rengøring på efterspørgsel</span>
                        <span className="l27-benefit-desc">Få en rengøring når det passer dig.</span>
                      </div>
                    </div>

                    <div className="l27-frequency-options">
                      {FREQUENCIES.filter(f => f.type === "oneoff").map((freq) => {
                        const isSelected = selectedFreqId === freq.id;
                        return (
                          <label
                            key={freq.id}
                            className={`l27-freq-option ${isSelected ? "selected" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFreqId(freq.id);
                            }}
                          >
                            <input
                              type="radio"
                              name="frequency_id"
                              value={freq.id}
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span className="l27-freq-option-text">Engangsrengøring</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extras Section */}
              <div className="l27-form-section" id="l27-extras-section">
                <h2>Tilvalg</h2>
                <p className="l27-section-subtitle">Vælg ekstra ydelser til din rengøring.</p>
                <br />

                {!isRecurring && (
                  <div
                    className={`l27-frequency-type-card l27-club-card ${clubSelected ? "active" : ""}`}
                    id="l27-club-card"
                    style={{ display: "block", marginBottom: "24px", textAlign: "left" }}
                    onClick={() => setClubSelected(!clubSelected)}
                  >
                    <div className="l27-frequency-type-header">
                      <div className="l27-frequency-type-title" style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start", textAlign: "left" }}>
                        <label style={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: 700 }}>Renzen Klub medlemskab</label>
                        <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                          Lås op for rabatter og optjen {zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i kreditter pr. medlemsår.
                        </span>
                      </div>
                      <span className="l27-frequency-type-price" style={{ color: "#206d69" }}>
                        {planType === 'annual' ? `${KLUB_ANNUAL_KR} kr./år` : `${KLUB_MONTHLY_KR} kr./md.`}
                      </span>
                    </div>

                    {planType === 'annual' && clubSelected && (
                      <div style={{ fontSize: "0.78rem", color: "#206d69", fontWeight: 600, marginTop: "4px", textAlign: "left" }}>
                        = {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md. · Spar {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} kr.
                      </div>
                    )}

                    {clubSelected && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "12px", marginBottom: "4px" }}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPlanType('annual'); }} style={{ padding: "5px 12px", borderRadius: "20px", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", background: planType === 'annual' ? '#206d69' : '#f1f5f9', color: planType === 'annual' ? '#fff' : '#475569', transition: "all 0.2s ease" }}>Årlig (anbefalet)</button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPlanType('monthly'); }} style={{ padding: "5px 12px", borderRadius: "20px", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", background: planType === 'monthly' ? '#206d69' : '#f1f5f9', color: planType === 'monthly' ? '#fff' : '#475569', transition: "all 0.2s ease" }}>Månedlig</button>
                      </div>
                    )}

                    <div className="l27-frequency-benefits" style={{ marginTop: "16px", marginBottom: "16px" }}>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Lås op for dine faste rabatter</span>
                        <span className="l27-benefit-desc">Spar 15% på hver 2. uge, 20% hver uge.</span>
                      </div>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">{zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter</span>
                        <span className="l27-benefit-desc">Optjen én kredit i medlemsmåned 1-10 — fra md. 4 også til udvalgte tilvalg. (Brug el. tab).</span>
                      </div>
                      <div className="l27-benefit-item">
                        <span className="l27-benefit-title">Ingen binding efter 6 mdr.</span>
                        <span className="l27-benefit-desc">Opsig når som helst. 14 dages fortrydelsesret.</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="l27-club-toggle"
                      id="l27-club-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClubSelected(!clubSelected);
                      }}
                    >
                      {clubSelected ? "Fjern medlemskab" : "Tilmeld mig Renzen Klub"}
                    </button>
                  </div>
                )}

                {/* Visual extras original pill/card grid */}
                {renderExtrasPills()}
              </div>
              </>
              )}


            </div>
          )}

          {/* STEP 2: Vælg tid */}
          {currentStep === 2 && (
            <div className="l27-step">
              <div className="l27-form-section">
                {!isDealFlow && <h2>Hvornår skal vi komme?</h2>}
                <div className="l27-scheduling-container">
                  <div className="l27-calendar-container" style={{ display: "block", width: "100%" }}>
                    {/* Week Selector Header */}
                    {(() => {
                      const monday = quickSelectDates[0];
                      if (!monday) return null;
                      const capitalizedMonth = monday.toLocaleDateString("da-DK", { month: "long" }).replace(/^\w/, (c) => c.toUpperCase());
                      const year = monday.getFullYear();
                      const weekNumber = getWeekNumber(monday);
                      const weekText = weekOffset === 0 ? "denne uge" : weekOffset === 1 ? "næste uge" : `uge ${weekNumber}`;
                      
                      return (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontFamily: 'var(--font-plus-jakarta-sans), "Plus Jakarta Sans", sans-serif' }}>
                          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#206d69" }}>
                            {capitalizedMonth} {year}, {weekText}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {weekOffset > 0 && (
                              <button
                                type="button"
                                onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                                style={{ background: "none", border: "none", color: "#475569", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                              >
                                <span>&lt; Forrige</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setWeekOffset(prev => prev + 1)}
                              style={{ background: "none", border: "none", color: "#206d69", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              <span>Næste uge</span>
                              <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "50%", border: "1.5px solid #206d69", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#206d69" }}>&gt;</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

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
                              setSelectedTimeSlot(null); // Reset selected slot
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
                                        setSelectedTimeSlot(null); // Reset selected slot
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

                  <div className="l27-field-group">
                    <label id="l27-times-label">
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
                        <div className="l27-time-groups" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", background: "#ffffff", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          {/* Header */}
                          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", alignItems: "center", borderBottom: "2px solid #cbd5e1", paddingBottom: "10px", fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>
                            <div style={{ textAlign: "left" }}>
                              {selectedDateStr ? getFormattedDateDisplay(selectedDateStr) : "Tid"}
                            </div>
                            <div style={{ textAlign: "center" }}>Normalpris</div>
                            <div style={{ textAlign: "center", color: "#206d69", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <span>Renzen Klub</span>
                              <span style={{ fontSize: "0.75rem", cursor: "pointer", color: "#64748b" }} title={`Medlemmer sparer 15-20% på løbende rengøring og optjener ${zenCreditAnnualMonths} × ${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter pr. medlemsår`}>ⓘ</span>
                            </div>
                          </div>

                          {/* Fleksibel tid Row (All day slot) */}
                          {(() => {
                            const allDaySlot = useMocks ? mockAllDaySlot : liveAllDaySlot;
                            if (!allDaySlot) return null;
                            const isSelectedNormal = selectedTimeSlot?.label === allDaySlot.label && !clubSelected;
                            const isSelectedKlub = selectedTimeSlot?.label === allDaySlot.label && clubSelected;

                            return (
                              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9", gap: "10px" }}>
                                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Fleksibel tid</span>
                                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{allDaySlot.label}</span>
                                  <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: "0.65rem", background: "#ffe4e6", color: "#be123c", padding: "2px 6px", borderRadius: "4px", marginTop: "4px", fontWeight: 700 }}>
                                    bedste chance for ledig tid
                                  </span>
                                </div>
                                
                                {/* Normalpris Column */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTimeSlot(allDaySlot);
                                      setSelectedFreqId("1"); // One-off
                                      setClubSelected(false);
                                    }}
                                    style={{
                                      width: "100%",
                                      padding: "12px 6px",
                                      borderRadius: "8px",
                                      border: "1px solid #cbd5e1",
                                      background: isSelectedNormal ? "#206d69" : "#ffffff",
                                      color: isSelectedNormal ? "#ffffff" : "#0f172a",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                      cursor: "pointer",
                                      transition: "all 0.15s ease",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    <span>{formatPriceDK(subtotal)}</span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 500, color: isSelectedNormal ? "#e2e8f0" : "#64748b", marginTop: "2px" }}>Engangs</span>
                                  </button>
                                </div>

                                {/* Renzen Klub Column */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTimeSlot(allDaySlot);
                                      if (selectedFreqId === "1") {
                                        setSelectedFreqId(lastRecurringFreqId);
                                      }
                                      setClubSelected(true);
                                    }}
                                    style={{
                                      width: "100%",
                                      padding: "12px 6px",
                                      borderRadius: "8px",
                                      border: isSelectedKlub ? "2px solid #206d69" : "1.5px solid #206d69",
                                      background: isSelectedKlub ? "#206d69" : "#f0fdfa",
                                      color: isSelectedKlub ? "#ffffff" : "#206d69",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                      cursor: "pointer",
                                      transition: "all 0.15s ease",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    <span>{welcomePrice} kr.</span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 500, color: isSelectedKlub ? "#a7f3d0" : "#0f766e", marginTop: "2px" }}>
                                      + optjen {ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR.toLocaleString("da-DK")} kr.
                                    </span>
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Specific Time Slots */}
                          {(() => {
                            const specificSlots = [
                              ...(useMocks ? mockMorningSlots : liveMorningSlots),
                              ...(useMocks ? mockAfternoonSlots : liveAfternoonSlots)
                            ];
                            specificSlots.sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));

                            if (specificSlots.length === 0) {
                              return <p style={{ fontSize: "0.85rem", color: "#64748b", textAlign: "center", margin: "10px 0" }}>Ingen ledige tider på denne dato</p>;
                            }

                            return specificSlots.map((slot, idx) => {
                              const isSelectedNormal = selectedTimeSlot?.label === slot.label && !clubSelected;
                              const isSelectedKlub = selectedTimeSlot?.label === slot.label && clubSelected;

                              return (
                                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", alignItems: "center", padding: "12px 0", borderBottom: idx === specificSlots.length - 1 ? "none" : "1px solid #f1f5f9", gap: "10px" }}>
                                  <div style={{ textAlign: "left", fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>
                                    {slot.label.split(" - ")[0]}
                                  </div>

                                  {/* Normalpris Column */}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTimeSlot(slot);
                                        setSelectedFreqId("1"); // One-off
                                        setClubSelected(false);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "12px 6px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        background: isSelectedNormal ? "#206d69" : "#ffffff",
                                        color: isSelectedNormal ? "#ffffff" : "#0f172a",
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <span>{formatPriceDK(subtotal)}</span>
                                      <span style={{ fontSize: "0.65rem", fontWeight: 500, color: isSelectedNormal ? "#e2e8f0" : "#64748b", marginTop: "2px" }}>Engangs</span>
                                    </button>
                                  </div>

                                  {/* Renzen Klub Column */}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTimeSlot(slot);
                                        if (selectedFreqId === "1") {
                                          setSelectedFreqId(lastRecurringFreqId);
                                        }
                                        setClubSelected(true);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "12px 6px",
                                        borderRadius: "8px",
                                        border: isSelectedKlub ? "2px solid #206d69" : "1.5px solid #206d69",
                                        background: isSelectedKlub ? "#206d69" : "#f0fdfa",
                                        color: isSelectedKlub ? "#ffffff" : "#206d69",
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <span>{welcomePrice} kr.</span>
                                      <span style={{ fontSize: "0.65rem", fontWeight: 500, color: isSelectedKlub ? "#a7f3d0" : "#0f766e", marginTop: "2px" }}>
                                        + optjen {ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR.toLocaleString("da-DK")} kr.
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              );
                            });
                          })()}
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
                </div>

                {/* Custom Fields (Housekeep field mockup) */}
                <div className="l27-custom-fields" style={{ marginTop: "36px" }}>
                  <div className="l27-field-group l27-custom-field" data-field-mode="options" style={{ textAlign: "left" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 24px 0", color: "#272727", lineHeight: 1.2, textAlign: "left" }}>Hvordan kommer vi ind?</h2>
                    <div className="l27-custom-options">
                      {["Jeg er hjemme", "Nøglen ligger i postkasse", "Nøgleboks kode medsendes"].map((opt) => {
                        const isSelected = entryMethod === opt;
                        return (
                          <label
                            key={opt}
                            className={`l27-custom-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => setEntryMethod(opt)}
                          >
                            <input
                              type="radio"
                              name="entry_method"
                              value={opt}
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {isDealFlow && (
                <div className="l27-deal-extras-accordion">
                  <button
                    type="button"
                    className="l27-deal-extras-toggle"
                    onClick={() => setDealExtrasOpen((open) => !open)}
                    aria-expanded={dealExtrasOpen}
                  >
                    <span>Tilføj tilvalg (valgfrit)</span>
                    <span className="l27-deal-extras-toggle-icon">{dealExtrasOpen ? "−" : "+"}</span>
                  </button>
                  {dealExtrasOpen && (
                    <div className="l27-deal-extras-panel">
                      <p className="l27-deal-extras-copy">
                        Ekstra ydelser tilføjes kun til din første rengøring.
                      </p>
                      {renderExtrasPills()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Aktiver medlemskab / Renzen Klub details */}
          {currentStep === 3 && (
            <div className="l27-step">
              <div className="l27-form-section">
                {isRecurring ? (
                  <>
                    <h2>Vælg din medlemsplan</h2>
                    <p className="l27-section-subtitle" style={{ marginBottom: "20px" }}>
                      Årsplanen er mest valgt — samme fordele til {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md. og du sparer {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} kr. om året.
                    </p>

                    {/* Annual / Monthly toggle cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      {/* Annual card */}
                      <div
                        onClick={() => setPlanType('annual')}
                        style={{
                          position: "relative",
                          border: planType === 'annual' ? "2.5px solid #206d69" : "1.5px solid #d1d5db",
                          borderRadius: "16px",
                          padding: "18px 14px",
                          cursor: "pointer",
                          background: planType === 'annual' ? "#fff" : "#fafafa",
                          boxShadow: planType === 'annual' ? "0 4px 20px rgba(32,109,105,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ position: "absolute", top: "-10px", right: "10px", background: "#206d69", color: "#fff", fontSize: "0.65rem", fontWeight: 800, padding: "3px 8px", borderRadius: "8px", letterSpacing: "0.04em" }}>MEST VALGT · SPAR {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} KR.</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", marginTop: "4px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111827" }}>Årligt (Prepaid)</span>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2.5px solid ${planType === 'annual' ? '#206d69' : '#94a3b8'}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {planType === 'annual' && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#206d69" }} />}
                          </div>
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 950, color: "#206d69", marginBottom: "2px" }}>{KLUB_ANNUAL_KR} kr./år</div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginBottom: "6px" }}>= kun {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md. · betales for 12 mdr.</div>
                        <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: "6px" }}>Spar {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} kr. om året</div>
                      </div>

                      {/* Monthly card */}
                      <div
                        onClick={() => setPlanType('monthly')}
                        style={{
                          border: planType === 'monthly' ? "2.5px solid #206d69" : "1.5px solid #d1d5db",
                          borderRadius: "16px",
                          padding: "18px 14px",
                          cursor: "pointer",
                          background: planType === 'monthly' ? "#fff" : "#fafafa",
                          boxShadow: planType === 'monthly' ? "0 4px 20px rgba(32,109,105,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", marginTop: "4px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111827" }}>Månedlig</span>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2.5px solid ${planType === 'monthly' ? '#206d69' : '#94a3b8'}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {planType === 'monthly' && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#206d69" }} />}
                          </div>
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 950, color: "#206d69", marginBottom: "2px" }}>{KLUB_MONTHLY_KR} kr./md.</div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginBottom: "6px" }}>Minimum {KLUB_MONTHLY_MIN_MONTHS} betalte måneder</div>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>(I alt {(KLUB_MONTHLY_KR * 12).toLocaleString("da-DK")} kr. om året)</div>
                      </div>
                    </div>

                    {/* Compact benefits */}
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "18px", textAlign: "left" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111827", marginBottom: "12px" }}>Dit medlemskab inkluderer:</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "#374151" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: "#206d69", fontWeight: 800, lineHeight: 1.2 }}>✓</span>
                          <div><strong>Op til 20% rabat</strong> på rengøring — 20% ugentlig, 15% hver 2. uge</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: "#206d69", fontWeight: 800, lineHeight: 1.2 }}>✓</span>
                          <div><strong>{zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter pr. medlemsår</strong> — måned 1-{zenCreditAnnualMonths} til udvalgte boligservices.</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: "#206d69", fontWeight: 800, lineHeight: 1.2 }}>✓</span>
                          <div><strong>Fra måned 4:</strong> kreditter kan også bruges på tilvalg</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: "#206d69", fontWeight: 800, lineHeight: 1.2 }}>✓</span>
                          <div><strong>14 dages fortrydelsesret</strong> — efter gældende regler for onlinebestilling</div>
                        </div>
                      </div>


                      {/* Wallet visual */}
                      <div style={{ marginTop: "16px", padding: "14px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                          <span style={{ fontSize: "1.1rem" }}>💰</span>
                          <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#166534" }}>Din Zen Wallet</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                              <span style={{ fontSize: "0.58rem", color: "#6b7280", fontWeight: 500 }}>Md. {i + 1}</span>
                              <div style={{ width: "100%", height: "6px", borderRadius: "3px", background: `linear-gradient(90deg, #206d69, #2a9d8f)`, opacity: 0.5 + (i * 0.05) }} />
                              <span style={{ fontSize: "0.6rem", color: "#15803d", fontWeight: 600 }}>+300</span>
                            </div>
                          ))}
                        </div>
                        <hr style={{ border: "none", borderTop: "1px dashed #bbf7d0", margin: "8px 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "10px" }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <div key={i + 5} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                              <span style={{ fontSize: "0.58rem", color: "#6b7280", fontWeight: 500 }}>Md. {i + 6}</span>
                              <div style={{ width: "100%", height: "6px", borderRadius: "3px", background: `linear-gradient(90deg, #206d69, #2a9d8f)`, opacity: 0.75 + (i * 0.05) }} />
                              <span style={{ fontSize: "0.6rem", color: "#15803d", fontWeight: 600 }}>+300</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#166534" }}>{ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. over {zenCreditAnnualMonths} mdr.</span>
                          <span style={{ fontSize: "0.68rem", color: "#15803d" }}>{ZEN_CREDIT_SERVICES_COMPACT}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "10px", fontSize: "0.73rem", color: "#6b7280", lineHeight: 1.5 }}>
                      💡 {planType === 'annual'
                        ? 'Årsplanen betales for 12 måneder. Kreditter optjenes i medlemsmåned 1-10.'
                        : 'Månedsplanen har minimum 6 betalte måneder. Kreditter optjenes i medlemsmåned 1-10.'}{' '}
                      Ved tidlig opsigelse kan introrengøringen blive efterfaktureret til normalpris.
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Få rabat med Renzen Klub!</h2>
                    <p className="l27-section-subtitle" style={{ marginBottom: "20px" }}>
                      Tilmeld dig Renzen Klub i dag og spar penge på din første rengøring samt få løbende fordele på alle dine boligopgaver.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                      {/* Membership Upsell Option */}
                      <div
                        onClick={() => {
                          setSelectedFreqId(lastRecurringFreqId);
                          setClubSelected(true);
                        }}
                        style={{
                          background: clubSelected ? "#e1f2ef" : "#fff",
                          border: clubSelected ? "2px solid #206d69" : "2px solid #e2e8f0",
                          borderRadius: "18px",
                          padding: "20px",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: clubSelected ? "0 8px 30px rgba(32, 109, 105, 0.05)" : "none",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Tilmeld mig Renzen Klub</span>
                          <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#206d69" }}>{planType === 'annual' ? `${KLUB_ANNUAL_KR} kr./år` : `${KLUB_MONTHLY_KR} kr./md.`}</span>
                        </div>
                        {planType === 'annual' ? (
                          <div style={{ fontSize: "0.78rem", color: "#206d69", fontWeight: 600, marginBottom: "8px" }}>= {KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md. · Spar {KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR.toLocaleString("da-DK")} kr.</div>
                        ) : (
                          <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 600, marginBottom: "8px" }}>6 mdr. minimum binding</div>
                        )}
                        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setPlanType('annual'); }} style={{ padding: "5px 12px", borderRadius: "20px", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", background: planType === 'annual' ? '#206d69' : '#f1f5f9', color: planType === 'annual' ? '#fff' : '#475569', transition: "all 0.2s ease" }}>Årlig (anbefalet)</button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setPlanType('monthly'); }} style={{ padding: "5px 12px", borderRadius: "20px", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", background: planType === 'monthly' ? '#206d69' : '#f1f5f9', color: planType === 'monthly' ? '#fff' : '#475569', transition: "all 0.2s ease" }}>Månedlig</button>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 12px 0" }}>
                          Aktiverer velkomstpris på denne rengøring og giver løbende fordele.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#374151" }}>
                           <div>✓ <strong>Spar over 50%</strong> på denne rengøring (kun {welcomePrice} kr. intropris)</div>
                          <div>✓ <strong>{zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter</strong> pr. medlemsår (brug el. tab)</div>
                          <div>✓ <strong>Op til 20% faste rabatter</strong> på fremtidige rengøringer</div>
                        </div>
                        <div style={{ position: "absolute", top: "20px", right: "20px", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #206d69", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {clubSelected && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#206d69" }} />}
                        </div>
                      </div>

                      {/* One-off Regular Option */}
                      <div
                        onClick={() => {
                          setSelectedFreqId("1");
                          setClubSelected(false);
                        }}
                        style={{
                          background: !clubSelected ? "#e1f2ef" : "#fff",
                          border: !clubSelected ? "2px solid #206d69" : "2px solid #e2e8f0",
                          borderRadius: "18px",
                          padding: "20px",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: !clubSelected ? "0 8px 30px rgba(32, 109, 105, 0.05)" : "none",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Fortsæt uden klubben</span>
                          <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#475569" }}>Ingen binding</span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 12px 0" }}>
                          Du betaler normal engangspris og modtager ingen løbende fordele eller kreditter.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#374151" }}>
                          <div>✗ Ingen velkomstpris (du betaler normalpris)</div>
                          <div>✗ Ingen kreditter til udvalgte boligservices</div>
                          <div>✗ Ingen rabat på fremtidige opgaver</div>
                        </div>
                        <div style={{ position: "absolute", top: "20px", right: "20px", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {!clubSelected && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#206d69" }} />}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Dine oplysninger & Stripe card element payment */}
          {currentStep === 4 && (
            <div className="l27-step l27-details-grid">
              <div className="l27-form-section">
                <h2>Dine oplysninger</h2>
                
                <div className="l27-field-row">
                  <div className="l27-field-group">
                    <label htmlFor="l27-first-name">Fornavn*</label>
                    <input
                      type="text"
                      id="l27-first-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="l27-field-group">
                    <label htmlFor="l27-last-name">Efternavn*</label>
                    <input
                      type="text"
                      id="l27-last-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="l27-field-row">
                  <div className="l27-field-group">
                    <label htmlFor="l27-email">E-mail*</label>
                    <input
                      type="email"
                      id="l27-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="l27-field-group">
                    <label htmlFor="l27-phone">Telefon*</label>
                    <input
                      type="tel"
                      id="l27-phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="l27-field-group">
                  <label htmlFor="l27-address">Adresse*</label>
                  <input
                    type="text"
                    id="l27-address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="l27-field-row">
                  <div className="l27-field-group">
                    <label htmlFor="l27-zip">Postnummer*</label>
                    <input
                      type="text"
                      id="l27-zip"
                      required
                      value={zip}
                      onChange={(e) => handleZipChange(e.target.value)}
                    />
                  </div>
                  <div className="l27-field-group">
                    <label htmlFor="l27-city">By*</label>
                    <input
                      type="text"
                      id="l27-city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Credit Card Element Mockup */}
              <div className="l27-form-section">
                <h2>Betaling</h2>

                {showFuturePayments && isM2Valid && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "4px", marginBottom: "20px", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        Fremtidig betaling (efter 1. rengøring)
                      </span>
                      {subsequentCleanSavings > 0 && (
                        <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: "6px" }}>
                          Spar {formatPriceDK(subsequentCleanSavings)} / gang
                        </span>
                      )}
                    </div>
                    {clubSelected && planType !== 'annual' && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569", marginBottom: "6px" }}>
                        <span>Månedligt klubmedlemskab:</span>
                        <strong style={{ color: "#0f172a" }}>{formatPriceDK(KLUB_MONTHLY_KR)} / md</strong>
                      </div>
                    )}
                    {isRecurring && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569", marginBottom: "6px" }}>
                          <span>Rengøringspris efter rabat:</span>
                          <strong style={{ color: "#0f172a" }}>{formatPriceDK(subsequentCleanPriceGross)} / gang</strong>
                        </div>
                        <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569", fontWeight: 700 }}>
                          <span>Rengøringspris efter fradrag:</span>
                          <span>{formatPriceDK(subsequentCleanPriceNet)} / gang</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="l27-field-group">
                  <label>Kreditkort oplysninger*</label>
                  <StripeCardInput
                    onChange={(event) => {
                      setCardComplete(event.complete);
                      setCardError(event.error?.message ?? null);
                    }}
                    errorMessage={cardError}
                  />
                  <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
                    Vi trækker først pengene efter din rengøring er udført.
                  </p>
                </div>

                {clubSelected && (
                  <TermsConfirmCard
                    id="l27-terms-checkbox"
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    ariaLabel="Accepter vilkår for Renzen Klub"
                    description={
                      <>
                        {planType === "annual"
                          ? `${KLUB_ANNUAL_KR} kr. for 12 måneder (= ${KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./md.).`
                          : `${KLUB_MONTHLY_KR} kr./md. med minimum ${KLUB_MONTHLY_MIN_MONTHS} betalte måneder.`}{" "}
                        Du optjener {zenCreditAnnualMonths} × {ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter i medlemsmåned
                        1-10 pr. medlemsår. Kreditter udløber månedligt og
                        overføres ikke. Tilvalg-kreditter aktiveres efter 3
                        måneders aktivt medlemskab. 14 dages fortrydelsesret.{" "}
                        <a
                          href="/handelsbetingelser/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Se alle vilkår
                        </a>
                        .
                      </>
                    }
                  >
                    Jeg accepterer vilkårene for Renzen Klub og tilbagevendende
                    betaling.
                  </TermsConfirmCard>
                )}
              </div>
            </div>
          )}

          {/* Steps buttons footer */}
          <div className="l27-steps-footer">
            <button
              type="button"
              className="l27-step-btn"
              id="l27-step-back"
              disabled={currentStep === 1}
              onClick={() => goStep(currentStep - 1)}
            >
              Tilbage
            </button>
            {currentStep < 4 ? (
              <button
                type="button"
                className="l27-step-btn l27-step-btn-primary"
                id="l27-step-next"
                disabled={
                  currentStep === 1 ? !isStep1Valid() :
                  currentStep === 2 ? !isStep2Valid() :
                  !isStep3Valid()
                }
                onClick={() => goStep(currentStep + 1)}
              >
                Næste
              </button>
            ) : (
              <button
                type="submit"
                id="l27-submit-button"
                className="l27-step-btn l27-step-btn-primary"
                style={{ display: "block", marginTop: 0 }}
                disabled={isSubmitting || !isStep4Valid()}
              >
                {isSubmitting ? "Booker..." : "Book nu"}
              </button>
            )}
          </div>
        </form>
      </div>
      </div>

      {/* Desktop Sidebar Summary Card */}
      <aside className="l27-sidebar">
        <div className="l27-summary-card">
          {isDealFlow ? renderDealTrustStrip() : renderTrustSection()}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Dato</div>
              <div id="l27-summary-date" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                {getFormattedDateDisplay(selectedDateStr) || "-"}
              </div>
            </div>
            <div style={{ textAlign: "center", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Frekvens</div>
              <div id="l27-summary-frequency" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px", lineHeight: "1.2" }}>
                {isFrequencySelected ? activeFreq.name.split(" - ")[0] : "-"}
                {isFrequencySelected && activeFreq.discount > 0 && (
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#16a34a", fontWeight: 600, marginTop: "2px" }}>
                    ({activeFreq.discount}% rabat)
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Størrelse</div>
              <div id="l27-summary-m2" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                {isM2Valid ? `${m2} m²` : "-"}
              </div>
            </div>
          </div>

          {/* Extras / Tilvalg list */}
          {Object.entries(selectedExtras).length > 0 && (
            <div id="l27-summary-extras-wrap" style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Valgte tilvalg:</div>
              <div id="l27-summary-extras-list" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {Object.entries(selectedExtras).map(([id, qty]) => {
                  const extra = EXTRAS_LIST.find((e) => e.id === id);
                  if (!extra || qty <= 0) return null;
                  return (
                    <span key={id} style={{ background: "#f1f5f9", color: "#334155", fontSize: "0.75rem", fontWeight: 600, padding: "4px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px", border: "1px solid #e2e8f0" }}>
                      {extra.name} {qty > 1 ? `(×${qty})` : ""} <span style={{ color: "#64748b", fontWeight: 500 }}>+{formatPriceDK(extra.price * qty)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {isM2Valid && isFrequencySelected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              {/* Section 1: First Cleaning (Today's terms) */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    1. rengøring {isRecurring && "(Intropris)"}
                  </span>
                  {savingsAmount > 0 && (
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", padding: "2px 6px", borderRadius: "6px" }}>
                      Spar {formatPriceDK(savingsAmount)}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "#475569" }}>
                  {showPriceDetails && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px", marginBottom: "4px" }}>
                      {clubSelected ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Rengøring (standardpris):</span>
                            <span>{formatPriceDK(subtotal)}</span>
                          </div>
                          {isRecurring && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Intropris:</span>
                              <span>{formatPriceDK(welcomePrice)}</span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontStyle: "italic" }}>
                            <span>Zen kredit optjent:</span>
                            <span>{formatPriceDK(ZEN_CREDIT_MONTHLY_KR)}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{clubSelected ? "Din intropris:" : "Engangspris:"}</span>
                          <span>{formatPriceDK(subtotal)}</span>
                        </div>
                      )}
                      {localExtrasPrice > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Tilvalg (første rengøring):</span>
                          <span>+{formatPriceDK(localExtrasPrice)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Administrationsgebyr:</span>
                        <span>+{formatPriceDK(adminFee)}</span>
                      </div>
                      {clubSelected && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{currentStep < 3 ? "Renzen Klub (1. md):" : (planType === 'annual' ? "Renzen Klub (12 mdr.):" : "Renzen Klub (1. md):")}</span>
                          <span>+{formatPriceDK(clubFee)}</span>
                        </div>
                      )}
                      {promoCode && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#b45309", fontWeight: 600 }}>
                          <span>Rabatkode ({promoCode}):</span>
                          <span>-{formatPriceDK(promoDiscountAmount)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: 600 }}>
                        <span>Servicefradrag (26%):</span>
                        <span>-{formatPriceDK(fradragAmount)}</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderTop: "1px solid #e2e8f0", paddingTop: "8px", marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569" }}>
                      <span>Total:</span>
                      <span>{isEstimating ? "..." : formatPriceDK(priceBeforeFradrag)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>Total efter servicefradrag:</span>
                      <strong style={{ fontSize: "1.1rem", color: "#206d69", fontWeight: 900 }}>
                        {isEstimating ? "..." : formatPriceDK(finalPrice)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                    <button
                      type="button"
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#206d69",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 600,
                        textDecoration: "underline"
                      }}
                    >
                      {showPriceDetails ? "Skjul detaljer" : "Se detaljer"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease', transform: showPriceDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 0 kr today badge */}
                <div style={{ marginTop: "10px", fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🔒</span>
                  <span style={{ fontWeight: 700 }}>0 kr. trækkes i dag</span>
                </div>
              </div>

              {/* Section 2: Membership & Future visits */}
              {showFuturePayments && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Løbende aftale
                    </span>
                    {subsequentCleanSavings > 0 && (
                      <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: "6px" }}>
                        Spar {formatPriceDK(subsequentCleanSavings)} / gang
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "#475569" }}>
                    {clubSelected && planType !== 'annual' && (
                      <div style={{ background: "#ececec", borderRadius: "8px", padding: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, color: "#475569" }}>Klubmedlemskab:</span>
                          <strong style={{ color: "#475569" }}>{KLUB_MONTHLY_KR} kr./md.</strong>
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block", marginTop: "2px" }}>
                          Inkl. {activeFreq.discount}% rabat & digital wallet:
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", fontSize: "0.7rem", fontWeight: 700, color: "#475569" }}>
                          <span>💰</span>
                          <span>Zen kredit optjent denne måned (udløber månedligt)</span>
                        </div>
                      </div>
                    )}

                    {isRecurring && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>Rengøringspris efter rabat:</span>
                          <strong style={{ color: "#0f172a" }}>{formatPriceDK(subsequentCleanPriceGross)} / gang</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: "#166534", fontWeight: 700, marginTop: "2px" }}>
                          <span>Rengøringspris efter fradrag:</span>
                          <span>{formatPriceDK(subsequentCleanPriceNet)} / gang</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "0.85rem" }}>
              Indtast postnummer, m² og vælg frekvens for at se prisoversigt.
              <span id="l27-total-price" style={{ display: "none" }}>- kr</span>
            </div>
          )}

          {/* Rabatkode input */}
          {currentStep === 4 && (
            <>
              <div className="l27-promo-section" id="l27-promo-section-desktop" style={{ marginBlock: "8px" }}>
                {!showPromoInput && !promoCode ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    style={{ background: "none", border: "none", color: "#206d69", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                  >
                    Har du en rabatkode?
                  </button>
                ) : (
                  <>
                    <div className="l27-promo-title" style={{ fontSize: "0.85rem", fontWeight: 700 }}>Rabatkode</div>
                    <div className="l27-promo-controls">
                      <input
                        type="text"
                        id="l27-promo-input-desktop"
                        className="l27-promo-input"
                        placeholder="Indtast kode"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={!!promoCode}
                      />
                      <button
                        type="button"
                        id="l27-promo-btn-desktop"
                        className={`l27-promo-btn ${promoCode ? "is-remove" : ""}`}
                        onClick={promoCode ? handlePromoRemove : handlePromoSubmit}
                      >
                        {promoCode ? "Fjern" : "Tilføj"}
                      </button>
                    </div>
                    {promoMsg && (
                      <div id="l27-promo-msg-desktop" className={`l27-promo-msg ${promoIsError ? "is-error" : ""}`}>
                        {promoMsg}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
}

const inlineStyles = `
:root{--l27-mobile-topbar:56px;--l27-mobile-stepsbar:54px;}

/* Premium typography antialiasing */
*, html, body, button, input, select, textarea, div, span, p, h1, h2, h3, h4, h5, h6, label {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}

h1, h2, h3, h4, h5, h6 {
  letter-spacing: -0.02em !important;
}

p, span, label, input, button {
  letter-spacing: -0.01em;
}

/* Launch27 Custom Booking Form - Housekeep Style */

* {
    box-sizing: border-box;
}

/* Extras: grouped, nicer cards (after frequencies) */
.l27-section-subtitle{margin-top:-6px;color:#6b7280;font-size:0.95rem;line-height:1.35;}

.l27-extras-group{margin-top:14px;}
.l27-extras-group-title{font-weight:600;margin:8px 0;}
.l27-extras-grid{display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:768px){.l27-extras-grid{grid-template-columns:1fr 1fr;}}

.l27-extra-card{border:1px solid #e5e7eb;border-radius:16px;padding:14px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.04);}
.l27-extra-card-highlight{border-color:rgba(255,107,53,0.6);box-shadow:0 4px 18px rgba(255,107,53,0.15);}
.l27-extra-card-head{display:flex;align-items:flex-start;gap:12px;cursor:pointer;}
.l27-extra-checkwrap input{width:18px;height:18px;}
.l27-extra-card-title{flex:1;font-weight:600;}
.l27-extra-card-price{font-weight:600;white-space:nowrap;}
.l27-extra-card-desc{margin-top:8px;color:#6b7280;font-size:0.92rem;line-height:1.35;}
.l27-extra-qty{margin-top:10px;display:flex;align-items:center;gap:8px;}
.l27-qty-btn{width:34px;height:34px;border:1px solid #d1d5db;border-radius:12px;background:#f9fafb;cursor:pointer;font-size:18px;line-height:1;}
.l27-qty-input{width:80px;height:34px;border:1px solid #d1d5db;border-radius:12px;padding:0 10px;}
.l27-extra-pill{margin-top:10px;display:inline-block;font-size:0.8rem;padding:4px 10px;border-radius:999px;background:#eef2ff;color:#3730a3;}
.l27-extra-pill-once{background:#fef3c7;color:#92400e;}



.l27-header h1,
.l27-form-section h2,
.l27-summary-card h3,
.l27-mobile-summary-content h3,
.l27-success-message h2,
.l27-frequency-type-title label,
.l27-club-card-title,
.l27-time-group-title,
.l27-extra-card-title,
.l27-extra-card-name,
.l27-extra-name {
    font-family: var(--font-display), "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#l27-booking-form-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
    max-width: 1240px;
    margin: 0 auto;
    font-family: var(--font-plus-jakarta-sans), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #272727;
    background: transparent;
    text-align: left;
}

/* Mobile Summary Header - Hidden on desktop */
.l27-mobile-summary-header {
        display: none;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: #fff;
        border-bottom: 1px solid #e5e5e5;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        height: var(--l27-mobile-topbar, 56px);
    }

.l27-mobile-summary-dropdown {
    display: none;
}

.l27-main-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
}

/* Main Content */
.l27-main-content {
    flex: 1;
    max-width: 800px;
    background: #fff;
    border: none;
    border-radius: 12px;
    padding: 40px;
}

.l27-header {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e6ebed;
}

.l27-header h1 {
    font-size: 40px;
    font-weight: 500;
    margin: 0 0 20px 0;
    color: #272727;
    line-height: 1.2;
}

.l27-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.l27-badge {
    font-size: 14px;
    color: #435965;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.l27-badge::before {
    content: "✓";
    color: #206d69;
    font-weight: 700;
}

/* Form Sections */
.l27-form-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e6ebed;
}

.l27-form-section:last-of-type {
    border-bottom: none;
}

.l27-form-section h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 24px 0;
    color: #272727;
    line-height: 1.2;
}

/* Field Groups */
.l27-field-group {
    margin-bottom: 24px;
}

.l27-field-group label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #272727;
}

.l27-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

/* Input Fields - Housekeep Style */
#l27-booking-form input[type="text"],
#l27-booking-form input[type="email"],
#l27-booking-form input[type="number"],
#l27-booking-form input[type="date"],
#l27-booking-form input[type="tel"] {
    width: 100%;
    height: 48px;
    padding: 10px 14px;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #272727;
    background-color: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    transition: none;
}

#l27-booking-form input:focus {
    outline: none;
    border-color: #206d69;
    box-shadow: 0 0 0 1px #206d69;
}

#l27-booking-form input::placeholder {
    color: #b4c2c9;
}

/* ========================================
   FREQUENCY SELECTOR - Housekeep Style
   ======================================== */

.l27-frequency-selector {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.l27-frequency-type-card {
    position: relative;
    padding: 24px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
}

.l27-frequency-type-card:hover {
    border-color: #206d69;
    background: #f9fafb;
}

/* Recurring card - active/selected state */
.l27-recurring-card {
    border: 1px solid #cbd5e1;
}

.l27-recurring-card.active {
    border: 1px solid #206d69;
    background: #ffffff;
}

.l27-oneoff-card {
    border: 1px solid #cbd5e1;
}

.l27-oneoff-card.active {
    border: 1px solid #206d69;
    background: #ffffff;
}

/* Best Badge */
.l27-best-badge {
    position: absolute;
    top: -12px;
    right: 24px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    background: #00fffc;
    color: #206d69;
    border-radius: 20px;
    text-transform: capitalize;
}

/* Frequency Type Header */
.l27-frequency-type-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.l27-frequency-type-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.l27-frequency-type-title input[type="radio"] {
    display: none;
}

.l27-frequency-type-title label {
    font-size: 20px;
    font-weight: 600;
    color: #272727;
    cursor: pointer;
    margin: 0;
}

.l27-frequency-type-price {
    font-size: 20px;
    font-weight: 600;
    color: #272727;
}

/* Frequency Benefits */
.l27-frequency-benefits {
    margin-bottom: 20px;
}

.l27-benefit-item {
    display: flex;
    flex-direction: column;
    padding-left: 28px;
    position: relative;
    margin-bottom: 16px;
}

.l27-benefit-item::before {
    content: "✓";
    position: absolute;
    left: 0;
    top: 0;
    color: #206d69;
    font-weight: 700;
    font-size: 16px;
}

.l27-benefit-title {
    font-size: 15px;
    font-weight: 600;
    color: #272727;
    margin-bottom: 4px;
}

.l27-benefit-desc {
    font-size: 14px;
    color: #435965;
    line-height: 1.4;
}

/* Frequency Options (pill buttons) */
.l27-frequency-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #e6ebed;
}

.l27-frequency-options.l27-hidden {
    display: none;
}

/* Frequency Grid - 2 columns for recurring frequencies */
.l27-frequency-options.l27-frequency-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.l27-freq-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    text-align: center;
    gap: 4px;
}

.l27-freq-option.selected,
.l27-freq-option:has(input:checked) {
    background: #206d69;
    border-color: #206d69;
    color: #fff;
}

.l27-freq-option:hover {
    background: #e1f2ef;
    border-color: #206d69;
}

.l27-freq-option.selected .l27-freq-discount,
.l27-freq-option:has(input:checked) .l27-freq-discount {
    color: rgba(255, 255, 255, 0.85);
}

.l27-freq-option input[type="radio"] {
    display: none;
}

.l27-freq-option-text {
    font-size: 14px;
    font-weight: 600;
    color: #272727;
}

.l27-freq-discount {
    font-size: 12px;
    color: #435965;
    font-weight: 400;
}

.l27-freq-option.selected .l27-freq-option-text,
.l27-freq-option:has(input:checked) .l27-freq-option-text {
    color: #fff;
}

.l27-freq-option:hover .l27-freq-option-text {
    color: #206d69;
}

/* Date/Time Wrapper */
.l27-date-time-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* Calendar Container */
.l27-calendar-container {
    padding: 0;
    border: none;
    background: transparent;
    width: 100%;
}

/* Horizontal Date Selector Cards */
.l27-date-row {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 12px;
    scrollbar-width: none; /* Firefox */
}
.l27-date-row::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

@media (min-width: 768px) {
    .l27-date-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        overflow-x: visible;
        padding-bottom: 0;
    }
}

.l27-date-tile {
    background: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 8px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    min-width: 76px;
    outline: none;
    font-family: var(--font-plus-jakarta-sans), "Plus Jakarta Sans", sans-serif;
}
.l27-date-tile:hover {
    border-color: #206d69;
    background: #e1f2ef;
}
.l27-date-tile.selected {
    border-color: #206d69;
    background: #e1f2ef;
    box-shadow: none;
}
.l27-date-tile.disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
}
.l27-date-tile .day-name {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.l27-date-tile.selected .day-name {
    color: #206d69;
}
.l27-date-tile .day-num {
    font-size: 20px;
    font-weight: 850;
    color: #111827;
    line-height: 1;
}
.l27-date-tile .day-month {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
}

/* Calendar Button (Dashed) */
.l27-date-tile.calendar-tile {
    border-style: dashed;
    border-color: #cbd5e1;
    background: #fff;
}
.l27-date-tile.calendar-tile:hover {
    border-color: #206d69;
}
.l27-date-tile.calendar-tile.selected {
    border-style: solid;
    border-color: #206d69;
    background: #e1f2ef;
}
.l27-date-tile.calendar-tile.active-dropdown {
    border-color: #206d69;
    background: #e1f2ef;
}

/* Open calendar (Housekeep-like) */
.l27-open-calendar {
    width: 100%;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}

.l27-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.l27-cal-month {
    font-size: 16px;
    font-weight: 600;
    text-transform: capitalize;
}

.l27-cal-nav {
    width: 36px;
    height: 36px;
    border: 1px solid #e6ebed;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
}

.l27-cal-nav:hover {
    border-color: #206d69;
}

.l27-cal-grid {
    display: grid;
    grid-template-columns: 36px repeat(7, 1fr);
    gap: 6px;
}

.l27-cal-dow {
    font-size: 12px;
    font-weight: 600;
    color: #435965;
    text-align: center;
    padding: 6px 0;
}

.l27-cal-week {
    font-size: 12px;
    font-weight: 600;
    color: #435965;
    text-align: center;
    padding: 10px 0;
}

.l27-cal-day {
    height: 40px;
    border: 1px solid #e6ebed;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    padding: 0;
}

.l27-cal-day .l27-cal-num {
    display: inline-flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    color: #272727;
}

.l27-cal-day:hover:not(:disabled) {
    border-color: #206d69;
    background: #f8fbfe;
}

.l27-cal-day.is-selected {
    background: #206d69;
    border-color: #206d69;
}

.l27-cal-day.is-selected .l27-cal-num {
    color: #fff;
}

.l27-cal-day:disabled,
.l27-cal-day.is-disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.l27-cal-day.is-out {
    opacity: 0.25;
}

/* Time Slots - Housekeep Style */
.l27-time-grid {
    display: block;
    width: 100%;
    margin-top: 12px;
}

.l27-time-slot {
    padding: 14px 12px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    cursor: pointer;
    background: #fff;
    color: #272727;
    display: flex;
    align-items: center;
    justify-content: center;
}

.l27-time-slot-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    line-height: 1.1;
}

.l27-time-slot-title {
    font-weight: 700;
    font-size: 14px;
    color: inherit;
}

.l27-time-slot-text {
    white-space: nowrap;
}

.l27-time-slot.selected {
    background: #206d69;
    color: #fff;
    border-color: #206d69;
}

.l27-time-slot:hover {
    background: #e1f2ef;
    color: #206d69;
    border-color: #206d69;
}

.l27-hint {
    grid-column: 1 / -1;
    color: #435965;
    font-size: 14px;
    font-style: normal;
    margin: 0;
}

/* Stripe Element - Housekeep Style */
#stripe-card-element {
    height: 48px;
    padding: 12px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

#stripe-card-element:focus-within {
    border-color: #206d69;
    box-shadow: 0 0 0 1px #206d69;
    outline: none;
}

#stripe-card-errors {
    color: #ff002d;
    font-size: 14px;
    margin-top: 10px;
}

/* Submit Button - Housekeep Primary Style */
#l27-submit-button {
    width: 100%;
    height: 48px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: normal;
    background: #206d69;
    color: #fff;
    border: 1px solid #206d69;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 24px;
}

#l27-submit-button:hover {
    background: #195350;
    border-color: #195350;
}

#l27-submit-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(32, 109, 105, 0.3);
}

#l27-submit-button:disabled {
    background: #ced7db;
    border-color: #ced7db;
    cursor: not-allowed;
    opacity: 0.65;
}

/* ========================================
   SIDEBAR - Desktop
   ======================================== */

.l27-sidebar {
    width: 370px;
    flex-shrink: 0;
    position: sticky;
    top: 90px;
}

.l27-summary-card {
    background: #fff;
    border: none;
    border-radius: 12px;
    padding: 24px;
}

.l27-summary-card h3 {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 24px 0;
    color: #272727;
}

.l27-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.l27-summary-label {
    font-size: 14px;
    color: #435965;
    flex: 1;
}

.l27-summary-value {
    font-size: 14px;
    font-weight: 500;
    color: #272727;
    text-align: right;
}

.l27-divider {
    border: none;
    border-top: 1px solid #e6ebed;
    margin: 20px 0;
}

.l27-price-row {
    margin-bottom: 0;
    flex-direction: column;
    gap: 8px;
}

.l27-final-price-label {
    font-size: 14px;
    font-weight: 500;
    color: #272727;
}

.l27-price {
    font-size: 24px;
    font-weight: 600;
    color: #206d69;
}

/* Discount & Fradrag styling */
.l27-discount {
    color: #00be5f;
}

.l27-fradrag {
    color: #00be5f;
}

/* Messages - Housekeep Style */
#l27-message {
    margin-top: 20px;
}

#l27-message .success {
    padding: 16px;
    background: #e5f9ef;
    color: #00be5f;
    border-radius: 4px;
    font-size: 14px;
    border: 1px solid #00be5f;
}

#l27-message .error {
    padding: 16px;
    background: #ffe6eb;
    color: #ff002d;
    border-radius: 4px;
    font-size: 14px;
    border: 1px solid #ff002d;
}

.l27-success-message {
    text-align: center;
    padding: 60px 40px;
}

.l27-success-message h2 {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #272727;
}

.l27-success-message p {
    font-size: 18px;
    color: #435965;
    line-height: 1.5;
}

/* ========================================
   MOBILE RESPONSIVE
   ======================================== */

@media (max-width: 520px) {
    #l27-booking-form-container {
        flex-direction: column;
        padding: 0;
        padding-top: calc(var(--l27-mobile-topbar,56px) + var(--l27-mobile-stepsbar,54px) + 10px); /* Space for fixed header + step bar */
    }

    /* Mobile Summary Header - Fixed at top */
    .l27-mobile-summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #fff;
        padding: 16px 20px;
        border-bottom: 1px solid #e6ebed;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .l27-mobile-summary-price {
        font-size: 20px;
        font-weight: 600;
        color: #206d69;
    }

    .l27-mobile-summary-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    .l27-toggle-icon {
        font-size: 14px;
        color: #435965;
        transition: transform 0.3s ease;
    }

    .l27-mobile-summary-header.open .l27-toggle-icon {
        transform: rotate(180deg);
    }

    /* Mobile Summary Dropdown */
    .l27-mobile-summary-dropdown {
        display: block;
        position: fixed;
        top: calc(var(--l27-mobile-topbar,56px) + var(--l27-mobile-stepsbar,54px));
        left: 0;
        right: 0;
        z-index: 999;
        background: #fff;
        border-bottom: 1px solid #e6ebed;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .l27-mobile-summary-dropdown.open {
        /* JS sets max-height dynamically to avoid cutting off extras */
        max-height: none;
    }

    .l27-mobile-summary-content {
        padding: 20px;
    }

    .l27-mobile-summary-content h3 {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 16px 0;
        color: #272727;
    }

    .l27-mobile-summary-content .l27-summary-row {
        margin-bottom: 12px;
    }

    .l27-mobile-summary-content .l27-price {
        font-size: 20px;
    }

    /* Hide desktop sidebar on mobile */
    .l27-sidebar {
        display: none;
    }

    .l27-main-column {
        max-width: 100%;
        width: 100%;
    }
    .l27-main-content {
        max-width: 100%;
        background: #fff;
        border: none;
        border-radius: 12px;
        padding: 24px 16px;
    }

    .l27-field-row {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .l27-header h1 {
        font-size: 32px;
    }

    .l27-form-section h2 {
        font-size: 20px;
    }

    /* Frequency options stack on mobile */
    .l27-freq-option {
        min-width: 100px;
        padding: 10px 16px;
    }
    .l27-mobile-brand{display:flex;align-items:center;}
    .l27-mobile-logo{height:22px;width:auto;display:block;}

    .l27-mobile-summary-toggle{display:flex;align-items:center;gap:8px;padding:0;border:0;background:transparent;}
    .l27-mobile-summary-price{font-size: 16px;font-weight:700;color:#206d69;}

    .l27-mobile-summary-dropdown{top: var(--l27-mobile-topbar, 56px);}

    
    .l27-steps-actions{display:none;}


    /* Mobile top bars layout: prevent horizontal scroll and keep steps under topbar */
    body { overflow-x: hidden; }
    .l27-mobile-summary-header{display:flex;}
    .l27-steps-header {
        position: fixed;
        top: var(--l27-mobile-topbar, 56px);
        left: 0;
        right: 0;
        z-index: 999;
        background: #fff;
        padding: 8px 16px;
        border-bottom: 1px solid #e5e5e5;
        margin: 0;
        height: var(--l27-mobile-stepsbar, 54px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none;
    }
    .l27-steps-progress {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 360px;
        margin: 0 auto;
    }
    .l27-steps-labels {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 4px;
    }
    .l27-step-tab {
        font-size: 13px;
        padding: 4px 0;
        gap: 4px;
    }
    .l27-step-check {
        width: 12px;
        height: 12px;
    }
    .l27-steps-indicator-bar {
        height: 2px;
    }

}


@media (max-width: 480px) {
    #l27-booking-form-container {
        padding-top: 56px;
    }

    .l27-main-content {
        padding: 16px;
    }

    .l27-time-grid {
        display: block;
        width: 100%;
    }

    .l27-frequency-type-card {
        padding: 16px;
    }

    .l27-best-badge {
        right: 16px;
        font-size: 11px;
        padding: 4px 12px;
    }

    .l27-frequency-type-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .l27-frequency-type-price {
        font-size: 18px;
    }

    .l27-freq-option {
        flex: 1 1 calc(33% - 8px);
        min-width: auto;
        padding: 10px 8px;
    }

    .l27-freq-option-text {
        font-size: 12px;
    }
}


/* Extras (grouped cards) */
.l27-section-subtitle{margin-top:-6px;color:#6b7280;font-size:0.95rem;line-height:1.4;}
.l27-extras-list{margin-top:14px;}
.l27-extras-group{margin-top:14px;}
.l27-extras-group-title{font-weight:650;font-size:0.95rem;margin:10px 0;}
.l27-extras-grid{display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:768px){.l27-extras-grid{grid-template-columns:1fr 1fr;}}

.l27-extra-card{border:1px solid #e5e5e5;border-radius:14px;padding:12px 14px;background:#fff;}
.l27-extra-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;}
.l27-extra-checkwrap input{width:18px;height:18px;}
.l27-extra-card-title{flex:1;font-weight:650;}
.l27-extra-card-price{font-weight:700;}
.l27-extra-card-desc{margin-top:6px;color:#6b7280;font-size:0.92rem;line-height:1.35;}
.l27-extra-qty{margin-top:10px;display:flex;align-items:center;gap:8px;}
.l27-qty-btn{width:34px;height:34px;border:1px solid #d1d5db;border-radius:10px;background:#f9fafb;cursor:pointer;font-size:18px;line-height:1;}
.l27-qty-input{width:72px;height:34px;border:1px solid #d1d5db;border-radius:10px;padding:0 10px;}
.l27-extra-pill{margin-top:10px;display:inline-block;font-size:0.8rem;padding:4px 8px;border-radius:999px;background:#eef2ff;color:#3730a3;}
.l27-extra-pill-once{background:#fef3c7;color:#92400e;}

.l27-extra-card-highlight{border-color:#206d69;box-shadow:0 8px 22px rgba(255,107,53,0.12);}

/* --- Steps (Freska Style) --- */
.l27-steps-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 0 24px 0;
  padding: 0;
}
.l27-steps-progress {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.l27-steps-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 12px;
}
.l27-step-tab {
  background: none;
  border: none;
  font-family: var(--font-display), "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 15px;
  font-weight: 550;
  color: #9ca3af;
  padding: 8px 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  outline: none;
}
.l27-step-tab:hover {
  color: #4b5563;
}
.l27-step-tab.active {
  color: #111827;
  font-weight: 700;
}
.l27-step-tab.completed {
  color: #9ca3af;
}
.l27-step-check {
  display: inline-flex;
  align-self: center;
}
.l27-steps-indicator-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 99px;
  position: relative;
  overflow: hidden;
}
.l27-steps-indicator-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #206d69;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
}
.l27-step-btn{border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:10px 14px;font-weight:600;cursor:pointer;transition: border-color 0.15s ease, background-color 0.15s ease;}
.l27-step-btn:disabled{opacity:.5;cursor:not-allowed;}
.l27-step-btn-primary{background:#206d69;border-color:#206d69;color:#fff;}
.l27-step-btn-primary:disabled{background:#cbd5e1 !important;border-color:#cbd5e1 !important;color:#94a3b8 !important;opacity:1 !important;cursor:not-allowed;}

/* --- Extras pills + club --- */
.l27-extras-pills{display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:768px){.l27-extras-pills{grid-template-columns:1fr 1fr;}}
.l27-extra-pill-btn{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.l27-extra-price{font-weight:700;white-space:nowrap;color:#111827;}
.l27-pill-qty{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e5e5;border-radius:999px;padding:6px 8px;}
.l27-pill-qty-btn{width:28px;height:28px;border-radius:999px;border:1px solid #e5e5e5;background:#fff;cursor:pointer;font-weight:700;}
.l27-pill-qty-val{min-width:18px;text-align:center;font-weight:700;}

.l27-club-card{margin-bottom:14px;}
.l27-club-card.active{box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important; border: 1.5px solid var(--l27-primary) !important;}
.l27-club-card-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}
.l27-club-card-title{font-size:1.1rem;font-weight:800;}
.l27-club-card-price{font-weight:800;color:#206d69;}
.l27-club-card-body ul{margin:10px 0 12px 18px;color:#374151;}
.l27-club-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 18px 18px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  border-radius: var(--l27-radius-md) !important; /* 8px */
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  background: #ffffff !important;
  border: 1px solid var(--l27-border) !important;
  color: #272727 !important;
  width: auto !important;
}
.l27-club-toggle:hover {
  background-color: var(--l27-primary-light) !important; /* #e1f2ef */
  border-color: var(--l27-primary) !important;
  color: var(--l27-primary) !important;
}
.l27-club-card.active .l27-club-toggle {
  background: var(--l27-primary) !important;
  border-color: var(--l27-primary) !important;
  color: #ffffff !important;
}

/* --- Summary extras --- */
.l27-summary-extras{color:#374151;}
.l27-summary-extras-title{margin-top:10px;font-weight:700;}
.l27-summary-extras-list{margin:8px 0 0 0;padding:0;list-style:none;}
.l27-summary-extras-list li{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px dashed #e5e7eb;}
.l27-summary-extra-price{font-weight:700;color:#111827;white-space:nowrap;}

.l27-shake{animation:l27shake .35s linear;}
@keyframes l27shake{0%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)}}


.l27-steps-footer{display:flex;gap:12px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;}
.l27-steps-footer .l27-step-btn{flex:1;}
@media(min-width:768px){.l27-steps-footer{justify-content:space-between;}.l27-steps-footer .l27-step-btn{flex:0;min-width:140px;}}


/* Summary extras list consistency */
.l27-summary-extras-title{font-size:1rem;font-weight:600;margin:12px 0 6px;}
.l27-summary-extras-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;}
.l27-summary-extras-list li{display:flex;align-items:baseline;justify-content:space-between;font-size:0.95rem;line-height:1.3;color:#111827;}
.l27-summary-extras-list li .name{font-weight:500;color:#111827;}
.l27-summary-extras-list li .price{font-weight:600;color:#111827;}

/* --- Summary extras typography: keep consistent with other summary rows --- */
.l27-summary-extras-title{font-size:14px;font-weight:500;color:#272727;margin:16px 0 10px;}
.l27-summary-extras-list li{font-size:14px;color:#272727;}
.l27-summary-extra-name{font-weight:500;color:#272727;}
.l27-summary-extra-price{font-weight:500;color:#272727;}

/* ==============================
   Extras compact tiles (override)
   ============================== */

.l27-extras-pills{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
@media (min-width:768px){.l27-extras-pills{grid-template-columns:repeat(4,1fr);}}

.l27-extra-pill-btn{
  width:100%;
  border:1px solid #cbd5e1;
  border-radius:8px;
  background:#fff;
  padding:14px 12px;
  min-height:120px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:8px;
  text-align:center;
  cursor:pointer;
  position:relative;
}

.l27-extra-pill-btn:hover,
.l27-extra-pill-btn.selected{
  border-color:#206d69;
  background:#e1f2ef;
  box-shadow:none;
}

.l27-extra-icon{width:auto;height:55px;max-height:55px;max-width:55px;object-fit:contain;opacity:.95;}
.l27-extra-icon-svg{width:32px;height:32px;flex-shrink:0;color:#6b7280;margin-bottom:4px;}
.l27-extra-pill-btn:hover .l27-extra-icon-svg,
.l27-extra-pill-btn.selected .l27-extra-icon-svg{color:#206d69;}

.l27-extra-name{font-size:14px;font-weight:600;line-height:1.25;color:#111827;}
.l27-extra-price{font-size:13px;font-weight:600;color:#206d69;}

/* Quantity controls inside tile */
.l27-pill-qty{
  display:none;
  position:static;
  transform:none;
  margin-top:6px;
  background:#fff;
  border:1px solid #cbd5e1;
  border-radius:999px;
  padding:6px 8px;
  align-items:center;
  gap:8px;
}
.l27-extra-pill-btn.has-qty.selected .l27-pill-qty{display:flex;}


/* Custom fields (date step) */
.l27-custom-fields{margin-top:20px;padding-top:16px;border-top:1px solid #e8efef;}
.l27-custom-field{margin-top:14px;}
.l27-custom-label{font-weight:600;margin-bottom:8px;}
.l27-custom-required{color:#d11a2a;margin-left:4px;}

.l27-custom-options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
@media (min-width:900px){.l27-custom-options{grid-template-columns:repeat(3,1fr);}}

.l27-custom-field > label { text-align: center; display: block; width: 100%; margin-bottom: 12px; }
label.l27-custom-btn{border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:18px 18px !important;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;min-height:44px;font-weight:600;color:#111827;user-select:none;margin-bottom:0;}
label.l27-custom-btn input{display:none;}
label.l27-custom-btn:hover{border-color:#206d69;background:#e1f2ef;}
label.l27-custom-btn.selected{border-color:#206d69;background:#206d69 !important;color:#ffffff !important;box-shadow:none;}
label.l27-custom-btn.selected span{color:#ffffff !important;}

.l27-custom-other-input{margin-top:10px;width:100%;max-width:520px;display:none;}

/* ===== Promo code (summary) ===== */
.l27-promo-section{padding:8px 0;}
.l27-promo-title{font-weight:600;font-size:14px;margin-bottom:8px;}
.l27-promo-controls{display:flex;gap:8px;align-items:center;}
.l27-promo-input{flex:1;padding:10px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;}
.l27-promo-btn{padding:10px 14px;border-radius:6px;border:1px solid #206d69;background:#206d69;color:#fff;font-weight:600;cursor:pointer;}
.l27-promo-btn.is-remove{background:#111;border-color:#111;}
.l27-promo-msg{margin-top:8px;font-size:13px;color:#206d69;}
.l27-promo-msg.is-error{color:#b42318;}

/* --- Housekeep-like mobile top bar (sticky) --- */
@media (max-width: 520px) {
  #l27-booking-form-container {
    --l27-mobile-topbar: 56px;
    padding-top: var(--l27-mobile-topbar);
  }

  .l27-mobile-summary-header {
    padding: 10px 14px;
    height: var(--l27-mobile-topbar);
    box-shadow: 0 1px 0 rgba(0,0,0,0.06);
  }

  .l27-mobile-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .l27-mobile-logo {
    height: 22px;
    width: auto;
    display: block;
  }

  .l27-mobile-summary-toggle {
    background: transparent;
    border: none;
    padding: 0;
    min-width: auto;
    height: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .l27-mobile-summary-price {
    font-weight: 700;
  }

  .l27-mobile-summary-dropdown {
    top: var(--l27-mobile-topbar);
  }

  /* Steps directly under sticky header */
  .l27-steps-actions { display: none; }
  .l27-steps-header {
    position: sticky;
    top: var(--l27-mobile-topbar);
    z-index: 950;
    background: #fff;
    padding: 10px 0 12px;
    border-bottom: 1px solid #e5e5e5;
    margin: 0 0 18px;
  }
}

/* Step labels: desktop uses full text */
.l27-step-label-short{display:none;}
.l27-step-label-full{display:inline;}

/* Time slot grouping (Housekeep-like) */
.l27-time-groups{display:flex;flex-direction:column;gap:14px;margin-top:12px;}
.l27-time-group-title{font-weight:600;color:#111827;margin:0 0 10px 0;text-align:center;}
.l27-time-all-day .l27-time-slot{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;}
.l27-time-slot--wide{width:100%;}
.l27-time-slot--best{border-color:#206d69;box-shadow:0 8px 18px rgba(32,109,105,0.10);}
.l27-time-slot .l27-badge-best{margin-left:auto;background:#23c6b7;color:#fff;border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;white-space:nowrap;}
.l27-time-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.l27-time-col{display:flex;flex-direction:column;gap:10px;}
@media (max-width: 520px){
  .l27-time-columns{grid-template-columns:1fr 1fr;}
}



/* Custom Animated Checkbox Styling */
.terms-checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  text-align: left;
}
.custom-checkbox-input {
  position: absolute !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  pointer-events: none;
}
.custom-checkbox-label {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  cursor: pointer;
  user-select: none;
}
.custom-checkbox-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-shrink: 0;
  margin-top: 2px;
}
.custom-check-icon {
  width: 12px;
  height: 12px;
  color: #fff;
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
}
.custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box {
  background: #206d69;
  border-color: #206d69;
}
.custom-checkbox-input:checked + .custom-checkbox-label .custom-check-icon {
  stroke-dashoffset: 0;
}
.checkbox-text-label {
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.4;
  font-weight: 600;
}

/* --- React Custom Elements & Widgets (Clean Premium) --- */

.l27-frequency-card.locked {
  border-color: #e5e7eb;
}
.l27-frequency-card.locked:hover {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.l27-frequency-card-discount.is-locked {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
}

.l27-club-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #206d69;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.l27-wallet-widget {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #e1f2ef;
  border: 1px solid #d6e2e1;
  border-radius: 4px;
  padding: 12px 16px;
  margin: 12px 0;
  animation: wallet-glowing 2s infinite alternate;
}
@keyframes wallet-glowing {
  from {
    box-shadow: 0 0 4px rgba(32, 109, 105, 0.05);
    border-color: #d6e2e1;
  }
  to {
    box-shadow: 0 0 12px rgba(32, 109, 105, 0.15);
    border-color: #206d69;
  }
}
.l27-wallet-icon {
  font-size: 24px;
}
.l27-wallet-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.l27-wallet-title {
  font-weight: 800;
  color: #206d69;
  font-size: 13px;
}
.l27-wallet-sub {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.l27-sidebar-upsell-callout {
  display: flex;
  gap: 10px;
  background: #fff9e6;
  border: 1px dashed #fab901;
  border-radius: 4px;
  padding: 12px 16px;
  margin: 16px 0;
  align-items: flex-start;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}
.l27-sidebar-upsell-callout:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(250, 185, 1, 0.08);
  border-style: solid;
}
.l27-upsell-lightbulb {
  font-size: 18px;
  margin-top: 1px;
}
.l27-sidebar-upsell-callout p {
  margin: 0;
  font-size: 12px;
  color: #856404;
  line-height: 1.4;
}
.l27-upsell-link {
  display: inline-block;
  font-weight: 700;
  color: #206d69;
  text-decoration: underline;
  margin-left: 2px;
}

.l27-postcode-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 8px;
}
.l27-postcode-badge-icon {
  background-color: #166534;
  color: #fff;
  border-radius: 999px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.l27-step1-price-block {
  margin-top: 30px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.02);
}
.l27-price-block-placeholder {
  margin: 0;
  color: #6b7280;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 500;
}
.l27-price-block-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media(min-width: 600px) {
  .l27-price-block-content {
    flex-direction: row;
    gap: 32px;
  }
}
.l27-price-section-today, .l27-price-section-future {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.l27-price-section-today {
  border-right: none;
  padding-right: 0;
}
@media(min-width: 600px) {
  .l27-price-section-today.has-future {
    border-right: 1px dashed #cbd5e1;
    padding-right: 32px;
  }
}
.l27-price-label-top {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
}
.l27-price-primary {
  font-size: 2.2rem;
  font-weight: 850;
  color: #111827;
  line-height: 1.1;
  font-family: var(--font-display), "Bricolage Grotesque", sans-serif;
}
.l27-price-sub {
  font-size: 0.85rem;
  color: #206d69;
  font-weight: 500;
}
.l27-price-future-details {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 2px 0;
}

/* ==========================================================================
   Renbud Form Styling - Applied to Dealside Form Components
   ========================================================================== */

:root {
  --l27-primary: #206d69; /* Rich teal brand color */
  --l27-primary-light: #e1f2ef; /* Teal light tint */
  --l27-primary-active-bg: #f0fdf4; /* Clean light green active state from Renbud */
  --l27-border: #d1d5db; /* Cool gray border from Renbud */
  --l27-border-light: #e5e7eb; /* Lighter border from Renbud */
  --l27-bg-input: #ffffff; /* Input background from Renbud */
  --l27-bg-input-hover: #ffffff; /* Input hover background from Renbud */
  --l27-text-foreground: hsl(220, 20%, 12%);
  --l27-text-muted: hsl(220, 10%, 46%);
  --l27-radius-sm: 6px;
  --l27-radius-md: 8px;
  --l27-radius-lg: 12px;
  --l27-shadow-focus: 0 0 0 1px #206d69;
}

/* 1. Form Labels & Spacing */
.l27-field-group label,
.input-group label,
label.l27-field-group {
  font-family: var(--font-sans), sans-serif !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: var(--l27-text-foreground) !important;
  margin-bottom: 6px !important;
  display: block !important;
}

#l27-times-label {
  font-family: var(--font-sans), sans-serif !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: var(--l27-text-foreground) !important;
  margin-top: 32px !important;
  margin-bottom: 20px !important;
  display: block !important;
}

/* 2. Text / Number / Tel / Email Inputs */
#l27-booking-form input[type="text"],
#l27-booking-form input[type="email"],
#l27-booking-form input[type="number"],
#l27-booking-form input[type="date"],
#l27-booking-form input[type="tel"],
.input-group input,
#stripe-card-element {
  font-family: var(--font-sans), sans-serif !important;
  font-size: 0.9375rem !important; /* 15px */
  line-height: 1.5 !important;
  color: var(--l27-text-foreground) !important;
  background-color: var(--l27-bg-input) !important;
  border: 1px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-md) !important; /* 8px */
  padding: 10px 14px !important;
  width: 100% !important;
  height: 48px !important;
  transition: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Inputs Hover State */
#l27-booking-form input[type="text"]:hover,
#l27-booking-form input[type="email"]:hover,
#l27-booking-form input[type="number"]:hover,
#l27-booking-form input[type="date"]:hover,
#l27-booking-form input[type="tel"]:hover,
.input-group input:hover,
#stripe-card-element:hover {
  border-color: #9ca3af !important;
  background-color: var(--l27-bg-input-hover) !important;
}

/* Inputs Focus State */
#l27-booking-form input[type="text"]:focus,
#l27-booking-form input[type="email"]:focus,
#l27-booking-form input[type="number"]:focus,
#l27-booking-form input[type="date"]:focus,
#l27-booking-form input[type="tel"]:focus,
.input-group input:focus,
#stripe-card-element:focus-within {
  border-color: var(--l27-primary) !important;
  box-shadow: var(--l27-shadow-focus) !important;
  background-color: #ffffff !important;
  outline: none !important;
}

/* Inputs Disabled State */
#l27-booking-form input:disabled,
.input-group input:disabled {
  background-color: var(--l27-bg-input-hover) !important;
  color: var(--l27-text-muted) !important;
  cursor: not-allowed !important;
  opacity: 0.5 !important;
  border-color: var(--l27-border-light) !important;
}

/* Inputs Placeholder Color */
#l27-booking-form input::placeholder,
.input-group input::placeholder {
  color: var(--l27-text-muted) !important;
  opacity: 0.7 !important;
}

/* 3. Frequency & Choice Cards (Hvor ofte?) */
.l27-frequency-type-card {
  position: relative !important;
  padding: 24px !important;
  background: #ffffff !important;
  border: 1px solid var(--l27-border-light) !important;
  border-radius: var(--l27-radius-lg) !important; /* 12px */
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
  cursor: pointer !important;
}

/* Card Hover State */
.l27-frequency-type-card:hover {
  background-color: #f9fafb !important;
  border-color: var(--l27-border) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Card Selected State */
.l27-recurring-card.active,
.l27-oneoff-card.active {
  background-color: #ffffff !important;
  border: 1.5px solid var(--l27-primary) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Card Selected Hover State */
.l27-recurring-card.active:hover,
.l27-oneoff-card.active:hover {
  background-color: #f9fafb !important;
}

/* Best Badge */
.l27-best-badge {
  position: absolute !important;
  top: -12px !important;
  right: 24px !important;
  padding: 6px 16px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  background: var(--l27-primary) !important;
  color: #ffffff !important;
  border-radius: 20px !important;
  text-transform: capitalize !important;
}

/* 4. Inside Card Choice Options (Frequency buttons e.g. "Hver uge", "Hver 2. uge") */
.l27-freq-option {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 18px 18px !important;
  border: 1px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-md) !important; /* 8px */
  background-color: #ffffff !important;
  cursor: pointer !important;
  text-align: center !important;
  gap: 4px !important;
  transition: all 0.2s ease !important;
}

/* Frequency options Hover - #e1f2ef */
.l27-freq-option:hover {
  background-color: var(--l27-primary-light) !important; /* #e1f2ef */
  border-color: var(--l27-primary) !important;
  color: var(--l27-primary) !important;
}

/* Frequency options Selected */
.l27-freq-option.selected,
.l27-freq-option:has(input:checked) {
  background: var(--l27-primary) !important;
  border-color: var(--l27-primary) !important;
  color: #ffffff !important;
}

.l27-freq-option.selected .l27-freq-option-text,
.l27-freq-option:has(input:checked) .l27-freq-option-text {
  color: #ffffff !important;
}

.l27-freq-option.selected .l27-freq-discount,
.l27-freq-option:has(input:checked) .l27-freq-discount {
  color: rgba(255, 255, 255, 0.85) !important;
}

.l27-freq-option:hover .l27-freq-option-text {
  color: var(--l27-primary) !important;
}

/* 5. Extras Cards (Tilvalg) */
.l27-extra-card {
  border: 1px solid var(--l27-border-light) !important;
  border-radius: var(--l27-radius-lg) !important; /* 12px */
  padding: 16px !important;
  background: #ffffff !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
}

.l27-extra-card:hover {
  background-color: #f9fafb !important;
  border-color: var(--l27-border) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Checked/Highlighted State for Extra Card */
.l27-extra-card-highlight {
  background-color: var(--l27-primary-active-bg) !important; /* #f0fdf4 */
  border-color: var(--l27-primary) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Quantity Adjusters inside Extras */
.l27-qty-btn {
  width: 34px !important;
  height: 34px !important;
  border: 1px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-md) !important; /* 8px */
  background: #f9fafb !important;
  cursor: pointer !important;
  font-size: 18px !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.15s ease !important;
}
.l27-qty-btn:hover {
  background-color: #e5e7eb !important;
  border-color: #9ca3af !important;
}
.l27-qty-input {
  width: 72px !important;
  height: 34px !important;
  border: 1px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-md) !important; /* 8px */
  padding: 0 10px !important;
  text-align: center !important;
}

/* 6. Date Selection Tiles */
.l27-date-tile,
.dateCard,
.customDateCard {
  background: #ffffff !important;
  border: 1.5px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-lg) !important; /* 12px */
  padding: 10px 6px !important;
  min-height: 84px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  cursor: pointer !important;
  user-select: none !important;
  min-width: 68px !important;
  transition: all 0.2s ease !important;
}

.l27-date-tile:hover:not(:disabled),
.dateCard:hover:not(.dateCardActive),
.customDateCard:hover:not(.dateCardActive) {
  border-color: var(--l27-primary) !important;
  background-color: var(--l27-primary-light) !important; /* #e1f2ef */
}

/* Date tile selected */
.l27-date-tile.selected,
.dateCardActive {
  border: 1.5px solid var(--l27-primary) !important;
  background: var(--l27-primary) !important;
  background-color: var(--l27-primary) !important;
  box-shadow: 0 4px 10px rgba(32, 109, 105, 0.06) !important;
}

.l27-date-tile.selected .day-name,
.dateCardActive .dateCardDayName {
  color: #ffffff !important;
  font-weight: 700 !important;
}

.l27-date-tile.selected .day-num,
.dateCardActive .dateCardNumber,
.dateCardActive .dateCardNumberCustom {
  color: #ffffff !important;
}

.l27-date-tile.selected .day-month,
.dateCardActive .dateCardMonth {
  color: #ffffff !important;
  opacity: 0.9 !important;
}

.l27-time-slot {
  position: relative !important;
  padding: 18px 18px !important;
  text-align: center !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  border: 1.5px solid var(--l27-border) !important;
  border-radius: var(--l27-radius-md) !important; /* 8px or 10px */
  cursor: pointer !important;
  background: #ffffff !important;
  color: var(--l27-text-foreground) !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.l27-time-slot:hover {
  border-color: var(--l27-primary) !important;
  background-color: var(--l27-primary-light) !important; /* #e1f2ef */
  color: var(--l27-primary) !important;
}

.l27-time-slot.selected {
  border-color: var(--l27-primary) !important;
  background: var(--l27-primary) !important;
  background-color: var(--l27-primary) !important;
  color: #ffffff !important;
}

.l27-time-slot.selected .l27-time-slot-title,
.l27-time-slot.selected .l27-time-slot-text,
.l27-time-slot.selected .l27-time-slot-range {
  color: #ffffff !important;
}

/* Wide time slots */
.l27-time-slot--wide {
  justify-content: space-between !important;
  padding: 18px 18px !important;
  text-align: left !important;
}

/* Best slot badge absolute positioning (right aligned on top line) */
.l27-badge-best {
  position: absolute !important;
  top: -12px !important;
  right: 24px !important;
  left: auto !important;
  transform: none !important;
  background: var(--l27-primary) !important;
  color: #ffffff !important;
  border-radius: 20px !important;
  padding: 4px 14px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
  margin-left: 0 !important;
  z-index: 10 !important;
}

/* 8. Terms Checkbox (Renbud Style Custom Checkbox) */
.custom-checkbox-container {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  margin-top: 18px !important;
  text-align: left !important;
}
.custom-checkbox-input {
  position: absolute !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  pointer-events: none !important;
}
.custom-checkbox-label {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  cursor: pointer !important;
  user-select: none !important;
}
.custom-checkbox-box {
  width: 24px !important; /* 24px from Renbud CustomCheckbox */
  height: 24px !important; /* 24px from Renbud CustomCheckbox */
  border: 2px solid var(--l27-border) !important; /* 2px solid from Renbud */
  border-radius: 6px !important; /* 6px from Renbud */
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #ffffff !important;
  flex-shrink: 0 !important;
  margin-top: 1px !important;
  transition: all 0.2s ease !important;
  color: #ffffff !important;
}
.custom-check-icon {
  width: 14px !important; /* 14px checkmark icon */
  height: 14px !important;
  color: #ffffff !important;
  stroke-dasharray: 22 !important;
  stroke-dashoffset: 22 !important;
}
.custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box {
  background-color: var(--l27-primary) !important;
  border-color: var(--l27-primary) !important;
}
.custom-checkbox-input:checked + .custom-checkbox-label .custom-check-icon {
  stroke-dashoffset: 0 !important;
}
.checkbox-text-label {
  font-size: 0.9375rem !important; /* 15px from Renbud */
  color: var(--l27-text-foreground) !important;
  line-height: 1.4 !important;
  font-weight: 600 !important;
}

/* 9. Packages Cards & Cleaners Cards (Used on page layout if any) */
.package-card,
.cleaner-card {
  border: 1px solid var(--l27-border-light) !important;
  border-radius: var(--l27-radius-lg) !important; /* 12px */
  padding: 18px !important;
  background: #ffffff !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}
.package-card:hover,
.cleaner-card:hover {
  background-color: #f9fafb !important;
  border-color: var(--l27-border) !important;
}
.package-card.active,
.cleaner-card.active {
  background-color: var(--l27-primary-active-bg) !important; /* #f0fdf4 */
  border-color: var(--l27-primary) !important;
}

/* Golden membership card */
:root {
  --glitter-gold: url("https://assets.codepen.io/13471/silver-glitter-background.png");
  --duration-gold: 6.66s;
}

.l27-gold-card-wrapper {
  perspective: 1000px;
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.gold-card-front {
  display: grid;
  position: relative;
  transform: translate3d(0, 0, 0.01px);
  
  height: 200px;
  width: 300px;
  aspect-ratio: 3/2;
  border-radius: 12px;

  /* Rich metallic gold gradient base */
  background: linear-gradient(135deg, #9a3412 0%, #d97706 20%, #f59e0b 40%, #fef08a 60%, #d97706 80%, #7c2d12 100%);
  background-size: cover;

  box-shadow: 
    0 15px 30px -8px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(254, 240, 138, 0.3);
  overflow: hidden;
  animation: tilt-gold var(--duration-gold) ease infinite;
  image-rendering: optimizequality;
}

/* Glitter and sheen overlays */
.gold-card-front:before {
  content: "";
  inset: 0;
  position: absolute;
  transform: translate3d(0, 0, 0.01px);
  pointer-events: none;

  background-image: var(--glitter-gold), var(--glitter-gold),
    linear-gradient(120deg, #7c2d12 25%, #ffffff 50%, #7c2d12 75%);
  background-size: 100% 100%, 80% 80%, 200% 200%;
  background-blend-mode: multiply, multiply, overlay;
  background-position: 50% 50%, 50% 50%, 50% 50%;

  mix-blend-mode: color-dodge;
  filter: brightness(1.7) contrast(1.3);
  animation: bg-gold var(--duration-gold) ease infinite;
}

.gold-card-front:after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: none, none, linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.4) 0.1%, rgba(255,255,255,0) 60%);
  background-size: 200% 200%;
  mix-blend-mode: hard-light;
  animation: bg-gold var(--duration-gold) ease infinite;
}

.gold-card-front * {
  font-family: 'Courier New', Courier, monospace !important;
  font-weight: bold !important;
}

.gold-card-logo,
.gold-card-expiry,
.gold-card-name,
.gold-card-number,
.gold-card-chip {
  position: absolute;
  margin: 0;
  padding: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.65rem;
  inset: 6%;
  text-shadow: 
    -1px -1px 0px rgba(255,255,255,0.4),
    1px -1px 0px rgba(255,255,255,0.4),
    1px 1px 0px rgba(0,0,0,0.6),
    -1px 1px 0px rgba(0,0,0,0.6);
  z-index: 5;
}

.gold-card-name, .gold-card-number, .gold-card-expiry {
  background-image: 
    linear-gradient(to bottom, #ffffff 10%, #fef08a 40%, #b45309 90%), 
    none,
    linear-gradient(120deg, transparent 10%, white 40%, white 60%, transparent 90%);
  background-size: cover, cover, 200%;
  background-position: 50% 50%;
  background-blend-mode: overlay;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  animation: bg-gold var(--duration-gold) ease infinite;
}

.gold-card-number {
  text-align: center;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  top: 55%;
  bottom: auto;
  width: 88%;
}

.gold-card-expiry,
.gold-card-name {
  top: auto;
}

.gold-card-name {
  right: auto;
  max-width: 160px;
  line-height: 1.2;
  text-align: left;
  font-size: 0.65rem;
}

.gold-card-expiry {
  left: auto;
  font-size: 0.65rem;
}

.gold-card-logo {
  bottom: auto;
  left: auto;
  width: 14%;
  filter: invert(1) saturate(0) brightness(1.2) contrast(1.2);
  mix-blend-mode: screen;
}

.gold-card-chip {
  display: grid;
  place-items: center;
  width: 12%;
  aspect-ratio: 5/4;
  left: 10%;
  top: 25%;
  border-radius: 4px;
  background-image: none, none,
    linear-gradient(120deg, #7c2d12 10%, #fef08a 40%, #ffffff 65%, #d97706 90%);
  background-size: 200% 200%;
  background-position: 50% 50%;
  overflow: hidden;
  animation: bg-gold var(--duration-gold) ease infinite;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.gold-card-chip svg {
  display: block;
  width: 90%;
  fill: none;
  stroke: #7c2d12;
  stroke-width: 2.5;
}

.gold-card-contactless {
  position: absolute;
  left: 24%;
  top: 25%;
  width: 10%;
}

.gold-card-contactless svg {
  transform: rotate(90deg);
  stroke-width: 2.25;
  stroke: #fef08a;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.85;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5));
}

@keyframes tilt-gold {
  0%, 100% { transform: translate3d(0, 0, 0.01px) rotateY(-12deg) rotateX(4deg); }
  50% { transform: translate3d(0, 0, 0.01px) rotateY(12deg) rotateX(4deg); }
}

@keyframes bg-gold {
  0%, 100% { background-position: 50% 50%, calc(50% + 1px) calc(50% + 1px), 0% 50%; }
  50% { background-position: 50% 50%, calc(50% - 1px) calc(50% - 1px), 100% 50%; }
}
`;

