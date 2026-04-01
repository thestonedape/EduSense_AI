import { AdminStatePanel } from "@/components/admin-state-panel";
import { TopicList } from "@/components/topic-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getKnowledge } from "@/lib/api/services";
import type { KnowledgeTopic } from "@/types";

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; topic?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  let topics: KnowledgeTopic[] = [];
  let loadFailed = false;

  if (query) {
    try {
      topics = await getKnowledge({
        query,
        topic: params.topic,
        limit: params.limit ? Number(params.limit) : undefined,
      });
    } catch {
      loadFailed = true;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Student Knowledge</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Search approved study knowledge</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Search only the lecture topics and reference content that are approved for student use.
        </p>
      </div>

      <form className="flex max-w-3xl gap-3" action="/admin/knowledge" method="get">
        <Input
          name="query"
          defaultValue={query}
          placeholder="Search by topic or keyword"
          className="bg-white"
          required
        />
        <Button type="submit">Search</Button>
      </form>

      {query ? (
        loadFailed ? (
          <AdminStatePanel
            tone="error"
            eyebrow="Knowledge Search Failed"
            title="The knowledge search is not available right now."
            description="We could not search approved study knowledge just now. Try the same query again in a moment."
            primaryHref={`/admin/knowledge?query=${encodeURIComponent(query)}`}
            primaryLabel="Retry Search"
          />
        ) : topics.length ? (
          <TopicList topics={topics} />
        ) : (
          <AdminStatePanel
            tone="empty"
            eyebrow="No Knowledge Match"
            title="No approved study knowledge matched that search."
            description="Try a broader keyword, or approve more lecture topics first."
            primaryHref="/admin/transcript"
            primaryLabel="Review Topics"
            secondaryHref="/admin/upload"
            secondaryLabel="Create Lecture Record"
          />
        )
      ) : (
        <AdminStatePanel
          tone="empty"
          eyebrow="Search Ready"
          title="The approved study knowledge index is ready."
          description="Enter a topic, concept, or keyword to search across approved lecture knowledge and trusted reference content."
        />
      )}
    </div>
  );
}
