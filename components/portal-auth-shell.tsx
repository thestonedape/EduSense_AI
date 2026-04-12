import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type PortalFeature = {
  title: string;
  description: string;
};

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
  switchLabel: string;
  switchDescription: string;
  switchHref: string;
  switchHrefLabel: string;
  highlights: PortalHighlight[];
  features: PortalFeature[];
  metrics: PortalMetric[];
  theme: "student" | "admin";
  children: React.ReactNode;
};

const themeStyles = {
  student: {
    page: "bg-[linear-gradient(180deg,#fbf9f4_0%,#f4efe6_100%)]",
    shell:
      "bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,244,236,0.98))] border-border/70 text-slate-950",
    grid: "bg-[linear-gradient(rgba(24,91,99,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(24,91,99,0.05)_1px,transparent_1px)] opacity-40",
    orbA: "bg-[#dceee9]",
    orbB: "bg-[#f1ddc7]",
    brandIcon: "bg-primary text-primary-foreground",
    badge: "border-primary/15 bg-white/80 text-primary",
    eyebrow: "text-primary",
    body: "text-slate-600",
    card: "border-white/80 bg-white/80 shadow-[0_14px_36px_rgba(15,23,42,0.06)]",
    iconBox: "bg-primary/10 text-primary",
    dividerCard: "border-slate-200/80 bg-white/72",
    panel: "border-slate-200/80 bg-white/90 shadow-[0_18px_44px_rgba(15,23,42,0.08)]",
    panelIntro: "text-slate-600",
    metric: "bg-[#f8f4eb] text-slate-950",
    metricLabel: "text-slate-500",
    switchPanel: "border-slate-200/80 bg-white/76",
    switchLink: "border-slate-300 bg-white text-slate-900 hover:border-primary hover:text-primary",
  },
  admin: {
    page: "bg-[linear-gradient(180deg,#eef2f5_0%,#e5eaef_100%)]",
    shell: "bg-[linear-gradient(135deg,#101a20,#143942)] border-white/5 text-white",
    grid: "bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] opacity-35",
    orbA: "bg-[#1f5960]",
    orbB: "bg-[#5c3a27]",
    brandIcon: "bg-white/10 text-white",
    badge: "border-white/15 bg-white/5 text-white/85",
    eyebrow: "text-white/65",
    body: "text-white/72",
    card: "border-white/10 bg-white/5",
    iconBox: "bg-white/10 text-white",
    dividerCard: "border-white/10 bg-white/5",
    panel: "border-slate-200/90 bg-white/96 shadow-[0_18px_44px_rgba(15,23,42,0.08)]",
    panelIntro: "text-slate-600",
    metric: "bg-white/95 text-slate-950",
    metricLabel: "text-slate-500",
    switchPanel: "border-white/10 bg-white/5",
    switchLink: "border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15",
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
  switchLabel,
  switchDescription,
  switchHref,
  switchHrefLabel,
  highlights,
  features,
  metrics,
  theme,
  children,
}: PortalAuthShellProps) {
  const styles = themeStyles[theme];

  return (
    <main className={`min-h-screen px-6 py-6 sm:py-10 ${styles.page}`}>
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.22fr_0.78fr]">
        <section className={`relative overflow-hidden rounded-[2rem] border p-8 shadow-panel sm:p-10 lg:p-12 ${styles.shell}`}>
          <div className={`absolute inset-0 bg-[size:36px_36px] ${styles.grid}`} />
          <div className={`absolute -left-24 top-0 h-72 w-72 rounded-full blur-3xl ${styles.orbA}`} />
          <div className={`absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl ${styles.orbB}`} />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${styles.brandIcon}`}>
                    <BrandIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-[2rem] font-semibold tracking-tight">EduSense AI</p>
                    <p className={`text-sm ${styles.body}`}>{subtitle}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${styles.badge}`}>
                  <BadgeIcon className="h-4 w-4" />
                  {badgeLabel}
                </div>
              </div>

              <div className="max-w-4xl space-y-5">
                <p className={`text-sm font-semibold uppercase tracking-[0.32em] ${styles.eyebrow}`}>{eyebrow}</p>
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[4.4rem] lg:leading-[0.96]">
                  {title}
                </h1>
                <p className={`max-w-2xl text-base leading-8 sm:text-lg ${styles.body}`}>{description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className={`rounded-[1.65rem] border p-5 backdrop-blur ${styles.card}`}>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.iconBox}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
                      <p className={`mt-2 text-sm leading-7 ${styles.body}`}>{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className={`rounded-[1.75rem] border p-6 ${styles.dividerCard}`}>
                  <p className={`text-sm uppercase tracking-[0.25em] ${styles.eyebrow}`}>{metaLabel}</p>
                  <div className={`mt-5 space-y-4 text-sm leading-7 ${styles.body}`}>
                    {features.map((item) => (
                      <div key={item.title}>
                        <p className="font-semibold text-inherit">{item.title}</p>
                        <p className="mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`grid gap-4 rounded-[1.75rem] border p-6 ${styles.dividerCard} sm:grid-cols-3`}>
                  {metrics.map((item) => (
                    <div key={item.label} className={`rounded-[1.35rem] px-4 py-4 ${styles.metric}`}>
                      <p className={`text-xs uppercase tracking-[0.22em] ${styles.metricLabel}`}>{item.label}</p>
                      <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-[1.75rem] border p-6 ${styles.switchPanel}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className={`text-sm uppercase tracking-[0.25em] ${styles.eyebrow}`}>{switchLabel}</p>
                  <p className="mt-2 text-lg font-medium">{switchDescription}</p>
                </div>
                <Link
                  href={switchHref}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${styles.switchLink}`}
                >
                  {switchHrefLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center lg:justify-end">
          <div className={`w-full max-w-md rounded-[2rem] border p-3 sm:p-4 ${styles.panel}`}>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
