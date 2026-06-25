import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8fafc] px-6 py-20">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-brand-green">
          <SearchX size={30} aria-hidden="true" />
        </div>
        <p className="mt-6 font-mono text-sm font-bold uppercase tracking-widest text-brand-green">
          Fejl 404
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-brand-blue sm:text-5xl">
          Siden blev ikke fundet
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          Linket kan være forældet, eller siden kan være flyttet. Du kan gå
          tilbage til forsiden eller finde rengøring i din by.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand-green px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Gå til forsiden
          </Link>
          <Link
            href="/privat-rengoring/"
            className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-bold text-brand-blue hover:bg-zinc-50"
          >
            Find rengøring i din by
          </Link>
        </div>
      </div>
    </main>
  );
}

