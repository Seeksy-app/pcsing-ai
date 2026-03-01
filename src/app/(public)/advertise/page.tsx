import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise with PCSing.us — Reach Military Families",
  description:
    "Reach military families during their PCS moves. Advertise your business on PCSing.us — the #1 AI-powered PCS resource.",
};

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Advertise with PCSing.us</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Reach thousands of military families actively planning their next PCS
        move.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Our Audience</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Active duty service members & families</li>
            <li>Guard & Reserve members</li>
            <li>Military-connected realtors & businesses</li>
            <li>High-intent visitors planning a move</li>
          </ul>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Ad Placements</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Header banner (728x90)</li>
            <li>Sidebar display (300x250)</li>
            <li>In-content native ads</li>
            <li>Base page sponsorships</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Interested in advertising?
        </h2>
        <p className="text-gray-600 mb-6">
          Contact us for rate cards, audience demographics, and custom
          partnership opportunities.
        </p>
        <a
          href="mailto:ads@pcsing.us"
          className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-block"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
