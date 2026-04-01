import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarDays, FileStack, GraduationCap, Sparkles } from "lucide-react";

import { ChatPanel } from "@/components/chat-panel";
import { LectureProgressPing } from "@/components/lecture-progress-ping";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLecture } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function LecturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lecture = await getLecture(id);

  if (!lecture) {
    notFound();
  }

  return (
    <div>
      <LectureProgressPing lectureId={lecture.id} />
      <Navbar />
      <main className="page-wrap space-y-8">
        <section className="surface overflow-hidden p-5 sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_340px]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Validated Lecture</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{lecture.lectureName}</h1>
                <Badge variant="success">{lecture.validationSource.replace("-", " ")}</Badge>
              </div>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">{lecture.summary}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-5">
                  <Link href="/practice" className="gap-2">
                    Practice This Subject
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/courses">Back to Subjects</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <Card className="border-primary/15 bg-primary/5">
                <CardContent className="space-y-3 py-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <BrainCircuit className="h-4 w-4" />
                    Topics
                  </div>
                  <p className="font-display text-3xl font-semibold">{lecture.topics.length}</p>
                  <p className="text-sm text-muted-foreground">Approved topic blocks ready for learning.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-3 py-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FileStack className="h-4 w-4 text-primary" />
                    References
                  </div>
                  <p className="font-display text-3xl font-semibold">{lecture.referenceFiles.length}</p>
                  <p className="text-sm text-muted-foreground">Trusted files linked to this lecture.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="py-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Subject
                </div>
                <p className="mt-2 text-base font-semibold">{[lecture.subjectCode, lecture.subjectName].filter(Boolean).join(" • ") || "Lecture"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Delivered
                </div>
                <p className="mt-2 text-base font-semibold">{lecture.lectureDate || "Date not set"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                <p className="mt-2 text-base font-semibold">{lecture.facultyName || "Faculty not set"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                <p className="text-sm font-medium text-muted-foreground">Program</p>
                <p className="mt-2 text-base font-semibold">{lecture.programName || "Validated lecture"}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Outline</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {lecture.topics.length ? (
                  lecture.topics.map((topic) => (
                    <div key={topic.id} className="rounded-[24px] border border-border bg-muted/35 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium">{topic.title}</h3>
                        <Badge variant={topic.source === "Reference" ? "success" : "neutral"}>{topic.source}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{topic.summary}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Topic summaries will appear here once lecture structuring completes.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Prompts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {lecture.recommendedQuestions.map((question) => (
                  <div key={question} className="rounded-[24px] border border-border bg-card px-4 py-4 text-sm leading-6 text-muted-foreground">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Prompt
                    </div>
                    {question}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reference Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {lecture.referenceFiles.length ? (
                  lecture.referenceFiles.map((file) => (
                    <div key={file} className="rounded-[24px] border border-border bg-muted/35 px-4 py-4">
                      {file}
                    </div>
                  ))
                ) : (
                  <p>This lecture was reviewed without uploaded college reference files, so tutor answers rely on validated lecture knowledge.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <ChatPanel lectureId={lecture.id} lectureTitle={lecture.lectureName} />
        </section>
      </main>
    </div>
  );
}
