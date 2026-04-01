import Link from "next/link";
import { ArrowRight, BookOpenText, LibraryBig } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSubject } from "@/types";

export function CourseCard({ course }: { course: StudentSubject }) {
  return (
    <Link href={`/course/${course.id}`}>
      <Card className="h-full overflow-hidden border-border/80 transition-transform duration-200 hover:-translate-y-1 hover:border-primary/25">
        <CardHeader className="space-y-4 bg-[linear-gradient(180deg,_rgba(14,165,233,0.08),_rgba(255,255,255,0))]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardDescription className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {course.code}
              </CardDescription>
              <CardTitle className="text-xl">{course.name}</CardTitle>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription className="line-clamp-3 leading-6">{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
              <BookOpenText className="h-4 w-4" />
              {course.lectureCount} ready lecture{course.lectureCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
              <LibraryBig className="h-4 w-4" />
              {course.referenceCount} reference file{course.referenceCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {[course.departmentName, course.programName].filter(Boolean).join(" • ") || "Student-ready subject"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
