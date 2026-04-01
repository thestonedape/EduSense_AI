import Link from "next/link";

import { AdminStatePanel } from "@/components/admin-state-panel";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProcessing } from "@/lib/api/services";
import type { ProcessingJob } from "@/types";

export default async function TranscriptIndexPage() {
  let jobs: ProcessingJob[] = [];
  let loadFailed = false;

  try {
    jobs = await getProcessing();
  } catch {
    loadFailed = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Topic Review</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Open a lecture for topic review</h1>
        <p className="mt-2 text-muted-foreground">
          Review the semantic topics, refine their summaries, and clean the source sentences under each topic.
        </p>
      </div>

      <div className="grid gap-4">
        {loadFailed ? (
          <AdminStatePanel
            tone="error"
            eyebrow="Topic Review Offline"
            title="The topic board lost its sticky notes."
            description="We could not load the lecture list for topic review right now. Try again in a moment, or inspect the processing queue first."
            primaryHref="/admin/transcript"
            primaryLabel="Retry Topic Review"
            secondaryHref="/admin/processing"
            secondaryLabel="Open Processing Queue"
          />
        ) : jobs.length ? (
          jobs.map((job) => (
            <Card key={job.id} className="bg-white">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>{job.lectureName}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[job.departmentName, job.programName, job.subjectCode, job.subjectName]
                      .filter(Boolean)
                      .join(" • ") || "Academic metadata not set"}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Progress: {job.progress}%{job.accuracyScore === null ? "" : ` • Accuracy: ${job.accuracyScore}%`}</p>
                  <p>
                    {typeof job.metrics?.topics === "number"
                      ? `${job.metrics.topics} semantic topics`
                      : "Topic metrics unavailable"}
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/admin/transcript/${job.id}`}>Open topic review</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <AdminStatePanel
            tone="empty"
            eyebrow="No Topics To Review"
            title="The topic review table is clear for now."
            description="Once lectures are uploaded and processed, they will appear here for semantic topic cleanup and summary editing."
            primaryHref="/admin/upload"
            primaryLabel="Open Lecture Intake"
          />
        )}
      </div>
    </div>
  );
}
