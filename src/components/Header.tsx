"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const toolsLinks = [
  { label: "BAH Calculator", href: "/tools/bah-calculator" },
  { label: "PPM/DITY Calculator", href: "/tools/ppm-calculator" },
];

const navLinks = [
  { label: "Bases", href: "/bases" },
  { label: "PCS Guide", href: "/guide" },
  { label: "Checklist", href: "/checklist" },
  { label: "Entitlements", href: "/entitlements" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-900">
          PCSing<span className="text-blue-600">.ai</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-blue-700 transition"
              onClick={() => window.dispatchEvent(new CustomEvent("close-base-panel"))}
            >
              {link.label}
            </Link>
          ))}

          {/* Tools Dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="text-sm text-gray-600 hover:text-blue-700 transition flex items-center gap-1"
            >
              Tools
              <svg
                className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border rounded-xl shadow-lg py-2 z-50">
                {toolsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setToolsOpen(false); window.dispatchEvent(new CustomEvent("close-base-panel")); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t px-6 py-4 space-y-3 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-600 hover:text-blue-700 transition"
              onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent("close-base-panel")); }}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Tools
            </p>
            {toolsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-blue-700 transition py-1"
                onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent("close-base-panel")); }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
