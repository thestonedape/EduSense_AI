"use client";

import { useEffect, useState } from "react";

// Warm student reads finish in well under a second. Only a wait this long is
// worth explaining: usually the free-tier backend starting after idling.
const NOTICE_AFTER_MS = 8_000;

export function SlowLoadNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), NOTICE_AFTER_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;
  return (
    <p className="text-sm text-muted-foreground" role="status">
      This is taking longer than usual. The study server may be starting up after being idle, which can take up to a minute. The page will open by itself once it responds.
    </p>
  );
}
