import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, og_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seo_title || `${post.title} — PCSing.ai`,
    description: post.seo_description,
    openGraph: post.og_image ? { images: [post.og_image] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <a
        href="/blog"
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; All Posts
      </a>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
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

      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        {/* Render content - in production you'd use MDX or a rich text renderer */}
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="text-gray-800 leading-relaxed"
        />
      </div>
    </article>
  );
}
