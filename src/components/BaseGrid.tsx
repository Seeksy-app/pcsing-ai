"use client";

import { useState } from "react";
import Link from "next/link";
import { BaseCard } from "./BaseCard";

type Base = {
  id: string;
  name: string;
  slug: string;
  branch: string;
  city: string;
  state: string;
  state_full: string;
  phone?: string | null;
  address?: string | null;
  population?: number | null;
  website?: string | null;
};

const branchColors: Record<string, string> = {
  Army: "bg-green-100 text-green-800",
  Navy: "bg-blue-100 text-blue-800",
  "Air Force": "bg-sky-100 text-sky-800",
  "Marine Corps": "bg-red-100 text-red-800",
  "Coast Guard": "bg-orange-100 text-orange-800",
  "Space Force": "bg-indigo-100 text-indigo-800",
};

export function BaseGrid({ bases }: { bases: Base[] }) {
  const [view, setView] = useState<"card" | "list">("card");

  return (
    <div>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {bases.length} base{bases.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("card")}
            className={`p-1.5 rounded-md transition ${
              view === "card"
                ? "bg-white shadow-sm text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="Card view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition ${
              view === "list"
                ? "bg-white shadow-sm text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </button>
        </div>
      </div>

      {view === "card" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bases.map((base) => (
            <BaseCard key={base.id} base={base} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {bases.map((base) => (
            <Link
              key={base.id}
              href={`/bases/${base.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-medium text-gray-900 group-hover:text-blue-700 transition truncate">
                  {base.name}
                </span>
                <span className="text-sm text-gray-500 hidden sm:inline flex-shrink-0">
                  {base.city}, {base.state_full}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {base.phone && (
                  <span className="text-xs text-gray-400 hidden md:inline">
                    {base.phone}
                  </span>
                )}
                {base.population && (
                  <span className="text-xs text-gray-400 hidden lg:inline">
                    Pop. {base.population.toLocaleString()}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${branchColors[base.branch] || "bg-gray-100 text-gray-700"}`}
                >
                  {base.branch}
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
