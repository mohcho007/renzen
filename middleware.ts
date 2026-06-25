import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLegacyRedirectDestination } from "./lib/legacyRedirectLogic";

export function middleware(request: NextRequest) {
  const destination = getLegacyRedirectDestination(request.nextUrl.pathname);
  if (!destination) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/rengoring/:path*",
    "/hovedrengoring/:path*",
    "/engangsrengoring/:path*",
    "/erhvervsrengoring/:path*",
    "/rengoering/:path*",
    "/hovedrengoering/:path*",
    "/engangsrengoering/:path*",
    "/erhvervsrengoering/:path*",
    "/privat-rengoring/:path*",
    "/privat-rengoering/:path*",
    "/hjemmerengoering/:path*",
    "/hjemmerengoring/:path*",
    "/kontakt-os",
    "/start",
    "/deal",
    "/dealside",
    "/blog",
    "/job",
    "/cookie-privatlivspolitik",
    "/airbnb-rengoering",
    "/kontorrengoering",
    "/klinikrengoering",
    "/butiksrengoering",
    "/institutionsrengoering",
    "/byggerengoering",
    "/artikler/:path*",
    "/priser",
  ],
};
