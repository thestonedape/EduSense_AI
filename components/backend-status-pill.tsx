"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Wifi, WifiOff } from "lucide-react";

type BackendHealth = {
  status: "checking" | "ready" | "waking" | "unavailable";
  message: string;
};

const initialState: BackendHealth = {
  status: "checking",
  message: "Checking platform status...",
};

export function BackendStatusPill() {
  const [state, setState] = useState<BackendHealth>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const payload = (await response.json()) as BackendHealth;
        if (!cancelled) {
          setState(payload);
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "unavailable",
            message: "Platform temporarily unavailable",
          });
        }
      }
    }

    checkHealth();
    const interval = window.setInterval(checkHealth, 12000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const icon =
    state.status === "checking" ? (
      <LoaderCircle className="h-4 w-4 animate-spin" />
    ) : state.status === "ready" ? (
      <Wifi className="h-4 w-4" />
    ) : state.status === "waking" ? (
      <LoaderCircle className="h-4 w-4 animate-spin" />
    ) : (
      <WifiOff className="h-4 w-4" />
    );

  const toneClass =
    state.status === "ready"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : state.status === "waking"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : state.status === "unavailable"
          ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
          : "border-black/5 bg-[var(--landing-card)] text-[var(--landing-muted)] dark:border-white/10";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${toneClass}`}>
      {icon}
      <span>{state.message}</span>
    </div>
  );
}
