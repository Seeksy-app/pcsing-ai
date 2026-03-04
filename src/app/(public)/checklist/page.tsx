import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const checklistFaqs = [
  { question: "When should I start my PCS checklist?", answer: "Begin your PCS checklist as soon as you receive orders, typically 8 or more weeks before your move date. Early tasks include contacting TMO, requesting a sponsor, and researching housing at your new duty station." },
  { question: "What should I pack in my PCS go-bag?", answer: "Pack essential documents (orders, IDs, medical records), medications, a change of clothes for each family member, phone chargers, snacks, and comfort items for children. Plan to live out of your go-bags for 3-7 days." },
  { question: "What is the most important thing to do upon arrival?", answer: "File your travel voucher within 5 business days of arriving at your new duty station. This is how you get reimbursed for MALT, per diem, TLE, and DLA. Late filing can delay payment by weeks." },
];

export const metadata: Metadata = {
  title: "PCS Checklist — Interactive Moving Timeline | PCSing.us",
  description:
    "Your complete PCS checklist. Track every task from receiving orders to settling in at your new duty station.",
  keywords:
    "PCS checklist, military moving checklist, PCS task list, interactive PCS checklist, military move planner, PCS orders checklist",
};

const checklistSections = [
  {
    phase: "8+ Weeks Before",
    items: [
      "Review orders and report date",
      "Contact TMO/PPO to schedule move",
      "Request a sponsor at new duty station",
      "Research housing options (on-base & off-base)",
      "Check BAH rates for new location",
      "Begin decluttering and inventory",
      "Notify landlord if renting",
      "Research schools and childcare at new base",
    ],
  },
  {
    phase: "4-8 Weeks Before",
    items: [
      "Schedule HHG pickup date",
      "Arrange vehicle shipment (OCONUS)",
      "Get copies of medical & dental records",
      "Fill prescriptions for transition period",
      "Notify utility companies",
      "Update address with USPS, banks, insurance",
      "Schedule housing inspection (if on-base)",
      "Book temporary lodging if needed",
    ],
  },
  {
    phase: "2-4 Weeks Before",
    items: [
      "Complete out-processing checklist",
      "Get vehicle safety inspection",
      "Arrange pet travel (vet records, carriers)",
      "Pack essential go-bags for travel days",
      "Confirm HHG pickup date",
      "Clean quarters or rental",
      "Final walk-through with housing office",
    ],
  },
  {
    phase: "Moving Week",
    items: [
      "Supervise HHG pack-out",
      "Document inventory & condition of items",
      "Turn in keys and complete checkout",
      "Keep important documents accessible",
      "Begin travel to new duty station",
    ],
  },
  {
    phase: "Upon Arrival",
    items: [
      "Report to new unit / begin in-processing",
      "Update DEERS information",
      "Register vehicles with new state",
      "Enroll children in school",
      "Set up utilities at new residence",
      "Register at new MTF (medical)",
      "File travel voucher within 5 days",
      "Unpack and inventory HHG delivery",
      "File claims for any damaged items",
    ],
  },
];

export default function ChecklistPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <FaqJsonLd faqs={checklistFaqs} />
      <h1 className="text-4xl font-bold mb-4">PCS Checklist</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Your comprehensive PCS moving checklist, organized by timeline.
      </p>

      <div className="space-y-10">
        {checklistSections.map((section) => (
          <div key={section.phase}>
            <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">
              {section.phase}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <label
                  key={item}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Tip:</strong> This checklist is a general guide. Your specific
          PCS may have additional requirements based on your branch, rank, and
          destination. Always consult your TMO/PPO for the most accurate
          information.
        </p>
      </div>
    </div>
  );
}
