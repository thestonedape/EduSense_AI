"use client";

import { useEffect } from "react";

// Render Free spins the backend down after 15 minutes without inbound traffic
// and needs ~45-60 s to start again. Pinging /health while someone is actually
// using EduSense (sign-in screen, or a visible student tab) starts that boot
// before the next navigation needs it, and stops costing instance hours as
// soon as nobody is using the app. /health touches neither PostgreSQL nor
// Redis, and an opaque no-cors request needs no CORS change on the backend.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const PING_INTERVAL_MS = 10 * 60 * 1000;
const MIN_GAP_MS = 4 * 60 * 1000;
// A tab left visible on an unattended screen must not keep the free instance
// running around the clock (750 instance hours per workspace per month).
const ACTIVE_WINDOW_MS = 20 * 60 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

// Module scope: every page renders its own Navbar (and loading screens render
// one too), so several instances can be mounted at once. They share one set of
// listeners and one timer, kept alive while any instance is mounted.
let lastPingAt = 0;
let lastActivityAt = 0;
let mountedCount = 0;
let interval: number | undefined;

function ping() {
  if (!apiBaseUrl || Date.now() - lastPingAt < MIN_GAP_MS) return;
  lastPingAt = Date.now();
  fetch(`${apiBaseUrl}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {
    lastPingAt = 0;
  });
}

function markActive() {
  lastActivityAt = Date.now();
}

function onVisibilityChange() {
  if (document.visibilityState !== "visible") return;
  markActive();
  ping();
}

function onInterval() {
  if (document.visibilityState === "visible" && Date.now() - lastActivityAt < ACTIVE_WINDOW_MS) ping();
}

export function BackendWarmup() {
  useEffect(() => {
    mountedCount += 1;
    if (mountedCount === 1) {
      document.addEventListener("visibilitychange", onVisibilityChange);
      document.addEventListener("scroll", markActive, { capture: true, passive: true });
      for (const type of ACTIVITY_EVENTS) window.addEventListener(type, markActive, { passive: true });
      interval = window.setInterval(onInterval, PING_INTERVAL_MS);
    }
    // Opening a page is itself activity, even if it loaded in a background tab.
    markActive();
    ping();
    return () => {
      mountedCount -= 1;
      if (mountedCount === 0) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        document.removeEventListener("scroll", markActive, { capture: true });
        for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, markActive);
        window.clearInterval(interval);
      }
    };
  }, []);

  return null;
}
