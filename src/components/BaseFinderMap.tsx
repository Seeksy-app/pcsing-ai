"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { US_STATE_PATHS } from "@/data/us-state-paths";

type BaseInfo = {
  name: string;
  slug: string;
  state: string;
  state_full: string;
  branch?: string;
};

type Props = {
  bases: BaseInfo[];
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const INTERESTS = [
  "Housing",
  "Schools",
  "Local Area",
  "BAH Rates",
  "Full PCS Guide",
];

const PROMPT_CHIPS = [
  "What are my entitlements?",
  "Build my PCS checklist",
  "Calculate BAH",
  "Find schools near base",
];

type Step = "idle" | "bases" | "form" | "success";

/* ── Military family silhouette SVG (inline, used as watermark behind map) ── */
function MilitarySilhouette() {
  return (
    <svg
      viewBox="0 0 800 300"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-auto pointer-events-none select-none"
      fill="#1B2A4A"
      opacity="0.045"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soldier figure */}
      <ellipse cx="200" cy="42" rx="18" ry="20" />
      <rect x="188" y="60" width="24" height="6" rx="2" />
      <path d="M192 66 L188 130 L180 200 L190 200 L198 140 L202 140 L210 200 L220 200 L212 130 L208 66 Z" />
      <path d="M188 75 L160 120 L168 124 L192 85" />
      <path d="M212 75 L240 120 L232 124 L208 85" />
      <rect x="180" y="198" width="12" height="8" rx="2" />
      <rect x="208" y="198" width="12" height="8" rx="2" />
      {/* Duffle bag / suitcase */}
      <rect x="145" y="155" width="22" height="50" rx="4" />
      <rect x="150" y="148" width="12" height="8" rx="3" />
      {/* Spouse figure */}
      <ellipse cx="310" cy="52" rx="16" ry="18" />
      <path d="M298 70 L294 130 L290 200 L300 200 L306 140 L314 140 L320 200 L330 200 L326 130 L322 70 Z" />
      <path d="M294 78 L272 118 L280 122 L298 88" />
      <path d="M322 78 L340 108 L332 112 L318 88" />
      <rect x="290" y="198" width="12" height="8" rx="2" />
      <rect x="318" y="198" width="12" height="8" rx="2" />
      {/* Child 1 */}
      <ellipse cx="390" cy="90" rx="12" ry="14" />
      <path d="M382 104 L380 150 L377 200 L385 200 L389 155 L391 155 L395 200 L403 200 L400 150 L398 104 Z" />
      <path d="M380 110 L368 138 L374 141 L383 118" />
      <path d="M398 110 L408 132 L402 135 L395 118" />
      <rect x="377" y="198" width="9" height="6" rx="2" />
      <rect x="394" y="198" width="9" height="6" rx="2" />
      {/* Child 2 (smaller) */}
      <ellipse cx="440" cy="105" rx="10" ry="12" />
      <path d="M434 117 L432 155 L430 200 L437 200 L439 160 L441 160 L443 200 L450 200 L448 155 L446 117 Z" />
      <path d="M432 123 L422 146 L428 149 L435 130" />
      <path d="M446 123 L454 142 L448 145 L443 130" />
      <rect x="430" y="198" width="8" height="5" rx="2" />
      <rect x="442" y="198" width="8" height="5" rx="2" />
      {/* American flag (simplified) */}
      <rect x="540" y="30" width="3" height="176" rx="1" />
      <rect x="543" y="30" width="80" height="50" rx="1" />
      <rect x="543" y="30" width="32" height="28" />
      {/* Stars area dots */}
      <circle cx="550" cy="37" r="1.5" fill="white" />
      <circle cx="558" cy="37" r="1.5" fill="white" />
      <circle cx="566" cy="37" r="1.5" fill="white" />
      <circle cx="554" cy="43" r="1.5" fill="white" />
      <circle cx="562" cy="43" r="1.5" fill="white" />
      <circle cx="550" cy="49" r="1.5" fill="white" />
      <circle cx="558" cy="49" r="1.5" fill="white" />
      <circle cx="566" cy="49" r="1.5" fill="white" />
      {/* Stripes */}
      <rect x="575" y="34" width="48" height="4" fill="white" opacity="0.5" />
      <rect x="575" y="42" width="48" height="4" fill="white" opacity="0.5" />
      <rect x="575" y="50" width="48" height="4" fill="white" opacity="0.5" />
      <rect x="543" y="62" width="80" height="4" fill="white" opacity="0.5" />
      <rect x="543" y="70" width="80" height="4" fill="white" opacity="0.5" />
    </svg>
  );
}

export function BaseFinderMap({ bases }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [interest, setInterest] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const panelOpen = step !== "idle";

  const baseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bases.forEach((b) => {
      counts[b.state] = (counts[b.state] || 0) + 1;
    });
    return counts;
  }, [bases]);

  const statesWithBases = useMemo(() => new Set(Object.keys(baseCounts)), [baseCounts]);

  const overseasBases = useMemo(() => {
    return bases.filter((b) => !US_STATE_PATHS[b.state] && !STATE_NAMES[b.state]);
  }, [bases]);

  const filteredBases = useMemo(() => {
    if (!selectedState) return [];
    if (selectedState === "OVERSEAS") return overseasBases;
    return bases.filter((b) => b.state === selectedState);
  }, [bases, selectedState, overseasBases]);

  const selectedBase = bases.find((b) => b.slug === selectedSlug);

  const detectBase = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      const sorted = [...bases].sort((a, b) => b.name.length - a.name.length);
      return sorted.find((b) => q.includes(b.name.toLowerCase()));
    },
    [bases]
  );

  const handleStateClick = useCallback(
    (stateId: string) => {
      if (!baseCounts[stateId]) return;
      setSelectedState(stateId);
      setSelectedSlug("");
      setStep("bases");
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    },
    [baseCounts]
  );

  const handleOverseasClick = useCallback(() => {
    if (overseasBases.length === 0) return;
    setSelectedState("OVERSEAS");
    setSelectedSlug("");
    setStep("bases");
  }, [overseasBases]);

  const handleBaseSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setStep("form");
  }, []);

  const handleReset = useCallback(() => {
    setStep("idle");
    setSelectedState("");
    setSelectedSlug("");
    setInterest("");
    setEmail("");
    setError("");
  }, []);

  const handleChangeBase = useCallback(() => {
    setSelectedSlug("");
    setStep("bases");
    setError("");
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  function openChat(prefill: string, baseName?: string) {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: {
          prefill,
          baseContext: baseName || selectedBase?.name || "",
        },
      })
    );
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const matched = detectBase(query);
    if (matched) {
      setSelectedState(matched.state);
      setSelectedSlug(matched.slug);
      setStep("form");
      openChat(query, matched.name);
    } else {
      openChat(query);
    }
    setChatInput("");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          baseSlug: selectedSlug,
          baseName: selectedBase?.name || "",
          state: selectedState,
          interest,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      setStep("success");
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  useEffect(() => {
    function handleScroll() {
      setHoveredState(null);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── AI mini-chat panel (reused in form + success steps) ── */
  function AiMiniChat() {
    if (!selectedBase) return null;
    return (
      <div className="bg-[#1B2A4A] rounded-2xl p-6 shadow-lg border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#C5A55A] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h4 className="text-white font-semibold text-sm">Ask about {selectedBase.name}</h4>
        </div>
        <div className="space-y-2">
          {[
            `What's BAH at ${selectedBase.name}?`,
            `Best schools near ${selectedBase.name}?`,
            `Housing options at ${selectedBase.name}?`,
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => openChat(prompt)}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-[#C41E3A]/10 border border-white/5 hover:border-[#C41E3A]/30 text-blue-200/80 hover:text-white text-sm transition-all flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative min-h-[calc(100vh-64px)]"
      style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}
    >
      {/* ── Floating top layer: heading + chat bar + chips ── */}
      <div className="relative z-10 pt-8 pb-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Brand line */}
          <p
            className="text-xs font-semibold mb-2 tracking-[0.1em] uppercase"
            style={{ color: "#C5A55A" }}
          >
            Welcome to PCSing.ai
          </p>
          <h1 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#1B2A4A" }}>
            Click a state or ask a question to start planning your PCS
          </h1>
          {/* Gold divider */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-0.5 rounded-full" style={{ backgroundColor: "#C5A55A" }} />
          </div>

          {/* Chat search bar */}
          <form onSubmit={handleChatSubmit} className="mb-3">
            <div
              className="flex items-center bg-white rounded-full overflow-hidden max-w-xl mx-auto transition-all duration-200 focus-within:shadow-[0_0_0_3px_rgba(27,42,74,0.12)]"
              style={{
                border: "1px solid #D1D9E6",
                boxShadow: "0 1px 3px rgba(27,42,74,0.06)",
              }}
            >
              <div className="pl-4" style={{ color: "#1B2A4A", opacity: 0.4 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  selectedBase
                    ? `Ask about ${selectedBase.name}...`
                    : "Where are you PCSing to?"
                }
                className="flex-1 px-3 py-3 text-sm focus:outline-none"
                style={{ color: "#1B2A4A" }}
              />
              <button
                type="submit"
                className="mr-1.5 px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1 shrink-0 text-white transition-colors duration-200"
                style={{ backgroundColor: "#1B2A4A" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C41E3A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B2A4A")}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Ask
              </button>
            </div>
          </form>

          {/* Compact prompt chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => openChat(chip)}
                className="px-3 py-1.5 bg-white rounded-full text-xs transition-all duration-200"
                style={{
                  border: "1px solid #D1D9E6",
                  color: "#1B2A4A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C41E3A";
                  e.currentTarget.style.backgroundColor = "rgba(196,30,58,0.04)";
                  e.currentTarget.style.color = "#C41E3A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D1D9E6";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#1B2A4A";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content: map + panel ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className={`grid ${panelOpen ? "lg:grid-cols-5" : "lg:grid-cols-1"} gap-6 lg:gap-8 items-start transition-all duration-300`}>
          {/* Map (no card border — breathes edge to edge) */}
          <div
            className={panelOpen ? "lg:col-span-3" : "lg:col-span-1 max-w-5xl mx-auto w-full"}
            onMouseMove={handleMouseMove}
          >
            <div className="relative">
              {/* Military silhouette watermark */}
              <MilitarySilhouette />

              <svg
                viewBox="0 0 959 593"
                className="w-full h-auto relative z-[1]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Object.entries(US_STATE_PATHS).map(([stateId, path]) => {
                  const hasBases = statesWithBases.has(stateId);
                  const isHovered = hoveredState === stateId;
                  const isSelected = selectedState === stateId;

                  return (
                    <path
                      key={stateId}
                      d={path}
                      fill={
                        isSelected
                          ? "#C41E3A"
                          : isHovered && hasBases
                          ? "#1B2A4A"
                          : hasBases
                          ? "#D1D9E6"
                          : "#EDF0F4"
                      }
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      className={hasBases ? "cursor-pointer" : "cursor-default"}
                      style={{ transition: "fill 0.2s ease" }}
                      onMouseEnter={() => setHoveredState(stateId)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(stateId)}
                    />
                  );
                })}
              </svg>

              {/* Overseas button */}
              {overseasBases.length > 0 && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={handleOverseasClick}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-1.5"
                    style={{
                      borderColor: selectedState === "OVERSEAS" ? "#C41E3A" : "#C41E3A",
                      backgroundColor: selectedState === "OVERSEAS" ? "#C41E3A" : "white",
                      color: selectedState === "OVERSEAS" ? "white" : "#C41E3A",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedState !== "OVERSEAS") {
                        e.currentTarget.style.backgroundColor = "#C41E3A";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedState !== "OVERSEAS") {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "#C41E3A";
                      }
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>&#9733;</span>
                    Overseas Bases ({overseasBases.length})
                  </button>
                </div>
              )}
            </div>

            {/* Tooltip */}
            {hoveredState && (
              <div
                className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg shadow-xl text-sm"
                style={{
                  left: tooltipPos.x + 12,
                  top: tooltipPos.y - 40,
                  backgroundColor: "#1B2A4A",
                  color: "white",
                }}
              >
                <span className="font-semibold">
                  {STATE_NAMES[hoveredState] || hoveredState}
                </span>
                {baseCounts[hoveredState] ? (
                  <span className="ml-2" style={{ color: "#C5A55A" }}>
                    {baseCounts[hoveredState]} base{baseCounts[hoveredState] > 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="text-gray-400 ml-2">No bases</span>
                )}
              </div>
            )}
          </div>

          {/* ── Right panel ── */}
          {panelOpen && (
            <div ref={panelRef} className="lg:col-span-2 space-y-4">
              {/* Base selection list */}
              {step === "bases" && (
                <div className="bg-[#1B2A4A] rounded-2xl p-6 shadow-lg border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">
                      {selectedState === "OVERSEAS"
                        ? "Overseas Bases"
                        : STATE_NAMES[selectedState] || selectedState}
                    </h3>
                    <button
                      onClick={handleReset}
                      className="text-sm transition"
                      style={{ color: "#C5A55A" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#C5A55A")}
                    >
                      &larr; Back
                    </button>
                  </div>
                  <p className="text-blue-200/60 text-sm mb-4">
                    Select a base to get your personalized PCS briefing.
                  </p>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredBases.map((base) => (
                      <button
                        key={base.slug}
                        onClick={() => handleBaseSelect(base.slug)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-[#C41E3A]/15 border border-white/5 hover:border-[#C41E3A]/30 text-white text-sm transition-all group"
                      >
                        <span className="font-medium group-hover:text-white">
                          {base.name}
                        </span>
                        {base.branch && (
                          <span className="text-blue-300/50 text-xs ml-2">
                            {base.branch}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Email capture + AI mini-chat */}
              {step === "form" && selectedBase && (
                <>
                  <div className="bg-[#1B2A4A] rounded-2xl p-6 shadow-lg border border-white/5">
                    {/* Base pill */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: "rgba(27,42,74,0.8)",
                          borderColor: "rgba(197,165,90,0.3)",
                          color: "#C5A55A",
                        }}
                      >
                        {selectedBase.name}
                        <button
                          onClick={handleChangeBase}
                          className="hover:text-white transition ml-1"
                          aria-label="Change base"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-lg mb-1">
                      <span style={{ color: "#C5A55A", fontSize: "14px" }}>&#9733;</span>{" "}
                      Get your PCS briefing for {selectedBase.name}
                    </h3>
                    <p className="text-blue-200/60 text-sm mb-5">
                      We&apos;ll send you everything you need to know.
                    </p>

                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-blue-200/40 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#C5A55A" } as React.CSSProperties}
                      />

                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25em 1.25em" }}
                      >
                        <option value="" className="bg-gray-900">What are you interested in?</option>
                        {INTERESTS.map((i) => (
                          <option key={i} value={i} className="bg-gray-900">{i}</option>
                        ))}
                      </select>

                      {error && <p className="text-red-400 text-sm">{error}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full text-white py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50"
                        style={{ backgroundColor: "#C41E3A" }}
                        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#a8182f"; }}
                        onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#C41E3A"; }}
                      >
                        {submitting ? "Sending..." : "Send My Briefing"}
                      </button>
                    </form>
                  </div>

                  <AiMiniChat />
                </>
              )}

              {/* Success */}
              {step === "success" && selectedBase && (
                <>
                  <div className="bg-[#1B2A4A] rounded-2xl p-6 text-center shadow-lg border border-white/5">
                    <div className="mb-3" style={{ color: "#C5A55A" }}>
                      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Check your inbox!</h3>
                    <p className="text-blue-200/70 text-sm mb-5">
                      We&apos;ll send your {selectedBase.name} PCS briefing shortly.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => router.push(`/bases/${selectedBase.slug}`)}
                        className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
                        style={{ backgroundColor: "#C41E3A" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a8182f")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C41E3A")}
                      >
                        View {selectedBase.name} Now
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full bg-white/10 hover:bg-white/15 text-blue-200 py-2.5 rounded-lg font-medium text-sm transition"
                      >
                        Explore Another Base
                      </button>
                    </div>
                  </div>

                  <AiMiniChat />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
