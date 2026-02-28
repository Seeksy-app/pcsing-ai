import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PCS Blog — Tips, Guides & Resources | PCSing.ai",
  description:
    "Expert advice and tips for military PCS moves, housing, entitlements, and military family life.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, author, tags, published_at, og_image")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">PCS Blog</h1>
      <p className="text-gray-600 mb-10">
        Tips, guides, and resources for your next military move.
      </p>

      {posts && posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border-b pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-700 transition">
                  {post.title}
                </h2>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                {post.author && <span>By {post.author}</span>}
                {post.published_at && (
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              {post.excerpt && (
                <p className="text-gray-700 mt-3">{post.excerpt}</p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
