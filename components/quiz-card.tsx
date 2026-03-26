"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestion } from "@/types";

export function QuizCard({ question }: { question: QuizQuestion }) {
  const [selection, setSelection] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
        <CardDescription>Choose the best answer, then review the explanation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const correct = revealed && index === question.answer;
            const wrong = revealed && selection === index && index !== question.answer;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                  correct ? "border-success bg-success/10" : wrong ? "border-danger bg-danger/10" : "border-border bg-card"
                }`}
              >
                <input type="radio" name={question.id} checked={selection === index} onChange={() => setSelection(index)} />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        <Button onClick={() => setRevealed(true)} disabled={selection === null}>
          Check Answer
        </Button>
        {revealed ? (
          <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
            {question.explanation}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
