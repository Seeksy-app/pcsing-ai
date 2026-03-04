import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "PCS Timeline 2026 - Month-by-Month Guide",
  description:
    "Month-by-month PCS timeline from orders to settling in. Know exactly what to do and when during your military move.",
};

const faqs = [
  {
    question: "How far in advance do you get PCS orders?",
    answer:
      "Most service members receive PCS orders 120 to 180 days before their report date, though it varies by branch and assignment type. OCONUS orders tend to arrive earlier, while CONUS-to-CONUS moves may come with as little as 60 to 90 days notice.",
  },
  {
    question: "What is the first thing to do when you get PCS orders?",
    answer:
      "Contact your Transportation Management Office (TMO) or Personal Property Office to schedule your household goods shipment as soon as possible. Pickup slots fill up fast, especially during peak PCS season from May through August.",
  },
  {
    question: "How long does a typical PCS move take from start to finish?",
    answer:
      "A CONUS PCS move typically takes 8 to 12 weeks from receiving orders to settling into your new duty station. OCONUS moves can take 4 to 6 months when you factor in passports, command sponsorship, and overseas screenings.",
  },
  {
    question: "What happens if my PCS orders are delayed or cancelled?",
    answer:
      "If orders are amended or cancelled, contact TMO immediately to adjust your HHG shipment. Any expenses already incurred may still be reimbursable. Your finance office can advise on entitlements for partial or cancelled moves.",
  },
];

export default function PcsTimelinePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            PCS Move Timeline — What to Do Each Month
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A month-by-month breakdown so you never miss a deadline during your
            military permanent change of station.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6 Months Out — Laying the Groundwork
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you know your next assignment early, use this time wisely. Start
            researching your new duty station, including{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base information
            </Link>{" "}
            and local housing markets. Request a sponsor through your gaining
            unit so you have a point of contact who can answer questions about
            the area. If you are heading OCONUS, begin passport and visa
            applications now because processing times can stretch to 8 weeks or
            longer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3 Months Out — Orders in Hand
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Once orders are official, schedule your move with TMO or through
            MilMove. This is the single most time-sensitive task because summer
            moving slots fill up quickly. Decide whether you want a full
            government HHG shipment, a{" "}
            <Link href="/entitlements" className="text-blue-600 hover:underline">
              PPM (DITY) move
            </Link>
            , or a combination of both. Use the{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH calculator
            </Link>{" "}
            to compare housing costs at your new location and start deciding
            whether to rent or buy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2 Months Out — Medical, Schools, and Housing
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Schedule medical and dental out-processing appointments for your
            entire family. Request copies of health records and fill any
            prescriptions you will need during the transition. If you have
            school-age children, research schools at your new duty station and
            gather enrollment documents. Begin contacting on-base housing
            offices or searching for off-base rentals. If you plan to buy, get
            pre-approved for a mortgage now.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1 Month Out — Locking in Details
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Confirm your HHG pickup date with TMO. Begin your unit
            out-processing checklist and clear each office methodically. Notify
            your landlord, schedule a move-out inspection, and arrange for
            utility disconnects timed to your departure. Update your address
            with USPS, banks, insurance providers, and the DMV. Book temporary
            lodging at your old or new location if needed — you are authorized
            up to 14 days of{" "}
            <Link href="/entitlements" className="text-blue-600 hover:underline">
              TLE
            </Link>{" "}
            for CONUS moves.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2 Weeks Out — Final Preparations
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Pack your essentials bag with documents, medications, chargers, and
            a few changes of clothes. Plan to live out of this bag for up to a
            week. Take photos and video of all high-value items for your
            inventory. Finish cleaning quarters and complete your final housing
            walk-through. Review the{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              PCS checklist
            </Link>{" "}
            to make sure nothing has been missed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Moving Week — Pack-Out and Travel
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Be present during the entire pack-out to supervise movers and verify
            the inventory sheet. Mark any pre-existing damage on the inventory
            form before signing. Once the truck departs, do a final sweep of
            your home, turn in keys, and begin travel. Keep all receipts for
            fuel, lodging, and tolls — you will need them for your travel
            voucher.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Arrival — In-Processing and Settling In
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Report to your new unit and begin in-processing. File your travel
            voucher within five business days to get reimbursed for MALT, per
            diem, DLA, and TLE. Update DEERS, register vehicles, enroll
            children in school, and establish care at the new MTF. When your
            HHG arrive, inspect every item at delivery and note any damage on
            the form. You have 75 days from delivery to file a claim through
            the Defense Personal Property System.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
            Ready to Start Planning Your PCS?
          </h2>
          <p className="mb-6 text-blue-100">
            Use our free tools to stay on track and maximize your entitlements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/bah-calculator"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              BAH Calculator
            </Link>
            <Link
              href="/checklist"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              PCS Checklist
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
