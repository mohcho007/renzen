import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import {
  serviceDeduction,
  serviceDeductionText,
} from "@/lib/serviceDeduction";
import { ArrowRight } from "lucide-react";

function StaticSection({
  children,
  className = "",
  delayClass = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  delayClass?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`fade-in-section is-visible ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function HomeStatsSection() {
  return (
    <section className="w-full bg-white pt-6 sm:pt-8 pb-3 sm:pb-4 relative z-20">
        <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image src="/icon_tasks_matched.png" alt="Illustration af fuldførte rengøringsopgaver hos Renzen" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-lg font-bold text-brand-blue font-mono leading-tight">1.000+</div>
              <div className="text-[12px] font-semibold text-zinc-500">Opgaver løst</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image src="/icon_customer_rating.png" alt="Fem stjerner rating symbol for Renzen kundetilfredshed" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-lg font-bold text-brand-blue font-mono leading-tight">4.8 / 5</div>
              <div className="text-[12px] font-semibold text-zinc-500">Kunderating</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image src="/icon_savings_discount.png" alt="Procenttegn for besparelse på professionel rengøring" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-lg font-bold text-brand-blue font-mono leading-tight">Op til 40%</div>
              <div className="text-[12px] font-semibold text-zinc-500">Besparelse</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image src="/icon_cvr_verified.png" alt="Verificeret CVR nummer for godkendte rengøringspartnere" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-lg font-bold text-brand-blue font-mono leading-tight">100% Sikret</div>
              <div className="text-[12px] font-semibold text-zinc-500">CVR verificeret</div>
            </div>
          </div>

        </div>
      </section>
  );
}

export default function HomeIntroSections() {
  return (
    <>
      {/* How it Works Section */}
      <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
        <section id="sadan-virker-det" className="py-16 sm:py-20 bg-[#f8fafc] rounded-none sm:rounded-[18px] border-y sm:border border-zinc-200/50 relative overflow-hidden">
          <div className="max-w-[1300px] mx-auto px-6 text-center">
          <StaticSection className="max-w-2xl mx-auto mb-16 flex flex-col gap-3">

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
              Sådan virker Renzen
            </h2>
            <p className="text-zinc-600 font-medium text-lg leading-relaxed">
              Beregn din pris og book din næste rengøring på 2 minutter.
            </p>
          </StaticSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                imagePath: "/3d_step1_blue.png",
                bgColor: "#f0f4ff",
                title: "1. Indtast dine kvm",
                desc: "Start med at vælge antal kvadratmeter og den ønskede service for din bolig eller erhverv.",
                delayClass: "fade-in-delay-100"
              },
              {
                imagePath: "/3d_step2_violet.png",
                bgColor: "#f5f3ff",
                title: "2. Se din faste pris",
                desc: "Vores smarte prisberegner giver dig øjeblikkeligt en fast, gennemsigtig pris uden skjulte gebyrer.",
                delayClass: "fade-in-delay-200"
              },
              {
                imagePath: "/3d_step3_green.png",
                bgColor: "#f0fdf4",
                title: "3. Book online på 2 minutter",
                desc: "Vælg den tid der passer dig bedst, og book nemt online. Så sørger vores Zenmestre for resten.",
                delayClass: "fade-in-delay-300"
              }
            ].map((step, idx) => {
              return (
                <StaticSection 
                  key={idx} 
                  style={{ backgroundColor: step.bgColor }}
                  delayClass={step.delayClass}
                  className="border border-zinc-200/50 p-8 rounded-3xl flex flex-col items-center gap-4 text-center min-h-[300px] justify-center transition-all duration-300 hover:shadow-md hover:border-primary/20 group"
                >
                  <div className="h-24 w-24 flex items-center justify-center shrink-0">
                    <div className="relative w-22 h-22 transition-transform duration-300 group-hover:scale-110">
                      <Image 
                        src={step.imagePath} 
                        alt={`Illustration af trin ${idx + 1}: ${step.title}`} 
                        fill
                        sizes="88px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-[22px] text-brand-blue">{step.title}</h3>
                  <p className="text-zinc-700 text-[15px] leading-relaxed font-medium">{step.desc}</p>
                </StaticSection>
              );
            })}
          </div>
        </div>
      </section>
      </div>

      {/* Servicefradrag Section (Private) */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Text Content (Left) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <StaticSection className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-1.5 bg-[#e6fbf3] text-[#2d5e4d] px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-wide w-fit uppercase">
                  Skattebesparelse
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight leading-[1.2]">
                  Spar ekstra med servicefradrag <br /> på din private rengøring
                </h2>
                <p className="text-zinc-600 font-medium text-[16px] sm:text-lg leading-relaxed mt-2">
                  Når du bestiller privat rengøringshjælp eller vinduespudsning i Danmark, kan du trække arbejdslønnen fra i skat. Det gør den professionelle hjælp endnu billigere.
                </p>
              </StaticSection>

              {/* Grid of benefits */}
              <StaticSection className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">Spar ca. {serviceDeductionText.taxValue}</h3>
                    <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Skatteværdien er ca. {serviceDeductionText.taxValue}, hvilket svarer til omtrent en fjerdedel af arbejdslønnen.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">Fradrag op til {serviceDeductionText.maximumPerPerson}</h3>
                    <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Hver person i husstanden, der er fyldt {serviceDeduction.minimumAge} år, kan få fradrag for op til {serviceDeductionText.maximumPerPerson} om året ({serviceDeductionText.rulesYear}).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">Nem digital indberetning</h3>
                    <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Indberet dit fradrag på 2 minutter under TastSelv på skat.dk med fakturaen fra dit rengøringsfirma.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">Gælder også vinduespudsning</h3>
                    <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Du kan også trække arbejdslønnen fra til vinduespolering, havearbejde og småreparationer.</p>
                  </div>
                </div>
              </StaticSection>

              <StaticSection className="mt-4">
                <a 
                  href="/book-rengoering" 
                  className="bg-[#192251] hover:bg-zinc-800 text-white font-display font-bold px-7 py-3 rounded-full text-[15px] transition-all shadow-md inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Få rengøringshjælp med fradrag</span>
                  <ArrowRight size={16} />
                </a>
              </StaticSection>
            </div>

            {/* Image (Right) */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              {/* Soft decorative aura glow */}
              <div className="absolute w-72 h-72 bg-emerald-100/40 rounded-full filter blur-3xl -z-10 animate-pulse duration-4000" />
              
              <StaticSection className="flex items-center justify-center w-full max-w-[370px] aspect-square relative">
                <Image 
                  src="/fradrag.png" 
                  alt="Illustration af servicefradrag og skattebesparelse på privat rengøring i Danmark" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 370px"
                  className="object-cover"
                />
              </StaticSection>
            </div>

          </div>
        </div>
      </section>

      {/* Erhvervsrengøring Section (Business) */}
      <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#cbf7e6]/30 to-[#e6faf2]/30 rounded-none sm:rounded-[18px] border-y sm:border border-[#cbf7e6]/50 relative overflow-hidden">
          {/* Subtle decorative blob */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-50/50 rounded-full filter blur-3xl -z-10" />
          
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Image (Left) */}
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center items-center relative">
                {/* Soft decorative aura glow */}
                <div className="absolute w-72 h-72 bg-blue-100/30 rounded-full filter blur-3xl -z-10 animate-pulse duration-3000" />
                
                <StaticSection className="flex items-center justify-center w-full max-w-[420px] aspect-square relative">
                  <Image 
                    src="/erhvervsrengøring.png" 
                    alt="Illustration af professionel erhvervsrengøring til virksomheder" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                </StaticSection>
              </div>

              {/* Text Content (Right) */}
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6 text-left">
                <StaticSection className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#e2f6ff] text-blue-700 px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-wide w-fit uppercase">
                    Erhvervsservice
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight leading-[1.2]">
                    Professionel erhvervsrengøring <br /> til din virksomhed
                  </h2>
                  <p className="text-zinc-600 font-medium text-[16px] sm:text-lg leading-relaxed mt-2">
                    Et sundt og rent indeklima styrker medarbejdernes trivsel og præsenterer din virksomhed bedst muligt. Renzen matcher dig med lokale, kvalitetssikrede erhvervspartnere.
                  </p>
                </StaticSection>

                {/* Grid of benefits */}
                <StaticSection className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[15px]">Skræddersyet tidsplan</h3>
                      <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Uanset om I skal bruge rengøring dagligt, ugentligt eller uden for åbningstiderne, finder vi det rette match.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[15px]">100% driftsfradrag</h3>
                      <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Som erhvervskunde kan alle udgifter til professionel kontor- eller klinikrengøring trækkes fuldt fra i skat.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-[#192251]/10 text-[#192251] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[15px]">Sikrede virksomheder</h3>
                      <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">Alle Zenmestre er godkendt af Renzen med forsikring, baggrundstjek og kvalitetskrav.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-[#192251]/10 text-[#192251] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[15px]">Stabil service & kvalitet</h3>
                      <p className="text-zinc-500 text-[13px] font-medium leading-normal mt-0.5">I får typisk faste Zenmestre tilknyttet, så kvaliteten forbliver ensartet høj ved hvert eneste besøg.</p>
                    </div>
                  </div>
                </StaticSection>

                <StaticSection className="mt-4">
                  <a 
                    href="/book-rengoering?type=company" 
                    className="bg-[#3b7965] hover:bg-[#2d5e4d] text-white font-display font-bold px-7 py-3 rounded-full text-[15px] transition-all shadow-md inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Beregn erhvervsrengøring nu</span>
                    <ArrowRight size={16} />
                  </a>
                </StaticSection>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6">
          <StaticSection className="max-w-2xl mx-auto text-center mb-16 flex flex-col gap-3">

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
              Det siger vores kunder
            </h2>
            <p className="text-zinc-600 font-medium text-lg leading-relaxed">
              Læs om erfaringerne fra nogle af de mange danskere, der har brugt Renzen til at finde rengøring.
            </p>
          </StaticSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria S.",
                location: "København Ø",
                text: "Super nemt at booke! Vi bestilte online og fik lynhurtigt en bekræftelse. Rengøringen var helt i top, og det er skønt med en fast pris uden overraskelser. Meget professionelt!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
                delayClass: "fade-in-delay-100"
              },
              {
                name: "Thomas D.",
                location: "Aarhus C",
                text: "Rengøringen var helt i top, og kommunikationen kørte super nemt via platformen. Det er fantastisk at vide, at alle firmaer er CVR tjekkede og forsikrede på forhånd.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
                delayClass: "fade-in-delay-200"
              },
              {
                name: "Lene M.",
                location: "Odense M",
                text: "Virkelig god oplevelse! Systemet er så enkelt at bruge. Jeg fik en rigtig god pris på flytterengøring af min lejlighed, og udlejeren havde intet at udsætte på resultatet.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80",
                delayClass: "fade-in-delay-300"
              }
            ].map((t, idx) => (
              <StaticSection 
                key={idx}
                delayClass={t.delayClass}
                className="bg-[#f8fafc] border border-zinc-200/40 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col gap-4">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-zinc-700 italic text-[15px] leading-relaxed font-medium">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-200/50">
                  <Image src={t.avatar} alt={`Kundeanmeldelse profilbillede af ${t.name} fra ${t.location}`} width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-xs" />
                  <div>
                    <div className="font-display font-bold text-brand-blue text-base">{t.name}</div>
                    <div className="text-xs font-semibold text-zinc-500">{t.location}</div>
                  </div>
                </div>
              </StaticSection>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
