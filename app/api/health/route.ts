import { NextResponse } from "next/server";

export async function GET() {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

  if (!apiBaseUrl) {
    return NextResponse.json({
      status: "unavailable",
      message: "Backend is not configured yet",
    });
  }

  const healthUrl = new URL("/health", apiBaseUrl).toString();

  try {
    const response = await fetch(healthUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      return NextResponse.json({
        status: "ready",
        message: "Platform is ready",
      });
    }

    if ([502, 503, 504].includes(response.status)) {
      return NextResponse.json({
        status: "waking",
        message: "Backend is waking up. This can take a few seconds.",
      });
    }

    return NextResponse.json({
      status: "unavailable",
      message: "Backend is not responding yet",
    });
  } catch {
    return NextResponse.json({
      status: "waking",
      message: "Backend is waking up. This can take a few seconds.",
    });
  }
}
