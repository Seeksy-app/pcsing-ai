/**
 * Parses Firecrawl markdown output from a MilitaryOneSource
 * installation page into structured resource records.
 */

export type ParsedResource = {
  category: string;
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  website?: string;
  hours?: string;
};

const CATEGORY_MAP: Record<string, string> = {
  "in-processing": "in-processing",
  "inprocessing": "in-processing",
  "newcomer": "in-processing",
  "housing": "housing",
  "commissary": "commissary",
  "exchange": "exchange",
  "px": "exchange",
  "bx": "exchange",
  "nex": "exchange",
  "shoppette": "exchange",
  "medical": "medical",
  "health": "medical",
  "tricare": "medical",
  "hospital": "medical",
  "clinic": "medical",
  "dental": "dental",
  "child care": "childcare",
  "childcare": "childcare",
  "child development": "childcare",
  "cdc": "childcare",
  "youth": "childcare",
  "school": "schools",
  "education": "schools",
  "school liaison": "schools",
  "legal": "legal",
  "judge advocate": "legal",
  "jag": "legal",
  "finance": "finance",
  "pay": "finance",
  "dfas": "finance",
  "chapel": "chapel",
  "chaplain": "chapel",
  "religious": "chapel",
  "mwr": "mwr",
  "morale": "mwr",
  "recreation": "mwr",
  "fitness": "fitness",
  "gym": "fitness",
  "aquatic": "fitness",
  "pool": "fitness",
  "dining": "dining",
  "food": "dining",
  "dfac": "dining",
  "transportation": "transportation",
  "vehicle": "transportation",
  "license": "transportation",
  "veterinary": "veterinary",
  "vet ": "veterinary",
  "family": "family-support",
  "spouse": "family-support",
  "acs": "family-support",
  "fleet and family": "family-support",
  "airman & family": "family-support",
  "employment": "employment",
  "career": "employment",
  "transition": "employment",
  "sfl-tap": "employment",
};

function classifyHeading(heading: string): string {
  const lower = heading.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return "other";
}

const PHONE_RE = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const URL_RE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
const BARE_URL_RE = /(?:^|\s)(https?:\/\/\S+)/g;
const HOURS_KEYWORDS = [
  "hours",
  "open",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
  "a.m.",
  "p.m.",
  "am-",
  "pm-",
];

function extractPhone(text: string): string | undefined {
  const match = text.match(PHONE_RE);
  return match ? match[0] : undefined;
}

function extractUrl(text: string): string | undefined {
  const mdMatch = URL_RE.exec(text);
  if (mdMatch) return mdMatch[2];
  const bareMatch = BARE_URL_RE.exec(text);
  if (bareMatch) return bareMatch[1];
  return undefined;
}

function looksLikeHours(line: string): boolean {
  const lower = line.toLowerCase();
  return HOURS_KEYWORDS.some((kw) => lower.includes(kw));
}

export function parseResources(markdown: string): ParsedResource[] {
  if (!markdown) return [];

  const resources: ParsedResource[] = [];
  // Split by heading (## or ###)
  const sections = markdown.split(/^#{2,3}\s+/m);

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.split("\n");
    const heading = lines[0]?.trim() || "";
    if (!heading) continue;

    const category = classifyHeading(heading);
    const body = lines.slice(1).join("\n").trim();
    if (!body) continue;

    // Try to find individual entries within the section
    // Entries are often separated by bold text (**Name**) or bullet points
    const entries = body.split(/(?=\*\*[^*]+\*\*)|(?=^[-*]\s)/m);

    if (entries.length > 1) {
      for (const entry of entries) {
        const trimmed = entry.trim();
        if (!trimmed || trimmed.length < 5) continue;

        // Extract name from bold text
        const boldMatch = trimmed.match(/\*\*([^*]+)\*\*/);
        const name = boldMatch
          ? boldMatch[1].trim()
          : trimmed.split("\n")[0]?.replace(/^[-*]\s*/, "").trim() || "";

        if (!name || name.length < 2) continue;

        const phone = extractPhone(trimmed);
        const website = extractUrl(trimmed);

        // Find hours line
        const hoursLine = trimmed
          .split("\n")
          .find((l) => looksLikeHours(l));
        const hours = hoursLine?.replace(/^[-*]\s*/, "").trim();

        // Build description from remaining content
        const descLines = trimmed
          .split("\n")
          .filter(
            (l) =>
              !l.includes("**") &&
              !PHONE_RE.test(l) &&
              !looksLikeHours(l) &&
              l.trim().length > 10
          );
        const description = descLines
          .map((l) => l.replace(/^[-*]\s*/, "").trim())
          .join(" ")
          .trim()
          .slice(0, 500) || undefined;

        resources.push({
          category,
          name,
          description,
          phone,
          website,
          hours,
        });
      }
    } else {
      // Treat the whole section as one resource
      const phone = extractPhone(body);
      const website = extractUrl(body);
      const hoursLine = body.split("\n").find((l) => looksLikeHours(l));
      const description = body
        .split("\n")
        .filter((l) => l.trim().length > 10)
        .slice(0, 3)
        .map((l) => l.replace(/^[-*]\s*/, "").trim())
        .join(" ")
        .slice(0, 500) || undefined;

      resources.push({
        category,
        name: heading.replace(/[#*]/g, "").trim(),
        description,
        phone,
        website,
        hours: hoursLine?.replace(/^[-*]\s*/, "").trim(),
      });
    }
  }

  return resources;
}
