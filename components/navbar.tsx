import Link from "next/link";
import { GraduationCap, Menu, UserCircle2 } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">EduSense AI</p>
            <p className="hidden text-sm text-muted-foreground sm:block">Student learning portal</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/courses" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Subjects
          </Link>
          <Link href="/practice" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Practice
          </Link>
          <Link href="/doubts" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Doubt Solver
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
            <UserCircle2 className="h-5 w-5 text-primary" />
            <div className="text-sm leading-tight">
              <p className="font-medium">{user?.name ?? "Student"}</p>
              <p className="text-muted-foreground">{user?.role === "admin" ? "Admin" : "Student"}</p>
            </div>
          </div>
          <LogoutButton redirectTo="/login" />
        </div>

        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 top-12 z-40 w-[min(88vw,320px)] rounded-[1.5rem] border border-border bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3">
              <UserCircle2 className="h-5 w-5 text-primary" />
              <div className="min-w-0 text-sm leading-tight">
                <p className="truncate font-medium">{user?.name ?? "Student"}</p>
                <p className="text-muted-foreground">{user?.role === "admin" ? "Admin" : "Student"}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <Link href="/courses" className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                Subjects
              </Link>
              <Link href="/practice" className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                Practice
              </Link>
              <Link href="/doubts" className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                Doubt Solver
              </Link>
            </nav>
            <div className="mt-4">
              <LogoutButton redirectTo="/login" />
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
