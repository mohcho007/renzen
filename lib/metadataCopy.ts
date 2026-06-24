import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";

const ARROW = "⇒";

export const introFromLabel = `fra ${INTRO_CLEANING_FROM_KR} kr.`;

/** `{Service} ⇒ {hook}` */
export function liveStyleTitle(service: string, hook: string): string {
  return `${service} ${ARROW} ${hook}`;
}

/** `{Service} i {City} ⇒ {hook}` */
export function liveStyleCityTitle(
  service: string,
  city: string,
  hook: string,
): string {
  return `${service} i ${city} ${ARROW} ${hook}`;
}

export function klubIntroTitle(suffix = "vælg bolig og book"): string {
  return liveStyleTitle(
    "Renzen Klub",
    `Første rengøring ${introFromLabel} · ${suffix}`,
  );
}

export function introPriceHook(cta = "book på 2 min."): string {
  return `Første rengøring ${introFromLabel} · ${cta}`;
}

export function liveStyleDescription(parts: {
  action: string;
  proof?: string;
  cta?: string;
}): string {
  return [parts.action, parts.proof, parts.cta].filter(Boolean).join(" ");
}

export function bookOnlineDescription(service = "rengøring"): string {
  return liveStyleDescription({
    action: `Book ${service} online.`,
    proof: "Se din pris med det samme, vælg dato og få rengøring udført af verificerede Zenmestre.",
  });
}

export function introCleaningDescription(serviceLabel: string): string {
  return liveStyleDescription({
    action: `Første ${serviceLabel} ${introFromLabel} med Renzen Klub.`,
    proof: "Se pris med det samme og book på få minutter.",
    cta: "Forsikrede Zenmestre og 0 kr. ved booking.",
  });
}

export function inquiryDescription(serviceLabel: string): string {
  return liveStyleDescription({
    action: `Book ${serviceLabel}.`,
    proof: "Beskriv opgaven og modtag et uforpligtende tilbud inden for 24 timer.",
    cta: "Verificerede Zenmestre og forsikret arbejde.",
  });
}

export function forespoergselTitle(serviceLabel: string): string {
  return liveStyleTitle(
    `Forespørgsel: ${serviceLabel}`,
    "tilbud inden 24 timer",
  );
}
