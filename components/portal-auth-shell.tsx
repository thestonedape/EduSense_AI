import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type PortalMetric = {
  label: string;
  value: string;
};

type PortalHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PortalAuthShellProps = {
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
  highlights: PortalHighlight[];
  metrics: PortalMetric[];
  theme: "student" | "admin";
};

const themeStyles = {
  student: {
    page: "bg-[#f4efe7] text-slate-950",
    wash:
      "bg-[radial-gradient(circle_at_top,rgba(62,149,152,0.14),transparent_25%),radial-gradient(circle_at_18%_30%,rgba(195,125,74,0.1),transparent_22%),linear-gradient(180deg,#fbf8f1_0%,#f4efe7_56%,#f7f1e8_100%)]",
    grid: "bg-[linear-gradient(rgba(18,87,94,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,87,94,0.06)_1px,transparent_1px)]",
    orbA: "bg-[#1a747b]/12",
    orbB: "bg-[#d3a06c]/14",
    brandIcon: "bg-[#145c63] text-white",
    badge: "border-[#145c63]/15 bg-white/88 text-[#145c63]",
    accent: "text-[#145c63]",
    body: "text-slate-600",
    nav: "text-slate-600",
    primaryButton: "bg-[#145c63] text-white hover:bg-[#104c52]",
    secondaryButton: "border-[#d8cab7] bg-white/90 text-slate-900 hover:border-[#145c63] hover:text-[#145c63]",
    metricChip: "border-[#dfd2c2] bg-white/74 text-slate-800",
    featureCard: "border-[#e6d9ca] bg-white/76 shadow-[0_18px_40px_rgba(62,49,28,0.05)]",
    featureIcon: "bg-[#145c63]/10 text-[#145c63]",
  },
  admin: {
    page: "bg-[#e7edf0] text-white",
    wash:
      "bg-[radial-gradient(circle_at_top,rgba(41,140,146,0.22),transparent_24%),radial-gradient(circle_at_18%_30%,rgba(92,72,48,0.16),transparent_22%),linear-gradient(180deg,#0f171c_0%,#13242b_55%,#152a33_100%)]",
    grid: "bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
    orbA: "bg-[#2c9399]/16",
    orbB: "bg-[#a97b58]/14",
    brandIcon: "bg-white/10 text-white",
    badge: "border-white/14 bg-white/8 text-white/86",
    accent: "text-white",
    body: "text-white/74",
    nav: "text-white/74",
    primaryButton: "bg-white text-slate-950 hover:bg-white/92",
    secondaryButton: "border-white/16 bg-white/8 text-white hover:border-white/30 hover:bg-white/12",
    metricChip: "border-white/12 bg-white/[0.06] text-white",
    featureCard: "border-white/10 bg-white/[0.05] shadow-[0_18px_40px_rgba(0,0,0,0.1)]",
    featureIcon: "bg-white/10 text-white",
  },
} as const;

export function PortalAuthShell({
  brandIcon: BrandIcon,
  badgeIcon: BadgeIcon,
  badgeLabel,
  eyebrow,
  title,
  description,
  subtitle,
  metaLabel,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  highlights,
  metrics,
  theme,
}: PortalAuthShellProps) {
  const styles = themeStyles[theme];

  return (
    <main className={`relative min-h-screen overflow-hidden ${styles.page}`}>
      <div className={`pointer-events-none absolute inset-0 ${styles.wash}`} />
      <div className={`pointer-events-none absolute inset-0 bg-[size:44px_44px] ${styles.grid}`} />
      <div className={`pointer-events-none absolute left-[8%] top-24 h-40 w-40 rounded-full blur-3xl ${styles.orbA}`} />
      <div className={`pointer-events-none absolute right-[10%] top-36 h-48 w-48 rounded-full blur-3xl ${styles.orbB}`} />

      <div className="relative mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${styles.brandIcon}`}>
              <BrandIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">EduSense AI</p>
              <p className={`text-sm ${styles.body}`}>{subtitle}</p>
            </div>
          </div>

          <nav className={`hidden items-center gap-8 text-sm lg:flex ${styles.nav}`}>
            <a href="#overview" className="transition hover:opacity-100">
              Overview
            </a>
            <a href="#highlights" className="transition hover:opacity-100">
              Highlights
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={secondaryHref}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${styles.secondaryButton}`}
            >
              {secondaryLabel}
            </Link>
            <Link
              href={primaryHref}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${styles.primaryButton}`}
            >
              {primaryLabel}
            </Link>
          </div>
        </header>

        <section id="overview" className="pb-16 pt-10 sm:pb-18 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className={`mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] ${styles.badge}`}>
              <BadgeIcon className="h-4 w-4" />
              {badgeLabel}
            </div>
            <p className={`mt-8 text-sm font-semibold uppercase tracking-[0.34em] ${styles.accent}`}>{eyebrow}</p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[5rem] lg:leading-[0.95]">
              {title}
            </h1>
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg ${styles.body}`}>{description}</p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {metrics.map((item) => (
                <div key={item.label} className={`rounded-full border px-4 py-2 ${styles.metricChip}`}>
                  <span className="text-[11px] uppercase tracking-[0.22em] opacity-70">{item.label}</span>
                  <span className="ml-2 text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={primaryHref}
                className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition ${styles.primaryButton}`}
              >
                {primaryLabel}
              </Link>
              <a
                href="#highlights"
                className={`inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold transition ${styles.secondaryButton}`}
              >
                See highlights
              </a>
            </div>
          </div>
        </section>

        <section id="highlights" className="pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className={`text-sm font-semibold uppercase tracking-[0.28em] ${styles.accent}`}>{metaLabel}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Clearer entry. Better context. Less noise.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className={`rounded-[2rem] border p-7 ${styles.featureCard}`}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.featureIcon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${styles.body}`}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
