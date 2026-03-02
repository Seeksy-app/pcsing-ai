"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type Props = {
  baseSlug: string;
  baseName: string;
};

export function SaveBaseButton({ baseSlug, baseName }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  const checkSaved = useCallback(async () => {
    if (authLoading) return;

    if (user) {
      const { data } = await supabase
        .from("saved_bases")
        .select("id")
        .eq("user_id", user.id)
        .eq("base_slug", baseSlug)
        .maybeSingle();
      setSaved(!!data);
    } else {
      const storedEmail = localStorage.getItem("pcsing_user_email");
      if (storedEmail) {
        setEmailInput(storedEmail);
        const { data } = await supabase
          .from("saved_bases")
          .select("id")
          .eq("email", storedEmail)
          .eq("base_slug", baseSlug)
          .is("user_id", null)
          .maybeSingle();
        setSaved(!!data);
      }
    }
  }, [authLoading, user, baseSlug, supabase]);

  useEffect(() => {
    checkSaved();
  }, [checkSaved]);

  async function handleSave() {
    if (saving) return;

    if (user) {
      setSaving(true);
      if (saved) {
        await supabase
          .from("saved_bases")
          .delete()
          .eq("user_id", user.id)
          .eq("base_slug", baseSlug);
        setSaved(false);
      } else {
        await supabase.from("saved_bases").insert({
          user_id: user.id,
          email: user.email!,
          base_slug: baseSlug,
          base_name: baseName,
        });
        setSaved(true);
      }
      setSaving(false);
    } else {
      const storedEmail = localStorage.getItem("pcsing_user_email");
      if (storedEmail) {
        await saveWithEmail(storedEmail);
      } else {
        setShowEmailModal(true);
      }
    }
  }

  async function saveWithEmail(email: string) {
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("saved_bases")
      .insert({
        user_id: null,
        email,
        base_slug: baseSlug,
        base_name: baseName,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        setSaved(true);
      } else {
        setError("Could not save base. Please try again.");
        setSaving(false);
        return;
      }
    } else {
      setSaved(true);
    }

    localStorage.setItem("pcsing_user_email", email);
    setShowEmailModal(false);
    setSaving(false);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    await saveWithEmail(email);
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border ${
          saved
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700"
        } disabled:opacity-50`}
      >
        {saved ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
        {saving ? "Saving..." : saved ? "Base Saved" : "Save Base"}
      </button>

      {/* Email modal overlay */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Save this base</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email to save bases and track your PCS.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#1B2A4A] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#243558] transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Base"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
