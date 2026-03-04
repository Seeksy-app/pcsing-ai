import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Overseas PCS Guide 2026 - OCONUS Moves",
  description:
    "Everything you need for an OCONUS PCS: passports, command sponsorship, vehicle shipping, pets, and overseas housing.",
};

const faqs = [
  {
    question: "Do I need a passport for an overseas PCS?",
    answer:
      "Yes. Most OCONUS assignments require a no-fee official passport issued through your installation passport office. Some locations also require a tourist passport and a visa. Start the process immediately when you receive orders because processing can take 6 to 10 weeks.",
  },
  {
    question: "What is command sponsorship and why does it matter?",
    answer:
      "Command sponsorship is approval from the overseas command for your dependents to accompany you. Without it, your family will not receive government-funded travel, housing allowances, or access to on-base services overseas. The process includes medical and dental screenings for each family member.",
  },
  {
    question: "Can I ship my car to an overseas duty station?",
    answer:
      "The government will ship one privately owned vehicle (POV) to most OCONUS locations at no cost. Your vehicle must meet the host country emissions and safety standards. Processing through the Vehicle Processing Center typically takes 4 to 8 weeks by sea.",
  },
  {
    question: "How is overseas housing allowance (OHA) different from BAH?",
    answer:
      "OHA covers your actual rent up to a locality ceiling, plus a utility and recurring maintenance allowance. Unlike BAH, you cannot pocket the difference if your rent is below the ceiling. OHA rates are set by the Department of State and adjusted periodically based on local market surveys.",
  },
  {
    question: "Can I bring my pets on an overseas PCS?",
    answer:
      "Yes, but requirements vary significantly by country. Most locations require a microchip, current rabies vaccination, and a USDA health certificate. Countries like Japan, the UK, and Hawaii have extended quarantine or pre-travel blood test requirements. Plan at least 4 to 6 months ahead for pet travel.",
  },
];

export default function OverseasPcsPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Overseas PCS Guide — OCONUS Moves
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            OCONUS moves add layers of complexity. This guide covers everything
            from passports to vehicle shipping so you can focus on the mission.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The OCONUS Timeline Is Longer Than You Think
          </h2>
          <p className="text-gray-700 leading-relaxed">
            An overseas PCS requires significantly more lead time than a
            stateside move. Between passport applications, command sponsorship
            screenings, and vehicle processing, you should begin preparations as
            soon as assignment notification drops — ideally 5 to 6 months before
            your report date. Check your{" "}
            <Link
              href="/pcs-guide"
              className="text-blue-600 hover:underline"
            >
              PCS guide
            </Link>{" "}
            for baseline steps, then layer on the OCONUS-specific tasks below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Passports, Visas, and Documents
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Visit your installation passport office within days of receiving
            orders. You will need a no-fee official passport for yourself and
            each accompanying dependent. Some countries — including Germany,
            Italy, and South Korea — also require a Status of Forces Agreement
            (SOFA) stamp or a separate visa. Carry multiple certified copies of
            your orders, birth certificates, marriage certificates, and powers
            of attorney. These documents will be needed repeatedly during
            in-processing overseas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Command Sponsorship and Overseas Screenings
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Command sponsorship is the gateway to bringing your family overseas.
            The process begins with an Exceptional Family Member Program (EFMP)
            screening, followed by medical and dental clearances for every
            dependent. If any family member has a condition that requires
            specialty care, the overseas command must verify that the care is
            available at or near the duty station. Start these screenings
            immediately — delays here can push back your entire move. Review the{" "}
            <Link
              href="/checklist"
              className="text-blue-600 hover:underline"
            >
              PCS checklist
            </Link>{" "}
            to track each screening appointment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Shipping Your Vehicle (POV)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The government will ship one POV to your overseas duty station at no
            cost. Drop your vehicle at the nearest Vehicle Processing Center
            (VPC) with a clean title, current registration, and no more than a
            quarter tank of gas. Shipping by sea typically takes 4 to 8 weeks
            depending on the destination. Research your host country vehicle
            requirements ahead of time — some countries require specific
            headlight configurations, emissions equipment, or winter tires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            OHA vs. BAH — Understanding Overseas Housing
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Overseas housing works differently than CONUS. Instead of BAH, you
            receive OHA (Overseas Housing Allowance), which reimburses your
            actual rent up to a set ceiling for your pay grade and location. You
            also receive a utility and recurring maintenance allowance. Unlike
            BAH, you cannot keep the difference if your rent falls below the
            ceiling. Use the{" "}
            <Link
              href="/tools/bah-calculator"
              className="text-blue-600 hover:underline"
            >
              BAH calculator
            </Link>{" "}
            to compare what you would receive stateside, and check the Defense
            Travel Management Office for current OHA rates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pets and Overseas PCS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Moving{" "}
            <Link
              href="/pet-relocation"
              className="text-blue-600 hover:underline"
            >
              pets overseas
            </Link>{" "}
            requires careful planning. At minimum, your pet will need a
            microchip (ISO 15-digit), current rabies vaccination, and a
            USDA-endorsed health certificate issued within 10 days of travel.
            Countries like Japan and the United Kingdom require rabies titer
            tests months in advance. Hawaii, while technically CONUS, has its
            own strict quarantine program. Budget for airline pet fees, crates,
            and potential commercial pet shipping services — costs can range from
            a few hundred dollars for CONUS to several thousand for OCONUS
            destinations. Browse{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base guides
            </Link>{" "}
            for pet-friendly information at your new installation.
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
            Planning an OCONUS Move?
          </h2>
          <p className="mb-6 text-blue-100">
            Calculate your housing allowance and track every task with our free
            PCS tools.
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
