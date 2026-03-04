import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Pet Relocation During PCS - Complete Guide",
  description:
    "How to PCS with dogs, cats, and pets. CONUS and OCONUS pet travel requirements, quarantine rules, and shipping costs.",
  keywords:
    "PCS with pets, military pet relocation, pet quarantine military, OCONUS pet travel, military move with dogs cats, pet shipping PCS",
};

const faqs = [
  {
    question: "Does the military pay to move my pets during a PCS?",
    answer:
      "No. Pet transportation is not a reimbursable PCS expense. You are responsible for all costs including airline fees, health certificates, crates, and commercial pet shipping services. However, DLA (Dislocation Allowance) is a flat payment that can help offset these costs.",
  },
  {
    question: "Do pets need to be quarantined when PCSing to Hawaii?",
    answer:
      "Hawaii requires all dogs and cats to go through a rabies quarantine program. If you complete all requirements — including two rabies vaccinations, a blood titer test, and a 120-day waiting period — your pet may qualify for the 5-Day-Or-Less program instead of the standard 120-day quarantine.",
  },
  {
    question: "What airlines allow pets on military PCS flights?",
    answer:
      "Patriot Express (the Rotator) allows two pets per family in the cargo hold on select routes. Commercial airlines each have their own pet policies — some allow small pets in the cabin while larger dogs must fly as checked baggage or cargo. Book early as pet spots are limited, especially in summer.",
  },
  {
    question: "How far in advance should I prepare my pet for an OCONUS PCS?",
    answer:
      "Start at least 4 to 6 months before your move date. Many countries require rabies titer blood tests that must be done 3 or more months before travel. You will also need a USDA-endorsed health certificate issued within 10 days of departure, so plan your vet visits carefully.",
  },
];

export default function PetRelocationPage() {
  return (
    <>
      <FaqJsonLd questions={faqs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Moving Pets During a PCS — Full Guide
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your pets are family. Here is everything you need to get them safely
            to your next duty station — CONUS or OCONUS.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            CONUS Pet Moves — The Simpler Scenario
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A stateside PCS with pets is relatively straightforward. If you are
            driving, your pets ride with you. Make sure they have current
            vaccinations, and carry a copy of their vet records. Plan rest stops
            every few hours and never leave animals in a parked car. If you are
            flying commercially within the continental United States, most
            airlines allow small dogs and cats in the cabin for a fee of $95 to
            $200 each way. Larger pets must travel as checked baggage or air
            cargo, which typically costs $200 to $500 depending on the carrier
            and animal size. Check breed restrictions — many airlines will not
            transport brachycephalic (short-nosed) breeds in cargo due to
            breathing risks. Review the{" "}
            <Link
              href="/checklist"
              className="text-blue-600 hover:underline"
            >
              PCS checklist
            </Link>{" "}
            to add pet tasks to your timeline.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            OCONUS Requirements — Start Early
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Moving pets{" "}
            <Link
              href="/overseas-pcs"
              className="text-blue-600 hover:underline"
            >
              overseas
            </Link>{" "}
            is significantly more involved. Every country has its own import
            regulations, and failing to meet even one requirement can result in
            your pet being denied entry or placed in quarantine at your expense.
            At minimum, you will need an ISO-compliant 15-digit microchip, a
            current rabies vaccination administered after the microchip was
            implanted, and a USDA-endorsed international health certificate
            (APHIS Form 7001) issued within 10 days of travel. Many countries
            also require a rabies antibody titer test performed at an approved
            laboratory, with results available at least 3 months before travel.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quarantine Rules by Destination
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Hawaii enforces some of the strictest pet import rules in the
            United States. The standard quarantine is 120 days, but the
            5-Day-Or-Less program lets you reduce that to direct release or a
            brief hold if you complete all pre-arrival requirements. Japan
            requires a microchip, two rabies vaccinations given at least 30 days
            apart, a titer test, and a 180-day waiting period from the blood
            draw date. Germany is more lenient for EU-standard vaccinated pets
            but still requires a pet passport or third-country health
            certificate. The United Kingdom follows similar EU-aligned rules with
            a tapeworm treatment required 1 to 5 days before entry. Always
            verify current regulations with the destination country embassy or
            your installation veterinary clinic.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Shipping Costs and Pet Travel Companies
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Pet shipping costs vary widely. A CONUS commercial flight with a pet
            in cargo typically runs $200 to $500. OCONUS pet transport through a
            professional pet shipping company can cost $1,500 to $5,000 or more
            depending on the destination and animal size. Companies like PetRelocation,
            Air Animal, and Happy Tails Travel specialize in military pet moves
            and can handle documentation, crate requirements, and booking. While
            expensive, these services can be worthwhile for complex OCONUS
            destinations where paperwork errors could lead to quarantine. The
            military does not reimburse pet shipping costs, but your DLA payment
            can help offset the expense.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vet Records and Pre-Travel Checklist
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Keep an organized folder with all of your pet&apos;s veterinary
            records. This should include vaccination history, microchip number
            and registration, titer test results, and any country-specific
            documentation. Schedule your final vet visit to get the health
            certificate within the required window — usually 10 days before
            departure. Ask your vet to double-check that every document matches
            the destination country requirements. Browse{" "}
            <Link href="/bases" className="text-blue-600 hover:underline">
              base guides
            </Link>{" "}
            to find veterinary clinics and pet-friendly housing at your new
            installation. For a complete overview of your move, see the{" "}
            <Link
              href="/pcs-guide"
              className="text-blue-600 hover:underline"
            >
              PCS guide
            </Link>
            .
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
            PCSing With Your Pets?
          </h2>
          <p className="mb-6 text-blue-100">
            Stay organized with our checklist and explore your new base.
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
