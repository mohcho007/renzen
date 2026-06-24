import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cities } from '../data/cities';

export default function Footer() {
  // Sort cities alphabetically for clean output
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'da'));

  return (
    <footer className="bg-[#131919] text-[#a0a5a5] text-xs pt-16 pb-8 border-t border-emerald-950/20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#212d2d]">
          
          {/* Brand block (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="text-white text-2xl font-black tracking-wider uppercase font-heading">
                Renzen
              </span>
              {/* Custom SVG zen circle logo inline */}
              <svg className="h-6 w-6 text-white fill-current" viewBox="0 0 100 100">
                <path d="M 50 10 C 27.9 10 10 27.9 10 50 C 10 72.1 27.9 90 50 90 C 72.1 90 90 72.1 90 50 C 90 33 80 18 65 13 C 63 12 61 14 62 16 C 75 22 84 35 84 50 C 84 68.8 68.8 84 50 84 C 31.2 84 16 68.8 16 50 C 16 31.2 31.2 16 50 16 C 59.5 16 68 20 74 27 C 75 28 77 28 77 26 C 71 18 61 12 50 10 Z" />
              </svg>
            </Link>
            <p className="leading-relaxed text-[#8a9090] text-[13px] max-w-sm">
              Renzen er Danmarks nye rengøringsportal. Vi har integreret zen-filosofien, der skaber ro og harmoni i dit hjem. Vores rengøring sikrer ikke kun et rent hjem, men fremmer også balance og velvære. Lad os bringe zen ind i din hverdag.
            </p>
            <div className="text-[11px] text-emerald-500 font-semibold tracking-wide flex flex-wrap gap-x-2 gap-y-1">
              <span>#renzen</span>
              <span>#rengoering</span>
              <span>#zen</span>
              <span>#hjem</span>
              <span>#ro</span>
              <span>#harmoni</span>
              <span>#balance</span>
              <span>#kundetilfredshed</span>
            </div>
          </div>

          {/* Virksomhed (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Virksomhed</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq/" className="hover:text-white transition-colors">Hjælp / FAQ</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">Om os</Link>
              </li>
              <li>
                <Link href="/artikler/" className="hover:text-white transition-colors">Artikler</Link>
              </li>
              <li>
                <Link href="/betingelser/" className="hover:text-white transition-colors">Handelsbetingelser</Link>
              </li>
              <li>
                <Link href="/privatlivspolitik/" className="hover:text-white transition-colors">Cookie- & Privatlivspolitik</Link>
              </li>
            </ul>
          </div>

          {/* Vi tilbyder (2.5 cols) */}
          <div className="md:col-span-2.5 space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Vi tilbyder</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privat-rengoring/" className="hover:text-white transition-colors">Privat rengøring</Link>
              </li>
              <li>
                <Link href="/airbnb-rengoring/" className="hover:text-white transition-colors">Airbnb rengøring</Link>
              </li>
              <li>
                <Link href="/flytterengoring/" className="hover:text-white transition-colors">Flytterengøring</Link>
              </li>
              <li>
                <Link href="/erhvervsrengoring/" className="hover:text-white transition-colors">Erhvervsrengøring</Link>
              </li>
              <li>
                <Link href="/bliv-zenmester/" className="hover:text-white transition-colors font-semibold text-emerald-400">Bliv Zenmester</Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact (2.5 cols) */}
          <div className="md:col-span-2.5 space-y-5">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Download vores app</h4>
            <div className="flex flex-col gap-2">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <Image src="/next.svg" alt="App Store" width={100} height={30} className="h-7 w-auto object-contain bg-white/5 p-1.5 rounded" />
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <Image src="/next.svg" alt="Google Play" width={100} height={30} className="h-7 w-auto object-contain bg-white/5 p-1.5 rounded" />
              </a>
            </div>

            <div className="space-y-1 text-[11px] pt-1">
              <p className="text-[#8a9090]">Bedøm os på Google</p>
              <p className="text-[#8a9090]">Bedøm os på Trustpilot</p>
            </div>

            <div className="space-y-1 text-[11px] border-t border-[#212d2d] pt-3">
              <p className="text-white font-bold">Kontakt os</p>
              <p className="text-[#8a9090]">Man - Fre 09:00 - 20:00</p>
              <p className="text-white font-semibold">49 90 30 55</p>
              <p className="text-emerald-400 font-semibold hover:underline">
                <a href="mailto:info@renzen.dk">info@renzen.dk</a>
              </p>
            </div>
          </div>

        </div>

        {/* Locations List */}
        <div className="py-12 border-b border-[#212d2d]">
          <h4 className="text-white font-bold uppercase tracking-widest text-center text-sm mb-8">
            Lokationer
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-2 text-[#7c8282] text-[11px]">
            {sortedCities.map((city) => (
              <Link
                key={city.slug}
                href={`/privat-rengoring/${city.slug}/`}
                className="hover:text-white transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[#7c8282] text-[11px]">
          <p>Copyright © 2025 Renzen - CVR: 27568811</p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link href="/privatlivspolitik/" className="hover:text-white transition-colors">Privatlivspolitik</Link>
            <Link href="/betingelser/" className="hover:text-white transition-colors">Handelsbetingelser</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
