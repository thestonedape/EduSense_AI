import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const started = performance.now();
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const internalApiKey = process.env.INTERNAL_API_KEY;
  if (!apiBaseUrl) {
    return NextResponse.json({ message: "API base URL is not configured." }, { status: 500 });
  }
  if (!internalApiKey) {
    return NextResponse.json({ message: "Internal API key is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const backendStarted = performance.now();
  const response = await fetch(`${apiBaseUrl}/api/v1/student/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-edusense-internal-key": internalApiKey,
      "x-edusense-student-email": user.email,
    },
    body: JSON.stringify({
      lecture_id: body.lectureId,
      message: body.message,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ message: "Student chat failed." }));
  const backendMs = performance.now() - backendStarted;
  const totalMs = performance.now() - started;
  return NextResponse.json(payload, {
    status: response.status,
    headers: { "Server-Timing": `backend;dur=${backendMs.toFixed(1)}, total;dur=${totalMs.toFixed(1)}` },
  });
}
