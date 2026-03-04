"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { BASES, PAY_GRADES, getRate, type PayGrade } from "@/data/bah-rates-2026";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type BahWidget =
  | "bah-grade"
  | "bah-station"
  | "bah-dependents"
  | "bah-result"
  | "bah-save";

type Message = {
  role: "user" | "assistant";
  content: string;
  widget?: BahWidget;
  /** Data attached to bah-result messages */
  bahData?: {
    grade: PayGrade;
    slug: string;
    baseName: string;
    dependents: boolean;
    rate: number;
  };
};

const BAH_PATTERN = /\b(calculate|bah|housing allowance|basic allowance)\b/i;

const PROMPT_CHIPS = [
  { emoji: "\u{1F4B0}", text: "Calculate my BAH" },
  { emoji: "\u{1F4CB}", text: "PCS checklist" },
  { emoji: "\u{1F3E0}", text: "PCS entitlements breakdown" },
  { emoji: "\u{1F4E6}", text: "DITY move steps" },
  { emoji: "\u{1F3EB}", text: "Schools near base" },
  { emoji: "\u{1F5FA}\uFE0F", text: "Housing options" },
];

const GRADE_GROUPS = {
  Enlisted: PAY_GRADES.filter((g) => g.startsWith("E-")),
  Warrant: PAY_GRADES.filter((g) => g.startsWith("W-")),
  Officer: PAY_GRADES.filter((g) => g.startsWith("O-")),
};

const BASE_LIST = Object.entries(BASES).map(([slug, entry]) => ({
  slug,
  name: entry.name,
}));

/** Extract follow-up prompts (lines starting with →) from the end of a message */
function extractFollowUps(content: string): {
  body: string;
  followUps: string[];
} {
  const lines = content.split("\n");
  const followUps: string[] = [];

  let i = lines.length - 1;
  while (i >= 0) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("→") || trimmed.startsWith("->")) {
      followUps.unshift(trimmed.replace(/^(→|->)\s*/, "").trim());
      i--;
    } else if (trimmed === "") {
      i--;
    } else {
      break;
    }
  }

  const body = lines.slice(0, i + 1).join("\n").trimEnd();
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
          code: ({ children }) => (
            <code className="rounded bg-gray-200 px-1 text-xs">
              {children}
            </code>
          ),
        }}
      >
        {body}
      </ReactMarkdown>

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

/* ── BAH Widget Components ── */

function BahGradePicker({
  onSelect,
  disabled,
}: {
  onSelect: (grade: PayGrade) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-2 space-y-2.5">
      {Object.entries(GRADE_GROUPS).map(([label, grades]) => (
        <div key={label}>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <div className="flex flex-wrap gap-1">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => onSelect(g)}
                disabled={disabled}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BahStationPicker({
  onSelect,
  disabled,
}: {
  onSelect: (slug: string, name: string) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? BASE_LIST.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : BASE_LIST.slice(0, 8);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  return (
    <div className="relative mt-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search for a base..."
        disabled={disabled}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
      />
      {showDropdown && !disabled && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">No bases found</p>
          ) : (
            filtered.map((b) => (
              <button
                key={b.slug}
                onClick={() => {
                  setShowDropdown(false);
                  onSelect(b.slug, b.name);
                }}
                className="block w-full px-3 py-2 text-left text-xs text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {b.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function BahDependentsPicker({
  onSelect,
  disabled,
}: {
  onSelect: (withDep: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={() => onSelect(true)}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
      >
        With Dependents
      </button>
      <button
        onClick={() => onSelect(false)}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
      >
        Without Dependents
      </button>
    </div>
  );
}

function BahResultCard({ data }: { data: NonNullable<Message["bahData"]> }) {
  const yearly = data.rate * 12;
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-blue-700 px-4 py-2.5">
        <p className="text-xs font-semibold text-blue-100">2026 BAH Rate</p>
      </div>
      <div className="space-y-3 p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-700">
            ${data.rate.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            ${yearly.toLocaleString()}/year
          </p>
        </div>
        <div className="space-y-1.5 rounded-lg bg-white p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Pay Grade</span>
            <span className="font-semibold text-gray-800">{data.grade}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duty Station</span>
            <span className="font-semibold text-gray-800">{data.baseName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Dependents</span>
            <span className="font-semibold text-gray-800">
              {data.dependents ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BahSavePrompt({
  bahData,
  onDone,
  disabled,
}: {
  bahData: NonNullable<Message["bahData"]>;
  onDone: (saved: boolean) => void;
  disabled: boolean;
}) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");

  async function save(email: string, userId: string | null) {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("user_bah_calculations")
      .insert({
        user_id: userId,
        email,
        pay_grade: bahData.grade,
        duty_station: bahData.baseName,
        base_slug: bahData.slug,
        dependents: bahData.dependents,
        bah_rate: bahData.rate,
      });
    if (insertError) {
      setError("Could not save. Please try again.");
      setSaving(false);
      return;
    }
    if (!userId) localStorage.setItem("pcsing_user_email", email);
    setSaving(false);
    onDone(true);
  }

  function handleYes() {
    if (user) {
      save(user.email!, user.id);
    } else {
      const storedEmail = localStorage.getItem("pcsing_user_email");
      if (storedEmail) {
        save(storedEmail, null);
      } else {
        setShowEmail(true);
      }
    }
  }

  if (showEmail) {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-xs text-gray-600">
          Enter your email to save this calculation:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = emailInput.trim();
            if (!email) {
              setError("Please enter your email.");
              return;
            }
            save(email, null);
          }}
          className="flex gap-2"
        >
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? "..." : "Save"}
          </button>
        </form>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-2">
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleYes}
          disabled={disabled || saving}
          className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Yes, save it"}
        </button>
        <button
          onClick={() => onDone(false)}
          disabled={disabled || saving}
          className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function SlideOutChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseContext, setBaseContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // BAH flow state
  const [bahFlow, setBahFlow] = useState<BahWidget | null>(null);
  const [bahGrade, setBahGrade] = useState<PayGrade | null>(null);
  const [bahSlug, setBahSlug] = useState<string | null>(null);
  const [bahBaseName, setBahBaseName] = useState<string | null>(null);
  const [bahDependents, setBahDependents] = useState<boolean | null>(null);
  const [bahRate, setBahRate] = useState<number | null>(null);

  const hasUserMessages = messages.some((m) => m.role === "user");
  const sendMessageRef = useRef<(text: string) => void>(() => {});

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

  function startBahFlow(userMsg: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg },
      {
        role: "assistant",
        content: "Let's calculate your BAH! What's your pay grade?",
        widget: "bah-grade",
      },
    ]);
    setBahFlow("bah-grade");
  }

  function handleBahGrade(grade: PayGrade) {
    setBahGrade(grade);
    setBahFlow("bah-station");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: grade },
      {
        role: "assistant",
        content: "Got it. What's your duty station?",
        widget: "bah-station",
      },
    ]);
  }

  function handleBahStation(slug: string, name: string) {
    setBahSlug(slug);
    setBahBaseName(name);
    setBahFlow("bah-dependents");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: name },
      {
        role: "assistant",
        content: "Almost there! With or without dependents?",
        widget: "bah-dependents",
      },
    ]);
  }

  function handleBahDependents(withDep: boolean) {
    setBahDependents(withDep);
    const rate = getRate(bahSlug!, bahGrade!, withDep);
    setBahRate(rate);
    const data = {
      grade: bahGrade!,
      slug: bahSlug!,
      baseName: bahBaseName!,
      dependents: withDep,
      rate: rate!,
    };
    setBahFlow("bah-result");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: withDep ? "With dependents" : "Without dependents" },
      {
        role: "assistant",
        content: "Here's your 2026 BAH rate:",
        widget: "bah-result",
        bahData: data,
      },
    ]);
    // Immediately show save prompt too
    setTimeout(() => {
      setBahFlow("bah-save");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Would you like to save this calculation?",
          widget: "bah-save",
          bahData: data,
        },
      ]);
    }, 600);
  }

  function handleBahSaveDone(saved: boolean) {
    setBahFlow(null);
    setBahGrade(null);
    setBahSlug(null);
    setBahBaseName(null);
    setBahDependents(null);
    setBahRate(null);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: saved
          ? "Saved! You can find this in your saved calculations. Need anything else?"
          : "No problem! Let me know if you need anything else.",
      },
    ]);
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg = text.trim();
      setInput("");

      // Intercept BAH queries if not already in a BAH flow
      if (!bahFlow && BAH_PATTERN.test(userMsg)) {
        startBahFlow(userMsg);
        return;
      }

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
    [loading, messages, baseContext, bahFlow]
  );
  sendMessageRef.current = sendMessage;

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (
        e as CustomEvent<{ prefill?: string; baseContext?: string }>
      ).detail;
      setOpen(true);
      if (detail?.baseContext) setBaseContext(detail.baseContext);
      if (detail?.prefill) {
        setTimeout(() => sendMessageRef.current(detail.prefill!), 400);
      } else {
        setTimeout(() => textareaRef.current?.focus(), 350);
      }
    }
    window.addEventListener("open-ai-chat", onOpen);
    return () => window.removeEventListener("open-ai-chat", onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setBahFlow(null);
    setBahGrade(null);
    setBahSlug(null);
    setBahBaseName(null);
    setBahDependents(null);
    setBahRate(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  /** Whether a widget at this message index is the active (latest) one */
  function isActiveWidget(msg: Message, idx: number): boolean {
    if (!msg.widget) return false;
    // Find the last message with a widget
    for (let j = messages.length - 1; j >= 0; j--) {
      if (messages[j].widget) return j === idx;
    }
    return false;
  }

  function renderWidget(msg: Message, idx: number) {
    const active = isActiveWidget(msg, idx);
    switch (msg.widget) {
      case "bah-grade":
        return (
          <BahGradePicker onSelect={handleBahGrade} disabled={!active} />
        );
      case "bah-station":
        return (
          <BahStationPicker onSelect={handleBahStation} disabled={!active} />
        );
      case "bah-dependents":
        return (
          <BahDependentsPicker
            onSelect={handleBahDependents}
            disabled={!active}
          />
        );
      case "bah-result":
        return msg.bahData ? <BahResultCard data={msg.bahData} /> : null;
      case "bah-save":
        return msg.bahData ? (
          <BahSavePrompt
            bahData={msg.bahData}
            onDone={handleBahSaveDone}
            disabled={!active}
          />
        ) : null;
      default:
        return null;
    }
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
                    {msg.widget && renderWidget(msg, i)}
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
