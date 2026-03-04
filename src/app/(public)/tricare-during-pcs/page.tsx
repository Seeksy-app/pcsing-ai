import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "TRICARE During PCS - Coverage Transfer Guide",
  description:
    "Keep TRICARE coverage during your PCS. How to transfer regions, find providers, and handle prescriptions during a move.",
  keywords:
    "TRICARE PCS, TRICARE transfer, military health insurance PCS, TRICARE region change, TRICARE during move, military prescriptions PCS",
};

const faqs = [
  {
    question: "Will my TRICARE coverage lapse during a PCS?",
    answer:
      "No. TRICARE coverage does not lapse during a PCS. Active-duty service members remain covered under TRICARE Prime regardless of location. Dependents on TRICARE Prime should transfer their enrollment to the new region upon arrival to ensure they are assigned a primary care manager and can access in-network care without delays.",
  },
  {
    question: "How do I transfer my TRICARE region during a PCS?",
    answer:
      "Contact your regional contractor to disenroll from the old region, then enroll with the new regional contractor at your gaining duty station. TRICARE West is managed by TriWest Healthcare Alliance, and TRICARE East is managed by Humana Military. You can initiate transfers through the milConnect portal or by calling the regional contractor directly.",
  },
  {
    question:
      "Can I refill prescriptions during my PCS travel?",
    answer:
      "Yes. Active-duty members can fill prescriptions at any military treatment facility (MTF) pharmacy. Dependents can use any network pharmacy with their TRICARE benefit. Before your move, request a 90-day supply through TRICARE Home Delivery (Express Scripts) to ensure you have medication throughout the transition.",
  },
  {
    question:
      "What is the EFMP and how does it affect a PCS with TRICARE?",
    answer:
      "The Exceptional Family Member Program (EFMP) ensures that family members with special medical or educational needs are assigned to installations where adequate services are available. If you are enrolled in EFMP, your PCS assignment is screened to verify the gaining location has the required TRICARE-covered specialists and programs. Coordinate with your EFMP coordinator early in the PCS process.",
  },
];

export default function TricareDuringPcsPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            TRICARE Coverage During a PCS Move
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            How to transfer TRICARE regions, maintain coverage, find providers,
            and manage prescriptions during your military relocation.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Understanding TRICARE Regions
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TRICARE divides the United States into two regions: TRICARE East
            (managed by Humana Military) and TRICARE West (managed by TriWest
            Healthcare Alliance). When you PCS between regions, you must
            transfer your enrollment from one regional contractor to the other.
            Active-duty service members are automatically enrolled in TRICARE
            Prime, but dependents need to actively re-enroll to be assigned a
            new primary care manager (PCM) at the gaining location.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For overseas assignments, TRICARE Overseas Program (TOP) provides
            coverage through International SOS. Begin the transfer process as
            soon as you receive PCS orders. Use milConnect or contact the
            regional contractor by phone to initiate the change. Our{" "}
            <Link href="/pcs-timeline" className="text-blue-600 hover:underline">
              PCS timeline
            </Link>{" "}
            can help you schedule this task at the right point in your move.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Maintaining Coverage During Transit
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your TRICARE benefits remain active during PCS travel — there is no
            gap in coverage. Active-duty members can visit any military
            treatment facility (MTF) along the route for urgent care. Dependents
            on TRICARE Prime can access urgent and emergency care at any network
            or non-network provider during the move under the PCS transitional
            benefit. For non-emergency care during transit, call the nurse advice
            line at 1-800-TRICARE for guidance on accessing services. If your
            travel takes more than a few days, carry copies of your insurance
            information and a summary of any ongoing treatments.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Finding Providers at Your New Base
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once you arrive at your new duty station, your first step is
            enrolling with the local MTF or selecting a network primary care
            manager. Visit the TRICARE provider directory online to search for
            in-network physicians, specialists, and dentists near your new
            address. If the gaining installation has a large MTF, you will
            likely be assigned a PCM there. Smaller installations may require
            you to use a network civilian provider.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Request your medical and dental records from the losing MTF before
            departing. While records are increasingly digital, having physical
            copies or a summary ensures continuity of care. Research your new
            base&apos;s medical facilities using our{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              military base directory
            </Link>{" "}
            to see what health services are available on and near the
            installation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Transferring Prescriptions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Before your PCS, request a 90-day supply of all maintenance
            medications through TRICARE Home Delivery (administered by Express
            Scripts). This ensures you have enough medication to cover the
            transition period. If you use a specialty medication, coordinate
            with your current provider to transfer the prescription to a
            pharmacy or MTF at the gaining location. Active-duty members can
            fill prescriptions at any MTF pharmacy at no cost. Dependents can
            use MTF pharmacies, network retail pharmacies (with applicable
            copays), or TRICARE Home Delivery. Update your mailing address with
            Express Scripts promptly so home-delivery prescriptions arrive at
            your new address without interruption.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Dental Coverage and EFMP Considerations
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The TRICARE Dental Program (TDP), administered by United Concordia,
            covers dependents and is separate from medical TRICARE. Dental
            coverage is portable nationwide, so you do not need to re-enroll
            when you PCS — just find a new network dentist at your destination.
            Active-duty dental care continues at the gaining MTF dental clinic.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If a family member is enrolled in the Exceptional Family Member
            Program (EFMP), your PCS assignment is screened to ensure the new
            location can support their medical and educational needs. Coordinate
            with your EFMP coordinator and the gaining installation&apos;s EFMP
            office to verify that required specialists, therapists, and programs
            are available under TRICARE in that area. Review our{" "}
            <Link href="/guide" className="text-blue-600 hover:underline">
              PCS guide
            </Link>{" "}
            for more on managing special needs during a move.
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
            Plan Your PCS Move
          </h2>
          <p className="text-gray-600 mb-6">
            Estimate your BAH at your new location and keep every task on track
            with our free PCS tools.
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
