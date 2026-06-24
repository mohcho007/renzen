import React from 'react';
import Link from 'next/link';

interface CTAProps {
  title?: string;
  subtitle?: string;
}

export default function CTA({ 
  title = 'Klar til at bringe zen og renhed ind i dit hjem?', 
  subtitle = 'Det tager under 2 minutter at beregne din pris og booke din første rengøring. Helt uden binding.' 
}: CTAProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-teal-400 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          {subtitle}
        </p>
        
        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/book-rengoering/"
            className="rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-95"
          >
            Book rengøring
          </Link>
          <Link
            href="/#calculator"
            className="rounded-full border border-slate-700 bg-slate-800/80 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-slate-800 hover:border-slate-600 active:scale-95"
          >
            Se din pris
          </Link>
        </div>

        {/* Small sub-text */}
        <p className="mt-6 text-xs text-slate-400">
          Tryghedsgaranti • Fuld ansvarsforsikring • Fradragsberettiget (26%)
        </p>
      </div>
    </section>
  );
}
