import { Suspense } from 'react';
import BookingWizard from '@/components/booking/BookingWizard';
import { SiteHeader } from '@/components/site/SiteHeader';

export default function BookRengoeringPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground font-sans flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 py-6 md:py-10">
        
        <Suspense fallback={<div className="text-center p-10">Henter booking form...</div>}>
          <BookingWizard />
        </Suspense>
      </main>
    </div>
  );
}