import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeTopic } from "@/types";

export function TopicList({ topics }: { topics: KnowledgeTopic[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{topic.name}</p>
                {topic.summary ? <p className="mt-1 text-sm text-muted-foreground">{topic.summary}</p> : null}
                <p className="mt-2 text-sm text-muted-foreground">{topic.linkedLectures.join(", ")}</p>
              </div>
              <span className="text-sm font-semibold">{topic.validatedClaims} claims</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
