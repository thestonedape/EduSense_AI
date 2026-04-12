import { BookOpenText, BrainCircuit, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { PortalAuthShell } from "@/components/portal-auth-shell";

export default function StudentLoginPage() {
  const studyHighlights = [
    {
      title: "Read from approved lecture notes",
      description: "Start from reviewed material instead of raw transcript noise.",
      icon: BookOpenText,
    },
    {
      title: "Ask better grounded questions",
      description: "Doubt solving stays tied to the actual lecture context you studied.",
      icon: BrainCircuit,
    },
    {
      title: "Stay inside one revision flow",
      description: "Lectures, follow-ups, and practice stay in one calm workspace.",
      icon: Sparkles,
    },
  ];

  return (
    <PortalAuthShell
      brandIcon={GraduationCap}
      badgeIcon={ShieldCheck}
      badgeLabel="Student Portal"
      eyebrow="Validated Learning Workspace"
      title="One place to read, revise, and ask better questions."
      description="EduSense turns reviewed lecture material into a calmer study flow. Open a lecture, continue with trusted notes, and ask grounded questions without leaving the workspace."
      subtitle="Student learning portal built around validated lecture content"
      metaLabel="Why Students Stay Longer Here"
      primaryHref="/login/access"
      primaryLabel="Student sign in"
      secondaryHref="/admin/login"
      secondaryLabel="Admin portal"
      highlights={studyHighlights}
      metrics={[
        { label: "Mode", value: "Student" },
        { label: "Content", value: "Reviewed" },
        { label: "Flow", value: "Focused" },
      ]}
      theme="student"
    />
  );
}
