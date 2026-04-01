"use client";

import { useEffect } from "react";

export function LectureProgressPing({ lectureId }: { lectureId: string }) {
  useEffect(() => {
    void fetch("/api/student/progress/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lectureId }),
    });
  }, [lectureId]);

  return null;
}
