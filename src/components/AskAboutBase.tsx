"use client";

export function AskAboutBase({ baseName }: { baseName: string }) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { prefill: `Tell me about PCSing to ${baseName}` },
      })
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      Ask about this base
    </button>
  );
}
