import fs from "fs";

const html = fs.readFileSync("tmp-faq-live.html", "utf8");

function stripHtml(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const faqs = [];
const re =
  /<script type="application\/ld\+json">(\{[^<]*"@type":"FAQPage"[^<]*\})<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  try {
    const data = JSON.parse(m[1]);
    for (const q of data.mainEntity || []) {
      faqs.push({
        q: q.name,
        a: stripHtml(q.acceptedAnswer?.text || ""),
      });
    }
  } catch {
    // skip invalid blocks
  }
}

const seen = new Set();
const unique = [];
for (const f of faqs) {
  const key = f.q.toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(f);
  }
}

// Also extract toggle pairs from elementor structure
const toggleTitles = [
  ...html.matchAll(/elementor-toggle-title[^>]*>([^<]+)</g),
].map((x) => x[1].trim());

console.log(JSON.stringify({ schemaCount: unique.length, toggleCount: toggleTitles.length, faqs: unique, toggles: toggleTitles }, null, 2));
