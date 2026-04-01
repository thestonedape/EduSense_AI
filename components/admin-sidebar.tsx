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
  { href: "/admin/upload", label: "Lecture Intake", icon: UploadCloud },
  { href: "/admin/processing", label: "Processing Queue", icon: ListChecks },
  { href: "/admin/transcript", label: "Topic Review", icon: FileText },
  { href: "/admin/fact-check", label: "Flagged Claims", icon: BrainCircuit },
  { href: "/admin/knowledge", label: "Approved Knowledge", icon: Database },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isItemActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="top-6 flex flex-col rounded-[1.75rem] border border-border bg-[#101a20] p-4 text-white shadow-panel lg:sticky lg:h-[calc(100vh-3rem)] lg:w-72">
      <div className="mb-4 rounded-2xl bg-white/5 p-4">
        <p className="font-display text-xl font-semibold">Admin Workspace</p>
        <p className="mt-1 text-sm text-white/70">Review content, processing, and student-ready knowledge</p>
      </div>

      <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0">
        {items.map((item) => {
          const active = isItemActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition lg:w-full",
                active ? "bg-white text-slate-900" : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 lg:mt-auto">
        Admin tools stay separate from the student experience so review work never leaks into learning screens.
      </div>
    </aside>
  );
}
