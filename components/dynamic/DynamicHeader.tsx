"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CleanDivideHamburger } from "@/components/site/CleanDivideHamburger";
import { ServiceNavIcon } from "@/components/site/ServiceNavIcon";
import {
  ChevronDown,
  User,
} from "lucide-react";

// Danish local configuration mapping for starting the wizard
export const NAV_SERVICES = [
  { label: "Privatrengøring", icon: "privateCleaning", colorClass: "bg-[#e6fbf3] text-[#2d5e4d]", hoverBgClass: "hover:bg-[#e6fbf3]", hoverTextClass: "group-hover:text-[#2d5e4d]", href: "/privat-rengoering" },
  { label: "Erhvervsrengøring", icon: "commercialCleaning", colorClass: "bg-blue-50 text-blue-600", hoverBgClass: "hover:bg-blue-50", hoverTextClass: "group-hover:text-blue-700", href: "/erhvervsrengoering" },
  { label: "Flytterengøring", icon: "movingCleaning", colorClass: "bg-purple-50 text-purple-600", hoverBgClass: "hover:bg-purple-50", hoverTextClass: "group-hover:text-purple-700", href: "/flytterengoering" },
  { label: "Hovedrengøring", icon: "deepCleaning", colorClass: "bg-amber-50 text-amber-600", hoverBgClass: "hover:bg-amber-50", hoverTextClass: "group-hover:text-amber-700", href: "/hovedrengoering" },
  { label: "Airbnb rengøring", icon: "airbnbCleaning", colorClass: "bg-rose-50 text-rose-600", hoverBgClass: "hover:bg-rose-50", hoverTextClass: "group-hover:text-rose-700", href: "/airbnb-rengoering" },
  { label: "Kontorrengøring", icon: "officeCleaning", colorClass: "bg-cyan-50 text-cyan-600", hoverBgClass: "hover:bg-cyan-50", hoverTextClass: "group-hover:text-cyan-700", href: "/kontorrengoering" },
  { label: "Trapperengøring", icon: "stairCleaning", colorClass: "bg-indigo-50 text-indigo-600", hoverBgClass: "hover:bg-indigo-50", hoverTextClass: "group-hover:text-indigo-700", href: "/trappevask" },
  { label: "Vinduespudsning", icon: "windowCleaning", colorClass: "bg-sky-50 text-sky-600", hoverBgClass: "hover:bg-sky-50", hoverTextClass: "group-hover:text-sky-700", href: "/vinduespudsning" },
  { label: "Algerens & Fliserens", icon: "tileCleaning", colorClass: "bg-emerald-50 text-emerald-600", hoverBgClass: "hover:bg-emerald-50", hoverTextClass: "group-hover:text-emerald-700", href: "/fliserens-og-algebehandling" },
  { label: "Byggerengøring", icon: "constructionCleaning", colorClass: "bg-orange-50 text-orange-600", hoverBgClass: "hover:bg-orange-50", hoverTextClass: "group-hover:text-orange-700", href: "/byggerengoering" }
] as const;

export function DynamicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  return (
    <header className="bg-white w-full sticky top-0 z-50">
      <div className="w-full px-6 min-[1100px]:px-12 h-16 flex items-center justify-between relative z-50 bg-white">
        <Link href="/" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-50 transition-all duration-150">
        <Image 
          src="https://cdn.renbud.dk/renbud-logo.png"
          alt="Renbud logo - indhent 3 gratis tilbud på professionel rengøring" 
          width={120}
          height={30}
          className="rounded-lg"
          priority
        />
        </Link>

        {/* Right Side Desktop: Navigation & Button */}
        <div className="hidden min-[1100px]:flex items-center gap-6">
          <nav className="flex items-center gap-2">
            {/* Services Dropdown */}
            <div 
              className="relative" 
              ref={servicesDropdownRef}
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button 
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className={`px-4 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-brand-green font-semibold text-[15px] transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isServicesDropdownOpen ? "bg-zinc-100 text-[#3b7965] font-extrabold" : ""
                }`}
              >
                <span>Services</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${isServicesDropdownOpen ? "rotate-180" : ""}`} 
                />
              </button>
              
              {isServicesDropdownOpen && (
                <>
                  <div
                    className="absolute left-0 top-full h-2 w-full"
                    aria-hidden="true"
                  />
                  <div className="absolute top-[calc(100%+8px)] left-[-120px] bg-white border border-stone-200/80 rounded-[24px] shadow-2xl p-5 z-50 w-[530px] grid grid-cols-2 gap-x-4 gap-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Caret pointing up */}
                    <div className="absolute -top-2 left-[158px] w-4 h-4 bg-white border-t border-l border-stone-200/80 rotate-45 z-0" />

                    {NAV_SERVICES.map((s, idx) => {
                      return (
                        <Link
                          key={idx}
                          href={s.href}
                          className={`group flex items-center gap-2.5 p-2 rounded-xl transition-all duration-150 z-10 ${s.hoverBgClass}`}
                          onClick={() => setIsServicesDropdownOpen(false)}
                        >
                          <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-transform duration-300 ease-out group-hover:scale-105 shrink-0 ${s.colorClass}`}>
                            <ServiceNavIcon name={s.icon} />
                          </div>
                          <span className={`font-semibold text-[13.5px] text-slate-700 transition-colors ${s.hoverTextClass}`}>
                            {s.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <Link href="#sadan-virker-det" className="px-4 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-brand-green font-semibold text-[15px] transition-all duration-150">Sådan virker det</Link>
            <Link href="#faq" className="px-4 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-brand-green font-semibold text-[15px] transition-all duration-150">FAQ</Link>
            <a href="https://app.renbud.dk/firma/opret-konto" className="px-4 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-brand-green font-semibold text-[15px] transition-all duration-150">For rengøringsfirmaer</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="https://app.renbud.dk/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-brand-green font-semibold text-[15px] transition-all duration-150">
              <User size={18} />
              <span>Log ind</span>
            </a>
            <a 
              href="https://app.renbud.dk/hent-tilbud" 
              className="bg-primary hover:bg-emerald-800 text-white font-display font-bold px-6 py-2.5 rounded-full text-[15px] transition-all shadow-md hover:shadow-lg scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Få gratis tilbud
            </a>
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="min-[1100px]:hidden z-50">
          <CleanDivideHamburger
            toggled={isMobileMenuOpen} 
            toggle={setIsMobileMenuOpen} 
            label={isMobileMenuOpen ? "Luk menu" : "Åbn menu"}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`fixed top-16 left-0 right-0 bottom-0 z-40 bg-white flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-100 ease-in-out min-[1100px]:hidden border-t border-stone-100 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-between min-h-full w-full">
            {/* Links List */}
            <div className="flex flex-col text-slate-800 font-display font-extrabold text-[19px] tracking-tight divide-y divide-stone-100 flex-grow py-2">
              <Link
                href="#sadan-virker-det" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 hover:text-[#3B7965] transition-colors flex items-center justify-between"
              >
                <span>Sådan virker det</span>
              </Link>
              
              {/* Services Dropdown */}
              <div className="flex flex-col py-2">
                <button 
                  type="button"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="py-2 hover:text-[#3B7965] transition-colors flex items-center justify-between w-full text-left font-display font-extrabold text-[19px]"
                >
                  <span>Services</span>
                  <ChevronDown size={20} className={`text-slate-500 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                </button>
                
                {/* Dropdown menu items */}
                <div className={`mt-2 space-y-1 overflow-hidden transition-all duration-350 ease-in-out ${isMobileServicesOpen ? "max-h-[800px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}`}>
                  {NAV_SERVICES.map((s, idx) => (
                    <Link
                      key={idx}
                      href={s.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileServicesOpen(false);
                      }}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${s.hoverBgClass}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-transform duration-300 ease-out shrink-0 ${s.colorClass}`}>
                        <ServiceNavIcon name={s.icon} />
                      </div>
                      <span className={`font-semibold text-[14.5px] text-slate-700 transition-colors ${s.hoverTextClass}`}>
                        {s.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="#faq" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 hover:text-[#3B7965] transition-colors flex items-center justify-between"
              >
                <span>FAQ</span>
              </Link>
              <a 
                href="https://app.renbud.dk/firma/opret-konto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 hover:text-[#3B7965] transition-colors flex items-center justify-between"
              >
                <span>For rengøringsfirmaer</span>
              </a>
            </div>

            {/* Premium Promo Card */}
            <div className="my-4 bg-[#e6fbf3] border border-emerald-100/40 rounded-2xl p-5 relative overflow-hidden min-h-[160px] flex flex-col justify-between shrink-0">
              <div className="relative z-10 flex flex-col gap-1 max-w-[65%]">
                <h4 className="font-display font-black text-brand-blue text-[17px] leading-tight">
                  Få tilbud på rengøring på under 2 minutter
                </h4>
                <p className="text-[11px] text-zinc-600 font-medium leading-relaxed mt-1">
                  Modtag uforpligtende priser fra lokale, godkendte firmaer.
                </p>
                <a 
                  href="https://app.renbud.dk/hent-tilbud"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-stone-900 hover:bg-stone-850 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg w-fit mt-3 shadow-xs transition-colors uppercase tracking-wider"
                >
                  Få tilbud nu
                </a>
              </div>
              <div className="absolute right-0 bottom-0 w-[110px] h-[110px] pointer-events-none z-0">
                <Image 
                  src="/3d_step1_blue.png" 
                  alt="3D Rengøring illustration" 
                  fill
                  sizes="110px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5 shrink-0">
              <a 
                href="https://app.renbud.dk/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-slate-800 font-display font-bold h-13 rounded-xl text-[15px] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>Log ind</span>
              </a>
              <a 
                href="https://app.renbud.dk/hent-tilbud"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-13 rounded-xl text-[15px] flex items-center justify-center shadow-md transition-colors cursor-pointer uppercase tracking-wider"
              >
                <span>Få gratis tilbud</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
