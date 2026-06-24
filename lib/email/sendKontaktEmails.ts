import { getNotifyEmail, sendEmail } from "@/lib/email/resend";
import {
  buildKontaktCustomerEmail,
  type KontaktFormPayload,
} from "@/lib/email/templates/kontaktCustomer";
import { buildKontaktInternalEmail } from "@/lib/email/templates/kontaktInternal";

type SendResult = Awaited<ReturnType<typeof sendEmail>>;

export async function sendKontaktEmails(
  payload: KontaktFormPayload,
): Promise<void> {
  const notifyEmail = getNotifyEmail();
  const customerEmail = buildKontaktCustomerEmail(payload);
  const internalEmail = buildKontaktInternalEmail(payload);

  const tasks: Promise<SendResult>[] = [
    sendEmail({
      to: payload.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    }),
    sendEmail({
      to: notifyEmail,
      subject: internalEmail.subject,
      html: internalEmail.html,
      text: internalEmail.text,
      replyTo: payload.email,
    }),
  ];

  const results = await Promise.allSettled(tasks);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[email] kontakt send rejected:", result.reason);
      continue;
    }
    if (!result.value.ok) {
      console.error("[email] kontakt send failed:", result.value.error);
    }
  }
}

export type { KontaktFormPayload };
