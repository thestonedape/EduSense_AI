import Link from "next/link";
import { Bell, GraduationCap, UserCircle2 } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">EduSense AI</p>
            <p className="text-sm text-muted-foreground">Student learning portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/courses" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Courses
          </Link>
          <Link href="/practice" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Practice
          </Link>
          <Link href="/admin" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Admin
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Updates
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
            <UserCircle2 className="h-5 w-5 text-primary" />
            <div className="text-sm leading-tight">
              <p className="font-medium">{user?.name ?? "Student"}</p>
              <p className="text-muted-foreground">{user?.role === "admin" ? "Admin" : "Student"}</p>
            </div>
          </div>
          <LogoutButton redirectTo="/login" />
        </div>
      </div>
    </header>
  );
}
