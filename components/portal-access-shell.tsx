import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

type Props = {
  brandIcon: LucideIcon;
  title: string; description: string; subtitle: string; badgeLabel: string;
  backHref: string; backLabel: string; switchHref: string; switchLabel: string;
  theme: "student" | "admin"; children: React.ReactNode;
};

export function PortalAccessShell({ title, description, badgeLabel, backHref, backLabel, switchHref, switchLabel, theme, children }: Props) {
  return (
    <main className={"ed-auth ed-access ed-auth-" + theme}>
      <header className="ed-auth-header ed-container">
        <Link href={backHref} className="ed-brand"><span className="ed-brand-sign">e<span>.</span></span><span>edusense</span></Link>
        <Link className="ed-auth-switch" href={switchHref}>{switchLabel} ↗</Link>
      </header>
      <div className="ed-access-content ed-container">
        <div className="ed-access-intro">
          <Link className="ed-back" href={backHref}><ArrowLeft size={15} /> {backLabel}</Link>
          <div className="ed-eyebrow">{badgeLabel.toUpperCase()} / ACCOUNT</div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="ed-access-abstract" aria-hidden="true"><span className="ed-aa-ring r1" /><span className="ed-aa-ring r2" /><span className="ed-aa-ring r3" /><strong>e.</strong></div>
        </div>
        <div className="ed-access-form">{children}</div>
      </div>
      <footer className="ed-auth-footer ed-container"><span>EDUSENSE / ACCESS</span><span>LEARN WITH INTENTION.</span></footer>
    </main>
  );
}