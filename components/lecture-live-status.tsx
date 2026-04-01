"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";

type LectureLiveStatusProps = {
  lectureId: string;
  status: string;
  progress: number;
  stage?: string | null;
};

const ACTIVE_STATUSES = new Set(["pending", "processing"]);

type ProcessingStatusPayload = {
  status?: string;
  progress?: number;
  latest_job?: {
    stage?: string | null;
    status?: string | null;
  } | null;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function LectureLiveStatus({ lectureId, status, progress, stage }: LectureLiveStatusProps) {
  const router = useRouter();
  const [pulse, setPulse] = useState(0);
  const [liveStatus, setLiveStatus] = useState(status);
  const [liveProgress, setLiveProgress] = useState(progress);
  const [liveStage, setLiveStage] = useState(stage);
  const hasFinalRefresh = useRef(false);
  const statusRef = useRef(status);
  const progressRef = useRef(progress);
  const stageRef = useRef(stage);
  const isActive = ACTIVE_STATUSES.has(liveStatus);

  useEffect(() => {
    setLiveStatus(status);
    setLiveProgress(progress);
    setLiveStage(stage);
    statusRef.current = status;
    progressRef.current = progress;
    stageRef.current = stage;
    hasFinalRefresh.current = false;
  }, [progress, stage, status]);

  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    async function pollStatus() {
      try {
        const target = apiBaseUrl ? `${apiBaseUrl}/api/v1/processing/${lectureId}` : `/api/v1/processing/${lectureId}`;
        const response = await fetch(target, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as ProcessingStatusPayload;
        if (cancelled) return;

        const nextStatus = payload.status ?? statusRef.current;
        const nextProgress = typeof payload.progress === "number" ? payload.progress : progressRef.current;
        const nextStage = payload.latest_job?.stage ?? stageRef.current;

        statusRef.current = nextStatus;
        progressRef.current = nextProgress;
        stageRef.current = nextStage;

        setLiveStatus(nextStatus);
        setLiveProgress(nextProgress);
        setLiveStage(nextStage);

        if (!ACTIVE_STATUSES.has(nextStatus) && !hasFinalRefresh.current) {
          hasFinalRefresh.current = true;
          startTransition(() => {
            router.refresh();
          });
        }
      } catch {
        // Keep the current UI state if a lightweight poll fails.
      }
    }

    pollStatus();

    const refreshInterval = window.setInterval(pollStatus, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
    };
  }, [isActive, lectureId, router]);

  useEffect(() => {
    if (!isActive) {
      setPulse(0);
      return;
    }

    const pulseInterval = window.setInterval(() => {
      setPulse((current) => (current + 1) % 4);
    }, 500);

    return () => window.clearInterval(pulseInterval);
  }, [isActive]);

  const statusText = useMemo(() => {
    if (liveStatus === "pending") {
      return "Lecture intake saved. The job is queued and waiting to begin";
    }
    if (liveStatus === "processing") {
      return "Lecture processing is live. Status updates stream in without reloading the full workspace";
    }
    if (liveStatus === "failed") {
      return "Processing stopped. Check the queue or rebuild this lecture";
    }
    return "Processing completed";
  }, [liveStatus]);

  return (
    <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Live Processing</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {statusText}
            {isActive ? ".".repeat(pulse) : ""}
          </p>
          {liveStage ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Current stage: {liveStage.replaceAll("_", " ")}
            </p>
          ) : null}
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          {isActive ? "Auto Refresh On" : "Auto Refresh Off"}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pipeline progress</span>
          <span className="font-medium text-slate-900">{liveProgress}%</span>
        </div>
        <Progress value={liveProgress} />
      </div>
    </div>
  );
}
