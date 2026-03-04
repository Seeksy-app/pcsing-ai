import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Military Housing Guide - On vs Off Base",
  description:
    "Compare on-base and off-base military housing. BAH rates, privatized housing, renting, and buying near your base.",
};

const faqs = [
  {
    question: "Is it better to live on base or off base?",
    answer:
      "It depends on your priorities. On-base housing offers convenience, security, and predictable costs since BAH covers your rent. Off-base housing provides more choices, the ability to pocket unused BAH, and typically more space. Families with school-age children may prefer off-base housing in a strong school district, while those who value short commutes and community may prefer on-base living.",
  },
  {
    question: "How does privatized military housing work?",
    answer:
      "Privatized housing is managed by private companies under long-term contracts with the military. Your BAH is collected as rent, and the housing company is responsible for maintenance and repairs. Quality and responsiveness vary by provider and installation. Research reviews from current residents and inspect units before signing a lease.",
  },
  {
    question: "Can I use my VA loan to buy a house at every PCS?",
    answer:
      "Yes, the VA loan benefit can be used multiple times. You can even have more than one VA loan simultaneously under certain conditions. However, buying at every PCS may not make financial sense depending on your tour length, local market conditions, and your ability to rent or sell the property when you leave.",
  },
  {
    question: "What happens to my BAH if I move into on-base housing?",
    answer:
      "When you move into government or privatized on-base housing, your BAH is collected directly as rent. You will not receive BAH as cash while living on base. If you move off base later, your BAH payments resume based on your current duty station rate, rank, and dependency status.",
  },
];

export default function MilitaryHousingPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            On-Base vs Off-Base Housing Guide
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Understand your military housing options — from privatized on-base
            communities to renting and buying off base — and how BAH shapes
            your decision.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            On-Base Housing: Pros and Cons
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            On-base housing puts you steps from work, the commissary, fitness
            center, and other installation amenities. There are no separate
            utility bills to manage since BAH covers everything. For families
            with young children, the controlled environment and proximity to
            on-base childcare can be a significant advantage.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The downsides are worth considering. On-base homes, especially
            privatized units, vary widely in quality. You may face waitlists at
            popular installations, and house sizes are assigned by rank and
            family size with little flexibility. Maintenance responsiveness
            depends on the privatized housing company. You also forfeit your
            entire BAH regardless of the home&apos;s actual market value, meaning
            you cannot pocket any savings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Renting Off Base
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Renting off base gives you the widest selection of neighborhoods,
            school districts, and home styles. Because{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH is a flat-rate allowance
            </Link>
            , finding a rental below your rate lets you keep the difference
            tax-free. Many military families choose to rent in areas with
            top-rated schools or shorter commutes to spouse employment
            opportunities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When renting, look for military-friendly landlords who understand
            the Servicemembers Civil Relief Act (SCRA). The SCRA allows you to
            terminate a lease early without penalty when you receive PCS orders.
            Always confirm this right is acknowledged in your lease. Browse our{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base directory
            </Link>{" "}
            for neighborhood insights near your installation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Buying a Home with a VA Loan
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The VA home loan is one of the most valuable benefits available to
            service members. It requires no down payment, has no private
            mortgage insurance (PMI), and offers competitive interest rates.
            Buying can make financial sense if you expect to be stationed at a
            location for three or more years, the local market is stable or
            appreciating, and you are comfortable managing a rental property
            after you PCS.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The risks are real, though. Short tours, declining markets, or
            unexpected orders can leave you underwater or managing a rental from
            across the country. Run the numbers carefully — compare your
            monthly mortgage payment (including taxes, insurance, and HOA fees)
            against your{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH rate
            </Link>{" "}
            to see if buying makes sense at your next duty station.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Privatized Housing Explained
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most on-base housing in the United States is now managed by private
            companies under the Military Housing Privatization Initiative
            (MHPI). Companies like Lendlease, Balfour Beatty, and Corvias
            operate communities on installations across the country. Your BAH is
            paid directly to the housing company as rent, and they handle
            maintenance, landscaping, and community management.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Quality varies significantly by installation and provider. Before
            choosing privatized housing, talk to current residents, check online
            reviews, and inspect the specific unit you are offered. The Tenant
            Bill of Rights, enacted in 2020, gives military families protections
            including the right to a move-in inspection, timely maintenance, and
            a dispute resolution process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How BAH Affects Your Housing Decision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              Basic Allowance for Housing
            </Link>{" "}
            is the starting point for every housing decision. Look up your rate
            at your new duty station before you start house hunting. In
            high-cost areas, BAH may not cover median rents, requiring you to
            supplement from base pay. In lower-cost markets, you may find
            quality housing well below your BAH rate and pocket the difference.
            Either way, knowing your number gives you a realistic budget. Factor
            in utilities, renter&apos;s insurance, commute costs, and school quality
            to make a fully informed choice. Visit the{" "}
            <Link
              href="/best-neighborhoods/fort-liberty"
              className="text-blue-600 hover:underline"
            >
              best neighborhoods near Fort Liberty
            </Link>{" "}
            for an example of how to research housing around a specific base.
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
            Find Your Housing Allowance
          </h2>
          <p className="mb-6 text-blue-100">
            Look up your 2026 BAH rate and start planning your next move with
            our free tools.
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
