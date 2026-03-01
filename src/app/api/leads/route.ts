import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";
import crypto from "crypto";

function generateTempPassword(): string {
  return crypto.randomBytes(9).toString("base64url").slice(0, 12);
}

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

  // 1. Save email capture (always)
  const { error } = await supabase.from("email_captures").insert({
    email,
    base_slug: baseSlug || null,
    base_name: baseName || null,
    state: state || null,
    interest: interest || null,
    source_page: "homepage",
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }

  // 2. Auto-create auth account (skip if already exists)
  try {
    const tempPassword = generateTempPassword();

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      });

    if (authData?.user && !authError) {
      // 3. Upsert user_profiles
      await supabase.from("user_profiles").upsert(
        { id: authData.user.id, email, role: "member" },
        { onConflict: "id" }
      );

      // 4. Track base activity
      if (baseSlug) {
        await supabase.from("user_base_activity").insert({
          user_id: authData.user.id,
          base_slug: baseSlug,
          base_name: baseName || null,
        });
      }

      // 5. Send welcome email
      try {
        await sendWelcomeEmail(email, tempPassword, baseName || undefined);
      } catch {
        // Email send failure shouldn't block the response
      }
    }
    // If authError (e.g. user already exists), we just skip — lead is still captured
  } catch {
    // Auth creation failure shouldn't block the lead capture response
  }

  return NextResponse.json({ success: true });
}
