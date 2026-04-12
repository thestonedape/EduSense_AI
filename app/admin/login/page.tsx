import { Activity, DatabaseZap, ScanSearch, ShieldCheck, UploadCloud } from "lucide-react";

import { PortalAuthShell } from "@/components/portal-auth-shell";

export default function AdminLoginPage() {
  const adminCapabilities = [
    {
      title: "Upload and organize source material",
      description: "Bring in recordings, references, and metadata before the pipeline starts.",
      icon: UploadCloud,
    },
    {
      title: "Review before release",
      description: "Transcript fixes, topic approval, and knowledge release stay under control.",
      icon: ScanSearch,
    },
    {
      title: "Keep the pipeline visible",
      description: "Track queue state, retries, and processing progress from one place.",
      icon: Activity,
    },
  ];

  return (
    <PortalAuthShell
      brandIcon={ShieldCheck}
      badgeIcon={DatabaseZap}
      badgeLabel="Admin Portal"
      eyebrow="Operational Review Layer"
      title="Review the lecture pipeline before students ever see it."
      description="EduSense gives the admin side a clear control surface for uploads, transcript review, topic approval, and release. The messy operational work stays here so the student portal stays clean."
      subtitle="Admin operations and lecture validation workspace"
      metaLabel="Why The Admin Side Exists"
      primaryHref="/admin/login/access"
      primaryLabel="Admin sign in"
      secondaryHref="/login"
      secondaryLabel="Student portal"
      highlights={adminCapabilities}
      metrics={[
        { label: "Mode", value: "Admin" },
        { label: "Focus", value: "Control" },
        { label: "Release", value: "Safe" },
      ]}
      theme="admin"
    />
  );
}
