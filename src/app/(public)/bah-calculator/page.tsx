import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "BAH Calculator 2026 - Housing Allowance Rates",
  description:
    "Calculate your 2026 Basic Allowance for Housing by base, rank, and dependency status. Free BAH rate lookup tool.",
  keywords:
    "BAH calculator, basic allowance for housing, military housing allowance, BAH rates 2026, military BAH, housing allowance by rank",
};

const faqs = [
  {
    question: "How is BAH calculated?",
    answer:
      "BAH rates are determined annually by the Department of Defense based on median rental costs, average utilities, and renter's insurance in each Military Housing Area (MHA). Rates vary by duty station ZIP code, pay grade, and whether the service member has dependents.",
  },
  {
    question: "Did BAH rates go up in 2026?",
    answer:
      "BAH rates are adjusted each year to reflect changes in local housing costs. The 2026 rates were published in December 2025 and took effect on January 1, 2026. Most locations saw increases to keep pace with rising rents, though some areas experienced decreases. Use our BAH calculator for the most current rates at your duty station.",
  },
  {
    question: "Do I lose BAH if I live on base?",
    answer:
      "If you move into government or privatized on-base housing, your BAH is typically collected directly by the housing office to cover your rent. You will not receive BAH as cash, but you also will not pay out-of-pocket for housing. Off-base residents receive BAH as part of their paycheck and use it toward rent or a mortgage.",
  },
  {
    question: "Can I pocket extra BAH if my rent is below my rate?",
    answer:
      "Yes. BAH is a flat-rate allowance, not a reimbursement. If you find housing that costs less than your BAH rate, you keep the difference tax-free. Conversely, if your rent exceeds your BAH, you are responsible for the difference out of pocket.",
  },
];

export default function BahCalculatorPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            BAH Calculator 2026 — Find Your Housing Allowance
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Look up your Basic Allowance for Housing rate by duty station, rank,
            and dependency status. Updated for 2026.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How Basic Allowance for Housing Works
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Basic Allowance for Housing (BAH) is a tax-free monthly payment
            designed to help service members cover the cost of housing when
            government quarters are not provided. The allowance is calculated
            based on three factors: your duty station location, your pay grade
            (rank), and whether you have dependents.
          </p>
          <p className="text-gray-700 leading-relaxed">
            BAH is not meant to cover 100 percent of housing costs in every
            market. The DoD targets the median rental cost in each Military
            Housing Area, plus average utility expenses and renter&apos;s insurance.
            That means roughly half of available rentals in your area should fall
            at or below your BAH rate. Use our{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline font-semibold"
            >
              free BAH calculator
            </Link>{" "}
            to look up your exact rate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2026 BAH Rate Changes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Each year, the DoD conducts a housing cost survey to adjust BAH
            rates. The 2026 rates, effective January 1, reflect updated rental
            market data from hundreds of Military Housing Areas across the
            country. In many locations, service members will see rate increases
            driven by continued growth in national rental prices.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If your BAH rate decreases because of a rate adjustment while you
            remain at the same duty station, you are protected by rate
            protection — your individual BAH will not drop below the rate you
            were receiving as long as you maintain the same dependency status and
            stay at the same location. This protection does not apply when you
            PCS to a new station.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            With Dependents vs. Without Dependents
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            BAH rates are published in two tiers: with dependents and without
            dependents. The &quot;with dependents&quot; rate is higher and applies to
            service members who have a spouse, children, or other qualifying
            dependents. Single service members without dependents living off
            base receive the lower rate. Dual-military couples each receive the
            &quot;without dependents&quot; rate unless they have children, in which case
            one member claims the &quot;with dependents&quot; rate.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Understanding the difference is critical for{" "}
            <Link
              href="/military-housing"
              className="text-blue-600 hover:underline"
            >
              housing decisions
            </Link>
            . The gap between the two rates can be several hundred dollars per
            month, significantly affecting what you can afford.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Maximizing Your BAH
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Because BAH is a flat allowance and not a reimbursement, smart
            housing choices can leave money in your pocket each month. Start by
            researching neighborhoods just outside the highest-cost areas near
            your{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              installation
            </Link>
            . A 15-minute longer commute can mean hundreds of dollars in monthly
            savings. Consider renting below your BAH rate and banking the
            difference, or use the surplus to pay down debt.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Before you PCS, look up BAH rates at your gaining duty station using
            our{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline font-semibold"
            >
              BAH calculator
            </Link>{" "}
            and compare them against local rent listings. Review your{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              full entitlements
            </Link>{" "}
            to understand how BAH fits into your total compensation.
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
            Look Up Your 2026 BAH Rate
          </h2>
          <p className="mb-6 text-blue-100">
            Enter your rank, duty station, and dependency status to see your
            exact monthly housing allowance.
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
