import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Best Schools Near Military Bases 2026",
  description:
    "Find top-rated schools near military installations. DoDEA, public, and private school options for PCS families.",
  keywords:
    "schools near military bases, DoDEA schools, military child education, best schools near base, military family schools, PCS school transfer",
};

const faqs = [
  {
    question: "What are DoDEA schools?",
    answer:
      "DoDEA (Department of Defense Education Activity) schools are fully accredited schools operated by the federal government on military installations worldwide. They serve the children of active-duty military, DoD civilians, and eligible contractors. DoDEA operates over 160 schools in the Americas, Europe, and the Pacific.",
  },
  {
    question: "How do I find the best school district near my new base?",
    answer:
      "Start by contacting the School Liaison Officer (SLO) at your gaining installation. SLOs maintain current data on local school ratings, district boundaries, and enrollment procedures. You can also research public school ratings on GreatSchools.org and Niche.com using the ZIP codes around your base.",
  },
  {
    question: "Will my child's credits transfer to a new school during a PCS?",
    answer:
      "Yes. All 50 states and the District of Columbia have adopted the Interstate Compact on Educational Opportunity for Military Children, which ensures that course credits, grade placement, and graduation requirements transfer smoothly. Schools are required to accept unofficial transcripts for initial enrollment and placement.",
  },
  {
    question: "Can my child stay enrolled in their current school virtually after a PCS?",
    answer:
      "It depends on the school and state policies. Some states allow military-connected students to continue enrollment virtually through the end of the school year. Check with your child's current school and the SLO at your new base to explore this option, especially for high school students close to graduation.",
  },
];

export default function SchoolsNearBasePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Best Schools Near Military Bases
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything military families need to know about finding quality
            schools during a PCS — from DoDEA options to top-rated public and
            private schools near your installation.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            DoDEA Schools on Military Installations
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Department of Defense Education Activity operates schools on
            many military installations in the U.S. and overseas. DoDEA schools
            are specifically designed for military families and understand the
            unique challenges of frequent moves. Class sizes tend to be smaller,
            teachers are trained in supporting students who transition often, and
            the curriculum is standardized across all DoDEA schools worldwide.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Not every installation has a DoDEA school, and availability varies.
            Stateside DoDEA schools are more common on larger bases, while most
            OCONUS installations offer DoDEA as the primary education option.
            Check the{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base directory
            </Link>{" "}
            to see what education resources are available at your gaining
            installation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Using Your School Liaison Officer
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every military installation has a School Liaison Officer (SLO) whose
            sole job is to help military families navigate education decisions.
            SLOs maintain relationships with local school districts, understand
            enrollment timelines, and can advocate on your behalf if issues
            arise during a school transition. Contact the SLO at your new base
            as soon as you receive{" "}
            <Link href="/pcs-guide" className="text-blue-600 hover:underline">
              PCS orders
            </Link>
            .
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your SLO can provide school performance data, gifted program
            availability, special education resources, and extracurricular
            activity options. They can also help resolve credit transfer disputes
            and grade placement questions that sometimes arise during mid-year
            moves.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Researching Local School Districts
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When DoDEA is not available or you prefer off-base schools, research
            local districts early. School quality can vary significantly between
            neighborhoods only a few miles apart. Use resources like
            GreatSchools, Niche, and state department of education report cards
            to compare test scores, student-teacher ratios, and graduation
            rates.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Keep in mind that school district boundaries may not align with the
            neighborhoods closest to base. Some families choose housing farther
            from the gate specifically to access a better school zone. Factor
            school quality into your{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH and housing
            </Link>{" "}
            decisions — the right school can make the entire PCS smoother for
            your children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Interstate Compact on Education
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Interstate Compact on Educational Opportunity for Military
            Children was created to remove barriers that military kids face when
            changing schools. It covers enrollment, placement, eligibility for
            extracurricular activities, and graduation requirements. Under the
            Compact, schools must accept unofficial transcripts for immediate
            enrollment, honor course placement from the sending school, and
            provide flexibility on graduation requirements for students who
            transfer during high school.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If a school is not complying with the Compact, your SLO can
            intervene. Every state has a Compact Commissioner who serves as a
            point of escalation. Knowing your rights under the Compact gives you
            leverage to ensure your child&apos;s education is not disrupted by a
            PCS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Tips for Smooth School Transitions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Request school records at least 30 days before your move. Gather
            transcripts, immunization records, IEP documentation, and teacher
            recommendations. If your child has an Individualized Education
            Program, schedule a meeting with the new school&apos;s special education
            coordinator within the first two weeks of arrival. For high
            schoolers, work with the guidance counselor at both schools to map
            credits and ensure graduation requirements are met. Finally, involve
            your children in the process — visiting the new school&apos;s website,
            exploring extracurricular activities, and connecting with the{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              moving checklist
            </Link>{" "}
            can help them feel in control during the transition.
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
            Plan Your Family&apos;s PCS Move
          </h2>
          <p className="mb-6 text-blue-100">
            Estimate your housing allowance and build a complete moving timeline
            with our free tools.
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
