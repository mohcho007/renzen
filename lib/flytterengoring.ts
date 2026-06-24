import {
  buildBookEntryCustomFieldPayload,
  findBookEntryCustomField,
  type BookEntryOptionId,
} from "@/lib/bookCleaningL27";
import {
  calculatePriceAfterServiceDeduction,
  serviceDeduction,
} from "@/lib/serviceDeduction";

export const FLYT_CATEGORY_ID = 4;
export const FLYT_FREQUENCY_ID = 1;
export const FLYT_SQM_MIN = 50;
export const FLYT_SQM_MAX = 400;
export const FLYT_BATHROOM_EXTRA_ID = 85;
export const FLYT_BATHROOM_INCLUDED_COUNT = 1;
export const FLYT_SQM_DEFAULT = 70;
export const FLYT_DEFAULT_STAND = 1;

export type FlytStandLevel = 1 | 2 | 3 | 4 | 5;

export type FlytStandDefinition = {
  level: FlytStandLevel;
  label: string;
  shortLabel: string;
  ratePerSqm: number;
  serviceId: number;
  pricingParamId: number;
  description: string;
};

export const FLYT_STANDS: FlytStandDefinition[] = [
  {
    level: 1,
    label: "1 - Boligen er ren og nyligt rengjort",
    shortLabel: "Ren og nyligt rengjort",
    ratePerSqm: 40,
    serviceId: 119,
    pricingParamId: 15,
    description:
      "Boligen er pæn og velholdt. Der er ikke noget synligt snavs, og de fleste områder skal blot støvsuges og tørres af med en klud. Køleskab og ovn er næsten helt rene og behøver kun en hurtig aftørring. Badeværelset er uden kalk og kræver minimal indsats.",
  },
  {
    level: 2,
    label: "2 - Boligen er vedligeholdt, men ikke rengjort for nylig",
    shortLabel: "Vedligeholdt",
    ratePerSqm: 53,
    serviceId: 115,
    pricingParamId: 20,
    description:
      "Boligen er generelt pæn og godt vedligeholdt. Der er almindeligt snavs efter lidt tid uden rengøring, men intet der er indgroet. Køleskabet og ovnen er blevet holdt nogenlunde rene og skal blot friskes op. Der er kun lidt kalk på badeværelset og toilettet, da det er blevet fjernet løbende.",
  },
  {
    level: 3,
    label: "3 - Boligen er forsømt og ikke rengjort for nylig",
    shortLabel: "Forsømt",
    ratePerSqm: 71,
    serviceId: 116,
    pricingParamId: 22,
    description:
      "Boligen har ikke fået en grundig rengøring i et stykke tid og trænger til en kærlig hånd. Der er tydeligt snavs efter nogle måneder uden vedligeholdelse. Køleskab og/eller ovn er beskidte, men kan rengøres med lidt ekstra indsats og stærkere midler. Der er kalk på badeværelse og toilet, men ikke mere end det kan fjernes ved almindelig afkalkning.",
  },
  {
    level: 4,
    label: "4 - Boligen er alvorligt misligholdt",
    shortLabel: "Alvorligt misligholdt",
    ratePerSqm: 115,
    serviceId: 117,
    pricingParamId: 23,
    description:
      "Boligen fremstår i en meget beskidt og forsømt stand efter længere tid uden grundig rengøring. Der er fastgroet snavs flere steder, som kræver en ekstra indsats. Køleskab og ovn forventes at være kraftigt tilsmudsede og vil skulle rengøres med mere effektive midler. Badeværelse og toilet har formentligt en del kalk, og nogle områder kan være så medtagede, at de ikke kan gøres helt rene. Vi vil dog naturligvis gøre vores bedste med de midler og metoder, vi har til rådighed, for at få boligen til at fremstå så ren som muligt.",
  },
  {
    level: 5,
    label: "5 - Boligen er i værst mulige stand",
    shortLabel: "Værst mulige stand",
    ratePerSqm: 180.5,
    serviceId: 118,
    pricingParamId: 24,
    description:
      "Boligen fremstår i stærkt forsømt stand og kræver en omfattende og ressourcetung rengøring for at bringes op på et acceptabelt niveau. Hårde hvidevarer, herunder køleskab og ovn, vurderes at være i markant dårlig stand og vil kræve intensiv rengøring med kraftige midler. Badeværelse og toilet er præget af betydelige kalkaflejringer, hvor slibning kan blive nødvendigt for en tilfredsstillende afrensning. Det skal bemærkes, at visse former for snavs og kalk kan være så indgroede, at fuld fjernelse ikke kan garanteres. Renzen vil naturligvis gøre sit yderste for at opnå det bedst mulige resultat inden for de givne rammer.",
  },
];

export const FLYT_SCALE_TO_SERVICE_ID: Record<FlytStandLevel, number> = {
  1: 119,
  2: 115,
  3: 116,
  4: 117,
  5: 118,
};

export const FLYT_SCALE_PRICES = FLYT_STANDS.map((s) => s.ratePerSqm);

export type FlytExtraType = "quantity" | "checkbox";

export type FlytExtraCategory =
  | "bathroom"
  | "smoking"
  | "stand_confirmation"
  | "flyttesyn";

export type FlytExtraDefinition = {
  id: number;
  label: string;
  price: number;
  type: FlytExtraType;
  stands: FlytStandLevel[];
  category: FlytExtraCategory;
  required?: boolean;
  defaultQuantity?: number;
  minQuantity?: number;
};

export const FLYT_EXTRA_IDS = [85, 86, 87, 88, 89, 90, 91, 92] as const;

export const FLYT_EXTRAS: FlytExtraDefinition[] = [
  {
    id: 85,
    label: "Hvor mange toiletter/badeværelser er der i boligen?",
    price: 1000,
    type: "quantity",
    stands: [1, 2, 3, 4, 5],
    category: "bathroom",
    defaultQuantity: 1,
    minQuantity: 1,
  },
  {
    id: 86,
    label: "Er der røget i boligen?",
    price: 1084,
    type: "checkbox",
    stands: [1, 2, 3, 4, 5],
    category: "smoking",
  },
  {
    id: 87,
    label: "Bekræft venligst at boligen er ren og nyligt rengjort",
    price: 0,
    type: "checkbox",
    stands: [1],
    category: "stand_confirmation",
    required: true,
  },
  {
    id: 88,
    label:
      "Bekræft venligst at boligen er vedligeholdt, men ikke rengjort for nylig",
    price: 0,
    type: "checkbox",
    stands: [2],
    category: "stand_confirmation",
    required: true,
  },
  {
    id: 89,
    label:
      "Bekræft venligst at boligen er forsømt og ikke rengjort for nylig",
    price: 0,
    type: "checkbox",
    stands: [3],
    category: "stand_confirmation",
    required: true,
  },
  {
    id: 90,
    label: "Bekræft venligst at boligen er alvorligt misligholdt",
    price: 0,
    type: "checkbox",
    stands: [4],
    category: "stand_confirmation",
    required: true,
  },
  {
    id: 91,
    label:
      "Jeg accepterer, at Renzen ikke kan garantere, at boligen vil bestå et flyttesyn.",
    price: 0,
    type: "checkbox",
    stands: [4, 5],
    category: "flyttesyn",
    required: true,
  },
  {
    id: 92,
    label: "Bekræft venligst at boligen er i værst mulige stand",
    price: 0,
    type: "checkbox",
    stands: [5],
    category: "stand_confirmation",
    required: true,
  },
];

export type L27ExtraItem = {
  id: number;
  name: string;
  price: number;
  quantity_based?: boolean;
  mandatory?: boolean;
  recurring?: boolean;
};

export type L27Service = {
  id: number;
  name?: string;
  extras?: L27ExtraItem[];
};

export function isFlytStandLevel(value: number): value is FlytStandLevel {
  return value >= 1 && value <= 5;
}

export function getFlytStand(level: number): FlytStandDefinition {
  if (isFlytStandLevel(level)) {
    return FLYT_STANDS[level - 1];
  }
  return FLYT_STANDS[0];
}

export function getFlytStandByServiceId(
  serviceId: number,
): FlytStandDefinition | undefined {
  return FLYT_STANDS.find((stand) => stand.serviceId === serviceId);
}

export function clampFlytSqm(sqm: number): number {
  if (!Number.isFinite(sqm)) return FLYT_SQM_DEFAULT;
  return Math.min(FLYT_SQM_MAX, Math.max(FLYT_SQM_MIN, Math.round(sqm)));
}

export function calculateFlytLocalPrice(sqm: number, stand: FlytStandDefinition) {
  const total = Math.round(sqm * stand.ratePerSqm);
  const savings = Math.round(
    total * (serviceDeduction.approximateTaxValuePercent / 100),
  );
  const afterFradrag = calculatePriceAfterServiceDeduction(total);
  return { total, savings, afterFradrag };
}

export function buildFlytBookingPath(params: {
  stand: number;
  sqm: number;
}): string {
  const standDef = getFlytStand(params.stand);
  const sqm = clampFlytSqm(params.sqm);
  return `/flytterengoring/book/?stand=${standDef.level}&sqm=${sqm}&service_id=${standDef.serviceId}&pricing_param_id=${standDef.pricingParamId}&pricing_param_quantity=${sqm}`;
}

export function formatFlytKr(amount: number) {
  return `${amount.toLocaleString("da-DK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} kr.`;
}

export function formatFlytReceiptKr(amount: number) {
  return `${amount.toLocaleString("da-DK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} kr`;
}

const FLYT_EXTRA_RECEIPT_LABELS: Partial<Record<number, string>> = {
  85: "Ekstra badeværelse/toilet",
  86: "Rygning i boligen",
};

export function getFlytExtraReceiptLabel(
  id: number,
  availableExtras?: Pick<L27ExtraItem, "id" | "name">[],
): string {
  if (FLYT_EXTRA_RECEIPT_LABELS[id]) return FLYT_EXTRA_RECEIPT_LABELS[id]!;
  const l27Extra = availableExtras?.find((item) => item.id === id);
  return l27Extra?.name ?? "Tilvalg";
}

export type FlytReceiptLine = {
  label: string;
  amount: number;
};

export type L27EstimateData = {
  total?: number;
  subtotal?: number;
  discount?: number;
  services?: Array<{
    total?: number;
    extras?: Array<{
      id?: number;
      name?: string;
      price?: number;
      total?: number;
    }>;
  }>;
};

export type FlytReceiptBreakdown = {
  lines: FlytReceiptLine[];
  total: number;
  afterFradrag: number;
};

function getFlytExtraUnitPrice(
  id: string,
  availableExtras: L27ExtraItem[],
): number {
  const flytExtra = getFlytExtraById(parseInt(id, 10));
  if (flytExtra) return flytExtra.price;
  return availableExtras.find((item) => String(item.id) === id)?.price ?? 0;
}

function asObjectArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      item !== null && typeof item === "object",
  );
}

export function normalizeL27EstimateData(raw: unknown): L27EstimateData | null {
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const total =
    typeof record.total === "number" && Number.isFinite(record.total)
      ? record.total
      : undefined;
  const subtotal =
    typeof record.subtotal === "number" && Number.isFinite(record.subtotal)
      ? record.subtotal
      : undefined;
  const discount =
    typeof record.discount === "number" && Number.isFinite(record.discount)
      ? record.discount
      : undefined;

  const services = asObjectArray(record.services).map((service) => ({
    total:
      typeof service.total === "number" && Number.isFinite(service.total)
        ? service.total
        : undefined,
    extras: asObjectArray(service.extras).map((extra) => ({
      id: typeof extra.id === "number" ? extra.id : undefined,
      name: typeof extra.name === "string" ? extra.name : undefined,
      price:
        typeof extra.price === "number" && Number.isFinite(extra.price)
          ? extra.price
          : undefined,
      total:
        typeof extra.total === "number" && Number.isFinite(extra.total)
          ? extra.total
          : undefined,
    })),
  }));

  if (total === undefined && services.length === 0) return null;

  return {
    total,
    subtotal,
    discount,
    services,
  };
}

function parseAdminFeeFromEstimate(data: L27EstimateData | null): number | null {
  if (!data) return null;
  for (const service of asObjectArray(data.services)) {
    for (const extra of asObjectArray(service.extras)) {
      const name = typeof extra.name === "string" ? extra.name : "";
      if (/administrationsgebyr|administration\s*gebyr/i.test(name)) {
        const amount = Number(extra.total ?? extra.price);
        if (Number.isFinite(amount) && amount > 0) return amount;
      }
    }
  }
  return null;
}

export function buildFlytEstimateFingerprint(params: {
  sqm: number;
  serviceId: number;
  pricingParamId: number;
  selectedExtras: Record<string, number>;
  hiddenMandatoryExtras: L27ExtraItem[];
}): string {
  const extrasPayload = buildFlytExtrasPayload(
    params.selectedExtras,
    params.hiddenMandatoryExtras,
  );
  const sortedExtras = [...extrasPayload].sort((a, b) => a.id - b.id);
  return JSON.stringify({
    sqm: params.sqm,
    serviceId: params.serviceId,
    pricingParamId: params.pricingParamId,
    extras: sortedExtras,
  });
}

export function buildFlytReceiptBreakdown(params: {
  sqm: number;
  stand: FlytStandDefinition;
  selectedExtras: Record<string, number>;
  availableExtras: L27ExtraItem[];
  estimateTotal: number | null;
  estimateData?: L27EstimateData | null;
  isEstimating?: boolean;
  estimateReady?: boolean;
}): FlytReceiptBreakdown {
  const baseAmount = Math.round(params.sqm * params.stand.ratePerSqm);
  const lines: FlytReceiptLine[] = [
    {
      label: `Flytterengøring · ${params.sqm} m² · Stand ${params.stand.level}`,
      amount: baseAmount,
    },
  ];

  let extrasSum = 0;
  const extraEntries = Object.entries(params.selectedExtras)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10));

  for (const [id, qty] of extraEntries) {
    const extraId = parseInt(id, 10);
    const chargeQty =
      extraId === FLYT_BATHROOM_EXTRA_ID
        ? getFlytBathroomChargeableQty(qty)
        : qty;
    if (chargeQty <= 0) continue;

    const unitPrice = getFlytExtraUnitPrice(id, params.availableExtras);
    if (unitPrice <= 0) continue;
    const amount = unitPrice * chargeQty;
    extrasSum += amount;
    let label = getFlytExtraReceiptLabel(extraId, params.availableExtras);
    if (extraId === FLYT_BATHROOM_EXTRA_ID) {
      label = `Ekstra badeværelse/toilet (×${chargeQty})`;
    } else if (chargeQty > 1) {
      label += ` (×${chargeQty})`;
    }
    lines.push({ label, amount });
  }

  const localTotal = baseAmount + extrasSum;
  const estimateTotal =
    typeof params.estimateTotal === "number" && Number.isFinite(params.estimateTotal)
      ? params.estimateTotal
      : null;
  const estimateReady = params.estimateReady ?? true;
  const total =
    estimateReady && estimateTotal !== null ? estimateTotal : localTotal;

  let adminFee = 0;
  if (!params.isEstimating && estimateReady) {
    const parsedAdminFee = parseAdminFeeFromEstimate(
      normalizeL27EstimateData(params.estimateData ?? null),
    );
    if (parsedAdminFee !== null) {
      adminFee = parsedAdminFee;
    } else if (estimateTotal !== null && estimateTotal > localTotal) {
      adminFee = estimateTotal - localTotal;
    }
  }

  if (adminFee > 0) {
    lines.push({ label: "Administrationsgebyr", amount: adminFee });
  }

  return {
    lines,
    total,
    afterFradrag: calculatePriceAfterServiceDeduction(total),
  };
}

export function isFlytManagedExtraId(id: number): boolean {
  return (FLYT_EXTRA_IDS as readonly number[]).includes(id);
}

export function isFlytHiddenL27Extra(extra: Pick<L27ExtraItem, "id" | "name">): boolean {
  if (isFlytManagedExtraId(extra.id)) return true;
  return /administrationsgebyr|administration\s*gebyr/i.test(extra.name);
}

export function getFlytExtraById(id: number): FlytExtraDefinition | undefined {
  return FLYT_EXTRAS.find((extra) => extra.id === id);
}

export function getFlytStandConfirmationExtra(
  stand: FlytStandLevel,
): FlytExtraDefinition | undefined {
  return FLYT_EXTRAS.find(
    (extra) =>
      extra.category === "stand_confirmation" && extra.stands.includes(stand),
  );
}

export function getFlytFlyttesynExtra(
  stand: FlytStandLevel,
): FlytExtraDefinition | undefined {
  if (stand < 4) return undefined;
  return FLYT_EXTRAS.find((extra) => extra.id === 91);
}

export function getFlytBathroomExtra(): FlytExtraDefinition {
  return FLYT_EXTRAS.find((extra) => extra.id === FLYT_BATHROOM_EXTRA_ID)!;
}

/** Total bathrooms selected in the wizard (1 = included in base price). */
export function getFlytBathroomTotalCount(
  selectedExtras: Record<string, number>,
): number {
  return selectedExtras[String(FLYT_BATHROOM_EXTRA_ID)] ?? 0;
}

/** Chargeable bathrooms beyond the one included in the base flyt price. */
export function getFlytBathroomChargeableQty(totalCount: number): number {
  return Math.max(0, totalCount - FLYT_BATHROOM_INCLUDED_COUNT);
}

export function buildFlytExtrasPayload(
  selectedExtras: Record<string, number>,
  hiddenMandatoryExtras: L27ExtraItem[],
): { id: number; quantity: number; recurring: boolean }[] {
  const payload: { id: number; quantity: number; recurring: boolean }[] = [];

  Object.entries(selectedExtras).forEach(([id, qty]) => {
    if (qty <= 0) return;
    const extraId = parseInt(id, 10);
    let quantity = qty;
    if (extraId === FLYT_BATHROOM_EXTRA_ID) {
      quantity = getFlytBathroomChargeableQty(qty);
      if (quantity <= 0) return;
    }
    payload.push({
      id: extraId,
      quantity,
      recurring: false,
    });
  });

  hiddenMandatoryExtras.forEach((extra) => {
    if (payload.some((item) => item.id === extra.id)) return;
    payload.push({ id: extra.id, quantity: 1, recurring: false });
  });

  return payload;
}

export function getFlytSmokingExtra(): FlytExtraDefinition {
  return FLYT_EXTRAS.find((extra) => extra.id === 86)!;
}

export type FlytEntryOptionId = "home" | "mat" | "neighbor" | "other";

export type FlytEntryOption = {
  id: FlytEntryOptionId;
  label: string;
};

export const FLYT_ENTRY_OPTIONS: FlytEntryOption[] = [
  { id: "home", label: "Jeg er hjemme" },
  { id: "mat", label: "Jeg stiller nøglen under måtten" },
  { id: "neighbor", label: "Nøglen afhentes hos nabo" },
  { id: "other", label: "Andet" },
];

export type FlytArrivalSlot = {
  startHour: number;
  startMinute: number;
  arrivalWindow: number;
  label: string;
};

/** Full-day flytterengøring: only these 1-hour arrival windows are offered. */
export const FLYT_ARRIVAL_SLOTS: FlytArrivalSlot[] = [
  { startHour: 8, startMinute: 0, arrivalWindow: 60, label: "08:00 – 09:00" },
  { startHour: 9, startMinute: 0, arrivalWindow: 60, label: "09:00 – 10:00" },
];

export function isFlytAllowedArrivalSlot(
  hour: number,
  minute: number,
  arrivalWindow: number,
): boolean {
  return FLYT_ARRIVAL_SLOTS.some(
    (slot) =>
      slot.startHour === hour &&
      slot.startMinute === minute &&
      slot.arrivalWindow === arrivalWindow,
  );
}

type L27CustomFieldOption = {
  id?: string | number;
  label?: string;
  name?: string;
  value?: string;
};

export type L27CustomField = {
  id: number;
  label?: string;
  name?: string;
  values?: L27CustomFieldOption[];
  options?: L27CustomFieldOption[];
  choices?: L27CustomFieldOption[];
  field_values?: L27CustomFieldOption[];
  select_values?: L27CustomFieldOption[];
};

/** Flytterengøring L27 services (stand 1–5). Not book-rengoering service 246. */
export const FLYT_L27_SERVICE_IDS = Object.values(
  FLYT_SCALE_TO_SERVICE_ID,
) as number[];

export function isFlytL27ServiceId(serviceId: number): boolean {
  return FLYT_L27_SERVICE_IDS.includes(serviceId);
}

/** L27 custom field: "Vælg boligens nuværende stand (1 = meget ren, 5 = stærkt forsømt)". */
export const FLYT_L27_STAND_CUSTOM_FIELD_ID = 114;

export type FlytL27CustomFieldPayload = {
  id: number;
  value?: string;
  values?: { id: string | number; other?: string }[];
};

function normalizeFlytLabel(value: string) {
  return value.trim().toLowerCase();
}

function getL27CustomFieldOptions(field: L27CustomField): L27CustomFieldOption[] {
  for (const key of [
    "values",
    "options",
    "choices",
    "field_values",
    "select_values",
  ] as const) {
    const options = field[key];
    if (Array.isArray(options) && options.length > 0) return options;
  }
  return [];
}

function getL27CustomFieldOptionLabel(option: L27CustomFieldOption) {
  return String(option.label ?? option.name ?? option.value ?? "");
}

export function findFlytStandCustomField(
  fields: L27CustomField[],
): L27CustomField | undefined {
  const byId = fields.find((field) => field.id === FLYT_L27_STAND_CUSTOM_FIELD_ID);
  if (byId) return byId;

  return fields.find((field) => {
    const label = normalizeFlytLabel(field.label ?? field.name ?? "");
    return /boligens nuværende stand|nuværende stand/.test(label);
  });
}

function matchFlytStandCustomFieldOption(
  options: L27CustomFieldOption[],
  standLevel: FlytStandLevel,
) {
  const standToken = String(standLevel);
  return options.find((option) => {
    const label = normalizeFlytLabel(getL27CustomFieldOptionLabel(option));
    const value = normalizeFlytLabel(String(option.value ?? ""));
    return (
      label === standToken ||
      value === standToken ||
      label.startsWith(`${standToken} `) ||
      label.startsWith(`${standToken}.`) ||
      label.startsWith(`${standToken}-`)
    );
  });
}

export function buildFlytStandCustomFieldPayload(
  fields: L27CustomField[],
  standLevel: FlytStandLevel,
): FlytL27CustomFieldPayload | undefined {
  if (!isFlytStandLevel(standLevel)) return undefined;

  const field = findFlytStandCustomField(fields);
  const fieldId = field?.id ?? FLYT_L27_STAND_CUSTOM_FIELD_ID;
  const options = field ? getL27CustomFieldOptions(field) : [];

  if (options.length > 0) {
    const matchedOption = matchFlytStandCustomFieldOption(options, standLevel);
    if (matchedOption) {
      const optionId = matchedOption.id ?? matchedOption.value;
      if (optionId !== undefined && optionId !== "") {
        return {
          id: fieldId,
          values: [
            {
              id: typeof optionId === "number" ? optionId : String(optionId),
            },
          ],
        };
      }
    }
  }

  return { id: fieldId, value: String(standLevel) };
}

/** Flytterengøring booking custom fields — stand (114) required; adgang optional if configured in L27. */
export function buildFlytCustomFieldsPayload(
  fields: L27CustomField[],
  standLevel: FlytStandLevel,
  entryId?: FlytEntryOptionId | "",
  entryOtherDetails?: string,
): FlytL27CustomFieldPayload[] | undefined {
  const standPayload = buildFlytStandCustomFieldPayload(fields, standLevel);
  if (!standPayload) return undefined;

  const payload: FlytL27CustomFieldPayload[] = [standPayload];

  if (entryId) {
    const entryPayload = buildBookEntryCustomFieldPayload(
      findBookEntryCustomField(fields),
      entryId as BookEntryOptionId,
      entryOtherDetails ?? "",
    );
    if (entryPayload) payload.push(entryPayload);
  }

  return payload;
}
