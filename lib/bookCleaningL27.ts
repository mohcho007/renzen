/**
 * Book-rengoering ↔ Launch27 mapping.
 *
 * UI options are defined here (labels/prices) until L27 fields exist.
 * At booking time we fetch live custom_fields + extras from L27 and match
 * by field label + option label (or optional env IDs in .env.example).
 * If nothing matches yet, custom_fields are omitted and surcharges stay UI-only.
 */
import type { L27CustomField } from "@/lib/flytterengoring";

export type BookEntryOptionId = "home" | "mat" | "neighbor" | "other";

export type BookEntryOption = {
  id: BookEntryOptionId;
  label: string;
};

/** Matches L27 custom field "Hvordan får vi adgang til dit hjem?" */
export const BOOK_ENTRY_OPTIONS: BookEntryOption[] = [
  { id: "home", label: "Jeg er hjemme" },
  { id: "mat", label: "Jeg stiller nøglen under måtten" },
  { id: "neighbor", label: "Nøglen afhentes hos nabo" },
  { id: "other", label: "Andet" },
];

/** Book-rengoering Launch27 service (Almindelig rengøring / Boligens størrelse). */
export const L27_BOOK_SERVICE_ID = 246;
export const L27_BOOK_PRICING_PARAM_ID = 119;

/** L27 custom field: "Hvordan får vi adgang til dit hjem?" (not service 246). */
export const L27_BOOK_ENTRY_CUSTOM_FIELD_ID = 201;

/**
 * L27 custom field: "Hvornår blev der sidst gjort rent?" (required globally).
 * Numeric ID matches book-rengoering service id by coincidence — different namespace.
 */
export const L27_LAST_CLEANED_CUSTOM_FIELD_ID = 246;

const L27_LAST_CLEANED_OPTION_IDS: Record<string, number> = {
  "Inden for 1 uge": 49,
  "1–2 uger siden": 50,
  "2–4 uger siden": 51,
  "Over 1 måned siden": 52,
  "Ved ikke": 53,
};

const L27_ENTRY_OPTION_IDS: Record<BookEntryOptionId, number> = {
  home: 7,
  mat: 8,
  neighbor: 9,
  other: 15,
};

/** Launch27 extras on the book-rengoering service (rengøringsstand tillæg). */
export const L27_EXTRA_MEGET_BESKIDT_ID = 250;
export const L27_EXTRA_EKSTRA_TID_ID = 251;
export const L27_EXTRA_KLUB_ID = 184;

export const BOOK_CLEANLINESS_LEVELS = [
  {
    id: "clean",
    label: "Pæn og velholdt",
    sub: "Let at holde — standard tid",
    surchargeKr: 0,
    extraNameHints: [] as string[],
  },
  {
    id: "normal",
    label: "Normal brug",
    sub: "Typisk hverdagsrod",
    surchargeKr: 0,
    extraNameHints: [] as string[],
  },
  {
    id: "extra",
    label: "Trænger til ekstra tid",
    sub: "Mere oprydning før rengøring",
    surchargeKr: 199,
    extraNameHints: ["ekstra tid", "trænger til ekstra"],
  },
  {
    id: "heavy",
    label: "Meget beskidt",
    sub: "Kræver væsentligt mere tid",
    surchargeKr: 399,
    extraNameHints: ["meget beskidt", "beskidt"],
  },
] as const;

export type BookCleanlinessLevelId =
  (typeof BOOK_CLEANLINESS_LEVELS)[number]["id"];

/** Display copy for book-rengoering tilvalg (matched by L27 extra id or name). */
export const BOOK_EXTRAS_DISPLAY = [
  {
    id: "52",
    label: "Indvendig køleskab",
    sub: "Hylder, bakker og sider — frisk og hygiejnisk",
    nameHints: ["køleskab", "fridge"],
  },
  {
    id: "53",
    label: "Indvendig ovn og emhætte",
    sub: "Fedt og svider fjernes grundigt indvendigt",
    nameHints: ["ovn", "emhætte", "oven"],
  },
  {
    id: "217",
    label: "Køkken skabe",
    sub: "Indvendig aftørring — vælg antal skabe",
    nameHints: ["køkken", "skab", "cabinet"],
  },
  {
    id: "93",
    label: "Afkalkning af badeværelse",
    sub: "Fliser, armaturer og bruseniche skinner igen",
    nameHints: ["afkalk", "bad", "badeværelse"],
  },
  {
    id: "56",
    label: "Fodpaneler",
    sub: "Støv og pletter langs gulvet fjernes",
    nameHints: ["fodpanel"],
  },
  {
    id: "58",
    label: "Jeg har kæledyr",
    sub: "Ekstra tid til hår på møbler og gulve",
    nameHints: ["kæledyr", "hund", "kat", "dyr"],
  },
] as const;

export function resolveBookExtraDisplay(extra: {
  id?: string | number;
  name?: string;
}): { label: string; sub: string } {
  const id = String(extra.id ?? "");
  const byId = BOOK_EXTRAS_DISPLAY.find((item) => item.id === id);
  if (byId) return { label: byId.label, sub: byId.sub };

  const name = (extra.name ?? "").toLowerCase();
  const byHint = BOOK_EXTRAS_DISPLAY.find((item) =>
    item.nameHints.some((hint) => name.includes(hint)),
  );
  if (byHint) return { label: byHint.label, sub: byHint.sub };

  return {
    label: extra.name ?? "Tilvalg",
    sub: "Tilføj ekstra opgave til rengøringen",
  };
}

export const BOOK_LAST_CLEANED_OPTIONS = [
  "Inden for 1 uge",
  "1–2 uger siden",
  "2–4 uger siden",
  "Over 1 måned siden",
  "Ved ikke",
] as const;

type L27CustomFieldOption = {
  id?: string | number;
  label?: string;
  name?: string;
  value?: string;
};

type BookExtra = {
  id: string;
  name: string;
  price: number;
  mandatory?: boolean;
  recurring?: boolean;
};

export type BookServiceExtra = BookExtra;

type L27ExtraPayloadItem = {
  id: number;
  quantity: number;
  recurring: boolean;
};

function pushUniqueExtra(
  payload: L27ExtraPayloadItem[],
  id: number,
  quantity: number,
  recurring: boolean,
) {
  if (payload.some((item) => item.id === id)) return;
  payload.push({ id, quantity, recurring });
}

export function isCleanlinessBookExtra(extra: {
  id?: string | number;
  name?: string;
}): boolean {
  const id = parseInt(String(extra.id ?? ""), 10);
  if (
    id === L27_EXTRA_MEGET_BESKIDT_ID ||
    id === L27_EXTRA_EKSTRA_TID_ID
  ) {
    return true;
  }
  const name = (extra.name ?? "").toLowerCase();
  return (
    /rengøringsstand|boligstand|how clean/.test(name) ||
    /meget beskidt|ekstra tid|trænger til ekstra/.test(name)
  );
}

export function isSelectableL27Extra(extra: {
  id?: string | number;
  name?: string;
  mandatory?: boolean;
}): boolean {
  const id = parseInt(String(extra.id ?? ""), 10);
  if (id === L27_EXTRA_KLUB_ID) return false;
  if (isCleanlinessBookExtra(extra)) return false;

  const name = (extra.name ?? "").toLowerCase();
  if (extra.mandatory) return false;
  if (/administration/.test(name)) return false;
  if (/renzen\s*klub|klub medlemskab/.test(name)) return false;
  if (/sofagruppe/.test(name)) return false;
  return true;
}

export function isHiddenMandatoryBookExtra(extra: BookServiceExtra): boolean {
  if (isCleanlinessBookExtra(extra)) return false;

  const name = extra.name.toLowerCase();
  if (/renzen\s*klub|klub medlemskab/.test(name)) return false;
  if (/administrationsgebyr|administration\s*gebyr/.test(name)) return true;
  return !!extra.mandatory;
}

export function resolveL27BookingId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as { id?: unknown; booking_id?: unknown };
  if (record.booking_id != null && record.booking_id !== "") {
    return String(record.booking_id);
  }
  if (record.id != null && record.id !== "") {
    return String(record.id);
  }
  return null;
}

function mapL27ValidationMessage(message: string): string {
  if (/cannot be booked this time/i.test(message)) {
    return "Det valgte tidspunkt er ikke ledigt i Launch27. Vælg en anden dato eller et andet tidspunkt.";
  }

  if (/must be customer, not a staff member/i.test(message)) {
    return "Den indtastede e-mail er knyttet til en medarbejderkonto i vores bookingsystem. Brug venligst en anden e-mailadresse til bookingen.";
  }

  if (/value required:\s*id\s+(\d+)/i.test(message)) {
    const fieldId = message.match(/id\s+(\d+)/i)?.[1];
    if (fieldId === "114") {
      return "Boligens stand mangler i bookingen. Gå tilbage og bekræft standen, og prøv igen.";
    }
    if (fieldId === String(L27_BOOK_ENTRY_CUSTOM_FIELD_ID)) {
      return "Adgang til boligen mangler i bookingen. Gå tilbage til adgangstrinnet og prøv igen.";
    }
    if (fieldId === String(L27_LAST_CLEANED_CUSTOM_FIELD_ID)) {
      return "Sidst rengjort mangler i bookingen. Gå tilbage til boligtrinnet og prøv igen.";
    }
    return "Et påkrævet felt mangler i bookingen. Tjek boligens stand og adgang, og prøv igen.";
  }

  return message;
}

function extractL27FieldValidationMessage(
  details: Record<string, unknown>,
): string | undefined {
  for (const errors of Object.values(details)) {
    if (!Array.isArray(errors)) continue;
    for (const error of errors) {
      if (!error || typeof error !== "object") continue;
      const message = (error as { message?: string }).message;
      if (message) return message;
    }
  }
  return undefined;
}

export function parseL27BookingError(details: unknown, fallback: string): string {
  if (!details || typeof details !== "object") return fallback;

  const record = details as Record<string, unknown>;
  const services = record.services;
  if (Array.isArray(services) && services[0] && typeof services[0] === "object") {
    const message = (services[0] as { message?: string }).message;
    if (message) return mapL27ValidationMessage(message);
  }

  const fieldMessage = extractL27FieldValidationMessage(record);
  if (fieldMessage) return mapL27ValidationMessage(fieldMessage);

  return fallback;
}

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

function getCustomFieldOptions(field: L27CustomField): L27CustomFieldOption[] {
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

function getOptionLabel(option: L27CustomFieldOption) {
  return String(option.label ?? option.name ?? option.value ?? "");
}

function findFieldByLabel(
  fields: L27CustomField[],
  pattern: RegExp,
): L27CustomField | undefined {
  return fields.find((field) => {
    const label = normalizeLabel(field.label ?? field.name ?? "");
    return pattern.test(label);
  });
}

function normalizeCustomFieldId(id: unknown): number | null {
  const parsed = typeof id === "number" ? id : parseInt(String(id), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function findBookEntryCustomField(
  fields: L27CustomField[],
): L27CustomField | undefined {
  const byId = fields.find(
    (field) =>
      normalizeCustomFieldId(field.id) === L27_BOOK_ENTRY_CUSTOM_FIELD_ID,
  );
  if (byId) return byId;

  const withOptions = fields.filter(
    (field) => getCustomFieldOptions(field).length > 0,
  );

  const byLabel = withOptions.find((field) => {
    const label = normalizeLabel(field.label ?? field.name ?? "");
    return /adgang|indgang|nøgle|entry|kommer vi ind|får vi adgang/.test(label);
  });
  if (byLabel) return byLabel;

  return withOptions.find((field) => {
    const optionLabels = getCustomFieldOptions(field).map((option) =>
      normalizeLabel(getOptionLabel(option)),
    );
    const required = BOOK_ENTRY_OPTIONS.filter((option) => option.id !== "other")
      .map((option) => normalizeLabel(option.label));
    return required.every((label) => optionLabels.includes(label));
  });
}

export function findBookCleanlinessCustomField(
  fields: L27CustomField[],
): L27CustomField | undefined {
  return findFieldByLabel(
    fields,
    /rengøringsstand|boligstand|how clean|cleanliness/,
  );
}

export function findBookLastCleanedCustomField(
  fields: L27CustomField[],
): L27CustomField | undefined {
  const byId = fields.find(
    (field) =>
      normalizeCustomFieldId(field.id) === L27_LAST_CLEANED_CUSTOM_FIELD_ID,
  );
  if (byId) return byId;

  return findFieldByLabel(
    fields,
    /sidst gjort rent|senest rengjort|last cleaned/,
  );
}

function buildCustomFieldValue(
  field: L27CustomField | undefined,
  selectedLabel: string,
  otherText?: string,
) {
  if (!field?.id || !selectedLabel.trim()) return undefined;

  const l27Option = getCustomFieldOptions(field).find(
    (option) =>
      normalizeLabel(getOptionLabel(option)) ===
      normalizeLabel(selectedLabel),
  );
  if (!l27Option) return undefined;

  const optionId = l27Option.id ?? l27Option.value;
  if (optionId === undefined || optionId === "") return undefined;

  const value: { id: string | number; other?: string } = {
    id: typeof optionId === "number" ? optionId : String(optionId),
  };

  const other = otherText?.trim();
  if (other) {
    value.other = other;
  }

  return { id: field.id, values: [value] };
}

export function buildBookEntryCustomFieldPayload(
  field: L27CustomField | undefined,
  entryId: BookEntryOptionId,
  otherDetails: string,
) {
  const entryOption = BOOK_ENTRY_OPTIONS.find((option) => option.id === entryId);
  if (!entryOption) return undefined;

  const built = buildCustomFieldValue(
    field,
    entryOption.label,
    entryId === "other" ? otherDetails : undefined,
  );
  if (built) return built;

  const optionId = L27_ENTRY_OPTION_IDS[entryId];
  if (!optionId) return undefined;

  const value: { id: number; other?: string } = { id: optionId };
  if (entryId === "other") {
    const other = otherDetails.trim();
    if (!other) return undefined;
    value.other = other;
  }

  return {
    id: normalizeCustomFieldId(field?.id) ?? L27_BOOK_ENTRY_CUSTOM_FIELD_ID,
    values: [value],
  };
}

export function buildBookCleanlinessCustomFieldPayload(
  field: L27CustomField | undefined,
  levelId: BookCleanlinessLevelId | "",
) {
  if (!levelId || levelId === "extra" || levelId === "heavy") return undefined;

  const level = BOOK_CLEANLINESS_LEVELS.find((option) => option.id === levelId);
  if (!level) return undefined;

  return buildCustomFieldValue(field, level.label);
}

export function buildBookLastCleanedCustomFieldPayload(
  field: L27CustomField | undefined,
  lastCleaned: string,
) {
  const built = buildCustomFieldValue(field, lastCleaned);
  if (built) return built;

  const optionId = L27_LAST_CLEANED_OPTION_IDS[lastCleaned];
  if (!optionId) return undefined;

  return {
    id: normalizeCustomFieldId(field?.id) ?? L27_LAST_CLEANED_CUSTOM_FIELD_ID,
    values: [{ id: optionId }],
  };
}

export function buildBookCleaningCustomFieldsPayload(
  fields: L27CustomField[],
  entryId: BookEntryOptionId | "",
  entryOtherDetails: string,
  cleanlinessLevel: BookCleanlinessLevelId | "",
  lastCleaned: string,
) {
  const payload = [
    buildBookEntryCustomFieldPayload(
      findBookEntryCustomField(fields),
      entryId as BookEntryOptionId,
      entryOtherDetails,
    ),
    buildBookCleanlinessCustomFieldPayload(
      findBookCleanlinessCustomField(fields),
      cleanlinessLevel,
    ),
    buildBookLastCleanedCustomFieldPayload(
      findBookLastCleanedCustomField(fields),
      lastCleaned,
    ),
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return payload.length > 0 ? payload : undefined;
}

export function findBookCleanlinessExtra(
  extras: BookExtra[],
  levelId: BookCleanlinessLevelId | "",
): BookExtra | undefined {
  if (!levelId || levelId === "clean" || levelId === "normal") return undefined;

  const fixedId =
    levelId === "heavy"
      ? L27_EXTRA_MEGET_BESKIDT_ID
      : levelId === "extra"
        ? L27_EXTRA_EKSTRA_TID_ID
        : null;
  if (fixedId !== null) {
    const fromApi = extras.find((extra) => parseInt(extra.id, 10) === fixedId);
    if (fromApi) return fromApi;
    return { id: String(fixedId), name: levelId, price: 0 };
  }

  const level = BOOK_CLEANLINESS_LEVELS.find((option) => option.id === levelId);
  if (!level) return undefined;

  const byHint = extras.find((extra) => {
    const name = normalizeLabel(extra.name);
    return level.extraNameHints.some((hint) => name.includes(hint));
  });
  if (byHint) return byHint;

  if (level.surchargeKr > 0) {
    return extras.find((extra) => extra.price === level.surchargeKr);
  }

  return undefined;
}

export function findKlubExtra(extras: BookExtra[]): BookExtra | undefined {
  const fromApi = extras.find(
    (extra) => parseInt(extra.id, 10) === L27_EXTRA_KLUB_ID,
  );
  if (fromApi) return fromApi;

  return extras.find((extra) =>
    /renzen\s*klub|klub medlemskab/i.test(extra.name),
  );
}

export function buildBookCleaningExtrasPayload(
  selectedExtras: Record<string, number>,
  recurring: boolean,
  cleanlinessLevel: BookCleanlinessLevelId | "",
  serviceExtras: BookServiceExtra[],
  includeKlub = false,
) {
  const payload: L27ExtraPayloadItem[] = [];

  Object.entries(selectedExtras).forEach(([id, qty]) => {
    if (qty <= 0) return;
    const meta = serviceExtras.find(
      (extra) => parseInt(extra.id, 10) === parseInt(id, 10),
    );
    pushUniqueExtra(
      payload,
      parseInt(id, 10),
      qty,
      recurring && !!meta?.recurring,
    );
  });

  serviceExtras
    .filter(isHiddenMandatoryBookExtra)
    .forEach((extra) => {
      pushUniqueExtra(
        payload,
        parseInt(extra.id, 10),
        1,
        recurring && !!extra.recurring,
      );
    });

  const cleanlinessExtra = findBookCleanlinessExtra(
    serviceExtras,
    cleanlinessLevel,
  );
  if (cleanlinessExtra) {
    pushUniqueExtra(
      payload,
      parseInt(cleanlinessExtra.id, 10),
      1,
      recurring && !!cleanlinessExtra.recurring,
    );
  }

  if (includeKlub) {
    const klubExtra = findKlubExtra(serviceExtras);
    const klubRecurring = recurring && (klubExtra?.recurring ?? true);
    pushUniqueExtra(
      payload,
      klubExtra ? parseInt(klubExtra.id, 10) : L27_EXTRA_KLUB_ID,
      1,
      klubRecurring,
    );
  }

  return payload;
}
