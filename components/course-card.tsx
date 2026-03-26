import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/course/${course.id}`}>
      <Card className="h-full transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.code}</CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{course.progress}%</span>
          </div>
          <Progress value={course.progress} />
          <p className="text-sm text-muted-foreground">{course.totalLectures} lectures</p>
        </CardContent>
      </Card>
    </Link>
  );
}
