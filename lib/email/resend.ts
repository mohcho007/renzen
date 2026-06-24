import { Resend } from "resend";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Resend email configuration.
 *
 * Required:
 * - RESEND_API_KEY — Resend API key
 *
 * Optional (sensible defaults in code):
 * - RESEND_FROM_EMAIL — defaults to `Renzen <forespoergsel@mail.renzen.dk>`
 * - NOTIFY_EMAIL — internal notification recipient; defaults to siteConfig.email (info@renzen.dk)
 */

export const DEFAULT_FROM_EMAIL = "Renzen <forespoergsel@mail.renzen.dk>";

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

let resendClient: Resend | null = null;

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

export function getNotifyEmail(): string {
  return process.env.NOTIFY_EMAIL?.trim() || siteConfig.email;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not configured");
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail(
  params: SendEmailParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const from = getFromEmail();

  const client = getResendClient();
  if (!client) {
    return { ok: false, error: "Resend client is not configured" };
  }

  try {
    const { error } = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });

    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false, error: error.message ?? "Unknown Resend error" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] send error:", message);
    return { ok: false, error: message };
  }
}
