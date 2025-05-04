import { NextRequest, NextResponse } from "next/server";

const routeRedirections = {
  "/attendance": "/attendance/students",
  "/database": "/database/students",
};

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
