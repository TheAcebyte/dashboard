import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const routeRedirections = {
  "/": "/database/students",
  "/attendance": "/attendance/active",
  "/database": "/database/students",
} as const;

function getPathnameWithoutLocale(pathnameWithLocale: string) {
  const [empty, locale, ...pathname] = pathnameWithLocale.split("/");
  return ["/" + locale, "/" + pathname.join("/")] as const;
}

function redirectMiddleware(request: NextRequest) {
  const [locale, pathname] = getPathnameWithoutLocale(request.nextUrl.pathname);
  if (locale == "/") {
    return NextResponse.next();
  }

  let targetPath: keyof typeof routeRedirections;
  for (targetPath in routeRedirections) {
    if (pathname == targetPath) {
      const redirectedRoute = routeRedirections[targetPath];
      const redirectUrl = new URL(
        locale + redirectedRoute,
        request.nextUrl.origin,
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

const i18nMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = redirectMiddleware(request);
  if (!response.ok) {
    return response;
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
