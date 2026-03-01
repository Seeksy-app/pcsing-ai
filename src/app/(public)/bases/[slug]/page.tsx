import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AskAboutBase } from "@/components/AskAboutBase";
import { BaseServicesDirectory } from "@/components/BaseServicesDirectory";
import { BaseMap } from "@/components/BaseMap";
import { ReadMore } from "@/components/ReadMore";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const branchColors: Record<string, string> = {
  Army: "bg-green-100 text-green-800",
  Navy: "bg-blue-100 text-blue-800",
  "Air Force": "bg-sky-100 text-sky-800",
  "Marine Corps": "bg-red-100 text-red-800",
  "Coast Guard": "bg-orange-100 text-orange-800",
  "Space Force": "bg-indigo-100 text-indigo-800",
};

type CostOfLiving = {
  description?: string;
  avg_household_income?: string;
  avg_home_price?: string;
  avg_rent_1br?: string;
  avg_rent_2br?: string;
  avg_rent_3br?: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: base } = await supabase
    .from("bases")
    .select("name, seo_title, seo_description")
    .eq("slug", slug)
    .single();

  if (!base) return { title: "Base Not Found" };

  return {
    title: base.seo_title || `${base.name} PCS Guide | PCSing.us`,
    description:
      base.seo_description ||
      `Everything you need to know about a ${base.name} PCS move — housing, BAH rates, schools, medical, and local resources.`,
  };
}

export default async function BasePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: base } = await supabase
    .from("bases")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!base) notFound();

  const { data: resources } = await supabase
    .from("base_resources")
    .select("*")
    .eq("base_id", base.id)
    .order("category")
    .order("sort_order");

  const { data: localResources } = await supabase
    .from("base_local_resources")
    .select("*")
    .eq("base_id", base.id)
    .order("category")
    .order("rating", { ascending: false });

  const localGrouped = (localResources || []).reduce(
    (acc: Record<string, typeof localResources>, r) => {
      if (!r) return acc;
      const cat = r.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(r);
      return acc;
    },
    {}
  );

  const { data: allBasesRaw } = await supabase
    .from("bases")
    .select("id, name, slug, lat, lng")
    .neq("slug", slug)
    .order("name");

  const allBases = (allBasesRaw || []).map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    lat: b.lat,
    lng: b.lng,
  }));

  const mapsApiKey = process.env.GOOGLE_PLACES_API_KEY || "";

  const col = base.cost_of_living as CostOfLiving | null;
  const photos = (base.photos as string[] | null) || [];
  const hasHistory = !!base.history;
  const fullOverview = [base.description, hasHistory ? base.history : null]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/bases" className="hover:text-blue-600 transition">
          Bases
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{base.name}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">{base.name}</h1>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${branchColors[base.branch] || "bg-gray-100 text-gray-700"}`}
          >
            {base.branch}
          </span>
        </div>
        <p className="text-lg text-gray-600">
          {base.city}, {base.state_full || base.state}
        </p>
      </div>

      {/* A. HERO — Map + Quick Facts sidebar */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Map Embed */}
          <BaseMap
            baseName={base.name}
            lat={base.lat}
            lng={base.lng}
            city={base.city}
            state={base.state}
            address={base.address}
            apiKey={mapsApiKey}
            allBases={allBases}
          />

          {/* B. AD BANNER — Leaderboard */}
          <AdSlot zone="base-leaderboard" className="py-2" />
          <div className="hidden [.ad-slot:empty+&]:block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-[90px] bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-400 font-medium">Advertising Partner</p>
                <Link href="/advertise" className="text-xs text-blue-500 hover:underline">Contact us</Link>
              </div>
            </div>
          </div>

          {/* C. OVERVIEW (ENHANCED) */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Overview
            </h2>
            {fullOverview ? (
              <ReadMore text={fullOverview} maxLength={250} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-gray-600">
                <p>
                  {base.name} is a {base.branch} installation located in{" "}
                  {base.city}, {base.state_full || base.state}. This page will be updated with
                  detailed information about the base, including mission,
                  history, and key facilities.
                </p>
              </div>
            )}

            {/* Weather callout */}
            {base.weather_info && (
              <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4 flex gap-3">
                <span className="text-2xl shrink-0">&#9728;&#65039;</span>
                <div>
                  <h4 className="font-semibold text-sm text-sky-900 mb-1">Weather</h4>
                  <ReadMore text={base.weather_info} maxLength={150} className="text-sm !text-sky-800" />
                </div>
              </div>
            )}
          </section>

          {/* D. COST OF LIVING */}
          {col && Object.keys(col).length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cost of Living near {base.name}
              </h2>

              {col.description && (
                <p className="text-gray-700 mb-4">{col.description}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {col.avg_household_income && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Avg. Household Income</dt>
                    <dd className="text-xl font-bold text-gray-900 mt-1">{col.avg_household_income}</dd>
                  </div>
                )}
                {col.avg_home_price && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Avg. Home Price</dt>
                    <dd className="text-xl font-bold text-gray-900 mt-1">{col.avg_home_price}</dd>
                  </div>
                )}
              </div>

              {(col.avg_rent_1br || col.avg_rent_2br || col.avg_rent_3br) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {col.avg_rent_1br && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                      <dt className="text-xs text-blue-600 font-medium uppercase">1-Bedroom</dt>
                      <dd className="text-lg font-bold text-blue-900 mt-1">{col.avg_rent_1br}<span className="text-sm font-normal text-blue-600">/mo</span></dd>
                    </div>
                  )}
                  {col.avg_rent_2br && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                      <dt className="text-xs text-blue-600 font-medium uppercase">2-Bedroom</dt>
                      <dd className="text-lg font-bold text-blue-900 mt-1">{col.avg_rent_2br}<span className="text-sm font-normal text-blue-600">/mo</span></dd>
                    </div>
                  )}
                  {col.avg_rent_3br && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                      <dt className="text-xs text-blue-600 font-medium uppercase">3-Bedroom</dt>
                      <dd className="text-lg font-bold text-blue-900 mt-1">{col.avg_rent_3br}<span className="text-sm font-normal text-blue-600">/mo</span></dd>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">Data from Military OneSource</p>
            </section>
          )}

          {/* E. PHOTO GALLERY */}
          {photos.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photos
                {photos.length > 3 && (
                  <span className="text-sm font-normal text-gray-500 ml-auto">
                    {photos.length} photos
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {photos.slice(0, 3).map((src, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${base.name} photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* F. HOUSING & BAH */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
              Housing &amp; BAH
            </h2>
            {base.bah_rates && Object.keys(base.bah_rates as object).length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-3">BAH Rates</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(base.bah_rates, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-gray-600 space-y-3">
                <p>
                  Housing options near {base.name} include on-base family
                  housing, privatized military housing, and off-base rentals in
                  the {base.city} area.
                </p>
                <p>
                  BAH rates for the {base.city}, {base.state_full || base.state} area vary by pay
                  grade and dependency status. Check the{" "}
                  <Link href="/entitlements" className="text-blue-600 hover:underline">
                    Entitlements page
                  </Link>{" "}
                  or ask our AI assistant for personalized BAH estimates.
                </p>
              </div>
            )}
            <div className="mt-3">
              <Link
                href="/tools/bah-calculator"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate your BAH
              </Link>
            </div>
          </section>

          {/* Ad between sections */}
          <AdSlot zone="base-content" className="py-2" />

          {/* G. BASE SERVICES DIRECTORY */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Base Services Directory
            </h2>
            <BaseServicesDirectory resources={resources || []} />
          </section>

          {/* Schools */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z" />
              </svg>
              Schools
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-600 space-y-3">
              <p>
                The {base.city} area offers a range of public, private, and
                DoDEA schools for military families. On-base schools (where
                available) and nearby off-base options will be listed here.
              </p>
              <p>
                Contact the School Liaison Officer (SLO) at {base.name} for help
                with school enrollment, records transfer, and special education
                services.
              </p>
            </div>
          </section>

          {/* Medical */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Medical
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-600 space-y-3">
              <p>
                {base.name} provides medical and dental care through its
                Military Treatment Facility (MTF). Services typically include
                primary care, pharmacy, immunizations, and specialty referrals
                through TRICARE.
              </p>
              <p>
                Enroll at the on-base clinic as soon as possible after arriving.
                Off-base TRICARE network providers are also available in the{" "}
                {base.city} area.
              </p>
            </div>
          </section>

          {/* Things to Do */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Things to Do
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-600 space-y-3">
              <p>
                The {base.city}, {base.state_full || base.state} area has plenty to offer military
                families — from outdoor recreation and local dining to cultural
                attractions and family-friendly activities.
              </p>
              <p>
                Check with MWR (Morale, Welfare &amp; Recreation) at{" "}
                {base.name} for discounted tickets, trips, and events
                exclusively for service members and their families.
              </p>
            </div>
          </section>

          {/* Nearby Places (from Google Places) */}
          {Object.keys(localGrouped).length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nearby Places
              </h2>
              <p className="text-gray-600 mb-4">
                Popular businesses and services near {base.name}, sorted by rating.
              </p>
              <div className="space-y-5">
                {Object.entries(localGrouped).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      {category.replace(/_/g, " ")}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {items?.map((place) => (
                        <div
                          key={place.id}
                          className="bg-white border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm">{place.name}</div>
                            {place.rating && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                {place.rating}
                              </span>
                            )}
                          </div>
                          {place.address && (
                            <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                          )}
                          {place.phone && (
                            <p className="text-xs mt-1">
                              <a href={`tel:${place.phone}`} className="text-blue-600">
                                {place.phone}
                              </a>
                            </p>
                          )}
                          {place.website && (
                            <a
                              href={place.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline inline-block mt-1"
                            >
                              Website &rarr;
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 order-first lg:order-last">
          {/* Quick Facts */}
          <div className="bg-white border rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Quick Facts</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Branch</dt>
                <dd className="font-medium">{base.branch}</dd>
              </div>
              <div>
                <dt className="text-gray-500">City</dt>
                <dd className="font-medium">{base.city}</dd>
              </div>
              <div>
                <dt className="text-gray-500">State</dt>
                <dd className="font-medium">{base.state_full || base.state}</dd>
              </div>
              {base.address && (
                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd className="font-medium">{base.address}</dd>
                </div>
              )}
              {base.phone && (
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium">
                    <a href={`tel:${base.phone}`} className="text-blue-600 hover:underline">
                      {base.phone}
                    </a>
                  </dd>
                </div>
              )}
              {base.website && (
                <div>
                  <dt className="text-gray-500">Website</dt>
                  <dd>
                    <a
                      href={base.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      Official Site &rarr;
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <hr className="my-5" />

            {/* Ask about this base */}
            <AskAboutBase baseName={base.name} />

            {/* H. AD SIDEBAR — 300x250 placeholder */}
            <div className="mt-5">
              <AdSlot zone="base-sidebar" />
              <div className="hidden [.ad-slot:empty+&]:block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-[250px] w-full bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 font-medium">Sponsor this base page</p>
                    <Link href="/advertise" className="text-xs text-blue-500 hover:underline">Learn more</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
