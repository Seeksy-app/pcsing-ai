"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type BaseResult = {
  name: string;
  slug: string;
  branch: string;
  city: string;
  state: string;
};

export function BaseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BaseResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("bases")
        .select("name, slug, branch, city, state")
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(8);
      setResults(data || []);
      setOpen(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/bases/${slug}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].slug);
    } else if (query.trim()) {
      router.push(`/bases?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={wrapperRef} className="max-w-xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="flex bg-white rounded-xl overflow-hidden shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a base (e.g. Fort Liberty, NAS Jacksonville)..."
            className="flex-1 px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 hover:bg-blue-800 transition font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
          {results.map((base) => (
            <button
              key={base.slug}
              onClick={() => handleSelect(base.slug)}
              className="w-full text-left px-5 py-3 hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-gray-900">{base.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {base.city}, {base.state}
                </span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {base.branch}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
