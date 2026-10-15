import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getSessionUser();
  return (
    <header className="ed-nav">
      <div className="ed-container ed-nav-inner">
        <Link href="/" className="ed-brand" aria-label="EduSense home"><span className="ed-brand-sign">e<span>.</span></span><span>edusense</span></Link>
        <nav className="ed-links" aria-label="Student navigation">
          <Link href="/">Desk</Link><Link href="/courses">Subjects</Link><Link href="/practice">Practice</Link><Link href="/doubts">Questions</Link>
        </nav>
        <div className="ed-nav-right"><span className="ed-user-label">{user?.name || "Student"}</span><LogoutButton redirectTo="/login" /><Link href="/courses" className="ed-nav-small"><ArrowUpRight size={16} /></Link></div>
        <details className="ed-mobile-nav"><summary aria-label="Open navigation"><Menu size={21} /></summary><div><Link href="/">Desk</Link><Link href="/courses">Subjects</Link><Link href="/practice">Practice</Link><Link href="/doubts">Questions</Link><LogoutButton redirectTo="/login" /></div></details>
      </div>
    </header>
  );
}