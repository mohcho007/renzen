import { getNotifyEmail, sendEmail } from "@/lib/email/resend";
import { buildServiceInquiryCustomerEmail } from "@/lib/email/templates/serviceInquiryCustomer";
import { buildServiceInquiryInternalEmail } from "@/lib/email/templates/serviceInquiryInternal";
import type { ServiceInquiryPayload } from "@/lib/serviceInquiry";

type SendResult = Awaited<ReturnType<typeof sendEmail>>;

export async function sendServiceInquiryEmails(
  inquiry: ServiceInquiryPayload & { receivedAt: string },
): Promise<void> {
  const notifyEmail = getNotifyEmail();
  const customerEmail = buildServiceInquiryCustomerEmail(inquiry);
  const internalEmail = buildServiceInquiryInternalEmail(inquiry);

  const tasks: Promise<SendResult>[] = [
    sendEmail({
      to: inquiry.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    }),
    sendEmail({
      to: notifyEmail,
      subject: internalEmail.subject,
      html: internalEmail.html,
      text: internalEmail.text,
      replyTo: inquiry.email,
    }),
  ];

  const results = await Promise.allSettled(tasks);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[email] service inquiry send rejected:", result.reason);
      continue;
    }
    if (!result.value.ok) {
      console.error("[email] service inquiry send failed:", result.value.error);
    }
  }
}
