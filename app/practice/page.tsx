import { Navbar } from "@/components/navbar";
import { QuizCard } from "@/components/quiz-card";
import { getPracticeQuestions } from "@/lib/api/services";

export default async function PracticePage() {
  const questions = await getPracticeQuestions();

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Practice</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Check understanding with focused quizzes</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Practice stays lightweight: answer, review the explanation, and jump back to the lecture if needed.
          </p>
        </div>
        <div className="grid gap-4">
          {questions.map((question) => (
            <QuizCard key={question.id} question={question} />
          ))}
        </div>
      </main>
    </div>
  );
}
