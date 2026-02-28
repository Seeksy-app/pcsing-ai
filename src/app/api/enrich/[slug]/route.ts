import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseResources } from "@/lib/enrichment/parse-resources";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();

  // 1. Look up the base
  const { data: base, error: baseErr } = await supabase
    .from("bases")
    .select("id, name, militaryonesource_slug")
    .eq("slug", slug)
    .single();

  if (baseErr || !base) {
    return NextResponse.json(
      { error: `Base not found: ${slug}` },
      { status: 404 }
    );
  }

  if (!base.militaryonesource_slug) {
    return NextResponse.json(
      { error: "Base has no militaryonesource_slug set" },
      { status: 400 }
    );
  }

  // 2. Scrape MilitaryOneSource installation page
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FIRECRAWL_API_KEY not configured" },
      { status: 500 }
    );
  }

  const firecrawl = new FirecrawlApp({ apiKey });
  const url = `https://installations.militaryonesource.mil/in-depth-overview/${base.militaryonesource_slug}`;

  let markdown: string;
  try {
    const result = await firecrawl.scrape(url, { formats: ["markdown"] });
    if (!result.markdown) {
      return NextResponse.json(
        { error: "Firecrawl scrape returned no content" },
        { status: 502 }
      );
    }
    markdown = result.markdown;
  } catch (err) {
    return NextResponse.json(
      { error: `Firecrawl error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    );
  }

  // 3. Parse markdown into structured resources
  const resources = parseResources(markdown);

  if (resources.length === 0) {
    return NextResponse.json(
      { success: true, count: 0, categories: [], message: "No resources parsed from page" }
    );
  }

  // 4. Delete existing resources for this base, then insert new ones
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

  const rows = resources.map((r, i) => ({
    base_id: base.id,
    category: r.category,
    name: r.name,
    description: r.description || null,
    phone: r.phone || null,
    address: r.address || null,
    website: r.website || null,
    hours: r.hours || null,
    sort_order: i,
  }));

  const { error: insertErr } = await supabase
    .from("base_resources")
    .insert(rows);

  if (insertErr) {
    return NextResponse.json(
      { error: `Failed to insert resources: ${insertErr.message}` },
      { status: 500 }
    );
  }

  const categories = [...new Set(resources.map((r) => r.category))];

  return NextResponse.json({
    success: true,
    count: resources.length,
    categories,
    base: base.name,
  });
}
