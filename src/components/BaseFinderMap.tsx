"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type BaseInfo = {
  name: string;
  slug: string;
  state: string;
  state_full: string;
};

type Props = {
  bases: BaseInfo[];
};

const INTERESTS = [
  "Housing",
  "Schools",
  "Medical/Dental",
  "BAH Rates",
  "Commissary",
  "Legal",
  "Childcare",
  "MWR",
  "Things to Do",
];

export function BaseFinderMap({ bases }: Props) {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [interest, setInterest] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const states = useMemo(() => {
    const map = new Map<string, string>();
    bases.forEach((b) => {
      if (!map.has(b.state)) map.set(b.state, b.state_full || b.state);
    });
    return Array.from(map.entries())
      .map(([state, state_full]) => ({ state, state_full }))
      .sort((a, b) => a.state_full.localeCompare(b.state_full));
  }, [bases]);

  const filteredBases = useMemo(() => {
    if (!selectedState) return [];
    return bases.filter((b) => b.state === selectedState);
  }, [bases, selectedState]);

  const selectedBase = bases.find((b) => b.slug === selectedSlug);

  function handleStateChange(val: string) {
    setSelectedState(val);
    setSelectedSlug("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!selectedSlug) {
      setError("Please select a base.");
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

      router.push(`/bases/${selectedSlug}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const selectClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <section className="bg-[#0f1b3d] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: US Map SVG */}
        <div className="hidden lg:flex items-center justify-center">
          <svg
            viewBox="0 0 960 600"
            className="w-full max-w-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Continental US outline */}
            <g fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              {/* Washington */}
              <path d="M125,55 L155,50 L195,52 L200,60 L210,65 L205,80 L195,85 L180,82 L165,90 L140,88 L130,78 L120,70 Z" />
              {/* Oregon */}
              <path d="M120,70 L130,78 L140,88 L165,90 L180,82 L195,85 L190,110 L185,130 L170,140 L135,145 L115,130 L105,110 L108,90 Z" />
              {/* California */}
              <path d="M105,110 L115,130 L135,145 L140,170 L145,200 L140,230 L130,260 L115,275 L105,270 L95,250 L90,220 L85,190 L90,160 L95,130 Z" />
              {/* Nevada */}
              <path d="M135,145 L170,140 L175,170 L180,210 L170,240 L145,200 L140,170 Z" />
              {/* Idaho */}
              <path d="M180,82 L195,85 L205,80 L215,90 L220,110 L215,130 L200,145 L190,140 L185,130 L190,110 L195,85 Z" />
              {/* Montana */}
              <path d="M205,80 L210,65 L230,58 L270,55 L310,52 L315,60 L310,80 L295,85 L280,82 L260,85 L240,90 L220,110 L215,90 Z" />
              {/* Wyoming */}
              <path d="M220,110 L240,90 L260,85 L280,82 L295,85 L310,80 L315,100 L310,130 L290,135 L260,135 L235,132 L225,130 L215,130 Z" />
              {/* Utah */}
              <path d="M170,140 L190,140 L200,145 L215,130 L225,130 L235,132 L230,165 L220,200 L195,200 L180,210 L175,170 Z" />
              {/* Colorado */}
              <path d="M235,132 L260,135 L290,135 L310,130 L315,145 L310,175 L290,180 L260,180 L235,178 L230,165 Z" />
              {/* Arizona */}
              <path d="M140,230 L145,200 L170,240 L180,210 L195,200 L200,230 L195,260 L175,275 L155,270 L130,260 Z" />
              {/* New Mexico */}
              <path d="M195,200 L220,200 L230,165 L235,178 L260,180 L265,210 L260,240 L255,265 L225,270 L200,265 L195,260 L200,230 Z" />
              {/* North Dakota */}
              <path d="M315,52 L350,50 L380,48 L400,50 L405,65 L400,78 L380,80 L350,82 L320,80 L315,60 Z" />
              {/* South Dakota */}
              <path d="M315,80 L320,80 L350,82 L380,80 L400,78 L405,95 L400,110 L380,112 L350,115 L320,112 L315,100 Z" />
              {/* Nebraska */}
              <path d="M310,130 L315,100 L320,112 L350,115 L380,112 L400,110 L410,120 L420,130 L410,140 L380,142 L350,140 L310,135 Z" />
              {/* Kansas */}
              <path d="M310,135 L350,140 L380,142 L410,140 L420,130 L430,140 L435,155 L430,172 L400,175 L370,172 L340,172 L310,175 L315,145 Z" />
              {/* Oklahoma */}
              <path d="M310,175 L340,172 L370,172 L400,175 L430,172 L440,180 L445,195 L440,210 L420,215 L400,212 L370,210 L340,210 L320,215 L310,210 L305,195 Z" />
              {/* Texas */}
              <path d="M255,265 L260,240 L265,210 L310,210 L320,215 L340,210 L370,210 L400,212 L420,215 L440,210 L445,225 L440,260 L430,290 L415,320 L395,340 L370,350 L340,345 L320,330 L305,310 L290,290 L270,280 L255,270 Z" />
              {/* Minnesota */}
              <path d="M400,50 L430,48 L455,50 L460,55 L465,70 L460,85 L450,95 L430,100 L410,98 L405,95 L405,65 Z" />
              {/* Iowa */}
              <path d="M405,95 L410,98 L430,100 L450,95 L465,100 L470,115 L465,130 L445,135 L425,132 L410,120 L400,110 Z" />
              {/* Missouri */}
              <path d="M420,130 L430,140 L445,135 L465,130 L480,135 L490,145 L495,160 L490,175 L475,180 L460,178 L440,180 L430,172 L435,155 Z" />
              {/* Arkansas */}
              <path d="M440,180 L460,178 L475,180 L490,175 L500,185 L505,200 L500,215 L480,220 L460,218 L445,215 L445,195 Z" />
              {/* Louisiana */}
              <path d="M445,215 L460,218 L480,220 L500,215 L510,225 L515,245 L510,260 L500,270 L485,265 L470,260 L455,255 L445,250 L440,235 Z" />
              {/* Wisconsin */}
              <path d="M460,55 L480,50 L500,52 L515,58 L520,70 L515,85 L505,95 L490,98 L475,95 L465,85 L465,70 Z" />
              {/* Illinois */}
              <path d="M465,100 L475,95 L490,98 L505,95 L515,105 L520,120 L515,140 L510,155 L495,160 L490,145 L480,135 L465,130 L470,115 Z" />
              {/* Michigan */}
              <path d="M500,52 L515,45 L530,42 L545,48 L555,55 L558,70 L550,80 L540,72 L530,65 L520,58 L515,58 Z M530,75 L545,80 L555,90 L550,100 L535,105 L525,100 L520,90 L520,80 Z" />
              {/* Indiana */}
              <path d="M515,105 L525,100 L535,105 L545,110 L548,125 L545,145 L530,150 L515,148 L510,155 L515,140 L520,120 Z" />
              {/* Ohio */}
              <path d="M545,110 L535,105 L550,100 L555,90 L570,88 L585,90 L595,95 L600,110 L595,125 L585,135 L570,138 L555,135 L548,125 Z" />
              {/* Kentucky */}
              <path d="M510,155 L515,148 L530,150 L545,145 L555,135 L570,138 L585,135 L600,140 L610,148 L600,158 L585,162 L565,165 L540,168 L520,170 L505,170 L495,160 Z" />
              {/* Tennessee */}
              <path d="M495,160 L505,170 L520,170 L540,168 L565,165 L585,162 L600,158 L620,162 L640,165 L645,175 L630,178 L610,180 L580,182 L550,180 L520,180 L500,185 L490,175 Z" />
              {/* Mississippi */}
              <path d="M500,185 L520,180 L530,190 L535,210 L530,230 L525,250 L515,260 L510,250 L510,225 L505,200 Z" />
              {/* Alabama */}
              <path d="M520,180 L550,180 L560,185 L565,200 L560,225 L555,250 L545,260 L530,255 L525,250 L530,230 L535,210 L530,190 Z" />
              {/* Georgia */}
              <path d="M550,180 L580,182 L595,185 L605,195 L610,215 L605,240 L595,260 L580,265 L565,260 L555,250 L560,225 L565,200 L560,185 Z" />
              {/* Florida */}
              <path d="M565,260 L580,265 L595,260 L610,265 L620,275 L625,290 L620,310 L610,330 L595,345 L580,348 L570,340 L565,320 L560,300 L555,280 L555,265 Z" />
              {/* South Carolina */}
              <path d="M595,185 L610,180 L625,178 L640,182 L650,195 L645,210 L630,215 L615,210 L605,195 Z" />
              {/* North Carolina */}
              <path d="M610,180 L620,162 L640,165 L660,160 L680,155 L700,158 L710,165 L700,175 L680,180 L660,185 L640,182 L625,178 Z" />
              {/* Virginia */}
              <path d="M600,140 L610,148 L620,142 L640,140 L660,138 L680,140 L700,145 L710,150 L700,158 L680,155 L660,160 L640,165 L620,162 L600,158 Z" />
              {/* West Virginia */}
              <path d="M600,110 L610,115 L620,120 L625,135 L620,142 L610,148 L600,140 L595,125 Z" />
              {/* Pennsylvania */}
              <path d="M600,110 L610,115 L620,100 L640,92 L660,88 L680,85 L700,88 L710,95 L705,108 L690,112 L670,115 L650,115 L630,118 L625,135 L620,120 Z" />
              {/* New York */}
              <path d="M680,85 L700,75 L720,68 L740,62 L755,65 L760,72 L755,82 L745,88 L730,92 L715,95 L710,95 L700,88 Z" />
              {/* New Jersey */}
              <path d="M710,95 L715,95 L720,100 L718,115 L712,125 L705,120 L705,108 Z" />
              {/* Connecticut */}
              <path d="M730,82 L745,78 L755,82 L750,90 L740,92 L730,92 Z" />
              {/* Rhode Island */}
              <path d="M755,82 L760,78 L765,82 L762,88 L755,88 Z" />
              {/* Massachusetts */}
              <path d="M740,62 L755,58 L770,60 L780,65 L775,72 L760,78 L755,82 L745,78 L730,82 L735,72 Z" />
              {/* Vermont */}
              <path d="M720,68 L730,55 L740,50 L745,55 L740,62 L735,72 L730,82 L720,78 Z" />
              {/* New Hampshire */}
              <path d="M740,50 L748,42 L755,45 L758,55 L755,58 L740,62 L745,55 Z" />
              {/* Maine */}
              <path d="M748,42 L755,30 L765,25 L780,30 L785,42 L780,55 L770,60 L758,55 L755,45 Z" />
              {/* Maryland/Delaware */}
              <path d="M650,115 L670,115 L690,112 L705,108 L705,120 L695,128 L680,130 L665,128 L650,125 Z" />
              {/* Alaska (simplified, bottom left) */}
              <path d="M70,370 L110,350 L150,345 L180,350 L200,360 L195,380 L175,395 L150,400 L120,398 L90,390 L75,385 Z" />
              {/* Hawaii (simplified, bottom left) */}
              <path d="M220,400 L230,395 L240,398 L245,405 L240,410 L230,412 L222,408 Z" />
              <path d="M245,395 L252,390 L260,393 L262,400 L255,405 L248,402 Z" />
              <path d="M260,388 L268,385 L275,388 L278,395 L272,400 L265,398 Z" />
            </g>

            {/* Stars decoration */}
            <g fill="rgba(255,255,255,0.08)">
              <polygon points="480,150 485,165 500,168 488,178 492,195 480,185 468,195 472,178 460,168 475,165" />
              <polygon points="350,250 353,258 362,260 356,266 358,275 350,270 342,275 344,266 338,260 347,258" />
              <polygon points="600,100 602,106 608,107 604,111 605,117 600,114 595,117 596,111 592,107 598,106" />
            </g>
          </svg>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Get Base Info</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className={selectClass}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state_full}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Base */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Base:
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                disabled={!selectedState}
                className={`${selectClass} ${!selectedState ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">Select a Base</option>
                {filteredBases.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* What are you interested in */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                What are you interested in:
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className={selectClass}
              >
                <option value="">- Select -</option>
                {INTERESTS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2c3e6b] hover:bg-[#1e2d52] text-white py-3 rounded-lg font-bold text-sm tracking-wider transition disabled:opacity-50 uppercase"
            >
              {submitting ? "Loading..." : "Select Base"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
