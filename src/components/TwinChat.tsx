"use client";

/**
 * Digital Twin chat: a floating button that opens a chat panel.
 * Sends the conversation to /api/chat and shows the reply as it streams in.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";

type Message = { role: "user" | "assistant"; content: string };
type Status = "idle" | "streaming" | "error";

const MAX_CHARS = 1000;

const STARTERS = [
  "What do you do at Commonwealth Bank?",
  "Tell me about the scam intervention engine",
  "What's your experience with Kafka and Flink?",
  "How did you move from analyst to product owner?",
];

export default function TwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reduce = useReducedMotion();

  // Focus the input when the panel opens; Escape closes it.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, error, open]);

  // Cancel any in-flight request if the component goes away.
  useEffect(() => () => abortRef.current?.abort(), []);

  /** Send a conversation to the backend and stream the reply into the last bubble. */
  async function ask(history: Message[]) {
    setMessages([...history, { role: "assistant", content: "" }]);
    setStatus("streaming");
    setError("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      // The reply arrives in chunks. Read each one and grow the last bubble.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }

      if (!reply.trim()) throw new Error("The twin didn't answer. Please try again.");
      setStatus("idle");
    } catch (err) {
      if (controller.signal.aborted) {
        // The visitor pressed Stop: keep any partial reply, drop an empty bubble.
        setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -1)));
        setStatus("idle");
        return;
      }
      setMessages(history);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function send(text: string) {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || status === "streaming") return;
    setInput("");
    void ask([...messages, { role: "user", content: question }]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const streaming = status === "streaming";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Chat with ${profile.firstName}'s digital twin`}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 z-[55] flex h-[min(36rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line-strong bg-card shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Digital twin · AI
                </div>
                <p className="mt-1 truncate text-sm font-medium">Ask about {profile.firstName}&apos;s career</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-dim transition hover:border-fg hover:text-fg"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              aria-live="polite"
              aria-busy={streaming}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.length === 0 && (
                <div>
                  <p className="text-sm leading-relaxed text-dim">
                    Hi, I&apos;m an AI trained on {profile.firstName}&apos;s career history. Ask me
                    anything about his roles, projects or skills.
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {STARTERS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="rounded-full border border-line-strong px-3.5 py-2 text-left text-[13px] text-dim transition hover:border-accent hover:text-fg"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isUser = m.role === "user";
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <p
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-br-md bg-accent text-accent-ink"
                          : "rounded-bl-md border border-line bg-white/[0.04] text-fg"
                      }`}
                    >
                      {m.content}
                      {!isUser && isLast && streaming && (
                        <span
                          className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent"
                          aria-hidden
                        />
                      )}
                    </p>
                  </div>
                );
              })}

              {status === "error" && (
                <div className="rounded-xl border border-signal/40 bg-signal/10 px-3.5 py-3 text-sm text-fg">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => void ask(messages)}
                    className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-line p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_CHARS}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 py-2.5 text-base text-fg placeholder:text-faint focus:border-accent focus:outline-none sm:text-sm"
                />
                {streaming ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    className="shrink-0 rounded-full border border-line-strong px-4 py-2.5 text-sm font-medium transition hover:border-fg"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition disabled:opacity-40"
                  >
                    Send
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-[11px] leading-snug text-faint">
                AI-generated from this site&apos;s content. It can be wrong; for anything important,
                email {profile.firstName}.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[55] inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-card/90 px-5 py-3 text-sm font-medium text-fg shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md transition hover:border-accent"
        >
          <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
          Ask my digital twin
        </button>
      )}
    </>
  );
}
