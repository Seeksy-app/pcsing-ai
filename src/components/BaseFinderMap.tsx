"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { US_STATE_PATHS } from "@/data/us-state-paths";

type BaseInfo = {
  name: string;
  slug: string;
  state: string;
  state_full: string;
  branch?: string;
  city?: string;
  phone?: string;
  address?: string;
  website?: string;
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

/* ── Military family moving silhouette SVG with shadow ── */
function MilitarySilhouette() {
  return (
    <svg
      viewBox="0 0 900 320"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-auto pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Drop shadow filter */}
        <filter id="familyShadow" x="-10%" y="-10%" width="130%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="3" dy="8" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.12" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="#1B2A4A" opacity="0.055" filter="url(#familyShadow)">
        {/* Soldier (dad) — walking stance, carrying duffle */}
        <ellipse cx="180" cy="38" rx="19" ry="21" />
        {/* Beret/cap brim */}
        <rect x="168" y="55" width="24" height="6" rx="2" />
        {/* Torso + legs walking */}
        <path d="M172 61 L168 125 L155 210 L167 210 L178 140 L182 140 L188 210 L200 210 L196 125 L192 61 Z" />
        {/* Arms — left carrying duffle, right swinging */}
        <path d="M168 72 L140 115 L148 120 L172 82" />
        <path d="M192 72 L218 118 L210 122 L188 82" />
        {/* Boots */}
        <rect x="153" y="208" width="16" height="8" rx="3" />
        <rect x="186" y="208" width="16" height="8" rx="3" />
        {/* Duffle bag on shoulder */}
        <ellipse cx="132" cy="98" rx="16" ry="28" transform="rotate(-20 132 98)" />
        <rect x="124" y="68" width="8" height="10" rx="3" />

        {/* Spouse (mom) — holding child's hand */}
        <ellipse cx="300" cy="48" rx="16" ry="18" />
        {/* Hair */}
        <ellipse cx="300" cy="40" rx="18" ry="14" />
        {/* Torso + walking legs */}
        <path d="M290 66 L286 130 L278 210 L290 210 L298 142 L302 142 L308 210 L320 210 L316 130 L312 66 Z" />
        {/* Arms — right reaching to child, left holding bag */}
        <path d="M290 74 L268 110 L274 114 L292 82" />
        <path d="M312 74 L342 105 L336 110 L308 82" />
        {/* Shoes */}
        <rect x="277" y="208" width="14" height="7" rx="3" />
        <rect x="307" y="208" width="14" height="7" rx="3" />
        {/* Purse / tote bag */}
        <rect x="256" y="96" width="16" height="22" rx="3" />
        <path d="M258 96 Q264 84 272 96" fill="none" stroke="#1B2A4A" strokeWidth="2.5" />

        {/* Child 1 — holding mom's hand */}
        <ellipse cx="380" cy="100" rx="12" ry="14" />
        <path d="M372 114 L370 155 L366 210 L376 210 L379 160 L381 160 L384 210 L394 210 L390 155 L388 114 Z" />
        {/* Arms — left reaching to mom */}
        <path d="M372 120 L348 108" fill="none" stroke="#1B2A4A" strokeWidth="4" strokeLinecap="round" />
        <path d="M388 120 L398 148 L392 151 L385 128" />
        <rect x="365" y="208" width="12" height="6" rx="2" />
        <rect x="383" y="208" width="12" height="6" rx="2" />

        {/* Child 2 (smaller, toddler) — being held by dad or walking */}
        <ellipse cx="435" cy="118" rx="10" ry="12" />
        <path d="M429 130 L427 165 L424 210 L432 210 L434 170 L436 170 L438 210 L446 210 L443 165 L441 130 Z" />
        <path d="M427 136 L418 156 L424 159 L430 142" />
        <path d="M441 136 L450 154 L444 157 L438 142" />
        <rect x="423" y="208" width="10" height="5" rx="2" />
        <rect x="437" y="208" width="10" height="5" rx="2" />

        {/* Dog (family pet) */}
        <ellipse cx="500" cy="190" rx="22" ry="14" />
        <ellipse cx="520" cy="178" rx="10" ry="9" />
        <ellipse cx="526" cy="175" rx="4" ry="6" />
        <ellipse cx="515" cy="175" rx="4" ry="6" />
        {/* Tail */}
        <path d="M478 184 Q470 170 475 162" fill="none" stroke="#1B2A4A" strokeWidth="3.5" strokeLinecap="round" />
        {/* Legs */}
        <rect x="488" y="202" width="4" height="14" rx="1.5" />
        <rect x="496" y="202" width="4" height="14" rx="1.5" />
        <rect x="506" y="202" width="4" height="14" rx="1.5" />
        <rect x="513" y="202" width="4" height="14" rx="1.5" />

        {/* Moving boxes stack */}
        <rect x="600" y="150" width="50" height="40" rx="3" />
        <rect x="610" y="115" width="40" height="38" rx="3" />
        <rect x="655" y="165" width="35" height="30" rx="3" />
        {/* Box tape lines */}
        <line x1="625" y1="150" x2="625" y2="190" stroke="white" strokeWidth="2" opacity="0.4" />
        <line x1="630" y1="115" x2="630" y2="153" stroke="white" strokeWidth="2" opacity="0.4" />
        <line x1="672" y1="165" x2="672" y2="195" stroke="white" strokeWidth="1.5" opacity="0.4" />

        {/* American flag */}
        <rect x="730" y="30" width="3" height="186" rx="1" />
        <rect x="733" y="30" width="70" height="44" rx="1" />
        <rect x="733" y="30" width="28" height="24" />
        <circle cx="740" cy="37" r="1.3" fill="white" />
        <circle cx="747" cy="37" r="1.3" fill="white" />
        <circle cx="754" cy="37" r="1.3" fill="white" />
        <circle cx="743" cy="43" r="1.3" fill="white" />
        <circle cx="750" cy="43" r="1.3" fill="white" />
        <circle cx="740" cy="49" r="1.3" fill="white" />
        <circle cx="747" cy="49" r="1.3" fill="white" />
        <circle cx="754" cy="49" r="1.3" fill="white" />
        <rect x="761" y="33" width="42" height="3.5" fill="white" opacity="0.5" />
        <rect x="761" y="40" width="42" height="3.5" fill="white" opacity="0.5" />
        <rect x="761" y="47" width="42" height="3.5" fill="white" opacity="0.5" />
        <rect x="733" y="57" width="70" height="3.5" fill="white" opacity="0.5" />
        <rect x="733" y="64" width="70" height="3.5" fill="white" opacity="0.5" />

        {/* Ground line / shadow */}
        <ellipse cx="400" cy="222" rx="380" ry="6" opacity="0.5" />
      </g>
    </svg>
  );
}

export function BaseFinderMap({ bases }: Props) {
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

  useEffect(() => {
    function handleClosePanel() {
      handleReset();
    }
    window.addEventListener("close-base-panel", handleClosePanel);
    return () => window.removeEventListener("close-base-panel", handleClosePanel);
  }, [handleReset]);

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
            Welcome to PCSing.us
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
              className="flex items-center bg-white rounded-full overflow-hidden max-w-xl mx-auto transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-800/20"
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

              {/* Success / Unlocked */}
              {step === "success" && selectedBase && (
                <>
                  <div className="bg-[#1B2A4A] rounded-2xl p-6 shadow-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#C5A55A]/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#C5A55A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Check your inbox!</h3>
                        <p className="text-blue-200/60 text-xs">Your {selectedBase.name} briefing is on the way.</p>
                      </div>
                    </div>

                    {/* Quick Facts */}
                    <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                      <span style={{ color: "#C5A55A", fontSize: "12px" }}>&#9733;</span>
                      Quick Facts — {selectedBase.name}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedBase.branch && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">Branch</span>
                          <span className="text-white">{selectedBase.branch}</span>
                        </div>
                      )}
                      {selectedBase.city && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">City</span>
                          <span className="text-white">{selectedBase.city}</span>
                        </div>
                      )}
                      {selectedBase.state_full && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">State</span>
                          <span className="text-white">{selectedBase.state_full}</span>
                        </div>
                      )}
                      {selectedBase.phone && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">Phone</span>
                          <a href={`tel:${selectedBase.phone}`} className="text-[#C5A55A] hover:text-white transition">{selectedBase.phone}</a>
                        </div>
                      )}
                      {selectedBase.address && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">Address</span>
                          <span className="text-white text-xs leading-relaxed">{selectedBase.address}</span>
                        </div>
                      )}
                      {selectedBase.website && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-200/50 w-16 shrink-0">Website</span>
                          <a href={selectedBase.website} target="_blank" rel="noopener noreferrer" className="text-[#C5A55A] hover:text-white transition text-xs flex items-center gap-1">
                            Official Site
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
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
