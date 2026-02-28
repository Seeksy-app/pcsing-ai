"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Weight allowance table                                              */
/* ------------------------------------------------------------------ */

type AllowanceEntry = { noDep: number; withDep: number };

const WEIGHT_ALLOWANCES: Record<string, AllowanceEntry> = {
  "E-1": { noDep: 8000, withDep: 10000 },
  "E-2": { noDep: 8000, withDep: 10000 },
  "E-3": { noDep: 8000, withDep: 10000 },
  "E-4": { noDep: 8000, withDep: 10000 },
  "E-5": { noDep: 9000, withDep: 11000 },
  "E-6": { noDep: 11000, withDep: 13000 },
  "E-7": { noDep: 13000, withDep: 15000 },
  "E-8": { noDep: 14000, withDep: 16000 },
  "E-9": { noDep: 15000, withDep: 17500 },
  "W-1": { noDep: 10000, withDep: 12000 },
  "W-2": { noDep: 12500, withDep: 13500 },
  "W-3": { noDep: 14000, withDep: 15500 },
  "W-4": { noDep: 16000, withDep: 17500 },
  "W-5": { noDep: 17000, withDep: 18500 },
  "O-1": { noDep: 10000, withDep: 12000 },
  "O-2": { noDep: 12500, withDep: 13500 },
  "O-3": { noDep: 14000, withDep: 15500 },
  "O-4": { noDep: 16000, withDep: 17500 },
  "O-5": { noDep: 17000, withDep: 18500 },
  "O-6": { noDep: 18000, withDep: 20000 },
  "O-7": { noDep: 18000, withDep: 20000 },
  "O-8": { noDep: 18000, withDep: 20000 },
  "O-9": { noDep: 18000, withDep: 20000 },
  "O-10": { noDep: 18000, withDep: 20000 },
};

const PAY_GRADES = Object.keys(WEIGHT_ALLOWANCES);

/* ------------------------------------------------------------------ */
/* Simplified distance lookup (major base-to-base estimates in miles)  */
/* Uses a flat rate fallback of 1,200 mi for unknown pairs.            */
/* ------------------------------------------------------------------ */

const DISTANCE_TABLE: Record<string, number> = {
  /* ---- East Coast ↔ West Coast ---- */
  "fort-liberty_fort-irwin": 2400,
  "fort-liberty_joint-base-lewis-mcchord": 2700,
  "fort-liberty_camp-pendleton": 2400,
  "fort-liberty_travis-afb": 2500,
  "fort-liberty_fort-cavazos": 1200,
  "fort-liberty_fort-campbell": 530,
  "fort-liberty_fort-stewart": 370,
  "fort-liberty_fort-moore": 380,
  "fort-liberty_fort-eisenhower": 280,
  /* ---- Central ↔ Coasts ---- */
  "fort-cavazos_fort-irwin": 1200,
  "fort-cavazos_joint-base-lewis-mcchord": 2000,
  "fort-cavazos_fort-campbell": 900,
  "fort-cavazos_fort-moore": 800,
  "fort-campbell_fort-stewart": 500,
  "fort-campbell_fort-moore": 270,
  "fort-campbell_joint-base-lewis-mcchord": 2300,
  /* ---- Misc common routes ---- */
  "nas-jacksonville_camp-pendleton": 2200,
  "nas-jacksonville_norfolk": 570,
  "norfolk_camp-lejeune": 250,
  "norfolk_fort-liberty": 260,
  "joint-base-lewis-mcchord_fort-irwin": 1000,
  "camp-pendleton_fort-irwin": 200,
  "peterson-sfb_fort-cavazos": 900,
  "peterson-sfb_joint-base-lewis-mcchord": 1300,
};

function lookupDistance(from: string, to: string): number {
  if (from === to) return 0;
  const key1 = `${from}_${to}`;
  const key2 = `${to}_${from}`;
  return DISTANCE_TABLE[key1] ?? DISTANCE_TABLE[key2] ?? 1200;
}

/* ------------------------------------------------------------------ */
/* Autocomplete                                                        */
/* ------------------------------------------------------------------ */

type BaseOption = { label: string; value: string };

function BaseAutocomplete({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: BaseOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return options.slice(0, 10);
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 10);
  }, [query, options]);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    function close(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={open ? query : selectedLabel}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setQuery("");
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                opt.value === value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const RATE_PER_LB_PER_1000_MI = 0.85;

type Props = {
  bases: BaseOption[];
};

export function PPMCalculator({ bases }: Props) {
  const [fromBase, setFromBase] = useState("");
  const [toBase, setToBase] = useState("");
  const [payGrade, setPayGrade] = useState("E-5");
  const [hasDependents, setHasDependents] = useState(false);
  const [weight, setWeight] = useState<number | "">("");
  const [moveType, setMoveType] = useState<"full" | "partial">("full");
  const [showResults, setShowResults] = useState(false);

  const allowance = WEIGHT_ALLOWANCES[payGrade];
  const maxWeight = hasDependents ? allowance.withDep : allowance.noDep;

  const effectiveWeight = moveType === "full" ? maxWeight : Math.min(Number(weight) || 0, maxWeight);
  const distance = lookupDistance(fromBase, toBase);
  const ratePerLb = RATE_PER_LB_PER_1000_MI * (distance / 1000);
  const payout = effectiveWeight * ratePerLb;
  const partialPayout =
    moveType === "full" ? Math.min(Number(weight) || 0, maxWeight) * ratePerLb : 0;

  const weightPct = Math.min((effectiveWeight / maxWeight) * 100, 100);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
  }

  function openChat() {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { prefill: "Help me plan my PPM/DITY move" },
      })
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            2026 JTR Rates
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            PPM / DITY Move Calculator
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Estimate your Personally Procured Move payout based on rank, weight,
            and distance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form — 3 cols */}
          <form onSubmit={handleCalculate} className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* From / To */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Moving from
                  </label>
                  <BaseAutocomplete
                    options={bases}
                    value={fromBase}
                    onChange={setFromBase}
                    placeholder="Search base or city..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Moving to
                  </label>
                  <BaseAutocomplete
                    options={bases}
                    value={toBase}
                    onChange={setToBase}
                    placeholder="Search base or city..."
                  />
                </div>
              </div>

              {/* Pay Grade + Dependents */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pay grade
                  </label>
                  <select
                    value={payGrade}
                    onChange={(e) => setPayGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {PAY_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Dependents
                  </label>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden h-[46px]">
                    <button
                      type="button"
                      onClick={() => setHasDependents(false)}
                      className={`flex-1 text-sm font-medium transition ${
                        !hasDependents
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Without
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasDependents(true)}
                      className={`flex-1 text-sm font-medium transition ${
                        hasDependents
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      With dependents
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Estimated weight (lbs)
                  </label>
                  <span className="text-xs text-gray-400">
                    Max allowance: {maxWeight.toLocaleString()} lbs
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={maxWeight}
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder={`Up to ${maxWeight.toLocaleString()} lbs`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                {/* Weight allowance info */}
                <div className="mt-3 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Weight allowance for {payGrade}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div
                      className={`rounded-lg p-2.5 ${
                        !hasDependents
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-gray-100"
                      }`}
                    >
                      <p className="text-xs text-gray-500">Without dependents</p>
                      <p className="font-semibold">
                        {allowance.noDep.toLocaleString()} lbs
                      </p>
                    </div>
                    <div
                      className={`rounded-lg p-2.5 ${
                        hasDependents
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-gray-100"
                      }`}
                    >
                      <p className="text-xs text-gray-500">With dependents</p>
                      <p className="font-semibold">
                        {allowance.withDep.toLocaleString()} lbs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Move Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Move type
                </label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden h-[46px]">
                  <button
                    type="button"
                    onClick={() => setMoveType("full")}
                    className={`flex-1 text-sm font-medium transition ${
                      moveType === "full"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Full PPM
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoveType("partial")}
                    className={`flex-1 text-sm font-medium transition ${
                      moveType === "partial"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Partial PPM
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!fromBase || !toBase}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium transition-colors text-sm"
              >
                Calculate Estimated Payout
              </button>
            </div>
          </form>

          {/* Results — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {showResults && fromBase && toBase ? (
              <>
                {/* Payout Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    Estimated PPM Payout
                  </p>
                  <p className="text-5xl font-bold text-green-600 mb-1">
                    ${payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    {moveType === "full" ? "Full PPM" : "Partial PPM"} &middot;{" "}
                    100% of govt cost estimate
                  </p>

                  {/* Weight bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>
                        {effectiveWeight.toLocaleString()} lbs used
                      </span>
                      <span>{maxWeight.toLocaleString()} lbs max</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          weightPct > 90
                            ? "bg-red-500"
                            : weightPct > 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${weightPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-medium">
                        ~{distance.toLocaleString()} miles
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Weight</span>
                      <span className="font-medium">
                        {effectiveWeight.toLocaleString()} lbs
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Rate</span>
                      <span className="font-medium">
                        ${ratePerLb.toFixed(3)} / lb
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Pay grade</span>
                      <span className="font-medium">
                        {payGrade}{" "}
                        {hasDependents ? "(w/ dep)" : "(no dep)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full vs Partial comparison (only when Full PPM) */}
                {moveType === "full" && Number(weight) > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Full PPM vs. Partial PPM
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Full PPM</p>
                        <p className="text-xl font-bold text-green-700">
                          $
                          {payout.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {maxWeight.toLocaleString()} lbs
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Partial PPM</p>
                        <p className="text-xl font-bold text-blue-700">
                          $
                          {partialPayout.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.min(
                            Number(weight) || 0,
                            maxWeight
                          ).toLocaleString()}{" "}
                          lbs
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <p className="text-sm text-amber-800">
                    <strong>Disclaimer:</strong> This is an estimate based on
                    simplified JTR rates and straight-line distances. Actual
                    payouts depend on official DTOD mileage, current TSP rates,
                    and your finance office&apos;s calculations. Always verify
                    with your TMO/PPO and finance office before making decisions.
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={openChat}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Need help planning your move?
                </button>
              </>
            ) : (
              /* Empty state */
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
                  <svg
                    className="w-7 h-7 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Your estimate will appear here
                </h3>
                <p className="text-sm text-gray-500">
                  Fill out the form and click Calculate to see your estimated PPM
                  payout.
                </p>
              </div>
            )}

            {/* Weight table reference */}
            <details className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <summary className="px-6 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition">
                View full weight allowance table
              </summary>
              <div className="px-6 pb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b">
                      <th className="pb-2 font-medium">Grade</th>
                      <th className="pb-2 font-medium text-right">No dep</th>
                      <th className="pb-2 font-medium text-right">W/ dep</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAY_GRADES.map((g) => (
                      <tr
                        key={g}
                        className={`border-b border-gray-50 ${
                          g === payGrade ? "bg-blue-50 font-medium" : ""
                        }`}
                      >
                        <td className="py-1.5">{g}</td>
                        <td className="py-1.5 text-right">
                          {WEIGHT_ALLOWANCES[g].noDep.toLocaleString()}
                        </td>
                        <td className="py-1.5 text-right">
                          {WEIGHT_ALLOWANCES[g].withDep.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            {/* Related links */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Related resources
              </p>
              <div className="space-y-2 text-sm">
                <Link
                  href="/entitlements"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  PCS Entitlements &amp; Benefits &rarr;
                </Link>
                <Link
                  href="/guide#types-of-moves"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  PPM vs. HHG Guide &rarr;
                </Link>
                <Link
                  href="/checklist"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  PCS Checklist &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
