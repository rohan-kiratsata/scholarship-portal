import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for these routes to avoid infi redirecrts
  if (pathname.startsWith("/api") || pathname.startsWith("/handler")) {
    return NextResponse.next();
  }

  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/handler/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
