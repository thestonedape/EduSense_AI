import { NextRequest, NextResponse } from "next/server";

import { authenticateUser, authPaths, createSessionCookie, registerStudent, UserRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = body.role as UserRole;
  const intent = body.intent === "sign_up" ? "sign_up" : "sign_in";

  if (role !== "student" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role." }, { status: 400 });
  }

  const authResult =
    role === "student" && intent === "sign_up"
      ? await registerStudent(email, password)
      : await authenticateUser(email, password, role);
  const { user, message } = authResult;

  if (!user) {
    return NextResponse.json(
      { message: message || "Login failed." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: user.role === "admin" ? "/admin" : "/",
  });

  response.cookies.set(await createSessionCookie(user));
  return response;
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("role") === "admin" ? authPaths.adminLogin : authPaths.studentLogin;
  return NextResponse.redirect(new URL(target, request.url));
}
