import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { siteConfig } from "@/lib/siteConfig";

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black px-3 py-1.5 text-white shadow-xs transition-colors hover:bg-zinc-900"
    >
      <svg
        className="h-5.5 w-5.5 text-white"
        viewBox="0 0 384 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.3-76.5-19.3-36.9 0-77.8 23.7-96.6 57-39.6 69.6-10.2 172.7 27.6 226.7 18.6 26.9 40.6 56.7 69.6 55.6 27.9-1.1 38.4-18.2 72.2-18.2 33.6 0 43.1 18.2 72.2 17.6 29.6-.5 49-26.9 67.3-53.7 21.2-30.8 29.7-60.8 30.2-62.3-.6-.3-57.4-22-57.8-87.1zM302.2 120c15.2-18.6 25.8-44.1 22.5-70.1-23.7 1-52.7 15.6-69.7 35.5-14.8 17.1-27.7 42.6-24.1 68 26.2 2 53.7-14.8 71.3-33.4z" />
      </svg>
      <span className="-mt-0.5 flex flex-col justify-center text-left">
        <span className="text-[8px] font-medium leading-tight opacity-80">
          Hent i
        </span>
        <span className="-mt-0.5 text-[13px] font-semibold leading-none tracking-tight">
          App Store
        </span>
      </span>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black px-3 py-1.5 text-white shadow-xs transition-colors hover:bg-zinc-900"
    >
      <svg
        className="h-5.5 w-5.5"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path
          fill="#2196f3"
          d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
        />
        <path
          fill="#4caf50"
          d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
        />
        <path
          fill="#ffeb3b"
          d="M425.2 225.6l-58 33.3-60.1-60.1 60.1-60.1 58 33.3c13 7.5 21.7 19.9 21.7 33.6s-8.7 26.1-21.7 33.1z"
        />
        <path
          fill="#f44336"
          d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z"
        />
      </svg>
      <span className="-mt-0.5 flex flex-col justify-center text-left">
        <span className="text-[8px] font-medium leading-tight opacity-80">
          NU PÅ
        </span>
        <span className="mt-0.5 text-[13px] font-semibold leading-none tracking-tight">
          Google Play
        </span>
      </span>
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="h-4 w-4 fill-current"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-2.8 0-5 2.2-5 5v2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="h-4 w-4 fill-current"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-zinc-200/80 bg-[#fafafa] pb-8 pt-16 text-zinc-650">
      <div className="mx-auto max-w-[1300px] border-b border-zinc-200/80 px-6 pb-8">
        <div className="flex items-center justify-between">
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            width={120}
            height={30}
            className="rounded-lg"
          />
          <div className="flex items-center gap-2">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1300px] grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-3 md:grid-cols-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Hjælp & Support
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-600">
            <Link
              href="/faq/"
              className="transition-colors hover:text-[#3B7965]"
            >
              Ofte stillede spørgsmål
            </Link>
            <Link
              href="/kontakt/"
              className="transition-colors hover:text-[#3B7965]"
            >
              Kontakt os
            </Link>
            <Link
              href="/bliv-zenmester/"
              className="transition-colors hover:text-[#3B7965]"
            >
              Bliv Zenmester
            </Link>
            <Link
              href="/#daekning"
              className="font-bold text-[#3B7965] transition-colors hover:text-[#3B7965]"
            >
              Se dækningskort
            </Link>
            <Link
              href="/om-os/"
              className="transition-colors hover:text-[#3B7965]"
            >
              Hvem er {siteConfig.name}?
            </Link>
{siteConfig.links.companySignup && (
            <a
              href={siteConfig.links.companySignup}
              className="mt-1.5 inline-block w-fit rounded-full border border-zinc-300 bg-white px-4 py-2 text-center text-xs font-bold text-[#3B7965] shadow-xs transition-all duration-200 hover:border-[#3B7965] hover:bg-zinc-50"
            >
              Tilmeld firma
            </a>
          )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Privat rengøring
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-600">
            <Link href="/privat-rengoring/" className="hover:text-[#3B7965]">
              Fast rengøringshjælp
            </Link>
            <Link href="/flytterengoring/" className="hover:text-[#3B7965]">
              Flytterengøring
            </Link>
            <Link href="/hovedrengoring/" className="hover:text-[#3B7965]">
              Hovedrengøring
            </Link>
            <Link href="/airbnb-rengoring/" className="hover:text-[#3B7965]">
              Airbnb rengøring
            </Link>
            <Link href="/engangsrengoring/" className="hover:text-[#3B7965]">
              Engangsrengøring
            </Link>
            <Link href="/vinduespudsning/" className="hover:text-[#3B7965]">
              Vinduespudsning
            </Link>
            <Link href="/havearbejde/" className="hover:text-[#3B7965]">
              Havearbejde
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Erhvervsrengøring
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-600">
            <Link href="/erhvervsrengoring/" className="hover:text-[#3B7965]">
              Erhvervsrengøring
            </Link>
            <Link href="/kontorrengoring/" className="hover:text-[#3B7965]">
              Kontorrengøring
            </Link>
            <Link href="/boligforeninger/" className="hover:text-[#3B7965]">
              Boligforeninger
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Boligservice
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-600">
            <Link href="/boligservice/" className="hover:text-[#3B7965]">
              Boligservice
            </Link>
            <Link href="/malerarbejde/" className="hover:text-[#3B7965]">
              Malerarbejde
            </Link>
            <Link href="/montering-og-ophaengning/" className="hover:text-[#3B7965]">
              Montering & ophængning
            </Link>
            <Link href="/flytning-og-flyttehjaelp/" className="hover:text-[#3B7965]">
              Flytning & flyttehjælp
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Udeareal & Have
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-600">
            <Link href="/fliserens/" className="hover:text-[#3B7965]">
              Fliserens & algerens
            </Link>
            <Link href="/tagrenderens/" className="hover:text-[#3B7965]">
              Tagrenderens
            </Link>
            <Link href="/havearbejde/" className="hover:text-[#3B7965]">
              Havearbejde
            </Link>
            <Link href="/ferieservice-til-haven/" className="hover:text-[#3B7965]">
              Ferieservice til haven
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-zinc-200/80" />

      <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-6 px-6 py-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-550 transition-all duration-200 hover:border-[#3B7965] hover:text-[#3B7965]"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </a>
          {siteConfig.social.instagram && (
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-550 transition-all duration-200 hover:border-[#3B7965] hover:text-[#3B7965]"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-550">
          Uvildig sammenligningstjeneste
        </p>
      </div>

      <div className="w-full border-t border-zinc-200/80" />

      <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-4 px-6 py-6 text-[11px] font-semibold text-zinc-400 md:flex-row">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-end">
          <Link
            href="/handelsbetingelser/"
            className="transition-colors hover:text-zinc-650"
          >
            Handelsbetingelser
          </Link>
          <Link
            href="/persondatapolitik/"
            className="transition-colors hover:text-zinc-650"
          >
            Persondatapolitik
          </Link>
          <Link
            href="/cookiepolitik/"
            className="transition-colors hover:text-zinc-650"
          >
            Cookiepolitik
          </Link>
          <CookieSettingsButton className="transition-colors hover:text-zinc-650" />
        </div>
      </div>
    </footer>
  );
}
