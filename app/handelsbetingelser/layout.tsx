import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata = createStaticPageMetadata({
  title: "Handelsbetingelser | Renzen",
  description:
    "Læs Renzens handelsbetingelser for brug af sammenligningstjenesten, formidling af tilbud og aftaler med rengøringsfirmaer.",
  path: "/handelsbetingelser",
});

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
