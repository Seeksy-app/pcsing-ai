import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BaseFinderMap } from "@/components/BaseFinderMap";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PCSing.ai | The #1 Military PCS & Base Resource",
  description:
    "Plan your military PCS move with AI-powered guidance, base information, BAH rates, checklists, entitlements, and more. The ultimate resource for service members and military families.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: allBasesForFinder } = await supabase
    .from("bases")
    .select("name, slug, state, state_full, branch, city, phone, address, website")
    .order("name");

  return (
    <BaseFinderMap
      bases={
        (allBasesForFinder || []) as {
          name: string;
          slug: string;
          state: string;
          state_full: string;
          branch: string;
          city?: string;
          phone?: string;
          address?: string;
          website?: string;
        }[]
      }
    />
  );
}
