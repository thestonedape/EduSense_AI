import Link from "next/link";
import { Activity, ArrowRight, DatabaseZap, ScanSearch, ShieldCheck, UploadCloud } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  const adminCapabilities = [
    {
      title: "Lecture intake",
      description: "Upload raw lecture media, attach trusted references, and create structured review records.",
      icon: UploadCloud,
    },
    {
      title: "Validation workflows",
      description: "Review transcripts, approve safe topics, and control what reaches the student knowledge base.",
      icon: ScanSearch,
    },
    {
      title: "Pipeline visibility",
      description: "Track queue health, retries, and processing stages across the lecture intelligence system.",
      icon: Activity,
    },
  ];

  return (
    <main className="min-h-screen bg-[#edf1f3] px-6 py-6 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#101a20] p-8 text-white shadow-panel sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30" />
          <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#1b4e55] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#5d3926] blur-3xl" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-tight">EduSense AI</p>
                    <p className="text-sm text-white/60">Admin operations and lecture validation workspace</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                  <DatabaseZap className="h-4 w-4" />
                  Admin Portal
                </div>
              </div>

              <div className="max-w-3xl space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Review Before Release</p>
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Manage the lecture pipeline behind the student experience.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  This workspace is for upload operations, transcript quality control, topic approval, fact-check review,
                  and processing visibility across the EduSense content system.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {adminCapabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-white/65">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/55">Admin workflow</p>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-white/75">
                    <p>1. Ingest lecture media and structured academic metadata.</p>
                    <p>2. Monitor transcription, topic generation, knowledge build, and reference processing.</p>
                    <p>3. Approve only safe topics before students see lecture-backed study content.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-white/95 p-6 text-slate-900 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Why this matters</p>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                    <p>The student portal stays clean because all messy pipeline work lives here instead of leaking into the study experience.</p>
                    <p>Admins get tighter control over upload reliability, transcript quality, and knowledge-base safety.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/55">Need the student portal?</p>
                  <p className="mt-2 text-lg font-medium text-white">Students should use the separate learning login built for lectures, doubts, and practice.</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  Go to student login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="mb-5 rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-4 text-sm leading-7 text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="font-semibold text-slate-900">Admin sign-in</p>
              <p className="mt-1">
                Use an approved admin account to manage lecture uploads, validation workflow, review queues, and analytics.
              </p>
            </div>
            <LoginForm role="admin" />
          </div>
        </section>
      </div>
    </main>
  );
}
