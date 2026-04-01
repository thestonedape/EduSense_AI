import { CourseCard } from "@/components/course-card";
import { Navbar } from "@/components/navbar";
import { getCourses } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}
