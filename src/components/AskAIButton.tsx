"use client";

export function AskAIButton({ question }: { question: string }) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", { detail: { prefill: question } })
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors group"
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </span>
      Ask the AI about this
    </button>
  );
}
