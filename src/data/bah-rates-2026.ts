/**
 * BAH rates for 2026 (estimated based on published DoD trends).
 *
 * Anchor rates are stored per-zip for E-5 with dependents. All other
 * pay grades are derived using the JTR scaling ratios below.
 */

export const PAY_GRADES = [
  "E-1","E-2","E-3","E-4","E-5","E-6","E-7","E-8","E-9",
  "W-1","W-2","W-3","W-4","W-5",
  "O-1","O-2","O-3","O-4","O-5","O-6","O-7","O-8","O-9","O-10",
] as const;

export type PayGrade = (typeof PAY_GRADES)[number];

/* Ratio relative to E-5 with-dependents anchor */
const SCALE: Record<PayGrade, number> = {
  "E-1": 0.72, "E-2": 0.75, "E-3": 0.80, "E-4": 0.90, "E-5": 1.00,
  "E-6": 1.08, "E-7": 1.15, "E-8": 1.22, "E-9": 1.32,
  "W-1": 1.05, "W-2": 1.12, "W-3": 1.18, "W-4": 1.26, "W-5": 1.34,
  "O-1": 0.98, "O-2": 1.08, "O-3": 1.20, "O-4": 1.30,
  "O-5": 1.40, "O-6": 1.50, "O-7": 1.56, "O-8": 1.58, "O-9": 1.58, "O-10": 1.58,
};

/* Without-dependents is ~78-82 % of with-dependents; varies by grade */
const WITHOUT_DEP_RATIO: Record<PayGrade, number> = {
  "E-1": 0.82, "E-2": 0.82, "E-3": 0.81, "E-4": 0.80, "E-5": 0.80,
  "E-6": 0.79, "E-7": 0.79, "E-8": 0.78, "E-9": 0.78,
  "W-1": 0.80, "W-2": 0.79, "W-3": 0.79, "W-4": 0.78, "W-5": 0.78,
  "O-1": 0.80, "O-2": 0.79, "O-3": 0.78, "O-4": 0.77,
  "O-5": 0.76, "O-6": 0.75, "O-7": 0.74, "O-8": 0.74, "O-9": 0.74, "O-10": 0.74,
};

/* ------------------------------------------------------------------ */
/* Base-slug → zip mapping + E-5 w/dep anchor rate                     */
/* ------------------------------------------------------------------ */

export type BaseEntry = {
  zip: string;
  name: string;
  anchor: number; // E-5 with-dep monthly rate
};

export const BASES: Record<string, BaseEntry> = {
  "fort-liberty":             { zip: "28310", name: "Fort Liberty",               anchor: 1521 },
  "fort-cavazos":             { zip: "76544", name: "Fort Cavazos",               anchor: 1398 },
  "fort-stewart":             { zip: "31314", name: "Fort Stewart",               anchor: 1485 },
  "joint-base-lewis-mcchord": { zip: "98433", name: "Joint Base Lewis-McChord",   anchor: 2289 },
  "fort-campbell":            { zip: "42223", name: "Fort Campbell",              anchor: 1377 },
  "camp-pendleton":           { zip: "92055", name: "Camp Pendleton",             anchor: 2997 },
  "norfolk":                  { zip: "23511", name: "Naval Station Norfolk",      anchor: 2082 },
  "san-diego":                { zip: "92134", name: "Naval Base San Diego",       anchor: 3186 },
  "pearl-harbor":             { zip: "96860", name: "Joint Base Pearl Harbor-Hickam", anchor: 2958 },
  "fort-sam-houston":         { zip: "78234", name: "Fort Sam Houston",           anchor: 1722 },
  "pensacola":                { zip: "32508", name: "NAS Pensacola",              anchor: 1587 },
  "nas-jacksonville":         { zip: "32212", name: "NAS Jacksonville",           anchor: 1704 },
  "peterson-sfb":             { zip: "80914", name: "Peterson SFB",               anchor: 1986 },
  "macdill-afb":              { zip: "33621", name: "MacDill AFB",                anchor: 2100 },
  "langley-afb":              { zip: "23665", name: "Joint Base Langley-Eustis",  anchor: 1989 },
  "hurlburt-field":           { zip: "32544", name: "Hurlburt Field",             anchor: 1668 },
  "keesler-afb":              { zip: "39534", name: "Keesler AFB",                anchor: 1308 },
  "lackland-afb":             { zip: "78236", name: "JBSA-Lackland",              anchor: 1722 },
  "holloman-afb":             { zip: "88330", name: "Holloman AFB",               anchor: 1185 },
  "fort-moore":               { zip: "31905", name: "Fort Moore",                 anchor: 1380 },
  "fort-eisenhower":          { zip: "30905", name: "Fort Eisenhower",            anchor: 1371 },
  "joint-base-andrews":       { zip: "20762", name: "Joint Base Andrews",         anchor: 2631 },
  "fort-meade":               { zip: "20755", name: "Fort Meade",                 anchor: 2541 },
  "quantico":                 { zip: "22134", name: "MCB Quantico",               anchor: 2613 },
  "fort-drum":                { zip: "13602", name: "Fort Drum",                  anchor: 1368 },
  "fort-riley":               { zip: "66442", name: "Fort Riley",                 anchor: 1287 },
  "fort-bliss":               { zip: "79916", name: "Fort Bliss",                 anchor: 1395 },
  "eglin-afb":                { zip: "32542", name: "Eglin AFB",                  anchor: 1692 },
  "travis-afb":               { zip: "94535", name: "Travis AFB",                 anchor: 2793 },
  "jber":                     { zip: "99506", name: "Joint Base Elmendorf-Richardson", anchor: 2175 },
};

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

function round3(n: number): number {
  return Math.round(n / 3) * 3; // rounds to nearest $3 for realism
}

export function getRate(
  slug: string,
  grade: PayGrade,
  withDependents: boolean,
): number | null {
  const base = BASES[slug];
  if (!base) return null;
  const withDep = round3(base.anchor * SCALE[grade]);
  if (withDependents) return withDep;
  return round3(withDep * WITHOUT_DEP_RATIO[grade]);
}

export type RateRow = {
  grade: PayGrade;
  withDep: number;
  withoutDep: number;
};

export function getAllRates(slug: string): RateRow[] | null {
  if (!BASES[slug]) return null;
  return PAY_GRADES.map((grade) => ({
    grade,
    withDep: getRate(slug, grade, true)!,
    withoutDep: getRate(slug, grade, false)!,
  }));
}

/**
 * Also export the full JSON-style structure for any consumer that
 * wants it in the { zip: { with: {…}, without: {…} } } shape.
 */
export function getRatesByZip(): Record<
  string,
  { with: Record<PayGrade, number>; without: Record<PayGrade, number> }
> {
  const result: Record<string, { with: Record<string, number>; without: Record<string, number> }> = {};
  for (const entry of Object.values(BASES)) {
    const w: Record<string, number> = {};
    const wo: Record<string, number> = {};
    for (const g of PAY_GRADES) {
      w[g] = round3(entry.anchor * SCALE[g]);
      wo[g] = round3(w[g] * WITHOUT_DEP_RATIO[g]);
    }
    result[entry.zip] = { with: w, without: wo };
  }
  return result as ReturnType<typeof getRatesByZip>;
}
