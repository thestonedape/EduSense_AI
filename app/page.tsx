import Link from "next/link";
import {
  ArrowRight,
  BookCheck,
  BrainCircuit,
  GraduationCap,
  LibraryBig,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { LectureCard } from "@/components/lecture-card";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses, getStudentDashboard } from "@/lib/api/services";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const shouldLogHomeTiming = process.env.NODE_ENV === "development" || process.env.LOG_PAGE_TIMINGS === "true";

const studySignals = [
  {
    title: "Validated lecture flow",
    description: "Study from approved lecture knowledge instead of noisy transcripts or random chatbot guesses.",
    icon: ShieldCheck,
  },
  {
    title: "Grounded doubt solving",
    description: "Ask questions against reviewed academic context and stay inside one calm study workspace.",
    icon: BrainCircuit,
  },
  {
    title: "Revision that sticks",
    description: "Move from lecture summaries to practice and follow-up questions without breaking focus.",
    icon: Sparkles,
  },
];

export default async function StudentDashboardPage() {
  const startedAt = Date.now();
  const user = await getSessionUser();
  const sessionResolvedAt = Date.now();

  const subjectsPromise = getCourses().catch(() => null);
  const studentDashboardPromise = user ? getStudentDashboard(user.email).catch(() => null) : Promise.resolve(null);

  const [subjects, studentDashboard] = await Promise.all([subjectsPromise, studentDashboardPromise]);
  const dataResolvedAt = Date.now();

  const backendWakingUp = subjects === null;
  const safeSubjects = subjects ?? [];
  const featuredSubjects = safeSubjects.slice(0, 3);
  const recentLectures = studentDashboard?.recentLectures?.slice(0, 3) ?? [];

  if (shouldLogHomeTiming) {
    console.info(
      `[page-timing] / session=${sessionResolvedAt - startedAt}ms data=${dataResolvedAt - sessionResolvedAt}ms total=${dataResolvedAt - startedAt}ms subjects=${safeSubjects.length} recents=${recentLectures.length}`,
    );
  }

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,245,238,0.96))] px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(24,91,99,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(24,91,99,0.06)_1px,transparent_1px)] bg-[size:34px_34px] opacity-35" />
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#d5ebe6] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#f0dec9] blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="rounded-full border-primary/20 bg-white/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-primary">
                  Student Workspace
                </Badge>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-slate-600">
                  Reviewed Learning Context
                </Badge>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  A cleaner study portal built around lectures that have already been validated.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  EduSense brings lecture notes, grounded doubt solving, and revision practice into one calm interface.
                  Students study from approved material first, then ask follow-up questions without leaving the flow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 rounded-full px-6">
                  <Link href="/courses">
                    Explore Subjects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/doubts">Open Doubt Solver</Link>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {studySignals.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] backdrop-blur"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.9rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Today in EduSense</p>
                    <p className="font-display text-2xl font-semibold text-slate-950">
                      {backendWakingUp ? "Warming up the study backend" : "Ready for focused revision"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.3rem] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Subjects</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{safeSubjects.length}</p>
                    <p className="mt-1 text-sm text-slate-600">validated subject areas</p>
                  </div>
                  <div className="rounded-[1.3rem] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Recent lectures</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{recentLectures.length}</p>
                    <p className="mt-1 text-sm text-slate-600">ready to revisit</p>
                  </div>
                  <div className="rounded-[1.3rem] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Completed</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{studentDashboard?.stats.completedLectures ?? 0}</p>
                    <p className="mt-1 text-sm text-slate-600">tracked lecture sessions</p>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-[#fcfbf8] p-5">
                  {backendWakingUp ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">Backend is waking up</p>
                        <p className="text-sm leading-7 text-slate-600">
                          The server was asleep, so live data is taking a few extra seconds. The page is stable, and a refresh should usually bring everything in once the backend is awake.
                        </p>
                        <Button asChild variant="outline" className="rounded-full">
                          <Link href="/">Refresh Home</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Why this feels better</p>
                      <div className="space-y-3 text-sm leading-7 text-slate-600">
                        <p>Students only see lecture material that has already crossed the review pipeline.</p>
                        <p>Doubt solving and revision are grounded in approved context instead of generic model responses.</p>
                        <p>The experience is structured to keep you studying, not navigating admin noise.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-border/70 bg-white/85 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BookCheck className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-slate-900">Trusted notes first</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Reference-backed and reviewed lecture knowledge leads the student experience wherever possible.
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-border/70 bg-white/85 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <LibraryBig className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-slate-900">One revision loop</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Move from subject overview to lecture reading, practice, and follow-up doubts without breaking focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.8rem] border border-border/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary">Validated Subjects</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">Start from a subject, not a mess of files.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Each subject groups reviewed lecture content so students can enter through a cleaner academic structure.
                </p>
              </div>
              <Button asChild variant="outline" className="hidden rounded-full sm:inline-flex">
                <Link href="/courses">View all subjects</Link>
              </Button>
            </div>

            <div className="mt-6">
              {featuredSubjects.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredSubjects.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : backendWakingUp ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-sm leading-7 text-muted-foreground">
                    Subject cards will appear here as soon as the backend finishes waking up and sends the validated catalog.
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-sm leading-7 text-muted-foreground">
                    No validated subjects are ready yet. Once lectures finish the review flow, they will appear here automatically.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-border/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Study Flow</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">How students use EduSense</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">1. Open a validated subject</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">Start with the subject overview instead of hunting across random resources.</p>
              </div>
              <div className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">2. Revisit a lecture with context</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">Lecture summaries, approved topics, and references keep the study material trustworthy.</p>
              </div>
              <div className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">3. Ask doubts and practice</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">Use grounded AI help and revision questions without switching into a separate toolchain.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-border/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary">Recent Lecture Sessions</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">Pick up where your revision left off.</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Continue from recently validated lecture material without rebuilding context each time you come back.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden rounded-full sm:inline-flex">
              <Link href="/practice">Open practice</Link>
            </Button>
          </div>

          <div className="mt-6">
            {recentLectures.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentLectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-sm leading-7 text-muted-foreground">
                  Recent lecture cards will appear here once validated student-safe lecture sessions are available for revision.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.8rem] bg-primary p-6 text-primary-foreground shadow-panel">
            <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/80">Grounded AI Support</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Ask questions from approved study context.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/85">
              The doubt solver is meant for follow-up learning, simpler explanations, and subject-scoped revision help using the reviewed lecture knowledge base.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="rounded-full">
                <Link href="/doubts">Open Doubt Solver</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/practice">Start Practice</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,244,238,0.96))] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Why this portal exists</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">Students should not have to study from the pipeline mess.</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>EduSense separates the admin validation flow from the student learning experience, so students get clarity instead of raw transcript clutter.</p>
              <p>Lecture content enters this portal only after processing, review, and topic-level safety checks.</p>
              <p>That makes the student side calmer, more trustworthy, and better suited for long study sessions.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
