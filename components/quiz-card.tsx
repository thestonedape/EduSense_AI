"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Sparkles, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PracticeQuestion } from "@/types";

export function QuizCard({ question }: { question: PracticeQuestion }) {
  const [selection, setSelection] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const optionLabels = ["A", "B", "C", "D"];

  async function handleCheckAnswer() {
    if (selection === null) return;
    setRevealed(true);
    if (saved) return;

    try {
      await fetch("/api/student/practice/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureId: question.lectureId,
          questionId: question.id,
          question: question.question,
          selectedAnswer: selection,
          correctAnswer: question.answer,
          explanation: question.explanation,
        }),
      });
      setSaved(true);
    } catch {
      // Keep quiz UX responsive even if persistence briefly fails.
    }
  }

  return (
    <Card className="overflow-hidden border-border/80">
      <CardHeader className="space-y-4 border-b border-border/70 bg-[linear-gradient(180deg,_rgba(14,165,233,0.08),_rgba(255,255,255,0))]">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <span className="rounded-full bg-primary/10 px-3 py-1">{question.subjectCode || "Practice"}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{question.lectureName}</span>
        </div>
        <CardTitle className="text-xl leading-8">{question.question}</CardTitle>
        <CardDescription className="text-sm leading-6">
          Pick the best answer from the validated lecture context, then check the short explanation below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const correct = revealed && index === question.answer;
            const wrong = revealed && selection === index && index !== question.answer;
            return (
              <button
                key={`${question.id}-${index}`}
                type="button"
                className={cn(
                  "flex w-full items-center gap-4 rounded-[24px] border px-4 py-4 text-left text-sm transition",
                  correct
                    ? "border-success bg-success/10"
                    : wrong
                      ? "border-danger bg-danger/10"
                      : selection === index
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-card hover:border-primary/20 hover:bg-muted/40",
                )}
                onClick={() => setSelection(index)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background text-xs font-semibold">
                  {optionLabels[index] ?? index + 1}
                </div>
                <div className="flex-1">
                  <p className="leading-6">{option}</p>
                </div>
                {correct ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : wrong ? (
                  <XCircle className="h-5 w-5 text-danger" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
        <Button onClick={handleCheckAnswer} disabled={selection === null} className="rounded-full px-5">
          Check Answer
        </Button>
        {revealed ? (
          <div className="rounded-[24px] border border-border bg-muted/50 p-4 text-sm leading-7 text-muted-foreground">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Why this answer works
            </div>
            <p>{question.explanation}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
