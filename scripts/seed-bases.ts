/**
 * Seed script — inserts 250+ CONUS (and select OCONUS) military bases
 * into the Supabase `bases` table, then geocodes any missing lat/lng.
 *
 * Usage:
 *   npx tsx scripts/seed-bases.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

// ─── Supabase admin client ──────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── Types ──────────────────────────────────────────────────────────
type BaseSeed = {
  name: string;
  slug: string;
  branch: string;
  city: string;
  state: string;
  state_full: string;
  militaryonesource_slug: string;
};

// ─── State abbreviation → full name ─────────────────────────────────
const STATE_FULL: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

// ─── Helper: slugify ────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Helper: build base entry ───────────────────────────────────────
function base(
  name: string,
  branch: string,
  city: string,
  state: string,
  mosSlug?: string
): BaseSeed {
  return {
    name,
    slug: slugify(name),
    branch,
    city,
    state,
    state_full: STATE_FULL[state] || state,
    militaryonesource_slug: mosSlug || slugify(name),
  };
}

// ─── All bases ──────────────────────────────────────────────────────
const BASES: BaseSeed[] = [
  // ═══════════════════════════════════════════
  // ARMY
  // ═══════════════════════════════════════════
  base("Fort Liberty", "Army", "Fayetteville", "NC", "fort-liberty"),
  base("Fort Cavazos", "Army", "Killeen", "TX", "fort-cavazos"),
  base("Fort Carson", "Army", "Colorado Springs", "CO", "fort-carson"),
  base("Fort Campbell", "Army", "Clarksville", "TN", "fort-campbell"),
  base("Fort Bliss", "Army", "El Paso", "TX", "fort-bliss"),
  base("Fort Drum", "Army", "Watertown", "NY", "fort-drum"),
  base("Fort Riley", "Army", "Junction City", "KS", "fort-riley"),
  base("Fort Leonard Wood", "Army", "Waynesville", "MO", "fort-leonard-wood"),
  base("Fort Irwin", "Army", "Fort Irwin", "CA", "fort-irwin"),
  base("Fort Moore", "Army", "Columbus", "GA", "fort-moore"),
  base("Fort Eisenhower", "Army", "Augusta", "GA", "fort-eisenhower"),
  base("Fort Sill", "Army", "Lawton", "OK", "fort-sill"),
  base("Fort Jackson", "Army", "Columbia", "SC", "fort-jackson"),
  base("Fort Johnson", "Army", "Leesville", "LA", "fort-johnson"),
  base("Fort Huachuca", "Army", "Sierra Vista", "AZ", "fort-huachuca"),
  base("Fort Knox", "Army", "Fort Knox", "KY", "fort-knox"),
  base("Fort Leavenworth", "Army", "Leavenworth", "KS", "fort-leavenworth"),
  base("Fort Meade", "Army", "Fort Meade", "MD", "fort-meade"),
  base("Fort Belvoir", "Army", "Fort Belvoir", "VA", "fort-belvoir"),
  base(
    "Joint Base Lewis-McChord",
    "Army",
    "Tacoma",
    "WA",
    "joint-base-lewis-mcchord"
  ),
  base(
    "Joint Base Myer-Henderson Hall",
    "Army",
    "Arlington",
    "VA",
    "joint-base-myer-henderson-hall"
  ),
  base(
    "Aberdeen Proving Ground",
    "Army",
    "Aberdeen",
    "MD",
    "aberdeen-proving-ground"
  ),
  base("Carlisle Barracks", "Army", "Carlisle", "PA", "carlisle-barracks"),
  base("Yuma Proving Ground", "Army", "Yuma", "AZ", "yuma-proving-ground"),
  base(
    "Dugway Proving Ground",
    "Army",
    "Dugway",
    "UT",
    "dugway-proving-ground"
  ),
  base(
    "White Sands Missile Range",
    "Army",
    "Las Cruces",
    "NM",
    "white-sands-missile-range"
  ),
  base("West Point", "Army", "West Point", "NY", "west-point"),
  base("Fort Stewart", "Army", "Hinesville", "GA", "fort-stewart"),
  base("Fort Wainwright", "Army", "Fairbanks", "AK", "fort-wainwright"),
  base("Fort Greely", "Army", "Delta Junction", "AK", "fort-greely"),
  base("Schofield Barracks", "Army", "Wahiawa", "HI", "schofield-barracks"),
  base("Fort Shafter", "Army", "Honolulu", "HI", "fort-shafter"),
  base("Fort Detrick", "Army", "Frederick", "MD", "fort-detrick"),
  base("Fort Hamilton", "Army", "Brooklyn", "NY", "fort-hamilton"),
  base("Fort McCoy", "Army", "Sparta", "WI", "fort-mccoy"),
  base("Rock Island Arsenal", "Army", "Rock Island", "IL", "rock-island-arsenal"),
  base("Picatinny Arsenal", "Army", "Wharton", "NJ", "picatinny-arsenal"),
  base("Redstone Arsenal", "Army", "Huntsville", "AL", "redstone-arsenal"),
  base("Natick Soldier Systems Center", "Army", "Natick", "MA", "natick-soldier-systems-center"),
  base("Fort Buchanan", "Army", "San Juan", "PR", "fort-buchanan"),
  base("Fort Lee", "Army", "Petersburg", "VA", "fort-lee"),
  base("Camp Humphreys", "Army", "Pyeongtaek", "KR", "camp-humphreys"),

  // ═══════════════════════════════════════════
  // AIR FORCE
  // ═══════════════════════════════════════════
  base("Eglin AFB", "Air Force", "Valparaiso", "FL", "eglin-afb"),
  base("Tyndall AFB", "Air Force", "Panama City", "FL", "tyndall-afb"),
  base("Travis AFB", "Air Force", "Fairfield", "CA", "travis-afb"),
  base("Beale AFB", "Air Force", "Marysville", "CA", "beale-afb"),
  base("Edwards AFB", "Air Force", "Edwards", "CA", "edwards-afb"),
  base(
    "Davis-Monthan AFB",
    "Air Force",
    "Tucson",
    "AZ",
    "davis-monthan-afb"
  ),
  base("Dover AFB", "Air Force", "Dover", "DE", "dover-afb"),
  base(
    "Joint Base Charleston",
    "Air Force",
    "Charleston",
    "SC",
    "joint-base-charleston"
  ),
  base(
    "Joint Base Anacostia-Bolling",
    "Air Force",
    "Washington",
    "DC",
    "joint-base-anacostia-bolling"
  ),
  base("Scott AFB", "Air Force", "Belleville", "IL", "scott-afb"),
  base("Tinker AFB", "Air Force", "Oklahoma City", "OK", "tinker-afb"),
  base("Altus AFB", "Air Force", "Altus", "OK", "altus-afb"),
  base("Vance AFB", "Air Force", "Enid", "OK", "vance-afb"),
  base("Barksdale AFB", "Air Force", "Bossier City", "LA", "barksdale-afb"),
  base("Columbus AFB", "Air Force", "Columbus", "MS", "columbus-afb"),
  base(
    "Seymour Johnson AFB",
    "Air Force",
    "Goldsboro",
    "NC",
    "seymour-johnson-afb"
  ),
  base("Shaw AFB", "Air Force", "Sumter", "SC", "shaw-afb"),
  base("Dyess AFB", "Air Force", "Abilene", "TX", "dyess-afb"),
  base("Sheppard AFB", "Air Force", "Wichita Falls", "TX", "sheppard-afb"),
  base("Goodfellow AFB", "Air Force", "San Angelo", "TX", "goodfellow-afb"),
  base("Cannon AFB", "Air Force", "Clovis", "NM", "cannon-afb"),
  base("Whiteman AFB", "Air Force", "Knob Noster", "MO", "whiteman-afb"),
  base("Ellsworth AFB", "Air Force", "Rapid City", "SD", "ellsworth-afb"),
  base("Fairchild AFB", "Air Force", "Spokane", "WA", "fairchild-afb"),
  base("Warren AFB", "Air Force", "Cheyenne", "WY", "warren-afb"),
  base("USAF Academy", "Air Force", "Colorado Springs", "CO", "usaf-academy"),
  base(
    "Wright-Patterson AFB",
    "Air Force",
    "Dayton",
    "OH",
    "wright-patterson-afb"
  ),
  base(
    "Joint Base San Antonio",
    "Air Force",
    "San Antonio",
    "TX",
    "joint-base-san-antonio"
  ),
  base(
    "Joint Base Langley-Eustis",
    "Air Force",
    "Hampton",
    "VA",
    "joint-base-langley-eustis"
  ),
  base(
    "Joint Base McGuire-Dix-Lakehurst",
    "Air Force",
    "Trenton",
    "NJ",
    "joint-base-mcguire-dix-lakehurst"
  ),
  base("Hurlburt Field", "Air Force", "Mary Esther", "FL", "hurlburt-field"),
  base("MacDill AFB", "Air Force", "Tampa", "FL", "macdill-afb"),
  base("Moody AFB", "Air Force", "Valdosta", "GA", "moody-afb"),
  base("Robins AFB", "Air Force", "Warner Robins", "GA", "robins-afb"),
  base("Mountain Home AFB", "Air Force", "Mountain Home", "ID", "mountain-home-afb"),
  base("McConnell AFB", "Air Force", "Wichita", "KS", "mcconnell-afb"),
  base("Hanscom AFB", "Air Force", "Bedford", "MA", "hanscom-afb"),
  base("Malmstrom AFB", "Air Force", "Great Falls", "MT", "malmstrom-afb"),
  base("Offutt AFB", "Air Force", "Bellevue", "NE", "offutt-afb"),
  base("Nellis AFB", "Air Force", "Las Vegas", "NV", "nellis-afb"),
  base("Creech AFB", "Air Force", "Indian Springs", "NV", "creech-afb"),
  base("Holloman AFB", "Air Force", "Alamogordo", "NM", "holloman-afb"),
  base("Kirtland AFB", "Air Force", "Albuquerque", "NM", "kirtland-afb"),
  base("Minot AFB", "Air Force", "Minot", "ND", "minot-afb"),
  base("Grand Forks AFB", "Air Force", "Grand Forks", "ND", "grand-forks-afb"),
  base("Little Rock AFB", "Air Force", "Jacksonville", "AR", "little-rock-afb"),
  base("Laughlin AFB", "Air Force", "Del Rio", "TX", "laughlin-afb"),
  base("Luke AFB", "Air Force", "Glendale", "AZ", "luke-afb"),
  base("Hill AFB", "Air Force", "Ogden", "UT", "hill-afb"),
  base("Joint Base Pearl Harbor-Hickam", "Air Force", "Honolulu", "HI", "joint-base-pearl-harbor-hickam"),
  base("Joint Base Elmendorf-Richardson", "Air Force", "Anchorage", "AK", "joint-base-elmendorf-richardson"),
  base("Eielson AFB", "Air Force", "Fairbanks", "AK", "eielson-afb"),
  base("Keesler AFB", "Air Force", "Biloxi", "MS", "keesler-afb"),
  base("Maxwell AFB", "Air Force", "Montgomery", "AL", "maxwell-afb"),
  base("Arnold AFB", "Air Force", "Tullahoma", "TN", "arnold-afb"),

  // ═══════════════════════════════════════════
  // NAVY
  // ═══════════════════════════════════════════
  base(
    "Naval Station Norfolk",
    "Navy",
    "Norfolk",
    "VA",
    "naval-station-norfolk"
  ),
  base(
    "Naval Base San Diego",
    "Navy",
    "San Diego",
    "CA",
    "naval-base-san-diego"
  ),
  base(
    "Naval Base Coronado",
    "Navy",
    "San Diego",
    "CA",
    "naval-base-coronado"
  ),
  base(
    "Naval Air Station Whiting Field",
    "Navy",
    "Milton",
    "FL",
    "naval-air-station-whiting-field"
  ),
  base(
    "Naval Station Mayport",
    "Navy",
    "Jacksonville",
    "FL",
    "naval-station-mayport"
  ),
  base(
    "Naval Station Newport",
    "Navy",
    "Newport",
    "RI",
    "naval-station-newport"
  ),
  base(
    "Naval Station Great Lakes",
    "Navy",
    "North Chicago",
    "IL",
    "naval-station-great-lakes"
  ),
  base("Naval Base Kitsap", "Navy", "Bremerton", "WA", "naval-base-kitsap"),
  base(
    "Naval Air Station Corpus Christi",
    "Navy",
    "Corpus Christi",
    "TX",
    "naval-air-station-corpus-christi"
  ),
  base(
    "Naval Weapons Station Seal Beach",
    "Navy",
    "Seal Beach",
    "CA",
    "naval-weapons-station-seal-beach"
  ),
  base(
    "Naval Base Ventura County",
    "Navy",
    "Oxnard",
    "CA",
    "naval-base-ventura-county"
  ),
  base(
    "Naval Air Station Jacksonville",
    "Navy",
    "Jacksonville",
    "FL",
    "naval-air-station-jacksonville"
  ),
  base(
    "Naval Air Station Pensacola",
    "Navy",
    "Pensacola",
    "FL",
    "naval-air-station-pensacola"
  ),
  base(
    "Naval Air Station Oceana",
    "Navy",
    "Virginia Beach",
    "VA",
    "naval-air-station-oceana"
  ),
  base(
    "Naval Air Station Patuxent River",
    "Navy",
    "Patuxent River",
    "MD",
    "naval-air-station-patuxent-river"
  ),
  base(
    "Naval Air Station Lemoore",
    "Navy",
    "Lemoore",
    "CA",
    "naval-air-station-lemoore"
  ),
  base(
    "Naval Air Station Fallon",
    "Navy",
    "Fallon",
    "NV",
    "naval-air-station-fallon"
  ),
  base(
    "Naval Air Station Meridian",
    "Navy",
    "Meridian",
    "MS",
    "naval-air-station-meridian"
  ),
  base(
    "Naval Air Station Kingsville",
    "Navy",
    "Kingsville",
    "TX",
    "naval-air-station-kingsville"
  ),
  base(
    "Naval Submarine Base New London",
    "Navy",
    "Groton",
    "CT",
    "naval-submarine-base-new-london"
  ),
  base(
    "Naval Submarine Base Kings Bay",
    "Navy",
    "Kings Bay",
    "GA",
    "naval-submarine-base-kings-bay"
  ),
  base(
    "Naval Support Activity Bethesda",
    "Navy",
    "Bethesda",
    "MD",
    "naval-support-activity-bethesda"
  ),
  base("Naval Station Rota", "Navy", "Rota", "ES", "naval-station-rota"),
  base("Naval Base Guam", "Navy", "Santa Rita", "GU", "naval-base-guam"),
  base("Naval Station Everett", "Navy", "Everett", "WA", "naval-station-everett"),
  base("NAS North Island", "Navy", "San Diego", "CA", "nas-north-island"),
  base("NSA Hampton Roads", "Navy", "Norfolk", "VA", "nsa-hampton-roads"),
  base("Naval Air Weapons Station China Lake", "Navy", "Ridgecrest", "CA", "naval-air-weapons-station-china-lake"),
  base("NSA Annapolis", "Navy", "Annapolis", "MD", "nsa-annapolis"),
  base("NSA Mid-South", "Navy", "Millington", "TN", "nsa-mid-south"),
  base("NSA Crane", "Navy", "Crane", "IN", "nsa-crane"),
  base("NSA Washington", "Navy", "Washington", "DC", "nsa-washington"),

  // ═══════════════════════════════════════════
  // MARINE CORPS
  // ═══════════════════════════════════════════
  base(
    "Camp Pendleton",
    "Marine Corps",
    "Oceanside",
    "CA",
    "camp-pendleton"
  ),
  base(
    "Camp Lejeune",
    "Marine Corps",
    "Jacksonville",
    "NC",
    "camp-lejeune"
  ),
  base("MCRD San Diego", "Marine Corps", "San Diego", "CA", "mcrd-san-diego"),
  base(
    "MCRD Parris Island",
    "Marine Corps",
    "Beaufort",
    "SC",
    "mcrd-parris-island"
  ),
  base("MCB Quantico", "Marine Corps", "Quantico", "VA", "mcb-quantico"),
  base(
    "MCAS Cherry Point",
    "Marine Corps",
    "Havelock",
    "NC",
    "mcas-cherry-point"
  ),
  base(
    "MCAS Beaufort",
    "Marine Corps",
    "Beaufort",
    "SC",
    "mcas-beaufort"
  ),
  base("MCLB Albany", "Marine Corps", "Albany", "GA", "mclb-albany"),
  base("MCLB Barstow", "Marine Corps", "Barstow", "CA", "mclb-barstow"),
  base(
    "MCB Camp Butler",
    "Marine Corps",
    "Okinawa",
    "JP",
    "mcb-camp-butler"
  ),
  base(
    "MCAGCC Twentynine Palms",
    "Marine Corps",
    "Twentynine Palms",
    "CA",
    "mcagcc-twentynine-palms"
  ),
  base("MCAS Miramar", "Marine Corps", "San Diego", "CA", "mcas-miramar"),
  base("MCAS Yuma", "Marine Corps", "Yuma", "AZ", "mcas-yuma"),
  base("MCAS New River", "Marine Corps", "Jacksonville", "NC", "mcas-new-river"),
  base("Camp Smith", "Marine Corps", "Aiea", "HI", "camp-smith"),
  base("Marine Barracks Washington", "Marine Corps", "Washington", "DC", "marine-barracks-washington"),

  // ═══════════════════════════════════════════
  // COAST GUARD
  // ═══════════════════════════════════════════
  base(
    "USCG Training Center Cape May",
    "Coast Guard",
    "Cape May",
    "NJ",
    "uscg-training-center-cape-may"
  ),
  base(
    "USCG Academy",
    "Coast Guard",
    "New London",
    "CT",
    "uscg-academy"
  ),
  base(
    "USCG Air Station Clearwater",
    "Coast Guard",
    "Clearwater",
    "FL",
    "uscg-air-station-clearwater"
  ),
  base(
    "USCG Air Station Elizabeth City",
    "Coast Guard",
    "Elizabeth City",
    "NC",
    "uscg-air-station-elizabeth-city"
  ),
  base(
    "USCG Base Alameda",
    "Coast Guard",
    "Alameda",
    "CA",
    "uscg-base-alameda"
  ),
  base("USCG Base Boston", "Coast Guard", "Boston", "MA", "uscg-base-boston"),
  base("USCG Base Kodiak", "Coast Guard", "Kodiak", "AK", "uscg-base-kodiak"),
  base("USCG Base Honolulu", "Coast Guard", "Honolulu", "HI", "uscg-base-honolulu"),
  base("USCG Yard", "Coast Guard", "Baltimore", "MD", "uscg-yard"),
  base("USCG Training Center Yorktown", "Coast Guard", "Yorktown", "VA", "uscg-training-center-yorktown"),
  base("USCG Base Seattle", "Coast Guard", "Seattle", "WA", "uscg-base-seattle"),
  base("USCG Base Miami", "Coast Guard", "Miami Beach", "FL", "uscg-base-miami"),
  base("USCG Base Portsmouth", "Coast Guard", "Portsmouth", "VA", "uscg-base-portsmouth"),
  base("USCG Air Station Savannah", "Coast Guard", "Savannah", "GA", "uscg-air-station-savannah"),
  base("USCG Air Station Houston", "Coast Guard", "Houston", "TX", "uscg-air-station-houston"),
  base("USCG Air Station San Francisco", "Coast Guard", "San Francisco", "CA", "uscg-air-station-san-francisco"),
  base("USCG Air Station Traverse City", "Coast Guard", "Traverse City", "MI", "uscg-air-station-traverse-city"),

  // ═══════════════════════════════════════════
  // SPACE FORCE
  // ═══════════════════════════════════════════
  base(
    "Peterson SFB",
    "Space Force",
    "Colorado Springs",
    "CO",
    "peterson-sfb"
  ),
  base("Buckley SFB", "Space Force", "Aurora", "CO", "buckley-sfb"),
  base(
    "Schriever SFB",
    "Space Force",
    "Colorado Springs",
    "CO",
    "schriever-sfb"
  ),
  base("Patrick SFB", "Space Force", "Cocoa Beach", "FL", "patrick-sfb"),
  base("Vandenberg SFB", "Space Force", "Lompoc", "CA", "vandenberg-sfb"),
  base(
    "Los Angeles SFB",
    "Space Force",
    "El Segundo",
    "CA",
    "los-angeles-sfb"
  ),
  base("Cape Canaveral SFS", "Space Force", "Cape Canaveral", "FL", "cape-canaveral-sfs"),

  // ═══════════════════════════════════════════
  // ADDITIONAL ARMY INSTALLATIONS
  // ═══════════════════════════════════════════
  base("Fort Hood", "Army", "Killeen", "TX", "fort-hood"),
  base("Fort Bragg", "Army", "Fayetteville", "NC", "fort-bragg"),
  base("Fort Benning", "Army", "Columbus", "GA", "fort-benning"),
  base("Fort Gordon", "Army", "Augusta", "GA", "fort-gordon"),
  base("Fort Polk", "Army", "Leesville", "LA", "fort-polk"),
  base("Camp Zama", "Army", "Zama", "JP", "camp-zama"),
  base("USAG Bavaria", "Army", "Grafenwoehr", "DE", "usag-bavaria"),
  base("USAG Wiesbaden", "Army", "Wiesbaden", "DE", "usag-wiesbaden"),
  base("USAG Rheinland-Pfalz", "Army", "Kaiserslautern", "DE", "usag-rheinland-pfalz"),
  base("USAG Italy", "Army", "Vicenza", "IT", "usag-italy"),
  base("Camp Casey", "Army", "Dongducheon", "KR", "camp-casey"),
  base("Camp Walker", "Army", "Daegu", "KR", "camp-walker"),
  base("Fort Sam Houston", "Army", "San Antonio", "TX", "fort-sam-houston"),
  base("Camp Arifjan", "Army", "Camp Arifjan", "KW", "camp-arifjan"),
  base("Fort Novosel", "Army", "Enterprise", "AL", "fort-novosel"),
  base("Presidio of Monterey", "Army", "Monterey", "CA", "presidio-of-monterey"),
  base("Fort Hunter Liggett", "Army", "Jolon", "CA", "fort-hunter-liggett"),
  base("Camp Parks", "Army", "Dublin", "CA", "camp-parks"),
  base("Fort Dix", "Army", "Trenton", "NJ", "fort-dix"),
  base("Camp Atterbury", "Army", "Edinburgh", "IN", "camp-atterbury"),
  base("Camp Shelby", "Army", "Hattiesburg", "MS", "camp-shelby"),
  base("Camp Ripley", "Army", "Little Falls", "MN", "camp-ripley"),
  base("Camp Beauregard", "Army", "Pineville", "LA", "camp-beauregard"),
  base("Camp Roberts", "Army", "San Miguel", "CA", "camp-roberts"),
  base("Fort Indiantown Gap", "Army", "Annville", "PA", "fort-indiantown-gap"),
  base("Camp Williams", "Army", "Bluffdale", "UT", "camp-williams"),
  base("Camp Edwards", "Army", "Bourne", "MA", "camp-edwards"),

  // ═══════════════════════════════════════════
  // ADDITIONAL AIR FORCE / JOINT BASES
  // ═══════════════════════════════════════════
  base("Ramstein AB", "Air Force", "Kaiserslautern", "DE", "ramstein-ab"),
  base("Spangdahlem AB", "Air Force", "Spangdahlem", "DE", "spangdahlem-ab"),
  base("RAF Lakenheath", "Air Force", "Brandon", "GB", "raf-lakenheath"),
  base("RAF Mildenhall", "Air Force", "Mildenhall", "GB", "raf-mildenhall"),
  base("Aviano AB", "Air Force", "Aviano", "IT", "aviano-ab"),
  base("Incirlik AB", "Air Force", "Adana", "TR", "incirlik-ab"),
  base("Osan AB", "Air Force", "Pyeongtaek", "KR", "osan-ab"),
  base("Kunsan AB", "Air Force", "Gunsan", "KR", "kunsan-ab"),
  base("Kadena AB", "Air Force", "Okinawa", "JP", "kadena-ab"),
  base("Misawa AB", "Air Force", "Misawa", "JP", "misawa-ab"),
  base("Yokota AB", "Air Force", "Fussa", "JP", "yokota-ab"),
  base("Andersen AFB", "Air Force", "Yigo", "GU", "andersen-afb"),
  base("Al Udeid AB", "Air Force", "Al Udeid", "QA", "al-udeid-ab"),
  base("Thule AB", "Air Force", "Thule", "GL", "thule-ab"),
  base("Lajes Field", "Air Force", "Terceira", "PT", "lajes-field"),

  // ═══════════════════════════════════════════
  // ADDITIONAL NAVY INSTALLATIONS
  // ═══════════════════════════════════════════
  base("Naval Support Activity Naples", "Navy", "Naples", "IT", "nsa-naples"),
  base("Naval Station Sigonella", "Navy", "Sigonella", "IT", "naval-station-sigonella"),
  base("Fleet Activities Yokosuka", "Navy", "Yokosuka", "JP", "fleet-activities-yokosuka"),
  base("Fleet Activities Sasebo", "Navy", "Sasebo", "JP", "fleet-activities-sasebo"),
  base("Commander Fleet Activities Chinhae", "Navy", "Chinhae", "KR", "commander-fleet-activities-chinhae"),
  base("Naval Support Activity Bahrain", "Navy", "Manama", "BH", "nsa-bahrain"),
  base("NSA Souda Bay", "Navy", "Souda Bay", "GR", "nsa-souda-bay"),
  base("Naval Station Guantanamo Bay", "Navy", "Guantanamo Bay", "CU", "naval-station-guantanamo-bay"),

  // ═══════════════════════════════════════════
  // ADDITIONAL DLA / DEFENSE INSTALLATIONS
  // ═══════════════════════════════════════════
  base("Defense Supply Center Richmond", "Army", "Richmond", "VA", "defense-supply-center-richmond"),
  base("Defense Supply Center Columbus", "Army", "Columbus", "OH", "defense-supply-center-columbus"),
  base("Defense Distribution Center Susquehanna", "Army", "New Cumberland", "PA", "defense-distribution-center-susquehanna"),
  base("Tobyhanna Army Depot", "Army", "Tobyhanna", "PA", "tobyhanna-army-depot"),
  base("Letterkenny Army Depot", "Army", "Chambersburg", "PA", "letterkenny-army-depot"),
  base("Corpus Christi Army Depot", "Army", "Corpus Christi", "TX", "corpus-christi-army-depot"),
  base("Sierra Army Depot", "Army", "Herlong", "CA", "sierra-army-depot"),
  base("Blue Grass Army Depot", "Army", "Richmond", "KY", "blue-grass-army-depot"),
  base("Anniston Army Depot", "Army", "Anniston", "AL", "anniston-army-depot"),
  base("Pine Bluff Arsenal", "Army", "Pine Bluff", "AR", "pine-bluff-arsenal"),
  base("Watervliet Arsenal", "Army", "Watervliet", "NY", "watervliet-arsenal"),
  base("Tooele Army Depot", "Army", "Tooele", "UT", "tooele-army-depot"),
  base("Camp Dodge", "Army", "Johnston", "IA", "camp-dodge"),
  base("Camp Grayling", "Army", "Grayling", "MI", "camp-grayling"),
  base("Camp Swift", "Army", "Bastrop", "TX", "camp-swift"),
  base("Camp Blanding", "Army", "Starke", "FL", "camp-blanding"),
  base("Camp Bullis", "Army", "San Antonio", "TX", "camp-bullis"),
  base("Camp Dawson", "Army", "Kingwood", "WV", "camp-dawson"),
  base("Camp Gruber", "Army", "Braggs", "OK", "camp-gruber"),
  base("Camp Guernsey", "Army", "Guernsey", "WY", "camp-guernsey"),
  base("Camp Navajo", "Army", "Bellemont", "AZ", "camp-navajo"),
  base("Camp Robinson", "Army", "North Little Rock", "AR", "camp-robinson"),
  base("Camp San Luis Obispo", "Army", "San Luis Obispo", "CA", "camp-san-luis-obispo"),
  base("Fort Chaffee", "Army", "Fort Smith", "AR", "fort-chaffee"),
  base("Fort Custer", "Army", "Augusta", "MI", "fort-custer"),
  base("Fort Pickett", "Army", "Blackstone", "VA", "fort-pickett"),

  // ═══════════════════════════════════════════
  // ADDITIONAL NAVY/MARINE INSTALLATIONS
  // ═══════════════════════════════════════════
  base("NSWC Dahlgren", "Navy", "Dahlgren", "VA", "nswc-dahlgren"),
  base("NSWC Carderock", "Navy", "Bethesda", "MD", "nswc-carderock"),
  base("NSWC Indian Head", "Navy", "Indian Head", "MD", "nswc-indian-head"),
  base("NSWC Panama City", "Navy", "Panama City", "FL", "nswc-panama-city"),
  base("NSWC Port Hueneme", "Navy", "Port Hueneme", "CA", "nswc-port-hueneme"),
  base("NWS Earle", "Navy", "Colts Neck", "NJ", "nws-earle"),
  base("NWS Yorktown", "Navy", "Yorktown", "VA", "nws-yorktown"),
  base("Naval Air Facility El Centro", "Navy", "El Centro", "CA", "naval-air-facility-el-centro"),
  base("Naval Construction Battalion Center Gulfport", "Navy", "Gulfport", "MS", "ncbc-gulfport"),
  base("Naval Weapons Station Charleston", "Navy", "Goose Creek", "SC", "nws-charleston"),
  base("Camp Mujuk", "Marine Corps", "Pohang", "KR", "camp-mujuk"),
  base("MCAS Iwakuni", "Marine Corps", "Iwakuni", "JP", "mcas-iwakuni"),
  base("MCB Hawaii", "Marine Corps", "Kaneohe Bay", "HI", "mcb-hawaii"),
];

// ─── Geocoding helper (Nominatim — no API key needed) ───────────────
async function geocode(
  city: string,
  state: string
): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${city}, ${state}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "PCSing.ai Seed Script (dev@pcsing.ai)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  // De-duplicate within array (keep first occurrence of each slug)
  const seen = new Set<string>();
  const uniqueBases = BASES.filter((b) => {
    if (seen.has(b.slug)) return false;
    seen.add(b.slug);
    return true;
  });

  console.log(`Seeding ${uniqueBases.length} unique bases...\n`);

  // 1. Fetch existing slugs so we can skip duplicates
  const { data: existing } = await supabase
    .from("bases")
    .select("slug");
  const existingSlugs = new Set((existing || []).map((b) => b.slug));

  const toInsert = uniqueBases.filter((b) => !existingSlugs.has(b.slug));
  const skipped = BASES.length - toInsert.length;

  if (skipped > 0) {
    console.log(`Skipping ${skipped} bases that already exist.`);
  }

  if (toInsert.length === 0) {
    console.log("No new bases to insert.");
  } else {
    // Insert in batches of 50
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const { error } = await supabase.from("bases").insert(batch);
      if (error) {
        console.error(`Error inserting batch at offset ${i}:`, error.message);
      } else {
        inserted += batch.length;
        console.log(
          `  Inserted ${inserted}/${toInsert.length} bases...`
        );
      }
    }
    console.log(`\nInserted ${inserted} new bases.\n`);
  }

  // 2. Geocode bases missing lat/lng
  console.log("Geocoding bases with missing coordinates...\n");

  const { data: allBases } = await supabase
    .from("bases")
    .select("id, name, city, state, lat, lng")
    .order("name");

  const needsGeocode = (allBases || []).filter(
    (b) => b.lat == null || b.lng == null
  );

  if (needsGeocode.length === 0) {
    console.log("All bases already have coordinates.");
  } else {
    console.log(`${needsGeocode.length} bases need geocoding.\n`);

    let geocoded = 0;
    let failed = 0;

    for (const base of needsGeocode) {
      const coords = await geocode(base.city, base.state);
      if (coords) {
        const { error } = await supabase
          .from("bases")
          .update({ lat: coords.lat, lng: coords.lng })
          .eq("id", base.id);
        if (error) {
          console.error(`  Failed to update ${base.name}: ${error.message}`);
          failed++;
        } else {
          geocoded++;
          if (geocoded % 10 === 0) {
            console.log(`  Geocoded ${geocoded}/${needsGeocode.length}...`);
          }
        }
      } else {
        console.warn(`  Could not geocode: ${base.name} (${base.city}, ${base.state})`);
        failed++;
      }

      // Nominatim rate limit: max 1 request/second
      await sleep(1100);
    }

    console.log(
      `\nGeocoding complete: ${geocoded} succeeded, ${failed} failed.`
    );
  }

  // 3. Summary
  const { count } = await supabase
    .from("bases")
    .select("*", { count: "exact", head: true });

  console.log(`\nTotal bases in database: ${count}`);
  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
