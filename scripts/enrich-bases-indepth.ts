import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const IN_DEPTH_URL =
  "https://installations.militaryonesource.mil/in-depth-overview";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── HTML parsing for in-depth page ──────────────────────────────

interface InDepthData {
  weather_info: string | null;
  cost_of_living: Record<string, string> | null;
  special_info: string | null;
  history: string | null;
  photos: string[];
}

function parseInDepthPage(html: string): InDepthData | null {
  const $ = cheerio.load(html);

  const title = $("title").text();
  if (title.includes("Page Not Found") || title.includes("404")) return null;

  // ── Weather ──
  let weather_info: string | null = null;
  $("h3").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (heading.includes("weather")) {
      // Gather paragraphs following this heading
      const paragraphs: string[] = [];
      let next = $(el).next();
      while (next.length && next.prop("tagName") !== "H3" && next.prop("tagName") !== "H2") {
        if (next.prop("tagName") === "P") {
          const text = next.text().trim();
          if (text) paragraphs.push(text);
        }
        next = next.next();
      }
      if (paragraphs.length > 0) {
        weather_info = paragraphs.slice(0, 3).join(" ");
      }
    }
  });

  // ── Cost of Living ──
  let cost_of_living: Record<string, string> | null = null;
  $("h2, h3").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (heading.includes("cost of living")) {
      const col: Record<string, string> = {};

      // Gather all text content after this heading
      const textParts: string[] = [];
      let next = $(el).next();
      while (next.length && next.prop("tagName") !== "H2") {
        const text = next.text().trim();
        if (text) textParts.push(text);
        // Also check list items
        next.find("li").each((_, li) => {
          textParts.push($(li).text().trim());
        });
        next = next.next();
      }

      const allText = textParts.join("\n");

      // Extract description (first paragraph-like text)
      const descMatch = allText.match(/cost\s+(?:of\s+)?living\s+is\s+(.+?)(?:\.|$)/i);
      if (descMatch) {
        col.description = descMatch[0].trim();
      }

      // Extract dollar amounts with labels
      const incomeMatch = allText.match(/(?:average\s+)?household\s+income[:\s]*\$?([\d,]+)/i);
      if (incomeMatch) col.avg_household_income = `$${incomeMatch[1]}`;

      const homeMatch = allText.match(/(?:average\s+)?home\s+(?:sale\s+)?price[^:]*[:\s]*\$?([\d,]+)/i);
      if (homeMatch) col.avg_home_price = `$${homeMatch[1]}`;

      const rent1Match = allText.match(/1[\s-]*(?:bed(?:room)?|br)[:\s]*\$?([\d,]+)/i);
      if (rent1Match) col.avg_rent_1br = `$${rent1Match[1]}`;

      const rent2Match = allText.match(/2[\s-]*(?:bed(?:room)?|br)[:\s]*\$?([\d,]+)/i);
      if (rent2Match) col.avg_rent_2br = `$${rent2Match[1]}`;

      const rent3Match = allText.match(/3[\s-]*(?:bed(?:room)?|br)[:\s]*\$?([\d,]+)/i);
      if (rent3Match) col.avg_rent_3br = `$${rent3Match[1]}`;

      if (Object.keys(col).length > 0) {
        cost_of_living = col;
      }
    }
  });

  // ── Special and Critical Installation Information ──
  let special_info: string | null = null;
  $("h2, h3").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (heading.includes("special") && heading.includes("critical")) {
      const paragraphs: string[] = [];
      let next = $(el).next();
      while (next.length && next.prop("tagName") !== "H2") {
        if (next.prop("tagName") === "P") {
          const text = next.text().trim();
          if (text) paragraphs.push(text);
        }
        // Also grab sub-section content (h3 sections within)
        if (next.prop("tagName") === "H3") {
          const subHeading = next.text().trim();
          let subNext = next.next();
          const subParagraphs: string[] = [];
          while (subNext.length && subNext.prop("tagName") !== "H3" && subNext.prop("tagName") !== "H2") {
            if (subNext.prop("tagName") === "P") {
              const text = subNext.text().trim();
              if (text) subParagraphs.push(text);
            }
            subNext = subNext.next();
          }
          if (subParagraphs.length > 0 && !subHeading.toLowerCase().includes("weather")) {
            paragraphs.push(`${subHeading}: ${subParagraphs.slice(0, 2).join(" ")}`);
          }
        }
        next = next.next();
      }
      if (paragraphs.length > 0) {
        special_info = paragraphs.slice(0, 3).join("\n\n");
      }
    }
  });

  // ── History ──
  let history: string | null = null;
  $("h3").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (heading === "history") {
      const paragraphs: string[] = [];
      let next = $(el).next();
      while (next.length && next.prop("tagName") !== "H3" && next.prop("tagName") !== "H2") {
        if (next.prop("tagName") === "P") {
          const text = next.text().trim();
          if (text) paragraphs.push(text);
        }
        next = next.next();
      }
      if (paragraphs.length > 0) {
        history = paragraphs.slice(0, 3).join("\n\n");
      }
    }
  });

  // ── Photos ──
  const photos: string[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src.includes("display_image") || src.includes("lsn.itc_htmldb")) {
      if (!photos.includes(src) && photos.length < 5) {
        photos.push(src);
      }
    }
  });

  // If nothing was parsed at all, return null
  if (!weather_info && !cost_of_living && !special_info && !history && photos.length === 0) {
    return null;
  }

  return { weather_info, cost_of_living, special_info, history, photos };
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  // Fetch bases that have a militaryonesource_slug
  const { data: bases, error } = await sb
    .from("bases")
    .select("slug, name, militaryonesource_slug")
    .not("militaryonesource_slug", "is", null)
    .order("slug");

  if (error || !bases) {
    console.error("Failed to fetch bases:", error);
    process.exit(1);
  }

  console.log(`Found ${bases.length} bases with MOS slugs\n`);

  let enriched = 0;
  const failed: string[] = [];
  const noData: string[] = [];

  for (let i = 0; i < bases.length; i++) {
    const base = bases[i];
    const mosSlug = base.militaryonesource_slug;
    const progress = `[${i + 1}/${bases.length}]`;

    try {
      const url = `${IN_DEPTH_URL}/${mosSlug}`;
      const resp = await fetch(url, { redirect: "follow" });

      if (!resp.ok) {
        console.log(`${progress} SKIP ${base.slug} (HTTP ${resp.status})`);
        failed.push(base.slug);
        if (i < bases.length - 1) await sleep(2000);
        continue;
      }

      const html = await resp.text();
      const parsed = parseInDepthPage(html);

      if (!parsed) {
        console.log(`${progress} SKIP ${base.slug} (no data found on in-depth page)`);
        noData.push(base.slug);
      } else {
        const update: Record<string, unknown> = {};
        if (parsed.weather_info) update.weather_info = parsed.weather_info;
        if (parsed.cost_of_living) update.cost_of_living = parsed.cost_of_living;
        if (parsed.special_info) update.special_info = parsed.special_info;
        if (parsed.history) update.history = parsed.history;
        if (parsed.photos.length > 0) update.photos = parsed.photos;

        if (Object.keys(update).length === 0) {
          console.log(`${progress} SKIP ${base.slug} (all fields empty)`);
          noData.push(base.slug);
        } else {
          const { error: updateErr } = await sb
            .from("bases")
            .update(update)
            .eq("slug", base.slug);

          if (updateErr) {
            console.log(`${progress} FAIL ${base.slug} (db: ${updateErr.message})`);
            failed.push(base.slug);
          } else {
            const fields = Object.keys(update).join(", ");
            console.log(`${progress} OK ${base.slug} (${fields})`);
            enriched++;
          }
        }
      }
    } catch (err: any) {
      console.log(`${progress} FAIL ${base.slug} (${err.message})`);
      failed.push(base.slug);
    }

    if (i < bases.length - 1) await sleep(2000);
  }

  console.log(`\n========================================`);
  console.log(`Enriched: ${enriched} / ${bases.length}`);
  if (failed.length > 0) {
    console.log(`\nFailed (${failed.length}):`);
    failed.forEach((f) => console.log(`  - ${f}`));
  }
  if (noData.length > 0) {
    console.log(`\nNo in-depth data (${noData.length}):`);
    noData.forEach((f) => console.log(`  - ${f}`));
  }
}

main().catch(console.error);
