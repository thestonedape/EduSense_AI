"use client";

import { useMemo, useState } from "react";

import { TopicList } from "@/components/topic-list";
import { Input } from "@/components/ui/input";
import { knowledgeTopics } from "@/lib/data/mock-data";

export default function KnowledgePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    return knowledgeTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(value) ||
        topic.linkedLectures.some((lecture) => lecture.toLowerCase().includes(value)),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Knowledge Base</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Search validated topics and linked lectures</h1>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by topic or keyword"
        className="max-w-xl bg-white"
      />

      <TopicList topics={filtered} />
    </div>
  );
}
