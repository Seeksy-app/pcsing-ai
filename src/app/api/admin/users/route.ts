import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  // Verify admin role
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "25");
  const format = url.searchParams.get("format");
  const offset = (page - 1) * limit;

  // Fetch users with their base activity
  let query = admin
    .from("user_profiles")
    .select("id, email, role, created_at", { count: "exact" });

  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  query = query.order("created_at", { ascending: false });

  if (format !== "csv") {
    query = query.range(offset, offset + limit - 1);
  }

  const { data: users, count } = await query;

  if (!users) {
    return NextResponse.json({ users: [], total: 0 });
  }

  // Fetch base activity for these users
  const userIds = users.map((u) => u.id);
  const { data: activity } = await admin
    .from("user_base_activity")
    .select("user_id, base_slug, base_name")
    .in("user_id", userIds);

  // Fetch email captures for matching emails
  const emails = users.map((u) => u.email);
  const { data: captures } = await admin
    .from("email_captures")
    .select("email, base_name, created_at")
    .in("email", emails);

  const activityMap = new Map<string, string[]>();
  for (const a of activity || []) {
    const existing = activityMap.get(a.user_id) || [];
    existing.push(a.base_name || a.base_slug);
    activityMap.set(a.user_id, existing);
  }

  const captureMap = new Map<string, string>();
  for (const c of captures || []) {
    if (!captureMap.has(c.email)) {
      captureMap.set(c.email, c.base_name || "");
    }
  }

  const enrichedUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
    bases: activityMap.get(u.id) || [],
    lead_base: captureMap.get(u.email) || "",
  }));

  if (format === "csv") {
    const header = "Email,Role,Bases,Lead Base,Signup Date\n";
    const rows = enrichedUsers
      .map(
        (u) =>
          `"${u.email}","${u.role}","${u.bases.join("; ")}","${u.lead_base}","${u.created_at}"`
      )
      .join("\n");
    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=pcsing-users.csv",
      },
    });
  }

  return NextResponse.json({
    users: enrichedUsers,
    total: count || 0,
    page,
    limit,
  });
}
