"use client";

import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin-sidebar";
import { LogoutButton } from "@/components/logout-button";

export function AdminLayoutShell({ children, userName }: { children: React.ReactNode; userName?: string | null }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#edf1f3] text-slate-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-6">
        <AdminSidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-border bg-white px-4 py-4 shadow-panel sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Logged in as</p>
              <p className="font-display text-xl font-semibold">{userName ?? "Admin"}</p>
            </div>
            <LogoutButton redirectTo="/admin/login" />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
