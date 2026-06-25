import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";

export const SERVICE_ZEN_CREDIT_IMAGES = [
  {
    src: "/services/flyt-2.jpg",
    label: "Flytterengøring",
    href: "/flytterengoring",
  },
  {
    src: "/services/havearbejde.webp",
    label: "Havearbejde",
    href: "/havearbejde",
  },
  {
    src: "/services/airbnb-2.jpg",
    label: "Airbnb rengøring",
    href: "/airbnb-rengoring",
  },
  {
    src: "/fliserens-d1.webp",
    label: "Fliserens",
    href: "/fliserens",
  },
  {
    src: "/tagrende-rens2.jpg",
    label: "Tagrenderens",
    href: "/tagrenderens",
  },
  {
    src: "/services/flyttehjaelp.webp",
    label: "Flyttehjælp",
    href: "/flytning-og-flyttehjaelp",
  },
  {
    src: "/services/maler.webp",
    label: "Malerarbejde",
    href: "/malerarbejde",
  },
  {
    src: "/havearbejde-3.jpg",
    label: "Sæsonklargøring",
    href: "/foraars-og-efteraarsklargoering",
  },
  {
    src: "/hovedrengoering-min.jpg",
    label: "Hovedrengøring",
    href: "/hovedrengoring",
  },
  {
    src: "/vinduespudser-1.jpg",
    label: "Vinduespudsning",
    href: "/vinduespudsning",
  },
] as const;

export const ZEN_CREDIT_SERVICE_LABELS = SERVICE_ZEN_CREDIT_IMAGES.map(
  (item) => item.label,
);

export const ZEN_CREDIT_SERVICES_PROSE =
  "flytterengøring, hovedrengøring, Airbnb rengøring, fliserens, tagrenderens, flyttehjælp, malerarbejde, sæsonklargøring, havearbejde og vinduespudsning";

const zenCreditMonthlyLabel = `${ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr.`;
const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;
const zenCreditAnnualLabel = `${zenCreditAnnualMonths} × ${ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr.`;

export const ZEN_CREDIT_SERVICES_SECTION_INTRO = `Som medlem får du ${zenCreditMonthlyLabel} i kreditter hver måned. Brug dem på udvalgte opgaver i og omkring hjemmet.`;

const klubAnnualMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

export const ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU = `Som medlem af Renzen Klub får du ${zenCreditMonthlyLabel} i Zen-kreditter hver måned (${zenCreditAnnualLabel} pr. medlemsår), som du kan bruge på udvalgte boligservices — ${ZEN_CREDIT_SERVICES_PROSE}. Medlemskabet koster ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for et helt år (= ${klubAnnualMonthlyLabel} kr./md.).`;

export const ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_MAN = `Som medlem af Renzen Klub får man ${zenCreditMonthlyLabel} i Zen-kreditter hver måned (${zenCreditAnnualLabel} pr. medlemsår), som kan bruges på udvalgte boligservices — ${ZEN_CREDIT_SERVICES_PROSE}. Medlemskabet koster ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for et helt år (= ${klubAnnualMonthlyLabel} kr./md.).`;

export const ZEN_CREDIT_FAQ_SHORT = `Som medlem får du ${zenCreditMonthlyLabel} i Zen-kreditter hver måned (${zenCreditAnnualLabel} pr. medlemsår), som du kan bruge på udvalgte boligservices — ${ZEN_CREDIT_SERVICES_PROSE}.`;

export const ZEN_CREDIT_BOLIGSERVICE_FAQ_ANSWER = `Ja. Zen-kreditter kan bruges på ${ZEN_CREDIT_SERVICES_PROSE}.`;

export const ZEN_CREDIT_SERVICES_COMPACT =
  "flytterengøring · hovedrengøring · Airbnb · fliserens · tagrenderens · flyttehjælp · maler · sæsonklargøring · have · vinduer";
