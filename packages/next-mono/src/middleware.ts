import { NextRequest, NextResponse } from "next/server";

const matchRedirections = {
  "/attendance": "/attendance/students",
  "/database": "/database/students",
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let targetPath: keyof typeof matchRedirections;
  for (targetPath in matchRedirections) {
    if (pathname == targetPath) {
      const redirectedPath = matchRedirections[targetPath];
      const redirectedUrl = new URL(redirectedPath, request.url);
      return NextResponse.redirect(redirectedUrl);
    }
  }

  return NextResponse.next();
}
