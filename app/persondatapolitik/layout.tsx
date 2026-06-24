import { createStaticPageMetadata } from "@/lib/siteMetadata";

export const metadata = createStaticPageMetadata({
  title: "Persondatapolitik | Renzen",
  description:
    "Læs hvordan Renzen indsamler, behandler, deler og beskytter personoplysninger, samt hvilke rettigheder du har.",
  path: "/persondatapolitik",
});

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
