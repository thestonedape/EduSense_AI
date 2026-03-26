import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { LectureCard } from "@/components/lecture-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/api/services";
import { lectures } from "@/lib/data/mock-data";
import { Course } from "@/types";

export default async function StudentDashboardPage() {
  const courses = await getCourses();
  const recent = lectures.slice(0, 2);
  const recommended = lectures.filter((lecture) => lecture.recommended);

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-8">
        <section className="surface overflow-hidden p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Student Portal</p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Learn without the noise. Watch, ask, practice, repeat.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                The student experience stays intentionally simple: lectures, guided help, and focused practice.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/courses" className="gap-2">
                    Explore Courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/practice">Open Practice</Link>
                </Button>
              </div>
            </div>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Return to your last in-progress lecture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recent.map((lecture) => (
                  <div key={lecture.id} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="font-medium">{lecture.title}</p>
                    <p className="mt-1 text-sm text-primary-foreground/80">{lecture.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Enrolled Courses</h2>
              <p className="text-muted-foreground">Track progress and jump back into the next module.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Recommended Lectures</h2>
            <p className="text-muted-foreground">Curated next steps based on your current learning path.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommended.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
