import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "DITY Move Guide 2026 - PPM Payout Tips",
  description:
    "Learn how PPM (DITY) moves work, calculate your payout, and maximize reimbursement. Complete guide with 2026 rates.",
  keywords:
    "DITY move, PPM move, personally procured move, military DITY payout, PPM reimbursement, do it yourself military move, PPM calculator",
};

const faqs = [
  {
    question: "What is the difference between a DITY move and a PPM?",
    answer:
      "DITY (Do-It-Yourself) is the older term for what the military now officially calls a PPM (Personally Procured Move). They are the same program. You move your household goods yourself and receive a payout based on what the government would have paid a contractor.",
  },
  {
    question: "How much money can I make on a PPM move?",
    answer:
      "Your PPM incentive is 100% of the Government Constructed Cost (GCC), which is what the government would have paid a moving company. The actual amount depends on the weight of your shipment and the distance of your move. Many service members net $2,000 to $8,000 after expenses on a full PPM.",
  },
  {
    question: "Do I have to pay taxes on my PPM payout?",
    answer:
      "Yes. The portion of your PPM payout that exceeds your documented moving expenses is considered taxable income. You will receive a W-2 or 1099 for the incentive amount. Keep all receipts for truck rental, fuel, tolls, packing materials, and lodging to reduce your taxable portion.",
  },
  {
    question: "Can I do a partial PPM and still use government movers?",
    answer:
      "Yes. A partial PPM is very common. The government ships the bulk of your household goods through a Transportation Service Provider (TSP), and you move a portion yourself — such as a trailer load of belongings — and receive a prorated PPM payout for the weight you moved.",
  },
  {
    question: "What weight tickets do I need for a PPM?",
    answer:
      "You need certified weight tickets showing your vehicle or rental truck both empty (before loading) and full (after loading). Weigh at a certified public scale such as a CAT scale or a moving company scale. Without proper weight tickets, your claim will be delayed or denied.",
  },
];

export default function DityPpmMovePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            DITY / PPM Move Guide — Save Money on PCS
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about Personally Procured Moves, from
            payout calculations to weight tickets and tax tips.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What Is a PPM (DITY) Move?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Personally Procured Move, still widely known by its former name
            DITY (Do-It-Yourself), is a PCS move option where you transport some
            or all of your household goods instead of using a government-hired
            moving company. In exchange, the military pays you an incentive
            equal to 100% of the Government Constructed Cost (GCC) for the
            weight you move. This program is managed through your local
            Transportation Office and is available to all branches of service.
          </p>
          <p className="text-gray-700 leading-relaxed">
            PPM moves are popular because they give you control over your
            belongings and the opportunity to pocket the difference between the
            government payout and your actual moving costs. To learn more about
            all your moving options, visit our{" "}
            <Link href="/entitlements" className="text-blue-600 hover:underline">
              PCS entitlements guide
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How Your PPM Payout Is Calculated
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your payout is based on the weight you actually move, multiplied by
            the rate the government would have paid a Transportation Service
            Provider (TSP) to ship that weight over the same distance. Finance
            determines the GCC using standardized rate tables that account for
            origin, destination, and shipment weight. You receive 100% of the
            GCC as your incentive payment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Use our{" "}
            <Link
              href="/tools/ppm-calculator"
              className="text-blue-600 hover:underline"
            >
              PPM calculator
            </Link>{" "}
            to estimate your payout before you commit to a move type. The
            calculator factors in distance and weight to give you a realistic
            estimate of your incentive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Full PPM vs. Partial PPM
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A full PPM means you move all of your household goods yourself. This
            maximizes your payout but requires renting a large truck or trailer,
            and you bear all the responsibility for packing, loading, and
            driving. A partial PPM lets you split the shipment: the government
            moves the majority of your belongings through a TSP, and you
            personally move a smaller portion — often a carload or small trailer
            — and receive a prorated payout based on that weight.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Most service members choose a partial PPM to balance convenience and
            extra income. Even moving a few hundred pounds yourself can yield
            several hundred dollars. Read our{" "}
            <Link
              href="/shipping-household-goods"
              className="text-blue-600 hover:underline"
            >
              shipping household goods guide
            </Link>{" "}
            for details on the government-managed side of a split shipment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Step-by-Step PPM Process
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            First, get your PCS orders and visit your local Transportation
            Office to counseling and authorize your PPM in the Defense Personal
            Property System (DPS). Next, arrange your own transportation — rent
            a truck, hire labor, or load up your personal vehicle and trailer.
            Before loading, get a certified empty weight ticket from a public
            scale. After loading, weigh again for your full weight ticket.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Once you arrive at your new duty station, submit your weight
            tickets, receipts for expenses (fuel, tolls, truck rental, packing
            materials), and your completed PPM claim through DPS. Finance will
            calculate the GCC and issue your payout, typically within 30 days.
            For a complete moving timeline, see our{" "}
            <Link href="/guide" className="text-blue-600 hover:underline">
              PCS guide
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Tax Implications of a PPM
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your PPM incentive payment is taxable income, but you can reduce
            your tax burden by deducting allowable moving expenses. Keep every
            receipt: truck rental, fuel, tolls, packing supplies, insurance,
            hiring help, and lodging during the move. The taxable amount is the
            incentive minus your documented expenses. Finance will withhold
            federal taxes upfront, and you will receive a W-2 reflecting the
            incentive. Consider consulting a military tax advisor or using free
            tax assistance at your installation to ensure you claim all
            allowable deductions.
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Plan Your PPM?
          </h2>
          <p className="text-gray-600 mb-6">
            Estimate your payout and build your PCS plan with our free tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/ppm-calculator"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              PPM Calculator
            </Link>
            <Link
              href="/checklist"
              className="inline-block bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              PCS Checklist
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
