import { ChartCard } from "@/components/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboard } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const dashboard = await getDashboard();
  const summary = dashboard.summary;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin Dashboard</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Content operations at a glance</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total lectures processed" value={summary.totalLectures.toString()} />
        <MetricCard label="Lectures in queue" value={summary.queueCount.toString()} />
        <MetricCard label="Failed jobs" value={summary.failedJobs.toString()} />
        <MetricCard label="Accuracy overview" value={`${summary.averageAccuracy}%`} />
        <MetricCard label="Approved topics" value={summary.approvedTopicsTotal.toString()} />
        <MetricCard label="Flagged topics" value={summary.flaggedTopicsTotal.toString()} />
        <MetricCard label="Lectures blocked from student access" value={summary.blockedLectures.toString()} />
        <MetricCard label="Reference-backed lectures" value={summary.referenceBackedLectures.toString()} />
        <MetricCard label="Active jobs" value={summary.activeProcessingJobs.toString()} />
        <MetricCard label="Average job duration" value={`${summary.averageJobDurationMinutes} min`} />
        <MetricCard label="Average retries" value={summary.averageJobRetries.toString()} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Status breakdown" items={dashboard.statusBreakdown} />
        <ChartCard
          title="Recent lecture progress"
          items={dashboard.recentLectures.map((lecture) => ({
            label: lecture.lectureName,
            value: lecture.progress,
          }))}
        />
        <ChartCard
          title="Review status"
          items={[
            { label: "Approved topics", value: summary.approvedTopicsTotal },
            { label: "Flagged topics", value: summary.flaggedTopicsTotal },
            { label: "Blocked lectures", value: summary.blockedLectures },
          ]}
        />
        <ChartCard
          title="Source coverage"
          items={[
            { label: "Reference-backed", value: summary.referenceBackedLectures },
            { label: "Model-reviewed", value: summary.modelReviewedLectures },
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
