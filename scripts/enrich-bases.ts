import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import { readFileSync } from "fs";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL =
  "https://installations.militaryonesource.mil/military-installation";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Load the pre-built MOS slug map ──────────────────────────────
const mosMap: Record<string, string> = JSON.parse(
  readFileSync("scripts/mos-slug-map.json", "utf-8")
);
// Build reverse lookup: mosSlug -> mosName
const mosSlugToName: Record<string, string> = {};
for (const [name, slug] of Object.entries(mosMap)) {
  mosSlugToName[slug] = name;
}
const mosNames = Object.keys(mosMap);
const mosSlugs = Object.values(mosMap);

// ── Fuzzy matching ───────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bjoint base\b/g, "jb")
    .replace(/\bair force base\b/g, "afb")
    .replace(/\bair force station\b/g, "afs")
    .replace(/\bspace force base\b/g, "sfb")
    .replace(/\bspace force station\b/g, "sfs")
    .replace(/\bnaval air station\b/g, "nas")
    .replace(/\bmarine corps air station\b/g, "mcas")
    .replace(/\bnaval station\b/g, "ns")
    .replace(/\bnaval support activity\b/g, "nsa")
    .replace(/\bnaval support facility\b/g, "nsf")
    .replace(/\barmy depot\b/g, "ad")
    .replace(/[^a-z0-9]/g, "");
}

// Fort renames: our name -> MOS name
const fortRenames: Record<string, string> = {
  "fort liberty": "fort bragg",
  "fort barfoot": "fort lee",
  "fort novosel": "fort rucker",
  "fort moore": "fort benning",
  "fort eisenhower": "fort gordon",
  "fort johnson": "fort polk",
  "fort cavazos": "fort hood",
  "fort walker": "fort a.p. hill",
  "fort gregg-adams": "fort lee",
};

function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function findBestMatch(
  ourName: string,
  ourSlug: string
): { mosName: string; mosSlug: string; method: string } | null {
  const ourNorm = normalize(ourName);

  // Check fort renames first
  const ourLower = ourName.toLowerCase();
  for (const [newName, oldName] of Object.entries(fortRenames)) {
    if (ourLower.startsWith(newName)) {
      // Find MOS entry with old name
      const suffix = ourLower.slice(newName.length).trim();
      for (const mosName of mosNames) {
        if (mosName.toLowerCase().startsWith(oldName)) {
          return { mosName, mosSlug: mosMap[mosName], method: "fort-rename" };
        }
      }
    }
  }

  // 1) Exact slug match
  if (mosSlugs.includes(ourSlug)) {
    const mosName = mosSlugToName[ourSlug];
    return { mosName, mosSlug: ourSlug, method: "exact-slug" };
  }

  // 2) Exact normalized name match
  for (const mosName of mosNames) {
    if (normalize(mosName) === ourNorm) {
      return { mosName, mosSlug: mosMap[mosName], method: "exact-name" };
    }
  }

  // 3) One contains the other (normalized), minimum 6 chars to avoid short false matches
  if (ourNorm.length >= 6) {
    for (const mosName of mosNames) {
      const mosNorm = normalize(mosName);
      if (mosNorm.length >= 6 && (mosNorm.includes(ourNorm) || ourNorm.includes(mosNorm))) {
        // Require the shorter to be at least 60% of the longer
        const shorter = Math.min(mosNorm.length, ourNorm.length);
        const longer = Math.max(mosNorm.length, ourNorm.length);
        if (shorter / longer > 0.5) {
          return { mosName, mosSlug: mosMap[mosName], method: "contains" };
        }
      }
    }
  }

  // 4) Slug-based containment
  for (const mosSlug of mosSlugs) {
    if (ourSlug.includes(mosSlug) || mosSlug.includes(ourSlug)) {
      const shorter = Math.min(ourSlug.length, mosSlug.length);
      const longer = Math.max(ourSlug.length, mosSlug.length);
      if (shorter / longer > 0.65) {
        return {
          mosName: mosSlugToName[mosSlug],
          mosSlug,
          method: "slug-contains",
        };
      }
    }
  }

  // 5) Levenshtein on normalized names (threshold: <=2 edits, and <=15% of length)
  let bestDist = Infinity;
  let bestMosName = "";
  for (const mosName of mosNames) {
    const mosNorm = normalize(mosName);
    const dist = levenshtein(ourNorm, mosNorm);
    if (dist < bestDist) {
      bestDist = dist;
      bestMosName = mosName;
    }
  }
  const maxLen = Math.max(ourNorm.length, normalize(bestMosName).length);
  if (bestDist <= 2 && bestDist / maxLen <= 0.15 && bestMosName) {
    return {
      mosName: bestMosName,
      mosSlug: mosMap[bestMosName],
      method: `levenshtein(${bestDist})`,
    };
  }

  return null;
}

// ── HTML parsing ─────────────────────────────────────────────────

interface ParsedData {
  phone: string | null;
  address: string | null;
  description: string | null;
  operating_hours: string | null;
  dsn_phone: string | null;
  website: string | null;
}

function parseInstallationPage(html: string): ParsedData | null {
  const $ = cheerio.load(html);

  // Check if 404
  const title = $("title").text();
  if (title.includes("Page Not Found") || title.includes("404")) return null;
  const instId = $("#P0_INST_ID").val();
  if (!instId) return null;

  // JSON-LD structured data
  let phone: string | null = null;
  let address: string | null = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (data["@type"] === "DefenceEstablishment") {
        if (data.telephone) {
          phone = data.telephone.replace("+1-", "").trim();
        }
        if (data.address) {
          const a = data.address;
          const parts = [
            a.streetAddress,
            a.addressLocality,
            a.addressRegion,
            a.postalCode,
          ].filter(Boolean);
          address = parts.join(", ");
        }
      }
    } catch {}
  });

  // Mission description
  let description: string | null = null;
  const missionSection = $(".hide-show1.critical-info");
  const missionTitle = missionSection.find("h3.section-title").first();
  if (missionTitle.text().trim() === "Mission") {
    const firstP = missionSection
      .find(".section-text")
      .first()
      .find("p")
      .first()
      .text()
      .trim();
    if (firstP) {
      description = firstP.replace(/^Mission\s*[-–—]\s*/i, "").trim();
    }
  }

  // Phone fallback from contact card
  if (!phone) {
    const phoneLink = $(
      "#miContactInfo2_cards a[data-type='phone number']"
    ).first();
    if (phoneLink.length) phone = phoneLink.text().trim();
  }

  // DSN phone
  let dsn_phone: string | null = null;
  $("#miContactInfo2_cards button.show-number").each((_, el) => {
    const label = $(el).attr("aria-label") || "";
    if (label.includes("DSN") && !label.includes("FAX")) {
      const nextP = $(el).next("p.card-phone-text.hide");
      const text = nextP.find("span").first().text().trim();
      if (text && !dsn_phone) dsn_phone = text;
    }
  });

  // Address fallback
  if (!address) {
    const addressDiv = $("#miContactInfo2_cards .card-text").first();
    if (addressDiv.length) {
      const addrParts = addressDiv
        .find("p")
        .map((_, p) => $(p).text().trim())
        .get();
      address = addrParts.join(", ");
    }
  }

  // Operating hours
  let operating_hours: string | null = null;
  const hoursRegex =
    /\b(a\.m\.|p\.m\.|am|pm|M-F|Mon|Tue|Wed|Thu|Fri|Sat|Sun|24\s*hr|24\/7|hours)/i;
  $("#miContactInfo2_cards .card-item.arvo").each((_, el) => {
    const classes = $(el).attr("class") || "";
    if (classes.includes("card-text")) return;
    const text = $(el).text().trim();
    if (hoursRegex.test(text) && !operating_hours) {
      operating_hours = text;
    }
  });

  // Website
  let website: string | null = null;
  const websiteLink = $(
    "#miContactInfo2_cards a[data-type='website']"
  ).first();
  if (websiteLink.length) website = websiteLink.attr("href") || null;

  return { phone, address, description, operating_hours, dsn_phone, website };
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log(`MOS map: ${Object.keys(mosMap).length} installations loaded`);

  const { data: bases, error } = await sb
    .from("bases")
    .select("slug, name")
    .order("slug");

  if (error || !bases) {
    console.error("Failed to fetch bases:", error);
    process.exit(1);
  }

  console.log(`Supabase: ${bases.length} bases\n`);

  // Phase 1: Match all bases to MOS slugs
  const matched: { ourSlug: string; mosSlug: string; method: string }[] = [];
  const unmatched: string[] = [];

  for (const base of bases) {
    const result = findBestMatch(base.name, base.slug);
    if (result) {
      matched.push({
        ourSlug: base.slug,
        mosSlug: result.mosSlug,
        method: result.method,
      });
    } else {
      unmatched.push(`${base.slug} (${base.name})`);
    }
  }

  console.log(`Matched: ${matched.length} / ${bases.length}`);
  console.log(`Unmatched: ${unmatched.length}\n`);

  // Phase 2: Fetch + parse + update each matched base
  let enriched = 0;
  const failed: string[] = [];

  for (let i = 0; i < matched.length; i++) {
    const { ourSlug, mosSlug, method } = matched[i];
    const progress = `[${i + 1}/${matched.length}]`;

    try {
      const resp = await fetch(`${BASE_URL}/${mosSlug}`, {
        redirect: "follow",
      });
      const html = await resp.text();
      const parsed = parseInstallationPage(html);

      if (!parsed) {
        console.log(`${progress} FAIL ${ourSlug} (MOS page invalid: ${mosSlug})`);
        failed.push(ourSlug);
      } else {
        const update: Record<string, unknown> = {
          militaryonesource_slug: mosSlug,
          last_enriched_at: new Date().toISOString(),
        };
        if (parsed.phone) update.phone = parsed.phone;
        if (parsed.address) update.address = parsed.address;
        if (parsed.description) update.description = parsed.description;
        if (parsed.operating_hours)
          update.operating_hours = parsed.operating_hours;
        if (parsed.dsn_phone) update.dsn_phone = parsed.dsn_phone;
        if (parsed.website) update.website = parsed.website;

        const { error: updateErr } = await sb
          .from("bases")
          .update(update)
          .eq("slug", ourSlug);

        if (updateErr) {
          console.log(
            `${progress} FAIL ${ourSlug} (db: ${updateErr.message})`
          );
          failed.push(ourSlug);
        } else {
          const note = mosSlug !== ourSlug ? ` (MOS: ${mosSlug}, ${method})` : "";
          console.log(`${progress} OK ${ourSlug}${note}`);
          enriched++;
        }
      }
    } catch (err: any) {
      console.log(`${progress} FAIL ${ourSlug} (${err.message})`);
      failed.push(ourSlug);
    }

    if (i < matched.length - 1) await sleep(2000);
  }

  console.log(`\n========================================`);
  console.log(`Enriched ${enriched} of ${bases.length} bases.`);
  if (failed.length > 0) {
    console.log(`\nFetch/parse failures (${failed.length}):`);
    failed.forEach((f) => console.log(`  - ${f}`));
  }
  if (unmatched.length > 0) {
    console.log(`\nNo MOS match found (${unmatched.length}):`);
    unmatched.forEach((u) => console.log(`  - ${u}`));
  }
}

main().catch(console.error);
