import { ChartCard } from "@/components/chart-card";
import { DataTable } from "@/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { getAnalytics } from "@/lib/api/services";

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Analytics</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Accuracy gaps and quality trends</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Most incorrect topics"
          items={analytics.tables.incorrectTopics.map((item: { topic: string; incidents: number }) => ({
            label: item.topic,
            value: item.incidents,
          }))}
        />
        <ChartCard
          title="Coverage pressure"
          items={[
            { label: "Optimization", value: 18 },
            { label: "Vector Databases", value: 12 },
            { label: "MLOps Monitoring", value: 10 },
          ]}
        />
      </div>

      <DataTable
        title="Lowest accuracy lectures"
        columns={["Lecture", "Accuracy", "Issue"]}
        rows={analytics.tables.lowAccuracyLectures}
        renderRow={(row: { lecture: string; accuracy: string; issue: string }) => (
          <TableRow key={row.lecture}>
            <TableCell className="font-medium">{row.lecture}</TableCell>
            <TableCell>{row.accuracy}</TableCell>
            <TableCell>{row.issue}</TableCell>
          </TableRow>
        )}
      />

      <DataTable
        title="Coverage gaps"
        columns={["Area", "Gap"]}
        rows={analytics.tables.coverageGaps}
        renderRow={(row: { area: string; gap: string }) => (
          <TableRow key={row.area}>
            <TableCell className="font-medium">{row.area}</TableCell>
            <TableCell>{row.gap}</TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
