import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PCS Blog — Tips, Guides & Resources | PCSing.ai",
  description:
    "Expert advice and tips for military PCS moves, housing, entitlements, and military family life.",
};

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-green-500 to-emerald-600",
  "from-purple-500 to-violet-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-cyan-600",
  "from-teal-500 to-green-600",
  "from-yellow-500 to-amber-600",
  "from-indigo-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-red-500 to-rose-600",
];

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, author, tags, published_at, og_image")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            PCS Blog
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Expert tips, guides, and resources to make your next military move smoother.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {posts && posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Gradient header as image placeholder */}
                <div
                  className={`h-36 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-end p-5`}
                >
                  <span className="text-white/80 text-sm font-medium">
                    {post.tags?.[0]?.replace(/-/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-400 mb-2">
                    {post.published_at &&
                      new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    {post.author && <span> · {post.author}</span>}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
