"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ArrowRight, X } from "lucide-react";
import {
  CUSTOMER_TABS,
  SERVICES_MAP,
  type CustomerType,
} from "@/components/dynamic/quoteConfig";

export interface ServiceSelectorModalHandle {
  open: (
    postalCode: string,
    initialTab: CustomerType,
    initialService: string,
  ) => void;
}

export const ServiceSelectorModal = forwardRef<ServiceSelectorModalHandle>(
  function ServiceSelectorModal(_, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [postalCode, setPostalCode] = useState("");
    const [activeTab, setActiveTab] = useState<CustomerType>("private");
    const [selectedService, setSelectedService] =
      useState("regular_cleaning");

    const popupRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const closeModal = useCallback(() => {
      setIsOpen(false);
      window.setTimeout(() => previousFocusRef.current?.focus(), 0);
    }, []);

    useImperativeHandle(ref, () => ({
      open(zip, tab, service) {
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setPostalCode(zip);
        setActiveTab(tab);
        setSelectedService(service);
        setIsOpen(true);
      },
    }));

    useEffect(() => {
      if (!isOpen) return;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
          return;
        }

        if (event.key !== "Tab" || !popupRef.current) return;

        const focusable = Array.from(
          popupRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [closeModal, isOpen]);

    const handleTabChange = (tabId: CustomerType) => {
      setActiveTab(tabId);
      setSelectedService(SERVICES_MAP[tabId][0].id);
    };

    const handleSubmit = () => {
      const match = postalCode.match(/\b\d{4}\b/);
      const code = match ? match[0] : "";
      if (!code || code.length !== 4) {
        alert(
          "Indtast venligst et gyldigt 4-cifret postnummer eller vælg fra listen.",
        );
        return;
      }
      window.location.href = `https://app.renbud.dk/hent-tilbud?type=${activeTab}&service=${selectedService}&postalCode=${code}`;
    };

    return (
      <div
        className={`fixed inset-0 bg-slate-900/80 z-50 overflow-y-auto p-0 lg:p-4 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onMouseDown={(event) => {
          if (
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
          ) {
            closeModal();
          }
        }}
      >
        <div className="min-h-screen flex items-end lg:items-start justify-center lg:justify-start pt-5 lg:pt-[151px] pb-0 lg:pb-8 relative max-w-[1300px] mx-auto px-0 lg:px-6 w-full">
          <div
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-selector-title"
            className={`bg-white border-t border-x lg:border border-stone-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-t-2xl lg:rounded-2xl w-full max-w-none lg:max-w-[500px] min-h-[87vh] lg:min-h-0 p-6 sm:p-8 md:p-9 relative text-left lg:-ml-10 flex flex-col justify-start transition-all duration-300 ease-out ${
              isOpen
                ? "translate-y-0 opacity-100 lg:scale-100"
                : "translate-y-10 opacity-0 lg:scale-95 pointer-events-none"
            }`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full border border-stone-200 text-slate-400 hover:text-slate-600 hover:border-stone-300 flex items-center justify-center transition-colors cursor-pointer bg-white"
              aria-label="Luk"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6 mt-[50px] sm:mt-2 px-2 sm:px-0">
              <h3
                id="service-selector-title"
                className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 leading-tight"
              >
                Hvordan kan vi hjælpe dig?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2.5">
                <span className="lg:hidden">
                  Da du bor i{" "}
                  <strong className="text-[#3B7965]">{postalCode}</strong>,
                  tilbyder Renbud følgende services:
                </span>
                <span className="hidden lg:inline">
                  Vi har fundet rengøringsfirmaer i{" "}
                  <strong className="text-[#3B7965]">{postalCode}</strong>. Vælg
                  din service nedenfor.
                </span>
              </p>
            </div>

            <div className="relative border-b border-stone-100 mb-6 text-center">
              <div className="flex justify-between gap-1" role="tablist">
                {CUSTOMER_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex flex-col items-center justify-center gap-1 pb-3 transition-all cursor-pointer font-display text-xs sm:text-sm group flex-1 border-b-2 ${
                        isActive
                          ? "border-[#3B7965] text-[#3B7965] font-extrabold"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <div className="relative w-[52px] h-[52px] transition-transform duration-300 ease-out group-hover:scale-110">
                        <Image
                          src={tab.iconPath}
                          alt={`Kategoriikon for ${tab.label} rengøring`}
                          fill
                          sizes="52px"
                          className="object-contain"
                        />
                      </div>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 mb-6 bg-white shadow-xs">
              {SERVICES_MAP[activeTab].map((service) => {
                const isSelected = selectedService === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left px-5 py-4 text-sm font-semibold flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#3B7965]/5 text-[#3B7965] font-extrabold"
                        : "text-slate-800 hover:bg-stone-50"
                    }`}
                  >
                    <span>{service.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#3B7965] bg-[#3B7965] text-white"
                          : "border-stone-300"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <span className="text-[10px] font-bold">✓</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-12 rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md transition-all scale-100 hover:scale-[1.01] active:scale-[0.99] btn-shimmer-container cursor-pointer uppercase tracking-wider"
            >
              <span className="lg:hidden">FORTSÆT</span>
              <span className="hidden lg:inline">Få gratis tilbud</span>
              <ArrowRight size={18} className="hidden lg:inline" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);
