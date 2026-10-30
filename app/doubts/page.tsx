import { BackendWarmup } from "@/components/backend-warmup";
import { DoubtSolver } from "@/components/doubt-solver";
import { getCourses } from "@/lib/api/server-services";

export const dynamic = "force-dynamic";

export default async function DoubtsPage() {
  const subjects = await getCourses();

  return (
    <main className="h-dvh overflow-hidden">
      <BackendWarmup />
      <DoubtSolver subjects={subjects} />
    </main>
  );
}
