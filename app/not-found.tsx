import Link from "next/link";
import { SearchX } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />
      <main id="main" className="flex min-h-[65vh] items-center justify-center px-6 py-20 sm:px-10 lg:px-14">
        <div className="max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dfe9dc] text-[#173c2c]">
            <SearchX size={30} aria-hidden="true" />
          </div>
          <p className="mt-6 font-mono text-sm font-bold uppercase tracking-widest text-[#41614f]">
            Fejl 404
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
            Siden blev ikke fundet
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#536159]">
            Linket kan være forældet, eller siden kan være flyttet. Du kan gå
            tilbage til forsiden eller finde rengøring i din by.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-[4px] bg-[#173c2c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
            >
              Gå til forsiden
            </Link>
            <Link
              href="/privat-rengoring/"
              className="rounded-[4px] border border-[#c5cfc0] bg-white px-6 py-3 text-sm font-bold text-[#173c2c] transition-colors hover:bg-[#f4f6f2]"
            >
              Find rengøring i din by
            </Link>
          </div>
        </div>
      </main>
      <RenzenEditorialFooter />
    </div>
  );
}
