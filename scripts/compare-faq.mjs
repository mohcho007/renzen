import fs from "fs";

const html = fs.readFileSync("tmp-faq-live.html", "utf8");

function stripHtml(s) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
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

function normalizeQuestion(q) {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9? ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract from JSON-LD blocks
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

// Dedupe live
const liveSeen = new Set();
const liveUnique = [];
for (const f of liveFaqs) {
  const key = normalizeQuestion(f.question);
  if (!liveSeen.has(key)) {
    liveSeen.add(key);
    liveUnique.push(f);
  }
}

// Load local questions from a simple grep approach - read faqs.ts and faqPageContent.ts
const faqsTs = fs.readFileSync("data/faqs.ts", "utf8");
const faqPageTs = fs.readFileSync("data/faqPageContent.ts", "utf8");
const localQuestions = new Set();
for (const match of [...faqsTs.matchAll(/question:\s*['"]([^'"]+)['"]/g)]) {
  localQuestions.add(normalizeQuestion(match[1]));
}
for (const match of [...faqPageTs.matchAll(/question:\s*"([^"]+)"/g)]) {
  localQuestions.add(normalizeQuestion(match[1]));
}

function isCovered(liveQ) {
  const n = normalizeQuestion(liveQ);
  if (localQuestions.has(n)) return true;
  // fuzzy: check if any local question contains significant overlap
  for (const lq of localQuestions) {
    if (n.includes(lq) || lq.includes(n)) return true;
    const words = n.split(" ").filter((w) => w.length > 4);
    const hits = words.filter((w) => lq.includes(w));
    if (words.length >= 3 && hits.length >= words.length - 1) return true;
  }
  return false;
}

const missing = liveUnique.filter((f) => !isCovered(f.question));
const covered = liveUnique.filter((f) => isCovered(f.question));

console.log("LIVE UNIQUE:", liveUnique.length);
console.log("LOCAL QUESTIONS:", localQuestions.size);
console.log("COVERED:", covered.length);
console.log("MISSING:", missing.length);
console.log("\n=== MISSING FROM LOCAL ===");
missing.forEach((f, i) => {
  console.log(`\n${i + 1}. ${f.question}`);
  console.log(`   A: ${f.answer.slice(0, 180)}${f.answer.length > 180 ? "..." : ""}`);
});
