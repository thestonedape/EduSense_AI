import Link from "next/link";

import { AdminStatePanel } from "@/components/admin-state-panel";
import { ProcessingActions } from "@/components/processing-actions";
import { DataTable } from "@/components/data-table";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { getProcessing } from "@/lib/api/services";
import type { ProcessingJob } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProcessingMonitorPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Processing Queue</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Track lecture processing and review readiness</h1>
        <p className="mt-2 text-muted-foreground">
          Use this queue to track progress, restart stuck work, and move lectures into review once processing finishes.
        </p>
      </div>

      {loadFailed ? (
        <AdminStatePanel
          tone="error"
          eyebrow="Queue Load Failed"
          title="The processing queue lost its clipboard."
          description="We could not load the latest lecture queue from the backend right now. Give it another try, or jump back to lecture intake while the API settles."
          primaryHref="/admin/processing"
          primaryLabel="Retry Queue"
          secondaryHref="/admin/upload"
          secondaryLabel="Open Lecture Intake"
        />
      ) : jobs.length ? (
        <DataTable
          title="Lecture queue"
          columns={["Lecture", "Metadata", "Status", "Progress", "Accuracy", "Semantic State", "Actions"]}
          rows={jobs}
          renderRow={(job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.lectureName}</TableCell>
              <TableCell>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{job.departmentName || "No department"}{job.programName ? ` • ${job.programName}` : ""}</p>
                  <p>{job.subjectCode || "No subject code"}{job.subjectName ? ` • ${job.subjectName}` : ""}</p>
                  <p>{job.lectureNumber ? `Lecture ${job.lectureNumber}` : "Lecture number not set"}{job.lectureDate ? ` • ${job.lectureDate}` : ""}</p>
                  <p>{job.lectureDate || job.updatedAt}</p>
                </div>
              </TableCell>
              <TableCell><StatusBadge status={job.status} /></TableCell>
              <TableCell className="min-w-48"><ProgressBar value={job.progress} /></TableCell>
              <TableCell>{job.accuracyScore === null ? "-" : `${job.accuracyScore}%`}</TableCell>
              <TableCell>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{typeof job.metrics?.topics === "number" ? `${job.metrics.topics} topics` : "Topic count unavailable"}</p>
                  <p>
                    {typeof job.metrics?.approved_topics === "number"
                      ? `${job.metrics.approved_topics} approved for KB`
                      : "Approved count unavailable"}
                  </p>
                  <p>
                    {typeof job.metrics?.cleaned_sentences === "number"
                      ? `${job.metrics.cleaned_sentences} cleaned sentences`
                      : "Legacy transcript structure"}
                  </p>
                  <p>
                    {typeof job.metrics?.safe_topics === "number" || typeof job.metrics?.flagged_topics === "number"
                      ? `${Number(job.metrics?.safe_topics ?? 0)} safe • ${Number(job.metrics?.flagged_topics ?? 0)} flagged • ${Number(job.metrics?.unclear_topics ?? 0)} unclear`
                      : "Validation state unavailable"}
                  </p>
                  <p>
                    {job.latestJob
                      ? `${job.latestJob.jobType.replaceAll("_", " ")} • ${job.latestJob.stage.replaceAll("_", " ")}`
                      : "Job stage unavailable"}
                  </p>
                  <p>
                    {job.latestJob
                      ? `Retries ${job.latestJob.retryCount} • ${job.latestJob.status}`
                      : "Retry history unavailable"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/lectures/${job.id}`}>Open Workspace</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/transcript/${job.id}`}>Review Topics</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/admin/fact-check/${job.id}`}>Review Claims</Link>
                  </Button>
                </div>
                <ProcessingActions lectureId={job.id} canRebuild={job.status === "completed"} canResume={job.status === "pending" || job.status === "failed"} />
              </TableCell>
            </TableRow>
          )}
        />
      ) : (
        <AdminStatePanel
          tone="empty"
          eyebrow="Queue Empty"
          title="No lectures are waiting in the queue."
          description="Start by creating a lecture record and the queue will fill once processing begins."
          primaryHref="/admin/upload"
          primaryLabel="Create Lecture Record"
        />
      )}
    </div>
  );
}
