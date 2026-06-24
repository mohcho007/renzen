'use client';

import React, { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQSection({ faqs, title = 'Ofte stillede spørgsmål' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl text-center mb-8">
        {title}
      </h3>
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-700 hover:text-emerald-600 focus:outline-none"
              >
                <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-transform duration-200">
                  {isOpen ? (
                    <svg className="h-4 w-4 transform rotate-180 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {isOpen && (
                <div className="border-t border-slate-50 p-5 bg-slate-50/30 text-sm leading-relaxed text-slate-600 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
