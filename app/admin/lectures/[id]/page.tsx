import Link from "next/link";

import { LectureLiveStatus } from "@/components/lecture-live-status";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLectureDetail } from "@/lib/api/services";

const stageOrder = [
  "uploaded",
  "transcribed",
  "cleaned",
  "topic-grouped",
  "topic-review-needed",
  "knowledge-ready",
];

export default async function LectureWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let lecture;
  try {
    lecture = await getLectureDetail(id);
  } catch {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Lecture Workspace</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Connection hiccup</h1>
          <p className="mt-2 text-muted-foreground">
            The lecture is probably still processing, but the workspace could not load its latest state right now.
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Try Again</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Refresh this page in a few seconds. We now retry brief backend connection resets automatically, but this request still failed after multiple attempts.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/admin/lectures/${id}`}>Retry Lecture Workspace</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/processing">Open Processing Queue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = lecture.metrics ?? {};
  const cleanedSentences = Number(metrics.cleaned_sentences ?? 0);
  const topicCount = Number(metrics.topics ?? lecture.topics.length ?? 0);
  const claimCount = Number(metrics.claims ?? 0);
  const safeTopics = Number(metrics.safe_topics ?? lecture.topics.filter((topic) => topic.validationState === "safe").length ?? 0);
  const flaggedTopics = Number(metrics.flagged_topics ?? lecture.topics.filter((topic) => topic.validationState === "flagged").length ?? 0);
  const unclearTopics = Number(metrics.unclear_topics ?? lecture.topics.filter((topic) => topic.validationState === "unclear").length ?? 0);
  const approvedTopics = Number(metrics.approved_topics ?? lecture.topics.filter((topic) => topic.approvedForKb).length ?? 0);
  const referenceCount = lecture.referenceFiles.length;
  const contentItemCount = lecture.contentItems.length;
  const semanticVersion = typeof metrics.semantic_pipeline_version === "string" ? metrics.semantic_pipeline_version : "legacy";
  const latestJob = lecture.latestJob;
  const statusMessage =
    lecture.status === "pending"
      ? "Lecture uploaded. Processing has not finished yet."
      : lecture.status === "processing"
        ? "Lecture is currently being processed. Wait for cleaned sentences, LLM topic grouping, and flagged-claim checks to finish."
        : lecture.status === "failed"
          ? "Lecture processing failed. Open the review queue and inspect the failure before retrying."
          : topicCount === 0
            ? "Lecture exists, but no semantic topics have been produced yet."
            : "Lecture structure is available for semantic review.";

  const completedStages = new Set<string>(["uploaded"]);
  if (lecture.transcript.length > 0) completedStages.add("transcribed");
  if (cleanedSentences > 0) completedStages.add("cleaned");
  if (topicCount > 0) completedStages.add("topic-grouped");
  if (topicCount > 0) completedStages.add("topic-review-needed");
  if (claimCount > 0) completedStages.add("knowledge-ready");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Lecture Workspace</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{lecture.lectureName}</h1>
          <p className="mt-2 text-muted-foreground">
            Review this lecture as a semantic knowledge unit before exposing it to downstream RAG workflows.
          </p>
        </div>
        <StatusBadge status={lecture.status} />
      </div>

      <LectureLiveStatus lectureId={lecture.id} status={lecture.status} progress={lecture.progress} stage={latestJob?.stage ?? null} />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Lecture Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Department" value={lecture.departmentName || "Not set"} />
              <Info label="Program" value={lecture.programName || "Not set"} />
              <Info label="Subject" value={lecture.subjectName || "Not set"} />
              <Info label="Subject Code" value={lecture.subjectCode || "Not set"} />
              <Info label="Lecture Number" value={lecture.lectureNumber ? String(lecture.lectureNumber) : "Not set"} />
              <Info label="Lecture Date" value={lecture.lectureDate || "Not set"} />
              <Info label="Faculty" value={lecture.facultyName || "Not set"} />
              <Info label="Uploaded File" value={lecture.originalFilename || "Unknown"} />
              <Info label="Content Items" value={String(contentItemCount)} />
              <Info label="Semantic Pipeline" value={semanticVersion} />
              <Info label="Created" value={lecture.createdAt} />
              <Info label="Updated" value={lecture.updatedAt} />
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
              <Metric label="Progress" value={`${lecture.progress}%`} />
              <Metric label="Topics" value={String(topicCount)} />
              <Metric label="Safe Topics" value={String(safeTopics)} />
              <Metric label="Approved Topics" value={String(approvedTopics)} />
              <Metric label="Flagged Topics" value={String(flaggedTopics)} />
              <Metric label="Unclear Topics" value={String(unclearTopics)} />
              <Metric label="Flagged Claims" value={String(claimCount)} />
            </div>

            <div className="rounded-2xl border border-border/70 p-4">
              <p className="text-sm font-medium text-slate-900">Lecture Content Inventory</p>
              {contentItemCount ? (
                <div className="mt-3 space-y-2">
                  {lecture.contentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <span className="text-slate-800">{item.originalFilename}</span>
                      <span className="text-muted-foreground">{item.role.replaceAll("_", " ")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No lecture content items were recorded for this lecture yet.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 p-4">
              <p className="text-sm font-medium text-slate-900">Reference Files</p>
              {referenceCount ? (
                <div className="mt-3 space-y-2">
                  {lecture.referenceFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <span className="text-slate-800">{file.originalFilename}</span>
                      <span className="text-muted-foreground">{file.fileType.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No reference PPT/PDF files attached yet. The lecture can still be processed, but validation will later be stronger if reference material is uploaded.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Validation Check</p>
              <p className="mt-2 text-sm text-muted-foreground">{statusMessage}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {approvedTopics > 0
                  ? `${approvedTopics} topic${approvedTopics === 1 ? "" : "s"} are already approved for the student knowledge base.`
                  : "No lecture topics are approved for the student knowledge base yet."}
              </p>
              {lecture.status === "failed" && lecture.metrics?.downstream_refresh ? (
                <p className="mt-2 text-sm text-danger">{String(lecture.metrics.downstream_refresh)}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border/70 p-4">
              <p className="text-sm font-medium text-slate-900">Latest Background Job</p>
              {latestJob ? (
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>{latestJob.jobType.replaceAll("_", " ")} • {latestJob.status}</p>
                  <p>Stage: {latestJob.stage.replaceAll("_", " ")}</p>
                  <p>Retries: {latestJob.retryCount}</p>
                  <p>Started: {latestJob.startedAt || "Not started yet"}</p>
                  <p>Finished: {latestJob.finishedAt || "Still running"}</p>
                  {latestJob.errorMessage ? <p className="text-danger">{latestJob.errorMessage}</p> : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No processing job record is attached to this lecture yet.
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-2xl border border-border/70 p-4">
              <p className="text-sm font-medium text-slate-700">Pipeline Timeline</p>
              <div className="grid gap-2">
                {stageOrder.map((stage) => (
                  <div key={stage} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="capitalize text-slate-700">{stage.replaceAll("-", " ")}</span>
                    <span className={completedStages.has(stage) ? "font-medium text-success" : "text-muted-foreground"}>
                      {completedStages.has(stage) ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Next Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-center">
              <Link href={`/admin/transcript/${lecture.id}`}>Review Topics</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-center">
              <Link href={`/admin/fact-check/${lecture.id}`}>Open Flagged Claims</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-center">
              <Link href="/admin/processing">Back To Review Queue</Link>
            </Button>

            <div className="rounded-2xl border border-border/70 bg-slate-50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-slate-900">Current Summary</p>
              <p className="mt-2">{lecture.summary || "Summary will appear after transcript cleaning completes."}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-slate-50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-slate-900">Current Pipeline</p>
              <p className="mt-2">
                {semanticVersion === "v2-openrouter"
                  ? "OpenRouter-backed semantic topic grouping is active for this lecture."
                  : "Fallback semantic grouping is active. Add your OpenRouter key and rebuild the lecture to switch to the LLM path."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
