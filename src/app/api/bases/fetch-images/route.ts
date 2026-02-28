import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function findPlacePhoto(
  name: string,
  city: string,
  state: string
): Promise<string | null> {
  if (!PLACES_API_KEY) return null;

  // Step 1: Find the place
  const query = `${name}, ${city}, ${state}`;
  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,photos&key=${PLACES_API_KEY}`;

  const findRes = await fetch(findUrl);
  const findData = await findRes.json();

  const candidate = findData.candidates?.[0];
  if (!candidate?.photos?.[0]?.photo_reference) return null;

  const photoRef = candidate.photos[0].photo_reference;

  // Step 2: Build a photo URL (this redirects to the actual image)
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${PLACES_API_KEY}`;
}

export async function POST(req: NextRequest) {
  if (!PLACES_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { baseId, slug } = body as { baseId?: string; slug?: string };

  const supabase = createAdminClient();

  // If a specific base ID or slug is provided, fetch just that one
  // Otherwise, fetch all bases missing images
  let query = supabase
    .from("bases")
    .select("id, name, city, state, image_url");

  if (baseId) {
    query = query.eq("id", baseId);
  } else if (slug) {
    query = query.eq("slug", slug);
  } else {
    query = query.is("image_url", null);
  }

  const { data: bases, error } = await query.order("name").limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!bases || bases.length === 0) {
    return NextResponse.json({ success: true, updated: 0, message: "No bases need images" });
  }

  let updated = 0;
  const failures: string[] = [];

  for (const base of bases) {
    try {
      const photoUrl = await findPlacePhoto(base.name, base.city, base.state);
      if (photoUrl) {
        await supabase
          .from("bases")
          .update({ image_url: photoUrl })
          .eq("id", base.id);
        updated++;
      } else {
        failures.push(base.name);
      }
    } catch {
      failures.push(base.name);
    }
  }

  return NextResponse.json({
    success: true,
    updated,
    total: bases.length,
    failures,
  });
}
