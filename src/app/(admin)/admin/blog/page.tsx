"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: string | null;
  published_at: string | null;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, status, author, published_at")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    loadPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog CMS</h1>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
          + New Post
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Author</th>
                <th className="text-left px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.author || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
