"use client";

import { useState } from "react";

type BaseOption = {
  id: string;
  name: string;
  slug: string;
  lat: number | null;
  lng: number | null;
};

type Props = {
  baseName: string;
  lat: number | null;
  lng: number | null;
  city: string;
  state: string;
  address?: string | null;
  apiKey: string;
  allBases: BaseOption[];
};

export function BaseMap({
  baseName,
  lat,
  lng,
  city,
  state,
  address,
  apiKey,
  allBases,
}: Props) {
  const [fromBaseId, setFromBaseId] = useState("");

  // Build embed URL
  let embedSrc: string;
  if (lat && lng) {
    embedSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=13`;
  } else {
    const fallbackQuery = encodeURIComponent(
      address
        ? `${baseName}, ${address}`
        : `${baseName}, ${city}, ${state}`
    );
    embedSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${fallbackQuery}&zoom=13`;
  }

  // Get Directions link (to this base)
  const directionsUrl = lat && lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${baseName}, ${city}, ${state}`)}`;

  // Directions between two bases
  const fromBase = allBases.find((b) => b.id === fromBaseId);
  let baseToBaseUrl: string | null = null;
  if (fromBase && fromBase.lat && fromBase.lng && lat && lng) {
    baseToBaseUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromBase.lat},${fromBase.lng}&destination=${lat},${lng}`;
  } else if (fromBase) {
    const originQuery = encodeURIComponent(`${fromBase.name}`);
    const destQuery = encodeURIComponent(`${baseName}, ${city}, ${state}`);
    baseToBaseUrl = `https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}`;
  }

  return (
    <section>
      <div className="rounded-xl overflow-hidden border">
        <iframe
          title={`Map of ${baseName}`}
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedSrc}
          allowFullScreen
        />
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Get Directions */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Get Directions
        </a>

        {/* Directions from another base */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-gray-500 flex-shrink-0">From:</span>
          <select
            value={fromBaseId}
            onChange={(e) => setFromBaseId(e.target.value)}
            className="flex-1 text-sm border rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
          >
            <option value="">Select a base...</option>
            {allBases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {baseToBaseUrl && (
            <a
              href={baseToBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition flex-shrink-0"
            >
              Go &rarr;
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
