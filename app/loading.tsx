export default function Loading() {
  return (
    <div className="page-wrap">
      <div className="surface p-10">
        <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
