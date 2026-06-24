import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[900px] flex-grow px-6 py-16 sm:py-20">
        <article className="rounded-3xl border border-zinc-200 bg-white p-8 text-left shadow-sm sm:p-12">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-blue sm:text-4xl">
            {title}
          </h1>
          <p className="mb-8 mt-4 text-sm font-semibold text-zinc-500">
            Senest opdateret: 7. juni 2026
          </p>
          <div className="legal-content flex flex-col gap-6 text-[15px] font-medium leading-relaxed text-zinc-600">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
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
      <h2 className="mt-4 font-display text-xl font-extrabold text-brand-blue">
        {title}
      </h2>
      {children}
    </section>
  );
}

