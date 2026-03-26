import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOCALES, DEFAULT_LOCALE } from "@acquisition/shared";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  const segment = pathname.split("/")[1];
  const hasValidLocale = LOCALES.includes(segment as (typeof LOCALES)[number]);

  if (!hasValidLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
