import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { PortalAccessShell } from "@/components/portal-access-shell";

export default function AdminAccessPage() {
  return (
    <PortalAccessShell
      brandIcon={ShieldCheck}
      badgeLabel="Admin Access"
      title="Enter the admin workspace."
      description="Sign in to review uploads, approve topics, monitor processing, and control what reaches students."
      subtitle="Admin operations and lecture validation workspace"
      backHref="/admin/login"
      backLabel="Back to overview"
      switchHref="/login/access"
      switchLabel="Student access"
      theme="admin"
    >
      <LoginForm
        role="admin"
        title="Admin sign in"
        description="Use an approved admin account to open the validation and release workspace."
      />
    </PortalAccessShell>
  );
}
