import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "PCS During Deployment - Family Guide",
  description:
    "How to handle a PCS when the service member is deployed. Power of attorney, special entitlements, and family tips.",
  keywords:
    "PCS during deployment, military deployment PCS, power of attorney PCS, military family move deployed, PCS while deployed",
};

const faqs = [
  {
    question:
      "Can my spouse handle our PCS move while I am deployed?",
    answer:
      "Yes. With a valid Special Power of Attorney (SPOA) that specifically authorizes PCS-related actions, your spouse can sign transportation documents, schedule movers, manage housing, and handle most aspects of the move. Coordinate with your unit's rear detachment and the Transportation Office before you deploy.",
  },
  {
    question:
      "What type of Power of Attorney do I need for a PCS during deployment?",
    answer:
      "A Special Power of Attorney (SPOA) is recommended over a General Power of Attorney. The SPOA should specifically list PCS actions: signing household goods paperwork, entering into housing leases, enrolling children in school, and accessing military installations. Get it notarized at your installation Legal Assistance Office before deploying.",
  },
  {
    question:
      "Are there extra entitlements when PCSing during a deployment?",
    answer:
      "Entitlements remain largely the same, but there are important timing considerations. Your family may be eligible for early return of dependents (ERD) travel if needed. BAH will transition to the new duty station rate upon the report date. TLE/TLA and DLA are still authorized. Coordinate with your finance office for specifics.",
  },
  {
    question:
      "Who should I contact for help if my spouse is deployed during our PCS?",
    answer:
      "Start with the rear detachment or Family Readiness Group (FRG) at the current installation. The Transportation Office can help with scheduling movers. Military OneSource offers free relocation assistance and counseling. Your installation ACS (Army Community Service) or equivalent service-branch family support center can connect you with additional resources.",
  },
];

export default function PcsDuringDeploymentPage() {
  return (
    <>
      <FaqJsonLd questions={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            PCS During Deployment — What Families Need to Know
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A practical guide for families managing a PCS when the service
            member is deployed or on an unaccompanied tour.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Preparing Before Deployment
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When a PCS overlaps with a deployment, preparation becomes critical.
            The most important step is obtaining a Special Power of Attorney
            (SPOA) before the service member leaves. Visit your installation
            Legal Assistance Office to draft an SPOA that specifically
            authorizes your spouse to sign household goods transportation
            documents, enter into housing leases, enroll children in schools,
            and access military installations on your behalf.
          </p>
          <p className="text-gray-700 leading-relaxed">
            A General Power of Attorney may cover these actions, but an SPOA
            listing specific authorities is preferred by Transportation Offices
            and housing offices because it reduces ambiguity. Make multiple
            certified copies and ensure your spouse has them readily available.
            Review our{" "}
            <Link href="/guide" className="text-blue-600 hover:underline">
              PCS guide
            </Link>{" "}
            for a full overview of the moving process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Working with Rear Detachment and the FRG
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your unit&apos;s rear detachment (or equivalent rear element) is your
            primary military point of contact while the service member is
            deployed. They can help with orders amendments, coordinate with the
            Transportation Office, and resolve issues that require command
            involvement. The Family Readiness Group (FRG) provides peer support,
            shared experience, and practical help like connecting you with
            families who have successfully PCSed during a deployment. Inform
            both the rear detachment and FRG of your PCS timeline as early as
            possible so they can allocate support resources.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Entitlements and Timing
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PCS entitlements remain largely unchanged during a deployment, but
            timing matters. BAH transitions to the new duty station rate on the
            report date, not the departure date. Your family is still authorized
            DLA, TLE (or TLA for overseas moves), per diem for travel days, and
            MALT for driving a privately owned vehicle. If the service member
            cannot travel with the family, the travel entitlements cover the
            dependents making the move.
          </p>
          <p className="text-gray-700 leading-relaxed">
            In some cases, an early return of dependents (ERD) may be authorized
            to allow the family to move ahead of the service member. Discuss
            timing options with the rear detachment and your branch&apos;s personnel
            command. For a complete breakdown of allowances, see our{" "}
            <Link
              href="/entitlements"
              className="text-blue-600 hover:underline"
            >
              PCS entitlements page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Managing Household Goods and Housing Solo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Coordinating a household goods shipment without the service member
            present is manageable with the right preparation. The SPOA allows
            the spouse to schedule, receive, and sign for shipments. Be present
            for both the pack-out and delivery to document the condition of
            belongings. Photograph high-value items before they are packed, and
            file any damage claims promptly through the{" "}
            <Link
              href="/shipping-household-goods"
              className="text-blue-600 hover:underline"
            >
              household goods claims process
            </Link>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For housing, apply early. If you are moving into on-post housing,
            contact the housing office at the gaining installation as soon as
            you have orders. For off-post housing, research neighborhoods near
            the new base using our{" "}
            <Link
              href="/military-housing"
              className="text-blue-600 hover:underline"
            >
              military housing guide
            </Link>. Having the SPOA will allow you to sign a lease without the
            service member being physically present.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Support Resources
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Military OneSource offers free relocation counseling, financial
            planning, and non-medical counseling for families going through a
            PCS during deployment. Your installation&apos;s Army Community Service
            (ACS), Fleet and Family Support Center (Navy/Marines), or Airman and
            Family Readiness Center (Air Force/Space Force) can provide hands-on
            help with the move. Do not hesitate to ask for assistance — these
            services exist specifically for situations like yours. Use our{" "}
            <Link href="/checklist" className="text-blue-600 hover:underline">
              PCS checklist
            </Link>{" "}
            to keep every task organized when managing the move alone.
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
            Stay Organized Through Your PCS
          </h2>
          <p className="text-gray-600 mb-6">
            Estimate housing costs and track every step of your move with our
            free tools.
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
