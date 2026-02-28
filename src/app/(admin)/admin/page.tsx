import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: basesCount },
    { count: postsCount },
    { count: campaignsCount },
    { count: knowledgeCount },
  ] = await Promise.all([
    supabase.from("bases").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("ad_campaigns").select("*", { count: "exact", head: true }),
    supabase.from("ai_knowledge").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Bases", value: basesCount ?? 0, href: "/admin/bases" },
    { label: "Blog Posts", value: postsCount ?? 0, href: "/admin/blog" },
    { label: "Ad Campaigns", value: campaignsCount ?? 0, href: "/admin/ads" },
    {
      label: "AI Knowledge Entries",
      value: knowledgeCount ?? 0,
      href: "/admin/ai",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg p-6 border hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/admin/bases"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            Add Base
          </a>
          <a
            href="/admin/blog"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            New Post
          </a>
          <a
            href="/admin/ai"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            Add Knowledge
          </a>
        </div>
      </div>
    </div>
  );
}
