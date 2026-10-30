import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { QuizCard } from "@/components/quiz-card";
import { Card, CardContent } from "@/components/ui/card";
import { getPracticeQuestions } from "@/lib/api/server-services";

export const dynamic = "force-dynamic";

async function PracticeContent() {
  const questions = await getPracticeQuestions(9);
  const groups = questions.reduce<Record<string, typeof questions>>((accumulator, question) => {
    const key = question.subjectId || question.subjectName || question.subjectCode || "general";
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(question);
    return accumulator;
  }, {});
  const subjectGroups = Object.entries(groups);

  return (
    <>
        <section className="surface overflow-hidden p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Practice</p>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Practice in clear subject-wise sets
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Each question set is grouped from reviewed lecture knowledge so revision feels organized and easier to follow.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-primary/15 bg-primary/5">
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{questions.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{subjectGroups.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">Lectures covered</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {new Set(questions.map((question) => question.lectureId)).size}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {questions.length ? (
          <div className="space-y-8">
            {subjectGroups.map(([groupKey, groupQuestions]) => {
              const lead = groupQuestions[0];
              return (
                <section key={groupKey} className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                        {lead.subjectCode || "Subject"}
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-semibold">
                        {lead.subjectName || lead.lectureName}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {groupQuestions.length} question{groupQuestions.length === 1 ? "" : "s"} in this set
                    </p>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {groupQuestions.map((question) => (
                      <QuizCard key={question.id} question={question} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Practice sets will appear here once reviewed lectures are available.
            </CardContent>
          </Card>
        )}
    </>
  );
}

function PracticeSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading practice">
      <section className="surface grid gap-6 p-5 sm:p-8 lg:grid-cols-2" aria-hidden="true">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="surface h-48 animate-pulse p-5" />
        ))}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-8">
        <Suspense fallback={<PracticeSkeleton />}>
          <PracticeContent />
        </Suspense>
      </main>
    </div>
  );
}
