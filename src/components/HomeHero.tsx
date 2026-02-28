"use client";

import { useState } from "react";

const promptChips = [
  { emoji: "\u{1F3E0}", text: "What are my PCS entitlements?" },
  { emoji: "\u{1F4CB}", text: "Help me build a PCS checklist" },
  { emoji: "\u{1F4B0}", text: "Calculate my BAH and DLA" },
  { emoji: "\u{1F5FA}\uFE0F", text: "Tell me about my next base" },
  { emoji: "\u{1F4E6}", text: "How do I set up a DITY move?" },
  { emoji: "\u{1F3EB}", text: "Find schools near my base" },
];

export function HomeHero() {
  const [input, setInput] = useState("");

  function openChat(prefill: string) {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", { detail: { prefill } })
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    openChat(input.trim());
    setInput("");
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-3xl -translate-y-1/2" />

      <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Greeting */}
        <p className="text-4xl mb-4">{"\u{1F44B}"}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Welcome to PCSing<span className="text-blue-600">.ai</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Your AI-powered PCS assistant — ask me anything about your military
          move.
        </p>

        {/* Search / Chat Input */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-blue-300 transition-all overflow-hidden max-w-2xl mx-auto">
            <div className="pl-5 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about PCS moves, bases, entitlements..."
              className="flex-1 px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
            />
            <button
              type="submit"
              className="mr-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center gap-1.5 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Ask
            </button>
          </div>
        </form>

        {/* Prompt Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {promptChips.map((chip) => (
            <button
              key={chip.text}
              onClick={() => openChat(chip.text)}
              className="flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all text-left group"
            >
              <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                {chip.emoji}
              </span>
              <span>{chip.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
