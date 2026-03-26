"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BrainCircuit,
  Database,
  FileText,
  LayoutDashboard,
  ListChecks,
  UploadCloud,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/upload", label: "Upload Manager", icon: UploadCloud },
  { href: "/admin/processing", label: "Processing Monitor", icon: ListChecks },
  { href: "/admin/transcript/p1", label: "Transcript & Structure", icon: FileText },
  { href: "/admin/fact-check/p1", label: "Fact-Check System", icon: BrainCircuit },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: Database },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-72 flex-col rounded-[1.75rem] border border-border bg-[#101a20] p-4 text-white shadow-panel">
      <div className="mb-6 rounded-2xl bg-white/5 p-4">
        <p className="font-display text-xl font-semibold">EduSense Control</p>
        <p className="mt-1 text-sm text-white/70">Content validation and monitoring</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active ? "bg-white text-slate-900" : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Admin and student portals are intentionally separated so validation tooling never leaks into the learner experience.
      </div>
    </aside>
  );
}
