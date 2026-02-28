"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Campaign = {
  id: string;
  advertiser_name: string;
  status: string;
  impressions_count: number;
  clicks_count: number;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
};

export default function AdminAdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("ad_campaigns")
      .select(
        "id, advertiser_name, status, impressions_count, clicks_count, start_date, end_date, budget"
      )
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Ad Campaign Manager</h1>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
          + New Campaign
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns yet.</p>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Advertiser</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Budget</th>
                <th className="text-left px-4 py-3 font-medium">
                  Impressions
                </th>
                <th className="text-left px-4 py-3 font-medium">Clicks</th>
                <th className="text-left px-4 py-3 font-medium">CTR</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">
                    {c.advertiser_name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : c.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.budget ? `$${Number(c.budget).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.impressions_count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.clicks_count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.impressions_count > 0
                      ? `${((c.clicks_count / c.impressions_count) * 100).toFixed(2)}%`
                      : "—"}
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
