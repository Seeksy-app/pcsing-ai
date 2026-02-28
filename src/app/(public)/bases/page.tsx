import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BaseDirectoryFilters } from "@/components/BaseDirectoryFilters";
import { BaseGrid } from "@/components/BaseGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Military Base Directory",
  description:
    "Browse every military installation in the US. Find housing, schools, medical, and local resources for your next PCS.",
};

const BRANCHES = [
  "All",
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Coast Guard",
  "Space Force",
];

export default async function BasesPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; state?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("bases")
    .select("id, name, slug, branch, city, state, state_full, image_url")
    .order("name");

  if (params.branch && params.branch !== "All") {
    query = query.eq("branch", params.branch);
  }
  if (params.state) {
    query = query.eq("state", params.state);
  }
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  const { data: bases } = await query;

  // Get unique states for the filter
  const { data: statesData } = await supabase
    .from("bases")
    .select("state")
    .order("state");
  const states = [...new Set((statesData || []).map((s) => s.state))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Military Base Directory</h1>
      <p className="text-gray-600 mb-8">
        Find detailed information on every military installation in the United
        States.
      </p>

      {/* Search & Filters */}
      <BaseDirectoryFilters
        branches={BRANCHES}
        states={states}
        currentBranch={params.branch || "All"}
        currentState={params.state || ""}
        currentQuery={params.q || ""}
      />

      {/* Base Grid */}
      {bases && bases.length > 0 ? (
        <BaseGrid bases={bases} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No bases found matching your filters.</p>
          <a href="/bases" className="text-blue-600 hover:underline mt-2 inline-block">
            Clear filters
          </a>
        </div>
      )}
    </div>
  );
}
