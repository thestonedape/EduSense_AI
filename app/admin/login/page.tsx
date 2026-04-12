import { Activity, DatabaseZap, ScanSearch, ShieldCheck, UploadCloud } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { PortalAuthShell } from "@/components/portal-auth-shell";

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
    <PortalAuthShell
      brandIcon={ShieldCheck}
      badgeIcon={DatabaseZap}
      badgeLabel="Admin Portal"
      eyebrow="Review Before Release"
      title="Manage the lecture pipeline behind the student experience."
      description="This workspace is for upload operations, transcript quality control, topic approval, fact-check review, and processing visibility across the EduSense content system."
      subtitle="Admin operations and lecture validation workspace"
      metaLabel="Why this control layer exists"
      switchLabel="Need the student portal?"
      switchDescription="Students should use the separate learning login built for lectures, doubts, and practice."
      switchHref="/login"
      switchHrefLabel="Go to student login"
      highlights={adminCapabilities}
      features={[
        {
          title: "Lecture intake and structure",
          description: "Upload raw lecture media, attach reference material, and preserve academic metadata before the pipeline starts.",
        },
        {
          title: "Validation before release",
          description: "Review transcripts, approve safe topics, and decide what reaches the student-facing knowledge base.",
        },
        {
          title: "Operational visibility",
          description: "Track queue health, retries, processing stages, and review signals from a dedicated control workspace.",
        },
      ]}
      metrics={[
        { label: "Portal mode", value: "Admin" },
        { label: "Focus", value: "Review" },
        { label: "Output", value: "Safe" },
      ]}
      theme="admin"
    >
      <LoginForm
        role="admin"
        embedded
        title="Admin sign-in"
        description="Use an approved admin account to manage lecture uploads, validation workflow, review queues, and analytics."
      />
    </PortalAuthShell>
  );
}
