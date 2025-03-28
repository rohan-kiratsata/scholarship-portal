import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = stackServerApp.getUser();

  // auth based redirection
  if (pathname.startsWith("/api/")) return NextResponse.next();

  if (!user && pathname.startsWith("/"))
    return NextResponse.redirect(new URL("/login", req.url));

  if (pathname === "/sign-in" || pathname === "/login")
    return NextResponse.redirect("/handler/sign-in");

  if (pathname === "/sign-up") return NextResponse.redirect("/handler/sign-up");
}
