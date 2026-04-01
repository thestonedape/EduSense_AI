export default function LectureWorkspaceLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-80 animate-pulse rounded-2xl bg-muted" />
        <div className="h-4 w-[32rem] animate-pulse rounded-full bg-muted" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[32rem] animate-pulse rounded-[1.5rem] bg-white" />
        <div className="h-[32rem] animate-pulse rounded-[1.5rem] bg-white" />
      </div>
    </div>
  );
}
