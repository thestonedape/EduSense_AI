import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type PortalAccessShellProps = {
  brandIcon: LucideIcon;
  title: string;
  description: string;
  subtitle: string;
  badgeLabel: string;
  backHref: string;
  backLabel: string;
  switchHref: string;
  switchLabel: string;
  theme: "student" | "admin";
  children: React.ReactNode;
};

const themeStyles = {
  student: {
    page: "bg-[#f4efe7] text-slate-950",
    wash:
      "bg-[radial-gradient(circle_at_top,rgba(62,149,152,0.14),transparent_25%),radial-gradient(circle_at_18%_30%,rgba(195,125,74,0.1),transparent_22%),linear-gradient(180deg,#fbf8f1_0%,#f4efe7_56%,#f7f1e8_100%)]",
    grid: "bg-[linear-gradient(rgba(18,87,94,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,87,94,0.06)_1px,transparent_1px)]",
    brandIcon: "bg-[#145c63] text-white",
    badge: "border-[#145c63]/15 bg-white/88 text-[#145c63]",
    body: "text-slate-600",
    secondaryButton: "border-[#d8cab7] bg-white/90 text-slate-900 hover:border-[#145c63] hover:text-[#145c63]",
  },
  admin: {
    page: "bg-[#e7edf0] text-white",
    wash:
      "bg-[radial-gradient(circle_at_top,rgba(41,140,146,0.22),transparent_24%),radial-gradient(circle_at_18%_30%,rgba(92,72,48,0.16),transparent_22%),linear-gradient(180deg,#0f171c_0%,#13242b_55%,#152a33_100%)]",
    grid: "bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
    brandIcon: "bg-white/10 text-white",
    badge: "border-white/14 bg-white/8 text-white/86",
    body: "text-white/74",
    secondaryButton: "border-white/16 bg-white/8 text-white hover:border-white/30 hover:bg-white/12",
  },
} as const;

export function PortalAccessShell({
  brandIcon: BrandIcon,
  title,
  description,
  subtitle,
  badgeLabel,
  backHref,
  backLabel,
  switchHref,
  switchLabel,
  theme,
  children,
}: PortalAccessShellProps) {
  const styles = themeStyles[theme];

  return (
    <main className={`relative min-h-screen overflow-hidden ${styles.page}`}>
      <div className={`pointer-events-none absolute inset-0 ${styles.wash}`} />
      <div className={`pointer-events-none absolute inset-0 bg-[size:44px_44px] ${styles.grid}`} />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${styles.brandIcon}`}>
              <BrandIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">EduSense AI</p>
              <p className={`text-sm ${styles.body}`}>{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${styles.secondaryButton}`}
            >
              {backLabel}
            </Link>
            <Link
              href={switchHref}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${styles.secondaryButton}`}
            >
              {switchLabel}
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-4xl pb-16 pt-14 text-center sm:pt-18">
          <div className={`mx-auto inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] ${styles.badge}`}>
            {badgeLabel}
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className={`mx-auto mt-4 max-w-2xl text-base leading-8 ${styles.body}`}>{description}</p>

          <div className="mx-auto mt-10 max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
