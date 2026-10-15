export default function Loading() {
  return (
    <main className="flex h-dvh flex-col bg-background p-4 sm:p-8" role="status" aria-label="Loading doubt solver">
      <div className="mb-8 h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-end gap-4">
        <div className="h-24 w-4/5 animate-pulse rounded-xl bg-muted" />
        <div className="h-20 w-3/5 animate-pulse self-end rounded-xl bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
      </div>
      <span className="sr-only">Opening the doubt solver.</span>
    </main>
  );
}
