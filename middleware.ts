import { NextRequest, NextResponse } from "next/server";

import { authPaths } from "@/lib/auth";

type SessionUser = {
  role: "student" | "admin";
};

function readSession(request: NextRequest): SessionUser | null {
  const raw = request.cookies.get("edusense_session")?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (pathname === authPaths.studentLogin) {
    if (session?.role === "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === authPaths.adminLogin) {
    if (session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session?.role === "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL(authPaths.adminLogin, request.url));
    }

    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL(authPaths.studentLogin, request.url));
  }

  if (session.role !== "student") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
