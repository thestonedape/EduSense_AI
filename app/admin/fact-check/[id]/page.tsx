import { ClaimCard } from "@/components/claim-card";
import { getFactCheck } from "@/lib/api/services";

export default async function FactCheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getFactCheck(id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flagged Claims</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{result.lectureName}</h1>
        <p className="mt-2 text-muted-foreground">
          Review only the claims the system flagged as false. Each card is judged against evidence retrieved from the whole lecture.
        </p>
      </div>

      {result.claims.length ? (
        <div className="space-y-4">
          {result.claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/70 bg-white p-8 text-sm text-muted-foreground">
          No false claims are currently flagged for this lecture. That can mean the OpenRouter review completed and found nothing false, or that this lecture still needs a fresh rebuild after your latest pipeline changes.
        </div>
      )}
    </div>
  );
}
