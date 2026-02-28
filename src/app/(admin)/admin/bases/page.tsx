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
  image_url: string | null;
};

export default function AdminBasesPage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);

  const loadBases = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bases")
      .select("id, name, slug, branch, city, state, image_url")
      .order("name");
    setBases(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBases();
  }, [loadBases]);

  async function deleteBase(id: string) {
    if (!confirm("Delete this base?")) return;
    const supabase = createClient();
    await supabase.from("bases").delete().eq("id", id);
    loadBases();
  }

  async function fetchImages() {
    setFetchingImages(true);
    setImageResult(null);
    try {
      const res = await fetch("/api/bases/fetch-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (data.error) {
        setImageResult(`Error: ${data.error}`);
      } else {
        setImageResult(`Updated ${data.updated}/${data.total} bases. ${data.failures?.length ? `Failed: ${data.failures.join(", ")}` : ""}`);
        loadBases();
      }
    } catch (err) {
      setImageResult(`Fetch error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setFetchingImages(false);
    }
  }

  const missingImages = bases.filter((b) => !b.image_url).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Bases</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchImages}
            disabled={fetchingImages || missingImages === 0}
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetchingImages ? "Fetching..." : `Fetch Images (${missingImages} missing)`}
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            + Add Base
          </button>
        </div>
      </div>

      {imageResult && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border text-sm text-gray-700">
          {imageResult}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bases.length === 0 ? (
        <p className="text-gray-500">No bases added yet.</p>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Branch</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-center px-4 py-3 font-medium">Image</th>
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
                  <td className="px-4 py-3 text-gray-400">{base.slug}</td>
                  <td className="px-4 py-3 text-center">
                    {base.image_url ? (
                      <span className="text-green-600 text-xs">Yes</span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteBase(base.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
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
