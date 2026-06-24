import Image from "next/image";
import Link from "next/link";
import { SERVICE_ZEN_CREDIT_IMAGES } from "@/lib/zenCreditServices";

export function ZenCreditServicesGrid() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {SERVICE_ZEN_CREDIT_IMAGES.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="border border-[#d8ddd5] bg-white transition-colors hover:border-[#173c2c]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover"
            />
          </div>
          <p className="border-t border-[#e5e7e1] px-2 py-2.5 text-center text-xs font-bold leading-snug text-[#536159] sm:px-4 sm:py-3">
            {item.label}
          </p>
        </Link>
      ))}
    </div>
  );
}
