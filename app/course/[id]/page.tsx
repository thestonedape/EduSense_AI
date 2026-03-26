import { notFound } from "next/navigation";

import { LectureCard } from "@/components/lecture-card";
import { Navbar } from "@/components/navbar";
import { getCourse } from "@/lib/api/services";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCourse(id);

  if (!data?.course) {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-8">
        <section className="surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{data.course.code}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{data.course.name}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{data.course.description}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Lectures</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.lectures.map((lecture: (typeof data.lectures)[number]) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
