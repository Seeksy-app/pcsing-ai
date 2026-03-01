import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Create user with email pre-confirmed (no confirmation email needed)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    // Handle "user already exists" gracefully
    if (error.message?.includes("already been registered")) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
    await supabase.from("user_profiles").upsert(
      { id: data.user.id, email, role: "member" },
      { onConflict: "id" }
    );
  }

  return NextResponse.json({ success: true, userId: data.user?.id });
}
