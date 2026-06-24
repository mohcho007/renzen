import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";
import SchemaMarkup from "@/components/SchemaMarkup";
import { faqCategories, getAllFaqEntries } from "@/data/faqPageContent";
import { constructMetadata } from "@/lib/seo";
import { generateFAQSchema, generateWebPageSchema } from "@/lib/schema";
import { getAbsoluteUrl } from "@/lib/urls";

export const metadata: Metadata = constructMetadata({
  title: "FAQ — Ofte stillede spørgsmål om rengøring",
  description:
    "Find svar på spørgsmål om priser, booking, forsikring, Zenmestre, Renzen Klub og alle vores services — fra privat rengøring til erhverv.",
  path: "/faq/",
  indexable: true,
});

export default function Page() {
  const absoluteUrl = getAbsoluteUrl("/faq/");
  const allFaqs = getAllFaqEntries().map((entry) => ({
    question: entry.question,
    answer: entry.answer,
  }));

  const webPageSchema = generateWebPageSchema(
    "FAQ — Ofte stillede spørgsmål om rengøring",
    "Find svar på spørgsmål om priser, booking, forsikring, Zenmestre, Renzen Klub og alle vores services.",
    absoluteUrl,
  );
  const faqSchema = generateFAQSchema(allFaqs);

  return (
    <>
      <SchemaMarkup schema={[webPageSchema, faqSchema]} />
      <FaqPage categories={faqCategories} />
    </>
  );
}
