"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton({
  redirectTo,
  variant = "outline",
}: {
  redirectTo: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "danger";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleLogout() {
    setError("");
    startTransition(async () => {
      const response = await fetch(`/api/auth/logout?redirect=${encodeURIComponent(redirectTo)}`, {
        method: "POST",
      });

      if (!response.ok) {
        setError("Could not log out. Please try again.");
        return;
      }

      const data = await response.json();
      router.push(data.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button variant={variant} size="sm" className="gap-2" onClick={handleLogout} disabled={pending}>
        <LogOut className="h-4 w-4" />
        {pending ? "Logging out..." : "Logout"}
      </Button>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
