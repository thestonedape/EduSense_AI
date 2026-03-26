import { CourseCard } from "@/components/course-card";
import { Navbar } from "@/components/navbar";
import { getCourses } from "@/lib/api/services";
import { Course } from "@/types";

export default async function CoursesPage() {
  const courses = (await getCourses()) as Course[];

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Courses</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Your course library</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A clean overview of every enrolled course, with progress front and center.
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
