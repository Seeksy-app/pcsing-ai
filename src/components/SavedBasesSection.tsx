"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type SavedBase = {
  base_slug: string;
  base_name: string;
  saved_at: string;
};

export function SavedBasesSection() {
  const { user, loading: authLoading } = useAuth();
  const [bases, setBases] = useState<SavedBase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      const supabase = createClient();

      if (user) {
        const { data } = await supabase
          .from("saved_bases")
          .select("base_slug, base_name, saved_at")
          .eq("user_id", user.id)
          .order("saved_at", { ascending: false });
        setBases(data || []);
      } else {
        const email = localStorage.getItem("pcsing_user_email");
        if (email) {
          const { data } = await supabase
            .from("saved_bases")
            .select("base_slug, base_name, saved_at")
            .eq("email", email)
            .is("user_id", null)
            .order("saved_at", { ascending: false });
          setBases(data || []);
        }
      }
      setLoading(false);
    }

    load();
  }, [authLoading, user]);

  if (loading || bases.length === 0) return null;

  return (
    <div className="relative" style={{ position: "relative", zIndex: 2 }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" style={{ color: "#C5A55A" }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
          </svg>
          <h2 className="text-lg font-semibold" style={{ color: "#1B2A4A" }}>
            Your Saved Bases
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bases.map((b) => (
            <Link
              key={b.base_slug}
              href={`/bases/${b.base_slug}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <svg
                className="w-4 h-4 shrink-0 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
              </svg>
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition truncate">
                {b.base_name}
              </span>
              <svg
                className="w-4 h-4 ml-auto shrink-0 text-gray-300 group-hover:text-blue-500 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
