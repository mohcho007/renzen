import React from 'react';

interface TrustMarkersProps {
  className?: string;
}

export default function TrustMarkers({ className = '' }: TrustMarkersProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`}>
      <div className="flex items-center space-x-2 rounded-xl bg-white/70 p-3 shadow-sm border border-slate-100 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800 sm:text-sm">Forsikret Rengøring</p>
          <p className="text-[10px] text-slate-500">Dækning op til 10 mio. kr.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 rounded-xl bg-white/70 p-3 shadow-sm border border-slate-100 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800 sm:text-sm">Verificerede Folk</p>
          <p className="text-[10px] text-slate-500">Ren straffeattest påkrævet</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 rounded-xl bg-white/70 p-3 shadow-sm border border-slate-100 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14a2 2 0 110-4h4a2 2 0 110 4h-4z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800 sm:text-sm">Servicefradrag</p>
          <p className="text-[10px] text-slate-500">Spar 26% i skat på løn</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 rounded-xl bg-white/70 p-3 shadow-sm border border-slate-100 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800 sm:text-sm">4.8 stjerner</p>
          <p className="text-[10px] text-slate-500">Ud af +500 glade kunder</p>
        </div>
      </div>
    </div>
  );
}
