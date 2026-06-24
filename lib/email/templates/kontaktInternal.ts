import {
  escapeHtml,
  emailFooterText,
  summaryTableHtml,
  summaryTableText,
  wrapEmailHtml,
} from "@/lib/email/layout";
import type { KontaktFormPayload } from "@/lib/email/templates/kontaktCustomer";

export function buildKontaktInternalEmail(
  payload: KontaktFormPayload,
): { subject: string; html: string; text: string } {
  const subject = `Kontakt fra ${payload.name} — ${payload.subject}`;
  const summaryLines = [
    { label: "Navn", value: payload.name },
    { label: "E-mail", value: payload.email },
    { label: "Emne", value: payload.subject },
    { label: "Besked", value: payload.message },
  ];

  const html = wrapEmailHtml(`
    <tr>
      <td style="padding:32px 24px 0;font-family:Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:600;color:#173c2c;">
          Ny kontaktbesked
        </p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#536159;">
          Svar direkte på denne e-mail for at kontakte afsenderen (${escapeHtml(payload.email)}).
        </p>
        ${summaryTableHtml(summaryLines)}
      </td>
    </tr>`);

  const text = [
    "Ny kontaktbesked",
    "",
    `Svar direkte på denne e-mail for at kontakte afsenderen (${payload.email}).`,
    "",
    summaryTableText(summaryLines),
    emailFooterText(),
  ].join("\n");

  return { subject, html, text };
}
