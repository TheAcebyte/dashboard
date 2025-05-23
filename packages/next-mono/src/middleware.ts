import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

// import { NextRequest, NextResponse } from "next/server";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

// const routeRedirections = {
//   "/": "/database/students",
//   "/attendance": "/attendance/active",
//   "/database": "/database/students",
// } as const;

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   let targetPath: keyof typeof routeRedirections;
//   for (targetPath in routeRedirections) {
//     if (pathname == targetPath) {
//       const redirectedRoute = routeRedirections[targetPath];
//       const redirectedUrl = new URL(redirectedRoute, request.url);
//       return NextResponse.redirect(redirectedUrl);
//     }
//   }

//   return NextResponse.next();
// }
