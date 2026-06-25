import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/data/articles";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import styles from "@/components/site/RenzenEditorial.module.css";

const sortedArticles = [...articles].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArtiklerHubPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#cfdccf]">
          <div className="mx-auto max-w-[1180px] px-6 py-20 sm:px-8 lg:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52665b]">
              Artikler
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px]">
              Guides og inspiration til et lettere hjem
            </h1>
            <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#536159] sm:text-lg">
              Praktiske råd om rengøring, servicefradrag og hverdagsliv — skrevet
              af Renzen-teamet.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/artikler/${article.slug}/`}
                className={`${styles.megaMenuLink} flex min-h-0 flex-col rounded-none border border-[#dfe2da] bg-white`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a8a80]">
                  {formatDate(article.publishedAt)} · {article.readTime}
                </span>
                <span className="mt-3 block font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-[#203129]">
                  {article.title}
                </span>
                <span className="mt-2 line-clamp-3 text-[13px] leading-5 text-[#69746e]">
                  {article.excerpt}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-bold text-[#173c2c]">
                  Læs artikel
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#173c2c] px-6 py-16 text-[#f6f2e8] sm:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <h2 className="max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">
                Klar til at komme i gang?
              </h2>
              <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-[#d8e0d8]">
                Beregn din pris på rengøring på under to minutter — uden binding.
              </p>
            </div>
            <Link
              href="/book-rengoering/"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[3px] border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:border-transparent hover:bg-[#f1e9d8] hover:text-[#173c2c]"
            >
              Beregn din pris
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
