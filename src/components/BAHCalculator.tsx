"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PAY_GRADES,
  type PayGrade,
  getRate,
  getAllRates,
  BASES,
  type RateRow,
} from "@/data/bah-rates-2026";

/* ------------------------------------------------------------------ */
/* Base autocomplete (reused pattern)                                  */
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
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return options.slice(0, 12);
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 12);
  }, [query, options]);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
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
          {filtered.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setQuery("");
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                o.value === value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rates comparison table                                              */
/* ------------------------------------------------------------------ */

function RatesTable({
  rows,
  activeGrade,
  label,
}: {
  rows: RateRow[];
  activeGrade: PayGrade;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="pb-2 pr-4 font-medium">Grade</th>
              <th className="pb-2 pr-4 font-medium text-right">With dep</th>
              <th className="pb-2 font-medium text-right">Without dep</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.grade}
                className={`border-b border-gray-50 ${
                  r.grade === activeGrade ? "bg-blue-50 font-medium" : ""
                }`}
              >
                <td className="py-1.5 pr-4">{r.grade}</td>
                <td className="py-1.5 pr-4 text-right">
                  ${r.withDep.toLocaleString()}
                </td>
                <td className="py-1.5 text-right">
                  ${r.withoutDep.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type Props = {
  bases: BaseOption[];
};

export function BAHCalculator({ bases }: Props) {
  const [station, setStation] = useState("");
  const [payGrade, setPayGrade] = useState<PayGrade>("E-5");
  const [withDep, setWithDep] = useState(false);

  const [compare, setCompare] = useState(false);
  const [station2, setStation2] = useState("");

  const rate = station ? getRate(station, payGrade, withDep) : null;
  const allRates = station ? getAllRates(station) : null;
  const baseName = station ? BASES[station]?.name ?? station : "";
  const baseZip = station ? BASES[station]?.zip ?? "" : "";

  const rate2 = station2 ? getRate(station2, payGrade, withDep) : null;
  const allRates2 = station2 ? getAllRates(station2) : null;
  const baseName2 = station2 ? BASES[station2]?.name ?? station2 : "";

  function openChat() {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: {
          prefill: `Tell me about housing options at ${baseName}`,
        },
      })
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
            2026 Rates
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            BAH Calculator
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Look up your Basic Allowance for Housing by duty station, pay grade,
            and dependency status.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ---- Form (3 cols) ---- */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Duty station */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duty station
                </label>
                <BaseAutocomplete
                  options={bases}
                  value={station}
                  onChange={setStation}
                  placeholder="Search base or city..."
                />
                {baseZip && (
                  <p className="text-xs text-gray-400 mt-1">
                    MHA zip code: {baseZip}
                  </p>
                )}
              </div>

              {/* Pay grade + dependents */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pay grade
                  </label>
                  <select
                    value={payGrade}
                    onChange={(e) => setPayGrade(e.target.value as PayGrade)}
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
                      onClick={() => setWithDep(false)}
                      className={`flex-1 text-sm font-medium transition ${
                        !withDep
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Without
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithDep(true)}
                      className={`flex-1 text-sm font-medium transition ${
                        withDep
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      With dependents
                    </button>
                  </div>
                </div>
              </div>

              {/* Compare toggle */}
              {station && (
                <div>
                  <button
                    type="button"
                    onClick={() => setCompare(!compare)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {compare ? "Remove comparison" : "Compare to another base"}
                  </button>

                  {compare && (
                    <div className="mt-3">
                      <BaseAutocomplete
                        options={bases}
                        value={station2}
                        onChange={setStation2}
                        placeholder="Search second base..."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Full rate table */}
            {allRates && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  All BAH rates at {baseName}
                </h3>

                {compare && allRates2 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <RatesTable
                      rows={allRates}
                      activeGrade={payGrade}
                      label={baseName}
                    />
                    <RatesTable
                      rows={allRates2}
                      activeGrade={payGrade}
                      label={baseName2}
                    />
                  </div>
                ) : (
                  <RatesTable rows={allRates} activeGrade={payGrade} />
                )}
              </div>
            )}

            {/* How does BAH work? */}
            <details className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <summary className="px-6 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition">
                How does BAH work?
              </summary>
              <div className="px-6 pb-6 text-sm text-gray-600 space-y-3">
                <p>
                  <strong>Basic Allowance for Housing (BAH)</strong> is a monthly
                  payment to service members to help cover housing costs when
                  government quarters are not provided. The amount is based on
                  three factors: <strong>duty station location</strong> (using
                  Military Housing Area zip codes), <strong>pay grade</strong>,
                  and <strong>dependency status</strong>.
                </p>
                <p>
                  BAH rates are recalculated each year by the DoD based on local
                  rental market surveys. They are designed to cover the median
                  cost of suitable rental housing in each area, including rent,
                  utilities, and renter&apos;s insurance.
                </p>
                <p>
                  <strong>Rate protection:</strong> If BAH rates decrease in your
                  area, you keep the higher rate as long as you remain in the
                  same pay grade and dependency status at the same duty station.
                  Rates only go down if your personal situation changes (e.g.,
                  loss of dependent status) or you PCS.
                </p>
                <p>
                  If you live in on-post privatized housing, your BAH is paid
                  directly to the housing management company. If you live
                  off-post, BAH is included in your paycheck and you can pocket
                  any difference between your BAH and actual housing costs — or
                  supplement it if local rents exceed your rate.
                </p>
                <p className="text-xs text-gray-400">
                  For official rates and methodology, visit the{" "}
                  <a
                    href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    DoD BAH Rate Lookup
                  </a>
                  .
                </p>
              </div>
            </details>
          </div>

          {/* ---- Results sidebar (2 cols) ---- */}
          <div className="lg:col-span-2 space-y-6">
            {rate !== null ? (
              <>
                {/* Primary result */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    Monthly BAH &middot; {payGrade}{" "}
                    {withDep ? "w/ dep" : "no dep"}
                  </p>
                  <p className="text-5xl font-bold text-blue-600 mb-1">
                    ${rate.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    ${(rate * 12).toLocaleString()} / year
                  </p>

                  {/* Base info */}
                  <div className="text-left space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">Duty station</span>
                      <span className="font-medium">{baseName}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">MHA zip</span>
                      <span className="font-medium">{baseZip}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">Pay grade</span>
                      <span className="font-medium">{payGrade}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">Dependents</span>
                      <span className="font-medium">
                        {withDep ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comparison card */}
                {compare && rate2 !== null && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Side-by-side comparison
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {baseName}
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          ${rate.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ${(rate * 12).toLocaleString()}/yr
                        </p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {baseName2}
                        </p>
                        <p className="text-2xl font-bold text-indigo-700">
                          ${rate2.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ${(rate2 * 12).toLocaleString()}/yr
                        </p>
                      </div>
                    </div>
                    {/* Difference */}
                    <div className="mt-4 text-center text-sm">
                      <span className="text-gray-500">Difference: </span>
                      <span
                        className={`font-semibold ${
                          rate - rate2 > 0
                            ? "text-green-600"
                            : rate - rate2 < 0
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {rate - rate2 > 0 ? "+" : ""}$
                        {(rate - rate2).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <p className="text-sm text-amber-800">
                    <strong>Disclaimer:</strong> These are estimated 2026 BAH
                    rates based on published DoD trends. Official rates may
                    differ. Verify with the{" "}
                    <a
                      href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      official DoD BAH calculator
                    </a>
                    .
                  </p>
                </div>

                {/* AI CTA */}
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
                  Ask about housing at {baseName}
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Select a duty station
                </h3>
                <p className="text-sm text-gray-500">
                  Choose a base above to see BAH rates for all pay grades.
                </p>
              </div>
            )}

            {/* Related links */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Related resources
              </p>
              <div className="space-y-2 text-sm">
                <Link
                  href="/tools/ppm-calculator"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  PPM/DITY Move Calculator &rarr;
                </Link>
                <Link
                  href="/entitlements"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  All PCS Entitlements &rarr;
                </Link>
                <Link
                  href="/guide#housing"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Housing Guide &rarr;
                </Link>
                <a
                  href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Official DoD BAH Calculator &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
