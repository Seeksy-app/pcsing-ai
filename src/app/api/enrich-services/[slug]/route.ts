import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Maps Base Services Directory categories to Google Places text search queries.
 * Each entry produces a search like "[query] near [base name] [city] [state]".
 */
const SERVICE_SEARCHES: Record<string, string[]> = {
  "in-processing": ["military in-processing center", "welcome center military"],
  housing: ["military housing office", "base housing"],
  efmp: ["exceptional family member program military"],
  commissary: ["commissary", "DeCA commissary"],
  exchange: ["military exchange PX BX NEX", "AAFES exchange"],
  medical: ["military hospital", "military medical center", "military clinic"],
  dental: ["military dental clinic"],
  childcare: [
    "military child development center",
    "military childcare CDC",
  ],
  legal: ["military legal assistance JAG"],
  finance: ["military finance office"],
  chapel: ["military chapel", "base chapel"],
  mwr: ["MWR fitness center military", "military gym recreation"],
  transportation: [
    "military transportation office TMO",
    "personal property office PPO",
  ],
  veterinary: ["military veterinary clinic"],
  "id-card": ["military ID card DEERS RAPIDS"],
};

type PlaceResult = {
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[] };
  place_id?: string;
};

async function textSearchPlaces(
  query: string,
  lat: number,
  lng: number,
  apiKey: string
): Promise<PlaceResult[]> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/textsearch/json"
  );
  url.searchParams.set("query", query);
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", "32000"); // ~20 miles
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).slice(0, 3); // top 3 per query
}

async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceResult | null> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "name,formatted_address,formatted_phone_number,website,opening_hours"
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  return data.result || null;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!PLACES_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY not configured" },
      { status: 500 }
    );
  }

  const supabase = createAdminClient();

  const { data: base, error: baseErr } = await supabase
    .from("bases")
    .select("id, name, city, state, lat, lng")
    .eq("slug", slug)
    .single();

  if (baseErr || !base) {
    return NextResponse.json(
      { error: `Base not found: ${slug}` },
      { status: 404 }
    );
  }

  if (!base.lat || !base.lng) {
    return NextResponse.json(
      { error: "Base has no lat/lng coordinates" },
      { status: 400 }
    );
  }

  const rows: {
    base_id: string;
    category: string;
    name: string;
    description: string | null;
    phone: string | null;
    address: string | null;
    website: string | null;
    hours: string | null;
    sort_order: number;
  }[] = [];

  let sortOrder = 0;

  for (const [category, queries] of Object.entries(SERVICE_SEARCHES)) {
    const seenPlaceIds = new Set<string>();

    for (const query of queries) {
      const fullQuery = `${query} near ${base.name} ${base.city} ${base.state}`;
      try {
        const results = await textSearchPlaces(
          fullQuery,
          base.lat,
          base.lng,
          PLACES_API_KEY
        );

        for (const place of results) {
          const placeId = (place as { place_id?: string }).place_id;
          if (!placeId || seenPlaceIds.has(placeId)) continue;
          seenPlaceIds.add(placeId);

          // Get detailed info (phone, hours, website)
          const details = await getPlaceDetails(placeId, PLACES_API_KEY);
          if (!details) continue;

          rows.push({
            base_id: base.id,
            category,
            name: details.name || place.name,
            description: null,
            phone: details.formatted_phone_number || null,
            address: details.formatted_address || null,
            website: details.website || null,
            hours: details.opening_hours?.weekday_text?.join("; ") || null,
            sort_order: sortOrder++,
          });
        }
      } catch (err) {
        console.error(`Places search failed for ${category}/${query}:`, err);
      }
    }
  }

  if (rows.length === 0) {
    return NextResponse.json({
      success: true,
      count: 0,
      message: "No services found via Google Places",
    });
  }

  // Delete existing resources for this base, then insert new
  const { error: deleteErr } = await supabase
    .from("base_resources")
    .delete()
    .eq("base_id", base.id);

  if (deleteErr) {
    return NextResponse.json(
      { error: `Failed to clear old resources: ${deleteErr.message}` },
      { status: 500 }
    );
  }

  const { error: insertErr } = await supabase
    .from("base_resources")
    .insert(rows);

  if (insertErr) {
    return NextResponse.json(
      { error: `Failed to insert resources: ${insertErr.message}` },
      { status: 500 }
    );
  }

  const categories = [...new Set(rows.map((r) => r.category))];

  return NextResponse.json({
    success: true,
    count: rows.length,
    categories,
    base: base.name,
  });
}
