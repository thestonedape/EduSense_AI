import { ChartCard } from "@/components/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics } from "@/lib/api/services";

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();
  const summary = analytics.summary;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin Dashboard</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Content operations at a glance</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total lectures processed" value={summary.totalLectures.toString()} />
        <MetricCard label="Lectures in queue" value={summary.queueCount.toString()} />
        <MetricCard label="Failed jobs" value={summary.failedJobs.toString()} />
        <MetricCard label="Accuracy overview" value={`${summary.averageAccuracy}%`} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Pipeline throughput"
          items={[
            { label: "Ingestion", value: 132 },
            { label: "Transcript structuring", value: 118 },
            { label: "Fact-check validation", value: 104 },
            { label: "Knowledge sync", value: 95 },
          ]}
        />
        <ChartCard
          title="Accuracy by stage"
          items={[
            { label: "Extraction", value: 94 },
            { label: "Segmentation", value: 89 },
            { label: "Claim verification", value: 91 },
            { label: "Knowledge linking", value: 88 },
          ]}
        />
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-4xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
