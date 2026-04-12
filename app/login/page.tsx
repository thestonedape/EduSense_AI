import { BookOpenText, BrainCircuit, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { PortalAuthShell } from "@/components/portal-auth-shell";

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
    <PortalAuthShell
      brandIcon={GraduationCap}
      badgeIcon={ShieldCheck}
      badgeLabel="Student Portal"
      eyebrow="Study Better, Stay Longer"
      title="One clean place for lectures, doubts, revision, and practice."
      description="EduSense turns approved lecture content into a calmer study workspace. Students can revisit lectures, ask grounded questions, and practice without jumping between scattered tools."
      subtitle="Student learning portal built around validated lecture content"
      metaLabel="Why students stay inside this flow"
      switchLabel="Need admin tools?"
      switchDescription="Use the admin portal for upload workflows, transcript review, fact-check monitoring, and pipeline operations."
      switchHref="/admin/login"
      switchHrefLabel="Go to admin login"
      highlights={studyHighlights}
      features={[
        {
          title: "Validated lecture summaries",
          description: "Students read from reviewed content instead of raw transcript overload or noisy lecture fragments.",
        },
        {
          title: "Grounded study help",
          description: "Doubt solving and practice stay tied to approved academic material rather than open-ended chatbot output.",
        },
        {
          title: "One continuous revision loop",
          description: "Lecture understanding, practice, and follow-up questions live in the same workspace so focus is easier to maintain.",
        },
      ]}
      metrics={[
        { label: "Portal mode", value: "Student" },
        { label: "Experience", value: "Calm" },
        { label: "Context", value: "Validated" },
      ]}
      theme="student"
    >
      <LoginForm
        role="student"
        embedded
        title="Enter your study workspace"
        description="Sign in or create a student account to access validated lectures, practice sets, and grounded AI help."
      />
    </PortalAuthShell>
  );
}
