import fs from "fs";

const html = fs.readFileSync("tmp-faq-live.html", "utf8");

function stripHtml(s) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "-")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const liveFaqs = [];
const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  try {
    const data = JSON.parse(m[1]);
    if (data["@type"] !== "FAQPage" || !data.mainEntity) continue;
    for (const q of data.mainEntity) {
      liveFaqs.push({
        question: q.name,
        answer: stripHtml(q.acceptedAnswer?.text || ""),
      });
    }
  } catch {
    // skip
  }
}

const seen = new Set();
const unique = [];
for (const f of liveFaqs) {
  const key = f.question.toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(f);
  }
}

fs.writeFileSync("tmp-faq-live-parsed.json", JSON.stringify(unique, null, 2), "utf8");
console.log("Wrote", unique.length, "FAQs");
