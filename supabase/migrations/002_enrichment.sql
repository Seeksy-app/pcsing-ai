-- PCSing.ai — Enrichment schema changes
-- Run this in Supabase SQL Editor

-- ===========================================
-- 1. ALTER bases — add new columns
-- ===========================================

ALTER TABLE bases ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE bases ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE bases ADD COLUMN IF NOT EXISTS state_full TEXT;
ALTER TABLE bases ADD COLUMN IF NOT EXISTS population INTEGER;
ALTER TABLE bases ADD COLUMN IF NOT EXISTS militaryonesource_slug TEXT;

-- ===========================================
-- 2. DROP + recreate base_resources
--    (no production data exists yet)
-- ===========================================

DROP TABLE IF EXISTS base_resources CASCADE;

CREATE TABLE base_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_id uuid NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  phone text,
  address text,
  website text,
  hours text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_base_resources_base ON base_resources(base_id);
CREATE INDEX idx_base_resources_category ON base_resources(category);

ALTER TABLE base_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read base_resources" ON base_resources FOR SELECT USING (true);
CREATE POLICY "Auth users manage base_resources" ON base_resources FOR ALL USING (auth.role() = 'authenticated');

-- ===========================================
-- 3. CREATE base_local_resources
-- ===========================================

CREATE TABLE IF NOT EXISTS base_local_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_id uuid NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  address text,
  phone text,
  website text,
  rating numeric,
  place_id text,
  lat numeric,
  lng numeric,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_base_local_base ON base_local_resources(base_id);
CREATE INDEX IF NOT EXISTS idx_base_local_category ON base_local_resources(category);

ALTER TABLE base_local_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read base_local_resources" ON base_local_resources FOR SELECT USING (true);
CREATE POLICY "Auth users manage base_local_resources" ON base_local_resources FOR ALL USING (auth.role() = 'authenticated');
