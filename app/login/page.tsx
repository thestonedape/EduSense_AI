import { BookOpenText, BrainCircuit, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { BackendWarmup } from "@/components/backend-warmup";
import { PortalAuthShell } from "@/components/portal-auth-shell";

export default function StudentLoginPage() {
  return (
    <>
    <BackendWarmup />
    <PortalAuthShell
      brandIcon={GraduationCap} badgeIcon={ShieldCheck} badgeLabel="Student Portal"
      eyebrow="The modern study journal"
      title="Your learning, without the noise."
      description="Lectures become notes. Notes become questions. Everything in one place, ready when you are."
      subtitle="A thoughtful academic workspace" metaLabel="How it works"
      primaryHref="/login/access" primaryLabel="Sign in / Sign up"
      secondaryHref="/admin/login" secondaryLabel="Admin"
      highlights={[
        { title: "Start with a lecture", description: "Read approved notes.", icon: BookOpenText },
        { title: "Follow your questions", description: "Ask within study context.", icon: BrainCircuit },
        { title: "Build your understanding", description: "Return and revise.", icon: Sparkles },
      ]}
      metrics={[]} theme="student"
    />
    </>
  );
}