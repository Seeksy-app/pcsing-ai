"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const promptChips = [
  { emoji: "\u{1F3E0}", text: "What are my PCS entitlements?" },
  { emoji: "\u{1F4CB}", text: "Help me build a PCS checklist" },
  { emoji: "\u{1F4B0}", text: "Calculate my BAH and DLA" },
  { emoji: "\u{1F5FA}\uFE0F", text: "Tell me about my next base" },
  { emoji: "\u{1F4E6}", text: "How do I set up a DITY move?" },
  { emoji: "\u{1F3EB}", text: "Find schools near my base" },
];

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseContext, setBaseContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasUserMessages = messages.some((m) => m.role === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageText = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg = text.trim();
      setInput("");

      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", content: userMsg },
      ];
      setMessages(updatedMessages);
      setLoading(true);

      // Add a placeholder assistant message for streaming
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            baseContext,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Request failed");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response stream");

        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + chunk,
                };
              }
              return updated;
            });
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            updated[updated.length - 1] = {
              ...last,
              content: "Sorry, something went wrong. Please try again.",
            };
          }
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, baseContext]
  );

  // Listen for "open-ai-chat" custom events from other components
  useEffect(() => {
    function handleOpenChat(e: Event) {
      const detail = (e as CustomEvent<{ prefill?: string; baseContext?: string }>).detail;
      setOpen(true);
      if (detail?.baseContext) {
        setBaseContext(detail.baseContext);
      }
      if (detail?.prefill) {
        setInput(detail.prefill);
        setTimeout(() => inputRef.current?.focus(), 350);
      } else {
        setTimeout(() => inputRef.current?.focus(), 350);
      }
    }
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessageText(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageText(input);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleNewChat() {
    setMessages([]);
    setBaseContext(null);
    setInput("");
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition flex items-center justify-center z-40"
        aria-label="Open AI Chat"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[450px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="font-semibold text-lg">PCS Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition font-medium"
            >
              New Chat
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-blue-600 rounded-lg transition"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Prompt Chips — only shown before first user message */}
        {!hasUserMessages && (
          <div className="px-5 py-4 border-b flex-shrink-0">
            <p className="text-sm text-gray-500 mb-3">Try asking about:</p>
            <div className="grid grid-cols-2 gap-2">
              {promptChips.map((chip) => (
                <button
                  key={chip.text}
                  onClick={() => sendMessageText(chip.text)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition text-left"
                >
                  <span className="text-sm flex-shrink-0">{chip.emoji}</span>
                  <span className="line-clamp-2">{chip.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-16">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-sm">Ask me anything about your PCS move</p>
              {baseContext && (
                <p className="text-xs mt-1.5 text-blue-500">
                  Viewing: {baseContext}
                </p>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-700 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.content}
                {msg.role === "assistant" && msg.content === "" && loading && (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t flex-shrink-0 bg-white">
          <form onSubmit={handleSubmit} className="px-4 pt-3 pb-2 flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your PCS move..."
              rows={1}
              className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition flex items-center self-end"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 pb-3">
            Powered by Claude
          </p>
        </div>
      </div>
    </>
  );
}
