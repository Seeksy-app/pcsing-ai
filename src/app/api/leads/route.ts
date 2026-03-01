import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, baseSlug, baseName, state, interest } = body as {
    email?: string;
    baseSlug?: string;
    baseName?: string;
    state?: string;
    interest?: string;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("leads").insert({
    email,
    base_slug: baseSlug || null,
    base_name: baseName || null,
    state: state || null,
    interest: interest || null,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
