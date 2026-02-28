import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const relatedBox = (links) => `<div style="background:#f9fafb;padding:24px;border-radius:12px;margin-top:40px"><h3 style="font-size:18px;font-weight:600;margin-bottom:12px">Related Articles</h3><ul style="list-style:none;padding:0;margin:0">${links.map(l => `<li style="margin-bottom:8px"><a href="/blog/${l.slug}" style="color:#2563eb;text-decoration:none">${l.title} →</a></li>`).join("")}</ul></div>`;

const ctaBox = `<div style="background:linear-gradient(135deg,#eff6ff,#e0e7ff);padding:24px;border-radius:12px;margin-top:24px;text-align:center"><p style="font-size:18px;font-weight:600;margin-bottom:8px">Need help with your PCS?</p><p style="color:#4b5563;margin-bottom:16px">Our AI-powered PCS Assistant can answer your specific questions 24/7.</p><a href="javascript:void(0)" onclick="window.dispatchEvent(new CustomEvent('open-ai-chat',{detail:{prefill:'Help me with my PCS move'}}))" style="display:inline-block;background:#2563eb;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:500">Chat with PCS Assistant →</a></div>`;

const tip = (text) => `<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:8px;margin:20px 0"><strong>Pro Tip:</strong> ${text}</div>`;

const hero = (title, subtitle, colors = "#3b82f6,#6366f1") => `<div style="background:linear-gradient(135deg,${colors});padding:40px 30px;border-radius:16px;color:white;margin-bottom:32px"><h2 style="font-size:28px;font-weight:bold;margin:0">${title}</h2><p style="margin-top:8px;opacity:0.9">${subtitle}</p></div>`;

const posts = [
  // ─── POST 1: What Is a PCS Move? ───
  {
    title: "What Is a PCS Move? The Complete Guide to Permanent Change of Station",
    slug: "what-is-a-pcs-move",
    excerpt: "A PCS (Permanent Change of Station) is the military's official process for relocating service members and their families to a new duty station. Here's everything you need to know about how it works.",
    author: "PCSing.ai Team",
    tags: ["pcs", "military-move", "guide"],
    status: "published",
    published_at: "2026-02-28T12:00:00Z",
    seo_title: "What Is a PCS Move? Complete Military Relocation Guide",
    seo_description: "Learn what a PCS move is, the different types of military relocations (CONUS, OCONUS, TDY-en-route), and what to expect during a Permanent Change of Station.",
    og_image: null,
    content: hero("What Is a PCS Move?", "Your complete guide to Permanent Change of Station moves") + `
<p>If you're new to military life — or even if you've been at it for a while — the acronym <strong>PCS</strong> is one you'll hear constantly. It stands for <strong>Permanent Change of Station</strong>, and it's the official process by which the military relocates a service member (and usually their family) from one duty station to another.</p>

<p>Unlike a TDY (Temporary Duty), which sends you somewhere for a short assignment before returning to your home station, a PCS is a long-term reassignment. You're moving your household, changing your official address, uprooting your family, and starting fresh at a new installation. It's exciting, stressful, and complicated — often all at the same time.</p>

<h2>Types of PCS Moves</h2>

<p>Not all PCS moves are the same. Understanding which type you're facing helps you plan more effectively and take advantage of the right entitlements.</p>

<h3>CONUS Moves</h3>
<p>A <strong>CONUS (Continental United States) move</strong> is a transfer between duty stations within the 48 contiguous states. These are the most straightforward PCS moves. You'll typically drive your vehicle to your new location, the military will ship your household goods, and your entitlements include MALT (mileage reimbursement), per diem, DLA, and TLE for temporary lodging.</p>

<p>CONUS moves still require significant planning — especially if you're moving during peak season (May through August) — but they don't involve the extra paperwork that comes with overseas assignments.</p>

<h3>OCONUS Moves</h3>
<p>An <strong>OCONUS (Outside the Continental United States) move</strong> sends you to or from a location outside the lower 48, including Hawaii, Alaska, and overseas bases in Europe, the Pacific, or the Middle East. OCONUS moves involve additional requirements like passports, command sponsorship for dependents, SOFA (Status of Forces Agreement) stamps, and potentially shipping or storing your vehicle.</p>

<p>The entitlements for OCONUS moves are generally more generous — you may receive TLA (Temporary Lodging Allowance) instead of TLE, COLA (Cost of Living Allowance) if the local economy is expensive, and the government will ship one POV at no cost to most locations. But the complexity and lead time are significantly higher. Start planning the moment you get a hint that overseas orders are coming.</p>

<h3>TDY-en-Route</h3>
<p>A <strong>TDY-en-route</strong> move includes a temporary duty stop on the way to your new permanent station — for example, attending a training school or course before reporting. Your orders will spell out the TDY location, duration, and any special instructions. Your household goods typically ship directly to your final duty station while you complete the TDY assignment.</p>

${tip("If you have a TDY-en-route, coordinate with both your losing and gaining transportation offices. Your HHG shipment goes to your final destination, not the TDY stop — so pack your suitcases with enough gear for the entire TDY period.")}

<h2>Who Gets PCS Orders?</h2>

<p>PCS orders are issued to active-duty members of all branches — Army, Navy, Air Force, Marines, Coast Guard, and Space Force. Some Reserve and National Guard members on active-duty orders exceeding 180 days may also receive PCS orders.</p>

<p>Most service members PCS every <strong>2 to 4 years</strong>, though the exact frequency depends on your branch, your MOS/AFSC/rating, your rank, and the needs of the service. Some career fields move more often (looking at you, military intelligence), while others may stay at one installation for longer stretches.</p>

<h2>What Triggers a PCS?</h2>

<p>Several situations can result in PCS orders:</p>
<ul>
<li><strong>Routine reassignment:</strong> You've been at your current station for the standard tour length and the assignment system generates new orders.</li>
<li><strong>Promotion or career progression:</strong> Certain ranks or positions require attendance at specific schools or duty at particular installations.</li>
<li><strong>Unit activation or deactivation:</strong> If your unit is realigning, you may be moved to a new location.</li>
<li><strong>Separation or retirement:</strong> Your final PCS moves you to your home of record or selected location.</li>
<li><strong>Compassionate or humanitarian reassignment:</strong> In rare cases, you can request a PCS to be closer to a family member with serious medical needs.</li>
</ul>

<h2>What Does the Military Cover?</h2>

<p>The good news: the military covers a lot. When you PCS, you're entitled to have your <strong>household goods (HHG)</strong> packed and shipped at government expense, receive <strong>travel pay</strong> for your journey, get <strong>temporary lodging expenses</strong> while in transit, and receive a one-time <strong>Dislocation Allowance (DLA)</strong> to help cover miscellaneous costs.</p>

<p>You can also choose to do a <strong>Personally Procured Move (PPM)</strong> — formerly called a DITY move — where you move your own belongings and the government reimburses you based on what the move would have cost them. Many families actually profit from PPMs, especially if they declutter before the move.</p>

<p>For a complete breakdown of every financial entitlement, visit our <a href="/entitlements">Entitlements & Benefits page</a>.</p>

<h2>How to Prepare for Your First PCS</h2>

<p>If this is your first PCS, take a deep breath. Thousands of families go through this every year, and there are extensive support systems in place. Here's how to get started:</p>

<ol>
<li><strong>Read your orders carefully.</strong> Every line matters — your RNLTD (Report No Later Than Date), authorized dependents, weight allowance, and special instructions are all in there.</li>
<li><strong>Visit your Transportation Office</strong> (TMO for Air Force/Space Force, PPO for Army) as soon as possible to schedule your move.</li>
<li><strong>Request a sponsor</strong> at your gaining installation. They'll be your go-to person for questions about housing, schools, and the local area.</li>
<li><strong>Start a PCS binder or folder</strong> with copies of orders, medical records, school records, and important documents. You'll reference it constantly.</li>
<li><strong>Use our <a href="/checklist">PCS Checklist</a></strong> to track every task from 90 days out through your first week at the new station.</li>
</ol>

${tip("Join the Facebook group for your gaining installation. Military spouse groups are goldmines for real-time info about housing, wait times, local recommendations, and what to expect when you arrive.")}

<h2>The Bottom Line</h2>

<p>A PCS move is one of the most significant events in military life. It affects your career, your family, your finances, and your daily routine. But with early planning, the right resources, and a solid understanding of the process, you can turn what feels overwhelming into a manageable — and even exciting — transition.</p>

<p>Explore our <a href="/guide">complete PCS Guide</a> for detailed walkthroughs of every stage, or browse the <a href="/bases">Base Directory</a> to start researching your next duty station.</p>

` + relatedBox([
      { slug: "getting-your-pcs-orders", title: "Getting Your PCS Orders: What to Know First" },
      { slug: "planning-your-pcs-move", title: "Planning Your PCS Move: The Ultimate Timeline" },
      { slug: "pcs-move-types", title: "Types of PCS Moves: HHG vs. DITY vs. NTS" },
    ]) + ctaBox
  },

  // ─── POST 2: Getting Your PCS Orders ───
  {
    title: "Getting Your PCS Orders: What to Know and What to Do First",
    slug: "getting-your-pcs-orders",
    excerpt: "Your PCS orders are the most important document in your move. Learn how to read them, what to look for, and the first steps to take the moment they drop.",
    author: "PCSing.ai Team",
    tags: ["pcs-orders", "military-move", "guide"],
    status: "published",
    published_at: "2026-02-28T12:00:00Z",
    seo_title: "Getting Your PCS Orders: What to Know & Do First",
    seo_description: "Learn how to read your PCS orders, understand RNLTD dates, request amendments, and take the right first steps when your military orders drop.",
    og_image: null,
    content: hero("Getting Your PCS Orders", "What to know and what to do the moment orders drop", "#f59e0b,#ea580c") + `
<p>The moment your PCS orders hit your inbox, the clock starts ticking. These orders are the single most important document in your entire move — they authorize your relocation, determine your entitlements, and set the timeline for everything that follows. Understanding how to read them and what to do first can save you weeks of stress and thousands of dollars in missed benefits.</p>

<h2>What Are PCS Orders?</h2>

<p>PCS orders are the official military document that authorizes your Permanent Change of Station move. They're generated by your branch's personnel system — HRC for the Army, BUPERS for the Navy, AFPC for the Air Force — and they contain every detail the government needs to move you and your family from Point A to Point B.</p>

<p>Your orders aren't just a piece of paper saying "go here." They're a legal document that determines what the military will pay for, how much weight you can ship, who's authorized to travel with you, and when you need to arrive.</p>

<h2>Key Information in Your Orders</h2>

<p>Every set of PCS orders includes critical details you need to understand:</p>

<ul>
<li><strong>Gaining unit and duty station:</strong> Where you're going and which unit you'll report to.</li>
<li><strong>RNLTD (Report No Later Than Date):</strong> The deadline for arriving at your new station. This drives your entire timeline.</li>
<li><strong>Authorized dependents:</strong> Which family members are authorized to travel at government expense. If a dependent isn't listed, they won't be covered.</li>
<li><strong>Weight allowance:</strong> The maximum weight of household goods the government will ship, based on your rank and dependent status.</li>
<li><strong>Tour length:</strong> How long you're expected to be at the new station (especially important for OCONUS assignments).</li>
<li><strong>Special instructions:</strong> The remarks section may include authorizations for house-hunting trips, TDY-en-route, accompanied vs. unaccompanied status, and more.</li>
</ul>

${tip("Read the remarks section of your orders line by line. Buried in the fine print you'll often find authorizations for house-hunting trips, early reporting, or special entitlements that people commonly miss.")}

<h2>What to Do When Orders Drop</h2>

<h3>Step 1: Read Every Line</h3>
<p>Before you do anything else, sit down and read your orders completely. Don't skim. Check that your name, SSN, rank, dependents, and duty station are all correct. Verify that the RNLTD gives you enough time to execute the move. Look for any special authorizations or restrictions.</p>

<h3>Step 2: Check for Errors and Request Amendments</h3>
<p>Errors in PCS orders are more common than you'd think. A misspelled name, wrong number of dependents, missing authorization for accompanied travel, or incorrect rank can all cause problems downstream — from delays in household goods shipment to incorrect pay.</p>

<p>If anything is wrong, contact your personnel office <strong>immediately</strong> to request an amendment. Don't wait. Don't assume it'll get fixed later. Amendments can take days to weeks to process, and moving forward with incorrect orders can create pay issues that take months to untangle at your new station's finance office.</p>

<h3>Step 3: Attend Your Levy Briefing</h3>
<p>Most branches require a <strong>levy briefing</strong> within a set window after receiving orders. The Army typically requires one within 10 business days. The Air Force and Navy have similar requirements. This briefing covers:</p>
<ul>
<li>How to use the Defense Personal Property System (DPS) to schedule your move</li>
<li>Your financial entitlements and how to claim them</li>
<li>The timeline you should follow</li>
<li>OCONUS-specific requirements if applicable</li>
<li>Resources available to you and your family</li>
</ul>

<h3>Step 4: Visit Your Transportation Office</h3>
<p>Your local Transportation Office — <strong>TMO</strong> (Air Force/Space Force) or <strong>PPO/Transportation Office</strong> (Army/Navy/Marines) — is your primary resource for scheduling your move. Visit them as early as possible, especially if you're PCSing during peak season (May–August).</p>

<p>They'll help you set up your DPS account, explain your move options (government HHG vs. PPM), and give you the specific timelines and requirements for your situation.</p>

${tip("If you're moving during summer, book your HHG pickup date the same week you receive orders. Peak-season capacity fills up fast, and late scheduling can mean weeks of delay — which may push you past your RNLTD.")}

<h3>Step 5: Request a Sponsor</h3>
<p>Contact your gaining unit and request a <strong>sponsor</strong> — someone already stationed there who can answer your questions about housing, schools, commute times, and the local area. A good sponsor is worth their weight in gold. They can tell you which neighborhoods to avoid, how long the on-base housing waitlist is, and where to get the best tacos near the gate.</p>

<h2>Branch-Specific Differences</h2>

<p>While the PCS process is broadly similar across branches, there are differences worth knowing:</p>

<ul>
<li><strong>Army:</strong> Uses HRC (Human Resources Command) for assignments. Orders come through your S-1/AG. Levy briefings are typically required within 10 business days.</li>
<li><strong>Navy/Marines:</strong> Orders come through BUPERS or HQMC. Navy uses the Navy Personnel Command (NPC) and has a unique set of detailing procedures where you can sometimes negotiate your next assignment.</li>
<li><strong>Air Force/Space Force:</strong> AFPC generates assignments. The Air Force uses vMPF (virtual Military Personnel Flight) for most order-related actions. TMO handles transportation.</li>
</ul>

<h2>Common Mistakes to Avoid</h2>

<ol>
<li><strong>Procrastinating on DPS setup:</strong> The earlier you schedule, the more flexibility you have with dates.</li>
<li><strong>Ignoring the remarks section:</strong> This is where critical authorizations hide.</li>
<li><strong>Not getting copies:</strong> Keep multiple copies of your orders — digital and paper. You'll need them for housing, schools, travel, and finance.</li>
<li><strong>Forgetting to update DEERS:</strong> If your family situation has changed since your last PCS, update DEERS before you move.</li>
<li><strong>Waiting to request amendments:</strong> Every day you wait is a day closer to your RNLTD with incorrect paperwork.</li>
</ol>

<p>Your PCS orders set everything in motion. Treat them like the critical document they are, act quickly on any errors, and use them as your roadmap for the weeks ahead. For a step-by-step timeline of what to do after receiving orders, check out our <a href="/checklist">PCS Checklist</a> or read the full <a href="/guide">PCS Guide</a>.</p>

` + relatedBox([
      { slug: "what-is-a-pcs-move", title: "What Is a PCS Move? The Complete Guide" },
      { slug: "pcs-financial-entitlements", title: "PCS Financial Entitlements: BAH, DLA & More" },
      { slug: "planning-your-pcs-move", title: "Planning Your PCS Move: The Ultimate Timeline" },
    ]) + ctaBox
  },

  // ─── POST 3: PCS Financial Entitlements ───
  {
    title: "PCS Financial Entitlements: BAH, DLA, MALT, Per Diem & More",
    slug: "pcs-financial-entitlements",
    excerpt: "Don't leave money on the table. Here's a detailed breakdown of every PCS financial entitlement — BAH, DLA, MALT, TLE, per diem, advance pay — and how to make sure you receive what you're owed.",
    author: "PCSing.ai Team",
    tags: ["entitlements", "bah", "dla", "finance"],
    status: "published",
    published_at: "2026-02-28T12:00:00Z",
    seo_title: "PCS Entitlements: BAH, DLA, MALT, Per Diem Guide",
    seo_description: "Complete guide to PCS financial entitlements including BAH, DLA, MALT, TLE, per diem, and advance pay. Know what you're owed before your military move.",
    og_image: null,
    content: hero("PCS Financial Entitlements", "BAH, DLA, MALT, per diem — know what you're owed", "#16a34a,#059669") + `
<p>One of the biggest mistakes military families make during a PCS is leaving money on the table. The military provides a substantial package of financial entitlements to cover moving costs, but if you don't understand them — or don't claim them properly — you could miss out on thousands of dollars. Let's break down every major PCS entitlement so you know exactly what you're owed.</p>

<h2>BAH — Basic Allowance for Housing</h2>

<p><strong>BAH</strong> is the monthly housing allowance paid to service members who don't live in government quarters. During a PCS, your BAH rate transitions from your old duty station rate to your new one. The switch happens on the day you report to your new station (or when you check out of your old station, depending on branch policy).</p>

<p>Key things to know about BAH during a PCS:</p>
<ul>
<li>If your new station has a <strong>higher BAH rate</strong>, you'll see an increase on your report date.</li>
<li>If it's <strong>lower</strong>, your rate drops on report date — plan your budget accordingly.</li>
<li>You can look up BAH rates for any zip code on the DoD BAH calculator to compare before you move.</li>
<li>BAH is based on your <strong>pay grade</strong> and <strong>dependency status</strong> (with or without dependents), not where you actually live off-base.</li>
</ul>

${tip("Look up BAH rates at your new station before you start house hunting. In some areas, BAH covers rent comfortably with money left over. In high-cost areas like San Diego or D.C., you may need to budget above BAH. Use our <a href='/entitlements'>Entitlements Calculator</a> to estimate your numbers.")}

<h2>DLA — Dislocation Allowance</h2>

<p><strong>DLA</strong> is a one-time, lump-sum payment to help offset the miscellaneous costs of relocating — security deposits, utility hookups, cleaning supplies, and all the random expenses that come with setting up a new household. As of 2026, DLA ranges from about <strong>$2,100 to $4,400</strong> depending on rank and dependency status.</p>

<p>You receive DLA once per PCS move. It's paid automatically when you file your travel voucher, but you need to ensure your orders authorize it. Most standard PCS orders do, but double-check the remarks section.</p>

<h2>MALT — Mileage Allowance</h2>

<p><strong>MALT (Monetary Allowance in Lieu of Transportation)</strong> reimburses you for driving your privately owned vehicle (POV) to your new duty station. The rate is set annually by the DoD and is calculated based on the official distance from your old station to your new one via the <strong>Defense Table of Official Distances (DTOD)</strong> — not Google Maps.</p>

<p>Important MALT details:</p>
<ul>
<li>You're reimbursed for <strong>one POV</strong> automatically. If you have dependents, you may be authorized MALT for a <strong>second vehicle</strong>.</li>
<li>The current rate is approximately <strong>$0.22/mile</strong> (check the current year's JTR for exact figures).</li>
<li>MALT is in addition to per diem — you get both.</li>
<li>If you fly instead of drive, you won't receive MALT but may receive a government-funded plane ticket or monetary allowance in lieu of transportation.</li>
</ul>

<h2>Per Diem</h2>

<p><strong>Per diem</strong> covers your meals and incidental expenses during PCS travel days. The rate depends on your travel route and whether you're in CONUS or OCONUS. For CONUS travel, the standard per diem rate is approximately <strong>$165/day</strong> (varies by location), with 75% paid on the first and last travel days.</p>

<p>Dependents age 12+ receive <strong>75%</strong> of the member's per diem rate. Dependents under 12 receive <strong>50%</strong>. This adds up quickly for families — a family of four on a 3-day drive can receive over $1,000 in per diem alone.</p>

${tip("Plan your travel days strategically. The JTR allows one travel day per 400 miles of official distance. If your move is 1,100 miles, you get 3 travel days of per diem. Don't rush the drive and lose a day of per diem you're entitled to.")}

<h2>TLE — Temporary Lodging Expense (CONUS)</h2>

<p><strong>TLE</strong> reimburses you for hotel costs during the transition period around your PCS — up to <strong>14 days total</strong>, which can be split between your old and new duty station. TLE covers lodging and meals for you and your dependents at a rate set by locality.</p>

<p>For example, if you need 5 days in a hotel after vacating your old home and 7 days at your new location while waiting for housing, that's 12 of your 14 days used. TLE won't cover your entire hotel bill in most cases — it's a partial reimbursement — but it significantly reduces out-of-pocket costs.</p>

<h2>TLA — Temporary Lodging Allowance (OCONUS)</h2>

<p><strong>TLA</strong> is the OCONUS equivalent of TLE, and it's significantly more generous. TLA can cover <strong>up to 60 days</strong> of lodging at your overseas duty station while you search for permanent housing. The rates vary by location and are set based on local economy costs. In high-cost locations like Tokyo or London, TLA rates can be quite substantial.</p>

<h2>Advance Pay</h2>

<p>You can request an <strong>advance of up to 3 months of base pay</strong> to help bridge the financial gap during your move. This is especially helpful if you have overlapping rent payments or large upfront costs at your new location.</p>

<p>Important: advance pay is a <strong>loan, not a bonus</strong>. It must be repaid within 12 months through automatic payroll deductions. Calculate whether you actually need it — the monthly repayment will reduce your take-home pay for the next year.</p>

<h2>PPM/DITY Reimbursement</h2>

<p>If you choose a <strong>Personally Procured Move (PPM)</strong>, the government reimburses you based on what it would have cost to move the same weight via a government HHG shipment. Many families make <strong>$1,000 to $5,000+ in profit</strong> on a PPM, especially if they declutter and move efficiently.</p>

<p>To claim PPM reimbursement, you'll need:</p>
<ul>
<li>Weight tickets (empty and loaded vehicle weights)</li>
<li>Fuel receipts</li>
<li>Toll receipts</li>
<li>Rental truck/trailer receipts</li>
</ul>

<h2>Other Entitlements to Know</h2>

<ul>
<li><strong>COLA (Cost of Living Allowance):</strong> For OCONUS stations with high local costs, you may receive COLA on top of BAH/OHA.</li>
<li><strong>OHA (Overseas Housing Allowance):</strong> Replaces BAH at OCONUS stations. Covers actual rent up to a cap, plus a utility allowance.</li>
<li><strong>Household Goods Storage (NTS):</strong> Free storage for items you can't bring to your new station, especially common for OCONUS moves.</li>
</ul>

${tip("File your travel voucher within 5 business days of arriving at your new station. Late filing delays reimbursement by weeks. Keep every receipt — gas, hotels, tolls, meals — organized in a folder or envelope during your trip.")}

<h2>Don't Leave Money on the Table</h2>

<p>The total value of PCS entitlements can easily reach <strong>$5,000 to $15,000+</strong> depending on your rank, family size, and distance of the move. Understanding what you're owed — and filing your claims promptly and correctly — is one of the most impactful things you can do for your family's finances during a PCS.</p>

<p>Use our <a href="/entitlements">Entitlements Calculator</a> to estimate your specific numbers, or check the <a href="/guide">PCS Guide</a> for the full picture.</p>

` + relatedBox([
      { slug: "getting-your-pcs-orders", title: "Getting Your PCS Orders: What to Know First" },
      { slug: "pcs-claims-reimbursement", title: "PCS Claims & Reimbursement Guide" },
      { slug: "pcs-move-types", title: "Types of PCS Moves: HHG vs. DITY vs. NTS" },
    ]) + ctaBox
  },

  // ─── POST 4: Planning Your PCS Move ───
  {
    title: "Planning Your PCS Move: The Ultimate Military Move Timeline",
    slug: "planning-your-pcs-move",
    excerpt: "A great PCS starts with a great plan. This step-by-step timeline walks you through everything to do from 90 days out through your first week at the new duty station.",
    author: "PCSing.ai Team",
    tags: ["pcs-planning", "checklist", "timeline"],
    status: "published",
    published_at: "2026-02-28T12:00:00Z",
    seo_title: "Planning Your PCS Move: Military Move Timeline & Checklist",
    seo_description: "Step-by-step PCS planning timeline from 90 days out to move day. Covers scheduling, housing, schools, and everything military families need to plan.",
    og_image: null,
    content: hero("Planning Your PCS Move", "Your step-by-step military move timeline from orders to arrival", "#9333ea,#7c3aed") + `
<p>The difference between a smooth PCS and a chaotic one almost always comes down to planning. The families who start early, follow a timeline, and stay organized are the ones who arrive at their new duty station feeling in control instead of overwhelmed. Here's the complete planning timeline you should follow from the moment orders drop.</p>

<h2>90 Days Out: Lay the Foundation</h2>

<p>The moment you receive PCS orders, your 90-day countdown begins. This is when you set the tone for your entire move.</p>

<h3>Visit TMO/PPO Immediately</h3>
<p>Your Transportation Office should be your first stop. They'll help you create your <strong>DPS (Defense Personal Property System)</strong> account, explain your move options, and start scheduling dates. If you're PCSing during peak season (May–August), every day you wait is a day closer to packed schedules and limited availability.</p>

<h3>Research Your New Duty Station</h3>
<p>Start learning everything you can about where you're headed. Browse our <a href="/bases">Base Directory</a> for installation-specific info, join Facebook groups for your gaining base, and connect with your sponsor. Key questions to answer early:</p>
<ul>
<li>What's the housing market like? On-base waitlist length? Off-base rental prices?</li>
<li>What school options exist for your kids?</li>
<li>What's the commute from popular neighborhoods?</li>
<li>Are there childcare waitlists you need to get on immediately?</li>
</ul>

<h3>Request a Sponsor</h3>
<p>Contact your gaining unit and request a sponsor — an assigned point of contact who's already at the new installation. A good sponsor is one of the most underused resources in the PCS process. They can give you ground-truth answers that no website can provide.</p>

${tip("When you get assigned a sponsor, send them a list of specific questions about housing, neighborhoods, and the base. The more specific you are, the more useful their answers will be. Ask things like 'What's the on-base housing waitlist for an E-6 with dependents?' and 'Which off-base neighborhoods do most families in your unit live in?'")}

<h3>Start Decluttering</h3>
<p>The less you move, the smoother (and cheaper) your PCS will be. Start going through closets, garages, and storage areas. Sell, donate, or trash anything you haven't used in the last year. If you're doing a PPM, less weight means higher profit. If you're doing an HHG move, less stuff means fewer boxes to unpack.</p>

<h2>60 Days Out: Lock in the Details</h2>

<h3>Schedule Your HHG Pickup</h3>
<p>If you haven't already, schedule your household goods pickup date through DPS. For peak season, the earlier the better — movers are booked solid from May through August. Your TMO can help if you're having trouble finding available dates.</p>

<h3>Notify Your Landlord</h3>
<p>If you're renting, give your landlord written notice. Most leases require 30 days, but the <strong>Servicemembers Civil Relief Act (SCRA)</strong> protects you from early termination penalties when you PCS. Provide a copy of your orders with your notice. Coordinate your move-out date with your HHG pickup to minimize days in limbo.</p>

<h3>Start School Research & Registration</h3>
<p>If you have school-age kids, contact the <strong>School Liaison Officer (SLO)</strong> at your gaining installation. They can help with enrollment, records transfers, and navigating differences in state curricula. Some schools have enrollment deadlines or lottery systems — don't miss them.</p>

<h3>Handle Medical & Dental Records</h3>
<p>Schedule final appointments at your current installation's clinic. Get copies of medical and dental records for the whole family (most are digital now, but verify). If anyone is on ongoing treatment or prescriptions, ensure you have enough medication to cover the transition period.</p>

<h3>Register for Childcare</h3>
<p>If you need on-base childcare, register for the <strong>Child Development Center (CDC)</strong> waitlist at your new installation now. Waitlists at popular bases can be 6+ months. Also look into off-base options through the Military Child Care Fee Assistance program.</p>

<h2>30 Days Out: Confirm and Prepare</h2>

<h3>Confirm All Dates</h3>
<p>Double-check your HHG pickup date, travel dates, and temporary lodging reservations. Confirm your report date with your gaining unit. If anything has changed, update DPS and your transportation office immediately.</p>

<h3>Begin Address Changes</h3>
<p>Start changing your address with banks, credit cards, insurance, subscriptions, and the USPS. Set up mail forwarding through USPS (it's free and takes effect in about a week). Update your vehicle registration and insurance to reflect your new state — some states require this within 30 days of arrival.</p>

<h3>Prepare Important Documents</h3>
<p>Gather and organize these in a folder you'll keep with you (not in the moving truck):</p>
<ul>
<li>PCS orders (multiple copies)</li>
<li>Birth certificates and marriage certificate</li>
<li>Social Security cards</li>
<li>Passports (especially for OCONUS)</li>
<li>Medical and dental records</li>
<li>School records and transcripts</li>
<li>Vehicle titles and registration</li>
<li>Insurance policies</li>
<li>Power of attorney (if applicable)</li>
</ul>

<h2>14 Days Out: Final Preparations</h2>

<h3>Pack Your Essentials Bags</h3>
<p>These are the suitcases your family will live out of during the transition — from the day your household goods are packed until they're delivered at your new home. Plan for at least <strong>1-2 weeks</strong> of living out of bags. Include:</p>
<ul>
<li>Enough clothes for 2 weeks</li>
<li>Toiletries and medications</li>
<li>Laptop and chargers</li>
<li>Important documents folder</li>
<li>Kids' favorite toys and comfort items</li>
<li>Basic kitchen supplies (paper plates, utensils, snacks)</li>
<li>Air mattress or sleeping bags if your furniture ships before you leave</li>
</ul>

${tip("Pack a separate 'first night' box that stays with you — sheets, towels, toilet paper, basic cleaning supplies, phone chargers, and coffee supplies. You'll thank yourself when you arrive at an empty house at 10 PM after a long drive.")}

<h3>Schedule Utility Disconnections</h3>
<p>Set disconnect dates for electricity, gas, water, internet, and trash at your current home. Schedule them for the day after your move-out inspection if you're in on-base housing, or your lease end date if renting off-base.</p>

<h2>Move Week: Execute the Plan</h2>

<h3>Pack-Out Day</h3>
<p>Be present for the entire pack-out. Walk through every room with the movers and point out high-value or fragile items. Take photos of electronics, furniture, and anything valuable before they're packed. Ensure the movers create a detailed inventory and that you review it before signing.</p>

<h3>Final Walk-Through</h3>
<p>After the movers leave, do a final sweep of every room, closet, attic, and garage. Check behind doors, under sinks, and in utility areas. Take photos of the condition of the house for your records — this protects you in housing disputes later.</p>

<h3>Hit the Road</h3>
<p>Follow your planned route, keep your receipts for gas and tolls, and don't rush. Remember, you get per diem for each authorized travel day — pushing to make it in fewer days means less reimbursement and more exhaustion.</p>

<p>For a printable version of this timeline, use our interactive <a href="/checklist">PCS Checklist</a> — it tracks your progress and sends reminders so nothing falls through the cracks.</p>

` + relatedBox([
      { slug: "what-is-a-pcs-move", title: "What Is a PCS Move? The Complete Guide" },
      { slug: "pcs-move-types", title: "Types of PCS Moves: HHG vs. DITY vs. NTS" },
      { slug: "military-base-housing", title: "Military Base Housing: On-Post vs. Off-Post" },
    ]) + ctaBox
  },
];

async function seed() {
  console.log("Seeding blog posts...\n");
  for (const post of posts) {
    const { error } = await supabase
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" });
    if (error) {
      console.error(`✗ ${post.slug}: ${error.message}`);
    } else {
      console.log(`✓ ${post.slug}`);
    }
  }
  console.log("\nDone! Seeded", posts.length, "posts.");
}

seed();
