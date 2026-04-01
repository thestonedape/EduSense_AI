"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AppCrashScreenProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
  area: "admin" | "student" | "global";
};

const areaCopy = {
  admin: {
    eyebrow: "Admin Crash Barrier",
    title: "The control room spilled its coffee.",
    description:
      "Something broke before this screen could finish loading. Your data is probably still safe, but this route needs another try.",
    homeHref: "/admin",
    homeLabel: "Back to Admin Home",
  },
  student: {
    eyebrow: "Learning Route Crash",
    title: "This page skipped class for a minute.",
    description:
      "The page hit an unexpected issue while loading. Give it another shot and we should usually be back on track.",
    homeHref: "/",
    homeLabel: "Back to Student Home",
  },
  global: {
    eyebrow: "System Crash Barrier",
    title: "The app tripped over its own wires.",
    description:
      "A bigger app-level error showed up here. Try a reload first, and if it keeps happening we should inspect the latest changes.",
    homeHref: "/",
    homeLabel: "Go to Home",
  },
} as const;

export function AppCrashScreen({ error, reset, area }: AppCrashScreenProps) {
  const copy = areaCopy[area];

  useEffect(() => {
    if (error) {
      console.error(`${area}_route_error`, error);
    }
  }, [area, error]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_42%)]" />
      <div className="relative space-y-6">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
          {copy.eyebrow}
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold text-slate-950">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{copy.description}</p>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-5">
          <div className="grid gap-3 md:grid-cols-[auto_1fr]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">:/</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Crash note</p>
              <p className="text-sm text-muted-foreground">
                We caught the failure before it could dump a raw crash screen on the user.
                {error?.digest ? ` Error digest: ${error.digest}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {reset ? <Button onClick={() => reset()}>Try Again</Button> : null}
          <Button asChild variant="outline">
            <Link href={copy.homeHref}>{copy.homeLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
