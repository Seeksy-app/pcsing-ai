import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LOCAL_CATEGORIES: Record<string, string> = {
  grocery: "grocery_or_supermarket",
  restaurants: "restaurant",
  hospitals: "hospital",
  dentists: "dentist",
  veterinary: "veterinary_care",
  gyms: "gym",
  parks: "park",
  gas_stations: "gas_station",
  banks: "bank",
  pharmacies: "pharmacy",
};

const RADIUS_METERS = 24140; // ~15 miles

async function placesNearby(
  lat: number,
  lng: number,
  type: string,
  apiKey: string
): Promise<PlaceResult[]> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(RADIUS_METERS));
  url.searchParams.set("type", type);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Places API error: ${res.status}`);
  }
  const data = await res.json();
  // Return top 10 results
  return (data.results || []).slice(0, 10);
}

type PlaceResult = {
  name: string;
  vicinity?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  place_id?: string;
  geometry?: {
    location?: { lat: number; lng: number };
  };
};

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();

  // 1. Look up the base
  const { data: base, error: baseErr } = await supabase
    .from("bases")
    .select("id, name, lat, lng")
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
      { error: "Base has no lat/lng coordinates set" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY not configured" },
      { status: 500 }
    );
  }

  // 2. Search each category
  const allRows: {
    base_id: string;
    category: string;
    name: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    rating: number | null;
    place_id: string | null;
    lat: number | null;
    lng: number | null;
  }[] = [];

  for (const [category, placeType] of Object.entries(LOCAL_CATEGORIES)) {
    try {
      const places = await placesNearby(base.lat, base.lng, placeType, apiKey);
      for (const place of places) {
        allRows.push({
          base_id: base.id,
          category,
          name: place.name,
          address: place.vicinity || null,
          phone: place.formatted_phone_number || null,
          website: place.website || null,
          rating: place.rating || null,
          place_id: place.place_id || null,
          lat: place.geometry?.location?.lat || null,
          lng: place.geometry?.location?.lng || null,
        });
      }
    } catch (err) {
      console.error(`Places search failed for ${category}:`, err);
      // Continue with other categories
    }
  }

  if (allRows.length === 0) {
    return NextResponse.json({
      success: true,
      count: 0,
      message: "No local resources found",
    });
  }

  // 3. Delete existing local resources, then insert new
  const { error: deleteErr } = await supabase
    .from("base_local_resources")
    .delete()
    .eq("base_id", base.id);

  if (deleteErr) {
    return NextResponse.json(
      { error: `Failed to clear old local resources: ${deleteErr.message}` },
      { status: 500 }
    );
  }

  const { error: insertErr } = await supabase
    .from("base_local_resources")
    .insert(allRows);

  if (insertErr) {
    return NextResponse.json(
      { error: `Failed to insert local resources: ${insertErr.message}` },
      { status: 500 }
    );
  }

  const categories = [...new Set(allRows.map((r) => r.category))];

  return NextResponse.json({
    success: true,
    count: allRows.length,
    categories,
    base: base.name,
  });
}
