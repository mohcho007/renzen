export interface PricingConfig {
  basePrice: number;
  pricePerSqm: number;
  servicefradragPct: number; // e.g. 26% in Denmark
  frequencies: {
    id: string;
    label: string;
    discountPct: number;
  }[];
  introPrices: {
    maxSqm: number;
    price: number;
  }[];
}

export function listPriceKr(sqm: number): number {
  return pricingConfig.basePrice + pricingConfig.pricePerSqm * sqm;
}

/** Renzen Klub membership fees (customer-facing). */
export const KLUB_ANNUAL_KR = 790;
export const KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR = KLUB_ANNUAL_KR / 12;
export const ZEN_CREDIT_MONTHLY_KR = 200;
export const ZEN_CREDIT_ANNUAL_KR = 2400;
/** Annual Zen pool minus first month's credit used on intro cleaning. */
export const ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR =
  ZEN_CREDIT_ANNUAL_KR - ZEN_CREDIT_MONTHLY_KR;

export const pricingConfig: PricingConfig = {
  basePrice: 245,
  pricePerSqm: 8,
  servicefradragPct: 26, // 26% tax deduction on service expenses
  frequencies: [
    { id: 'weekly', label: 'Hver uge', discountPct: 20 },
    { id: 'biweekly', label: 'Hver 2. uge', discountPct: 15 },
    { id: 'fourweekly', label: 'Hver 4. uge', discountPct: 5 },
    { id: 'once', label: 'Engangsrengøring', discountPct: 0 }
  ],
  introPrices: [
    { maxSqm: 70, price: 399 },
    { maxSqm: 100, price: 499 },
    { maxSqm: 130, price: 599 },
    { maxSqm: 160, price: 699 }
  ]
};

/** Customer-facing "fra X kr." for intro (smallest tier minus welcome Zen-kredit). */
export const INTRO_CLEANING_FROM_KR = Math.max(
  0,
  pricingConfig.introPrices[0].price - ZEN_CREDIT_MONTHLY_KR,
);

/** Weekly visits per calendar year (used in Klub savings examples). */
export const WEEKLY_VISITS_PER_YEAR = 52;

/** Member-price cleaning savings for a reference home (100 m², every week). */
export function klubAnnualCleaningSavingsKr(
  sqm: number,
  frequencyDiscountPct: number,
  visitsPerYear: number,
): number {
  const list = listPriceKr(sqm);
  const ongoingGross = Math.round(list * (1 - frequencyDiscountPct / 100));
  return Math.max(0, list - ongoingGross) * visitsPerYear;
}

const weeklyFrequency = pricingConfig.frequencies.find(
  (frequency) => frequency.id === "weekly",
);

export const KLUB_SAVINGS_EXAMPLE_SQM = 100;

export const KLUB_SAVINGS_EXAMPLE_ANNUAL_KR = klubAnnualCleaningSavingsKr(
  KLUB_SAVINGS_EXAMPLE_SQM,
  weeklyFrequency?.discountPct ?? 20,
  WEEKLY_VISITS_PER_YEAR,
);

export const KLUB_SAVINGS_EXAMPLE_FIRST_YEAR_KR =
  KLUB_SAVINGS_EXAMPLE_ANNUAL_KR + ZEN_CREDIT_MONTHLY_KR;
