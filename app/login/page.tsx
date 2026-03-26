import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function StudentLoginPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface flex flex-col justify-between p-10">
          <div className="space-y-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Student Portal</p>
            <h1 className="max-w-xl font-display text-5xl font-semibold tracking-tight">
              Sign in to keep learning without the clutter.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Students only see lectures, AI tutor help, and practice. Transcript review and claim validation stay out
              of this experience.
            </p>
          </div>
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
            <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/80">Need admin tools?</p>
            <p className="mt-2 text-lg font-medium">Use the separate admin login for upload, transcript, and fact-check workflows.</p>
            <Link href="/admin/login" className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4">
              Go to admin login
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <LoginForm role="student" />
        </section>
      </div>
    </main>
  );
}
