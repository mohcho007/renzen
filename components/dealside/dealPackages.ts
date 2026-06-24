import { listPriceKr, pricingConfig } from "@/data/pricing";

export type DealPackage = {
  m2: number;
  title: string;
  rooms: string;
  introPrice: number;
  normalPrice: number;
  savings: number;
  popular?: boolean;
};

function buildPackage(
  m2: number,
  title: string,
  rooms: string,
  introPrice: number,
  popular?: boolean,
): DealPackage {
  const normalPrice = listPriceKr(m2);
  return {
    m2,
    title,
    rooms,
    introPrice,
    normalPrice,
    savings: normalPrice - introPrice,
    ...(popular ? { popular } : {}),
  };
}

export const DEAL_PACKAGES: DealPackage[] = [
  buildPackage(70, "Lille bolig", "1–2 værelser", 399),
  buildPackage(100, "Mellem bolig", "3–4 værelser", 499, true),
  buildPackage(130, "Stor bolig", "4–5 værelser", 599),
  buildPackage(160, "XL bolig", "Større hjem", 699),
];

export { pricingConfig };

export const MAX_INTRO_TIER_M2 = Math.max(...DEAL_PACKAGES.map((pkg) => pkg.m2));

export function exceedsIntroTierCap(m2: number): boolean {
  return m2 > MAX_INTRO_TIER_M2;
}

/**
 * Resolve intro package from actual m²: smallest tier whose cap is ≥ `m2`
 * (ceil to package band). E.g. up to 70 m² → Lille, 71–100 → Mellem, 101–130 → Stor, 131–160 → XL.
 * Below the smallest tier, use Lille. Above 160 m², intro stays at XL (160).
 */
export function getPackageTierForM2(m2: number): DealPackage {
  const sorted = [...DEAL_PACKAGES].sort((a, b) => a.m2 - b.m2);
  const ceilTier = sorted.find((tier) => tier.m2 >= m2);
  return ceilTier ?? sorted[sorted.length - 1];
}
