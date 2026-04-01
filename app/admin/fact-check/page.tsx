import Link from "next/link";

import { AdminStatePanel } from "@/components/admin-state-panel";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProcessing } from "@/lib/api/services";
import type { ProcessingJob } from "@/types";

export default async function FactCheckIndexPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flagged Claims</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Review lectures with suspicious claims</h1>
        <p className="mt-2 text-muted-foreground">
          This queue is for lecture-level false-claim review only. Open a lecture to inspect flagged claims against whole-lecture evidence.
        </p>
      </div>

      <div className="grid gap-4">
        {loadFailed ? (
          <AdminStatePanel
            tone="error"
            eyebrow="Claims Queue Offline"
            title="The flagged-claims desk dropped the folder."
            description="We could not load the current lecture review queue. Try again in a moment, or open the processing queue to confirm the backend is healthy."
            primaryHref="/admin/fact-check"
            primaryLabel="Retry Flagged Claims"
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
                <p className="text-sm text-muted-foreground">
                  Progress: {job.progress}%
                  {job.status === "processing"
                    ? " • rebuilding flagged-claim review"
                    : typeof job.metrics?.claims === "number"
                      ? ` • ${job.metrics.claims} flagged claims`
                      : " • flagged-claim count unavailable"}
                </p>
                <Button asChild>
                  <Link href={`/admin/fact-check/${job.id}`}>Open flagged claims</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <AdminStatePanel
            tone="empty"
            eyebrow="Nothing Flagged Yet"
            title="No lecture has raised a red flag so far."
            description="That can mean no lectures were uploaded yet, or the current ones have not finished validation. Start with lecture intake or check the processing queue."
            primaryHref="/admin/upload"
            primaryLabel="Open Lecture Intake"
            secondaryHref="/admin/processing"
            secondaryLabel="Open Processing Queue"
          />
        )}
      </div>
    </div>
  );
}
