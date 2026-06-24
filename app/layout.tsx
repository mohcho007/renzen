import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { WebVitals } from "@/components/analytics/WebVitals";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { bookOnlineDescription } from "@/lib/metadataCopy";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: {
    default: `Rengøring ⇒ Book nemt og trygt · intro fra ${INTRO_CLEANING_FROM_KR} kr.`,
    template: "%s",
  },
  description: bookOnlineDescription(),
  icons: {
    icon: [
      {
        url: "/favicon/favicon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
  },
  openGraph: {
    title: `Rengøring ⇒ Book nemt og trygt hos Renzen`,
    description: bookOnlineDescription(),
    url: siteConfig.origin,
    siteName: siteConfig.name,
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Renzen Rengøring",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `Rengøring ⇒ Book nemt og trygt hos Renzen`,
    description: bookOnlineDescription(),
    images: [siteConfig.logo],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="da"
      className={`${plusJakartaSans.variable} ${bricolageGrotesque.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-foreground">
        <GoogleAnalytics />
        <WebVitals />
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
