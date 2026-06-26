import { getNotifyEmail, sendEmail } from "@/lib/email/resend";
import { buildAirbnbInquiryCustomerEmail } from "@/lib/email/templates/airbnbInquiryCustomer";
import { buildAirbnbInquiryInternalEmail } from "@/lib/email/templates/airbnbInquiryInternal";
import {
  createAirbnbInquiryToken,
  verifyAirbnbInquiryToken,
} from "@/lib/airbnbInquiryToken";
import type { ServiceInquiryPayload } from "@/lib/serviceInquiry";

type SendResult = Awaited<ReturnType<typeof sendEmail>>;

export async function sendAirbnbInquiryEmails(
  inquiry: ServiceInquiryPayload & { receivedAt: string },
  estimatedPriceKr: number,
  priceSource: "l27" | "fallback",
): Promise<string> {
  const token = createAirbnbInquiryToken(inquiry, estimatedPriceKr);
  const verified = verifyAirbnbInquiryToken(token);
  if (!verified) {
    throw new Error("Failed to create Airbnb inquiry token.");
  }
  const tokenPayload = verified;

  const notifyEmail = getNotifyEmail();
  const customerEmail = buildAirbnbInquiryCustomerEmail(tokenPayload, token);
  const internalEmail = buildAirbnbInquiryInternalEmail(
    inquiry,
    token,
    estimatedPriceKr,
    priceSource,
  );

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
      console.error("[email] airbnb inquiry send rejected:", result.reason);
      continue;
    }
    if (!result.value.ok) {
      console.error("[email] airbnb inquiry send failed:", result.value.error);
    }
  }

  return token;
}
