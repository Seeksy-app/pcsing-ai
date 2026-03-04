import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BAHCalculator } from "@/components/BAHCalculator";
import { BASES } from "@/data/bah-rates-2026";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const bahFaqs = [
  { question: "How often do BAH rates change?", answer: "BAH rates are updated annually, effective January 1st each year. The Department of Defense surveys housing costs in each military housing area to determine rates." },
  { question: "Does BAH cover my full rent?", answer: "BAH is designed to cover the median housing cost in your area for your pay grade. In high-cost areas like San Diego or Washington DC, BAH may not fully cover rent. In lower-cost areas, you may pocket the difference." },
  { question: "Do I lose BAH if I live on base?", answer: "Yes, if you live in on-base privatized housing, your BAH is typically paid directly to the housing management company. You do not receive BAH as cash when living on base." },
];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BAH Calculator 2026 | Basic Allowance for Housing | PCSing.us",
  description:
    "Look up 2026 BAH rates by duty station, pay grade, and dependency status. Free military BAH calculator with side-by-side base comparison.",
  keywords:
    "bah calculator, basic allowance for housing, military bah rates 2026, bah lookup, military housing allowance",
};

export default async function BAHCalculatorPage() {
  const supabase = await createClient();
  const { data: dbBases } = await supabase
    .from("bases")
    .select("name, slug, city, state")
    .order("name");

  // Merge Supabase bases with BAH-data bases so every base with rates shows up
  const slugSet = new Set((dbBases || []).map((b) => b.slug));
  const fromDb = (dbBases || [])
    .filter((b) => BASES[b.slug]) // only include bases that have BAH data
    .map((b) => ({
      label: `${b.name} — ${b.city}, ${b.state}`,
      value: b.slug,
    }));

  // Add BAH-only bases not in DB
  const fromData = Object.entries(BASES)
    .filter(([slug]) => !slugSet.has(slug))
    .map(([slug, entry]) => ({
      label: entry.name,
      value: slug,
    }));

  const allBases = [...fromDb, ...fromData].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <>
      <FaqJsonLd questions={bahFaqs} />
      <BAHCalculator bases={allBases} />
    </>
  );
}
