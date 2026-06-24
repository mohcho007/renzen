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
  isB2BServiceSlug,
} from "@/lib/email/serviceInquirySummary";
import type { ServiceInquiryPayload } from "@/lib/serviceInquiry";
import { siteConfig } from "@/lib/siteConfig";

export function buildServiceInquiryCustomerEmail(
  inquiry: ServiceInquiryPayload,
): { subject: string; html: string; text: string } {
  const serviceName = getServiceDisplayName(inquiry.serviceSlug);
  const subject = `Vi har modtaget din forespørgsel om ${serviceName}`;
  const firstName = inquiry.firstName.trim();
  const isB2B = isB2BServiceSlug(inquiry.serviceSlug);
  const summaryLines = buildCustomerSummaryLines(inquiry);
  const serviceUrl = getServicePageUrl(inquiry.serviceSlug);
  const faqUrl = `${siteConfig.origin}/faq`;

  const greeting = firstName ? `Hej ${firstName},` : "Hej,";
  const responseCopy = isB2B
    ? "Tak for jeres forespørgsel. Vi har modtaget den og vender tilbage inden for 24 timer på hverdage med et uforpligtende tilbud."
    : "Tak for din forespørgsel. Vi har modtaget den og vender tilbage inden for 24 timer på hverdage med et uforpligtende tilbud.";

  const footerLinks = [
    { href: serviceUrl, label: `Læs mere om ${serviceName}` },
    { href: faqUrl, label: "FAQ" },
  ];

  const html = wrapEmailHtml(
    `
    <tr>
      <td style="padding:32px 24px 0;font-family:Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#173c2c;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#536159;">${escapeHtml(responseCopy)}</p>
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:600;color:#173c2c;">Din forespørgsel</p>
        ${summaryTableHtml(summaryLines)}
      </td>
    </tr>`,
    { links: footerLinks },
  );

  const text = [
    greeting,
    "",
    responseCopy,
    "",
    "Din forespørgsel",
    summaryTableText(summaryLines),
    emailFooterText({ links: footerLinks }),
  ].join("\n");

  return { subject, html, text };
}
