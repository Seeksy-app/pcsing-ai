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

type SeoPage = {
  id?: string;
  route: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
};

const SEO_ROUTES = [
  "/pcs-guide",
  "/bah-calculator",
  "/pcs-checklist",
  "/military-housing",
  "/pcs-timeline",
  "/overseas-pcs",
  "/va-home-loan",
  "/pet-relocation",
  "/shipping-household-goods",
  "/dity-ppm-move",
  "/spouse-employment",
  "/tricare-during-pcs",
  "/schools-near-base",
  "/entitlements",
  "/guide",
  "/checklist",
  "/pcs-during-deployment",
];

export default function AdminSEOPage() {
  const [bases, setBases] = useState<BaseSEO[]>([]);
  const [seoPages, setSeoPages] = useState<Record<string, SeoPage>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SeoPage>({
    route: "",
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
  });

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: basesData }, seoRes] = await Promise.all([
      supabase
        .from("bases")
        .select("id, name, slug, seo_title, seo_description")
        .order("name"),
      fetch("/api/admin/seo"),
    ]);
    setBases(basesData || []);

    const seoData: SeoPage[] = await seoRes.json();
    const map: Record<string, SeoPage> = {};
    if (Array.isArray(seoData)) {
      seoData.forEach((p) => {
        map[p.route] = p;
      });
    }
    setSeoPages(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startEdit = (route: string) => {
    const existing = seoPages[route];
    setEditForm({
      route,
      meta_title: existing?.meta_title || "",
      meta_description: existing?.meta_description || "",
      og_title: existing?.og_title || "",
      og_description: existing?.og_description || "",
    });
    setEditingRoute(route);
  };

  const saveEdit = async () => {
    if (!editingRoute) return;
    setSaving(editingRoute);
    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const saved = await res.json();
      setSeoPages((prev) => ({ ...prev, [editingRoute]: saved }));
      setEditingRoute(null);
    }
    setSaving(null);
  };

  const hasData = (route: string) => {
    const p = seoPages[route];
    return p && (p.meta_title || p.meta_description);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SEO Manager</h1>

      {/* SEO Pages Section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Content Page SEO</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2">
            {SEO_ROUTES.map((route) => (
              <div key={route}>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{route}</p>
                    {seoPages[route]?.meta_title && (
                      <p className="text-xs text-gray-400 truncate max-w-md">
                        {seoPages[route].meta_title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        hasData(route)
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {hasData(route) ? "Configured" : "Default"}
                    </span>
                    <button
                      onClick={() => startEdit(route)}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {editingRoute === route && (
                  <div className="bg-gray-50 p-4 rounded-b-lg border-x border-b space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={editForm.meta_title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, meta_title: e.target.value })
                        }
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        placeholder="Page title for search results"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        value={editForm.meta_description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            meta_description: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        rows={2}
                        placeholder="Description for search results (150-160 chars)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={editForm.og_title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, og_title: e.target.value })
                        }
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        placeholder="Title for social sharing (defaults to meta title)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        OG Description
                      </label>
                      <textarea
                        value={editForm.og_description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            og_description: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        rows={2}
                        placeholder="Description for social sharing (defaults to meta description)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        disabled={saving === route}
                        className="text-xs px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving === route ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingRoute(null)}
                        className="text-xs px-4 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base Pages Section */}
      <div className="bg-white rounded-lg border p-6">
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
