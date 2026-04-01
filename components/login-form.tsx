"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/lib/auth";

export function LoginForm({ role }: { role: UserRole }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentMode, setStudentMode] = useState<"sign_in" | "sign_up">("sign_in");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role, intent: role === "student" ? studentMode : "sign_in" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {role === "admin" ? "Admin Login" : studentMode === "sign_up" ? "Student Sign Up" : "Student Login"}
        </CardTitle>
        <CardDescription>
          {role === "admin"
            ? "Access the validation pipeline, monitoring, and quality controls."
            : studentMode === "sign_up"
              ? "Create your student account to access validated lectures, tutor help, and practice."
              : "Access your clean learning dashboard, lectures, and practice."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {role === "student" ? (
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setStudentMode("sign_in");
                setError("");
              }}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${studentMode === "sign_in" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setStudentMode("sign_up");
                setError("");
              }}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${studentMode === "sign_up" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? role === "student" && studentMode === "sign_up"
                ? "Creating account..."
                : "Signing in..."
              : role === "student" && studentMode === "sign_up"
                ? "Create Student Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Portal access</p>
          <p>
            {role === "admin"
              ? "Sign in with a Supabase account that has been granted admin access."
              : studentMode === "sign_up"
                ? "Student registration is self-service. Admin accounts are never created from this form."
                : "Use sign in if you already have a student account, or switch to sign up to create one."}
          </p>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
