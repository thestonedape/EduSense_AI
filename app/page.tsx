import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileText,
  MessageSquareMore,
  MoonStar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BackendStatusPill } from "@/components/backend-status-pill";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    title: "AI Doubt Solver",
    description: "Ask in plain language and get clear, step-by-step answers.",
    icon: MessageSquareMore,
  },
  {
    title: "Smart Notes Generation",
    description: "Turn lessons into structured notes you can revise faster.",
    icon: FileText,
  },
  {
    title: "Practice Quizzes",
    description: "Test understanding with focused questions and instant feedback.",
    icon: CheckCircle2,
  },
  {
    title: "Personalized Learning",
    description: "Study at your pace with explanations adapted to what you need.",
    icon: BrainCircuit,
  },
];

const testimonials = [
  {
    quote: "It explains topics the way a patient tutor would, not like a textbook.",
    name: "Aarav",
    role: "Engineering student",
  },
  {
    quote: "The notes and quiz flow help me revise faster before class tests.",
    name: "Meera",
    role: "Computer science student",
  },
  {
    quote: "I use it when lectures move too fast. The step-by-step answers are the best part.",
    name: "Rohan",
    role: "First-year student",
  },
];

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--landing-surface)]/85 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--landing-surface)]/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-[var(--landing-card)] shadow-[0_10px_25px_rgba(15,23,42,0.06)] dark:border-white/10">
            <Bot className="h-5 w-5 text-[var(--landing-accent)]" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-[var(--landing-foreground)]">EduSense AI</p>
            <p className="text-sm text-[var(--landing-muted)]">AI learning platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-black/5 bg-[var(--landing-card)] px-3 py-2 text-sm text-[var(--landing-muted)] shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-white/10 sm:flex">
            <MoonStar className="h-4 w-4" />
            Light and dark ready
          </div>
          <Button asChild size="lg" className="rounded-2xl px-5">
            <Link href="/login">Start Learning</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ChatMockup() {
  return (
    <div className="landing-reveal relative rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-white/10">
      <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
        <div>
          <p className="text-sm font-semibold text-[var(--landing-foreground)]">AI Tutor</p>
          <p className="text-xs text-[var(--landing-muted)]">Explains concepts clearly</p>
        </div>
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Step-by-step mode
        </div>
      </div>

      <div className="space-y-3">
        <div className="ml-auto max-w-[82%] rounded-[1.5rem] rounded-br-md bg-[var(--landing-foreground)] px-4 py-3 text-sm leading-6 text-white dark:bg-white dark:text-slate-900">
          Can you explain recursion in a simple way?
        </div>
        <div className="max-w-[88%] rounded-[1.5rem] rounded-bl-md border border-black/5 bg-[var(--landing-surface)] px-4 py-4 text-sm leading-6 text-[var(--landing-foreground)] dark:border-white/10">
          <p className="font-medium">Sure. Think of recursion as a function solving a big problem by calling itself on a smaller version of the same problem.</p>
          <div className="mt-3 rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
            <p className="font-medium">Example:</p>
            <p>To find `5!`, we break it down into `5 x 4!`, then `4 x 3!`, until we reach `1`.</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-[var(--landing-card)] p-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--landing-muted)]">Idea</p>
              <p className="mt-1">Solve smaller versions of the same problem.</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-[var(--landing-card)] p-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--landing-muted)]">Base Case</p>
              <p className="mt-1">A stopping point so the function does not run forever.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="landing-reveal rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-white/10">
      <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--landing-muted)]">{eyebrow}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--landing-foreground)]">{title}</h3>
        </div>
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--landing-background)] text-[var(--landing-foreground)] transition-colors duration-300">
      <LandingNavbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <section className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[var(--landing-card)] px-3 py-2 text-sm text-[var(--landing-muted)] shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-white/10">
                <Sparkles className="h-4 w-4 text-[var(--landing-accent)]" />
                Learn with clarity, not clutter
              </div>
              <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Learn Smarter with AI
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--landing-muted)] sm:text-xl">
                Understand concepts deeply with step-by-step explanations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-2xl px-6">
                <Link href="/login" className="gap-2">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-black/10 bg-[var(--landing-card)] px-6 dark:border-white/10 dark:bg-[var(--landing-card)]">
                <Link href="#preview">See Demo</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <BackendStatusPill />
              <p className="text-sm leading-6 text-[var(--landing-muted)]">
                If the app is waking up, the landing page stays available while the backend becomes ready.
              </p>
            </div>
          </div>

          <ChatMockup />
        </section>

        <section className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--landing-muted)]">Key Features</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Built for focused learning</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="landing-reveal rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/[0.05]">
                    <Icon className="h-5 w-5 text-[var(--landing-accent)]" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="preview" className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--landing-muted)]">Product Preview</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">A clean workspace for asking, reading, and practicing</h2>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <PreviewPanel eyebrow="Chat Interface" title="Ask questions naturally">
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl bg-black/[0.04] p-3 dark:bg-white/[0.04]">
                  <p className="text-[var(--landing-muted)]">You</p>
                  <p className="mt-1">What is backpropagation and why do we use it?</p>
                </div>
                <div className="rounded-2xl border border-black/5 p-3 dark:border-white/10">
                  <p className="font-medium">AI Tutor</p>
                  <p className="mt-1 text-[var(--landing-muted)]">It helps a neural network learn by measuring error and updating weights step by step.</p>
                </div>
                <div className="rounded-2xl border border-dashed border-black/10 p-3 text-[var(--landing-muted)] dark:border-white/10">
                  Follow-up suggestions: "Show an example" • "Explain the gradient"
                </div>
              </div>
            </PreviewPanel>

            <PreviewPanel eyebrow="Notes View" title="Structured notes instantly">
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                  <p className="font-medium">Neural Networks</p>
                  <ul className="mt-3 space-y-2 text-[var(--landing-muted)]">
                    <li>Input, hidden, and output layers</li>
                    <li>Weights control signal strength</li>
                    <li>Activation functions add non-linearity</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--landing-muted)]">Summary</p>
                  <p className="mt-2">Compact notes, ready for revision.</p>
                </div>
              </div>
            </PreviewPanel>

            <PreviewPanel eyebrow="Quiz Screen" title="Practice what you learned">
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                  <p className="font-medium">Which part stops a recursive function from running forever?</p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-xl bg-black/[0.04] px-3 py-2 dark:bg-white/[0.04]">Loop body</div>
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300">Base case</div>
                    <div className="rounded-xl bg-black/[0.04] px-3 py-2 dark:bg-white/[0.04]">Compiler check</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-black/[0.04] p-4 text-[var(--landing-muted)] dark:bg-white/[0.04]">
                  Instant explanation after each answer.
                </div>
              </div>
            </PreviewPanel>
          </div>
        </section>

        <section className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--landing-muted)]">How It Works</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">A simple flow that keeps you moving</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              "Ask or upload content",
              "AI explains + structures",
              "Learn and practice",
            ].map((step, index) => (
              <div
                key={step}
                className="landing-reveal relative rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] dark:border-white/10"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.04] text-sm font-semibold dark:bg-white/[0.05]">
                  0{index + 1}
                </div>
                <p className="text-lg font-semibold tracking-tight">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--landing-muted)]">Social Proof</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Made to feel useful from the first question</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[var(--landing-card)] px-4 py-2 text-sm text-[var(--landing-muted)] dark:border-white/10">
              <ShieldCheck className="h-4 w-4 text-[var(--landing-accent)]" />
              Used by students worldwide
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="landing-reveal rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] dark:border-white/10"
              >
                <p className="text-base leading-7 text-[var(--landing-foreground)]">"{item.quote}"</p>
                <div className="mt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[var(--landing-muted)]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-reveal rounded-[2rem] border border-black/5 bg-[var(--landing-card)] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.07)] dark:border-white/10 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--landing-muted)]">Start Now</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Your AI study partner</h2>
              <p className="text-base leading-7 text-[var(--landing-muted)]">
                Ask questions, turn lessons into notes, and practice without switching tools.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-2xl px-6">
              <Link href="/login" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
