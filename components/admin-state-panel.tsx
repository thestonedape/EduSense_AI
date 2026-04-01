import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AdminStatePanelProps = {
  tone: "empty" | "error";
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AdminStatePanel({
  tone,
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: AdminStatePanelProps) {
  const accentClass =
    tone === "error"
      ? "bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.16),transparent_45%)]"
      : "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_45%)]";

  const badgeClass =
    tone === "error" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-sky-50 text-sky-700 border-sky-200";

  return (
    <Card className={`relative overflow-hidden border border-border/70 bg-white ${accentClass}`}>
      <CardContent className="relative space-y-5 p-8">
        <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${badgeClass}`}>
          {eyebrow}
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-semibold text-slate-950">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {(primaryHref && primaryLabel) || (secondaryHref && secondaryLabel) ? (
          <div className="flex flex-wrap gap-3">
            {primaryHref && primaryLabel ? (
              <Button asChild>
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Button asChild variant="outline">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
