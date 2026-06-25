import type { ReactNode } from "react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";

export const legalPageShellClass = "min-h-screen bg-[#fbfaf5] text-[#203129]";

export const legalArticleClass =
  "mx-auto max-w-[900px] px-6 py-10 sm:px-8 sm:py-14";

export const legalTitleClass =
  "font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-[44px]";

export const legalUpdatedClass =
  "mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a8a80]";

export const legalContentClass =
  "prose prose-zinc max-w-none text-[15px] font-medium leading-relaxed text-[#536159] sm:text-base flex flex-col gap-6 mt-10";

export const legalSectionTitleClass =
  "font-display text-xl font-semibold tracking-[-0.02em] text-[#173c2c] mt-10";

export const legalInfoBoxClass =
  "mt-1 flex w-fit flex-col gap-1 rounded-xl border border-[#dfe2da] bg-[#f6f4ed] p-4 font-mono text-xs font-semibold text-[#536159]";

export const legalLinkClass =
  "font-semibold text-[#173c2c] underline-offset-2 hover:underline";

export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className={legalPageShellClass}>
      <RenzenEditorialHeader />
      <main id="main">
        <article className={legalArticleClass}>
          <h1 className={legalTitleClass}>{title}</h1>
          <p className={legalUpdatedClass}>
            Senest opdateret: {updated ?? "7. juni 2026"}
          </p>
          <div className={legalContentClass}>{children}</div>
        </article>
      </main>
      <RenzenEditorialFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className={legalSectionTitleClass}>{title}</h2>
      {children}
    </section>
  );
}
