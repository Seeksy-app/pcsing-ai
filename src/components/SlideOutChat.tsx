"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const PROMPT_CHIPS = [
  { emoji: "\u{1F3E0}", text: "What are my PCS entitlements?" },
  { emoji: "\u{1F4CB}", text: "Help me build a PCS checklist" },
  { emoji: "\u{1F4B0}", text: "Calculate my BAH and DLA" },
  { emoji: "\u{1F5FA}\uFE0F", text: "Tell me about my next base" },
  { emoji: "\u{1F4E6}", text: "How do I set up a DITY move?" },
  { emoji: "\u{1F3EB}", text: "Find schools near my base" },
];

/** Extract follow-up prompts (lines starting with →) from the end of a message */
function extractFollowUps(content: string): {
  body: string;
  followUps: string[];
} {
  const lines = content.split("\n");
  const followUps: string[] = [];

  // Walk backwards to find → lines at the end
  let i = lines.length - 1;
  while (i >= 0) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("→") || trimmed.startsWith("->")) {
      followUps.unshift(
        trimmed.replace(/^(→|->)\s*/, "").trim()
      );
      i--;
    } else if (trimmed === "") {
      i--;
    } else {
      break;
    }
  }

  const body = lines
    .slice(0, i + 1)
    .join("\n")
    .trimEnd();

  return { body, followUps };
}

/** Render markdown for assistant messages with conversational styling */
function ChatMarkdown({
  content,
  onFollowUp,
}: {
  content: string;
  onFollowUp: (text: string) => void;
}) {
  const { body, followUps } = extractFollowUps(content);

  return (
    <>
      <ReactMarkdown
        components={{
          // Render headers as bold text, not giant headings
          h1: ({ children }) => (
            <p className="mb-1 font-bold">{children}</p>
          ),
          h2: ({ children }) => (
            <p className="mb-1 font-bold">{children}</p>
          ),
          h3: ({ children }) => (
            <p className="mb-1 font-semibold">{children}</p>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => {
            // Internal links use Next.js Link
            if (href?.startsWith("/")) {
              return (
                <Link
                  href={href}
                  className="font-medium text-blue-600 underline hover:text-blue-800"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline hover:text-blue-800"
              >
                {children}
              </a>
            );
          },
          // No code blocks in chat
          code: ({ children }) => (
            <code className="rounded bg-gray-200 px-1 text-xs">
              {children}
            </code>
          ),
        }}
      >
        {body}
      </ReactMarkdown>

      {/* Follow-up prompt buttons */}
      {followUps.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {followUps.map((text, idx) => (
            <button
              key={idx}
              onClick={() => onFollowUp(text)}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-left text-xs text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function SlideOutChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseContext, setBaseContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasUserMessages = messages.some((m) => m.role === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg = text.trim();
      setInput("");

      const updated: Message[] = [
        ...messages,
        { role: "user", content: userMsg },
      ];
      setMessages(updated);
      setLoading(true);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updated, baseContext }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  ...last,
                  content: last.content + chunk,
                };
              }
              return copy;
            });
          }
        }
      } catch {
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && !last.content) {
            copy[copy.length - 1] = {
              ...last,
              content: "Sorry, something went wrong. Please try again.",
            };
          }
          return copy;
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, baseContext]
  );

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (
        e as CustomEvent<{ prefill?: string; baseContext?: string }>
      ).detail;
      setOpen(true);
      if (detail?.baseContext) setBaseContext(detail.baseContext);
      if (detail?.prefill) {
        setInput(detail.prefill);
        setTimeout(() => textareaRef.current?.focus(), 350);
      } else {
        setTimeout(() => textareaRef.current?.focus(), 350);
      }
    }
    window.addEventListener("open-ai-chat", onOpen);
    return () => window.removeEventListener("open-ai-chat", onOpen);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function newChat() {
    setMessages([]);
    setBaseContext(null);
    setInput("");
    setLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition hover:bg-blue-800"
        aria-label="Open chat"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-[50] bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* ── Slide-out panel ── */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-[50] flex w-screen flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:w-[450px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ─ Header ─ */}
        <div className="flex flex-shrink-0 items-center justify-between bg-blue-700 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <svg
              className="h-5 w-5 text-blue-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-lg font-semibold">PCS Assistant</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={newChat}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium transition hover:bg-blue-500"
            >
              New Chat
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 transition hover:bg-blue-600"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ─ Prompt chips (hidden after first message) ─ */}
        {!hasUserMessages && (
          <div className="flex-shrink-0 border-b px-5 py-4">
            <p className="mb-3 text-sm text-gray-500">Try asking about:</p>
            <div className="grid grid-cols-2 gap-2">
              {PROMPT_CHIPS.map((c) => (
                <button
                  key={c.text}
                  onClick={() => sendMessage(c.text)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex-shrink-0 text-sm">{c.emoji}</span>
                  <span className="line-clamp-2">{c.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─ Messages ─ */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.length === 0 && !loading && (
            <div className="mt-16 text-center text-gray-400">
              <svg
                className="mx-auto mb-3 h-10 w-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-sm">Ask me anything about your PCS move</p>
              {baseContext && (
                <p className="mt-1.5 text-xs text-blue-500">
                  Viewing: {baseContext}
                </p>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-blue-700 text-white"
                    : "rounded-bl-md bg-gray-100 text-gray-800"
                }`}
              >
                {msg.role === "assistant" ? (
                  <>
                    {msg.content ? (
                      <ChatMarkdown
                        content={msg.content}
                        onFollowUp={sendMessage}
                      />
                    ) : loading ? (
                      <span className="inline-flex gap-1">
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ─ Input ─ */}
        <div className="flex-shrink-0 border-t bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-end gap-3 px-4 pb-1 pt-3"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your PCS move..."
              rows={1}
              className="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-50"
              aria-label="Send"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
          <p className="pb-3 text-center text-[10px] text-gray-400">
            Powered by Claude
          </p>
        </div>
      </div>
    </>
  );
}
