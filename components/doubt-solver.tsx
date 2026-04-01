"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, Menu, Plus, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StudentDoubtResponse, StudentSubject } from "@/types";

type SolverMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  scopeLabel?: string;
  structuredAnswer?: StudentDoubtResponse["structuredAnswer"];
};

type StructuredSection = {
  heading: string;
  body: string[];
};

const STUDY_ROOM_SCOPE = "study room";
const STUDY_ROOM_WELCOME =
  "Hi! Ask any study doubt here. I can explain concepts clearly, simplify difficult topics, give examples, or focus on exam preparation.";

function createWelcomeMessage(): SolverMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: STUDY_ROOM_WELCOME,
    scopeLabel: STUDY_ROOM_SCOPE,
  };
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeSectionValue(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeSectionValue(item).map((line) => `- ${line}`));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, nestedValue]) => {
      const nestedLines = normalizeSectionValue(nestedValue);
      if (!nestedLines.length) {
        return [];
      }
      if (nestedLines.length === 1) {
        return [`${toTitleCase(key)}: ${nestedLines[0]}`];
      }
      return [`${toTitleCase(key)}:`, ...nestedLines.map((line) => (line.startsWith("- ") ? line : `- ${line}`))];
    });
  }

  if (value == null) {
    return [];
  }

  return [String(value)];
}

function tryParseStructuredObject(content: string): StructuredSection[] | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return null;
  }

  try {
    const parsed = Function(`"use strict"; return (${trimmed});`)() as Record<string, unknown>;
    const sections = Object.entries(parsed)
      .map(([heading, value]) => {
        return {
          heading: toTitleCase(heading),
          body: normalizeSectionValue(value),
        };
      })
      .filter((section) => section.body.some((line) => line.trim()));

    return sections.length ? sections : null;
  } catch {
    return null;
  }
}

const composerActions = [
  { label: "Simplify", prompt: "Simplify the previous answer." },
  { label: "Give examples", prompt: "Give examples for the previous answer." },
  { label: "Focus on exams", prompt: "Rewrite the previous answer for exam preparation." },
];

function parseStructuredSections(content: string): StructuredSection[] {
  const objectSections = tryParseStructuredObject(content);
  if (objectSections) {
    return objectSections;
  }

  const lines = content.split(/\r?\n/);
  const sections: StructuredSection[] = [];
  let current: StructuredSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(/^#{1,2}\s+(.*)$/);

    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[1].trim(), body: [] };
      continue;
    }

    if (!current) {
      current = { heading: "Answer", body: [] };
    }
    current.body.push(line);
  }

  if (current) sections.push(current);
  const cleanedSections = sections
    .map((section) => ({
      ...section,
      body: section.body.filter((line) => line.trim()),
    }))
    .filter((section) => section.heading.trim() && section.body.length > 0);
  return cleanedSections.length ? cleanedSections : [{ heading: "Answer", body: [content] }];
}

function hasStructuredHeadings(content: string) {
  return /^#{1,2}\s+/m.test(content) || Boolean(tryParseStructuredObject(content));
}

function renderBody(lines: string[], heading?: string) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  const isTakeawaySection = (heading || "").toLowerCase().includes("takeaway");

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="text-[15px] leading-8 text-[#1f2937]">
        {paragraph.join(" ").trim()}
      </p>,
    );
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-2 pl-5 text-[15px] leading-8 text-[#1f2937]">
        {list.map((item, index) => (
          <li key={`${item}-${index}`} className="list-disc">
            {item}
          </li>
        ))}
      </ul>,
    );
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
      continue;
    }

    flushList();
    if (isTakeawaySection && paragraph.length === 0) {
      list.push(line);
      continue;
    }
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function AssistantMessage({ message }: { message: SolverMessage }) {
  const structuredSectionsFromPayload = message.structuredAnswer
    ? [
        message.structuredAnswer.coreConcept
          ? { heading: "Core Concept", body: [message.structuredAnswer.coreConcept] }
          : null,
        message.structuredAnswer.simpleExplanation
          ? { heading: "Simple Explanation", body: [message.structuredAnswer.simpleExplanation] }
          : null,
        message.structuredAnswer.deepExplanation
          ? { heading: "Deep Explanation", body: [message.structuredAnswer.deepExplanation] }
          : null,
        message.structuredAnswer.exampleOrAnalogy
          ? { heading: "Example / Analogy", body: [message.structuredAnswer.exampleOrAnalogy] }
          : null,
        message.structuredAnswer.keyTakeaways?.length
          ? { heading: "Key Takeaways", body: message.structuredAnswer.keyTakeaways.map((item) => `- ${item}`) }
          : null,
      ].filter(Boolean) as StructuredSection[]
    : null;
  const structured = structuredSectionsFromPayload ? true : hasStructuredHeadings(message.content);
  const sections = structuredSectionsFromPayload ?? parseStructuredSections(message.content);

  return (
    <article className="w-full max-w-[720px] space-y-7">
      {message.scopeLabel ? (
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f766e]">
          {message.scopeLabel}
        </div>
      ) : null}
      {!structured ? <div className="space-y-4">{renderBody([message.content])}</div> : null}
      {structured
        ? sections.map((section, index) => {
        const normalizedHeading = section.heading.toLowerCase();
        const collapsible =
          normalizedHeading.includes("technical breakdown") ||
          normalizedHeading.includes("edge cases");

        if (collapsible) {
          return (
            <details key={`${section.heading}-${index}`} className="group rounded-2xl bg-white/70 px-4 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[#111827] marker:hidden">
                {section.heading}
              </summary>
              <div className="mt-4 space-y-4">{renderBody(section.body, section.heading)}</div>
            </details>
          );
        }

        return (
          <section key={`${section.heading}-${index}`} className="space-y-4">
            <h2 className={cn("font-display font-semibold tracking-tight text-[#111827]", index === 0 ? "text-[2rem]" : "text-[1.35rem]")}>
              {section.heading}
            </h2>
            <div className="space-y-4">{renderBody(section.body, section.heading)}</div>
          </section>
        );
      })
        : null}
    </article>
  );
}

export function DoubtSolver({ subjects }: { subjects: StudentSubject[] }) {
  const [messages, setMessages] = useState<SolverMessage[]>([{ ...createWelcomeMessage(), id: "welcome" }]);
  const [input, setInput] = useState("");
  const [subjectId, setSubjectId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const userQuestions = useMemo(() => messages.filter((message) => message.role === "user"), [messages]);
  const currentScopeLabel =
    subjectId === "all" ? "All study material" : subjects.find((subject) => subject.id === subjectId)?.name || "Selected subject";

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  function resizeTextarea(node: HTMLTextAreaElement | null) {
    if (!node) return;
    node.style.height = "0px";
    node.style.height = `${Math.min(node.scrollHeight, 220)}px`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: SolverMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "120px";
    }

    try {
      const response = await fetch("/api/student/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          subjectId: subjectId === "all" ? null : subjectId,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | (StudentDoubtResponse & {
            scope_label?: string;
            detail?: string;
            message?: string;
            structured_answer?: {
              core_concept?: string | null;
              simple_explanation?: string | null;
              deep_explanation?: string | null;
              example_or_analogy?: string | null;
              key_takeaways?: string[];
            } | null;
          })
        | null;

      if (!response.ok || !payload) {
        throw new Error(payload?.detail || payload?.message || "Doubt solver failed.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload.response,
          scopeLabel: payload.scopeLabel || payload.scope_label,
          structuredAnswer: payload.structuredAnswer
            || (payload.structured_answer
              ? {
                  coreConcept: payload.structured_answer.core_concept || null,
                  simpleExplanation: payload.structured_answer.simple_explanation || null,
                  deepExplanation: payload.structured_answer.deep_explanation || null,
                  exampleOrAnalogy: payload.structured_answer.example_or_analogy || null,
                  keyTakeaways: payload.structured_answer.key_takeaways || [],
                }
              : null),
        },
      ]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The doubt solver could not answer right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function applyComposerAction(prompt: string) {
    setInput(prompt);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        resizeTextarea(textareaRef.current);
      }
    });
  }

  function resetConversation() {
    setMessages([createWelcomeMessage()]);
  }

  return (
    <div className="flex h-dvh bg-[#f6f3ec] text-[#111827]">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#111827]/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-[#e8e2d8] bg-[#f3efe7] transition-all duration-300 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarOpen ? "w-[280px]" : "w-[72px]",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            {sidebarOpen ? (
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f766e]">Study Room</p>
                <p className="text-sm text-[#6b7280]">Ask, revise, and refine</p>
              </div>
            ) : null}
            <button
              type="button"
              className="rounded-full p-2 text-[#6b7280] transition hover:bg-white/70 hover:text-[#111827]"
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {sidebarOpen ? (
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-6">
                <section>
                  <Link
                    href="/"
                    onClick={() => setSidebarOpen(false)}
                    className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-[#6b7280] transition hover:bg-white/80 hover:text-[#111827]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Dashboard
                  </Link>
                </section>
                <section className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">Recent Doubts</p>
                  <button
                    type="button"
                    onClick={() => {
                      resetConversation();
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-2xl bg-white/80 px-3 py-3 text-left text-sm text-[#374151] transition hover:bg-white"
                  >
                    <Plus className="h-4 w-4 text-[#0f766e]" />
                    New chat
                  </button>
                  <div className="space-y-2">
                    {userQuestions.length ? (
                      userQuestions.map((message, index) => (
                        <div key={message.id} className="rounded-2xl px-3 py-3 text-sm leading-6 text-[#4b5563]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]/80">Question {index + 1}</p>
                          <p className="mt-1 line-clamp-3">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl px-3 py-3 text-sm leading-6 text-[#6b7280]">
                        Your doubt trail will appear here as the conversation grows.
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">Study Scope</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectId("all");
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-2xl px-3 py-3 text-left text-sm transition",
                        subjectId === "all" ? "bg-[#0f766e] text-white" : "text-[#374151] hover:bg-white/80",
                      )}
                    >
                      All study material
                    </button>
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => {
                          setSubjectId(subject.id);
                          setSidebarOpen(false);
                        }}
                        className={cn(
                          "w-full rounded-2xl px-3 py-3 text-left text-sm transition",
                          subjectId === subject.id ? "bg-[#0f766e] text-white" : "text-[#374151] hover:bg-white/80",
                        )}
                      >
                        <div className="font-medium">{subject.code}</div>
                        <div className="mt-1 text-xs opacity-80">{subject.name}</div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-1 flex-col items-center gap-3 px-2 py-3">
              <button
                type="button"
                onClick={resetConversation}
                className="rounded-full bg-white/80 p-2 text-[#0f766e]"
                aria-label="New conversation"
              >
                <Plus className="h-4 w-4" />
              </button>
              {subjects.slice(0, 6).map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSubjectId(subject.id)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold transition",
                    subjectId === subject.id ? "bg-[#0f766e] text-white" : "bg-white/80 text-[#374151]",
                  )}
                  title={subject.name}
                >
                  {subject.code.slice(0, 2)}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[#e8e2d8] bg-[#f8f5ef]/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full max-w-[780px] items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[#d8d1c4] bg-white/80 p-2 text-[#6b7280] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8d1c4] bg-white/80 px-3 py-2 text-xs font-medium text-[#6b7280] transition hover:text-[#111827] sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f766e]">{currentScopeLabel}</p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="mx-auto w-full max-w-[780px] space-y-8 px-4 py-6 sm:px-6 sm:py-10">
            {messages.map((message, index) => (
              <div key={message.id} className="space-y-5">
                {message.role === "user" && index > 0 ? <div className="h-px w-full bg-[#e8e2d8]" /> : null}
                {message.role === "user" ? (
                  <div className="ml-auto max-w-full rounded-[1.4rem] bg-white px-4 py-4 text-[15px] leading-7 text-[#111827] shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:max-w-[420px] sm:px-5">
                    {message.content}
                  </div>
                ) : (
                  <AssistantMessage message={message} />
                )}
              </div>
            ))}

            {loading ? (
              <div className="inline-flex items-center gap-2 text-sm text-[#6b7280]">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Thinking through the approved study material...
              </div>
            ) : null}

            {error ? <div className="text-sm text-[#b42318]">{error}</div> : null}
          </div>
        </ScrollArea>

        <div className="border-t border-[#e8e2d8] bg-[#f8f5ef]/95 px-4 py-4 backdrop-blur sm:px-6">
          <form className="mx-auto w-full max-w-[780px] space-y-3" onSubmit={handleSubmit}>
            <Textarea
              ref={(node) => {
                textareaRef.current = node;
                resizeTextarea(node);
              }}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                resizeTextarea(event.target);
              }}
              placeholder="Ask a doubt or refine the previous answer..."
              className="min-h-[104px] resize-none rounded-[1.4rem] border-0 bg-white px-4 py-4 text-[15px] leading-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)] focus-visible:ring-1 focus-visible:ring-[#0f766e] sm:min-h-[120px] sm:px-5"
            />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {composerActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => applyComposerAction(action.prompt)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#6b7280] transition hover:text-[#111827]"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <Button type="submit" className="w-full gap-2 rounded-full bg-[#0f766e] px-6 hover:bg-[#115e59] md:w-auto" disabled={loading || !input.trim()}>
                <SendHorizonal className="h-4 w-4" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
