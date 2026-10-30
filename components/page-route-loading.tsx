import { Navbar } from "@/components/navbar";
import { SlowLoadNotice } from "@/components/slow-load-notice";

type PageRouteLoadingProps = {
  section: string;
  cards?: number;
};

export function PageRouteLoading({ section, cards = 3 }: PageRouteLoadingProps) {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="page-wrap space-y-8" role="status" aria-label={`Loading ${section}`}>
        <section className="surface space-y-4 p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{section}</p>
          <div className="h-9 w-56 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
          <SlowLoadNotice />
        </section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {Array.from({ length: cards }, (_, index) => (
            <div key={index} className="surface space-y-4 p-5">
              <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading {section}. Please wait.</span>
      </main>
    </div>
  );
}
