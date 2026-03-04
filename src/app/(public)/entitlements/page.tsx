import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const entitlementsFaqs = [
  { question: "What is DLA and how much will I receive?", answer: "DLA (Dislocation Allowance) is a one-time payment to cover miscellaneous PCS expenses like deposits and connection fees. In 2026, DLA rates range from approximately $2,100 for junior enlisted to $3,500+ for senior officers, based on dependency status." },
  { question: "How is BAH calculated for a PCS move?", answer: "BAH is based on your pay grade, dependency status, and the zip code of your new duty station. Your BAH rate changes to the new location rate on the day you report. Use the PCSing.us BAH calculator to look up your specific rate." },
  { question: "Can I get advance pay for a PCS?", answer: "Yes, you can request up to 3 months of base pay in advance to cover PCS-related expenses. The advance must be repaid within 12 months through payroll deduction." },
  { question: "What is MALT and how is it calculated?", answer: "MALT (Mileage Allowance) reimburses you for driving your privately owned vehicle to your new duty station. The rate is calculated using the official Defense Table of Official Distances (DTOD) between your old and new stations." },
];

export const metadata: Metadata = {
  title: "PCS Entitlements & Benefits — PCSing.us",
  description:
    "Understand your PCS entitlements: BAH, DLA, MALT, TLE, per diem, and more. Know what you're authorized before your move.",
  keywords:
    "PCS entitlements, DLA, MALT, TLE, per diem military, PCS benefits, military move allowances, dislocation allowance",
};

const entitlements = [
  {
    name: "BAH — Basic Allowance for Housing",
    description:
      "Monthly allowance to help offset housing costs when government quarters are not available. Rates vary by location, pay grade, and dependency status.",
    link: "https://www.defensetravel.dod.mil/site/bahCalc.cfm",
  },
  {
    name: "DLA — Dislocation Allowance",
    description:
      "A one-time payment to help cover miscellaneous moving expenses like utility deposits, connection fees, and other costs associated with relocating your household.",
  },
  {
    name: "MALT — Mileage Allowance",
    description:
      "Reimbursement for driving your POV (privately owned vehicle) to your new duty station. Calculated based on official distance between old and new duty stations.",
  },
  {
    name: "TLE — Temporary Lodging Expense",
    description:
      "Covers temporary lodging costs (up to 14 days total) when you vacate old quarters and before moving into new quarters. CONUS moves only.",
  },
  {
    name: "TLA — Temporary Lodging Allowance",
    description:
      "Similar to TLE but for OCONUS moves. Covers temporary lodging costs while waiting for permanent housing overseas.",
  },
  {
    name: "Per Diem",
    description:
      "Daily allowance for meals and incidental expenses during PCS travel. Rates are set by the GSA for CONUS and the DoS for OCONUS locations.",
  },
  {
    name: "HHG — Household Goods Shipment",
    description:
      "The government will arrange and pay for shipping your household goods to your new duty station. Weight allowances vary by pay grade.",
  },
  {
    name: "PPM/DITY Move",
    description:
      "Personally Procured Move — you move your own belongings and get reimbursed based on the government's estimated cost. Can be combined with a partial HHG shipment.",
  },
  {
    name: "POV Shipment",
    description:
      "For OCONUS moves, the government will ship one POV at no cost. Additional vehicles may be shipped at your expense.",
  },
  {
    name: "Advance Pay",
    description:
      "You can request up to 3 months of base pay in advance to cover PCS-related expenses. Must be repaid within 12 months.",
  },
];

export default function EntitlementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <FaqJsonLd questions={entitlementsFaqs} />
      <h1 className="text-4xl font-bold mb-4">PCS Entitlements & Benefits</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Know what you&apos;re authorized before your move. Here are the key PCS
        entitlements and benefits available to service members.
      </p>

      <div className="space-y-6">
        {entitlements.map((item) => (
          <div
            key={item.name}
            className="bg-white border rounded-lg p-6 hover:shadow-sm transition"
          >
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                Learn more &rarr;
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Need specific calculations?</h3>
        <p className="text-gray-700 text-sm">
          Entitlement amounts vary by rank, location, and family size. Use our
          AI assistant to get personalized estimates for your PCS move.
        </p>
      </div>
    </div>
  );
}
