"use client";

import Link from "next/link";
import { useState, type FocusEvent } from "react";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import {
  boligserviceHubIntro,
  boligserviceMegaMenuItems,
} from "@/components/boligservice/boligserviceContent";
import { INTRO_CLEANING_FROM_KR, ZEN_CREDIT_ANNUAL_KR } from "@/data/pricing";
import styles from "./RenzenEditorial.module.css";
import { siteConfig } from "@/lib/siteConfig";

export type MenuId = "cleaning" | "garden" | "boligservice" | "business" | "about";

type MenuItem = {
  label: string;
  href: string;
  description: string;
};

type MenuSection = {
  id: MenuId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  overviewLabel: string;
  overviewHref: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    id: "cleaning",
    label: "Rengøring",
    eyebrow: "Hjemmeservice",
    title: "Alt til dit hjem",
    description:
      "Fast hjælp, grundige enkeltbesøg og specialrengøring udført af kvalitetssikrede Zenmestre.",
    overviewLabel: "Se al rengøring",
    overviewHref: "/rengoring",
    items: [
      {
        label: "Privatrengøring",
        href: "/privat-rengoring",
        description: "En fast hånd til den løbende rengøring.",
      },
      {
        label: "Airbnb rengøring",
        href: "/airbnb-rengoring",
        description: "Klargøring mellem gæster — hurtigt og driftssikkert.",
      },
      {
        label: "Flytterengøring",
        href: "/flytterengoring",
        description: "En grundig afslutning, når boligen skifter hænder.",
      },
      {
        label: "Hovedrengøring",
        href: "/hovedrengoring",
        description: "Ekstra grundigt fra paneler til svært tilgængelige steder.",
      },
      {
        label: "Vinduespudsning",
        href: "/vinduespudsning",
        description: "Klare ruder og et lysere hjem, inde og ude.",
      },
    ],
  },
  {
    id: "garden",
    label: "Haveservice",
    eyebrow: "Udendørs hjælp",
    title: "Alt til din have",
    description:
      "Praktisk hjælp, der holder haven velplejet gennem sæsonerne og giver dig tiden tilbage.",
    overviewLabel: "Se al haveservice",
    overviewHref: "/havearbejde",
    items: [
      {
        label: "Havearbejde",
        href: "/havearbejde",
        description: "Løbende pleje, beskæring og almindeligt havearbejde.",
      },
      {
        label: "Forårs- og efterårsklargøring",
        href: "/foraars-og-efteraarsklargoering",
        description: "Gør haven klar til den kommende sæson.",
      },
      {
        label: "Ferieservice til haven",
        href: "/ferieservice-til-haven",
        description: "Pasning og tilsyn, mens du er væk.",
      },
    ],
  },
  {
    id: "boligservice",
    label: "Boligservice",
    eyebrow: boligserviceHubIntro.eyebrow,
    title: boligserviceHubIntro.title,
    description: boligserviceHubIntro.description,
    overviewLabel: "Se al boligservice",
    overviewHref: "/boligservice",
    items: boligserviceMegaMenuItems.map((item) => ({
      label: item.label,
      href: `/${item.slug}`,
      description: item.description,
    })),
  },
  {
    id: "business",
    label: "Erhverv",
    eyebrow: "Til virksomheder",
    title: "Alt til din virksomhed",
    description:
      "Stabile serviceaftaler med tydeligt ansvar, faste standarder og én samlet kontakt.",
    overviewLabel: "Se erhvervsløsninger",
    overviewHref: "/erhvervsrengoring",
    items: [
      {
        label: "Kontorrengøring",
        href: "/kontorrengoring",
        description: "En ren og indbydende arbejdsplads, uge efter uge.",
      },
      {
        label: "Boligforeninger",
        href: "/boligforeninger",
        description: "Rengøring og service af fællesarealer.",
      },
      {
        label: "Flyttesyn",
        href: "/flyttesyn",
        description:
          "Dokumenteret gennemgang ved ind- og udflytning, klar til jeres sagsmappe.",
      },
      {
        label: "Rengøring som personalegode",
        href: "/personalegode",
        description: "Giv medarbejderne mere overskud i hverdagen.",
      },
    ],
  },
  {
    id: "about",
    label: "Om Renzen",
    eyebrow: "Mennesker og kvalitet",
    title: "Lær Renzen at kende",
    description:
      "Mød tankerne, menneskene og standarderne bag en mere enkel serviceoplevelse.",
    overviewLabel: "Om Renzen",
    overviewHref: "/om-os",
    items: [
      {
        label: "Kontakt os",
        href: "/kontakt",
        description: "Få hjælp til booking, service eller din aftale.",
      },
      {
        label: "Bliv Zenmester",
        href: "/bliv-zenmester",
        description: "Se mulighederne for at arbejde sammen med os.",
      },
      {
        label: "Ofte stillede spørgsmål",
        href: "/faq",
        description: "Korte svar på det vigtigste før din booking.",
      },
      {
        label: "Artikler",
        href: "/artikler",
        description: "Guides og inspiration til rengøring og hverdagsliv.",
      },
    ],
  },
];

type EditorialDesktopNavigationProps = {
  activeMenu: MenuId | null;
  setActiveMenu: (menu: MenuId | null) => void;
  menuInstanceId: string;
  showMegaMenuPanel?: boolean;
};

export function EditorialDesktopNavigation({
  activeMenu,
  setActiveMenu,
  menuInstanceId,
  showMegaMenuPanel = false,
}: EditorialDesktopNavigationProps) {
  const activeSection = menuSections.find((section) => section.id === activeMenu);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActiveMenu(null);
    }
  };

  return (
    <div
      className="flex items-center gap-7"
      onMouseLeave={() => setActiveMenu(null)}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setActiveMenu(null);
        }
      }}
    >
      {menuSections.map((section) => {
        const isActive = activeMenu === section.id;

        return (
          <button
            key={section.id}
            type="button"
            aria-expanded={isActive}
            aria-controls={`${menuInstanceId}-editorial-menu-${section.id}`}
            onMouseEnter={() => setActiveMenu(section.id)}
            onFocus={() => setActiveMenu(section.id)}
            onClick={() => setActiveMenu(isActive ? null : section.id)}
            className={`group flex h-[74px] cursor-pointer items-center gap-1.5 border-b-2 pt-0.5 text-[14px] font-semibold transition-colors ${
              isActive
                ? "border-[#173c2c] text-[#173c2c]"
                : "border-transparent text-[#4e5b54] hover:text-[#173c2c]"
            }`}
          >
            {section.label}
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={`transition-transform duration-200 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          </button>
        );
      })}

      <a
        href={`tel:+45${siteConfig.phone.replace(/\s/g, "")}`}
        className="inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-[#536159] transition-colors hover:text-[#173c2c]"
      >
        <Phone size={15} />
        {siteConfig.phone}
      </a>

      {showMegaMenuPanel && activeSection && (
        <div
          id={`${menuInstanceId}-editorial-menu-${activeSection.id}`}
          className={`${styles.megaMenu} ${
            activeSection.id === "cleaning" ? styles.megaMenuCleaning : ""
          } ${activeSection.id === "garden" ? styles.megaMenuGarden : ""} ${
            activeSection.id === "boligservice" ? styles.megaMenuBoligservice : ""
          } ${
            activeSection.id === "business" ? styles.megaMenuBusiness : ""
          } ${activeSection.id === "about" ? styles.megaMenuAbout : ""}`}
        >
          <div className="relative mx-auto grid max-w-[1380px] grid-cols-[minmax(290px,0.72fr)_1.6fr]">
            <div className={`relative z-10 ${styles.megaMenuIntro}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#52665b]">
                {activeSection.eyebrow}
              </p>
              <p className="mt-4 max-w-sm font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-[#173c2c]">
                {activeSection.title}
              </p>
              <p className="mt-5 max-w-sm text-[14px] leading-6 text-[#536159]">
                {activeSection.description}
              </p>
              <Link
                href={activeSection.overviewHref}
                onClick={() => setActiveMenu(null)}
                className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-[#173c2c]"
              >
                {activeSection.overviewLabel}
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="relative z-10 grid grid-cols-2 content-start px-10 py-8 xl:grid-cols-3 xl:px-14">
              {activeSection.items.map((item) => (
                <Link
                  key={`${activeSection.id}-${item.label}`}
                  href={item.href}
                  onClick={() => setActiveMenu(null)}
                  className={styles.megaMenuLink}
                >
                  <span className="mt-5 flex items-start justify-between gap-4">
                    <span>
                      <span className="block font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#203129]">
                        {item.label}
                      </span>
                      <span className="mt-2 block max-w-[260px] text-[13px] leading-5 text-[#69746e]">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-[#597064]"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function EditorialMobileNavigation({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<MenuId | null>(
    "cleaning",
  );

  return (
    <>
      {menuSections.map((section) => {
        const isExpanded = expandedSection === section.id;

        return (
          <div key={section.id} className="border-b border-[#e2e4de]">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() =>
                setExpandedSection(isExpanded ? null : section.id)
              }
              className="flex w-full items-center justify-between py-4 text-left font-display text-xl font-semibold text-[#203129]"
            >
              {section.label}
              <ChevronDown
                size={19}
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="mb-5 border-l-2 border-[#9fb29f] pl-4">
                <Link
                  href={section.overviewHref}
                  onClick={onNavigate}
                  className="block pb-3 text-sm font-bold text-[#173c2c]"
                >
                  {section.title}
                </Link>
                {section.items.map((item) => (
                  <Link
                    key={`${section.id}-mobile-${item.label}`}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#536159]"
                  >
                    {item.label}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="border-b border-[#e2e4de] py-4">
        <Link
          href="/klub/"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center rounded-[4px] border border-[#173c2c] px-5 text-[15px] font-bold text-[#173c2c] transition-colors hover:bg-[#173c2c] hover:text-white"
        >
          Renzen Klub
        </Link>
        <div className="mt-5 rounded-[10px] border border-[#c5d3c4] bg-[#dfe9dc] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#52665b]">
            Renzen Klub
          </p>
          <ul className="mt-3 space-y-2 text-[14px] font-semibold leading-5 text-[#203129]">
            <li>{ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. i Zen-kreditter</li>
            <li>20% rabat på fast rengøring</li>
            <li>Intropris fra {INTRO_CLEANING_FROM_KR} kr.</li>
          </ul>
          <Link
            href="/klub/"
            onClick={onNavigate}
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#173c2c]"
          >
            Se alle fordele
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/klub/"
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#536159]"
          >
            Book intro fra {INTRO_CLEANING_FROM_KR} kr.
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
