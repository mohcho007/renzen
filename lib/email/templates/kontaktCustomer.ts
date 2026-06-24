import {
  escapeHtml,
  emailFooterText,
  wrapEmailHtml,
} from "@/lib/email/layout";

export type KontaktFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function buildKontaktCustomerEmail(
  payload: KontaktFormPayload,
): { subject: string; html: string; text: string } {
  const subject = "Vi har modtaget din besked";
  const firstName = payload.name.trim().split(/\s+/)[0] ?? "";
  const greeting = firstName ? `Hej ${firstName},` : "Hej,";

  const html = wrapEmailHtml(`
    <tr>
      <td style="padding:32px 24px 0;font-family:Helvetica,Arial,sans-serif;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#173c2c;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#536159;">
          Tak for din henvendelse. Vi har modtaget din besked og vender tilbage inden for 24 timer på hverdage.
        </p>
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:600;color:#173c2c;">Din besked</p>
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7a72;">Emne</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#173c2c;">${escapeHtml(payload.subject)}</p>
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7a72;">Besked</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#173c2c;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
      </td>
    </tr>`);

  const text = [
    greeting,
    "",
    "Tak for din henvendelse. Vi har modtaget din besked og vender tilbage inden for 24 timer på hverdage.",
    "",
    "Din besked",
    `Emne: ${payload.subject}`,
    "",
    payload.message,
    emailFooterText(),
  ].join("\n");

  return { subject, html, text };
}
