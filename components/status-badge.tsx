import { Badge } from "@/components/ui/badge";
import { ProcessingStatus } from "@/types";

const statusVariant = {
  pending: "outline",
  processing: "warning",
  completed: "success",
  failed: "danger",
} as const;

export function StatusBadge({ status }: { status: ProcessingStatus }) {
  return <Badge variant={statusVariant[status]}>{status.replace("_", " ")}</Badge>;
}
