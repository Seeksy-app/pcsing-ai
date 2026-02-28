"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type KnowledgeEntry = {
  id: string;
  topic: string;
  content: string;
  category: string | null;
  source_url: string | null;
  created_at: string;
};

export default function AdminAIPage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("ai_knowledge")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function deleteEntry(id: string) {
    if (!confirm("Delete this knowledge entry?")) return;
    const supabase = createClient();
    await supabase.from("ai_knowledge").delete().eq("id", id);
    loadEntries();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">AI Knowledge Base</h1>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
          + Add Entry
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500">No knowledge entries yet.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{entry.topic}</h3>
                  {entry.category && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {entry.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                {entry.content}
              </p>
              {entry.source_url && (
                <a
                  href={entry.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                >
                  Source
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
