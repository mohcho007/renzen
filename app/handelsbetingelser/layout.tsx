import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata = createStaticPageMetadata({
  title: "Handelsbetingelser | Renzen",
  description:
    "Læs Renzens handelsbetingelser for booking af privat rengøring, Renzen Klub, Zenkreditter, afbestilling, reklamation og forsikring.",
  path: "/handelsbetingelser",
});

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
