import Link from "next/link";
import { ArrowRight, BookMarked, BrainCircuit, ShieldCheck } from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { LectureCard } from "@/components/lecture-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses, getStudentDashboard } from "@/lib/api/services";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
const shouldLogHomeTiming = process.env.NODE_ENV === "development" || process.env.LOG_PAGE_TIMINGS === "true";

export default async function StudentDashboardPage() {
  const startedAt = Date.now();
  const user = await getSessionUser();
  const sessionResolvedAt = Date.now();
  const subjectsPromise = getCourses();
  const studentDashboardPromise = user ? getStudentDashboard(user.email).catch(() => null) : Promise.resolve(null);

  const [subjects, studentDashboard] = await Promise.all([
    subjectsPromise,
    studentDashboardPromise,
  ]);
  const dataResolvedAt = Date.now();
  const featuredSubjects = subjects.slice(0, 3);
  const recentLectures = studentDashboard?.recentLectures?.slice(0, 3) ?? [];

  if (shouldLogHomeTiming) {
    console.info(
      `[page-timing] / session=${sessionResolvedAt - startedAt}ms data=${dataResolvedAt - sessionResolvedAt}ms total=${dataResolvedAt - startedAt}ms subjects=${subjects.length} recents=${recentLectures.length}`,
    );
  }

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-8">
        <section className="surface overflow-hidden p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Student Portal</p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Study from validated lecture knowledge, not noisy raw transcripts.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Every lecture here comes from the reviewed knowledge flow. Trusted references lead the way, and the tutor
                answers from validated study context only.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/courses" className="gap-2">
                    Explore Subjects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/practice">Open Practice</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                  Validated Learning
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Student answers and notes are grounded in approved lecture knowledge.
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-3 text-sm text-primary-foreground/90">
                <p>{subjects.length} subject areas are currently ready for students.</p>
                <p>{recentLectures.length} recent lecture sessions are already available for revision.</p>
                {studentDashboard ? (
                  <p>
                    {studentDashboard.stats.completedLectures} completed lecture
                    {studentDashboard.stats.completedLectures === 1 ? "" : "s"} • {studentDashboard.stats.quizAttempts} quiz
                    attempt{studentDashboard.stats.quizAttempts === 1 ? "" : "s"}
                  </p>
                ) : null}
              </CardContent>
            </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookMarked className="h-5 w-5 text-primary" />
                      Trusted Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    College-provided references are used directly whenever they exist.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      Tutor Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Ask questions inside each lecture and get answers with cited validated context.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Validated Subjects</h2>
            <p className="text-muted-foreground">Only completed and student-safe lecture material appears here.</p>
          </div>
          {featuredSubjects.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredSubjects.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                No validated subjects are ready yet. Upload and review lectures in the admin portal first.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Recent Lecture Sessions</h2>
            <p className="text-muted-foreground">Continue with recently validated lecture material.</p>
          </div>
          {recentLectures.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentLectures.map((lecture) => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                Recent lecture cards will appear here once a subject has completed student-safe processing.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Practice Ready</h2>
            <p className="text-muted-foreground">Jump into subject-wise revision questions without waiting for the dashboard to generate them here.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Open the full practice workspace</CardTitle>
              <CardDescription>
                Practice is now grouped by subject and lecture inside its own screen so the dashboard stays faster and cleaner.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Use the practice page when you want exam-style questions, answer checking, and lecture-wise revision blocks.
              </p>
              <Button asChild>
                <Link href="/practice" className="gap-2">
                  Go To Practice
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
