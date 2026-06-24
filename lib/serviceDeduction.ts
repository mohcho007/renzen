export const serviceDeduction = {
  year: 2026,
  maximumPerPersonDkk: 18_300,
  approximateTaxValuePercent: 26,
  minimumAge: 18,
  sourceUrl:
    "https://skat.dk/borger/fradrag/servicefradrag/servicefradrag",
} as const;

const danishNumberFormatter = new Intl.NumberFormat("da-DK");

export const serviceDeductionText = {
  maximumPerPerson: `${danishNumberFormatter.format(
    serviceDeduction.maximumPerPersonDkk,
  )} kr.`,
  taxValue: `${serviceDeduction.approximateTaxValuePercent}%`,
  rulesYear: `${serviceDeduction.year}-regler`,
} as const;

export function calculatePriceAfterServiceDeduction(priceDkk: number) {
  return Math.round(
    priceDkk *
      (1 - serviceDeduction.approximateTaxValuePercent / 100),
  );
}
