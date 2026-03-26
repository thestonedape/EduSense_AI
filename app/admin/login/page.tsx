import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#edf1f3] px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] bg-[#101a20] p-10 text-white shadow-panel">
          <div className="space-y-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Admin Portal</p>
            <h1 className="max-w-xl font-display text-5xl font-semibold tracking-tight">
              Sign in to manage the validation pipeline.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/70">
              This portal is reserved for upload management, transcript correction, fact-check approval, and analytics.
            </p>
          </div>
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-white/60">Need the learning portal?</p>
            <p className="mt-2 text-lg font-medium">Students should sign in through the separate student login.</p>
            <Link href="/login" className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4">
              Go to student login
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <LoginForm role="admin" />
        </section>
      </div>
    </main>
  );
}
