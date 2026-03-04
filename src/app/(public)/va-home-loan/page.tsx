import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "VA Home Loan Guide for Military PCS Moves",
  description:
    "Use your VA home loan benefit during a PCS. Zero down payment, no PMI, and how to buy a home at your new duty station.",
  keywords:
    "VA home loan, VA loan PCS, military home buying, VA mortgage, zero down payment military, VA loan eligibility, buy home during PCS",
};

const faqs = [
  {
    question: "Can I use a VA loan to buy a home during a PCS?",
    answer:
      "Yes. Many service members use their VA loan benefit to purchase a home at their new duty station. You can begin the pre-approval process as soon as you receive orders, and some lenders will work with you remotely before you arrive at your new location.",
  },
  {
    question: "Can I have two VA loans at the same time?",
    answer:
      "Yes, it is possible to have more than one VA loan simultaneously. If you have remaining entitlement after your first loan, you can use your second-tier entitlement to purchase another property. This is common for service members who keep a home at a previous duty station and buy at the new one.",
  },
  {
    question: "Is there a VA loan limit?",
    answer:
      "For borrowers with full entitlement, there is no VA loan limit as of 2020. You can borrow as much as a lender will approve with no down payment. If you have reduced entitlement from an existing VA loan, county loan limits may apply to the portion not covered by your remaining entitlement.",
  },
  {
    question: "Should I rent or buy at my new duty station?",
    answer:
      "It depends on how long you expect to be stationed there, local market conditions, and your financial situation. A general rule of thumb is that buying makes more sense for assignments of 3 or more years, but you should compare your BAH to local mortgage payments and factor in closing costs and potential resale value.",
  },
];

export default function VaHomeLoanPage() {
  return (
    <>
      <FaqJsonLd questions={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            VA Home Loan Guide for PCS Moves
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your VA loan benefit is one of the most powerful financial tools
            available during a PCS. Learn how to use it effectively.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            VA Loan Basics for Service Members
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The VA home loan program, backed by the Department of Veterans
            Affairs, allows eligible service members, veterans, and surviving
            spouses to purchase a home with significant advantages over
            conventional mortgages. The program does not originate loans directly
            — instead, it guarantees a portion of the loan to private lenders,
            which reduces their risk and translates to better terms for you. If
            you are PCSing to a new duty station and considering
            homeownership, this benefit can save you tens of thousands of
            dollars over the life of the loan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Eligibility Requirements
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Active-duty service members are eligible after 90 continuous days of
            service during wartime or 181 days during peacetime. National Guard
            and Reserve members qualify after 6 years of service or 90 days of
            active-duty deployment. To use the benefit, you need a Certificate
            of Eligibility (COE), which you can obtain through your lender, the
            VA eBenefits portal, or by submitting VA Form 26-1880. Most lenders
            can pull your COE electronically in minutes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Zero Down Payment and No PMI
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The two biggest advantages of a VA loan are zero down payment and no
            private mortgage insurance (PMI). Conventional loans typically
            require 5 to 20 percent down, and borrowers who put less than 20
            percent down must pay PMI — often $100 to $300 per month. With a VA
            loan, you can finance 100 percent of the purchase price and skip PMI
            entirely. There is a one-time VA funding fee (typically 2.15 percent
            for first use), but it can be rolled into the loan amount, and
            disabled veterans are exempt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Buying a Home During a PCS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Timing is tight during a PCS, so start early. Get pre-approved as
            soon as you receive orders so you know your budget. Use the{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH calculator
            </Link>{" "}
            to see what your housing allowance will be at your new duty station,
            and aim for a mortgage payment at or below that amount. Research
            neighborhoods near the{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base
            </Link>{" "}
            using your gaining unit sponsor as a resource. Many military buyers
            work with a real estate agent remotely, view homes via video tours,
            and close shortly after arriving. Make sure your contract includes
            a military clause that allows you to exit the purchase if orders are
            cancelled or amended.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            VA Loan vs. Renting at Your New Station
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The rent-versus-buy decision depends on your expected tour length,
            local real estate market, and personal finances. For short tours of
            one to two years, renting usually makes more sense because closing
            costs and transaction fees eat into any equity you might build.
            For tours of three years or longer, buying with a VA loan often
            comes out ahead — you build equity, lock in a fixed payment, and can
            rent the property out or sell when you PCS again. Review{" "}
            <Link
              href="/military-housing"
              className="text-blue-600 hover:underline"
            >
              military housing options
            </Link>{" "}
            to compare on-base and off-base alternatives.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Using Multiple VA Loans
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A common misconception is that you can only use the VA loan once.
            In reality, your VA entitlement can be reused. If you sell a
            previous home and pay off the VA loan, your full entitlement is
            restored. Even if you keep the first home and its VA loan, you can
            use your remaining (second-tier) entitlement to buy another
            property. This strategy is popular with service members who convert
            each duty station home into a rental and build a portfolio over
            multiple PCS cycles. Read the full{" "}
            <Link
              href="/pcs-guide"
              className="text-blue-600 hover:underline"
            >
              PCS guide
            </Link>{" "}
            for more financial planning tips.
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
            Plan Your Next Home Purchase
          </h2>
          <p className="mb-6 text-blue-100">
            See your BAH at the new station and track every PCS task.
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
