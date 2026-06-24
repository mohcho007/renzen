import Image from "next/image";
import { ChevronDown, MapPin } from "lucide-react";
import type { City } from "@/lib/cities";
import type { LocalMarketData } from "@/lib/localStats";

interface DynamicMarketAnalysisSectionProps {
  city?: City;
  localStats?: LocalMarketData;
  scopeLimits: {
    suitable: string;
    unsuitable: string;
  };
}

export function DynamicMarketAnalysisSection({
  city,
  localStats,
  scopeLimits,
}: DynamicMarketAnalysisSectionProps) {
  return (
    <>
{/* Local Market Stats & Coverage Section (Moved here for better UX, below main content but above links) */}
      {city && localStats && (() => {
        const population = localStats.population;
        const firms = localStats.cleaningFirmsCount;
        const households = localStats.households;
        
        // Calculate firms per 10k residents to show market density
        const firmsPer10k = population > 0 ? Math.round((firms / (population / 10000)) * 10) / 10 : 0;
        // Percentage of competition indicator (maxing out at 10 firms per 10k)
        const competitionPct = Math.min(Math.round((firmsPer10k / 10) * 100), 100);
        
        let competitionLabel = "Moderat udvalg";
        let competitionDesc = "Der er et par gode, lokale rengøringsfirmaer i området, så du kan godt forvente fine tilbud.";
        if (firmsPer10k >= 6) {
          competitionLabel = "Intensiv priskonkurrence";
          competitionDesc = "Rigtig mange firmaer kæmper om opgaverne her. Det giver dig de absolut bedste muligheder for en skarp pris.";
        } else if (firmsPer10k >= 3) {
          competitionLabel = "Sund konkurrence";
          competitionDesc = "Et fint udvalg af lokale firmaer, der gerne vil have din opgave. Det gør det let at få en god pris.";
        }

        return (
          <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
            <section className="w-full bg-gradient-to-br from-[#192251] to-[#243377] py-16 sm:py-20 rounded-none sm:rounded-[18px] border-y sm:border border-blue-400/10 relative z-20 overflow-hidden">
              
              {/* Background decorative SVG lines */}
              <div className="absolute left-0 top-0 w-80 h-80 pointer-events-none z-0 opacity-[0.2] select-none">
                <Image src="/shapes/structure-section-line1.svg" fill sizes="320px" className="object-contain object-left-top" alt="" />
              </div>
              <div className="absolute right-0 bottom-0 w-80 h-80 pointer-events-none z-0 opacity-[0.2] select-none">
                <Image src="/shapes/structure-section-line2.svg" fill sizes="320px" className="object-contain object-right-bottom" alt="" />
              </div>
              
              <div className="max-w-[1300px] mx-auto px-6 relative z-10">
              
              {/* Header */}
              <div className="mb-10 text-left max-w-2xl">
                <h3 className="font-display font-extrabold text-2xl sm:text-3.5xl text-white mt-0">
                  Markedsanalyse for {localStats.municipalityName}
                </h3>
                <p className="text-blue-100/70 font-semibold text-sm mt-2">
                  Reelle markedsdata trukket direkte fra CVR registeret og Danmarks Statistik.
                </p>
              </div>

              {/* Bento Grid Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Card 1: Indbyggere — light lavender */}
                <div className="md:col-span-4 bg-[#f0ecf9] border border-[#e0d9f0] p-5 rounded-2xl flex flex-col justify-between min-h-[135px] transition-all hover:shadow-md duration-300 group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none z-0 opacity-[0.07] transition-transform group-hover:scale-110 duration-500">
                    <Image src="/shapes/sarwisi-works-line4.svg" fill sizes="96px" className="object-contain rotate-90" alt="" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#6345a5]">Indbyggere</span>
                      <span className="text-[9px] bg-white/80 text-[#6345a5] font-extrabold px-2 py-0.5 rounded-md border border-[#6345a5]/20">DST data</span>
                    </div>
                    <span className="block text-3xl sm:text-4xl font-display font-black text-zinc-950 mt-2 tracking-tight">
                      {population.toLocaleString("da-DK")}
                    </span>
                    <p className="text-[11px] text-zinc-800 font-bold mt-1.5">
                      Registrerede borgere i kommunen
                    </p>
                  </div>
                  <span className="block text-[9px] text-[#6345a5] font-extrabold mt-3 pt-1.5 border-t border-[#e0d9f0] relative z-10">
                    Kilde: Danmarks Statistik
                  </span>
                </div>

                {/* Card 2: Aktive Firmaer — light mint */}
                <div className="md:col-span-4 bg-[#e6fbf3] border border-[#c8eddf] p-5 rounded-2xl flex flex-col justify-between min-h-[135px] transition-all hover:shadow-md duration-300 group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none z-0 opacity-[0.07] transition-transform group-hover:scale-110 duration-500">
                    <Image src="/shapes/sarwisi-works-line4.svg" fill sizes="96px" className="object-contain" alt="" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1f5f47]">Aktive Firmaer</span>
                      <span className="text-[9px] bg-white/80 text-[#1f5f47] font-extrabold px-2 py-0.5 rounded-md border border-[#1f5f47]/20">CVR registeret</span>
                    </div>
                    <span className="block text-3xl sm:text-4xl font-display font-black text-zinc-950 mt-2 tracking-tight">
                      {firms}
                    </span>
                    <p className="text-[11px] text-zinc-800 font-bold mt-1.5">
                      Kvalificerede rengøringsfirmaer
                    </p>
                  </div>
                  <span className="block text-[9px] text-[#1f5f47] font-extrabold mt-3 pt-1.5 border-t border-[#c8eddf] relative z-10">
                    Branchekode 81.21.00
                  </span>
                </div>

                {/* Card 3: Boliger — light peach */}
                <div className="md:col-span-4 bg-[#fdf0e8] border border-[#f5dece] p-5 rounded-2xl flex flex-col justify-between min-h-[135px] transition-all hover:shadow-md duration-300 group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none z-0 opacity-[0.07] transition-transform group-hover:scale-110 duration-500">
                    <Image src="/shapes/sarwisi-works-line4.svg" fill sizes="96px" className="object-contain rotate-180" alt="" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#a04e1b]">Boliger</span>
                      <span className="text-[9px] bg-white/80 text-[#a04e1b] font-extrabold px-2 py-0.5 rounded-md border border-[#a04e1b]/20">BBR estimat</span>
                    </div>
                    <span className="block text-3xl sm:text-4xl font-display font-black text-zinc-950 mt-2 tracking-tight">
                      {households.toLocaleString("da-DK")}
                    </span>
                    <p className="text-[11px] text-zinc-800 font-bold mt-1.5">
                      Estimerede boliger og lejligheder
                    </p>
                  </div>
                  <span className="block text-[9px] text-[#a04e1b] font-extrabold mt-3 pt-1.5 border-t border-[#f5dece] relative z-10">
                    Opdateret juni 2026
                  </span>
                </div>

                {/* Card 4: Konkurrence — light yellow */}
                <div className="md:col-span-7 bg-[#fef9e7] border border-[#f5ecc5] p-5 sm:p-6 rounded-2xl transition-all hover:shadow-md duration-300 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 pointer-events-none z-0 opacity-[0.04] transition-transform group-hover:scale-105 duration-500">
                    <Image src="/shapes/sarwisi-works-line5.svg" fill sizes="160px" className="object-contain" alt="" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-display font-black text-zinc-950 text-base tracking-tight">
                          Lokal konkurrenceindikator
                        </h4>
                        <p className="text-zinc-800 font-bold text-xs mt-0.5">
                          Jo flere lokale firmaer der byder, jo bedre priser kan du forvente på din rengøring.
                        </p>
                      </div>
                      <span className="inline-flex items-center bg-white text-[#8a6b18] text-[11px] font-extrabold px-3 py-1 rounded-full shrink-0 w-fit border border-[#8a6b18]/25">
                        {competitionLabel}
                      </span>
                    </div>

                    {/* Barometer */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
                        <span>Firmaer pr. 10.000 indbyggere: <strong className="text-zinc-950 font-black">{firmsPer10k}</strong></span>
                        <span>Konkurrenceindeks: <strong className="text-zinc-950 font-black">{competitionPct}%</strong></span>
                      </div>
                      
                      <div className="h-3 bg-white/80 rounded-full w-full relative overflow-hidden">
                        <div 
                          className="h-full bg-[#3B7965] rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${competitionPct}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-zinc-700 font-bold px-0.5 select-none">
                        <span>Begrænset udvalg</span>
                        <span>Sund konkurrence</span>
                        <span>Maksimalt prispres</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-800 font-bold leading-relaxed mt-2">
                    {competitionDesc}
                  </p>
                </div>

                {/* Card 5: Geografisk Dækning — light rose */}
                <div className="md:col-span-5 bg-[#fce8ee] border border-[#f4ced9] p-5 sm:p-6 rounded-2xl transition-all hover:shadow-md duration-300 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 pointer-events-none z-0 opacity-[0.05] transition-transform group-hover:scale-105 duration-500">
                    <Image src="/shapes/structure-section-line2.svg" fill sizes="176px" className="object-contain" alt="" />
                  </div>
                  
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h4 className="font-display font-black text-zinc-950 text-base tracking-tight">
                        {localStats.postalcodes.length <= 1 
                          ? `Dækningsområde i ${city.name}` 
                          : `Dækningsområde i ${localStats.municipalityName}`}
                      </h4>
                      <p className="text-zinc-800 font-bold text-xs mt-1">
                        {localStats.postalcodes.length <= 1 
                          ? "Vi dækker hele postnummeret med lokale firmaer." 
                          : "Vi dækker hele kommunen med lokale firmaer."}
                      </p>
                    </div>

                    <div className="mt-2 flex-grow flex flex-col justify-center">
                      {localStats.postalcodes.length <= 1 ? (
                        <div className="flex flex-col gap-4">
                          <p className="text-xs text-zinc-800 font-bold leading-relaxed">
                            Vi har fuld dækning af alle adresser, virksomheder og private hjem i hele postnummeret:
                          </p>
                          <div className="bg-white/70 border border-white p-4 rounded-xl flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#3B7965]/10 text-[#3B7965] flex items-center justify-center shrink-0">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <span className="block text-sm font-black text-zinc-950">{city.name}</span>
                              <span className="block text-xs font-bold text-zinc-700">Postnummer {localStats.primaryPostal}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-center text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider pb-1.5">
                            <span>Område / Postby</span>
                            <span>Responstid</span>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 max-h-[115px] overflow-y-auto pr-1 custom-scrollbar">
                            {localStats.townsServed.map((town, i) => {
                              const idx = Math.min(i, localStats.postalcodes.length - 1);
                              const code = localStats.postalcodes[idx];
                              return (
                                <div 
                                  key={i} 
                                  className="flex items-center justify-between bg-white/60 hover:bg-white px-3 py-2 rounded-lg transition-all duration-150"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-[#3B7965]/10 text-[#3B7965] flex items-center justify-center shrink-0">
                                      <MapPin size={11} />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-950">
                                      {town} <span className="text-rose-950 font-mono text-[10px] ml-0.5">({code})</span>
                                    </span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#3B7965] bg-[#3B7965]/8 px-1.5 py-0.5 rounded">
                                    <span className="w-1 h-1 bg-[#3B7965] rounded-full animate-pulse" />
                                    &lt; 24t
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-1.5 mt-2 text-[9px] text-zinc-700 font-bold border-t border-[#f4ced9] leading-relaxed">
                      * Postnumre og områdedækning trækkes direkte fra Danmarks Adresseregister (DAWA).
                    </div>
                  </div>
                </div>

                {/* Card 6: Anvendelsesområde — light blue accordion */}
                <div className="md:col-span-12 bg-[#edf4fb] border border-[#d5e3f0] p-4 sm:p-5 rounded-2xl transition-all hover:shadow-md duration-300 relative overflow-hidden">
                  <div className="absolute -right-12 -bottom-12 w-52 h-52 pointer-events-none z-0 opacity-[0.04]">
                    <Image src="/shapes/sarwisi-ai-line1.svg" fill sizes="208px" className="object-contain" alt="" />
                  </div>
                  
                  <details className="group w-full relative z-10">
                    <summary className="list-none [&::-webkit-details-marker]:hidden flex justify-between items-center cursor-pointer font-display font-black text-xs text-zinc-950 uppercase tracking-wider select-none outline-none">
                      <span>Anvendelsesområde & Begrænsninger</span>
                      <span className="text-[10px] text-zinc-750 font-extrabold flex items-center gap-1 bg-white border border-zinc-350 px-2.5 py-1 rounded-md transition-all group-open:bg-[#edf4fb]">
                        <span className="group-open:hidden">Vis detaljer</span>
                        <span className="hidden group-open:inline">Skjul detaljer</span>
                        <ChevronDown size={12} className="transition-transform duration-300 group-open:rotate-180" />
                      </span>
                    </summary>
                    
                    <div className="mt-4 flex flex-col gap-3.5 border-t border-[#d5e3f0] pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-medium leading-relaxed">
                        <div className="flex gap-3 bg-white/60 border border-white p-3 rounded-xl">
                          <span className="w-5 h-5 bg-[#3B7965]/10 text-[#3B7965] flex items-center justify-center rounded text-xs font-bold shrink-0 mt-0.5">✓</span>
                          <div>
                            <span className="block text-zinc-950 font-black mb-1">Velegnet til:</span>
                            <p className="text-zinc-800 font-bold">
                              {scopeLimits.suitable}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 bg-white/60 border border-white p-3 rounded-xl">
                          <span className="w-5 h-5 bg-rose-50 text-rose-500 flex items-center justify-center rounded text-xs font-bold shrink-0 mt-0.5">✗</span>
                          <div>
                            <span className="block text-zinc-950 font-black mb-1">Ikke egnet til:</span>
                            <p className="text-zinc-800 font-bold">
                              {scopeLimits.unsuitable}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Provenance Footer */}
                      <div className="text-[10px] text-zinc-700 font-bold leading-relaxed border-t border-[#d5e3f0] pt-2.5 mt-1">
                        <strong className="text-zinc-950 font-black">Metode & Datakilde:</strong> Data for aktive CVR registrerede rengøringsfirmaer er trukket direkte fra Erhvervsstyrelsens CVR register baseret på selskabsregistreringer under branchekode 81.21.00 (Almindelig rengøring i bygninger) i {localStats.municipalityName} pr. juni 2026. Befolkningstal og boligdata er synkroniseret med Danmarks Statistiks seneste kommunale statistikker.
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    })()}
    </>
  );
}
