"use client";

import { AppCrashScreen } from "@/components/app-crash-screen";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AppCrashScreen error={error} reset={reset} area="admin" />;
}
