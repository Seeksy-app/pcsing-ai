import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "PCS Move Guide 2026 for Military Families",
  description:
    "Step-by-step guide to military PCS moves in 2026. Orders, entitlements, timelines, housing, and tips for every branch.",
  keywords:
    "PCS move, military relocation, PCS guide 2026, permanent change of station, military move tips, PCS orders, military family move",
};

const faqs = [
  {
    question: "What does PCS stand for?",
    answer:
      "PCS stands for Permanent Change of Station. It is the official relocation of a military service member and their dependents from one duty station to another, as directed by orders from their branch of service.",
  },
  {
    question: "How long does a typical PCS move take?",
    answer:
      "Most PCS moves take between 30 and 60 days from receiving orders to reporting at the new duty station. OCONUS moves and those involving household goods shipments may take longer, sometimes up to 90 days or more.",
  },
  {
    question: "Who pays for a PCS move?",
    answer:
      "The Department of Defense covers most PCS costs, including household goods shipping, travel pay (per diem and mileage), and temporary lodging allowances. Service members may also receive a Dislocation Allowance (DLA) to offset out-of-pocket expenses.",
  },
  {
    question: "Can I choose my PCS move date?",
    answer:
      "Your report-not-later-than date is set by your orders, but you typically have some flexibility in scheduling your actual move date with Transportation Management Office (TMO). Planning early gives you more options, especially during peak PCS season (May through August).",
  },
  {
    question: "What is the difference between a DITY move and a government move?",
    answer:
      "A DITY move, now called a Personally Procured Move (PPM), is when the service member moves their own belongings and receives reimbursement based on the estimated government cost. A government move uses a contracted moving company arranged through TMO to pack, ship, and deliver household goods.",
  },
];

export default function PcsGuidePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The Complete PCS Move Guide for Military Families
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about Permanent Change of Station moves
            in 2026 — from receiving orders to settling into your new home.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What Is a PCS Move?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Permanent Change of Station is the official relocation of a
            service member from one duty station to another. Unlike a TDY
            (temporary duty), a PCS involves moving your entire household and is
            typically accompanied by a full set of entitlements designed to cover
            the cost of relocating your family, vehicles, pets, and personal
            property.
          </p>
          <p className="text-gray-700 leading-relaxed">
            PCS orders can send you to a new installation within the continental
            United States (CONUS), overseas (OCONUS), or to a remote or
            unaccompanied tour. Each type carries different entitlements,
            timelines, and logistical requirements. Understanding the basics
            before you begin is the single best thing you can do to reduce
            stress.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            PCS Timeline Overview
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most service members receive PCS orders anywhere from 30 to 180 days
            before their report date. The moment you have orders in hand, the
            clock starts. A typical CONUS-to-CONUS timeline looks like this: use
            the first week to review your orders, contact your gaining unit, and
            visit the{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              Transportation Management Office
            </Link>{" "}
            to schedule your move. During weeks two through four, arrange
            housing, enroll children in schools, and handle medical and dental
            record transfers. The final weeks are for cleaning, final
            inspections, and travel.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For{" "}
            <Link
              href="/overseas-pcs"
              className="text-blue-600 hover:underline"
            >
              OCONUS moves
            </Link>
            , add time for passport and visa processing, vehicle shipping or
            storage, and any required overseas screening. Starting early is not
            optional — it is essential.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Entitlements You Should Know
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The military provides a comprehensive set of{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              PCS entitlements
            </Link>{" "}
            to offset the cost of your move. These include travel pay calculated
            by mileage and per diem, Dislocation Allowance (DLA), Temporary
            Lodging Expense (TLE) for up to 14 days of hotel stays, and the
            shipment of household goods up to your rank-based weight allowance.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              Basic Allowance for Housing (BAH)
            </Link>{" "}
            will adjust to your new duty station rate on the day you report.
            Knowing your new BAH rate ahead of time helps you budget for housing
            and make informed decisions about living on or off base.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Types of PCS Moves
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            There are three primary ways to execute a PCS move. A government
            move (GBL/HHG) uses a military-contracted carrier to pack and ship
            your household goods at no cost to you. A Personally Procured Move
            (PPM), formerly called DITY, lets you move yourself and receive
            reimbursement based on the government&apos;s estimated cost — often
            resulting in a profit if you move efficiently. A partial PPM
            combines both, letting the government move most of your goods while
            you transport some items yourself.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Each option has trade-offs. Government moves are hands-off but less
            flexible. PPMs offer financial incentives but require more effort.
            Review the{" "}
            <Link
              href="/bases"
              className="text-blue-600 hover:underline"
            >
              base directory
            </Link>{" "}
            for TMO contact information at your gaining installation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Tips for a Smooth PCS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start a PCS binder or digital folder the day you receive orders.
            Keep copies of orders, travel vouchers, weight tickets, and receipts
            in one place. Schedule your TMO counseling appointment immediately —
            summer slots fill fast. Inventory your household goods before movers
            arrive and photograph high-value items. Notify your landlord,
            utility companies, and children&apos;s schools as early as possible. Use
            the{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              PCS checklist
            </Link>{" "}
            to stay organized and avoid last-minute surprises. Finally, connect
            with your gaining installation&apos;s sponsorship program — a good
            sponsor can answer questions no website can.
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
            Ready to Start Planning Your PCS?
          </h2>
          <p className="mb-6 text-blue-100">
            Use our free tools to estimate your BAH and build a custom moving
            checklist.
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
