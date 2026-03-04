import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "PCS Checklist 2026 - 60-Day Moving Timeline",
  description:
    "Free printable PCS checklist with every task from orders to arrival. Organized by timeline for military families.",
};

const faqs = [
  {
    question: "When should I start my PCS checklist?",
    answer:
      "Begin your PCS checklist immediately after receiving orders. Ideally, you should start taking action within the first week. Key tasks like scheduling your TMO appointment, contacting your gaining unit, and researching housing should happen in the first 10 days.",
  },
  {
    question: "What is the most important thing to do first after receiving PCS orders?",
    answer:
      "Your first step should be to review your orders carefully, confirm your report-not-later-than date, and schedule a Transportation Management Office (TMO) counseling appointment. TMO will walk you through your move options and help you book your household goods shipment.",
  },
  {
    question: "How do I transfer my kids' school records during a PCS?",
    answer:
      "Contact your children's current school at least 30 days before your move to request official transcripts, immunization records, and any IEP or special education documents. The Interstate Compact on Educational Opportunity for Military Children ensures receiving schools will enroll your children promptly, even if paperwork is still in transit.",
  },
  {
    question: "What documents should I keep in my PCS binder?",
    answer:
      "Your PCS binder should contain copies of your orders, travel vouchers, weight tickets (for PPM moves), lodging and meal receipts, vehicle registration, medical and dental records, school transcripts, birth certificates, marriage certificate, passports, and any housing lease or termination paperwork.",
  },
];

export default function PcsChecklistPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            PCS Move Checklist — 60-Day Timeline
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A step-by-step timeline covering every task from the day you receive
            orders through your first week at your new duty station.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            60+ Days Out — Orders in Hand
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The first days after receiving PCS orders set the tone for your
            entire move. Read your orders thoroughly and note the
            report-not-later-than date, your authorized weight allowance, and
            any special instructions. Schedule your TMO counseling appointment
            the same week — during peak PCS season (May through August), slots
            fill quickly.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Contact your gaining unit&apos;s sponsorship coordinator to request a
            sponsor at your new installation. Research{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH rates
            </Link>{" "}
            for your new duty station and start browsing housing options. If you
            have children, begin researching schools near your{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              new base
            </Link>
            . Notify your landlord or begin the on-base housing checkout
            process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            30 Days Out — Locking In Details
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By the 30-day mark, your household goods pickup should be scheduled
            and your housing situation at the new station should be taking
            shape. Confirm your pack and pickup dates with your moving company
            or finalize plans for a{" "}
            <Link href="/guide" className="text-blue-600 hover:underline">
              Personally Procured Move
            </Link>
            . Transfer or obtain medical and dental records for every family
            member — military treatment facilities need time to process record
            requests.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Notify your auto insurance, bank, and other financial institutions
            of your address change. Submit a USPS mail forwarding request.
            Arrange for pet travel if needed, especially for OCONUS moves that
            require veterinary health certificates and quarantine documentation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2 Weeks Out — Final Preparations
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Two weeks before your move, begin sorting and decluttering. Anything
            you no longer need reduces your weight and simplifies unpacking.
            Photograph valuable items and electronics (including serial numbers)
            for your inventory. Separate items you will hand-carry — important
            documents, medications, electronics, and irreplaceable personal
            items should travel with you, not on the moving truck.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Confirm utility disconnection dates, schedule your final housing
            inspection, and arrange cleaning if required. Prepare a suitcase for
            each family member with enough clothing for at least a week in case
            of household goods delivery delays.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Moving Week — Pack and Go
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            On pack-out day, be present and supervise the movers. Walk through
            every room and verify items against the inventory sheet before
            signing. Note any pre-existing damage on the inventory form — this
            protects you if you need to file a claim later. Once the truck
            departs, do a final walkthrough, return keys, and complete
            installation checkout.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Keep all travel receipts for your{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              travel voucher
            </Link>
            . Lodging, fuel, tolls, and meals can all be claimed or reimbursed.
            Save receipts digitally and physically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            First Week at New Station
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Upon arrival, check in with your gaining unit and complete
            inprocessing requirements. Visit the housing office, register
            vehicles on base, enroll dependents at the medical facility, and
            register children for school. When your household goods are
            delivered, inspect every item before signing the delivery inventory.
            Report damage within 75 days through the Defense Personal Property
            System. Finally, file your travel voucher through DTS or your
            finance office within five days of arrival to receive your travel
            reimbursement promptly.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Get Your Personalized Checklist
          </h2>
          <p className="mb-6 text-blue-100">
            Use our interactive tools to plan your PCS move and estimate your
            housing allowance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/bah-calculator"
              className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              BAH Calculator
            </Link>
            <Link
              href="/checklist"
              className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              PCS Checklist
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
