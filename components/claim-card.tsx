"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClaimRecord } from "@/types";

export function ClaimCard({ claim }: { claim: ClaimRecord }) {
  const [draft, setDraft] = useState(claim.claim);
  const [verdict, setVerdict] = useState(claim.verdict);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Claim Review</CardTitle>
        <p className="text-sm text-muted-foreground">Confidence: {(claim.confidence * 100).toFixed(0)}% • Evidence: {claim.source}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(["true", "false", "uncertain"] as const).map((option) => (
            <Button
              key={option}
              variant={verdict === option ? "default" : "outline"}
              onClick={() => setVerdict(option)}
            >
              {option}
            </Button>
          ))}
          <Button variant="secondary">Override</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>Approve</Button>
          <Button variant="danger">Reject</Button>
          <Button variant="outline">Save Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
