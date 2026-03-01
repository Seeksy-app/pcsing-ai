"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StateOption = { state: string; state_full: string };
type BaseOption = { name: string; slug: string; state: string };

type Props = {
  branches: string[];
  states: StateOption[];
  allBases: BaseOption[];
  currentBranch: string;
  currentState: string;
  currentQuery: string;
};

export function BaseDirectoryFilters({
  branches,
  states,
  allBases,
  currentBranch,
  currentState,
  currentQuery,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentQuery);

  function buildUrl(overrides: { branch?: string; state?: string; q?: string }) {
    const params = new URLSearchParams();
    const branch = overrides.branch ?? currentBranch;
    const state = overrides.state ?? currentState;
    const q = overrides.q ?? currentQuery;

    if (branch && branch !== "All") params.set("branch", branch);
    if (state) params.set("state", state);
    if (q) params.set("q", q);

    const qs = params.toString();
    return `/bases${qs ? `?${qs}` : ""}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ q: search.trim() || undefined }));
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bases by name..."
          className="flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={currentState}
          onChange={(e) => router.push(buildUrl({ state: e.target.value }))}
          className="px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.state} value={s.state}>
              {s.state_full}
            </option>
          ))}
        </select>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              router.push(`/bases/${e.target.value}`);
            }
          }}
          className="px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Jump to base...</option>
          {allBases
            .filter((b) => !currentState || b.state === currentState)
            .map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
        </select>
        <button
          type="submit"
          className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
        >
          Search
        </button>
      </form>

      {/* Branch Filters */}
      <div className="flex flex-wrap gap-2">
        {branches.map((branch) => (
          <a
            key={branch}
            href={buildUrl({ branch })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              currentBranch === branch
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {branch}
          </a>
        ))}
      </div>
    </div>
  );
}
