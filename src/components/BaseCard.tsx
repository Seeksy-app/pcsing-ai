import Link from "next/link";

type BaseCardProps = {
  base: {
    id: string;
    name: string;
    slug: string;
    branch: string;
    city: string;
    state: string;
    state_full: string;
    phone?: string | null;
    address?: string | null;
    population?: number | null;
    website?: string | null;
  };
};

const branchColors: Record<string, string> = {
  Army: "bg-green-100 text-green-800",
  Navy: "bg-blue-100 text-blue-800",
  "Air Force": "bg-sky-100 text-sky-800",
  "Marine Corps": "bg-red-100 text-red-800",
  "Coast Guard": "bg-orange-100 text-orange-800",
  "Space Force": "bg-indigo-100 text-indigo-800",
};

export function BaseCard({ base }: BaseCardProps) {
  return (
    <Link
      href={`/bases/${base.slug}`}
      className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition group p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition leading-snug">
          {base.name}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${branchColors[base.branch] || "bg-gray-100 text-gray-700"}`}
        >
          {base.branch}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        {base.city}, {base.state_full}
      </p>

      <div className="space-y-1.5 text-sm text-gray-500">
        {base.address && (
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="line-clamp-2">{base.address}</span>
          </div>
        )}
        {base.phone && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>{base.phone}</span>
          </div>
        )}
        {base.population && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span>Pop. {base.population.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
