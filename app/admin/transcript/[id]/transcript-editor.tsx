"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TranscriptSentence } from "@/types";

export function TranscriptEditor({ initialRows }: { initialRows: TranscriptSentence[] }) {
  const [rows, setRows] = useState(initialRows);

  function updateRow(index: number, key: "text" | "topic", value: string) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Transcript & Structure</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Review timestamped transcript blocks</h1>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <Card key={row.id} className="bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{row.timestamp}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1fr_240px_auto]">
              <Input value={row.text} onChange={(event) => updateRow(index, "text", event.target.value)} />
              <Input value={row.topic} onChange={(event) => updateRow(index, "topic", event.target.value)} />
              <Button variant="outline">Save</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
