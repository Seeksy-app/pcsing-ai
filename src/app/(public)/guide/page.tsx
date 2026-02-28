import type { Metadata } from "next";
import Link from "next/link";
import { GuideToc } from "@/components/GuideToc";
import { AskAIButton } from "@/components/AskAIButton";

export const metadata: Metadata = {
  title: "Complete PCS Guide 2026 | PCSing.ai",
  description:
    "The complete guide to military PCS moves. Learn about orders, entitlements, BAH, housing, shipping household goods, OCONUS moves, and settling in at your new duty station.",
  keywords:
    "pcs guide, military pcs, how to pcs, pcs move, military move guide, pcs checklist, pcs entitlements",
};

const tocItems = [
  { id: "what-is-pcs", label: "What Is a PCS Move?" },
  { id: "getting-orders", label: "Getting Your Orders" },
  { id: "entitlements", label: "Financial Entitlements" },
  { id: "planning", label: "Planning Your Move" },
  { id: "types-of-moves", label: "Types of Moves" },
  { id: "housing", label: "Housing at Your New Base" },
  { id: "family", label: "Moving with Family" },
  { id: "pets", label: "Moving with Pets" },
  { id: "oconus", label: "OCONUS Moves" },
  { id: "settling-in", label: "Settling In" },
  { id: "claims", label: "PCS Claims & Reimbursement" },
];

export default function GuidePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Updated for 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The Complete PCS Guide
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about your military move, from orders to
            settling in.
          </p>
        </div>
      </section>

      {/* Content with sidebar TOC */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* TOC */}
          <GuideToc items={tocItems} />

          {/* Sections */}
          <article className="max-w-3xl space-y-16">

            {/* What is a PCS Move? */}
            <section id="what-is-pcs" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">What Is a PCS Move?</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A Permanent Change of Station (PCS) is the official relocation of an active-duty
                  service member — and usually their family — from one duty station to another. Unlike
                  a TDY (Temporary Duty), a PCS is a long-term reassignment that involves moving your
                  household, changing your official address, and often starting a completely new chapter
                  for your family.
                </p>
                <p>
                  PCS moves fall into three broad categories. A <strong>CONUS move</strong> is a transfer
                  between duty stations within the continental United States. An <strong>OCONUS move</strong>{" "}
                  sends you to or from a location outside the continental U.S., including Hawaii, Alaska,
                  and overseas bases in Europe, Asia, or the Middle East. Finally, a <strong>TDY-en-route</strong>{" "}
                  move includes a temporary duty stop — such as a training school — on the way to your new
                  permanent station.
                </p>
                <p>
                  PCS orders can be issued to active-duty members of any branch, as well as some
                  Reserve and National Guard members on active-duty orders exceeding 180 days. Most
                  service members PCS every 2-4 years, though the frequency varies by branch, MOS/AFSC,
                  and the needs of the service.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="What is a PCS move and how does it work?" />
              </div>
            </section>

            {/* Getting Your Orders */}
            <section id="getting-orders" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Getting Your Orders</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  PCS orders are the official document that authorizes your move. They include your
                  new duty station, report-no-later-than (RNLTD) date, authorized dependents, and
                  special instructions such as whether the assignment is accompanied or unaccompanied.
                  Read every line carefully — details buried in the remarks section often affect your
                  entitlements.
                </p>
                <p>
                  If something in your orders is wrong — a misspelled name, incorrect number of
                  dependents, or a missing authorization — request an amendment through your personnel
                  office immediately. Moving forward with incorrect orders can delay reimbursement or
                  create pay issues that take months to resolve.
                </p>
                <p>
                  Most branches require a <strong>levy briefing</strong> within a set window after
                  receiving orders. This briefing covers what to expect, how to use the Defense
                  Personal Property System (DPS) to schedule your move, and the timeline you should
                  follow. Even if your branch doesn&apos;t require one, visiting your local
                  Transportation Office (TMO or PPO) early is one of the best things you can do to set
                  your move up for success.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="How do I read my PCS orders and what should I look for?" />
              </div>
            </section>

            {/* Financial Entitlements */}
            <section id="entitlements" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Financial Entitlements</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The military provides a range of financial entitlements to cover the costs of a PCS
                  move. <strong>BAH (Basic Allowance for Housing)</strong> adjusts to your new
                  location&apos;s rate on the day you report. <strong>DLA (Dislocation Allowance)</strong>{" "}
                  is a one-time payment — currently over $2,000 for most members — to help cover
                  miscellaneous expenses like deposits, hook-up fees, and the things that always seem to
                  come up during a move.
                </p>
                <p>
                  <strong>MALT (Mileage Allowance)</strong> reimburses you for driving your vehicle to
                  your new duty station, based on the official distance calculated by the Defense Table
                  of Official Distances (DTOD). <strong>TLE (Temporary Lodging Expense)</strong> covers
                  up to 14 days of hotel costs during your transition — split between your old and new
                  duty station — for CONUS moves. For OCONUS moves, the equivalent is{" "}
                  <strong>TLA (Temporary Lodging Allowance)</strong>, which can cover significantly more
                  days.
                </p>
                <p>
                  You can also request <strong>advance pay</strong> — up to 3 months of base pay — to
                  bridge the financial gap during your move. This must be repaid within 12 months.
                  Understanding these entitlements before you move prevents you from leaving money on
                  the table.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                  For a detailed breakdown of every entitlement and how to calculate yours, see our{" "}
                  <Link href="/entitlements" className="text-blue-600 hover:underline font-medium">
                    Entitlements &amp; Benefits page &rarr;
                  </Link>
                </div>
              </div>
              <div className="mt-5">
                <AskAIButton question="What PCS entitlements am I authorized and how much will I receive?" />
              </div>
            </section>

            {/* Planning Your Move */}
            <section id="planning" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 text-purple-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Planning Your Move</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A successful PCS starts with early planning. The moment you receive orders, start
                  working the timeline. At <strong>90 days out</strong>, visit TMO/PPO, create your DPS
                  account, and begin researching your new duty station. Request a sponsor through your
                  gaining unit — they&apos;re your boots-on-the-ground resource for everything from
                  housing recommendations to the best local pizza.
                </p>
                <p>
                  At <strong>60 days out</strong>, schedule your HHG pickup date (earlier if moving
                  during PCS peak season, May through August), notify your landlord, and start
                  decluttering. The less you move, the smoother the pack-out. At <strong>30 days
                  out</strong>, confirm all dates, begin address changes, and schedule utility
                  disconnections. At <strong>14 days out</strong>, pack your essentials bags — the
                  suitcases your family will live out of during the transition.
                </p>
                <p>
                  One of the biggest mistakes PCSing families make is underestimating peak-season
                  demand. Movers are booked solid from May through August, and last-minute scheduling
                  often means weeks of delay. If you&apos;re moving during summer, book your dates the
                  day your orders drop.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="Help me create a PCS planning timeline for my move" />
              </div>
            </section>

            {/* Types of Moves */}
            <section id="types-of-moves" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Types of Moves</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The most common option is a <strong>government-arranged HHG move</strong>. The
                  military hires a Transportation Service Provider (TSP) to pack, load, transport, and
                  deliver your household goods. You don&apos;t pay for the move itself, but you&apos;re
                  responsible for being present during pack-out and delivery, and for documenting the
                  condition of your belongings.
                </p>
                <p>
                  A <strong>Personally Procured Move (PPM)</strong>, formerly called a DITY move, means
                  you move your own belongings — by rental truck, trailer, or shipping container — and
                  the government reimburses you based on what it would have cost them to move the same
                  weight. Many families make a profit on PPMs, especially if they declutter aggressively
                  beforehand. You can also do a <strong>partial PPM</strong>, letting the government
                  move most of your goods while you move some yourself for the reimbursement.
                </p>
                <p>
                  If your new assignment is shorter or your housing situation isn&apos;t settled, you
                  may qualify for <strong>NTS (Non-Temporary Storage)</strong>. The military will store
                  a portion of your household goods at government expense for the duration of your
                  assignment — common for OCONUS tours or unaccompanied assignments where you can&apos;t
                  bring everything.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="Should I do a DITY move or HHG move? What are the pros and cons?" />
              </div>
            </section>

            {/* Housing at Your New Base */}
            <section id="housing" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-100 text-sky-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Housing at Your New Base</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Housing is usually the biggest decision in any PCS. <strong>On-post housing</strong>{" "}
                  (managed by privatized housing companies on most installations) offers the convenience
                  of a short commute and access to on-base amenities. Your BAH goes directly to the
                  housing office, and you don&apos;t deal with security deposits or utility bills.
                  Availability varies widely — some bases have long waitlists while others have
                  immediate openings.
                </p>
                <p>
                  <strong>Off-post housing</strong> gives you more flexibility in choosing your
                  neighborhood, school district, and home size. Your BAH rate is based on pay grade,
                  dependency status, and the zip code of your duty station — not where you actually
                  live. In high-cost areas like San Diego or the D.C. metro, BAH may not fully cover
                  rent. In lower-cost areas, you may pocket the difference.
                </p>
                <p>
                  Many service members are authorized a <strong>house-hunting trip</strong> — up to 10
                  days of funded travel to your new duty station to find housing before your official
                  report date. This is a separate authorization from your PCS travel and must be
                  approved in advance. It&apos;s worth using if you&apos;re buying a home or moving to
                  an unfamiliar area.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="Should I live on-base or off-base? What are the pros and cons?" />
              </div>
            </section>

            {/* Moving with Family */}
            <section id="family" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-pink-100 text-pink-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Moving with Family</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  PCS moves affect the entire family. For children, the <strong>School Liaison
                  Officer (SLO)</strong> at your gaining installation is an invaluable resource. They
                  help with enrollment, records transfers, and navigating differences in state
                  curriculum and graduation requirements. Start the school research early — some magnet
                  and charter programs have application deadlines months in advance.
                </p>
                <p>
                  Childcare on military installations is managed through <strong>Child Development
                  Centers (CDCs)</strong>. Waitlists can stretch 6 months or more at popular bases, so
                  register as soon as you have orders. If on-base care isn&apos;t available, Military
                  OneSource can help you find fee-assisted off-base providers through the child care
                  subsidy program.
                </p>
                <p>
                  For military spouses, the <strong>Spouse Education and Career Opportunities
                  (SECO)</strong> program provides career coaching, resume help, and licensing
                  assistance. Many states now offer expedited professional license reciprocity for
                  military spouses. If a family member has special medical needs, ensure your{" "}
                  <strong>EFMP (Exceptional Family Member Program)</strong> enrollment is current —
                  EFMP screening is required before OCONUS assignments and helps ensure your new
                  location has the necessary support services.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="What resources are available for military families during a PCS?" />
              </div>
            </section>

            {/* Moving with Pets */}
            <section id="pets" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Moving with Pets</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The military does not ship pets for you, but there are programs and services to help.
                  For CONUS moves, most families drive with their pets. Ensure your pet is up to date on
                  vaccinations and has a health certificate from your vet — many states require one
                  within 30 days of travel for dogs and cats.
                </p>
                <p>
                  OCONUS moves are more complex. Many countries require specific vaccinations,
                  microchipping, blood tests, and quarantine periods. <strong>Hawaii</strong> has a
                  strict 120-day pre-arrival program (or a 5-day quarantine if all requirements are
                  met). <strong>Japan, Germany, and the UK</strong> each have their own rules. Start
                  the paperwork at least 6 months before your move — missing a deadline can mean your
                  pet doesn&apos;t fly with you.
                </p>
                <p>
                  Pet shipping companies like PCSPets and Air Animal specialize in military pet
                  relocations. Costs typically range from $1,500 to $4,000+ for OCONUS flights
                  depending on destination and pet size. Some installations offer a pet TLA or temporary
                  fostering connections through the base veterinary clinic.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="How do I move my pets during a PCS, especially OCONUS?" />
              </div>
            </section>

            {/* OCONUS Moves */}
            <section id="oconus" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">OCONUS Moves</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  An overseas PCS adds several layers of complexity. You&apos;ll need <strong>tourist
                  passports</strong> for all family members (even if you have an official/no-fee
                  passport) and a <strong>SOFA stamp</strong> (Status of Forces Agreement) that grants
                  you legal status in the host country. Start passport applications immediately —
                  processing times can exceed 10 weeks during peak season.
                </p>
                <p>
                  If your family is accompanying you, you&apos;ll need <strong>command
                  sponsorship</strong> approved by your gaining command. This authorizes your dependents
                  to live with you overseas and qualifies them for on-base services, DODEA schools, and
                  medical care at the overseas MTF. Command sponsorship also triggers a higher weight
                  allowance and accompanied BAH/OHA rates.
                </p>
                <p>
                  The government will ship one <strong>POV (Privately Owned Vehicle)</strong> to most
                  OCONUS locations at no cost. The process takes 4-8 weeks by ship, so plan for a gap
                  without your car. Some locations (like Japan and Germany) have specific vehicle
                  inspection and registration requirements — check with your gaining installation&apos;s
                  vehicle registration office before shipping a car that may not pass inspection.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="What do I need to do for an OCONUS PCS move?" />
              </div>
            </section>

            {/* Settling In */}
            <section id="settling-in" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100 text-teal-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Settling In</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The first week at a new duty station is a whirlwind of in-processing appointments.
                  Your <strong>sponsor</strong> (assigned by your gaining unit) should help you navigate
                  the check-in process, point you to key offices, and answer the &quot;where do I
                  go?&quot; questions. If you weren&apos;t assigned a sponsor, contact your gaining
                  unit&apos;s first sergeant or admin section.
                </p>
                <p>
                  Prioritize updating your <strong>DEERS</strong> information so your family&apos;s
                  benefits continue without interruption. Register your vehicles with the new state (if
                  required), get new military IDs if they&apos;re expiring soon, and enroll at the base
                  medical clinic. Set up utilities, internet, and mail forwarding if you haven&apos;t
                  already.
                </p>
                <p>
                  Don&apos;t forget to <strong>file your travel voucher</strong> within 5 business days
                  of arriving. This is how you get reimbursed for MALT, per diem, TLE, and DLA. Late
                  filing can delay payment by weeks. Use the DTS (Defense Travel System) or your
                  branch&apos;s finance office to submit — and keep every receipt from your trip.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="What should I do during my first week at a new duty station?" />
              </div>
            </section>

            {/* PCS Claims & Reimbursement */}
            <section id="claims" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-gray-900">PCS Claims &amp; Reimbursement</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Damage during a PCS move is unfortunately common. When your household goods are
                  delivered, <strong>inspect everything before signing off</strong>. Note any damage —
                  scratches, dents, broken items, missing boxes — on the delivery inventory. Take
                  photos with timestamps. You have <strong>75 days</strong> from delivery to file a
                  claim through the Defense Personal Property System (DPS) for loss or damage.
                </p>
                <p>
                  Claims are paid based on depreciated value or repair cost. For high-value items
                  (electronics, furniture, antiques), having pre-move photos and receipts significantly
                  strengthens your claim. Full Replacement Value (FRV) protection applies to most
                  government-arranged moves, meaning you should receive enough to repair or replace
                  items at today&apos;s cost — but only if your documentation is solid.
                </p>
                <p>
                  For PPM/DITY moves, your reimbursement is processed after you submit weight tickets
                  (empty and full vehicle weights), receipts for fuel and tolls, and your travel
                  voucher. Payment is typically 100% of the government&apos;s estimated cost for the
                  weight you moved. Reimbursement timelines vary by branch but generally take 2-6 weeks
                  after all paperwork is submitted.
                </p>
              </div>
              <div className="mt-5">
                <AskAIButton question="How do I file a PCS claim for damaged household goods?" />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 sm:p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to start planning your PCS?
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Use our interactive checklist to track every task, or ask the AI
                assistant for help with your specific situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/checklist"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Your PCS Checklist
                </Link>
                <Link
                  href="/entitlements"
                  className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  View Entitlements
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
