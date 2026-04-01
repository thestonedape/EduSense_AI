"use client";

import { AppCrashScreen } from "@/components/app-crash-screen";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_48%,#eff6ff_100%)] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <AppCrashScreen error={error} reset={reset} area="global" />
        </div>
      </body>
    </html>
  );
}
