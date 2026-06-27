import { createHmac, timingSafeEqual } from "crypto";
import type {
  AirbnbRengoringDetails,
  ServiceEntryOptionId,
  ServiceInquiryPayload,
} from "@/lib/serviceInquiry";

const TOKEN_VERSION = 1;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AirbnbInquiryTokenPayload = {
  v: typeof TOKEN_VERSION;
  serviceSlug: "airbnb-rengoring";
  address: string;
  zip: string;
  city: string;
  preferredDate: string;
  entryMethod: ServiceEntryOptionId;
  entryOtherDetails: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  details: AirbnbRengoringDetails;
  estimatedPriceKr: number;
  estimatedAt: string;
  exp: number;
};

export class AirbnbInquiryConfigError extends Error {
  constructor(message = "AIRBNB_INQUIRY_TOKEN_SECRET is not configured.") {
    super(message);
    this.name = "AirbnbInquiryConfigError";
  }
}

let loggedDevTokenSecretWarning = false;

export function isAirbnbInquiryTokenConfigured(): boolean {
  const secret = process.env.AIRBNB_INQUIRY_TOKEN_SECRET;
  return Boolean(secret && secret.trim().length >= 16);
}

function getTokenSecret(): string {
  const secret = process.env.AIRBNB_INQUIRY_TOKEN_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (process.env.NODE_ENV === "development") {
    if (!loggedDevTokenSecretWarning) {
      loggedDevTokenSecretWarning = true;
      console.warn(
        "[airbnb-inquiry] AIRBNB_INQUIRY_TOKEN_SECRET missing — using dev fallback. Set a 16+ char secret in .env.local for production parity.",
      );
    }
    return "dev-airbnb-inquiry-token-secret";
  }
  throw new AirbnbInquiryConfigError();
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createAirbnbInquiryToken(
  inquiry: ServiceInquiryPayload,
  estimatedPriceKr: number,
): string {
  if (inquiry.serviceSlug !== "airbnb-rengoring") {
    throw new Error("Invalid service slug for Airbnb inquiry token.");
  }

  const payload: AirbnbInquiryTokenPayload = {
    v: TOKEN_VERSION,
    serviceSlug: "airbnb-rengoring",
    address: inquiry.address.trim(),
    zip: inquiry.zip.trim(),
    city: inquiry.city.trim(),
    preferredDate: inquiry.preferredDate,
    entryMethod: inquiry.entryMethod,
    entryOtherDetails: (inquiry.entryOtherDetails ?? "").trim(),
    firstName: inquiry.firstName.trim(),
    lastName: inquiry.lastName.trim(),
    email: inquiry.email.trim(),
    phone: inquiry.phone.trim(),
    details: inquiry.details as AirbnbRengoringDetails,
    estimatedPriceKr: Math.round(estimatedPriceKr),
    estimatedAt: new Date().toISOString(),
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAirbnbInquiryToken(
  token: string,
): AirbnbInquiryTokenPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AirbnbInquiryTokenPayload;
    if (payload.v !== TOKEN_VERSION) return null;
    if (payload.serviceSlug !== "airbnb-rengoring") return null;
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (
      !payload.details ||
      typeof payload.details.sqm !== "number" ||
      payload.estimatedPriceKr <= 0
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getAirbnbBookUrl(token: string): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/$/, "") ||
    "https://renzen.dk";
  return `${origin}/airbnb-rengoring/book/?ref=${encodeURIComponent(token)}`;
}
