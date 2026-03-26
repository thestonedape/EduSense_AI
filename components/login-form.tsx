"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/lib/auth";

const demoCredentials = {
  student: {
    email: "student@edusense.ai",
    password: "student123",
    label: "Student demo",
  },
  admin: {
    email: "admin@edusense.ai",
    password: "admin123",
    label: "Admin demo",
  },
};

export function LoginForm({ role }: { role: UserRole }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [email, setEmail] = useState(demoCredentials[role].email);
  const [password, setPassword] = useState(demoCredentials[role].password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
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
        <CardTitle>{role === "admin" ? "Admin Login" : "Student Login"}</CardTitle>
        <CardDescription>
          {role === "admin"
            ? "Access the validation pipeline, monitoring, and quality controls."
            : "Access your clean learning dashboard, lectures, and practice."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
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
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{demoCredentials[role].label}</p>
          <p>{demoCredentials[role].email}</p>
          <p>{demoCredentials[role].password}</p>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
