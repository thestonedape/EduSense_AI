import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
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
  const response = await fetch(`${apiBaseUrl}/api/v1/student/practice/attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-edusense-internal-key": internalApiKey,
      "x-edusense-student-email": user.email,
    },
    body: JSON.stringify({
      lecture_id: body.lectureId,
      question_id: body.questionId,
      question: body.question,
      selected_answer: body.selectedAnswer,
      correct_answer: body.correctAnswer,
      explanation: body.explanation,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ message: "Quiz attempt save failed." }));
  return NextResponse.json(payload, { status: response.status });
}
