import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PPMCalculator } from "@/components/PPMCalculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PPM/DITY Move Calculator 2026 | PCSing.ai",
  description:
    "Calculate your estimated PPM (DITY) move payout based on rank, weight, and distance. Free military PCS move calculator with 2026 JTR rates.",
  keywords:
    "ppm calculator, dity move calculator, military move calculator, pcs move payout, personally procured move",
};

export default async function PPMCalculatorPage() {
  const supabase = await createClient();
  const { data: bases } = await supabase
    .from("bases")
    .select("name, slug, city, state")
    .order("name");

  return (
    <PPMCalculator
      bases={
        (bases || []).map((b) => ({
          label: `${b.name} — ${b.city}, ${b.state}`,
          value: b.slug,
        }))
      }
    />
  );
}
