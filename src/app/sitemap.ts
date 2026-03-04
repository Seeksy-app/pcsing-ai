import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL = "https://pcsing.us";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [{ data: bases }, { data: posts }] = await Promise.all([
    supabase.from("bases").select("slug, updated_at").order("name"),
    supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...[
      "/pcs-guide",
      "/bah-calculator",
      "/pcs-checklist",
      "/military-housing",
      "/pcs-timeline",
      "/overseas-pcs",
      "/va-home-loan",
      "/pet-relocation",
      "/shipping-household-goods",
      "/dity-ppm-move",
      "/spouse-employment",
      "/tricare-during-pcs",
      "/schools-near-base",
      "/entitlements",
      "/guide",
      "/checklist",
      "/bases",
      "/blog",
    ].map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const basePages: MetadataRoute.Sitemap = (bases ?? []).map((base) => ({
    url: `${BASE_URL}/bases/${base.slug}`,
    lastModified: base.updated_at ? new Date(base.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...basePages, ...blogPages];
}
