"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const next = new URL(link.href);
      if (next.origin !== window.location.origin) return;
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;

      setNavigating(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!navigating) return;
    const timeout = window.setTimeout(() => setNavigating(false), 10000);
    return () => window.clearTimeout(timeout);
  }, [navigating]);

  return <div className={`ed-route-progress${navigating ? " is-active" : ""}`} aria-hidden="true"><span /></div>;
}
