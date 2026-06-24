'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '../data/services';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/renzen-logo-ny.png"
            alt="Renzen Rengøring Logo"
            width={140}
            height={35}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 lg:flex">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#206d69]">
            Hjem
          </Link>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#206d69] focus:outline-none">
              <span>Vi tilbyder</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {servicesDropdown && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/${service.slug}/`}
                    className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-[#206d69]"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/priser/" className="text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#206d69]">
            Priser
          </Link>
          <Link href="/faq/" className="text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#206d69]">
            FAQ
          </Link>
          <Link href="/kontakt/" className="text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:text-[#206d69]">
            Kontakt
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link
            href="/book-rengoering/"
            className="rounded-lg bg-[#206d69] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#144844] active:scale-95"
          >
            Book rengøring
          </Link>
          <Link
            href="/bliv-zenmester/"
            className="rounded-lg border-2 border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-50 hover:border-[#206d69] hover:text-[#206d69] active:scale-95"
          >
            Bliv Zenmester
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white p-4 lg:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#206d69]"
            >
              Hjem
            </Link>
            
            <div className="flex flex-col space-y-2 pl-3 border-l-2 border-[#206d69]/30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vi tilbyder</span>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/${service.slug}/`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-slate-600 hover:text-[#206d69]"
                >
                  {service.label}
                </Link>
              ))}
            </div>

            <Link
              href="/priser/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#206d69]"
            >
              Priser
            </Link>
            <Link
              href="/faq/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#206d69]"
            >
              FAQ
            </Link>
            <Link
              href="/kontakt/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-[#206d69]"
            >
              Kontakt
            </Link>
            
            <div className="flex flex-col space-y-3 pt-2">
              <Link
                href="/book-rengoering/"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg bg-[#206d69] py-3 text-center text-sm font-bold uppercase tracking-wider text-white hover:bg-[#144844]"
              >
                Book rengøring
              </Link>
              <Link
                href="/bliv-zenmester/"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg border-2 border-slate-200 py-3 text-center text-sm font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
              >
                Bliv Zenmester
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
