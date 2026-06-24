"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { HeroImageFrame } from "@/components/site/HeroImageFrame";
import {
  getLocationPhrase,
  type City,
  type Region,
} from "@/lib/cities";
import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";

export interface DynamicHeroSuggestion {
  tekst: string;
}

interface DynamicHeroSectionProps {
  service: Service;
  city?: City;
  region?: Region;
  heroImage: string;
  heroAlt: string;
  heroImagePosition?: "left" | "right";
  heroImageOffsetX?: number;
  blufText: string;
  postalCode: string;
  isLocating: boolean;
  suggestions: DynamicHeroSuggestion[];
  showSuggestions: boolean;
  onPostalCodeChange: (value: string) => void;
  onPostalCodeSelect: (value: string) => void;
  onHideSuggestions: () => void;
  onGeolocate: () => void;
  onOpenSelector: (postalCode: string) => void;
}

export function DynamicHeroSection({
  service,
  city,
  region,
  heroImage,
  heroAlt,
  heroImagePosition = "left",
  heroImageOffsetX = 0,
  blufText,
  postalCode,
  isLocating,
  suggestions,
  showSuggestions,
  onPostalCodeChange: handlePostalCodeChange,
  onPostalCodeSelect: setPostalCode,
  onHideSuggestions,
  onGeolocate: handleGeolocate,
  onOpenSelector,
}: DynamicHeroSectionProps) {
  const serviceName = getServiceNameInSentence(service);
  const locationPhrase = city
    ? getLocationPhrase(city)
    : region
      ? getLocationPhrase(region)
      : "";
  const setShowSuggestions = (visible: boolean) => {
    if (!visible) onHideSuggestions();
  };

  return (
    <>{/* Floating Hero Canvas */}
      <div className="px-0 sm:px-5 w-full -mt-[10px] sm:mt-0 mb-3 sm:mb-4">
        <section className="bg-brand-bg rounded-none sm:rounded-[18px] pt-12 pb-[56px] md:pb-[83px] relative overflow-hidden">

          {/* Floating Aura Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[65%] rounded-full bg-blue-300/25 blur-[120px] animate-blob" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[65%] rounded-full bg-emerald-200/15 blur-[120px] animate-blob animation-delay-2000 xl:hidden" />
            <div className="absolute top-[30%] left-[25%] w-[40%] h-[45%] rounded-full bg-violet-200/15 blur-[120px] animate-blob animation-delay-4000" />
            <HeroImageFrame
              src={heroImage}
              alt={heroAlt}
              imagePosition={heroImagePosition}
              imageOffsetX={heroImageOffsetX}
              priority
            />
          </div>

          <div className="max-w-[1300px] xl:max-w-[1380px] mx-auto px-6 xl:pl-4 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-center lg:items-start relative z-10">
          
            {/* Top Left Headline Content */}
            <div className="order-1 lg:col-span-6 lg:col-start-1 xl:col-span-7 xl:col-start-1 lg:row-start-1 flex flex-col gap-6 text-left lg:mt-6 w-full relative z-20">
              <div className="inline-flex items-center gap-2 bg-brand-badge text-brand-blue px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider w-fit">
                <CheckCircle2 size={16} className="text-brand-green" />
                <span>100% uforpligtende</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[40px] xl:text-[48px] text-brand-blue tracking-tight leading-[1.2]">
                {city || region ? (
                  <>
                    Få 3 tilbud på <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">{serviceName}</span> {locationPhrase}
                  </>
                ) : (
                  <>
                    Sammenlign tilbud på <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">{serviceName}</span> & spar 40%
                  </>
                )}
              </h1>

              <div className="hidden lg:block max-w-xl">
                <p className="text-lg leading-relaxed text-brand-blue/80 font-medium">
                  {blufText}
                </p>
              </div>

              {/* Desktop Left Form Box */}
              <div className="hidden lg:block w-full max-w-md mt-2 relative z-20">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const match = postalCode.match(/\b\d{4}\b/);
                    const code = match ? match[0] : "";
                    if (!code || code.length !== 4) {
                      alert("Indtast venligst et gyldigt 4-cifret postnummer eller vælg fra listen.");
                      return;
                    }
                    onOpenSelector(postalCode);
                  }} 
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="left-postal-code-desktop" className="text-[15px] font-bold text-brand-blue block">
                      Indtast dit postnummer
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="left-postal-code-desktop"
                        type="text"
                        placeholder="F.eks. 2650 eller Hvidovre"
                        value={postalCode}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        className="w-full h-12 bg-white border border-stone-300 rounded-xl px-4 text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B7965] focus:border-[#3B7965] transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={isLocating}
                        className="absolute right-4 p-1.5 text-brand-green hover:text-emerald-800 disabled:opacity-50 cursor-pointer"
                        title="Brug min placering"
                      >
                        {isLocating ? (
                          <div className="h-4 w-4 border-2 border-stone-200 border-t-brand-green rounded-full animate-spin" />
                        ) : (
                          <MapPin size={18} />
                        )}
                      </button>

                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-xl mt-1.5 z-30 max-h-60 overflow-y-auto font-medium text-sm text-slate-700">
                          {suggestions.map((s, idx) => (
                            <div
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setPostalCode(s.tekst);
                                setShowSuggestions(false);
                              }}
                              className="px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 flex justify-between items-center transition-colors duration-150"
                            >
                              <span>{s.tekst}</span>
                              <span className="text-xs text-slate-400 font-mono bg-stone-100 px-2 py-0.5 rounded">Postnummer</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-12 rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] btn-shimmer-container cursor-pointer uppercase tracking-wider"
                  >
                    <span>Vælg service</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Left Highlights */}
            <div className="order-3 lg:col-span-6 lg:col-start-1 xl:col-span-7 xl:col-start-1 lg:row-start-2 flex flex-col gap-6 text-left w-full mt-4 lg:mt-0 lg:-mt-8 relative z-10">
              <div className="lg:hidden max-w-xl mb-2">
                <p className="text-base sm:text-lg leading-relaxed text-brand-blue/80 font-medium">
                  {blufText}
                </p>
              </div>

              {/* Mobile Left Form Box */}
              <div className="lg:hidden w-full max-w-md mt-2 relative z-20">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const match = postalCode.match(/\b\d{4}\b/);
                    const code = match ? match[0] : "";
                    if (!code || code.length !== 4) {
                      alert("Indtast venligst et gyldigt 4-cifret postnummer eller vælg fra listen.");
                      return;
                    }
                    onOpenSelector(postalCode);
                  }} 
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="left-postal-code-mobile" className="text-[15px] font-bold text-brand-blue block">
                      Indtast dit postnummer
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="left-postal-code-mobile"
                        type="text"
                        placeholder="F.eks. 2650 eller Hvidovre"
                        value={postalCode}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        className="w-full h-12 bg-white border border-stone-300 rounded-xl px-4 text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B7965] focus:border-[#3B7965] transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={isLocating}
                        className="absolute right-4 p-1.5 text-brand-green hover:text-emerald-800 disabled:opacity-50 cursor-pointer"
                        title="Brug min placering"
                      >
                        {isLocating ? (
                          <div className="h-4 w-4 border-2 border-stone-200 border-t-brand-green rounded-full animate-spin" />
                        ) : (
                          <MapPin size={18} />
                        )}
                      </button>

                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-xl mt-1.5 z-30 max-h-60 overflow-y-auto font-medium text-sm text-slate-700">
                          {suggestions.map((s, idx) => (
                            <div
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setPostalCode(s.tekst);
                                setShowSuggestions(false);
                              }}
                              className="px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 flex justify-between items-center transition-colors duration-150"
                            >
                              <span>{s.tekst}</span>
                              <span className="text-xs text-slate-400 font-mono bg-stone-100 px-2 py-0.5 rounded">Postnummer</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-12 rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] btn-shimmer-container cursor-pointer uppercase tracking-wider"
                  >
                    <span>Vælg service</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* Dynamic Checklist bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 mb-4 max-w-md xl:max-w-lg">
                {service.checklist.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold">
                    <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Overlapping Client Avatars Stack */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex -space-x-3">
                  <Image className="inline-block h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="Renbud kunde avatar 1 - privat rengøringshjælp" width={40} height={40} priority />
                  <Image className="inline-block h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Renbud kunde avatar 2 - professionel trappevask" width={40} height={40} priority />
                  <Image className="inline-block h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Renbud kunde avatar 3 - renovering og byggerengøring" width={40} height={40} priority />
                  <Image className="inline-block h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" alt="Renbud kunde avatar 4 - vinduespudsning tilbud" width={40} height={40} priority />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4.5 w-4.5 text-amber-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-[13px] font-bold text-brand-blue/90 ml-1.5">4.8 / 5 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
