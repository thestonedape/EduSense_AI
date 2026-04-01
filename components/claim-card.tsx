"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateFactCheck } from "@/lib/api/services";
import { ClaimRecord, ClaimReviewAction, ClaimVerdict } from "@/types";

export function ClaimCard({ claim }: { claim: ClaimRecord }) {
  const [draft, setDraft] = useState(claim.claim);
  const [verdict, setVerdict] = useState<ClaimVerdict>(claim.verdict);
  const [rationale, setRationale] = useState(claim.rationale);
  const [override, setOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(action: ClaimReviewAction, includeEdit: boolean) {
    setLoading(true);
    setMessage("");

    try {
      await updateFactCheck({
        claim_id: claim.id,
        action,
        edited_claim: includeEdit ? draft : undefined,
        override_verdict: override ? verdict : undefined,
        confidence: claim.confidence,
        rationale,
      });
      setMessage(`Claim ${action}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Flagged Claim #{claim.sequence}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Verdict: {claim.verdict} | Confidence: {(claim.confidence * 100).toFixed(0)}% | Status: {claim.status}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} />
        <p className="text-xs text-muted-foreground">
          Override only if you want to correct the flagged claim text or manually change the verdict.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(["true", "false", "uncertain"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              variant={verdict === option ? "default" : "outline"}
              onClick={() => setVerdict(option)}
            >
              {option}
            </Button>
          ))}
          <Button type="button" variant={override ? "secondary" : "outline"} onClick={() => setOverride((value) => !value)}>
            {override ? "Override on" : "Override"}
          </Button>
        </div>
        <Textarea value={rationale} onChange={(event) => setRationale(event.target.value)} placeholder="Reviewer rationale" />
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Whole-Lecture Evidence</p>
          <p className="mt-2">{claim.sourceExcerpt}</p>
          {claim.details ? <p className="mt-2">{claim.details}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => submit("approved", false)} disabled={loading}>Approve</Button>
          <Button type="button" variant="danger" onClick={() => submit("rejected", false)} disabled={loading}>Reject</Button>
          <Button type="button" variant="outline" onClick={() => submit("approved", true)} disabled={loading}>Save Edit</Button>
        </div>
        {message ? <p className="text-sm font-medium text-success">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
