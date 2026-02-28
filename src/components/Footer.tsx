import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            PCSing<span className="text-blue-400">.ai</span>
          </h3>
          <p className="text-sm">
            AI-powered PCS assistance for military families. Plan smarter moves.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
          <div className="space-y-2 text-sm">
            <Link href="/bases" className="block hover:text-white transition">
              Base Directory
            </Link>
            <Link href="/guide" className="block hover:text-white transition">
              PCS Guide
            </Link>
            <Link
              href="/checklist"
              className="block hover:text-white transition"
            >
              Checklist
            </Link>
            <Link
              href="/entitlements"
              className="block hover:text-white transition"
            >
              Entitlements
            </Link>
            <Link href="/blog" className="block hover:text-white transition">
              Blog
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
          <div className="space-y-2 text-sm">
            <Link
              href="/advertise"
              className="block hover:text-white transition"
            >
              Advertise
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        &copy; {new Date().getFullYear()} PCSing.ai. All rights reserved.
      </div>
    </footer>
  );
}
