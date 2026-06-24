import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata = createStaticPageMetadata({
  title: "Cookiepolitik | Renzen",
  description:
    "Læs hvordan Renzen anvender cookies, hvilke oplysninger de indsamler, og hvordan du administrerer dit samtykke.",
  path: "/cookiepolitik",
});

export default function CookiePolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
