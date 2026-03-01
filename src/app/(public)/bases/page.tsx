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

/** Comprehensive state/territory/country code → full name lookup */
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", GU: "Guam",
  // Overseas
  JP: "Japan", KR: "South Korea", ES: "Spain",
};

const OVERSEAS_CODES = new Set(["JP", "KR", "ES"]);

function getStateName(code: string): string {
  return STATE_NAMES[code] || code;
}

export default async function BasesPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; state?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("bases")
    .select("id, name, slug, branch, city, state, state_full, phone, address, population, website")
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

  // Resolve full state names for all bases
  const resolvedBases = (bases || []).map((b) => ({
    ...b,
    state_full: getStateName(b.state),
  }));

  // Get unique states for the filter
  const { data: statesData } = await supabase
    .from("bases")
    .select("state")
    .order("state");

  const uniqueCodes = new Set<string>();
  (statesData || []).forEach((s: { state: string }) => uniqueCodes.add(s.state));

  const usStates: { state: string; state_full: string }[] = [];
  const overseasStates: { state: string; state_full: string }[] = [];

  Array.from(uniqueCodes)
    .sort((a, b) => getStateName(a).localeCompare(getStateName(b)))
    .forEach((code) => {
      const entry = { state: code, state_full: getStateName(code) };
      if (OVERSEAS_CODES.has(code)) {
        overseasStates.push(entry);
      } else {
        usStates.push(entry);
      }
    });

  // Get all bases for the base dropdown
  const { data: allBasesData } = await supabase
    .from("bases")
    .select("name, slug, state")
    .order("name");
  const allBases = allBasesData || [];

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
        usStates={usStates}
        overseasStates={overseasStates}
        allBases={allBases}
        currentBranch={params.branch || "All"}
        currentState={params.state || ""}
        currentQuery={params.q || ""}
      />

      {/* Base Grid */}
      {resolvedBases.length > 0 ? (
        <BaseGrid bases={resolvedBases} />
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
