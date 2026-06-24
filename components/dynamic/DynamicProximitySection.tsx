"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
import {
  CITIES,
  getLocationPhrase,
  REGIONS,
  type City,
  type Region,
} from "@/lib/cities";
import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";
import { NAV_SERVICES } from "@/components/dynamic/DynamicHeader";
import { ServiceNavIcon } from "@/components/site/ServiceNavIcon";
const CATEGORY_SUBS: Record<number, { name: string; slug: string }[]> = {
  0: [ // Privatrengøring
    { name: "Privat rengøring", slug: "privat-rengoering" },
    { name: "Dødsborengøring", slug: "doedsborengoering" },
    { name: "Tæpperens", slug: "taepperens" },
    { name: "Anden rengøring", slug: "anden-rengoering" }
  ],
  1: [ // Erhvervsrengøring
    { name: "Erhvervsrengøring", slug: "erhvervsrengoering" },
    { name: "Kontorrengøring", slug: "kontorrengoering" },
    { name: "Klinikrengøring", slug: "klinikrengoering" },
    { name: "Butiksrengøring", slug: "butiksrengoering" },
    { name: "Institutionsrengøring", slug: "institutionsrengoering" },
    { name: "Anden erhvervsrengøring", slug: "erhverv-anden-rengoering" }
  ],
  2: [ // Flytterengøring
    { name: "Flytterengøring", slug: "flytterengoering" },
    { name: "Flytterengøring for erhverv", slug: "flytterengoering-erhverv" }
  ],
  3: [ // Hovedrengøring
    { name: "Hovedrengøring", slug: "hovedrengoering" }
  ],
  4: [ // Airbnb rengøring
    { name: "Airbnb rengøring", slug: "airbnb-rengoering" },
    { name: "Privat rengøring", slug: "privat-rengoering" }
  ],
  5: [ // Kontorrengøring
    { name: "Kontorrengøring", slug: "kontorrengoering" },
    { name: "Erhvervsrengøring", slug: "erhvervsrengoering" },
    { name: "Klinikrengøring", slug: "klinikrengoering" },
    { name: "Butiksrengøring", slug: "butiksrengoering" },
    { name: "Institutionsrengøring", slug: "institutionsrengoering" }
  ],
  6: [ // Trapperengøring
    { name: "Trappevask", slug: "trappevask" },
    { name: "Elevatorrengøring", slug: "elevatorrengoering" },
    { name: "Ejendomsservice", slug: "ejendomsservice" }
  ],
  7: [ // Vinduespudsning
    { name: "Vinduespudsning", slug: "vinduespudsning" },
    { name: "Vinduespudsning for ejendomme", slug: "ejendoms-vinduespudsning" },
    { name: "Solcellerens", slug: "solcellerens" }
  ],
  8: [ // Algerens & Fliserens
    { name: "Fliserens & algebehandling", slug: "fliserens-og-algebehandling" },
    { name: "Fliserens", slug: "fliserens" },
    { name: "Algebehandling", slug: "algebehandling" },
    { name: "Tagrenderens", slug: "tagrenderens" },
    { name: "Altanrengøring", slug: "altanrengoering" },
    { name: "Facaderens for ejendomme", slug: "ejendoms-facaderens" },
    { name: "Facaderens", slug: "facaderens" },
    { name: "Tagrens", slug: "tagrens" }
  ],
  9: [ // Byggerengøring
    { name: "Byggerengøring", slug: "byggerengoering" },
    { name: "Skurvognsrengøring", slug: "skurvognsrengoering" },
    { name: "Skadeservice", slug: "skadeservice" },
    { name: "Havearbejde", slug: "havearbejde" },
    { name: "Snerydning", slug: "snerydning" }
  ]
};

const CATEGORY_COLORS: Record<number, { bg: string; text: string; border: string; bgHover: string }> = {
  0: { bg: "#e6fbf3", text: "#2d5e4d", border: "#a7f3d0", bgHover: "#e6fbf3" },
  1: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", bgHover: "#eff6ff" },
  2: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff", bgHover: "#faf5ff" },
  3: { bg: "#fffbeb", text: "#b45309", border: "#fde68a", bgHover: "#fffbeb" },
  4: { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", bgHover: "#fff1f2" },
  5: { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc", bgHover: "#ecfeff" },
  6: { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe", bgHover: "#eef2ff" },
  7: { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", bgHover: "#f0f9ff" },
  8: { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0", bgHover: "#ecfdf5" },
  9: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", bgHover: "#fff7ed" }
};
interface DynamicProximitySectionProps {
  service: Service;
  city?: City;
  region?: Region;
}

export function DynamicProximitySection({
  service,
  city,
  region,
}: DynamicProximitySectionProps) {
  const serviceName = getServiceNameInSentence(service);
  const regionPhrase = region ? getLocationPhrase(region) : "";
  const [showAllCities, setShowAllCities] = useState(false);
  const [openServicePanel, setOpenServicePanel] = useState<number | null>(null);

  const getRelatedCities = (): City[] => {
    if (city) {
      return Object.values(CITIES).filter(
        (candidate) =>
          candidate.region === city.region && candidate.slug !== city.slug,
      );
    }
    if (region) {
      return Object.values(CITIES).filter(
        (candidate) => candidate.region === region.slug,
      );
    }
    return Object.values(CITIES).filter((candidate) =>
      ["koebenhavn", "aarhus", "odense", "aalborg", "esbjerg"].includes(
        candidate.slug,
      ),
    );
  };

  const getOtherRegions = (): Region[] => {
    if (region) {
      return Object.values(REGIONS).filter(
        (candidate) => candidate.slug !== region.slug,
      );
    }
    return Object.values(REGIONS);
  };

  return (
    <>{/* Proximity / Internal linking Section */}
      <section className="bg-white py-12 sm:py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-12">
            
            {/* Alternative/Related Services: Lugg-style click-expand category grid */}
            <div>
              <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col gap-3">
                <h4 className="font-display font-extrabold text-[#192251] text-3xl sm:text-4xl leading-tight tracking-tight">
                  Kvalitetssikret hjælp til enhver opgave
                </h4>
                <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
                  Vælg en servicekategori nedenfor for at se alle vores relaterede services i {city ? city.name : region ? region.name : "dit nærområde"}.
                </p>
              </div>

              {/* React-state-driven accordion: one open at a time, click-to-close, smooth slide */}
              <>
                <style dangerouslySetInnerHTML={{ __html: `
                  .lugg-grid-item {
                    order: var(--order-mobile);
                  }
                  @media (min-width: 640px) {
                    .lugg-grid-item { order: var(--order-tablet); }
                  }
                  @media (min-width: 768px) {
                    .lugg-grid-item { order: var(--order-desktop); }
                  }
                  .lugg-card, .icon-wrapper, .lugg-sub-item {
                    transition: none !important;
                  }
                  .lugg-card {
                    border: 1px solid #e5e7eb;
                    background-color: #ffffff;
                    color: #334155;
                  }
                  .lugg-card:hover {
                    background-color: var(--theme-bg-hover);
                    border-color: #cbd5e1;
                    color: var(--theme-text);
                  }
                  .lugg-sub-item {
                    display: block;
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: none;
                    background-color: transparent;
                    color: #475569;
                    font-size: 0.875rem;
                    line-height: 1.35;
                    font-weight: 600;
                  }
                  .lugg-sub-item:hover {
                    background-color: var(--theme-bg-hover);
                    color: var(--theme-text);
                  }
                  .lugg-sub-item.active-sub {
                    background-color: var(--theme-bg);
                    color: var(--theme-text);
                  }
                  @keyframes luggSlideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                  .lugg-panel-animate {
                    animation: luggSlideDown 220ms ease-out both;
                  }
                ` }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {NAV_SERVICES.map((s, idx) => {
                    const colors = CATEGORY_COLORS[idx] || { bg: "#f3f4f6", text: "#374151", border: "#d1d5db", bgHover: "#f3f4f6" };
                    const isOpen = openServicePanel === idx;

                    const cardStyle = {
                      "--order-mobile": 2 * idx + 1,
                      "--order-tablet": 3 * Math.floor(idx / 2) + 1,
                      "--order-desktop": 5 * Math.floor(idx / 4) + 1,
                      "--theme-bg": colors.bg,
                      "--theme-text": colors.text,
                      "--theme-border": colors.border,
                      "--theme-bg-hover": colors.bgHover,
                      ...(isOpen ? {
                        borderColor: colors.text,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      } : {}),
                    } as React.CSSProperties;

                    const panelStyle = {
                      "--order-mobile": 2 * idx + 2,
                      "--order-tablet": 3 * Math.floor(idx / 2) + 3,
                      "--order-desktop": 5 * Math.floor(idx / 4) + 5,
                      "--theme-bg": colors.bg,
                      "--theme-text": colors.text,
                      "--theme-border": colors.border,
                      "--theme-bg-hover": colors.bgHover,
                    } as React.CSSProperties;

                    const subs = CATEGORY_SUBS[idx] || [];

                    return (
                      <React.Fragment key={idx}>
                        {/* Category card button */}
                        <button
                          type="button"
                          onClick={() => setOpenServicePanel(isOpen ? null : idx)}
                          style={cardStyle}
                          className="lugg-grid-item lugg-card cursor-pointer flex items-center justify-between py-2.5 px-4 rounded-xl select-none w-full text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`icon-wrapper w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${s.colorClass}`}>
                              <ServiceNavIcon name={s.icon} />
                            </div>
                            <span className="font-bold text-[14px]">
                              {s.label}
                            </span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="shrink-0"
                            style={{
                              color: isOpen ? colors.text : '#9ca3af',
                              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 150ms ease-in-out',
                            }}
                          />
                        </button>

                        {/* Slide-in collapsible panel — display:none removes from grid flow, no gap */}
                        <div
                          style={{
                            ...panelStyle,
                            display: isOpen ? undefined : 'none',
                          } as React.CSSProperties}
                          className="lugg-grid-item col-span-full"
                        >
                          {/* key changes on open so React re-mounts → replays animation */}
                          <div key={isOpen ? idx : -idx - 1} className="lugg-panel-animate">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 pb-6">
                              {subs.map((sub) => {
                                const isActive = sub.slug === service.slug;
                                return (
                                  <a
                                    key={sub.slug}
                                    href={city ? `/${sub.slug}/${city.slug}` : region ? `/${sub.slug}/${region.slug}` : `/${sub.slug}`}
                                    className={`lugg-sub-item ${isActive ? "active-sub" : ""}`}
                                  >
                                    <span>{sub.name} {city ? `i ${city.name}` : regionPhrase}</span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            </div>

            {/* Proximity Cities: Lugg-style layout */}
            <div className="pt-16 sm:pt-24 mt-8 sm:mt-12 border-t border-stone-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Title & Description */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <h4 className="font-display font-extrabold text-[#192251] text-[36px] sm:text-[40px] lg:text-[44px] leading-[1.15] tracking-tight">
                  {city 
                    ? `Få ${serviceName} i disse nærliggende byer`
                    : region 
                      ? `Byer med ${serviceName} ${regionPhrase}`
                      : "Dækning fordelt på regioner"}
                </h4>
                <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
                  {city 
                    ? `Professionel og hurtig rengøringshjælp i og omkring ${city.name}.`
                    : region 
                      ? `Find lokale og CVR registrerede rengøringsfirmaer ${regionPhrase}.`
                      : "Vi dækker hele landet med dygtige og lokalkendte servicepartnere."}
                </p>
              </div>

              {/* Right Column: starts at col 7, occupying the right half */}
              <div className="lg:col-span-6 lg:col-start-7">
                {city || region ? (
                  <>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {(showAllCities ? getRelatedCities() : getRelatedCities().slice(0, 18)).map((c) => (
                        <a 
                          key={c.slug} 
                          href={`/${service.slug}/${c.slug}`}
                          className="flex items-center gap-2.5 text-[15px] font-semibold text-slate-800 hover:text-[#3B7965] transition-colors group"
                        >
                          <MapPin size={16} className="text-[#3B7965]/70 group-hover:text-[#3B7965] transition-colors shrink-0" />
                          <span>{c.name}</span>
                        </a>
                      ))}
                    </div>

                    {getRelatedCities().length > 18 && (
                      <button
                        type="button"
                        onClick={() => setShowAllCities(!showAllCities)}
                        className="mt-6 inline-flex items-center gap-1.5 cursor-pointer text-sm font-bold text-[#3B7965] hover:text-[#2d5d4e] select-none hover:underline"
                      >
                        {showAllCities ? (
                          <>
                            <span>Vis færre byer</span>
                            <ChevronDown size={14} className="rotate-180" />
                          </>
                        ) : (
                          <>
                            <span>Vis alle byer vi dækker</span>
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {getOtherRegions().map((r) => (
                      <a 
                        key={r.slug} 
                        href={`/${service.slug}/${r.slug}`}
                        className="flex items-center gap-2.5 text-[15px] font-semibold text-slate-800 hover:text-[#3B7965] transition-colors group"
                      >
                        <MapPin size={16} className="text-[#3B7965]/70 group-hover:text-[#3B7965] transition-colors shrink-0" />
                        <span>{r.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
 
          </div>
 
          {/* Collapsible Andre Regioner crosslinks shown only on Region-level pages */}
          {region && (
            <div className="mt-12 pt-12">
              <h4 className="font-display font-extrabold text-[#192251] text-md mb-6">
                Andre regioner i Danmark
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {getOtherRegions().map((r) => (
                  <a 
                    key={r.slug} 
                    href={`/${service.slug}/${r.slug}`}
                    className="text-sm font-semibold text-zinc-400 hover:text-[#3B7965] transition-colors border-b border-transparent hover:border-[#3B7965]"
                  >
                    {service.name} i {r.name}
                  </a>
                ))}
              </div>
            </div>
          )}
 
        </div>
      </section>
    </>
  );
}
