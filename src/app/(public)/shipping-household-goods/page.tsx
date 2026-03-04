import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "HHG Shipping Guide - Military Household Goods",
  description:
    "Complete guide to shipping household goods during PCS. Weight limits, scheduling TMO, claims, and what not to ship.",
  keywords:
    "household goods shipping, HHG military, TMO PCS, military moving weight limits, PCS household goods, military shipping claims",
};

const faqs = [
  {
    question: "What is the HHG weight allowance for my rank?",
    answer:
      "Weight allowances range from 5,000 pounds for E-1 without dependents up to 18,000 pounds for O-10 and senior enlisted with dependents. The allowance includes all household goods shipped by the government. Going over your weight limit means you pay the excess cost out of pocket, so declutter before pack-out.",
  },
  {
    question: "How far in advance should I schedule my HHG shipment?",
    answer:
      "Schedule with TMO or through MilMove as soon as you receive orders, ideally 8 or more weeks before your move date. During peak PCS season from May through August, pickup slots can fill 6 to 10 weeks out. The earlier you book, the more flexibility you have with dates.",
  },
  {
    question: "What happens if my household goods are damaged during the move?",
    answer:
      "Inspect every item at delivery and note all damage on the delivery inventory form. You have 75 days from the delivery date to file a claim through the Defense Personal Property System (DPS). Include photos and receipts or estimated replacement values. Claims are typically resolved within 30 to 60 days.",
  },
  {
    question: "Can I do a partial DITY move and partial HHG shipment?",
    answer:
      "Yes. A split shipment lets you send some items via government HHG and move the rest yourself in a PPM (DITY) move. This is common when you want immediate access to essentials while the bulk of your goods are in transit. You will be reimbursed for the PPM portion based on the government cost estimate for that weight.",
  },
];

export default function ShippingHouseholdGoodsPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            HHG Shipping Guide for Military PCS
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about shipping your household goods —
            from weight limits to filing damage claims.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            HHG Weight Allowances by Rank
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your household goods weight allowance depends on your pay grade and
            dependency status. Junior enlisted members (E-1 through E-4) without
            dependents are authorized 5,000 to 7,000 pounds, while the same
            ranks with dependents receive 8,000 pounds. Mid-grade NCOs and
            junior officers typically fall in the 11,000 to 13,000 pound range
            with dependents. Senior enlisted and field-grade officers are
            authorized 14,500 to 17,500 pounds, and general and flag officers
            top out at 18,000 pounds. These limits apply to your total
            government-shipped weight, including professional books and
            equipment. Exceeding your allowance means you pay the overage at
            the per-pound shipping rate — which can add up quickly. Review your{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              full PCS entitlements
            </Link>{" "}
            to understand what is covered.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Scheduling With TMO
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your Transportation Management Office (TMO) or Personal Property
            Office is the starting point for your HHG shipment. Visit them in
            person or use the MilMove platform (which is replacing DPS for many
            branches) to book your move as soon as orders are in hand. You will
            select a pickup date, a delivery window, and a destination address.
            During summer peak season, the best pickup dates disappear fast, so
            booking 8 to 10 weeks out is ideal. TMO will assign a moving company
            — you do not get to choose the carrier, but you can request specific
            dates. If your schedule changes, contact TMO immediately to adjust.
            Refer to the{" "}
            <Link
              href="/checklist"
              className="text-blue-600 hover:underline"
            >
              PCS checklist
            </Link>{" "}
            for the full sequence of TMO tasks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pack-Out Day Tips
          </h2>
          <p className="text-gray-700 leading-relaxed">
            On pack-out day, the moving crew will pack and load your entire home
            — usually over one to two days. Before they arrive, separate
            anything you do not want shipped: important documents, medications,
            valuables, and your essentials bags. Label rooms and items clearly.
            Be present for the entire process and watch what goes into each box.
            Take photos and video of high-value items before they are packed.
            When the crew completes the inventory sheet, review every line item
            before signing. Note the condition of each item accurately —
            writing &ldquo;PBO&rdquo; (packed by owner) next to items you packed
            yourself can affect claims later.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Cannot Be Shipped
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Movers will not transport hazardous materials, including ammunition,
            firearms (check branch-specific policies), propane tanks, gasoline,
            paints, pesticides, and perishable food. Opened bottles of alcohol
            and plants are also prohibited on most HHG shipments. Firearms may
            be shipped with proper documentation depending on your branch and
            destination, but many service members prefer to transport them
            personally. For OCONUS shipments, additional restrictions may apply
            based on host nation customs regulations. If you plan a{" "}
            <Link
              href="/dity-ppm-move"
              className="text-blue-600 hover:underline"
            >
              PPM (DITY) move
            </Link>{" "}
            for a portion of your belongings, you can transport some of these
            restricted items yourself.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Filing Claims for Damaged or Missing Items
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Despite best efforts, damage happens during military moves. When
            your goods are delivered, inspect every item and note any damage or
            missing articles on the delivery inventory form. Do not sign off
            until you have checked everything. You have 75 days from the
            delivery date to file a claim through the Defense Personal Property
            System. Include clear photos of the damage, the original inventory
            form showing the item&apos;s pre-move condition, and receipts or
            fair market value estimates for each item. Claims for loss or
            damage during government-arranged moves are covered by the Military
            Claims Act up to the item&apos;s depreciated value. For tips on the
            full move process, read the{" "}
            <Link
              href="/pcs-guide"
              className="text-blue-600 hover:underline"
            >
              PCS guide
            </Link>
            .
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
            Get Ready for Your HHG Shipment
          </h2>
          <p className="mb-6 text-blue-100">
            Calculate your BAH and track every moving task with our free tools.
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
