import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BaseCard } from "@/components/BaseCard";
import { HomeHero } from "@/components/HomeHero";

export const metadata: Metadata = {
  title: "PCSing.ai | The #1 Military PCS & Base Resource",
  description:
    "Plan your military PCS move with AI-powered guidance, base information, BAH rates, checklists, entitlements, and more. The ultimate resource for service members and military families.",
};

const resources = [
  {
    title: "PCS Checklist",
    description: "Interactive timeline of every task for your move",
    href: "/checklist",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Entitlements & Benefits",
    description: "BAH, DLA, MALT, TLE, per diem, and more",
    href: "/entitlements",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "PCS Guide",
    description: "Step-by-step guide from orders to settling in",
    href: "/guide",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Base Directory",
    description: "Explore every military installation in the US",
    href: "/bases",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredBases } = await supabase
    .from("bases")
    .select("id, name, slug, branch, city, state, image_url")
    .order("name")
    .limit(6);

  const { data: latestPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div>
      {/* Hero */}
      <HomeHero />

      {/* Featured Bases */}
      {featuredBases && featuredBases.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Bases
              </h2>
              <Link
                href="/bases"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBases.map((base) => (
                <BaseCard key={base.id} base={base} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PCS Resources */}
      <section className="py-16 px-6 bg-gray-50/70">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            PCS Resources
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {resources.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from the Blog */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest from the Blog
            </h2>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              All posts &rarr;
            </Link>
          </div>

          {latestPosts && latestPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <p className="text-xs text-gray-400 mb-2">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                      : "Draft"}
                  </p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "The Ultimate PCS Checklist for 2025",
                  excerpt:
                    "Everything you need to do before, during, and after your military move.",
                },
                {
                  title: "DITY Move vs. HHG: Which Is Right for You?",
                  excerpt:
                    "Weigh the pros and cons of a personally procured move versus government-arranged shipping.",
                },
                {
                  title: "Understanding Your BAH and DLA Entitlements",
                  excerpt:
                    "A breakdown of housing allowance and dislocation allowance for every pay grade.",
                },
              ].map((placeholder) => (
                <div
                  key={placeholder.title}
                  className="bg-white border border-gray-100 rounded-xl p-6 opacity-60"
                >
                  <p className="text-xs text-gray-400 mb-2">Coming soon</p>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {placeholder.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {placeholder.excerpt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
