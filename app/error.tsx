"use client";

import { AppCrashScreen } from "@/components/app-crash-screen";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#f8fafc_100%)] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <AppCrashScreen error={error} reset={reset} area="student" />
      </div>
    </main>
  );
}
