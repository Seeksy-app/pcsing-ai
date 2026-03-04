import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Military Spouse Employment During PCS",
  description:
    "PCS guide for military spouses: career resources, license portability, remote work, SECO, and MyCAA education benefits.",
};

const faqs = [
  {
    question: "What is the MyCAA scholarship and who qualifies?",
    answer:
      "My Career Advancement Account (MyCAA) provides up to $4,000 in financial assistance for military spouses pursuing licenses, certifications, or associate degrees in portable career fields. Spouses of active-duty service members in pay grades E-1 through E-5, W-1 through W-2, and O-1 through O-2 are eligible.",
  },
  {
    question: "Do I need a new professional license when we PCS to a new state?",
    answer:
      "It depends on your profession and the state. Many states have enacted military spouse licensure portability laws allowing temporary practice or expedited licensing. Check your state licensing board and use SECO resources to determine if your license transfers or requires a new application.",
  },
  {
    question:
      "What is SECO and how can it help military spouses find employment?",
    answer:
      "The Spouse Education and Career Opportunities (SECO) program, run by the Department of Defense, provides free career counseling, education guidance, and employment readiness tools for military spouses. Services include resume workshops, career coaching, and connections to military-friendly employers.",
  },
  {
    question:
      "Do military spouses get hiring preference for federal government jobs?",
    answer:
      "Yes. Executive Order 13473 grants noncompetitive appointment eligibility to military spouses, allowing federal agencies to hire them without going through the full competitive process. This applies to spouses of active-duty members who PCS, spouses of 100% disabled service members, and un-remarried widows/widowers of service members killed on duty.",
  },
];

export default function SpouseEmploymentPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Military Spouse Employment During PCS
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Career resources, license portability, and education benefits to
            help military spouses build lasting careers through frequent moves.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Career Challenge of Frequent Moves
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Military spouses face a unique career challenge: relocating every
            two to three years often means restarting employment at a new
            location, losing seniority, and navigating different state licensing
            requirements. The unemployment rate for military spouses remains
            significantly higher than the national average, and
            underemployment — working below your skill level — is even more
            common.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The good news is that a growing number of programs, policies, and
            career strategies exist to help military spouses maintain career
            momentum through a PCS. Understanding your options before you move
            is the best way to minimize disruption. Start planning early using
            our{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              PCS checklist
            </Link>{" "}
            to stay on track.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            SECO: Free Career Support
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The Department of Defense Spouse Education and Career Opportunities
            (SECO) program offers free one-on-one career counseling, education
            advising, and employment readiness resources. SECO career coaches
            can help you build a resume, identify portable career fields,
            explore education paths, and connect with military-friendly
            employers. You can reach SECO through Military OneSource at no cost
            regardless of your service branch. SECO also manages the MySECO
            online portal, which includes job boards, webinars, and networking
            events designed specifically for military spouses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Professional License Portability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you work in a licensed profession — teaching, nursing, real
            estate, cosmetology, social work, or others — state-to-state
            license transfers have historically been a major obstacle. Recent
            legislation has improved this. Many states now offer temporary
            practice permits, expedited applications, or license-by-endorsement
            for military spouses. The Interstate Licensure Compacts for nursing
            and teaching also streamline multi-state practice. Before your PCS,
            contact the licensing board at your new state to understand their
            requirements and timelines. Budget for any application fees in your{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              PCS entitlements
            </Link>{" "}
            planning.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            MyCAA Education Benefits
          </h2>
          <p className="text-gray-700 leading-relaxed">
            My Career Advancement Account (MyCAA) provides up to $4,000 in
            tuition assistance for military spouses pursuing portable
            certifications, licenses, or associate degrees. Eligible spouses
            include those married to active-duty service members in pay grades
            E-1 through E-5, W-1 through W-2, and O-1 through O-2. MyCAA funds
            can be used at accredited colleges and technical schools and cover
            tuition, fees, and credentialing exams. This benefit is especially
            valuable for entering high-demand portable fields like IT, medical
            coding, project management, or bookkeeping.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Remote Work and Federal Hiring Preference
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Remote work has become a game-changer for military spouses. Careers
            in software development, writing, virtual assistance, marketing,
            accounting, and customer service can follow you from duty station to
            duty station. When evaluating job opportunities before a PCS,
            prioritize positions that are fully remote or that have offices at
            multiple military-adjacent locations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Military spouses also receive noncompetitive hiring authority for
            federal jobs under Executive Order 13473. This allows federal
            agencies to hire you without the full competitive posting process,
            significantly shortening the federal hiring timeline. Explore bases
            with strong on-installation and nearby employment options through
            our{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              military base directory
            </Link>.
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
            Plan Your Next PCS with Confidence
          </h2>
          <p className="text-gray-600 mb-6">
            Use our tools to estimate BAH at your new location and stay
            organized through every step of your move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/bah-calculator"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              BAH Calculator
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
