'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { City } from '../data/cities';
import { Service } from '../data/services';
import Breadcrumbs from './Breadcrumbs';
import FAQSection from './FAQSection';
import ReviewSnippet from './ReviewSnippet';
import SchemaMarkup from './SchemaMarkup';
import LocalAreas from './LocalAreas';
import PriceCalculator from './PriceCalculator';
import { 
  generateServiceSchema, 
  generateFAQSchema, 
  generateBreadcrumbSchema, 
  generateWebPageSchema 
} from '../lib/schema';
import { getAbsoluteUrl, getServiceUrl, getServiceCityUrl, getServiceLocationUrl } from '../lib/urls';

interface CityPageTemplateProps {
  service: Service;
  city: City;
}

export default function CityPageTemplate({ service, city }: CityPageTemplateProps) {
  const pagePath = getServiceCityUrl(service.slug, city.slug);
  const absoluteUrl = getAbsoluteUrl(pagePath);
  
  // typical home size calculations for the local details card
  const typicalSize = city.typicalHomeSize || 70;

  const combinedFAQs = [
    ...(city.faq || []),
    {
      question: `Dækker Renzen hele ${city.name}?`,
      answer: `Ja, vi tilbyder ${service.label.toLowerCase()} i hele ${city.name} Kommune samt nærliggende byer som ${city.nearbyAreas.join(', ')}.`
    },
    {
      question: `Hvordan booker jeg ${service.label.toLowerCase()} i ${city.name}?`,
      answer: `Det er nemt! Du kan beregne din pris i vores online beregner og klikke dig videre til vores bookingformular. Du vælger selv dato og tidspunkt.`
    }
  ];

  // Compile JSON-LD schemas
  const breadcrumbItems = [
    { name: service.label, url: getAbsoluteUrl(getServiceUrl(service.slug)) },
    { name: `${service.label} i ${city.name}`, url: absoluteUrl }
  ];
  const webPageSchema = generateWebPageSchema(`${service.label} i ${city.name} | Renzen.dk`, service.description, absoluteUrl);
  const serviceSchema = generateServiceSchema(service.label, service.description, absoluteUrl, city.name);
  const faqSchema = generateFAQSchema(combinedFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // ----------------------------------------------------
  // LAYOUT 1: PRIVAT RENGØRING (LOCAL CITY PAGE)
  // ----------------------------------------------------
  if (service.slug === 'privat-rengoring') {
    return (
      <>
        <SchemaMarkup schema={[webPageSchema, serviceSchema, faqSchema, breadcrumbSchema]} />

        <main className="min-h-screen text-slate-800 bg-white">
          {/* Breadcrumb container */}
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
            <Breadcrumbs items={[
              { label: service.label, url: getServiceUrl(service.slug) },
              { label: city.name }
            ]} />
          </div>

          {/* Hero */}
          <section className="relative overflow-hidden bg-[#1c504d] px-4 py-16 md:px-8 md:py-24 text-white">
            <div className="absolute inset-0 z-0 opacity-15">
              <Image src="/zenmester-gor-rent-rundt.jpg" alt="Rengøring" fill className="object-cover" priority />
            </div>
            
            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                <div id="calculator" className="lg:col-span-5 order-2 lg:order-1 scroll-mt-24">
                  <div className="mb-4 hidden lg:block">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300 mb-2">
                      Lokalt i {city.name} • Fast Zenmester
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight font-heading">
                      Privat rengøring i {city.name}
                    </h1>
                    <p className="mt-4 text-[#e0efed] text-sm leading-relaxed">
                      {city.localIntro}
                    </p>
                    {city.parkingNote && (
                      <p className="mt-2 text-xs italic text-emerald-200">
                        * Bemærk: {city.parkingNote}
                      </p>
                    )}
                  </div>

                  <PriceCalculator initialSqm={typicalSize} title={`Privat rengøring i ${city.name}`} showIntroText={false} serviceSlug="privat-rengoring" />
                  
                  {/* Under card badges */}
                  <div className="mt-6 flex flex-wrap justify-between text-xs font-bold text-emerald-100/90 gap-2 px-2">
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Godkendte rengøringsassistenter</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Tilfredshedsgaranti</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Fleksibel booking</span>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                  <div className="lg:hidden">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                      Lokalt i {city.name} • Fast Zenmester
                    </span>
                    <h1 className="text-3.5xl font-extrabold tracking-tight leading-tight font-heading">
                      Privat rengøring i {city.name}
                    </h1>
                    <p className="mt-3 text-[#e0efed] text-sm leading-relaxed">
                      {city.localIntro}
                    </p>
                    {city.parkingNote && (
                      <p className="mt-2 text-xs italic text-emerald-250">
                        * Bemærk: {city.parkingNote}
                      </p>
                    )}
                  </div>

                  {/* Right side graphic */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-950/20 max-w-2xl bg-emerald-950/20 aspect-video">
                    <Image src="/zenmester-gor-rent-rundt.jpg" alt="Zenmester" fill className="object-cover" />
                    
                    {/* Floating Customer Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3.5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-slate-800">
                      <Image
                        src="/kunde-ansigter.png"
                        alt="Tilfredse kunder"
                        width={60}
                        height={20}
                        className="h-5 w-auto object-contain rounded-md"
                      />
                      <span className="text-[11px] font-black tracking-tight text-slate-800">Valgt af 300+ kunder</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SÅDAN BOOKER DU */}
          <section className="py-20 px-4 md:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Rengøring i {city.name}</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Sådan booker du privat rengøring i {city.name}
                </h2>
              </div>

              {/* Steps */}
              <div className="relative max-w-5xl mx-auto">
                <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#206d69]/30 z-0" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">1</div>
                    <h3 className="text-base font-bold text-slate-800">Se din pris</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Brug vores rengørings prisberegner til at få et præcist tilbud på din rengøring. Vi tilbyder rabatter på ugentlige, 14-dages og månedlige ydelser.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">2</div>
                    <h3 className="text-base font-bold text-slate-800">Book rengøring</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Vi matcher dit hjem med en af vores dygtige zenmestre i {city.name}. Vi sender den samme zenmester hver gang, og sørger for der bliver grundigt rengjort.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">3</div>
                    <h3 className="text-base font-bold text-slate-800">Nyd dit hjem</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Vi forstår vigtigheden af at have et rent og velorganiseret hjem, der inviterer ro og afslapning indenfor. Vores zenmestre er ikke kun eksperter i rengøring; de skaber rum, der fremmer din trivsel og glæde.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  BOOK PRIVAT RENGØRING
                </a>
              </div>
            </div>
          </section>

          {/* PRIVAT RENGØRING UDFØRT AF EN ÆGTE ZENMESTER */}
          <section className="py-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Det får du med Renzen</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Privat rengøring udført af en ægte Zenmester
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                
                {/* 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Stuer & opholdsrum</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe alle gulve</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glass pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør gange og trapper</span></li>
                    </ul>
                  </div>
                </div>

                {/* 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Køkken</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe alle gulve</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør håndvasken</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør hvidevarer af udvendigt</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør ovnen af på ydersiden</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skabe</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skuffer</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømme skraldespande</span></li>
                    </ul>
                  </div>
                </div>

                {/* 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Soveværelser</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe alle gulve</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør gange og trapper</span></li>
                    </ul>
                  </div>
                </div>

                {/* 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Badeværelse</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe gulvet</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør & skrubbe toilettet</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør håndvasken</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skab</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skuffer</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømme skraldespande</span></li>
                    </ul>
                  </div>
                </div>

              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  BOOK PRIVAT RENGØRING
                </a>
              </div>

            </div>
          </section>

          {/* VI TILBYDER */}
          <section className="py-20 px-4 md:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Services</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Vi tilbyder
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  { label: 'Privat rengøring', slug: 'privat-rengoring', icon: '/privat-rengoring-ikon.png' },
                  { label: 'Airbnb rengøring', slug: 'airbnb-rengoring', icon: '/airbnb-rengoring-ikon-1.png' },
                  { label: 'Flytterengøring', slug: 'flytterengoring', icon: '/flyterengoring-ikon.png' },
                  { label: 'Erhvervsrengøring', slug: 'erhvervsrengoring', icon: '/kontor-rengoring-ikon.png' }
                ].map((item) => (
                  <Link href={getServiceLocationUrl(item.slug, city.slug)} key={item.slug} className="bg-slate-50 p-6 rounded-2xl border border-slate-150 shadow-sm text-center flex flex-col items-center hover:scale-105 transition-transform duration-300">
                    <div className="relative w-12 h-12 mb-3">
                      <Image src={item.icon} alt={item.label} fill className="object-contain" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  BOOK PRIVAT RENGØRING
                </a>
              </div>

            </div>
          </section>

          {/* SERVICES VI IKKE TILBYDER */}
          <section className="py-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Hvad gør vi ikke?</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Services vi IKKE tilbyder
                </h2>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-7 gap-4 text-center max-w-5xl mx-auto">
                {[
                  { label: 'Lysekroner', img: '/Lysekroner.png' },
                  { label: 'Aftørring af lys', img: '/Vad-aftorring-af-lys.png' },
                  { label: 'Lysarmatur', img: '/Lysarmatur.png' },
                  { label: 'Biofarer', img: '/Biofarer.png' },
                  { label: 'Dyreaffald', img: '/Dyreaffald.png' },
                  { label: 'Høje områder', img: '/Hojtliggende-omrader.png' },
                  { label: 'Havearbejde', img: '/Havearbejde-og-opvask.png' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100">
                    <div className="relative w-10 h-10 mb-2">
                      <Image src={item.img} alt={item.label} fill className="object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-650 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  BOOK PRIVAT RENGØRING
                </a>
              </div>

            </div>
          </section>

          {/* KUNDEUDTALELSER */}
          <section className="bg-white py-20 px-4 md:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Kundeudtalelser</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Det siger kunderne om Renzen
                </h2>
              </div>
              <ReviewSnippet />
            </div>
          </section>

          {/* LAD OS KLARE DET BESKIDTE ARBEJDE */}
          <section className="py-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Vi bringer zen og harmoni</span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4.5xl font-heading">
                    Lad os klare det beskidte arbejde i {city.name}
                  </h2>
                  <div className="text-slate-500 text-sm leading-relaxed space-y-4 text-justify">
                    <p>
                      Vi ved, at det er en tillidserklæring at lukke en rengøringshjælp ind i sit private hjem. Derfor tilknytter vi en fast, baggrundstjekket Zenmester til din rengøring i {city.name}. Alle opgaver udføres under ordnede forhold og med fuld forsikring.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/book-rengoering/" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                      BOOK RENGØRING
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-xl bg-slate-100">
                    <Image src="/zenmester-gor-rent-rundt.jpg" alt="Zenmester i arbejde" fill className="object-cover" />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* BENEFIT GRID & COUPLE */}
          <section className="py-20 px-4 md:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Fordele</span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4.5xl font-heading">
                    Fordelene ved at vælge os til din rengøring i {city.name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-5 rounded-xl border border-slate-150 bg-slate-50">
                      <h4 className="font-bold text-[#206d69] text-sm flex items-center space-x-2"><span>✓</span> <span>Vi er effektive</span></h4>
                      <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">
                        Med stor erfaring og tjeklister klarer vi rengøringen i {city.name} hurtigt og grundigt.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl border border-slate-150 bg-slate-50">
                      <h4 className="font-bold text-[#206d69] text-sm flex items-center space-x-2"><span>✓</span> <span>Værdi for pengene</span></h4>
                      <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">
                        Prisen er yderst rimelig, og du trækker 26% fra i skat via det danske servicefradrag.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl border border-slate-150 bg-slate-50">
                      <h4 className="font-bold text-[#206d69] text-sm flex items-center space-x-2"><span>✓</span> <span>Miljøvenlige midler</span></h4>
                      <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">
                        Vi minimerer spild og foretrækker skånsomme, miljøvenlige produkter i vores rengøring.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl border border-slate-150 bg-slate-50">
                      <h4 className="font-bold text-[#206d69] text-sm flex items-center space-x-2"><span>✓</span> <span>Tilfredshedsgaranti</span></h4>
                      <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">
                        Skulle der mod forventning være noget, retter vi fejlen med et smil kvit og frit.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
                  <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-100">
                    <Image src="/flytterengoring-par.png" alt="Glade kunder" fill className="object-cover" />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CONTACT INFO */}
          <section id="footer-contact" className="py-20 px-4 bg-slate-50 border-t border-slate-100 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Support</span>
              <h3 className="text-3xl font-extrabold font-heading text-slate-950">Vi er kun et klik væk i {city.name}</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Vi sidder klar til at hjælpe dig alle ugens dage.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                <a href="tel:+4549903055" className="flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:scale-103 transition-transform">
                  <span className="text-2xl mb-1">📞</span>
                  <span className="text-xs font-bold text-slate-800">Ring op</span>
                  <span className="text-[11px] text-slate-400 mt-1">49 90 30 55</span>
                </a>
                <a href="mailto:info@renzen.dk" className="flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:scale-103 transition-transform">
                  <span className="text-2xl mb-1">✉</span>
                  <span className="text-xs font-bold text-slate-800">Email support</span>
                  <span className="text-[11px] text-slate-400 mt-1">info@renzen.dk</span>
                </a>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-20 px-4 md:px-8 bg-white border-t border-slate-100">
            <div className="mx-auto max-w-4xl">
              <FAQSection faqs={combinedFAQs} title="Spørgsmål?" />
              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  BOOK PRIVAT RENGØRING
                </a>
              </div>
            </div>
          </section>

          {/* Local areas grid links */}
          <section className="py-16 px-4 bg-slate-50 border-t border-slate-100">
            <div className="mx-auto max-w-7xl">
              <LocalAreas currentCityName={city.name} nearbyAreas={city.nearbyAreas} serviceSlug={service.slug} />
            </div>
          </section>
        </main>
      </>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 2: FLYTTERENGØRING (LOCAL CITY PAGE)
  // ----------------------------------------------------
  if (service.slug === 'flytterengoring') {
    return (
      <>
        <SchemaMarkup schema={[webPageSchema, serviceSchema, faqSchema, breadcrumbSchema]} />

        <main className="min-h-screen text-slate-800 bg-white">
          {/* Breadcrumbs */}
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
            <Breadcrumbs items={[
              { label: service.label, url: getServiceUrl(service.slug) },
              { label: city.name }
            ]} />
          </div>

          {/* Hero */}
          <section className="relative overflow-hidden bg-[#1c504d] px-4 py-16 md:px-8 md:py-24 text-white">
            <div className="absolute inset-0 z-0 opacity-15">
              <Image src="/flytterengoring-par.png" alt="Flytterengøring" fill className="object-cover" priority />
            </div>
            
            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                <div id="calculator" className="lg:col-span-5 order-2 lg:order-1 scroll-mt-24">
                  <div className="mb-4 hidden lg:block">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300 mb-2">
                      Fraflytning i {city.name} • 100% Garanti
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight font-heading">
                      Flytterengøring i {city.name}
                    </h1>
                    <p className="mt-4 text-[#e0efed] text-sm leading-relaxed">
                      Professionel flytterengøring i {city.name} med fokus på aflevering og flyttesyn. Se din pris med det samme og book flytterengøring på under 60 sekunder.
                    </p>
                  </div>

                  <PriceCalculator initialSqm={typicalSize} title="Se din pris og book" showIntroText={false} serviceSlug="flytterengoring" />
                  
                  {/* Under card badges */}
                  <div className="mt-6 flex flex-wrap justify-between text-xs font-bold text-emerald-100/90 gap-2 px-2">
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Verificerede Zenmestre</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Klar til flyttesyn</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>100% tilfredshedsgaranti</span>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                  <div className="lg:hidden">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                      Fraflytning i {city.name} • 100% Garanti
                    </span>
                    <h1 className="text-3.5xl font-extrabold tracking-tight leading-tight font-heading">
                      Flytterengøring i {city.name}
                    </h1>
                    <p className="mt-3 text-[#e0efed] text-sm leading-relaxed">
                      Professionel flytterengøring i {city.name} med fokus på aflevering og flyttesyn. Se din pris med det samme og book flytterengøring på under 60 sekunder.
                    </p>
                  </div>

                  {/* Right side graphic */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-950/20 max-w-2xl bg-emerald-950/20 aspect-video">
                    <Image src="/flytterengoring-par.png" alt="Flytterengøring" fill className="object-cover" />
                    
                    {/* Floating Trust Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3.5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-slate-800">
                      <span className="text-amber-400 font-bold">★★★★★</span>
                      <span className="text-[11px] font-black tracking-tight text-slate-800">Klar til flyttesyn i {city.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BEFORE / AFTER GIFS SECTION */}
          <section className="py-20 px-4 md:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-6xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Fra beskidt til godkendt flyttesyn</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Fra beskidt til godkendt flyttesyn i {city.name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Toilet og bad gjort klar til aflevering', gif: '/foer-efter-toilet-rens.gif' },
                  { label: 'Ovn renset helt i bund', gif: '/foer-efter-ovn-rens.gif' },
                  { label: 'Kalk og belægninger fjernet', gif: '/foer-efter-wc-rens-1.gif' },
                  { label: 'Vask og armatur rengjort', gif: '/foer-efter-amatur-rengoering.gif' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 p-4 shadow-sm">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-200">
                      <Image src={item.gif} alt={item.label} fill className="object-cover" unoptimized />
                    </div>
                    <span className="block text-xs font-bold text-center text-slate-700 mt-3">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FLYTTESYN PROCESS */}
          <section className="py-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Aflevering uden stress</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Så nemt er det at blive klar til flyttesyn i {city.name}
                </h2>
              </div>

              {/* Steps */}
              <div className="relative max-w-5xl mx-auto">
                <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#206d69]/30 z-0" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">1</div>
                    <h3 className="text-base font-bold text-slate-800">Se din pris</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Brug vores prisberegner og få en pris på din flytterengøring i {city.name} ud fra boligstørrelse og boligens stand.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">2</div>
                    <h3 className="text-base font-bold text-slate-800">Book tid</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Vælg det tidspunkt, der passer dig. Vi sender et erfarent team, som arbejder med flytterengøring og klargøring til aflevering.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">3</div>
                    <h3 className="text-base font-bold text-slate-800">Vi klarer resten</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Vores Zenmestre sørger for, at boligen fremstår ren og præsentabel med fokus på flyttesyn og aflevering.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  Se pris og book flytterengøring
                </a>
              </div>
            </div>
          </section>

          {/* ALT INKLUDERET */}
          <section className="bg-[#1c504d] text-white py-24 px-4 md:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4.5xl leading-tight font-heading">
                  Alt inkluderet til flyttesyn i {city.name}
                </h2>
              </div>

              <div className="space-y-16">
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="relative flex justify-center">
                    <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-emerald-950/20">
                      <Image src="/stol-min.png" alt="Stuer & entré" fill className="object-cover p-6" />
                      <span className="absolute top-4 left-4 h-10 w-10 rounded-full bg-[#206d69] text-white font-bold text-sm flex items-center justify-center border border-white/20">
                        1
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-amber-350">Stuer & entré</h3>
                    <ul className="space-y-2.5 text-sm text-emerald-100/90 leading-relaxed pl-5 list-disc">
                      <li>Rengøring af radiatorer</li>
                      <li>Vask af stikkontakter & afbrydere</li>
                      <li>Vask af døre, dørkarme & paneler</li>
                      <li>Støvsugning og gulvvask</li>
                    </ul>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4 order-2 md:order-1 md:text-right md:pr-10">
                    <h3 className="text-2xl font-black text-amber-350">Soveværelser</h3>
                    <ul className="space-y-2.5 text-sm text-emerald-100/90 leading-relaxed pl-5 md:pl-0 md:pr-5 list-disc md:list-none">
                      <li>Aftørring af alle flader</li>
                      <li>Vask af alle dørkarme & døre</li>
                      <li>Indvendig skabsrengøring</li>
                      <li>Fjernelse af spindelvæv</li>
                    </ul>
                  </div>
                  <div className="relative flex justify-center order-1 md:order-2">
                    <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-emerald-950/20">
                      <Image src="/seng.png" alt="Soveværelser" fill className="object-cover p-6" />
                      <span className="absolute top-4 left-4 h-10 w-10 rounded-full bg-[#206d69] text-white font-bold text-sm flex items-center justify-center border border-white/20">
                        2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="relative flex justify-center">
                    <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-emerald-950/20">
                      <Image src="/kokken.png" alt="Køkken" fill className="object-cover p-6" />
                      <span className="absolute top-4 left-4 h-10 w-10 rounded-full bg-[#206d69] text-white font-bold text-sm flex items-center justify-center border border-white/20">
                        3
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-amber-350">Køkken</h3>
                    <ul className="space-y-2.5 text-sm text-emerald-100/90 leading-relaxed pl-5 list-disc">
                      <li>Grundig ovn- & emhætterengøring</li>
                      <li>Indvendig/udvendig vask af skabe</li>
                      <li>Afkalkning og vask af fliser/spejle</li>
                      <li>Rengøring af køleskab & skuffer</li>
                    </ul>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4 order-2 md:order-1 md:text-right md:pr-10">
                    <h3 className="text-2xl font-black text-amber-350">Badeværelse</h3>
                    <ul className="space-y-2.5 text-sm text-emerald-100/90 leading-relaxed pl-5 md:pl-0 md:pr-5 list-disc md:list-none">
                      <li>Hovedafkalkning af bruseniche</li>
                      <li>Rengøring af fliser og fuger</li>
                      <li>Rengøring af toilet ind- & udvendigt</li>
                      <li>Vask af vaskemaskine (sæbeskuffe)</li>
                    </ul>
                  </div>
                  <div className="relative flex justify-center order-1 md:order-2">
                    <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-emerald-950/20">
                      <Image src="/bad.png" alt="Badeværelse" fill className="object-cover p-6" />
                      <span className="absolute top-4 left-4 h-10 w-10 rounded-full bg-[#206d69] text-white font-bold text-sm flex items-center justify-center border border-white/20">
                        4
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* KUNDEUDTALELSER */}
          <section className="bg-slate-50 py-20 px-4 md:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Kundeudtalelser</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Det siger kunderne om Renzen
                </h2>
              </div>
              <ReviewSnippet />
            </div>
          </section>

          {/* FAQs */}
          <section className="py-20 px-4 md:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-4xl">
              <FAQSection faqs={combinedFAQs} title={`Ofte stillede spørgsmål om flytterengøring i ${city.name}`} />
            </div>
          </section>

          {/* Nearby areas */}
          <section className="py-16 px-4 bg-slate-50 border-t border-slate-100">
            <div className="mx-auto max-w-7xl">
              <LocalAreas currentCityName={city.name} nearbyAreas={city.nearbyAreas} serviceSlug={service.slug} />
            </div>
          </section>
        </main>
      </>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 3: AIRBNB RENGØRING (LOCAL CITY PAGE)
  // ----------------------------------------------------
  if (service.slug === 'airbnb-rengoring') {
    return (
      <>
        <SchemaMarkup schema={[webPageSchema, serviceSchema, faqSchema, breadcrumbSchema]} />

        <main className="min-h-screen text-slate-800 bg-white">
          {/* Breadcrumbs */}
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
            <Breadcrumbs items={[
              { label: service.label, url: getServiceUrl(service.slug) },
              { label: city.name }
            ]} />
          </div>

          {/* Hero */}
          <section className="relative overflow-hidden bg-[#1c504d] px-4 py-16 md:px-8 md:py-24 text-white">
            <div className="absolute inset-0 z-0 opacity-15">
              <Image src="/zenmester-gor-rent-rundt.jpg" alt="Airbnb" fill className="object-cover" priority />
            </div>
            
            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                <div id="calculator" className="lg:col-span-5 order-2 lg:order-1 scroll-mt-24">
                  <div className="mb-4 hidden lg:block">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300 mb-2">
                      Airbnb i {city.name} • 5-stjernet service
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight font-heading">
                      Airbnb rengøring i {city.name}
                    </h1>
                    <p className="mt-4 text-[#e0efed] text-sm leading-relaxed">
                      Klargøring mellem gæster med verificerede Zenmestre. Få din bolig i {city.name} rengjort, nulstillet og klar til næste check-in.
                    </p>
                  </div>

                  <PriceCalculator initialSqm={typicalSize} title="Klargøring mellem gæster" showIntroText={false} serviceSlug="airbnb-rengoring" />
                  
                  {/* Under card badges */}
                  <div className="mt-6 flex flex-wrap justify-between text-xs font-bold text-emerald-100/90 gap-2 px-2">
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Godkendte zenmestre</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>100% tilfredshedsgaranti</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-amber-400">✓</span> <span>Ingen binding</span>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                  <div className="lg:hidden">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                      Airbnb i {city.name} • 5-stjernet service
                    </span>
                    <h1 className="text-3.5xl font-extrabold tracking-tight leading-tight font-heading">
                      Airbnb rengøring i {city.name}
                    </h1>
                    <p className="mt-3 text-[#e0efed] text-sm leading-relaxed">
                      Klargøring mellem gæster med verificerede Zenmestre. Få din bolig i {city.name} rengjort, nulstillet og klar til næste check-in.
                    </p>
                  </div>

                  {/* Right side graphic */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-950/20 max-w-2xl bg-emerald-950/20 aspect-video">
                    <Image src="/zenmester-gor-rent-rundt.jpg" alt="Airbnb" fill className="object-cover" />
                    
                    {/* Floating Trust Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3.5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-slate-800">
                      <span className="text-amber-400 font-bold">★★★★★</span>
                      <span className="text-[11px] font-black tracking-tight text-slate-800">Klar til gæster i {city.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SÅDAN FUNGERER DET */}
          <section className="py-20 px-4 md:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Driftssikker service</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Sådan fungerer Airbnb rengøring hos Renzen
                </h2>
              </div>

              {/* Steps connected by dotted line */}
              <div className="relative max-w-5xl mx-auto">
                <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#206d69]/30 z-0" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">1</div>
                    <h3 className="text-base font-bold text-slate-800">Se din pris</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Se din pris og vælg den klargøring, der passer til din bolig i {city.name}.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">2</div>
                    <h3 className="text-base font-bold text-slate-800">Book klargøring</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Vi planlægger rengøringen, så boligen er klar til næste ankomst.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#206d69] text-white text-xl font-black mb-6">3</div>
                    <h3 className="text-base font-bold text-slate-800">Check-in-klar bolig</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Ren bolig, skift af linned og et pænt reset til næste gæst.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <a href="#calculator" className="inline-flex rounded-lg bg-[#206d69] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#144844] shadow-md">
                  Book Airbnb rengøring
                </a>
              </div>
            </div>
          </section>

          {/* INCLUDED SERVICES */}
          <section className="py-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Det får du med Renzen</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Hvad er inkluderet i en Airbnb klargøring?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                
                {/* 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Stuer & opholdsrum</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe alle gulve</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør gange og trapper</span></li>
                    </ul>
                  </div>
                </div>

                {/* 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Køkken</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengøring af vask og overflader</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør hvidevarer af udvendigt</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømning af opvaskemaskine</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Aftørring af skabslåger udvendigt</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømning af skraldespande</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømme skraldespande</span></li>
                    </ul>
                  </div>
                </div>

                {/* 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Soveværelser</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Vask og strygning af tøj</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Skift af sengetøj</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Aftørring af overflader</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør gange og trapper</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Skift af håndklæder</span></li>
                    </ul>
                  </div>
                </div>

                {/* 4 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#206d69] border-b border-slate-100 pb-2 mb-4">Badeværelse</h3>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Støvsugning og moppe gulvet</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør & skrubbe toilettet</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør håndvasken</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skab</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør ydersiden af skuffer</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tør alle overflader af</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Spejle og glas pudses</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Fjern spindelvæv</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør lyskontakter</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør dørhåndtag</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Rengør vindueskarme</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Tømme skraldespande</span></li>
                      <li className="flex items-center space-x-1.5"><span>✓</span> <span>Skift af håndklæder</span></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* KUNDEUDTALELSER */}
          <section className="bg-white py-20 px-4 md:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#206d69]">Kundeudtalelser</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4.5xl text-slate-900 font-heading">
                  Det siger kunderne om Renzen
                </h2>
              </div>
              <ReviewSnippet />
            </div>
          </section>

          {/* FAQs */}
          <section className="py-20 px-4 md:px-8 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-4xl">
              <FAQSection faqs={combinedFAQs} title={`Ofte stillede spørgsmål om Airbnb rengøring i ${city.name}`} />
            </div>
          </section>

          {/* Nearby areas */}
          <section className="py-16 px-4 bg-slate-50 border-t border-slate-100">
            <div className="mx-auto max-w-7xl">
              <LocalAreas currentCityName={city.name} nearbyAreas={city.nearbyAreas} serviceSlug={service.slug} />
            </div>
          </section>
        </main>
      </>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 4: DEFAULT FALLBACK LAYOUT (LOCAL CITY PAGE)
  // ----------------------------------------------------
  return (
    <>
      <SchemaMarkup schema={[webPageSchema, serviceSchema, faqSchema, breadcrumbSchema]} />

      <main className="min-h-screen bg-slate-50/50 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <Breadcrumbs items={[
            { label: service.label, url: getServiceUrl(service.slug) },
            { label: city.name }
          ]} />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/30 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Lokal Rengøring i {city.name}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                {city.h1Overrides?.[service.slug] || `${service.label} i ${city.name}`}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-slate-500 sm:text-lg">
                Få professionel {service.label.toLowerCase()} udført af lokale, forsikrede og baggrundstjekkede Zenmestre. 
                Vi dækker hele {city.name} med fokus på tårnhøj kvalitet.
              </p>
            </div>

            <div className="lg:col-span-5">
              <PriceCalculator initialSqm={city.typicalHomeSize} title={`Pris i ${city.name}`} showIntroText={false} serviceSlug={service.slug} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
