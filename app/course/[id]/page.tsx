import { notFound } from "next/navigation";

import { LectureCard } from "@/components/lecture-card";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { getCourse } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCourse(id);

  if (!data?.subject) {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-8">
        <section className="surface p-5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{data.subject.code}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{data.subject.name}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{data.subject.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {[data.subject.departmentName, data.subject.programName].filter(Boolean).join(" • ") || "Validated subject"}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Validated Lectures</h2>
          {data.lectures.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.lectures.map((lecture) => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                No student-ready lectures are available in this subject yet.
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
