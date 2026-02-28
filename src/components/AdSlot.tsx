import { createClient } from "@/lib/supabase/server";

type AdSlotProps = {
  zone: string;
  className?: string;
};

export async function AdSlot({ zone, className }: AdSlotProps) {
  const supabase = await createClient();

  // Find active campaign for this zone
  const { data: zoneData } = await supabase
    .from("ad_zones")
    .select("id")
    .eq("placement", zone)
    .eq("is_active", true)
    .single();

  if (!zoneData) return null;

  const today = new Date().toISOString().split("T")[0];
  const { data: campaign } = await supabase
    .from("ad_campaigns")
    .select("id, creative_url, click_url, advertiser_name")
    .eq("zone_id", zoneData.id)
    .eq("status", "active")
    .lte("start_date", today)
    .gte("end_date", today)
    .limit(1)
    .single();

  if (!campaign || !campaign.creative_url) return null;

  return (
    <div className={`ad-slot ${className || ""}`} data-zone={zone}>
      <a
        href={campaign.click_url || "#"}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaign.creative_url}
          alt={`Ad by ${campaign.advertiser_name}`}
          className="mx-auto"
        />
      </a>
      <p className="text-[10px] text-gray-400 text-center mt-1">
        Advertisement
      </p>
    </div>
  );
}
