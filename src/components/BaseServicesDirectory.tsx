"use client";

import { useState } from "react";

type Resource = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  hours?: string | null;
};

const SERVICE_CATEGORIES = [
  { key: "in-processing", label: "In-Processing / Welcome Center" },
  { key: "housing", label: "Housing Office" },
  { key: "efmp", label: "EFMP (Exceptional Family Member Program)" },
  { key: "commissary", label: "Commissary" },
  { key: "exchange", label: "Exchange (PX/BX/NEX)" },
  { key: "medical", label: "Medical / Hospital" },
  { key: "dental", label: "Dental Clinic" },
  { key: "childcare", label: "Childcare / CDC" },
  { key: "legal", label: "Legal (JAG)" },
  { key: "finance", label: "Finance Office" },
  { key: "chapel", label: "Chapel" },
  { key: "mwr", label: "MWR / Fitness" },
  { key: "transportation", label: "Transportation (TMO/PPO)" },
  { key: "veterinary", label: "Veterinary" },
  { key: "id-card", label: "ID Card / DEERS" },
];

export function BaseServicesDirectory({
  resources,
}: {
  resources: Resource[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Group resources by category
  const byCategory: Record<string, Resource[]> = {};
  for (const r of resources) {
    const cat = r.category || "other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(r);
  }

  return (
    <div className="space-y-2">
      {SERVICE_CATEGORIES.map(({ key, label }) => {
        const items = byCategory[key] || [];
        const isOpen = expanded.has(key);
        const hasData = items.length > 0;

        return (
          <div key={key} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{label}</span>
                {hasData && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t px-4 py-3 bg-gray-50">
                {hasData ? (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4 border">
                        <div className="font-medium text-sm">{item.name}</div>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          {item.phone && (
                            <p className="text-sm text-gray-600">
                              <span className="text-gray-400 mr-1.5">Phone:</span>
                              <a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">
                                {item.phone}
                              </a>
                            </p>
                          )}
                          {item.address && (
                            <p className="text-sm text-gray-600">
                              <span className="text-gray-400 mr-1.5">Address:</span>
                              {item.address}
                            </p>
                          )}
                          {item.hours && (
                            <p className="text-sm text-gray-600">
                              <span className="text-gray-400 mr-1.5">Hours:</span>
                              {item.hours}
                            </p>
                          )}
                          {item.website && (
                            <a
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline inline-block mt-1"
                            >
                              Visit Website &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Not yet available &mdash; help us add this info
                    </p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition">
                      Submit Info
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
