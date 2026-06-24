import React from 'react';

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  frequency: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Louise M.',
    location: 'København',
    rating: 5,
    text: 'Vi har haft den samme zenmester hver uge i over et år, og hun er fantastisk! Alt skinner, og vi føler os altid trygge ved at have hende i vores hjem.',
    frequency: 'Fast kunde'
  },
  {
    name: 'Henrik P.',
    location: 'Frederiksberg',
    rating: 5,
    text: 'Efter at have prøvet flere rengøringsfirmaer fandt vi endelig Renzen - og vi kunne ikke være mere tilfredse. Deres koncept med faste zenmestre fungerer virkelig godt!',
    frequency: 'Hver 2. uge'
  },
  {
    name: 'Amalie K.',
    location: 'Valby',
    rating: 5,
    text: 'Vi bookede en engangsrengøring før en familiefest, og resultatet var imponerende! Hurtig booking, god service og venlig rengøringshjælp.',
    frequency: 'Engangsydelse'
  }
];

interface ReviewSnippetProps {
  testimonials?: Testimonial[];
  limit?: number;
}

export default function ReviewSnippet({ testimonials = defaultTestimonials, limit = 3 }: ReviewSnippetProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto px-4">
      {testimonials.slice(0, limit).map((t, index) => (
        <div 
          key={index}
          className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow duration-300"
        >
          <div>
            {/* Stars */}
            <div className="flex items-center space-x-0.5 text-amber-400">
              {[...Array(t.rating)].map((_, i) => (
                <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {/* Text */}
            <p className="mt-5 text-sm leading-relaxed text-slate-700 font-medium italic">
              &quot;{t.text}&quot;
            </p>
          </div>
          
          {/* Author info */}
          <div className="mt-8 pt-5 border-t border-slate-50">
            <h5 className="text-sm font-bold text-slate-800">{t.name}</h5>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {t.frequency}, {t.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
