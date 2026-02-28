import Link from "next/link";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Bases", href: "/admin/bases" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Ads", href: "/admin/ads" },
  { label: "SEO", href: "/admin/seo" },
  { label: "AI Knowledge", href: "/admin/ai" },
  { label: "Enrichment", href: "/admin/enrichment" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <Link href="/admin" className="text-xl font-bold mb-8 block">
          PCSing.ai Admin
        </Link>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            &larr; Back to site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
