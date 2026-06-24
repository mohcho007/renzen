/** Renzen platform economics — 20% Renzen / 80% Zenmester (sub). */
import {
  INTRO_CLEANING_FROM_KR,
  KLUB_ANNUAL_KR,
  listPriceKr,
  pricingConfig,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";

export { KLUB_ANNUAL_KR, ZEN_CREDIT_ANNUAL_KR, ZEN_CREDIT_MONTHLY_KR };

export const RENZEN_MARGIN = 0.2;
/** Alternative scenario — 30% Renzen / 70% Zenmester (sub). */
export const ALTERNATIVE_MARGIN_30 = 0.3;
export const FLYTTERENGORING_KR = 3_000;
export const FLYT_PARTNER_KR = 5_000;
export const BUNDLE_DISCOUNT_KR = 400;

export type DealCategory = "alle" | "rengoring" | "flyt" | "have" | "erhverv";

export type DealEconomics = {
  /** Display label for customer-facing price */
  customerPriceLabel: string;
  customerPriceKr: number;
  /** Renzen brutto at 20% of customer payment */
  renzenGrossKr: number;
  /** How Klub membership contributes */
  klubContribution: string;
  /** Strategic purpose */
  purpose: string;
  /** Optional calculation notes for owner review */
  notes?: string;
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  code?: string;
  category: Exclude<DealCategory, "alle">;
  ctaLabel: string;
  ctaHref: string;
  klubGated: boolean;
  featured?: boolean;
  economics: DealEconomics;
};

export const DEAL_CATEGORIES: { id: DealCategory; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "rengoring", label: "Rengøring" },
  { id: "flyt", label: "Flyt" },
  { id: "have", label: "Have" },
  { id: "erhverv", label: "Erhverv" },
];

function margin(amount: number): number {
  return Math.round(amount * RENZEN_MARGIN);
}

/** Introtilbud — fra INTRO_CLEANING_FROM_KR (Lille bolig tier efter velkomstkredit) */
const introPrice = INTRO_CLEANING_FROM_KR;

/** Flyt + rengøring bundle — 8.000 kr. minus 400 kr. Klub-rabat */
const bundleList = FLYTTERENGORING_KR + FLYT_PARTNER_KR;
const bundleCustomer = bundleList - BUNDLE_DISCOUNT_KR;

/** Flytterengøring 10% rabat */
const flytterDiscounted = Math.round(FLYTTERENGORING_KR * 0.9);

/** Hovedrengøring engangstilbud — ca. 15% under typisk engangspris ~1.950 kr. */
const hovedrengoringOffer = 1_650;

/** Havearbejde sæson — ca. 15% under typisk første besøg ~1.000 kr. */
const havearbejdeOffer = 850;

/** Erhverv intro — typisk kontorrengøring engangsbesøg */
const erhvervIntro = 2_400;

export const DEALS: Deal[] = [
  {
    id: "introtilbud",
    title: "Introtilbud — Renzen Klub",
    description:
      `Første rengøring fra ${INTRO_CLEANING_FROM_KR} kr. ved fast rengøring hver 2. uge og aktivt Klub-medlemskab. Normalpris fra ${listPriceKr(70).toLocaleString("da-DK")} kr.`,
    discountLabel: `Fra ${INTRO_CLEANING_FROM_KR} kr.`,
    category: "rengoring",
    ctaLabel: "Book introtilbud",
    ctaHref: "/dealpage2",
    klubGated: true,
    featured: true,
    economics: {
      customerPriceLabel: `Fra ${INTRO_CLEANING_FROM_KR} kr. (intro)`,
      customerPriceKr: introPrice,
      renzenGrossKr: margin(introPrice),
      klubContribution: `${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr./år medlemskab`,
      purpose: "CAC — konverterer nye kunder til Klub og fast rengøring",
      notes:
        `Intro er tabsgivende vs. normalpris (~${listPriceKr(70)} kr.). LTV dækkes via medlemskab og løbende besøg.`,
    },
  },
  {
    id: "flyt-rengoring-bundle",
    title: "Flyt + rengøring",
    description:
      "Book flytterengøring og flytning sammen. Klub-medlemmer sparer 400 kr. på kurven — som Fantastic EOTREM150 på en ~8.000 kr. kurv.",
    discountLabel: "Spar 400 kr.",
    code: "BUNDLE400",
    category: "flyt",
    ctaLabel: "Se flytterengøring",
    ctaHref: "/flytterengoring",
    klubGated: true,
    featured: true,
    economics: {
      customerPriceLabel: `${bundleCustomer.toLocaleString("da-DK")} kr. (efter rabat)`,
      customerPriceKr: bundleCustomer,
      renzenGrossKr: margin(bundleCustomer),
      klubContribution: "Rabat kræver aktivt Klub-medlemskab",
      purpose: "AOV — hæver kurv og cross-sælger rengøring + flyt",
      notes: `Listepris ${bundleList.toLocaleString("da-DK")} kr. (${FLYTTERENGORING_KR.toLocaleString("da-DK")} + ${FLYT_PARTNER_KR.toLocaleString("da-DK")}). Rabat ${BUNDLE_DISCOUNT_KR} kr.`,
    },
  },
  {
    id: "dobbelt-service-kredit",
    title: "Book 2 services — ekstra kredit",
    description:
      "Book to forskellige services inden for 30 dage og få 300 kr. ekstra Zen-kredit — oven i dine månedlige Klub-kreditter.",
    discountLabel: "+300 kr. kredit",
    category: "rengoring",
    ctaLabel: "Se Renzen Klub",
    ctaHref: "/klub/",
    klubGated: true,
    economics: {
      customerPriceLabel: "0 kr. (kredit, ikke kontant)",
      customerPriceKr: 0,
      renzenGrossKr: 0,
      klubContribution: `Finansieres via Klub-pulje (${ZEN_CREDIT_MONTHLY_KR} kr./md. × ${ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR})`,
      purpose: "LTV / retention — driver gentagne bookinger på tværs af kategorier",
      notes:
        "Kredit er pass-through fra medlemsfordele; margin kommer på efterfølgende fuldt prissatte bookinger.",
    },
  },
  {
    id: "flytterengoring-flyt10",
    title: "Flytterengøring — 10% rabat",
    description:
      "Grundig flytterengøring til 2.700 kr. med koden FLYT10. Klub-medlemmer kan også aktivere rabatten uden kode.",
    discountLabel: "10% rabat",
    code: "FLYT10",
    category: "rengoring",
    ctaLabel: "Book flytterengøring",
    ctaHref: "/flytterengoring/book",
    klubGated: false,
    economics: {
      customerPriceLabel: `${flytterDiscounted.toLocaleString("da-DK")} kr.`,
      customerPriceKr: flytterDiscounted,
      renzenGrossKr: margin(flytterDiscounted),
      klubContribution: "Valgfri Klub-gentagelse uden kode",
      purpose: "Konvertering — flyttekunder med høj intent",
      notes: `Normalpris ${FLYTTERENGORING_KR.toLocaleString("da-DK")} kr. Rabat 300 kr.`,
    },
  },
  {
    id: "hovedrengoring-engang",
    title: "Hovedrengøring — engangstilbud",
    description:
      "Dybdegående hovedrengøring med afkalkning, paneler og svært tilgængelige steder. Engangstilbud til 1.650 kr.",
    discountLabel: "Engangstilbud",
    category: "rengoring",
    ctaLabel: "Få tilbud",
    ctaHref: "/hovedrengoring/forespoergsel",
    klubGated: false,
    economics: {
      customerPriceLabel: `${hovedrengoringOffer.toLocaleString("da-DK")} kr.`,
      customerPriceKr: hovedrengoringOffer,
      renzenGrossKr: margin(hovedrengoringOffer),
      klubContribution: "Klub-kredit kan bruges på udvalgte tillægsydelser",
      purpose: "AOV — upsell fra privat rengøring til dyb rengøring",
    },
  },
  {
    id: "havearbejde-saeson",
    title: "Havearbejde — sæsontilbud",
    description:
      "Forårsklargøring, græsslåning og hækklipning fra 850 kr. første besøg. Zen-kreditter kan bruges som Klub-medlem.",
    discountLabel: "Sæsonstart",
    category: "have",
    ctaLabel: "Få tilbud på havearbejde",
    ctaHref: "/havearbejde/forespoergsel",
    klubGated: false,
    economics: {
      customerPriceLabel: `Fra ${havearbejdeOffer.toLocaleString("da-DK")} kr.`,
      customerPriceKr: havearbejdeOffer,
      renzenGrossKr: margin(havearbejdeOffer),
      klubContribution: `${ZEN_CREDIT_MONTHLY_KR} kr./md. Zen-kredit som Klub-medlem`,
      purpose: "Sæson-CAC — udvider kundens serviceportefølje",
    },
  },
  {
    id: "erhverv-intro",
    title: "Erhverv — første kontorbesøg",
    description:
      "Intropris på første kontorrengøring til 2.400 kr. for kontorer op til 150 m². Fast aftale og Klub-fordele kan tilkøbes.",
    discountLabel: "Erhvervsintro",
    category: "erhverv",
    ctaLabel: "Kontakt erhverv",
    ctaHref: "/erhvervsrengoring",
    klubGated: false,
    economics: {
      customerPriceLabel: `${erhvervIntro.toLocaleString("da-DK")} kr.`,
      customerPriceKr: erhvervIntro,
      renzenGrossKr: margin(erhvervIntro),
      klubContribution: "Separat erhvervsaftale; Klub primært privat",
      purpose: "B2B pipeline — høj kurv og gentagelse",
    },
  },
];

export const MARGIN_MODEL = {
  renzenShare: "20%",
  partnerShare: "80%",
  klubAnnual: KLUB_ANNUAL_KR,
  zenCreditsAnnual: ZEN_CREDIT_ANNUAL_KR,
  introFrom: introPrice,
} as const;

/** Model A — Zen-kredit funded by Renzen/Klub; partner payout = 80% of agreed list price. */
const ZEN_CREDIT_EXAMPLE_LIST_KR = 1_000;

export const ZEN_CREDIT_PARTNER_MODEL = {
  modelLabel: "Model A",
  title: "Zen-kredit & partnerudbetaling",
  summary:
    "Kredit finansieres af Renzen/Klub. Zenmestre og partnere får 80% af aftalt listepris — uafhængigt af kundens kontantbetaling.",
  points: [
    "Zen-kredit reducerer kundens kontantbetaling — ikke Zenmesterens udbetaling",
    `Eksempel: ${ZEN_CREDIT_EXAMPLE_LIST_KR.toLocaleString("da-DK")} kr. job, ${ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr. kredit → kunde betaler ${(ZEN_CREDIT_EXAMPLE_LIST_KR - ZEN_CREDIT_MONTHLY_KR).toLocaleString("da-DK")} kr., Zenmester får 80% af ${ZEN_CREDIT_EXAMPLE_LIST_KR.toLocaleString("da-DK")} = ${Math.round(ZEN_CREDIT_EXAMPLE_LIST_KR * (1 - RENZEN_MARGIN)).toLocaleString("da-DK")} kr.`,
    `Renzen dækker kredit fra Klub-puljen (${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr./år medlemskab)`,
    "Kredit er loyalitets-/marketingudgift — ikke omsætning pr. booking",
    "Regel: 80% × aftalt listepris, uanset kredit",
  ],
  example: {
    listPriceKr: ZEN_CREDIT_EXAMPLE_LIST_KR,
    creditKr: ZEN_CREDIT_MONTHLY_KR,
    customerPaysKr: ZEN_CREDIT_EXAMPLE_LIST_KR - ZEN_CREDIT_MONTHLY_KR,
    partnerPayoutKr: Math.round(ZEN_CREDIT_EXAMPLE_LIST_KR * (1 - RENZEN_MARGIN)),
  },
} as const;

export type CreditUsageRow = {
  service: string;
  shareLabel: string;
  sharePct: number;
  krPerYear: number;
  typicalJobKr: number;
};

/** Realistisk kreditforbrug — typisk Klub-medlem bruger 7/12 kreditter, ikke fuld pulje. */
const CREDITS_ANNUAL_COUNT = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;
const CREDITS_USED_COUNT = 7;
const CREDITS_USED_KR = ZEN_CREDIT_MONTHLY_KR * CREDITS_USED_COUNT;
const CREDITS_UNUSED_KR = ZEN_CREDIT_MONTHLY_KR * (CREDITS_ANNUAL_COUNT - CREDITS_USED_COUNT);

const CREDIT_USAGE_SHARES: Omit<CreditUsageRow, "krPerYear">[] = [
  { service: "Havearbejde", shareLabel: "25–35%", sharePct: 0.3, typicalJobKr: 850 },
  { service: "Vinduespudsning", shareLabel: "20–25%", sharePct: 0.225, typicalJobKr: 750 },
  { service: "Hovedrengøring", shareLabel: "15–20%", sharePct: 0.175, typicalJobKr: 1_650 },
  { service: "Handyman", shareLabel: "10–15%", sharePct: 0.125, typicalJobKr: 900 },
  { service: "Møbelrens", shareLabel: "5–10%", sharePct: 0.075, typicalJobKr: 1_200 },
  { service: "Flyt / Airbnb", shareLabel: "5–10%", sharePct: 0.075, typicalJobKr: 2_700 },
];

export const REALISTIC_CREDIT_USAGE = {
  title: "Realistisk kreditforbrug",
  summary:
    `De fleste medlemmer bruger ikke alle ${CREDITS_ANNUAL_COUNT} kreditter. Et realistisk mønster er ${CREDITS_USED_COUNT}/${CREDITS_ANNUAL_COUNT} kreditter = ${CREDITS_USED_KR.toLocaleString("da-DK")} kr./år i faktisk forbrug — ikke ${ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr.`,
  creditsUsedCount: CREDITS_USED_COUNT,
  creditsUsedKr: CREDITS_USED_KR,
  creditsUnusedKr: CREDITS_UNUSED_KR,
  creditsTotalKr: ZEN_CREDIT_ANNUAL_KR,
  unusedShareLabel: "15–25%",
  unusedSharePct: 0.2,
  rows: CREDIT_USAGE_SHARES.map((row) => ({
    ...row,
    krPerYear: Math.round(CREDITS_USED_KR * row.sharePct),
  })),
  footnote:
    "Kredit bruges typisk på tillægsydelser og sæsonjobs — ikke på fast rengøring, som finansieres kontant med frekvensrabat.",
} as const;

export type EarningsScenarioLine = {
  label: string;
  amountKr: number;
  detail?: string;
  emphasis?: "positive" | "negative" | "neutral";
};

/** Fast rengøring: ~12 besøg/år × 800 kr. efter frekvensrabat → 9.600 kr. kundebetaling, 20% = 1.920 kr. */
const FAST_CLEANING_BOOKINGS = 12;
const FAST_CLEANING_PRICE_KR = 800;
const FAST_CLEANING_CUSTOMER_KR = FAST_CLEANING_BOOKINGS * FAST_CLEANING_PRICE_KR;
const FAST_CLEANING_RENZEN_KR = Math.round(FAST_CLEANING_CUSTOMER_KR * RENZEN_MARGIN);

/** Kredit-subsidie: 7 × monthly kredit brutto; netto efter delvis 20%-margin på kreditjobs. */
const CREDIT_SUBSIDY_GROSS_KR = CREDITS_USED_KR;
const CREDIT_SUBSIDY_NET_LOW_KR = 1_500;
const CREDIT_SUBSIDY_NET_HIGH_KR = CREDIT_SUBSIDY_GROSS_KR;

/** Break-even: listepris-booking/år der dækker fuld kredit-hul ved 20% margin. */
const BREAK_EVEN_LIST_BOOKING_KR = 10_050;

const NET_WITH_CLEANING_LOW_KR =
  KLUB_ANNUAL_KR + FAST_CLEANING_RENZEN_KR - CREDIT_SUBSIDY_NET_HIGH_KR;
const NET_WITH_CLEANING_HIGH_KR =
  KLUB_ANNUAL_KR + FAST_CLEANING_RENZEN_KR - CREDIT_SUBSIDY_NET_LOW_KR;
const NET_KLUB_ONLY_LOW_KR = KLUB_ANNUAL_KR - CREDIT_SUBSIDY_NET_HIGH_KR;
const NET_KLUB_ONLY_HIGH_KR = KLUB_ANNUAL_KR - CREDIT_SUBSIDY_NET_LOW_KR;

export const REALISTIC_EARNINGS = {
  title: "Realistisk indtjeningskort",
  summary:
    "Renzen tager 20% af kundebetaling efter frekvensrabat (20%/15%/5%) — derefter 80% til Zenmester. Kredit er marketingudgift oven i margin.",
  marginNote: "20% Renzen / 80% Zenmester — beregnet efter frekvensrabat på fast rengøring",
  scenarioTitle: "Realistisk medlem pr. år",
  lines: [
    {
      label: "Klub-medlemskab",
      amountKr: KLUB_ANNUAL_KR,
      detail: "Fast årlig indtægt",
      emphasis: "positive",
    },
    {
      label: "Fast rengøring — 20% margin",
      amountKr: FAST_CLEANING_RENZEN_KR,
      detail: `${FAST_CLEANING_BOOKINGS} besøg × ${FAST_CLEANING_PRICE_KR.toLocaleString("da-DK")} kr. efter rabat = ${FAST_CLEANING_CUSTOMER_KR.toLocaleString("da-DK")} kr. kundebetaling`,
      emphasis: "positive",
    },
    {
      label: "Minus kredit-subsidie (netto)",
      amountKr: -CREDIT_SUBSIDY_NET_HIGH_KR,
      detail: `${CREDITS_USED_COUNT} × ${ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr. kredit — netto efter delvis 20% margin på kreditjobs: ca. ${CREDIT_SUBSIDY_NET_LOW_KR.toLocaleString("da-DK")}–${CREDIT_SUBSIDY_NET_HIGH_KR.toLocaleString("da-DK")} kr.`,
      emphasis: "negative",
    },
  ] satisfies EarningsScenarioLine[],
  creditSubsidyRangeKr: {
    low: CREDIT_SUBSIDY_NET_LOW_KR,
    high: CREDIT_SUBSIDY_NET_HIGH_KR,
  },
  netWithCleaningKr: {
    low: NET_WITH_CLEANING_LOW_KR,
    high: NET_WITH_CLEANING_HIGH_KR,
  },
  withoutCleaning: {
    title: "Uden fast rengøring",
    summary: "Klub-medlem uden løbende rengøring taber penge på kreditpuljen alene.",
    netKr: { low: NET_KLUB_ONLY_LOW_KR, high: NET_KLUB_ONLY_HIGH_KR },
  },
  withCleaning: {
    title: "Med fast rengøring",
    summary: "Løbende rengøring dækker kredit-hullet og giver positiv netto pr. medlem.",
    netKr: { low: NET_WITH_CLEANING_LOW_KR, high: NET_WITH_CLEANING_HIGH_KR },
  },
  breakEven: {
    listBookingKr: BREAK_EVEN_LIST_BOOKING_KR,
    detail: `Ca. ${BREAK_EVEN_LIST_BOOKING_KR.toLocaleString("da-DK")} kr. i listepris-bookinger/år (20% margin) dækker fuldt kredit-hul på ${CREDIT_SUBSIDY_GROSS_KR.toLocaleString("da-DK")} kr.`,
  },
} as const;

/** Bi-weekly recurring: ~26 besøg/år → 2,17 bookinger pr. kunde/md. */
export const BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH = 2.17;

export const RENZEN_MONTHLY_TARGET_KR = 50_000;

/** Dashboard Mar–Jun 2026 baseline */
export const DASHBOARD_BASELINE = {
  bookingsPerMonth: 26,
  avgSaleKr: 718,
  recurringCustomers: 16,
  biweeklySharePct: 93,
  biweeklyDiscountPct: 15,
} as const;

/** Prisliste: 245 kr. + PRICING_PER_SQM_KR kr./m² */
export const PRICING_BASE_KR = pricingConfig.basePrice;
export const PRICING_PER_SQM_KR = pricingConfig.pricePerSqm;

export function listPriceForSqm(sqm: number): number {
  return listPriceKr(sqm);
}

const NEW_PRICE_80_SQM = 80;
const NEW_PRICE_80_LIST_KR = listPriceForSqm(NEW_PRICE_80_SQM);
const NEW_PRICE_80_BIWEEKLY_DISCOUNT_PCT = 15;

/** Listepris ved 80 m², −15% hver 2. uge */
export const NEW_PRICING_80M2 = {
  baseKr: PRICING_BASE_KR,
  perSqmKr: PRICING_PER_SQM_KR,
  sqm: NEW_PRICE_80_SQM,
  listKr: NEW_PRICE_80_LIST_KR,
  afterBiweeklyDiscountKr: Math.round(
    NEW_PRICE_80_LIST_KR * (1 - NEW_PRICE_80_BIWEEKLY_DISCOUNT_PCT / 100),
  ),
  biweeklyDiscountPct: NEW_PRICE_80_BIWEEKLY_DISCOUNT_PCT,
} as const;

/** Realistisk kredit-subsidie pr. aktivt medlem/md. */
const CREDIT_SUBSIDY_MONTHLY_KR = 175;

/**
 * BOOKING_NET_MODEL — Renzen indtægt pr. booking efter moms (25%) og Stripe (1,4% + 1,80 kr.).
 *
 * ```
 * exMoms = booking / 1.25
 * renzenBrutto = exMoms × 0.20
 * stripeShare = (booking × 0.014 + 1.80) × 0.20   // platformens 20% andel af Stripe
 * renzenNet = renzenBrutto − stripeShare
 * ```
 *
 * Afrundes til hele kr. Eksempler: 718 kr. → brutto ~115, net ~112 · 752 kr. → brutto ~120, net ~117.
 */
export const BOOKING_NET_MODEL = {
  vatRate: 0.25,
  vatDivisor: 1.25,
  renzenShare: RENZEN_MARGIN,
  stripePct: 0.014,
  stripeFixedKr: 1.8,
  stripePlatformShare: RENZEN_MARGIN,
  assumptions: [
    "Kundebetaling inkl. 25% moms",
    "Renzen margin beregnes ex moms (20% af beløb ex moms)",
    "Stripe: 1,4% + 1,80 kr. pr. transaktion — Renzen bærer 20% (platformens andel)",
    "Zenmester/partner udbetaling påvirkes ikke af Stripe-gebyr i denne model",
  ],
} as const;

export function renzenBruttoFromBookingAtMargin(
  bookingKr: number,
  margin: number = RENZEN_MARGIN,
): number {
  return Math.round((bookingKr / BOOKING_NET_MODEL.vatDivisor) * margin);
}

export function renzenNetFromBookingAtMargin(
  bookingKr: number,
  margin: number = RENZEN_MARGIN,
): number {
  const exMoms = bookingKr / BOOKING_NET_MODEL.vatDivisor;
  const renzenBrutto = exMoms * margin;
  const stripeShare =
    (bookingKr * BOOKING_NET_MODEL.stripePct + BOOKING_NET_MODEL.stripeFixedKr) *
    margin;
  return Math.floor(renzenBrutto - stripeShare);
}

export function renzenBruttoFromBooking(bookingKr: number): number {
  return renzenBruttoFromBookingAtMargin(bookingKr, RENZEN_MARGIN);
}

export function renzenNetFromBooking(bookingKr: number): number {
  return renzenNetFromBookingAtMargin(bookingKr, RENZEN_MARGIN);
}

export function bookingNetBreakdown(bookingKr: number) {
  const exMomsKr = bookingKr / BOOKING_NET_MODEL.vatDivisor;
  const renzenBruttoKr = renzenBruttoFromBooking(bookingKr);
  const stripeFeeKr =
    bookingKr * BOOKING_NET_MODEL.stripePct + BOOKING_NET_MODEL.stripeFixedKr;
  const stripeShareKr = Math.round(stripeFeeKr * BOOKING_NET_MODEL.stripePlatformShare);
  const renzenNetKr = renzenNetFromBooking(bookingKr);
  return {
    bookingKr,
    exMomsKr,
    renzenBruttoKr,
    stripeFeeKr,
    stripeShareKr,
    renzenNetKr,
  };
}

/** Inverse of renzenNetFromBookingAtMargin — kundebetaling der giver mål-netto pr. booking. */
export function bookingKrForTargetNetAtMargin(
  targetNetKr: number,
  margin: number = RENZEN_MARGIN,
): number {
  let lo = 0;
  let hi = 10_000;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (renzenNetFromBookingAtMargin(mid, margin) < targetNetKr) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}

/** Inverse of renzenNetFromBooking — kundebetaling der giver mål-netto pr. booking. */
export function bookingKrForTargetNet(targetNetKr: number): number {
  return bookingKrForTargetNetAtMargin(targetNetKr, RENZEN_MARGIN);
}

/** Renzen-andel (ex moms, inkl. Stripe-andel) der giver mål-netto ved given kundebetaling. */
export function marginShareForTargetNet(
  bookingKr: number,
  targetNetKr: number,
): number {
  const exMoms = bookingKr / BOOKING_NET_MODEL.vatDivisor;
  const stripeBase =
    bookingKr * BOOKING_NET_MODEL.stripePct + BOOKING_NET_MODEL.stripeFixedKr;
  const netBase = exMoms - stripeBase;
  if (netBase <= 0) return 0;
  return targetNetKr / netBase;
}

/** Netto Klub-bidrag pr. aktivt medlem/md. (net rengøringsmargin + medlemskab − kredit-subsidie). */
export const KLUB_MEMBER_NET_MONTHLY_KR = Math.round(
  BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH *
    renzenNetFromBooking(DASHBOARD_BASELINE.avgSaleKr) +
    KLUB_ANNUAL_KR / 12 -
    CREDIT_SUBSIDY_MONTHLY_KR,
);

export const KLUB_MEMBER_BRUTTO_MONTHLY_KR = Math.round(
  BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH *
    renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr) +
    KLUB_ANNUAL_KR / 12 -
    CREDIT_SUBSIDY_MONTHLY_KR,
);

export type BookingRevenueScenario = {
  id: string;
  label: string;
  shortLabel: string;
  avgSaleKr: number;
  /** Legacy alias — same as renzenBruttoKr */
  renzenPerBookingKr: number;
  renzenBruttoKr: number;
  renzenNetKr: number;
  detail: string;
};

export type BookingVolumeRow = {
  bookingsPerMonth: number;
  customersNeeded: number;
  renzenByScenarioKr: Record<string, number>;
  renzenBruttoByScenarioKr: Record<string, number>;
  renzenNetByScenarioKr: Record<string, number>;
};

function customersFromBookings(bookingsPerMonth: number): number {
  return Math.round(bookingsPerMonth / BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH);
}

const BOOKING_SCENARIOS: BookingRevenueScenario[] = [
  {
    id: "current",
    label: "A: Nuværende gns. ~718 kr.",
    shortLabel: "A (~718 kr.)",
    avgSaleKr: DASHBOARD_BASELINE.avgSaleKr,
    renzenPerBookingKr: renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr),
    renzenBruttoKr: renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr),
    renzenNetKr: renzenNetFromBooking(DASHBOARD_BASELINE.avgSaleKr),
    detail: "Dashboard gns. salg/booking, Mar–Jun 2026",
  },
  {
    id: "conservative",
    label: "B: 600 kr.",
    shortLabel: "B (600 kr.)",
    avgSaleKr: 600,
    renzenPerBookingKr: renzenBruttoFromBooking(600),
    renzenBruttoKr: renzenBruttoFromBooking(600),
    renzenNetKr: renzenNetFromBooking(600),
    detail: "Konservativt gns. salg",
  },
  {
    id: "newPrice",
    label: `C: Ny pris 80 m² (${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr.)`,
    shortLabel: `C (${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr.)`,
    avgSaleKr: NEW_PRICING_80M2.afterBiweeklyDiscountKr,
    renzenPerBookingKr: renzenBruttoFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr),
    renzenBruttoKr: renzenBruttoFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr),
    renzenNetKr: renzenNetFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr),
    detail: `${NEW_PRICING_80M2.listKr.toLocaleString("da-DK")} kr. listepris, −${NEW_PRICING_80M2.biweeklyDiscountPct}% hver 2. uge`,
  },
];

const BOOKING_VOLUME_LEVELS = [50, 100, 150, 200] as const;

function buildBookingVolumeRows(): BookingVolumeRow[] {
  return BOOKING_VOLUME_LEVELS.map((bookingsPerMonth) => ({
    bookingsPerMonth,
    customersNeeded: customersFromBookings(bookingsPerMonth),
    renzenByScenarioKr: Object.fromEntries(
      BOOKING_SCENARIOS.map((s) => [
        s.id,
        bookingsPerMonth * s.renzenBruttoKr,
      ]),
    ),
    renzenBruttoByScenarioKr: Object.fromEntries(
      BOOKING_SCENARIOS.map((s) => [
        s.id,
        bookingsPerMonth * s.renzenBruttoKr,
      ]),
    ),
    renzenNetByScenarioKr: Object.fromEntries(
      BOOKING_SCENARIOS.map((s) => [
        s.id,
        bookingsPerMonth * s.renzenNetKr,
      ]),
    ),
  }));
}

const BASELINE_RENZEN_BRUTTO_MONTHLY_KR =
  DASHBOARD_BASELINE.bookingsPerMonth *
  renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr);
const BASELINE_RENZEN_NET_MONTHLY_KR =
  DASHBOARD_BASELINE.bookingsPerMonth *
  renzenNetFromBooking(DASHBOARD_BASELINE.avgSaleKr);

export const BOOKINGS_TO_REVENUE = {
  title: "Bookinger → indtægt",
  summary:
    "Renzen tager 20% ex moms af kundebetaling efter frekvensrabat. Netto trækker platformens andel af Stripe (1,4% + 1,80 kr.). Antal kunder estimeres ud fra bi-weekly gentagelse (~2,17 bookinger/kunde/md.).",
  marginNote: "20% Renzen ex moms / 80% Zenmester — efter frekvensrabat",
  netModelNote:
    "Netto = brutto ex moms − 20% af Stripe-gebyr (1,4% + 1,80 kr. pr. booking)",
  scenarios: BOOKING_SCENARIOS,
  volumeRows: buildBookingVolumeRows(),
  baseline: {
    bookingsPerMonth: DASHBOARD_BASELINE.bookingsPerMonth,
    renzenMonthlyKr: BASELINE_RENZEN_BRUTTO_MONTHLY_KR,
    renzenBruttoMonthlyKr: BASELINE_RENZEN_BRUTTO_MONTHLY_KR,
    renzenNetMonthlyKr: BASELINE_RENZEN_NET_MONTHLY_KR,
    renzenMonthlyApproxKr: 3_750,
    renzenNetMonthlyApproxKr: 2_900,
    customersActive: DASHBOARD_BASELINE.recurringCustomers,
    detail:
      "Dashboard Mar–Jun 2026: ~3.750 kr./md. brutto · ~2.900 kr./md. netto ved 26 bookinger",
  },
  footnote:
    `Ny pris: 245 kr. + ${PRICING_PER_SQM_KR} kr./m², derefter frekvensrabat (Kræver Klub for nye kunder). 93% af tilbagevendende kunder er bi-weekly (−15%). Brutto er ex moms; netto efter Stripe.`,
} as const;

/** Kundebetalinger pr. aktivt Klub-medlem/md. (rengøring + medlemskab). */
export function klubMemberCustomerSpendMonthlyKr(
  avgSaleKr: number = DASHBOARD_BASELINE.avgSaleKr,
): number {
  return Math.round(
    BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH * avgSaleKr + KLUB_ANNUAL_KR / 12,
  );
}

export type PathToTargetScenario = {
  id: string;
  label: string;
  detail: string;
  /** Net enhedsindtægt — bruges til målberegning */
  renzenPerUnitKr: number;
  renzenBruttoPerUnitKr: number;
  renzenNetPerUnitKr: number;
  unitLabel: string;
  bookingsNeeded: number;
  customersNeeded: number;
  /** Total kundebetalinger gennem platformen pr. md. (GMV) */
  monthlyGrossRevenueKr: number;
  answer: string;
};

function pathFromPerBooking(
  id: string,
  label: string,
  detail: string,
  bookingKr: number,
): PathToTargetScenario {
  const renzenBruttoPerUnitKr = renzenBruttoFromBooking(bookingKr);
  const renzenNetPerUnitKr = renzenNetFromBooking(bookingKr);
  const bookingsNeeded = Math.round(
    RENZEN_MONTHLY_TARGET_KR / renzenNetPerUnitKr,
  );
  const customersNeeded = customersFromBookings(bookingsNeeded);
  return {
    id,
    label,
    detail,
    renzenPerUnitKr: renzenNetPerUnitKr,
    renzenBruttoPerUnitKr,
    renzenNetPerUnitKr,
    unitLabel: "pr. booking",
    bookingsNeeded,
    customersNeeded,
    monthlyGrossRevenueKr: bookingsNeeded * bookingKr,
    answer: `~${bookingsNeeded.toLocaleString("da-DK")} bookinger / ~${customersNeeded.toLocaleString("da-DK")} kunder`,
  };
}

function pathFromPerMember(
  id: string,
  label: string,
  detail: string,
  renzenNetPerMemberKr: number,
  renzenBruttoPerMemberKr: number,
): PathToTargetScenario {
  const customersNeeded = Math.round(
    RENZEN_MONTHLY_TARGET_KR / renzenNetPerMemberKr,
  );
  const bookingsNeeded = Math.round(
    customersNeeded * BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH,
  );
  return {
    id,
    label,
    detail,
    renzenPerUnitKr: renzenNetPerMemberKr,
    renzenBruttoPerUnitKr: renzenBruttoPerMemberKr,
    renzenNetPerUnitKr: renzenNetPerMemberKr,
    unitLabel: "pr. aktivt medlem/md.",
    bookingsNeeded,
    customersNeeded,
    monthlyGrossRevenueKr:
      customersNeeded *
      klubMemberCustomerSpendMonthlyKr(DASHBOARD_BASELINE.avgSaleKr),
    answer: `~${customersNeeded.toLocaleString("da-DK")} kunder / ~${bookingsNeeded.toLocaleString("da-DK")} bookinger`,
  };
}

export const FREQUENCY_DISCOUNTS = [
  { id: "weekly", label: "Ugentlig", discountPct: 20 },
  { id: "biweekly", label: "Hver 2. uge", discountPct: 15 },
  { id: "monthly", label: "Hver 4. uge", discountPct: 5 },
] as const;

export function customerPriceAfterDiscount(
  listKr: number,
  discountPct: number,
): number {
  return Math.round(listKr * (1 - discountPct / 100));
}

export type PathTo200ScenarioRow = {
  id: string;
  sqm: number;
  listKr: number;
  frequencyLabel: string;
  discountPct: number;
  customerKr: number;
  extrasKr: number;
  totalCustomerKr: number;
  renzenNetKr: number;
  gapToTargetKr: number;
  hitsTarget: boolean;
};

export type PathTo200Lever = {
  id: string;
  title: string;
  detail: string;
};

const PATH_TO_200_TARGET_NET_KR = 200;
const PATH_TO_200_CURRENT_NET_KR = renzenNetFromBooking(DASHBOARD_BASELINE.avgSaleKr);
const PATH_TO_200_NEW_PRICE_NET_KR = renzenNetFromBooking(
  NEW_PRICING_80M2.afterBiweeklyDiscountKr,
);
const PATH_TO_200_TARGET_BOOKING_KR = bookingKrForTargetNet(PATH_TO_200_TARGET_NET_KR);
const PATH_TO_200_NET_GAP_KR = PATH_TO_200_TARGET_NET_KR - PATH_TO_200_CURRENT_NET_KR;
const PATH_TO_200_CUSTOMER_GAP_KR =
  PATH_TO_200_TARGET_BOOKING_KR - DASHBOARD_BASELINE.avgSaleKr;
const PATH_TO_200_MARGIN_AT_CURRENT_AVG = marginShareForTargetNet(
  DASHBOARD_BASELINE.avgSaleKr,
  PATH_TO_200_TARGET_NET_KR,
);

const PATH_TO_200_SQM_LEVELS = [80, 100, 120] as const;
const PATH_TO_200_EXTRAS_LEVELS = [0, 150, 300] as const;

function buildPathTo200ScenarioRows(): PathTo200ScenarioRow[] {
  const rows: PathTo200ScenarioRow[] = [];

  for (const sqm of PATH_TO_200_SQM_LEVELS) {
    const listKr = listPriceForSqm(sqm);
    for (const freq of FREQUENCY_DISCOUNTS) {
      const baseCustomerKr = customerPriceAfterDiscount(listKr, freq.discountPct);
      for (const extrasKr of PATH_TO_200_EXTRAS_LEVELS) {
        const totalCustomerKr = baseCustomerKr + extrasKr;
        const renzenNetKr = renzenNetFromBooking(totalCustomerKr);
        const gapToTargetKr = PATH_TO_200_TARGET_NET_KR - renzenNetKr;
        rows.push({
          id: `${sqm}-${freq.id}-${extrasKr}`,
          sqm,
          listKr,
          frequencyLabel: freq.label,
          discountPct: freq.discountPct,
          customerKr: baseCustomerKr,
          extrasKr,
          totalCustomerKr,
          renzenNetKr,
          gapToTargetKr,
          hitsTarget: renzenNetKr >= PATH_TO_200_TARGET_NET_KR,
        });
      }
    }
  }

  return rows;
}

export const PATH_TO_200_PER_BOOKING = {
  title: "Vej til 200 kr./booking",
  summary:
    "200 kr. netto pr. booking er punktet, hvor rengøringsmarginen begynder at blive interessant — før moms og Stripe, men efter platformens andel af betalingsgebyr. Her er gapet fra dashboard-baseline og de konkrete greb.",
  tagline: "Først der det bliver sjovt",
  targetNetKr: PATH_TO_200_TARGET_NET_KR,
  current: {
    avgSaleKr: DASHBOARD_BASELINE.avgSaleKr,
    renzenNetKr: PATH_TO_200_CURRENT_NET_KR,
    renzenBruttoKr: renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr),
    label: "Nuværende gns. ~718 kr.",
    detail: "Dashboard Mar–Jun 2026",
  },
  newPrice80m2: {
    customerKr: NEW_PRICING_80M2.afterBiweeklyDiscountKr,
    renzenNetKr: PATH_TO_200_NEW_PRICE_NET_KR,
    renzenBruttoKr: renzenBruttoFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr),
    listKr: NEW_PRICING_80M2.listKr,
    label: `Ny pris 80 m² (${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr.)`,
    detail: `${NEW_PRICING_80M2.listKr.toLocaleString("da-DK")} kr. listepris, −${NEW_PRICING_80M2.biweeklyDiscountPct}% hver 2. uge`,
  },
  gap: {
    netKr: PATH_TO_200_NET_GAP_KR,
    customerKr: PATH_TO_200_CUSTOMER_GAP_KR,
    detail: `${PATH_TO_200_CURRENT_NET_KR} → ${PATH_TO_200_TARGET_NET_KR} kr. net = +${PATH_TO_200_NET_GAP_KR} kr./booking net. Ved samme margin: ca. +${PATH_TO_200_CUSTOMER_GAP_KR.toLocaleString("da-DK")} kr. kundebetaling pr. besøg.`,
    newPriceStillShortKr:
      PATH_TO_200_TARGET_BOOKING_KR - NEW_PRICING_80M2.afterBiweeklyDiscountKr,
    newPriceStillShortDetail: `Ny pris ${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr. giver ~${PATH_TO_200_NEW_PRICE_NET_KR} kr. net — mangler stadig ~${(PATH_TO_200_TARGET_NET_KR - PATH_TO_200_NEW_PRICE_NET_KR).toLocaleString("da-DK")} kr. net (~${(PATH_TO_200_TARGET_BOOKING_KR - NEW_PRICING_80M2.afterBiweeklyDiscountKr).toLocaleString("da-DK")} kr. kundebetaling) for at ramme 200.`,
  },
  targetBooking: {
    customerKr: PATH_TO_200_TARGET_BOOKING_KR,
    renzenNetKr: renzenNetFromBooking(PATH_TO_200_TARGET_BOOKING_KR),
    renzenBruttoKr: renzenBruttoFromBooking(PATH_TO_200_TARGET_BOOKING_KR),
    detail: `Ca. ${PATH_TO_200_TARGET_BOOKING_KR.toLocaleString("da-DK")} kr. kundebetaling pr. booking ved 20% margin ex moms giver ~${PATH_TO_200_TARGET_NET_KR} kr. net til Renzen.`,
  },
  pricingFormula: {
    baseKr: PRICING_BASE_KR,
    perSqmKr: PRICING_PER_SQM_KR,
    label: `${PRICING_BASE_KR} kr. + ${PRICING_PER_SQM_KR} kr./m²`,
  },
  scenarioRows: buildPathTo200ScenarioRows(),
  levers: [
    {
      id: "higher-ticket",
      title: "Højere gns. billet",
      detail:
        "Større boliger (100–120 m²), tilkøb som kæledyr, afkalkning, vinduespudsning og hovedrengøring løfter kundebetaling uden at ændre frekvensrabatten.",
    },
    {
      id: "new-pricelist",
      title: "Ny prisliste",
      detail: `245 + ${PRICING_PER_SQM_KR} kr./m² flytter gns. fra ~718 til ~${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr. (80 m², −15%). For 200 kr. net skal kundebetaling op mod ~${PATH_TO_200_TARGET_BOOKING_KR.toLocaleString("da-DK")} kr. — ca. +${PATH_TO_200_CUSTOMER_GAP_KR.toLocaleString("da-DK")} kr. mere end i dag.`,
    },
    {
      id: "frequency",
      title: "Frekvens",
      detail:
        "Ugentlig (−20%) giver højere kundebetaling pr. booking end hver 2. uge (−15%) — samme listepris, mere netto til Renzen. 93% er bi-weekly i dag; flere ugentlige kunder løfter gns.",
    },
    {
      id: "fewer-intros",
      title: "Færre intro-tilbud i mix",
      detail: `Intro fra ${introPrice.toLocaleString("da-DK")} kr. giver ~${renzenNetFromBooking(introPrice)} kr. net og trækker gns. ned. Begræns andelen eller konverter hurtigt til normalpris.`,
    },
    {
      id: "erhverv",
      title: "Erhverv / højere m²",
      detail:
        "Kontor og erhverv har højere kurv (intro ~2.400 kr.) og større arealer. Én erhvervsbooking kan matche flere små privatbookinger i netto.",
    },
    {
      id: "zen-kredit",
      title: "Zen-kredit → tilkøb",
      detail:
        "Kredit driver tillægsydelser med fuld listepris og 20% margin — kunden betaler mindre kontant, men Renzen får margin på det aftalte jobbeløb.",
    },
    {
      id: "margin-longterm",
      title: "Langsigtet: margin",
      detail: `Kun margin-hævning ved nuværende ~718 kr. gns. kræver ~${Math.round(PATH_TO_200_MARGIN_AT_CURRENT_AVG * 100)}% Renzen-andel — urealistisk alene uden pris- eller mix-ændring.`,
    },
  ] satisfies PathTo200Lever[],
  marginFootnote: `Ved uændret gns. salg (~${DASHBOARD_BASELINE.avgSaleKr.toLocaleString("da-DK")} kr.) kræver 200 kr. net ca. ${Math.round(PATH_TO_200_MARGIN_AT_CURRENT_AVG * 100)}% Renzen-andel ex moms — ikke bæredygtigt som eneste greb. Kombinér pris, mix og tilkøb.`,
  footnote:
    "Alle tal bruger BOOKING_NET_MODEL (20% ex moms, minus platformens Stripe-andel). Scenarier er listepris efter frekvensrabat + valgfrie tillæg — ikke medlemskab eller kredit.",
} as const;

export const PATH_TO_50K = {
  title: "Vej til 50.000 kr./md. netto til Renzen",
  summary:
    "Mål: 50.000 kr./md. netto til Renzen efter moms og Stripe (20% rengøringsmargin ex moms + Klub netto, før øvrige driftsomkostninger). Baseret på dashboard-data Mar–Jun 2026.",
  targetKr: RENZEN_MONTHLY_TARGET_KR,
  targetLabel: "netto efter moms & Stripe",
  scenarios: [
    pathFromPerBooking(
      "cleaning-current",
      "Kun rengøring — nuværende gns. ~718 kr.",
      `${renzenBruttoFromBooking(DASHBOARD_BASELINE.avgSaleKr)} kr. brutto · ${renzenNetFromBooking(DASHBOARD_BASELINE.avgSaleKr)} kr. netto pr. booking (ex moms, minus Stripe)`,
      DASHBOARD_BASELINE.avgSaleKr,
    ),
    pathFromPerBooking(
      "cleaning-new",
      `Kun rengøring — ny pris ${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr. (80 m²)`,
      `${renzenBruttoFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr)} kr. brutto · ${renzenNetFromBooking(NEW_PRICING_80M2.afterBiweeklyDiscountKr)} kr. netto pr. booking (${NEW_PRICING_80M2.afterBiweeklyDiscountKr} kr. efter −15%)`,
      NEW_PRICING_80M2.afterBiweeklyDiscountKr,
    ),
    pathFromPerMember(
      "cleaning-klub",
      "Rengøring + Klub netto",
      `~${KLUB_MEMBER_BRUTTO_MONTHLY_KR.toLocaleString("da-DK")} kr. brutto · ~${KLUB_MEMBER_NET_MONTHLY_KR.toLocaleString("da-DK")} kr. netto/aktivt medlem/md. (rengøring + ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr./år medlemskab − kredit-subsidie ~${CREDIT_SUBSIDY_MONTHLY_KR} kr./md.)`,
      KLUB_MEMBER_NET_MONTHLY_KR,
      KLUB_MEMBER_BRUTTO_MONTHLY_KR,
    ),
  ] satisfies PathToTargetScenario[],
  grossRevenueNote:
    "Renzen net ≈ 20% ex moms minus Stripe — ikke hele omsætningen.",
  footnote:
    `Klub: ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr./år medlemskab; realistisk kredit-subsidie ~175 kr./medlem/md. Kombineret model forudsætter fast bi-weekly rengøring + aktivt medlemskab. Brutto = ex moms; netto trækker platformens Stripe-andel.`,
} as const;

export type MarginScenarioId = "current" | "alternative30";

export type MarginScenario = {
  id: MarginScenarioId;
  margin: number;
  renzenShareLabel: string;
  partnerShareLabel: string;
};

export const MARGIN_SCENARIOS = {
  current: {
    id: "current",
    margin: RENZEN_MARGIN,
    renzenShareLabel: "20%",
    partnerShareLabel: "80%",
  },
  alternative30: {
    id: "alternative30",
    margin: ALTERNATIVE_MARGIN_30,
    renzenShareLabel: "30%",
    partnerShareLabel: "70%",
  },
} as const satisfies Record<MarginScenarioId, MarginScenario>;

function klubMemberNetMonthlyAtMargin(margin: number): number {
  return Math.round(
    BIWEEKLY_BOOKINGS_PER_CUSTOMER_MONTH *
      renzenNetFromBookingAtMargin(DASHBOARD_BASELINE.avgSaleKr, margin) +
      KLUB_ANNUAL_KR / 12 -
      CREDIT_SUBSIDY_MONTHLY_KR,
  );
}

function bookingsForTargetNetAtMargin(
  targetKr: number,
  bookingKr: number,
  margin: number,
): number {
  const netPerBooking = renzenNetFromBookingAtMargin(bookingKr, margin);
  return Math.round(targetKr / netPerBooking);
}

const MARGIN_30_AVG_SALE_KR = DASHBOARD_BASELINE.avgSaleKr;
const MARGIN_30_NEW_PRICE_KR = NEW_PRICING_80M2.afterBiweeklyDiscountKr;
const MARGIN_30_TARGET_NET_KR = 200;

const MARGIN_30_NET_AT_AVG_20 = renzenNetFromBooking(MARGIN_30_AVG_SALE_KR);
const MARGIN_30_NET_AT_AVG_30 = renzenNetFromBookingAtMargin(
  MARGIN_30_AVG_SALE_KR,
  ALTERNATIVE_MARGIN_30,
);
const MARGIN_30_NET_AT_888_20 = renzenNetFromBooking(MARGIN_30_NEW_PRICE_KR);
const MARGIN_30_NET_AT_888_30 = renzenNetFromBookingAtMargin(
  MARGIN_30_NEW_PRICE_KR,
  ALTERNATIVE_MARGIN_30,
);
const MARGIN_30_BOOKINGS_50K_20 = bookingsForTargetNetAtMargin(
  RENZEN_MONTHLY_TARGET_KR,
  MARGIN_30_AVG_SALE_KR,
  RENZEN_MARGIN,
);
const MARGIN_30_BOOKINGS_50K_30 = bookingsForTargetNetAtMargin(
  RENZEN_MONTHLY_TARGET_KR,
  MARGIN_30_AVG_SALE_KR,
  ALTERNATIVE_MARGIN_30,
);
const MARGIN_30_CUSTOMER_FOR_200_20 = bookingKrForTargetNet(MARGIN_30_TARGET_NET_KR);
const MARGIN_30_CUSTOMER_FOR_200_30 = bookingKrForTargetNetAtMargin(
  MARGIN_30_TARGET_NET_KR,
  ALTERNATIVE_MARGIN_30,
);
const MARGIN_30_KLUB_NET_20 = klubMemberNetMonthlyAtMargin(RENZEN_MARGIN);
const MARGIN_30_KLUB_NET_30 = klubMemberNetMonthlyAtMargin(ALTERNATIVE_MARGIN_30);
const MARGIN_30_MEMBERS_50K_20 = Math.round(
  RENZEN_MONTHLY_TARGET_KR / MARGIN_30_KLUB_NET_20,
);
const MARGIN_30_MEMBERS_50K_30 = Math.round(
  RENZEN_MONTHLY_TARGET_KR / MARGIN_30_KLUB_NET_30,
);

function partnerPayoutExMomsAtMargin(bookingKr: number, margin: number): number {
  return Math.round((bookingKr / BOOKING_NET_MODEL.vatDivisor) * (1 - margin));
}

const MARGIN_30_OLD_AVG_KR = DASHBOARD_BASELINE.avgSaleKr;
const MARGIN_30_SUB_PAYOUT_718_20 = partnerPayoutExMomsAtMargin(
  MARGIN_30_OLD_AVG_KR,
  RENZEN_MARGIN,
);
const MARGIN_30_SUB_PAYOUT_888_30 = partnerPayoutExMomsAtMargin(
  MARGIN_30_NEW_PRICE_KR,
  ALTERNATIVE_MARGIN_30,
);
const MARGIN_30_SUB_PAYOUT_DELTA_KR =
  MARGIN_30_SUB_PAYOUT_888_30 - MARGIN_30_SUB_PAYOUT_718_20;

export const MARGIN_30_IMPACT = {
  title: "30% cut — kun nye subs på ny prisliste",
  policyCallout: "Kun nye subs · ny prisliste",
  summary:
    "30% platform-cut er ikke en bred ændring. Eksisterende Zenmestre, nuværende kunder og gammel pris forbliver på 20/80. Kun nye Zenmestre på ny prisliste (245 kr. + " +
    `${PRICING_PER_SQM_KR} kr./m²) får 30/70 — og den højere listepris kompenserer: sub får ~` +
    `${MARGIN_30_SUB_PAYOUT_888_30.toLocaleString("da-DK")} kr. ex moms pr. ${MARGIN_30_NEW_PRICE_KR.toLocaleString("da-DK")} kr.-booking vs. ~${MARGIN_30_SUB_PAYOUT_718_20.toLocaleString("da-DK")} kr. ved 80% på gns. ${MARGIN_30_OLD_AVG_KR.toLocaleString("da-DK")} kr.`,
  tradeoffNote:
    "Trade-off gælder primært rekrutteringspitch til nye subs — ikke eksisterende netværk. Højere cut løfter Renzen-netto og sænker volumenkravet til 50.000 kr./md., men pitch'en skal forklare at 70% af højere pris kan matche eller slå 80% af lavere pris i kroner.",
  policyNote:
    "Grandfathering: alle eksisterende Zenmestre og bookinger under nuværende prisliste beholdes på 20/80. 30/70 rulles kun ud sammen med ny prisliste for nye subs — strategisk rollout uden churn-risiko for det nuværende netværk.",
  partnerNote:
    "Ny prisliste: Zenmester/partner får 70% af aftalt listepris ex moms. Eksisterende subs: uændret 80%. Stripe-andelen følger platformens margin (30% af gebyret for nye subs).",
  avgSaleKr: MARGIN_30_AVG_SALE_KR,
  scenarios: MARGIN_SCENARIOS,
  comparisonRows: [
    {
      id: "net-per-booking",
      metric: "Netto pr. booking",
      context: `Ved gns. ${MARGIN_30_AVG_SALE_KR.toLocaleString("da-DK")} kr.`,
      value20: MARGIN_30_NET_AT_AVG_20,
      value30: MARGIN_30_NET_AT_AVG_30,
      unitLabel: "kr.",
    },
    {
      id: "bookings-50k",
      metric: "Bookinger for 50.000 kr. net/md.",
      context: `Kun rengøring, gns. ${MARGIN_30_AVG_SALE_KR.toLocaleString("da-DK")} kr.`,
      value20: MARGIN_30_BOOKINGS_50K_20,
      value30: MARGIN_30_BOOKINGS_50K_30,
      unitLabel: "bookinger/md.",
    },
    {
      id: "customer-200-net",
      metric: "Kundebetaling for 200 kr. net/booking",
      context: "Mål: interessant rengøringsmargin",
      value20: MARGIN_30_CUSTOMER_FOR_200_20,
      value30: MARGIN_30_CUSTOMER_FOR_200_30,
      unitLabel: "kr.",
    },
    {
      id: "klub-net-member",
      metric: "Klub netto pr. aktivt medlem/md.",
      context: `Bi-weekly + ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr./år − kredit ~${CREDIT_SUBSIDY_MONTHLY_KR} kr.`,
      value20: MARGIN_30_KLUB_NET_20,
      value30: MARGIN_30_KLUB_NET_30,
      unitLabel: "kr.",
    },
    {
      id: "members-50k-klub",
      metric: "Klub-medlemmer for 50.000 kr. net/md.",
      context: "Rengøring + Klub netto",
      value20: MARGIN_30_MEMBERS_50K_20,
      value30: MARGIN_30_MEMBERS_50K_30,
      unitLabel: "medlemmer",
    },
    {
      id: "sub-payout-ex-moms",
      metric: "Zenmester-udbetaling ex moms",
      context: `${MARGIN_30_OLD_AVG_KR.toLocaleString("da-DK")} kr. (gns., 80%) vs. ${MARGIN_30_NEW_PRICE_KR.toLocaleString("da-DK")} kr. (ny pris, 70%)`,
      value20: MARGIN_30_SUB_PAYOUT_718_20,
      value30: MARGIN_30_SUB_PAYOUT_888_30,
      unitLabel: "kr.",
    },
  ],
  newPrice80m2: {
    customerKr: MARGIN_30_NEW_PRICE_KR,
    net20Kr: MARGIN_30_NET_AT_888_20,
    net30Kr: MARGIN_30_NET_AT_888_30,
    subPayout20Kr: MARGIN_30_SUB_PAYOUT_718_20,
    subPayout30Kr: MARGIN_30_SUB_PAYOUT_888_30,
    subPayoutDeltaKr: MARGIN_30_SUB_PAYOUT_DELTA_KR,
    hits200At30: MARGIN_30_NET_AT_888_30 >= MARGIN_30_TARGET_NET_KR,
    detail: `Ny pris 80 m² (${MARGIN_30_NEW_PRICE_KR.toLocaleString("da-DK")} kr. efter −15%) giver ~${MARGIN_30_NET_AT_888_30} kr. Renzen-netto ved 30% — ${MARGIN_30_NET_AT_888_30 >= MARGIN_30_TARGET_NET_KR ? "allerede over" : "stadig under"} 200 kr.-tærsklen. Sub får ~${MARGIN_30_SUB_PAYOUT_888_30.toLocaleString("da-DK")} kr. ex moms (70%) — ca. +${MARGIN_30_SUB_PAYOUT_DELTA_KR.toLocaleString("da-DK")} kr. vs. 80% på gns. ${MARGIN_30_OLD_AVG_KR.toLocaleString("da-DK")} kr.`,
  },
  footnote:
    "Alle tal bruger BOOKING_NET_MODEL: margin ex moms, minus platformens andel af Stripe (1,4% + 1,80 kr.). 20/80 gælder eksisterende subs og gammel pris; 30/70 kun nye subs på ny prisliste. Kredit-subsidie og medlemskab er uændret mellem scenarier.",
} as const;

/** Skønnede driftsomkostninger — ikke hard data, men realistisk interval til ejervurdering. */
const OPS_SUPPORT_LOW_KR = 30;
const OPS_SUPPORT_HIGH_KR = 50;
const OPS_PLATFORM_LOW_KR = 5_000;
const OPS_PLATFORM_HIGH_KR = 8_000;

const MEMBERS_FOR_50K_GROSS =
  Math.round(RENZEN_MONTHLY_TARGET_KR / KLUB_MEMBER_NET_MONTHLY_KR);

function klubNetAfterOpsKr(
  members: number,
  supportPerMemberKr: number,
  platformFixedKr: number,
): number {
  return (
    members * KLUB_MEMBER_NET_MONTHLY_KR -
    members * supportPerMemberKr -
    platformFixedKr
  );
}

function membersForPocketMoneyKr(
  targetKr: number,
  supportPerMemberKr: number,
  platformFixedKr: number,
): number {
  const netPerMemberAfterSupport =
    KLUB_MEMBER_NET_MONTHLY_KR - supportPerMemberKr;
  if (netPerMemberAfterSupport <= 0) return 0;
  return Math.ceil((targetKr + platformFixedKr) / netPerMemberAfterSupport);
}

const CONSERVATIVE_LTV_ANNUAL_KR = KLUB_MEMBER_NET_MONTHLY_KR * 12;
const ENGAGED_BUNDLE_MARGIN_KR = margin(bundleCustomer);
const ENGAGED_HAVE_MARGIN_KR = margin(havearbejdeOffer);
const ENGAGED_LTV_ANNUAL_LOW_KR =
  CONSERVATIVE_LTV_ANNUAL_KR + ENGAGED_BUNDLE_MARGIN_KR;
const ENGAGED_LTV_ANNUAL_HIGH_KR =
  CONSERVATIVE_LTV_ANNUAL_KR +
  ENGAGED_BUNDLE_MARGIN_KR +
  ENGAGED_HAVE_MARGIN_KR;

const MEMBERS_FOR_50K_POCKET_LOW_OPS = membersForPocketMoneyKr(
  RENZEN_MONTHLY_TARGET_KR,
  OPS_SUPPORT_LOW_KR,
  OPS_PLATFORM_LOW_KR,
);
const MEMBERS_FOR_50K_POCKET_HIGH_OPS = membersForPocketMoneyKr(
  RENZEN_MONTHLY_TARGET_KR,
  OPS_SUPPORT_HIGH_KR,
  OPS_PLATFORM_HIGH_KR,
);
const KLUB_MEMBER_CUSTOMER_SPEND_MONTHLY_KR = klubMemberCustomerSpendMonthlyKr(
  DASHBOARD_BASELINE.avgSaleKr,
);

export const KLUB_MODEL_VIABILITY = {
  title: "Betaler Klub-modellen sig?",
  summary:
    "Kort svar: rengøring + Klub alene er tynd margin — men Klub er ikke designet som ren rengøringsforretning. Her er regnestykket ærligt, inkl. skønnede driftsomkostninger.",
  cleaningOnly: {
    title: "Ren rengøring + Klub (nuværende model)",
    netPerMemberMonthlyKr: KLUB_MEMBER_NET_MONTHLY_KR,
    netPerMemberDetail: `~${KLUB_MEMBER_NET_MONTHLY_KR.toLocaleString("da-DK")} kr. netto/aktivt medlem/md. efter moms, Stripe og kredit-subsidie (~${CREDIT_SUBSIDY_MONTHLY_KR.toLocaleString("da-DK")} kr./md.)`,
    thinMarginNote:
      "Det er tyndt. Du tjener ikke meget pr. medlem på selve rengøringsmarginen — medlemskabet og kreditpuljen æder en del af bruttoen.",
    atMembers: MEMBERS_FOR_50K_GROSS,
    grossMonthlyAtTargetKr: MEMBERS_FOR_50K_GROSS * KLUB_MEMBER_NET_MONTHLY_KR,
    monthlyGrossRevenueAtTargetKr:
      MEMBERS_FOR_50K_GROSS * KLUB_MEMBER_CUSTOMER_SPEND_MONTHLY_KR,
    grossNote: `Ved ~${MEMBERS_FOR_50K_GROSS.toLocaleString("da-DK")} aktive medlemmer med fast bi-weekly rengøring lander du omkring ${RENZEN_MONTHLY_TARGET_KR.toLocaleString("da-DK")} kr./md. netto til Renzen — før support, reklamationer og platform.`,
  },
  opsEstimates: {
    label: "Skønnede driftsomkostninger (md.)",
    disclaimer: "Skøn — ikke bogført tal. Bruges til at vurdere, hvad der reelt er tilbage.",
    support: {
      label: "Support & reklamationer",
      lowKr: OPS_SUPPORT_LOW_KR,
      highKr: OPS_SUPPORT_HIGH_KR,
      unitLabel: "kr./medlem/md.",
      detail:
        "Telefon, chat, ombookinger, klager og kompensation. Stiger med volumen og sæsonspidser.",
    },
    platform: {
      label: "Platform & tech",
      lowKr: OPS_PLATFORM_LOW_KR,
      highKr: OPS_PLATFORM_HIGH_KR,
      unitLabel: "kr./md. fast",
      detail:
        "Hosting, Stripe-gebyrer ud over booking-andel, CRM, SMS, domæner og vedligehold.",
    },
    scenarios: [
      {
        id: "low",
        label: "Lavt skøn",
        supportKr: OPS_SUPPORT_LOW_KR,
        platformKr: OPS_PLATFORM_LOW_KR,
        netAt331Kr: klubNetAfterOpsKr(
          MEMBERS_FOR_50K_GROSS,
          OPS_SUPPORT_LOW_KR,
          OPS_PLATFORM_LOW_KR,
        ),
      },
      {
        id: "mid",
        label: "Midt skøn",
        supportKr: 40,
        platformKr: 6_500,
        netAt331Kr: klubNetAfterOpsKr(MEMBERS_FOR_50K_GROSS, 40, 6_500),
      },
      {
        id: "high",
        label: "Højt skøn",
        supportKr: OPS_SUPPORT_HIGH_KR,
        platformKr: OPS_PLATFORM_HIGH_KR,
        netAt331Kr: klubNetAfterOpsKr(
          MEMBERS_FOR_50K_GROSS,
          OPS_SUPPORT_HIGH_KR,
          OPS_PLATFORM_HIGH_KR,
        ),
      },
    ],
    membersFor50kPocketLowOps: MEMBERS_FOR_50K_POCKET_LOW_OPS,
    membersFor50kPocketHighOps: MEMBERS_FOR_50K_POCKET_HIGH_OPS,
    monthlyGrossRevenuePocketLowKr:
      MEMBERS_FOR_50K_POCKET_LOW_OPS * KLUB_MEMBER_CUSTOMER_SPEND_MONTHLY_KR,
    monthlyGrossRevenuePocketHighKr:
      MEMBERS_FOR_50K_POCKET_HIGH_OPS * KLUB_MEMBER_CUSTOMER_SPEND_MONTHLY_KR,
    pocketMoneyNote:
      "Efter skønnede driftsomkostninger skal du typisk op mod 400–500+ aktive medlemmer for ~50.000 kr./md. i lommen — ikke ~331.",
  },
  whyItCanWork: {
    title: "Hvorfor Klub alligevel kan betale sig",
    summary:
      "Klub er en acquisition- og retention-motor — ikke et rent margin-spil på rengøring alene. Medlemskabet binder kunden; Zen-kreditter og deals driver cross-salg.",
    points: [
      `Intro fra ${INTRO_CLEANING_FROM_KR} kr. er tabsgivende alene — men konverterer til fast rengøring og Klub`,
      `Zen-kreditter (${ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR} × ${ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr./år) holder medlemmet aktivt og sænker friktion på tillægsydelser`,
      "Deals på tværs af kategorier giver højere kurv end rengøring alene",
    ],
    crossSellDeals: [
      {
        dealId: "flyt-rengoring-bundle",
        label: "Flyt + rengøring",
        customerKr: bundleCustomer,
        renzenMarginKr: margin(bundleCustomer),
        note: "Høj AOV — typisk engangsjob ved flytning",
      },
      {
        dealId: "flytterengoring-flyt10",
        label: "Flytterengøring",
        customerKr: flytterDiscounted,
        renzenMarginKr: margin(flytterDiscounted),
        note: "Høj intent — konverterer flyttekunder",
      },
      {
        dealId: "havearbejde-saeson",
        label: "Havearbejde sæson",
        customerKr: havearbejdeOffer,
        renzenMarginKr: margin(havearbejdeOffer),
        note: "Sæsonjob — kredit kan bruges som Klub-medlem",
      },
      {
        dealId: "erhverv-intro",
        label: "Erhverv intro",
        customerKr: erhvervIntro,
        renzenMarginKr: margin(erhvervIntro),
        note: "B2B pipeline med gentagelse og højere kurv",
      },
    ],
    engagedExample:
      "Et medlem med bi-weekly rengøring (~151 kr. net/md.) der én gang om året booker flyt + rengøring-bundlen (+1.520 kr. Renzen-margin) og evt. sæsonhave (+170 kr.) lander langt over rengøring alene — uden at du skal finde nye kunder.",
  },
  ltvSketch: {
    title: "Realistisk blended LTV (skitse)",
    conservative: {
      label: "Konservativt medlem",
      detail: "Fast bi-weekly rengøring + Klub — ingen cross-salg",
      annualNetKr: CONSERVATIVE_LTV_ANNUAL_KR,
      formula: `${KLUB_MEMBER_NET_MONTHLY_KR.toLocaleString("da-DK")} kr./md. × 12`,
    },
    engaged: {
      label: "Engageret medlem",
      detail: "Rengøring + 1 flytbundle/år (+ evt. sæsonhave)",
      annualNetKrLow: ENGAGED_LTV_ANNUAL_LOW_KR,
      annualNetKrHigh: ENGAGED_LTV_ANNUAL_HIGH_KR,
      formula: `Rengøring (${CONSERVATIVE_LTV_ANNUAL_KR.toLocaleString("da-DK")} kr.) + flytbundle (${ENGAGED_BUNDLE_MARGIN_KR.toLocaleString("da-DK")} kr.)${ENGAGED_HAVE_MARGIN_KR > 0 ? ` + have (${ENGAGED_HAVE_MARGIN_KR.toLocaleString("da-DK")} kr.)` : ""}`,
    },
    cacBreakeven: {
      label: "CAC / support break-even",
      introMarginKr: margin(introPrice),
      introNote: `Intro fra ${introPrice.toLocaleString("da-DK")} kr. giver ~${margin(introPrice).toLocaleString("da-DK")} kr. Renzen-brutto — tab vs. normalpris dækkes over tid`,
      visitsToRecoverLow: Math.ceil(
        CONSERVATIVE_LTV_ANNUAL_KR / KLUB_MEMBER_NET_MONTHLY_KR,
      ),
      detail:
        "Et medlem der kun bliver på rengøring har ~12 md. break-even på kredit-subsidie. Cross-salg forkorter tidshorisonten markant.",
    },
  },
  footnote:
    "Alle tal er interne skøn baseret på dashboard Mar–Jun 2026 og deals-hub marginmodel. Brug dem til retning — ikke som budgetgaranti.",
} as const;
