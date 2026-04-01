"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateLectureTopic, updateTopicApproval, updateTranscriptSegment } from "@/lib/api/services";
import { LectureDetail, LectureTopic, TranscriptSentence } from "@/types";

export function TranscriptEditor({ lecture }: { lecture: LectureDetail }) {
  const router = useRouter();
  const [topics, setTopics] = useState(lecture.topics);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [approvalId, setApprovalId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function badgeVariantForState(state?: string) {
    switch (state) {
      case "safe":
        return "success";
      case "flagged":
        return "danger";
      case "unclear":
        return "warning";
      default:
        return "neutral";
    }
  }

  function updateTopic(topicIndex: number, key: "title" | "summary", value: string) {
    setTopics((current) =>
      current.map((topic, index) => (index === topicIndex ? { ...topic, [key]: value } : topic)),
    );
  }

  function updateTranscript(topicIndex: number, segmentIndex: number, value: string) {
    setTopics((current) =>
      current.map((topic, index) =>
        index === topicIndex
          ? {
              ...topic,
              transcript: topic.transcript.map((segment, transcriptIndex) =>
                transcriptIndex === segmentIndex ? { ...segment, text: value } : segment,
              ),
            }
          : topic,
      ),
    );
  }

  async function saveTopic(topic: LectureTopic) {
    setSavingId(topic.id);
    setMessage("");

    try {
      for (const segment of topic.transcript) {
        await updateTranscriptSegment(segment.id, segment.text);
      }
      await updateLectureTopic(topic.id, {
          title: topic.title,
          summary: topic.summary,
        });
      setMessage(`Saved changes for ${topic.title}.`);
    } finally {
      setSavingId(null);
    }
  }

  async function changeApproval(topic: LectureTopic, approvedForKb: boolean) {
    setApprovalId(topic.id);
    setMessage("");

    try {
      const updated = await updateTopicApproval(topic.id, { approved_for_kb: approvedForKb, reviewed_by: "admin" });
      setTopics((current) =>
        current.map((item) =>
          item.id === topic.id
            ? {
                ...item,
                approvedForKb: Boolean(updated.approved_for_kb ?? updated.approvedForKb),
                validationState: updated.validation_state ?? updated.validationState ?? item.validationState,
                validationReason: updated.validation_reason ?? updated.validationReason ?? item.validationReason,
                claimCount: updated.claim_count ?? updated.claimCount ?? item.claimCount,
                falseClaimCount: updated.false_claim_count ?? updated.falseClaimCount ?? item.falseClaimCount,
              }
            : item,
        ),
      );
      setMessage(
        approvedForKb
          ? `Approved ${topic.title} for the student knowledge base.`
          : `Removed ${topic.title} from the student knowledge base.`,
      );
      router.refresh();
    } catch (error) {
      const value = error as { response?: { data?: { detail?: string } } };
      setMessage(value.response?.data?.detail ?? "Topic approval could not be updated.");
    } finally {
      setApprovalId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Topic Review</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{lecture.lectureName}</h1>
        <p className="mt-2 text-muted-foreground">Review each lecture topic, refine its summary, and clean the supporting transcript under it.</p>
      </div>

      {message ? <p className="text-sm font-medium text-success">{message}</p> : null}

      <div className="space-y-4">
        {topics.map((topic, topicIndex) => (
          <Card key={topic.id} className="bg-white">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-base">Topic {topicIndex + 1}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={badgeVariantForState(topic.validationState)}>
                      {(topic.validationState ?? "pending_review").replace("_", " ")}
                    </Badge>
                    <Badge variant={topic.approvedForKb ? "success" : "outline"}>
                      {topic.approvedForKb ? "Approved For KB" : "Not In KB"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {topic.falseClaimCount ?? 0} flagged claim{(topic.falseClaimCount ?? 0) === 1 ? "" : "s"} •{" "}
                      {topic.claimCount ?? 0} total linked claim{(topic.claimCount ?? 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => saveTopic(topic)} disabled={savingId === topic.id || approvalId === topic.id}>
                    {savingId === topic.id ? "Saving..." : "Save Topic"}
                  </Button>
                  <Button
                    onClick={() => changeApproval(topic, true)}
                    disabled={approvalId === topic.id || topic.validationState !== "safe" || topic.approvedForKb}
                  >
                    {approvalId === topic.id && !topic.approvedForKb ? "Updating..." : "Approve For KB"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => changeApproval(topic, false)}
                    disabled={approvalId === topic.id || !topic.approvedForKb}
                  >
                    {approvalId === topic.id && topic.approvedForKb ? "Updating..." : "Remove From KB"}
                  </Button>
                </div>
              </div>
              {topic.validationReason ? (
                <p className="text-sm text-muted-foreground">{topic.validationReason}</p>
              ) : null}
              <Input value={topic.title} onChange={(event) => updateTopic(topicIndex, "title", event.target.value)} />
              <Input value={topic.summary} onChange={(event) => updateTopic(topicIndex, "summary", event.target.value)} />
            </CardHeader>
            <CardContent className="space-y-3">
              {topic.transcript.length ? (
                topic.transcript.map((segment: TranscriptSentence, segmentIndex: number) => (
                  <div key={segment.id} className="grid gap-3 rounded-2xl border border-border/70 p-3 lg:grid-cols-[120px_1fr]">
                    <p className="text-sm font-medium text-muted-foreground">{segment.timestamp}</p>
                    <Input
                      value={segment.text}
                      onChange={(event) => updateTranscript(topicIndex, segmentIndex, event.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No transcript lines are currently mapped to this topic.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
