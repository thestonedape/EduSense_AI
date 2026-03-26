import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lecture } from "@/types";

const statusVariant = {
  completed: "success",
  in_progress: "warning",
  not_started: "outline",
} as const;

export function LectureCard({ lecture }: { lecture: Lecture }) {
  return (
    <Link href={`/lecture/${lecture.id}`}>
      <Card className="h-full transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge variant={statusVariant[lecture.status]}>{lecture.status.replace("_", " ")}</Badge>
            <span className="text-sm text-muted-foreground">{lecture.duration}</span>
          </div>
          <CardTitle>{lecture.title}</CardTitle>
          <CardDescription>{lecture.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm font-medium">
          <span className="text-primary">Open lecture</span>
          <PlayCircle className="h-4 w-4 text-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}
