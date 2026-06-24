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

/** Launch27 extras on service 213 (rengøringsstand tillæg). */
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
};

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

export function findBookEntryCustomField(
  fields: L27CustomField[],
): L27CustomField | undefined {
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

  return buildCustomFieldValue(
    field,
    entryOption.label,
    entryId === "other" ? otherDetails : undefined,
  );
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
  return buildCustomFieldValue(field, lastCleaned);
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
  serviceExtras: BookExtra[],
  includeKlub = false,
) {
  const payload = Object.entries(selectedExtras)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      id: parseInt(id, 10),
      quantity: qty,
      recurring,
    }));

  const cleanlinessExtra = findBookCleanlinessExtra(
    serviceExtras,
    cleanlinessLevel,
  );
  if (cleanlinessExtra) {
    payload.push({
      id: parseInt(cleanlinessExtra.id, 10),
      quantity: 1,
      recurring,
    });
  }

  if (includeKlub) {
    const klubExtra = findKlubExtra(serviceExtras);
    payload.push({
      id: klubExtra
        ? parseInt(klubExtra.id, 10)
        : L27_EXTRA_KLUB_ID,
      quantity: 1,
      recurring,
    });
  }

  return payload;
}
