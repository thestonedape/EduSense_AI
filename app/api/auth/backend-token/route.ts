import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { backendToken } from "@/lib/backend-auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ token: backendToken(user) }, { headers: { "Cache-Control": "no-store" } });
}
