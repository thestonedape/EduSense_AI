import { NextRequest, NextResponse } from "next/server";

import { authenticateUser, authPaths, createSessionCookie, UserRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = body.role as UserRole;

  if (role !== "student" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role." }, { status: 400 });
  }

  const user = authenticateUser(email, password, role);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials. Use the demo credentials shown on the login page." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: role === "admin" ? "/admin" : "/",
  });

  response.cookies.set(createSessionCookie(user));
  return response;
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("role") === "admin" ? authPaths.adminLogin : authPaths.studentLogin;
  return NextResponse.redirect(new URL(target, request.url));
}
