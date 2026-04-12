import { NextRequest, NextResponse } from "next/server";

import { authPaths, decodeSession } from "@/lib/auth";

type SessionUser = {
  role: "student" | "admin";
};

async function readSession(request: NextRequest): Promise<SessionUser | null> {
  const raw = request.cookies.get("edusense_session")?.value;
  return decodeSession(raw);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);
  const isStudentAuthPath =
    pathname === authPaths.studentLogin || pathname === authPaths.studentAccess;
  const isAdminAuthPath =
    pathname === authPaths.adminLogin || pathname === authPaths.adminAccess;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (isStudentAuthPath) {
    if (session?.role === "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminAuthPath) {
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
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
