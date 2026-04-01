import Link from "next/link";
import { CalendarDays, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentLectureSummary } from "@/types";

export function LectureCard({ lecture }: { lecture: StudentLectureSummary }) {
  return (
    <Link href={`/lecture/${lecture.id}`}>
      <Card className="h-full overflow-hidden border-border/80 transition-transform duration-200 hover:-translate-y-1 hover:border-primary/25">
        <CardHeader className="space-y-4 bg-[linear-gradient(180deg,_rgba(14,165,233,0.08),_rgba(255,255,255,0))]">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="success">{lecture.validationSource.replace("-", " ")}</Badge>
            <span className="text-sm text-muted-foreground">
              {lecture.topicCount} topic{lecture.topicCount === 1 ? "" : "s"}
            </span>
          </div>
          <CardTitle className="text-xl">{lecture.lectureName}</CardTitle>
          <CardDescription className="line-clamp-4 leading-6">{lecture.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm font-medium">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {lecture.lectureDate ?? "Date not set"}
            </span>
            <PlayCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">
            {lecture.facultyName || "Lecture ready to study"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
