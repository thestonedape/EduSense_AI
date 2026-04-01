"use client";

import { FormEvent, useMemo, useState } from "react";
import { AlertCircle, LoaderCircle, MessageSquareMore, SendHorizonal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { postChat } from "@/lib/api/services";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

const seedMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Ask anything about this lecture. I’ll explain it simply and keep the answer focused on the approved study material.",
  },
];

const promptIdeas = [
  "Explain the central idea in simple language.",
  "What should I remember for revision?",
  "Give me a short exam-focused summary.",
  "What mistake do students usually make here?",
];

export function ChatPanel({ lectureId, lectureTitle }: { lectureId: string; lectureTitle?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const starterPrompts = useMemo(() => promptIdeas.slice(0, 4), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const nextUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/student/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureId, message: nextUserMessage.content }),
      });
      if (!response.ok) {
        throw new Error("Chat failed");
      }
      const result = (await response.json()) as Awaited<ReturnType<typeof postChat>>;

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.response,
        },
      ]);
    } catch {
      setError("The tutor could not load validated study context just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex min-h-[560px] flex-col overflow-hidden border-primary/10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.95))] sm:min-h-[680px] xl:min-h-[760px]">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Study Tutor
            </div>
            <CardTitle className="text-2xl">Ask for a cleaner explanation</CardTitle>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {lectureTitle
                ? `This tutor is scoped to ${lectureTitle} and answers only from student-ready lecture knowledge.`
                : "This tutor answers only from student-ready lecture knowledge."}
            </p>
          </div>
          <div className="hidden rounded-3xl border border-border/70 bg-white/80 p-3 shadow-sm lg:block">
            <MessageSquareMore className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-5 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border border-border/70 bg-white/80 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              onClick={() => setInput(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <ScrollArea className="min-h-0 flex-1 rounded-[28px] border border-border/80 bg-white/75 p-5 shadow-inner">
          <div className="space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[94%] rounded-[24px] px-5 py-4 text-sm leading-7 shadow-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "border border-border/70 bg-card text-foreground",
                )}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-[24px] border border-border/70 bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Thinking through the lecture...
              </div>
            ) : null}
            {error ? (
              <div className="inline-flex items-center gap-2 rounded-[24px] border border-danger/40 bg-danger/10 px-5 py-4 text-sm text-danger">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask for a simple explanation, revision summary, or concept breakdown..."
            className="min-h-[120px] resize-none rounded-[24px] border-border/80 bg-white/90 px-4 py-4 text-sm leading-6"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground sm:max-w-[70%]">
              Keep it specific for the best answer. The tutor only uses approved lecture material.
            </p>
            <Button type="submit" className="w-full gap-2 rounded-full px-5 sm:w-auto" disabled={loading || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
            Send
          </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
