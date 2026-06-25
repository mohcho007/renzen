/**
 * One-time import: WordPress CSV → data/importedArticles.ts
 * Usage: node scripts/import-articles-from-csv.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CSV_PATH = path.join(ROOT, "public", "p.csv");
const OUT_PATH = path.join(ROOT, "data", "importedArticles.ts");

/** WordPress CSV article slugs to import into data/importedArticles.ts. */
export const TARGET_SLUGS = [
  "svanemaerket-rengoering",
  "budget-for-erhvervsrengoering",
  "minimalistisk-rengoering",
  "hvor-lang-tid-tager-professionel-rengoering",
  "tjekliste-dybderengoering-af-koekken",
  "privat-rengoeringsfirma-vs-freelancer",
  "forsikret-rengoeringshjaelp",
  "indflytningsrengoering-tjekliste",
  "hvad-er-et-rengoeringsabonnement",
  "rengoering-med-boern-og-kaeledyr",
  "kontorforsyninger-paa-abonnement",
  "miljoevenlige-rengoeringsmidler-etiket",
  "allergivenlig-rengoering-rent-hjem",
  "bestil-rengoering-forberedelse",
  "erhvervsrengoering-koebenhavn",
  "hvor-ofte-professionel-rengoering",
  "engangs-rengoering-vs-fast-rengoering",
  "saadan-arbejder-vores-zenmestre",
  "kvalitetssikring-rengoering-2026",
  "kontorrengoering-tjekliste-guide",
  "forberedelse-foer-rengoering",
  "vinduespudsning-teknikker-udstyr-sikkerhed",
  "hvad-indgaar-ikke-i-professionel-rengoering",
  "hvad-koster-rengoering-i-danmark",
  "kvalitetskontrol-erhvervsrengoering",
  "book-rengoering-online",
  "billig-rengoering-vs-kvalitet",
  "flytterengoering-guide-praktiske-tips-til-effektiv-rengoering",
];

const HEADERS = [
  "ID",
  "article_title",
  "slug",
  "article_url",
  "post_date",
  "post_modified",
  "post_excerpt",
  "post_content",
  "seo_title",
  "description",
];

/** Parse RFC4180-style CSV with multiline quoted fields. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r" && next === "\n") {
      row.push(field);
      field = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      i++;
    } else if (ch === "\n") {
      row.push(field);
      field = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((c) => c.length > 0)) rows.push(row);
  }

  return rows;
}

function normalizePath(p) {
  let path = p.toLowerCase().trim();
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}

/** Known Renzen routes + imported article slugs. */
const VALID_INTERNAL = new Set([
  "/",
  "/om-os/",
  "/cookiepolitik/",
  "/handelsbetingelser/",
  "/persondatapolitik/",
  "/faq/",
  "/kontakt/",
  "/bliv-zenmester/",
  "/klub/",
  "/book-rengoering/",
  "/artikler/",
  "/privat-rengoring/",
  "/erhvervsrengoring/",
  "/flytterengoring/",
  "/airbnb-rengoring/",
  "/rengoring/",
  "/hovedrengoring/",
  "/engangsrengoring/",
  "/kontorrengoring/",
  "/boligservice/",
  "/introdeal/",
  ...TARGET_SLUGS.map((s) => `/artikler/${s}/`),
]);

const PATH_REWRITES = {
  "/kontakt-os/": "/kontakt/",
  "/logind/": "/book-rengoering/",
  "/start/": "/book-rengoering/",
  "/priser/": "/book-rengoering/",
  "/blog/": "/artikler/",
  "/privat-rengoering/": "/privat-rengoring/",
  "/hjemmerengoering/": "/privat-rengoring/",
  "/airbnb-rengoering/": "/airbnb-rengoring/",
  "/erhvervsrengoering/": "/erhvervsrengoring/",
  "/flytterengoering/": "/flytterengoring/",
  "/artikler/category/privat-rengoering/": "/privat-rengoring/",
  "/artikler/category/erhvervsrengoering/": "/erhvervsrengoring/",
};

for (const slug of TARGET_SLUGS) {
  PATH_REWRITES[`/${slug}/`] = `/artikler/${slug}/`;
  const alt = slug.replace(/rengoering/g, "rengoring");
  if (alt !== slug) PATH_REWRITES[`/${alt}/`] = `/artikler/${slug}/`;
}

function resolveInternalPath(rawPath) {
  let p = normalizePath(rawPath.split("?")[0].split("#")[0]);
  if (PATH_REWRITES[p]) return PATH_REWRITES[p];
  if (VALID_INTERNAL.has(p)) return p;
  // WP root article slug → /artikler/slug/
  const seg = p.replace(/^\/|\/$/g, "");
  if (TARGET_SLUGS.includes(seg)) return `/artikler/${seg}/`;
  return null;
}

function cleanupHtml(html) {
  if (!html) return "";

  let out = html;

  // Strip excessive font-weight spans (keep inner text)
  out = out.replace(
    /<span\s+style="font-weight:\s*400;?"\s*>([\s\S]*?)<\/span>/gi,
    "$1",
  );
  out = out.replace(/<span\s+style="font-weight:\s*400;?"\s*\/>/gi, "");

  // Fix renzen.dk absolute links → relative internal paths
  out = out.replace(
    /<a\s+([^>]*?)href="https:\/\/renzen\.dk([^"]*?)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (full, pre, hrefPath, post, inner) => {
      const resolved = resolveInternalPath(hrefPath);
      if (resolved) {
        return `<a href="${resolved}">${inner}</a>`;
      }
      return inner;
    },
  );

  // Same for href without https
  out = out.replace(
    /<a\s+([^>]*?)href="\/([^"]*?)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (full, pre, hrefPath, post, inner) => {
      const resolved = resolveInternalPath(`/${hrefPath}`);
      if (resolved) {
        return `<a href="${resolved}">${inner}</a>`;
      }
      return inner;
    },
  );

  // Remove empty attributes noise from WP export
  out = out.replace(/\s+>/g, ">");

  return out.trim();
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/\n\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraphExcerpt(html) {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return "";
  const text = stripHtml(m[1]);
  return text.length > 220 ? `${text.slice(0, 217)}…` : text;
}

function estimateReadTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 200));
  return `${minutes} min`;
}

function formatDate(postDate) {
  if (!postDate) return "2025-12-01";
  const d = postDate.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "2025-12-01";
}

function escapeTemplate(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function main() {
  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(csvText);
  const header = rows[0];
  const headerIndex = Object.fromEntries(header.map((h, i) => [h, i]));

  const bySlug = new Map();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const slug = row[headerIndex.slug];
    if (slug) bySlug.set(slug, row);
  }

  const imported = [];
  const missing = [];

  for (const slug of TARGET_SLUGS) {
    const row = bySlug.get(slug);
    if (!row) {
      missing.push(slug);
      continue;
    }

    const title = row[headerIndex.article_title] || slug;
    const rawContent = row[headerIndex.post_content] || "";
    const content = cleanupHtml(rawContent);
    const excerpt =
      (row[headerIndex.post_excerpt] || "").trim() ||
      firstParagraphExcerpt(content);
    const seoTitle = (row[headerIndex.seo_title] || "").trim() || title;
    const seoDescription =
      (row[headerIndex.seo_description] || "").trim() || excerpt;
    const publishedAt = formatDate(row[headerIndex.post_date]);
    const image = (row[headerIndex.featured_image_url] || "").trim() || undefined;
    const imageAlt =
      (row[headerIndex.featured_image_alt] || "").trim() || title;

    imported.push({
      slug,
      title,
      excerpt,
      content,
      publishedAt,
      author: "Renzen Teamet",
      readTime: estimateReadTime(content),
      image,
      imageAlt,
      seoTitle,
      seoDescription,
      indexable: true,
    });
  }

  const fileBody = `import type { Article } from "./articles";

/** WordPress-imported GSC-indexed articles (generated by scripts/import-articles-from-csv.mjs). */
export const importedArticles: Article[] = [
${imported
  .map(
    (a) => `  {
    slug: ${JSON.stringify(a.slug)},
    title: ${JSON.stringify(a.title)},
    excerpt: ${JSON.stringify(a.excerpt)},
    content: \`${escapeTemplate(a.content)}\`,
    publishedAt: ${JSON.stringify(a.publishedAt)},
    author: ${JSON.stringify(a.author)},
    readTime: ${JSON.stringify(a.readTime)},${
      a.image
        ? `
    image: ${JSON.stringify(a.image)},
    imageAlt: ${JSON.stringify(a.imageAlt)},`
        : ""
    }
    seoTitle: ${JSON.stringify(a.seoTitle)},
    seoDescription: ${JSON.stringify(a.seoDescription)},
    indexable: true,
  }`,
  )
  .join(",\n")}
];
`;

  fs.writeFileSync(OUT_PATH, fileBody, "utf8");

  console.log(`Imported ${imported.length} articles → ${OUT_PATH}`);
  if (missing.length) {
    console.log("Missing from CSV:", missing.join(", "));
  }
}

main();
