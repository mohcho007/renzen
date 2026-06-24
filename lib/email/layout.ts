import { siteConfig } from "@/lib/siteConfig";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EmailFooterLink = { href: string; label: string };

const defaultFooterLinks: EmailFooterLink[] = [
  { href: `${siteConfig.origin}/handelsbetingelser`, label: "Handelsbetingelser" },
  { href: `${siteConfig.origin}/faq`, label: "FAQ" },
];

function footerLinksHtml(links: EmailFooterLink[]): string {
  return links
    .map(
      (link, index) =>
        `${index > 0 ? "&nbsp;·&nbsp;" : ""}<a href="${link.href}" style="color:#41614f;text-decoration:underline;">${escapeHtml(link.label)}</a>`,
    )
    .join("\n          ");
}

export function emailFooterHtml(options?: { links?: EmailFooterLink[] }): string {
  const phoneHref = `tel:+45${siteConfig.phone.replace(/\s/g, "")}`;
  const links = options?.links ?? defaultFooterLinks;
  return `
    <tr>
      <td style="padding:32px 24px 0;border-top:1px solid #dfe2da;">
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:600;color:#173c2c;">
          Renzen
        </p>
        <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#536159;">
          <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:#173c2c;text-decoration:underline;">${escapeHtml(siteConfig.email)}</a>
          &nbsp;·&nbsp;
          <a href="${phoneHref}" style="color:#173c2c;text-decoration:underline;">${escapeHtml(siteConfig.phone)}</a>
        </p>
        <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#6b7a72;">
          ${footerLinksHtml(links)}
        </p>
      </td>
    </tr>`;
}

export function emailFooterText(options?: { links?: EmailFooterLink[] }): string {
  const links = options?.links ?? defaultFooterLinks;
  return [
    "",
    "—",
    "Renzen",
    `${siteConfig.email} · ${siteConfig.phone}`,
    ...links.map((link) => link.href),
  ].join("\n");
}

export function wrapEmailHtml(
  bodyRows: string,
  footerOptions?: { links?: EmailFooterLink[] },
): string {
  return `<!DOCTYPE html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Renzen</title>
  </head>
  <body style="margin:0;padding:0;background:#fbfaf5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbfaf5;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #dfe2da;border-radius:4px;">
            ${bodyRows}
            ${emailFooterHtml(footerOptions)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function summaryTableHtml(
  rows: Array<{ label: string; value: string }>,
): string {
  const items = rows
    .filter((row) => row.value.trim())
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#6b7a72;vertical-align:top;width:38%;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:8px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#173c2c;vertical-align:top;">
            ${escapeHtml(row.value).replace(/\n/g, "<br />")}
          </td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0;border-top:1px solid #eef2eb;">
      ${items}
    </table>`;
}

export function summaryTableText(
  rows: Array<{ label: string; value: string }>,
): string {
  return rows
    .filter((row) => row.value.trim())
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");
}
