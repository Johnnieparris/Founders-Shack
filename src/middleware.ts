import { type NextRequest, NextResponse } from "next/server";

import { ONBOARDING_COMPLETE_COOKIE } from "~/lib/onboarding-cookie";

function hasCompletedOnboarding(request: NextRequest) {
  return request.cookies.get(ONBOARDING_COMPLETE_COOKIE)?.value === "true";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const done = hasCompletedOnboarding(request);

  if (pathname.startsWith("/onboarding")) {
    if (done) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile")
  ) {
    if (!done) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/onboarding",
    "/onboarding/:path*",
  ],
};
