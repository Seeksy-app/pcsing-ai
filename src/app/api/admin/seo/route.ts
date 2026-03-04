import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("seo_pages")
    .select("*")
    .order("route");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { route, meta_title, meta_description, og_title, og_description } = body;

  if (!route) {
    return NextResponse.json({ error: "route is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("seo_pages")
    .upsert(
      {
        route,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        og_title: og_title || null,
        og_description: og_description || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "route" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
