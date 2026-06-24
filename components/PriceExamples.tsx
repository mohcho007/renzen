import React from 'react';
import Link from 'next/link';
import { calculateCleaningPrice } from '../lib/pricing';

export default function PriceExamples() {
  const examples = [
    { size: 60, desc: 'Lille lejlighed (2-3 værelser)' },
    { size: 90, desc: 'Almindelig lejlighed / rækkehus' },
    { size: 130, desc: 'Klassisk parcelhus / villa' },
    { size: 180, desc: 'Større bolig / herskabslejlighed' }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <h4 className="text-base font-bold text-slate-800">Priseksempler på rengøring</h4>
        <p className="mt-1 text-xs text-slate-500">
          Se priseksempler for forskellige boligstørrelser med medlemsrabat (hver 2. uge, 15% rabat):
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {examples.map((ex) => {
          const price = calculateCleaningPrice(ex.size, 'biweekly');
          return (
            <div key={ex.size} className="flex flex-col p-6 sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {ex.size} m²
                </span>
                <h5 className="mt-2 text-sm font-semibold text-slate-800">{ex.desc}</h5>
              </div>
              <div className="flex items-center space-x-6">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Listepris</span>
                  <span className="text-sm font-bold text-slate-500 line-through">{calculateCleaningPrice(ex.size, 'once').totalPrice} kr.</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Med rabat</span>
                  <span className="text-sm font-bold text-slate-700">{price.totalPrice} kr.</span>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-500/10 text-right">
                  <span className="block text-[9px] uppercase font-extrabold tracking-wider text-emerald-700">Efter fradrag</span>
                  <span className="text-base font-black text-emerald-600">{price.finalCostAfterFradrag} kr.*</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-slate-50/50 p-4 text-center border-t border-slate-100">
        <Link href="/#calculator" className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
          Beregn din præcise boligstørrelse i prisberegneren &rarr;
        </Link>
      </div>
    </div>
  );
}
