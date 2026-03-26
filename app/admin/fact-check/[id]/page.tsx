import { ClaimCard } from "@/components/claim-card";
import { getFactCheck } from "@/lib/api/services";
import { ClaimRecord } from "@/types";

export default async function FactCheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claims = (await getFactCheck(id)) as ClaimRecord[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Fact-Check System</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Validate claims and control final verdicts</h1>
      </div>

      <div className="space-y-4">
        {claims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
