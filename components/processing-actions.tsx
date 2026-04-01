"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { rebuildLectureStructure, resumeLectureProcessing } from "@/lib/api/services";
import { Button } from "@/components/ui/button";

export function ProcessingActions({
  lectureId,
  canRebuild,
  canResume = false,
}: {
  lectureId: string;
  canRebuild: boolean;
  canResume?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  async function handleRebuild() {
    setIsRebuilding(true);
    setMessage("");
    try {
      await rebuildLectureStructure(lectureId);
      setMessage("Rebuild started. Refresh in a few seconds to see topic grouping and flagged-claim updates.");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setMessage("Rebuild failed. Check whether this lecture has stored transcript text.");
    } finally {
      setIsRebuilding(false);
    }
  }

  async function handleResume() {
    setIsResuming(true);
    setMessage("");
    try {
      await resumeLectureProcessing(lectureId);
      setMessage("Queued lecture resumed. The workspace should switch into active processing shortly.");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setMessage("Resume failed. Check whether the lecture still has its uploaded source file.");
    } finally {
      setIsResuming(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {canResume ? (
        <Button type="button" size="sm" variant="outline" onClick={handleResume} disabled={isResuming || isPending}>
          {isResuming || isPending ? "Resuming..." : "Resume Job"}
        </Button>
      ) : null}
      <Button type="button" size="sm" variant="outline" onClick={handleRebuild} disabled={!canRebuild || isRebuilding || isPending}>
        {isRebuilding || isPending ? "Rebuilding..." : "Rebuild Topics"}
      </Button>
      {message ? <p className="max-w-52 text-right text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
