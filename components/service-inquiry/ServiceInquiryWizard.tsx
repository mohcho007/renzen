"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import { TermsConfirmCard, TermsLink } from "@/components/forms/TermsConfirmCard";
import {
  BOLIGFORENING_FREQUENCY_OPTIONS,
  BOLIGFORENING_TASK_OPTIONS,
  COMMERCIAL_ENTRY_OPTIONS,
  AIRBNB_BATHROOM_OPTIONS,
  AIRBNB_BEDROOM_OPTIONS,
  AIRBNB_FREQUENCY_OPTIONS,
  FACILITY_COUNT_PILL_OPTIONS,
  FERIESERVICE_CARE_OPTIONS,
  FLYTTESYN_INSPECTION_OPTIONS,
  formatFacilityCountLabel,
  GARDEN_SIZE_CATEGORY_OPTIONS,
  HAVEARBEJDE_TASK_OPTIONS,
  HOVEDRENGORING_FREQUENCY_OPTIONS,
  isCommercialServiceSlug,
  isPersonalegodeSlug,
  usesPreferredTiming,
  KONTOR_FREQUENCY_OPTIONS,
  KONTOR_TIME_OPTIONS,
  PERSONALEGODE_ENTRY_OPTIONS,
  PERSONALEGODE_HOUSING_OPTIONS,
  PERSONALEGODE_MODEL_OPTIONS,
  PREFERRED_TIMING_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  SAESON_OPTIONS,
  SERVICE_ENTRY_OPTIONS,
  VINDUES_CLEANING_TYPE_OPTIONS,
  VINDUES_FLOOR_OPTIONS,
  FULL_WEEK_DAY_OPTIONS,
  WEEKDAY_DAY_OPTIONS,
  WINDOW_COUNT_OPTIONS,
  type GardenSizeCategory,
  type BoligforeningTaskTypeId,
  type FacilityCount,
  type FullWeekDayId,
  type PreferredTimingId,
  type ServiceEntryOptionId,
  type ServiceInquiryPayload,
  type ServiceInquirySlug,
  type WeekdayDayId,
} from "@/lib/serviceInquiry";
import { sanitizeOptionalNote } from "@/lib/optionalNote";
import { getPostcodeDisplayLabel } from "@/lib/postcodeLabels";
import wizardStyles from "./ServiceInquiryWizard.module.css";

type DawaAdresse = {
  vejnavn: string;
  husnr: string;
  etage?: string | null;
  dør?: string | null;
  postnr: string;
  postnrnavn: string;
};

type DawaAddressSuggestion = {
  tekst: string;
  adresse: DawaAdresse;
};

const STEPS = ["adresse", "detaljer", "dato", "adgang", "kontakt"] as const;

function formatStreetAddress(adresse: DawaAdresse) {
  let line = `${adresse.vejnavn} ${adresse.husnr}`;
  if (adresse.etage) line += `, ${adresse.etage}.`;
  if (adresse.dør) line += ` ${adresse.dør}`;
  return line;
}

function toLocalYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMaxSelectableDate() {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setFullYear(max.getFullYear() + 1);
  return max;
}

function isDateInPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getMondayOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

function getWeekOffsetForDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = getMondayOfWeek(today);
  const selectedMonday = getMondayOfWeek(date);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round(
    (selectedMonday.getTime() - currentMonday.getTime()) / msPerWeek,
  );
}

function nextWeekdays(weekOffset: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  const weekdays: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekdays.push(d);
  }
  return weekdays;
}

function getDaysInMonth(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  let startDow = firstOfMonth.getDay();
  startDow = (startDow + 6) % 7;

  const startDate = new Date(year, month, 1);
  startDate.setDate(startDate.getDate() - startDow);

  const days: Date[] = [];
  const current = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function clampSqm(value: number) {
  return Math.min(400, Math.max(20, value));
}

function clampOfficeSqm(value: number) {
  return Math.min(5000, Math.max(20, value));
}

function clampGardenSqm(value: number) {
  return Math.min(2000, Math.max(20, value));
}

function parseInitialGardenSqm(m2Param: string | null) {
  if (!m2Param) return 150;
  const parsed = Number.parseInt(m2Param.replace(/\D/g, ""), 10);
  if (Number.isNaN(parsed) || parsed < 20) return 150;
  return clampGardenSqm(parsed);
}

function isGardenServiceSlug(slug: ServiceInquirySlug) {
  return (
    slug === "havearbejde" ||
    slug === "foraars-og-efteraarsklargoering" ||
    slug === "ferieservice-til-haven"
  );
}

type FacilityCountPillsProps = {
  label: string;
  value: FacilityCount;
  onChange: (value: FacilityCount) => void;
  ariaLabel: string;
};

function FacilityCountPills({
  label,
  value,
  onChange,
  ariaLabel,
}: FacilityCountPillsProps) {
  const inputId = `${ariaLabel.replace(/\s+/g, "-").toLowerCase()}-custom`;

  return (
    <div className={flytStyles.entryOtherField}>
      <p className={styles.fieldLabel}>{label}</p>
      <div
        className={flytStyles.pillGroup}
        role="group"
        aria-label={ariaLabel}
      >
        {FACILITY_COUNT_PILL_OPTIONS.map((option) => {
          const isThreePlus = option === 3;
          const pillLabel = isThreePlus ? "3+" : String(option);
          const isSelected = isThreePlus ? value >= 3 : value === option;
          return (
            <button
              key={option}
              type="button"
              className={`${flytStyles.pillBtn} ${isSelected ? flytStyles.pillBtnSelected : ""}`}
              onClick={() => onChange(isThreePlus ? Math.max(3, value >= 3 ? value : 3) : option)}
              aria-pressed={isSelected}
            >
              {pillLabel}
            </button>
          );
        })}
      </div>
      {value >= 3 && (
        <div className={styles.m2FormField}>
          <label className={styles.fieldLabel} htmlFor={inputId}>
            Angiv antal
          </label>
          <input
            id={inputId}
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={3}
            max={999}
            value={value}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              onChange(
                Number.isNaN(parsed) ? 3 : Math.min(999, Math.max(3, parsed)),
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

function CommercialFacilityFields({
  kitchenCount,
  setKitchenCount,
  toiletCount,
  setToiletCount,
  workplaceCount,
  setWorkplaceCount,
}: {
  kitchenCount: FacilityCount;
  setKitchenCount: (value: FacilityCount) => void;
  toiletCount: FacilityCount;
  setToiletCount: (value: FacilityCount) => void;
  workplaceCount: FacilityCount;
  setWorkplaceCount: (value: FacilityCount) => void;
}) {
  return (
    <>
      <FacilityCountPills
        label="Antal køkkener"
        value={kitchenCount}
        onChange={setKitchenCount}
        ariaLabel="Antal køkkener"
      />
      <FacilityCountPills
        label="Antal toiletter"
        value={toiletCount}
        onChange={setToiletCount}
        ariaLabel="Antal toiletter"
      />
      <FacilityCountPills
        label="Antal arbejdspladser"
        value={workplaceCount}
        onChange={setWorkplaceCount}
        ariaLabel="Antal arbejdspladser"
      />
    </>
  );
}

function parseInitialSqm(m2Param: string | null) {
  if (!m2Param) return 80;
  const parsed = Number.parseInt(m2Param.replace(/\D/g, ""), 10);
  if (Number.isNaN(parsed) || parsed < 20) return 80;
  return clampSqm(parsed);
}

function parseInitialWindowCount(m2Param: string | null) {
  if (!m2Param) return 12;
  const parsed = Number.parseInt(m2Param.replace(/\D/g, ""), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return 12;
  return WINDOW_COUNT_OPTIONS.reduce((closest, option) =>
    Math.abs(option - parsed) < Math.abs(closest - parsed) ? option : closest,
  );
}

function parseInitialCount(m2Param: string | null, fallback: number, max = 999) {
  if (!m2Param) return fallback;
  const parsed = Number.parseInt(m2Param.replace(/\D/g, ""), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(max, parsed);
}

function formatGardenSizeLabel(
  mode: "sqm" | "category",
  sqm: number,
  category: GardenSizeCategory,
) {
  if (mode === "sqm") return `${sqm} m²`;
  return (
    GARDEN_SIZE_CATEGORY_OPTIONS.find((option) => option.id === category)
      ?.label || category
  );
}

function parseInitialPostcode(postcodeParam: string | null) {
  if (!postcodeParam) return "";
  const match = postcodeParam.replace(/\D/g, "").slice(0, 4);
  return match.length === 4 ? match : "";
}

type GardenSizeFieldsProps = {
  gardenSizeMode: "sqm" | "category";
  setGardenSizeMode: (mode: "sqm" | "category") => void;
  gardenSqm: number;
  setGardenSqm: (value: number) => void;
  gardenSizeCategory: GardenSizeCategory;
  setGardenSizeCategory: (value: GardenSizeCategory) => void;
};

function GardenSizeFields({
  gardenSizeMode,
  setGardenSizeMode,
  gardenSqm,
  setGardenSqm,
  gardenSizeCategory,
  setGardenSizeCategory,
}: GardenSizeFieldsProps) {
  return (
    <>
      <div className={flytStyles.entryOtherField}>
        <p className={styles.fieldLabel}>Havestørrelse</p>
        <div className={flytStyles.optionGrid}>
          <button
            type="button"
            className={`${flytStyles.optionBtn} ${gardenSizeMode === "sqm" ? flytStyles.optionBtnSelected : ""}`}
            onClick={() => setGardenSizeMode("sqm")}
          >
            Angiv m²
          </button>
          <button
            type="button"
            className={`${flytStyles.optionBtn} ${gardenSizeMode === "category" ? flytStyles.optionBtnSelected : ""}`}
            onClick={() => setGardenSizeMode("category")}
          >
            Lille / mellem / stor
          </button>
        </div>
      </div>

      {gardenSizeMode === "sqm" ? (
        <div className={styles.m2FormField}>
          <label className={styles.fieldLabel} htmlFor="garden-sqm">
            Havens areal
          </label>
          <div className={styles.m2FormWrap}>
            <input
              id="garden-sqm"
              className={`${styles.input} ${styles.m2FormInput}`}
              type="number"
              inputMode="numeric"
              min={20}
              max={2000}
              value={gardenSqm}
              onChange={(event) =>
                setGardenSqm(Number(event.target.value) || 0)
              }
            />
            <span className={styles.m2FormSuffix}>m²</span>
          </div>
        </div>
      ) : (
        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Størrelse</p>
          <div className={styles.choiceList}>
            {GARDEN_SIZE_CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.choice} ${gardenSizeCategory === option.id ? styles.choiceSelected : ""}`}
                onClick={() => setGardenSizeCategory(option.id)}
              >
                <span className={styles.choiceTitle}>{option.label}</span>
                <span className={styles.choiceSub}>{option.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

type ServiceInquiryWizardProps = {
  serviceSlug: ServiceInquirySlug;
  serviceName: string;
  embedded?: boolean;
};

export function ServiceInquiryWizard({
  serviceSlug,
  serviceName,
  embedded = true,
}: ServiceInquiryWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postcodeParam = searchParams.get("postcode");
  const m2Param = searchParams.get("m2");
  const initialPostcode = parseInitialPostcode(postcodeParam);
  const initialSqm = parseInitialSqm(m2Param);

  const initialGardenSqm = parseInitialGardenSqm(m2Param);

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const [address, setAddress] = useState("");
  const [zip, setZip] = useState(initialPostcode);
  const [city, setCity] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    DawaAddressSuggestion[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);

  const [sqm, setSqm] = useState(initialSqm);
  const [propertyType, setPropertyType] =
    useState<(typeof PROPERTY_TYPE_OPTIONS)[number]["id"]>("lejlighed");
  const [frequency, setFrequency] =
    useState<(typeof HOVEDRENGORING_FREQUENCY_OPTIONS)[number]["id"]>("engangs");
  const [specialNotes, setSpecialNotes] = useState("");
  const [bedroomCount, setBedroomCount] = useState<
    (typeof AIRBNB_BEDROOM_OPTIONS)[number]
  >(1);
  const [bathroomCount, setBathroomCount] = useState<
    (typeof AIRBNB_BATHROOM_OPTIONS)[number]
  >(1);
  const [airbnbFrequency, setAirbnbFrequency] =
    useState<(typeof AIRBNB_FREQUENCY_OPTIONS)[number]["id"]>("per_gaesteskifte");

  const [windowCount, setWindowCount] = useState(() =>
    parseInitialWindowCount(m2Param),
  );
  const [floors, setFloors] =
    useState<(typeof VINDUES_FLOOR_OPTIONS)[number]["id"]>("1");
  const [cleaningType, setCleaningType] =
    useState<(typeof VINDUES_CLEANING_TYPE_OPTIONS)[number]["id"]>("begge");
  const [accessNotes, setAccessNotes] = useState("");

  const [gardenSizeMode, setGardenSizeMode] = useState<"sqm" | "category">("sqm");
  const [gardenSqm, setGardenSqm] = useState(initialGardenSqm);
  const [gardenSizeCategory, setGardenSizeCategory] =
    useState<GardenSizeCategory>("mellem");
  const [taskTypes, setTaskTypes] = useState<
    (typeof HAVEARBEJDE_TASK_OPTIONS)[number]["id"][]
  >(["graesslaaning"]);
  const [taskNotes, setTaskNotes] = useState("");
  const [season, setSeason] =
    useState<(typeof SAESON_OPTIONS)[number]["id"]>("foraar");
  const [periodNotes, setPeriodNotes] = useState("");
  const [seasonSpecialNotes, setSeasonSpecialNotes] = useState("");
  const [holidayFrom, setHolidayFrom] = useState("");
  const [holidayTo, setHolidayTo] = useState("");
  const [careTasks, setCareTasks] = useState<string[]>(["vanding"]);
  const [careNotes, setCareNotes] = useState("");

  const [officeSqm, setOfficeSqm] = useState(initialSqm);
  const [employeeCount, setEmployeeCount] = useState(10);
  const [kontorFrequency, setKontorFrequency] =
    useState<(typeof KONTOR_FREQUENCY_OPTIONS)[number]["id"]>("ugentlig");
  const [preferredTime, setPreferredTime] =
    useState<(typeof KONTOR_TIME_OPTIONS)[number]["id"]>("fleksibel");
  const [cvr, setCvr] = useState("");
  const [preferredCleaningDays, setPreferredCleaningDays] = useState<
    FullWeekDayId[]
  >([]);
  const [taskDescription, setTaskDescription] = useState("");

  const [staircaseCount, setStaircaseCount] = useState(() =>
    parseInitialCount(m2Param, 3),
  );
  const [commonAreaSqm, setCommonAreaSqm] = useState(200);
  const [boligTaskTypes, setBoligTaskTypes] = useState<BoligforeningTaskTypeId[]>(
    ["trappe"],
  );
  const [boligFrequency, setBoligFrequency] =
    useState<(typeof BOLIGFORENING_FREQUENCY_OPTIONS)[number]["id"]>("ugentlig");
  const [boligTaskDescription, setBoligTaskDescription] = useState("");
  const [associationName, setAssociationName] = useState("");

  const [personaleEmployeeCount, setPersonaleEmployeeCount] = useState(() =>
    parseInitialCount(m2Param, 25),
  );
  const [benefitModel, setBenefitModel] =
    useState<(typeof PERSONALEGODE_MODEL_OPTIONS)[number]["id"]>("loebende");
  const [employeeHousingType, setEmployeeHousingType] =
    useState<(typeof PERSONALEGODE_HOUSING_OPTIONS)[number]["id"]>("blandet");
  const [wishDescription, setWishDescription] = useState("");

  const [flyttesynPropertySqm, setFlyttesynPropertySqm] = useState(initialSqm);
  const [flyttesynInspectionType, setFlyttesynInspectionType] =
    useState<(typeof FLYTTESYN_INSPECTION_OPTIONS)[number]["id"]>("indflytning");
  const [flyttesynTaskDescription, setFlyttesynTaskDescription] = useState("");

  const [kitchenCount, setKitchenCount] = useState<FacilityCount>(1);
  const [toiletCount, setToiletCount] = useState<FacilityCount>(1);
  const [workplaceCount, setWorkplaceCount] = useState<FacilityCount>(1);

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTiming, setPreferredTiming] = useState<PreferredTimingId | "">(
    "",
  );
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [entryMethod, setEntryMethod] = useState<ServiceEntryOptionId | "">("");
  const [entryOtherDetails, setEntryOtherDetails] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (embedded) {
      formColumnRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    shellRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    formColumnRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [stepIndex, embedded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!detailsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [detailsOpen]);

  useEffect(() => {
    const activePostcode = parseInitialPostcode(postcodeParam);
    if (!activePostcode) return;

    setZip(activePostcode);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/postnumre/${activePostcode}`,
        );
        if (!res.ok || cancelled) return;
        const data: { navn?: string } = await res.json();
        if (data.navn) setCity(data.navn);
      } catch {
        // City lookup is optional; zip alone is enough for the address step badge.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postcodeParam]);

  useEffect(() => {
    if (
      serviceSlug !== "hovedrengoring" &&
      serviceSlug !== "kontorrengoring" &&
      serviceSlug !== "flyttesyn" &&
      serviceSlug !== "airbnb-rengoring"
    ) {
      return;
    }
    const parsed = parseInitialSqm(m2Param);
    if (serviceSlug === "hovedrengoring" || serviceSlug === "airbnb-rengoring") {
      setSqm(parsed);
    }
    if (serviceSlug === "kontorrengoring") setOfficeSqm(parsed);
    if (serviceSlug === "flyttesyn") setFlyttesynPropertySqm(parsed);
  }, [m2Param, serviceSlug]);

  useEffect(() => {
    if (serviceSlug !== "vinduespudsning") return;
    setWindowCount(parseInitialWindowCount(m2Param));
  }, [m2Param, serviceSlug]);

  useEffect(() => {
    if (serviceSlug !== "boligforeninger") return;
    setStaircaseCount(parseInitialCount(m2Param, 3));
  }, [m2Param, serviceSlug]);

  useEffect(() => {
    if (serviceSlug !== "personalegode") return;
    setPersonaleEmployeeCount(parseInitialCount(m2Param, 25));
  }, [m2Param, serviceSlug]);

  useEffect(() => {
    if (!isGardenServiceSlug(serviceSlug)) return;
    setGardenSqm(parseInitialGardenSqm(m2Param));
  }, [m2Param, serviceSlug]);

  const toggleCareTask = useCallback((taskId: string) => {
    setCareTasks((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }, []);

  const toggleTaskType = useCallback(
    (taskId: (typeof HAVEARBEJDE_TASK_OPTIONS)[number]["id"]) => {
      setTaskTypes((current) =>
        current.includes(taskId)
          ? current.filter((id) => id !== taskId)
          : [...current, taskId],
      );
    },
    [],
  );

  const toggleBoligTaskType = useCallback((taskId: BoligforeningTaskTypeId) => {
    setBoligTaskTypes((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }, []);

  const togglePreferredCleaningDay = useCallback((dayId: FullWeekDayId) => {
    setPreferredCleaningDays((current) =>
      current.includes(dayId)
        ? current.filter((id) => id !== dayId)
        : [...current, dayId],
    );
  }, []);

  const entryOptions = isPersonalegodeSlug(serviceSlug)
    ? PERSONALEGODE_ENTRY_OPTIONS
    : isCommercialServiceSlug(serviceSlug)
      ? COMMERCIAL_ENTRY_OPTIONS
      : SERVICE_ENTRY_OPTIONS;

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setZip("");
    setCity("");

    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);

    if (value.trim().length < 2) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    addressDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(value)}&per_side=8`,
        );
        if (res.ok) {
          const data: DawaAddressSuggestion[] = await res.json();
          setAddressSuggestions(data);
          setShowAddressSuggestions(data.length > 0);
        }
      } catch {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
    }, 250);
  };

  const handleAddressSelect = (suggestion: DawaAddressSuggestion) => {
    const { adresse } = suggestion;
    setAddress(formatStreetAddress(adresse));
    setZip(adresse.postnr);
    setCity(getPostcodeDisplayLabel(adresse.postnr, adresse.postnrnavn));
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  const postnummerFilled = zip.length === 4 && city.trim().length > 0;

  const maxSelectableDate = useMemo(() => getMaxSelectableDate(), []);
  const maxWeekOffset = useMemo(
    () => Math.max(0, getWeekOffsetForDate(maxSelectableDate)),
    [maxSelectableDate],
  );
  const weekdayDates = useMemo(() => nextWeekdays(weekOffset), [weekOffset]);
  const calendarDays = useMemo(() => getDaysInMonth(viewDate), [viewDate]);
  const calendarMonthLabel = viewDate.toLocaleDateString("da-DK", {
    month: "long",
    year: "numeric",
  });

  const selectedDateOutsideWeek = useMemo(() => {
    if (!preferredDate) return false;
    return !weekdayDates.some((d) => toLocalYmd(d) === preferredDate);
  }, [preferredDate, weekdayDates]);

  const weekLabel = useMemo(() => {
    const monday = weekdayDates[0];
    if (!monday) return "";
    const month = monday.toLocaleDateString("da-DK", { month: "long" });
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    if (weekOffset === 0) return `${capitalized} · denne uge`;
    if (weekOffset === 1) return `${capitalized} · næste uge`;
    return `${capitalized} · om ${weekOffset} uger`;
  }, [weekdayDates, weekOffset]);

  const isDateSelectable = useCallback(
    (date: Date) => {
      if (isDateInPast(date)) return false;
      return date <= maxSelectableDate;
    },
    [maxSelectableDate],
  );

  const handleDateSelect = useCallback((dateStr: string) => {
    setPreferredDate(dateStr);
    setViewDate(
      new Date(
        Number.parseInt(dateStr.slice(0, 4), 10),
        Number.parseInt(dateStr.slice(5, 7), 10) - 1,
        1,
      ),
    );
  }, []);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  useEffect(() => {
    if (step !== "dato" || usesPreferredTiming(serviceSlug) || preferredDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setWeekOffset(0);
  }, [step, preferredDate, serviceSlug]);

  const gardenSizeValid =
    gardenSizeMode === "sqm"
      ? gardenSqm >= 20 && gardenSqm <= 2000
      : true;

  const canContinue = useMemo(() => {
    switch (step) {
      case "adresse":
        return address.trim().length > 2 && postnummerFilled;
      case "detaljer":
        if (serviceSlug === "hovedrengoring") {
          return sqm >= 20 && sqm <= 400;
        }
        if (serviceSlug === "airbnb-rengoring") {
          return (
            sqm >= 20 &&
            sqm <= 400 &&
            bedroomCount >= 1 &&
            bathroomCount >= 1
          );
        }
        if (serviceSlug === "vinduespudsning") {
          return windowCount >= 1 && cleaningType.length > 0;
        }
        if (serviceSlug === "havearbejde") {
          return gardenSizeValid && taskTypes.length > 0;
        }
        if (serviceSlug === "foraars-og-efteraarsklargoering") {
          return gardenSizeValid && season.length > 0;
        }
        if (serviceSlug === "ferieservice-til-haven") {
          return (
            gardenSizeValid &&
            holidayFrom.length === 10 &&
            holidayTo.length === 10 &&
            holidayFrom <= holidayTo &&
            careTasks.length > 0
          );
        }
        if (serviceSlug === "kontorrengoring") {
          return (
            officeSqm >= 20 &&
            officeSqm <= 5000 &&
            employeeCount >= 1
          );
        }
        if (serviceSlug === "boligforeninger") {
          return (
            staircaseCount >= 1 &&
            commonAreaSqm >= 20 &&
            commonAreaSqm <= 5000 &&
            boligTaskTypes.length > 0
          );
        }
        if (serviceSlug === "personalegode") {
          return personaleEmployeeCount >= 1;
        }
        if (serviceSlug === "flyttesyn") {
          return (
            flyttesynPropertySqm >= 20 &&
            flyttesynPropertySqm <= 5000 &&
            flyttesynInspectionType.length > 0
          );
        }
        return false;
      case "dato":
        if (usesPreferredTiming(serviceSlug)) {
          return preferredTiming.length > 0;
        }
        return preferredDate.length === 10;
      case "adgang":
        if (!entryMethod) return false;
        if (entryMethod === "other" || entryMethod === "door_code") {
          return entryOtherDetails.trim().length > 0;
        }
        return true;
      case "kontakt": {
        const contactValid =
          firstName.trim().length > 0 &&
          lastName.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          phone.replace(/\D/g, "").length >= 8 &&
          termsAccepted;
        if (serviceSlug === "boligforeninger") {
          return contactValid && associationName.trim().length > 0;
        }
        return contactValid;
      }
      default:
        return false;
    }
  }, [
    step,
    address,
    postnummerFilled,
    serviceSlug,
    sqm,
    bedroomCount,
    bathroomCount,
    windowCount,
    cleaningType,
    gardenSizeValid,
    taskTypes,
    season,
    holidayFrom,
    holidayTo,
    careTasks,
    officeSqm,
    employeeCount,
    staircaseCount,
    commonAreaSqm,
    boligTaskTypes,
    associationName,
    personaleEmployeeCount,
    flyttesynPropertySqm,
    flyttesynInspectionType,
    preferredTiming,
    preferredDate,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    termsAccepted,
    taskDescription,
  ]);

  const buildPayload = useCallback((): ServiceInquiryPayload => {
    let details: ServiceInquiryPayload["details"];

    if (serviceSlug === "hovedrengoring") {
      details = {
        sqm,
        propertyType,
        frequency,
        specialNotes: sanitizeOptionalNote(specialNotes),
      };
    } else if (serviceSlug === "airbnb-rengoring") {
      details = {
        sqm,
        propertyType,
        bedroomCount,
        bathroomCount,
        frequency: airbnbFrequency,
        specialNotes: sanitizeOptionalNote(specialNotes),
      };
    } else if (serviceSlug === "vinduespudsning") {
      details = {
        windowCount,
        floors,
        cleaningType,
        accessNotes: sanitizeOptionalNote(accessNotes),
      };
    } else if (serviceSlug === "havearbejde") {
      details = {
        gardenSizeMode,
        gardenSqm,
        gardenSizeCategory,
        taskTypes,
        taskNotes: sanitizeOptionalNote(taskNotes),
      };
    } else if (serviceSlug === "foraars-og-efteraarsklargoering") {
      details = {
        season,
        gardenSizeMode,
        gardenSqm,
        gardenSizeCategory,
        periodNotes: sanitizeOptionalNote(periodNotes),
        specialNotes: sanitizeOptionalNote(seasonSpecialNotes),
      };
    } else if (serviceSlug === "ferieservice-til-haven") {
      details = {
        holidayFrom,
        holidayTo,
        gardenSizeMode,
        gardenSqm,
        gardenSizeCategory,
        careTasks,
        careNotes: sanitizeOptionalNote(careNotes),
      };
    } else if (serviceSlug === "kontorrengoring") {
      details = {
        officeSqm,
        employeeCount,
        frequency: kontorFrequency,
        preferredTime,
        preferredCleaningDays: preferredCleaningDays as WeekdayDayId[],
        cvr,
        taskDescription,
        kitchenCount,
        toiletCount,
        workplaceCount,
      };
    } else if (serviceSlug === "boligforeninger") {
      details = {
        staircaseCount,
        commonAreaSqm,
        taskTypes: boligTaskTypes,
        frequency: boligFrequency,
        preferredCleaningDays,
        kitchenCount,
        toiletCount,
        workplaceCount,
        associationName: associationName.trim(),
        taskDescription: boligTaskDescription,
      };
    } else if (serviceSlug === "personalegode") {
      details = {
        employeeCount: personaleEmployeeCount,
        benefitModel,
        employeeHousingType,
        wishDescription,
        cvr,
      };
    } else if (serviceSlug === "flyttesyn") {
      details = {
        propertySqm: flyttesynPropertySqm,
        inspectionType: flyttesynInspectionType,
        taskDescription: flyttesynTaskDescription,
        cvr,
      };
    } else {
      throw new Error(
        `Service slug "${serviceSlug}" is not supported by ServiceInquiryWizard`,
      );
    }

    return {
      serviceSlug,
      address,
      zip,
      city,
      preferredDate: usesPreferredTiming(serviceSlug) ? "" : preferredDate,
      preferredTiming: usesPreferredTiming(serviceSlug)
        ? (preferredTiming as PreferredTimingId)
        : undefined,
      entryMethod: entryMethod as ServiceEntryOptionId,
      entryOtherDetails,
      firstName,
      lastName,
      email,
      phone,
      termsAccepted,
      details,
    };
  }, [
    serviceSlug,
    sqm,
    propertyType,
    frequency,
    airbnbFrequency,
    bedroomCount,
    bathroomCount,
    specialNotes,
    windowCount,
    floors,
    cleaningType,
    accessNotes,
    gardenSizeMode,
    gardenSqm,
    gardenSizeCategory,
    taskTypes,
    taskNotes,
    season,
    periodNotes,
    seasonSpecialNotes,
    holidayFrom,
    holidayTo,
    careTasks,
    careNotes,
    officeSqm,
    employeeCount,
    kontorFrequency,
    preferredTime,
    preferredCleaningDays,
    cvr,
    taskDescription,
    staircaseCount,
    commonAreaSqm,
    boligTaskTypes,
    boligFrequency,
    boligTaskDescription,
    associationName,
    personaleEmployeeCount,
    benefitModel,
    employeeHousingType,
    wishDescription,
    flyttesynPropertySqm,
    flyttesynInspectionType,
    flyttesynTaskDescription,
    kitchenCount,
    toiletCount,
    workplaceCount,
    address,
    zip,
    city,
    preferredDate,
    preferredTiming,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    termsAccepted,
  ]);

  const submitInquiry = useCallback(async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/service-inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Kunne ikke sende forespørgslen.");
      }
      setIsDone(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Kunne ikke sende forespørgslen. Prøv igen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [buildPayload]);

  const goNext = useCallback(async () => {
    setError("");
    if (!canContinue) return;

    if (step === "kontakt") {
      await submitInquiry();
      return;
    }

    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  }, [canContinue, step, submitInquiry]);

  const goBack = useCallback(() => {
    setError("");
    if (stepIndex === 0) {
      router.push(`/${serviceSlug}/`);
      return;
    }
    setStepIndex((current) => Math.max(current - 1, 0));
  }, [stepIndex, router, serviceSlug]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !(step === "adresse" && showAddressSuggestions)
    ) {
      event.preventDefault();
      goNext();
    }
  };

  type SummaryValue = string | string[];

  const summaryItems = useMemo(() => {
    const items: [string, SummaryValue][] = [
      [serviceName, ""],
      [address, `${zip} ${city}`],
    ];

    if (serviceSlug === "hovedrengoring") {
      items.push(
        ["Areal", `${sqm} m²`],
        [
          "Boligtype",
          PROPERTY_TYPE_OPTIONS.find((option) => option.id === propertyType)
            ?.label || propertyType,
        ],
        [
          "Frekvens",
          HOVEDRENGORING_FREQUENCY_OPTIONS.find((option) => option.id === frequency)
            ?.label || frequency,
        ],
      );
    } else if (serviceSlug === "airbnb-rengoring") {
      items.push(
        ["Areal", `${sqm} m²`],
        [
          "Boligtype",
          PROPERTY_TYPE_OPTIONS.find((option) => option.id === propertyType)
            ?.label || propertyType,
        ],
        ["Soveværelser", `${bedroomCount} stk.`],
        ["Badeværelser", `${bathroomCount} stk.`],
        [
          "Frekvens",
          AIRBNB_FREQUENCY_OPTIONS.find((option) => option.id === airbnbFrequency)
            ?.label || airbnbFrequency,
        ],
      );
    } else if (serviceSlug === "vinduespudsning") {
      items.push(
        ["Vinduer", `${windowCount} stk.`],
        [
          "Etager",
          VINDUES_FLOOR_OPTIONS.find((option) => option.id === floors)?.label ||
            floors,
        ],
        [
          "Pudsning",
          VINDUES_CLEANING_TYPE_OPTIONS.find(
            (option) => option.id === cleaningType,
          )?.label || cleaningType,
        ],
      );
    } else if (serviceSlug === "havearbejde") {
      items.push(
        [
          "Havestørrelse",
          formatGardenSizeLabel(gardenSizeMode, gardenSqm, gardenSizeCategory),
        ],
        [
          "Opgavetype",
          taskTypes.map(
            (taskId) =>
              HAVEARBEJDE_TASK_OPTIONS.find((option) => option.id === taskId)
                ?.label || taskId,
          ),
        ],
      );
    } else if (serviceSlug === "foraars-og-efteraarsklargoering") {
      items.push(
        [
          "Sæson",
          SAESON_OPTIONS.find((option) => option.id === season)?.label || season,
        ],
        [
          "Havestørrelse",
          formatGardenSizeLabel(gardenSizeMode, gardenSqm, gardenSizeCategory),
        ],
      );
    } else if (serviceSlug === "ferieservice-til-haven") {
      items.push(
        [
          "Ferieperiode",
          `${new Date(holidayFrom + "T12:00:00").toLocaleDateString("da-DK")} – ${new Date(holidayTo + "T12:00:00").toLocaleDateString("da-DK")}`,
        ],
        [
          "Havestørrelse",
          formatGardenSizeLabel(gardenSizeMode, gardenSqm, gardenSizeCategory),
        ],
        [
          "Pasning",
          careTasks.map(
            (taskId) =>
              FERIESERVICE_CARE_OPTIONS.find((option) => option.id === taskId)
                ?.label || taskId,
          ),
        ],
      );
    } else if (serviceSlug === "kontorrengoring") {
      items.push(
        ["Kontorareal", `${officeSqm} m²`],
        ["Medarbejdere", `${employeeCount} stk.`],
        ["Køkkener", formatFacilityCountLabel(kitchenCount)],
        ["Toiletter", formatFacilityCountLabel(toiletCount)],
        ["Arbejdspladser", formatFacilityCountLabel(workplaceCount)],
        [
          "Frekvens",
          KONTOR_FREQUENCY_OPTIONS.find((option) => option.id === kontorFrequency)
            ?.label || kontorFrequency,
        ],
        [
          "Ønsket tid",
          KONTOR_TIME_OPTIONS.find((option) => option.id === preferredTime)
            ?.label || preferredTime,
        ],
      );
      if (preferredCleaningDays.length > 0) {
        items.push([
          "Foretrukne rengøringsdage",
          preferredCleaningDays.map(
            (dayId) =>
              WEEKDAY_DAY_OPTIONS.find((option) => option.id === dayId)
                ?.label || dayId,
          ),
        ]);
      }
      if (taskDescription.trim()) {
        items.push(["Opgavebeskrivelse", taskDescription.trim()]);
      }
      if (cvr.trim()) {
        items.push(["CVR", cvr.trim()]);
      }
    } else if (serviceSlug === "boligforeninger") {
      items.push(
        ["Opgange", `${staircaseCount} stk.`],
        ["Fællesarealer", `${commonAreaSqm} m²`],
        ["Køkkener", formatFacilityCountLabel(kitchenCount)],
        ["Toiletter", formatFacilityCountLabel(toiletCount)],
        ["Arbejdspladser", formatFacilityCountLabel(workplaceCount)],
        [
          "Opgavetype",
          boligTaskTypes.map(
            (taskId) =>
              BOLIGFORENING_TASK_OPTIONS.find((option) => option.id === taskId)
                ?.label || taskId,
          ),
        ],
        [
          "Frekvens",
          BOLIGFORENING_FREQUENCY_OPTIONS.find(
            (option) => option.id === boligFrequency,
          )?.label || boligFrequency,
        ],
      );
      if (preferredCleaningDays.length > 0) {
        items.push([
          "Foretrukne rengøringsdage",
          preferredCleaningDays.map(
            (dayId) =>
              FULL_WEEK_DAY_OPTIONS.find((option) => option.id === dayId)
                ?.label || dayId,
          ),
        ]);
      }
      if (boligTaskDescription.trim()) {
        items.push(["Beskriv opgaven", boligTaskDescription.trim()]);
      }
      if (associationName.trim()) {
        items.push(["Boligforenings navn", associationName.trim()]);
      }
    } else if (serviceSlug === "personalegode") {
      items.push(
        ["Medarbejdere", `${personaleEmployeeCount} stk.`],
        [
          "Model",
          PERSONALEGODE_MODEL_OPTIONS.find((option) => option.id === benefitModel)
            ?.label || benefitModel,
        ],
        [
          "Boligtype",
          PERSONALEGODE_HOUSING_OPTIONS.find(
            (option) => option.id === employeeHousingType,
          )?.label || employeeHousingType,
        ],
      );
      if (wishDescription.trim()) {
        items.push(["Ønsker og detaljer", wishDescription.trim()]);
      }
      if (cvr.trim()) {
        items.push(["CVR", cvr.trim()]);
      }
    } else if (serviceSlug === "flyttesyn") {
      items.push(
        ["Areal", `${flyttesynPropertySqm} m²`],
        [
          "Type af flyttesyn",
          FLYTTESYN_INSPECTION_OPTIONS.find(
            (option) => option.id === flyttesynInspectionType,
          )?.label || flyttesynInspectionType,
        ],
      );
      if (flyttesynTaskDescription.trim()) {
        items.push(["Beskrivelse", flyttesynTaskDescription.trim()]);
      }
      if (cvr.trim()) {
        items.push(["CVR", cvr.trim()]);
      }
    }

    if (usesPreferredTiming(serviceSlug) && preferredTiming) {
      items.push([
        "Ønsket timing",
        PREFERRED_TIMING_OPTIONS.find((option) => option.id === preferredTiming)
          ?.label || preferredTiming,
      ]);
    } else if (preferredDate) {
      items.push([
        "Ønsket dato",
        new Date(preferredDate + "T12:00:00").toLocaleDateString("da-DK", {
          weekday: "short",
          day: "numeric",
          month: "long",
        }),
      ]);
    }

    return items;
  }, [
    serviceName,
    address,
    zip,
    city,
    serviceSlug,
    sqm,
    propertyType,
    frequency,
    airbnbFrequency,
    bedroomCount,
    bathroomCount,
    windowCount,
    floors,
    cleaningType,
    gardenSizeMode,
    gardenSqm,
    gardenSizeCategory,
    taskTypes,
    season,
    holidayFrom,
    holidayTo,
    careTasks,
    officeSqm,
    employeeCount,
    kontorFrequency,
    preferredTime,
    preferredCleaningDays,
    cvr,
    taskDescription,
    staircaseCount,
    commonAreaSqm,
    boligTaskTypes,
    boligFrequency,
    boligTaskDescription,
    associationName,
    personaleEmployeeCount,
    benefitModel,
    employeeHousingType,
    wishDescription,
    flyttesynPropertySqm,
    flyttesynInspectionType,
    flyttesynTaskDescription,
    kitchenCount,
    toiletCount,
    workplaceCount,
    preferredDate,
    preferredTiming,
  ]);

  const mobileSummaryHint = useMemo(() => {
    if (address.trim() && zip.trim()) {
      return `${address.trim()}, ${zip.trim()}`;
    }
    return serviceName;
  }, [address, zip, serviceName]);

  const renderSummary = () => (
    <>
      <p className={wizardStyles.summaryEyebrow}>Din forespørgsel</p>
      <h3 className={wizardStyles.summaryTitle}>{serviceName}</h3>
      <dl className={wizardStyles.summaryList}>
        {summaryItems
          .filter(([, value]) =>
            Array.isArray(value) ? value.length > 0 : value.length > 0,
          )
          .map(([label, value]) => (
            <div key={label} className={wizardStyles.summaryRow}>
              <dt>{label}</dt>
              <dd>
                {Array.isArray(value) ? (
                  <ul className={wizardStyles.summaryValueList}>
                    {value.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
      </dl>
      <p className={wizardStyles.summaryNote}>
        Uforpligtende tilbud inden for 24 timer. Ingen betaling nu.
      </p>
    </>
  );

  if (isDone) {
    return (
      <div
        className={`${styles.shell} ${embedded ? wizardStyles.embeddedShell : ""}`}
      >
        <main className={styles.successMain}>
          <div className={`${styles.frame} ${styles.step}`}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Tak for din forespørgsel</h2>
            <p className={styles.successCopy}>
              Vi har modtaget din forespørgsel om {serviceName.toLowerCase()}.
              Du hører fra os inden for 24 timer på {email}.
            </p>
            {!embedded && (
              <Link href={`/${serviceSlug}/`} className={styles.backBtn}>
                Tilbage til {serviceName.toLowerCase()}
              </Link>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={`${styles.shell} ${embedded ? wizardStyles.embeddedShell : ""}`}
      onKeyDown={handleKeyDown}
    >
      <header className={styles.top}>
        <div className={styles.topInner}>
          <div className={styles.topRow}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={goBack}
            >
              ← {stepIndex === 0 ? "Tilbage" : "Forrige"}
            </button>
            <span className={styles.stepMeta}>
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.formColumn} ref={formColumnRef}>
          <div className={`${styles.frame} ${styles.step}`} key={step}>
            {step === "adresse" && (
              <>
                <h2 className={styles.question}>Hvad er adressen?</h2>
                <p className={styles.hint}>
                  Begynd at skrive din adresse — vi finder postnummer og by
                  automatisk.
                </p>
                <div
                  className={styles.addressAutocomplete}
                  ref={addressDropdownRef}
                >
                  <input
                    className={styles.input}
                    type="text"
                    value={address}
                    onChange={(event) => handleAddressChange(event.target.value)}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) {
                        setShowAddressSuggestions(true);
                      }
                    }}
                    placeholder="F.eks. Nørrebrogade 12"
                    autoComplete="off"
                    autoFocus
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <ul className={styles.suggestionsList} role="listbox">
                      {addressSuggestions.map((suggestion) => (
                        <li key={suggestion.tekst} role="option">
                          <button
                            type="button"
                            className={styles.suggestionItem}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleAddressSelect(suggestion);
                            }}
                          >
                            {suggestion.tekst}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {postnummerFilled && (
                  <div className={styles.badge}>
                    ✓ {zip} {city}
                  </div>
                )}
              </>
            )}

            {step === "detaljer" && serviceSlug === "hovedrengoring" && (
              <>
                <h2 className={styles.question}>Fortæl os om boligen</h2>
                <p className={styles.hint}>
                  Det hjælper os med at vurdere omfang og give et præcist tilbud.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="inquiry-sqm">
                    Boligens areal
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="inquiry-sqm"
                      className={`${styles.input} ${styles.m2FormInput}`}
                      type="number"
                      inputMode="numeric"
                      min={20}
                      max={400}
                      value={sqm}
                      onChange={(event) =>
                        setSqm(Number(event.target.value) || 0)
                      }
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Boligtype</p>
                  <div className={flytStyles.optionGrid}>
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${propertyType === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setPropertyType(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Frekvens</p>
                  <div className={styles.choiceList}>
                    {HOVEDRENGORING_FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${frequency === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setFrequency(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="special-notes">
                    Særlige ønsker (valgfrit)
                  </label>
                  <textarea
                    id="special-notes"
                    className={flytStyles.entryOtherInput}
                    value={specialNotes}
                    onChange={(event) => setSpecialNotes(event.target.value)}
                    placeholder="F.eks. ovn, skabe bag hvidevarer, paneler..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "airbnb-rengoring" && (
              <>
                <h2 className={styles.question}>Fortæl os om udlejningsboligen</h2>
                <p className={styles.hint}>
                  Størrelse, værelser og frekvens hjælper os med at give et præcist tilbud.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="inquiry-airbnb-sqm">
                    Boligens areal
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="inquiry-airbnb-sqm"
                      className={`${styles.input} ${styles.m2FormInput}`}
                      type="number"
                      inputMode="numeric"
                      min={20}
                      max={400}
                      value={sqm}
                      onChange={(event) =>
                        setSqm(Number(event.target.value) || 0)
                      }
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Boligtype</p>
                  <div className={flytStyles.optionGrid}>
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${propertyType === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setPropertyType(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Antal soveværelser</p>
                  <div className={flytStyles.extrasGrid}>
                    {AIRBNB_BEDROOM_OPTIONS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        className={`${flytStyles.extraPill} ${bedroomCount === count ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => setBedroomCount(count)}
                      >
                        <span className={flytStyles.extraName}>
                          {count === 4 ? "4+" : `${count}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Antal badeværelser</p>
                  <div className={flytStyles.extrasGrid}>
                    {AIRBNB_BATHROOM_OPTIONS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        className={`${flytStyles.extraPill} ${bathroomCount === count ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => setBathroomCount(count)}
                      >
                        <span className={flytStyles.extraName}>
                          {count === 3 ? "3+" : `${count}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Frekvens</p>
                  <div className={styles.choiceList}>
                    {AIRBNB_FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${airbnbFrequency === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setAirbnbFrequency(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="airbnb-special-notes">
                    Særlige ønsker (valgfrit)
                  </label>
                  <textarea
                    id="airbnb-special-notes"
                    className={flytStyles.entryOtherInput}
                    value={specialNotes}
                    onChange={(event) => setSpecialNotes(event.target.value)}
                    placeholder="F.eks. linnedskift, kalendersynkronisering, nøgleboks..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "vinduespudsning" && (
              <>
                <h2 className={styles.question}>Fortæl os om vinduerne</h2>
                <p className={styles.hint}>
                  Antal vinduer, etager og type af pudsning afgør tilbuddet.
                </p>

                <p className={styles.fieldLabel}>Antal vinduer (ca.)</p>
                <div className={flytStyles.extrasGrid}>
                  {WINDOW_COUNT_OPTIONS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={`${flytStyles.extraPill} ${windowCount === count ? flytStyles.extraPillSelected : ""}`}
                      onClick={() => setWindowCount(count)}
                    >
                      <span className={flytStyles.extraName}>{count} vinduer</span>
                    </button>
                  ))}
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Etager</p>
                  <div className={flytStyles.optionGrid}>
                    {VINDUES_FLOOR_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${floors === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setFloors(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Indvendig eller udvendig?</p>
                  <div className={flytStyles.optionGrid}>
                    {VINDUES_CLEANING_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${cleaningType === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setCleaningType(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="access-notes">
                    Bemærkninger om adgang (valgfrit)
                  </label>
                  <textarea
                    id="access-notes"
                    className={flytStyles.entryOtherInput}
                    value={accessNotes}
                    onChange={(event) => setAccessNotes(event.target.value)}
                    placeholder="F.eks. sprosser, ovenlys, svært tilgængelige ruder..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "havearbejde" && (
              <>
                <h2 className={styles.question}>Fortæl os om haven</h2>
                <p className={styles.hint}>
                  Havestørrelse og opgavetype hjælper os med at give et præcist tilbud.
                </p>

                <GardenSizeFields
                  gardenSizeMode={gardenSizeMode}
                  setGardenSizeMode={setGardenSizeMode}
                  gardenSqm={gardenSqm}
                  setGardenSqm={setGardenSqm}
                  gardenSizeCategory={gardenSizeCategory}
                  setGardenSizeCategory={setGardenSizeCategory}
                />

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Opgavetype</p>
                  <div className={flytStyles.extrasGrid}>
                    {HAVEARBEJDE_TASK_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.extraPill} ${taskTypes.includes(option.id) ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => toggleTaskType(option.id)}
                      >
                        <span className={flytStyles.extraName}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="task-notes">
                    Bemærkninger (valgfrit)
                  </label>
                  <textarea
                    id="task-notes"
                    className={flytStyles.entryOtherInput}
                    value={taskNotes}
                    onChange={(event) => setTaskNotes(event.target.value)}
                    placeholder="F.eks. hæk på begge sider, skråning, adgang via bagport..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === "detaljer" &&
              serviceSlug === "foraars-og-efteraarsklargoering" && (
                <>
                  <h2 className={styles.question}>Fortæl os om sæsonklargøringen</h2>
                  <p className={styles.hint}>
                    Angiv sæson, havestørrelse og eventuelle særlige ønsker.
                  </p>

                  <div className={flytStyles.entryOtherField}>
                    <p className={styles.fieldLabel}>Sæson</p>
                    <div className={flytStyles.optionGrid}>
                      {SAESON_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`${flytStyles.optionBtn} ${season === option.id ? flytStyles.optionBtnSelected : ""}`}
                          onClick={() => setSeason(option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <GardenSizeFields
                    gardenSizeMode={gardenSizeMode}
                    setGardenSizeMode={setGardenSizeMode}
                    gardenSqm={gardenSqm}
                    setGardenSqm={setGardenSqm}
                    gardenSizeCategory={gardenSizeCategory}
                    setGardenSizeCategory={setGardenSizeCategory}
                  />

                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="period-notes">
                      Ønsket periode (valgfrit)
                    </label>
                    <textarea
                      id="period-notes"
                      className={flytStyles.entryOtherInput}
                      value={periodNotes}
                      onChange={(event) => setPeriodNotes(event.target.value)}
                      placeholder="F.eks. uge 12–14, start april, fleksibel i oktober..."
                      rows={3}
                    />
                  </div>

                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="season-special-notes">
                      Særlige ønsker (valgfrit)
                    </label>
                    <textarea
                      id="season-special-notes"
                      className={flytStyles.entryOtherInput}
                      value={seasonSpecialNotes}
                      onChange={(event) =>
                        setSeasonSpecialNotes(event.target.value)
                      }
                      placeholder="F.eks. store bede, frugttræer, komposthjørne..."
                      rows={3}
                    />
                  </div>
                </>
              )}

            {step === "detaljer" && serviceSlug === "ferieservice-til-haven" && (
              <>
                <h2 className={styles.question}>Fortæl os om ferien og haven</h2>
                <p className={styles.hint}>
                  Angiv ferieperiode, havestørrelse og hvad der skal passes.
                </p>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Ferieperiode</p>
                  <div className={styles.fieldStack}>
                    <div>
                      <label className={styles.fieldLabel} htmlFor="holiday-from">
                        Fra
                      </label>
                      <input
                        id="holiday-from"
                        className={styles.input}
                        type="date"
                        value={holidayFrom}
                        onChange={(event) => setHolidayFrom(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className={styles.fieldLabel} htmlFor="holiday-to">
                        Til
                      </label>
                      <input
                        id="holiday-to"
                        className={styles.input}
                        type="date"
                        value={holidayTo}
                        onChange={(event) => setHolidayTo(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <GardenSizeFields
                  gardenSizeMode={gardenSizeMode}
                  setGardenSizeMode={setGardenSizeMode}
                  gardenSqm={gardenSqm}
                  setGardenSqm={setGardenSqm}
                  gardenSizeCategory={gardenSizeCategory}
                  setGardenSizeCategory={setGardenSizeCategory}
                />

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Hvad skal passes?</p>
                  <div className={flytStyles.extrasGrid}>
                    {FERIESERVICE_CARE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.extraPill} ${careTasks.includes(option.id) ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => toggleCareTask(option.id)}
                      >
                        <span className={flytStyles.extraName}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="care-notes">
                    Bemærkninger (valgfrit)
                  </label>
                  <textarea
                    id="care-notes"
                    className={flytStyles.entryOtherInput}
                    value={careNotes}
                    onChange={(event) => setCareNotes(event.target.value)}
                    placeholder="F.eks. drivhus, krukker på terrassen, nøgle hos nabo..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "kontorrengoring" && (
              <>
                <h2 className={styles.question}>Fortæl os om kontoret</h2>
                <p className={styles.hint}>
                  Areal, medarbejdere og frekvens hjælper os med at give et præcist tilbud.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="office-sqm">
                    Kontorareal
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="office-sqm"
                      className={`${styles.input} ${styles.m2FormInput}`}
                      type="number"
                      inputMode="numeric"
                      min={20}
                      max={5000}
                      value={officeSqm}
                      onChange={(event) =>
                        setOfficeSqm(clampOfficeSqm(Number(event.target.value) || 0))
                      }
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                </div>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="employee-count">
                    Antal medarbejdere
                  </label>
                  <input
                    id="employee-count"
                    className={styles.input}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={employeeCount}
                    onChange={(event) =>
                      setEmployeeCount(Math.max(1, Number(event.target.value) || 1))
                    }
                  />
                </div>

                <CommercialFacilityFields
                  kitchenCount={kitchenCount}
                  setKitchenCount={setKitchenCount}
                  toiletCount={toiletCount}
                  setToiletCount={setToiletCount}
                  workplaceCount={workplaceCount}
                  setWorkplaceCount={setWorkplaceCount}
                />

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Frekvens</p>
                  <div className={styles.choiceList}>
                    {KONTOR_FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${kontorFrequency === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setKontorFrequency(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Ønsket tid</p>
                  <div className={flytStyles.optionGrid}>
                    {KONTOR_TIME_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${preferredTime === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setPreferredTime(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Foretrukne rengøringsdage</p>
                  <p className={styles.hint}>
                    Vælg de ugedage, hvor rengøringen helst skal udføres (valgfrit).
                  </p>
                  <div className={flytStyles.extrasGrid}>
                    {WEEKDAY_DAY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.extraPill} ${preferredCleaningDays.includes(option.id) ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => togglePreferredCleaningDay(option.id)}
                      >
                        <span className={flytStyles.extraName}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="task-description">
                    Beskriv opgaven
                  </label>
                  <textarea
                    id="task-description"
                    className={flytStyles.entryOtherInput}
                    value={taskDescription}
                    onChange={(event) => setTaskDescription(event.target.value)}
                    placeholder="Beskriv kontorets behov, særlige områder, materialer eller andre detaljer..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "boligforeninger" && (
              <>
                <h2 className={styles.question}>Fortæl os om foreningen</h2>
                <p className={styles.hint}>
                  Antal opgange, fællesarealer og opgavetype afgør tilbuddet.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="staircase-count">
                    Antal opgange
                  </label>
                  <input
                    id="staircase-count"
                    className={styles.input}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="F.eks. 3 opgange"
                    value={staircaseCount}
                    onChange={(event) =>
                      setStaircaseCount(Math.max(1, Number(event.target.value) || 1))
                    }
                  />
                </div>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="common-area-sqm">
                    Fællesarealer
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="common-area-sqm"
                      className={`${styles.input} ${styles.m2FormInput}`}
                      type="number"
                      inputMode="numeric"
                      min={20}
                      max={5000}
                      value={commonAreaSqm}
                      onChange={(event) =>
                        setCommonAreaSqm(
                          clampOfficeSqm(Number(event.target.value) || 0),
                        )
                      }
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                </div>

                <CommercialFacilityFields
                  kitchenCount={kitchenCount}
                  setKitchenCount={setKitchenCount}
                  toiletCount={toiletCount}
                  setToiletCount={setToiletCount}
                  workplaceCount={workplaceCount}
                  setWorkplaceCount={setWorkplaceCount}
                />

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Opgavetype</p>
                  <div className={flytStyles.extrasGrid}>
                    {BOLIGFORENING_TASK_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.extraPill} ${boligTaskTypes.includes(option.id) ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => toggleBoligTaskType(option.id)}
                      >
                        <span className={flytStyles.extraName}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Frekvens</p>
                  <div className={styles.choiceList}>
                    {BOLIGFORENING_FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${boligFrequency === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setBoligFrequency(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Foretrukne rengøringsdage</p>
                  <p className={styles.hint}>
                    Vælg de ugedage, hvor rengøringen helst skal udføres (valgfrit).
                  </p>
                  <div className={flytStyles.extrasGrid}>
                    {FULL_WEEK_DAY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.extraPill} ${preferredCleaningDays.includes(option.id) ? flytStyles.extraPillSelected : ""}`}
                        onClick={() => togglePreferredCleaningDay(option.id)}
                      >
                        <span className={flytStyles.extraName}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="bolig-task-description">
                    Beskriv opgaven
                  </label>
                  <textarea
                    id="bolig-task-description"
                    className={flytStyles.entryOtherInput}
                    value={boligTaskDescription}
                    onChange={(event) => setBoligTaskDescription(event.target.value)}
                    placeholder="Beskriv opgaven, særlige områder eller andre detaljer (valgfrit)..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "flyttesyn" && (
              <>
                <h2 className={styles.question}>Fortæl os om flyttesynet</h2>
                <p className={styles.hint}>
                  Areal og type af gennemgang hjælper os med at give et præcist tilbud.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="flyttesyn-sqm">
                    Areal
                  </label>
                  <div className={styles.m2FormWrap}>
                    <input
                      id="flyttesyn-sqm"
                      className={`${styles.input} ${styles.m2FormInput}`}
                      type="number"
                      inputMode="numeric"
                      min={20}
                      max={5000}
                      value={flyttesynPropertySqm}
                      onChange={(event) =>
                        setFlyttesynPropertySqm(
                          clampOfficeSqm(Number(event.target.value) || 0),
                        )
                      }
                    />
                    <span className={styles.m2FormSuffix}>m²</span>
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Type af flyttesyn</p>
                  <div className={styles.choiceList}>
                    {FLYTTESYN_INSPECTION_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${flyttesynInspectionType === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setFlyttesynInspectionType(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="flyttesyn-task-description">
                    Beskriv opgaven
                  </label>
                  <textarea
                    id="flyttesyn-task-description"
                    className={flytStyles.entryOtherInput}
                    value={flyttesynTaskDescription}
                    onChange={(event) => setFlyttesynTaskDescription(event.target.value)}
                    placeholder="F.eks. nye lejemål, overdragelse, sagsmappe eller særlige områder (valgfrit)..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {step === "detaljer" && serviceSlug === "personalegode" && (
              <>
                <h2 className={styles.question}>Fortæl os om ordningen</h2>
                <p className={styles.hint}>
                  Antal medarbejdere, model og boligtype hjælper os med at opsætte den rigtige løsning.
                </p>

                <div className={styles.m2FormField}>
                  <label className={styles.fieldLabel} htmlFor="personale-employee-count">
                    Antal medarbejdere
                  </label>
                  <input
                    id="personale-employee-count"
                    className={styles.input}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={personaleEmployeeCount}
                    onChange={(event) =>
                      setPersonaleEmployeeCount(
                        Math.max(1, Number(event.target.value) || 1),
                      )
                    }
                  />
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Ønsket model</p>
                  <div className={styles.choiceList}>
                    {PERSONALEGODE_MODEL_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.choice} ${benefitModel === option.id ? styles.choiceSelected : ""}`}
                        onClick={() => setBenefitModel(option.id)}
                      >
                        <span className={styles.choiceTitle}>{option.label}</span>
                        <span className={styles.choiceSub}>{option.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <p className={styles.fieldLabel}>Boligtype hos medarbejdere</p>
                  <div className={flytStyles.optionGrid}>
                    {PERSONALEGODE_HOUSING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${flytStyles.optionBtn} ${employeeHousingType === option.id ? flytStyles.optionBtnSelected : ""}`}
                        onClick={() => setEmployeeHousingType(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={flytStyles.entryOtherField}>
                  <label className={styles.fieldLabel} htmlFor="wish-description">
                    Fortæl mere om, hvad I ønsker
                  </label>
                  <textarea
                    id="wish-description"
                    className={flytStyles.entryOtherInput}
                    value={wishDescription}
                    onChange={(event) => setWishDescription(event.target.value)}
                    placeholder="F.eks. ønsket opsætning, onboarding, budget eller særlige behov..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {step === "dato" && usesPreferredTiming(serviceSlug) && (
              <>
                <h2 className={styles.question}>
                  Hvornår ønsker du opgaven udført?
                </h2>
                <p className={styles.hint}>
                  Vælg det tidsrum, der passer jer bedst. Vi bekræfter den endelige plan i tilbuddet.
                </p>

                <div className={styles.choiceList}>
                  {PREFERRED_TIMING_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.choice} ${preferredTiming === option.id ? styles.choiceSelected : ""}`}
                      onClick={() => setPreferredTiming(option.id)}
                    >
                      <span className={styles.choiceTitle}>{option.label}</span>
                      <span className={styles.choiceSub}>{option.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "dato" && !usesPreferredTiming(serviceSlug) && (
              <>
                <h2 className={styles.question}>
                  {serviceSlug === "ferieservice-til-haven"
                    ? "Hvornår ønsker du første besøg?"
                    : serviceSlug === "foraars-og-efteraarsklargoering"
                      ? "Hvornår ønsker du klargøringen udført?"
                      : "Hvornår ønsker du opgaven udført?"}
                </h2>
                <p className={styles.hint}>
                  Vælg din foretrukne dato. Vi bekræfter tidspunktet i tilbuddet.
                </p>

                <div className={wizardStyles.calendarSection}>
                  <div className={styles.dateWeekNav}>
                    <button
                      type="button"
                      className={styles.dateWeekBtn}
                      disabled={weekOffset === 0}
                      onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    >
                      ← Forrige uge
                    </button>
                    <span className={styles.dateWeekLabel}>{weekLabel}</span>
                    <button
                      type="button"
                      className={styles.dateWeekBtn}
                      disabled={weekOffset >= maxWeekOffset}
                      onClick={() =>
                        setWeekOffset((w) => Math.min(maxWeekOffset, w + 1))
                      }
                    >
                      Næste uge →
                    </button>
                  </div>

                  <div className={wizardStyles.weekdayRow}>
                    {weekdayDates.map((date) => {
                      const dateStr = toLocalYmd(date);
                      const past = isDateInPast(date);
                      const beyondRange = date > maxSelectableDate;
                      const isSelected =
                        preferredDate === dateStr && !selectedDateOutsideWeek;
                      const weekday = date
                        .toLocaleDateString("da-DK", { weekday: "short" })
                        .replace(".", "");
                      const month = date
                        .toLocaleDateString("da-DK", { month: "short" })
                        .replace(".", "");

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          className={`${styles.dateChip} ${isSelected ? styles.dateChipSelected : ""}`}
                          disabled={past || beyondRange}
                          onClick={() => handleDateSelect(dateStr)}
                        >
                          <span className={styles.dateWeekday}>{weekday}</span>
                          <span className={styles.dateDay}>{date.getDate()}</span>
                          <span className={styles.dateMonth}>{month}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`${styles.calendarPanel} ${wizardStyles.calendarPanelOpen}`}
                  >
                    <div className={styles.calendarHeader}>
                      <button
                        type="button"
                        className={styles.calendarNav}
                        onClick={handlePrevMonth}
                        aria-label="Forrige måned"
                      >
                        ‹
                      </button>
                      <span className={styles.calendarMonth}>
                        {calendarMonthLabel.charAt(0).toUpperCase() +
                          calendarMonthLabel.slice(1)}
                      </span>
                      <button
                        type="button"
                        className={styles.calendarNav}
                        onClick={handleNextMonth}
                        aria-label="Næste måned"
                      >
                        ›
                      </button>
                    </div>
                    <div className={styles.calendarGrid}>
                      {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
                        <div key={d} className={styles.calendarDow}>
                          {d}
                        </div>
                      ))}
                      {calendarDays.map((dayDate) => {
                        const dateStr = toLocalYmd(dayDate);
                        const isCurrentMonth =
                          dayDate.getMonth() === viewDate.getMonth();
                        const isWeekend = !isWeekday(dayDate);
                        const isSelected = preferredDate === dateStr;
                        const selectable = isDateSelectable(dayDate);

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            className={`${styles.calendarDay} ${!isCurrentMonth ? styles.calendarDayOut : ""} ${isSelected ? styles.calendarDaySelected : ""} ${isWeekend ? styles.calendarDayWeekend : ""}`}
                            disabled={!selectable}
                            onClick={() => handleDateSelect(dateStr)}
                          >
                            {dayDate.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {preferredDate && (
                    <p className={wizardStyles.selectedDateLabel}>
                      Valgt:{" "}
                      {new Date(preferredDate + "T12:00:00").toLocaleDateString(
                        "da-DK",
                        { weekday: "long", day: "numeric", month: "long" },
                      )}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === "adgang" && (
              <>
                <h2 className={styles.question}>
                  {isGardenServiceSlug(serviceSlug)
                    ? "Adgang til haven"
                    : isPersonalegodeSlug(serviceSlug)
                      ? "Adgang til medarbejdernes bolig"
                      : isCommercialServiceSlug(serviceSlug)
                        ? "Adgang til lokaler"
                        : "Adgang til boligen"}
                </h2>
                <p className={styles.hint}>
                  {isGardenServiceSlug(serviceSlug)
                    ? "Fortæl os hvordan vi kommer ind i haven, når opgaven skal udføres."
                    : isPersonalegodeSlug(serviceSlug)
                      ? "Fortæl os hvordan vi får adgang til medarbejdernes bolig, når rengøringen skal udføres."
                      : isCommercialServiceSlug(serviceSlug)
                        ? "Fortæl os hvordan vi får adgang til lokalerne, når opgaven skal udføres."
                        : "Fortæl os hvordan vi kommer ind, når opgaven skal udføres."}
                </p>

                <p className={styles.fieldLabel}>Adgangsmetode</p>
                <div className={flytStyles.optionGrid}>
                  {entryOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${flytStyles.optionBtn} ${entryMethod === option.id ? flytStyles.optionBtnSelected : ""}`}
                      onClick={() => {
                        setEntryMethod(option.id);
                        if (option.id !== "other" && option.id !== "door_code") {
                          setEntryOtherDetails("");
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {entryMethod === "door_code" && (
                  <div className={flytStyles.entryOtherField}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="entry-door-code"
                    >
                      Kode til dør / port
                    </label>
                    <input
                      id="entry-door-code"
                      className={styles.input}
                      value={entryOtherDetails}
                      onChange={(event) =>
                        setEntryOtherDetails(event.target.value)
                      }
                      placeholder="F.eks. portkode eller dørkode"
                      autoFocus
                    />
                  </div>
                )}

                {entryMethod === "other" && (
                  <div className={flytStyles.entryOtherField}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="entry-other"
                    >
                      Beskriv adgangen
                    </label>
                    <textarea
                      id="entry-other"
                      className={flytStyles.entryOtherInput}
                      value={entryOtherDetails}
                      onChange={(event) =>
                        setEntryOtherDetails(event.target.value)
                      }
                      placeholder="Beskriv hvordan vi får adgang"
                      rows={4}
                      autoFocus
                    />
                  </div>
                )}
              </>
            )}

            {step === "kontakt" && (
              <>
                <h2 className={styles.question}>Dine kontaktoplysninger</h2>
                <p className={styles.hint}>
                  Vi sender dit tilbud til denne e-mail inden for 24 timer.
                </p>

                {serviceSlug === "kontorrengoring" && (
                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="cvr">
                      CVR-nummer (valgfrit)
                    </label>
                    <input
                      id="cvr"
                      className={styles.input}
                      inputMode="numeric"
                      value={cvr}
                      onChange={(event) => setCvr(event.target.value)}
                      placeholder="F.eks. 12345678"
                      autoFocus
                    />
                  </div>
                )}

                {serviceSlug === "flyttesyn" && (
                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="flyttesyn-cvr">
                      CVR-nummer (valgfrit)
                    </label>
                    <input
                      id="flyttesyn-cvr"
                      className={styles.input}
                      inputMode="numeric"
                      value={cvr}
                      onChange={(event) => setCvr(event.target.value)}
                      placeholder="F.eks. 12345678"
                      autoFocus
                    />
                  </div>
                )}

                {serviceSlug === "personalegode" && (
                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="personalegode-cvr">
                      CVR-nummer (valgfrit)
                    </label>
                    <input
                      id="personalegode-cvr"
                      className={styles.input}
                      inputMode="numeric"
                      value={cvr}
                      onChange={(event) => setCvr(event.target.value)}
                      placeholder="F.eks. 12345678"
                      autoFocus
                    />
                  </div>
                )}

                {serviceSlug === "boligforeninger" && (
                  <div className={flytStyles.entryOtherField}>
                    <label className={styles.fieldLabel} htmlFor="association-name">
                      Boligforenings navn
                    </label>
                    <input
                      id="association-name"
                      className={styles.input}
                      value={associationName}
                      onChange={(event) => setAssociationName(event.target.value)}
                      placeholder="F.eks. Andelsforeningen Solsiden"
                      autoFocus
                    />
                  </div>
                )}

                <div className={styles.fieldStack}>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="inquiry-first-name">
                      Fornavn
                    </label>
                    <input
                      id="inquiry-first-name"
                      className={styles.input}
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoFocus={
                        serviceSlug !== "kontorrengoring" &&
                        serviceSlug !== "flyttesyn" &&
                        serviceSlug !== "personalegode" &&
                        serviceSlug !== "boligforeninger"
                      }
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="inquiry-last-name">
                      Efternavn
                    </label>
                    <input
                      id="inquiry-last-name"
                      className={styles.input}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="inquiry-email">
                      E-mail
                    </label>
                    <input
                      id="inquiry-email"
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel} htmlFor="inquiry-phone">
                      Telefon
                    </label>
                    <input
                      id="inquiry-phone"
                      className={styles.input}
                      inputMode="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                  <TermsConfirmCard
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    ariaLabel={
                      isCommercialServiceSlug(serviceSlug)
                        ? "Giv samtykke til erhvervsforespørgsel"
                        : "Giv samtykke til behandling af oplysninger"
                    }
                  >
                    {isCommercialServiceSlug(serviceSlug) ? (
                      <>
                        Jeg giver samtykke til, at Renzen må behandle virksomhedens og
                        mine kontaktoplysninger med henblik på at udarbejde et
                        uforpligtende erhvervstilbud og kontakte mig vedrørende
                        forespørgslen. Jeg har læst og accepterer <TermsLink />.
                      </>
                    ) : (
                      <>
                        Jeg giver samtykke til, at Renzen må behandle mine oplysninger
                        med henblik på at udarbejde et tilbud og kontakte mig om min
                        forespørgsel. Jeg har læst og accepterer <TermsLink />.
                      </>
                    )}
                  </TermsConfirmCard>
                </div>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <aside
          className={`${styles.summaryPanel} ${wizardStyles.summaryPanel}`}
          aria-label="Oversigt"
        >
          {renderSummary()}
        </aside>
      </div>

      <div className={styles.bottomChrome}>
        <div className={styles.mobileCheckoutBar} aria-label="Forespørgselsoversigt">
          <div className={styles.mobileCheckoutLeft}>
            <p className={wizardStyles.mobileSummaryHint}>{mobileSummaryHint}</p>
            <button
              type="button"
              className={styles.detailsLink}
              onClick={() => setDetailsOpen(true)}
              aria-expanded={detailsOpen}
              aria-controls="inquiry-details-sheet"
            >
              <svg
                className={styles.detailsLinkIcon}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M7 6.2V10M7 4.4v.01"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Se detaljer
            </button>
          </div>
          <button
            type="button"
            className={`${styles.continueBtn} ${styles.mobileContinueBtn}`}
            disabled={!canContinue || isSubmitting}
            onClick={goNext}
          >
            {isSubmitting
              ? "Sender…"
              : step === "kontakt"
                ? "Send forespørgsel"
                : "Fortsæt"}
            {!isSubmitting && <span aria-hidden>→</span>}
          </button>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerInner}>
              <span className={styles.footerHint}>
                {step === "kontakt"
                  ? "Tryk Enter for at sende"
                  : "Tryk Enter for at fortsætte"}
              </span>
              <button
                type="button"
                className={styles.continueBtn}
                disabled={!canContinue || isSubmitting}
                onClick={goNext}
              >
                {isSubmitting
                  ? "Sender…"
                  : step === "kontakt"
                    ? "Send forespørgsel"
                    : "Fortsæt"}
                {!isSubmitting && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        </footer>
      </div>

      <div
        className={`${styles.sheetBackdrop} ${detailsOpen ? styles.sheetBackdropOpen : ""}`}
        onClick={() => setDetailsOpen(false)}
        aria-hidden={!detailsOpen}
      />
      <div
        id="inquiry-details-sheet"
        className={`${styles.sheetPanel} ${detailsOpen ? styles.sheetPanelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-details-title"
        aria-hidden={!detailsOpen}
      >
        <div className={styles.sheetHandle} aria-hidden />
        <div className={styles.sheetHeader}>
          <h2 id="inquiry-details-title" className={styles.sheetTitle}>
            Din forespørgsel
          </h2>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setDetailsOpen(false)}
            aria-label="Luk forespørgselsoversigt"
          >
            ×
          </button>
        </div>
        <div className={styles.sheetBody}>{renderSummary()}</div>
      </div>
    </div>
  );
}
