import { AdminStatePanel } from "@/components/admin-state-panel";
import { ChartCard } from "@/components/chart-card";
import { DataTable } from "@/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { getAnalytics } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  let analytics;
  let loadFailed = false;

  try {
    analytics = await getAnalytics();
  } catch {
    loadFailed = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Analytics</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Validation health and quality trends</h1>
      </div>

      {loadFailed || !analytics ? (
        <AdminStatePanel
          tone="error"
          eyebrow="Analytics Offline"
          title="Analytics are not available right now."
          description="We could not load accuracy and coverage analytics just now. Retry once the backend settles."
          primaryHref="/admin/analytics"
          primaryLabel="Retry Analytics"
          secondaryHref="/admin/processing"
          secondaryLabel="Open Queue"
        />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard
              title="Validation Overview"
              items={analytics.validationOverview}
            />
            <ChartCard
              title="Processing health"
              items={analytics.pipelineHealth}
            />
            <ChartCard
              title="Processing Latency"
              items={analytics.processingLatency}
            />
            <ChartCard
              title="Most incorrect topics"
              items={analytics.mostIncorrectTopics.map((item) => ({
                label: item.topic,
                value: item.incidents,
              }))}
            />
            <ChartCard
              title="Failure stages"
              items={analytics.stageFailureBreakdown}
            />
            <ChartCard
              title="Source split"
              items={analytics.validationSourceSplit}
            />
            <ChartCard title="Accuracy trends" items={analytics.trends} />
          </div>

          <DataTable
            title="Lowest accuracy lectures"
            columns={["Lecture", "Accuracy", "Issue"]}
            rows={analytics.lowestAccuracyLectures}
            renderRow={(row, index) => (
              <TableRow key={`${row.lecture}-${index}`}>
                <TableCell className="font-medium">{row.lecture}</TableCell>
                <TableCell>{row.accuracy}</TableCell>
                <TableCell>{row.issue}</TableCell>
              </TableRow>
            )}
          />

          <DataTable
            title="Lectures blocked from student knowledge"
            columns={["Lecture", "Blocked Topics", "Flagged Topics", "Approved Topics"]}
            rows={analytics.lecturesBlockedFromKb}
            renderRow={(row, index) => (
              <TableRow key={`${row.lecture}-${index}`}>
                <TableCell className="font-medium">{row.lecture}</TableCell>
                <TableCell>{row.blockedTopics}</TableCell>
                <TableCell>{row.flaggedTopics}</TableCell>
                <TableCell>{row.approvedTopics}</TableCell>
              </TableRow>
            )}
          />

          <DataTable
            title="Coverage gaps"
            columns={["Area", "Gap"]}
            rows={analytics.coverageGaps}
            renderRow={(row, index) => (
              <TableRow key={`${row.area}-${index}`}>
                <TableCell className="font-medium">{row.area}</TableCell>
                <TableCell>{row.gap}</TableCell>
              </TableRow>
            )}
          />

          <DataTable
            title="Retry Hotspots"
            columns={["Lecture", "Job Type", "Stage", "Retries"]}
            rows={analytics.retryHotspots}
            renderRow={(row, index) => (
              <TableRow key={`${row.lecture}-${index}`}>
                <TableCell className="font-medium">{row.lecture}</TableCell>
                <TableCell>{row.jobType.replaceAll("_", " ")}</TableCell>
                <TableCell>{row.stage.replaceAll("_", " ")}</TableCell>
                <TableCell>{row.retryCount}</TableCell>
              </TableRow>
            )}
          />
        </>
      )}
    </div>
  );
}
