import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { HomeStructuredData } from "@/components/home/HomeStructuredData";
import { RenzenHomePage } from "@/components/home/RenzenHomePage";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import { bookOnlineDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { createStaticPageMetadata } from "@/lib/siteMetadata";
import { siteConfig } from "@/lib/siteConfig";

const { props: homeHeroImageProps } = getImageProps({
  src: siteConfig.ogImage,
  alt: siteConfig.ogImageAlt,
  width: siteConfig.ogImageWidth,
  height: siteConfig.ogImageHeight,
  sizes: "(max-width: 1024px) 100vw, 50vw",
  priority: true,
});

export const metadata: Metadata = createStaticPageMetadata({
  title: liveStyleTitle(
    "Rengøring",
    `Book nemt og trygt hos Renzen · intro fra ${INTRO_CLEANING_FROM_KR} kr.`,
  ),
  description: bookOnlineDescription(),
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={homeHeroImageProps.src}
        imageSrcSet={homeHeroImageProps.srcSet}
        imageSizes={homeHeroImageProps.sizes}
        fetchPriority="high"
      />
      <HomeStructuredData />
      <RenzenHomePage />
    </>
  );
}
