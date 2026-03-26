"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin-sidebar";
import { LogoutButton } from "@/components/logout-button";

type SessionUser = {
  name: string;
};

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (isLoginPage) return;

    const raw = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("edusense_session="));

    if (!raw) return;

    try {
      const value = decodeURIComponent(raw.split("=")[1] ?? "");
      setUser(JSON.parse(value) as SessionUser);
    } catch {
      setUser(null);
    }
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#edf1f3] text-slate-900">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-6 py-6">
        <AdminSidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-border bg-white px-6 py-4 shadow-panel">
            <div>
              <p className="text-sm font-medium text-slate-500">Signed in as</p>
              <p className="font-display text-xl font-semibold">{user?.name ?? "Admin"}</p>
            </div>
            <LogoutButton redirectTo="/admin/login" />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
