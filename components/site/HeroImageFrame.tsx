import Image from "next/image";

type HeroImageFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  imagePosition?: "left" | "right";
  imageOffsetX?: number;
};

const CLIP_PATH_ID = "renzen-hero-left-curve";
const LEFT_CURVE =
  "M 496 -30 C 418 155 277 385 230 580 C 183 770 210 930 239 1030";

export function HeroImageFrame({
  src,
  alt,
  priority = false,
  imagePosition = "left",
  imageOffsetX = 0,
}: HeroImageFrameProps) {
  const clipPath = `url(#${CLIP_PATH_ID})`;
  const imagePositionClass =
    imagePosition === "right" ? "object-[right_top]" : "object-[left_top]";
  const objectPosition =
    imageOffsetX > 0
      ? imagePosition === "right"
        ? `calc(100% + ${imageOffsetX}px) center`
        : `calc(0% - ${imageOffsetX}px) center`
      : undefined;

  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute h-0 w-0"
        focusable="false"
      >
        <defs>
          <clipPath id={CLIP_PATH_ID} clipPathUnits="objectBoundingBox">
            <path d="M .496 -.03 C .418 .155 .277 .385 .23 .58 C .183 .77 .21 .93 .239 1.03 H 1 V -.03 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[55%] isolate lg:block"
        data-testid="hero-image-frame"
      >
        <div
          className="absolute inset-0 translate-x-[10px] overflow-hidden"
          style={{ clipPath, WebkitClipPath: clipPath }}
        >
          {src.endsWith('.mp4') ? (
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className={`object-cover w-full h-full absolute inset-0 ${imagePositionClass}`}
              style={{ objectPosition }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              quality={90}
              sizes="(max-width: 1023px) 0px, 55vw"
              className={`object-cover ${imagePositionClass}`}
              style={{ objectPosition }}
            />
          )}
        </div>

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full translate-x-[10px]"
          focusable="false"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
        >
          <path
            d={LEFT_CURVE}
            fill="none"
            stroke="white"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </>
  );
}
