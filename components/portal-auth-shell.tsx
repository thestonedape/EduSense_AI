import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Highlight = { title: string; description: string; icon: LucideIcon };
type Props = {
  brandIcon: LucideIcon;
  badgeIcon: LucideIcon;
  badgeLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  subtitle: string;
  metaLabel: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  highlights: Highlight[];
  metrics: { label: string; value: string }[];
  theme: "student" | "admin";
};

export function PortalAuthShell({
  badgeLabel, eyebrow, title, description, primaryHref,
  primaryLabel, secondaryHref, secondaryLabel, highlights, theme,
}: Props) {
  return (
    <main className={"ed-auth ed-auth-" + theme}>
      <header className="ed-auth-header ed-container">
        <Link href={theme === "admin" ? "/admin/login" : "/login"} className="ed-brand"><span className="ed-brand-sign">e<span>.</span></span><span>edusense</span></Link>
        <div className="ed-auth-header-links">
          <Link href={secondaryHref}>{secondaryLabel} <ArrowUpRight size={14} /></Link>
          <Link className="ed-auth-header-primary" href={primaryHref}>{primaryLabel} <ArrowUpRight size={14} /></Link>
        </div>
      </header>
      <div className="ed-auth-main ed-container">
        <div className="ed-auth-intro">
          <p className="ed-eyebrow"><span className="ed-square" /> {eyebrow.toUpperCase()}</p>
          <p className="ed-auth-small">{badgeLabel} / EDUSENSE</p>
          <h1>{title}</h1>
          <p className="ed-auth-description">{description}</p>
          <Link href={primaryHref} className="ed-button ed-button-dark">Enter the workspace <ArrowUpRight size={18} /></Link>
        </div>
        <div className="ed-auth-visual">
          <div className="ed-auth-visual-header"><span>EDUSENSE / {theme === "admin" ? "OPERATIONS" : "STUDY"} JOURNAL</span><span>01—03</span></div>
          <div className="ed-auth-symbol"><span className="ed-auth-orbit orbit-one" /><span className="ed-auth-orbit orbit-two" /><span className="ed-auth-orbit orbit-three" /><span className="ed-auth-symbol-center">e.</span></div>
          <div className="ed-auth-feature-list">
            {highlights.slice(0, 3).map((item, index) => (
              <div className="ed-auth-feature" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><ArrowUpRight size={16} /></div>
            ))}
          </div>
          <div className="ed-auth-visual-footer"><span>THOUGHTFUL BY DESIGN</span><span>NOT ANOTHER TAB.</span></div>
        </div>
      </div>
      <footer className="ed-auth-footer ed-container"><span>EDUSENSE / A QUIETER PLACE TO LEARN</span><span>STUDENT · {theme === "admin" ? "ADMIN" : "ACADEMIC"} PORTAL</span></footer>
    </main>
  );
}