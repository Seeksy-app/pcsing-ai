"use client";

import { useState, useEffect } from "react";

type TocItem = {
  id: string;
  label: string;
};

export function GuideToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const navLinks = (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={() => setMobileOpen(false)}
          className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeId === item.id
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile TOC */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between bg-white border rounded-xl px-4 py-3 text-sm font-medium text-gray-700"
        >
          <span>Table of Contents</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-2 bg-white border rounded-xl p-3">
            {navLinks}
          </div>
        )}
      </div>

      {/* Desktop TOC (sticky sidebar) */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-3">
            Table of Contents
          </p>
          {navLinks}
        </div>
      </aside>
    </>
  );
}
