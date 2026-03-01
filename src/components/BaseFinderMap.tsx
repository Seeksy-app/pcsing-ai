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

type Step = "map" | "bases" | "form" | "success";

export function BaseFinderMap({ bases }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("map");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [interest, setInterest] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Base counts per state
  const baseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bases.forEach((b) => {
      counts[b.state] = (counts[b.state] || 0) + 1;
    });
    return counts;
  }, [bases]);

  // States that have bases
  const statesWithBases = useMemo(() => new Set(Object.keys(baseCounts)), [baseCounts]);

  // Check for overseas bases (states not in US_STATE_PATHS)
  const overseasBases = useMemo(() => {
    return bases.filter((b) => !US_STATE_PATHS[b.state] && !STATE_NAMES[b.state]);
  }, [bases]);

  // Filtered bases for selected state
  const filteredBases = useMemo(() => {
    if (!selectedState) return [];
    if (selectedState === "OVERSEAS") return overseasBases;
    return bases.filter((b) => b.state === selectedState);
  }, [bases, selectedState, overseasBases]);

  const selectedBase = bases.find((b) => b.slug === selectedSlug);

  const handleStateClick = useCallback((stateId: string) => {
    if (!baseCounts[stateId]) return;
    setSelectedState(stateId);
    setSelectedSlug("");
    setStep("bases");
    // Scroll panel into view on mobile
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, [baseCounts]);

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
    setStep("map");
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

  async function handleSubmit(e: React.FormEvent) {
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

  // Close tooltip when leaving SVG area
  useEffect(() => {
    function handleScroll() {
      setHoveredState(null);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[#0B1A2F] py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Find Your Next Base
          </h2>
          <p className="text-blue-200/70 text-sm sm:text-base">
            Click a state to explore military installations
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Map area — 3 cols */}
          <div className="lg:col-span-3" onMouseMove={handleMouseMove}>
            {/* SVG Map */}
            <svg
              viewBox="0 0 959 593"
              className="w-full h-auto"
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
                        ? "#3B82F6"
                        : isHovered && hasBases
                        ? "#60A5FA"
                        : hasBases
                        ? "#1E3A5F"
                        : "#162337"
                    }
                    stroke={
                      isSelected
                        ? "#93C5FD"
                        : isHovered && hasBases
                        ? "#93C5FD"
                        : "#2A4A6B"
                    }
                    strokeWidth={isSelected || isHovered ? "2" : "1"}
                    strokeLinejoin="round"
                    className={hasBases ? "cursor-pointer" : "cursor-default"}
                    style={{
                      transition: "fill 0.15s ease, stroke 0.15s ease",
                    }}
                    onMouseEnter={() => setHoveredState(stateId)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(stateId)}
                  />
                );
              })}
            </svg>

            {/* Overseas button */}
            {overseasBases.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleOverseasClick}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedState === "OVERSEAS"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  Overseas Bases ({overseasBases.length})
                </button>
              </div>
            )}

            {/* Tooltip */}
            {hoveredState && (
              <div
                ref={tooltipRef}
                className="fixed z-50 pointer-events-none bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm"
                style={{
                  left: tooltipPos.x + 12,
                  top: tooltipPos.y - 40,
                }}
              >
                <span className="font-semibold">
                  {STATE_NAMES[hoveredState] || hoveredState}
                </span>
                {baseCounts[hoveredState] ? (
                  <span className="text-blue-300 ml-2">
                    {baseCounts[hoveredState]} base{baseCounts[hoveredState] > 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="text-gray-400 ml-2">No bases</span>
                )}
              </div>
            )}
          </div>

          {/* Right panel — 2 cols */}
          <div ref={panelRef} className="lg:col-span-2">
            {/* Step: Map (initial) */}
            {step === "map" && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-blue-300 mb-3">
                  <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">Select a State</h3>
                <p className="text-blue-200/60 text-sm">
                  Click any highlighted state on the map to see available military bases.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-blue-200/40 text-xs">
                    {bases.length} bases across {statesWithBases.size} states
                  </p>
                </div>
              </div>
            )}

            {/* Step: Base selection */}
            {step === "bases" && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">
                    {selectedState === "OVERSEAS"
                      ? "Overseas Bases"
                      : STATE_NAMES[selectedState] || selectedState}
                  </h3>
                  <button
                    onClick={handleReset}
                    className="text-blue-300 hover:text-white text-sm transition"
                  >
                    Back to map
                  </button>
                </div>
                <p className="text-blue-200/60 text-sm mb-4">
                  Select a base to get your personalized PCS briefing.
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredBases.map((base) => (
                    <button
                      key={base.slug}
                      onClick={() => handleBaseSelect(base.slug)}
                      className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/5 hover:border-blue-400/30 text-white text-sm transition-all group"
                    >
                      <span className="font-medium group-hover:text-blue-200">
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

            {/* Step: Email capture form */}
            {step === "form" && selectedBase && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                {/* Selected base pill */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-400/20">
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
                  Get your PCS briefing for {selectedBase.name}
                </h3>
                <p className="text-blue-200/60 text-sm mb-5">
                  We&apos;ll send you everything you need to know.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder-blue-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25em 1.25em" }}
                    >
                      <option value="" className="bg-gray-900">What are you interested in?</option>
                      {INTERESTS.map((i) => (
                        <option key={i} value={i} className="bg-gray-900">
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send My Briefing"}
                  </button>
                </form>
              </div>
            )}

            {/* Step: Success */}
            {step === "success" && selectedBase && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-green-400 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Check your inbox!
                </h3>
                <p className="text-blue-200/70 text-sm mb-5">
                  We&apos;ll send your {selectedBase.name} PCS briefing shortly.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/bases/${selectedBase.slug}`)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium text-sm transition"
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
