import Link from "next/link";

import { DataTable } from "@/components/data-table";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { getProcessing } from "@/lib/api/services";
import { ProcessingJob } from "@/types";

export default async function ProcessingMonitorPage() {
  const jobs = (await getProcessing()) as ProcessingJob[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Processing Monitor</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Track each lecture pipeline run</h1>
      </div>

      <DataTable
        title="Lecture jobs"
        columns={["Lecture", "Status", "Progress", "Updated", "Actions"]}
        rows={jobs}
        renderRow={(job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.lectureName}</TableCell>
            <TableCell><StatusBadge status={job.status} /></TableCell>
            <TableCell className="min-w-48"><ProgressBar value={job.progress} /></TableCell>
            <TableCell>{job.updatedAt}</TableCell>
            <TableCell className="space-x-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/transcript/${job.id}`}>Transcript</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/admin/fact-check/${job.id}`}>Review</Link>
              </Button>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
