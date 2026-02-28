import Link from "next/link";

type BaseCardProps = {
  base: {
    id: string;
    name: string;
    slug: string;
    branch: string;
    city: string;
    state: string;
    image_url?: string | null;
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
      className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition group"
    >
      {base.image_url ? (
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${base.image_url})` }}
        />
      ) : (
        <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-4xl text-blue-400">
            {base.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold group-hover:text-blue-700 transition">
          {base.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {base.city}, {base.state}
        </p>
        <span
          className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${branchColors[base.branch] || "bg-gray-100 text-gray-700"}`}
        >
          {base.branch}
        </span>
      </div>
    </Link>
  );
}
