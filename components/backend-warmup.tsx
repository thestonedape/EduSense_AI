"use client";

import { useEffect } from "react";

// Render Free spins the backend down after 15 minutes without inbound traffic
// and needs ~45-60 s to start again. Pinging /health while someone is actually
// using EduSense (sign-in screen, or a visible student tab) starts that boot
// before the next navigation needs it, and stops costing instance hours as
// soon as nobody is looking at the app. /health touches neither PostgreSQL nor
// Redis, and an opaque no-cors request needs no CORS change on the backend.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const PING_INTERVAL_MS = 10 * 60 * 1000;
const MIN_GAP_MS = 4 * 60 * 1000;

// Module scope: every page renders its own Navbar, so navigations remount this
// component and must not ping again each time.
let lastPingAt = 0;

function ping(onlyIfVisible = true) {
  if (!apiBaseUrl || (onlyIfVisible && document.visibilityState !== "visible")) return;
  if (Date.now() - lastPingAt < MIN_GAP_MS) return;
  lastPingAt = Date.now();
  fetch(`${apiBaseUrl}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {
    lastPingAt = 0;
  });
}

const pingIfVisible = () => ping();

export function BackendWarmup() {
  useEffect(() => {
    // Opening a page is itself activity, even if it loaded in a background tab.
    ping(false);
    const interval = window.setInterval(pingIfVisible, PING_INTERVAL_MS);
    document.addEventListener("visibilitychange", pingIfVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", pingIfVisible);
    };
  }, []);

  return null;
}
