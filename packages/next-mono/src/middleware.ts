import { NextRequest, NextResponse } from "next/server";

const routeRedirections = {
  "/": "/database/students",
  "/attendance": "/attendance/students",
  "/database": "/database/students",
} as const;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let targetPath: keyof typeof routeRedirections;
  for (targetPath in routeRedirections) {
    if (pathname == targetPath) {
      const redirectedRoute = routeRedirections[targetPath];
      const redirectedUrl = new URL(redirectedRoute, request.url);
      return NextResponse.redirect(redirectedUrl);
    }
  }

  return NextResponse.next();
}
