import Link from "next/link";
import { ArrowRight, BookOpenText, BrainCircuit, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function StudentLoginPage() {
  const studyHighlights = [
    {
      title: "Lecture-to-notes flow",
      description: "Move from uploaded lectures to structured topics, guided revision, and cleaner recall.",
      icon: BookOpenText,
    },
    {
      title: "Context-grounded AI help",
      description: "Ask doubts against approved material instead of getting generic chatbot answers.",
      icon: BrainCircuit,
    },
    {
      title: "Long-session study design",
      description: "Practice, progress, and lecture navigation stay focused so students can stay inside one loop.",
      icon: Sparkles,
    },
  ];

  return (
    <main className="min-h-screen px-6 py-6 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="surface relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(24,91,99,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(24,91,99,0.06)_1px,transparent_1px)] bg-[size:36px_36px] opacity-50" />
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#d9eee8] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#f3dfc9] blur-3xl" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-tight text-slate-900">EduSense AI</p>
                    <p className="text-sm text-muted-foreground">Student learning portal built around validated lecture content</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Student Portal
                </div>
              </div>

              <div className="max-w-3xl space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Study Better, Stay Longer</p>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  One clean place for lectures, doubts, revision, and practice.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  EduSense turns approved lecture content into a calmer study workspace. Students can revisit lectures,
                  ask grounded questions, and practice without jumping between scattered tools.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {studyHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[1.75rem] bg-primary p-6 text-primary-foreground shadow-panel">
                  <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/80">What students get</p>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-primary-foreground/90">
                    <p>Validated lecture summaries and topic-wise revision instead of raw transcript overload.</p>
                    <p>Doubt solving and practice flows grounded in approved academic material.</p>
                    <p>Progress tracking that keeps your study loop inside the same workspace.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200/80 bg-[#fffdf9]/90 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">How it works</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">1. Content is reviewed first</p>
                      <p className="mt-1 text-sm text-slate-600">Lectures go through transcription, topic structuring, and admin approval before student access.</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">2. Students study from approved context</p>
                      <p className="mt-1 text-sm text-slate-600">The portal emphasizes safe lecture notes, guided understanding, and subject-scoped doubt solving.</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">3. Revision stays lightweight</p>
                      <p className="mt-1 text-sm text-slate-600">You keep the same flow for lectures, recall, and follow-up questions without switching tabs constantly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Need admin tools?</p>
                  <p className="mt-2 text-lg font-medium text-slate-900">
                    Use the admin portal for upload workflows, transcript review, fact-check monitoring, and pipeline operations.
                  </p>
                </div>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary"
                >
                  Go to admin login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="mb-5 rounded-[1.5rem] border border-white/80 bg-white/75 p-4 text-sm leading-7 text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="font-semibold text-slate-900">Sign in to enter your study workspace</p>
              <p className="mt-1">
                Use your student account to access validated lectures, practice sets, and grounded AI help from the same dashboard.
              </p>
            </div>
            <LoginForm role="student" />
          </div>
        </section>
      </div>
    </main>
  );
}
