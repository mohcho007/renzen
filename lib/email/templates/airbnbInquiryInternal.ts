import {
  escapeHtml,
  emailFooterText,
  summaryTableHtml,
  summaryTableText,
  wrapEmailHtml,
} from "@/lib/email/layout";
import {
  buildServiceInquirySummaryLines,
  getServiceDisplayName,
} from "@/lib/email/serviceInquirySummary";
import type { ServiceInquiryPayload } from "@/lib/serviceInquiry";
import { getAirbnbBookUrl } from "@/lib/airbnbInquiryToken";
import { formatFlytKr } from "@/lib/flytterengoring";

export function buildAirbnbInquiryInternalEmail(
  inquiry: ServiceInquiryPayload & { receivedAt: string },
  token: string,
  estimatedPriceKr: number,
  priceSource: "l27" | "fallback",
): { subject: string; html: string; text: string } {
  const serviceName = getServiceDisplayName(inquiry.serviceSlug);
  const subject = `Ny forespørgsel: ${serviceName} — ${inquiry.city} (${inquiry.firstName} ${inquiry.lastName})`;
  const summaryLines = [
    ...buildServiceInquirySummaryLines(inquiry),
    {
      label: "Estimeret engangs pris",
      value: `${formatFlytKr(estimatedPriceKr)} (${priceSource === "l27" ? "L27" : "fallback"})`,
    },
    {
      label: "Book-link sendt",
      value: getAirbnbBookUrl(token),
    },
  ];

  const html = wrapEmailHtml(`
    <tr>
      <td style="padding:32px 24px 0;font-family:Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:600;color:#173c2c;">
          Ny Airbnb-forespørgsel
        </p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#536159;">
          Kunden har modtaget pris og book-link på e-mail. Svar direkte på denne e-mail for at kontakte kunden (${escapeHtml(inquiry.email)}).
        </p>
        ${summaryTableHtml(summaryLines)}
      </td>
    </tr>`);

  const text = [
    "Ny Airbnb-forespørgsel",
    "",
    `Kunden har modtaget pris og book-link på e-mail. Svar direkte på denne e-mail for at kontakte kunden (${inquiry.email}).`,
    "",
    summaryTableText(summaryLines),
    emailFooterText(),
  ].join("\n");

  return { subject, html, text };
}
