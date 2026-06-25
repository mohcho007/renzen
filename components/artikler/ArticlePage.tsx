import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Article } from "@/data/articles";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";

const articleProseClass =
  "prose prose-zinc max-w-none text-[15px] font-medium leading-relaxed text-[#536159] sm:text-base " +
  "[&>h1]:font-display [&>h1]:text-2xl [&>h1]:font-semibold [&>h1]:tracking-[-0.02em] [&>h1]:text-[#173c2c] [&>h1]:mt-10 [&>h1]:mb-4 " +
  "[&>h2]:font-display [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-[-0.02em] [&>h2]:text-[#173c2c] [&>h2]:mt-10 [&>h2]:mb-4 " +
  "[&>h3]:font-display [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#203129] [&>h3]:mt-8 [&>h3]:mb-3 " +
  "[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 " +
  "[&>blockquote]:border-l-4 [&>blockquote]:border-[#bdccbd] [&>blockquote]:bg-[#f6f4ed] [&>blockquote]:pl-4 [&>blockquote]:py-3 [&>blockquote]:pr-4 [&>blockquote]:not-italic [&>blockquote]:text-[#536159] " +
  "[&>p]:mt-2 [&_a]:font-semibold [&_a]:text-[#173c2c] [&_a]:underline-offset-2 hover:[&_a]:underline " +
  "[&_table]:w-full [&_table]:text-sm [&_th]:bg-[#f6f4ed] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border-t [&_td]:border-[#dfe2da] [&_td]:px-3 [&_td]:py-2";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticlePage({ article }: { article: Article }) {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <div className="mx-auto max-w-[900px] px-6 pt-8 sm:px-8 sm:pt-10">
          <nav
            aria-label="Brødkrummer"
            className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-[#7a8a80]"
          >
            <Link href="/artikler/" className="transition-colors hover:text-[#173c2c]">
              Artikler
            </Link>
            <ChevronRight size={14} className="shrink-0 text-[#c5cfc0]" aria-hidden />
            <span className="truncate text-[#203129]" aria-current="page">
              {article.title}
            </span>
          </nav>
        </div>

        <article className="mx-auto max-w-[900px] px-6 py-10 sm:px-8 sm:py-14">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a8a80]">
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>Af {article.author}</span>
          </div>

          <h1 className="mt-5 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-[44px]">
            {article.title}
          </h1>

          {article.image ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-[#dfe2da] bg-[#f6f4ed]">
              <Image
                src={article.image}
                alt={article.imageAlt ?? article.title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          ) : null}

          <p className="mt-8 border-l-4 border-[#bdccbd] bg-[#f6f4ed] py-4 pl-5 pr-4 text-base font-medium leading-7 text-[#536159] sm:text-lg">
            {article.excerpt}
          </p>

          <div
            className={`${articleProseClass} mt-10`}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <section className="border-t border-[#dfe2da] bg-[#173c2c] px-6 py-16 text-[#f6f2e8] sm:px-8">
          <div className="mx-auto flex max-w-[900px] flex-col justify-between gap-8 sm:flex-row sm:items-end">
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
