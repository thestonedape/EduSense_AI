import { GraduationCap } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { PortalAccessShell } from "@/components/portal-access-shell";

export default function StudentAccessPage() {
  return (
    <PortalAccessShell
      brandIcon={GraduationCap}
      badgeLabel="Student Access"
      title="Enter the student workspace."
      description="Sign in to continue with reviewed lectures, grounded doubt support, and practice inside one study flow."
      subtitle="Student learning portal built around validated lecture content"
      backHref="/login"
      backLabel="Back to overview"
      switchHref="/admin/login/access"
      switchLabel="Admin access"
      theme="student"
    >
      <LoginForm
        role="student"
        title="Student sign in"
        description="Use your account to continue studying, or switch to sign up to create one."
      />
    </PortalAccessShell>
  );
}
