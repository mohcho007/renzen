import { Suspense } from "react";
import AirbnbBookWizard, {
  AirbnbBookInvalidState,
} from "@/components/airbnb-rengoring/AirbnbBookWizard";
import { verifyAirbnbInquiryToken } from "@/lib/airbnbInquiryToken";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Book Airbnb rengøring",
  description:
    "Gennemfør din Airbnb-rengøring med det valgte tidspunkt og betaling via Renzen.",
  path: "/airbnb-rengoring/book/",
  indexable: false,
});

type PageProps = {
  searchParams: Promise<{ ref?: string | string[] }>;
};

export default async function AirbnbBookPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawRef = params.ref;
  const ref = Array.isArray(rawRef) ? rawRef[0] : rawRef;
  const inquiry = ref ? verifyAirbnbInquiryToken(ref) : null;

  if (!inquiry) {
    return <AirbnbBookInvalidState />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfaf5] text-sm font-medium text-[#536159]">
          Henter booking…
        </div>
      }
    >
      <AirbnbBookWizard inquiry={inquiry} />
    </Suspense>
  );
}
