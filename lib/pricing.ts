import { pricingConfig } from '../data/pricing';

export interface PriceResult {
  basePrice: number;
  sqmPrice: number;
  subTotal: number;
  discountAmount: number;
  discountPct: number;
  totalPrice: number;
  servicefradragSaving: number;
  finalCostAfterFradrag: number;
  isIntroApplied: boolean;
  introPrice: number;
}

/**
 * Calculates the cleaning price based on size (m²), frequency, and whether intro offer is active.
 */
export function calculateCleaningPrice(
  sqm: number,
  frequencyId: string,
  applyIntroOffer: boolean = false
): PriceResult {
  const { basePrice, pricePerSqm, servicefradragPct, frequencies, introPrices } = pricingConfig;
  
  // 1. Calculate standard price
  const sqmCost = sqm * pricePerSqm;
  const subTotal = basePrice + sqmCost;
  
  // 2. Find frequency discount
  const freq = frequencies.find(f => f.id === frequencyId) || { discountPct: 0 };
  const discountPct = freq.discountPct;
  const discountAmount = Math.round((subTotal * discountPct) / 100);
  
  let totalPrice = subTotal - discountAmount;
  
  // 3. Handle Intro Offer
  let isIntroApplied = false;
  let introPrice = 0;
  
  if (applyIntroOffer) {
    // Find the smallest matching tier
    const sortedTiers = [...introPrices].sort((a, b) => a.maxSqm - b.maxSqm);
    const matchingTier = sortedTiers.find(tier => sqm <= tier.maxSqm);
    
    if (matchingTier) {
      introPrice = matchingTier.price;
      totalPrice = introPrice;
      isIntroApplied = true;
    }
  }
  
  // Ensure we round output prices cleanly
  totalPrice = Math.round(totalPrice);
  
  // 4. Calculate servicefradrag (26% skatteværdi)
  const servicefradragSaving = Math.round((totalPrice * servicefradragPct) / 100);
  const finalCostAfterFradrag = totalPrice - servicefradragSaving;
  
  return {
    basePrice,
    sqmPrice: sqmCost,
    subTotal,
    discountAmount,
    discountPct,
    totalPrice,
    servicefradragSaving,
    finalCostAfterFradrag,
    isIntroApplied,
    introPrice
  };
}
