import { Suspense } from "react";
import { CourseCard } from "@/components/course-card";
import { Navbar } from "@/components/navbar";
import { getCourses } from "@/lib/api/server-services";

export const dynamic = "force-dynamic";

async function CourseGrid() {
  const courses = await getCourses();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading subjects">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="surface space-y-4 p-6" aria-hidden="true">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-12 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Subjects</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Your study subjects</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Browse the subjects that already have reviewed lecture material ready for students.
          </p>
        </div>
        <Suspense fallback={<CourseGridSkeleton />}>
          <CourseGrid />
        </Suspense>
      </main>
    </div>
  );
}
