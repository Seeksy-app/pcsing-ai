"use client";

import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type BaseActivity = {
  base_slug: string;
  base_name: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [bases, setBases] = useState<BaseActivity[]>([]);
  const [loadingBases, setLoadingBases] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("user_base_activity")
      .select("base_slug, base_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBases(data || []);
        setLoadingBases(false);
      });
  }, [user]);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg("Password updated!");
      setNewPassword("");
      setShowPasswordForm(false);
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Welcome back, {user?.email}
      </p>

      {/* Saved Bases */}
      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Saved Bases
        </h2>
        {loadingBases ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : bases.length > 0 ? (
          <div className="space-y-3">
            {bases.map((b) => (
              <Link
                key={b.base_slug + b.created_at}
                href={`/bases/${b.base_slug}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {b.base_name || b.base_slug}
                  </p>
                  <p className="text-xs text-gray-400">
                    Explored{" "}
                    {new Date(b.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-2">No saved bases yet.</p>
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              Explore bases on the homepage
            </Link>
          </div>
        )}
      </section>

      {/* Account */}
      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{profile?.role || "member"}</p>
            </div>
          </div>

          {passwordMsg && (
            <div
              className={`text-sm px-4 py-2 rounded-lg ${
                passwordMsg.includes("updated")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {passwordMsg}
            </div>
          )}

          {showPasswordForm ? (
            <form onSubmit={handlePasswordChange} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="At least 6 characters"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#243558] transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Change password
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
