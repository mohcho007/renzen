"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  User,
} from "lucide-react";
import { CleanDivideHamburger } from "@/components/site/CleanDivideHamburger";
import { ServiceNavIcon } from "@/components/site/ServiceNavIcon";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

const services = [
  {
    label: "Privatrengøring",
    icon: "privateCleaning",
    colorClass: "bg-[#e6fbf3] text-[#2d5e4d]",
    hoverBgClass: "hover:bg-[#e6fbf3]",
    hoverTextClass: "group-hover:text-[#2d5e4d]",
    href: "/privat-rengoring/",
  },
  {
    label: "Erhvervsrengøring",
    icon: "commercialCleaning",
    colorClass: "bg-blue-50 text-blue-600",
    hoverBgClass: "hover:bg-blue-50",
    hoverTextClass: "group-hover:text-blue-700",
    href: "/erhvervsrengoring/",
  },
  {
    label: "Flytterengøring",
    icon: "movingCleaning",
    colorClass: "bg-purple-50 text-purple-600",
    hoverBgClass: "hover:bg-purple-50",
    hoverTextClass: "group-hover:text-purple-700",
    href: "/flytterengoring/",
  },
  {
    label: "Hovedrengøring",
    icon: "deepCleaning",
    colorClass: "bg-amber-50 text-amber-600",
    hoverBgClass: "hover:bg-amber-50",
    hoverTextClass: "group-hover:text-amber-700",
    href: "/hovedrengoring/",
  },
  {
    label: "Airbnb rengøring",
    icon: "airbnbCleaning",
    colorClass: "bg-rose-50 text-rose-600",
    hoverBgClass: "hover:bg-rose-50",
    hoverTextClass: "group-hover:text-rose-700",
    href: "/airbnb-rengoring/",
  },
  {
    label: "Kontorrengøring",
    icon: "officeCleaning",
    colorClass: "bg-cyan-50 text-cyan-600",
    hoverBgClass: "hover:bg-cyan-50",
    hoverTextClass: "group-hover:text-cyan-700",
    href: "/kontorrengoring/",
  },
  {
    label: "Trapperengøring",
    icon: "stairCleaning",
    colorClass: "bg-indigo-50 text-indigo-600",
    hoverBgClass: "hover:bg-indigo-50",
    hoverTextClass: "group-hover:text-indigo-700",
    href: "/boligforeninger/",
  },
  {
    label: "Vinduespudsning",
    icon: "windowCleaning",
    colorClass: "bg-sky-50 text-sky-600",
    hoverBgClass: "hover:bg-sky-50",
    hoverTextClass: "group-hover:text-sky-700",
    href: "/vinduespudsning",
  },
  {
    label: "Algerens & Fliserens",
    icon: "tileCleaning",
    colorClass: "bg-emerald-50 text-emerald-600",
    hoverBgClass: "hover:bg-emerald-50",
    hoverTextClass: "group-hover:text-emerald-700",
    href: "/fliserens/",
  },
  {
    label: "Byggerengøring",
    icon: "constructionCleaning",
    colorClass: "bg-orange-50 text-orange-600",
    hoverBgClass: "hover:bg-orange-50",
    hoverTextClass: "group-hover:text-orange-700",
    href: "/boligservice/",
  },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setDesktopServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-shadow">
      <div className="relative z-50 flex h-16 w-full items-center justify-between bg-white px-6 min-[1100px]:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-150 hover:bg-stone-50"
          aria-label={`${siteConfig.name} forside`}
        >
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            width={120}
            height={30}
            className="rounded-lg"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 min-[1100px]:flex">
          <nav
            className="flex items-center gap-2"
            aria-label="Primær navigation"
          >
            <div
              className="relative"
              ref={desktopMenuRef}
              onMouseEnter={() => setDesktopServicesOpen(true)}
              onMouseLeave={() => setDesktopServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDesktopServicesOpen((open) => !open)}
                aria-expanded={desktopServicesOpen}
                aria-controls="desktop-services-menu"
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-[15px] font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-brand-green ${
                  desktopServicesOpen
                    ? "bg-zinc-100 font-extrabold text-[#3b7965]"
                    : ""
                }`}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    desktopServicesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {desktopServicesOpen && (
                <>
                  <div
                    className="absolute left-0 top-full h-2 w-full"
                    aria-hidden="true"
                  />
                  <div
                    id="desktop-services-menu"
                    className="absolute left-[-120px] top-[calc(100%+8px)] z-50 grid w-[530px] grid-cols-2 gap-x-4 gap-y-1 rounded-[24px] border border-stone-200/80 bg-white p-5 shadow-2xl"
                  >
                    <div className="absolute -top-2 left-[158px] z-0 h-4 w-4 rotate-45 border-l border-t border-stone-200/80 bg-white" />
                    {services.map(
                      ({
                        label,
                        icon,
                        colorClass,
                        hoverBgClass,
                        hoverTextClass,
                        href,
                      }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setDesktopServicesOpen(false)}
                          className={`group z-10 flex items-center gap-2.5 rounded-xl p-2 transition-all duration-150 ${hoverBgClass}`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-out group-hover:scale-105 ${colorClass}`}
                          >
                            <ServiceNavIcon name={icon} />
                          </span>
                          <span
                            className={`text-[13.5px] font-semibold text-slate-700 transition-colors ${hoverTextClass}`}
                          >
                            {label}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/#sadan-virker-det"
              className="rounded-lg px-4 py-2 text-[15px] font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-brand-green"
            >
              Sådan virker det
            </Link>
            <Link
              href="/#faq"
              className="rounded-lg px-4 py-2 text-[15px] font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-brand-green"
            >
              FAQ
            </Link>
            {siteConfig.links.companySignup && (
            <a
              href={siteConfig.links.companySignup}
              onClick={() =>
                track({
                  name: "cta_click",
                  source: "header",
                  destination: "company_signup",
                })
              }
              className="rounded-lg px-4 py-2 text-[15px] font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-brand-green"
            >
              For rengøringsfirmaer
            </a>
          )}
          </nav>

          <div className="flex items-center gap-2">
            {siteConfig.links.login && (
            <a
              href={siteConfig.links.login}
              onClick={() =>
                track({
                  name: "cta_click",
                  source: "header",
                  destination: "login",
                })
              }
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[15px] font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-brand-green"
            >
              <User size={18} aria-hidden="true" />
              Log ind
            </a>
          )}
            <a
              href={siteConfig.links.quote}
              onClick={() =>
                track({
                  name: "cta_click",
                  source: "header",
                  destination: "quote",
                })
              }
              className="rounded-full bg-primary px-6 py-2.5 font-display text-[15px] font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-emerald-800 hover:shadow-lg active:scale-[0.98]"
            >
              Få gratis tilbud
            </a>
          </div>
        </div>

        <div className="z-50 min-[1100px]:hidden">
          <CleanDivideHamburger
            toggled={mobileOpen}
            toggle={setMobileOpen}
            label={mobileOpen ? "Luk menu" : "Åbn menu"}
          />
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between overflow-y-auto border-t border-stone-100 bg-white p-6 transition-transform duration-100 ease-in-out min-[1100px]:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav
          className="flex min-h-full w-full flex-col justify-between"
          aria-label="Mobil navigation"
        >
          <div className="flex flex-grow flex-col divide-y divide-stone-100 py-2 font-display text-[19px] font-extrabold tracking-tight text-slate-800">
            <Link
              href="/#sadan-virker-det"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-4 transition-colors hover:text-[#3B7965]"
            >
              Sådan virker det
            </Link>

            <div className="flex flex-col py-2">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((open) => !open)}
                className="flex w-full items-center justify-between py-2 text-left font-display text-[19px] font-extrabold transition-colors hover:text-[#3B7965]"
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-menu"
              >
                Services
                <ChevronDown
                  size={20}
                  className={`text-slate-500 transition-transform duration-200 ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id="mobile-services-menu"
                className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileServicesOpen
                    ? "max-h-[800px] py-2 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                {services.map(
                  ({
                    label,
                    icon,
                    colorClass,
                    hoverBgClass,
                    hoverTextClass,
                    href,
                  }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileServicesOpen(false);
                      }}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-150 ${hoverBgClass}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                      >
                        <ServiceNavIcon name={icon} />
                      </span>
                      <span
                        className={`text-[14.5px] font-semibold text-slate-700 transition-colors ${hoverTextClass}`}
                      >
                        {label}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>

            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-4 transition-colors hover:text-[#3B7965]"
            >
              FAQ
            </Link>
            {siteConfig.links.companySignup && (
            <a
              href={siteConfig.links.companySignup}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-4 transition-colors hover:text-[#3B7965]"
            >
              For rengøringsfirmaer
            </a>
          )}
          </div>

          <div className="relative my-4 flex min-h-[160px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100/40 bg-[#e6fbf3] p-5">
            <div className="relative z-10 flex max-w-[65%] flex-col gap-1">
              <h2 className="font-display text-[17px] font-black leading-tight text-brand-blue">
                Få tilbud på rengøring på under 2 minutter
              </h2>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-zinc-600">
                Modtag uforpligtende priser fra lokale, godkendte firmaer.
              </p>
              <a
                href={siteConfig.links.quote}
                onClick={() => setMobileOpen(false)}
                className="mt-3 w-fit rounded-lg bg-stone-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs transition-colors hover:bg-stone-800"
              >
                Få tilbud nu
              </a>
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[110px] w-[110px]">
              <Image
                src="/servicefradrag_3d.png"
                alt=""
                fill
                sizes="110px"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 border-t border-stone-100 pt-4">
            {siteConfig.links.login && (
            <a
              href={siteConfig.links.login}
              onClick={() => setMobileOpen(false)}
              className="flex h-13 w-full items-center justify-center rounded-xl bg-stone-100 font-display text-[15px] font-bold text-slate-800 transition-colors hover:bg-stone-200"
            >
              Log ind
            </a>
          )}
            <a
              href={siteConfig.links.quote}
              onClick={() => setMobileOpen(false)}
              className="flex h-13 w-full items-center justify-center rounded-xl bg-[#3B7965] font-display text-[15px] font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-emerald-800"
            >
              Få gratis tilbud
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
