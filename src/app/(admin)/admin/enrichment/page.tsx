"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Base = {
  id: string;
  name: string;
  slug: string;
  branch: string;
  city: string;
  state: string;
  militaryonesource_slug: string | null;
  lat: number | null;
  lng: number | null;
};

type RowStatus = "idle" | "enriching" | "enriching-local" | "done" | "error";

export default function AdminEnrichmentPage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>(
    {}
  );
  const [localCounts, setLocalCounts] = useState<Record<string, number>>({});
  const [rowStatus, setRowStatus] = useState<Record<string, RowStatus>>({});
  const [rowMessage, setRowMessage] = useState<Record<string, string>>({});
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });

  const loadBases = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bases")
      .select(
        "id, name, slug, branch, city, state, militaryonesource_slug, lat, lng"
      )
      .order("name");
    setBases(data || []);
    setLoading(false);
  }, []);

  const loadCounts = useCallback(async () => {
    const supabase = createClient();

    // Resource counts — fetch all and count client-side
    const { data: resources } = await supabase
      .from("base_resources")
      .select("base_id");
    if (resources) {
      const map: Record<string, number> = {};
      resources.forEach((r) => {
        map[r.base_id] = (map[r.base_id] || 0) + 1;
      });
      setResourceCounts(map);
    }

    // Local resource counts
    const { data: localRes } = await supabase
      .from("base_local_resources")
      .select("base_id");
    if (localRes) {
      const map: Record<string, number> = {};
      localRes.forEach((r) => {
        map[r.base_id] = (map[r.base_id] || 0) + 1;
      });
      setLocalCounts(map);
    }
  }, []);

  useEffect(() => {
    loadBases();
    loadCounts();
  }, [loadBases, loadCounts]);

  async function enrichBase(slug: string, baseId: string) {
    setRowStatus((s) => ({ ...s, [baseId]: "enriching" }));
    setRowMessage((s) => ({ ...s, [baseId]: "" }));
    try {
      const res = await fetch(`/api/enrich/${slug}`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRowStatus((s) => ({ ...s, [baseId]: "done" }));
        setRowMessage((s) => ({
          ...s,
          [baseId]: `${data.count} resources added`,
        }));
        setResourceCounts((c) => ({ ...c, [baseId]: data.count }));
      } else {
        setRowStatus((s) => ({ ...s, [baseId]: "error" }));
        setRowMessage((s) => ({
          ...s,
          [baseId]: data.error || "Unknown error",
        }));
      }
    } catch {
      setRowStatus((s) => ({ ...s, [baseId]: "error" }));
      setRowMessage((s) => ({ ...s, [baseId]: "Network error" }));
    }
  }

  async function enrichLocalBase(slug: string, baseId: string) {
    setRowStatus((s) => ({ ...s, [baseId]: "enriching-local" }));
    setRowMessage((s) => ({ ...s, [baseId]: "" }));
    try {
      const res = await fetch(`/api/enrich-local/${slug}`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRowStatus((s) => ({ ...s, [baseId]: "done" }));
        setRowMessage((s) => ({
          ...s,
          [baseId]: `${data.count} local resources added`,
        }));
        setLocalCounts((c) => ({ ...c, [baseId]: data.count }));
      } else {
        setRowStatus((s) => ({ ...s, [baseId]: "error" }));
        setRowMessage((s) => ({
          ...s,
          [baseId]: data.error || "Unknown error",
        }));
      }
    } catch {
      setRowStatus((s) => ({ ...s, [baseId]: "error" }));
      setRowMessage((s) => ({ ...s, [baseId]: "Network error" }));
    }
  }

  async function enrichAll() {
    const eligible = bases.filter((b) => b.militaryonesource_slug);
    if (eligible.length === 0) return;

    setBatchRunning(true);
    setBatchProgress({ done: 0, total: eligible.length });

    for (let i = 0; i < eligible.length; i++) {
      const base = eligible[i];
      await enrichBase(base.slug, base.id);
      setBatchProgress({ done: i + 1, total: eligible.length });
      // 5-second delay between bases to avoid rate limits
      if (i < eligible.length - 1) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    setBatchRunning(false);
    loadCounts();
  }

  function statusBadge(baseId: string) {
    const status = rowStatus[baseId];
    const msg = rowMessage[baseId];
    if (!status || status === "idle") return null;
    if (status === "enriching" || status === "enriching-local") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
          <span className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
          {status === "enriching" ? "Scraping..." : "Fetching local..."}
        </span>
      );
    }
    if (status === "done") {
      return <span className="text-xs text-green-600">{msg}</span>;
    }
    if (status === "error") {
      return <span className="text-xs text-red-600">{msg}</span>;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Enrichment</h1>
        <button
          onClick={enrichAll}
          disabled={batchRunning}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition disabled:opacity-50"
        >
          {batchRunning
            ? `Enriching ${batchProgress.done}/${batchProgress.total}...`
            : "Enrich All"}
        </button>
      </div>

      {batchRunning && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${
                  batchProgress.total
                    ? (batchProgress.done / batchProgress.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {batchProgress.done} of {batchProgress.total} bases enriched
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bases.length === 0 ? (
        <p className="text-gray-500">No bases found.</p>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Base</th>
                <th className="text-left px-4 py-3 font-medium">Branch</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">MOS Slug</th>
                <th className="text-center px-4 py-3 font-medium">
                  Resources
                </th>
                <th className="text-center px-4 py-3 font-medium">Local</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bases.map((base) => (
                <tr key={base.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{base.name}</td>
                  <td className="px-4 py-3 text-gray-600">{base.branch}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {base.city}, {base.state}
                  </td>
                  <td className="px-4 py-3">
                    {base.militaryonesource_slug ? (
                      <span className="text-green-600 text-xs">
                        {base.militaryonesource_slug}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-mono ${
                        resourceCounts[base.id]
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {resourceCounts[base.id] || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-mono ${
                        localCounts[base.id]
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {localCounts[base.id] || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(base.id)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => enrichBase(base.slug, base.id)}
                      disabled={
                        !base.militaryonesource_slug ||
                        rowStatus[base.id] === "enriching" ||
                        rowStatus[base.id] === "enriching-local"
                      }
                      className="text-blue-600 hover:text-blue-800 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Enrich
                    </button>
                    <button
                      onClick={() => enrichLocalBase(base.slug, base.id)}
                      disabled={
                        !base.lat ||
                        !base.lng ||
                        rowStatus[base.id] === "enriching" ||
                        rowStatus[base.id] === "enriching-local"
                      }
                      className="text-purple-600 hover:text-purple-800 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Local
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
