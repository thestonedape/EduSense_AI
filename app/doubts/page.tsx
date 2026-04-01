import { DoubtSolver } from "@/components/doubt-solver";
import { getCourses } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export default async function DoubtsPage() {
  const subjects = await getCourses();

  return (
    <main className="h-dvh overflow-hidden">
      <DoubtSolver subjects={subjects} />
    </main>
  );
}
