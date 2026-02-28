import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AskAboutBase } from "@/components/AskAboutBase";

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
    title: base.seo_title || `${base.name} PCS Guide | PCSing.ai`,
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

  // Group resources by category
  const grouped = (resources || []).reduce(
    (acc: Record<string, typeof resources>, r) => {
      if (!r) return acc;
      const cat = r.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(r);
      return acc;
    },
    {}
  );

  // Fetch local (off-base) resources
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

  const mapQuery = encodeURIComponent(
    base.address
      ? `${base.name}, ${base.address}`
      : `${base.name}, ${base.city}, ${base.state}`
  );

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
          {base.city}, {base.state}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Map Embed */}
          <section>
            <div className="rounded-xl overflow-hidden border">
              <iframe
                title={`Map of ${base.name}`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              />
            </div>
          </section>

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Overview
            </h2>
            {base.description ? (
              <p className="text-gray-700 leading-relaxed">{base.description}</p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-gray-600">
                <p>
                  {base.name} is a {base.branch} installation located in{" "}
                  {base.city}, {base.state}. This page will be updated with
                  detailed information about the base, including mission,
                  history, and key facilities.
                </p>
              </div>
            )}
          </section>

          {/* Housing & BAH */}
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
                  BAH rates for the {base.city}, {base.state} area vary by pay
                  grade and dependency status. Check the{" "}
                  <Link href="/entitlements" className="text-blue-600 hover:underline">
                    Entitlements page
                  </Link>{" "}
                  or ask our AI assistant for personalized BAH estimates.
                </p>
              </div>
            )}
          </section>

          {/* Ad between sections */}
          <AdSlot zone="base-content" className="py-2" />

          {/* Base Resources */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Installation Resources
            </h2>
            {Object.keys(grouped).length > 0 ? (
              <div className="space-y-5">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      {category.replace(/-/g, " ")}
                    </h3>
                    {items?.map((resource) => (
                      <div
                        key={resource.id}
                        className="bg-white border rounded-lg p-4 mb-2"
                      >
                        <div className="font-medium">{resource.name}</div>
                        {resource.description && (
                          <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                        )}
                        {resource.phone && (
                          <p className="text-sm text-gray-600 mt-1">
                            <a href={`tel:${resource.phone}`} className="text-blue-600">
                              {resource.phone}
                            </a>
                          </p>
                        )}
                        {resource.address && (
                          <p className="text-sm text-gray-500">{resource.address}</p>
                        )}
                        {resource.hours && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium text-gray-600">Hours:</span> {resource.hours}
                          </p>
                        )}
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-block mt-1"
                          >
                            Visit Website &rarr;
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-gray-600">
                <p>
                  Installation resources at {base.name} include commissary, exchange
                  (BX/PX/NEX), MWR facilities, fitness centers, and community
                  services. Detailed resource listings will be added soon.
                </p>
              </div>
            )}
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
                The {base.city}, {base.state} area has plenty to offer military
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
        <aside className="space-y-6">
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
                <dd className="font-medium">{base.state}</dd>
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
          </div>

          {/* Sidebar Ad */}
          <AdSlot zone="base-sidebar" />
        </aside>
      </div>
    </div>
  );
}
