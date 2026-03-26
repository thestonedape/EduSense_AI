"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { postChat } from "@/lib/api/services";
import { ChatMessage } from "@/types";

const seedMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Ask anything about this lecture. I’ll explain it simply and I can point you to timestamps when helpful.",
  },
];

export function ChatPanel({ lectureId }: { lectureId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

    const result = await postChat(nextUserMessage.content, lectureId);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
      },
    ]);
    setLoading(false);
  }

  return (
    <Card className="flex h-[calc(100vh-11rem)] flex-col">
      <CardHeader className="pb-4">
        <CardTitle>AI Tutor</CardTitle>
        <p className="text-sm text-muted-foreground">Simple explanations, examples, and optional lecture references.</p>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <ScrollArea className="min-h-0 flex-1 rounded-2xl border border-border bg-muted/35 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-card text-foreground shadow-sm"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Thinking through the lecture...
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <form className="flex gap-3" onSubmit={handleSubmit}>
          <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything about this lecture" />
          <Button type="submit" className="gap-2">
            <SendHorizonal className="h-4 w-4" />
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
