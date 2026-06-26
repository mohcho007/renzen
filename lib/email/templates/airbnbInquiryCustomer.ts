import {
  escapeHtml,
  emailFooterText,
  summaryTableHtml,
  summaryTableText,
  wrapEmailHtml,
} from "@/lib/email/layout";
import {
  buildCustomerSummaryLines,
  getServiceDisplayName,
  getServicePageUrl,
} from "@/lib/email/serviceInquirySummary";
import type { AirbnbInquiryTokenPayload } from "@/lib/airbnbInquiryToken";
import { getAirbnbBookUrl } from "@/lib/airbnbInquiryToken";
import { formatFlytKr } from "@/lib/flytterengoring";

export function buildAirbnbInquiryCustomerEmail(
  inquiry: AirbnbInquiryTokenPayload,
  token: string,
): { subject: string; html: string; text: string } {
  const serviceName = getServiceDisplayName("airbnb-rengoring");
  const priceLabel = formatFlytKr(inquiry.estimatedPriceKr);
  const subject = `Din Airbnb-rengøring fra ${priceLabel} — book nu`;
  const firstName = inquiry.firstName.trim();
  const bookUrl = getAirbnbBookUrl(token);
  const serviceUrl = getServicePageUrl("airbnb-rengoring");

  const summaryLines = [
    ...buildCustomerSummaryLines({
      serviceSlug: "airbnb-rengoring",
      address: inquiry.address,
      zip: inquiry.zip,
      city: inquiry.city,
      preferredDate: inquiry.preferredDate,
      entryMethod: inquiry.entryMethod,
      entryOtherDetails: inquiry.entryOtherDetails,
      firstName: inquiry.firstName,
      lastName: inquiry.lastName,
      email: inquiry.email,
      phone: inquiry.phone,
      termsAccepted: true,
      details: inquiry.details,
    }),
    { label: "Engangs pris", value: priceLabel },
  ];

  const greeting = firstName ? `Hej ${firstName},` : "Hej,";
  const introCopy =
    "Tak for din forespørgsel. Her er din pris på engangs Airbnb-rengøring — klar til booking med det samme.";
  const fomoCopy =
    "Ledige tider fyldes hurtigt mellem gæsteskift. Book nu og sikr din klargøring, før kalenderen lukker.";

  const footerLinks = [
    { href: bookUrl, label: "Book din Airbnb-rengøring" },
    { href: serviceUrl, label: `Læs mere om ${serviceName}` },
  ];

  const html = wrapEmailHtml(
    `
    <tr>
      <td style="padding:32px 24px 0;font-family:Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#173c2c;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#536159;">${escapeHtml(introCopy)}</p>
        <p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#173c2c;line-height:1.2;">
          ${escapeHtml(priceLabel)}
          <span style="display:block;margin-top:6px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:500;color:#536159;">Engangs Airbnb-rengøring</span>
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#536159;">${escapeHtml(fomoCopy)}</p>
        <p style="margin:0 0 24px;text-align:center;">
          <a href="${bookUrl}" style="display:inline-block;padding:14px 28px;background:#173c2c;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:999px;">
            Book din Airbnb-rengøring nu
          </a>
        </p>
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:600;color:#173c2c;">Din forespørgsel</p>
        ${summaryTableHtml(summaryLines)}
        <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#536159;">
          Linket er gyldigt i 7 dage. Betaling sker først efter rengøringen.
        </p>
      </td>
    </tr>`,
    { links: footerLinks },
  );

  const text = [
    greeting,
    "",
    introCopy,
    "",
    `Engangs pris: ${priceLabel}`,
    "",
    fomoCopy,
    "",
    `Book her: ${bookUrl}`,
    "",
    "Din forespørgsel",
    summaryTableText(summaryLines),
    "",
    "Linket er gyldigt i 7 dage. Betaling sker først efter rengøringen.",
    emailFooterText({ links: footerLinks }),
  ].join("\n");

  return { subject, html, text };
}
