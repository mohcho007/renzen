"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import {
  EditorialDesktopNavigation,
  EditorialMobileNavigation,
  type MenuId,
} from "@/components/site/RenzenEditorialNavigation";
import styles from "@/components/site/RenzenEditorial.module.css";
import { siteConfig } from "@/lib/siteConfig";

const navigation = [
  { label: "Privatrengøring", href: "/privat-rengoring" },
  { label: "Flytterengøring", href: "/flytterengoring" },
  { label: "Hovedrengøring", href: "/hovedrengoring" },
  { label: "Vinduespudsning", href: "/vinduespudsning" },
  { label: "Erhvervsrengøring", href: "/erhvervsrengoring" },
];

export function RenzenEditorialHeader() {
  const [open, setOpen] = useState(false);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const menuInstanceId = useId();
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("scroll", closeMenu, { passive: true });
    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const originalHeaderIsOutOfView = currentScrollY > 74;

      if (!originalHeaderIsOutOfView) {
        setShowFloatingHeader(false);
      } else if (open) {
        setShowFloatingHeader(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setShowFloatingHeader(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setShowFloatingHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const renderHeaderContent = (showMegaMenuPanel = false) => (
    <>
      <div className="flex h-[74px] w-full items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-14">
        <Link
          href="/"
          aria-label="Renzen forside"
          className="relative z-10 shrink-0"
        >
          <Image
            src={siteConfig.logo}
            alt="Renzen"
            width={140}
            height={36}
            className="h-8 w-auto lg:h-9"
            priority
          />
        </Link>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <nav className="flex items-center" aria-label="Primær navigation">
            <EditorialDesktopNavigation
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              menuInstanceId={menuInstanceId}
              showMegaMenuPanel={showMegaMenuPanel}
            />
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/klub/"
              className="inline-flex min-h-10 items-center rounded-[4px] border border-[#173c2c] px-4 text-[13px] font-bold text-[#173c2c] transition-colors hover:bg-[#173c2c] hover:text-white"
            >
              Renzen Klub
            </Link>
            <Link
              href="/book-rengoering"
              className="inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-[#173c2c] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#0f2d20]"
            >
              Beregn pris
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="editorial-mobile-menu"
          aria-label={open ? "Luk menu" : "Åbn menu"}
          className="relative z-10 ml-auto flex h-11 w-11 shrink-0 items-center justify-center text-[#173c2c] lg:hidden"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </>
  );

  return (
    <>
      <header className="relative z-[80] border-b border-[#dfe2da] bg-[#fbfaf5]">
        {renderHeaderContent(!showFloatingHeader)}
      </header>

      <header
        aria-hidden={!showFloatingHeader}
        className={`fixed inset-x-0 top-0 z-[80] border-b border-[#dfe2da] bg-[#fbfaf5]/95 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          showFloatingHeader
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        {renderHeaderContent(showFloatingHeader)}
      </header>

      <div
        id="editorial-mobile-menu"
        aria-hidden={!open}
        className={`${styles.mobileMenuOverlay} fixed inset-x-0 top-[74px] bottom-0 flex flex-col border-t border-[#dfe2da] bg-[#fbfaf5] lg:hidden ${
          open
            ? `z-[70] ${styles.mobileMenuOverlayOpen}`
            : `z-30 ${styles.mobileMenuOverlayClosed}`
        }`}
      >
        <nav
          className="flex-1 overflow-y-auto px-5 py-7 sm:px-8"
          aria-label="Mobil navigation"
        >
          <div className="mx-auto flex max-w-[1380px] flex-col">
            <EditorialMobileNavigation onNavigate={() => setOpen(false)} />
            <Link
              href="/book-rengoering"
              onClick={() => setOpen(false)}
              className="mt-6 flex min-h-12 items-center justify-center rounded-[4px] bg-[#173c2c] px-5 text-sm font-bold text-white"
            >
              Beregn din pris
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export function RenzenEditorialFooter() {
  return (
    <footer className="bg-[#202020] text-[#f0ede4]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Image
              src={siteConfig.logo}
              alt="Renzen"
              width={132}
              height={34}
              className="brightness-0 invert"
            />
            <p className="mt-6 max-w-md font-display text-3xl font-medium leading-tight tracking-[-0.03em]">
              Professionel hjælp til et hjem, der føles lettere at være i.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-7 inline-block text-sm font-semibold underline underline-offset-4"
            >
              {siteConfig.email}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Services
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm font-semibold">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Om Renzen
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm font-semibold">
              <Link href="/om-os">Om os</Link>
              <Link href="/kontakt">Kontakt os</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/artikler">Artikler</Link>
              <Link href="/bliv-zenmester">Bliv Zenmester</Link>
              <Link href="/klub/">Renzen Klub</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 pt-7 text-xs font-medium text-white/55 sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/handelsbetingelser">Handelsbetingelser</Link>
            <Link href="/persondatapolitik">Persondatapolitik</Link>
            <Link href="/cookiepolitik">Cookiepolitik</Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
