"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type BaseSEO = {
  id: string;
  name: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
};

export default function AdminSEOPage() {
  const [bases, setBases] = useState<BaseSEO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBases = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bases")
      .select("id, name, slug, seo_title, seo_description")
      .order("name");
    setBases(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBases();
  }, [loadBases]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SEO Manager</h1>

      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Base Page SEO Status</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bases.length === 0 ? (
          <p className="text-gray-500">No bases to manage.</p>
        ) : (
          <div className="space-y-3">
            {bases.map((base) => (
              <div
                key={base.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{base.name}</p>
                  <p className="text-sm text-gray-500">/bases/{base.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      base.seo_title
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {base.seo_title ? "Title Set" : "No Title"}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      base.seo_description
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {base.seo_description ? "Desc Set" : "No Desc"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
