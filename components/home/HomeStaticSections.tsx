import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DenmarkMap from "@/components/DenmarkMap";
import { SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/siteConfig";
import { SiteFooter } from "@/components/site/SiteFooter";

function StaticSection({
  children,
  className = "",
  delayClass = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  delayClass?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`fade-in-section is-visible ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function HomePricingSection() {
  const pricingExamples = [
    {
      label: "Fast privat rengøring",
      href: "/privat-rengoring/",
      service: SERVICES["privat-rengoering"],
    },
    {
      label: "Flytterengøring",
      href: "/flytterengoring/",
      service: SERVICES.flytterengoering,
    },
    {
      label: "Erhvervsrengøring",
      href: "/erhvervsrengoring/",
      service: SERVICES.erhvervsrengoering,
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-12 lg:gap-20 items-start">
          <StaticSection className="flex flex-col items-start">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#3b7965] mb-4">
              Vejledende priser
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-brand-blue tracking-tight leading-[1.2]">
              Hvad koster professionel rengøring?
            </h2>
            <p className="text-zinc-600 font-medium text-base sm:text-lg leading-relaxed mt-5 max-w-xl">
              Prisen afhænger af boligens eller lokalets størrelse, opgavens
              omfang og hvor ofte der skal gøres rent. Her kan du se nogle
              typiske startpriser.
            </p>
            <div className="mt-7 pt-6 border-t border-zinc-200 w-full max-w-xl">
              <p className="text-sm font-bold text-brand-blue mb-3">
                Det har størst betydning for prisen:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm font-medium text-zinc-600">
                <li>Boligens eller lokalets størrelse</li>
                <li>Fast aftale eller enkeltopgave</li>
                <li>Opgavens omfang og tilvalg</li>
                <li>Adresse og adgangsforhold</li>
              </ul>
            </div>

            <Link
              href="/book-rengoering"
              className="mt-8 inline-flex items-center gap-2 bg-[#192251] hover:bg-zinc-800 text-white font-display font-bold px-6 py-3.5 rounded-full text-[15px] transition-colors shadow-sm"
            >
              Beregn din pris nu
              <ArrowRight size={17} />
            </Link>
          </StaticSection>

          <StaticSection className="bg-white border border-zinc-200/80 rounded-[22px] overflow-hidden shadow-[0_8px_30px_rgba(25,34,81,0.04)] w-full lg:max-w-[560px] lg:ml-auto">
            <div className="px-5 sm:px-7 py-4 border-b border-zinc-200 bg-white">
              <div className="grid grid-cols-[1fr_auto] gap-6 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                <span>Eksempel</span>
                <span>Startpris</span>
              </div>
            </div>

            {pricingExamples.map(({ label, href, service }) => {
              const example = service.pricingTable[0];

              return (
                <Link
                  key={service.slug}
                  href={href}
                  className="group grid grid-cols-[1fr_auto] gap-6 items-center px-5 sm:px-7 py-5 sm:py-6 border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50/80 transition-colors"
                >
                  <span>
                    <span className="block font-display font-bold text-brand-blue text-base group-hover:text-[#3b7965] transition-colors">
                      {label}
                    </span>
                    <span className="block text-xs sm:text-sm font-medium text-zinc-500 mt-1">
                      {example.label}
                    </span>
                  </span>
                  <span className="font-display font-extrabold text-brand-blue text-right text-base sm:text-lg whitespace-nowrap">
                    {example.price}
                  </span>
                </Link>
              );
            })}

            <div className="px-5 sm:px-7 py-5 bg-[#f7faf9] border-t border-emerald-100/70">
              <p className="text-xs sm:text-[13px] leading-relaxed font-medium text-zinc-600">
                Priserne er vejledende. Det enkelte rengøringsfirma fastsætter
                den endelige pris ud fra din opgave. Privatpriser er inkl. moms
                og før eventuelt servicefradrag.
              </p>
            </div>
          </StaticSection>
        </div>
      </div>
    </section>
  );
}

export function HomeCoverageAndAppSections() {
  return (
    <>
      {/* Coverage Section */}
      <section id="daekning" className="py-[114px] sm:py-[130px] bg-white relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Cities List */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <StaticSection className="flex flex-col gap-3">
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
                  Vi dækker hele <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">Danmark</span>
                </h2>
                <p className="text-zinc-600 font-medium text-base leading-relaxed">
                  Uanset om du bor i København, Aarhus eller en mindre kommune, matcher vi dig med kvalitetssikrede lokale rengøringsfirmaer. Vælg din by nedenfor for at booke din næste rengøring.
                </p>
              </StaticSection>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3.5 mt-4">
                {[
                  "København", "Aarhus", "Odense", "Aalborg", "Frederiksberg", 
                  "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", 
                  "Roskilde", "Herning", "Hørsholm", "Hvidovre", "Rødovre", 
                  "Køge", "Lyngby", "Slagelse", "Næstved", "Gentofte", 
                  "Gladsaxe", "Ballerup", "Brøndby", "Albertslund", "Tårnby", 
                  "Herlev", "Glostrup", "Ishøj", "Vallensbæk", "Dragør"
                ].map((cityName, idx) => {
                  const citySlug = cityName.toLowerCase()
                    .replace(/ø/g, "oe")
                    .replace(/å/g, "aa")
                    .replace(/æ/g, "ae")
                    .replace(/\s+/g, "-")
                    .replace(/\./g, "");
                  
                  return (
                    <Link
                      key={idx}
                      href={`/privat-rengoring/${citySlug}/`}
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-[#3B7965] transition-colors group"
                    >
                      <span className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-[#3B7965] group-hover:scale-125 transition-all" />
                      <span>{cityName}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/byer/"
                className="mt-4 text-[#3B7965] hover:text-emerald-800 text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Se alle byer og kommuner</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right Column: Interactive Denmark Map */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <DenmarkMap />
            </div>

          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section id="download-app" className="w-full pt-16 pb-0 lg:py-0 lg:h-[450px] bg-gradient-to-br from-[#192251] to-[#243377] border-t border-blue-400/10 border-b border-blue-400/30 relative text-white flex items-center overflow-hidden">
        {/* Background decorative blobs (isolated with overflow-hidden to prevent bleeding) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[70%] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[60%] rounded-full bg-blue-300/5 blur-[100px]" />
        </div>

        <div className="max-w-[1300px] mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <StaticSection className="flex flex-col gap-2">
                <span className="text-[14px] font-bold uppercase tracking-wider text-sky-300">
                  Hent {siteConfig.name} Appen
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white tracking-tight">
                  Bestil din rengøring <br /> på under et minut
                </h2>
                <p className="text-slate-200 font-medium text-base sm:text-lg leading-relaxed max-w-xl mt-1">
                  Planlæg, følg og betal for din rengøringshjælp – alt sammen i én og samme app.
                </p>
              </StaticSection>

              {/* Badges Row (Primary Download Actions) */}
              <StaticSection className="flex items-center gap-3 mt-2">
                {/* App Store Badge */}
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-black hover:bg-zinc-900 border border-white/20 text-white px-4 py-2 rounded-[12px] transition-all hover:scale-105 active:scale-95 min-w-[150px] shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.3-76.5-19.3-36.9 0-77.8 23.7-96.6 57-39.6 69.6-10.2 172.7 27.6 226.7 18.6 26.9 40.6 56.7 69.6 55.6 27.9-1.1 38.4-18.2 72.2-18.2 33.6 0 43.1 18.2 72.2 17.6 29.6-.5 49-26.9 67.3-53.7 21.2-30.8 29.7-60.8 30.2-62.3-.6-.3-57.4-22-57.8-87.1zM302.2 120c15.2-18.6 25.8-44.1 22.5-70.1-23.7 1-52.7 15.6-69.7 35.5-14.8 17.1-27.7 42.6-24.1 68 26.2 2 53.7-14.8 71.3-33.4z"/>
                  </svg>
                  <div className="text-left flex flex-col justify-center -mt-0.5">
                    <span className="text-[10px] leading-tight font-medium opacity-80">Hent i</span>
                    <span className="text-[18px] leading-none font-semibold tracking-tight -mt-0.5">App Store</span>
                  </div>
                </a>

                {/* Google Play Badge */}
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-black hover:bg-zinc-900 border border-white/20 text-white px-4 py-2 rounded-[12px] transition-all hover:scale-105 active:scale-95 min-w-[150px] shadow-lg">
                  <svg className="w-7 h-7" viewBox="0 0 512 512">
                    <path fill="#2196f3" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
                    <path fill="#4caf50" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
                    <path fill="#ffeb3b" d="M425.2 225.6l-58 33.3-60.1-60.1 60.1-60.1 58 33.3c13 7.5 21.7 19.9 21.7 33.6s-8.7 26.1-21.7 33.1z"/>
                    <path fill="#f44336" d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z"/>
                  </svg>
                  <div className="text-left flex flex-col justify-center -mt-0.5">
                    <span className="text-[10px] leading-tight font-medium opacity-80">NU PÅ</span>
                    <span className="text-[17px] leading-none font-semibold tracking-tight mt-0.5">Google Play</span>
                  </div>
                </a>
              </StaticSection>
            </div>

            {/* Right Column: App Mockup iPhones (Mobile only here) */}
            <StaticSection className="lg:col-span-5 relative h-full flex items-end justify-center lg:hidden w-full" delayClass="fade-in-delay-100">
              <div className="relative w-full aspect-[4/3] max-w-full mx-auto mt-6 pointer-events-none scale-135 translate-x-[2%] origin-bottom">
                <Image 
                  src="/renzen mobil mockup.png" 
                  alt={`Mobiltelefon der viser ${siteConfig.name}s rengøringsapplikation og rengøringsoversigt`} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </StaticSection>

          </div>
        </div>

        {/* Desktop version (overflowing top and bottom, positioned relative to the section itself) */}
        <StaticSection className="hidden lg:block absolute bottom-[-1px] top-[-55px] right-[1%] xl:right-[3%] w-[800px] pointer-events-none z-20" delayClass="fade-in-delay-100">
          <div className="relative w-full h-full min-h-[500px]">
            <Image 
              src="/renzen mobil mockup.png" 
              alt={`To mobiltelefoner der viser ${siteConfig.name}s applikation med booking af rengøring`} 
              fill
              sizes="800px"
              className="object-contain object-bottom"
            />
          </div>
        </StaticSection>
      </section>
    </>
  );
}

export function HomeClosingSections() {
  return (
    <>
      {/* Final CTA Section */}
      <div className="px-0 sm:px-5 w-full my-6 sm:my-8 lg:my-16">
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#192251] via-[#111943] to-[#090d25] text-white rounded-none sm:rounded-[18px] border-y sm:border border-blue-400/20 relative overflow-hidden">
          {/* Floating Aura Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[45%] h-[60%] rounded-full bg-blue-500/15 blur-[100px] animate-blob" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px] animate-blob animation-delay-2000" />
          </div>
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none z-0" />
          <StaticSection className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col gap-8 items-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
              Klar til at bestille din næste rengøring?
            </h2>
            <p className="text-lg text-white/80 max-w-xl font-medium leading-relaxed">
              Det tager kun 2 minutter at beregne din pris og booke. Få en fast pris og en fast Zenmester i dag.
            </p>
            <Link
              href="/book-rengoering"
              className="bg-primary hover:bg-emerald-800 text-white font-display font-bold h-14 px-10 rounded-full text-[17px] flex items-center justify-center gap-2 shadow-lg transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] btn-shimmer-container"
            >
              <span>Book din rengøring nu</span>
              <ArrowRight size={20} />
            </Link>
            <span className="text-sm text-white/60 font-semibold">✓ 100% uforpligtende · Ingen skjulte gebyrer</span>
          </StaticSection>
        </section>
      </div>

      {/* Render the reusable SiteFooter */}
      <SiteFooter />
    </>
  );
}
